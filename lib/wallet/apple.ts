import { createHash, createSign, X509Certificate } from "crypto";
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

// ---- ASN.1 DER builder ----

function derLength(len: number): Buffer {
  if (len < 0x80) return Buffer.from([len]);
  if (len < 0x100) return Buffer.from([0x81, len]);
  if (len < 0x10000) return Buffer.from([0x82, (len >> 8) & 0xff, len & 0xff]);
  if (len < 0x1000000) return Buffer.from([0x83, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff]);
  return Buffer.from([0x84, (len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff]);
}

function derSequence(contents: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x30]), derLength(contents.length), contents]);
}

function derSet(contents: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x31]), derLength(contents.length), contents]);
}

function derOid(oid: string): Buffer {
  const parts = oid.split(".").map(Number);
  const bytes: number[] = [40 * parts[0] + parts[1]];
  for (let i = 2; i < parts.length; i++) {
    let val = parts[i];
    if (val < 128) {
      bytes.push(val);
    } else {
      const encoded: number[] = [];
      encoded.push(val & 0x7f);
      val >>= 7;
      while (val > 0) {
        encoded.push((val & 0x7f) | 0x80);
        val >>= 7;
      }
      encoded.reverse();
      bytes.push(...encoded);
    }
  }
  const content = Buffer.from(bytes);
  return Buffer.concat([Buffer.from([0x06]), derLength(content.length), content]);
}

function derOctetString(data: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x04]), derLength(data.length), data]);
}

function derInteger(value: Buffer): Buffer {
  // Ensure positive by prepending 0x00 if high bit is set
  let v = value;
  if (v[0] & 0x80) {
    v = Buffer.concat([Buffer.from([0x00]), v]);
  }
  return Buffer.concat([Buffer.from([0x02]), derLength(v.length), v]);
}

function derExplicit(tag: number, content: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0xa0 | tag]), derLength(content.length), content]);
}

function derUtcTime(date: Date): Buffer {
  const y = date.getUTCFullYear().toString().slice(-2);
  const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const d = date.getUTCDate().toString().padStart(2, "0");
  const h = date.getUTCHours().toString().padStart(2, "0");
  const min = date.getUTCMinutes().toString().padStart(2, "0");
  const s = date.getUTCSeconds().toString().padStart(2, "0");
  const str = `${y}${m}${d}${h}${min}${s}Z`;
  const buf = Buffer.from(str, "ascii");
  return Buffer.concat([Buffer.from([0x17]), derLength(buf.length), buf]);
}

function derNull(): Buffer {
  return Buffer.from([0x05, 0x00]);
}

function pemToDer(pem: string): Buffer {
  const lines = pem.split("\n").filter(l => !l.startsWith("-----") && l.trim().length > 0);
  return Buffer.from(lines.join(""), "base64");
}

// OID constants
const OID_PKCS7_SIGNED_DATA = "1.2.840.113549.1.7.2";
const OID_PKCS7_DATA = "1.2.840.113549.1.7.1";
const OID_SHA1 = "1.3.14.3.2.26";
const OID_RSA_ENCRYPTION = "1.2.840.113549.1.1.1";
const OID_CONTENT_TYPE = "1.2.840.113549.1.9.3";
const OID_MESSAGE_DIGEST = "1.2.840.113549.1.9.4";
const OID_SIGNING_TIME = "1.2.840.113549.1.9.5";

/**
 * Extract issuer and serial from a PEM certificate using Node's X509Certificate.
 */
function getCertInfo(certPem: string): { issuerDer: Buffer; serialDer: Buffer; certDer: Buffer } {
  const certDer = pemToDer(certPem);
  const x509 = new X509Certificate(certPem);

  // Parse the certificate DER to extract issuer
  // The certificate is: SEQUENCE { tbsCertificate, signatureAlgorithm, signature }
  // tbsCertificate is: SEQUENCE { version, serialNumber, signature, issuer, ... }
  const tbs = parseDerSequence(certDer);
  const tbsContent = parseDerSequence(tbs.content);

  // Skip version (explicit tag 0), then serial, then sigAlg, then issuer
  let pos = 0;
  const fields = parseDerFields(tbsContent.content);

  // fields[0] = version (explicit tag [0]) or serial if no version
  let idx = 0;
  if (fields[idx].tag === 0xa0) idx++; // skip explicit version
  const serialField = fields[idx]; idx++;
  idx++; // skip signature algorithm
  const issuerField = fields[idx];

  return {
    issuerDer: issuerField.raw,
    serialDer: serialField.raw,
    certDer,
  };
}

function parseDerSequence(der: Buffer): { tag: number; content: Buffer; totalLength: number } {
  const tag = der[0];
  let pos = 1;
  let len = der[pos]; pos++;
  if (len & 0x80) {
    const numBytes = len & 0x7f;
    len = 0;
    for (let i = 0; i < numBytes; i++) {
      len = (len << 8) | der[pos]; pos++;
    }
  }
  return { tag, content: der.subarray(pos, pos + len), totalLength: pos + len };
}

function parseDerFields(der: Buffer): { tag: number; raw: Buffer }[] {
  const fields: { tag: number; raw: Buffer }[] = [];
  let pos = 0;
  while (pos < der.length) {
    const tag = der[pos];
    let lenPos = pos + 1;
    let len = der[lenPos]; lenPos++;
    if (len & 0x80) {
      const numBytes = len & 0x7f;
      len = 0;
      for (let i = 0; i < numBytes; i++) {
        len = (len << 8) | der[lenPos]; lenPos++;
      }
    }
    const end = lenPos + len;
    fields.push({ tag, raw: der.subarray(pos, end) });
    pos = end;
  }
  return fields;
}

