# Kyro Loyalty Card Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual loyalty card builder in the admin panel that lets admins create branded loyalty cards (coupon, stamp, points) per merchant, preview them live in an Apple Wallet style, publish with share URLs and QR codes, and generate real Apple/Google wallet passes for customers.

**Architecture:** Follows the existing admin panel pattern exactly: inline styles (not Tailwind), `verifyAdmin()` + `createAdminClient()` for all admin API routes, `"use client"` pages that fetch from API routes. The card builder uses a split-screen layout with a form on the left and a live preview on the right. The public card page at `/c/[id]` uses the service role client directly (no auth). Wallet pass generation reuses the existing `generateApplePass()` and `generateGoogleWalletUrl()` functions via a new mapper (`lib/wallet/generate.ts`).

**Tech Stack:** Next.js App Router, Supabase (service role client), lucide-react icons, inline CSS styles, `qrcode` npm package for QR generation.

**Spec:** `docs/superpowers/specs/2026-04-14-loyalty-card-builder-design.md`

---

## File Structure

### Create
| File | Responsibility |
|------|---------------|
| `supabase/migrations/0003_loyalty_cards.sql` | New table + enums + RLS |
| `app/admin/cards/page.tsx` | Cards list page |
| `app/admin/cards/new/page.tsx` | Card builder (create) |
| `app/admin/cards/[id]/page.tsx` | Card builder (edit) |
| `app/admin/components/CardPreview.tsx` | Live wallet card preview |
| `app/admin/components/CardBuilderForm.tsx` | Configuration form with 6 collapsible sections |
| `app/api/admin/cards/route.ts` | GET list, POST create |
| `app/api/admin/cards/[id]/route.ts` | GET detail, PATCH update |
| `app/api/admin/cards/[id]/publish/route.ts` | POST publish (generates share URL + QR) |
| `app/c/[id]/page.tsx` | Public card landing page |
| `app/api/wallet/apple/card/[id]/route.ts` | Apple pass from card config |
| `app/api/wallet/google/card/[id]/route.ts` | Google pass from card config |
| `lib/wallet/generate.ts` | Card config to PassTemplate mapper |

### Modify
| File | Change |
|------|--------|
| `app/admin/components/AdminSidebar.tsx` | Add "Cards" nav item (CreditCard icon) between Merchants and Invoices |
| `app/admin/components/AdminShell.tsx` | Add cards titles to titleMap + getTitle |
| `lib/supabase/database.types.ts` | Add loyalty_cards table types + card_type + card_status enums |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/0003_loyalty_cards.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/0003_loyalty_cards.sql`:

```sql
-- Loyalty Cards table for the card builder feature

