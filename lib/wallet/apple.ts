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
    throw new Error("APPLE_TEAM_ID not set. See docs/wallet-setup.md for instructions.");
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

  for (const field of template.headerFields) {
    pass.headerFields.push({ key: field.key, label: field.label, value: String(field.value) });
  }
  for (const field of template.primaryFields) {
    pass.primaryFields.push({ key: field.key, label: field.label, value: String(field.value) });
  }
  for (const field of template.secondaryFields) {
    pass.secondaryFields.push({ key: field.key, label: field.label, value: String(field.value) });
  }
  for (const field of template.auxiliaryFields) {
    pass.auxiliaryFields.push({ key: field.key, label: field.label, value: String(field.value) });
  }
  for (const field of template.backFields) {
    pass.backFields.push({ key: field.key, label: field.label, value: String(field.value) });
  }

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
