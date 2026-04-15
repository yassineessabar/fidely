import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const klarnaText = localFont({
  src: [
    {
      path: "../font/KlarnaText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/KlarnaText-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../font/KlarnaText-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../font/KlarnaText-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/KlarnaText-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const klarnaTitle = localFont({
  src: [
    {
      path: "../font/KlarnaTitle-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://kyro.com"),
  title: {
    default: "Kyro — Digital Loyalty Cards for Apple & Google Wallet",
    template: "%s | Kyro",
  },
  description:
    "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download needed. Launch in 24 hours.",
  keywords: [
    "digital loyalty card",
    "apple wallet loyalty",
    "google wallet loyalty",
    "customer retention",
    "loyalty program",
    "digital punch card",
    "reward card",
    "cashback card",
    "stamp card",
    "customer loyalty app",
    "kyro",
  ],
  authors: [{ name: "Kyro" }],
  creator: "Kyro",
  publisher: "Kyro",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kyro",
    title: "Kyro — Digital Loyalty Cards for Apple & Google Wallet",
    description:
      "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download needed. Launch in 24 hours.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyro — Digital Loyalty Cards for Apple & Google Wallet",
    description:
      "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download needed.",
    creator: "@kyro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${klarnaText.variable} ${klarnaTitle.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://kyro.com/#organization",
                  name: "Kyro",
                  url: "https://kyro.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://kyro.com/favicon.svg",
                  },
                  description:
                    "Digital loyalty cards for Apple Wallet & Google Wallet. Help local businesses bring customers back automatically.",
                  foundingDate: "2024",
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://kyro.com/#website",
                  url: "https://kyro.com",
                  name: "Kyro",
                  publisher: {
                    "@id": "https://kyro.com/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://kyro.com/help?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": "https://kyro.com/#navigation",
                  name: ["Home", "Business", "Pricing", "Customers", "About", "Blog", "Help", "Contact"],
                  url: [
                    "https://kyro.com",
                    "https://kyro.com/business",
                    "https://kyro.com/pricing",
                    "https://kyro.com/customers",
                    "https://kyro.com/about",
                    "https://kyro.com/blog",
                    "https://kyro.com/help",
                    "https://kyro.com/contact",
                  ],
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
