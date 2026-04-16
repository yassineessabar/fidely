import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — Reset Your Password",
  description: "Reset your Kyro account password. Enter your email and we'll send you a reset link.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
