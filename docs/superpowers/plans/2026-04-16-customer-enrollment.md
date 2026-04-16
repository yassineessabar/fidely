# Customer Enrollment & Merchant Scan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add customer sign-up form before wallet download, per-customer enrollments with unique QR codes, and a merchant scan page to update stamps/points.

**Architecture:** New `card_enrollments` table links customers to cards. `/c/{cardId}` becomes a sign-up form that creates an enrollment and returns a personalized pkpass. `/scan/{membershipCode}` lets merchants update card progress. Pass generation accepts enrollment data for personalized QR and fields.

**Tech Stack:** Next.js (App Router), Supabase (Postgres + RLS), existing pkpass generation (lib/wallet/apple.ts)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/0004_card_enrollments.sql` | Create | New enrollments table + indexes |
| `app/api/enroll/[cardId]/route.ts` | Create | POST: create enrollment, return pkpass |
| `app/api/scan/[code]/route.ts` | Create | GET: enrollment info, POST: update progress |
| `app/c/[id]/page.tsx` | Modify | Replace WalletButton with sign-up form |
| `app/c/[id]/EnrollForm.tsx` | Create | Client-side sign-up form component |
| `app/scan/[code]/page.tsx` | Create | Merchant scan page |
| `app/scan/[code]/ScanActions.tsx` | Create | Client-side action buttons component |
| `lib/wallet/generate.ts` | Modify | Accept enrollment data for personalized pass |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/0004_card_enrollments.sql`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0004_card_enrollments.sql`:

```sql
-- Enrollment status enum
CREATE TYPE public.enrollment_status AS ENUM ('active', 'redeemed', 'expired');

-- Card enrollments table
CREATE TABLE public.card_enrollments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id           uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  customer_name     text NOT NULL,
  customer_email    text NOT NULL,
  customer_phone    text NOT NULL,
  customer_dob      date NOT NULL,
  membership_code   text UNIQUE NOT NULL,
  stamps_collected  integer NOT NULL DEFAULT 0,
  points_balance    integer NOT NULL DEFAULT 0,
  status            public.enrollment_status NOT NULL DEFAULT 'active',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate signups per card
CREATE UNIQUE INDEX idx_enrollment_card_email ON public.card_enrollments(card_id, customer_email);

-- Fast lookup by membership code (for scan)
CREATE INDEX idx_enrollment_membership ON public.card_enrollments(membership_code);

-- Fast lookup by card (for admin listing)
CREATE INDEX idx_enrollment_card ON public.card_enrollments(card_id);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_card_enrollments
  BEFORE UPDATE ON public.card_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS: allow public read/insert for enrollment, admin full access
ALTER TABLE public.card_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public enrollment creation"
  ON public.card_enrollments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public enrollment read by membership code"
  ON public.card_enrollments FOR SELECT
  USING (true);

CREATE POLICY "Allow public enrollment update"
  ON public.card_enrollments FOR UPDATE
  USING (true);
```

- [ ] **Step 2: Run the migration against Supabase**

Run: `npx supabase db push` or apply via Supabase dashboard SQL editor — paste the migration contents and execute.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0004_card_enrollments.sql
git commit -m "feat: add card_enrollments table migration"
```

---

### Task 2: Enrollment API Endpoint

**Files:**
- Create: `app/api/enroll/[cardId]/route.ts`
- Modify: `lib/wallet/generate.ts`

- [ ] **Step 1: Update generate.ts to accept enrollment data**

Add a new function to `lib/wallet/generate.ts` that builds a personalized pass template from card + enrollment data. Add this after the existing `cardToPassTemplate` function:

```typescript
export function enrollmentToPassTemplate(
  card: CardRow,
  enrollment: {
    id: string;
    membership_code: string;
    customer_name: string;
    stamps_collected: number;
    points_balance: number;
  }
): PassTemplate {
  const bd = card.business_details || {};
  const br = card.branding || {};
  const logic = card.logic || {};
  const merchantName = bd.name || "Merchant";

  const typeMap: Record<string, "discount" | "reward" | "stamp" | "cashback"> = {
    coupon: "discount",
    stamp: "stamp",
    points: "reward",
  };

  let headerFields: PassField[] = [];
  let primaryFields: PassField[] = [];
  let secondaryFields: PassField[] = [];
  let auxiliaryFields: PassField[] = [];
  let backFields: PassField[] = [];
  let description = bd.description || `${merchantName} Loyalty Card`;

  if (card.type === "coupon") {
    primaryFields = [
      { key: "offer", label: "OFFER", value: logic.offerTitle || "Special Offer" },
    ];
    if (logic.expiryDate) {
      secondaryFields.push({ key: "expires", label: "EXPIRES", value: logic.expiryDate });
    }
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
    description = logic.offerDescription || description;
  } else if (card.type === "stamp") {
    headerFields = [
      { key: "stamps", label: "STAMPS", value: `${enrollment.stamps_collected}/${logic.totalStamps || 10}` },
    ];
    primaryFields = [
      { key: "reward", label: "REWARD", value: logic.reward || "Free item" },
    ];
    secondaryFields = [
      { key: "progress", label: "PROGRESS", value: `${enrollment.stamps_collected} ${logic.progressLabel || "collected"}` },
    ];
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
  } else if (card.type === "points") {
    headerFields = [
      { key: "points", label: logic.pointsLabel || "POINTS", value: String(enrollment.points_balance) },
    ];
    primaryFields = [
      { key: "earn", label: "EARN RATE", value: `${logic.pointsPerDollar || 10} pts per $1` },
    ];
    const tiers = logic.rewardTiers || [];
    if (tiers.length > 0) {
      secondaryFields.push({
        key: "nextReward",
        label: "NEXT REWARD",
        value: `${tiers[0].reward} (${tiers[0].points} pts)`,
      });
    }
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
  }

  if (bd.description) {
    backFields.push({ key: "about", label: "ABOUT", value: bd.description });
  }
  backFields.push({ key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" });

  return {
    type: typeMap[card.type] || "reward",
    merchantName,
    merchantId: card.id,
    logoText: merchantName,
    description,
    backgroundColor: br.backgroundColor || "rgb(11,5,29)",
    foregroundColor: br.primaryColor || "rgb(255,255,255)",
    labelColor: br.secondaryColor || "rgb(230,255,169)",
    headerFields,
    primaryFields,
    secondaryFields,
    auxiliaryFields,
    backFields,
    barcodeFormat: "QR",
    barcodeValue: enrollment.membership_code,
    stripImagePath: "/wallet/strip-reward.png",
    logoUrl: br.logoUrl || undefined,
    accentColor: br.accentColor || undefined,
  };
}
```

- [ ] **Step 2: Create the enrollment API route**

