"use client";

import { useState, useEffect } from "react";

type Card = {
  id: string;
  name: string;
  type: string;
  status: string;
  business_details: any;
  branding: any;
  logic: any;
  share_url: string | null;
  enrollmentCount: number;
  created_at: string;
};

export default function LoyaltyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading cards...</div>;
  }

  const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", coupon: "Coupon" };
  const typeEmoji: Record<string, string> = { stamp: "☕", points: "💰", coupon: "🎟️" };

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Loyalty Cards</h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
            {cards.length} card{cards.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/admin/cards/new"
          style={{
            padding: "10px 20px", borderRadius: "10px",
            backgroundColor: "rgb(108,71,255)", color: "white",
            fontSize: "14px", fontWeight: 600, textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          + New Card
        </a>
      </div>

      {cards.length === 0 ? (
        <div style={{
          padding: "48px", textAlign: "center", backgroundColor: "white",
          borderRadius: "16px", border: "1px solid rgb(228,227,223)",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💳</div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            No loyalty cards yet
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto 20px", lineHeight: "20px" }}>
            Create your first loyalty card to start enrolling customers and building repeat visits.
          </p>
          <a
            href="/admin/cards/new"
            style={{
              display: "inline-block", padding: "12px 24px", borderRadius: "10px",
              backgroundColor: "rgb(108,71,255)", color: "white",
              fontSize: "14px", fontWeight: 600, textDecoration: "none",
            }}
          >
            Create Your First Card
          </a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {cards.map((card) => {
            const br = card.branding || {};
            const bg = br.backgroundColor || "#0B051D";
            const accent = br.accentColor || "#6C47FF";

            return (
              <div
                key={card.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  border: "1px solid rgb(228,227,223)",
                  overflow: "hidden",
                }}
              >
                <div style={{ height: "6px", background: `linear-gradient(90deg, ${bg}, ${accent})` }} />

                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "20px" }}>{typeEmoji[card.type] || "💳"}</span>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: 0 }}>
                          {card.name}
                        </h3>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>
                        {typeLabels[card.type] || card.type}
                      </div>
                    </div>
                    <span style={{
                      padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                      backgroundColor: card.status === "active" ? "rgb(220,252,231)" : card.status === "draft" ? "rgb(254,249,195)" : "rgb(243,242,238)",
                      color: card.status === "active" ? "rgb(22,101,52)" : card.status === "draft" ? "rgb(133,77,14)" : "rgb(97,95,109)",
                    }}>
                      {card.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)" }}>
                        {card.enrollmentCount}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Members</div>
                    </div>
                    {card.type === "stamp" && card.logic?.totalStamps && (
                      <div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)" }}>
                          {card.logic.totalStamps}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Stamps needed</div>
                      </div>
                    )}
                    {card.type === "stamp" && card.logic?.reward && (
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(108,71,255)", marginTop: "6px" }}>
                          {card.logic.reward}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Reward</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={`/admin/cards/${card.id}`}
                      style={{
                        padding: "8px 16px", borderRadius: "8px",
                        backgroundColor: "rgb(243,242,238)", color: "rgb(11,5,29)",
                        fontSize: "13px", fontWeight: 500, textDecoration: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </a>
                    {card.share_url && (
                      <button
                        onClick={() => { navigator.clipboard.writeText(card.share_url!); }}
                        style={{
                          padding: "8px 16px", borderRadius: "8px",
                          backgroundColor: "rgb(243,242,238)", color: "rgb(11,5,29)",
                          fontSize: "13px", fontWeight: 500, border: "none",
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
