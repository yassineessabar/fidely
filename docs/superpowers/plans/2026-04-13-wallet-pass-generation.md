# Wallet Pass Generation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build end-to-end Apple Wallet (.pkpass) and Google Wallet pass generation for 4 loyalty card types (Discount, Reward, Stamp, Cashback) with Kyro branding, agile for per-merchant customization.

**Architecture:** Next.js API routes generate passes on-the-fly from template configs. `lib/wallet/` holds shared generation logic. `app/wallet/` is the demo preview page. Each merchant will eventually supply their own config; the 4 Kyro demos are hardcoded presets. Apple passes use `passkit-generator` (PKPass constructor with buffers). Google passes use JWT signing with `jsonwebtoken`.

**Tech Stack:** Next.js 14.2 (App Router), passkit-generator v3, jsonwebtoken v9, uuid v9, TypeScript

**Existing codebase notes:**
- Font: KlarnaText (body) + KlarnaTitle (display), loaded in `app/layout.tsx` via `next/font/local`
- CSS vars defined in `app/globals.css`: `--dark: rgb(11,5,29)`, `--purple-mid: rgb(170,137,242)`, etc.
- Existing card types in `app/card/[type]/page.tsx` — 5 types with enrollment forms
- Logo component at `app/components/KyroLogo.tsx`
- Route params pattern: `export async function GET(req: NextRequest, { params }: { params: { type: string } })`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `lib/wallet/types.ts` | Create | TypeScript interfaces for PassTemplate, PassData, field configs |
| `lib/wallet/templates.ts` | Create | 4 Kyro demo template configurations |
| `lib/wallet/apple.ts` | Create | Apple .pkpass generation using passkit-generator |
| `lib/wallet/google.ts` | Create | Google Wallet JWT generation |
| `app/api/wallet/apple/[type]/route.ts` | Create | GET handler returning .pkpass binary |
| `app/api/wallet/google/[type]/route.ts` | Create | GET handler returning Google Wallet save URL redirect |
| `app/wallet/page.tsx` | Create | Demo preview page with 4 pass cards |
| `app/wallet/components/PassCard.tsx` | Create | Single pass preview card (matches Boomerang style) |
| `app/wallet/components/AddToWalletButtons.tsx` | Create | Apple + Google Wallet CTA buttons |
| `public/wallet/strip-discount.png` | Create | Purple strip image for discount pass |
| `public/wallet/strip-reward.png` | Create | Purple strip image for reward pass |
| `public/wallet/strip-stamp.png` | Create | Purple strip image for stamp pass |
| `public/wallet/strip-cashback.png` | Create | Purple strip image for cashback pass |
| `public/wallet/icon.png` | Create | Kyro icon for passes (29x29, 58x58, 87x87) |
| `public/wallet/logo.png` | Create | Kyro logo for passes |
| `.env.example` | Create | Template env vars for Apple + Google certs |
| `docs/wallet-setup.md` | Create | Certificate setup guide |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install npm packages**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
npm install passkit-generator@^3 jsonwebtoken@^9 uuid@^9
npm install -D @types/jsonwebtoken @types/uuid
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
node -e "require('passkit-generator'); require('jsonwebtoken'); require('uuid'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add package.json package-lock.json
git commit -m "feat: add passkit-generator, jsonwebtoken, uuid for wallet pass generation"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `lib/wallet/types.ts`

- [ ] **Step 1: Create the types file**

Create `lib/wallet/types.ts`:

```typescript
export type PassType = "discount" | "reward" | "stamp" | "cashback";

export type BarcodeFormat = "QR" | "PDF417";

export interface PassField {
  key: string;
  label: string;
  value: string | number;
}

export interface PassTemplate {
  type: PassType;
  // Merchant info
  merchantName: string;
  merchantId: string;
  logoText: string;
  description: string;
  // Design
  backgroundColor: string;   // "rgb(r,g,b)" format
  foregroundColor: string;
  labelColor: string;
  // Fields
  headerFields: PassField[];
  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];
  // Barcode
  barcodeFormat: BarcodeFormat;
  barcodeValue: string;
  // Strip image path (relative to public/)
  stripImagePath: string;
}

export interface GeneratePassOptions {
  template: PassTemplate;
  serialNumber?: string;
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add lib/wallet/types.ts
git commit -m "feat: add wallet pass type definitions"
```

---

### Task 3: Kyro Demo Templates

**Files:**
- Create: `lib/wallet/templates.ts`

- [ ] **Step 1: Create the 4 demo template configs**

Create `lib/wallet/templates.ts`:

```typescript
import { PassTemplate, PassType } from "./types";

const FIDELY_PURPLE = "rgb(192,132,252)";
const FIDELY_LIGHT = "rgb(243,232,255)";
const FIDELY_DARK = "rgb(88,28,135)";

export const templates: Record<PassType, PassTemplate> = {
  discount: {
    type: "discount",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Make purchases, increase the discount",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
    headerFields: [],
    primaryFields: [
      { key: "discount", label: "DISCOUNT PERCENTAGE", value: "5%" },
    ],
    secondaryFields: [
      { key: "status", label: "DISCOUNT STATUS", value: "Bronze" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "ABOUT", value: "Present this card at checkout to receive your discount. Your tier upgrades automatically as you spend more." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-DISCOUNT-DEMO-001",
    stripImagePath: "/wallet/strip-discount.png",
  },

  reward: {
    type: "reward",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Collect points and get rewards",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
    headerFields: [
      { key: "balance", label: "BALANCE", value: 23 },
    ],
    primaryFields: [
      { key: "reward", label: "REWARD", value: "$15 OFF" },
    ],
    secondaryFields: [
      { key: "tillNext", label: "TILL THE NEXT REWARD", value: 17 },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Earn 1 point per $1 spent. Redeem points for exclusive rewards at any time." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-REWARD-DEMO-001",
    stripImagePath: "/wallet/strip-reward.png",
  },

  stamp: {
    type: "stamp",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Collect stamps to get rewards",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
    headerFields: [
      { key: "validUntil", label: "VALID UNTIL", value: "04/12/2027" },
    ],
    primaryFields: [
      { key: "stampsLeft", label: "STAMPS UNTIL THE REWARD", value: "9 stamps" },
    ],
    secondaryFields: [
      { key: "rewards", label: "AVAILABLE REWARDS", value: "0 rewards" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Collect 1 stamp per visit. After 10 stamps, redeem your free reward. Card resets after redemption." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" },
    ],
    barcodeFormat: "QR",
    barcodeValue: "FIDELY-STAMP-DEMO-001",
    stripImagePath: "/wallet/strip-stamp.png",
  },

  cashback: {
    type: "cashback",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Get bonus points for each purchase",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
    headerFields: [
      { key: "points", label: "POINTS", value: "0,00" },
    ],
    primaryFields: [
      { key: "cashback", label: "CASHBACK PERCENTAGE", value: "5%" },
    ],
    secondaryFields: [
      { key: "status", label: "CASHBACK STATUS", value: "Starter" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Earn 5% cashback on every purchase. Cashback is credited to your points balance instantly." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-CASHBACK-DEMO-001",
    stripImagePath: "/wallet/strip-cashback.png",
  },
};

export function getTemplate(type: PassType): PassTemplate | undefined {
  return templates[type];
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add lib/wallet/templates.ts
git commit -m "feat: add 4 Kyro demo wallet pass templates"
```

---

### Task 4: Generate Pass Asset Images

**Files:**
- Create: `public/wallet/icon.png` (Kyro "f" mark, 87x87)
- Create: `public/wallet/icon@2x.png` (174x174)
- Create: `public/wallet/logo.png` (Kyro logo, 320x100)
- Create: `public/wallet/logo@2x.png` (640x200)
- Create: `public/wallet/strip-discount.png` (640x198)
- Create: `public/wallet/strip-reward.png` (640x198)
- Create: `public/wallet/strip-stamp.png` (640x198)
- Create: `public/wallet/strip-cashback.png` (640x198)

**Note:** Apple Wallet requires real PNG images. For the demo, generate placeholder strip images programmatically using an SVG-to-PNG approach, or create them as purple gradient PNGs with white text overlays.

- [ ] **Step 1: Create the `public/wallet/` directory**

```bash
mkdir -p /Users/yassineessabar/Documents/GitHub/kyro-card/public/wallet
```

- [ ] **Step 2: Generate pass images using a Node.js script**

Create a temporary script `scripts/generate-pass-images.js` that uses SVG + sharp (or pure canvas) to generate the strip images. Since we want to avoid adding sharp as a dependency just for this, we'll create SVG files and convert them. However, Apple Wallet requires PNG, not SVG.

**Simpler approach:** Create the images as inline SVG data URIs that we convert to PNG using the built-in `fetch` + Canvas API at build time. For the demo, use a script that generates solid-color PNGs with basic shapes.

Create `scripts/generate-pass-images.mjs`:

```javascript
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "public", "wallet");
mkdirSync(OUT, { recursive: true });

// Generate a simple colored PNG using raw pixel data
// This creates a minimal valid PNG file
function createPNG(width, height, r, g, b) {
  // Use a data URL approach - create SVG and note that for production,
  // real designed images should replace these
  // For now, create a 1x1 pixel PNG scaled up (valid for Apple Wallet)

  const { createCanvas } = require("canvas");
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Purple gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgb(${r},${g},${b})`);
  gradient.addColorStop(1, `rgb(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b+20)})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toBuffer("image/png");
}

// We'll use a minimal PNG generator without canvas dependency
// Minimal 1-pixel PNG approach won't work well for strips
// Instead, generate properly sized solid-color PNGs

// Minimal PNG encoder (no dependencies)
function makePNG(width, height, r, g, b, a = 255) {
  // PNG structure: signature + IHDR + IDAT + IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write("IHDR", 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8; // bit depth
  ihdr[17] = 2; // color type (RGB)
  ihdr[18] = 0; // compression
  ihdr[19] = 0; // filter
  ihdr[20] = 0; // interlace
  const crc1 = crc32(ihdr.subarray(4, 21));
  ihdr.writeInt32BE(crc1, 21);

  // IDAT chunk - raw image data
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const offset = y * (1 + width * 3);
    raw[offset] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 3;
      // Create a subtle gradient
      const factor = (y / height) * 0.3;
      raw[px] = Math.min(255, Math.round(r * (1 - factor)));
      raw[px + 1] = Math.min(255, Math.round(g * (1 - factor)));
      raw[px + 2] = Math.min(255, Math.round(b * (1 + factor * 0.5)));
    }
  }

  // Compress with zlib
  const zlib = require("zlib");
  const compressed = zlib.deflateSync(raw);

  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write("IDAT", 4);
  compressed.copy(idat, 8);
  const crc2 = crc32(Buffer.concat([Buffer.from("IDAT"), compressed]));
  idat.writeInt32BE(crc2, 8 + compressed.length);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 0xAE, 0x42, 0x60, 0x82]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// CRC32 for PNG chunks
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

const crc32Table = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crc32Table[i] = c;
}

// Generate images - all purple-themed for Kyro
// Purple: rgb(192, 132, 252)
const purple = [192, 132, 252];

// Icon (29x29 @1x, 58x58 @2x, 87x87 @3x)
writeFileSync(join(OUT, "icon.png"), makePNG(29, 29, ...purple));
writeFileSync(join(OUT, "icon@2x.png"), makePNG(58, 58, ...purple));
writeFileSync(join(OUT, "icon@3x.png"), makePNG(87, 87, ...purple));

// Logo (160x50 @1x, 320x100 @2x)
writeFileSync(join(OUT, "logo.png"), makePNG(160, 50, ...purple));
writeFileSync(join(OUT, "logo@2x.png"), makePNG(320, 100, ...purple));

// Strip images (375x123 @1x, 750x246 @2x for storeCard)
writeFileSync(join(OUT, "strip-discount.png"), makePNG(750, 246, ...purple));
writeFileSync(join(OUT, "strip-reward.png"), makePNG(750, 246, ...purple));
writeFileSync(join(OUT, "strip-stamp.png"), makePNG(750, 246, ...purple));
writeFileSync(join(OUT, "strip-cashback.png"), makePNG(750, 246, ...purple));

console.log("Generated all wallet pass images in public/wallet/");
```

Run:
```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
node scripts/generate-pass-images.mjs
```

Expected: `Generated all wallet pass images in public/wallet/`

- [ ] **Step 3: Verify images exist**

```bash
ls -la /Users/yassineessabar/Documents/GitHub/kyro-card/public/wallet/
```

Expected: 10 PNG files (icon, icon@2x, icon@3x, logo, logo@2x, strip-discount, strip-reward, strip-stamp, strip-cashback)

- [ ] **Step 4: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add public/wallet/ scripts/generate-pass-images.mjs
git commit -m "feat: add wallet pass asset images (icons, logos, strip banners)"
```

---

### Task 5: Apple Wallet Pass Generator

**Files:**
- Create: `lib/wallet/apple.ts`

- [ ] **Step 1: Create Apple pass generation module**

Create `lib/wallet/apple.ts`:

```typescript
import { PKPass } from "passkit-generator";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { PassTemplate } from "./types";

const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID || "pass.com.kyro.loyalty";
const TEAM_ID = process.env.APPLE_TEAM_ID || "";
const CERT_PATH = process.env.APPLE_PASS_CERT_PATH || "./certs/pass.pem";
const KEY_PATH = process.env.APPLE_PASS_KEY_PATH || "./certs/pass-key.pem";
const KEY_PASSPHRASE = process.env.APPLE_PASS_CERT_PASSWORD || "";
const WWDR_PATH = process.env.APPLE_WWDR_CERT_PATH || "./certs/wwdr.pem";

function loadFileIfExists(path: string): Buffer | null {
  const resolved = join(process.cwd(), path);
  if (existsSync(resolved)) {
    return readFileSync(resolved);
  }
  return null;
}

function loadImageBuffers(template: PassTemplate): Record<string, Buffer> {
  const buffers: Record<string, Buffer> = {};
  const walletDir = join(process.cwd(), "public", "wallet");

  const imageFiles = [
    "icon.png", "icon@2x.png", "icon@3x.png",
    "logo.png", "logo@2x.png",
  ];

  for (const file of imageFiles) {
    const filePath = join(walletDir, file);
    if (existsSync(filePath)) {
      buffers[file] = readFileSync(filePath);
    }
  }

  // Strip image specific to this pass type
  const stripFile = template.stripImagePath.replace("/wallet/", "");
  const stripPath = join(walletDir, stripFile);
  if (existsSync(stripPath)) {
    buffers["strip.png"] = readFileSync(stripPath);
    buffers["strip@2x.png"] = readFileSync(stripPath);
  }

  return buffers;
}

export function areCertificatesAvailable(): boolean {
  const cert = loadFileIfExists(CERT_PATH);
  const key = loadFileIfExists(KEY_PATH);
  const wwdr = loadFileIfExists(WWDR_PATH);
  return !!(cert && key && wwdr && TEAM_ID);
}

export async function generateApplePass(template: PassTemplate): Promise<Buffer> {
  const signerCert = loadFileIfExists(CERT_PATH);
  const signerKey = loadFileIfExists(KEY_PATH);
  const wwdr = loadFileIfExists(WWDR_PATH);

  if (!signerCert || !signerKey || !wwdr) {
    throw new Error(
      "Apple Wallet certificates not configured. " +
      "Set APPLE_PASS_CERT_PATH, APPLE_PASS_KEY_PATH, and APPLE_WWDR_CERT_PATH environment variables. " +
      "See docs/wallet-setup.md for instructions."
    );
  }

  if (!TEAM_ID) {
    throw new Error(
      "APPLE_TEAM_ID not set. See docs/wallet-setup.md for instructions."
    );
  }

  const imageBuffers = loadImageBuffers(template);

  const pass = new PKPass(
    imageBuffers,
    {
      wwdr,
      signerCert,
      signerKey,
      signerKeyPassphrase: KEY_PASSPHRASE || undefined,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: PASS_TYPE_ID,
      teamIdentifier: TEAM_ID,
      organizationName: template.merchantName,
      serialNumber: uuidv4(),
      description: template.description,
      backgroundColor: template.backgroundColor,
      foregroundColor: template.foregroundColor,
      labelColor: template.labelColor,
      logoText: template.logoText,
    }
  );

  pass.type = "storeCard";

  // Add fields
  for (const field of template.headerFields) {
    pass.headerFields.push({
      key: field.key,
      label: field.label,
      value: String(field.value),
    });
  }

  for (const field of template.primaryFields) {
    pass.primaryFields.push({
      key: field.key,
      label: field.label,
      value: String(field.value),
    });
  }

  for (const field of template.secondaryFields) {
    pass.secondaryFields.push({
      key: field.key,
      label: field.label,
      value: String(field.value),
    });
  }

  for (const field of template.auxiliaryFields) {
    pass.auxiliaryFields.push({
      key: field.key,
      label: field.label,
      value: String(field.value),
    });
  }

  for (const field of template.backFields) {
    pass.backFields.push({
      key: field.key,
      label: field.label,
      value: String(field.value),
    });
  }

  // Set barcode
  const barcodeFormat = template.barcodeFormat === "QR"
    ? "PKBarcodeFormatQR"
    : "PKBarcodeFormatPDF417";

  pass.setBarcodes({
    message: template.barcodeValue,
    format: barcodeFormat,
    messageEncoding: "iso-8859-1",
  });

  return pass.getAsBuffer();
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add lib/wallet/apple.ts
git commit -m "feat: add Apple Wallet .pkpass generation module"
```

---

### Task 6: Google Wallet Pass Generator

**Files:**
- Create: `lib/wallet/google.ts`

- [ ] **Step 1: Create Google Wallet generation module**

Create `lib/wallet/google.ts`:

```typescript
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { PassTemplate } from "./types";

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID || "";
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL || "";
const PRIVATE_KEY = (process.env.GOOGLE_WALLET_PRIVATE_KEY || "").replace(/\\n/g, "\n");

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return "#a855f7";
  const [, r, g, b] = match;
  return "#" + [r, g, b].map(c => parseInt(c).toString(16).padStart(2, "0")).join("");
}

function getBarcodeType(format: "QR" | "PDF417"): string {
  return format === "QR" ? "QR_CODE" : "PDF_417";
}

export function areGoogleCredentialsAvailable(): boolean {
  return !!(ISSUER_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

export function generateGoogleWalletUrl(
  template: PassTemplate,
  baseUrl: string = "https://kyro.com"
): string {
  if (!ISSUER_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error(
      "Google Wallet credentials not configured. " +
      "Set GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, " +
      "and GOOGLE_WALLET_PRIVATE_KEY environment variables. " +
      "See docs/wallet-setup.md for instructions."
    );
  }

  const classSuffix = `kyro_${template.type}_${template.merchantId}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const objectSuffix = `${classSuffix}_${uuidv4().replace(/-/g, "")}`;

  const hexBg = rgbToHex(template.backgroundColor);

  // Build text modules from primary + secondary fields
  const textModulesData = [
    ...template.primaryFields.map(f => ({
      header: f.label,
      body: String(f.value),
      id: f.key,
    })),
    ...template.secondaryFields.map(f => ({
      header: f.label,
      body: String(f.value),
      id: f.key,
    })),
  ];

  const loyaltyClass = {
    id: `${ISSUER_ID}.${classSuffix}`,
    issuerName: template.merchantName,
    programName: `${template.merchantName} ${template.type.charAt(0).toUpperCase() + template.type.slice(1)}`,
    programLogo: {
      sourceUri: { uri: `${baseUrl}/wallet/logo.png` },
      contentDescription: {
        defaultValue: { language: "en", value: `${template.merchantName} Logo` },
      },
    },
    hexBackgroundColor: hexBg,
    heroImage: {
      sourceUri: { uri: `${baseUrl}${template.stripImagePath}` },
      contentDescription: {
        defaultValue: { language: "en", value: template.description },
      },
    },
    reviewStatus: "UNDER_REVIEW",
    textModulesData,
    linksModuleData: {
      uris: [
        {
          uri: baseUrl,
          description: `${template.merchantName} Website`,
          id: "website",
        },
      ],
    },
  };

  // Build loyalty points from header fields if present
  const loyaltyPoints = template.headerFields.length > 0
    ? {
        label: template.headerFields[0].label,
        balance: {
          string: String(template.headerFields[0].value),
        },
      }
    : undefined;

  const loyaltyObject: Record<string, unknown> = {
    id: `${ISSUER_ID}.${objectSuffix}`,
    classId: `${ISSUER_ID}.${classSuffix}`,
    state: "ACTIVE",
    accountId: `demo-${template.type}`,
    accountName: "Kyro Demo",
    barcode: {
      type: getBarcodeType(template.barcodeFormat),
      value: template.barcodeValue,
      alternateText: template.barcodeValue,
    },
    textModulesData: template.backFields
      .filter(f => f.key !== "powered")
      .map(f => ({
        header: f.label,
        body: String(f.value),
        id: `back_${f.key}`,
      })),
  };

  if (loyaltyPoints) {
    loyaltyObject.loyaltyPoints = loyaltyPoints;
  }

  const claims = {
    iss: SERVICE_ACCOUNT_EMAIL,
    aud: "google",
    origins: [baseUrl],
    typ: "savetowallet",
    payload: {
      loyaltyClasses: [loyaltyClass],
      loyaltyObjects: [loyaltyObject],
    },
  };

  const token = jwt.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });
  return `https://pay.google.com/gp/v/save/${token}`;
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add lib/wallet/google.ts
git commit -m "feat: add Google Wallet JWT pass generation module"
```

---

### Task 7: Apple Wallet API Route

**Files:**
- Create: `app/api/wallet/apple/[type]/route.ts`

- [ ] **Step 1: Create the Apple Wallet API route**

Create `app/api/wallet/apple/[type]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PassType } from "../../../../../lib/wallet/types";
import { getTemplate } from "../../../../../lib/wallet/templates";
import { generateApplePass, areCertificatesAvailable } from "../../../../../lib/wallet/apple";

const VALID_TYPES: PassType[] = ["discount", "reward", "stamp", "cashback"];

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  if (!VALID_TYPES.includes(type as PassType)) {
    return NextResponse.json(
      { error: `Invalid pass type: ${type}. Valid types: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!areCertificatesAvailable()) {
    return NextResponse.json(
      {
        error: "Apple Wallet certificates not configured",
        setup: "See docs/wallet-setup.md for certificate setup instructions",
        hint: "Set APPLE_TEAM_ID, APPLE_PASS_TYPE_ID, APPLE_PASS_CERT_PATH, APPLE_PASS_KEY_PATH, APPLE_WWDR_CERT_PATH",
      },
      { status: 503 }
    );
  }

  const template = getTemplate(type as PassType);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    const buffer = await generateApplePass(template);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="kyro-${type}.pkpass"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add app/api/wallet/apple/\[type\]/route.ts
git commit -m "feat: add Apple Wallet API route (GET /api/wallet/apple/[type])"
```

---

### Task 8: Google Wallet API Route

**Files:**
- Create: `app/api/wallet/google/[type]/route.ts`

- [ ] **Step 1: Create the Google Wallet API route**

Create `app/api/wallet/google/[type]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PassType } from "../../../../../lib/wallet/types";
import { getTemplate } from "../../../../../lib/wallet/templates";
import { generateGoogleWalletUrl, areGoogleCredentialsAvailable } from "../../../../../lib/wallet/google";

const VALID_TYPES: PassType[] = ["discount", "reward", "stamp", "cashback"];

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  if (!VALID_TYPES.includes(type as PassType)) {
    return NextResponse.json(
      { error: `Invalid pass type: ${type}. Valid types: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!areGoogleCredentialsAvailable()) {
    return NextResponse.json(
      {
        error: "Google Wallet credentials not configured",
        setup: "See docs/wallet-setup.md for credential setup instructions",
        hint: "Set GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, GOOGLE_WALLET_PRIVATE_KEY",
      },
      { status: 503 }
    );
  }

  const template = getTemplate(type as PassType);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    // Use the request origin as baseUrl for image URLs
    const origin = req.nextUrl.origin;
    const saveUrl = generateGoogleWalletUrl(template, origin);

    return NextResponse.json({ url: saveUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add app/api/wallet/google/\[type\]/route.ts
git commit -m "feat: add Google Wallet API route (GET /api/wallet/google/[type])"
```

---

### Task 9: AddToWalletButtons Component

**Files:**
- Create: `app/wallet/components/AddToWalletButtons.tsx`

- [ ] **Step 1: Create the wallet buttons component**

Create `app/wallet/components/AddToWalletButtons.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PassType } from "../../../lib/wallet/types";

export default function AddToWalletButtons({ type }: { type: PassType }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAppleWallet = () => {
    // Direct download - browser handles .pkpass via content-type
    window.location.href = `/api/wallet/apple/${type}`;
  };

  const handleGoogleWallet = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wallet/google/${type}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate Google Wallet pass");
        return;
      }
      window.open(data.url, "_blank");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
      {/* Apple Wallet Button */}
      <button
        onClick={handleAppleWallet}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "48px",
          backgroundColor: "rgb(11,5,29)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
      >
        <svg width="20" height="24" viewBox="0 0 814 1000" fill="white">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.7-81.2-106.3-207.6-106.3-328.3C-1.7 298.1 78.6 169.4 196.6 169.4c63.9 0 117.2 42.2 157.5 42.2 38.3 0 98.1-44.8 171.9-44.8 27.8 0 127.8 2.5 191.1 96.1zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.6 15.7 1.3 18.2 2.5.6 6.4.6 10.2.6 45.9.1 102.7-30.4 139.5-70.7z" />
        </svg>
        Add to Apple Wallet
      </button>

      {/* Google Wallet Button */}
      <button
        onClick={handleGoogleWallet}
        disabled={googleLoading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "48px",
          backgroundColor: "white",
          color: "rgb(11,5,29)",
          border: "2px solid rgb(11,5,29)",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: googleLoading ? "wait" : "pointer",
          opacity: googleLoading ? 0.6 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Generating..." : "Add to Google Wallet"}
      </button>

      {error && (
        <p style={{
          margin: 0,
          fontSize: "13px",
          color: "rgb(220,38,38)",
          textAlign: "center",
          padding: "8px",
          backgroundColor: "rgb(254,242,242)",
          borderRadius: "8px",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add app/wallet/components/AddToWalletButtons.tsx
git commit -m "feat: add AddToWalletButtons component (Apple + Google)"
```

---

### Task 10: PassCard Preview Component

**Files:**
- Create: `app/wallet/components/PassCard.tsx`

This component renders a single pass card preview matching the Boomerang/Apple Wallet style from the screenshots: purple card with Kyro logo, strip banner area, field labels + values, barcode at bottom, "Powered by Kyro" footer.

- [ ] **Step 1: Create the PassCard component**

Create `app/wallet/components/PassCard.tsx`:

```tsx
"use client";

import { PassTemplate } from "../../../lib/wallet/types";
import KyroLogo from "../../components/KyroLogo";

export default function PassCard({ template }: { template: PassTemplate }) {
  const isStamp = template.type === "stamp";

  return (
    <div style={{
      backgroundColor: "rgb(243,232,255)",
      borderRadius: "16px",
      border: "1px solid rgb(216,180,254)",
      overflow: "hidden",
      width: "100%",
      maxWidth: "380px",
    }}>
      {/* Top section: logo + header fields */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <KyroLogo color="rgb(88,28,135)" height={20} />
        {template.headerFields.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(88,28,135)",
              textTransform: "uppercase",
            }}>
              {template.headerFields[0].label}
            </p>
            <p style={{
              margin: "2px 0 0",
              fontSize: "22px",
              fontWeight: 700,
              color: "rgb(88,28,135)",
              lineHeight: 1,
            }}>
              {String(template.headerFields[0].value)}
            </p>
          </div>
        )}
      </div>

      {/* Strip image area */}
      <div style={{
        margin: "12px 20px",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "rgb(192,132,252)",
        minHeight: isStamp ? "100px" : "130px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {isStamp ? (
          /* Stamp grid for stamp card */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px",
            padding: "16px 20px",
            width: "100%",
          }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: "1",
                borderRadius: "50%",
                backgroundColor: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}>
                {i === 0 ? "\u2615" : "\u2615"}
              </div>
            ))}
          </div>
        ) : (
          /* Text banner for other card types */
          <div style={{ padding: "20px", width: "100%" }}>
            <p style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}>
              {template.type === "discount" && "5% OFF FOR\nEVERYTHING\nIN OUR STORE"}
              {template.type === "reward" && "COLLECT\nPOINTS\nGET REWARDS"}
              {template.type === "cashback" && "SPEND\nMORE\nEARN MORE"}
            </p>
          </div>
        )}
      </div>

      {/* Primary + Secondary fields */}
      <div style={{
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        {template.primaryFields.map((field) => (
          <div key={field.key} style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(147,51,234)",
              textTransform: "uppercase",
            }}>
              {field.label}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "20px",
              fontWeight: 700,
              color: "rgb(147,51,234)",
              lineHeight: 1,
            }}>
              {String(field.value)}
            </p>
          </div>
        ))}
        {template.secondaryFields.map((field) => (
          <div key={field.key} style={{ flex: 1, textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(147,51,234)",
              textTransform: "uppercase",
            }}>
              {field.label}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "20px",
              fontWeight: 700,
              color: "rgb(147,51,234)",
              lineHeight: 1,
            }}>
              {String(field.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Barcode area */}
      <div style={{
        margin: "20px",
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        {/* Placeholder barcode visual */}
        <div style={{
          width: template.barcodeFormat === "QR" ? "100px" : "200px",
          height: template.barcodeFormat === "QR" ? "100px" : "50px",
          backgroundColor: "rgb(11,5,29)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "80%",
            height: "80%",
            backgroundImage: template.barcodeFormat === "QR"
              ? "repeating-conic-gradient(rgb(11,5,29) 0% 25%, white 0% 50%) 50% / 8px 8px"
              : "repeating-linear-gradient(90deg, rgb(11,5,29) 0px, rgb(11,5,29) 2px, white 2px, white 4px)",
          }} />
        </div>
        <p style={{
          margin: 0,
          fontSize: "11px",
          color: "rgb(107,114,128)",
        }}>
          Powered by Kyro
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add app/wallet/components/PassCard.tsx
git commit -m "feat: add PassCard preview component matching Apple Wallet style"
```

---

### Task 11: Wallet Demo Preview Page

**Files:**
- Create: `app/wallet/page.tsx`

- [ ] **Step 1: Create the wallet demo page**

Create `app/wallet/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { templates } from "../../lib/wallet/templates";
import { PassType } from "../../lib/wallet/types";
import PassCard from "./components/PassCard";
import AddToWalletButtons from "./components/AddToWalletButtons";
import KyroLogo from "../components/KyroLogo";

const passTypes: { key: PassType; label: string; icon: string }[] = [
  { key: "discount", label: "Discount", icon: "\uD83C\uDFF7\uFE0F" },
  { key: "reward", label: "Reward", icon: "\uD83C\uDF81" },
  { key: "stamp", label: "Stamp", icon: "\u2615" },
  { key: "cashback", label: "Cashback", icon: "\uD83D\uDCB0" },
];

export default function WalletDemoPage() {
  const [activeType, setActiveType] = useState<PassType>("discount");
  const activeTemplate = templates[activeType];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "rgb(249,248,245)",
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "16px 0",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
        }}>
          <KyroLogo color="rgb(11,5,29)" height={22} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "32px 16px 40px",
      }}>
        {/* Title */}
        <h1 className="font-display" style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
          textAlign: "center",
          margin: "0 0 8px",
          lineHeight: "34px",
        }}>
          Wallet Pass Templates
        </h1>
        <p style={{
          fontSize: "15px",
          color: "rgb(97,95,109)",
          textAlign: "center",
          margin: "0 0 28px",
          lineHeight: "22px",
        }}>
          Add any of our 4 loyalty card types directly to your Apple or Google Wallet.
        </p>

        {/* Tab selector */}
        <div style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}>
          {passTypes.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              style={{
                padding: "8px 18px",
                borderRadius: "100px",
                border: activeType === key ? "2px solid rgb(147,51,234)" : "1px solid rgb(213,213,221)",
                backgroundColor: activeType === key ? "rgb(243,232,255)" : "white",
                color: activeType === key ? "rgb(147,51,234)" : "rgb(11,5,29)",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Pass card preview */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}>
          <PassCard template={activeTemplate} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: "14px",
          color: "rgb(97,95,109)",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: "20px",
        }}>
          {activeTemplate.description}
        </p>

        {/* Add to Wallet buttons */}
        <div style={{
          maxWidth: "380px",
          margin: "0 auto 32px",
        }}>
          <AddToWalletButtons type={activeType} />
        </div>

        {/* Pass details */}
        <div style={{
          maxWidth: "380px",
          margin: "0 auto",
          backgroundColor: "white",
          border: "1px solid rgb(213,213,221)",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <h3 style={{
            margin: "0 0 16px",
            fontSize: "14px",
            fontWeight: 700,
            color: "rgb(11,5,29)",
          }}>
            Pass Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</p>
              <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{activeType.charAt(0).toUpperCase() + activeType.slice(1)} Card</p>
            </div>
            {activeTemplate.primaryFields.map((f) => (
              <div key={f.key}>
                <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{String(f.value)}</p>
              </div>
            ))}
            {activeTemplate.secondaryFields.map((f) => (
              <div key={f.key}>
                <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{String(f.value)}</p>
              </div>
            ))}
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Barcode</p>
              <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{activeTemplate.barcodeFormat} — {activeTemplate.barcodeValue}</p>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgb(137,135,137)", margin: "0 0 8px" }}>Powered by</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <KyroLogo color="rgb(137,135,137)" height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add app/wallet/page.tsx
git commit -m "feat: add wallet demo preview page with 4 pass types"
```

---

### Task 12: Environment Config and Setup Docs

**Files:**
- Create: `.env.example`
- Create: `docs/wallet-setup.md`

- [ ] **Step 1: Create .env.example**

Create `.env.example`:

```bash
# ===========================================
# Wallet Pass Generation — Environment Config
# ===========================================

# --- Apple Wallet ---
# Get these from Apple Developer Portal > Certificates, Identifiers & Profiles
APPLE_TEAM_ID=
APPLE_PASS_TYPE_ID=pass.com.kyro.loyalty
APPLE_PASS_CERT_PATH=./certs/pass.pem
APPLE_PASS_KEY_PATH=./certs/pass-key.pem
APPLE_PASS_CERT_PASSWORD=
APPLE_WWDR_CERT_PATH=./certs/wwdr.pem

# --- Google Wallet ---
# Get these from Google Cloud Console > Wallet API
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=
GOOGLE_WALLET_PRIVATE_KEY=
```

- [ ] **Step 2: Create docs/wallet-setup.md**

Create `docs/wallet-setup.md`:

```markdown
# Wallet Pass Setup Guide

## Apple Wallet (.pkpass)

### 1. Register a Pass Type ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Click **+** to register a new Pass Type ID
3. Enter description: "Kyro Loyalty Card"
4. Enter identifier: `pass.com.kyro.loyalty`
5. Click **Register**

### 2. Create a Pass Signing Certificate

1. Go to [Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** > choose **Pass Type ID Certificate**
3. Select your Pass Type ID (`pass.com.kyro.loyalty`)
4. Follow the CSR creation steps (Keychain Access > Certificate Assistant > Request a Certificate)
5. Upload CSR, download the `.cer` file

### 3. Export the Certificate and Key

```bash
# In Keychain Access, find the Pass Type ID certificate
# Right-click > Export > save as pass.p12

# Convert to PEM files:
openssl pkcs12 -in pass.p12 -clcerts -nokeys -out certs/pass.pem
openssl pkcs12 -in pass.p12 -nocerts -out certs/pass-key.pem
```

### 4. Download WWDR Certificate

```bash
# Download Apple WWDR G4 certificate
curl -o certs/wwdr.cer https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer

# Convert to PEM
openssl x509 -inform DER -in certs/wwdr.cer -out certs/wwdr.pem
```

### 5. Set Environment Variables

```bash
APPLE_TEAM_ID=YOUR_TEAM_ID        # Find in Apple Developer Portal top-right
APPLE_PASS_TYPE_ID=pass.com.kyro.loyalty
APPLE_PASS_CERT_PATH=./certs/pass.pem
APPLE_PASS_KEY_PATH=./certs/pass-key.pem
APPLE_PASS_CERT_PASSWORD=your_p12_password
APPLE_WWDR_CERT_PATH=./certs/wwdr.pem
```

---

## Google Wallet

### 1. Enable the Google Wallet API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the **Google Wallet API**

### 2. Create a Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Create a new service account
3. Grant role: **Editor** (or custom with Wallet permissions)
4. Create a JSON key and download it

### 3. Set Up Issuer Account

1. Go to [Google Pay & Wallet Console](https://pay.google.com/business/console/)
2. Create an issuer account
3. Note your **Issuer ID**
4. Add the service account email as a user

### 4. Set Environment Variables

```bash
GOOGLE_WALLET_ISSUER_ID=your_issuer_id
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=wallet@your-project.iam.gserviceaccount.com
GOOGLE_WALLET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

Note: For `GOOGLE_WALLET_PRIVATE_KEY`, copy the `private_key` value from the service account JSON file. Use `\n` for newlines.

---

## Directory Structure

```
kyro-card/
  certs/                    # DO NOT COMMIT — add to .gitignore
    pass.pem
    pass-key.pem
    wwdr.pem
  .env.local                # Your actual env vars
  .env.example              # Template (committed)
```

## Testing

**Apple Wallet:**
```
GET http://localhost:3000/api/wallet/apple/discount
```
Should download a `.pkpass` file. Open it on a Mac or iPhone to add to Wallet.

**Google Wallet:**
```
GET http://localhost:3000/api/wallet/google/discount
```
Returns `{ "url": "https://pay.google.com/gp/v/save/..." }`. Open the URL to add to Google Wallet.
```

- [ ] **Step 3: Add certs/ to .gitignore**

Check if `.gitignore` exists and add `certs/` to it:

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
echo -e "\n# Wallet certificates\ncerts/" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
git add .env.example docs/wallet-setup.md .gitignore
git commit -m "feat: add wallet setup documentation and env config template"
```

---

### Task 13: Build Verification

- [ ] **Step 1: Run the Next.js build to check for TypeScript errors**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
npx next build 2>&1 | head -50
```

Expected: Build succeeds (may show warnings about missing env vars, but no TypeScript errors).

- [ ] **Step 2: Start dev server and verify the preview page loads**

```bash
cd /Users/yassineessabar/Documents/GitHub/kyro-card
npx next dev &
sleep 3
curl -s http://localhost:3000/wallet | head -20
kill %1
```

Expected: HTML response (the page renders).

- [ ] **Step 3: Test Apple Wallet API route (expect graceful 503)**

```bash
curl -s http://localhost:3000/api/wallet/apple/discount | head -5
```

Expected: `{"error":"Apple Wallet certificates not configured","setup":"...","hint":"..."}` with status 503.

- [ ] **Step 4: Test Google Wallet API route (expect graceful 503)**

```bash
curl -s http://localhost:3000/api/wallet/google/discount | head -5
```

Expected: `{"error":"Google Wallet credentials not configured","setup":"...","hint":"..."}` with status 503.

- [ ] **Step 5: Test invalid type returns 400**

```bash
curl -s http://localhost:3000/api/wallet/apple/invalid
```

Expected: `{"error":"Invalid pass type: invalid. Valid types: discount, reward, stamp, cashback"}` with status 400.