CREATE TYPE public.card_type AS ENUM ('coupon', 'stamp', 'points');
CREATE TYPE public.card_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE public.loyalty_cards (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type             public.card_type NOT NULL,
  name             text NOT NULL,
  status           public.card_status DEFAULT 'draft',
  business_details jsonb NOT NULL DEFAULT '{}',
  branding         jsonb NOT NULL DEFAULT '{}',
  logic            jsonb NOT NULL DEFAULT '{}',
  share_url        text,
  qr_code_data     text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_loyalty_cards_business ON public.loyalty_cards(business_id);
CREATE INDEX idx_loyalty_cards_status ON public.loyalty_cards(status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cards"
  ON public.loyalty_cards FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );
```

- [ ] **Step 2: Apply the migration**

Run `npx supabase db push` or `npx supabase migration up` to apply.

**Verification:** Run `npx supabase db push --dry-run` and confirm the migration SQL is valid.

---

### Task 2: TypeScript Types

**Files:**
- Modify: `lib/supabase/database.types.ts`

- [ ] **Step 1: Add card_type and card_status to Enums**

In the `Enums` section of `Database['public']['Enums']`, add after the existing enums:

```typescript
card_type: 'coupon' | 'stamp' | 'points'
card_status: 'draft' | 'active' | 'archived'
```

- [ ] **Step 2: Add loyalty_cards to Tables**

Add the following table definition inside `Database['public']['Tables']`, following the exact pattern used by other tables (e.g. `signup_applications`):

```typescript
loyalty_cards: {
  Row: {
    id: string
    business_id: string
    type: Database['public']['Enums']['card_type']
    name: string
    status: Database['public']['Enums']['card_status']
    business_details: Json
    branding: Json
    logic: Json
    share_url: string | null
    qr_code_data: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    business_id: string
    type: Database['public']['Enums']['card_type']
    name: string
    status?: Database['public']['Enums']['card_status']
    business_details?: Json
    branding?: Json
    logic?: Json
    share_url?: string | null
    qr_code_data?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    business_id?: string
    type?: Database['public']['Enums']['card_type']
    name?: string
    status?: Database['public']['Enums']['card_status']
    business_details?: Json
    branding?: Json
    logic?: Json
    share_url?: string | null
    qr_code_data?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    { foreignKeyName: 'loyalty_cards_business_id_fkey'; columns: ['business_id']; referencedRelation: 'businesses'; referencedColumns: ['id'] },
  ]
}
```

**Verification:** Run `npx tsc --noEmit` and confirm no type errors in `database.types.ts`.

---

### Task 3: Update AdminSidebar + AdminShell

**Files:**
- Modify: `app/admin/components/AdminSidebar.tsx`
- Modify: `app/admin/components/AdminShell.tsx`

- [ ] **Step 1: Update AdminSidebar.tsx**

In `app/admin/components/AdminSidebar.tsx`:

1. Add `CreditCard` to the lucide-react import on line 9:
```typescript
import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
```

2. Insert the Cards nav item into the `navItems` array between Merchants and Invoices (after line 18, before the Invoices entry):
```typescript
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Merchants", href: "/admin/merchants", icon: Building2 },
  { label: "Cards", href: "/admin/cards", icon: CreditCard },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
];
```

- [ ] **Step 2: Update AdminShell.tsx**

In `app/admin/components/AdminShell.tsx`:

1. Add cards entries to the `titleMap` on line 8:
```typescript
const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/merchants": "Merchants",
  "/admin/cards": "Cards",
  "/admin/cards/new": "Card Builder",
  "/admin/invoices": "Invoices",
};
```

2. Update the `getTitle` function to handle `/admin/cards/[id]`:
```typescript
function getTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  if (pathname.startsWith("/admin/merchants/")) return "Merchant Detail";
  if (pathname.startsWith("/admin/cards/")) return "Edit Card";
  return "Admin";
}
```

**Verification:** Run `npx tsc --noEmit`. Navigate to `/admin` and confirm "Cards" appears in the sidebar between Merchants and Invoices.

---

### Task 4: Cards CRUD API

**Files:**
- Create: `app/api/admin/cards/route.ts`
- Create: `app/api/admin/cards/[id]/route.ts`

- [ ] **Step 1: Create cards list + create route**

Create `app/api/admin/cards/route.ts`:

```typescript
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();

  let query = supabase
    .from("loyalty_cards")
    .select("id, name, type, status, business_id, created_at, businesses(name)")
    .order("created_at", { ascending: false });

  if (status && ["draft", "active", "archived"].includes(status)) {
    query = query.eq("status", status as any);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cards = (data ?? []).map((card: any) => ({
    id: card.id,
    name: card.name,
    type: card.type,
    status: card.status,
    business_id: card.business_id,
    business_name: card.businesses?.name ?? "Unknown",
    created_at: card.created_at,
  }));

  return NextResponse.json({ cards });
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { business_id, type, name, business_details, branding, logic } = body;

  if (!business_id || !type || !name) {
    return NextResponse.json(
      { error: "business_id, type, and name are required" },
      { status: 400 }
    );
  }

  if (!["coupon", "stamp", "points"].includes(type)) {
    return NextResponse.json({ error: "Invalid card type" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("loyalty_cards")
    .insert({
      business_id,
      type,
      name,
      business_details: business_details ?? {},
      branding: branding ?? {},
      logic: logic ?? {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ card: data }, { status: 201 });
}
```

- [ ] **Step 2: Create card detail + update route**

Create `app/api/admin/cards/[id]/route.ts`:

```typescript
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;

  const { data, error } = await supabase
    .from("loyalty_cards")
    .select("*, businesses(name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({
    card: {
      ...data,
      business_name: (data as any).businesses?.name ?? "Unknown",
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;
  const body = await request.json();

  const allowedFields = [
    "business_id",
    "type",
    "name",
    "status",
    "business_details",
    "branding",
    "logic",
  ];
  const updates: Record<string, any> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("loyalty_cards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ card: data });
}
```

**Verification:** Run `npx tsc --noEmit`. Test with `curl` or browser: `GET /api/admin/cards` should return `{ cards: [] }`.

---

### Task 5: Cards List Page

**Files:**
- Create: `app/admin/cards/page.tsx`

- [ ] **Step 1: Create the cards list page**

Create `app/admin/cards/page.tsx`. This follows the exact same pattern as `app/admin/merchants/page.tsx` and `app/admin/invoices/page.tsx`: a `"use client"` component with `useState`/`useEffect`/`useCallback`, filter tabs, a table with inline styles using the brand colors.

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Card = {
  id: string;
  name: string;
  type: "coupon" | "stamp" | "points";
  status: "draft" | "active" | "archived";
  business_name: string;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "rgb(243,244,246)", text: "rgb(107,114,128)" },
  active: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  archived: { bg: "rgb(243,244,246)", text: "rgb(156,163,175)" },
};

const typeColors: Record<string, { bg: string; text: string }> = {
  coupon: { bg: "rgb(237,233,254)", text: "rgb(108,71,255)" },
  stamp: { bg: "rgb(254,243,199)", text: "rgb(180,83,9)" },
  points: { bg: "rgb(219,234,254)", text: "rgb(30,64,175)" },
};

const statusTabs = ["all", "draft", "active", "archived"] as const;

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]>("all");

  const fetchCards = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/cards${params}`);
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchCards();
  }, [fetchCards]);

  return (
    <div>
      {/* Header row with tabs and create button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activeTab === tab ? "rgb(11,5,29)" : "white",
                color: activeTab === tab ? "white" : "rgb(97,95,109)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push("/admin/cards/new")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "rgb(108,71,255)",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Create Card
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
            Loading...
          </div>
        ) : cards.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
            No cards found. Create your first loyalty card.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Merchant", "Type", "Status", "Created"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr
                  key={card.id}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer" }}
                  onClick={() => router.push(`/admin/cards/${card.id}`)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    <Link
                      href={`/admin/cards/${card.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {card.name}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>
                    {card.business_name}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: typeColors[card.type]?.bg ?? "rgb(249,248,245)",
                        color: typeColors[card.type]?.text ?? "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {card.type}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: statusColors[card.status]?.bg ?? "rgb(249,248,245)",
                        color: statusColors[card.status]?.text ?? "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                    {new Date(card.created_at).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

**Verification:** Navigate to `/admin/cards`, confirm the page renders with tabs and an empty state message. The "Create Card" button should link to `/admin/cards/new`.

---

### Task 6: CardPreview Component

**Files:**
- Create: `app/admin/components/CardPreview.tsx`

- [ ] **Step 1: Create CardPreview.tsx**

Create `app/admin/components/CardPreview.tsx`. This is a pure presentational component that renders a realistic Apple Wallet storeCard preview. It takes the builder form state as props and renders in real-time. Width is 320px, border-radius 16px, with a shadow. The component must handle all three card types with distinct visual layouts.

```typescript
"use client";

type CardPreviewProps = {
  type: "coupon" | "stamp" | "points";
  businessDetails: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    welcomeOffer: string;
  };
  branding: {
    logoUrl: string;
    heroImageUrl: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    cardStyle: string;
  };
  logic: any;
};

export default function CardPreview({
  type,
  businessDetails,
  branding,
  logic,
}: CardPreviewProps) {
  const bg = branding.backgroundColor || "#0B051D";
  const primary = branding.primaryColor || "#FFFFFF";
  const secondary = branding.secondaryColor || "#E6FFA9";
  const accent = branding.accentColor || "#6C47FF";
  const merchantName = businessDetails.name || "Business Name";

  return (
    <div
      style={{
        width: "320px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: bg,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
        fontFamily: "inherit",
        position: "relative",
      }}
    >
      {/* Top bar: logo + merchant name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 20px 12px",
        }}
      >
        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt="Logo"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: primary,
            }}
          >
            {merchantName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: primary,
              lineHeight: 1.2,
            }}
          >
            {merchantName}
          </div>
          {businessDetails.tagline && (
            <div
              style={{
                fontSize: "11px",
                color: secondary,
                opacity: 0.8,
                marginTop: "2px",
              }}
            >
              {businessDetails.tagline}
            </div>
          )}
        </div>
      </div>

      {/* Strip / hero area */}
      <div
        style={{
          width: "100%",
          height: "100px",
          backgroundColor: accent,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {branding.heroImageUrl ? (
          <img
            src={branding.heroImageUrl}
            alt="Hero"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${accent}, ${bg})`,
            }}
          />
        )}
      </div>

      {/* Type-specific content */}
      <div style={{ padding: "16px 20px" }}>
        {type === "coupon" && <CouponContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
        {type === "stamp" && <StampContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
        {type === "points" && <PointsContent logic={logic} primary={primary} secondary={secondary} accent={accent} />}
      </div>

      {/* Welcome offer */}
      {businessDetails.welcomeOffer && (
        <div
          style={{
            margin: "0 20px 12px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: `${secondary}22`,
            border: `1px solid ${secondary}44`,
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Welcome Offer
          </div>
          <div style={{ fontSize: "12px", color: primary, marginTop: "2px" }}>
            {businessDetails.welcomeOffer}
          </div>
        </div>
      )}

      {/* QR Code placeholder */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px 12px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "8px",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "4px",
              background: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 8px 8px",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 20px 14px",
          textAlign: "center",
          fontSize: "9px",
          color: primary,
          opacity: 0.35,
          letterSpacing: "0.3px",
        }}
      >
        Powered by Kyro
      </div>
    </div>
  );
}

function CouponContent({
  logic,
  primary,
  secondary,
  accent,
}: {
  logic: any;
  primary: string;
  secondary: string;
  accent: string;
}) {
  const offerTitle = logic?.offerTitle || "Special Offer";
  const offerDescription = logic?.offerDescription || "";
  const expiryDate = logic?.expiryDate || "";

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 800, color: primary, lineHeight: 1.2 }}>
        {offerTitle}
      </div>
      {offerDescription && (
        <div style={{ fontSize: "12px", color: primary, opacity: 0.7, marginTop: "6px" }}>
          {offerDescription}
        </div>
      )}
      {expiryDate && (
        <div
          style={{
            marginTop: "10px",
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: "6px",
            backgroundColor: `${accent}33`,
            fontSize: "11px",
            fontWeight: 600,
            color: secondary,
          }}
        >
          Expires {new Date(expiryDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      )}
    </>
  );
}

function StampContent({
  logic,
  primary,
  secondary,
  accent,
}: {
  logic: any;
  primary: string;
  secondary: string;
  accent: string;
}) {
  const total = logic?.totalStamps || 10;
  const icon = logic?.stampIcon || "\u2615";
  const reward = logic?.reward || "Free reward";
  const progressLabel = logic?.progressLabel || "collected";
  // Preview always shows 3 stamps filled for demo purposes
  const filled = 3;

  return (
    <>
      <div style={{ fontSize: "11px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
        {filled} / {total} {progressLabel}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(total, 5)}, 1fr)`,
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "50%",
              backgroundColor: i < filled ? `${accent}` : `${primary}15`,
              border: i < filled ? "none" : `1.5px dashed ${primary}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: i < filled ? "14px" : "10px",
            }}
          >
            {i < filled ? icon : ""}
          </div>
        ))}
      </div>
      <div style={{ fontSize: "11px", color: primary, opacity: 0.6 }}>
        Reward: {reward}
      </div>
    </>
  );
}

function PointsContent({
  logic,
  primary,
  secondary,
  accent,
}: {
  logic: any;
  primary: string;
  secondary: string;
  accent: string;
}) {
  const pointsLabel = logic?.pointsLabel || "Kyro Points";
  const pointsPerDollar = logic?.pointsPerDollar || 10;
  const tiers = logic?.rewardTiers || [];

  return (
    <>
      <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {pointsLabel}
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, color: primary, lineHeight: 1.1, marginTop: "4px" }}>
        0
      </div>
      <div style={{ fontSize: "11px", color: primary, opacity: 0.5, marginTop: "4px" }}>
        Earn {pointsPerDollar} {pointsLabel.toLowerCase()} per $1 spent
      </div>
      {tiers.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: secondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Rewards
          </div>
          {tiers.slice(0, 3).map((tier: { points: number; reward: string }, i: number) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0",
                borderBottom: i < Math.min(tiers.length, 3) - 1 ? `1px solid ${primary}15` : "none",
              }}
            >
              <span style={{ fontSize: "11px", color: primary, opacity: 0.7 }}>
                {tier.reward}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: accent,
                  backgroundColor: `${accent}22`,
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {tier.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

**Verification:** This component can be tested once it is imported by the builder page. It should render without errors and update visually when props change.

---

### Task 7: CardBuilderForm Component

**Files:**
- Create: `app/admin/components/CardBuilderForm.tsx`

- [ ] **Step 1: Create CardBuilderForm.tsx**

Create `app/admin/components/CardBuilderForm.tsx`. This is the largest component. It has 6 collapsible sections (each with a clickable header and expand/collapse state), manages a single `cardData` state object, and calls `onChange(cardData)` on every change. Uses `<input type="color">` for color pickers. Dynamic loyalty logic section changes based on card type.

The form props are:
```typescript
type CardBuilderFormProps = {
  initialData?: any;
  merchants: { id: string; name: string }[];
  onChange: (data: any) => void;
  onSave: (data: any) => Promise<void>;
  onPublish: (data: any) => Promise<void>;
  saving: boolean;
  publishing: boolean;
};
```

Key implementation details:

- State shape: `{ businessId, type, name, businessDetails: {...}, branding: {...}, logic: {...} }`
- Each section is a collapsible `<div>` with a header button toggling visibility
- Section header style: `padding: "14px 0"`, `borderBottom: "1px solid rgb(228,227,223)"`, bold label with a chevron icon
- All inputs use the existing inline style pattern: `border: "1px solid rgb(228,227,223)"`, `borderRadius: "8px"`, `padding: "10px 14px"`, `fontSize: "14px"`, `fontFamily: "inherit"`
- Color inputs: `<input type="color">` with a text label showing the hex value
- Card type toggle: 3 buttons, active one uses `backgroundColor: "rgb(108,71,255)"` and `color: "white"`
- Card style toggle: 3 buttons (Minimal / Image-heavy / Premium) same toggle pattern
- Category dropdown: `<select>` with options: cafe, restaurant, salon, barber, gym, bakery, retail, other
- When type changes, reset `logic` to defaults for that type
- Points type has a dynamic reward tiers list with add/remove functionality
- Stamp type has a number input (5-20) for total stamps, text input for emoji icon
- Bottom of form: two buttons: "Save as Draft" (secondary style) and "Publish" (purple primary style)
- `useEffect` calls `onChange(cardData)` whenever `cardData` changes
- If `initialData` is provided, populate state from it on mount

The full component is approximately 450-550 lines. Each section follows this pattern:

```typescript
{/* Section N: Title */}
<div>
  <button
    onClick={() => setOpenSections(s => ({ ...s, sectionKey: !s.sectionKey }))}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 0",
      background: "none",
      border: "none",
      borderBottom: "1px solid rgb(228,227,223)",
      cursor: "pointer",
      fontFamily: "inherit",
    }}
  >
    <span style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>
      Section Title
    </span>
    <ChevronDown size={16} style={{ transform: openSections.sectionKey ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "rgb(97,95,109)" }} />
  </button>
  {openSections.sectionKey && (
    <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* form fields */}
    </div>
  )}
</div>
```

Each input field uses a label + input pair:
```typescript
<div>
  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
    Field Label
  </label>
  <input
    type="text"
    value={value}
    onChange={(e) => updateField(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid rgb(228,227,223)",
      fontSize: "14px",
      fontFamily: "inherit",
      color: "rgb(11,5,29)",
      backgroundColor: "white",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
</div>
```

The points reward tiers section needs add/remove functionality:
```typescript
// Each tier row has: [number input for points] [text input for reward] [remove button]
// "Add tier" button at bottom
```

Import `ChevronDown` from `lucide-react`.

Default branding values:
- backgroundColor: `#0B051D`
- primaryColor: `#FFFFFF`
- secondaryColor: `#E6FFA9`
- accentColor: `#6C47FF`
- cardStyle: `premium`

Default logic by type:
- coupon: `{ offerTitle: "", offerDescription: "", expiryDate: "", conditions: "" }`
- stamp: `{ totalStamps: 10, stampIcon: "\u2615", reward: "", progressLabel: "collected" }`
- points: `{ pointsPerDollar: 10, pointsLabel: "Kyro Points", rewardTiers: [{ points: 100, reward: "" }], redemptionRules: "" }`

**Verification:** Import from the builder page and confirm all 6 sections expand/collapse, inputs are interactive, and type switching resets logic fields.

---

### Task 8: Card Builder Page (Create)

**Files:**
- Create: `app/admin/cards/new/page.tsx`

- [ ] **Step 1: Create the new card builder page**

Create `app/admin/cards/new/page.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";

type Merchant = { id: string; name: string };

export default function NewCardPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [previewData, setPreviewData] = useState<any>({
    type: "stamp",
    businessDetails: { name: "", category: "", tagline: "", description: "", welcomeOffer: "" },
    branding: {
      logoUrl: "",
      heroImageUrl: "",
      backgroundColor: "#0B051D",
      primaryColor: "#FFFFFF",
      secondaryColor: "#E6FFA9",
      accentColor: "#6C47FF",
      cardStyle: "premium",
    },
    logic: { totalStamps: 10, stampIcon: "\u2615", reward: "", progressLabel: "collected" },
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then((data) => {
        setMerchants(
          (data.merchants ?? []).map((m: any) => ({ id: m.id, name: m.name }))
        );
      })
      .catch(() => {});
  }, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: data.businessId,
          type: data.type,
          name: data.name,
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        router.push(`/admin/cards/${result.card.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: any) => {
    setPublishing(true);
    try {
      // Save first, then publish
      const createRes = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: data.businessId,
          type: data.type,
          name: data.name,
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
      if (createRes.ok) {
        const result = await createRes.json();
        const publishRes = await fetch(`/api/admin/cards/${result.card.id}/publish`, {
          method: "POST",
        });
        if (publishRes.ok) {
          const publishData = await publishRes.json();
          // Navigate to edit page where the published state is shown
          router.push(`/admin/cards/${result.card.id}`);
        }
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
        minHeight: "calc(100vh - 140px)",
      }}
    >
      {/* Left: Form (60%) */}
      <div style={{ flex: "0 0 58%", minWidth: 0 }}>
        <CardBuilderForm
          merchants={merchants}
          onChange={(data: any) => setPreviewData(data)}
          onSave={handleSave}
          onPublish={handlePublish}
          saving={saving}
          publishing={publishing}
        />
      </div>

      {/* Right: Preview (40%, sticky) */}
      <div
        style={{
          flex: "0 0 38%",
          position: "sticky",
          top: "104px",
          display: "flex",
          justifyContent: "center",
          paddingTop: "16px",
        }}
      >
        <CardPreview
          type={previewData.type || "stamp"}
          businessDetails={previewData.businessDetails || {}}
          branding={previewData.branding || {}}
          logic={previewData.logic || {}}
        />
      </div>
    </div>
  );
}
```

**Verification:** Navigate to `/admin/cards/new`. The split-screen layout should render. The form on the left and preview on the right should both be visible. Changing form values should update the preview in real-time.

---

### Task 9: Card Builder Page (Edit)

**Files:**
- Create: `app/admin/cards/[id]/page.tsx`

- [ ] **Step 1: Create the edit card builder page**

Create `app/admin/cards/[id]/page.tsx`. Same layout as new page but fetches existing card data and pre-populates the form. Uses PATCH for saves. Shows published state (share URL, QR code) if the card is active.

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";

type Merchant = { id: string; name: string };

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ shareUrl: string; qrCodeData: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/merchants").then((r) => r.json()),
      fetch(`/api/admin/cards/${cardId}`).then((r) => r.json()),
    ]).then(([merchantsData, cardData]) => {
      setMerchants(
        (merchantsData.merchants ?? []).map((m: any) => ({ id: m.id, name: m.name }))
      );
      if (cardData.card) {
        const card = cardData.card;
        const formData = {
          businessId: card.business_id,
          type: card.type,
          name: card.name,
          businessDetails: card.business_details || {},
          branding: card.branding || {},
          logic: card.logic || {},
        };
        setInitialData(formData);
        setPreviewData(formData);
        if (card.status === "active" && card.share_url) {
          setPublishResult({
            shareUrl: card.share_url,
            qrCodeData: card.qr_code_data || "",
          });
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [cardId]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: data.businessId,
          type: data.type,
          name: data.name,
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: any) => {
    setPublishing(true);
    try {
      // Save first
      await fetch(`/api/admin/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: data.businessId,
          type: data.type,
          name: data.name,
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
      // Then publish
      const publishRes = await fetch(`/api/admin/cards/${cardId}/publish`, {
        method: "POST",
      });
      if (publishRes.ok) {
        const result = await publishRes.json();
        setPublishResult(result);
      }
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Loading card...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Card not found.
      </div>
    );
  }

  return (
    <div>
      {/* Published state banner */}
      {publishResult && (
        <div
          style={{
            marginBottom: "24px",
            padding: "20px 24px",
            borderRadius: "12px",
            backgroundColor: "rgb(220,252,231)",
            border: "1px solid rgb(187,247,208)",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "12px" }}>
            Card Published
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "4px" }}>
                Share URL
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <code
                  style={{
                    fontSize: "13px",
                    color: "rgb(11,5,29)",
                    backgroundColor: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid rgb(187,247,208)",
                  }}
                >
                  {publishResult.shareUrl}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(publishResult.shareUrl)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgb(187,247,208)",
                    backgroundColor: "white",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            {publishResult.qrCodeData && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "4px" }}>
                  QR Code
                </div>
                <img
                  src={publishResult.qrCodeData}
                  alt="QR Code"
                  style={{ width: "80px", height: "80px", borderRadius: "8px", backgroundColor: "white", padding: "4px" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Builder layout */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <div style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm
            initialData={initialData}
            merchants={merchants}
            onChange={(data: any) => setPreviewData(data)}
            onSave={handleSave}
            onPublish={handlePublish}
            saving={saving}
            publishing={publishing}
          />
        </div>
        <div
          style={{
            flex: "0 0 38%",
            position: "sticky",
            top: "104px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "16px",
          }}
        >
          {previewData && (
            <CardPreview
              type={previewData.type || "stamp"}
              businessDetails={previewData.businessDetails || {}}
              branding={previewData.branding || {}}
              logic={previewData.logic || {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Verification:** Create a card via `/admin/cards/new`, then navigate to `/admin/cards/[id]`. The form should be pre-populated with saved data. Changes should save via PATCH.

---

### Task 10: Install qrcode package

- [ ] **Step 1: Install the dependency**

Run:
```bash
npm install qrcode @types/qrcode
```

**Verification:** `package.json` includes `qrcode` in dependencies. `@types/qrcode` in devDependencies. `npx tsc --noEmit` still passes.

---

### Task 11: Publish API Route

**Files:**
- Create: `app/api/admin/cards/[id]/publish/route.ts`

- [ ] **Step 1: Create the publish route**

Create `app/api/admin/cards/[id]/publish/route.ts`:

```typescript
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;

  // Verify card exists
  const { data: card, error: fetchError } = await supabase
    .from("loyalty_cards")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Generate share URL
  const origin = request.nextUrl.origin;
  const shareUrl = `${origin}/c/${id}`;

  // Generate QR code as data URL
  let qrCodeData: string;
  try {
    qrCodeData = await QRCode.toDataURL(shareUrl, {
      width: 256,
      margin: 2,
      color: { dark: "#0B051D", light: "#FFFFFF" },
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }

  // Update card: set active, save share_url + qr_code_data
  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({
      status: "active",
      share_url: shareUrl,
      qr_code_data: qrCodeData,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ shareUrl, qrCodeData });
}
```

**Verification:** Create a draft card, then POST to `/api/admin/cards/[id]/publish`. Confirm the response includes `shareUrl` and `qrCodeData` (a base64 data URL). Confirm the card status in the database changed to `active`.

---

### Task 12: Card Config to PassTemplate Mapper

**Files:**
- Create: `lib/wallet/generate.ts`

- [ ] **Step 1: Create the mapper**

Create `lib/wallet/generate.ts`:

```typescript
import { PassTemplate, PassType, PassField } from "./types";

type CardRow = {
  id: string;
  type: "coupon" | "stamp" | "points";
  business_details: {
    name?: string;
    category?: string;
    tagline?: string;
    description?: string;
    welcomeOffer?: string;
  };
  branding: {
    logoUrl?: string;
    heroImageUrl?: string;
    backgroundColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    cardStyle?: string;
  };
  logic: any;
};

const typeMap: Record<string, PassType> = {
  coupon: "discount",
  stamp: "stamp",
  points: "reward",
};

export function cardToPassTemplate(card: CardRow): PassTemplate {
  const passType = typeMap[card.type] || "reward";
  const merchantName = card.business_details.name || "Merchant";
  const description = card.business_details.description || card.business_details.tagline || `${merchantName} Loyalty Card`;

  // Convert hex colors to rgb() format for PassTemplate compatibility
  const bg = hexToRgb(card.branding.backgroundColor || "#0B051D");
  const fg = hexToRgb(card.branding.primaryColor || "#FFFFFF");
  const label = hexToRgb(card.branding.secondaryColor || "#E6FFA9");

  const headerFields: PassField[] = [];
  const primaryFields: PassField[] = [];
  const secondaryFields: PassField[] = [];
  const auxiliaryFields: PassField[] = [];
  const backFields: PassField[] = [];

  // Build fields based on card type
  if (card.type === "coupon") {
    const logic = card.logic || {};
    primaryFields.push({
      key: "offer",
      label: "OFFER",
      value: logic.offerTitle || "Special Offer",
    });
    if (logic.offerDescription) {
      secondaryFields.push({
        key: "details",
        label: "DETAILS",
        value: logic.offerDescription,
      });
    }
    if (logic.expiryDate) {
      headerFields.push({
        key: "expires",
        label: "EXPIRES",
        value: new Date(logic.expiryDate).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
    }
    if (logic.conditions) {
      backFields.push({
        key: "conditions",
        label: "CONDITIONS",
        value: logic.conditions,
      });
    }
  } else if (card.type === "stamp") {
    const logic = card.logic || {};
    const total = logic.totalStamps || 10;
    headerFields.push({
      key: "progress",
      label: "PROGRESS",
      value: `0 / ${total}`,
    });
    primaryFields.push({
      key: "stamps",
      label: `STAMPS UNTIL REWARD`,
      value: `${total} ${logic.progressLabel || "stamps"}`,
    });
    if (logic.reward) {
      secondaryFields.push({
        key: "reward",
        label: "REWARD",
        value: logic.reward,
      });
    }
    backFields.push({
      key: "howItWorks",
      label: "HOW IT WORKS",
      value: `Collect ${total} stamps to earn: ${logic.reward || "your reward"}. Card resets after redemption.`,
    });
  } else if (card.type === "points") {
    const logic = card.logic || {};
    headerFields.push({
      key: "balance",
      label: logic.pointsLabel || "POINTS",
      value: 0,
    });
    primaryFields.push({
      key: "earn",
      label: "EARN RATE",
      value: `${logic.pointsPerDollar || 10} pts per $1`,
    });
    if (logic.rewardTiers && logic.rewardTiers.length > 0) {
      const tiersText = logic.rewardTiers
        .map((t: { points: number; reward: string }) => `${t.points} pts = ${t.reward}`)
        .join("\n");
      backFields.push({
        key: "tiers",
        label: "REWARD TIERS",
        value: tiersText,
      });
    }
    if (logic.redemptionRules) {
      backFields.push({
        key: "rules",
        label: "REDEMPTION RULES",
        value: logic.redemptionRules,
      });
    }
  }

  // Welcome offer on back
  if (card.business_details.welcomeOffer) {
    backFields.push({
      key: "welcome",
      label: "WELCOME OFFER",
      value: card.business_details.welcomeOffer,
    });
  }

  // Powered by Kyro
  backFields.push({
    key: "powered",
    label: "POWERED BY",
    value: "Kyro - https://kyro.com",
  });

  return {
    type: passType,
    merchantName,
    merchantId: card.id,
    logoText: merchantName,
    description,
    backgroundColor: bg,
    foregroundColor: fg,
    labelColor: label,
    headerFields,
    primaryFields,
    secondaryFields,
    auxiliaryFields,
    backFields,
    barcodeFormat: "QR",
    barcodeValue: `KYRO-${card.type.toUpperCase()}-${card.id.slice(0, 8)}`,
    stripImagePath: "/wallet/strip-stamp.png", // fallback; ideally use heroImageUrl
  };
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgb(${r},${g},${b})`;
}
```

**Verification:** `npx tsc --noEmit` passes. The mapper correctly converts all three card types to PassTemplate objects with appropriate fields.

---

### Task 13: Wallet Pass API Routes (Apple + Google by card ID)

**Files:**
- Create: `app/api/wallet/apple/card/[id]/route.ts`
- Create: `app/api/wallet/google/card/[id]/route.ts`

- [ ] **Step 1: Create Apple pass route for cards**

Create `app/api/wallet/apple/card/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cardToPassTemplate } from "@/lib/wallet/generate";
import { generateApplePass, areCertificatesAvailable } from "@/lib/wallet/apple";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!areCertificatesAvailable()) {
    return NextResponse.json(
      {
        error: "Apple Wallet certificates not configured",
        setup: "See docs/wallet-setup.md for certificate setup instructions",
      },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();
  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  try {
    const template = cardToPassTemplate(card as any);
    const buffer = await generateApplePass(template);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="kyro-${card.type}-${id.slice(0, 8)}.pkpass"`,
      },
    });
  } catch (err) {
    console.error("Apple pass generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate Apple Wallet pass" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create Google pass route for cards**

Create `app/api/wallet/google/card/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cardToPassTemplate } from "@/lib/wallet/generate";
import { generateGoogleWalletUrl, areGoogleCredentialsAvailable } from "@/lib/wallet/google";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!areGoogleCredentialsAvailable()) {
    return NextResponse.json(
      {
        error: "Google Wallet credentials not configured",
        setup: "See docs/wallet-setup.md for credential setup instructions",
      },
      { status: 503 }
    );
  }

  const supabase = createAdminClient();
  const { data: card, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !card) {
    return NextResponse.json({ error: "Card not found or not active" }, { status: 404 });
  }

  try {
    const template = cardToPassTemplate(card as any);
    const origin = req.nextUrl.origin;
    const saveUrl = generateGoogleWalletUrl(template, origin);
    return NextResponse.json({ url: saveUrl });
  } catch (err) {
    console.error("Google pass generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate Google Wallet pass" },
      { status: 500 }
    );
  }
}
```

**Verification:** Publish a card, then test `GET /api/wallet/apple/card/[id]` and `GET /api/wallet/google/card/[id]`. Apple should return a `.pkpass` buffer (or a 503 if certs are missing). Google should return a `{ url }` JSON (or 503 if credentials are missing).

---

### Task 14: Public Card Page

**Files:**
- Create: `app/c/[id]/page.tsx`

- [ ] **Step 1: Create the public card landing page**

Create `app/c/[id]/page.tsx`. This is a server component (or client component that fetches on mount). It uses the service role client directly (no auth). Mobile-optimized, full-bleed design.

```typescript
"use client";

import { useState, useEffect } from "react";
import CardPreview from "../../admin/components/CardPreview";

export default function PublicCardPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/cards/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setCard(data.card);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(11,5,29)",
          color: "white",
          fontFamily: "inherit",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error || !card) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(11,5,29)",
          color: "white",
          fontFamily: "inherit",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 600 }}>Card not found</div>
        <div style={{ fontSize: "14px", opacity: 0.5 }}>This card may have been removed or is not yet published.</div>
      </div>
    );
  }

  const bg = card.branding?.backgroundColor || "#0B051D";
  const merchantName = card.business_details?.name || "Merchant";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "inherit",
      }}
    >
      {/* Card preview */}
      <div style={{ marginBottom: "32px" }}>
        <CardPreview
          type={card.type}
          businessDetails={card.business_details || {}}
          branding={card.branding || {}}
          logic={card.logic || {}}
        />
      </div>

      {/* Wallet buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "320px",
          maxWidth: "100%",
        }}
      >
        <a
          href={`/api/wallet/apple/card/${id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 24px",
            borderRadius: "12px",
            backgroundColor: "black",
            color: "white",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="white">
            <path d="M15.5 1.5c-1.8 0-3.3.8-4.3 1.4C10.2 2 8.6 1.5 7.5 1.5 3.5 1.5 0 5 0 9.5c0 5.5 5 12 8 14 .5.3 1 .5 1.5.5h1c.5 0 1-.2 1.5-.5 3-2 8-8.5 8-14 0-4.5-3-8-4.5-8z" />
          </svg>
          Add to Apple Wallet
        </a>
        <a
          href={`/api/wallet/google/card/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 24px",
            borderRadius: "12px",
            backgroundColor: "white",
            color: "rgb(11,5,29)",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="4" fill="#4285F4" />
            <path d="M10 5l3 5H7l3-5z" fill="white" />
          </svg>
          Add to Google Wallet
        </a>
      </div>

      {/* Kyro branding */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "12px",
          color: "white",
          opacity: 0.3,
          textAlign: "center",
        }}
      >
        Powered by Kyro
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create public cards API route**

