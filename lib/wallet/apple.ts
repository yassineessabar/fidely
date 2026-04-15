import { createHash, createSign } from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as forge from "node-forge";
import { PassTemplate } from "./types";

const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID || "pass.com.kyro.loyalty";
const TEAM_ID = process.env.APPLE_TEAM_ID || "";
const CERT_PATH = process.env.APPLE_PASS_CERT_PATH || "./certs/pass.pem";
const KEY_PATH = process.env.APPLE_PASS_KEY_PATH || "./certs/pass-key.pem";
const KEY_PASSPHRASE = process.env.APPLE_PASS_CERT_PASSWORD || "";
const WWDR_PATH = process.env.APPLE_WWDR_CERT_PATH || "./certs/wwdr.pem";

function loadFileIfExists(path: string, envVar?: string): Buffer | null {
  const resolved = join(process.cwd(), path);
  if (existsSync(resolved)) {
    return readFileSync(resolved);
  }
  if (envVar && process.env[envVar]) {
    return Buffer.from(process.env[envVar]!, "base64");
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

function createPlaceholderPng(width: number, height: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = createPngChunk("IHDR", ihdrData);

  const scanlines: number[] = [];
  for (let y = 0; y < height; y++) {
    scanlines.push(0);
    for (let x = 0; x < width; x++) {
      scanlines.push(108, 71, 255);
    }
  }
  const rawData = Buffer.from(scanlines);

  const zlibHeader = Buffer.from([0x78, 0x01]);
  const blocks: Buffer[] = [zlibHeader];

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
  const iend = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

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

function sha1Hex(buffer: Buffer): string {
  return createHash("sha1").update(buffer).digest("hex");
}

/**
 * Create PKCS#7 detached signature using node-forge.
 * This replaces passkit-generator's signing to avoid environment-specific issues.
 */
function createPkcs7Signature(
  manifestBuffer: Buffer,
  signerCertPem: string,
  signerKeyPem: string,
  wwdrCertPem: string,
  passphrase?: string,
): Buffer {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = new forge.util.ByteStringBuffer(manifestBuffer.toString("binary"));

  const wwdrCert = forge.pki.certificateFromPem(wwdrCertPem);
  const signerCert = forge.pki.certificateFromPem(signerCertPem);
  const signerKey = passphrase
    ? forge.pki.decryptRsaPrivateKey(signerKeyPem, passphrase)
    : forge.pki.privateKeyFromPem(signerKeyPem);

  p7.addCertificate(wwdrCert);
  p7.addCertificate(signerCert);

  p7.addSigner({
    key: signerKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime },
    ],
  });

  p7.sign({ detached: true });

  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), "binary");
}

/**
 * Create a minimal ZIP archive from a map of filename→buffer.
 * No compression (store only), which is what Apple expects.
 */
function createZip(files: Record<string, Buffer>): Buffer {
  const entries: { name: Buffer; data: Buffer; offset: number }[] = [];
  const parts: Buffer[] = [];
  let offset = 0;

  for (const [name, data] of Object.entries(files)) {
    const nameBuffer = Buffer.from(name, "utf-8");
    const crc = crc32(data);

    // Local file header
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);  // signature
    header.writeUInt16LE(20, 4);           // version needed
    header.writeUInt16LE(0, 6);            // flags
    header.writeUInt16LE(0, 8);            // compression (store)
    header.writeUInt16LE(0, 10);           // mod time
    header.writeUInt16LE(0, 12);           // mod date
    header.writeUInt32LE(crc, 14);         // crc32
    header.writeUInt32LE(data.length, 18); // compressed size
    header.writeUInt32LE(data.length, 22); // uncompressed size
    header.writeUInt16LE(nameBuffer.length, 26); // name length
    header.writeUInt16LE(0, 28);           // extra length

    entries.push({ name: nameBuffer, data, offset });
    parts.push(header, nameBuffer, data);
    offset += 30 + nameBuffer.length + data.length;
  }

  // Central directory
  const centralStart = offset;
  for (const entry of entries) {
    const crc = crc32(entry.data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);  // signature
    cd.writeUInt16LE(20, 4);           // version made by
    cd.writeUInt16LE(20, 6);           // version needed
    cd.writeUInt16LE(0, 8);            // flags
    cd.writeUInt16LE(0, 10);           // compression
    cd.writeUInt16LE(0, 12);           // mod time
    cd.writeUInt16LE(0, 14);           // mod date
    cd.writeUInt32LE(crc, 16);         // crc32
    cd.writeUInt32LE(entry.data.length, 20); // compressed size
    cd.writeUInt32LE(entry.data.length, 24); // uncompressed size
    cd.writeUInt16LE(entry.name.length, 28); // name length
    cd.writeUInt16LE(0, 30);           // extra length
    cd.writeUInt16LE(0, 32);           // comment length
    cd.writeUInt16LE(0, 34);           // disk start
    cd.writeUInt16LE(0, 36);           // internal attrs
    cd.writeUInt32LE(0, 38);           // external attrs
    cd.writeUInt32LE(entry.offset, 42); // local header offset
    parts.push(cd, entry.name);
    offset += 46 + entry.name.length;
  }

  const centralSize = offset - centralStart;

  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);  // signature
  eocd.writeUInt16LE(0, 4);            // disk number
  eocd.writeUInt16LE(0, 6);            // central dir disk
  eocd.writeUInt16LE(entries.length, 8);  // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralSize, 12);    // central dir size
  eocd.writeUInt32LE(centralStart, 16);   // central dir offset
  eocd.writeUInt16LE(0, 20);              // comment length
  parts.push(eocd);

  return Buffer.concat(parts);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function areCertificatesAvailable(): boolean {
  const cert = loadFileIfExists(CERT_PATH, "APPLE_PASS_CERT_B64");
  const key = loadFileIfExists(KEY_PATH, "APPLE_PASS_KEY_B64");
  const wwdr = loadFileIfExists(WWDR_PATH, "APPLE_WWDR_CERT_B64");
  return !!(cert && key && wwdr && TEAM_ID);
}

