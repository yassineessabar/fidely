# Wallet Pass Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add location geo-fencing, birthday campaigns, expiry reminders, and merchant custom notifications to Apple Wallet passes.

**Architecture:** Extend pass.json with `locations` and `relevantDate` fields. Add a `card_notifications` table for merchant messages. A daily Vercel Cron job processes birthdays, expiry reminders, and scheduled notifications by regenerating passes and sending APNs pushes. Geocoding uses OpenStreetMap Nominatim (free, no API key).

**Tech Stack:** Next.js API routes, Supabase (Postgres), Apple Wallet PassKit, APNs (HTTP/2), Vercel Cron, OpenStreetMap Nominatim API.

**Spec:** `docs/superpowers/specs/2026-04-17-wallet-notifications-design.md`

---

### Task 1: Database Migration — `card_notifications` table

**Files:**
- Create: `supabase/migrations/0007_card_notifications.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- Notification status and type enums
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('birthday', 'expiry', 'custom');

-- Card notifications table
CREATE TABLE public.card_notifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  type            public.notification_type NOT NULL,
  title           text NOT NULL,
  message         text,
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  recipients      integer NOT NULL DEFAULT 0,
  status          public.notification_status NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_card ON public.card_notifications(card_id);
CREATE INDEX idx_notifications_pending ON public.card_notifications(status, scheduled_at);

-- RLS
ALTER TABLE public.card_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read"
  ON public.card_notifications FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert"
  ON public.card_notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON public.card_notifications FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete"
  ON public.card_notifications FOR DELETE USING (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/0007_card_notifications.sql
git commit -m "feat: add card_notifications table migration"
```

---

### Task 2: Extend PassTemplate types with locations and relevantDate

**Files:**
- Modify: `lib/wallet/types.ts`

- [ ] **Step 1: Add location and relevantDate to PassTemplate**

Add these fields to the `PassTemplate` interface in `lib/wallet/types.ts`:

```typescript
export interface PassLocation {
  latitude: number;
  longitude: number;
  relevantText?: string;
}

export interface PassTemplate {
  // ... existing fields unchanged ...
  locations?: PassLocation[];
  relevantDate?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/wallet/types.ts
git commit -m "feat: add locations and relevantDate to PassTemplate type"
```

---

### Task 3: Update pass generation to include locations and relevantDate in pass.json

**Files:**
- Modify: `lib/wallet/generate.ts` (enrollmentToPassTemplate function)
- Modify: `lib/wallet/apple.ts` (generateApplePass function, pass.json output)

- [ ] **Step 1: Update `enrollmentToPassTemplate` in `lib/wallet/generate.ts`**

Add a new optional parameter `options` and populate locations from business_details. After the existing return statement fields (around line 210), add:

```typescript
export function enrollmentToPassTemplate(
  card: CardRow,
  enrollment: {
    id: string;
    membership_code: string;
    customer_name: string;
    stamps_collected: number;
    points_balance: number;
    auth_token: string;
  },
  options?: {
    birthdayOffer?: string;
    relevantDate?: string;
  }
): PassTemplate {
```

Before the `return` statement, build the locations array:

```typescript
  // Location geo-fence
  const locations: { latitude: number; longitude: number; relevantText?: string }[] = [];
  if (bd.latitude && bd.longitude) {
    locations.push({
      latitude: bd.latitude,
      longitude: bd.longitude,
      relevantText: `Welcome back to ${merchantName}!`,
    });
  }

  // Birthday offer override
  if (options?.birthdayOffer) {
    // Override auxiliary field with birthday offer
    if (card.type === "stamp") {
      auxiliaryFields = [
        { key: "birthday", label: "🎂 BIRTHDAY OFFER", value: options.birthdayOffer },
      ];
    } else if (card.type === "points") {
      auxiliaryFields = [{ key: "birthday", label: "🎂 BIRTHDAY OFFER", value: options.birthdayOffer }];
    }
  }
```

Add `locations` and `relevantDate` to the returned object:

```typescript
    locations: locations.length > 0 ? locations : undefined,
    relevantDate: options?.relevantDate,
```

- [ ] **Step 2: Update `generateApplePass` in `lib/wallet/apple.ts`**

In the `passJson` object (around line 908), add locations and relevantDate after the `barcodes` array:

```typescript
  if (template.locations && template.locations.length > 0) {
    passJson.locations = template.locations.map(loc => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      ...(loc.relevantText ? { relevantText: loc.relevantText } : {}),
    }));
  }

  if (template.relevantDate) {
    passJson.relevantDate = template.relevantDate;
  }
```

