"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "./components/StatsCard";

type Stats = {
  totalMerchants: number;
  pendingApplications: number;
  totalCustomers: number;
  monthlyRevenue: number;
};

type Application = {
  id: string;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  approved: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  rejected: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/applications?status=pending"),
      ]);

      if (statsRes.status === 401 || appsRes.status === 401) {
        router.push("/signin");
        return;
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setRecentApps((data.applications ?? []).slice(0, 5));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatsCard label="Total Merchants" value={stats?.totalMerchants ?? 0} />
        <StatsCard label="Pending Applications" value={stats?.pendingApplications ?? 0} />
        <StatsCard label="Total Customers" value={stats?.totalCustomers ?? 0} />
        <StatsCard
          label="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
      </div>

      {/* Recent Pending Applications */}
      <div
        className="admin-table-wrap"
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgb(228,227,223)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            className="font-display"
            style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)" }}
          >
            Recent Pending Applications
          </h2>
          <Link
            href="/admin/applications"
            style={{ fontSize: "13px", color: "rgb(108,71,255)", textDecoration: "none", fontWeight: 500 }}
          >
            View all
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "rgb(97,95,109)", fontSize: "14px" }}>
            No pending applications.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Company", "Email", "Date", "Status"].map((h) => (
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
              {recentApps.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    {app.first_name} {app.last_name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(11,5,29)" }}>{app.company_name}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{app.email}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)", fontSize: "13px" }}>
                    {new Date(app.created_at).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: statusColors[app.status].bg,
                        color: statusColors[app.status].text,
                        textTransform: "capitalize",
                      }}
                    >
                      {app.status}
                    </span>
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
