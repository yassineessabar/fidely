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
  baseUrl: string = "https://fidely.com"
): string {
  if (!ISSUER_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error(
      "Google Wallet credentials not configured. " +
      "Set GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, " +
      "and GOOGLE_WALLET_PRIVATE_KEY environment variables. " +
      "See docs/wallet-setup.md for instructions."
    );
  }

  const classSuffix = `fidely_${template.type}_${template.merchantId}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const objectSuffix = `${classSuffix}_${uuidv4().replace(/-/g, "")}`;

  const hexBg = rgbToHex(template.backgroundColor);

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
    accountName: "Fidely Demo",
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
