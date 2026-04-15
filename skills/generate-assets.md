# Skill: Generate Assets

> Translates design briefs and video briefs into Higgsfield API generation commands. The bridge between agent creative direction and automated asset production.

---

## When to Use

Use this skill when:
- An Art Director has produced a design brief and you need to generate the image asset
- A Video Producer has produced a video brief and you need to generate video clips
- You are running batch generation for a content week
- You need to re-generate an asset that failed quality review

---

## Input: What You Need

### From Art Director (Design Brief)

Required fields from the brief:
- **PLATFORM** and dimensions (determines `--platform` and `--aspect-ratio`)
- **COLOR COMBO** number (determines `--preset`)
- **VISUALS** section (becomes the core prompt)
- **MOOD** (informs prompt tone and style tags)
- Content type: branded graphic, lifestyle photo, text-heavy, or variation

### From Video Producer (Video Brief)

Required fields from the brief:
- **PLATFORM** and aspect ratio
- **SHOT** list with individual prompts
- **DURATION** per shot
- **STYLE** (realistic, abstract/brand, social clip)
- Input image path (if using image-to-video workflow)

---

## Translation Rules

### Step 1: Select the Model

**For images:**

| Content Type | Model |
|---|---|
| Branded graphics, product shots, dark-bg compositions | `flux-pro` |
| Lifestyle photography, real environments, people | `kling-image` |
| Variations, A/B tests, quick iterations | `seedream-5` (quality) or `seedream-4.5` (speed) |
| Text-heavy posts (quote cards, stat callouts, tips) | `gpt-image` |

**For video:**

| Content Type | Model |
|---|---|
| Realistic scenes with people or physical environments | `kling-video` |
| Abstract motion, brand reveals, UI animations | `seedance-2` |
| Short social clips, loops, trend-format content | `seedance-1.5` |

### Step 2: Select the Preset

| Brief Color Combo | Preset | When |
|---|---|---|
| #1 (dark bg + lime accent) or #2 (dark bg + lime headline + purple accent) | `dark-lime` | Product Power, bold announcements |
| #4 (light bg + dark text + purple accent) or #7 (white bg + dark text + purple accent) | `light-clean` | Educational content, LinkedIn, tips |
| #3 (black-to-purple gradient) | `purple-gradient` | Hero visuals, launches, campaigns |
| Lifestyle/photography mood | `lifestyle-warm` | Customer stories, real-world scenes |
| #5 or #6 (light bg + purple vivid accent) | `light-clean` | Friendly, approachable, tagged content |

### Step 3: Build the Prompt

Transform the brief's VISUALS section into a generation prompt using this structure:

```
[Subject and main element], [composition and spatial layout],
[background description matching preset], [accent color placement],
[lighting description], [mood and atmosphere],
[style tags: clean design, premium feel, modern fintech aesthetic],
[quality tags: 4K, high resolution, sharp detail]
```

### Step 4: Build the Negative Prompt

Always include:
```
text, watermarks, logos, blurry, oversaturated, stock photo,
generic, cluttered, low contrast, harsh shadows
```

Add content-specific negatives:
- Lifestyle photos: "posed, artificial, studio backdrop, plastic skin"
- Product graphics: "busy background, multiple focal points, gradients in wrong direction"
- Video: "jittering, frame drops, morphing subjects, flickering"

### Step 5: Set Platform Parameters

| Platform | Aspect Ratio | Resolution |
|---|---|---|
| Instagram Feed (square) | `1:1` | 1080x1080 |
| Instagram Feed (portrait) | `4:5` | 1080x1350 |
| Instagram Reels / TikTok / Shorts / Stories | `9:16` | 1080x1920 |
| LinkedIn Feed | `1:1` | 1080x1080 |
| YouTube Thumbnail / Long-form | `16:9` | 1920x1080 |

---

## Output: CLI Commands

### Image Generation

```bash
npx ts-node scripts/generate-content.ts \
  --model [flux-pro|kling-image|seedream-5|seedream-4.5|gpt-image] \
  --preset [dark-lime|light-clean|purple-gradient|lifestyle-warm] \
  --platform [instagram|tiktok|linkedin|youtube] \
  --aspect-ratio [1:1|4:5|9:16|16:9] \
  --prompt "[translated prompt]" \
  --negative-prompt "[negative prompt]"
```

### Video Generation (text-to-video)

