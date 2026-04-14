"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StatsCard from "../../components/StatsCard";

type Business = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  website: string | null;
  business_type: string | null;
  company_size: string | null;
  plan: "starter" | "growth" | "enterprise";
  created_at: string;
};

type TeamMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  status: string | null;
  created_at: string;
};

type Location = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  status: string | null;
};

type Invoice = {
  id: string;
  amount: number;
  status: string;
  invoice_date: string;
  plan: string;
};

const planOptions = ["starter", "growth", "enterprise"] as const;

const invoiceStatusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  failed: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  border: "1px solid rgb(228,227,223)",
  padding: "24px",
  marginBottom: "24px",
};

const sectionTitle = {
  margin: "0 0 16px",
  fontSize: "14px",
  fontWeight: 600 as const,
  color: "rgb(11,5,29)",
};

export default function MerchantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [planUpdating, setPlanUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/merchants/${id}`);
      if (res.status === 401) { router.push("/signin"); return; }
      if (res.status === 404) { router.push("/admin/merchants"); return; }
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        setTeam(data.team);
        setLocations(data.locations);
        setCustomerCount(data.customerCount);
        setRecentInvoices(data.recentInvoices);
      }
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handlePlanChange = async (newPlan: string) => {
    if (!business || newPlan === business.plan) return;
    setPlanUpdating(true);
    const res = await fetch(`/api/admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    if (res.ok) {
      const data = await res.json();
      setBusiness(data.business);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update plan");
    }
    setPlanUpdating(false);
  };

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading...</div>;
  }

  if (!business) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Merchant not found.</div>;
  }

  return (
    <div>
      <Link href="/admin/merchants" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "rgb(97,95,109)", textDecoration: "none", marginBottom: "24px" }}>
        <ArrowLeft size={16} /> Back to merchants
      </Link>

      {/* Name + plan selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 className="font-display" style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "rgb(11,5,29)" }}>{business.name}</h2>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "rgb(97,95,109)" }}>{business.email || "No email"}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "rgb(97,95,109)" }}>Plan:</span>
          <select
            value={business.plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            disabled={planUpdating}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "1px solid rgb(228,227,223)",
              fontSize: "14px",
              fontFamily: "inherit",
              color: "rgb(11,5,29)",
              backgroundColor: "white",
              cursor: planUpdating ? "not-allowed" : "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230b051d' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              textTransform: "capitalize",
            }}
          >
            {planOptions.map((p) => (
              <option key={p} value={p} style={{ textTransform: "capitalize" }}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <StatsCard label="Customers" value={customerCount} />
        <StatsCard label="Locations" value={locations.length} />
        <StatsCard label="Team Members" value={team.length} />
      </div>

      {/* Business info */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Business Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
          {[
            ["Phone", business.phone],
            ["Address", [business.address, business.city, business.postal_code].filter(Boolean).join(", ")],
            ["Website", business.website],
            ["Type", business.business_type],
            ["Size", business.company_size ? `${business.company_size} locations` : null],
            ["Joined", new Date(business.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })],
          ].map(([label, val]) => (
            <div key={label as string}>
              <p style={{ margin: 0, fontSize: "12px", color: "rgb(97,95,109)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
              <p style={{ margin: "4px 0 0", color: "rgb(11,5,29)" }}>{val || "\u2014"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Team ({team.length})</h3>
        {team.length === 0 ? (
          <p style={{ color: "rgb(97,95,109)", fontSize: "14px" }}>No team members.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Email", "Role", "Status"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "10px 12px", color: "rgb(11,5,29)" }}>{m.first_name} {m.last_name}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)" }}>{m.email}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)", textTransform: "capitalize" }}>{m.role}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)", textTransform: "capitalize" }}>{m.status || "active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Locations */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Locations ({locations.length})</h3>
        {locations.length === 0 ? (
          <p style={{ color: "rgb(97,95,109)", fontSize: "14px" }}>No locations.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Address", "City", "Status"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "10px 12px", color: "rgb(11,5,29)" }}>{loc.name}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)" }}>{loc.address || "\u2014"}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)" }}>{loc.city || "\u2014"}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)", textTransform: "capitalize" }}>{loc.status || "active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Invoices */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Recent Invoices ({recentInvoices.length})</h3>
        {recentInvoices.length === 0 ? (
          <p style={{ color: "rgb(97,95,109)", fontSize: "14px" }}>No invoices.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Date", "Amount", "Plan", "Status"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)" }}>
                    {new Date(inv.invoice_date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "10px 12px", color: "rgb(11,5,29)", fontWeight: 500 }}>${Number(inv.amount).toFixed(2)}</td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)", textTransform: "capitalize" }}>{inv.plan}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                      backgroundColor: invoiceStatusColors[inv.status]?.bg ?? "rgb(249,248,245)",
                      color: invoiceStatusColors[inv.status]?.text ?? "rgb(97,95,109)",
                      textTransform: "capitalize",
                    }}>{inv.status}</span>
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
