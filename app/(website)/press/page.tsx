import { Metadata } from "next";
import KyroLogo from "../../components/KyroLogo";

export const metadata: Metadata = {
  title: "Press & Media — Company News & Resources",
  description: "Press resources, company facts, and media kit for Kyro. Download logos, read our story, and get in touch with our press team.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Kyro Press & Media — Company News & Resources",
    description: "Press resources, company facts, and media kit for Kyro.",
    url: "/press",
  },
};

export default function PressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
          { "@type": "ListItem", position: 2, name: "Press", item: "https://wearekyro.com/press" },
        ],
      }) }} />
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            Press & Media
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: "0 0 64px", fontWeight: 400, maxWidth: "600px" }}>
            Resources for journalists and media covering Kyro.
          </p>

          {/* Brand assets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "64px" }} className="ai-grid">
            <div style={{ backgroundColor: "rgb(11,5,29)", borderRadius: "24px", padding: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KyroLogo color="white" height={48} />
            </div>
            <div style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KyroLogo color="rgb(11,5,29)" height={48} />
            </div>
          </div>

          {/* Key facts */}
          <h2 className="font-display" style={{ fontSize: "40px", lineHeight: "42px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 32px" }}>
            Key facts
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "64px" }} className="pricing-grid">
            {[
              { label: "Founded", value: "2024" },
              { label: "Headquarters", value: "Paris, FR" },
              { label: "Businesses served", value: "500+" },
              { label: "Cards created", value: "2M+" },
            ].map((fact) => (
              <div key={fact.label} style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "16px", padding: "24px" }}>
                <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{fact.label}</p>
                <p className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>{fact.value}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "40px" }}>
            <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>Media inquiries</h3>
            <p style={{ fontSize: "16px", color: "rgb(97,95,109)", margin: 0 }}>
              For press inquiries, please contact <a href="mailto:press@kyro.com" style={{ color: "rgb(11,5,29)", textDecoration: "underline" }}>press@kyro.com</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
