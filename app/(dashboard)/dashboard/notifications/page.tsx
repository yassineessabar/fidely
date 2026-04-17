"use client";

import { useState, useEffect } from "react";

type Notification = {
  id: string;
  card_name: string;
  type: string;
  title: string;
  message: string | null;
  status: string;
  recipients: number;
  sent_at: string | null;
  scheduled_at: string | null;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merchant/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading notifications...</div>;
  }

  const sent = notifications.filter((n) => n.status === "sent");
  const pending = notifications.filter((n) => n.status === "pending");
  const totalRecipients = sent.reduce((sum, n) => sum + n.recipients, 0);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Notifications</h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Track all notifications sent to your customers
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Sent", value: sent.length.toString() },
          { label: "Scheduled", value: pending.length.toString() },
          { label: "Total Recipients", value: totalRecipients.toLocaleString() },
        ].map((kpi) => (
          <div key={kpi.label} style={{ padding: "20px", backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "rgb(97,95,109)", marginBottom: "6px" }}>{kpi.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "rgb(11,5,29)" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>No notifications yet</h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Send your first campaign from the Campaigns tab to start reaching your customers.
          </p>
        </div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(133,77,14)", margin: "0 0 12px" }}>Scheduled ({pending.length})</h2>
              {pending.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{n.title}</div>
                    <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px" }}>
                      {n.card_name} · Scheduled for {new Date(n.scheduled_at!).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgb(254,249,195)", color: "rgb(133,77,14)" }}>
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sent */}
          <div style={{ backgroundColor: "white", borderRadius: "14px", border: "1px solid rgb(228,227,223)", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Sent ({sent.length})</h2>
            {sent.length === 0 ? (
              <p style={{ fontSize: "14px", color: "rgb(97,95,109)" }}>No notifications sent yet.</p>
            ) : (
              sent.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{n.title}</div>
                      <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgb(243,242,238)", color: "rgb(97,95,109)", fontWeight: 600 }}>
                        {n.type === "birthday" ? "Birthday" : n.type === "expiry" ? "Expiry" : "Promo"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px" }}>
                      {n.card_name} · {n.recipients} recipient{n.recipients !== 1 ? "s" : ""} · {new Date(n.sent_at!).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                    {n.message && (
                      <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px", fontStyle: "italic" }}>
                        {n.message.length > 100 ? n.message.slice(0, 100) + "..." : n.message}
                      </div>
                    )}
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgb(220,252,231)", color: "rgb(22,101,52)" }}>
                    Sent
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
