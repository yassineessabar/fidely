import { PassTemplate, PassType } from "./types";

const FIDELY_PURPLE = "rgb(192,132,252)";
const FIDELY_LIGHT = "rgb(243,232,255)";
const FIDELY_DARK = "rgb(88,28,135)";

export const templates: Record<PassType, PassTemplate> = {
  discount: {
    type: "discount",
    merchantName: "Fidely",
    merchantId: "fidely-demo",
    logoText: "Fidely",
    description: "Make purchases, increase the discount",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
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
      { key: "powered", label: "POWERED BY", value: "Fidely - https://fidely.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-DISCOUNT-DEMO-001",
    stripImagePath: "/wallet/strip-discount.png",
  },

  reward: {
    type: "reward",
    merchantName: "Fidely",
    merchantId: "fidely-demo",
    logoText: "Fidely",
    description: "Collect points and get rewards",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
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
      { key: "powered", label: "POWERED BY", value: "Fidely - https://fidely.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-REWARD-DEMO-001",
    stripImagePath: "/wallet/strip-reward.png",
  },

  stamp: {
    type: "stamp",
    merchantName: "Fidely",
    merchantId: "fidely-demo",
    logoText: "Fidely",
    description: "Collect stamps to get rewards",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
    headerFields: [
      { key: "validUntil", label: "VALID UNTIL", value: "04/12/2027" },
    ],
    primaryFields: [
      { key: "stampsLeft", label: "STAMPS UNTIL THE REWARD", value: "9 stamps" },
    ],
    secondaryFields: [
      { key: "rewards", label: "AVAILABLE REWARDS", value: "0 rewards" },
    ],
    auxiliaryFields: [],
    backFields: [
      { key: "info", label: "HOW IT WORKS", value: "Collect 1 stamp per visit. After 10 stamps, redeem your free reward. Card resets after redemption." },
      { key: "powered", label: "POWERED BY", value: "Fidely - https://fidely.com" },
    ],
    barcodeFormat: "QR",
    barcodeValue: "FIDELY-STAMP-DEMO-001",
    stripImagePath: "/wallet/strip-stamp.png",
  },

  cashback: {
    type: "cashback",
    merchantName: "Fidely",
    merchantId: "fidely-demo",
    logoText: "Fidely",
    description: "Get bonus points for each purchase",
    backgroundColor: FIDELY_PURPLE,
    foregroundColor: FIDELY_LIGHT,
    labelColor: FIDELY_DARK,
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
      { key: "powered", label: "POWERED BY", value: "Fidely - https://fidely.com" },
    ],
    barcodeFormat: "PDF417",
    barcodeValue: "FIDELY-CASHBACK-DEMO-001",
    stripImagePath: "/wallet/strip-cashback.png",
  },
};

export function getTemplate(type: PassType): PassTemplate | undefined {
  return templates[type];
}