Create `app/api/enroll/[cardId]/route.ts`:

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { generateApplePass } from "@/lib/wallet/apple";
import { enrollmentToPassTemplate } from "@/lib/wallet/generate";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  const supabase = createAdminClient();
  const { cardId } = params;

  // Validate request body
  let body: { name: string; email: string; phone: string; dob: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, dob } = body;
  if (!name || !email || !phone || !dob) {
    return NextResponse.json(
      { error: "All fields required: name, email, phone, dob" },
      { status: 400 }
    );
  }

  // Validate card exists and is active
  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", cardId)
    .eq("status", "active" as any)
    .single();

  if (cardError || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("card_enrollments")
    .select("id, membership_code, customer_name, stamps_collected, points_balance")
    .eq("card_id", cardId)
    .eq("customer_email", email.toLowerCase().trim())
    .single();

  let enrollment: {
    id: string;
    membership_code: string;
    customer_name: string;
    stamps_collected: number;
    points_balance: number;
  };

  if (existing) {
    // Already enrolled — re-download pass
    enrollment = existing;
  } else {
    // Create new enrollment
    const { data: newEnrollment, error: insertError } = await supabase
      .from("card_enrollments")
      .insert({
        card_id: cardId,
        customer_name: name.trim(),
        customer_email: email.toLowerCase().trim(),
        customer_phone: phone.trim(),
        customer_dob: dob,
        membership_code: `KYRO-MBR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        stamps_collected: 0,
        points_balance: 0,
        status: "active",
      })
      .select("id, membership_code, customer_name, stamps_collected, points_balance")
      .single();

    if (insertError || !newEnrollment) {
      console.error("Enrollment insert failed:", insertError);
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
    }

    enrollment = newEnrollment;
  }

  // Generate personalized pass
  const template = enrollmentToPassTemplate(card as any, enrollment);

  try {
    const buffer = await generateApplePass(template);
    const uint8 = new Uint8Array(buffer);
    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Length": String(uint8.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("Pass generation failed:", err);
    return NextResponse.json(
      { error: "Pass generation failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify it builds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add lib/wallet/generate.ts app/api/enroll/[cardId]/route.ts
git commit -m "feat: add enrollment API endpoint with personalized pass generation"
```

---

### Task 3: Customer Sign-Up Form

**Files:**
- Create: `app/c/[id]/EnrollForm.tsx`
- Modify: `app/c/[id]/page.tsx`

- [ ] **Step 1: Create the EnrollForm client component**

Create `app/c/[id]/EnrollForm.tsx`:

```typescript
"use client";

import { useState, FormEvent } from "react";

export default function EnrollForm({
  cardId,
  backgroundColor,
  primaryColor,
  accentColor,
}: {
  cardId: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/enroll/${cardId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, dob }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Response is pkpass binary — trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setSuccess(true);

      // On iOS Safari, setting location to pkpass blob opens Wallet
      window.location.href = url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: primaryColor, marginBottom: "8px" }}>
          You're all set!
        </div>
        <div style={{ fontSize: "14px", color: primaryColor, opacity: 0.7 }}>
          Your loyalty card should be opening now. Add it to your wallet to start collecting rewards.
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: `1px solid ${primaryColor}20`,
    backgroundColor: `${primaryColor}08`,
    color: primaryColor,
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600 as const,
    color: primaryColor,
    opacity: 0.6,
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Phone</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+61 412 345 678"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Date of Birth</label>
        <input
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          style={{ ...inputStyle, colorScheme: "dark" }}
        />
      </div>

      {error && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "10px",
          backgroundColor: "#ff000020",
          color: "#ff6b6b",
          fontSize: "14px",
          marginBottom: "16px",
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          backgroundColor: accentColor || "#6C47FF",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 700,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Creating your card..." : "Get My Loyalty Card"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Update page.tsx to use EnrollForm instead of WalletButton**

Replace the entire content of `app/c/[id]/page.tsx` with:

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import EnrollForm from "./EnrollForm";

type Card = {
  id: string;
  type: "coupon" | "stamp" | "points";
  status: string;
  business_details: any;
  branding: any;
  logic: any;
};

export default async function PublicCardPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, status, business_details, branding, logic")
    .eq("id", params.id)
    .eq("status", "active" as any)
    .single();

  if (error || !card) {
    notFound();
  }

  const c = card as Card;
  const bd = c.business_details || {};
  const br = c.branding || {};
  const logic = c.logic || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const secondary = br.secondaryColor || "#E6FFA9";
  const accent = br.accentColor || "#6C47FF";
  const merchantName = bd.name || "Merchant";

  const typeLabels: Record<string, string> = {
    coupon: "Coupon",
    stamp: "Stamp Card",
    points: "Points Card",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Logo + merchant name */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {br.logoUrl ? (
          <img
            src={br.logoUrl}
            alt={merchantName}
            style={{ width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover", marginBottom: "16px" }}
          />
        ) : (
          <div
            style={{
              width: "64px", height: "64px", borderRadius: "16px", backgroundColor: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: 800, color: primary, margin: "0 auto 16px",
            }}
          >
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: primary }}>{merchantName}</h1>
        {bd.tagline && (
          <p style={{ margin: "8px 0 0", fontSize: "16px", color: secondary, opacity: 0.8 }}>{bd.tagline}</p>
        )}
      </div>

      {/* Card type badge */}
      <div
        style={{
          display: "inline-block", padding: "6px 16px", borderRadius: "100px",
          backgroundColor: `${accent}33`, color: secondary,
          fontSize: "13px", fontWeight: 600, marginBottom: "24px",
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}
      >
        {typeLabels[c.type] || c.type}
      </div>

      {/* Card details */}
      <div
        style={{
          width: "100%", maxWidth: "400px", borderRadius: "16px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
          padding: "24px", marginBottom: "24px",
        }}
      >
        {c.type === "coupon" && (
          <>
            <div style={{ fontSize: "24px", fontWeight: 800, color: primary, marginBottom: "8px" }}>
              {logic.offerTitle || "Special Offer"}
            </div>
            {logic.offerDescription && (
              <p style={{ fontSize: "15px", color: primary, opacity: 0.7, margin: 0 }}>{logic.offerDescription}</p>
            )}
          </>
        )}
        {c.type === "stamp" && (
          <>
            <div style={{ fontSize: "14px", fontWeight: 600, color: secondary, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Collect {logic.totalStamps || 10} {logic.progressLabel || "stamps"} to earn
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: primary }}>
              {logic.reward || "Free item"}
            </div>
          </>
        )}
        {c.type === "points" && (
          <>
            <div style={{ fontSize: "14px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Earn {logic.pointsPerDollar || 10} points per $1 spent
            </div>
            {(logic.rewardTiers || []).length > 0 && (
              <div style={{ marginTop: "12px" }}>
                {(logic.rewardTiers || []).map((tier: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${primary}10` }}>
                    <span style={{ fontSize: "14px", color: primary, opacity: 0.7 }}>{tier.reward}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: accent }}>{tier.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Welcome offer */}
      {bd.welcomeOffer && (
        <div
          style={{
            width: "100%", maxWidth: "400px", padding: "16px 20px", borderRadius: "12px",
            backgroundColor: `${secondary}15`, border: `1px solid ${secondary}30`, marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Welcome Offer</div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: primary }}>{bd.welcomeOffer}</div>
        </div>
      )}

      {/* Sign-up form */}
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", textAlign: "center" }}>
          Sign up to get your card
        </div>
        <EnrollForm cardId={c.id} backgroundColor={bg} primaryColor={primary} accentColor={accent} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.25 }}>
        Powered by Kyro
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add app/c/[id]/EnrollForm.tsx app/c/[id]/page.tsx
git commit -m "feat: replace wallet button with customer sign-up form"
```

---

### Task 4: Scan API Endpoint

**Files:**
- Create: `app/api/scan/[code]/route.ts`

- [ ] **Step 1: Create the scan API route**

Create `app/api/scan/[code]/route.ts`:

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET: fetch enrollment + card info for display
export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  const supabase = createAdminClient();
  const { code } = params;

  const { data: enrollment, error } = await supabase
    .from("card_enrollments")
    .select("*")
    .eq("membership_code", code)
    .single();

  if (error || !enrollment) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, type, name, business_details, branding, logic")
    .eq("id", enrollment.card_id)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({ enrollment, card });
}

// POST: update card progress
export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  const supabase = createAdminClient();
  const { code } = params;

  let body: { action: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, amount } = body;
  if (!action || !["add_stamp", "add_points", "redeem", "reset_stamps"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Use: add_stamp, add_points, redeem, reset_stamps" },
      { status: 400 }
    );
  }

  // Fetch enrollment
  const { data: enrollment, error } = await supabase
    .from("card_enrollments")
    .select("*")
    .eq("membership_code", code)
    .single();

  if (error || !enrollment) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  // Fetch card for logic
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, type, name, logic")
    .eq("id", enrollment.card_id)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const logic = (card as any).logic || {};
  let updates: Record<string, any> = {};
  let message = "";
  let rewardEarned = false;

  if (action === "add_stamp") {
    if ((card as any).type !== "stamp") {
      return NextResponse.json({ error: "This is not a stamp card" }, { status: 400 });
    }
    const totalStamps = logic.totalStamps || 10;
    const newCount = Math.min(enrollment.stamps_collected + 1, totalStamps);
    updates = { stamps_collected: newCount };
    rewardEarned = newCount >= totalStamps;
    message = rewardEarned
      ? `All ${totalStamps} stamps collected! Reward earned: ${logic.reward || "Free item"}`
      : `Stamp added! ${newCount}/${totalStamps} collected.`;
  } else if (action === "add_points") {
    if ((card as any).type !== "points") {
      return NextResponse.json({ error: "This is not a points card" }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }
    const pointsPerDollar = logic.pointsPerDollar || 10;
    const pointsToAdd = Math.round(amount * pointsPerDollar);
    const newBalance = enrollment.points_balance + pointsToAdd;
    updates = { points_balance: newBalance };

    const tiers = logic.rewardTiers || [];
    const earnedTier = tiers.find((t: any) => newBalance >= t.points && enrollment.points_balance < t.points);
    rewardEarned = !!earnedTier;
    message = rewardEarned
      ? `${pointsToAdd} points added! Reward earned: ${earnedTier.reward}`
      : `${pointsToAdd} points added! Balance: ${newBalance} pts.`;
  } else if (action === "redeem") {
    if (enrollment.status === "redeemed") {
      return NextResponse.json({ error: "Already redeemed" }, { status: 400 });
    }
    updates = { status: "redeemed" };
    message = "Coupon redeemed successfully!";
    rewardEarned = true;
  } else if (action === "reset_stamps") {
    if ((card as any).type !== "stamp") {
      return NextResponse.json({ error: "This is not a stamp card" }, { status: 400 });
    }
    updates = { stamps_collected: 0 };
    message = "Stamps reset. New cycle started!";
  }

  const { data: updated, error: updateError } = await supabase
    .from("card_enrollments")
    .update(updates)
    .eq("id", enrollment.id)
    .select("*")
    .single();

  if (updateError) {
    console.error("Update failed:", updateError);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({
    enrollment: updated,
    card,
    reward_earned: rewardEarned,
    message,
  });
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/scan/[code]/route.ts
git commit -m "feat: add scan API endpoint for stamp/points/redeem updates"
```

