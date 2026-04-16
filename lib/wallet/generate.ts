import { PassTemplate, PassField } from "./types";

const CATEGORY_STAMP_ICONS: Record<string, string> = {
  cafe: "\u2615",
  restaurant: "\uD83C\uDF7D",
  salon: "\uD83D\uDC87",
  barber: "\u2702\uFE0F",
  gym: "\uD83D\uDCAA",
  bakery: "\uD83E\uDDC1",
  retail: "\uD83D\uDECD",
  other: "\u2B50",
};

type CardRow = {
  id: string;
  name?: string;
  type: "coupon" | "stamp" | "points";
  business_details: any;
  branding: any;
  logic: any;
};

export function cardToPassTemplate(card: CardRow): PassTemplate {
  const bd = card.business_details || {};
  const br = card.branding || {};
  const logic = card.logic || {};
  const merchantName = bd.name || card.name || "Merchant";

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
    heroImageUrl: br.heroImageUrl || undefined,
    accentColor: br.accentColor || undefined,
  };
}

export function enrollmentToPassTemplate(
  card: CardRow,
  enrollment: {
    id: string;
    membership_code: string;
    customer_name: string;
    stamps_collected: number;
    points_balance: number;
    auth_token: string;
  }
): PassTemplate {
  const bd = card.business_details || {};
  const br = card.branding || {};
  const logic = card.logic || {};
  const merchantName = bd.name || card.name || "Merchant";

  const typeMap: Record<string, "discount" | "reward" | "stamp" | "cashback"> = {
    coupon: "discount",
    stamp: "stamp",
    points: "reward",
  };

  let headerFields: PassField[] = [];
  let primaryFields: PassField[] = [];
  let secondaryFields: PassField[] = [];
  let auxiliaryFields: PassField[] = [];
  let backFields: PassField[] = [];
  let description = bd.description || `${merchantName} Loyalty Card`;

  if (card.type === "coupon") {
    primaryFields = [
      { key: "offer", label: "OFFER", value: logic.offerTitle || "Special Offer" },
    ];
    if (logic.expiryDate) {
      secondaryFields.push({ key: "expires", label: "EXPIRES", value: logic.expiryDate });
    }
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
    description = logic.offerDescription || description;
  } else if (card.type === "stamp") {
    const icon = CATEGORY_STAMP_ICONS[bd.category] || logic.stampIcon || "\u2B50";
    const total = logic.totalStamps || 10;
    const collected = enrollment.stamps_collected;
    // Show stamp icons: filled for collected, empty circles for remaining
    const stampVisual = Array.from({ length: total }, (_, i) => i < collected ? icon : "○").join("");
    headerFields = [
      { key: "stamps", label: "STAMPS", value: `${collected}/${total}` },
    ];
    primaryFields = [
      { key: "reward", label: "REWARD", value: logic.reward || "Free item" },
    ];
    secondaryFields = [
      { key: "progress", label: "PROGRESS", value: stampVisual },
    ];
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
  } else if (card.type === "points") {
    headerFields = [
      { key: "points", label: logic.pointsLabel || "POINTS", value: String(enrollment.points_balance) },
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
    auxiliaryFields = [{ key: "member", label: "MEMBER", value: enrollment.customer_name }];
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fidely-beta.vercel.app";
  backFields.push({ key: "progress", label: "CHECK YOUR PROGRESS", value: `Visit ${appUrl}/my/${enrollment.membership_code}` });
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
    auxiliaryFields,
    backFields,
    barcodeFormat: "QR",
    barcodeValue: `${process.env.NEXT_PUBLIC_APP_URL || "https://fidely-beta.vercel.app"}/scan/${enrollment.membership_code}`,
    stripImagePath: "/wallet/strip-reward.png",
    logoUrl: br.logoUrl || undefined,
    heroImageUrl: br.heroImageUrl || undefined,
    accentColor: br.accentColor || undefined,
    serialNumber: enrollment.id,
    authToken: enrollment.auth_token,
    stampsCollected: card.type === "stamp" ? enrollment.stamps_collected : undefined,
    totalStamps: card.type === "stamp" ? (logic.totalStamps || 10) : undefined,
  };
}