- [ ] **Step 3: Update the pass fetch endpoint to pass locations through**

In `app/api/passes/v1/[...path]/route.ts`, update the `enrollmentToPassTemplate` call (around line 126) — no change needed since it already passes `card` which has `business_details` with lat/long. The function will read them automatically.

- [ ] **Step 4: Commit**

```bash
git add lib/wallet/generate.ts lib/wallet/apple.ts
git commit -m "feat: include locations and relevantDate in Apple Wallet passes"
```

---

### Task 4: Geocoding API endpoint

**Files:**
- Create: `app/api/admin/geocode/route.ts`

- [ ] **Step 1: Create the geocode endpoint**

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { address: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { address } = body;
  if (!address || address.trim().length < 3) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address.trim())}`,
      {
        headers: {
          "User-Agent": "Kyro Loyalty (contact@kyro.com)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
    }

    const results = await res.json();
    if (!results || results.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { lat, lon, display_name } = results[0];
    return NextResponse.json({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      display_name,
    });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/geocode/route.ts
git commit -m "feat: geocoding endpoint using OpenStreetMap Nominatim"
```

---

### Task 5: Add address + birthday campaign fields to Card Builder form

**Files:**
- Modify: `app/admin/components/CardBuilderForm.tsx`

- [ ] **Step 1: Add address geocoding state and handler**

After the existing state declarations (around line 220), add:

```typescript
const [geocoding, setGeocoding] = useState(false);
const [geoResult, setGeoResult] = useState<string>("");

async function handleGeocode() {
  const addr = (cardData.businessDetails as any).address;
  if (!addr || addr.trim().length < 3) return;
  setGeocoding(true);
  setGeoResult("");
  try {
    const res = await fetch("/api/admin/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr }),
    });
    const data = await res.json();
    if (res.ok) {
      setBd({ latitude: data.latitude, longitude: data.longitude } as any);
      setGeoResult(`📍 ${data.display_name}`);
    } else {
      setGeoResult(`❌ ${data.error || "Not found"}`);
    }
  } catch {
    setGeoResult("❌ Geocoding failed");
  } finally {
    setGeocoding(false);
  }
}
```

- [ ] **Step 2: Add Shop Address field to the Merchant section**

In the Merchant section (after the merchant name/tagline fields, around line 355), add:

```tsx
<div style={{ marginBottom: "14px" }}>
  <label style={labelStyle}>Shop Address</label>
  <div style={{ display: "flex", gap: "8px" }}>
    <input
      style={{ ...inputStyle, flex: 1 }}
      value={(cardData.businessDetails as any).address || ""}
      onChange={(e) => setBd({ address: e.target.value } as any)}
      placeholder="123 Main St, Sydney NSW 2000"
    />
    <button
      type="button"
      onClick={handleGeocode}
      disabled={geocoding}
      style={{
        padding: "10px 16px", borderRadius: "8px",
        backgroundColor: "rgb(108,71,255)", color: "white",
        border: "none", fontSize: "13px", fontWeight: 600,
        cursor: geocoding ? "not-allowed" : "pointer",
        opacity: geocoding ? 0.7 : 1, fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {geocoding ? "..." : "📍 Locate"}
    </button>
  </div>
  {geoResult && (
    <div style={{ marginTop: "6px", fontSize: "12px", color: geoResult.startsWith("❌") ? "#e53e3e" : "rgb(22,101,52)" }}>
      {geoResult}
    </div>
  )}
  {(cardData.businessDetails as any).latitude && !geoResult && (
    <div style={{ marginTop: "6px", fontSize: "12px", color: "rgb(22,101,52)" }}>
      📍 Location set ({(cardData.businessDetails as any).latitude.toFixed(4)}, {(cardData.businessDetails as any).longitude.toFixed(4)})
    </div>
  )}
</div>
```

- [ ] **Step 3: Add Birthday Campaign section to Card Logic (stamp/points only)**

In the Card Logic section (after existing stamp or points fields, around line 600), add:

```tsx
{(cardData.type === "stamp" || cardData.type === "points") && (
  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgb(228,227,223)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <label style={{ ...labelStyle, marginBottom: 0 }}>Birthday Campaign</label>
      <button
        type="button"
        onClick={() => setLogic({ birthdayEnabled: !(logic as any).birthdayEnabled } as any)}
        style={{
          width: "44px", height: "24px", borderRadius: "12px", border: "none",
          backgroundColor: (logic as any).birthdayEnabled ? "rgb(108,71,255)" : "rgb(228,227,223)",
          cursor: "pointer", position: "relative", transition: "background-color 0.2s",
        }}
      >
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "white",
          position: "absolute", top: "2px",
          left: (logic as any).birthdayEnabled ? "22px" : "2px",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
    {(logic as any).birthdayEnabled && (
      <>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Birthday Offer Message</label>
          <input
            style={inputStyle}
            value={(logic as any).birthdayOffer || ""}
            onChange={(e) => setLogic({ birthdayOffer: e.target.value } as any)}
            placeholder="Free coffee on your birthday!"
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Reward Type</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["message", "stamp", "points"] as const).map((rt) => (
              <button
                key={rt}
                type="button"
                onClick={() => setLogic({ birthdayRewardType: rt } as any)}
                style={{
                  ...sharedTypeBtn,
                  ...((logic as any).birthdayRewardType === rt || (!((logic as any).birthdayRewardType) && rt === "message")
                    ? { backgroundColor: "rgb(108,71,255)", color: "white", border: "none" }
                    : { backgroundColor: "white", border: "1px solid rgb(228,227,223)", color: "rgb(11,5,29)" }),
                  padding: "8px 14px", fontSize: "13px",
                }}
              >
                {rt === "message" ? "Message Only" : rt === "stamp" ? "Free Stamp" : "Bonus Points"}
              </button>
            ))}
          </div>
        </div>
        {(logic as any).birthdayRewardType === "points" && (
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Birthday Bonus Points</label>
            <input
              type="number"
              style={inputStyle}
              value={(logic as any).birthdayPointsAmount || ""}
              onChange={(e) => setLogic({ birthdayPointsAmount: parseInt(e.target.value) || 0 } as any)}
              placeholder="50"
            />
          </div>
        )}
      </>
    )}
  </div>
)}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/components/CardBuilderForm.tsx
git commit -m "feat: add shop address geocoding and birthday campaign to card builder"
```

---

### Task 6: Notification admin API — create and list

**Files:**
- Create: `app/api/admin/cards/[id]/notify/route.ts`
- Create: `app/api/admin/cards/[id]/notifications/route.ts`

