import { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, getFeature } from "../features";

export async function generateStaticParams() {
  return features.map((f) => ({ feature: f.slug }));
}

export async function generateMetadata({ params }: { params: { feature: string } }): Promise<Metadata> {
  const feat = getFeature(params.feature);
  if (!feat) return {};
  return {
    title: feat.metaTitle,
    description: feat.metaDescription,
    alternates: { canonical: `/features/${feat.slug}` },
    openGraph: { title: feat.metaTitle, description: feat.metaDescription, url: `/features/${feat.slug}` },
  };
}

export default function FeaturePage({ params }: { params: { feature: string } }) {
  const feat = getFeature(params.feature);
  if (!feat) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: feat.metaTitle,
    description: feat.metaDescription,
    url: `https://wearekyro.com/features/${feat.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
        { "@type": "ListItem", position: 2, name: "Features", item: "https://wearekyro.com/features" },
        { "@type": "ListItem", position: 3, name: feat.name, item: `https://wearekyro.com/features/${feat.slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <span style={{ fontSize: "48px" }}>{feat.emoji}</span>
          <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "58px", fontWeight: 700, color: "white", margin: "16px 0" }}>
            {feat.headline}
          </h1>
          <p style={{ fontSize: "18px", lineHeight: "28px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            {feat.subtitle}
          </p>
          <a href="/signup" style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", borderRadius: "100px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}>
            Try it free →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "white", padding: "48px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {feat.stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "rgb(147,51,234)", margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "6px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 40px", textAlign: "center" }}>
            Why businesses choose {feat.name.toLowerCase()}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {feat.benefits.map((b) => (
              <div key={b.title} style={{ backgroundColor: "white", borderRadius: "16px", padding: "28px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <h3 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
                  {b.title}
                </h3>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: "24px", color: "rgb(97,95,109)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 40px", textAlign: "center" }}>
            How it works
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {feat.howItWorks.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgb(243,232,255)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "rgb(147,51,234)", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{step.step}</h3>
                  <p style={{ margin: 0, fontSize: "15px", lineHeight: "24px", color: "rgb(97,95,109)" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "white", margin: "0 0 16px" }}>
            Ready to try {feat.name.toLowerCase()}?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px" }}>
            Launch in 24 hours. No app required. Free trial included.
          </p>
          <a href="/signup" style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", borderRadius: "100px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}>
            Start free trial →
          </a>
        </div>
      </section>

      {/* Other features */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "48px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", textAlign: "center", margin: "0 0 16px" }}>Explore all features</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {features.filter((f) => f.slug !== feat.slug).map((f) => (
              <a key={f.slug} href={`/features/${f.slug}`} style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid rgb(213,213,221)", backgroundColor: "white", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                {f.emoji} {f.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
