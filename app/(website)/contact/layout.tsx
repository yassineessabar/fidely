import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description: "Have questions about Kyro? Contact our team for demos, support, or partnership inquiries. We'd love to hear from you.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Kyro — Get in Touch",
    description: "Have questions about Kyro? Contact our team for demos, support, or partnership inquiries.",
    url: "/contact",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kyro",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS (Apple Wallet), Android (Google Wallet)",
  description: "Digital loyalty cards for Apple Wallet & Google Wallet. Help local businesses bring customers back automatically.",
  url: "https://wearekyro.com",
  author: {
    "@type": "Organization",
    name: "Kyro",
    url: "https://wearekyro.com",
    email: "help@kyro.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@kyro.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "help@kyro.com",
      },
    ],
  },
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    description: "Starting at $29/month",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://wearekyro.com/contact" },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
