import { PassTemplate, PassType } from "./types";

const KYRO_PURPLE = "rgb(192,132,252)";
const KYRO_LIGHT = "rgb(243,232,255)";
const KYRO_DARK = "rgb(88,28,135)";

export const templates: Record<PassType, PassTemplate> = {
  discount: {
    type: "discount",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Make purchases, increase the discount",
    backgroundColor: KYRO_PURPLE,
    foregroundColor: KYRO_LIGHT,
    labelColor: KYRO_DARK,
    headerFields: [],
    primaryFields: [
      { key: "discount", label: "DISCOUNT PERCENTAGE", value: "5%" },
    ],
    secondaryFields: [
      { key: "status", label: "DISCOUNT STATUS", value: "Bronze" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "ABOUT", value: "Present this card at checkout to receive your discount. Your tier upgrades automatically as you spend more." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://wearekyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "KYRO-DISCOUNT-DEMO-001",
    stripImagePath: "/wallet/strip-discount.png",
  },

  reward: {
    type: "reward",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Collect points and get rewards",
    backgroundColor: KYRO_PURPLE,
    foregroundColor: KYRO_LIGHT,
    labelColor: KYRO_DARK,
    headerFields: [
      { key: "balance", label: "BALANCE", value: 23 },
    ],
    primaryFields: [
      { key: "reward", label: "REWARD", value: "$15 OFF" },
    ],
    secondaryFields: [
      { key: "tillNext", label: "TILL THE NEXT REWARD", value: 17 },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Earn 1 point per $1 spent. Redeem points for exclusive rewards at any time." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://wearekyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "KYRO-REWARD-DEMO-001",
    stripImagePath: "/wallet/strip-reward.png",
  },

  stamp: {
    type: "stamp",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Collect stamps to get rewards",
    backgroundColor: KYRO_PURPLE,
    foregroundColor: KYRO_LIGHT,
    labelColor: KYRO_DARK,
    headerFields: [
      { key: "validUntil", label: "VALID UNTIL", value: "04/12/2027" },
    ],
    primaryFields: [
      { key: "stampsLeft", label: "STAMPS UNTIL THE REWARD", value: "9 stamps" },
    ],
    secondaryFields: [
      { key: "member", label: "MEMBER", value: "Jane Smith" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Collect 1 stamp per visit. After 10 stamps, redeem your free reward. Card resets after redemption." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://wearekyro.com" },
    ],
    barcodeFormat: "QR",
    barcodeValue: "KYRO-STAMP-DEMO-001",
    stripImagePath: "/wallet/strip-stamp.png",
  },

  cashback: {
    type: "cashback",
    merchantName: "Kyro",
    merchantId: "kyro-demo",
    logoText: "Kyro",
    description: "Get bonus points for each purchase",
    backgroundColor: KYRO_PURPLE,
    foregroundColor: KYRO_LIGHT,
    labelColor: KYRO_DARK,
    headerFields: [
      { key: "points", label: "POINTS", value: "0,00" },
    ],
    primaryFields: [
      { key: "cashback", label: "CASHBACK PERCENTAGE", value: "5%" },
    ],
    secondaryFields: [
      { key: "status", label: "CASHBACK STATUS", value: "Starter" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Earn 5% cashback on every purchase. Cashback is credited to your points balance instantly." },
      { key: "powered", label: "POWERED BY", value: "Kyro - https://wearekyro.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "KYRO-CASHBACK-DEMO-001",
    stripImagePath: "/wallet/strip-cashback.png",
  },
};

export function getTemplate(type: PassType): PassTemplate | undefined {
  return templates[type];
}
