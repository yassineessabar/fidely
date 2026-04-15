# Skill: Design Brief Generator

> Creates detailed design briefs for static social media assets, ready for handoff to a designer or AI image generation tool.

---

## Inputs

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `content_type` | Yes | Type of asset | `feed-post`, `carousel`, `story`, `ad`, `banner`, `thumbnail`, `og-image` |
| `message` | Yes | Core message or copy | "Kyro now has push notifications" |
| `platform` | Yes | Target platform | `instagram`, `tiktok`, `linkedin`, `twitter`, `facebook`, `web` |
| `pillar` | No | Content pillar | `product-power`, `social-proof`, `education`, `brand-personality`, `local-biz-love` |
| `mood` | No | Visual mood | `bold`, `clean`, `warm`, `energetic`, `premium` |

---

## Platform Dimensions Reference

### Instagram
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Feed post (square) | 1080x1080 | 1:1 |
| Feed post (portrait) | 1080x1350 | 4:5 |
| Story / Reel cover | 1080x1920 | 9:16 |
| Carousel slide | 1080x1080 or 1080x1350 | 1:1 or 4:5 |
| Profile picture | 320x320 | 1:1 |

### TikTok
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Video cover | 1080x1920 | 9:16 |
| Profile picture | 200x200 | 1:1 |

### LinkedIn
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Feed image | 1200x627 | 1.91:1 |
| Article cover | 1200x644 | ~1.86:1 |
| Company banner | 1128x191 | ~5.9:1 |

### Twitter/X
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Feed image | 1200x675 | 16:9 |
| Header | 1500x500 | 3:1 |

### Facebook
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| Feed image | 1200x630 | 1.91:1 |
| Cover photo | 820x312 | ~2.63:1 |

### Web / OG
| Format | Dimensions | Aspect Ratio |
|--------|-----------|--------------|
| OG image | 1200x630 | 1.91:1 |
| Blog hero | 1200x600 | 2:1 |
| Email header | 600x200 | 3:1 |

---

## Kyro Design System Reference

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Kyro Black | #0B051D | Primary backgrounds, text |
| Kyro Lime | #E6FFA9 | CTAs, accents on dark backgrounds |
| Kyro White | #F9F8F5 | Light backgrounds |
| Pure White | #FFFFFF | Clean backgrounds, cards |
| Kyro Purple | #6C47FF | Gradients, hero sections, accents |
| Purple Dark | #2C2242 | Dark gradient endpoint |
| Purple Mid | #AA89F2 | Secondary accents |
| Purple Light | #F3E8FF | Light purple backgrounds |
| Purple Vivid | #9333EA | Labels, links |

### Color Combinations (approved)
| Background | Text | Accent | Use When |
|-----------|------|--------|----------|
| #0B051D (Black) | #FFFFFF (White) | #E6FFA9 (Lime) | Bold statements, CTAs |
| #0B051D (Black) | #E6FFA9 (Lime) | #6C47FF (Purple) | Premium, product features |
| #F9F8F5 (White) | #0B051D (Black) | #6C47FF (Purple) | Educational, clean |
| #F9F8F5 (White) | #0B051D (Black) | #9333EA (Vivid) | Tags, categories |
| Gradient (Black to Purple) | #FFFFFF (White) | #E6FFA9 (Lime) | Hero sections, launches |
| #F3E8FF (Light Purple) | #0B051D (Black) | #9333EA (Vivid) | Soft, friendly |

### Typography
| Element | Font | Weight | Size Range |
|---------|------|--------|-----------|
| Headline (social) | Klarna Title Bold | 700 | 40-72px |
| Subheadline | Klarna Title Bold | 700 | 24-36px |
| Body text | Klarna Text Regular | 400 | 18-24px |
| CTA text | Klarna Text Medium | 500 | 18-24px |
| Caption/tag | Klarna Text Bold | 700 | 12-16px |

### Layout Rules
- **Margins**: 6% of shortest side minimum
- **Gutters**: Half of margin
- **Text safe zone**: Keep within center 80% of canvas
- **Logo placement**: Bottom-left or bottom-right, with clear space equal to logo height
- **Visual hierarchy**: One focal point per design. Do not compete headline with imagery.