export async function generateApplePass(template: PassTemplate): Promise<Buffer> {
  const signerCertBuf = loadFileIfExists(CERT_PATH, "APPLE_PASS_CERT_B64");
  const signerKeyBuf = loadFileIfExists(KEY_PATH, "APPLE_PASS_KEY_B64");
  const wwdrBuf = loadFileIfExists(WWDR_PATH, "APPLE_WWDR_CERT_B64");

  if (!signerCertBuf || !signerKeyBuf || !wwdrBuf) {
    throw new Error(
      "Apple Wallet certificates not configured. " +
      "Set APPLE_PASS_CERT_PATH, APPLE_PASS_KEY_PATH, and APPLE_WWDR_CERT_PATH environment variables. " +
      "See docs/wallet-setup.md for instructions."
    );
  }

  if (!TEAM_ID) {
    throw new Error("APPLE_TEAM_ID not set. See docs/wallet-setup.md for instructions.");
  }

  // Build pass.json (no additionalInfoFields — we control the structure directly)
  const barcodeFormat = template.barcodeFormat === "QR"
    ? "PKBarcodeFormatQR"
    : "PKBarcodeFormatPDF417";

  const passJson: Record<string, any> = {
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
    storeCard: {
      headerFields: template.headerFields.map(f => ({ key: f.key, label: f.label, value: String(f.value) })),
      primaryFields: template.primaryFields.map(f => ({ key: f.key, label: f.label, value: String(f.value) })),
      secondaryFields: template.secondaryFields.map(f => ({ key: f.key, label: f.label, value: String(f.value) })),
      auxiliaryFields: template.auxiliaryFields.map(f => ({ key: f.key, label: f.label, value: String(f.value) })),
      backFields: template.backFields.map(f => ({ key: f.key, label: f.label, value: String(f.value) })),
    },
    barcodes: [
      {
        message: template.barcodeValue,
        format: barcodeFormat,
        messageEncoding: "iso-8859-1",
      },
    ],
  };

  const passJsonBuffer = Buffer.from(JSON.stringify(passJson));

  // Collect all files
  const imageBuffers = loadImageBuffers(template);
  const allFiles: Record<string, Buffer> = {
    "pass.json": passJsonBuffer,
    ...imageBuffers,
  };

  // Create manifest.json (SHA1 hash of each file)
  const manifest: Record<string, string> = {};
  for (const [name, buffer] of Object.entries(allFiles)) {
    manifest[name] = sha1Hex(buffer);
  }
  const manifestBuffer = Buffer.from(JSON.stringify(manifest));

  // Create PKCS#7 signature
  const signatureBuffer = createPkcs7Signature(
    manifestBuffer,
    signerCertBuf.toString("utf-8"),
    signerKeyBuf.toString("utf-8"),
    wwdrBuf.toString("utf-8"),
    KEY_PASSPHRASE || undefined,
  );

  // Build ZIP
  const zipFiles: Record<string, Buffer> = {
    ...allFiles,
    "manifest.json": manifestBuffer,
    "signature": signatureBuffer,
  };

  return createZip(zipFiles);
}
