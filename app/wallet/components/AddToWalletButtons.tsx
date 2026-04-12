"use client";

import { useState } from "react";
import { PassType } from "../../../lib/wallet/types";

export default function AddToWalletButtons({ type }: { type: PassType }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAppleWallet = () => {
    window.location.href = `/api/wallet/apple/${type}`;
  };

  const handleGoogleWallet = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wallet/google/${type}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate Google Wallet pass");
        return;
      }
      window.open(data.url, "_blank");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
      {/* Apple Wallet Button */}
      <button
        onClick={handleAppleWallet}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "48px",
          backgroundColor: "rgb(11,5,29)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
      >
        <svg width="20" height="24" viewBox="0 0 814 1000" fill="white">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.7-81.2-106.3-207.6-106.3-328.3C-1.7 298.1 78.6 169.4 196.6 169.4c63.9 0 117.2 42.2 157.5 42.2 38.3 0 98.1-44.8 171.9-44.8 27.8 0 127.8 2.5 191.1 96.1zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.6 15.7 1.3 18.2 2.5.6 6.4.6 10.2.6 45.9.1 102.7-30.4 139.5-70.7z" />
        </svg>
        Add to Apple Wallet
      </button>

      {/* Google Wallet Button */}
      <button
        onClick={handleGoogleWallet}
        disabled={googleLoading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          height: "48px",
          backgroundColor: "white",
          color: "rgb(11,5,29)",
          border: "2px solid rgb(11,5,29)",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: googleLoading ? "wait" : "pointer",
          opacity: googleLoading ? 0.6 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Generating..." : "Add to Google Wallet"}
      </button>

      {error && (
        <p style={{
          margin: 0,
          fontSize: "13px",
          color: "rgb(220,38,38)",
          textAlign: "center",
          padding: "8px",
          backgroundColor: "rgb(254,242,242)",
          borderRadius: "8px",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
