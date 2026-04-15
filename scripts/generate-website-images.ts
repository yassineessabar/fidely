import 'dotenv/config';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.local' });

/**
 * Generate ALL website images for Kyro using Higgsfield AI.
 *
 * Usage:
 *   npx tsx scripts/generate-website-images.ts                  # generate everything
 *   npx tsx scripts/generate-website-images.ts --section hero   # only hero section
 *   npx tsx scripts/generate-website-images.ts --section features,about
 *   npx tsx scripts/generate-website-images.ts --dry-run        # preview prompts only
 *   npx tsx scripts/generate-website-images.ts --model seedream-5
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import {
  generateImage,
  type GenerateImageOptions,
  type ImageModelKey,
  type ImageResult,
} from '../lib/higgsfield';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
function getArgValue(flag: string): string | undefined {
  const eqArg = args.find((a) => a.startsWith(`${flag}=`));
  if (eqArg) return eqArg.split('=')[1];
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return undefined;
}

const sectionFilter = getArgValue('--section')?.split(',');
const modelOverride = getArgValue('--model') as ImageModelKey | undefined;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebsiteImage {
  id: string;
  section: string;
  filename: string;
  prompt: string;
  aspectRatio: string;
  model: ImageModelKey;
  outputDir: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Brand constants woven into every prompt
// ---------------------------------------------------------------------------

const BRAND = {
  colors: 'Kyro brand colors: deep dark #0B051D, vibrant lime-green #E6FFA9, off-white #F9F8F5, purple #6C47FF',
  style: 'Clean, modern, premium aesthetic. No text overlays. No watermarks. Professional photography or 3D render quality.',
  phone: 'Modern iPhone 15 Pro in natural titanium, shown at a slight angle with soft realistic shadow',
  laptop: 'Modern MacBook Pro on a clean desk surface with soft shadow',
  photography: 'Shot on 35mm, shallow depth of field, warm natural lighting, editorial quality',
  noText: 'Absolutely no text, letters, words, logos, or watermarks in the image.',
};

// ---------------------------------------------------------------------------
// Image definitions — organized by website section
// ---------------------------------------------------------------------------

const WEBSITE_IMAGES: WebsiteImage[] = [

  // =========================================================================
  // HERO SECTION
  // =========================================================================
  {
    id: 'hero-main',
    section: 'hero',
    filename: 'hero-main.png',
    description: 'Main hero image — stylish hand holding phone showing Kyro loyalty card in Apple Wallet',
    prompt: `A stylish woman's hand holding an iPhone from below against a pure black background. The hand has warm brown skin with gold-yellow nail polish, chunky gold rings on multiple fingers, and a bold gold chain bracelet. The wrist and lower forearm are visible, wrapped in a vibrant green satin fabric sleeve with a hint of pink-magenta fabric underneath. The iPhone is in a coral-red silicone case, held upright at a very slight natural angle. The phone screen shows an Apple Wallet digital loyalty card: a sleek dark card (#0B051D) with vibrant lime-green (#E6FFA9) accent highlights and purple (#6C47FF) details, a grid of coffee cup stamp icons (some filled in lime-green, some empty), reward balance information in lime-green, and a barcode at the bottom with small text reading "Powered by kyro". The screen glows softly, casting gentle warm light on the fingers and gold jewelry. Pure black background with zero distractions. Studio product photography, dramatic directional lighting from the upper right highlighting the gold jewelry and phone screen. Sharp focus on the phone and hand, ultra-high detail on the screen content. Composition: hand enters from the bottom-center of the frame, phone fills roughly 60% of the vertical space. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'hero',
  },
  {
    id: 'hero-phone-float',
    section: 'hero',
    filename: 'hero-phone-float.png',
    description: 'Floating phone with wallet card — 3D render style',
    prompt: `A ${BRAND.phone} floating in mid-air against a pure deep dark background (#0B051D). The screen displays a sleek digital loyalty card with a lime-green (#E6FFA9) stamp grid design. Soft lime and purple (#6C47FF) light rays emanate from behind the phone. The phone casts a soft shadow below. Ultra-clean 3D product render, cinematic lighting. ${BRAND.noText}`,
    aspectRatio: '1:1',
    model: 'flux-pro',
    outputDir: 'hero',
  },
  {
    id: 'hero-cards-spread',
    section: 'hero',
    filename: 'hero-cards-spread.png',
    description: 'Multiple loyalty cards fanned out — abstract brand shot',
    prompt: `Multiple translucent digital loyalty cards floating and fanning out in 3D space against a deep dark background (#0B051D). Each card has a different color accent — lime green (#E6FFA9), purple (#6C47FF), and lavender (#AA89F2). Cards have rounded corners and subtle glassmorphism effect. Soft reflections and light rays between the cards. Premium 3D render, cinematic depth of field. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'hero',
  },
  {
    id: 'hero-tap-moment',
    section: 'hero',
    filename: 'hero-tap-moment.png',
    description: 'Customer tapping phone at checkout — lifestyle hero',
    prompt: `Close-up of a customer's hand tapping their iPhone on a sleek black NFC reader at a modern cafe counter. A subtle lime-green (#E6FFA9) glow pulse radiates from the point of contact. The cafe is warmly lit with morning sunlight streaming through the window. A barista in a black apron is visible in the soft background. Shallow depth of field at f/1.4, warm tones, editorial lifestyle photography. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'hero',
  },

  // =========================================================================
  // FEATURES SECTION
  // =========================================================================
  {
    id: 'feature-wallet',
    section: 'features',
    filename: 'feature-wallet.png',
    description: 'Apple/Google Wallet integration feature',
    prompt: `A ${BRAND.phone} displaying an Apple Wallet interface with a beautiful loyalty card inside. The card has a dark background with lime-green (#E6FFA9) accents and a subtle stamp grid. The phone sits on a clean marble surface with soft warm window light from the left. A coffee cup and a small potted plant are artfully blurred in the background. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'features',
  },
  {
    id: 'feature-notifications',
    section: 'features',
    filename: 'feature-notifications.png',
    description: 'Push notification feature — lock screen with notification',
    prompt: `A ${BRAND.phone} showing a lock screen with a push notification sliding down from the top. The notification has a lime-green (#E6FFA9) accent bar on the left side. The phone lies flat on a dark charcoal fabric surface. Dramatic overhead studio lighting with soft shadows. The time on the lock screen reads 9:41. Clean, minimal product shot. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'features',
  },
  {
    id: 'feature-scan',
    section: 'features',
    filename: 'feature-scan.png',
    description: 'QR code scanning feature — customer scanning',
    prompt: `A customer holding up their phone to scan a QR code displayed on a sleek black tablet stand at a boutique checkout counter. A barcode/QR scanner interface is visible on the phone screen. Warm retail environment lighting, stylish shop interior blurred in the background. The tablet stand has subtle lime-green (#E6FFA9) LED accent lighting around its base. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'features',
  },
  {
    id: 'feature-analytics',
    section: 'features',
    filename: 'feature-analytics.png',
    description: 'Dashboard analytics feature — laptop with dashboard',
    prompt: `A ${BRAND.laptop}. The screen shows a beautiful analytics dashboard with charts and KPI cards — using dark sidebar and white content area. A small potted succulent and a ceramic coffee cup sit beside the laptop. Soft natural daylight from a nearby window, clean white desk. The dashboard has lime-green (#E6FFA9) chart lines and purple (#6C47FF) accent elements. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'features',
  },
  {
    id: 'feature-campaigns',
    section: 'features',
    filename: 'feature-campaigns.png',
    description: 'Campaign/marketing feature — notification on phone in context',
    prompt: `A smartphone lying face-up on a wooden cafe table. The screen shows a colorful push notification about a loyalty reward. Around the phone: a half-eaten pastry on a small plate, a cup of espresso, and morning sunlight casting warm shadows across the table. The notification has a lime-green (#E6FFA9) accent. Overhead shot, warm and inviting food photography style. ${BRAND.noText}`,
    aspectRatio: '1:1',
    model: 'flux-pro',
    outputDir: 'features',
  },
  {
    id: 'feature-customization',
    section: 'features',
    filename: 'feature-customization.png',
    description: 'Card customization feature — multiple card designs',
    prompt: `Five digital loyalty card designs arranged in a neat overlapping fan on a deep dark background (#0B051D). Each card has a different style: one with lime-green (#E6FFA9) stamp grid, one with purple (#6C47FF) gradient, one with off-white minimalist design, one with a warm coffee-themed design, and one with a bold geometric pattern. Cards have rounded corners and soft shadows. Premium product flat lay, top-down view. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'features',
  },

  // =========================================================================
  // HOW IT WORKS SECTION
  // =========================================================================
  {
    id: 'how-step-1',
    section: 'how-it-works',
    filename: 'step-1-setup.png',
    description: 'Step 1 — Set up your loyalty program',
    prompt: `A business owner sitting at a clean modern desk, looking at a laptop screen showing a loyalty program builder interface. The person has a confident, focused expression. Warm office lighting, a branded coffee mug beside the laptop. Modern minimalist workspace with a large monstera plant in the background. The laptop screen has lime-green (#E6FFA9) UI elements visible. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'how-it-works',
  },
  {
    id: 'how-step-2',
    section: 'how-it-works',
    filename: 'step-2-qr.png',
    description: 'Step 2 — Share QR code with customers',
    prompt: `A sleek black acrylic table stand displaying a QR code card on a modern cafe counter. The QR code card has a dark design with lime-green (#E6FFA9) corner brackets. Behind it: a beautiful espresso machine, neatly arranged pastries under glass, and warm pendant lighting. The counter is clean marble. The scene feels inviting and premium. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'how-it-works',
  },
  {
    id: 'how-step-3',
    section: 'how-it-works',
    filename: 'step-3-scan.png',
    description: 'Step 3 — Customers scan and add to wallet',
    prompt: `Close-up of a person's hands holding a phone, scanning a QR code at a beautifully designed retail counter. The phone screen shows an "Add to Apple Wallet" button with lime-green (#E6FFA9) accent. The person's hands are relaxed and natural. Shallow depth of field, the background shows a warmly lit boutique interior. Golden hour sunlight. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'how-it-works',
  },
  {
    id: 'how-step-4',
    section: 'how-it-works',
    filename: 'step-4-rewards.png',
    description: 'Step 4 — Customers earn rewards and come back',
    prompt: `A happy customer at a cafe counter receiving a beautifully plated treat from a barista. The customer is holding up their phone showing a completed stamp card with a lime-green (#E6FFA9) "Reward Unlocked" badge on screen. Both people are smiling naturally. Warm, bright cafe interior with plants and natural wood. The moment feels genuine and joyful. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'how-it-works',
  },

  // =========================================================================
  // LOYALTY MECHANICS SECTION
  // =========================================================================
  {
    id: 'loyalty-stamp',
    section: 'loyalty',
    filename: 'loyalty-stamp.png',
    description: 'Stamp card loyalty type — coffee shop theme',
    prompt: `A beautiful flat lay of a phone showing a digital stamp card with 7 out of 10 stamps collected. The stamps are lime-green (#E6FFA9) circles on a dark card. The phone lies on a wooden table surrounded by a latte art coffee, scattered coffee beans, a small spoon, and a napkin. Warm overhead natural lighting, top-down food photography style. Cozy cafe mood. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'loyalty',
  },
  {
    id: 'loyalty-points',
    section: 'loyalty',
    filename: 'loyalty-points.png',
    description: 'Points-based loyalty — retail shopping theme',
    prompt: `A stylish shopping flat lay on an off-white (#F9F8F5) surface. A phone in the center shows a points balance card with "1,250 points" in lime-green (#E6FFA9) on a dark background. Surrounding the phone: a small shopping bag, sunglasses, a candle, and decorative botanical elements. Clean, minimal, editorial product styling. Soft studio lighting from above. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'loyalty',
  },
  {
    id: 'loyalty-cashback',
    section: 'loyalty',
    filename: 'loyalty-cashback.png',
    description: 'Cashback loyalty type — money/savings theme',
    prompt: `A phone floating at a slight angle against a rich purple (#6C47FF) to dark (#0B051D) gradient background. The screen shows a cashback card with "5% cashback" and a savings counter. Subtle golden coins and dollar particles float around the phone in mid-air, catching light. Premium 3D render style with soft volumetric lighting. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'loyalty',
  },
  {
    id: 'loyalty-membership',
    section: 'loyalty',
    filename: 'loyalty-membership.png',
    description: 'VIP membership tier — premium/exclusive feel',
    prompt: `A premium membership card floating in 3D space on a deep dark background (#0B051D). The card is dark with gold and lime-green (#E6FFA9) accents, showing "VIP Member" with a tier badge. Soft gold light rays emit from behind the card. Subtle bokeh particles float around it. The card has a slight metallic sheen and embossed texture. Premium, luxurious 3D render. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'loyalty',
  },
  {
    id: 'loyalty-discount',
    section: 'loyalty',
    filename: 'loyalty-discount.png',
    description: 'Discount/coupon loyalty type — deal energy',
    prompt: `A phone being held up by a hand in a bright, airy retail boutique. The phone screen shows a vibrant discount loyalty card with a lime-green (#E6FFA9) "20% OFF" badge. Behind the phone, the boutique displays colorful clothing on minimal racks. Bright, optimistic natural daylight fills the space. The mood is happy, aspirational, and rewarding. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'loyalty',
  },

  // =========================================================================
  // TESTIMONIALS / MERCHANTS
  // =========================================================================
  {
    id: 'merchant-cafe',
    section: 'testimonials',
    filename: 'merchant-cafe.png',
    description: 'Cafe owner — testimonial portrait',
    prompt: `Portrait of a friendly cafe owner standing behind their beautiful counter, arms folded with a warm smile. They wear a black apron. Behind them: an espresso machine, glass jars of beans, and pendant warm lighting. The cafe has exposed brick and green plants. The person radiates pride and warmth. ${BRAND.photography}, shot at f/2.0, warm golden hour light from the window side. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'testimonials',
  },
  {
    id: 'merchant-salon',
    section: 'testimonials',
    filename: 'merchant-salon.png',
    description: 'Salon owner — testimonial portrait',
    prompt: `Portrait of a stylish hair salon owner leaning against the reception desk of their modern salon. They look confident and approachable. The salon interior is bright, airy, with large mirrors, green plants, and minimalist white decor. Soft natural light from large windows. The person wears all-black attire. ${BRAND.photography}, shot at f/2.0. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'testimonials',
  },
  {
    id: 'merchant-bakery',
    section: 'testimonials',
    filename: 'merchant-bakery.png',
    description: 'Bakery owner — testimonial portrait',
    prompt: `Portrait of a happy bakery owner behind a glass display case filled with beautiful pastries and bread. They wear a white apron dusted with flour, and have a warm genuine smile. The bakery has rustic wooden shelves, warm pendant lights, and a chalkboard wall. Morning sunlight streaming in. ${BRAND.photography}, shallow depth of field. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'testimonials',
  },
  {
    id: 'merchant-gym',
    section: 'testimonials',
    filename: 'merchant-gym.png',
    description: 'Fitness studio owner — testimonial portrait',
    prompt: `Portrait of a fit, energetic fitness studio owner standing in their modern studio space. Clean concrete floors, large windows with natural light, and minimalist equipment visible in the background. They wear athletic attire and have a motivated, confident expression. The space feels premium and contemporary. ${BRAND.photography}, bright and energetic mood. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'testimonials',
  },
  {
    id: 'merchant-retail',
    section: 'testimonials',
    filename: 'merchant-retail.png',
    description: 'Boutique retailer — testimonial portrait',
    prompt: `Portrait of a boutique shop owner arranging clothing on a minimal wooden display. Their shop is beautifully curated with warm lighting, plants, and a clean aesthetic. They look proud and focused. The boutique has white walls, natural wood accents, and carefully arranged merchandise. ${BRAND.photography}, warm editorial tone. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'testimonials',
  },

  // =========================================================================
  // DASHBOARD PREVIEW SECTION
  // =========================================================================
  {
    id: 'dashboard-hero',
    section: 'dashboard',
    filename: 'dashboard-hero.png',
    description: 'Dashboard on laptop — main preview',
    prompt: `A ${BRAND.laptop}. The screen displays a beautiful SaaS analytics dashboard with a dark sidebar, white content area showing KPI cards with lime-green (#E6FFA9) metrics, a revenue line chart trending upward, and customer data tables. The desk is clean white with a small plant, a notebook, and a ceramic cup. Soft natural window light. Professional, premium workspace mood. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'dashboard',
  },
  {
    id: 'dashboard-mobile',
    section: 'dashboard',
    filename: 'dashboard-mobile.png',
    description: 'Dashboard on mobile — responsive view',
    prompt: `A ${BRAND.phone} held in a hand showing a mobile-optimized analytics dashboard. The screen shows lime-green (#E6FFA9) stat cards, a small chart, and customer metrics. The background is blurred — a modern workspace with a laptop and coffee. The focus is tight on the phone screen. Clean, professional, responsive-design feel. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'dashboard',
  },

  // =========================================================================
  // FIDELY AI SECTION
  // =========================================================================
  {
    id: 'ai-recommendations',
    section: 'ai',
    filename: 'ai-recommendations.png',
    description: 'AI-powered recommendations — futuristic feel',
    prompt: `A ${BRAND.phone} floating in a dark space (#0B051D) with holographic-style lime-green (#E6FFA9) and purple (#6C47FF) light ribbons swirling around it. The phone screen shows an AI chat interface with recommendation cards. Tiny particles of light float around the phone like data points. Futuristic, premium 3D render style with volumetric lighting. ${BRAND.noText}`,
    aspectRatio: '1:1',
    model: 'flux-pro',
    outputDir: 'ai',
  },
  {
    id: 'ai-insights',
    section: 'ai',
    filename: 'ai-insights.png',
    description: 'AI insights — abstract data visualization',
    prompt: `Abstract 3D visualization of data flowing through a network. Glowing lime-green (#E6FFA9) nodes connected by translucent purple (#6C47FF) lines form a constellation pattern against a deep dark background (#0B051D). Some nodes pulse with light, representing insights being generated. The overall feeling is intelligent, ambient, and premium. Sci-fi data visualization aesthetic. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'ai',
  },

  // =========================================================================
  // CTA SECTION
  // =========================================================================
  {
    id: 'cta-phone',
    section: 'cta',
    filename: 'cta-phone.png',
    description: 'CTA section — phone with "add to wallet" screen',
    prompt: `A ${BRAND.phone} at a slight angle on a lime-green (#E6FFA9) surface. The screen shows a beautiful loyalty card with an "Add to Wallet" button. Soft shadows cast by the phone on the lime surface. Clean, bright, optimistic studio lighting from above-left. The lime surface is flat and matte. Minimal, conversion-focused product shot. ${BRAND.noText}`,
    aspectRatio: '3:4',
    model: 'flux-pro',
    outputDir: 'cta',
  },

  // =========================================================================
  // ABOUT PAGE
  // =========================================================================
  {
    id: 'about-mission',
    section: 'about',
    filename: 'about-mission.png',
    description: 'Mission/vision — local business community',
    prompt: `A vibrant street scene showing a row of diverse small businesses — a cafe, a bookshop, a bakery, and a flower shop — all with warm inviting storefronts and their doors open. Golden hour sunlight bathes the street. A few people walk casually, one person holding up a phone. The scene feels alive, connected, and community-oriented. ${BRAND.photography}, wide shot. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'about',
  },
  {
    id: 'about-team',
    section: 'about',
    filename: 'about-team.png',
    description: 'Team culture — modern workspace',
    prompt: `A bright, modern co-working space with large windows and city views. A small team of diverse young professionals collaborates around a large wooden table with laptops, notebooks, and coffee cups. The mood is energetic but focused. One person gestures at a laptop screen with a dashboard visible. Green plants, warm lighting, and a whiteboard with colorful sticky notes in the background. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'about',
  },
  {
    id: 'about-values',
    section: 'about',
    filename: 'about-values.png',
    description: 'Company values — abstract brand',
    prompt: `An elegant abstract composition of three glossy spheres in lime-green (#E6FFA9), deep purple (#6C47FF), and off-white (#F9F8F5) arranged on ascending geometric pedestals against a deep dark background (#0B051D). The spheres have beautiful reflections and soft caustic light patterns. The pedestals are clean matte black. Premium 3D render, gallery lighting. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'about',
  },

  // =========================================================================
  // BUSINESS PAGE
  // =========================================================================
  {
    id: 'business-hero',
    section: 'business',
    filename: 'business-hero.png',
    description: 'For Business page hero — merchant success',
    prompt: `A proud small business owner standing in the doorway of their beautifully designed shop, holding a tablet showing loyalty program analytics with an upward trend. Golden hour light illuminates them from behind. The shop interior is warm and inviting. The person looks directly at camera with a confident smile. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'business',
  },
  {
    id: 'business-growth',
    section: 'business',
    filename: 'business-growth.png',
    description: 'Business growth — busy shop with returning customers',
    prompt: `Interior of a bustling modern cafe with a queue of happy customers. The scene feels alive and busy — baristas working, customers chatting, phones out on tables. Warm ambient lighting, exposed brick walls, green plants. One customer at the front is tapping their phone on an NFC reader with a subtle lime-green (#E6FFA9) light pulse. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'business',
  },
  {
    id: 'business-easy-setup',
    section: 'business',
    filename: 'business-easy-setup.png',
    description: 'Easy setup — 5-minute onboarding',
    prompt: `Overhead flat lay of a minimal workspace: a laptop showing a clean sign-up form, a cup of coffee, a phone showing a completed loyalty card design, and a small timer showing 5:00. Clean white desk surface, soft overhead lighting. The layout is geometric and satisfying, conveying speed and simplicity. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'business',
  },

  // =========================================================================
  // CUSTOMERS PAGE
  // =========================================================================
  {
    id: 'customers-hero',
    section: 'customers',
    filename: 'customers-hero.png',
    description: 'Customer experience hero — joy of rewards',
    prompt: `A young woman at a coffee shop counter, eyes lit up with genuine delight as she looks at her phone screen. She has just received a loyalty reward notification. The barista across the counter smiles too. The cafe is warm, cozy, with beautiful latte art visible on the counter. Soft morning light, shallow depth of field. The moment feels authentic and joyful. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'customers',
  },
  {
    id: 'customers-wallet',
    section: 'customers',
    filename: 'customers-wallet.png',
    description: 'Customer wallet experience — cards in Apple Wallet',
    prompt: `A close-up of hands holding a phone showing multiple loyalty cards stacked in Apple Wallet. Each card has a different brand color — one lime-green, one purple, one warm brown. The hands are relaxed and natural, sitting at a cafe table with a blurred coffee and book in the background. Warm, lifestyle photography feel. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '4:3',
    model: 'flux-pro',
    outputDir: 'customers',
  },
  {
    id: 'customers-community',
    section: 'customers',
    filename: 'customers-community.png',
    description: 'Community — friends sharing loyalty experience',
    prompt: `A group of three friends at a brunch table, one showing their phone screen to the others. They are laughing and engaged. Beautiful brunch spread visible — avocado toast, fresh juice, coffee. The restaurant is bright, airy, with plants and natural light. One friend points at the phone excitedly. Candid, genuine editorial lifestyle photography. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'customers',
  },

  // =========================================================================
  // BLOG FEATURED IMAGES
  // =========================================================================
  {
    id: 'blog-loyalty-stats',
    section: 'blog',
    filename: 'blog-loyalty-stats.png',
    description: 'Blog — "The Future of Customer Loyalty" article image',
    prompt: `A minimalist abstract composition: a large lime-green (#E6FFA9) upward-trending arrow made of translucent glass rises from a dark platform (#0B051D). Small purple (#6C47FF) and white data point particles orbit around it. The background is a gradient from dark navy to slightly lighter purple. Premium 3D render, data-visualization-meets-art aesthetic. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },
  {
    id: 'blog-digital-vs-paper',
    section: 'blog',
    filename: 'blog-digital-vs-paper.png',
    description: 'Blog — "Digital vs Paper Loyalty Cards" article image',
    prompt: `A split composition on a clean surface. Left side: a crumpled, worn paper punch card with faded stamps, sitting on a grey textured background. Right side: a modern phone showing a pristine digital loyalty card with glowing lime-green (#E6FFA9) stamps on a dark background, sitting on a smooth white surface. The contrast between old and new is dramatic. Clean product photography, soft studio lighting. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },
  {
    id: 'blog-cafe-success',
    section: 'blog',
    filename: 'blog-cafe-success.png',
    description: 'Blog — cafe case study article image',
    prompt: `A charming independent cafe interior shot from the counter perspective looking out at a full house of happy customers. Warm pendant lighting, steaming cups, a barista in action. On the counter: a sleek black NFC reader with a subtle lime-green (#E6FFA9) LED ring glowing softly. The scene radiates success, community, and warmth. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },
  {
    id: 'blog-push-notifications',
    section: 'blog',
    filename: 'blog-push-notifications.png',
    description: 'Blog — "Power of Push Notifications" article image',
    prompt: `An artistic flat lay: a phone in the center of a dark surface (#0B051D) with multiple translucent notification bubbles floating above it in a radial pattern. Each bubble is a different soft color — lime-green (#E6FFA9), lavender (#AA89F2), white. They create a beautiful constellation effect. Soft studio lighting with dramatic shadows. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },
  {
    id: 'blog-retention',
    section: 'blog',
    filename: 'blog-retention.png',
    description: 'Blog — customer retention strategies article image',
    prompt: `A metaphorical image: a magnet made of polished dark metal (#0B051D) with lime-green (#E6FFA9) accents pulling small glowing human-silhouette figures toward it. The figures emit soft warm light. Dark background with subtle purple (#6C47FF) ambient glow. The composition symbolizes customer attraction and retention. Clean 3D render, conceptual art style. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },
  {
    id: 'blog-small-business',
    section: 'blog',
    filename: 'blog-small-business.png',
    description: 'Blog — small business tips article image',
    prompt: `A warm overhead shot of a small business owner's desk: a laptop with analytics on screen, a handwritten to-do list, a phone showing a loyalty card, a cup of coffee, scattered colorful sticky notes, and a small "Open" sign. The desk is natural wood with beautiful grain. Warm daylight, creative workspace mood. The layout feels organized yet personal. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'blog',
  },

  // =========================================================================
  // CAREERS PAGE
  // =========================================================================
  {
    id: 'careers-hero',
    section: 'careers',
    filename: 'careers-hero.png',
    description: 'Careers page hero — team collaboration',
    prompt: `A modern tech startup workspace with diverse team members collaborating. Two people pair-programming at a standing desk, another presenting at a whiteboard with sketches. Large windows with natural light, plants throughout the space, and a mix of open and private areas. The mood is energetic, creative, and inclusive. Warm, authentic editorial photography. ${BRAND.photography}. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'careers',
  },

  // =========================================================================
  // PRESS PAGE
  // =========================================================================
  {
    id: 'press-hero',
    section: 'press',
    filename: 'press-hero.png',
    description: 'Press page — brand showcase',
    prompt: `A premium product photograph showing the Kyro brand elements arranged on a deep dark surface (#0B051D): a phone with a loyalty card on screen, a sleek black NFC reader, and printed collateral cards — all arranged in a geometric, balanced composition. Soft dramatic studio lighting from the upper left creating long elegant shadows. Each item has a subtle lime-green (#E6FFA9) accent detail. High-end editorial product photography. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'press',
  },

  // =========================================================================
  // BRAND / ABSTRACT — for backgrounds and decorative use
  // =========================================================================
  {
    id: 'brand-abstract-1',
    section: 'brand',
    filename: 'abstract-spheres.png',
    description: 'Abstract 3D — glossy spheres on steps (Klarna-inspired)',
    prompt: `Three glossy lime-green (#E6FFA9) spheres rolling down geometric dark matte steps (#0B051D) through a modern arch doorway. All rendered in a monochromatic dark palette with the lime spheres as the only bright elements. Soft, diffused studio lighting and dramatic shadows. The surfaces look like smooth matte concrete. Surreal, architectural, premium 3D render with photorealistic materials. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'brand',
  },
  {
    id: 'brand-abstract-2',
    section: 'brand',
    filename: 'abstract-particles.png',
    description: 'Abstract — lime particles forming a shape',
    prompt: `Thousands of tiny luminous lime-green (#E6FFA9) particles suspended in a dark void (#0B051D), gradually converging toward the center to form a rounded square shape. The particles closer to the center are brighter and denser. Purple (#6C47FF) ambient fog swirls in the background. The overall feeling is magical, digital, and premium. Cinematic, wide aspect ratio. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'brand',
  },
  {
    id: 'brand-abstract-3',
    section: 'brand',
    filename: 'abstract-wave.png',
    description: 'Abstract — flowing wave of cards',
    prompt: `A flowing wave made of hundreds of translucent digital cards cascading through a dark space (#0B051D). The cards shift from lime-green (#E6FFA9) at one end through purple (#6C47FF) to white at the other end. Each card is slightly transparent, creating beautiful overlapping color effects. The wave curves elegantly in an S-shape. Dramatic side-lighting creates rim highlights on each card. Cinematic 3D render. ${BRAND.noText}`,
    aspectRatio: '16:9',
    model: 'flux-pro',
    outputDir: 'brand',
  },
  {
    id: 'brand-mosaic',
    section: 'brand',
    filename: 'brand-mosaic.png',
    description: 'Brand mosaic grid — Klarna-style dense grid',
    prompt: `A dense mosaic grid of 12 square tiles on a dark navy background (#0B051D). Each tile is a different content: a phone with loyalty card, a coffee cup from above, a smiling face close-up, lime-green (#E6FFA9) solid color tile, a hand tapping a phone, a purple (#6C47FF) abstract shape, a bakery counter, a stamp card close-up, an off-white minimalist tile, a rewards celebration confetti, a QR code scan moment, and a wallet interface. Clean thin borders separate each tile. Magazine editorial grid layout. ${BRAND.noText}`,
    aspectRatio: '1:1',
    model: 'flux-pro',
    outputDir: 'brand',
  },
];

// ---------------------------------------------------------------------------
// Download utility
// ---------------------------------------------------------------------------

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadFile(redirectUrl, dest).then(resolve).catch(reject);
            return;
          }
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

// ---------------------------------------------------------------------------
// Main generation logic
// ---------------------------------------------------------------------------

async function generateWebsiteImages() {
  const outputBase = path.join(process.cwd(), 'public', 'images');

  // Filter by section if specified
  let images = WEBSITE_IMAGES;
  if (sectionFilter) {
    images = images.filter((img) => sectionFilter.includes(img.section));
    console.log(`\nFiltering to sections: ${sectionFilter.join(', ')}`);
  }

  console.log(`\n========================================`);
  console.log(`  Kyro Website Image Generator`);
  console.log(`  ${images.length} images to generate`);
  console.log(`  Model: ${modelOverride ?? 'per-image defaults'}`);
  console.log(`  Dry run: ${dryRun ? 'YES (no API calls)' : 'NO'}`);
  console.log(`========================================\n`);

  // Group by section for nice logging
  const sections = new Map<string, WebsiteImage[]>();
  for (const img of images) {
    if (!sections.has(img.section)) sections.set(img.section, []);
    sections.get(img.section)!.push(img);
  }

  const results: { id: string; status: string; url?: string; error?: string }[] = [];
  let completed = 0;
  let failed = 0;

  for (const [section, sectionImages] of sections) {
    console.log(`\n--- ${section.toUpperCase()} (${sectionImages.length} images) ---`);

    for (const img of sectionImages) {
      const outputPath = path.join(outputBase, img.outputDir, img.filename);
      const model = modelOverride ?? img.model;

      console.log(`\n  [${completed + failed + 1}/${images.length}] ${img.id}`);
      console.log(`  Description: ${img.description}`);
      console.log(`  Model: ${model} | Ratio: ${img.aspectRatio}`);
      console.log(`  Output: public/images/${img.outputDir}/${img.filename}`);

      if (dryRun) {
        console.log(`  Prompt: ${img.prompt.substring(0, 120)}...`);
        console.log(`  [DRY RUN — skipped]`);
        results.push({ id: img.id, status: 'skipped (dry run)' });
        completed++;
        continue;
      }

      try {
        console.log(`  Generating...`);
        const startTime = Date.now();

        const result: ImageResult = await generateImage({
          prompt: img.prompt,
          model,
          aspectRatio: img.aspectRatio,
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  Generated in ${duration}s`);
        console.log(`  URL: ${result.url}`);

        // Download the image
        console.log(`  Downloading to ${outputPath}...`);
        await downloadFile(result.url, outputPath);
        console.log(`  Saved!`);

        results.push({ id: img.id, status: 'success', url: result.url });
        completed++;
      } catch (err: any) {
        console.error(`  FAILED: ${err.message}`);
        results.push({ id: img.id, status: 'failed', error: err.message });
        failed++;
      }
    }
  }

  // Save manifest
  const manifestPath = path.join(outputBase, 'manifest.json');
  const manifest = {
    generated: new Date().toISOString(),
    model: modelOverride ?? 'mixed (per-image)',
    total: images.length,
    completed,
    failed,
    images: results,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n========================================`);
  console.log(`  Generation Complete`);
  console.log(`  Completed: ${completed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Manifest: public/images/manifest.json`);
  console.log(`========================================\n`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

generateWebsiteImages().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
