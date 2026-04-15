"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "../components/StatsCard";

type Invoice = {
  id: string;
  business_id: string;
  business_name: string;
  amount: number;
  currency: string;
  plan: string;
  status: "paid" | "pending" | "failed";
  invoice_date: string;
};

type Summary = {
  totalRevenue: number;
  mrr: number;
  avgPerMerchant: number;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  failed: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const tabs = ["all", "paid", "pending", "failed"] as const;

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("all");

  const fetchInvoices = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/invoices${params}`);
    if (res.ok) {
      const data = await res.json();
      setInvoices(data.invoices);
      setSummary(data.summary);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchInvoices();
  }, [fetchInvoices]);

  const fmt = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <StatsCard label="Total Revenue" value={fmt(summary.totalRevenue)} />
          <StatsCard label="MRR" value={fmt(summary.mrr)} subtitle="This month" />
          <StatsCard label="Avg. Per Merchant" value={fmt(summary.avgPerMerchant)} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === tab ? "rgb(11,5,29)" : "white",
              color: activeTab === tab ? "white" : "rgb(97,95,109)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="admin-table-wrap"
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading...</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
            No {activeTab !== "all" ? activeTab : ""} invoices.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Business", "Amount", "Plan", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    {inv.business_name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(11,5,29)", fontWeight: 500 }}>
                    ${Number(inv.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", textTransform: "capitalize" }}>
                    {inv.plan}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: statusColors[inv.status]?.bg ?? "rgb(249,248,245)",
                        color: statusColors[inv.status]?.text ?? "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                    {new Date(inv.invoice_date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
