# Loyalty Card Builder — Design Spec

## Context

Admins need to create branded loyalty cards for demo merchants. The existing wallet pass infrastructure (Apple/Google) generates passes from hardcoded templates. This feature adds a visual card builder in the admin panel that lets admins configure cards per merchant, preview them live, publish with wallet passes, and generate share links + QR codes for real usage. Branding is Kyro throughout.

## Database

### New table: `loyalty_cards`

```sql
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
```

Migration: `supabase/migrations/0003_loyalty_cards.sql`

RLS: Admin-only access (same pattern as signup_applications).

### JSONB schemas

**business_details:**
```json
{
  "name": "Café Bloom",
  "category": "cafe",
  "tagline": "Your daily brew",
  "description": "Artisan coffee in Melbourne CBD",
  "welcomeOffer": "First coffee free"
}
```

**branding:**
```json
{
  "logoUrl": "https://...",
  "heroImageUrl": "https://...",
  "backgroundColor": "#0B051D",
  "primaryColor": "#FFFFFF",
  "secondaryColor": "#E6FFA9",
  "accentColor": "#6C47FF",
  "cardStyle": "premium"
}
```

**logic (coupon):**
```json
{
  "offerTitle": "20% Off Everything",
  "offerDescription": "Valid on all menu items",
  "expiryDate": "2026-06-30",
  "conditions": "One per customer. Not combinable."
}
```

**logic (stamp):**
```json
{
  "totalStamps": 10,
  "stampIcon": "☕",
  "reward": "Free coffee of your choice",
  "progressLabel": "coffees collected"
}
```

**logic (points):**
```json
{
  "pointsPerDollar": 10,
  "rewardTiers": [
    { "points": 100, "reward": "Free small coffee" },
    { "points": 250, "reward": "Free large coffee" },
    { "points": 500, "reward": "Free meal" }
  ],
  "pointsLabel": "Kyro Points",
  "redemptionRules": "Points expire after 12 months of inactivity"
}
```

## Admin Pages

### 1. Cards List (`/admin/cards`)

- Add "Cards" to AdminSidebar nav (CreditCard icon, between Merchants and Invoices)
- Table: Name, Merchant, Type, Status, Created, Actions
- "Create Card" button top-right → `/admin/cards/new`
- Status badges: gray (draft), green (active), muted (archived)
- Type badges: color-coded (coupon = purple, stamp = amber, points = blue)
- Click row → `/admin/cards/[id]` (edit)

Fetches from `GET /api/admin/cards`.

### 2. Card Builder (`/admin/cards/new` and `/admin/cards/[id]`)

Split-screen layout:
- **Left panel (60%):** Scrollable configuration form
- **Right panel (40%):** Sticky live preview at top of viewport

Both create and edit use the same builder component. Edit pre-populates from API.

#### Configuration Sections (left panel)

**Section 1: Merchant**
- Dropdown of all businesses (fetched from GET /api/admin/merchants)
- Required. Sets `business_id`.

**Section 2: Card Type**
- 3 toggle buttons: Coupon / Stamp / Points
- Changing type resets the Logic section to defaults for that type
- Required.

**Section 3: Card Name**
- Text input. Internal reference name for the admin (e.g. "Café Bloom Summer Promo")

**Section 4: Business Details**
- Business name (text, pre-filled from selected merchant)
- Category (select: cafe, restaurant, salon, barber, gym, bakery, retail, other)
- Tagline (text)
- Description (textarea)
- Welcome offer (text)

**Section 5: Branding**
- Logo URL (text input — paste URL)
- Hero image URL (text input — paste URL)
- Background color (color picker input)
- Primary text color (color picker input)
- Secondary text color (color picker input)
- Accent color (color picker input)
- Card style (3 toggle buttons: Minimal / Image-heavy / Premium)

Color pickers default to Kyro brand colors:
- Background: `#0B051D`
- Primary: `#FFFFFF`
- Secondary: `#E6FFA9`
- Accent: `#6C47FF`

**Section 6: Loyalty Logic (dynamic by type)**

*Coupon:*
- Offer title (text)
- Offer description (textarea)
- Expiry date (date input)
- Conditions (textarea)

*Stamp:*
- Total stamps required (number input, 5-20, default 10)
- Stamp icon (text input for emoji, default "☕")
- Reward description (text)
- Progress label (text, default "collected")

*Points:*
- Points per dollar (number input, default 10)
- Points label (text, default "Kyro Points")
- Reward tiers (dynamic list — add/remove rows, each with points threshold + reward text)
- Redemption rules (textarea)

#### Live Preview (right panel)

A `CardPreview` component rendering a realistic Apple Wallet-style card:

- Top section: logo (or placeholder) + merchant name
- Color strip matching background color
- Type-specific content area:
  - Coupon: offer title large, description, expiry badge
  - Stamp: grid of stamp slots (filled vs empty) with stamp icon
  - Points: balance display, current tier, next tier progress
- Bottom: QR code placeholder
- "Powered by Kyro" footer

