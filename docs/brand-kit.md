# Fidely Brand Kit

> The complete brand identity system for Fidely. Inspired by Klarna's "Curiously Bold" framework, adapted for loyalty and local business.

---

## 1. Brand Identity

### Vision
"To be the standard for how local businesses keep customers coming back."

### Personality: "Confidently Simple"
Like a perfectly designed loyalty card in your wallet — invisible until you need it, delightful when you use it. We make the complex simple and the mundane rewarding.

### Three Pillars

| Pillar | What It Means | How It Shows Up |
|--------|--------------|-----------------|
| **Friendly Experts** | We know loyalty inside out, but we explain it like a friend | Approachable copy, no jargon, helpful tone |
| **Effortlessly Smart** | Things just work — no setup headaches, no learning curve | Clean UI, minimal steps, instant results |
| **Quietly Ambitious** | We help small businesses compete with big chains | Bold stats, confident claims backed by data |

### What We Are NOT
- **Complicated** — We never make things harder than they need to be
- **Corporate** — We don't sound like a bank or an enterprise SaaS
- **Pushy** — We show value, we don't hard-sell

---

## 2. Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Fidely Black** | `#0B051D` | rgb(11, 5, 29) | Primary text, buttons, dark backgrounds |
| **Fidely Lime** | `#E6FFA9` | rgb(230, 255, 169) | Accent, highlights, CTAs on dark |
| **Fidely White** | `#F9F8F5` | rgb(249, 248, 245) | Backgrounds, cards, off-white |
| **Pure White** | `#FFFFFF` | rgb(255, 255, 255) | Clean backgrounds, cards |

### Secondary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Fidely Purple** | `#6C47FF` | rgb(108, 71, 255) | Gradients, hero sections |
| **Purple Dark** | `#2C2242` | rgb(44, 34, 66) | Dark gradient endpoint |
| **Purple Mid** | `#AA89F2` | rgb(170, 137, 242) | Secondary accents, tags |
| **Purple Light** | `#F3E8FF` | rgb(243, 232, 255) | Light purple backgrounds |
| **Purple Vivid** | `#9333EA` | rgb(147, 51, 234) | Labels, links, category tags |
| **Purple Deep** | `#581C87` | rgb(88, 28, 135) | Dark text on purple backgrounds |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Muted** | `#615F6D` | rgb(97, 95, 109) | Secondary text, descriptions |
| **Warm Gray** | `#E4E3DF` | rgb(228, 227, 223) | Borders, dividers |
| **Card Border** | `#E2E2E7` | rgb(226, 226, 231) | Card outlines |
| **Nav Text** | `#373544` | rgb(55, 53, 68) | Navigation, body text |
| **Light Gray** | `#898789` | rgb(137, 135, 137) | Placeholder text, disabled |
| **Footer BG** | `#1D192A` | rgb(29, 25, 42) | Footer background |
| **Footer Text** | `#C4C3CA` | rgb(196, 195, 202) | Footer body text |

### Color Rules
- **Dark backgrounds**: Use Fidely Black or Purple gradients. Text in white or lime.
- **Light backgrounds**: Use Fidely White or Pure White. Text in Fidely Black.
- **Accents**: Lime on dark, Purple Vivid on light. Never lime on white.
- **Gradients**: Always `135deg` from Fidely Black → Purple Dark → Purple.

---

## 3. Typography

### Font Family

| Font | Weight | CSS Variable | Usage |
|------|--------|-------------|-------|
| **Klarna Title Bold** | 700 | `--font-display` | Headlines, hero text, section titles |
| **Klarna Text Regular** | 400 | `--font-geist-sans` | Body copy, descriptions, paragraphs |
| **Klarna Text Medium** | 500 | `--font-geist-sans` | Labels, buttons, navigation |
| **Klarna Text Bold** | 700 | `--font-geist-sans` | Emphasis, strong text, stats |

### Type Scale

| Element | Font | Size | Line Height | Weight | Letter Spacing |
|---------|------|------|-------------|--------|---------------|
| Hero H1 | Klarna Title | 90px | 90px | 700 | 0 |
| Page H1 | Klarna Title | 52px | 55px | 500-700 | 0 |
| Section H2 | Klarna Title | 36-42px | 42-48px | 700 | 0 |
| Card H3 | Klarna Title | 20-24px | 26-30px | 700 | 0 |
| Body Large | Klarna Text | 20px | 32px | 400 | 0 |
| Body | Klarna Text | 16px | 26px | 400 | 0 |
| Body Small | Klarna Text | 14px | 20px | 400 | 0 |
| Caption | Klarna Text | 12px | 17px | 400 | 0 |
| Label | Klarna Text | 12px | 16px | 600 | 0.5-1px |
| Button | Klarna Text | 16px | 18px | 500-600 | 0 |
| Nav Link | Klarna Text | 16px | 18px | 400 | 0 |

