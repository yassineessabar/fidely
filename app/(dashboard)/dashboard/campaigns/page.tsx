"use client";

import { useState, useEffect } from "react";

type CardOption = { id: string; name: string };
type Notification = {
  id: string;
  card_id: string;
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

export default function CampaignsPage() {
  const [cards, setCards] = useState<CardOption[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [campaignType, setCampaignType] = useState<"promo" | "birthday" | "location">("promo");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [cardId, setCardId] = useState("all");
  const [scheduledAt, setScheduledAt] = useState("");

  function loadData() {
    fetch("/api/merchant/notifications")
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.notifications || []);
        setCards(d.cards || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadData(); }, []);

  async function handleSend() {
    if (!title.trim()) return;
    setSending(true);
    setResult("");
    try {
      const body: any = { title: title.trim(), campaign_type: campaignType };
      if (message.trim()) body.message = message.trim();
      if (cardId !== "all") body.card_id = cardId;
      if (scheduledAt) body.scheduled_at = new Date(scheduledAt).toISOString();

      const res = await fetch("/api/merchant/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(
          data.status === "sent"
            ? `Sent to ${data.recipients} customer${data.recipients !== 1 ? "s" : ""}`
            : `Scheduled for ${data.cards} card${data.cards !== 1 ? "s" : ""}`
        );
        setTitle("");
        setMessage("");
        setScheduledAt("");
        loadData();
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Failed to send");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading campaigns...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Campaigns</h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Send notifications to your loyalty card members
        </p>
      </div>

      {/* Send form */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 20px" }}>
          New Campaign
        </h2>

        {cards.length === 0 ? (
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)" }}>
            You need at least one active loyalty card to send campaigns. Create one from the admin panel.
          </p>
        ) : (
          <>
            {/* Campaign type selector */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Campaign Type
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {([
                  { id: "promo" as const, label: "Promo", desc: "Special offers & announcements" },
                  { id: "birthday" as const, label: "Birthday", desc: "Birthday rewards for members" },
                  { id: "location" as const, label: "Location", desc: "Nearby visit reminders" },
                ]).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setCampaignType(t.id);
                      if (t.id === "birthday" && !title) setTitle("Happy Birthday!");
                      if (t.id === "location" && !title) setTitle("We're nearby! Come visit us");
                    }}
                    style={{
                      padding: "16px 12px",
                      borderRadius: "12px",
                      border: campaignType === t.id ? "2px solid #0b051d" : "1px solid rgb(228,227,223)",
                      backgroundColor: campaignType === t.id ? "rgba(10,10,10,0.04)" : "white",
                      cursor: "pointer",
                      textAlign: "center",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", marginBottom: "2px" }}>{t.label}</div>
                    <div style={{ fontSize: "11px", color: "rgb(97,95,109)", lineHeight: "14px" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={campaignType === "birthday" ? "Happy Birthday!" : campaignType === "location" ? "We're nearby! Come visit us" : "Double stamps this weekend!"}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={campaignType === "birthday" ? "Enjoy a special treat on us — show this to redeem your birthday reward!" : campaignType === "location" ? "You're near our store! Pop in today for a stamp on your loyalty card." : "Visit us this Saturday and Sunday to earn double stamps on every purchase!"}
                rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Send to
                </label>
                <select
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", backgroundColor: "white" }}
                >
                  <option value="all">All cards</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Schedule (optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={sending || !title.trim()}
              style={{
                padding: "12px 28px", borderRadius: "10px",
                backgroundColor: title.trim() ? "#0b051d" : "rgb(228,227,223)",
                color: "white", fontSize: "14px", fontWeight: 600,
                border: "none", cursor: sending || !title.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit", opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? "Sending..." : scheduledAt ? "Schedule Campaign" : "Send Now"}
            </button>

            {result && (
              <div style={{ marginTop: "12px", fontSize: "13px", fontWeight: 600, color: result.startsWith("Error") ? "#e53e3e" : "rgb(22,101,52)" }}>
                {result}
              </div>
            )}
          </>
        )}
      </div>

      {/* History */}
      {notifications.length > 0 && (
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", padding: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            Campaign History
          </h2>
          {notifications.map((n) => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{n.title}</div>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgb(243,242,238)", color: "rgb(97,95,109)", fontWeight: 600 }}>
                    {n.type === "birthday" ? "Birthday" : n.type === "custom" ? "Promo" : n.type}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "3px" }}>
                  {n.card_name} · {n.recipients} recipient{n.recipients !== 1 ? "s" : ""} · {new Date(n.sent_at || n.scheduled_at || n.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                {n.message && (
                  <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px", fontStyle: "italic" }}>
                    {n.message.length > 80 ? n.message.slice(0, 80) + "..." : n.message}
                  </div>
                )}
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                backgroundColor: n.status === "sent" ? "rgb(220,252,231)" : n.status === "pending" ? "rgb(254,249,195)" : "rgb(254,226,226)",
                color: n.status === "sent" ? "rgb(22,101,52)" : n.status === "pending" ? "rgb(133,77,14)" : "rgb(153,27,27)",
              }}>
                {n.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
