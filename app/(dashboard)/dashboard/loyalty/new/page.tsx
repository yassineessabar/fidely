"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardBuilderForm from "../../../../admin/components/CardBuilderForm";
import CardPreview from "../../../../admin/components/CardPreview";
import CardTemplates from "../../../../admin/components/CardTemplates";

export default function NewCardPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<any>({
    type: "stamp",
    businessDetails: { name: "", category: "", tagline: "", description: "" },
    branding: { logoUrl: "", heroImageUrl: "", backgroundColor: "#0B051D", primaryColor: "#FFFFFF", secondaryColor: "#E6FFA9", accentColor: "#6C47FF", cardStyle: "premium" },
    logic: { totalStamps: 10, stampIcon: "", reward: "", progressLabel: "collected" },
  });
  const [saving, setSaving] = useState(false);
  const [templateKey, setTemplateKey] = useState(0);

  const handleTemplateSelect = (templateData: any) => {
    setPreviewData(templateData);
    setTemplateKey((k) => k + 1);
  };

  const handleSave = async (data: any) => {
    if (!data.name) { alert("Please enter a card name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/merchant/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          name: data.name,
          merchant_pin: data.merchantPin || "0000",
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
      if (res.ok) {
        const { card } = await res.json();
        router.push(`/dashboard/loyalty/${card.id}`);
      } else {
        const r = await res.json();
        alert(r.error || "Failed to create card");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: any) => {
    if (!data.name) { alert("Please enter a card name"); return; }
    setSaving(true);
    try {
      const createRes = await fetch("/api/merchant/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          name: data.name,
          merchant_pin: data.merchantPin || "0000",
          business_details: data.businessDetails,
          branding: data.branding,
          logic: data.logic,
        }),
      });
      if (!createRes.ok) {
        const r = await createRes.json();
        alert(r.error || "Failed to create card");
        return;
      }
      const { card } = await createRes.json();
      const publishRes = await fetch(`/api/admin/cards/${card.id}/publish`, { method: "POST" });
      if (publishRes.ok) {
        router.push(`/dashboard/loyalty/${card.id}`);
      } else {
        router.push(`/dashboard/loyalty/${card.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => router.push("/dashboard/loyalty")}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgb(228,227,223)", backgroundColor: "white", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", color: "rgb(97,95,109)" }}
        >
          Back
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Create New Card</h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
            Pick a template or start from scratch
          </p>
        </div>
      </div>

      {/* Templates */}
      <CardTemplates onSelect={handleTemplateSelect} />

      {/* Builder */}
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm
            key={templateKey}
            initialData={templateKey > 0 ? previewData : undefined}
            merchants={[]}
            onChange={(data: any) => setPreviewData(data)}
            onSave={handleSave}
            onPublish={handlePublish}
            saving={saving}
            publishing={false}
          />
        </div>
        <div style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          <CardPreview
            type={previewData.type || "stamp"}
            cardName={previewData.name}
            businessDetails={previewData.businessDetails || {}}
            branding={previewData.branding || {}}
            logic={previewData.logic || {}}
          />
        </div>
      </div>
    </div>
  );
}
