# Wallet Pass Generation — Design Spec

## Goal

Build end-to-end Apple Wallet (.pkpass) and Google Wallet pass generation for Fidely's 4 loyalty card types. Merchant-agile: each merchant configures their own design, the 4 Fidely-branded demos serve as working templates.

## 4 Pass Types

| Type | Apple Pass Style | Header Fields | Primary Fields | Secondary Fields | Barcode |
|------|-----------------|---------------|----------------|------------------|---------|
| **Discount** | `storeCard` | — | Discount % | Discount Status (tier) | PDF417 |
| **Reward** | `storeCard` | Balance (points) | Reward ($X OFF) | Till Next Reward | PDF417 |
| **Stamp** | `storeCard` | Valid Until | Stamps Until Reward | Available Rewards | QR |
| **Cashback** | `storeCard` | Points | Cashback % | Cashback Status | PDF417 |

All passes share: Fidely logo, purple gradient strip image, "Powered by Fidely" back field, merchant name as org.

## Architecture

```
app/
  wallet/
    page.tsx                    ← Preview page: 4 demo cards with Add to Wallet buttons
    components/
      PassCard.tsx              ← Reusable pass preview card component
      AddToWalletButtons.tsx    ← Apple + Google wallet buttons
  api/
    wallet/
      apple/
        [type]/
          route.ts              ← GET: generates .pkpass, returns binary download
      google/
        [type]/
          route.ts              ← GET: returns redirect to Google Wallet save link
lib/
  wallet/
    types.ts                    ← PassTemplate, MerchantConfig, PassData interfaces
    apple.ts                    ← Apple .pkpass generation logic
    google.ts                   ← Google Wallet JWT generation logic
    templates.ts                ← 4 Fidely demo template configs
    assets.ts                   ← Logo, icon, strip image paths
```

## Pass Template Config (Merchant-Agile)

```typescript
interface PassTemplate {
  type: 'discount' | 'reward' | 'stamp' | 'cashback'
  merchantName: string
  merchantId: string
  // Design
  logoText: string
  backgroundColor: string     // e.g. "rgb(192,132,252)" purple
  foregroundColor: string      // text color
  labelColor: string           // label text color
  stripImageUrl?: string       // header banner image
  logoUrl?: string             // merchant logo
  // Fields (vary by type)
  fields: Record<string, string | number>
  // Barcode
  barcodeType: 'PKBarcodeFormatQR' | 'PKBarcodeFormatPDF417'
  barcodeValue: string
}
```

Each merchant creates their own PassTemplate. The 4 Fidely demos are hardcoded templates with Fidely branding.

## Apple Wallet (.pkpass) Generation

**Library:** `passkit-generator`

**Flow:**
1. API route receives pass type + optional customer data via query params
2. Load template config for that type
3. Build pass.json with fields, colors, barcode
4. Sign with Apple certificates (Pass Type ID cert + WWDR)
5. Return `.pkpass` as `application/vnd.apple.pkpass`

**Certificate Setup (env vars):**
```
APPLE_PASS_TYPE_ID=pass.com.fidely.loyalty
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_PASS_CERT_PATH=./certs/pass.p12
APPLE_PASS_CERT_PASSWORD=xxxxx
APPLE_WWDR_CERT_PATH=./certs/wwdr.pem
```

**Pass Structure:**
- `formatVersion`: 2
- `passTypeIdentifier`: from env
- `teamIdentifier`: from env
- `organizationName`: merchant name or "Fidely"
- `serialNumber`: unique per pass
- `description`: pass description
- `storeCard`: field structure varies by type
- `barcode`: QR or PDF417
- Colors: `backgroundColor`, `foregroundColor`, `labelColor`
- Images: `icon.png`, `logo.png`, `strip.png` (the banner image)

## Google Wallet Pass Generation

**Approach:** Google Wallet API with JWT

**Flow:**
1. API route receives pass type
2. Build LoyaltyClass + LoyaltyObject JSON
3. Sign JWT with Google service account
4. Return `https://pay.google.com/gp/v/save/{jwt}` redirect URL

**Service Account Setup (env vars):**
```
GOOGLE_WALLET_ISSUER_ID=xxxxxxxxxxxx
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_WALLET_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

**Class/Object Structure:**
- `LoyaltyClass`: defines the pass template (colors, logo, fields layout)
- `LoyaltyObject`: instance with specific values (points, tier, barcode)

## Frontend: /wallet Preview Page

Shows 4 pass cards in a grid, each matching the Boomerang screenshot style but Fidely-branded:
- Purple background card with strip image
- Fidely logo top-left
- Type-specific fields (discount %, points balance, stamp grid, cashback %)
- Barcode/QR at bottom
- "Powered by Fidely" footer
- Two buttons: "Add to Apple Wallet" + "Add to Google Wallet"

The `PassCard` component is reusable — takes a `PassTemplate` and renders the preview. Same component merchants will use in the dashboard to preview their custom designs.

## Fidely Demo Branding

- **Primary color:** Purple (`rgb(168,85,247)` / `#a855f7`)
- **Background:** Light lavender (`rgb(243,232,255)`)
- **Text:** Dark (`rgb(11,5,29)`)
- **Labels:** Purple (`rgb(147,51,234)`)
- **Logo:** Fidely SVG logo
- **Strip images:** Purple gradient banners with type-specific imagery (generated as static PNGs in `/public/wallet/`)
- **Font:** System default (Apple/Google Wallet don't support custom fonts in passes)

## Demo Pass Data

**Discount:**
- Merchant: "Fidely Pharmacy"
- Strip: "5% OFF FOR EVERYTHING IN OUR PHARMACY" + pill illustration
- Discount Percentage: 5%
- Discount Status: Bronze

**Reward:**
- Merchant: "Fidely Deli"
- Strip: "COLLECT POINTS GET REWARDS" + sandwich illustration
- Balance: 23
- Reward: $15 OFF
- Till Next Reward: 17

**Stamp:**
- Merchant: "Fidely Coffee"
- Strip: Coffee cup stamp grid (1 filled, 9 empty)
- Valid Until: 04/12/2027
- Stamps Until Reward: 9 stamps
- Available Rewards: 0 rewards

**Cashback:**
- Merchant: "Fidely Sushi"
- Strip: "SPEND MORE EARN MORE" + sushi illustration
- Points: 0.00
- Cashback Percentage: 5%
- Cashback Status: Starter

## Dependencies to Add

```json
{
  "passkit-generator": "^3.x",    // Apple .pkpass generation
  "jsonwebtoken": "^9.x",         // Google Wallet JWT signing
  "uuid": "^9.x"                  // Serial number generation
}
```

## Certificate Placeholder Strategy

For the demo to work without real certs:
- Apple: Code is fully wired, but returns a friendly error if certs are missing. The preview page works regardless.
- Google: Same — JWT signing needs real service account, graceful fallback.
- Include a `/docs/wallet-setup.md` with step-by-step cert setup instructions.

## File Count

- `lib/wallet/types.ts` — interfaces
- `lib/wallet/templates.ts` — 4 demo configs
- `lib/wallet/apple.ts` — Apple pass builder
- `lib/wallet/google.ts` — Google Wallet builder
- `app/api/wallet/apple/[type]/route.ts` — Apple API
- `app/api/wallet/google/[type]/route.ts` — Google API
- `app/wallet/page.tsx` — preview page
- `app/wallet/components/PassCard.tsx` — pass card component
- `app/wallet/components/AddToWalletButtons.tsx` — wallet buttons
- 4 strip images in `public/wallet/`
- `docs/wallet-setup.md` — cert setup guide
- **Total: ~12 files**
