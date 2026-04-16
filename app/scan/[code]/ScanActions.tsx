"use client";

import { useState } from "react";

type EnrollmentData = {
  id: string;
  customer_name: string;
  customer_email: string;
  membership_code: string;
  stamps_collected: number;
  points_balance: number;
  status: string;
  created_at: string;
};

type CardData = {
  id: string;
  type: "coupon" | "stamp" | "points";
  business_details: any;
  branding: any;
  logic: any;
};

export default function ScanActions({
  enrollment: initialEnrollment,
  card,
}: {
  enrollment: EnrollmentData;
  card: CardData;
}) {
  const [enrollment, setEnrollment] = useState(initialEnrollment);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pointsAmount, setPointsAmount] = useState("");
  const [redeemPoints, setRedeemPoints] = useState("");
  const [pin, setPin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`merchant-pin-${card.id}`) || "";
    }
    return "";
  });
  const [pinVerified, setPinVerified] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`merchant-pin-${card.id}`);
    }
    return false;
  });
  const [pinError, setPinError] = useState("");

  const br = card.branding || {};
  const logic = card.logic || {};
  const bg = br.backgroundColor || "#0B051D";
  const primary = br.primaryColor || "#FFFFFF";
  const secondary = br.secondaryColor || "#E6FFA9";
  const accent = br.accentColor || "#6C47FF";

  async function performAction(action: string, amount?: number) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/scan/${enrollment.membership_code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, amount, pin }),
      });

      const data = await res.json();

      if (res.status === 403) {
        localStorage.removeItem(`merchant-pin-${card.id}`);
        setPinVerified(false);
        setPin("");
        setPinError("Invalid PIN");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setMessage(data.error || "Action failed");
        setLoading(false);
        return;
      }

      // PIN was correct — save it
      localStorage.setItem(`merchant-pin-${card.id}`, pin);
      setPinVerified(true);

      if (data.stamps_collected !== undefined) {
        setEnrollment((prev) => ({ ...prev, stamps_collected: data.stamps_collected }));
      }
      if (data.points_balance !== undefined) {
        setEnrollment((prev) => ({ ...prev, points_balance: data.points_balance }));
      }
      if (data.status) {
        setEnrollment((prev) => ({ ...prev, status: data.status }));
      }

      if (action === "stamp") {
        setMessage(data.reward_ready ? "Reward is ready to redeem!" : "Stamp added!");
      } else if (action === "points") {
        setMessage(`+${data.points_added} points added!`);
      } else if (action === "redeem") {
        setMessage(data.reward ? `Redeemed: ${data.reward}` : "Redeemed successfully!");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  const buttonStyle = {
    padding: "14px 24px",
    borderRadius: "12px",
    backgroundColor: accent,
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700 as const,
    border: "none",
    cursor: loading ? "not-allowed" as const : "pointer" as const,
    fontFamily: "inherit",
    opacity: loading ? 0.7 : 1,
    width: "100%",
    marginBottom: "12px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: `1px solid ${primary}20`,
    backgroundColor: `${primary}08`,
    color: primary,
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "8px",
  };

  if (!pinVerified) {
    return (
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: `${primary}10`,
            border: `1px solid ${primary}20`,
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: primary, marginBottom: "4px" }}>
            {enrollment.customer_name}
          </div>
          <div style={{ fontSize: "14px", color: primary, opacity: 0.5, marginBottom: "12px" }}>
            {enrollment.customer_email}
          </div>
          <div style={{ fontSize: "12px", color: secondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {enrollment.membership_code}
          </div>
        </div>
        <div style={{ marginTop: "24px", marginBottom: "16px", fontSize: "15px", fontWeight: 600, color: primary }}>
          Enter merchant PIN to continue
        </div>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          pattern="[0-9]*"
          value={pin}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
            setPin(v);
            setPinError("");
          }}
          placeholder="••••"
          style={{
            width: "120px", padding: "16px", borderRadius: "12px",
            border: `1px solid ${pinError ? "#ff6b6b" : primary + "30"}`,
            backgroundColor: `${primary}08`, color: primary,
            fontSize: "24px", fontFamily: "inherit", textAlign: "center",
            outline: "none", letterSpacing: "8px",
          }}
        />
        {pinError && (
          <div style={{ marginTop: "12px", color: "#ff6b6b", fontSize: "14px" }}>{pinError}</div>
        )}
        <button
          onClick={() => setPinVerified(true)}
          disabled={pin.length !== 4}
          style={{
            display: "block", width: "100%", marginTop: "20px", padding: "16px",
            borderRadius: "12px", backgroundColor: pin.length === 4 ? accent : `${primary}20`,
            color: "#fff", fontSize: "16px", fontWeight: 700, border: "none",
            cursor: pin.length === 4 ? "pointer" : "not-allowed", fontFamily: "inherit",
          }}
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Customer info */}
      <div
        style={{
          padding: "20px",
          borderRadius: "16px",
          backgroundColor: `${primary}10`,
          border: `1px solid ${primary}20`,
          marginBottom: "24px",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: 700, color: primary, marginBottom: "4px" }}>
          {enrollment.customer_name}
        </div>
        <div style={{ fontSize: "14px", color: primary, opacity: 0.5, marginBottom: "12px" }}>
          {enrollment.customer_email}
        </div>
        <div style={{ fontSize: "12px", color: secondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {enrollment.membership_code}
        </div>
      </div>

      {/* Status display */}
      {card.type === "stamp" && (
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: `${accent}15`,
            border: `1px solid ${accent}30`,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "14px", color: secondary, fontWeight: 600, textTransform: "uppercase", marginBottom: "8px" }}>
            Stamps
          </div>
          <div style={{ fontSize: "48px", fontWeight: 800, color: primary }}>
            {enrollment.stamps_collected}/{logic.totalStamps || 10}
          </div>
          {enrollment.stamps_collected >= (logic.totalStamps || 10) && (
            <div style={{ fontSize: "14px", color: secondary, fontWeight: 600, marginTop: "8px" }}>
              Reward ready!
            </div>
          )}
        </div>
      )}

      {card.type === "points" && (
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: `${accent}15`,
            border: `1px solid ${accent}30`,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "14px", color: secondary, fontWeight: 600, textTransform: "uppercase", marginBottom: "8px" }}>
            {logic.pointsLabel || "Points"} Balance
          </div>
          <div style={{ fontSize: "48px", fontWeight: 800, color: primary }}>
            {enrollment.points_balance}
          </div>
        </div>
      )}

      {card.type === "coupon" && (
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            backgroundColor: `${accent}15`,
            border: `1px solid ${accent}30`,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "14px", color: secondary, fontWeight: 600, textTransform: "uppercase", marginBottom: "8px" }}>
            Status
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: primary, textTransform: "capitalize" }}>
            {enrollment.status}
          </div>
        </div>
      )}

      {/* Actions */}
      {enrollment.status === "active" && (
        <div>
          {card.type === "stamp" && (
            <>
              <button
                onClick={() => performAction("stamp")}
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Adding..." : "Add Stamp"}
              </button>
              {enrollment.stamps_collected >= (logic.totalStamps || 10) && (
                <button
                  onClick={() => performAction("redeem")}
                  disabled={loading}
                  style={{ ...buttonStyle, backgroundColor: secondary, color: bg }}
                >
                  {loading ? "Redeeming..." : `Redeem: ${logic.reward || "Free item"}`}
                </button>
              )}
            </>
          )}

          {card.type === "points" && (
            <>
              <input
                type="number"
                placeholder={`Points to add (default: ${logic.pointsPerDollar || 10})`}
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                style={inputStyle}
              />
              <button
                onClick={() => performAction("points", pointsAmount ? parseInt(pointsAmount) : undefined)}
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Adding..." : "Add Points"}
              </button>
              <input
                type="number"
                placeholder="Points to redeem"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                style={inputStyle}
              />
              <button
                onClick={() => performAction("redeem", redeemPoints ? parseInt(redeemPoints) : undefined)}
                disabled={loading}
                style={{ ...buttonStyle, backgroundColor: secondary, color: bg }}
              >
                {loading ? "Redeeming..." : "Redeem Points"}
              </button>
            </>
          )}

          {card.type === "coupon" && (
            <button
              onClick={() => performAction("redeem")}
              disabled={loading}
              style={{ ...buttonStyle, backgroundColor: secondary, color: bg }}
            >
              {loading ? "Redeeming..." : "Redeem Coupon"}
            </button>
          )}
        </div>
      )}

      {enrollment.status === "redeemed" && (
        <div style={{ textAlign: "center", padding: "20px", color: secondary, fontSize: "18px", fontWeight: 700 }}>
          This enrollment has been redeemed.
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: "16px",
            padding: "14px 20px",
            borderRadius: "12px",
            backgroundColor: `${secondary}20`,
            color: secondary,
            fontSize: "15px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
