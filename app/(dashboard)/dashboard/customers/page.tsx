"use client";

import { useState } from "react";
import { Search, Download, Filter, ChevronDown } from "lucide-react";

const customers = [
  { name: "Sophie Martin", email: "sophie@email.com", visits: 24, points: 480, lastVisit: "Today", status: "VIP", spend: "€596", card: "Gold" },
  { name: "Marc Dupont", email: "marc.d@email.com", visits: 18, points: 360, lastVisit: "Yesterday", status: "Active", spend: "€412", card: "Silver" },
  { name: "Julie Rousseau", email: "julie.r@email.com", visits: 15, points: 290, lastVisit: "2 days ago", status: "Active", spend: "€348", card: "Silver" },
  { name: "Thomas Bernard", email: "thomas.b@email.com", visits: 12, points: 240, lastVisit: "3 days ago", status: "Active", spend: "€276", card: "Bronze" },
  { name: "Léa Petit", email: "lea.p@email.com", visits: 10, points: 195, lastVisit: "5 days ago", status: "Active", spend: "€230", card: "Bronze" },
  { name: "Antoine Moreau", email: "antoine@email.com", visits: 8, points: 160, lastVisit: "1 week ago", status: "Active", spend: "€184", card: "Bronze" },
  { name: "Camille Leroy", email: "camille@email.com", visits: 5, points: 95, lastVisit: "2 weeks ago", status: "Inactive", spend: "€115", card: "Basic" },
  { name: "Lucas Girard", email: "lucas.g@email.com", visits: 3, points: 60, lastVisit: "3 weeks ago", status: "Inactive", spend: "€69", card: "Basic" },
  { name: "Emma Bonnet", email: "emma.b@email.com", visits: 2, points: 40, lastVisit: "1 month ago", status: "Inactive", spend: "€46", card: "Basic" },
  { name: "Hugo Laurent", email: "hugo@email.com", visits: 1, points: 20, lastVisit: "1 month ago", status: "New", spend: "€23", card: "Basic" },
];

const filters = ["All", "Active", "VIP", "Inactive", "New"];

const statusColors: Record<string, { bg: string; text: string }> = {
  VIP: { bg: "rgba(230,255,169,0.2)", text: "rgb(80,140,20)" },
  Active: { bg: "rgba(100,180,255,0.15)", text: "rgb(30,100,200)" },
  Inactive: { bg: "rgba(255,200,100,0.15)", text: "rgb(180,120,20)" },
  New: { bg: "rgba(170,137,242,0.15)", text: "rgb(108,71,255)" },
};

export default function CustomersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    if (activeFilter !== "All" && c.status !== activeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Customers</h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "4px 0 0" }}>1,471 total customers</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)" }}>
            <Filter size={14} /> Filters <ChevronDown size={14} />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)" }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", backgroundColor: "white", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", flex: 1, minWidth: "200px", maxWidth: "300px" }}>
          <Search size={16} color="rgb(97,95,109)" />
          <input placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "none", background: "none", outline: "none", fontSize: "14px", color: "rgb(11,5,29)", width: "100%", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: "8px 14px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", backgroundColor: activeFilter === f ? "rgb(11,5,29)" : "white", color: activeFilter === f ? "white" : "rgb(97,95,109)", transition: "all 0.15s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", overflow: "hidden" }} className="dash-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {["Name", "Visits", "Points", "Last Visit", "Status", "Total Spend", "Card"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", fontSize: "12px", fontWeight: 500, color: "rgb(97,95,109)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.email} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", cursor: "pointer", transition: "background-color 0.1s" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "rgb(11,5,29)" }}>
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "rgb(97,95,109)" }}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)" }}>{c.visits}</td>
                <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 600 }}>{c.points}</td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgb(97,95,109)" }}>{c.lastVisit}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, backgroundColor: statusColors[c.status]?.bg, color: statusColors[c.status]?.text }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500 }}>{c.spend}</td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgb(97,95,109)" }}>{c.card}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
