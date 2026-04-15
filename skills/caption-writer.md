# Skill: Caption Writer

> Generates on-brand social media captions for Kyro following the "Straight Up Friendly" voice.

---

## Inputs

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `pillar` | Yes | Content pillar to align with | `product-power`, `social-proof`, `education`, `brand-personality`, `local-biz-love` |
| `platform` | Yes | Target platform | `instagram`, `tiktok`, `linkedin`, `twitter`, `facebook` |
| `topic` | Yes | Specific topic or message | "Push notifications are free with Kyro" |
| `cta_target` | No | Where the CTA should point | `signup`, `demo`, `website`, `link-in-bio` |
| `mood` | No | Emotional tone override | `bold`, `playful`, `empathetic`, `urgent` |

---

## Voice Rules (mandatory for all output)

Before writing any caption, internalize these rules:

1. **Clear over clever** -- If a simpler word works, use it.
2. **Benefits over features** -- "Bring customers back" not "Customer retention management tool."
3. **Short over long** -- If you can say it in fewer words, do it.
4. **Human over corporate** -- "How can we help?" not "Please submit a support inquiry."

### Banned Words
Never use: utilize, optimize, leverage, initiate, facilitate, omnichannel, monetize, synergy, scalable, robust, cutting-edge, revolutionary, game-changing, seamless, end-to-end.

### Vocabulary Swaps
| Do NOT write | Write instead |
|---|---|
| Comprehensive customer retention platform | Bring your customers back |
| Leverage digital loyalty mechanics | Loyalty cards in their phone |
| Start your 14-day free trial today | Try it free |
| Please contact our sales team | Let's talk |
| Notification delivery infrastructure | Free push notifications |

---

## Platform Specs

### Instagram
- Caption max: 2,200 characters (aim for under 1,000 for feed posts)
- Hashtags: 5-10 relevant hashtags, mix of broad and niche
- Line breaks for readability
- CTA: "Link in bio" or "DM us"

### TikTok
- Caption max: 4,000 characters (aim for under 150)
- Hashtags: 3-5, trend-aware
- Punchy, conversational
- CTA: "Follow for more" or "Comment below"

### LinkedIn
- Caption max: 3,000 characters
- Professional but still friendly (not corporate)
- No hashtag spam (3-5 max)
- CTA: "What do you think?" or "Try Kyro free"

### Twitter/X
- Max: 280 characters
- Sharp, quotable, standalone
- 1-2 hashtags max
- CTA: Short link or "Check bio"

### Facebook
- Optimal: 40-80 characters for highest engagement
- Conversational, community-focused
- Hashtags: 1-3 max
- CTA: "Learn more" with link

---

## Output Format

For each request, produce THREE variations:

### Variation 1: Short Hook
- 1-2 sentences max
- Designed to stop the scroll
- Works as a standalone or as the first line before "...more"

### Variation 2: Medium Post
- 3-5 sentences
- Hook + value point + CTA
- Standard feed post format

### Variation 3: Long Storytelling
- 6-10 sentences
- Hook + story/scenario + insight + CTA
- For carousel first slides, LinkedIn articles, or Instagram long-form

Each variation must include:
- The caption text with line breaks formatted for the platform
- A CTA appropriate to the platform and cta_target
- Hashtag set (platform-appropriate count)
- A brief note on suggested visual pairing (1 line)

---

## Pillar Alignment Guide

### Product Power
Focus on what Kyro does and why it matters. Lead with the outcome, not the feature.
- Angle: "Here's what happens when you use Kyro"
- Proof points: wallet passes, push notifications, stamp cards, analytics
- Tone: Confident, direct

### Social Proof
Let results and customers speak. Numbers, quotes, before/after.
- Angle: "Don't take our word for it"
- Proof points: customer stories, stats, testimonials
- Tone: Proud but not boastful

### Education
Teach something useful about loyalty, local business, or marketing.
- Angle: "Here's something most businesses don't know"
- Topics: repeat customer value, loyalty program ROI, push notification tips
- Tone: Helpful, expert-friend

### Brand Personality
Show who Kyro is. Culture, values, behind-the-scenes, humor.
- Angle: "This is us"
- Topics: team moments, product updates, hot takes on loyalty
- Tone: Playful, authentic

### Local Biz Love
Celebrate small and local businesses. Amplify their stories.
- Angle: "We love what you do"
- Topics: spotlight local businesses, tips for local marketing
- Tone: Warm, supportive, community-first

---

## Color and Brand References (for visual pairing notes)

- **Primary**: Black #0B051D, Lime #E6FFA9, White #F9F8F5
- **Accent**: Purple #6C47FF
- Dark backgrounds with lime text for bold statements
- Light backgrounds with black text for educational content
- Purple gradients for premium/product-focused content

---

## Example Execution

**Input:**
- Pillar: `product-power`
- Platform: `instagram`
- Topic: "Kyro wallet passes work with Apple Wallet and Google Wallet"

**Output:**

### Variation 1: Short Hook
> Your loyalty card. Already in their phone.
>
> No app download. No plastic card. Just tap and earn.
>
> #KyroCard #LoyaltyProgram #SmallBusiness #WalletPass #AppleWallet

*Visual: Dark background, phone mockup showing wallet pass, lime accent on CTA*

### Variation 2: Medium Post
> Your customers already have the app.
>
> It's called Apple Wallet. And Google Wallet.
>
> Kyro puts your loyalty card right there -- no downloads, no sign-ups, no friction. They tap their phone. They earn rewards. They come back.
>
> That's it. That's the whole thing.
>
> Try it free -- link in bio.
>
> #KyroCard #LoyaltyProgram #SmallBusiness #WalletPass #AppleWallet #GoogleWallet #LocalBusiness #CustomerRetention

*Visual: Split screen showing Apple Wallet and Google Wallet with Kyro pass*

### Variation 3: Long Storytelling
> "Can you download our app?"
>
> That's the question killing your loyalty program.
>
> Because here's what actually happens: the customer smiles politely, says "sure," and never does it. Your loyalty program just lost another member before they even started.
>
> Now imagine this instead: they scan a QR code at the counter. A loyalty card appears in their Apple Wallet or Google Wallet. Done. No app store. No account creation. No friction.
>
> Next time they're nearby, a notification pops up on their lock screen: "You're 2 stamps away from a free coffee."
>
> They walk in. They buy. They come back.
>
> That's Kyro. Loyalty cards that live where your customers already are.
>
> Try it free -- link in bio.
>
> #KyroCard #LoyaltyProgram #SmallBusiness #WalletPass #AppleWallet #GoogleWallet #LocalBusiness #CustomerRetention #DigitalLoyalty #SmallBizTips

*Visual: Story sequence -- QR scan, wallet pass appearing, notification on lock screen*

---

## Quality Checklist (verify before final output)

- [ ] No banned words or corporate jargon
- [ ] Benefits stated before features
- [ ] CTA is clear and platform-appropriate
- [ ] Hashtags match platform norms (count and style)
- [ ] Voice feels like a knowledgeable friend, not a brand manager
- [ ] Caption works if someone only reads the first line
- [ ] Kyro brand name used naturally (not forced)