### Typography Rules
- **Headlines**: Always Klarna Title. Sentence case. Never ALL CAPS.
- **Body**: Always Klarna Text. Never use Klarna Title for paragraphs.
- **Leading**: Headlines 80-95%. Body 140-150%.
- **Tracking**: Headlines 0 to -1%. Buttons 0 to -3%.
- CSS class `.font-display` applies Klarna Title.
- CSS class `.font-sans` applies Klarna Text (default body).

---

## 4. Logo

### Construction
The Fidely logo consists of two parts:
1. **Brand mark** — A rounded square with the stylized "f" and ascending curve in lime
2. **Wordmark** — "fidely" in Klarna Title Bold

### Colors
| Context | Mark BG | Mark Symbol | Wordmark |
|---------|---------|-------------|----------|
| Light background | Fidely Black | Lime | Fidely Black |
| Dark background | Fidely Black | Lime | White |
| Muted/footer | Gray | Lime | Gray |

### Clear Space
The height of the brand mark defines the minimum clear space around the full logo. Clear space can increase but never decrease.

### Minimum Sizes
- **Digital**: Brand mark minimum 18px height
- **Print**: Brand mark minimum 8mm height

### Don'ts
- Never change the logo colors
- Never stretch, rotate, or distort
- Never add shadows or effects
- Never place on busy/cluttered backgrounds
- Never recreate or approximate the logo

---

## 5. Layout System

### Margins
- **Standard margin**: 6% of the shortest side (matches Klarna system)
- **Double margin**: 12% for larger-scale layouts
- **Gutters**: Always half of the margin size

### Content Width
- **Max width**: 1140px for marketing pages
- **Narrow content**: 720px for articles, legal pages
- **Forms/cards**: 600px max width

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, inline elements |
| sm | 8px | Tags, compact spacing |
| md | 16px | Form fields, card padding |
| lg | 24px | Section gaps, card margins |
| xl | 32px | Between content blocks |
| 2xl | 48px | Section spacing |
| 3xl | 64px | Major section breaks |
| 4xl | 80px | Page section padding (vertical) |

### Border Radius
| Element | Radius |
|---------|--------|
| Buttons (pill) | 9999px |
| Cards | 12-16px |
| Inputs | 10-12px |
| Tags/badges | 100px |
| Brand mark | 10px |
| Avatars | 50% |

---

## 6. Tone of Voice: "Straight Up Friendly"

### Principles

| Principle | Description |
|-----------|-------------|
| **Clear over clever** | If a simpler word works, use it |
| **Benefits over features** | "Bring customers back" not "Customer retention management tool" |
| **Short over long** | If you can say it in fewer words, do it |
| **Human over corporate** | "How can we help?" not "Please submit a support inquiry" |

### Vocabulary

| Don't Say | Say Instead |
|-----------|-------------|
| Utilize | Use |
| Optimize | Improve |
| Leverage | Use |
| Initiate | Start |
| Facilitate | Help |
| Customer retention solution | Loyalty cards |
| Omnichannel engagement | Reach your customers |
| Monetize your user base | Make more money |

### Copy Style Examples

| Generic | Fidely |
|---------|--------|
| "Comprehensive customer retention platform" | "Bring your customers back" |
| "Leverage digital loyalty mechanics" | "Loyalty cards in their phone" |
| "Start your 14-day free trial today" | "Try it free" |
| "Please contact our sales team" | "Let's talk" |
| "Notification delivery infrastructure" | "Free push notifications" |

### Headlines
- Use Klarna Title Bold
- Sentence case (never ALL CAPS)
- Short, punchy, benefit-driven
- Good: "Loyalty that pays."
- Good: "Bring your customers back."
- Bad: "COMPREHENSIVE DIGITAL LOYALTY SOLUTION FOR BUSINESSES"

---

## 7. Art Direction

### Photography Style: "Real Life, Elevated"
- Real businesses, real people, real scenarios
- Warm, inviting, natural light
- Show the moment of interaction (scanning, checking phone, receiving reward)
- Never stock-photo generic. Always feel authentic.

### Illustration Style
- Clean, minimal SVG illustrations
- Use brand colors (purple gradients, lime accents)
- Geometric shapes, rounded corners
- Dashboard mockups, phone mockups, card previews

### Imagery Don'ts
- No generic stock photos of "happy business people shaking hands"
- No overly complex diagrams or flowcharts in marketing
- No images with text baked in (text should be HTML/CSS)
- No low-contrast or muddy images

