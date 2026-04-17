"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        backgroundColor: "rgba(16,185,129,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "rgba(10,10,10,0.9)", margin: "0 0 8px" }}>
        Subscription activated
      </h1>
      <p style={{ fontSize: 14, color: "rgba(10,10,10,0.5)", lineHeight: "20px", marginBottom: 32 }}>
        Your plan has been upgraded. All features are now available.
      </p>
      <p style={{ fontSize: 13, color: "rgba(10,10,10,0.35)" }}>
        Redirecting to dashboard in {countdown}s...
      </p>
    </div>
  );
}