### Border Radius
- Cards/containers: 12-16px
- Buttons: 9999px (pill)
- Tags/badges: 100px
- Phone mockups: match device radius

---

## Output Structure

### 1. Brief Overview
- **Asset name**: Descriptive name for file naming
- **Platform**: Target with exact dimensions
- **Content type**: Format type
- **Objective**: What this asset needs to accomplish
- **Pillar**: Content pillar alignment

### 2. Layout Specification

Describe the composition in precise terms:

```
CANVAS: [width]x[height] px
BACKGROUND: [color hex or gradient definition]

┌─────────────────────────────────────┐
│  [margin]                           │
│  ┌───────────────────────────────┐  │
│  │  [ELEMENT 1: description]     │  │
│  │  Position: [top/center/bottom]│  │
│  │  Size: [width x height or %]  │  │
│  │                               │  │
│  │  [ELEMENT 2: description]     │  │
│  │  Position: [relative to E1]   │  │
│  │                               │  │
│  │  [ELEMENT 3: description]     │  │
│  │  Position: [relative to E2]   │  │
│  └───────────────────────────────┘  │
│  [margin]                           │
│  LOGO: [position, size]             │
└─────────────────────────────────────┘
```

### 3. Copy Placement

| Element | Text | Font | Size | Color | Alignment |
|---------|------|------|------|-------|-----------|
| Headline | [exact text] | Klarna Title Bold | [size]px | [hex] | [left/center/right] |
| Subheadline | [exact text] | Klarna Title Bold | [size]px | [hex] | [alignment] |
| Body | [exact text] | Klarna Text Regular | [size]px | [hex] | [alignment] |
| CTA | [exact text] | Klarna Text Medium | [size]px | [hex] | [alignment] |
| Tag | [exact text] | Klarna Text Bold | [size]px | [hex] | [alignment] |

### 4. Visual Elements

List every visual component:

| Element | Description | Position | Size | Notes |
|---------|-------------|----------|------|-------|
| Phone mockup | iPhone showing Kyro wallet pass | Right 60% | 50% of canvas height | Rotated 5 degrees, drop shadow |
| Icon | Push notification bell | Left of headline | 32x32px | Lime color, simple line style |
| Background shape | Subtle gradient blob | Behind phone | 40% of canvas | Purple #6C47FF, 20% opacity |

### 5. Color Specification

```
Background:    #0B051D (Kyro Black)
                or: linear-gradient(135deg, #0B051D 0%, #2C2242 50%, #6C47FF 100%)
Headline:      #FFFFFF (White)
Subheadline:   #E6FFA9 (Lime)
Body text:     #C4C3CA (Footer Text gray)
CTA button:    #E6FFA9 background, #0B051D text
Tag:           #F3E8FF background, #9333EA text
Accent:        #6C47FF (Purple)
```

### 6. Mockup Description

Write a natural-language description of the final design for use as:
- A prompt for AI image generation tools (Midjourney, DALL-E, Figma AI)
- A description for a designer who cannot see a reference image

Include: overall impression, mood, what draws the eye first, what the viewer should feel.

### 7. Carousel Slides (if applicable)

For carousel posts, define each slide with the same level of detail:

```
SLIDE [number] / [total]
Purpose: [what this slide communicates]
[Full layout, copy, and visual spec as above]
```

Carousel rules:
- Slide 1: Hook (must work as standalone thumbnail)
- Slide 2-N: Value delivery (one point per slide)
- Last slide: CTA
- Visual consistency: same background, same text placement, varying content
- Swipe indicators on slides 1 through N-1

---

## Design Quality Gates

Before finalizing any brief, verify:

- [ ] Text is readable at the target size (phone screen)
- [ ] Contrast ratio meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Only approved color combinations are used
- [ ] Kyro logo has proper clear space
- [ ] No text in the Instagram/TikTok UI overlay zones (top 15%, bottom 20% for stories/reels)
- [ ] Visual hierarchy is clear: one focal point
- [ ] Copy follows Kyro voice rules
- [ ] All dimensions match platform requirements exactly
- [ ] Font names are exact (Klarna Title Bold, Klarna Text Regular/Medium/Bold)
- [ ] Design works at 50% scale (thumbnail preview test)

