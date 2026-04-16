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
        body: JSON.stringify({ action, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Action failed");
        setLoading(false);
        return;
      }

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
