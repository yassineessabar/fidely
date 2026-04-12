import { NextRequest, NextResponse } from "next/server";
import { PassType } from "../../../../../lib/wallet/types";
import { getTemplate } from "../../../../../lib/wallet/templates";
import { generateApplePass, areCertificatesAvailable } from "../../../../../lib/wallet/apple";

const VALID_TYPES: PassType[] = ["discount", "reward", "stamp", "cashback"];

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  if (!VALID_TYPES.includes(type as PassType)) {
    return NextResponse.json(
      { error: `Invalid pass type: ${type}. Valid types: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!areCertificatesAvailable()) {
    return NextResponse.json(
      {
        error: "Apple Wallet certificates not configured",
        setup: "See docs/wallet-setup.md for certificate setup instructions",
        hint: "Set APPLE_TEAM_ID, APPLE_PASS_TYPE_ID, APPLE_PASS_CERT_PATH, APPLE_PASS_KEY_PATH, APPLE_WWDR_CERT_PATH",
      },
      { status: 503 }
    );
  }

  const template = getTemplate(type as PassType);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    const buffer = await generateApplePass(template);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="fidely-${type}.pkpass"`,
      },
    });
  } catch (err) {
    console.error("Apple Wallet pass generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate Apple Wallet pass" },
      { status: 500 }
    );
  }
}
