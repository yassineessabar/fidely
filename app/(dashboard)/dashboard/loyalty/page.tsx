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
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadCards() {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => setCards(d.cards || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadCards(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/merchant/cards/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {} finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading cards...</div>;
  }

  const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", coupon: "Coupon" };

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
          href="/dashboard/loyalty/new"
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
        <div style={{ padding: "48px", textAlign: "center", backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>No loyalty cards yet</h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto 20px", lineHeight: "20px" }}>
            Create your first loyalty card to start enrolling customers and building repeat visits.
          </p>
          <a href="/dashboard/loyalty/new" style={{ display: "inline-block", padding: "12px 24px", borderRadius: "10px", backgroundColor: "rgb(108,71,255)", color: "white", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
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
              <div key={card.id} style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", overflow: "hidden" }}>
                <div style={{ height: "6px", background: `linear-gradient(90deg, ${bg}, ${accent})` }} />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: 0 }}>{card.name}</h3>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>{typeLabels[card.type] || card.type}</div>
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
                      <div style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)" }}>{card.enrollmentCount}</div>
                      <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Members</div>
                    </div>
                    {card.type === "stamp" && card.logic?.totalStamps && (
                      <div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)" }}>{card.logic.totalStamps}</div>
                        <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Stamps needed</div>
                      </div>
                    )}
                    {card.type === "stamp" && card.logic?.reward && (
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(108,71,255)", marginTop: "6px" }}>{card.logic.reward}</div>
                        <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>Reward</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a
                      href={`/dashboard/loyalty/${card.id}`}
                      style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgb(243,242,238)", color: "rgb(11,5,29)", fontSize: "13px", fontWeight: 500, textDecoration: "none", fontFamily: "inherit" }}
                    >
                      Edit
                    </a>
                    {card.share_url && (
                      <button
                        onClick={() => { navigator.clipboard.writeText(card.share_url!); }}
                        style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgb(243,242,238)", color: "rgb(11,5,29)", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Copy Link
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(card)}
                      style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgb(254,226,226)", color: "rgb(153,27,27)", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", maxWidth: "400px", width: "90%", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
              Delete &quot;{deleteTarget.name}&quot;?
            </h2>
            <p style={{ fontSize: "14px", color: "rgb(97,95,109)", lineHeight: "20px", marginBottom: "24px" }}>
              This will permanently delete this card and all {deleteTarget.enrollmentCount} enrollment{deleteTarget.enrollmentCount !== 1 ? "s" : ""}. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid rgb(228,227,223)", backgroundColor: "white", color: "rgb(11,5,29)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: "10px 24px", borderRadius: "10px", border: "none", backgroundColor: "rgb(220,38,38)", color: "white", fontSize: "14px", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? "Deleting..." : "Delete Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
