"use client";

import { useState, useEffect } from "react";
import { Search, Download, Users, UserPlus } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  stamps: number;
  points: number;
  status: string;
  cardName: string;
  cardType: string;
  joinedAt: string;
};

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: "white", borderRadius: 14,
  border: "1px solid rgba(10,10,10,0.06)", ...extra,
});

export default function AudiencePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/merchant/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = customers.filter((c) => c.status === "active").length;

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "rgba(10,10,10,0.4)" }}>Loading audience...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="audience-stats-grid">
        {[
          { label: "Total Audience", value: customers.length.toLocaleString(), icon: Users, color: "#6C47FF" },
          { label: "Active", value: activeCount.toLocaleString(), icon: UserPlus, color: "#10b981" },
          { label: "Inactive", value: (customers.length - activeCount).toLocaleString(), icon: Users, color: "#f59e0b" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={card({ padding: 20 })}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(10,10,10,0.45)" }}>{s.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: `${s.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(10,10,10,0.9)", lineHeight: 1 }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Search + filters bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 320 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1,
            padding: "8px 14px", borderRadius: 10,
            backgroundColor: "white", border: "1px solid rgba(10,10,10,0.08)",
          }}>
            <Search size={16} style={{ color: "rgba(10,10,10,0.3)" }} />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 13, color: "rgba(10,10,10,0.8)", width: "100%", fontFamily: "inherit", backgroundColor: "transparent" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "active", "redeemed"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: "6px 14px", borderRadius: 99, border: "none", fontSize: 12, fontWeight: 600,
              backgroundColor: statusFilter === f ? "#0b051d" : "white", color: statusFilter === f ? "white" : "rgba(10,10,10,0.6)",
              cursor: "pointer", fontFamily: "inherit", boxShadow: statusFilter !== f ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
              textTransform: "capitalize",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {customers.length === 0 ? (
        <div style={card({ padding: 48, textAlign: "center" })}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(10,10,10,0.85)", margin: "0 0 6px" }}>No audience yet</h2>
          <p style={{ fontSize: 13, color: "rgba(10,10,10,0.4)", margin: 0 }}>Customers will appear here once they sign up for your loyalty card.</p>
        </div>
      ) : (
        <div style={card({ overflow: "hidden", padding: 0 })}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(10,10,10,0.06)" }}>
                  {["Name", "Card", "Progress", "Status", "Joined"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(10,10,10,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(10,10,10,0.03)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(10,10,10,0.35)", marginTop: 1 }}>{c.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "rgba(10,10,10,0.6)", whiteSpace: "nowrap" }}>{c.cardName}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "rgba(10,10,10,0.85)", whiteSpace: "nowrap" }}>
                      {c.cardType === "stamp" ? `${c.stamps} stamps` : `${c.points} pts`}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        backgroundColor: c.status === "active" ? "rgba(16,185,129,0.08)" : "rgba(10,10,10,0.04)",
                        color: c.status === "active" ? "rgb(5,150,105)" : "rgba(10,10,10,0.4)",
                      }}>{c.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "rgba(10,10,10,0.45)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(c.joinedAt).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && search && (
              <div style={{ padding: 32, textAlign: "center", color: "rgba(10,10,10,0.4)", fontSize: 13 }}>
                No results matching &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .audience-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
