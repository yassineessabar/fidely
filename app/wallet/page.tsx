"use client";

import { useState } from "react";
import { templates } from "../../lib/wallet/templates";
import { PassType } from "../../lib/wallet/types";
import PassCard from "./components/PassCard";
import AddToWalletButtons from "./components/AddToWalletButtons";
import KyroLogo from "../components/KyroLogo";

const passTypes: { key: PassType; label: string; icon: string }[] = [
  { key: "discount", label: "Discount", icon: "🏷️" },
  { key: "reward", label: "Reward", icon: "🎁" },
  { key: "stamp", label: "Stamp", icon: "☕" },
  { key: "cashback", label: "Cashback", icon: "💰" },
];

export default function WalletDemoPage() {
  const [activeType, setActiveType] = useState<PassType>("discount");
  const activeTemplate = templates[activeType];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "rgb(249,248,245)",
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "16px 0",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
        }}>
          <KyroLogo color="rgb(11,5,29)" height={22} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "32px 16px 40px",
      }}>
        {/* Title */}
        <h1 className="font-display" style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
          textAlign: "center",
          margin: "0 0 8px",
          lineHeight: "34px",
        }}>
          Wallet Pass Templates
        </h1>
        <p style={{
          fontSize: "15px",
          color: "rgb(97,95,109)",
          textAlign: "center",
          margin: "0 0 28px",
          lineHeight: "22px",
        }}>
          Add any of our 4 loyalty card types directly to your Apple or Google Wallet.
        </p>

        {/* Tab selector */}
        <div style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}>
          {passTypes.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              style={{
                padding: "8px 18px",
                borderRadius: "100px",
                border: activeType === key ? "2px solid rgb(147,51,234)" : "1px solid rgb(213,213,221)",
                backgroundColor: activeType === key ? "rgb(243,232,255)" : "white",
                color: activeType === key ? "rgb(147,51,234)" : "rgb(11,5,29)",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Pass card preview */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}>
          <PassCard template={activeTemplate} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: "14px",
          color: "rgb(97,95,109)",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: "20px",
        }}>
          {activeTemplate.description}
        </p>

        {/* Add to Wallet buttons */}
        <div style={{
          maxWidth: "380px",
          margin: "0 auto 32px",
        }}>
          <AddToWalletButtons type={activeType} />
        </div>

        {/* Pass details */}
        <div style={{
          maxWidth: "380px",
          margin: "0 auto",
          backgroundColor: "white",
          border: "1px solid rgb(213,213,221)",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <h3 style={{
            margin: "0 0 16px",
            fontSize: "14px",
            fontWeight: 700,
            color: "rgb(11,5,29)",
          }}>
            Pass Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</p>
              <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{activeType.charAt(0).toUpperCase() + activeType.slice(1)} Card</p>
            </div>
            {activeTemplate.primaryFields.map((f) => (
              <div key={f.key}>
                <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{String(f.value)}</p>
              </div>
            ))}
            {activeTemplate.secondaryFields.map((f) => (
              <div key={f.key}>
                <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{String(f.value)}</p>
              </div>
            ))}
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(137,135,137)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Barcode</p>
              <p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{activeTemplate.barcodeFormat} — {activeTemplate.barcodeValue}</p>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgb(137,135,137)", margin: "0 0 8px" }}>Powered by</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <KyroLogo color="rgb(137,135,137)" height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
