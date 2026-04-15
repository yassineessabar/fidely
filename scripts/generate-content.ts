#!/usr/bin/env npx tsx
/**
 * Kyro Content Generation CLI
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts --type image --pillar product --platform instagram-feed
 *   npx tsx scripts/generate-content.ts --type video --pillar brand --platform tiktok --model kling-video
 *   npx tsx scripts/generate-content.ts --type batch --pillar lifestyle --platform instagram-story --count 4
 */

import {
  generateImage,
  generateVideo,
  batchGenerate,
} from "../lib/higgsfield";
import type {
  GenerateImageOptions,
  GenerateVideoOptions,
  BatchItem,
  BatchResult,
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

type ContentType = "image" | "video" | "batch";
type Pillar = "product" | "merchant" | "education" | "brand" | "lifestyle";
type Platform =
  | "instagram-feed"
  | "instagram-story"
  | "instagram-reel"
  | "tiktok"
  | "linkedin";
type Model = "flux-pro" | "seedream-5" | "kling-image" | "kling-video" | "seedance-2";
type Preset = "dark-lime" | "light-clean" | "purple-gradient" | "lifestyle-warm";

interface CliArgs {
  type: ContentType;
  pillar: Pillar;
  platform: Platform;
  model: Model;
  prompt: string | null;
  preset: Preset;
  count: number;
  output: string;
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
// Platform -> aspect ratio mapping
// ---------------------------------------------------------------------------

const PLATFORM_RATIOS: Record<Platform, string> = {
  "instagram-feed": "instagram-feed-square",
  "instagram-story": "instagram-story",
  "instagram-reel": "instagram-story", // 9:16
  tiktok: "tiktok",
  linkedin: "linkedin-landscape",
};

// ---------------------------------------------------------------------------
// Built-in prompt templates per pillar
// ---------------------------------------------------------------------------

const PILLAR_PROMPTS: Record<Pillar, string[]> = {
  product: [
    `Sleek product shot of a black loyalty card with lime-green accents (${BRAND.lime}) floating above a dark surface (${BRAND.black}). Minimalist, premium feel, soft shadows, studio lighting.`,
    `Close-up of a person's hand holding a smartphone displaying the Kyro app loyalty dashboard, card in the other hand, shallow depth of field, lifestyle lighting.`,
    `Feature demo: split-screen showing a loyalty card on the left and reward points animation on the right, dark background ${BRAND.black}, lime highlights ${BRAND.lime}, clean UI mockup style.`,
    `Overhead flat lay of a premium black wallet card with Kyro branding, placed on marble surface next to a coffee cup and phone, editorial photography style.`,
  ],
  merchant: [
    `Warm portrait of a smiling small business owner standing behind a modern checkout counter, natural lighting, cozy cafe interior, the Kyro tablet display visible showing loyalty program dashboard.`,
    `Interior of a trendy local boutique shop with a point-of-sale terminal showing Kyro loyalty card scanner, warm tones, inviting atmosphere, editorial style.`,
    `Moment of a customer tapping their Kyro card at a checkout terminal in a bakery, close-up of the tap interaction, warm golden light, bokeh background.`,
    `Bird's-eye view of a bustling local market stall with Kyro branded signage, vibrant fresh produce, merchant happily serving a customer.`,
  ],
  education: [
    `Clean infographic-style visual showing "5x more repeat visits with loyalty programs" stat, dark background ${BRAND.black}, large lime ${BRAND.lime} numbers, minimal typography, data visualization aesthetic.`,
    `Side-by-side comparison visual: left side shows a plain receipt, right side shows a digital loyalty card with rewards stacking up, modern graphic design, ${BRAND.purple} accent lines.`,
    `Tip card layout: "3 Ways to Boost Customer Retention" on dark ${BRAND.black} background with lime ${BRAND.lime} bullet points and icons, clean editorial design.`,
    `Animated counter showing loyalty points accumulating from 0 to 500, sleek dark UI, lime green progress bar, satisfying visual progression.`,
  ],
  brand: [
    `Abstract art: thousands of tiny lime-green particles (${BRAND.lime}) forming the shape of a loyalty card against a deep dark void (${BRAND.black}), cinematic, ethereal, high-end brand anthem style.`,
    `Kyro logo reveal: purple (${BRAND.purple}) light rays emanating from center, dark background, abstract geometric shapes dissolving into particles, premium motion graphics aesthetic.`,
    `Abstract flowing ribbon of lime green (${BRAND.lime}) light weaving through a dark (${BRAND.black}) 3D space, representing connection and loyalty, cinematic depth of field.`,
    `Geometric pattern of interlocking hexagons in purple (${BRAND.purple}) and lime (${BRAND.lime}) on black (${BRAND.black}), symbolizing network and community, luxury brand aesthetic.`,
  ],
  lifestyle: [
    `Young professional scanning their Kyro card at a trendy cafe counter, morning light streaming through windows, authentic candid moment, warm color grading.`,
    `Group of friends at a restaurant, one person excitedly showing their phone with Kyro reward notification, natural expressions, ambient restaurant lighting.`,
    `Celebration moment: customer reacting with joy after receiving a loyalty reward, confetti-like lime (${BRAND.lime}) particles, energetic, authentic emotion.`,
    `Person walking through a vibrant city street holding a coffee, Kyro card peeking from their pocket, lifestyle editorial photography, golden hour light.`,
  ],
};

// ---------------------------------------------------------------------------
// Default model selection
// ---------------------------------------------------------------------------

function defaultModel(type: ContentType): Model {
  switch (type) {
    case "image":
      return "flux-pro";
    case "video":
      return "kling-video";
    case "batch":
      return "flux-pro";
  }
}

// ---------------------------------------------------------------------------
// Default preset selection
// ---------------------------------------------------------------------------

function defaultPreset(pillar: Pillar): Preset {
  switch (pillar) {
    case "product":
      return "dark-lime";
    case "merchant":
      return "lifestyle-warm";
    case "education":
      return "light-clean";
    case "brand":
      return "purple-gradient";
    case "lifestyle":
      return "lifestyle-warm";
  }
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(`--${flag}`);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const type = (get("type") as ContentType) || "image";
  const pillar = (get("pillar") as Pillar) || "product";
  const platform = (get("platform") as Platform) || "instagram-feed";
  const model = (get("model") as Model) || defaultModel(type);
  const prompt = get("prompt") || null;
  const preset = (get("preset") as Preset) || defaultPreset(pillar);
  const count = parseInt(get("count") || "1", 10);
  const output = get("output") || "./generated-content";

  // Validate
  const validTypes: ContentType[] = ["image", "video", "batch"];
  const validPillars: Pillar[] = ["product", "merchant", "education", "brand", "lifestyle"];
  const validPlatforms: Platform[] = [
    "instagram-feed",
    "instagram-story",
    "instagram-reel",
    "tiktok",
    "linkedin",
  ];
  const validModels: Model[] = [
    "flux-pro",
    "seedream-5",
    "kling-image",
    "kling-video",
    "seedance-2",
  ];
  const validPresets: Preset[] = [
    "dark-lime",
    "light-clean",
    "purple-gradient",
    "lifestyle-warm",
  ];

  if (!validTypes.includes(type)) {
    fatal(`Invalid --type "${type}". Must be one of: ${validTypes.join(", ")}`);
  }
  if (!validPillars.includes(pillar)) {
    fatal(`Invalid --pillar "${pillar}". Must be one of: ${validPillars.join(", ")}`);
  }
  if (!validPlatforms.includes(platform)) {
    fatal(`Invalid --platform "${platform}". Must be one of: ${validPlatforms.join(", ")}`);
  }
  if (!validModels.includes(model)) {
    fatal(`Invalid --model "${model}". Must be one of: ${validModels.join(", ")}`);
  }
  if (!validPresets.includes(preset)) {
    fatal(`Invalid --preset "${preset}". Must be one of: ${validPresets.join(", ")}`);
  }
  if (isNaN(count) || count < 1) {
    fatal("--count must be a positive integer");
  }

  return { type, pillar, platform, model, prompt, preset, count, output };
}

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(icon: string, message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`  ${icon}  [${timestamp}] ${message}`);
}

function fatal(message: string): never {
  console.error(`\n  ERROR: ${message}\n`);
  process.exit(1);
}

function header(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60) + "\n");
}