- [ ] **Step 1: Create the notify endpoint (send/schedule)**

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const cardId = params.id;

  let body: { title: string; message?: string; scheduled_at?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, message, scheduled_at } = body;
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Verify card exists
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("id", cardId)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // If scheduled, save as pending
  if (scheduled_at) {
    const { data: notif, error } = await supabase
      .from("card_notifications" as any)
      .insert({
        card_id: cardId,
        type: "custom",
        title,
        message: message || null,
        scheduled_at,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to schedule" }, { status: 500 });
    }

    return NextResponse.json({ id: (notif as any).id, status: "pending" });
  }

  // Send immediately — get all enrollments for this card
  const { data: enrollments } = await supabase
    .from("card_enrollments" as any)
    .select("id")
    .eq("card_id", cardId)
    .eq("status", "active");

  const recipients = enrollments ? (enrollments as any[]).length : 0;

  // Send APNs push to all devices
  for (const enrollment of (enrollments || []) as any[]) {
    notifyPassUpdate(enrollment.id, supabase).catch(console.error);
  }

  // Save notification record
  const { data: notif, error } = await supabase
    .from("card_notifications" as any)
    .insert({
      card_id: cardId,
      type: "custom",
      title,
      message: message || null,
      sent_at: new Date().toISOString(),
      recipients,
      status: "sent",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save notification" }, { status: 500 });
  }

  return NextResponse.json({ id: (notif as any).id, recipients, status: "sent" });
}
```

- [ ] **Step 2: Create the notifications list endpoint**

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("card_notifications" as any)
    .select("*")
    .eq("card_id", params.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json({ notifications: data || [] });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/cards/\[id\]/notify/route.ts app/api/admin/cards/\[id\]/notifications/route.ts
git commit -m "feat: admin API for creating and listing card notifications"
```

---

### Task 7: Notification UI in card dashboard

**Files:**
- Modify: `app/admin/cards/[id]/page.tsx`

- [ ] **Step 1: Add notification section to the edit card page**

After the publish result section and before the card-builder-layout div (around line 98), add a notification section:

```tsx
{/* Notifications Section */}
{publishResult && (
  <NotificationSection cardId={cardId} />
)}
```

Then create the `NotificationSection` component inline in the same file (before the `EditCardPage` export):

```tsx
function NotificationSection({ cardId }: { cardId: string }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/admin/cards/${cardId}/notifications`)
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {});
  }, [cardId]);

  async function handleSend() {
    if (!title.trim()) return;
    setSending(true);
    setResult("");
    try {
      const body: any = { title: title.trim() };
      if (message.trim()) body.message = message.trim();
      if (scheduledAt) body.scheduled_at = new Date(scheduledAt).toISOString();

      const res = await fetch(`/api/admin/cards/${cardId}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.status === "sent" ? `Sent to ${data.recipients} members` : "Scheduled");
        setTitle("");
        setMessage("");
        setScheduledAt("");
        // Refresh list
        const listRes = await fetch(`/api/admin/cards/${cardId}/notifications`);
        const listData = await listRes.json();
        setNotifications(listData.notifications || []);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ marginBottom: "24px", padding: "20px 24px", backgroundColor: "white", borderRadius: "12px", border: "1px solid rgb(228,227,223)" }}>
      <div style={{ fontSize: "16px", fontWeight: 700, color: "rgb(11,5,29)", marginBottom: "16px" }}>
        Send Notification
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Double stamps this weekend!"
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Visit us this Saturday and Sunday to earn double stamps on every purchase!"
          rows={3}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Schedule (optional — empty = send now)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={sending || !title.trim()}
        style={{
          padding: "12px 24px", borderRadius: "8px",
          backgroundColor: title.trim() ? "rgb(108,71,255)" : "rgb(228,227,223)",
          color: "white", fontSize: "14px", fontWeight: 600,
          border: "none", cursor: sending || !title.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit", opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "Sending..." : scheduledAt ? "Schedule" : "Send Now"}
      </button>
      {result && (
        <div style={{ marginTop: "10px", fontSize: "13px", color: result.startsWith("Error") ? "#e53e3e" : "rgb(22,101,52)", fontWeight: 600 }}>
          {result}
        </div>
      )}

      {/* History */}
      {notifications.length > 0 && (
        <div style={{ marginTop: "20px", borderTop: "1px solid rgb(228,227,223)", paddingTop: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            History
          </div>
          {notifications.map((n: any) => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{n.title}</div>
                <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px" }}>
                  {n.type} · {n.recipients} recipients · {new Date(n.sent_at || n.scheduled_at || n.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{
                padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                backgroundColor: n.status === "sent" ? "rgb(220,252,231)" : n.status === "pending" ? "rgb(254,249,195)" : "rgb(254,226,226)",
                color: n.status === "sent" ? "rgb(22,101,52)" : n.status === "pending" ? "rgb(133,77,14)" : "rgb(153,27,27)",
              }}>
                {n.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

Add the missing imports at the top of the file:

```typescript
import { useState, useEffect } from "react";
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/cards/\[id\]/page.tsx
git commit -m "feat: notification send/schedule UI in card dashboard"
```

---

### Task 8: Daily cron job for birthday, expiry, and scheduled notifications

**Files:**
- Create: `app/api/cron/notifications/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create the cron endpoint**

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPassUpdate } from "@/lib/wallet/apns";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  let birthdayCount = 0;
  let expiryCount = 0;
  let customCount = 0;

  // ── 1. Birthday campaigns ──
  // Find cards with birthdayEnabled in logic
  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id, type, logic")
    .eq("status", "active" as any);

  for (const card of (cards || []) as any[]) {
    const logic = card.logic || {};
    if (!logic.birthdayEnabled) continue;

    // Find enrollments with birthday today
    const { data: enrollments } = await supabase
      .from("card_enrollments" as any)
      .select("id, customer_name, customer_dob, stamps_collected, points_balance")
      .eq("card_id", card.id)
      .eq("status", "active");

    for (const e of (enrollments || []) as any[]) {
      if (!e.customer_dob) continue;
      const dob = new Date(e.customer_dob);
      if (dob.getMonth() + 1 !== todayMonth || dob.getDate() !== todayDay) continue;

      // Apply birthday reward
      if (logic.birthdayRewardType === "stamp" && card.type === "stamp") {
        const totalStamps = logic.totalStamps || 10;
        const newStamps = Math.min(e.stamps_collected + 1, totalStamps);
        await supabase
          .from("card_enrollments" as any)
          .update({ stamps_collected: newStamps })
          .eq("id", e.id);
      } else if (logic.birthdayRewardType === "points" && card.type === "points") {
        const bonusPoints = logic.birthdayPointsAmount || 50;
        await supabase
          .from("card_enrollments" as any)
          .update({ points_balance: e.points_balance + bonusPoints })
          .eq("id", e.id);
      }

      // Send APNs push to refresh pass
      await notifyPassUpdate(e.id, supabase).catch(console.error);
      birthdayCount++;
    }
  }

  // ── 2. Expiry reminders (7 days before) ──
  // Passes expire 365 days after creation — check enrollments created ~358 days ago
  const expiryCheckDate = new Date(now);
  expiryCheckDate.setDate(expiryCheckDate.getDate() - 358);
  const expiryStart = new Date(expiryCheckDate);
  expiryStart.setHours(0, 0, 0, 0);
  const expiryEnd = new Date(expiryCheckDate);
  expiryEnd.setHours(23, 59, 59, 999);

  const { data: expiringEnrollments } = await supabase
    .from("card_enrollments" as any)
    .select("id")
    .eq("status", "active")
    .gte("created_at", expiryStart.toISOString())
    .lte("created_at", expiryEnd.toISOString());

  for (const e of (expiringEnrollments || []) as any[]) {
    await notifyPassUpdate(e.id, supabase).catch(console.error);
    expiryCount++;
  }

  // ── 3. Scheduled custom notifications ──
  const { data: pendingNotifs } = await supabase
    .from("card_notifications" as any)
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_at", now.toISOString());

  for (const notif of (pendingNotifs || []) as any[]) {
    const { data: enrollments } = await supabase
      .from("card_enrollments" as any)
      .select("id")
      .eq("card_id", notif.card_id)
      .eq("status", "active");

    const recipients = enrollments ? (enrollments as any[]).length : 0;

    for (const e of (enrollments || []) as any[]) {
      await notifyPassUpdate(e.id, supabase).catch(console.error);
    }

    await supabase
      .from("card_notifications" as any)
      .update({ status: "sent", sent_at: now.toISOString(), recipients })
      .eq("id", notif.id);

    customCount++;
  }

  return NextResponse.json({
    ok: true,
    birthday: birthdayCount,
    expiry: expiryCount,
    custom: customCount,
  });
}
```

- [ ] **Step 2: Create vercel.json with cron schedule**

```json
{
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "0 21 * * *"
    }
  ]
}
```

Note: `0 21 * * *` = 9pm UTC = 7am AEST (UTC+10).

- [ ] **Step 3: Commit**

```bash
git add app/api/cron/notifications/route.ts vercel.json
git commit -m "feat: daily cron for birthday campaigns, expiry reminders, and scheduled notifications"
```

---

### Task 9: Update pass generation to handle birthday offers on the day

**Files:**
- Modify: `app/api/passes/v1/[...path]/route.ts`

- [ ] **Step 1: Check for birthday when generating a pass refresh**

In the GET handler for `/v1/passes/{passTypeId}/{serialNumber}` (around line 126), update the `enrollmentToPassTemplate` call to check if today is the member's birthday and the card has a birthday campaign:

```typescript
    // Check for birthday offer
    let birthdayOffer: string | undefined;
    let relevantDate: string | undefined;
    const today = new Date();
    if (e.customer_dob) {
      const dob = new Date(e.customer_dob);
      const logic = (card as any).logic || {};
      if (
        logic.birthdayEnabled &&
        dob.getMonth() === today.getMonth() &&
        dob.getDate() === today.getDate()
      ) {
        birthdayOffer = logic.birthdayOffer || "Happy Birthday!";
        relevantDate = new Date(
          today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0
        ).toISOString();
      }
    }

    const template = enrollmentToPassTemplate(card as any, {
      id: e.id,
      membership_code: e.membership_code,
      customer_name: e.customer_name,
      stamps_collected: e.stamps_collected,
      points_balance: e.points_balance,
      auth_token: e.auth_token,
    }, { birthdayOffer, relevantDate });
```

Also update the enrollment select to include `customer_dob`:

```typescript
    const { data: enrollment } = await supabase
      .from("card_enrollments" as any)
      .select("*")
      .eq("id", serialNumber)
      .single();
```

This already uses `select("*")` so `customer_dob` is included.

- [ ] **Step 2: Commit**

```bash
git add app/api/passes/v1/\[...path\]/route.ts
git commit -m "feat: show birthday offer on pass when Apple fetches refresh"
```

---

### Task 10: Build, test, and final commit

- [ ] **Step 1: Run the build**

```bash
npx next build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify all files are committed**

```bash
git status
```

Expected: Clean working tree.

- [ ] **Step 3: Push**

```bash
git push
```
