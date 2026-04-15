"use client";

const templates = [
  {
    id: "cafe-stamps",
    name: "Coffee Loyalty",
    category: "Café / Bakery",
    type: "stamp" as const,
    preview: { bg: "#1a0f0a", accent: "#8b5e3c", primary: "#faf5f0", secondary: "#d4a574", icon: "☕" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "cafe", tagline: "Your daily brew", description: "Specialty coffee and homemade pastries every morning.", welcomeOffer: "First coffee on us!" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1a0f0a", primaryColor: "#faf5f0", secondaryColor: "#d4a574", accentColor: "#8b5e3c", cardStyle: "premium" },
      logic: { totalStamps: 8, stampIcon: "☕", reward: "Free coffee of your choice", progressLabel: "coffees collected" },
    },
  },
  {
    id: "barber-points",
    name: "Grooming Rewards",
    category: "Barber / Salon",
    type: "points" as const,
    preview: { bg: "#0B051D", accent: "#6C47FF", primary: "#FFFFFF", secondary: "#E6FFA9", icon: "💈" },
    data: {
      type: "points",
      businessDetails: { name: "", category: "barber", tagline: "Look sharp. Feel sharp.", description: "Premium grooming for the modern gentleman.", welcomeOffer: "50 bonus points on your first visit" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", cardStyle: "premium" },
      logic: { pointsPerDollar: 10, pointsLabel: "Club Points", rewardTiers: [{ points: 200, reward: "Free beard trim" }, { points: 500, reward: "Free haircut" }, { points: 1000, reward: "Full grooming package" }], redemptionRules: "Points expire after 12 months of inactivity." },
    },
  },
  {
    id: "restaurant-coupon",
    name: "Grand Opening",
    category: "Restaurant / Bar",
    type: "coupon" as const,
    preview: { bg: "#1a0505", accent: "#cc2936", primary: "#fff5e6", secondary: "#ffd700", icon: "🍽️" },
    data: {
      type: "coupon",
      businessDetails: { name: "", category: "restaurant", tagline: "Fresh from kitchen to table", description: "Authentic cuisine in a warm and welcoming atmosphere.", welcomeOffer: "" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1a0505", primaryColor: "#fff5e6", secondaryColor: "#ffd700", accentColor: "#cc2936", cardStyle: "premium" },
      logic: { offerTitle: "20% Off Your First Visit", offerDescription: "Valid on your entire bill when you dine with us for the first time.", expiryDate: "2026-12-31", conditions: "One per customer. Dine-in only. Min spend $30." },
    },
  },
  {
    id: "beauty-stamps",
    name: "Beauty Pass",
    category: "Salon / Spa",
    type: "stamp" as const,
    preview: { bg: "#1c1018", accent: "#b76e79", primary: "#fff0f5", secondary: "#e8b4b8", icon: "✨" },
    data: {
      type: "stamp",
      businessDetails: { name: "", category: "salon", tagline: "Your glow-up starts here", description: "Premium beauty and wellness treatments in a serene space.", welcomeOffer: "Free brow wax with your first facial" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#1c1018", primaryColor: "#fff0f5", secondaryColor: "#e8b4b8", accentColor: "#b76e79", cardStyle: "premium" },
      logic: { totalStamps: 6, stampIcon: "✨", reward: "Free express facial", progressLabel: "treatments completed" },
    },
  },
  {
    id: "gym-points",
    name: "Fitness Rewards",
    category: "Gym / Wellness",
    type: "points" as const,
    preview: { bg: "#0a1628", accent: "#22c55e", primary: "#f0fdf4", secondary: "#86efac", icon: "🏋️" },
    data: {
      type: "points",
      businessDetails: { name: "", category: "gym", tagline: "Push your limits", description: "State-of-the-art equipment, expert trainers, and a motivating community.", welcomeOffer: "Free personal training session" },
      branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0a1628", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", cardStyle: "premium" },
      logic: { pointsPerDollar: 5, pointsLabel: "Fit Points", rewardTiers: [{ points: 100, reward: "Free smoothie" }, { points: 300, reward: "Free PT session" }, { points: 500, reward: "1 month free" }], redemptionRules: "Earn points per class attended or purchase." },
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
              {/* Decorative elements */}
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
                    <div style={{ fontSize: "8px", color: t.preview.secondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.data.logic.pointsLabel}</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: t.preview.primary, lineHeight: 1 }}>0</div>
                  </div>
                )}
                {t.type === "coupon" && (
                  <div style={{ fontSize: "11px", fontWeight: 700, color: t.preview.primary, lineHeight: 1.2 }}>
                    {t.data.logic.offerTitle}
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
