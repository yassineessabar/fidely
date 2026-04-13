import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Loyalty Marketing Tips & Insights",
  description: "Expert tips on customer retention, loyalty programs, and digital marketing for local businesses. Learn how to bring customers back and grow revenue.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Fidely Blog — Loyalty Marketing Tips & Insights",
    description: "Expert tips on customer retention, loyalty programs, and digital marketing for local businesses.",
    url: "/blog",
  },
};

const posts = [
  { title: "Why paper loyalty cards are costing you customers", desc: "Most paper cards get lost within a week. Here's why digital is the future of customer retention.", date: "Mar 28, 2025", category: "Retention", color: "rgb(230,255,169)" },
  { title: "How Café Bloom increased revenue by 30% in 3 weeks", desc: "A case study on how a small Parisian café used Fidely to transform their customer retention.", date: "Mar 15, 2025", category: "Case Study", color: "rgb(170,137,242)" },
  { title: "The push notification advantage: free marketing forever", desc: "SMS costs money. Ads cost money. Push notifications to Apple Wallet? Free. Here's how to use them.", date: "Mar 8, 2025", category: "Marketing", color: "rgb(228,227,223)" },
  { title: "5 retention strategies every local business should know", desc: "Simple, proven techniques to get customers to come back — no marketing degree required.", date: "Feb 22, 2025", category: "Strategy", color: "rgb(249,248,245)" },
  { title: "Apple Wallet vs. apps: why less is more", desc: "Your customers don't want another app. They want something that just works.", date: "Feb 14, 2025", category: "Product", color: "rgb(230,255,169)" },
  { title: "How to collect customer data without being creepy", desc: "The ethical way to build a customer database that actually drives revenue.", date: "Feb 5, 2025", category: "Data", color: "rgb(170,137,242)" },
];

export default function BlogPage() {
  return (
    <>
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
              <a key={post.title} href="#" style={{ textDecoration: "none", display: "flex", flexDirection: "column", transition: "transform 0.3s" }}>
                <div style={{ backgroundColor: post.color, borderRadius: "32px", height: "200px", marginBottom: "16px", display: "flex", alignItems: "flex-end", padding: "20px" }}>
                  <span style={{ backgroundColor: "rgba(11,5,29,0.08)", borderRadius: "100px", padding: "4px 12px", fontSize: "12px", fontWeight: 500, color: "rgb(11,5,29)" }}>
                    {post.category}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "rgb(97,95,109)", margin: "0 0 8px" }}>{post.date}</p>
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
