"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Merchant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  plan: "starter" | "growth" | "enterprise";
  created_at: string;
};

const planColors: Record<string, { bg: string; text: string }> = {
  starter: { bg: "rgb(249,248,245)", text: "rgb(97,95,109)" },
  growth: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  enterprise: { bg: "rgb(230,255,169)", text: "rgb(11,5,29)" },
};

const plans = ["all", "starter", "growth", "enterprise"] as const;

export default function MerchantsPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<(typeof plans)[number]>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newMerchant, setNewMerchant] = useState({ name: "", email: "", phone: "", city: "", plan: "starter" });

  const fetchMerchants = useCallback(async () => {
    const params = new URLSearchParams();
    if (activePlan !== "all") params.set("plan", activePlan);
    if (search.trim()) params.set("search", search.trim());
    const qs = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`/api/admin/merchants${qs}`);
    if (res.ok) {
      const data = await res.json();
      setMerchants(data.merchants);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activePlan, search, router]);

  useEffect(() => {
    setLoading(true);
    fetchMerchants();
  }, [fetchMerchants]);

  const handleCreateMerchant = async () => {
    if (!newMerchant.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMerchant),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewMerchant({ name: "", email: "", phone: "", city: "", plan: "starter" });
        fetchMerchants();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create merchant");
      }
    } finally {
      setCreating(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid rgb(228,227,223)", fontSize: "14px",
    fontFamily: "inherit", color: "rgb(11,5,29)", outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: 600 as const,
    color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  return (
    <div>
      {/* Create merchant modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowCreate(false)}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "440px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)" }}>Create Merchant</h3>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Name *</label>
              <input type="text" value={newMerchant.name} onChange={(e) => setNewMerchant({ ...newMerchant, name: e.target.value })} placeholder="Business name" style={inputStyle} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={newMerchant.email} onChange={(e) => setNewMerchant({ ...newMerchant, email: e.target.value })} placeholder="contact@business.com" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={newMerchant.phone} onChange={(e) => setNewMerchant({ ...newMerchant, phone: e.target.value })} placeholder="+61..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" value={newMerchant.city} onChange={(e) => setNewMerchant({ ...newMerchant, city: e.target.value })} placeholder="Sydney" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Plan</label>
              <select value={newMerchant.plan} onChange={(e) => setNewMerchant({ ...newMerchant, plan: e.target.value })} style={inputStyle}>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", backgroundColor: "white", color: "rgb(97,95,109)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handleCreateMerchant} disabled={creating || !newMerchant.name.trim()} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "rgb(108,71,255)", color: "white", fontSize: "14px", fontWeight: 600, cursor: creating ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: creating ? 0.7 : 1 }}>{creating ? "Creating..." : "Create Merchant"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => setActivePlan(plan)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activePlan === plan ? "rgb(11,5,29)" : "white",
                color: activePlan === plan ? "white" : "rgb(97,95,109)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {plan}
            </button>
          ))}
        </div>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid rgb(228,227,223)",
            fontSize: "14px",
            fontFamily: "inherit",
            color: "rgb(11,5,29)",
            backgroundColor: "white",
            outline: "none",
            width: "260px",
          }}
        />
        <button
          onClick={() => setShowCreate(true)}
          style={{
            marginLeft: "auto",
            padding: "8px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "rgb(108,71,255)",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Create Merchant
        </button>
      </div>

      <div className="admin-table-wrap" style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading...</div>
        ) : merchants.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>No merchants found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Email", "City", "Plan", "Joined"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr
                  key={m.id}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer" }}
                  onClick={() => router.push(`/admin/merchants/${m.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    <Link href={`/admin/merchants/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>{m.name}</Link>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{m.email || "\u2014"}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{m.city || "\u2014"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                      backgroundColor: planColors[m.plan]?.bg ?? "rgb(249,248,245)",
                      color: planColors[m.plan]?.text ?? "rgb(97,95,109)",
                      textTransform: "capitalize",
                    }}>{m.plan}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                    {new Date(m.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
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
