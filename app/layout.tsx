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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://fidely.com"),
  title: {
    default: "Fidely — Digital Loyalty Cards for Apple & Google Wallet",
    template: "%s | Fidely",
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
    "fidely",
  ],
  authors: [{ name: "Fidely" }],
  creator: "Fidely",
  publisher: "Fidely",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fidely",
    title: "Fidely — Digital Loyalty Cards for Apple & Google Wallet",
    description:
      "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download needed. Launch in 24 hours.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fidely — Digital Loyalty Cards for Apple & Google Wallet",
    description:
      "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app download needed.",
    creator: "@fidely",
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
                  "@id": "https://fidely.com/#organization",
                  name: "Fidely",
                  url: "https://fidely.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://fidely.com/favicon.svg",
                  },
                  description:
                    "Digital loyalty cards for Apple Wallet & Google Wallet. Help local businesses bring customers back automatically.",
                  foundingDate: "2024",
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://fidely.com/#website",
                  url: "https://fidely.com",
                  name: "Fidely",
                  publisher: {
                    "@id": "https://fidely.com/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://fidely.com/help?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": "https://fidely.com/#navigation",
                  name: ["Home", "Business", "Pricing", "Customers", "About", "Blog", "Help", "Contact"],
                  url: [
                    "https://fidely.com",
                    "https://fidely.com/business",
                    "https://fidely.com/pricing",
                    "https://fidely.com/customers",
                    "https://fidely.com/about",
                    "https://fidely.com/blog",
                    "https://fidely.com/help",
                    "https://fidely.com/contact",
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
