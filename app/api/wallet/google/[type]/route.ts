import { NextRequest, NextResponse } from "next/server";
import { PassType } from "../../../../../lib/wallet/types";
import { getTemplate } from "../../../../../lib/wallet/templates";
import { generateGoogleWalletUrl, areGoogleCredentialsAvailable } from "../../../../../lib/wallet/google";

const VALID_TYPES: PassType[] = ["discount", "reward", "stamp", "cashback"];

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  if (!VALID_TYPES.includes(type as PassType)) {
    return NextResponse.json(
      { error: `Invalid pass type: ${type}. Valid types: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!areGoogleCredentialsAvailable()) {
    return NextResponse.json(
      {
        error: "Google Wallet credentials not configured",
        setup: "See docs/wallet-setup.md for credential setup instructions",
        hint: "Set GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, GOOGLE_WALLET_PRIVATE_KEY",
      },
      { status: 503 }
    );
  }

  const template = getTemplate(type as PassType);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    const origin = req.nextUrl.origin;
    const saveUrl = generateGoogleWalletUrl(template, origin);
    return NextResponse.json({ url: saveUrl });
  } catch (err) {
    console.error("Google Wallet pass generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate Google Wallet pass" },
      { status: 500 }
    );
  }
}
