export interface BlogPost {
  slug: string;
  title: string;
  desc: string;
  date: string;
  dateISO: string;
  category: string;
  color: string;
  readTime: string;
}

export const posts: BlogPost[] = [
  {
    slug: "why-paper-loyalty-cards-are-costing-you-customers",
    title: "Why Paper Loyalty Cards Are Costing You Customers",
    desc: "Most paper cards get lost within a week. Here's why digital is the future of customer retention.",
    date: "Mar 28, 2025",
    dateISO: "2025-03-28",
    category: "Retention",
    color: "rgb(230,255,169)",
    readTime: "5 min read",
  },
  {
    slug: "how-cafe-bloom-increased-revenue-30-percent",
    title: "How Café Bloom Increased Revenue by 30% in 3 Weeks",
    desc: "A case study on how a small Parisian café used Fidely to transform their customer retention.",
    date: "Mar 15, 2025",
    dateISO: "2025-03-15",
    category: "Case Study",
    color: "rgb(170,137,242)",
    readTime: "7 min read",
  },
  {
    slug: "push-notification-advantage-free-marketing",
    title: "The Push Notification Advantage: Free Marketing Forever",
    desc: "SMS costs money. Ads cost money. Push notifications to Apple Wallet? Free. Here's how to use them.",
    date: "Mar 8, 2025",
    dateISO: "2025-03-08",
    category: "Marketing",
    color: "rgb(228,227,223)",
    readTime: "6 min read",
  },
  {
    slug: "5-retention-strategies-every-local-business-should-know",
    title: "5 Retention Strategies Every Local Business Should Know",
    desc: "Simple, proven techniques to get customers to come back — no marketing degree required.",
    date: "Feb 22, 2025",
    dateISO: "2025-02-22",
    category: "Strategy",
    color: "rgb(249,248,245)",
    readTime: "8 min read",
  },
  {
    slug: "apple-wallet-vs-apps-why-less-is-more",
    title: "Apple Wallet vs. Apps: Why Less Is More",
    desc: "Your customers don't want another app. They want something that just works.",
    date: "Feb 14, 2025",
    dateISO: "2025-02-14",
    category: "Product",
    color: "rgb(230,255,169)",
    readTime: "5 min read",
  },
  {
    slug: "how-to-collect-customer-data-without-being-creepy",
    title: "How to Collect Customer Data Without Being Creepy",
    desc: "The ethical way to build a customer database that actually drives revenue.",
    date: "Feb 5, 2025",
    dateISO: "2025-02-05",
    category: "Data",
    color: "rgb(170,137,242)",
    readTime: "6 min read",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
