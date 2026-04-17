"use client";

import { useState, useEffect } from "react";

type Analytics = {
  enrollmentsByMonth: { month: string; count: number }[];
  cardBreakdown: { name: string; type: string; status: string; members: number; active: number }[];
  topCustomers: { name: string; email: string; stamps: number; points: number; card: string; status: string }[];
  stampDistribution: { label: string; count: number }[];
  totalEnrollments: number;
  activeRate: number;
  avgStamps: number;
  avgPoints: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merchant/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading analytics...</div>;
  }

  if (!data || data.totalEnrollments === 0) {
    return (
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Analytics</h1>
        </div>
        <div style={{ padding: "48px", textAlign: "center", backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>No data yet</h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Analytics will appear once customers start enrolling in your loyalty cards.
          </p>
        </div>
      </div>
    );
  }

  const maxMonthCount = Math.max(...data.enrollmentsByMonth.map((m) => m.count), 1);
  const maxStampCount = Math.max(...data.stampDistribution.map((s) => s.count), 1);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Insights from your loyalty program data
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Members", value: data.totalEnrollments.toLocaleString() },
          { label: "Active Rate", value: `${data.activeRate}%` },
          { label: "Avg. Stamps", value: data.avgStamps.toString() },
          { label: "Avg. Points", value: data.avgPoints.toLocaleString() },
        ].map((kpi) => (
          <div key={kpi.label} style={{ padding: "20px", backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "rgb(97,95,109)", marginBottom: "6px" }}>{kpi.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "rgb(11,5,29)" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Enrollment trend */}
        <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>New Members (Last 6 Months)</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {data.enrollmentsByMonth.map((m) => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "rgb(11,5,29)" }}>{m.count}</div>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  backgroundColor: m.count > 0 ? "rgb(108,71,255)" : "rgb(243,242,238)",
                  height: `${Math.max((m.count / maxMonthCount) * 100, 4)}%`,
                  minHeight: "4px",
                  transition: "height 0.3s",
                }} />
                <div style={{ fontSize: "10px", color: "rgb(97,95,109)" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stamp distribution */}
        {data.stampDistribution.some((s) => s.count > 0) && (
          <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Stamp Progress Distribution</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.stampDistribution.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "12px", color: "rgb(97,95,109)", width: "80px", flexShrink: 0 }}>{s.label}</div>
                  <div style={{ flex: 1, height: "20px", backgroundColor: "rgb(243,242,238)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "4px",
                      backgroundColor: "rgb(108,71,255)",
                      width: `${(s.count / maxStampCount) * 100}%`,
                      minWidth: s.count > 0 ? "4px" : "0",
                      transition: "width 0.3s",
                    }} />
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "rgb(11,5,29)", width: "30px", textAlign: "right" }}>{s.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show card breakdown if no stamp data */}
        {!data.stampDistribution.some((s) => s.count > 0) && (
          <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Cards Overview</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.cardBreakdown.map((c) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{c.name}</div>
                    <div style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>{c.type}</div>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)" }}>{c.members}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card breakdown */}
      <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Members by Card</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
          {data.cardBreakdown.map((c) => (
            <div key={c.name} style={{ padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "10px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "rgb(11,5,29)", marginBottom: "4px" }}>{c.name}</div>
              <div style={{ fontSize: "11px", color: "rgb(97,95,109)", marginBottom: "8px", textTransform: "capitalize" }}>{c.type} · {c.status}</div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>{c.members}</div>
                  <div style={{ fontSize: "10px", color: "rgb(97,95,109)" }}>Total</div>
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "rgb(22,101,52)" }}>{c.active}</div>
                  <div style={{ fontSize: "10px", color: "rgb(97,95,109)" }}>Active</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top customers */}
      {data.topCustomers.length > 0 && (
        <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>Top Members</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgb(228,227,223)" }}>
                {["Name", "Card", "Stamps", "Points", "Status"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "rgb(97,95,109)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgb(243,242,238)" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600, color: "rgb(11,5,29)" }}>{c.name}</div>
                    <div style={{ fontSize: "11px", color: "rgb(97,95,109)" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "rgb(97,95,109)" }}>{c.card}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "rgb(11,5,29)" }}>{c.stamps}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "rgb(11,5,29)" }}>{c.points}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                      backgroundColor: c.status === "active" ? "rgb(220,252,231)" : "rgb(254,226,226)",
                      color: c.status === "active" ? "rgb(22,101,52)" : "rgb(153,27,27)",
                    }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
