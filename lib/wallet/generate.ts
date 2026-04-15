import { PassTemplate, PassField } from "./types";

type CardRow = {
  id: string;
  type: "coupon" | "stamp" | "points";
  business_details: any;
  branding: any;
  logic: any;
};

export function cardToPassTemplate(card: CardRow): PassTemplate {
  const bd = card.business_details || {};
  const br = card.branding || {};
  const logic = card.logic || {};
  const merchantName = bd.name || "Merchant";

  // Map card type to existing PassType
  const typeMap: Record<string, "discount" | "reward" | "stamp" | "cashback"> = {
    coupon: "discount",
    stamp: "stamp",
    points: "reward",
  };

  // Build fields based on card type
  let headerFields: PassField[] = [];
  let primaryFields: PassField[] = [];
  let secondaryFields: PassField[] = [];
  let backFields: PassField[] = [];
  let description = bd.description || `${merchantName} Loyalty Card`;

  if (card.type === "coupon") {
    primaryFields = [
      { key: "offer", label: "OFFER", value: logic.offerTitle || "Special Offer" },
    ];
    if (logic.expiryDate) {
      secondaryFields.push({ key: "expires", label: "EXPIRES", value: logic.expiryDate });
    }
    if (logic.conditions) {
      backFields.push({ key: "conditions", label: "CONDITIONS", value: logic.conditions });
    }
    description = logic.offerDescription || description;
  } else if (card.type === "stamp") {
    headerFields = [
      { key: "stamps", label: "STAMPS", value: `0/${logic.totalStamps || 10}` },
    ];
    primaryFields = [
      { key: "reward", label: "REWARD", value: logic.reward || "Free item" },
    ];
    secondaryFields = [
      { key: "progress", label: "PROGRESS", value: `0 ${logic.progressLabel || "collected"}` },
    ];
  } else if (card.type === "points") {
    headerFields = [
      { key: "points", label: logic.pointsLabel || "POINTS", value: "0" },
    ];
    primaryFields = [
      { key: "earn", label: "EARN RATE", value: `${logic.pointsPerDollar || 10} pts per $1` },
    ];
    const tiers = logic.rewardTiers || [];
    if (tiers.length > 0) {
      secondaryFields.push({
        key: "nextReward",
        label: "NEXT REWARD",
        value: `${tiers[0].reward} (${tiers[0].points} pts)`,
      });
    }
    if (logic.redemptionRules) {
      backFields.push({ key: "rules", label: "REDEMPTION RULES", value: logic.redemptionRules });
    }
  }

  // Always add powered by + description to back
  if (bd.description) {
    backFields.push({ key: "about", label: "ABOUT", value: bd.description });
  }
  backFields.push({ key: "powered", label: "POWERED BY", value: "Kyro - https://kyro.com" });

  return {
    type: typeMap[card.type] || "reward",
    merchantName,
    merchantId: card.id,
    logoText: merchantName,
    description,
    backgroundColor: br.backgroundColor || "rgb(11,5,29)",
    foregroundColor: br.primaryColor || "rgb(255,255,255)",
    labelColor: br.secondaryColor || "rgb(230,255,169)",
    headerFields,
    primaryFields,
    secondaryFields,
    auxiliaryFields: [],
    backFields,
    barcodeFormat: "QR",
    barcodeValue: `KYRO-${card.id.slice(0, 8).toUpperCase()}`,
    stripImagePath: "/wallet/strip-reward.png",
    logoUrl: br.logoUrl || undefined,
    accentColor: br.accentColor || undefined,
  };
}