Updates in real-time as form values change (React state, no API calls).

#### Actions

- **Save as Draft** — saves card config, status = 'draft'
- **Publish** — saves + publishes (generates wallet passes, share link, QR). Shows success modal with:
  - Share URL (copyable)
  - QR code (downloadable)
  - "Add to Apple Wallet" test link
  - "Add to Google Wallet" test link

### 3. Edit Card (`/admin/cards/[id]`)

Same builder, fetches existing card from `GET /api/admin/cards/[id]`, pre-populates form. Can re-publish to regenerate passes.

## API Routes

### `GET /api/admin/cards`

Returns all loyalty_cards joined with business name. Optional `?status=draft|active|archived` filter.

### `POST /api/admin/cards`

Creates a new card. Body: `{ business_id, type, name, business_details, branding, logic }`. Returns saved card. Status defaults to 'draft'.

### `GET /api/admin/cards/[id]`

Returns single card with full config.

### `PATCH /api/admin/cards/[id]`

Updates card fields. Body: partial card object.

### `POST /api/admin/cards/[id]/publish`

1. Updates status to 'active'
2. Generates share URL: `{origin}/c/{card_id}`
3. Generates QR code encoding the share URL (using `qrcode` npm package, returns data URL)
4. Saves share_url and qr_code_data to the card row
5. Returns `{ shareUrl, qrCodeData }`

Wallet passes are generated on-the-fly when customers visit the share link (not pre-generated).

## Public Card Page (`/c/[id]`)

Route: `app/c/[id]/page.tsx`

This is the customer-facing page when someone scans the QR or clicks the share link.

1. Loads card config from `loyalty_cards` table (using service role client — public page, no auth)
2. Renders a branded landing page:
   - Merchant logo + name
   - Card type indicator
   - Card preview (same CardPreview component, server-rendered)
   - "Add to Apple Wallet" button → `/api/wallet/apple/card/[id]`
   - "Add to Google Wallet" button → `/api/wallet/google/card/[id]`
3. Mobile-optimized, full-bleed design

### Wallet Pass Generation from Card Config

New API routes for generating passes from a specific card's config:

**`GET /api/wallet/apple/card/[id]`** — Generates `.pkpass` using the card's branding and logic (extends existing apple.ts). Maps card config → PassTemplate format, then uses existing generation flow.

**`GET /api/wallet/google/card/[id]`** — Generates Google Wallet save URL from card config. Same mapping approach.

New helper: `lib/wallet/generate.ts` — maps a `loyalty_cards` row into a `PassTemplate` object compatible with the existing `generateApplePass()` and `generateGoogleWalletUrl()` functions.

## Sidebar Update

Add to AdminSidebar nav items (between Merchants and Invoices):
```
{ label: "Cards", href: "/admin/cards", icon: CreditCard }
```

Update AdminShell titleMap:
```
"/admin/cards": "Cards",
"/admin/cards/new": "Card Builder",
```
For `/admin/cards/[id]`: title = "Edit Card"

## File Structure

### Create
| File | Responsibility |
|------|---------------|
| `supabase/migrations/0003_loyalty_cards.sql` | New table + enum + RLS |
| `app/admin/cards/page.tsx` | Cards list page |
| `app/admin/cards/new/page.tsx` | Card builder (create) |
| `app/admin/cards/[id]/page.tsx` | Card builder (edit) |
| `app/admin/components/CardPreview.tsx` | Live wallet card preview |
| `app/admin/components/CardBuilderForm.tsx` | Configuration form |
| `app/api/admin/cards/route.ts` | GET list, POST create |
| `app/api/admin/cards/[id]/route.ts` | GET detail, PATCH update |
| `app/api/admin/cards/[id]/publish/route.ts` | POST publish |
| `app/c/[id]/page.tsx` | Public card landing page |
| `app/api/wallet/apple/card/[id]/route.ts` | Apple pass from card config |
| `app/api/wallet/google/card/[id]/route.ts` | Google pass from card config |
| `lib/wallet/generate.ts` | Card config → PassTemplate mapper |

### Modify
| File | Change |
|------|--------|
| `app/admin/components/AdminSidebar.tsx` | Add "Cards" nav item |
| `app/admin/components/AdminShell.tsx` | Add cards titles to titleMap |
| `lib/supabase/database.types.ts` | Add loyalty_cards types + new enums |

## NPM Dependencies

- `qrcode` — QR code generation for share URLs (`npm install qrcode @types/qrcode`)

## Verification

1. Admin navigates to /admin/cards → sees empty cards list
2. Clicks "Create Card" → builder opens with split-screen layout
3. Selects merchant, type, fills business details + branding + logic
4. Live preview updates in real-time
5. Saves as draft → card appears in list with "draft" status
6. Opens card for editing → form pre-populated
7. Clicks Publish → share URL + QR generated, status becomes "active"
8. Opens share URL in browser → public branded card page renders
9. "Add to Apple Wallet" downloads .pkpass file
10. "Add to Google Wallet" opens Google Pay save URL
11. QR code encodes the correct share URL
