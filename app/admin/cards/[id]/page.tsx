"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";

type Merchant = { id: string; name: string };

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

      <div className="card-builder-layout" style={{ display: "flex", gap: "32px", alignItems: "flex-start", minHeight: "calc(100vh - 140px)" }}>
        <div className="card-builder-form" style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm initialData={initialData} merchants={merchants} onChange={(data: any) => setPreviewData(data)} onSave={handleSave} onPublish={handlePublish} saving={saving} publishing={publishing} />
        </div>
        <div className="card-builder-preview" style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          {previewData && <CardPreview type={previewData.type || "stamp"} businessDetails={previewData.businessDetails || {}} branding={previewData.branding || {}} logic={previewData.logic || {}} />}
        </div>
      </div>
    </div>
  );
}
