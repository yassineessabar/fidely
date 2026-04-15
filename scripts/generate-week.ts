#!/usr/bin/env npx tsx
/**
 * Kyro Weekly Content Generator
 *
 * Generates a full week of social media content following the content calendar.
 *
 * Usage:
 *   npx tsx scripts/generate-week.ts
 *   npx tsx scripts/generate-week.ts --week 2026-04-13
 */

import { generateImage, generateVideo } from "../lib/higgsfield";
import type {
  GenerateImageOptions,
  GenerateVideoOptions,
  ImageResult,
  VideoResult,
  BrandPresetKey,
  AspectRatioPreset,
} from "../lib/higgsfield";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Pillar = "product" | "merchant" | "education" | "brand" | "lifestyle" | "community";
type Preset = "dark-lime" | "light-clean" | "purple-gradient" | "lifestyle-warm";
type AssetKind = "feed-image" | "story-image" | "reel-video";

interface DayPlan {
  dayOfWeek: string;
  pillar: Pillar;
  label: string;
  assets: AssetKind[];
}

interface GeneratedAsset {
  day: string;
  dayOfWeek: string;
  pillar: Pillar;
  kind: AssetKind;
  filename: string;
  model: string;
  preset: string;
  prompt: string;
}

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

const BRAND = {
  black: "#0B051D",
  lime: "#E6FFA9",
  white: "#F9F8F5",
  purple: "#6C47FF",
} as const;

// ---------------------------------------------------------------------------
// Weekly content calendar
// ---------------------------------------------------------------------------

const WEEKLY_CALENDAR: DayPlan[] = [
  {
    dayOfWeek: "Monday",
    pillar: "product",
    label: "Product Power",
    assets: ["feed-image", "reel-video"],
  },
  {
    dayOfWeek: "Tuesday",
    pillar: "merchant",
    label: "Merchant Spotlight",
    assets: ["feed-image", "story-image"],
  },
  {
    dayOfWeek: "Wednesday",
    pillar: "education",
    label: "Loyalty Education",
    assets: ["feed-image", "story-image"],
  },
  {
    dayOfWeek: "Thursday",
    pillar: "brand",
    label: "Behind the Brand",
    assets: ["story-image"],
  },
  {
    dayOfWeek: "Friday",
    pillar: "lifestyle",
    label: "Consumer Lifestyle",
    assets: ["reel-video"],
  },
  {
    dayOfWeek: "Saturday",
    pillar: "product",
    label: "Product Power",
    assets: ["feed-image"],
  },
  {
    dayOfWeek: "Sunday",
    pillar: "community",
    label: "Community Engagement",
    assets: ["story-image"],
  },
];

// ---------------------------------------------------------------------------
// Asset kind -> config
// ---------------------------------------------------------------------------

interface AssetConfig {
  ratio: string;
  type: "image" | "video";
  model: string;
  ext: string;
}

const ASSET_CONFIGS: Record<AssetKind, AssetConfig> = {
  "feed-image": {
    ratio: "instagram-feed-square",
    type: "image",
    model: "flux-pro",
    ext: "png",
  },
  "story-image": {
    ratio: "instagram-story",
    type: "image",
    model: "seedream-5",
    ext: "png",
  },
  "reel-video": {
    ratio: "instagram-story",
    type: "video",
    model: "kling-video",
    ext: "mp4",
  },
};

// ---------------------------------------------------------------------------
// Pillar -> preset
// ---------------------------------------------------------------------------

const PILLAR_PRESETS: Record<Pillar, Preset> = {
  product: "dark-lime",
  merchant: "lifestyle-warm",
  education: "light-clean",
  brand: "purple-gradient",
  lifestyle: "lifestyle-warm",
  community: "light-clean",
};

// ---------------------------------------------------------------------------
// Prompts per pillar per asset kind
// ---------------------------------------------------------------------------