---

### Task 5: Merchant Scan Page

**Files:**
- Create: `app/scan/[code]/page.tsx`
- Create: `app/scan/[code]/ScanActions.tsx`

- [ ] **Step 1: Create the ScanActions client component**

Create `app/scan/[code]/ScanActions.tsx`:

```typescript
"use client";

import { useState } from "react";

type Enrollment = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  stamps_collected: number;
  points_balance: number;
  status: string;
  created_at: string;
};

type Card = {
  id: string;
  type: string;
  name: string;
  logic: any;
  business_details: any;
  branding: any;
};

export default function ScanActions({
  initialEnrollment,
  card,
  code,
}: {
  initialEnrollment: Enrollment;
  card: Card;
  code: string;
}) {
  const [enrollment, setEnrollment] = useState(initialEnrollment);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rewardEarned, setRewardEarned] = useState(false);
  const [amount, setAmount] = useState("");

  const logic = card.logic || {};
  const br = card.branding || {};
  const accent = br.accentColor || "#6C47FF";
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";

  async function doAction(action: string, actionAmount?: number) {
    setLoading(true);
    setMessage("");
    setRewardEarned(false);

    try {
      const res = await fetch(`/api/scan/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, amount: actionAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Action failed");
        setLoading(false);
        return;
      }

      setEnrollment(data.enrollment);
      setMessage(data.message);
      setRewardEarned(data.reward_earned);
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: accent,
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700 as const,
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      {/* Customer info */}
      <div style={{
        padding: "20px 24px", borderRadius: "16px",
        backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
        marginBottom: "20px",
      }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: primary, marginBottom: "4px" }}>
          {enrollment.customer_name}
        </div>
        <div style={{ fontSize: "13px", color: primary, opacity: 0.5 }}>
          Member since {new Date(enrollment.created_at).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Progress display */}
      {card.type === "stamp" && (
        <div style={{
          padding: "24px", borderRadius: "16px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
          marginBottom: "20px", textAlign: "center",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: primary, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
            Stamps
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {Array.from({ length: logic.totalStamps || 10 }).map((_, i) => (
              <div key={i} style={{
                width: "40px", height: "40px", borderRadius: "50%",
                backgroundColor: i < enrollment.stamps_collected ? accent : `${primary}15`,
                border: i < enrollment.stamps_collected ? "none" : `2px dashed ${primary}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>
                {i < enrollment.stamps_collected ? (logic.stampIcon || "✓") : ""}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "14px", color: primary, opacity: 0.6 }}>
            {enrollment.stamps_collected}/{logic.totalStamps || 10} — Reward: {logic.reward || "Free item"}
          </div>
        </div>
      )}

      {card.type === "points" && (
        <div style={{
          padding: "24px", borderRadius: "16px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
          marginBottom: "20px", textAlign: "center",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: primary, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Points Balance
          </div>
          <div style={{ fontSize: "48px", fontWeight: 800, color: primary, margin: "8px 0" }}>
            {enrollment.points_balance}
          </div>
          <div style={{ fontSize: "14px", color: primary, opacity: 0.5 }}>
            {logic.pointsPerDollar || 10} pts per $1 spent
          </div>
        </div>
      )}

      {card.type === "coupon" && (
        <div style={{
          padding: "24px", borderRadius: "16px",
          backgroundColor: `${primary}10`, border: `1px solid ${primary}20`,
          marginBottom: "20px", textAlign: "center",
        }}>
          <div style={{
            fontSize: "16px", fontWeight: 700,
            color: enrollment.status === "redeemed" ? "#ff6b6b" : "#4ade80",
            textTransform: "uppercase",
          }}>
            {enrollment.status === "redeemed" ? "Redeemed" : "Active"}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {card.type === "stamp" && enrollment.stamps_collected >= (logic.totalStamps || 10) && (
        <button
          onClick={() => doAction("reset_stamps")}
          disabled={loading}
          style={{ ...buttonStyle, backgroundColor: "#22c55e", marginBottom: "12px" }}
        >
          {loading ? "..." : "Reward Claimed — Reset Stamps"}
        </button>
      )}

      {card.type === "stamp" && enrollment.stamps_collected < (logic.totalStamps || 10) && (
        <button onClick={() => doAction("add_stamp")} disabled={loading} style={buttonStyle}>
          {loading ? "Adding..." : `+ 1 Stamp`}
        </button>
      )}

      {card.type === "points" && (
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="number"
            placeholder="$ amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              flex: 1, padding: "14px 16px", borderRadius: "12px",
              border: `1px solid ${primary}20`, backgroundColor: `${primary}08`,
              color: primary, fontSize: "16px", fontFamily: "inherit", outline: "none",
            }}
          />
          <button
            onClick={() => { doAction("add_points", parseFloat(amount)); setAmount(""); }}
            disabled={loading || !amount}
            style={{ ...buttonStyle, width: "auto", padding: "14px 24px" }}
          >
            {loading ? "..." : "Add Points"}
          </button>
        </div>
      )}

      {card.type === "coupon" && enrollment.status !== "redeemed" && (
        <button onClick={() => doAction("redeem")} disabled={loading} style={buttonStyle}>
          {loading ? "Redeeming..." : "Redeem Coupon"}
        </button>
      )}

      {/* Feedback message */}
      {message && (
        <div style={{
          marginTop: "20px", padding: "16px 20px", borderRadius: "12px",
          backgroundColor: rewardEarned ? "#22c55e20" : `${accent}20`,
          border: `1px solid ${rewardEarned ? "#22c55e40" : `${accent}40`}`,
          textAlign: "center",
        }}>
          {rewardEarned && <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>}
          <div style={{ fontSize: "15px", fontWeight: 600, color: primary }}>{message}</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the scan page (server component)**

Create `app/scan/[code]/page.tsx`:

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ScanActions from "./ScanActions";

export default async function ScanPage({ params }: { params: { code: string } }) {
  const supabase = createAdminClient();
  const { code } = params;

  const { data: enrollment, error } = await supabase
    .from("card_enrollments")
    .select("*")
    .eq("membership_code", code)
    .single();

  if (error || !enrollment) {
    notFound();
  }

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, type, name, business_details, branding, logic")
    .eq("id", enrollment.card_id)
    .single();

  if (!card) {
    notFound();
  }

  const bd = (card as any).business_details || {};
  const br = (card as any).branding || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const accent = br.accentColor || "#6C47FF";
  const merchantName = bd.name || "Merchant";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Merchant header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {br.logoUrl ? (
          <img
            src={br.logoUrl}
            alt={merchantName}
            style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover", marginBottom: "12px" }}
          />
        ) : (
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "12px", backgroundColor: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", fontWeight: 800, color: primary, margin: "0 auto 12px",
            }}
          >
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: primary }}>{merchantName}</h1>
      </div>

      <ScanActions
        initialEnrollment={enrollment as any}
        card={card as any}
        code={code}
      />

      <div style={{ marginTop: "48px", fontSize: "12px", color: primary, opacity: 0.25 }}>
        Powered by Kyro
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add app/scan/[code]/page.tsx app/scan/[code]/ScanActions.tsx
git commit -m "feat: add merchant scan page with stamp/points/redeem actions"
```

---

### Task 6: Wire QR Code to Scan URL

The merchant needs to be able to scan the customer's QR code and land on `/scan/{membershipCode}`. The QR value is already set to the `membership_code` (e.g. `KYRO-MBR-A3F7B2C1`). But we need the QR to encode a **URL** so scanning it opens the scan page.

**Files:**
- Modify: `lib/wallet/generate.ts`

- [ ] **Step 1: Update barcodeValue to be a full URL**

In `lib/wallet/generate.ts`, in the `enrollmentToPassTemplate` function, change the barcodeValue line:

Replace:
```typescript
    barcodeValue: enrollment.membership_code,
```

With:
```typescript
    barcodeValue: `${process.env.NEXT_PUBLIC_APP_URL || "https://fidely-beta.vercel.app"}/scan/${enrollment.membership_code}`,
```

- [ ] **Step 2: Verify it builds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add lib/wallet/generate.ts
git commit -m "feat: encode scan URL in customer QR code"
```

---

### Task 7: End-to-End Test

- [ ] **Step 1: Apply the database migration**

Go to Supabase dashboard → SQL Editor → paste contents of `supabase/migrations/0004_card_enrollments.sql` → Run.

- [ ] **Step 2: Test enrollment flow locally**

1. Run `npm run dev`
2. Open `/c/{your-active-card-id}` (e.g. the Glow Studio card `2f759ef4-4349-478e-8ef0-f6141c6263af`)
3. Verify sign-up form appears with name, email, phone, DOB fields
4. Fill in test data and submit
5. Verify pkpass downloads and opens in Wallet preview (macOS) or Wallet (iOS)
6. Verify the pass shows customer name and membership QR code

- [ ] **Step 3: Test scan flow locally**

1. Check Supabase dashboard → `card_enrollments` table → find the new enrollment
2. Copy the `membership_code` value
3. Open `/scan/{membership_code}` in browser
4. Verify customer name, stamp/points progress display
5. Click "+1 Stamp" (for stamp card) or enter amount + "Add Points" (for points card)
6. Verify progress updates and success message shows

- [ ] **Step 4: Test duplicate enrollment**

1. Go back to `/c/{cardId}` and submit with the same email
2. Verify it re-downloads the pass (no error, no duplicate created)
3. Check Supabase — still only one enrollment for that email+card

- [ ] **Step 5: Commit all and push**

```bash
git push origin main
```
