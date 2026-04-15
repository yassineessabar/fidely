import {
  higgsfield,
  config,
  type V2Response,
} from '@higgsfield/client/v2';
import {
  HiggsfieldError,
  APIError,
  AuthenticationError,
  TimeoutError,
  NotEnoughCreditsError,
  ValidationError,
} from '@higgsfield/client/v2';

// ---------------------------------------------------------------------------
// 1. Client initialization
// ---------------------------------------------------------------------------

let initialized = false;

function ensureInitialized(): void {
  if (initialized) return;

  const credentials =
    process.env.HF_CREDENTIALS ??
    (process.env.HF_API_KEY && process.env.HF_API_SECRET
      ? `${process.env.HF_API_KEY}:${process.env.HF_API_SECRET}`
      : undefined);

  if (!credentials) {
    throw new Error(
      'Higgsfield credentials not configured. ' +
        'Set HF_CREDENTIALS (format "KEY_ID:KEY_SECRET") or both HF_API_KEY and HF_API_SECRET.',
    );
  }

  config({ credentials });
  initialized = true;
}

// ---------------------------------------------------------------------------
// 2. Model registry
// ---------------------------------------------------------------------------

export const IMAGE_MODELS = {
  'flux-pro': 'flux-pro/kontext/max/text-to-image',
  'seedream-5': 'bytedance/seedream/v5/text-to-image',
  'seedream-4.5': 'bytedance/seedream/v4.5/text-to-image',
  'kling-image': 'kling/o1/text-to-image',
  'gpt-image': 'gpt/text-to-image',
} as const;

export const VIDEO_MODELS = {
  'seedance-2': 'seedance/v2/text-to-video',
  'seedance-1.5': 'seedance/v1.5/text-to-video',
  'kling-video': 'kling/v2.6/text-to-video',
} as const;

export const IMAGE_TO_VIDEO_MODELS = {
  'image-to-video': '/v1/image2video/dop',
} as const;

export type ImageModelKey = keyof typeof IMAGE_MODELS;
export type VideoModelKey = keyof typeof VIDEO_MODELS;
export type ImageToVideoModelKey = keyof typeof IMAGE_TO_VIDEO_MODELS;
export type ModelKey = ImageModelKey | VideoModelKey | ImageToVideoModelKey;

const ALL_MODELS: Record<ModelKey, string> = {
  ...IMAGE_MODELS,
  ...VIDEO_MODELS,
  ...IMAGE_TO_VIDEO_MODELS,
};

function resolveEndpoint(model: ModelKey): string {
  const endpoint = ALL_MODELS[model];
  if (!endpoint) {
    throw new Error(
      `Unknown model "${model}". Available: ${Object.keys(ALL_MODELS).join(', ')}`,
    );
  }
  return endpoint;
}

// ---------------------------------------------------------------------------
// 3. Kyro brand presets
// ---------------------------------------------------------------------------

export interface BrandPreset {
  name: string;
  description: string;
  promptSuffix: string;
}

export const BRAND_PRESETS: Record<string, BrandPreset> = {
  'dark-lime': {
    name: 'Dark Lime',
    description: 'Black background #0B051D with lime #E6FFA9 accents',
    promptSuffix:
      'Use a deep dark background color #0B051D with vibrant lime green #E6FFA9 accent highlights. ' +
      'Modern, sleek, high-contrast aesthetic with the lime color used sparingly for emphasis.',
  },
  'light-clean': {
    name: 'Light Clean',
    description: 'White background #F9F8F5 with black text',
    promptSuffix:
      'Use a warm off-white background #F9F8F5 with clean black text and minimal ornamentation. ' +
      'Airy, spacious, modern layout with generous whitespace.',
  },
  'purple-gradient': {
    name: 'Purple Gradient',
    description: 'Purple Dark #2C2242 to Purple #6C47FF gradient',
    promptSuffix:
      'Use a rich gradient from deep purple #2C2242 to vibrant purple #6C47FF. ' +
      'Luxurious, modern feel with smooth color transitions and subtle glow effects.',
  },
  'lifestyle-warm': {
    name: 'Lifestyle Warm',
    description: 'Natural warm tones with brand color touches',
    promptSuffix:
      'Use natural warm tones — soft ambers, warm whites, gentle earth tones — with subtle ' +
      'touches of lime #E6FFA9 or purple #6C47FF as accent details. Inviting, lifestyle-oriented mood.',
  },
} as const;

export type BrandPresetKey = keyof typeof BRAND_PRESETS;