const PILLAR_PROMPTS: Record<Pillar, Record<AssetKind, string>> = {
  product: {
    "feed-image": `Premium product photography: black Kyro loyalty card with lime-green edge glow (${BRAND.lime}) hovering over dark reflective surface (${BRAND.black}). Studio lighting, sharp focus, luxury brand aesthetic, minimal composition.`,
    "story-image": `Vertical close-up of a hand holding a Kyro loyalty card, dark background (${BRAND.black}), lime accent lighting (${BRAND.lime}) from below, dramatic shadows, premium feel, portrait orientation.`,
    "reel-video": `Cinematic product reveal: a Kyro card slides into frame on a dark surface, lime-green light (${BRAND.lime}) pulses along its edges, camera orbits slowly around it, premium tech-product style, moody lighting, 5 seconds.`,
  },
  merchant: {
    "feed-image": `Warm editorial photo of a smiling cafe owner behind the counter with Kyro tablet display showing loyalty dashboard, natural window light, cozy interior, inviting atmosphere, square crop.`,
    "story-image": `Vertical shot: customer tapping Kyro card at a boutique checkout terminal, close-up of the tap moment, warm golden bokeh background, authentic and welcoming feel.`,
    "reel-video": `Short documentary style: camera follows a merchant opening their shop, setting up the Kyro loyalty terminal, first customer of the day taps their card, warm natural light, authentic feel, 5 seconds.`,
  },
  education: {
    "feed-image": `Clean infographic on dark background (${BRAND.black}): large "73%" in lime green (${BRAND.lime}), subtitle "of customers prefer businesses with loyalty programs", minimal design, data-driven aesthetic, square format.`,
    "story-image": `Vertical tip card: "Did You Know?" header in white on dark background (${BRAND.black}), three lime-green (${BRAND.lime}) bullet points about loyalty program benefits, clean typography, educational style.`,
    "reel-video": `Animated counter: numbers rolling from 0 to 500 points on a sleek dark UI (${BRAND.black}), lime green (${BRAND.lime}) progress bar filling, reward unlocked celebration at the end, satisfying motion graphics, 5 seconds.`,
  },
  brand: {
    "feed-image": `Abstract brand art: thousands of lime-green particles (${BRAND.lime}) forming a loyalty card shape against deep black void (${BRAND.black}), ethereal, premium brand anthem aesthetic, square composition.`,
    "story-image": `Vertical abstract: flowing ribbon of purple light (${BRAND.purple}) and lime particles (${BRAND.lime}) weaving through dark 3D space (${BRAND.black}), representing connection and loyalty, cinematic depth.`,
    "reel-video": `Brand anthem: abstract purple (${BRAND.purple}) and lime (${BRAND.lime}) light streams converging in darkness (${BRAND.black}), forming the outline of a card, then exploding into particles, cinematic, 5 seconds.`,
  },
  lifestyle: {
    "feed-image": `Lifestyle photography: young professional at a trendy cafe, scanning Kyro card at the counter, morning sunlight, authentic candid moment, warm color grading, editorial style, square crop.`,
    "story-image": `Vertical lifestyle shot: friends at a restaurant table, one showing phone with Kyro reward notification, natural laughter, ambient warm lighting, authentic social moment.`,
    "reel-video": `Lifestyle montage: person walks into cafe, taps Kyro card, phone shows points earned, smile of satisfaction, cuts to enjoying their free coffee, warm tones, authentic feel, 5 seconds.`,
  },
  community: {
    "feed-image": `Community mosaic: grid of diverse faces of happy customers and merchants, warm lighting, connected by subtle lime-green (${BRAND.lime}) line patterns, community feel, square format.`,
    "story-image": `Vertical community poll style: "What reward would YOU choose?" with three options shown as cards on dark background (${BRAND.black}), lime (${BRAND.lime}) highlights, interactive engagement aesthetic.`,
    "reel-video": `Community highlight reel: quick cuts of different people using Kyro cards at various businesses, diverse locations, warm authentic moments, upbeat energy, 5 seconds.`,
  },
};

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

function parseArgs(): { weekStart: string } {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--week");
  if (idx !== -1 && idx + 1 < args.length) {
    return { weekStart: args[idx + 1] };
  }

  // Default to current week's Monday
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return { weekStart: monday.toISOString().slice(0, 10) };
}

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(icon: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`  ${icon}  [${timestamp}] ${message}`);
}

function header(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60) + "\n");
}

