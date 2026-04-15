# Kyro Social Media Design Specifications

> Exact dimensions, typography, color rules, and layout templates for every social asset type.

---

## Brand Tokens

| Token | Hex | Usage |
|---|---|---|
| Kyro Black | #0B051D | Primary backgrounds, text on light |
| Kyro Lime | #E6FFA9 | Accents, CTAs, highlights, data |
| Kyro White | #F9F8F5 | Light backgrounds, body text on dark |
| Kyro Purple | #6C47FF | Secondary accent, buttons, links |
| Purple Dark | #2C2242 | Alternative dark background |
| Purple Mid | #AA89F2 | Tertiary accent, gradients, tags |

### Color Usage Ratios

- **60%** Dark (Black #0B051D or Purple Dark #2C2242) -- dominant background or text
- **25%** Lime (#E6FFA9) -- accent, highlights, key elements
- **15%** Purple (#6C47FF, #AA89F2) + White (#F9F8F5) -- supporting elements

---

## Typography

### Primary Font
**Inter** (or system equivalent: -apple-system, system-ui)
- Headings: Inter Bold (700) or Inter Black (900)
- Subheadings: Inter SemiBold (600)
- Body: Inter Regular (400) or Medium (500)
- Captions/Labels: Inter Medium (500)

### Fallback Font
**SF Pro Display** (Apple ecosystem) / **Google Sans** (Google ecosystem)

### Type Scale Reference (base at 1080px width)

| Element | Size Range | Weight | Line Height |
|---|---|---|---|
| Hero headline | 72-120px | 900 (Black) | 1.0-1.1 |
| Section headline | 48-64px | 700 (Bold) | 1.1-1.2 |
| Subheadline | 32-40px | 600 (SemiBold) | 1.2-1.3 |
| Body text | 24-32px | 400-500 | 1.4-1.5 |
| Caption/tag | 16-20px | 500 (Medium) | 1.3 |
| Fine print | 12-14px | 400 | 1.4 |

---

## Format Specifications

### 1. Instagram Feed Post

#### Square (1080 x 1080 px)

- **Canvas:** 1080 x 1080 px, 1:1
- **Safe zone:** 60px inset on all sides (content must not touch edges)
- **Logo placement:** Top-left or bottom-left corner, 48px from edges, logo height 36-44px
- **Typography sizes:**
  - Headline: 64-80px
  - Body: 28-32px
  - CTA/tag: 20-24px
- **Color combinations:**
  - A: Black background + Lime headline + White body
  - B: Lime background + Black headline + Black body
  - C: Purple Dark background + White headline + Lime accent
  - D: White background + Black headline + Purple accent

**Layout templates:**

- **Centered:** Headline centered vertically, body text below, logo top-left. Best for quotes, single stats, announcements.
- **Split horizontal:** Top 55% image/visual, bottom 45% text block on solid color. Best for product shots with context.
- **Text-left:** Text aligned left in the left 60%, right 40% holds an icon, illustration, or phone mockup. Best for feature highlights.
- **Full bleed image:** Photo fills canvas, dark gradient overlay on bottom 40%, white text over gradient. Logo top-left on the image.

**Example composition -- Feature Announcement:**
Black (#0B051D) background. Headline "Cashback loyalty cards" in Lime (#E6FFA9), 72px, Bold, centered at 35% from top. Subline "Now available for every business" in White (#F9F8F5), 28px, centered below with 16px gap. A phone mockup showing the wallet card centered below the text. Kyro logo bottom-left, 48px from edges. Subtle lime glow behind the phone.

#### Portrait (1080 x 1350 px)

- **Canvas:** 1080 x 1350 px, 4:5
- **Safe zone:** 60px inset on all sides
- **Extra vertical space:** Use for stacking headline + visual + CTA vertically
- **Logo placement:** Top-left, 48px from edges, logo height 36-44px
- **Typography sizes:** Same as square, headline can go up to 88px with the extra height
- **Layout advantage:** More room for a hero image or phone mockup in the center with text above and below

---

### 2. Instagram Story (1080 x 1920 px)

- **Canvas:** 1080 x 1920 px, 9:16
- **Top safe zone:** 200px from top (status bar, Story UI)
- **Bottom safe zone:** 270px from bottom (swipe-up/link area, username)
- **Side margins:** 60px
- **Effective content area:** 960 x 1450 px (centered)
- **Logo placement:** Centered top, below the 200px safe zone, or bottom-left above the 270px zone. Logo height 40-48px.
- **Typography sizes:**
  - Headline: 72-96px
  - Body: 28-36px
  - CTA: 24-32px (often placed near the bottom link zone)
- **Color combinations:**
  - A: Black full-bleed + Lime text + White supporting
  - B: Lime full-bleed + Black text (high impact, use sparingly)
  - C: Photo background + Black gradient overlay (top and bottom) + White text
  - D: Purple Dark background + Lime headline + White body

**Layout templates:**

- **Centered stack:** Content centered vertically in the safe area. Headline, spacer, visual, spacer, CTA. Best for announcements and promos.
- **Top text + bottom visual:** Text cluster in the upper third, large phone mockup or product image in the lower two-thirds. Best for product demos.
- **Full-screen photo:** Photo fills the canvas. Dark gradient from bottom (60% opacity). Text in the bottom third within the safe zone. Authentic, lifestyle feel.
- **Data card:** Large stat number centered (120px+), context text below, branded bar at top. Best for sharing metrics.

**Example composition -- Promo Story:**
Black (#0B051D) full-bleed background. "2x STAMPS" in Lime (#E6FFA9) at 96px Bold, centered at ~30% from top. "This weekend only" in White (#F9F8F5) at 32px below. A phone mockup with a loyalty card in the center third. Bottom CTA "Tap to learn more" in Lime at 28px, positioned above the 270px bottom safe zone. Kyro logo centered top at 220px from top edge.

---

### 3. Instagram Reel Cover (1080 x 1920 px)

- **Canvas:** 1080 x 1920 px, 9:16
- **Center-crop safe zone:** The center 1080 x 1080 px area must be independently readable (this is what shows in the grid)
- **Grid-visible area:** Vertically centered 1080 x 1080 px square
- **Top/bottom overflow:** 420px each (visible only in full Reel view)
- **Logo placement:** Within the center square, top-left, 48px from the square's edges
- **Typography:** All key text must fall within the center 1080 x 1080 area
  - Headline: 64-80px (must be in center square)
  - Context text: 28-32px (must be in center square)

**Layout templates:**

- **Center-safe text:** Headline and body centered in the 1080x1080 zone. Background extends to fill 1920 height with gradient or pattern. The grid crop looks intentional.
- **Scene with text overlay:** A still from the reel as background. Dark overlay in the center square area. Bold text over the overlay. The full 9:16 shows the scene, the grid crop shows the text.

---

### 4. Instagram Carousel (1080 x 1350 px per slide)

- **Canvas per slide:** 1080 x 1350 px, 4:5
- **Safe zone:** 60px inset on all sides per slide
- **Slide count:** 2-10 slides (optimal: 5-7 for engagement)
- **Logo placement:** Consistent position across all slides -- top-left recommended, 48px from edges
- **Page indicator space:** Leave 40px clear at the bottom center for the dot indicators
- **Typography:** Same as feed portrait

**Carousel structure templates:**

- **Hook-Educate-CTA:**
  - Slide 1 (Hook): Bold headline, eye-catching visual. "5 reasons your customers leave."
  - Slides 2-6 (Content): One point per slide, consistent layout. Number + headline + supporting text or visual.
  - Slide 7 (CTA): Logo prominent, CTA text, URL or handle.

- **Before/After:**
  - Slide 1: "Before" scenario (paper cards, empty shop)
  - Slides 2-4: Transformation steps
  - Slide 5: "After" scenario (digital loyalty, busy shop)

- **Visual consistency rules:**
  - Background color alternates between max 2 options (e.g., Black and Lime, or Black and Purple Dark)
  - Headline position identical on every content slide
  - Slide number or progress indicator in a consistent corner (optional)

**Example composition -- Feature Carousel:**
Slide 1: Black background. "Stop losing customers" in Lime at 72px, centered. A crumpled paper loyalty card illustration below. Slide 2-5: Purple Dark background. Each slide has a feature headline in White at 48px near the top, a phone mockup in the center, and a one-line description in Lime at 24px. Slide 6: Lime background. "Start free today" in Black at 72px, centered. Kyro logo centered below. Website URL at bottom.

---

### 5. TikTok Video (1080 x 1920 px)

- **Canvas:** 1080 x 1920 px, 9:16
- **Top safe zone:** 150px (For You page UI)
- **Bottom safe zone:** 340px (caption, music, interaction buttons)
- **Right safe zone:** 100px (like/comment/share buttons)
- **Left margin:** 60px
- **Effective content area:** 920 x 1430 px (offset left)
- **Logo placement:** Top-left, below 150px safe zone, 60px from left edge. Logo height 36-40px. Keep subtle -- TikTok audiences respond negatively to heavy branding.
- **Typography sizes:**
  - Hook text (first 1-2s): 80-100px, centered in safe area
  - Body text: 32-40px
  - CTA: 28-36px (placed above bottom safe zone)
- **Text placement note:** All text must avoid the right 100px and bottom 340px

**Color direction for TikTok:**
- Slightly more saturated than other platforms
- Black backgrounds with lime text perform well (high contrast on mobile)
- Avoid full lime backgrounds (too bright on autoplay, users scroll past)

---

### 6. LinkedIn Post

#### Landscape (1200 x 627 px)

- **Canvas:** 1200 x 627 px, ~1.91:1
- **Safe zone:** 48px inset on all sides
- **Logo placement:** Top-left or bottom-right, 48px from edges, logo height 32-40px
- **Typography sizes:**
  - Headline: 48-56px
  - Body: 22-26px
  - Source/tag: 16-18px
- **Color combinations:**
  - A: Black background + White headline + Lime accent data
  - B: White (#F9F8F5) background + Black text + Purple accent (more corporate)
  - C: Purple Dark background + White headline + Lime CTA
- **Note:** LinkedIn compresses images aggressively. Use high contrast and large text. Avoid fine details.

**Layout templates:**

- **Stat highlight:** Large number in lime (72px+) left-aligned, context text to the right. Logo bottom-right. Black background. Best for data-driven posts.
- **Quote card:** Centered quote text in white, attribution below. Subtle lime quotation marks. Black or purple dark background. Best for thought leadership.
- **Split:** Left 50% solid color with text, right 50% photo or mockup. Clean dividing line.

#### Square (1080 x 1080 px)

- Same specs as Instagram Feed Square
- Prefer slightly more conservative color use (lean toward White + Black + Purple over heavy Lime)
- Add more white space for a professional feel

**Example composition -- LinkedIn Stat Post:**
Black (#0B051D) background, 1200x627. Large "73%" in Lime (#E6FFA9) at 72px Bold, positioned left, vertically centered, 80px from left edge. "of consumers prefer digital loyalty over paper" in White (#F9F8F5) at 24px, right of the number with 40px gap. Kyro logo bottom-right, 48px from edges. A subtle purple (#6C47FF) thin line separates the number from the text.

---

### 7. OG / Link Preview (1200 x 630 px)

- **Canvas:** 1200 x 630 px, ~1.91:1
- **Critical safe zone:** Center 800 x 420 px (some platforms crop unpredictably)
- **Logo placement:** Centered, or top-left with 60px margins. Logo height 40-48px.
- **Typography:**
  - Title: 48-60px (must be in the center safe zone)
  - Subtitle: 24-28px
- **Color combinations:**
  - Primary: Black background + Lime text + centered logo (works on all platforms)
  - Secondary: White background + Black text + Purple accent (cleaner for corporate links)
- **Important:** OG images are displayed at various sizes across platforms (Slack, Twitter/X, Discord, iMessage). Keep text large and centered. Never put critical information near edges.

**Layout templates:**

- **Centered brand:** Logo centered top third. Title centered middle. Subtle pattern or gradient in background. The safest, most universal layout.
- **Left-aligned info:** Logo top-left. Title and subtitle left-aligned in the center zone. Right side has an icon or simple graphic.

**Example composition -- Blog Post OG:**
Black (#0B051D) background. Kyro logo centered, 160px from top, height 56px. Blog title "How to launch a loyalty program in 10 minutes" in White (#F9F8F5) at 48px Bold, centered, max width 800px, 40px below logo. Subtitle "A step-by-step guide for local businesses" in Purple Mid (#AA89F2) at 24px below. Faint lime gradient glow behind the text from center outward.

---

## Instagram Grid Planning

### 3-Column Visual Rhythm

Plan posts in rows of 3 to create visual cohesion when viewed on the profile grid.

**Recommended row patterns:**

| Pattern | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| A -- Dark dominant | Black bg, lime text | Photo with dark overlay | Black bg, purple accent |
| B -- Light pop | Lime bg, black text | Photo (bright/lifestyle) | White bg, purple text |
| C -- Photo-led | Editorial photo | Black bg, stat/quote | Editorial photo |
| D -- Feature row | Product mockup | Feature text card | Product mockup |

**Grid rules:**
- Never place two consecutive Lime-background posts (too loud)
- Alternate between text-heavy and image-heavy posts
- Every row should contain at least one post with photography or a mockup
- Maintain consistent logo placement across the row (all top-left or none)
- Use a grid planning tool (Later, Planoly, or a Figma template) to preview before posting

### Color distribution across 9-post grid

| Position | Suggested Background |
|---|---|
| 1 (top-left) | Black |
| 2 (top-center) | Photo |
| 3 (top-right) | Purple Dark |
| 4 (mid-left) | Lime |
| 5 (mid-center) | Black |
| 6 (mid-right) | Photo |
| 7 (bottom-left) | Photo |
| 8 (bottom-center) | Lime |
| 9 (bottom-right) | Black |

This creates a diagonal rhythm of dark tones with lime and photo pops.

---

## Photo Treatment Guidelines

### Overlay Rules

- **Dark overlay on photos:** Use Black (#0B051D) at 40-60% opacity for text readability. Apply as gradient from bottom (most common) or as a full overlay.
- **Color tinting:** For on-brand photos, apply a subtle color grade:
  - Push shadows toward #0B051D (desaturated cool dark)
  - Push highlights toward #F9F8F5 (warm white, not blue-white)
  - Add a slight lime tint to midtones if the image will appear alongside heavy brand elements
- **Duotone treatment:** Map shadows to Black (#0B051D) and highlights to Lime (#E6FFA9) for a bold editorial look. Use sparingly -- 1 in every 6-9 posts max.

### Filter/Grade Preset

Apply consistently across all editorial photography:
- Contrast: +10-15%
- Highlights: -5 (prevent blowout)
- Shadows: +10 (lift slightly for that modern flat look)
- Warmth: +5 (subtle warmth)
- Saturation: -10 (slightly desaturated for sophistication)
- Grain: 5-8% (subtle film texture, optional)

### Cropping Rules

- **Faces:** Use rule of thirds. Eyes at the upper third line.
- **Products/phones:** Center or golden ratio placement. Leave breathing room.
- **Flat lays:** Overhead, items arranged with clear margins, no clutter at edges.
- **Storefronts:** Straight-on or slight angle. Correct perspective distortion in post.

---

## Template Naming Convention

Use this format for all design files:

```
kyro_[platform]_[format]_[variant]_[version].[ext]
```

**Examples:**
- `kyro_ig_feed-sq_stat-highlight_v1.png`
- `kyro_ig_story_promo-centered_v2.png`
- `kyro_ig_carousel_feature-hook_v1_slide01.png`
- `kyro_tiktok_video_hook-text_v1.png`
- `kyro_linkedin_landscape_quote_v1.png`
- `kyro_og_blog-post_v1.png`

**Platform codes:**
- `ig` -- Instagram
- `tiktok` -- TikTok
- `linkedin` -- LinkedIn
- `og` -- Open Graph / link preview
- `multi` -- Multi-platform (used for assets that work across platforms)

**Format codes:**
- `feed-sq` -- Feed square (1080x1080)
- `feed-port` -- Feed portrait (1080x1350)
- `story` -- Story (1080x1920)
- `reel-cover` -- Reel cover (1080x1920)
- `carousel` -- Carousel (append _slideNN)
- `video` -- Video thumbnail/frame
- `landscape` -- Landscape post
- `link-preview` -- OG image

---

## Export Settings

### Static Images (PNG)

- **Format:** PNG-24
- **Color profile:** sRGB IEC61966-2.1 (always -- never use Adobe RGB or P3 for social)
- **Resolution:** 72 PPI (higher PPI adds file size with zero benefit on social)
- **Max file size:** Under 5 MB for Instagram, under 8 MB for LinkedIn
- **Compression:** Use TinyPNG or similar for 60-80% file size reduction with no visible quality loss

### Static Images (JPG) -- for photos

- **Format:** JPEG
- **Quality:** 85-92% (balance of quality and file size)
- **Color profile:** sRGB
- **Use when:** The image is primarily photographic (lifestyle shots, behind-the-scenes). PNG is better for graphics, text-heavy images, and anything with transparency.

### Video

- **Format:** MP4 (H.264 codec)
- **Resolution:** 1080x1920 (9:16) or 1080x1080 (1:1)
- **Frame rate:** 30fps (standard) or 60fps (smooth motion, product demos)
- **Bitrate:** 10-15 Mbps for 1080p
- **Audio:** AAC, 128-256 kbps (if applicable)
- **Max duration by platform:**
  - Instagram Reel: 90s
  - Instagram Story: 60s (auto-splits at 60s)
  - TikTok: 10 min (optimal under 60s)
  - LinkedIn: 10 min (optimal 30-90s)

### Animated (GIF)

- **Format:** GIF or APNG (prefer APNG for quality)
- **Max colors:** 128-256
- **Max file size:** 8 MB
- **Use for:** Simple looping animations, micro-interactions, email headers

---

## Quick Reference -- Dimensions Cheat Sheet

| Asset | Dimensions | Aspect Ratio |
|---|---|---|
| IG Feed Square | 1080 x 1080 | 1:1 |
| IG Feed Portrait | 1080 x 1350 | 4:5 |
| IG Story | 1080 x 1920 | 9:16 |
| IG Reel Cover | 1080 x 1920 | 9:16 |
| IG Carousel Slide | 1080 x 1350 | 4:5 |
| TikTok | 1080 x 1920 | 9:16 |
| LinkedIn Landscape | 1200 x 627 | ~1.91:1 |
| LinkedIn Square | 1080 x 1080 | 1:1 |
| OG / Link Preview | 1200 x 630 | ~1.91:1 |
