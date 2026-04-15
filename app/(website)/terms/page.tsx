import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Kyro Terms of Service. Read our terms and conditions for using the Kyro digital loyalty platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const h2 = "font-display";
  const h2Style = { fontSize: "24px", fontWeight: 700 as const, color: "rgb(11,5,29)", margin: "48px 0 16px" };
  const pStyle = { fontSize: "16px", lineHeight: "26px", color: "rgb(55,53,68)", margin: "0 0 16px" };

  return (
    <section style={{ backgroundColor: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(147,51,234)", margin: "0 0 12px" }}>Legal</p>
        <h1 className="font-display" style={{ fontSize: "42px", lineHeight: "48px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 48px" }}>Last updated: April 1, 2025</p>

        <h2 className={h2} style={h2Style}>1. Acceptance of Terms</h2>
        <p style={pStyle}>
          By accessing or using Kyro ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all users, including merchants, their customers, and visitors to our website.
        </p>

        <h2 className={h2} style={h2Style}>2. Description of Service</h2>
        <p style={pStyle}>
          Kyro provides a digital loyalty card platform that enables businesses to create, manage, and distribute loyalty cards via Apple Wallet and Google Wallet. The Service includes a merchant dashboard, customer-facing wallet passes, push notification capabilities, and analytics tools.
        </p>

        <h2 className={h2} style={h2Style}>3. Account Registration</h2>
        <p style={pStyle}>
          To use the Service as a merchant, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
        </p>

        <h2 className={h2} style={h2Style}>4. Subscription and Billing</h2>
        <p style={pStyle}>
          Kyro offers subscription plans billed on a monthly basis. Prices are displayed on our pricing page and may be updated with 30 days&apos; notice. You may cancel your subscription at any time, effective at the end of the current billing period. No refunds are provided for partial months.
        </p>

        <h2 className={h2} style={h2Style}>5. Acceptable Use</h2>
        <p style={pStyle}>
          You agree to use the Service only for lawful purposes. You may not use Kyro to distribute misleading offers, collect data without proper consent, send spam notifications, or engage in any activity that violates applicable laws or regulations. We reserve the right to suspend accounts that violate these terms.
        </p>

        <h2 className={h2} style={h2Style}>6. Data and Privacy</h2>
        <p style={pStyle}>
          Customer data collected through loyalty cards (names, emails, phone numbers) is owned by the merchant. Kyro processes this data on behalf of the merchant in accordance with our Privacy Policy. Merchants are responsible for complying with applicable data protection laws, including GDPR where applicable.
        </p>

        <h2 className={h2} style={h2Style}>7. Intellectual Property</h2>
        <p style={pStyle}>
          The Kyro platform, including its design, code, logos, and documentation, is the intellectual property of Kyro. Merchants retain ownership of their brand assets, content, and customer data. You may not copy, modify, or distribute any part of the Kyro platform without written permission.
        </p>

        <h2 className={h2} style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>
          Kyro is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
        </p>

        <h2 className={h2} style={h2Style}>9. Termination</h2>
        <p style={pStyle}>
          Either party may terminate the agreement at any time. Upon termination, your access to the dashboard will cease and active wallet passes will no longer receive updates. We will retain your data for 30 days after termination, after which it will be permanently deleted unless otherwise required by law.
        </p>

        <h2 className={h2} style={h2Style}>10. Changes to Terms</h2>
        <p style={pStyle}>
          We may update these Terms of Service from time to time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes constitute acceptance of the new terms.
        </p>

        <h2 className={h2} style={h2Style}>11. Contact</h2>
        <p style={pStyle}>
          If you have questions about these Terms of Service, please contact us at <a href="mailto:legal@kyro.com" style={{ color: "rgb(147,51,234)", textDecoration: "underline", textUnderlineOffset: "2px" }}>legal@kyro.com</a>.
        </p>
      </div>
    </section>
  );
}
