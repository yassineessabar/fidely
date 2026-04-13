import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Fidely Privacy Policy. Learn how we collect, use, and protect your data on our digital loyalty card platform.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const h2 = "font-display";
  const h2Style = { fontSize: "24px", fontWeight: 700 as const, color: "rgb(11,5,29)", margin: "48px 0 16px" };
  const h3Style = { fontSize: "18px", fontWeight: 700 as const, color: "rgb(11,5,29)", margin: "32px 0 8px" };
  const pStyle = { fontSize: "16px", lineHeight: "26px", color: "rgb(55,53,68)", margin: "0 0 16px" };
  const ulStyle = { margin: "0 0 16px", paddingLeft: "24px", fontSize: "16px", lineHeight: "26px", color: "rgb(55,53,68)" };
  const liStyle = { marginBottom: "8px" };

  return (
    <section style={{ backgroundColor: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(147,51,234)", margin: "0 0 12px" }}>Legal</p>
        <h1 className="font-display" style={{ fontSize: "42px", lineHeight: "48px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 48px" }}>Last updated: April 1, 2025</p>

        <p style={pStyle}>
          At Fidely, we take your privacy seriously. This policy explains what data we collect, how we use it, and your rights regarding your information. This policy applies to merchants using our platform, their customers who use digital loyalty cards, and visitors to our website.
        </p>

        <h2 className={h2} style={h2Style}>1. Data We Collect</h2>

        <h3 className={h2} style={h3Style}>From Merchants</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>Account information: company name, contact name, email address, phone number</li>
          <li style={liStyle}>Billing information: processed securely through our payment provider</li>
          <li style={liStyle}>Usage data: dashboard activity, feature usage, login history</li>
        </ul>

        <h3 className={h2} style={h3Style}>From Customers (via Loyalty Cards)</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>Personal information: first name, last name, email address, phone number</li>
          <li style={liStyle}>Loyalty data: visit history, stamps/points earned, rewards redeemed</li>
          <li style={liStyle}>Device information: wallet type (Apple/Google), pass installation date</li>
        </ul>

        <h3 className={h2} style={h3Style}>From Website Visitors</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>Analytics data: pages visited, time on site, referral source</li>
          <li style={liStyle}>Technical data: browser type, device type, IP address (anonymized)</li>
        </ul>

        <h2 className={h2} style={h2Style}>2. How We Use Your Data</h2>
        <ul style={ulStyle}>
          <li style={liStyle}><strong>Service delivery:</strong> To operate the loyalty card platform and provide features you use</li>
          <li style={liStyle}><strong>Communication:</strong> To send account-related notifications, updates, and support responses</li>
          <li style={liStyle}><strong>Analytics:</strong> To understand usage patterns and improve the Service</li>
          <li style={liStyle}><strong>Push notifications:</strong> To deliver merchant-initiated messages to customers via wallet passes</li>
          <li style={liStyle}><strong>Legal compliance:</strong> To comply with applicable laws and regulations</li>
        </ul>
        <p style={pStyle}>
          We do not sell, rent, or trade personal data to third parties. We do not use customer data for advertising purposes.
        </p>

        <h2 className={h2} style={h2Style}>3. Data Ownership</h2>
        <p style={pStyle}>
          Customer data collected through loyalty cards belongs to the merchant. Fidely processes this data as a data processor on behalf of the merchant (the data controller). Merchants are responsible for obtaining proper consent from their customers and complying with applicable data protection laws.
        </p>

        <h2 className={h2} style={h2Style}>4. Data Security</h2>
        <p style={pStyle}>
          We use industry-standard security measures to protect your data, including encryption in transit (TLS), encryption at rest, secure authentication, and regular security audits. Access to personal data is restricted to authorized personnel who need it to operate the Service.
        </p>

        <h2 className={h2} style={h2Style}>5. Data Retention</h2>
        <p style={pStyle}>
          We retain merchant account data for the duration of the subscription and 30 days after account closure. Customer loyalty data is retained as long as the merchant&apos;s account is active. Upon account termination, all associated data is permanently deleted within 30 days unless required by law.
        </p>

        <h2 className={h2} style={h2Style}>6. Your Rights</h2>
        <p style={pStyle}>Under applicable data protection laws (including GDPR), you have the right to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li style={liStyle}><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
          <li style={liStyle}><strong>Erasure:</strong> Request deletion of your personal data</li>
          <li style={liStyle}><strong>Portability:</strong> Request your data in a machine-readable format</li>
          <li style={liStyle}><strong>Objection:</strong> Object to processing of your personal data</li>
          <li style={liStyle}><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
        </ul>
        <p style={pStyle}>
          To exercise any of these rights, contact us at <a href="mailto:privacy@fidely.com" style={{ color: "rgb(147,51,234)", textDecoration: "underline", textUnderlineOffset: "2px" }}>privacy@fidely.com</a>.
        </p>

        <h2 className={h2} style={h2Style}>7. Cookies</h2>
        <p style={pStyle}>
          We use essential cookies to operate the Service (authentication, session management). We use analytics cookies to understand how visitors use our website. You can disable non-essential cookies in your browser settings. The Service will continue to function with only essential cookies.
        </p>

        <h2 className={h2} style={h2Style}>8. Third-Party Services</h2>
        <p style={pStyle}>
          We use third-party services to operate the platform, including cloud hosting, payment processing, and analytics. These providers are bound by data processing agreements and may only process data as instructed by us. We do not share personal data with third parties for their own marketing purposes.
        </p>

        <h2 className={h2} style={h2Style}>9. International Transfers</h2>
        <p style={pStyle}>
          Data may be processed in countries outside your country of residence. Where data is transferred outside the EEA, we ensure appropriate safeguards are in place, including Standard Contractual Clauses or adequacy decisions.
        </p>

        <h2 className={h2} style={h2Style}>10. Changes to This Policy</h2>
        <p style={pStyle}>
          We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service. The "Last updated" date at the top of this page indicates when the policy was last revised.
        </p>

        <h2 className={h2} style={h2Style}>11. Contact Us</h2>
        <p style={pStyle}>
          For any privacy-related questions or requests, contact our data protection team at <a href="mailto:privacy@fidely.com" style={{ color: "rgb(147,51,234)", textDecoration: "underline", textUnderlineOffset: "2px" }}>privacy@fidely.com</a>.
        </p>
      </div>
    </section>
  );
}