```bash
npx ts-node scripts/generate-content.ts \
  --model [kling-video|seedance-2|seedance-1.5] \
  --preset [dark-lime|light-clean|purple-gradient|lifestyle-warm] \
  --platform [instagram|tiktok|linkedin|youtube] \
  --aspect-ratio [9:16|1:1|16:9] \
  --duration [seconds] \
  --prompt "[translated prompt]" \
  --negative-prompt "[negative prompt]"
```

### Video Generation (image-to-video)

```bash
# Step 1: Generate the key frame
npx ts-node scripts/generate-content.ts \
  --model flux-pro \
  --preset [preset] \
  --aspect-ratio [ratio] \
  --prompt "[static frame prompt]" \
  --negative-prompt "[negative prompt]"

# Step 2: Animate the frame
npx ts-node scripts/generate-content.ts \
  --model [kling-video|seedance-2|seedance-1.5] \
  --input-image [path to generated frame] \
  --duration [seconds] \
  --aspect-ratio [ratio] \
  --prompt "[motion description only -- what moves and how]" \
  --negative-prompt "jittering, frame drops, morphing, flickering"
```

### Batch Generation (full week)

```bash
npx ts-node scripts/generate-week.ts \
  --week [YYYY-WNN] \
  --config [content-calendar.json]
```

---

## Quality Check Prompts

After generation, evaluate each asset against these criteria. If an asset fails, follow the feedback loop below.

### For Images

1. **Brand color accuracy**: Do the background, accent, and text colors match the intended preset? Compare visually against approved color combo swatches.
2. **Composition**: Is there one clear focal point? Is there generous white space (at least 6% margins)? Is the layout clean and uncluttered?
3. **Artifacts**: Any hallucinated elements, distorted shapes, extra limbs, or unnatural blending?
4. **Mood match**: Does the image feel like what the brief describes? Bold and premium for dark-lime, warm and inviting for lifestyle-warm?
5. **Thumbnail test**: Does the image read clearly at 50% scale?
6. **Brand test**: Would you recognize this as Kyro content without a logo?

### For Video

1. **Motion quality**: Is the motion smooth? Any jittering, morphing, or frame drops?
2. **Subject consistency**: Does the subject maintain its appearance throughout the clip?
3. **Camera motion**: Does the camera move as specified (or stay static if specified)?
4. **Color consistency**: Do colors stay stable throughout the clip? No unexpected shifts?
5. **Loop quality**: If intended as a loop, does the end connect cleanly to the start?
6. **Brand alignment**: Does the motion follow Kyro principles (simple, purposeful, playful)?

---

## Feedback Loop: When Generation Does Not Match the Brief

### Diagnosis

| Problem | Likely Cause | Fix |
|---|---|---|
| Wrong colors | Prompt color descriptions too vague | Be more specific: "deep navy-black (#0B051D)" instead of "dark background" |
| Wrong composition | Prompt lacks spatial direction | Add explicit layout: "centered in frame", "lower third", "left side of frame" |
| Too busy/cluttered | Prompt has too many elements | Simplify to 2-3 key elements. Add "minimal, clean, generous negative space" |
| Wrong mood | Style tags missing or wrong | Adjust closing tags: "premium, sophisticated" vs "playful, energetic" |
| Artifacts/distortion | Model limitation for this content type | Switch models (e.g., kling-image for photorealism instead of flux-pro) |
| Text unreadable | Wrong model for text content | Switch to gpt-image for anything with on-image text |
| Video jittering | Prompt too complex for model | Simplify motion description. Use image-to-video instead of text-to-video. |
| Colors shift in video | Model struggles with color consistency | Use image-to-video workflow with a color-accurate static frame |

### Adjustment Protocol

1. **First attempt fails**: Refine the prompt. Add more specific descriptors for the failing element. Do not change the model or preset yet.
2. **Second attempt fails**: Consider switching the model. Check the model selection decision tree. Try image-to-video if direct video generation is inconsistent.
3. **Third attempt fails**: Escalate. The brief may need revision, or this asset may need manual design. Flag to the Art Director or Video Producer with the three failed outputs and a note on what went wrong.

Maximum 3 generation attempts per asset to control costs.

---

## Prompt Enhancement: From Basic to Brand-Aligned

When a brief provides a basic visual description, enhance it with Kyro brand direction before generating.

### Enhancement Template

**Basic prompt from brief:**
> "Phone showing loyalty card on screen"

**Step 1 -- Add specificity:**
> "iPhone 15 Pro showing a Kyro digital loyalty card on screen"

