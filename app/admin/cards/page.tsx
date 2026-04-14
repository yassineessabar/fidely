"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Card = {
  id: string;
  name: string;
  type: "coupon" | "stamp" | "points";
  status: "draft" | "active" | "archived";
  business_name: string;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "rgb(243,244,246)", text: "rgb(107,114,128)" },
  active: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  archived: { bg: "rgb(243,244,246)", text: "rgb(156,163,175)" },
};

const typeColors: Record<string, { bg: string; text: string }> = {
  coupon: { bg: "rgb(237,233,254)", text: "rgb(108,71,255)" },
  stamp: { bg: "rgb(254,243,199)", text: "rgb(180,83,9)" },
  points: { bg: "rgb(219,234,254)", text: "rgb(30,64,175)" },
};

const statusTabs = ["all", "draft", "active", "archived"] as const;

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]>("all");

  const fetchCards = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/cards${params}`);
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchCards();
  }, [fetchCards]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "none",
                backgroundColor: activeTab === tab ? "rgb(11,5,29)" : "white",
                color: activeTab === tab ? "white" : "rgb(97,95,109)",
                fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
              }}
            >{tab}</button>
          ))}
        </div>
        <button
          onClick={() => router.push("/admin/cards/new")}
          style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            backgroundColor: "rgb(108,71,255)", color: "white",
            fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >Create Card</button>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading...</div>
        ) : cards.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>No cards found. Create your first loyalty card.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Merchant", "Type", "Status", "Created"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer" }}
                  onClick={() => router.push(`/admin/cards/${card.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    <Link href={`/admin/cards/${card.id}`} style={{ textDecoration: "none", color: "inherit" }}>{card.name}</Link>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{card.business_name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, backgroundColor: typeColors[card.type]?.bg, color: typeColors[card.type]?.text, textTransform: "capitalize" }}>{card.type}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, backgroundColor: statusColors[card.status]?.bg, color: statusColors[card.status]?.text, textTransform: "capitalize" }}>{card.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                    {new Date(card.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
