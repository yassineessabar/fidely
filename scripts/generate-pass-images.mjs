import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { deflateSync } from "zlib";

const OUT = join(process.cwd(), "public", "wallet");
mkdirSync(OUT, { recursive: true });

// CRC32 lookup table
const crc32Table = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crc32Table[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makePNGChunk(type, data) {
  const typeBytes = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crcData = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcData));
  return Buffer.concat([length, typeBytes, data, crcBuf]);
}

function makePNG(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = makePNGChunk("IHDR", ihdrData);

  // Image data - purple gradient
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const offset = y * (1 + width * 3);
    raw[offset] = 0; // filter: none
    const factor = (y / height) * 0.3;
    const pr = Math.min(255, Math.round(r * (1 - factor)));
    const pg = Math.min(255, Math.round(g * (1 - factor)));
    const pb = Math.min(255, Math.round(b * (1 + factor * 0.3)));
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 3;
      raw[px] = pr;
      raw[px + 1] = pg;
      raw[px + 2] = pb;
    }
  }
  const compressed = deflateSync(raw);
  const idat = makePNGChunk("IDAT", compressed);

  // IEND
  const iend = makePNGChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const p = [192, 132, 252]; // Fidely purple

// Icons
writeFileSync(join(OUT, "icon.png"), makePNG(29, 29, ...p));
writeFileSync(join(OUT, "icon@2x.png"), makePNG(58, 58, ...p));
writeFileSync(join(OUT, "icon@3x.png"), makePNG(87, 87, ...p));

// Logos
writeFileSync(join(OUT, "logo.png"), makePNG(160, 50, ...p));
writeFileSync(join(OUT, "logo@2x.png"), makePNG(320, 100, ...p));

// Strip images
writeFileSync(join(OUT, "strip-discount.png"), makePNG(750, 246, ...p));
writeFileSync(join(OUT, "strip-reward.png"), makePNG(750, 246, ...p));
writeFileSync(join(OUT, "strip-stamp.png"), makePNG(750, 246, ...p));
writeFileSync(join(OUT, "strip-cashback.png"), makePNG(750, 246, ...p));

console.log("Generated all wallet pass images in public/wallet/");
