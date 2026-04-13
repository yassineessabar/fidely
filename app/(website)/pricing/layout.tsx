import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Simple, Transparent Plans",
  description: "Start free, grow as you scale. Fidely pricing starts at $29/month for one location. No hidden fees, no cost per message. Cancel anytime.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Fidely Pricing — Simple, Transparent Plans",
    description: "Start free, grow as you scale. Fidely pricing starts at $29/month. No hidden fees.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