/**
 * Create PKCS#7 detached signature using Node's native crypto.
 * Builds the ASN.1 DER structure manually — no node-forge, no openssl binary.
 */
function createPkcs7Signature(
  manifestBuffer: Buffer,
  signerCertPem: string,
  signerKeyPem: string,
  wwdrCertPem: string,
): Buffer {
  const signerInfo = getCertInfo(signerCertPem);
  const wwdrInfo = getCertInfo(wwdrCertPem);

  // SHA1 digest of manifest
  const manifestDigest = createHash("sha1").update(manifestBuffer).digest();

  // Build authenticated attributes
  const now = new Date();

  const contentTypeAttr = derSequence(Buffer.concat([
    derOid(OID_CONTENT_TYPE),
    derSet(derOid(OID_PKCS7_DATA)),
  ]));

  const signingTimeAttr = derSequence(Buffer.concat([
    derOid(OID_SIGNING_TIME),
    derSet(derUtcTime(now)),
  ]));

  const messageDigestAttr = derSequence(Buffer.concat([
    derOid(OID_MESSAGE_DIGEST),
    derSet(derOctetString(manifestDigest)),
  ]));

  const authenticatedAttrs = Buffer.concat([contentTypeAttr, signingTimeAttr, messageDigestAttr]);

  // Sign the authenticated attributes
  // For signing, authenticated attributes are encoded as a SET (tag 0x31)
  const attrsForSigning = derSet(authenticatedAttrs);

  const signer = createSign("SHA1");
  signer.update(attrsForSigning);
  const rsaSignature = signer.sign({
    key: signerKeyPem,
    passphrase: KEY_PASSPHRASE || undefined,
  });

  // Build the SignerInfo
  const digestAlgorithm = derSequence(Buffer.concat([derOid(OID_SHA1), derNull()]));
  const digestEncryptionAlgorithm = derSequence(Buffer.concat([derOid(OID_RSA_ENCRYPTION), derNull()]));

  const issuerAndSerial = derSequence(Buffer.concat([
    signerInfo.issuerDer,
    signerInfo.serialDer,
  ]));

  // Authenticated attributes with implicit tag [0]
  const authAttrsImplicit = Buffer.concat([
    Buffer.from([0xa0]),
    derLength(authenticatedAttrs.length),
    authenticatedAttrs,
  ]);

  const signerInfoValue = derSequence(Buffer.concat([
    derInteger(Buffer.from([1])), // version
    issuerAndSerial,
    digestAlgorithm,
    authAttrsImplicit,
    digestEncryptionAlgorithm,
    derOctetString(rsaSignature),
  ]));

  // Build the SignedData
  const digestAlgorithms = derSet(digestAlgorithm);
  const contentInfo = derSequence(Buffer.concat([derOid(OID_PKCS7_DATA)]));

  // Certificates [0] IMPLICIT
  const certsContent = Buffer.concat([signerInfo.certDer, wwdrInfo.certDer]);
  const certificates = Buffer.concat([
    Buffer.from([0xa0]),
    derLength(certsContent.length),
    certsContent,
  ]);

  const signerInfos = derSet(signerInfoValue);

  const signedData = derSequence(Buffer.concat([
    derInteger(Buffer.from([1])), // version
    digestAlgorithms,
    contentInfo,
    certificates,
    signerInfos,
  ]));

  // Wrap in ContentInfo
  const pkcs7 = derSequence(Buffer.concat([
    derOid(OID_PKCS7_SIGNED_DATA),
    derExplicit(0, signedData),
  ]));

  return pkcs7;
}

/**
 * Create a minimal ZIP archive from a map of filename→buffer.
 */
function createZip(files: Record<string, Buffer>): Buffer {
  const entries: { name: Buffer; data: Buffer; offset: number }[] = [];
  const parts: Buffer[] = [];
  let offset = 0;

  for (const [name, data] of Object.entries(files)) {
    const nameBuffer = Buffer.from(name, "utf-8");
    const crc = crc32(data);

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(data.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBuffer.length, 26);
    header.writeUInt16LE(0, 28);

    entries.push({ name: nameBuffer, data, offset });
    parts.push(header, nameBuffer, data);
    offset += 30 + nameBuffer.length + data.length;
  }

  const centralStart = offset;
  for (const entry of entries) {
    const crc = crc32(entry.data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(entry.data.length, 20);
    cd.writeUInt32LE(entry.data.length, 24);
    cd.writeUInt16LE(entry.name.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(entry.offset, 42);
    parts.push(cd, entry.name);
    offset += 46 + entry.name.length;
  }

  const centralSize = offset - centralStart;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20);
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

  const imageBuffers = loadImageBuffers(template);
  const allFiles: Record<string, Buffer> = {
    "pass.json": passJsonBuffer,
    ...imageBuffers,
  };

  const manifest: Record<string, string> = {};
  for (const [name, buffer] of Object.entries(allFiles)) {
    manifest[name] = sha1Hex(buffer);
  }
  const manifestBuffer = Buffer.from(JSON.stringify(manifest));

  const signatureBuffer = createPkcs7Signature(
    manifestBuffer,
    signerCertBuf.toString("utf-8"),
    signerKeyBuf.toString("utf-8"),
    wwdrBuf.toString("utf-8"),
  );

  const zipFiles: Record<string, Buffer> = {
    ...allFiles,
    "manifest.json": manifestBuffer,
    "signature": signatureBuffer,
  };

  return createZip(zipFiles);
}
