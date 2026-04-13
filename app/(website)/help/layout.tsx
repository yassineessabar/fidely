import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — Guides & Support",
  description: "Find answers to common questions about Fidely. Setup guides, troubleshooting, account management, and customer support.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Fidely Help Center — Guides & Support",
    description: "Find answers to common questions about Fidely. Setup guides, troubleshooting, and support.",
    url: "/help",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