---

## Example Execution

**Input:**
- Content type: `feed-post`
- Message: "Your loyalty card, in their phone"
- Platform: `instagram`
- Pillar: `product-power`
- Mood: `bold`

**Output:**

### 1. Brief Overview
- **Asset name**: `kyro-wallet-pass-awareness-ig-feed`
- **Platform**: Instagram feed (1080x1350, 4:5)
- **Content type**: Single image feed post
- **Objective**: Drive awareness that Kyro loyalty cards live in Apple/Google Wallet
- **Pillar**: Product Power

### 2. Layout Specification

```
CANVAS: 1080x1350 px
BACKGROUND: #0B051D (Kyro Black)

┌─────────────────────────────────────┐
│  65px margin                        │
│  ┌───────────────────────────────┐  │
│  │  TAG: "Digital Loyalty"       │  │
│  │  Position: top-left           │  │
│  │  Margin-bottom: 24px          │  │
│  │                               │  │
│  │  HEADLINE: "Your loyalty      │  │
│  │  card. Already in             │  │
│  │  their phone."                │  │
│  │  Position: left-aligned       │  │
│  │  Width: 80% of canvas         │  │
│  │  Margin-bottom: 16px          │  │
│  │                               │  │
│  │  SUBHEADLINE:                 │  │
│  │  "No app. No plastic.        │  │
│  │   Just tap and earn."         │  │
│  │  Margin-bottom: 48px          │  │
│  │                               │  │
│  │  PHONE MOCKUP:                │  │
│  │  iPhone showing Apple Wallet  │  │
│  │  with Kyro pass visible     │  │
│  │  Position: center, fills      │  │
│  │  lower 55% of canvas          │  │
│  │  Slight upward angle (5deg)   │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  LOGO: bottom-left, 24px margin     │
│  Size: 80px wide                    │
└─────────────────────────────────────┘
```

### 3. Copy Placement

| Element | Text | Font | Size | Color | Alignment |
|---------|------|------|------|-------|-----------|
| Tag | "Digital Loyalty" | Klarna Text Bold | 13px | #9333EA on #F3E8FF | Left |
| Headline | "Your loyalty card. Already in their phone." | Klarna Title Bold | 48px | #FFFFFF | Left |
| Subheadline | "No app. No plastic. Just tap and earn." | Klarna Text Regular | 20px | #E6FFA9 | Left |

### 4. Visual Elements

| Element | Description | Position | Size | Notes |
|---------|-------------|----------|------|-------|
| iPhone mockup | iPhone 15 showing Apple Wallet with a Kyro stamp card pass | Center-bottom | ~500px tall | Slight tilt, soft shadow |
| Glow effect | Lime (#E6FFA9) soft glow behind phone | Behind mockup | 60% of canvas width | 15% opacity, gaussian blur |
| Kyro logo | Full logo (mark + wordmark) | Bottom-left | 80px wide | White wordmark |

### 5. Color Specification

```
Background:    #0B051D
Headline:      #FFFFFF
Subheadline:   #E6FFA9
Tag bg:        #F3E8FF
Tag text:      #9333EA
Glow accent:   #E6FFA9 at 15% opacity
Logo mark:     #E6FFA9 (lime on black)
Logo wordmark: #FFFFFF
```

### 6. Mockup Description

A dark, bold social media post with Kyro's signature black background. At the top left, a small purple tag reads "Digital Loyalty." Below it, a large white headline spans most of the width: "Your loyalty card. Already in their phone." Underneath in lime green: "No app. No plastic. Just tap and earn." The bottom half of the image is dominated by a floating iPhone mockup showing a Kyro loyalty card inside Apple Wallet, tilted slightly and glowing with a soft lime light from behind. The Kyro logo sits quietly in the bottom-left corner. The overall feel is premium, confident, and modern -- like a product you want to use immediately.