---

## 8. Motion

### Principles
| Pillar | Description |
|--------|-------------|
| **Simple** | Well-crafted, no clutter. Less is more. |
| **Purposeful** | Movement has meaning — anticipation, continuity, pause, action |
| **Playful** | Delightful micro-interactions that reward attention |

### Easing Curves
| Name | Usage | CSS |
|------|-------|-----|
| **Easy Ease** | Default for most animations | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| **Smooth Enter** | Elements appearing | `cubic-bezier(0, 0, 0.2, 1)` |
| **Smooth Exit** | Elements disappearing | `cubic-bezier(0.4, 0, 1, 1)` |

### Duration
| Type | Duration |
|------|----------|
| Micro (hover, toggle) | 150-200ms |
| Standard (fade, slide) | 200-300ms |
| Complex (page transition) | 300-500ms |
| Hero animation | 600-1000ms |

### Existing Animations (globals.css)
- `animate-hero-headline` — Hero text entrance
- `animate-hero-image` — Hero image slide-up
- `animate-hero-right` — Right panel fade-in
- `animate-fade-in-up` — General scroll reveal
- `animate-scroll-up` / `animate-scroll-down` — Scroll-triggered

---

## 9. Components Reference

### Buttons

| Variant | Background | Text | Border | Radius |
|---------|-----------|------|--------|--------|
| Primary | Fidely Black | White | None | 9999px |
| Secondary | White | Fidely Black | 1px Warm Gray | 9999px |
| Accent | Lime | Fidely Black | None | 9999px |
| Ghost | Transparent | Fidely Black | None | 9999px |

### Inputs
- Height: 50px
- Background: Fidely White (#F9F8F5)
- Border: 1px solid Warm Gray (#E4E3DF)
- Radius: 12px
- Font: Klarna Text, 16px
- Placeholder: Light Gray (#898789)

### Cards
- Background: White
- Border: 1px solid Card Border (#E2E2E7)
- Radius: 12px-16px
- Padding: 20-24px
- Shadow: None (flat design)

### Tags/Badges
- Background: Purple Light (#F3E8FF)
- Text: Purple Vivid (#9333EA)
- Font: 12-13px, weight 600
- Padding: 4px 14px
- Radius: 100px

---

## 10. Digital Assets

### Favicon
- `/public/favicon.svg` — SVG format, scales to all sizes

### Wallet Pass Images
- `/public/wallet/icon.png` (29x29, @2x, @3x)
- `/public/wallet/logo.png` (160x50, @2x)
- `/public/wallet/strip-*.png` (750x246)
- Generated via: `npm run generate:wallet-images`

### OG/Social Images
- Auto-generated at `/opengraph-image` and `/twitter-image`
- 1200x630px, dark gradient with Fidely branding

---

## 11. CSS Variables Reference

```css
:root {
  --dark: rgb(11, 5, 29);           /* Fidely Black */
  --white: rgb(255, 255, 255);      /* Pure White */
  --cream: rgb(249, 248, 245);      /* Fidely White */
  --green-light: rgb(230, 255, 169); /* Fidely Lime */
  --purple-dark: rgb(44, 34, 66);   /* Purple Dark */
  --purple-mid: rgb(170, 137, 242); /* Purple Mid */
  --muted: rgb(97, 95, 109);        /* Muted text */
  --warm-gray: rgb(228, 227, 223);  /* Borders */
  --card-border: rgb(226, 226, 231);/* Card borders */
  --nav-text: rgb(55, 53, 68);      /* Body text */
  --footer-bg: rgb(29, 25, 42);     /* Footer BG */
  --footer-text: rgb(196, 195, 202);/* Footer text */
  --border-light: rgba(0, 0, 0, 0.06); /* Subtle dividers */
}
```

---

## 12. File Structure

```
app/
  components/
    FidelyLogo.tsx          ← Brand mark + wordmark component
  layout.tsx                ← Fonts loaded here (Klarna Title + Text)
  globals.css               ← CSS variables + animations
  opengraph-image.tsx       ← Auto-generated OG image
  twitter-image.tsx         ← Auto-generated Twitter image
public/
  favicon.svg               ← Brand favicon
  wallet/                   ← Wallet pass assets
font/
  KlarnaTitle-Bold.woff2    ← Display font
  KlarnaText-Regular.woff2  ← Body font
  KlarnaText-Bold.woff2     ← Bold body
  KlarnaText-*.woff2        ← All weights/styles
```

---

*This brand kit is the single source of truth for all Fidely design decisions. When in doubt, reference this document.*
