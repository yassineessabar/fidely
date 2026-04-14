"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardBuilderForm from "../../components/CardBuilderForm";
import CardPreview from "../../components/CardPreview";

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

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then((data) => setMerchants((data.merchants ?? []).map((m: any) => ({ id: m.id, name: m.name }))))
      .catch(() => {});
  }, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      if (res.ok) {
        const result = await res.json();
        router.push(`/admin/cards/${result.card.id}`);
      }
    } finally { setSaving(false); }
  };

  const handlePublish = async (data: any) => {
    setPublishing(true);
    try {
      const createRes = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: data.businessId, type: data.type, name: data.name, business_details: data.businessDetails, branding: data.branding, logic: data.logic }),
      });
      if (createRes.ok) {
        const result = await createRes.json();
        await fetch(`/api/admin/cards/${result.card.id}/publish`, { method: "POST" });
        router.push(`/admin/cards/${result.card.id}`);
      }
    } finally { setPublishing(false); }
  };

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", minHeight: "calc(100vh - 140px)" }}>
      <div style={{ flex: "0 0 58%", minWidth: 0 }}>
        <CardBuilderForm merchants={merchants} onChange={(data: any) => setPreviewData(data)} onSave={handleSave} onPublish={handlePublish} saving={saving} publishing={publishing} />
      </div>
      <div style={{ flex: "0 0 38%", position: "sticky", top: "104px", display: "flex", justifyContent: "center", paddingTop: "16px" }}>
        <CardPreview type={previewData.type || "stamp"} businessDetails={previewData.businessDetails || {}} branding={previewData.branding || {}} logic={previewData.logic || {}} />
      </div>
    </div>
  );
}
