"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Check, Lock } from "lucide-react";

const features = [
  "Unlimited loyalty cards",
  "Up to 10 push campaigns/month",
  "Basic analytics & insights",
  "Up to 500 customers",
  "Priority support",
];

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: "white", borderRadius: 24, maxWidth: 440, width: "100%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        {/* Header gradient */}
        <div style={{
          padding: "32px 28px 24px", position: "relative",
          background: "linear-gradient(135deg, #111 0%, #333 100%)",
          color: "white",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32, borderRadius: 99,
            border: "none", backgroundColor: "rgba(255,255,255,0.1)",
            color: "white", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <Sparkles size={24} style={{ color: "white" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
            Upgrade to Growth
          </h2>
          <p style={{ fontSize: 14, margin: 0, opacity: 0.7 }}>
            Unlock campaigns, more cards, and powerful features
          </p>
        </div>

        {/* Features */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  backgroundColor: "rgba(16,185,129,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Check size={13} style={{ color: "rgb(5,150,105)" }} />
                </div>
                <span style={{ fontSize: 14, color: "rgba(10,10,10,0.75)" }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { onClose(); router.push("/dashboard/upgrade"); }}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              backgroundColor: "#0B051D", color: "white",
              fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Sparkles size={16} />
            Upgrade Now — $79/mo
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(10,10,10,0.35)", marginTop: 10, marginBottom: 0 }}>
            14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

export function LockedOverlay({ children, plan, onUpgrade }: {
  children: React.ReactNode;
  plan: string;
  onUpgrade: () => void;
}) {
  if (plan !== "starter" && plan !== "free") return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ opacity: 0.4, pointerEvents: "none", filter: "grayscale(0.5)" }}>
        {children}
      </div>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(2px)",
        borderRadius: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          backgroundColor: "rgba(10,10,10,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 12,
        }}>
          <Lock size={22} style={{ color: "rgba(10,10,10,0.4)" }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: "0 0 4px" }}>
          Available on Growth
        </p>
        <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: "0 0 16px" }}>
          Upgrade to unlock this feature
        </p>
        <button onClick={onUpgrade} style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          backgroundColor: "#0B051D", color: "white",
          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Sparkles size={14} />
          Upgrade
        </button>
      </div>
    </div>
  );
}
