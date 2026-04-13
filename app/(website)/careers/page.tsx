import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Join Us & Build the Future of Local Business",
  description: "Join Fidely and help local businesses thrive. We're hiring engineers, designers, and marketers. Remote-first, meaningful work.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at Fidely — Build the Future of Local Business",
    description: "Join Fidely and help local businesses thrive. We're hiring engineers, designers, and marketers.",
    url: "/careers",
  },
};

const roles = [
  { title: "Full-Stack Engineer", location: "Remote / Paris", type: "Full-time", team: "Engineering" },
  { title: "Product Designer", location: "Remote / Paris", type: "Full-time", team: "Design" },
  { title: "Growth Marketing Manager", location: "Remote", type: "Full-time", team: "Marketing" },
  { title: "Customer Success Lead", location: "Paris", type: "Full-time", team: "Operations" },
  { title: "Sales Development Rep", location: "Remote / Paris", type: "Full-time", team: "Sales" },
];

export default function CareersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fidely.com" },
          { "@type": "ListItem", position: 2, name: "Careers", item: "https://fidely.com/careers" },
        ],
      }) }} />
      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h1 className="font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: "0 0 24px", maxWidth: "700px" }}>
            Build the future of local business
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgba(255,255,255,0.7)", margin: 0, maxWidth: "600px", fontWeight: 400 }}>
            Join a small, fast-moving team helping 500+ local businesses grow. Remote-friendly, impact-driven, zero bureaucracy.
          </p>
        </div>
      </section>

      {/* Open roles */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "40px", lineHeight: "42px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 48px" }}>
            Open positions
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {roles.map((role) => (
              <a
                key={role.title}
                href="#"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "24px 0", borderBottom: "1px solid rgba(0,0,0,0.06)",
                  textDecoration: "none", transition: "background-color 0.2s",
                }}
              >
                <div>
                  <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 4px" }}>{role.title}</h3>
                  <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: 0 }}>{role.team} · {role.location} · {role.type}</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "40px", lineHeight: "42px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 48px", textAlign: "center" }}>
            Why join Fidely
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {[
              { title: "Remote-first", desc: "Work from anywhere. We care about output, not hours at a desk." },
              { title: "Real impact", desc: "Every feature you ship directly helps local businesses grow their revenue." },
              { title: "Small team", desc: "No layers of management. Ship fast, learn fast, grow fast." },
              { title: "Equity", desc: "Every team member gets skin in the game." },
              { title: "Learning budget", desc: "Annual budget for courses, conferences, and books." },
              { title: "Flexible hours", desc: "Life comes first. Work when you're most productive." },
            ].map((perk) => (
              <div key={perk.title} style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>{perk.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", margin: 0 }}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
