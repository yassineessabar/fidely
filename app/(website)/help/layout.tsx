import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — Guides & Support",
  description: "Find answers to common questions about Kyro. Setup guides, troubleshooting, account management, and customer support.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Kyro Help Center — Guides & Support",
    description: "Find answers to common questions about Kyro. Setup guides, troubleshooting, and support.",
    url: "/help",
  },
};

const helpFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I set up my first loyalty card?",
      acceptedAnswer: { "@type": "Answer", text: "Sign up for Kyro, choose your card type (punch, reward, cashback, or discount), customize the design, and share the QR code with your customers. Setup takes less than 24 hours." },
    },
    {
      "@type": "Question",
      name: "How do customers add the card to their wallet?",
      acceptedAnswer: { "@type": "Answer", text: "Customers scan your QR code or tap a link. The card is added to Apple Wallet or Google Wallet in 2 taps. No app download required." },
    },
    {
      "@type": "Question",
      name: "How do I send push notifications?",
      acceptedAnswer: { "@type": "Answer", text: "From your Kyro dashboard, go to Campaigns, write your message, select your audience, and send. Notifications are delivered instantly to customers' lock screens at no cost." },
    },
    {
      "@type": "Question",
      name: "Can I customize the card design?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You can customize colors, logo, banner image, text fields, and barcode type. Your card matches your brand identity." },
    },
    {
      "@type": "Question",
      name: "How do I track customer visits and analytics?",
      acceptedAnswer: { "@type": "Answer", text: "Your Kyro dashboard shows real-time analytics: total customers, visit frequency, redemption rates, and revenue impact. All data is collected automatically when customers use their card." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
    { "@type": "ListItem", position: 2, name: "Help Center", item: "https://wearekyro.com/help" },
  ],
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(helpFaqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
