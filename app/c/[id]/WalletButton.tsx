"use client";

import { useState, useEffect } from "react";

type Platform = "apple" | "google" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  // iOS: iPhone, iPad, iPod
  if (/iphone|ipad|ipod/.test(ua)) return "apple";
  // macOS Safari (also supports Apple Wallet via Handoff)
  if (/macintosh/.test(ua) && /safari/.test(ua) && !/chrome/.test(ua)) return "apple";
  // Android
  if (/android/.test(ua)) return "google";
  // Desktop Chrome/Firefox/Edge — default to Google
  return "google";
}

export default function WalletButton({
  cardId,
  backgroundColor,
  primaryColor,
}: {
  cardId: string;
  backgroundColor: string;
  primaryColor: string;
}) {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handleGoogleWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/google/card/${cardId}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Google Wallet is not configured yet.");
      }
    } catch {
      alert("Failed to generate Google Wallet pass.");
    } finally {
      setLoading(false);
    }
  };

  if (platform === "unknown") return null;

  if (platform === "apple") {
    return (
      <a
        href={`/api/wallet/apple/card/${cardId}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          backgroundColor: "#000",
          color: "#fff",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        <svg width="20" height="24" viewBox="0 0 814 1000" fill="white">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.7C46 792.2 0 605.2 0 427c0-171.1 111.1-261.7 220.4-261.7 58 0 106.3 38.2 142.6 38.2 34.5 0 88.1-40.5 155.5-40.5 25.3 0 114.8 1.3 173.6 98z" />
          <path d="M554.1 0c3.2 28.2-8.3 56.4-24.8 78.1-18.3 24.5-50.3 43.7-81 41.7-3.8-27.4 9.6-56.4 25.5-75.8C492.1 19.5 526.3 2 554.1 0z" />
        </svg>
        Add to Apple Wallet
      </a>
    );
  }

  return (
    <button
      onClick={handleGoogleWallet}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        border: `1px solid ${primaryColor}20`,
        color: backgroundColor,
        fontSize: "16px",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: loading ? 0.7 : 1,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      {loading ? "Loading..." : "Add to Google Wallet"}
    </button>
  );
}
