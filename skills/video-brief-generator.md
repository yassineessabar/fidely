# Skill: Video Brief Generator

> Creates complete video production briefs for Kyro social media content, including scripts, visual direction, AI generation prompts, and platform-specific specs.

---

## Inputs

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `concept` | Yes | Core idea or topic for the video | "Show how a cafe owner sets up a loyalty card in under 2 minutes" |
| `platform` | Yes | Target platform | `instagram-reels`, `tiktok`, `youtube-shorts`, `linkedin-video`, `youtube` |
| `style` | No | Visual style | `product-demo`, `storytelling`, `talking-head`, `text-overlay`, `before-after`, `day-in-life` |
| `duration` | No | Target length | `15s`, `30s`, `60s`, `90s` (defaults based on platform) |
| `talent` | No | Who appears on camera | `none`, `founder`, `customer`, `business-owner`, `hands-only` |

---

## Platform Specs

### Instagram Reels
- Aspect ratio: 9:16 (1080x1920)
- Duration: 15-90 seconds (sweet spot: 15-30s)
- Hook window: first 1-3 seconds
- Sound: Trending audio or original
- Text safe zone: Keep text within center 80% (away from UI overlays)

### TikTok
- Aspect ratio: 9:16 (1080x1920)
- Duration: 15-60 seconds (sweet spot: 15-30s)
- Hook window: first 1 second
- Sound: Trending sounds essential for reach
- Captions: Auto-captions expected

### YouTube Shorts
- Aspect ratio: 9:16 (1080x1920)
- Duration: up to 60 seconds
- Hook window: first 2-3 seconds
- Sound: Less trend-dependent than TikTok

### LinkedIn Video
- Aspect ratio: 1:1 (1080x1080) or 9:16 (for mobile-first)
- Duration: 30-90 seconds
- Hook window: first 3 seconds
- Sound: Most watch on mute -- captions mandatory
- Tone: Professional but human

### YouTube (long-form)
- Aspect ratio: 16:9 (1920x1080)
- Duration: 2-10 minutes
- Hook window: first 5-8 seconds
- Structure: Hook, intro, content, CTA, end screen

---

## Output Structure

Generate a complete brief with ALL of the following sections:

### 1. Overview
- **Title**: Working title for the video
- **Platform**: Target platform with specs
- **Duration**: Target length
- **Objective**: What this video should achieve (awareness, conversion, education)
- **Pillar**: Which content pillar this serves
- **Hook type**: What pattern interrupts in the first seconds

### 2. Script

Write the full script in this format:

```
SCENE [number] | [timestamp range] | [duration]
--------------------------------------------------
VISUAL: [What the viewer sees]
AUDIO: [Voiceover, dialogue, or sound effect]
TEXT OVERLAY: [On-screen text, if any]
NOTES: [Direction for filming or editing]
```

Rules for scripting:
- First scene must be the hook (1-3 seconds)
- Use Kyro voice: clear, friendly, benefit-driven
- No corporate language
- End with a clear CTA
- Include text overlays for mute-viewing

### 3. Visual Direction

- **Color palette**: Specify which Kyro colors dominate
  - Dark scenes: Black #0B051D backgrounds with Lime #E6FFA9 accents
  - Light scenes: White #F9F8F5 backgrounds with Black text
  - Accent moments: Purple #6C47FF for highlights, transitions
- **Typography on screen**: Klarna Title Bold for headlines, Klarna Text for body
- **Transitions**: Match Kyro motion principles (simple, purposeful, playful)
- **Lighting**: Natural, warm -- never cold or clinical
- **Framing**: Clean composition, generous white space even in video

### 4. Higgsfield AI Prompts

For each scene that can be AI-generated, provide a ready-to-use prompt:

```
SCENE [number] -- Higgsfield Prompt:
"[Detailed prompt for AI video generation]"

Settings:
- Aspect ratio: [9:16 / 16:9 / 1:1]
- Duration: [seconds]
- Style: [cinematic / minimal / product / lifestyle]
- Camera: [static / slow zoom / pan / handheld]
```

Prompt guidelines:
- Be specific about lighting, colors, and mood
- Reference exact hex colors when relevant to backgrounds
- Describe motion and camera movement clearly
- Include negative prompts if needed (e.g., "no text, no watermarks")

### 5. Music and Sound

