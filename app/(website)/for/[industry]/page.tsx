import { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "../industries";

export async function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: { params: { industry: string } }): Promise<Metadata> {
  const ind = getIndustry(params.industry);
  if (!ind) return {};
  return {
    title: ind.metaTitle,
    description: ind.metaDescription,
    alternates: { canonical: `/for/${ind.slug}` },
    openGraph: { title: ind.metaTitle, description: ind.metaDescription, url: `/for/${ind.slug}` },
  };
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const ind = getIndustry(params.industry);
  if (!ind) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: ind.metaTitle,
    description: ind.metaDescription,
    url: `https://fidely.com/for/${ind.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://fidely.com" },
        { "@type": "ListItem", position: 2, name: ind.name, item: `https://fidely.com/for/${ind.slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(230,255,169)", margin: "0 0 16px" }}>
            {ind.emoji} Fidely for {ind.name}
          </p>
          <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "58px", fontWeight: 700, color: "white", margin: "0 0 20px" }}>
            {ind.headline}
          </h1>
          <p style={{ fontSize: "18px", lineHeight: "28px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px" }}>
            {ind.heroSubtitle}
          </p>
          <a href="/signup" style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", borderRadius: "100px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}>
            {ind.cta} →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "white", padding: "60px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {ind.stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p className="font-display" style={{ fontSize: "42px", fontWeight: 700, color: "rgb(147,51,234)", margin: "0", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "6px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 32px", textAlign: "center" }}>
            Sound familiar?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ind.painPoints.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "20px", backgroundColor: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <span style={{ color: "rgb(220,38,38)", fontSize: "18px", flexShrink: 0 }}>✗</span>
                <p style={{ margin: 0, fontSize: "16px", lineHeight: "24px", color: "rgb(55,53,68)" }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 32px", textAlign: "center" }}>
            How Fidely helps {ind.name.toLowerCase()}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ind.benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "20px", backgroundColor: "rgb(243,232,255)", borderRadius: "12px" }}>
                <span style={{ color: "rgb(147,51,234)", fontSize: "18px", flexShrink: 0 }}>✓</span>
                <p style={{ margin: 0, fontSize: "16px", lineHeight: "24px", color: "rgb(55,53,68)" }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: "22px", lineHeight: "34px", color: "rgb(11,5,29)", fontStyle: "italic", margin: "0 0 20px" }}>
            &ldquo;{ind.testimonial.quote}&rdquo;
          </p>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "rgb(11,5,29)", margin: 0 }}>{ind.testimonial.author}</p>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "4px 0 0" }}>{ind.testimonial.business}</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 700, color: "white", margin: "0 0 16px" }}>
            Ready to grow your {ind.name.toLowerCase().replace(/s$/, "")}?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px" }}>
            Launch your digital loyalty program in 24 hours. No app needed. Free trial.
          </p>
          <a href="/signup" style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", borderRadius: "100px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}>
            {ind.cta} →
          </a>
        </div>
      </section>

      {/* Other industries */}
      <section style={{ backgroundColor: "white", padding: "60px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", textAlign: "center", margin: "0 0 16px" }}>Fidely works for every local business</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {industries.filter((i) => i.slug !== ind.slug).map((i) => (
              <a key={i.slug} href={`/for/${i.slug}`} style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid rgb(213,213,221)", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                {i.emoji} {i.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
