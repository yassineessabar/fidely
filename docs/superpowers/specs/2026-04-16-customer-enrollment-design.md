# Customer Enrollment & Merchant Scan Flow

## Problem

Currently `/c/{cardId}` shows a card page with an "Add to Wallet" button. Every customer gets the same generic pass with the same QR code. There's no way to:
- Collect customer information
- Track individual customers per card
- Let merchants scan a customer's QR to update stamps/points

## Solution

Add a sign-up form before wallet download, create per-customer enrollments with unique QR codes, and provide a scan page for merchants to update card progress.

## Full Loop

1. **Merchant** creates card in admin, publishes it, gets a QR code linking to `/c/{cardId}`
2. **Customer** scans QR or opens link, fills sign-up form (name, email, phone, DOB)
3. System creates enrollment, generates unique membership code, returns pkpass immediately
4. Customer adds pass to Apple/Google Wallet — pass has unique QR with their membership code
5. **Merchant** scans customer's QR code on next visit
6. Scan page shows customer info + card status, merchant taps to add stamp/points or redeem
7. Repeat step 5-6 on each visit

---

## Database

### New table: `card_enrollments`

```sql
CREATE TYPE public.enrollment_status AS ENUM ('active', 'redeemed', 'expired');

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
```

The `membership_code` format is `KYRO-MBR-{first 8 chars of enrollment UUID}`, e.g. `KYRO-MBR-A3F7B2C1`.

### Existing tables — no changes

- `loyalty_cards` — unchanged, still defines the card template
- `customers` — not used for this flow (enrollments are self-contained per card)

---

## API Endpoints

### POST `/api/enroll/{cardId}`

Public endpoint, no auth required.

**Request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+61412345678",
  "dob": "1990-05-15"
}
```

**Logic:**
1. Validate card exists and is active
2. Check if email already enrolled for this card
   - If yes: regenerate and return the pkpass (re-download)
3. Generate enrollment with unique `membership_code`
4. Generate pkpass with:
   - QR code value = `KYRO-MBR-{enrollmentId short}`
   - Customer name in pass fields
   - Current progress (0 stamps, 0 points, etc.)
5. Return pkpass binary with `Content-Type: application/vnd.apple.pkpass`

**Response:** Raw pkpass binary (on success) or JSON error.

### POST `/api/scan/{membershipCode}`

Public endpoint (no merchant auth for now).

**Request body:**
```json
{
  "action": "add_stamp" | "add_points" | "redeem",
  "amount": 25.00  // only for add_points
}
```

**Logic by card type:**

**Stamp cards (`add_stamp`):**
1. Increment `stamps_collected` by 1
2. If `stamps_collected >= card.logic.totalStamps`: flag reward earned
3. Return updated enrollment + reward status

**Points cards (`add_points`):**
1. Calculate points: `amount * card.logic.pointsPerDollar`
2. Add to `points_balance`
3. Check against `card.logic.rewardTiers` for earned rewards
4. Return updated enrollment + any rewards earned

**Coupon cards (`redeem`):**
1. Set `status = 'redeemed'`
2. Return updated enrollment

**Response:**
```json
{
  "enrollment": { "id": "...", "customer_name": "...", "stamps_collected": 4, ... },
  "card": { "type": "stamp", "logic": { "totalStamps": 6, "reward": "Free facial" } },
  "reward_earned": false,
  "message": "Stamp added! 4/6 collected."
}
```

### GET `/api/scan/{membershipCode}`

Public endpoint. Returns enrollment + card info for display.

**Response:**
```json
{
  "enrollment": { ... },
  "card": { "type": "stamp", "name": "...", "business_details": { ... }, "branding": { ... }, "logic": { ... } }
}
```

---

## Pages

### `/c/{cardId}` — Customer Sign-Up Form

Replaces the current direct wallet page.

**Layout:**
- Merchant branding at top (logo, name, tagline, colors)
- Card type badge
- Card details (reward info, how it works)
- Sign-up form: name, email, phone, date of birth
- Submit button styled with merchant's accent color
- Footer: "Powered by Kyro"

**On submit:**
- POST to `/api/enroll/{cardId}`
- Response is pkpass binary
- Create a Blob URL and trigger download via `window.location.href`
- On iOS Safari this opens the "Add to Wallet" dialog directly

**Already enrolled:**
- If the API returns that email is already enrolled, re-download the pass
- Show a brief message: "Welcome back! Here's your pass."

### `/scan/{membershipCode}` — Merchant Scan Page

**Layout:**
- Customer info header (name, member since)
- Card progress display:
  - Stamp: visual stamp grid showing collected/total, reward info
  - Points: current balance, earn rate, next reward tier
  - Coupon: active/redeemed status
- Action button(s):
  - Stamp: "+1 Stamp" button
  - Points: dollar amount input + "Add Points" button
  - Coupon: "Redeem" button
- Confirmation toast/animation after action
- If reward threshold reached: prominent "Reward Earned!" display with reset option

**Branding:** Uses the card's merchant branding (colors, logo).

---

## Wallet Pass Changes

### Per-enrollment pass content

- `serialNumber` = enrollment UUID
- `barcodes[0].message` = `KYRO-MBR-{first 8 of enrollment UUID}`
- Customer name shown in pass fields:
  - Stamp: headerFields shows "STAMPS 0/6", auxiliaryFields shows customer name
  - Points: headerFields shows "POINTS 0", auxiliaryFields shows customer name
  - Coupon: auxiliaryFields shows customer name

### Colors and branding

Same as current: uses card's `branding.backgroundColor`, `branding.primaryColor`, `branding.labelColor`, `branding.accentColor`, and `branding.logoUrl`.

---

## Edge Cases

- **Duplicate email per card:** Return existing enrollment's pass (re-download), don't create duplicate
- **Card not active:** Return 404 on enroll attempt
- **Stamps exceed total:** Cap at totalStamps, flag reward earned
- **Points negative:** Don't allow negative amounts in add_points
- **Coupon already redeemed:** Return error on second redeem attempt
- **Reward reset (stamps):** After merchant confirms reward redeemed, reset `stamps_collected` to 0

---

## Out of Scope (Future)

- Merchant authentication for scan page
- Push notifications for pass updates
- Customer login / account portal
- Cross-merchant customer profiles
- Google Wallet enrollment flow (Apple only for now)
- Analytics dashboard for merchants
