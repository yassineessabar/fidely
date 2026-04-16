import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Set a New Password",
  description: "Set a new password for your Kyro account.",
  alternates: { canonical: "/reset-password" },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
