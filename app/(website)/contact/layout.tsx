import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description: "Have questions about Fidely? Contact our team for demos, support, or partnership inquiries. We'd love to hear from you.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Fidely — Get in Touch",
    description: "Have questions about Fidely? Contact our team for demos, support, or partnership inquiries.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
