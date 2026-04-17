export type OnboardingTheme = {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stampIcon: string;
};

export const businessTypes = [
  { id: "cafe", label: "Cafe / Coffee", icon: "coffee" },
  { id: "restaurant", label: "Restaurant", icon: "utensils" },
  { id: "bakery", label: "Bakery", icon: "cake" },
  { id: "barber", label: "Barber", icon: "scissors" },
  { id: "salon", label: "Salon / Beauty", icon: "sparkles" },
  { id: "gym", label: "Gym / Fitness", icon: "dumbbell" },
  { id: "retail", label: "Retail / Shop", icon: "shopping-bag" },
  { id: "other", label: "Other", icon: "store" },
];

export const themes: Record<string, OnboardingTheme[]> = {
  cafe: [
    { id: "cafe-warm", name: "Warm Roast", backgroundColor: "#f2e8dc", primaryColor: "#2c1810", secondaryColor: "#c67a2e", accentColor: "#c67a2e", stampIcon: "coffee" },
    { id: "cafe-dark", name: "Dark Brew", backgroundColor: "#1a1006", primaryColor: "#fffbeb", secondaryColor: "#fcd34d", accentColor: "#f59e0b", stampIcon: "coffee" },
    { id: "cafe-minimal", name: "Clean White", backgroundColor: "#ffffff", primaryColor: "#1a1a1a", secondaryColor: "#737373", accentColor: "#0b051d", stampIcon: "coffee" },
    { id: "cafe-forest", name: "Forest", backgroundColor: "#1a2e1a", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", stampIcon: "coffee" },
  ],
  restaurant: [
    { id: "rest-elegant", name: "Elegant", backgroundColor: "#1a1a1a", primaryColor: "#f5f0e8", secondaryColor: "#e0c097", accentColor: "#e0c097", stampIcon: "utensils" },
    { id: "rest-warm", name: "Rustic", backgroundColor: "#2c1810", primaryColor: "#fef3e2", secondaryColor: "#e87c2f", accentColor: "#e87c2f", stampIcon: "utensils" },
    { id: "rest-modern", name: "Modern", backgroundColor: "#0b051d", primaryColor: "#ffffff", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampIcon: "utensils" },
    { id: "rest-red", name: "Classic Red", backgroundColor: "#1a0a0a", primaryColor: "#fef2f2", secondaryColor: "#fca5a5", accentColor: "#ef4444", stampIcon: "utensils" },
  ],
  bakery: [
    { id: "bake-sweet", name: "Sweet", backgroundColor: "#fef3e2", primaryColor: "#3d1f0a", secondaryColor: "#e87c2f", accentColor: "#e87c2f", stampIcon: "cake" },
    { id: "bake-pink", name: "Pastel", backgroundColor: "#fdf2f8", primaryColor: "#831843", secondaryColor: "#ec4899", accentColor: "#ec4899", stampIcon: "cake" },
    { id: "bake-cream", name: "Cream", backgroundColor: "#fffbeb", primaryColor: "#451a03", secondaryColor: "#d97706", accentColor: "#f59e0b", stampIcon: "cake" },
    { id: "bake-dark", name: "Chocolate", backgroundColor: "#1c1210", primaryColor: "#fef3e2", secondaryColor: "#d4a574", accentColor: "#92400e", stampIcon: "cake" },
  ],
  barber: [
    { id: "barb-classic", name: "Classic", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampIcon: "scissors" },
    { id: "barb-dark", name: "Dark", backgroundColor: "#111111", primaryColor: "#f5f5f5", secondaryColor: "#a3a3a3", accentColor: "#ffffff", stampIcon: "scissors" },
    { id: "barb-gold", name: "Gold", backgroundColor: "#1a1006", primaryColor: "#fffbeb", secondaryColor: "#fcd34d", accentColor: "#f59e0b", stampIcon: "scissors" },
    { id: "barb-blue", name: "Navy", backgroundColor: "#0a1628", primaryColor: "#e0f2fe", secondaryColor: "#7dd3fc", accentColor: "#0284c7", stampIcon: "scissors" },
  ],
  salon: [
    { id: "salon-rose", name: "Rose", backgroundColor: "#f5a0a0", primaryColor: "#ffffff", secondaryColor: "#fff0f0", accentColor: "#e86b6b", stampIcon: "sparkles" },
    { id: "salon-lavender", name: "Lavender", backgroundColor: "#ede9fe", primaryColor: "#3b0764", secondaryColor: "#a78bfa", accentColor: "#7c3aed", stampIcon: "sparkles" },
    { id: "salon-blush", name: "Blush", backgroundColor: "#fdf2f8", primaryColor: "#831843", secondaryColor: "#f9a8d4", accentColor: "#ec4899", stampIcon: "sparkles" },
    { id: "salon-gold", name: "Luxury", backgroundColor: "#1a1a1a", primaryColor: "#fef3c7", secondaryColor: "#fbbf24", accentColor: "#d97706", stampIcon: "sparkles" },
  ],
  gym: [
    { id: "gym-energy", name: "Energy", backgroundColor: "#0a1628", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", stampIcon: "dumbbell" },
    { id: "gym-fire", name: "Fire", backgroundColor: "#1a0a0a", primaryColor: "#fef2f2", secondaryColor: "#fca5a5", accentColor: "#ef4444", stampIcon: "dumbbell" },
    { id: "gym-steel", name: "Steel", backgroundColor: "#18181b", primaryColor: "#fafafa", secondaryColor: "#a1a1aa", accentColor: "#71717a", stampIcon: "dumbbell" },
    { id: "gym-blue", name: "Power", backgroundColor: "#0a1628", primaryColor: "#e0f2fe", secondaryColor: "#7dd3fc", accentColor: "#0ea5e9", stampIcon: "dumbbell" },
  ],
  retail: [
    { id: "retail-luxury", name: "Luxury", backgroundColor: "#1a1a1a", primaryColor: "#f5f0e8", secondaryColor: "#e0c097", accentColor: "#e0c097", stampIcon: "shopping-bag" },
    { id: "retail-modern", name: "Modern", backgroundColor: "#ffffff", primaryColor: "#0a0a0a", secondaryColor: "#737373", accentColor: "#0b051d", stampIcon: "shopping-bag" },
    { id: "retail-warm", name: "Boutique", backgroundColor: "#fef7ee", primaryColor: "#431407", secondaryColor: "#c2410c", accentColor: "#ea580c", stampIcon: "shopping-bag" },
    { id: "retail-cool", name: "Minimal", backgroundColor: "#f8fafc", primaryColor: "#0f172a", secondaryColor: "#64748b", accentColor: "#334155", stampIcon: "shopping-bag" },
  ],
  other: [
    { id: "other-kyro", name: "Kyro", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampIcon: "star" },
    { id: "other-clean", name: "Clean", backgroundColor: "#ffffff", primaryColor: "#0a0a0a", secondaryColor: "#737373", accentColor: "#0b051d", stampIcon: "star" },
    { id: "other-dark", name: "Dark", backgroundColor: "#111111", primaryColor: "#fafafa", secondaryColor: "#a3a3a3", accentColor: "#ffffff", stampIcon: "star" },
    { id: "other-warm", name: "Warm", backgroundColor: "#fef7ee", primaryColor: "#431407", secondaryColor: "#c2410c", accentColor: "#ea580c", stampIcon: "star" },
  ],
};

export function getThemesForType(type: string): OnboardingTheme[] {
  return themes[type] || themes.other;
}
