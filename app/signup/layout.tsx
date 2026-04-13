import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Start Your Free Trial",
  description: "Create your Fidely account and launch your digital loyalty program in minutes. Free trial, no credit card required.",
  alternates: { canonical: "/signup" },
  openGraph: {
    title: "Sign Up for Fidely — Start Your Free Trial",
    description: "Create your Fidely account and launch your digital loyalty program in minutes.",
    url: "/signup",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
