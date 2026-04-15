import { Metadata } from "next";
import Hero from "../components/Hero";
import Features from "../components/Features";
import LoyaltyMechanics from "../components/LoyaltyMechanics";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Logos from "../components/Logos";
import Calculator from "../components/Calculator";
import DashboardPreview from "../components/DashboardPreview";

import Stats from "../components/Stats";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";

export const metadata: Metadata = {
  title: "Kyro — Digital Loyalty Cards for Apple & Google Wallet",
  description:
    "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download. Launch in 24 hours. +20-30% more repeat visits.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kyro — Digital Loyalty Cards for Apple & Google Wallet",
    description:
      "Turn every visit into a returning customer. Digital loyalty cards for Apple & Google Wallet. No app download. Launch in 24 hours.",
    url: "/",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do my customers need to download an app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Everything works directly in Apple Wallet or Google Wallet. 2 clicks and the card is added. No account, no friction.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your loyalty program is ready in 24 hours. We handle everything for you — you start collecting customers immediately.",
      },
    },
    {
      "@type": "Question",
      name: "How do I collect customer data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automatically. As soon as a customer adds the card, you collect their name, email, and phone number. No forms, no friction.",
      },
    },
    {
      "@type": "Question",
      name: "Are notifications really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Unlimited push notifications at $0. Compared to SMS which is paid every time. You can contact your customers anytime without spending on ads.",
      },
    },
    {
      "@type": "Question",
      name: "Will this actually bring customers back?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Most businesses see +20-30% more repeat visits and higher customer lifetime value. Because you stay in their phone and remind them to come back.",
      },
    },
    {
      "@type": "Question",
      name: "Does this work for my type of business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your customers come back (or should come back), it works. Perfect for cafés, restaurants, barbers, salons, gyms, retail stores, and more.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simple monthly subscription starting at $29/month. No hidden fees. No cost per message. Cancel anytime.",
      },
    },
  ],
};

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://kyro.com",
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <Hero />
      <Features />
      <Stats />
      <LoyaltyMechanics />
      <HowItWorks />
      <Testimonials />
      <Logos />
      <Calculator />
      <DashboardPreview />

      <CTA />
      <FAQ />
    </main>
  );
}
