import { createAdminClient } from "@/lib/supabase/admin";
import { generateApplePass } from "@/lib/wallet/apple";
import { enrollmentToPassTemplate } from "@/lib/wallet/generate";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID || "pass.com.kyro.loyalty";

function getAuthToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("ApplePass ")) return null;
  return auth.slice(10);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const supabase = createAdminClient();
  const path = params.path;

  // POST /v1/devices/{deviceId}/registrations/{passTypeId}/{serialNumber}
  // path = ["devices", deviceId, "registrations", passTypeId, serialNumber]
  if (path[0] === "devices" && path[2] === "registrations" && path.length === 5) {
    const deviceId = path[1];
    const serialNumber = path[4];

    console.log(`[APNs] Device registration: device=${deviceId}, serial=${serialNumber}`);

    const authToken = getAuthToken(request);
    if (!authToken) {
      console.log("[APNs] No auth token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify auth token matches enrollment
    const { data: enrollment, error: enrollErr } = await supabase
      .from("card_enrollments" as any)
      .select("id, auth_token")
      .eq("id", serialNumber)
      .single();

    if (enrollErr) {
      console.log("[APNs] Enrollment lookup error:", enrollErr.message);
    }

    if (!enrollment || (enrollment as any).auth_token !== authToken) {
      console.log("[APNs] Auth mismatch. enrollment:", !!enrollment, "token match:", enrollment && (enrollment as any).auth_token === authToken);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { pushToken?: string } = {};
    try {
      body = await request.json();
    } catch {}

    if (!body.pushToken) {
      console.log("[APNs] No pushToken in body");
      return NextResponse.json({ error: "Missing pushToken" }, { status: 400 });
    }

    console.log(`[APNs] Registering pushToken=${body.pushToken.slice(0, 20)}...`);

    // Upsert registration
    const { error: upsertErr } = await supabase
      .from("pass_registrations" as any)
      .upsert({
        device_library_identifier: deviceId,
        push_token: body.pushToken,
        pass_type_identifier: PASS_TYPE_ID,
        serial_number: serialNumber,
      }, { onConflict: "device_library_identifier,pass_type_identifier,serial_number" });

    if (upsertErr) {
      console.error("[APNs] Upsert error:", upsertErr);
    } else {
      console.log("[APNs] Registration saved successfully");
    }

    return new Response(null, { status: 201 });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const supabase = createAdminClient();
  const path = params.path;

  // GET /v1/passes/{passTypeIdentifier}/{serialNumber}
  // path = ["passes", passTypeId, serialNumber]
  if (path[0] === "passes" && path.length === 3) {
    const serialNumber = path[2];

    const authToken = getAuthToken(request);
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch enrollment
    const { data: enrollment } = await supabase
      .from("card_enrollments" as any)
      .select("*")
      .eq("id", serialNumber)
      .single();

    if (!enrollment || (enrollment as any).auth_token !== authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const e = enrollment as any;

    // Fetch card
    const { data: card } = await supabase
      .from("loyalty_cards")
      .select("id, name, type, business_details, branding, logic")
      .eq("id", e.card_id)
      .single();

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const template = enrollmentToPassTemplate(card as any, {
      id: e.id,
      membership_code: e.membership_code,
      customer_name: e.customer_name,
      stamps_collected: e.stamps_collected,
      points_balance: e.points_balance,
      auth_token: e.auth_token,
    });

    try {
      const buffer = await generateApplePass(template);
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Last-Modified": new Date(e.updated_at || e.created_at).toUTCString(),
          "Cache-Control": "no-store",
        },
      });
    } catch (err: any) {
      console.error("Pass generation failed:", err);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
  }

  // GET /v1/devices/{deviceId}/registrations/{passTypeId}
  // path = ["devices", deviceId, "registrations", passTypeId]
  if (path[0] === "devices" && path[2] === "registrations" && path.length >= 4) {
    const deviceId = path[1];

    const { data: regs } = await supabase
      .from("pass_registrations" as any)
      .select("serial_number")
      .eq("device_library_identifier", deviceId)
      .eq("pass_type_identifier", PASS_TYPE_ID);

    if (!regs || (regs as any[]).length === 0) {
      return new Response(null, { status: 204 });
    }

    return NextResponse.json({
      serialNumbers: (regs as any[]).map(r => r.serial_number),
      lastUpdated: new Date().toISOString(),
    });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const supabase = createAdminClient();
  const path = params.path;

  // DELETE /v1/devices/{deviceId}/registrations/{passTypeId}/{serialNumber}
  // path = ["devices", deviceId, "registrations", passTypeId, serialNumber]
  if (path[0] === "devices" && path[2] === "registrations" && path.length === 5) {
    const deviceId = path[1];
    const serialNumber = path[4];

    const authToken = getAuthToken(request);
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase
      .from("pass_registrations" as any)
      .delete()
      .eq("device_library_identifier", deviceId)
      .eq("serial_number", serialNumber)
      .eq("pass_type_identifier", PASS_TYPE_ID);

    return new Response(null, { status: 200 });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