function summary(label: string, value: string) {
  console.log(`  ${label.padEnd(14)} ${value}`);
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
          // Follow redirect
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
// Prompt selection
// ---------------------------------------------------------------------------

function selectPrompt(pillar: Pillar, custom: string | null, index: number): string {
  if (custom) return custom;
  const templates = PILLAR_PROMPTS[pillar];
  return templates[index % templates.length];
}

// ---------------------------------------------------------------------------
// File naming
// ---------------------------------------------------------------------------

function makeFilename(
  pillar: Pillar,
  platform: Platform,
  index: number,
  ext: string
): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${pillar}_${platform}_${date}_${String(index + 1).padStart(2, "0")}.${ext}`;
}

// ---------------------------------------------------------------------------
// Generation logic
// ---------------------------------------------------------------------------

async function generateSingleImage(
  args: CliArgs,
  index: number,
  outputDir: string
): Promise<string> {
  const prompt = selectPrompt(args.pillar, args.prompt, index);
  const ratio = PLATFORM_RATIOS[args.platform];

  log(">>", `Generating image ${index + 1}/${args.count}...`);
  log("  ", `Model: ${args.model}`);
  log("  ", `Prompt: ${prompt.slice(0, 80)}...`);

  const result: ImageResult = await generateImage({
    prompt,
    model: args.model as GenerateImageOptions["model"],
    preset: args.preset as BrandPresetKey,
    ratio: ratio as AspectRatioPreset,
  });

  const ext = "png";
  const filename = makeFilename(args.pillar, args.platform, index, ext);
  const filepath = path.join(outputDir, filename);

  if (result.url) {
    log("<<", `Downloading to ${filename}...`);
    await downloadFile(result.url, filepath);
  } else if (result.base64) {
    log("<<", `Saving ${filename}...`);
    fs.writeFileSync(filepath, Buffer.from(result.base64, "base64"));
  } else {
    log("!!", `No image data returned for index ${index + 1}`);
    return "";
  }

  log("OK", `Saved: ${filename}`);
  return filepath;
}

async function generateSingleVideo(
  args: CliArgs,
  index: number,
  outputDir: string
): Promise<string> {
  const prompt = selectPrompt(args.pillar, args.prompt, index);
  const ratio = PLATFORM_RATIOS[args.platform];

  log(">>", `Generating video ${index + 1}/${args.count}...`);
  log("  ", `Model: ${args.model}`);
  log("  ", `Prompt: ${prompt.slice(0, 80)}...`);

  const result: VideoResult = await generateVideo({
    prompt,
    model: args.model as GenerateVideoOptions["model"],
    preset: args.preset as BrandPresetKey,
    ratio: ratio as AspectRatioPreset,
  });

  const ext = "mp4";
  const filename = makeFilename(args.pillar, args.platform, index, ext);
  const filepath = path.join(outputDir, filename);

  if (result.url) {
    log("<<", `Downloading to ${filename}...`);
    await downloadFile(result.url, filepath);
  } else if (result.base64) {
    log("<<", `Saving ${filename}...`);
    fs.writeFileSync(filepath, Buffer.from(result.base64, "base64"));
  } else {
    log("!!", `No video data returned for index ${index + 1}`);
    return "";
  }

  log("OK", `Saved: ${filename}`);
  return filepath;
}

async function generateBatch(
  args: CliArgs,
  outputDir: string
): Promise<string[]> {
  const ratio = PLATFORM_RATIOS[args.platform];
  const items: BatchItem[] = [];

  for (let i = 0; i < args.count; i++) {
    const prompt = selectPrompt(args.pillar, args.prompt, i);
    items.push({
      type: "image",
      prompt,
      model: args.model as GenerateImageOptions["model"],
      preset: args.preset as BrandPresetKey,
      ratio: ratio as AspectRatioPreset,
    });
  }

  log(">>", `Batch generating ${args.count} items...`);

  const settled = await batchGenerate(items);
  const saved: string[] = [];

  for (let i = 0; i < settled.length; i++) {
    const outcome = settled[i];
    if (outcome.status === "rejected") {
      log("!!", `Item ${i + 1} failed: ${outcome.reason}`);
      continue;
    }

    const result = outcome.value;
    const ext = "png";
    const filename = makeFilename(args.pillar, args.platform, i, ext);
    const filepath = path.join(outputDir, filename);

    if (result.url) {
      log("<<", `Downloading ${filename}...`);
      await downloadFile(result.url, filepath);
      saved.push(filepath);
    } else if ((result as any).base64) {
      log("<<", `Saving ${filename}...`);
      fs.writeFileSync(filepath, Buffer.from((result as any).base64, "base64"));
      saved.push(filepath);
    } else {
      log("!!", `No data for item ${i + 1}`);
    }
  }

  return saved;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  const outputDir = path.resolve(args.output);

  header("Kyro Content Generator");

  summary("Type", args.type);
  summary("Pillar", args.pillar);
  summary("Platform", args.platform);
  summary("Model", args.model);
  summary("Preset", args.preset);
  summary("Count", String(args.count));
  summary("Output", outputDir);
  console.log("");

  fs.mkdirSync(outputDir, { recursive: true });

  const savedFiles: string[] = [];
  const startTime = Date.now();

  try {
    if (args.type === "batch") {
      const files = await generateBatch(args, outputDir);
      savedFiles.push(...files);
    } else {
      for (let i = 0; i < args.count; i++) {
        let filepath: string;
        if (args.type === "video") {
          filepath = await generateSingleVideo(args, i, outputDir);
        } else {
          filepath = await generateSingleImage(args, i, outputDir);
        }
        if (filepath) savedFiles.push(filepath);
      }
    }
  } catch (err: any) {
    log("!!", `Generation failed: ${err.message || err}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  header("Generation Complete");
  console.log(`  Generated ${savedFiles.length} asset(s) in ${elapsed}s\n`);
  for (const f of savedFiles) {
    console.log(`    - ${path.relative(process.cwd(), f)}`);
  }
  console.log("");
}

main();
