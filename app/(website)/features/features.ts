export interface Feature {
  slug: string;
  name: string;
  emoji: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subtitle: string;
  benefits: { title: string; desc: string }[];
  howItWorks: { step: string; desc: string }[];
  stats: { value: string; label: string }[];
}

export const features: Feature[] = [
  {
    slug: "digital-punch-cards",
    name: "Digital Punch Cards",
    emoji: "☕",
    metaTitle: "Digital Punch Cards — Replace Paper, Keep Customers",
    metaDescription: "Digital punch cards for Apple & Google Wallet. Customers collect stamps on their phone. 3.8x higher completion rate than paper. No app download needed.",
    headline: "Paper punch cards, upgraded",
    subtitle: "Same 'buy 9, get 1 free' your customers love — but digital, trackable, and impossible to lose.",
    benefits: [
      { title: "Always in their pocket", desc: "Lives in Apple Wallet or Google Wallet. No separate app, no paper to lose. Their phone IS the card." },
      { title: "Real-time progress", desc: "Customers see exactly how many stamps they have. Progress bars drive completion — 3.8x better than paper." },
      { title: "Free reminders", desc: "Send 'You're 2 stamps away!' notifications directly to their lock screen. Free, instant, impossible to miss." },
      { title: "Automatic data collection", desc: "Every scan captures customer info. Build a database without clipboards or forms." },
    ],
    howItWorks: [
      { step: "Design your card", desc: "Choose stamps needed, reward, and customize colors to match your brand." },
      { step: "Share the QR code", desc: "Print it, display it at the counter, add it to receipts. Customers scan and add in 2 taps." },
      { step: "Scan on each visit", desc: "Staff scans the customer's card or customers scan your QR. One tap adds a stamp." },
      { step: "Reward automatically", desc: "When the card is full, the reward unlocks. Card resets. Cycle continues." },
    ],
    stats: [
      { value: "3.8x", label: "higher completion vs paper" },
      { value: "80%", label: "adoption rate" },
      { value: "2 taps", label: "to add to wallet" },
    ],
  },
  {
    slug: "push-notifications",
    name: "Push Notifications",
    emoji: "🔔",
    metaTitle: "Free Push Notifications — Reach Customers on Their Lock Screen",
    metaDescription: "Send unlimited push notifications to Apple & Google Wallet for free. 95% delivery rate. No app required. Drive repeat visits with lock screen messages.",
    headline: "Free marketing, forever",
    subtitle: "Unlimited push notifications to your customers' lock screens. No SMS fees, no ad spend, no app required.",
    benefits: [
      { title: "€0 per message", desc: "Unlike SMS (€0.05-0.08 each) or ads (€100+ per campaign), wallet notifications are completely free. Send daily if you want." },
      { title: "95% delivery rate", desc: "Lands directly on the lock screen — the same place texts and calls appear. Almost impossible to miss." },
      { title: "Permission-based", desc: "Customers opted in by adding your card. They expect and welcome your updates. Not spam — helpful reminders." },
      { title: "Instant action", desc: "A 'Double points today!' message at 11am drives lunch traffic that same day. Real-time response, not next-week brand awareness." },
    ],
    howItWorks: [
      { step: "Write your message", desc: "Short, valuable, action-oriented. 'You're 2 stamps away!' or 'Fresh pastries just out!'" },
      { step: "Choose your audience", desc: "All customers, or segment by visit frequency, last visit date, or loyalty tier." },
      { step: "Send instantly", desc: "One click from your dashboard. Delivered to lock screens in seconds." },
      { step: "Track results", desc: "See open rates, visit impact, and which messages drive the most foot traffic." },
    ],
    stats: [
      { value: "€0", label: "per notification" },
      { value: "95%", label: "delivery rate" },
      { value: "67%", label: "average open rate" },
    ],
  },
  {
    slug: "reward-points",
    name: "Reward Points Program",
    emoji: "⭐",
    metaTitle: "Reward Points Program — Earn Points, Unlock Rewards",
    metaDescription: "Digital points-based loyalty program. Customers earn points per purchase, redeem for rewards. Real-time balance in Apple & Google Wallet. No app needed.",
    headline: "Points that customers actually use",
    subtitle: "Every purchase earns points. Points unlock rewards. The balance is always visible in their wallet.",
    benefits: [
      { title: "Visible balance", desc: "Points balance shows on the card in their wallet. No app to open, no password to remember. Glance and know." },
      { title: "Flexible rewards", desc: "Set your own reward tiers: 100 points = free drink, 500 points = 20% off. Match rewards to what your customers want." },
      { title: "Drives higher spend", desc: "Customers who are close to a reward spend 40% more to reach it. The endowed progress effect is real — and profitable." },
      { title: "Tiered status", desc: "Bronze → Silver → Gold. Higher tiers earn faster. Status creates emotional loyalty that discounts alone can't match." },
    ],
    howItWorks: [
      { step: "Set your earn rate", desc: "1 point per €1, 10 points per visit, or any formula. You decide what drives the behavior you want." },
      { step: "Define rewards", desc: "Create a reward catalog: free items, discounts, exclusive access. Multiple tiers work best." },
      { step: "Customers earn automatically", desc: "Each purchase or visit adds points. Balance updates in real-time on their wallet card." },
      { step: "Redemption is instant", desc: "Customer hits the threshold, shows their card, gets the reward. Simple." },
    ],
    stats: [
      { value: "+40%", label: "spend near reward threshold" },
      { value: "2.5x", label: "visit frequency vs non-members" },
      { value: "Real-time", label: "balance updates" },
    ],
  },
  {
    slug: "cashback-program",
    name: "Cashback Program",
    emoji: "💰",
    metaTitle: "Customer Cashback Program — Earn Money Back on Every Visit",
    metaDescription: "Digital cashback loyalty cards. Customers earn 3-10% back on every purchase. Redeemable via Apple & Google Wallet. Increase customer lifetime value.",
    headline: "Give money back, get more back",
    subtitle: "Customers earn cashback on every purchase. They spend more because they're getting rewarded for it.",
    benefits: [
      { title: "Universal appeal", desc: "Everyone understands cashback. No confusing points math, no obscure reward tiers. Spend money, get money back." },
      { title: "Increases basket size", desc: "Knowing they get 5% back, customers add that extra item. Average basket size increases 12-15% with cashback." },
      { title: "Tiered progression", desc: "Starter (3%) → Regular (5%) → VIP (10%). Higher tiers reward loyalty and create aspirational goals." },
      { title: "Flexible redemption", desc: "Customers redeem cashback on their next visit. Creates a built-in reason to come back." },
    ],
    howItWorks: [
      { step: "Set cashback rates", desc: "Choose your percentage per tier. Most businesses start at 3-5% for the base tier." },
      { step: "Customer purchases", desc: "Cashback is calculated and credited instantly. They see the balance on their wallet card." },
      { step: "Balance accumulates", desc: "Every purchase adds to their cashback balance. Visible in real-time on their wallet card." },
      { step: "Redeem on next visit", desc: "When ready, customer applies their cashback to a purchase. Simple, satisfying, repeatable." },
    ],
    stats: [
      { value: "+15%", label: "average basket size" },
      { value: "3-10%", label: "customizable cashback rate" },
      { value: "+30%", label: "customer lifetime value" },
    ],
  },
  {
    slug: "customer-analytics",
    name: "Customer Analytics",
    emoji: "📊",
    metaTitle: "Customer Analytics Dashboard — Know Your Customers",
    metaDescription: "Real-time customer analytics for local businesses. Track visit frequency, spending patterns, loyalty engagement, and churn risk. Data-driven retention.",
    headline: "Know your customers like never before",
    subtitle: "Real-time analytics on every customer: who they are, when they visit, what they spend, and when they're about to leave.",
    benefits: [
      { title: "Visit frequency tracking", desc: "See who visits daily, weekly, or monthly. Identify your VIPs and your at-risk customers." },
      { title: "Revenue attribution", desc: "Know exactly how much revenue your loyalty program drives. Track ROI in real-time." },
      { title: "Churn prediction", desc: "When a regular stops visiting, you'll know within days — not months. Act before they leave for good." },
      { title: "Campaign performance", desc: "See which notifications and promotions drive the most visits. Double down on what works." },
    ],
    howItWorks: [
      { step: "Data collects automatically", desc: "Every card scan, purchase, and notification interaction is tracked. No manual input needed." },
      { step: "Dashboard visualizes trends", desc: "Real-time charts show visit trends, spending patterns, and program performance." },
      { step: "Segments update live", desc: "Customers are automatically grouped: new, active, at-risk, lapsed. Segments update daily." },
      { step: "Act on insights", desc: "Send targeted notifications to specific segments. Re-engage lapsed customers. Reward your best ones." },
    ],
    stats: [
      { value: "Real-time", label: "data updates" },
      { value: "100%", label: "automatic collection" },
      { value: "5 min", label: "to actionable insights" },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
