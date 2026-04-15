import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Access Your Dashboard",
  description: "Sign in to your Kyro dashboard. Manage loyalty cards, track customers, send push notifications, and grow your revenue.",
  alternates: { canonical: "/signin" },
  openGraph: {
    title: "Sign In to Kyro",
    description: "Access your Kyro dashboard to manage loyalty cards and track customers.",
    url: "/signin",
  },
};

export default function SigninLayout({ children }: { children: React.ReactNode }) {
  return children;
}
