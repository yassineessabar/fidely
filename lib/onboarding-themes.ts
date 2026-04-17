export type OnboardingTheme = {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stampIcon: string;
  stampEmoji: string;
  // Realistic preview content
  mockBusiness: string;
  mockReward: string;
  mockStamps: number;
  bannerImage: string;
  logoImage: string;
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
    { id: "cafe-warm", name: "Warm Roast", backgroundColor: "#f2e8dc", primaryColor: "#2c1810", secondaryColor: "#c67a2e", accentColor: "#c67a2e", stampEmoji: "☕", stampIcon: "coffee", mockBusiness: "Bean & Grind", mockReward: "Free coffee", mockStamps: 10, bannerImage: "/images/brands/biz-cafe.png", logoImage: "/images/brands/biz-cafe.png" },
    { id: "cafe-dark", name: "Dark Brew", backgroundColor: "#1a1006", primaryColor: "#fffbeb", secondaryColor: "#fcd34d", accentColor: "#f59e0b", stampEmoji: "☕", stampIcon: "coffee", mockBusiness: "The Roastery", mockReward: "Free latte", mockStamps: 8, bannerImage: "/images/brands/biz-cafe.png", logoImage: "/images/brands/biz-cafe.png" },
    { id: "cafe-minimal", name: "Clean White", backgroundColor: "#ffffff", primaryColor: "#1a1a1a", secondaryColor: "#737373", accentColor: "#0b051d", stampEmoji: "☕", stampIcon: "coffee", mockBusiness: "Morning Cup", mockReward: "Free brew", mockStamps: 10, bannerImage: "/images/brands/biz-cafe.png", logoImage: "/images/brands/biz-cafe.png" },
    { id: "cafe-forest", name: "Forest", backgroundColor: "#1a2e1a", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", stampEmoji: "☕", stampIcon: "coffee", mockBusiness: "Green Bean", mockReward: "Free matcha", mockStamps: 8, bannerImage: "/images/brands/biz-cafe.png", logoImage: "/images/brands/biz-cafe.png" },
  ],
  restaurant: [
    { id: "rest-elegant", name: "Elegant", backgroundColor: "#1a1a1a", primaryColor: "#f5f0e8", secondaryColor: "#e0c097", accentColor: "#e0c097", stampEmoji: "🍽️", stampIcon: "utensils", mockBusiness: "Nobu Kitchen", mockReward: "Free dessert", mockStamps: 10, bannerImage: "/images/brands/biz-sushi.png", logoImage: "/images/brands/biz-sushi.png" },
    { id: "rest-warm", name: "Rustic", backgroundColor: "#2c1810", primaryColor: "#fef3e2", secondaryColor: "#e87c2f", accentColor: "#e87c2f", stampEmoji: "🍽️", stampIcon: "utensils", mockBusiness: "The Fire Grill", mockReward: "Free starter", mockStamps: 8, bannerImage: "/images/brands/biz-pizza.png", logoImage: "/images/brands/biz-pizza.png" },
    { id: "rest-modern", name: "Modern", backgroundColor: "#0b051d", primaryColor: "#ffffff", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampEmoji: "🍽️", stampIcon: "utensils", mockBusiness: "Plate & Pour", mockReward: "Free main", mockStamps: 12, bannerImage: "/images/brands/biz-sushi.png", logoImage: "/images/brands/biz-sushi.png" },
    { id: "rest-red", name: "Classic Red", backgroundColor: "#1a0a0a", primaryColor: "#fef2f2", secondaryColor: "#fca5a5", accentColor: "#ef4444", stampEmoji: "🍽️", stampIcon: "utensils", mockBusiness: "Rosso Bistro", mockReward: "Free pizza", mockStamps: 10, bannerImage: "/images/brands/biz-pizza.png", logoImage: "/images/brands/biz-pizza.png" },
  ],
  bakery: [
    { id: "bake-sweet", name: "Sweet", backgroundColor: "#fef3e2", primaryColor: "#3d1f0a", secondaryColor: "#e87c2f", accentColor: "#e87c2f", stampEmoji: "🧁", stampIcon: "cake", mockBusiness: "Sweet Treats", mockReward: "Free pastry", mockStamps: 8, bannerImage: "/images/brands/biz-bakery.png", logoImage: "/images/brands/biz-bakery.png" },
    { id: "bake-pink", name: "Pastel", backgroundColor: "#fdf2f8", primaryColor: "#831843", secondaryColor: "#ec4899", accentColor: "#ec4899", stampEmoji: "🧁", stampIcon: "cake", mockBusiness: "La Patisserie", mockReward: "Free cake slice", mockStamps: 10, bannerImage: "/images/brands/biz-bakery.png", logoImage: "/images/brands/biz-bakery.png" },
    { id: "bake-cream", name: "Cream", backgroundColor: "#fffbeb", primaryColor: "#451a03", secondaryColor: "#d97706", accentColor: "#f59e0b", stampEmoji: "🧁", stampIcon: "cake", mockBusiness: "Golden Crust", mockReward: "Free loaf", mockStamps: 10, bannerImage: "/images/brands/biz-bakery.png", logoImage: "/images/brands/biz-bakery.png" },
    { id: "bake-dark", name: "Chocolate", backgroundColor: "#1c1210", primaryColor: "#fef3e2", secondaryColor: "#d4a574", accentColor: "#92400e", stampEmoji: "🧁", stampIcon: "cake", mockBusiness: "Cacao House", mockReward: "Free brownie", mockStamps: 8, bannerImage: "/images/brands/biz-bakery.png", logoImage: "/images/brands/biz-bakery.png" },
  ],
  barber: [
    { id: "barb-classic", name: "Classic", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampEmoji: "✂️", stampIcon: "scissors", mockBusiness: "The Barber Club", mockReward: "Free haircut", mockStamps: 8, bannerImage: "/images/brands/biz-barber.png", logoImage: "/images/brands/biz-barber.png" },
    { id: "barb-dark", name: "Dark", backgroundColor: "#111111", primaryColor: "#f5f5f5", secondaryColor: "#a3a3a3", accentColor: "#ffffff", stampEmoji: "✂️", stampIcon: "scissors", mockBusiness: "Sharp Cuts", mockReward: "Free fade", mockStamps: 10, bannerImage: "/images/brands/biz-barber.png", logoImage: "/images/brands/biz-barber.png" },
    { id: "barb-gold", name: "Gold", backgroundColor: "#1a1006", primaryColor: "#fffbeb", secondaryColor: "#fcd34d", accentColor: "#f59e0b", stampEmoji: "✂️", stampIcon: "scissors", mockBusiness: "Kings Grooming", mockReward: "Free shave", mockStamps: 8, bannerImage: "/images/brands/biz-barber.png", logoImage: "/images/brands/biz-barber.png" },
    { id: "barb-blue", name: "Navy", backgroundColor: "#0a1628", primaryColor: "#e0f2fe", secondaryColor: "#7dd3fc", accentColor: "#0284c7", stampEmoji: "✂️", stampIcon: "scissors", mockBusiness: "Blade & Co", mockReward: "Free trim", mockStamps: 10, bannerImage: "/images/brands/biz-barber.png", logoImage: "/images/brands/biz-barber.png" },
  ],
  salon: [
    { id: "salon-rose", name: "Rose", backgroundColor: "#f5a0a0", primaryColor: "#ffffff", secondaryColor: "#fff0f0", accentColor: "#e86b6b", stampEmoji: "💅", stampIcon: "sparkles", mockBusiness: "Studio Glow", mockReward: "Free brow wax", mockStamps: 10, bannerImage: "/images/brands/biz-salon.png", logoImage: "/images/brands/biz-salon.png" },
    { id: "salon-lavender", name: "Lavender", backgroundColor: "#ede9fe", primaryColor: "#3b0764", secondaryColor: "#a78bfa", accentColor: "#7c3aed", stampEmoji: "💅", stampIcon: "sparkles", mockBusiness: "Luxe Beauty", mockReward: "Free facial", mockStamps: 8, bannerImage: "/images/brands/biz-nails.png", logoImage: "/images/brands/biz-nails.png" },
    { id: "salon-blush", name: "Blush", backgroundColor: "#fdf2f8", primaryColor: "#831843", secondaryColor: "#f9a8d4", accentColor: "#ec4899", stampEmoji: "💅", stampIcon: "sparkles", mockBusiness: "Bloom Salon", mockReward: "Free blowout", mockStamps: 10, bannerImage: "/images/brands/biz-salon.png", logoImage: "/images/brands/biz-salon.png" },
    { id: "salon-gold", name: "Luxury", backgroundColor: "#1a1a1a", primaryColor: "#fef3c7", secondaryColor: "#fbbf24", accentColor: "#d97706", stampEmoji: "💅", stampIcon: "sparkles", mockBusiness: "Aura Spa", mockReward: "Free treatment", mockStamps: 12, bannerImage: "/images/brands/biz-nails.png", logoImage: "/images/brands/biz-nails.png" },
  ],
  gym: [
    { id: "gym-energy", name: "Energy", backgroundColor: "#0a1628", primaryColor: "#f0fdf4", secondaryColor: "#86efac", accentColor: "#22c55e", stampEmoji: "💪", stampIcon: "dumbbell", mockBusiness: "FitZone", mockReward: "Free session", mockStamps: 10, bannerImage: "/images/brands/biz-gym.png", logoImage: "/images/brands/biz-gym.png" },
    { id: "gym-fire", name: "Fire", backgroundColor: "#1a0a0a", primaryColor: "#fef2f2", secondaryColor: "#fca5a5", accentColor: "#ef4444", stampEmoji: "💪", stampIcon: "dumbbell", mockBusiness: "Iron Works", mockReward: "Free class", mockStamps: 8, bannerImage: "/images/brands/biz-gym.png", logoImage: "/images/brands/biz-gym.png" },
    { id: "gym-steel", name: "Steel", backgroundColor: "#18181b", primaryColor: "#fafafa", secondaryColor: "#a1a1aa", accentColor: "#71717a", stampEmoji: "💪", stampIcon: "dumbbell", mockBusiness: "Steel Fitness", mockReward: "Free PT", mockStamps: 12, bannerImage: "/images/brands/biz-gym.png", logoImage: "/images/brands/biz-gym.png" },
    { id: "gym-blue", name: "Power", backgroundColor: "#0a1628", primaryColor: "#e0f2fe", secondaryColor: "#7dd3fc", accentColor: "#0ea5e9", stampEmoji: "💪", stampIcon: "dumbbell", mockBusiness: "Blue Gym", mockReward: "Free smoothie", mockStamps: 10, bannerImage: "/images/brands/biz-yoga.png", logoImage: "/images/brands/biz-yoga.png" },
  ],
  retail: [
    { id: "retail-luxury", name: "Luxury", backgroundColor: "#1a1a1a", primaryColor: "#f5f0e8", secondaryColor: "#e0c097", accentColor: "#e0c097", stampEmoji: "🛍️", stampIcon: "shopping-bag", mockBusiness: "Maison", mockReward: "$20 store credit", mockStamps: 10, bannerImage: "/images/brands/biz-books.png", logoImage: "/images/brands/biz-books.png" },
    { id: "retail-modern", name: "Modern", backgroundColor: "#ffffff", primaryColor: "#0a0a0a", secondaryColor: "#737373", accentColor: "#0b051d", stampEmoji: "🛍️", stampIcon: "shopping-bag", mockBusiness: "The Edit", mockReward: "10% off", mockStamps: 8, bannerImage: "/images/brands/biz-flowers.png", logoImage: "/images/brands/biz-flowers.png" },
    { id: "retail-warm", name: "Boutique", backgroundColor: "#fef7ee", primaryColor: "#431407", secondaryColor: "#c2410c", accentColor: "#ea580c", stampEmoji: "🛍️", stampIcon: "shopping-bag", mockBusiness: "Willow & Co", mockReward: "Free gift", mockStamps: 10, bannerImage: "/images/brands/biz-flowers.png", logoImage: "/images/brands/biz-flowers.png" },
    { id: "retail-cool", name: "Minimal", backgroundColor: "#f8fafc", primaryColor: "#0f172a", secondaryColor: "#64748b", accentColor: "#334155", stampEmoji: "🛍️", stampIcon: "shopping-bag", mockBusiness: "Form Studio", mockReward: "$15 voucher", mockStamps: 12, bannerImage: "/images/brands/biz-books.png", logoImage: "/images/brands/biz-books.png" },
  ],
  other: [
    { id: "other-kyro", name: "Kyro", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", stampEmoji: "⭐", stampIcon: "star", mockBusiness: "Your Business", mockReward: "Free reward", mockStamps: 10, bannerImage: "/images/brands/biz-icecream.png", logoImage: "/images/brands/biz-icecream.png" },
    { id: "other-clean", name: "Clean", backgroundColor: "#ffffff", primaryColor: "#0a0a0a", secondaryColor: "#737373", accentColor: "#0b051d", stampEmoji: "⭐", stampIcon: "star", mockBusiness: "Your Business", mockReward: "Free item", mockStamps: 10, bannerImage: "/images/brands/biz-juice.png", logoImage: "/images/brands/biz-juice.png" },
    { id: "other-dark", name: "Dark", backgroundColor: "#111111", primaryColor: "#fafafa", secondaryColor: "#a3a3a3", accentColor: "#ffffff", stampEmoji: "⭐", stampIcon: "star", mockBusiness: "Your Business", mockReward: "Free reward", mockStamps: 8, bannerImage: "/images/brands/biz-wine.png", logoImage: "/images/brands/biz-wine.png" },
    { id: "other-warm", name: "Warm", backgroundColor: "#fef7ee", primaryColor: "#431407", secondaryColor: "#c2410c", accentColor: "#ea580c", stampEmoji: "⭐", stampIcon: "star", mockBusiness: "Your Business", mockReward: "Free item", mockStamps: 10, bannerImage: "/images/brands/biz-pets.png", logoImage: "/images/brands/biz-pets.png" },
  ],
};

export function getThemesForType(type: string): OnboardingTheme[] {
  return themes[type] || themes.other;
}
