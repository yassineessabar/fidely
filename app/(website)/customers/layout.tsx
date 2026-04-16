import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Customers — Simple Loyalty, Big Rewards",
  description: "Add your loyalty card to Apple Wallet or Google Wallet in 2 taps. No app to download. Collect stamps, earn points, and get exclusive rewards.",
  alternates: { canonical: "/customers" },
  openGraph: {
    title: "Kyro for Customers — Simple Loyalty, Big Rewards",
    description: "Add your loyalty card to Apple or Google Wallet in 2 taps. No app to download.",
    url: "/customers",
  },
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