function subheader(title: string) {
  console.log(`\n  --- ${title} ${"- ".repeat(20)}\n`);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// File download helper
// ---------------------------------------------------------------------------

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          downloadFile(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

// ---------------------------------------------------------------------------
// Save result helper
// ---------------------------------------------------------------------------

async function saveResult(
  result: { url?: string; base64?: string },
  filepath: string
): Promise<boolean> {
  if (result.url) {
    await downloadFile(result.url, filepath);
    return true;
  } else if (result.base64) {
    fs.writeFileSync(filepath, Buffer.from(result.base64, "base64"));
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Generate a single asset
// ---------------------------------------------------------------------------

async function generateAsset(
  pillar: Pillar,
  kind: AssetKind,
  date: string,
  outputDir: string
): Promise<GeneratedAsset | null> {
  const config = ASSET_CONFIGS[kind];
  const preset = PILLAR_PRESETS[pillar];
  const prompt = PILLAR_PROMPTS[pillar][kind];
  const filename = `${date}_${pillar}_${kind}.${config.ext}`;
  const filepath = path.join(outputDir, filename);

  log(">>", `Generating ${kind} for ${pillar}...`);

  try {
    if (config.type === "image") {
      const result: ImageResult = await generateImage({
        prompt,
        model: config.model as GenerateImageOptions["model"],
        preset: preset as BrandPresetKey,
        ratio: config.ratio as AspectRatioPreset,
      });

      const saved = await saveResult(result, filepath);
      if (!saved) {
        log("!!", `No image data returned for ${filename}`);
        return null;
      }
    } else {
      const result: VideoResult = await generateVideo({
        prompt,
        model: config.model as GenerateVideoOptions["model"],
        preset: preset as BrandPresetKey,
        ratio: config.ratio as AspectRatioPreset,
      });

      const saved = await saveResult(result, filepath);
      if (!saved) {
        log("!!", `No video data returned for ${filename}`);
        return null;
      }
    }

    log("OK", `Saved: ${filename}`);

    return {
      day: date,
      dayOfWeek: "",
      pillar,
      kind,
      filename,
      model: config.model,
      preset,
      prompt,
    };
  } catch (err: any) {
    log("!!", `Failed to generate ${filename}: ${err.message || err}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { weekStart } = parseArgs();

  header(`Kyro Weekly Content Generator`);
  console.log(`  Week starting: ${weekStart}`);
  console.log(`  Output: ./generated-content/week-${weekStart}/`);
  console.log("");

  const outputDir = path.resolve(`./generated-content/week-${weekStart}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const manifest: {
    weekStart: string;
    generatedAt: string;
    assets: GeneratedAsset[];
    errors: string[];
  } = {
    weekStart,
    generatedAt: new Date().toISOString(),
    assets: [],
    errors: [],
  };

  const startTime = Date.now();
  let totalGenerated = 0;
  let totalFailed = 0;

  for (let dayIndex = 0; dayIndex < WEEKLY_CALENDAR.length; dayIndex++) {
    const plan = WEEKLY_CALENDAR[dayIndex];
    const date = addDays(weekStart, dayIndex);

    subheader(`${plan.dayOfWeek} (${date}) -- ${plan.label}`);
    console.log(`  Pillar: ${plan.pillar}`);
    console.log(`  Assets to generate: ${plan.assets.join(", ")}`);
    console.log("");

    for (const assetKind of plan.assets) {
      const asset = await generateAsset(plan.pillar, assetKind, date, outputDir);

      if (asset) {
        asset.dayOfWeek = plan.dayOfWeek;
        manifest.assets.push(asset);
        totalGenerated++;
      } else {
        manifest.errors.push(
          `Failed: ${date} ${plan.dayOfWeek} ${plan.pillar} ${assetKind}`
        );
        totalFailed++;
      }
    }
  }

  // Write manifest
  const manifestPath = path.join(outputDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  log("OK", `Manifest saved: manifest.json`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  header("Weekly Generation Complete");
  console.log(`  Week:       ${weekStart}`);
  console.log(`  Generated:  ${totalGenerated} assets`);
  console.log(`  Failed:     ${totalFailed} assets`);
  console.log(`  Duration:   ${elapsed}s`);
  console.log(`  Output:     ${outputDir}`);
  console.log("");

  console.log("  Assets by day:");
  for (let dayIndex = 0; dayIndex < WEEKLY_CALENDAR.length; dayIndex++) {
    const plan = WEEKLY_CALENDAR[dayIndex];
    const date = addDays(weekStart, dayIndex);
    const dayAssets = manifest.assets.filter((a) => a.day === date);
    const status = dayAssets.length === plan.assets.length ? "[OK]" : "[!!]";
    console.log(
      `    ${status} ${plan.dayOfWeek.padEnd(10)} ${plan.label.padEnd(22)} ${dayAssets.length}/${plan.assets.length} assets`
    );
  }
  console.log("");

  if (manifest.errors.length > 0) {
    console.log("  Errors:");
    for (const err of manifest.errors) {
      console.log(`    - ${err}`);
    }
    console.log("");
  }

  console.log(`  Manifest: ${manifestPath}\n`);
}

main();