function applyBrandPreset(prompt: string, preset?: BrandPresetKey): string {
  if (!preset) return prompt;
  const brand = BRAND_PRESETS[preset];
  if (!brand) {
    throw new Error(
      `Unknown brand preset "${preset}". Available: ${Object.keys(BRAND_PRESETS).join(', ')}`,
    );
  }
  return `${prompt}. ${brand.promptSuffix}`;
}

// ---------------------------------------------------------------------------
// 4. Aspect ratio presets
// ---------------------------------------------------------------------------

export const ASPECT_RATIOS = {
  'instagram-feed-square': '1:1',
  'instagram-feed-portrait': '3:4',
  'instagram-story': '9:16',
  'instagram-reel': '9:16',
  'tiktok': '9:16',
  'linkedin-landscape': '16:9',
  'linkedin-square': '1:1',
  'og-image': '16:9',
} as const;

export type AspectRatioPreset = keyof typeof ASPECT_RATIOS;

function resolveAspectRatio(
  input?: string | AspectRatioPreset,
): string | undefined {
  if (!input) return undefined;
  if (input in ASPECT_RATIOS) {
    return ASPECT_RATIOS[input as AspectRatioPreset];
  }
  // Already a raw ratio like "16:9"
  return input;
}

// ---------------------------------------------------------------------------
// 5. Result types
// ---------------------------------------------------------------------------

export interface ImageResult {
  url: string;
  thumbnailUrl: string | null;
  requestId: string;
  model: ImageModelKey;
  /** Present when the API returns inline base64 data instead of a URL. */
  base64?: string;
}

export interface VideoResult {
  url: string;
  requestId: string;
  model: VideoModelKey | ImageToVideoModelKey;
  /** Present when the API returns inline base64 data instead of a URL. */
  base64?: string;
}

export interface GenerateImageOptions {
  prompt: string;
  model?: ImageModelKey;
  aspectRatio?: string | AspectRatioPreset;
  brandPreset?: BrandPresetKey;
  seed?: number;
  safetyTolerance?: number;
  /** Alias for brandPreset (used by CLI scripts). */
  preset?: BrandPresetKey;
  /** Alias for aspectRatio (used by CLI scripts). */
  ratio?: string | AspectRatioPreset;
}

export interface GenerateVideoOptions {
  prompt: string;
  model?: VideoModelKey;
  aspectRatio?: string | AspectRatioPreset;
  duration?: number;
  brandPreset?: BrandPresetKey;
  seed?: number;
  /** Alias for brandPreset (used by CLI scripts). */
  preset?: BrandPresetKey;
  /** Alias for aspectRatio (used by CLI scripts). */
  ratio?: string | AspectRatioPreset;
}

export interface ImageToVideoOptions {
  imageUrl: string;
  prompt: string;
  model?: 'dop-lite' | 'dop-turbo' | 'dop-standard';
  seed?: number;
}

export type BatchItem =
  | ({ type: 'image' } & GenerateImageOptions)
  | ({ type: 'video' } & GenerateVideoOptions)
  | ({ type: 'image-to-video' } & ImageToVideoOptions);

export type BatchResult = ImageResult | VideoResult;

// Convenience aliases used by CLI scripts (e.g. scripts/generate-content.ts)
export type ImageOptions = GenerateImageOptions;
export type VideoOptions = GenerateVideoOptions;
export type GenerationRequest = BatchItem;
export type GenerationResult = BatchResult & { type?: 'image' | 'video' };

// ---------------------------------------------------------------------------
// 6. Core generation functions
// ---------------------------------------------------------------------------

function extractImageUrl(response: V2Response): {
  url: string;
  thumbnailUrl: string | null;
} {
  const image = response.images?.[0];
  if (image?.url) {
    return { url: image.url, thumbnailUrl: null };
  }
  throw new HiggsfieldError(
    `Generation completed but no image URL returned (status: ${response.status}).`,
  );
}

function extractVideoUrl(response: V2Response): string {
  const video = response.video;
  if (video?.url) return video.url;
  throw new HiggsfieldError(
    `Generation completed but no video URL returned (status: ${response.status}).`,
  );
}

function assertCompleted(response: V2Response): void {
  if (response.status === 'failed') {
    throw new APIError(
      `Generation failed (request ${response.request_id}).`,
      500,
    );
  }
  if (response.status === 'nsfw') {
    throw new APIError(
      'Generation blocked: content flagged as NSFW.',
      422,
    );
  }
  if (response.status !== 'completed') {
    throw new APIError(
      `Unexpected generation status "${response.status}" for request ${response.request_id}.`,
      500,
    );
  }
}

