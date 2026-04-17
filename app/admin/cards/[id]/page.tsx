"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";

type Merchant = { id: string; name: string };

function NotificationSection({ cardId }: { cardId: string }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/admin/cards/${cardId}/notifications`)
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {});
  }, [cardId]);

  async function handleSend() {
    if (!title.trim()) return;
    setSending(true);
    setResult("");
    try {
      const body: any = { title: title.trim() };
      if (message.trim()) body.message = message.trim();
      if (scheduledAt) body.scheduled_at = new Date(scheduledAt).toISOString();

      const res = await fetch(`/api/admin/cards/${cardId}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.status === "sent" ? `Sent to ${data.recipients} members` : "Scheduled");
        setTitle("");
        setMessage("");
        setScheduledAt("");
        const listRes = await fetch(`/api/admin/cards/${cardId}/notifications`);
        const listData = await listRes.json();
        setNotifications(listData.notifications || []);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ marginBottom: "24px", padding: "20px 24px", backgroundColor: "white", borderRadius: "12px", border: "1px solid rgb(228,227,223)" }}>
      <div style={{ fontSize: "16px", fontWeight: 700, color: "rgb(11,5,29)", marginBottom: "16px" }}>
        Send Notification
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Double stamps this weekend!"
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Visit us this Saturday and Sunday to earn double stamps on every purchase!"
          rows={3}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Schedule (optional — empty = send now)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={sending || !title.trim()}
        style={{
          padding: "12px 24px", borderRadius: "8px",
          backgroundColor: title.trim() ? "rgb(108,71,255)" : "rgb(228,227,223)",
          color: "white", fontSize: "14px", fontWeight: 600,
          border: "none", cursor: sending || !title.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit", opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "Sending..." : scheduledAt ? "Schedule" : "Send Now"}
      </button>
      {result && (
        <div style={{ marginTop: "10px", fontSize: "13px", color: result.startsWith("Error") ? "#e53e3e" : "rgb(22,101,52)", fontWeight: 600 }}>
          {result}
        </div>
      )}

      {notifications.length > 0 && (
        <div style={{ marginTop: "20px", borderTop: "1px solid rgb(228,227,223)", paddingTop: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "rgb(97,95,109)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            History
          </div>
          {notifications.map((n: any) => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgb(243,242,238)" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{n.title}</div>
                <div style={{ fontSize: "12px", color: "rgb(97,95,109)", marginTop: "2px" }}>
                  {n.type} · {n.recipients} recipients · {new Date(n.sent_at || n.scheduled_at || n.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{
                padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                backgroundColor: n.status === "sent" ? "rgb(220,252,231)" : n.status === "pending" ? "rgb(254,249,195)" : "rgb(254,226,226)",
                color: n.status === "sent" ? "rgb(22,101,52)" : n.status === "pending" ? "rgb(133,77,14)" : "rgb(153,27,27)",
              }}>
                {n.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ shareUrl: string; qrCodeData: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/merchants").then((r) => r.json()),
      fetch(`/api/admin/cards/${cardId}`).then((r) => r.json()),
    ]).then(([merchantsData, cardData]) => {
      setMerchants((merchantsData.merchants ?? []).map((m: any) => ({ id: m.id, name: m.name })));
      if (cardData.card) {
        const card = cardData.card;
        const formData = { businessId: card.business_id, type: card.type, name: card.name, merchantPin: card.merchant_pin || "0000", businessDetails: card.business_details || {}, branding: card.branding || {}, logic: card.logic || {} };
        setInitialData(formData);
        setPreviewData(formData);
        if (card.status === "active" && card.share_url) {
          setPublishResult({ shareUrl: card.share_url, qrCodeData: card.qr_code_data || "" });
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [cardId]);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, merchant_pin: data.merchantPin || "0000", business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      if (!res.ok) { const r = await res.json(); alert(r.error || "Failed to save"); }
    } finally { setSaving(false); }
  };

  const handlePublish = async (data: any) => {
    setPublishing(true);
    try {
      const saveRes = await fetch(`/api/admin/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, merchant_pin: data.merchantPin || "0000", business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      if (!saveRes.ok) { const r = await saveRes.json(); alert(r.error || "Failed to save"); return; }
      const publishRes = await fetch(`/api/admin/cards/${cardId}/publish`, { method: "POST" });
      if (publishRes.ok) {
        const result = await publishRes.json();
        setPublishResult(result);
      } else {
        const r = await publishRes.json();
        alert(r.error || "Failed to publish");
      }
    } finally { setPublishing(false); }
  };

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Loading card...</div>;
  if (!initialData) return <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>Card not found.</div>;

  return (
    <div>
      {publishResult && (
        <div style={{ marginBottom: "24px", padding: "20px 24px", backgroundColor: "rgb(220,252,231)", borderRadius: "12px", border: "1px solid rgb(187,247,208)" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "12px" }}>Card Published!</div>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "4px" }}>Share URL</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "white", padding: "8px 12px", borderRadius: "6px" }}>
                <a href={publishResult.shareUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "rgb(108,71,255)", fontFamily: "monospace", wordBreak: "break-all", textDecoration: "underline" }}>{publishResult.shareUrl}</a>
                <button onClick={() => { navigator.clipboard.writeText(publishResult.shareUrl); }} style={{ flexShrink: 0, padding: "4px 10px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgb(243,242,238)", border: "1px solid rgb(228,227,223)", borderRadius: "6px", cursor: "pointer", color: "rgb(97,95,109)", fontFamily: "inherit" }}>Copy</button>
              </div>
            </div>
            {publishResult.qrCodeData && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgb(22,101,52)", marginBottom: "4px" }}>QR Code</div>
                <img src={publishResult.qrCodeData} alt="QR Code" style={{ width: "120px", height: "120px", borderRadius: "8px", backgroundColor: "white", padding: "8px" }} />
              </div>
            )}
          </div>
        </div>
      )}

      {publishResult && (
        <NotificationSection cardId={cardId} />
      )}

      <div className="card-builder-layout" style={{ display: "flex", gap: "32px", alignItems: "flex-start", minHeight: "calc(100vh - 140px)" }}>
        <div className="card-builder-form" style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm initialData={initialData} merchants={merchants} onChange={(data: any) => setPreviewData(data)} onSave={handleSave} onPublish={handlePublish} saving={saving} publishing={publishing} />
        </div>
        <div className="card-builder-preview" style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          {previewData && <CardPreview type={previewData.type || "stamp"} cardName={previewData.name} businessDetails={previewData.businessDetails || {}} branding={previewData.branding || {}} logic={previewData.logic || {}} />}
        </div>
      </div>
    </div>
  );
}
