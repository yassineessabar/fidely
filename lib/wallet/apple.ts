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

function loadFileIfExists(path: string, envVar?: string): Buffer | null {
  // Try file first (local dev)
  const resolved = join(process.cwd(), path);
  if (existsSync(resolved)) {
    return readFileSync(resolved);
  }
  // Fall back to base64 env var (Vercel / serverless)
  if (envVar && process.env[envVar]) {
    return Buffer.from(process.env[envVar]!, "base64");
  }
  return null;
}

async function loadImageBuffers(template: PassTemplate): Promise<Record<string, Buffer>> {
  const buffers: Record<string, Buffer> = {};
  const walletDir = join(process.cwd(), "public", "wallet");

  const imageFiles = [
    "icon.png", "icon@2x.png", "icon@3x.png",
    "logo.png", "logo@2x.png",
  ];

  // Try filesystem first (local dev)
  let useFs = false;
  const testPath = join(walletDir, "icon.png");
  if (existsSync(testPath)) {
    useFs = true;
  }

  if (useFs) {
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
  } else {
    // Serverless: generate minimal required images programmatically
    // Apple Wallet requires at least icon.png and logo.png
    const placeholder1x = createPlaceholderPng(29, 29);
    const placeholder2x = createPlaceholderPng(58, 58);
    const placeholder3x = createPlaceholderPng(87, 87);
    const logoPlaceholder = createPlaceholderPng(160, 50);
    const stripPlaceholder = createPlaceholderPng(375, 123);

    buffers["icon.png"] = placeholder1x;
    buffers["icon@2x.png"] = placeholder2x;
    buffers["icon@3x.png"] = placeholder3x;
    buffers["logo.png"] = logoPlaceholder;
    buffers["logo@2x.png"] = logoPlaceholder;
    buffers["strip.png"] = stripPlaceholder;
    buffers["strip@2x.png"] = stripPlaceholder;
  }

  return buffers;
}

// Generates a minimal valid PNG buffer (solid color)
function createPlaceholderPng(width: number, height: number): Buffer {
  // Minimal PNG: 8-byte signature + IHDR + IDAT + IEND
  // Using raw deflate for a solid purple (#6C47FF) image
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createPngChunk("IHDR", ihdrData);

  // IDAT chunk - uncompressed raw image data wrapped in zlib
  const scanlines: number[] = [];
  for (let y = 0; y < height; y++) {
    scanlines.push(0); // filter byte: None
    for (let x = 0; x < width; x++) {
      scanlines.push(108, 71, 255); // RGB: #6C47FF
    }
  }
  const rawData = Buffer.from(scanlines);

  // Wrap in zlib (deflate with headers)
  const zlibHeader = Buffer.from([0x78, 0x01]); // zlib header (no compression)
  const blocks: Buffer[] = [zlibHeader];

  // Split into 65535-byte blocks for deflate
  let offset = 0;
  while (offset < rawData.length) {
    const remaining = rawData.length - offset;
    const blockSize = Math.min(remaining, 65535);
    const isLast = offset + blockSize >= rawData.length;
    const blockHeader = Buffer.alloc(5);
    blockHeader[0] = isLast ? 1 : 0;
    blockHeader.writeUInt16LE(blockSize, 1);
    blockHeader.writeUInt16LE(~blockSize & 0xffff, 3);
    blocks.push(blockHeader, rawData.subarray(offset, offset + blockSize));
    offset += blockSize;
  }

  // Adler-32 checksum
  let a = 1, b = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE((b << 16) | a, 0);
  blocks.push(adler);

  const compressedData = Buffer.concat(blocks);
  const idat = createPngChunk("IDAT", compressedData);

  // IEND chunk
  const iend = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

  // CRC32
  let crc = 0xffffffff;
  for (let i = 0; i < crcData.length; i++) {
    crc ^= crcData[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

export function areCertificatesAvailable(): boolean {
  const cert = loadFileIfExists(CERT_PATH, "APPLE_PASS_CERT_B64");
  const key = loadFileIfExists(KEY_PATH, "APPLE_PASS_KEY_B64");
  const wwdr = loadFileIfExists(WWDR_PATH, "APPLE_WWDR_CERT_B64");
  return !!(cert && key && wwdr && TEAM_ID);
}

export async function generateApplePass(template: PassTemplate): Promise<Buffer> {
  const signerCert = loadFileIfExists(CERT_PATH, "APPLE_PASS_CERT_B64");
  const signerKey = loadFileIfExists(KEY_PATH, "APPLE_PASS_KEY_B64");
  const wwdr = loadFileIfExists(WWDR_PATH, "APPLE_WWDR_CERT_B64");

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

  const imageBuffers = await loadImageBuffers(template);

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
