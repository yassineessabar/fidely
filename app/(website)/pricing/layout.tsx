import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Simple, Transparent Plans",
  description: "Start free, grow as you scale. Kyro pricing starts at $29/month for one location. No hidden fees, no cost per message. Cancel anytime.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Kyro Pricing — Simple, Transparent Plans",
    description: "Start free, grow as you scale. Kyro pricing starts at $29/month. No hidden fees.",
    url: "/pricing",
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Kyro Digital Loyalty Platform",
  description: "Digital loyalty cards for Apple Wallet & Google Wallet. Help local businesses bring customers back automatically.",
  brand: { "@type": "Brand", name: "Kyro" },
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "29",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      description: "Perfect for a single location. 1 location, up to 500 customers, unlimited push notifications.",
      url: "https://kyro.com/pricing",
    },
    {
      "@type": "Offer",
      name: "Growth",
      price: "79",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      description: "For growing businesses. Up to 3 locations, unlimited customers, advanced analytics.",
      url: "https://kyro.com/pricing",
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      price: "199",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      description: "For multi-location businesses. Unlimited locations, unlimited customers, dedicated support.",
      url: "https://kyro.com/pricing",
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://kyro.com" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://kyro.com/pricing" },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
