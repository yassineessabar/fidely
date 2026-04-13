export interface Industry {
  slug: string;
  name: string;
  emoji: string;
  headline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  painPoints: string[];
  benefits: string[];
  stats: { value: string; label: string }[];
  testimonial: { quote: string; author: string; business: string };
  cta: string;
}

export const industries: Industry[] = [
  {
    slug: "cafes",
    name: "Cafés & Coffee Shops",
    emoji: "☕",
    headline: "Bring your coffee lovers back every morning",
    description: "Digital loyalty cards designed for cafés. Replace paper punch cards with Apple & Google Wallet passes that customers actually keep.",
    metaTitle: "Café Loyalty Program — Digital Punch Cards for Coffee Shops",
    metaDescription: "Digital loyalty cards for cafés and coffee shops. Replace paper punch cards with Apple & Google Wallet. Increase repeat visits by 30%. No app needed.",
    heroSubtitle: "The average café loses 80% of first-time visitors. Fidely brings them back with digital punch cards that live in their phone.",
    painPoints: [
      "Paper punch cards get lost — 80% never get completed",
      "No way to contact customers who haven't visited in weeks",
      "You don't know who your regulars are or what they order",
      "Instagram and ads bring new faces, but they don't come back",
    ],
    benefits: [
      "Digital punch cards in Apple & Google Wallet — impossible to lose",
      "Free push notifications: 'You're 2 stamps from a free coffee!'",
      "Automatic customer database from day one",
      "See visit frequency, peak hours, and redemption rates",
      "Launch in 24 hours — no app download needed for customers",
    ],
    stats: [
      { value: "+35%", label: "repeat visits" },
      { value: "3.8x", label: "card completion rate vs paper" },
      { value: "€0", label: "per notification sent" },
    ],
    testimonial: { quote: "We switched from paper and saw 3x more completed cards in the first month. The notifications alone brought back customers we hadn't seen in weeks.", author: "Marie D.", business: "Café Bloom, Paris" },
    cta: "Get your café loyalty card",
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    emoji: "🍽️",
    headline: "Turn first-time diners into weekly regulars",
    description: "Digital loyalty and rewards programs for restaurants. Increase repeat visits and build a customer database without an app.",
    metaTitle: "Restaurant Loyalty Program — Digital Rewards That Actually Work",
    metaDescription: "Digital loyalty program for restaurants. Reward repeat diners, send free push notifications, and increase revenue by 20-30%. No app download required.",
    heroSubtitle: "60% of restaurant customers never return after their first visit. Not because the food was bad — because nothing reminded them to come back.",
    painPoints: [
      "Expensive ads bring people in once, but they don't return",
      "No customer database — you can't reach past diners",
      "Paper comment cards and loyalty stamps feel outdated",
      "Third-party delivery apps own your customer relationship",
    ],
    benefits: [
      "Reward cards and cashback programs in Apple & Google Wallet",
      "Build a first-party customer database (name, email, phone)",
      "Send 'We miss you' notifications to lapsed customers — free",
      "Track which promotions drive the most return visits",
      "Works alongside existing POS — no hardware needed",
    ],
    stats: [
      { value: "+28%", label: "repeat visits" },
      { value: "67%", label: "notification open rate" },
      { value: "24h", label: "setup time" },
    ],
    testimonial: { quote: "We stopped spending on delivery app promotions and invested in our own loyalty program. Revenue from repeat customers is up 28% in two months.", author: "Thomas R.", business: "Le Petit Bistrot, Lyon" },
    cta: "Launch your restaurant loyalty program",
  },
  {
    slug: "hair-salons",
    name: "Hair Salons & Barbers",
    emoji: "💇",
    headline: "Keep your chairs full and your clients loyal",
    description: "Digital loyalty cards for hair salons and barbershops. Automated appointment reminders and reward programs in Apple & Google Wallet.",
    metaTitle: "Hair Salon Loyalty Program — Keep Clients Coming Back",
    metaDescription: "Digital loyalty cards for hair salons and barbers. Automated reminders, reward programs, and free push notifications. Reduce no-shows, increase rebookings.",
    heroSubtitle: "The average salon client visits every 6-8 weeks. With the right nudge, you can bring that down to 4-5 weeks — that's 2-3 extra visits per year.",
    painPoints: [
      "Clients forget to rebook — they go wherever is convenient",
      "No-shows cost you €50-100 per empty chair hour",
      "You rely on Instagram DMs to stay in touch",
      "Competitors are one Google search away",
    ],
    benefits: [
      "Loyalty cards with visit tracking in their phone wallet",
      "Push notification reminders: 'Time for a trim? Book today'",
      "VIP tiers for your most loyal clients (priority booking, discounts)",
      "Collect client preferences and visit history automatically",
      "No app — clients add the card in 2 taps",
    ],
    stats: [
      { value: "+40%", label: "rebooking rate" },
      { value: "-60%", label: "no-shows" },
      { value: "2-3", label: "extra visits/year per client" },
    ],
    testimonial: { quote: "Our rebooking rate went from 45% to 78% in six weeks. The automatic reminders do all the work — we just focus on cutting hair.", author: "Antoine L.", business: "Barber Social Club, Marseille" },
    cta: "Start your salon loyalty program",
  },
  {
    slug: "retail-stores",
    name: "Retail Stores",
    emoji: "🛍️",
    headline: "Turn shoppers into repeat buyers",
    description: "Digital loyalty and cashback programs for retail stores. Increase customer lifetime value with wallet-based rewards.",
    metaTitle: "Retail Loyalty Program — Digital Cashback & Rewards Cards",
    metaDescription: "Digital loyalty program for retail stores. Cashback cards, points programs, and VIP tiers in Apple & Google Wallet. Increase repeat purchases by 25%.",
    heroSubtitle: "Retail loyalty members spend 12-18% more per transaction than non-members. A digital wallet card makes every customer a member.",
    painPoints: [
      "One-time shoppers who never return despite loving your products",
      "No way to announce new arrivals to past customers",
      "Competing with e-commerce giants on convenience",
      "Expensive loyalty apps that nobody downloads",
    ],
    benefits: [
      "Cashback and points programs that live in the customer's wallet",
      "Announce new arrivals and sales via free push notifications",
      "Tiered rewards (Bronze → Silver → Gold) that increase spend",
      "Track purchase frequency and average basket size",
      "Works for single stores and multi-location chains",
    ],
    stats: [
      { value: "+25%", label: "repeat purchases" },
      { value: "+15%", label: "average basket size" },
      { value: "70%", label: "card adoption rate" },
    ],
    testimonial: { quote: "Our cashback card has 70% adoption among in-store customers. We're building a direct relationship with shoppers that Amazon can't replicate.", author: "Claire M.", business: "Maison Nomade, Bordeaux" },
    cta: "Launch your retail loyalty program",
  },
  {
    slug: "gyms",
    name: "Gyms & Fitness Studios",
    emoji: "💪",
    headline: "Reduce member churn and fill every class",
    description: "Digital loyalty and engagement programs for gyms and fitness studios. Keep members motivated and reduce cancellations.",
    metaTitle: "Gym Loyalty Program — Reduce Churn & Boost Engagement",
    metaDescription: "Digital loyalty program for gyms and fitness studios. Reward attendance, reduce churn, and fill classes with free push notifications. No app needed.",
    heroSubtitle: "67% of gym memberships go unused after 3 months. A loyalty program that rewards showing up keeps members engaged and paying.",
    painPoints: [
      "Members sign up in January and disappear by March",
      "Empty classes despite hundreds of active memberships",
      "No engagement tool between visits",
      "High churn rate eating into monthly recurring revenue",
    ],
    benefits: [
      "Reward cards that track attendance — earn points per class",
      "Push notifications: 'Your favorite yoga class starts in 2 hours'",
      "Milestone rewards: '10th class this month — free smoothie!'",
      "Member tiers that unlock perks and keep people engaged",
      "Reduce churn by staying in members' phones and minds",
    ],
    stats: [
      { value: "-30%", label: "member churn" },
      { value: "+45%", label: "class attendance" },
      { value: "82%", label: "member engagement rate" },
    ],
    testimonial: { quote: "We went from 40% class fill rate to 72% just by sending 'spots filling up' notifications. Members love the points system — it gamifies showing up.", author: "Sarah K.", business: "Studio Pulse, Nice" },
    cta: "Start your gym loyalty program",
  },
  {
    slug: "bakeries",
    name: "Bakeries & Patisseries",
    emoji: "🥐",
    headline: "Reward your daily bread buyers",
    description: "Digital punch cards and loyalty programs for bakeries. Increase daily visits and build a customer database with wallet passes.",
    metaTitle: "Bakery Loyalty Program — Digital Punch Cards That Work",
    metaDescription: "Digital loyalty cards for bakeries and patisseries. Replace paper punch cards, send free notifications, and increase daily visits. Setup in 24 hours.",
    heroSubtitle: "Bakery customers are creatures of habit — but they need a reason to choose you over the bakery closer to their office. A loyalty card is that reason.",
    painPoints: [
      "Customers split visits between multiple bakeries",
      "Paper punch cards disappear after one use",
      "No way to reach customers on slow days",
      "You don't know your customers' names or preferences",
    ],
    benefits: [
      "Digital punch cards: 'Buy 9 croissants, get the 10th free'",
      "Push notifications on slow afternoons: 'Fresh batch just out!'",
      "Automatic customer database — know your regulars by name",
      "Birthday rewards that feel personal and drive visits",
      "Customers add the card in seconds — no app needed",
    ],
    stats: [
      { value: "+33%", label: "daily visits" },
      { value: "4.2x", label: "punch card completion rate" },
      { value: "95%", label: "customer satisfaction" },
    ],
    testimonial: { quote: "Our regulars used to come 3 times a week. Now it's 5. The punch card gives them a reason to choose us every single morning.", author: "Pierre B.", business: "Boulangerie Saint-Michel, Paris" },
    cta: "Get your bakery loyalty card",
  },
  {
    slug: "spas",
    name: "Spas & Wellness Centers",
    emoji: "🧖",
    headline: "Build lasting relationships with your clients",
    description: "Digital loyalty programs for spas and wellness centers. Increase rebookings, reduce no-shows, and reward your most loyal clients.",
    metaTitle: "Spa Loyalty Program — Increase Rebookings & Client Retention",
    metaDescription: "Digital loyalty program for spas and wellness centers. VIP tiers, visit rewards, and automated rebooking reminders. Increase client retention by 35%.",
    heroSubtitle: "Spa clients who receive personalized follow-ups are 3x more likely to rebook within 30 days. A digital loyalty card automates that follow-up.",
    painPoints: [
      "Clients love the experience but forget to rebook",
      "No-shows and late cancellations waste therapist time",
      "Email newsletters have low open rates",
      "Hard to differentiate from competitors nearby",
    ],
    benefits: [
      "VIP membership cards in Apple & Google Wallet",
      "Automated reminders: 'Your next treatment is due — book now'",
      "Points per visit redeemable for upgrades or free treatments",
      "Birthday and anniversary perks that surprise and delight",
      "Exclusive offers for your most loyal clients",
    ],
    stats: [
      { value: "+35%", label: "client retention" },
      { value: "+50%", label: "rebooking rate" },
      { value: "3x", label: "more referrals" },
    ],
    testimonial: { quote: "Our VIP card program has transformed client retention. Rebookings are up 50% and our clients love the personalized rewards.", author: "Isabelle F.", business: "Spa Sérénité, Toulouse" },
    cta: "Launch your spa loyalty program",
  },
  {
    slug: "food-trucks",
    name: "Food Trucks",
    emoji: "🚚",
    headline: "Build a following that finds you everywhere",
    description: "Digital loyalty cards for food trucks. Build a customer database and notify fans wherever you park next.",
    metaTitle: "Food Truck Loyalty Program — Build a Loyal Following",
    metaDescription: "Digital loyalty cards for food trucks. Notify customers of your location, reward repeat visits, and build a following. Free push notifications, no app needed.",
    heroSubtitle: "The biggest food truck challenge isn't the food — it's letting people know where you are today. A wallet card with push notifications solves that instantly.",
    painPoints: [
      "Customers can't find you when you change locations",
      "Instagram reach is declining — posts don't reach followers",
      "No customer database beyond social media followers",
      "Paper punch cards don't survive outdoor conditions",
    ],
    benefits: [
      "Push notifications: 'We're at Place de la République today!'",
      "Digital punch cards that work rain or shine",
      "Build a direct customer list (not dependent on Instagram)",
      "Location-based alerts when customers are nearby",
      "Zero cost per notification — announce every location change free",
    ],
    stats: [
      { value: "+50%", label: "daily customers at new spots" },
      { value: "89%", label: "notification open rate" },
      { value: "2x", label: "faster following growth" },
    ],
    testimonial: { quote: "We used to rely on Instagram to announce our location. Now we push-notify 800 loyal customers directly. Lines are longer everywhere we park.", author: "Karim A.", business: "Street Wok, Paris" },
    cta: "Get your food truck loyalty card",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
