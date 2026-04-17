"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, ExternalLink, Plus, Pencil, Trash2, Check, Info, Globe, QrCode } from "lucide-react";

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

type SubTab = "cards" | "settings" | "share";

export default function LinksPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("cards");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  function loadCards() {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        const c = d.cards || [];
        setCards(c);
        if (c.length > 0 && !selectedCard) setSelectedCard(c[0]);
      })
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
        const updated = cards.filter((c) => c.id !== deleteTarget.id);
        setCards(updated);
        if (selectedCard?.id === deleteTarget.id) setSelectedCard(updated[0] || null);
        setDeleteTarget(null);
      }
    } finally { setDeleting(false); }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading...</div>;

  const typeLabels: Record<string, string> = { stamp: "Stamp Card", points: "Points Card", coupon: "Coupon" };
  const sc = selectedCard;
  const theme = sc?.branding || {};

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(["cards", "settings", "share"] as SubTab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveSubTab(tab)} style={{
              padding: "8px 18px", borderRadius: 99, border: "none",
              backgroundColor: activeSubTab === tab ? "#0b051d" : "white",
              color: activeSubTab === tab ? "white" : "rgba(10,10,10,0.7)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              boxShadow: activeSubTab !== tab ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}>
              {tab === "cards" ? "My Cards" : tab === "settings" ? "Card Settings" : "Share"}
            </button>
          ))}
        </div>
        <a href="/dashboard/loyalty/new" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 18px", borderRadius: 99, backgroundColor: "#0b051d", color: "white",
          fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "inherit",
        }}>
          <Plus size={15} /> Add Card
        </a>
      </div>

      {/* 5-col grid: 3 content + 2 preview */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }} className="links-grid">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {activeSubTab === "cards" && (
            <>
              {sc?.share_url && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, backgroundColor: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Info size={18} style={{ color: "rgb(37,99,235)", marginTop: 2, flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.8)" }}>
                      Your card link is live: <a href={sc.share_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "rgb(37,99,235)" }}>{sc.share_url}</a>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleCopy(sc.share_url!)} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                    <button onClick={() => window.open(sc.share_url!, "_blank")} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                      <ExternalLink size={12} /> Open
                    </button>
                  </div>
                </div>
              )}
              {cards.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", backgroundColor: "white", borderRadius: 16, border: "1px solid rgba(10,10,10,0.06)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 8px" }}>No cards yet</h2>
                  <p style={{ fontSize: 14, color: "rgba(10,10,10,0.45)", marginBottom: 20 }}>Create your first loyalty card to get started.</p>
                  <a href="/dashboard/loyalty/new" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 99, backgroundColor: "#0b051d", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}><Plus size={16} /> Create Card</a>
                </div>
              ) : (
                cards.map((card) => {
                  const isSelected = selectedCard?.id === card.id;
                  const br = card.branding || {};
                  return (
                    <div key={card.id} onClick={() => setSelectedCard(card)} style={{
                      padding: 18, borderRadius: 14, cursor: "pointer", backgroundColor: "white",
                      border: isSelected ? "2px solid #0b051d" : "1px solid rgba(10,10,10,0.06)",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${br.backgroundColor || "#0b051d"}, ${br.accentColor || "#6C47FF"})` }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{card.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(10,10,10,0.4)" }}>{typeLabels[card.type] || card.type} · {card.enrollmentCount} members</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: card.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(10,10,10,0.04)", color: card.status === "active" ? "rgb(5,150,105)" : "rgba(10,10,10,0.4)" }}>{card.status}</span>
                          <a href={`/dashboard/loyalty/${card.id}`} onClick={(e) => e.stopPropagation()} style={{ padding: 6, borderRadius: 6, color: "rgba(10,10,10,0.3)", textDecoration: "none" }}><Pencil size={14} /></a>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(card); }} style={{ padding: 6, borderRadius: 6, border: "none", backgroundColor: "transparent", color: "rgba(10,10,10,0.3)", cursor: "pointer" }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
          {activeSubTab === "settings" && sc && (
            <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 20px" }}>Card Settings</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Card Name", value: sc.name },
                  { label: "Type", value: typeLabels[sc.type] || sc.type },
                  sc.logic?.reward ? { label: "Reward", value: sc.logic.reward } : null,
                  sc.logic?.totalStamps ? { label: "Total Stamps", value: sc.logic.totalStamps } : null,
                ].filter(Boolean).map((f: any) => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(10,10,10,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</label>
                    <div style={{ fontSize: 14, color: "rgba(10,10,10,0.8)", fontWeight: 500 }}>{f.value}</div>
                  </div>
                ))}
                <a href={`/dashboard/loyalty/${sc.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 99, backgroundColor: "#0b051d", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "inherit", width: "fit-content", marginTop: 8 }}><Pencil size={14} /> Edit Card</a>
              </div>
            </div>
          )}
          {activeSubTab === "share" && sc?.share_url && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>Share your card</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, backgroundColor: "rgba(10,10,10,0.03)" }}>
                  <Globe size={16} style={{ color: "rgba(10,10,10,0.3)", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "rgba(10,10,10,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sc.share_url}</span>
                  <button onClick={() => handleCopy(sc.share_url!)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied" : "Copy"}</button>
                </div>
              </div>
              <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(10,10,10,0.06)", padding: 24, textAlign: "center" }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 16px" }}>QR Code</h2>
                <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
                  <QrCode size={120} style={{ color: "rgba(10,10,10,0.15)" }} />
                </div>
                <p style={{ fontSize: 12, color: "rgba(10,10,10,0.4)" }}>Print this QR code and display it in your store</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: iPhone wallet preview */}
        <div className="links-preview">
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", alignItems: "center", padding: 24, background: "linear-gradient(135deg, rgba(10,10,10,0.02), rgba(10,10,10,0.04))", borderRadius: 16, height: "fit-content" }}>
            {sc ? (
              <div style={{ position: "relative", width: 280, borderRadius: 40, backgroundColor: "#000", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", border: "10px solid #333", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 100, height: 22, backgroundColor: "#000", borderRadius: "0 0 14px 14px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#444" }} />
                </div>
                <div style={{ backgroundColor: theme.backgroundColor || "#0b051d", paddingTop: 28 }}>
                  <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {theme.logoUrl ? (
                        <img src={theme.logoUrl} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: theme.accentColor || "#6C47FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, fontWeight: 900, color: theme.primaryColor || "#fff" }}>{(sc.name || "K").charAt(0)}</span>
                        </div>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700, color: theme.primaryColor || "#fff" }}>{sc.business_details?.name || sc.name}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 6, fontWeight: 600, color: theme.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>VALID UNTIL</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: theme.primaryColor || "#fff" }}>18/04/2027</div>
                    </div>
                  </div>
                  <div style={{ height: 80, position: "relative", overflow: "hidden" }}>
                    {theme.heroImageUrl ? (
                      <><img src={theme.heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} /></>
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${theme.accentColor || "#6C47FF"}40, ${theme.backgroundColor || "#0b051d"})` }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap", padding: "6px 10px" }}>
                      {Array.from({ length: sc.logic?.totalStamps || 10 }).map((_, i) => (
                        <span key={i} style={{ fontSize: 14, opacity: i < 1 ? 1 : 0.2, filter: i >= 1 ? "grayscale(1)" : "none" }}>☕</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 6, fontWeight: 600, color: theme.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>STAMPS UNTIL REWARD</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: theme.primaryColor || "#fff" }}>{sc.logic?.totalStamps || 10} stamps</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 6, fontWeight: 600, color: theme.secondaryColor || "#E6FFA9", textTransform: "uppercase" }}>MEMBER</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: theme.primaryColor || "#fff" }}>Jane Smith</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 7, backgroundColor: "white", padding: 3, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(7, 1fr)", gap: 0.5 }}>
                      {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,0,1,1,0,1,0, 0,1,0,0,1,0,1, 1,0,1,0,1,1,1].map((v, i) => (
                        <div key={i} style={{ backgroundColor: v ? "#0b051d" : "white" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 6, color: theme.secondaryColor || "#E6FFA9", marginTop: 4, opacity: 0.4 }}>Powered by Kyro</div>
                  </div>
                </div>
                <div style={{ height: 16, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: 80, height: 4, borderRadius: 2, backgroundColor: "#444" }} />
                </div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(10,10,10,0.3)", fontSize: 14 }}>Select a card to preview</div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => !deleting && setDeleteTarget(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 32, maxWidth: 400, width: "90%", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 8px" }}>Delete &quot;{deleteTarget.name}&quot;?</h2>
            <p style={{ fontSize: 14, color: "rgba(10,10,10,0.5)", lineHeight: "20px", marginBottom: 24 }}>This will permanently delete this card and all {deleteTarget.enrollmentCount} enrollments.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(10,10,10,0.1)", backgroundColor: "white", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ padding: "10px 24px", borderRadius: 10, border: "none", backgroundColor: "rgb(220,38,38)", color: "white", fontSize: 14, fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: deleting ? 0.7 : 1 }}>{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .links-grid { grid-template-columns: 1fr !important; }
          .links-preview { display: none !important; }
        }
      `}</style>
    </div>
  );
}
