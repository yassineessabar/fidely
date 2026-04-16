import * as http2 from "http2";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID || "pass.com.kyro.loyalty";

function loadCert(envVar: string, filePath: string): Buffer | null {
  if (process.env[envVar]) {
    return Buffer.from(process.env[envVar]!, "base64");
  }
  const resolved = join(process.cwd(), filePath);
  if (existsSync(resolved)) {
    return readFileSync(resolved);
  }
  return null;
}

/**
 * Send a push notification to Apple to trigger a pass update.
 * Uses the same pass signing certificate for APNs authentication.
 */
export async function sendPassUpdatePush(pushToken: string): Promise<boolean> {
  const cert = loadCert("APPLE_PASS_CERT_B64", "./certs/pass.pem");
  const key = loadCert("APPLE_PASS_KEY_B64", "./certs/pass-key.pem");

  if (!cert || !key) {
    console.error("APNs: Missing certificates");
    return false;
  }

  return new Promise((resolve) => {
    try {
      const client = http2.connect("https://api.push.apple.com", {
        cert,
        key,
      });

      client.on("error", (err) => {
        console.error("APNs connection error:", err);
        resolve(false);
      });

      const req = client.request({
        ":method": "POST",
        ":path": `/3/device/${pushToken}`,
        "apns-topic": PASS_TYPE_ID,
        "apns-push-type": "background",
        "apns-priority": "5",
      });

      req.write(JSON.stringify({}));
      req.end();

      req.on("response", (headers) => {
        const status = headers[":status"];
        if (status === 200) {
          resolve(true);
        } else {
          console.error("APNs push failed:", status);
          resolve(false);
        }
        client.close();
      });

      req.on("error", (err) => {
        console.error("APNs request error:", err);
        resolve(false);
        client.close();
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        resolve(false);
        client.close();
      }, 10000);
    } catch (err) {
      console.error("APNs error:", err);
      resolve(false);
    }
  });
}

/**
 * Send push updates to all devices that have a specific pass.
 */
export async function notifyPassUpdate(serialNumber: string, supabase: any): Promise<void> {
  const { data: registrations } = await supabase
    .from("pass_registrations")
    .select("push_token")
    .eq("serial_number", serialNumber);

  if (!registrations || registrations.length === 0) {
    console.log(`[APNs] No device registrations found for serial=${serialNumber}`);
    return;
  }

  console.log(`[APNs] Sending push to ${registrations.length} device(s) for serial=${serialNumber}`);
  for (const reg of registrations) {
    const ok = await sendPassUpdatePush(reg.push_token);
    console.log(`[APNs] Push to ${reg.push_token.slice(0, 20)}... result: ${ok}`);
  }
}
