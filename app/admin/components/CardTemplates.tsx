"use client";

const templates = [
  {
    id: "beauty-points",
    name: "Studio Glow",
    category: "Salon / Beauty",
    type: "points" as const,
    preview: { bg: "#f5a0a0", accent: "#e86b6b", primary: "#ffffff", secondary: "#fff0f0", icon: "💇" },
    data: {
      type: "points",
      businessDetails: { name: "", category: "salon", tagline: "Glow from within", description: "Premium beauty treatments. Facials, lashes, brows, and nails in a serene space.", welcomeOffer: "Free brow wax with your first facial" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#f5a0a0", primaryColor: "#ffffff", secondaryColor: "#fff0f0", accentColor: "#e86b6b", cardStyle: "premium" },
      logic: { pointsPerDollar: 1, pointsLabel: "Points", rewardTiers: [{ points: 100, reward: "Free brow wax" }, { points: 250, reward: "Free express facial" }, { points: 500, reward: "Full pamper package" }], redemptionRules: "Earn 1 point per dollar spent on treatments." },
    },
  },
  {
    id: "burger-coupon",
    name: "Honest Burgers",
    category: "Restaurant / Fast Food",
    type: "coupon" as const,
    preview: { bg: "#1a2332", accent: "#c9a96e", primary: "#f5f0e8", secondary: "#c9a96e", icon: "🍔" },
    data: {
      type: "coupon",
      businessDetails: { name: "", category: "restaurant", tagline: "Smashed to perfection", description: "Hand-smashed burgers with premium ingredients, served with crispy fries.", welcomeOffer: "Free drink with any burger" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1a2332", primaryColor: "#f5f0e8", secondaryColor: "#c9a96e", accentColor: "#c9a96e", cardStyle: "premium" },
      logic: { offerTitle: "Free drink with any burger", offerDescription: "Choose any soft drink or house beer when you order a burger.", expiryDate: "2027-06-30", conditions: "One per customer. Dine-in only." },
    },
  },
  {
    id: "cafe-stamps",
    name: "Bean & Grind",
    category: "Café / Coffee",
    type: "stamp" as const,
    preview: { bg: "#f2e8dc", accent: "#c67a2e", primary: "#2c1810", secondary: "#c67a2e", icon: "☕" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "cafe", tagline: "Artisan coffee, every morning", description: "Specialty single-origin roasts, house-baked pastries, and a warm welcome.", welcomeOffer: "Your first coffee is on us!" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#f2e8dc", primaryColor: "#2c1810", secondaryColor: "#c67a2e", accentColor: "#c67a2e", cardStyle: "premium" },
      logic: { totalStamps: 10, stampIcon: "☕", reward: "Free coffee", progressLabel: "coffees collected" },
    },
  },
  {
    id: "barber-stamps",
    name: "The Barber Club",
    category: "Barber",
    type: "stamp" as const,
    preview: { bg: "#0B051D", accent: "#6C47FF", primary: "#FFFFFF", secondary: "#E6FFA9", icon: "✂️" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "barber", tagline: "Look sharp. Feel sharp.", description: "Premium grooming for the modern gentleman. Cuts, fades, and hot towel shaves.", welcomeOffer: "50% off your first cut" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", cardStyle: "premium" },
      logic: { totalStamps: 8, stampIcon: "✂️", reward: "Free haircut", progressLabel: "cuts completed" },
    },
  },
  {
    id: "gym-points",
    name: "Fitness Rewards",
    category: "Gym / Wellness",
    type: "points" as const,
    preview: { bg: "#0a1628", accent: "#22c55e", primary: "#f0fdf4", secondary: "#86efac", icon: "💪" },
    data: {
      type: "points",
      businessDetails: { name: "", category: "gym", tagline: "Push your limits", description: "State-of-the-art equipment, expert trainers, and a motivating community.", welcomeOffer: "Free personal training session" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0a1628", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", cardStyle: "premium" },
      logic: { pointsPerDollar: 5, pointsLabel: "Fit Points", rewardTiers: [{ points: 100, reward: "Free smoothie" }, { points: 300, reward: "Free PT session" }, { points: 500, reward: "1 month free" }], redemptionRules: "Earn points per class attended or purchase." },
    },
  },
  {
    id: "bakery-stamps",
    name: "Sweet Treats",
    category: "Bakery / Patisserie",
    type: "stamp" as const,
    preview: { bg: "#fef3e2", accent: "#e87c2f", primary: "#3d1f0a", secondary: "#e87c2f", icon: "🧁" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "bakery", tagline: "Freshly baked, daily", description: "Artisan breads, pastries, and cakes baked fresh every morning.", welcomeOffer: "Free pastry with your first purchase" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#fef3e2", primaryColor: "#3d1f0a", secondaryColor: "#e87c2f", accentColor: "#e87c2f", cardStyle: "premium" },
      logic: { totalStamps: 8, stampIcon: "🧁", reward: "Free cake slice", progressLabel: "treats bought" },
    },
  },
  {
    id: "pizza-stamps",
    name: "Slice Club",
    category: "Pizza / Fast Food",
    type: "stamp" as const,
    preview: { bg: "#1a1006", accent: "#f59e0b", primary: "#fffbeb", secondary: "#fcd34d", icon: "🍕" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "restaurant", tagline: "Every slice counts", description: "Hand-tossed pizza with fresh ingredients, baked to perfection.", welcomeOffer: "Free garlic bread with first order" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1a1006", primaryColor: "#fffbeb", secondaryColor: "#fcd34d", accentColor: "#f59e0b", cardStyle: "premium" },
      logic: { totalStamps: 10, stampIcon: "🍕", reward: "Free large pizza", progressLabel: "slices ordered" },
    },
  },
  {
    id: "retail-points",
    name: "Shop & Save",
    category: "Retail / Fashion",
    type: "points" as const,
    preview: { bg: "#1a1a1a", accent: "#e0c097", primary: "#f5f0e8", secondary: "#e0c097", icon: "🛍" },
    data: {
      type: "points",
      businessDetails: { name: "", category: "retail", tagline: "Style that rewards", description: "Curated fashion and accessories with exclusive member benefits.", welcomeOffer: "10% off your first purchase" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1a1a1a", primaryColor: "#f5f0e8", secondaryColor: "#e0c097", accentColor: "#e0c097", cardStyle: "premium" },
      logic: { pointsPerDollar: 10, pointsLabel: "Style Points", rewardTiers: [{ points: 200, reward: "10% off next purchase" }, { points: 500, reward: "$25 store credit" }, { points: 1000, reward: "$50 store credit" }], redemptionRules: "Earn 10 points per dollar spent." },
    },
  },
];

const typeIcons: Record<string, string> = {
  stamp: "⬡",
  points: "★",
  coupon: "✂",
};

export default function CardTemplates({ onSelect }: { onSelect: (data: any) => void }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>
          Start from a template
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "rgb(97,95,109)" }}>
          Pick a design, then customize everything to match your merchant.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.data)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "stretch",
              padding: 0, border: "1px solid rgb(228,227,223)", borderRadius: "16px",
              overflow: "hidden", cursor: "pointer", fontFamily: "inherit",
              backgroundColor: "white", textAlign: "left",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgb(108,71,255)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(108,71,255,0.12)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgb(228,227,223)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Card preview strip */}
            <div style={{
              height: "120px", position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, ${t.preview.bg}, ${t.preview.accent}60)`,
            }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", width: "60px", height: "60px", borderRadius: "50%", background: `radial-gradient(circle, ${t.preview.accent}40, transparent 70%)` }} />
              <div style={{ position: "absolute", bottom: "-10px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${t.preview.secondary}20, transparent 70%)` }} />

              {/* Mini card mockup */}
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "180px", padding: "12px 14px",
                backgroundColor: `${t.preview.bg}`,
                borderRadius: "12px",
                border: `1px solid ${t.preview.primary}15`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "6px",
                    background: `linear-gradient(135deg, ${t.preview.accent}, ${t.preview.accent}cc)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px",
                  }}>
                    {t.preview.icon}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: t.preview.primary }}>{t.name}</div>
                </div>
                {t.type === "stamp" && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{
                        width: "14px", height: "14px", borderRadius: "4px",
                        backgroundColor: i < 3 ? t.preview.accent : `${t.preview.primary}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "8px",
                      }}>
                        {i < 3 ? t.data.logic.stampIcon : ""}
                      </div>
                    ))}
                  </div>
                )}
                {t.type === "points" && (
                  <div>
                    <div style={{ fontSize: "8px", color: t.preview.secondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{(t.data.logic as any).pointsLabel}</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: t.preview.primary, lineHeight: 1 }}>0</div>
                  </div>
                )}
                {t.type === "coupon" && (
                  <div style={{ fontSize: "11px", fontWeight: 700, color: t.preview.primary, lineHeight: 1.2 }}>
                    {(t.data.logic as any).offerTitle}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{t.name}</span>
                <span style={{
                  fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
                  padding: "3px 8px", borderRadius: "6px",
                  backgroundColor: t.type === "stamp" ? "rgb(254,243,199)" : t.type === "points" ? "rgb(219,234,254)" : "rgb(237,233,254)",
                  color: t.type === "stamp" ? "rgb(180,83,9)" : t.type === "points" ? "rgb(30,64,175)" : "rgb(108,71,255)",
                }}>{t.type}</span>
              </div>
              <span style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>{t.category}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
