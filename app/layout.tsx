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
  title: "Fidely — Bring your customers back automatically",
  description:
    "Turn every visit into a returning customer. Digital loyalty cards for Apple Wallet & Google Wallet. No app. No friction. Just more revenue.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${klarnaText.variable} ${klarnaTitle.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
