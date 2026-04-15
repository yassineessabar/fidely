import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet Pass Templates — Add Loyalty Cards to Your Wallet",
  description: "Preview and add Kyro loyalty cards directly to Apple Wallet or Google Wallet. Choose from 4 card types: discount, reward, stamp, or cashback.",
  alternates: { canonical: "/wallet" },
  openGraph: {
    title: "Kyro Wallet Pass Templates",
    description: "Preview and add Kyro loyalty cards directly to Apple Wallet or Google Wallet.",
    url: "/wallet",
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
