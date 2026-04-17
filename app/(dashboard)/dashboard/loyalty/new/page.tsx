"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardBuilderForm from "../../../../admin/components/CardBuilderForm";
import CardPreview from "../../../../admin/components/CardPreview";

export default function NewCardPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
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

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Create New Card</h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Set up a new loyalty card for your customers
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 58%", minWidth: 0 }}>
          <CardBuilderForm
            merchants={[]}
            onChange={(data: any) => setPreviewData(data)}
            onSave={handleSave}
            onPublish={handleSave}
            saving={saving}
            publishing={false}
          />
        </div>
        <div style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          {previewData && (
            <CardPreview
              type={previewData.type || "stamp"}
              cardName={previewData.name}
              businessDetails={previewData.businessDetails || {}}
              branding={previewData.branding || {}}
              logic={previewData.logic || {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