- **Mood**: Describe the vibe (e.g., "upbeat lo-fi, confident but chill")
- **BPM range**: Match to pacing
- **Reference tracks**: Name 2-3 reference songs/styles
- **Sound effects**: List specific SFX moments (e.g., "satisfying click on stamp collect")
- **Voiceover**: Yes/no, tone description, pacing notes

### 6. Text Overlays Sequence

List every text overlay in order:

| Timestamp | Text | Style | Position |
|-----------|------|-------|----------|
| 0:00-0:02 | "Stop losing customers" | Klarna Title Bold, White on Black | Center |
| 0:03-0:05 | "Here's the fix" | Klarna Title Bold, Lime on Black | Center |
| ... | ... | ... | ... |

Rules:
- Max 6-8 words per overlay
- Kyro voice (benefit-first, no jargon)
- High contrast (white or lime on dark, black on light)
- Animation: fade or slide, 200-300ms duration

### 7. Thumbnail / Cover Frame

- Describe the ideal thumbnail or cover frame
- Include text overlay, expression/mood, color scheme
- Must work at small sizes (phone grid)
- Must create curiosity or promise value

### 8. Post-Production Notes

- Editing pace and rhythm
- Color grading direction (warm, slightly desaturated, brand-aligned)
- Caption/subtitle style (font, position, animation)
- End card or CTA card specs

---

## Style Templates

### Product Demo
- Show the product solving a real problem
- Screen recording + lifestyle b-roll
- Voice: "Here's how it works" (direct, helpful)
- Structure: Problem (3s) -> Solution (10-20s) -> Result (5s) -> CTA (3s)

### Storytelling
- Follow a character through a scenario
- Emotional arc: frustration -> discovery -> delight
- Voice: narrative, warm
- Structure: Setup (5s) -> Journey (20-40s) -> Resolution (5-10s) -> CTA (3s)

### Before/After
- Split screen or sequential transformation
- Strong visual contrast
- Voice: minimal, let visuals speak
- Structure: Before (5-10s) -> Transition (2s) -> After (5-10s) -> CTA (3s)

### Text-Over-B-Roll
- Atmospheric footage with bold text overlays
- No voiceover, music-driven
- Voice: punchy text captions carrying the message
- Structure: Hook text (2s) -> Point 1 (5s) -> Point 2 (5s) -> Point 3 (5s) -> CTA (3s)

### Talking Head
- Direct-to-camera delivery
- Authentic, not scripted-feeling
- Voice: conversational, like telling a friend
- Structure: Hook (2s) -> Story/Tip (15-40s) -> CTA (3s)

---

## Example Execution

**Input:**
- Concept: "Show a coffee shop using Kyro for the first time"
- Platform: `instagram-reels`
- Style: `before-after`
- Duration: `30s`
- Talent: `hands-only`

**Output:**

### 1. Overview
- **Title**: "Paper Stamp Cards vs. Kyro"
- **Platform**: Instagram Reels (1080x1920, 9:16)
- **Duration**: 30 seconds
- **Objective**: Product awareness -- show the upgrade from paper to digital
- **Pillar**: Product Power
- **Hook type**: Relatable frustration (messy paper cards)

### 2. Script

```
SCENE 1 | 0:00-0:03 | 3s
--------------------------------------------------
VISUAL: Close-up of hands fumbling through a wallet full of crumpled paper stamp cards. One falls on the counter.
AUDIO: SFX -- rustling paper, slight fumble
TEXT OVERLAY: "Still using these?"
NOTES: Slightly messy, real-feeling. Warm overhead lighting.

SCENE 2 | 0:03-0:05 | 2s
--------------------------------------------------
VISUAL: Hand swipes all the paper cards off the counter in one smooth motion.
AUDIO: SFX -- satisfying swoosh
TEXT OVERLAY: "There's a better way."
NOTES: Quick, decisive movement. Clean transition to next scene.

SCENE 3 | 0:05-0:12 | 7s
--------------------------------------------------
VISUAL: Clean counter. Phone appears. QR code is scanned. Kyro wallet pass pops up with a stamp animation.
AUDIO: SFX -- soft chime on stamp collect
TEXT OVERLAY: "Digital loyalty cards. In their phone."
NOTES: Show real Kyro pass in Apple Wallet. Lime accent glow on stamp.

SCENE 4 | 0:12-0:20 | 8s
--------------------------------------------------
VISUAL: Phone lock screen shows Kyro notification: "You're 1 stamp away from a free coffee!" Hand picks up phone, smiles implied by movement.
AUDIO: SFX -- notification sound, then upbeat music kicks in
TEXT OVERLAY: "Automatic reminders. They come back."
NOTES: Notification must be clearly readable. Show location trigger.

SCENE 5 | 0:20-0:27 | 7s
--------------------------------------------------
VISUAL: Quick montage: scan, stamp, scan, stamp, reward unlocked animation. Counter shows happy exchange.
AUDIO: Music builds, satisfying stamp sounds on each scan
TEXT OVERLAY: "No app download. No friction. Just loyalty."
NOTES: Fast cuts, energetic. Each scan should feel satisfying.

SCENE 6 | 0:27-0:30 | 3s
--------------------------------------------------
VISUAL: Kyro logo on dark background with lime accent. URL below.
AUDIO: Music resolves
TEXT OVERLAY: "Try Kyro free. Link in bio."
NOTES: Clean end card. Logo centered, text below.
```

