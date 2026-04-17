"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppearancePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/loyalty"); }, [router]);
  return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Redirecting...</div>;
}
