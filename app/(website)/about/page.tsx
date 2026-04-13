import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Our Mission to Help Local Businesses Grow",
  description: "Fidely was born to help local businesses grow by keeping customers coming back. Learn about our mission, values, and the team building the future of customer retention.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Fidely — Our Mission to Help Local Businesses Grow",
    description: "Fidely was born to help local businesses grow by keeping customers coming back.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fidely.com" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://fidely.com/about" },
        ],
      }) }} />
      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(230,255,169)", margin: "0 0 16px" }}>About Fidely</p>
          <h1 className="font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: "0 0 24px", maxWidth: "700px" }}>
            We help local businesses grow
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgba(255,255,255,0.7)", margin: 0, maxWidth: "600px", fontWeight: 400 }}>
            Fidely was born from a simple insight: local businesses lose customers not because of bad products, but because they have no way to stay in touch.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }} className="ai-grid">
            <div>
              <h2 className="font-display" style={{ fontSize: "41px", lineHeight: "43px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 24px" }}>
                Our mission
              </h2>
              <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(97,95,109)", margin: "0 0 16px" }}>
                We believe every local business deserves the same retention tools as the biggest brands — without the complexity or cost.
              </p>
              <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(97,95,109)", margin: 0 }}>
                Fidely makes customer retention simple: a digital loyalty card in their wallet, automatic data collection, and free push notifications to bring them back.
              </p>
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: "41px", lineHeight: "43px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 24px" }}>
                The numbers
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {[
                  { value: "500+", label: "Local businesses" },
                  { value: "2M+", label: "Cards created" },
                  { value: "+34%", label: "Avg. repeat rate" },
                  { value: "24h", label: "Setup time" },
                ].map((s) => (
                  <div key={s.label} style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "16px", padding: "24px" }}>
                    <p className="font-display" style={{ fontSize: "32px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{s.value}</p>
                    <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 48px", textAlign: "center" }}>
            What we believe
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {[
              { title: "Simplicity first", desc: "If it's not simple, merchants won't use it. We obsess over removing friction." },
              { title: "Results matter", desc: "We measure success by one metric: more repeat customers for your business." },
              { title: "Fair pricing", desc: "No per-message fees, no hidden costs. One price, unlimited value." },
            ].map((v) => (
              <div key={v.title} style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px" }}>
                <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 12px" }}>{v.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(97,95,109)", margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