Create `app/api/public/cards/[id]/route.ts` (a public, no-auth endpoint that returns card data for the landing page):

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const { id } = params;

  const { data, error } = await supabase
    .from("loyalty_cards")
    .select("id, type, business_details, branding, logic, status")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({ card: data });
}
```

Note: The Google Wallet button should link to `/api/wallet/google/card/[id]` but that returns JSON with `{ url }`. The public page should fetch the Google URL and redirect. This can be handled by making the Google button an `onClick` handler that fetches the URL and does `window.location.href = url`. Update the Google button in the public page to:

```typescript
<button
  onClick={async () => {
    const res = await fetch(`/api/wallet/google/card/${id}`);
    if (res.ok) {
      const data = await res.json();
      window.open(data.url, "_blank");
    }
  }}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px 24px",
    borderRadius: "12px",
    backgroundColor: "white",
    color: "rgb(11,5,29)",
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    width: "100%",
  }}
>
  Add to Google Wallet
</button>
```

**Verification:** Publish a card, open the share URL in a browser. The landing page should show the card preview with wallet buttons. Apple button downloads a `.pkpass`. Google button opens a Google Pay save URL.

---

### Task 15: Type-Check Verification

- [ ] **Step 1: Run type checker**

```bash
npx tsc --noEmit
```

Fix any type errors across all new files.

- [ ] **Step 2: Manual integration test**

Walk through the full flow:
1. Navigate to `/admin/cards` -- see empty list
2. Click "Create Card" -- builder loads with split-screen
3. Select a merchant, choose "stamp" type, fill all sections
4. Verify preview updates in real-time
5. Click "Save as Draft" -- redirects to edit page
6. Verify card appears in list with "draft" status
7. Open card for editing -- form is pre-populated
8. Click "Publish" -- share URL and QR code appear
9. Open share URL in new tab -- public card page loads
10. Click "Add to Apple Wallet" -- downloads `.pkpass` (or shows cert error)
11. Click "Add to Google Wallet" -- opens Google Pay URL (or shows config error)

---

## Dependencies Between Tasks

```
Task 1 (Migration) ──> Task 2 (Types) ──> Task 4 (API) ──> Task 5 (List Page)
                                                        ──> Task 8 (Create Page) ──> Task 9 (Edit Page)
