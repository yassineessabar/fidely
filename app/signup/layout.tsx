import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Start Your Free Trial",
  description: "Create your Kyro account and launch your digital loyalty program in minutes. Free trial, no credit card required.",
  alternates: { canonical: "/signup" },
  openGraph: {
    title: "Sign Up for Kyro — Start Your Free Trial",
    description: "Create your Kyro account and launch your digital loyalty program in minutes.",
    url: "/signup",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
          { "@type": "ListItem", position: 2, name: "Sign Up", item: "https://wearekyro.com/signup" },
        ],
      }) }} />
      {children}
    </>
  );
}