### 3. Visual Direction
- **Scenes 1-2**: Warm, slightly chaotic. Paper texture. Overhead camera.
- **Scenes 3-5**: Clean, bright. Kyro Black + Lime palette. Close-up, steady.
- **Scene 6**: Brand end card. #0B051D background, #E6FFA9 logo accent.
- **Transitions**: Swipe cut from scene 2 to 3 (paper to digital). Quick cuts for montage.
- **Lighting**: Natural daylight, coffee shop warmth.

### 4. Higgsfield AI Prompts

```
SCENE 1 -- Higgsfield Prompt:
"Close-up overhead shot of hands sorting through crumpled colorful paper loyalty stamp cards in a brown leather wallet on a warm wooden counter, coffee shop setting, natural daylight, warm tones, slightly cluttered and real-feeling, shallow depth of field"
Settings: 9:16, 3s, lifestyle, static overhead

SCENE 3 -- Higgsfield Prompt:
"Clean minimal counter top, hand holding modern smartphone scanning a QR code stand, phone screen shows a digital loyalty card appearing with a green accent animation, bright clean lighting, warm cafe setting, shallow depth of field on the phone"
Settings: 9:16, 7s, product, slow zoom in
```

### 5. Music and Sound
- **Mood**: Confident lo-fi, morning coffee energy
- **BPM**: 95-110
- **References**: Tom Misch "South of the River" vibe, Khruangbin chill funk
- **SFX**: Paper rustling (scene 1), swoosh (scene 2), digital chime (scene 3), notification ping (scene 4), stamp sounds (scene 5)
- **Voiceover**: None -- text overlays carry the message

### 6. Text Overlays Sequence

| Timestamp | Text | Style | Position |
|-----------|------|-------|----------|
| 0:00-0:03 | "Still using these?" | Klarna Title Bold, 36px, White | Center |
| 0:03-0:05 | "There's a better way." | Klarna Title Bold, 36px, Lime #E6FFA9 | Center |
| 0:05-0:12 | "Digital loyalty cards. In their phone." | Klarna Title Bold, 32px, White | Lower third |
| 0:12-0:20 | "Automatic reminders. They come back." | Klarna Title Bold, 32px, White | Lower third |
| 0:20-0:27 | "No app download. No friction. Just loyalty." | Klarna Title Bold, 28px, White | Center |
| 0:27-0:30 | "Try Kyro free. Link in bio." | Klarna Text Medium, 24px, Lime #E6FFA9 | Below logo |

### 7. Thumbnail / Cover Frame
- Scene 3 freeze frame: phone showing Kyro pass over clean counter
- Text overlay: "Ditch the paper cards" in Klarna Title Bold, white on semi-transparent dark overlay
- Lime accent border or glow on the phone

### 8. Post-Production Notes
- Color grade: warm, slightly lifted shadows, desaturated slightly
- Captions: White Klarna Text Medium with dark drop shadow, lower third, word-by-word animation
- Pace: deliberate in scenes 1-4, fast in scene 5 montage
- Export: 1080x1920, 30fps, H.264

---

## Quality Checklist

- [ ] Hook grabs attention within first 2 seconds
- [ ] Works on mute (text overlays carry the story)
- [ ] Kyro brand colors present but not overwhelming
- [ ] CTA is clear and actionable
- [ ] Duration matches platform sweet spot
- [ ] Script uses Kyro voice (friendly, clear, benefit-first)
- [ ] No corporate language or jargon
- [ ] Higgsfield prompts are specific enough to generate usable footage
- [ ] Music mood matches brand energy (confident, warm, not aggressive)