Task 3 (Sidebar) -- independent, can run in parallel with Task 2
Task 6 (CardPreview) ──> Task 8 (Create Page)
Task 7 (CardBuilderForm) ──> Task 8 (Create Page)
Task 10 (qrcode install) ──> Task 11 (Publish Route)
Task 12 (Mapper) ──> Task 13 (Wallet Routes)
Task 13 (Wallet Routes) ──> Task 14 (Public Page)
Task 15 depends on all prior tasks
```

**Parallelizable groups:**
- Group A: Task 1, Task 3, Task 10 (all independent)
- Group B: Task 2, Task 6, Task 7 (all independent after Group A)
- Group C: Task 4, Task 12 (after Task 2)
- Group D: Task 5, Task 8, Task 11, Task 13 (after Group C)
- Group E: Task 9, Task 14 (after Group D)
- Group F: Task 15 (after all)

---

### Critical Files for Implementation
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/admin/components/CardBuilderForm.tsx` (largest new component, ~500 lines, manages all form state)
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/admin/components/CardPreview.tsx` (complex visual component rendering 3 card type layouts)
- `/Users/yassineessabar/Documents/GitHub/fidely-card/lib/wallet/generate.ts` (mapper bridging card config to existing wallet infrastructure)
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/api/admin/cards/route.ts` (CRUD foundation all pages depend on)
- `/Users/yassineessabar/Documents/GitHub/fidely-card/supabase/migrations/0003_loyalty_cards.sql` (database schema, blocks everything)