**Step 2 -- Add composition:**
> "iPhone 15 Pro held at slight angle, showing a Kyro digital loyalty card on screen, centered in frame with generous negative space"

**Step 3 -- Add brand colors (matching the preset):**
> "iPhone 15 Pro held at slight angle, showing a Kyro digital loyalty card on screen, centered on deep navy-black background, soft lime green accent glow from screen"

**Step 4 -- Add lighting and mood:**
> "iPhone 15 Pro held at slight angle, showing a Kyro digital loyalty card on screen, centered on deep navy-black background, soft lime green accent glow from screen, clean studio lighting with subtle warm tone, premium and confident atmosphere"

**Step 5 -- Add quality and style tags:**
> "iPhone 15 Pro held at slight angle, showing a Kyro digital loyalty card on screen, centered on deep navy-black background, soft lime green accent glow from screen, clean studio lighting with subtle warm tone, premium and confident atmosphere, modern fintech aesthetic, sharp detail, 4K, high resolution"

### Brand Direction Additions by Preset

**dark-lime:**
- Background: "deep navy-black background (#0B051D)"
- Accent: "soft lime green glow/accent/highlight (#E6FFA9)"
- Mood: "bold, premium, confident, modern"
- Lighting: "clean studio lighting, subtle warm tone"

**light-clean:**
- Background: "warm off-white background (#F9F8F5)" or "clean white background"
- Accent: "vibrant purple accent (#6C47FF)" or "vivid purple tag/highlight (#9333EA)"
- Mood: "clean, educational, approachable, professional"
- Lighting: "bright, even, natural daylight feel"

**purple-gradient:**
- Background: "gradient from deep black to rich purple, angled 135 degrees"
- Accent: "lime green highlight (#E6FFA9) on white text"
- Mood: "hero, premium, launch energy, expansive"
- Lighting: "dramatic, cinematic, colored ambient light"

**lifestyle-warm:**
- Background: "real environment, natural setting"
- Accent: "minimal brand overlay, natural warm tones"
- Mood: "warm, inviting, authentic, candid"
- Lighting: "natural golden hour, warm side lighting, soft shadows"

---

## Complete Example: Brief to Generated Asset

**Input: Design brief from Art Director**

```
ASSET: Weekly Tip -- Push Notification Setup
PLATFORM: Instagram | 1080x1080
COLOR COMBO: #4 (light bg, dark text, purple accent)
MOOD: Clean, educational, approachable

VISUALS:
- Phone showing push notification settings screen
- Light background with subtle geometric pattern
- Purple accent elements framing the phone

COPY:
- Headline: "Set up push notifications in 2 minutes"
- Sub: "Keep your customers coming back"
```

**Translation:**

1. Model: `flux-pro` (branded graphic, no text rendering needed -- text added in post-production)
2. Preset: `light-clean`
3. Platform: Instagram, 1:1

**Enhanced prompt:**
```
iPhone 15 Pro showing a notification settings screen, centered in frame on warm off-white background,
subtle geometric pattern in background using light gray lines, vibrant purple accent elements framing
the phone on left and right sides, bright even natural daylight lighting, clean educational feel,
approachable and professional atmosphere, modern fintech aesthetic, minimal composition,
generous negative space, sharp detail, 4K, high resolution
```

**CLI command:**
```bash
npx ts-node scripts/generate-content.ts \
  --model flux-pro \
  --preset light-clean \
  --platform instagram \
  --aspect-ratio 1:1 \
  --prompt "iPhone 15 Pro showing a notification settings screen, centered in frame on warm off-white background, subtle geometric pattern in background using light gray lines, vibrant purple accent elements framing the phone on left and right sides, bright even natural daylight lighting, clean educational feel, approachable and professional atmosphere, modern fintech aesthetic, minimal composition, generous negative space, sharp detail, 4K, high resolution" \
  --negative-prompt "text, watermarks, logos, blurry, oversaturated, stock photo, generic, cluttered, low contrast, harsh shadows, busy background"
```

**Quality check:**
- Brand color accuracy: Off-white bg + purple accents match combo #4. Pass.
- Composition: Single focal point (phone), generous space. Pass.
- Artifacts: Inspect for distortion on phone screen and geometric elements.
- Mood: Clean and educational, not corporate or sterile. Pass.
- Thumbnail test: Phone and purple framing readable at 50%. Pass.

If generation fails quality check, follow the feedback loop: refine prompt specificity on the failing element, retry up to 3 times, then escalate.
