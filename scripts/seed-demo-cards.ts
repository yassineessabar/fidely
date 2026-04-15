/**
 * Seed 4 demo loyalty cards with full branding + QR codes.
 *
 * Usage: npx tsx scripts/seed-demo-cards.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── 4 Demo Merchants ─────────────────────────────────────────────

const merchants = [
  {
    name: "Café Bloom",
    email: "hello@cafebloom.com.au",
    phone: "+61412345678",
    city: "Melbourne",
    business_type: "cafe",
    company_size: "1" as const,
    plan: "growth" as const,
  },
  {
    name: "The Barber Club",
    email: "info@thebarberclub.com.au",
    phone: "+61423456789",
    city: "Sydney",
    business_type: "barber",
    company_size: "2-5" as const,
    plan: "starter" as const,
  },
  {
    name: "Sakura Sushi",
    email: "book@sakurasushi.com.au",
    phone: "+61434567890",
    city: "Brisbane",
    business_type: "restaurant",
    company_size: "1" as const,
    plan: "growth" as const,
  },
  {
    name: "Glow Studio",
    email: "hello@glowstudio.com.au",
    phone: "+61445678901",
    city: "Perth",
    business_type: "salon",
    company_size: "2-5" as const,
    plan: "enterprise" as const,
  },
];

// ── 4 Demo Cards (mixed types + distinct branding) ───────────────

const cards = [
  {
    // Card 1: Café Bloom — Stamp Card (warm earth tones)
    merchantIndex: 0,
    type: "stamp" as const,
    name: "Café Bloom Coffee Stamps",
    business_details: {
      name: "Café Bloom",
      category: "cafe",
      tagline: "Artisan coffee, every morning",
      description: "Melbourne's favourite neighbourhood café. Specialty roasts, homemade pastries, and a warm welcome every visit.",
      welcomeOffer: "Your first coffee is on us!",
    },
    branding: {
      logoUrl: "",
      heroImageUrl: "",
      backgroundColor: "#1a0f0a",
      primaryColor: "#faf5f0",
      secondaryColor: "#d4a574",
      accentColor: "#8b5e3c",
      cardStyle: "premium",
    },
    logic: {
      totalStamps: 8,
      stampIcon: "☕",
      reward: "Free coffee of your choice",
      progressLabel: "coffees collected",
    },
  },
  {
    // Card 2: The Barber Club — Points Card (dark + lime, Kyro-style)
    merchantIndex: 1,
    type: "points" as const,
    name: "Barber Club Rewards",
    business_details: {
      name: "The Barber Club",
      category: "barber",
      tagline: "Look sharp. Feel sharp.",
      description: "Premium grooming for the modern gentleman. Cuts, fades, beard trims, and hot towel shaves.",
      welcomeOffer: "50 bonus points on your first visit",
    },
    branding: {
      logoUrl: "",
      heroImageUrl: "",
      backgroundColor: "#0B051D",
      primaryColor: "#FFFFFF",
      secondaryColor: "#E6FFA9",
      accentColor: "#6C47FF",
      cardStyle: "premium",
    },
    logic: {
      pointsPerDollar: 10,
      pointsLabel: "Club Points",
      rewardTiers: [
        { points: 200, reward: "Free beard trim" },
        { points: 500, reward: "Free haircut" },
        { points: 1000, reward: "Full grooming package" },
      ],
      redemptionRules: "Points expire after 12 months of inactivity. Cannot be exchanged for cash.",
    },
  },
  {
    // Card 3: Sakura Sushi — Coupon (Japanese-inspired, deep red + gold)
    merchantIndex: 2,
    type: "coupon" as const,
    name: "Sakura Grand Opening",
    business_details: {
      name: "Sakura Sushi",
      category: "restaurant",
      tagline: "Fresh from ocean to plate",
      description: "Authentic Japanese cuisine in the heart of Brisbane. Omakase, sashimi, and handcrafted rolls.",
      welcomeOffer: "",
    },
    branding: {
      logoUrl: "",
      heroImageUrl: "",
      backgroundColor: "#1a0505",
      primaryColor: "#fff5e6",
      secondaryColor: "#ffd700",
      accentColor: "#cc2936",
      cardStyle: "premium",
    },
    logic: {
      offerTitle: "20% Off Your First Visit",
      offerDescription: "Enjoy 20% off your entire bill when you dine with us for the first time. Valid for dine-in only.",
      expiryDate: "2026-07-31",
      conditions: "One per customer. Not valid with other offers. Minimum spend $30. Dine-in only.",
    },
  },
  {
    // Card 4: Glow Studio — Stamp Card (clean, luxe, rose gold)
    merchantIndex: 3,
    type: "stamp" as const,
    name: "Glow Studio Beauty Pass",
    business_details: {
      name: "Glow Studio",
      category: "salon",
      tagline: "Your glow-up starts here",
      description: "Premium beauty and wellness treatments. Facials, nails, lashes, and brow styling in a serene space.",
      welcomeOffer: "Free brow wax with your first facial",
    },
    branding: {
      logoUrl: "",
      heroImageUrl: "",
      backgroundColor: "#1c1018",
      primaryColor: "#fff0f5",
      secondaryColor: "#e8b4b8",
      accentColor: "#b76e79",
      cardStyle: "premium",
    },
    logic: {
      totalStamps: 6,
      stampIcon: "✨",
      reward: "Free express facial",
      progressLabel: "treatments completed",
    },
  },
];

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Seeding 4 demo merchants and loyalty cards...\n");

  // 1. Create merchants
  const businessIds: string[] = [];
  for (const merchant of merchants) {
    const { data, error } = await supabase
      .from("businesses")
      .insert(merchant)
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ Failed to create merchant "${merchant.name}":`, error.message);
      process.exit(1);
    }
    businessIds.push(data.id);
    console.log(`  ✓ Created merchant: ${merchant.name} (${data.id})`);
  }

  // 2. Create and publish cards
  console.log("");
  const results: { name: string; type: string; url: string; id: string }[] = [];

  for (const card of cards) {
    const businessId = businessIds[card.merchantIndex];

    // Insert card
    const { data: cardData, error: cardError } = await supabase
      .from("loyalty_cards")
      .insert({
        business_id: businessId,
        type: card.type,
        name: card.name,
        business_details: card.business_details,
        branding: card.branding,
        logic: card.logic,
      })
      .select("id")
      .single();

    if (cardError) {
      console.error(`  ❌ Failed to create card "${card.name}":`, cardError.message);
      continue;
    }

    const cardId = cardData.id;
    const shareUrl = `${ORIGIN}/c/${cardId}`;

    // Generate QR code
    let qrCodeData = "";
    try {
      qrCodeData = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#0B051D", light: "#FFFFFF" },
      });
    } catch (err) {
      console.error(`  ⚠ QR generation failed for "${card.name}"`);
    }

    // Publish (set active + share URL + QR)
    await supabase
      .from("loyalty_cards")
      .update({
        status: "active" as any,
        share_url: shareUrl,
        qr_code_data: qrCodeData,
      })
      .eq("id", cardId);

    results.push({
      name: card.name,
      type: card.type,
      url: shareUrl,
      id: cardId,
    });

    console.log(`  ✓ Created & published: ${card.name} (${card.type})`);
  }

  // 3. Print results
  console.log("\n" + "═".repeat(60));
  console.log("📱 DEMO CARDS READY — scan these on your iPhone:");
  console.log("═".repeat(60) + "\n");

  for (const r of results) {
    console.log(`  ${r.type.toUpperCase().padEnd(7)} ${r.name}`);
    console.log(`  🔗 ${r.url}`);
    console.log("");
  }

  console.log("─".repeat(60));
  console.log("Start dev server with: npm run dev");
  console.log("Then visit any URL above, or check /admin/cards to see all 4.");
  console.log("─".repeat(60));
}

main().catch(console.error);
