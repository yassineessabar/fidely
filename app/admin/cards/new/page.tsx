"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";
import CardTemplates from "../../components/CardTemplates";

type Merchant = { id: string; name: string };

export default function NewCardPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [previewData, setPreviewData] = useState<any>({
    type: "stamp",
    businessDetails: { name: "", category: "", tagline: "", description: "", welcomeOffer: "" },
    branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", cardStyle: "premium" },
    logic: { totalStamps: 10, stampIcon: "\u2615", reward: "", progressLabel: "collected" },
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [templateKey, setTemplateKey] = useState(0);

  const handleTemplateSelect = (templateData: any) => {
    setPreviewData(templateData);
    setTemplateKey((k) => k + 1); // force form re-mount with new initialData
  };

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then((data) => setMerchants((data.merchants ?? []).map((m: any) => ({ id: m.id, name: m.name }))))
      .catch(() => {});
  }, []);

  const validate = (data: any): string | null => {
    if (!data.businessId) return "Please select a merchant";
    if (!data.name) return "Please enter a card name";
    if (!data.type) return "Please select a card type";
    return null;
  };

  const handleSave = async (data: any) => {
    const err = validate(data);
    if (err) { alert(err); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      const result = await res.json();
      if (!res.ok) { alert(result.error || "Failed to save"); return; }
      router.push(`/admin/cards/${result.card.id}`);
    } finally { setSaving(false); }
  };

  const handlePublish = async (data: any) => {
    const err = validate(data);
    if (err) { alert(err); return; }
    setPublishing(true);
    try {
      const createRes = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      const createResult = await createRes.json();
      if (!createRes.ok) { alert(createResult.error || "Failed to save card"); return; }
      const publishRes = await fetch(`/api/admin/cards/${createResult.card.id}/publish`, { method: "POST" });
      const publishResult = await publishRes.json();
      if (!publishRes.ok) { alert(publishResult.error || "Failed to publish"); return; }
      router.push(`/admin/cards/${createResult.card.id}`);
    } finally { setPublishing(false); }
  };

  return (
    <div>
      {/* Templates section */}
      <CardTemplates onSelect={handleTemplateSelect} />

      {/* Builder */}
      <div className="card-builder-layout" style={{ display: "flex", gap: "32px", alignItems: "flex-start", minHeight: "calc(100vh - 140px)" }}>
        <div className="card-builder-form" style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm key={templateKey} initialData={templateKey > 0 ? previewData : undefined} merchants={merchants} onChange={(data: any) => setPreviewData(data)} onSave={handleSave} onPublish={handlePublish} saving={saving} publishing={publishing} />
        </div>
        <div className="card-builder-preview" style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          <CardPreview type={previewData.type || "stamp"} businessDetails={previewData.businessDetails || {}} branding={previewData.branding || {}} logic={previewData.logic || {}} />
        </div>
      </div>
    </div>
  );
}
