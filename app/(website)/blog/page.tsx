import { Metadata } from "next";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog — Loyalty Marketing Tips & Insights",
  description: "Expert tips on customer retention, loyalty programs, and digital marketing for local businesses. Learn how to bring customers back and grow revenue.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Kyro Blog — Loyalty Marketing Tips & Insights",
    description: "Expert tips on customer retention, loyalty programs, and digital marketing for local businesses.",
    url: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://wearekyro.com/blog" },
        ],
      }) }} />
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
            Blog
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: "0 0 64px", fontWeight: 400 }}>
            Insights on customer retention, loyalty, and growing your local business.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {posts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", transition: "transform 0.3s" }}>
                <div style={{ backgroundColor: post.color, borderRadius: "32px", height: "200px", marginBottom: "16px", display: "flex", alignItems: "flex-end", padding: "20px" }}>
                  <span style={{ backgroundColor: "rgba(11,5,29,0.08)", borderRadius: "100px", padding: "4px 12px", fontSize: "12px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    {post.category}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: "0 0 8px" }}>{post.date} · {post.readTime}</p>
                <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, lineHeight: "26px", color: "rgb(11,5,29)", margin: "0 0 8px" }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", margin: 0 }}>{post.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
