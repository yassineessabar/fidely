import nodemailer from "nodemailer";

const SMTP_EMAIL = process.env.SMTP_EMAIL || "withkyro@gmail.com";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}): Promise<boolean> {
  if (!SMTP_PASSWORD) {
    console.log(`[EMAIL] No SMTP_PASSWORD set. Would send to: ${to}, Subject: ${subject}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: from || `Kyro <${SMTP_EMAIL}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });
    console.log(`[EMAIL] Sent to ${to}: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] Failed to send to ${to}:`, err);
    return false;
  }
}

export const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "withkyro@gmail.com";
