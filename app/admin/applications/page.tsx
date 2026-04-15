"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  company_name: string;
  company_size: string | null;
  role: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  approved: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  rejected: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const tabs = ["all", "pending", "approved", "rejected"] as const;

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/applications${params}`);
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    const res = await fetch(`/api/admin/applications/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      fetchApplications();
    } else {
      const data = await res.json();
      alert(data.error || `Failed to ${action}`);
    }
    setActionLoading(null);
  };

  return (
    <div>
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
        ) : applications.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
            No {activeTab !== "all" ? activeTab : ""} applications.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Company", "Email", "Phone", "Date", "Status", "Actions"].map((h) => (
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
              {applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    {app.first_name} {app.last_name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(11,5,29)" }}>
                    {app.company_name}
                    {app.company_size && (
                      <span style={{ color: "rgb(97,95,109)", fontSize: "12px", marginLeft: "6px" }}>
                        ({app.company_size})
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{app.email}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{app.phone || "—"}</td>
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
                  <td style={{ padding: "14px 16px" }}>
                    {app.status === "pending" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => handleAction(app.id, "approve")}
                          disabled={actionLoading === app.id}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "rgb(22,163,74)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                            opacity: actionLoading === app.id ? 0.6 : 1,
                            fontFamily: "inherit",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "reject")}
                          disabled={actionLoading === app.id}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgb(220,38,38)",
                            backgroundColor: "white",
                            color: "rgb(220,38,38)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                            opacity: actionLoading === app.id ? 0.6 : 1,
                            fontFamily: "inherit",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
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