export async function generateImage(
  options: GenerateImageOptions,
): Promise<ImageResult> {
  ensureInitialized();

  const {
    prompt,
    model = 'flux-pro',
    aspectRatio,
    brandPreset,
    seed,
    safetyTolerance = 2,
    preset,
    ratio,
  } = options;

  const effectivePreset = brandPreset ?? preset;
  const effectiveRatio = aspectRatio ?? ratio;

  const endpoint = resolveEndpoint(model);
  const enrichedPrompt = applyBrandPreset(prompt, effectivePreset);
  const resolvedRatio = resolveAspectRatio(effectiveRatio);

  const input: Record<string, unknown> = {
    prompt: enrichedPrompt,
    safety_tolerance: safetyTolerance,
  };
  if (resolvedRatio) input.aspect_ratio = resolvedRatio;
  if (seed !== undefined) input.seed = seed;

  const response = await higgsfield.subscribe(endpoint, {
    input,
    withPolling: true,
  });

  assertCompleted(response);
  const { url, thumbnailUrl } = extractImageUrl(response);

  return {
    url,
    thumbnailUrl,
    requestId: response.request_id,
    model,
  };
}

export async function generateVideo(
  options: GenerateVideoOptions,
): Promise<VideoResult> {
  ensureInitialized();

  const {
    prompt,
    model = 'kling-video',
    aspectRatio,
    duration,
    brandPreset,
    seed,
    preset,
    ratio,
  } = options;

  const effectivePreset = brandPreset ?? preset;
  const effectiveRatio = aspectRatio ?? ratio;

  const endpoint = resolveEndpoint(model);
  const enrichedPrompt = applyBrandPreset(prompt, effectivePreset);
  const resolvedRatio = resolveAspectRatio(effectiveRatio);

  const input: Record<string, unknown> = {
    prompt: enrichedPrompt,
  };
  if (resolvedRatio) input.aspect_ratio = resolvedRatio;
  if (duration !== undefined) input.duration = duration;
  if (seed !== undefined) input.seed = seed;

  const response = await higgsfield.subscribe(endpoint, {
    input,
    withPolling: true,
  });

  assertCompleted(response);
  const url = extractVideoUrl(response);

  return {
    url,
    requestId: response.request_id,
    model,
  };
}

export async function imageToVideo(
  options: ImageToVideoOptions,
): Promise<VideoResult> {
  ensureInitialized();

  const { imageUrl, prompt, model = 'dop-standard', seed } = options;

  const endpoint = resolveEndpoint('image-to-video');

  const input: Record<string, unknown> = {
    model,
    prompt,
    input_images: [{ type: 'image_url', image_url: imageUrl }],
  };
  if (seed !== undefined) input.seed = seed;

  const response = await higgsfield.subscribe(endpoint, {
    input,
    withPolling: true,
  });

  assertCompleted(response);
  const url = extractVideoUrl(response);

  return {
    url,
    requestId: response.request_id,
    model: 'image-to-video',
  };
}

// ---------------------------------------------------------------------------
// 7. Batch generation
// ---------------------------------------------------------------------------

const MAX_CONCURRENCY = 16;

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const idx = nextIndex++;
      try {
        const value = await tasks[idx]();
        results[idx] = { status: 'fulfilled', value };
      } catch (reason) {
        results[idx] = { status: 'rejected', reason };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

export async function batchGenerate(
  items: BatchItem[],
): Promise<PromiseSettledResult<BatchResult>[]> {
  if (items.length === 0) return [];

  const tasks = items.map((item) => {
    return () => {
      switch (item.type) {
        case 'image': {
          const { type: _, ...opts } = item;
          return generateImage(opts) as Promise<BatchResult>;
        }
        case 'video': {
          const { type: _, ...opts } = item;
          return generateVideo(opts) as Promise<BatchResult>;
        }
        case 'image-to-video': {
          const { type: _, ...opts } = item;
          return imageToVideo(opts) as Promise<BatchResult>;
        }
        default:
          throw new Error(`Unknown batch item type: ${(item as any).type}`);
      }
    };
  });

  return runWithConcurrency(tasks, MAX_CONCURRENCY);
}

// ---------------------------------------------------------------------------
// Re-exports for convenience
// ---------------------------------------------------------------------------

export {
  HiggsfieldError,
  APIError,
  AuthenticationError,
  TimeoutError,
  NotEnoughCreditsError,
  ValidationError,
};
