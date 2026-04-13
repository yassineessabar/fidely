import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Business — Grow Revenue Without Ads",
  description: "Digital loyalty cards that bring customers back automatically. No app downloads, instant setup in Apple & Google Wallet. See +20-30% more repeat visits.",
  alternates: { canonical: "/business" },
  openGraph: {
    title: "Fidely for Business — Grow Revenue Without Ads",
    description: "Digital loyalty cards that bring customers back automatically. No app downloads, instant setup.",
    url: "/business",
  },
};

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(230,255,169)", margin: "0 0 16px" }}>For businesses</p>
          <h1 className="font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: "0 0 24px", maxWidth: "700px" }}>
            Grow your revenue without ads
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px", maxWidth: "600px", fontWeight: 400 }}>
            Get customer data from the first visit. Send free notifications. Bring them back automatically.
          </p>
          <a href="/signup" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "50px", padding: "0 32px", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", borderRadius: "9999px", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}>
            Start free trial
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {[
              { title: "Digital loyalty cards", desc: "Custom-branded cards for Apple Wallet and Google Wallet. Ready in 24 hours.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
              { title: "Customer database", desc: "Automatically collect name, email, and phone from every customer. No forms.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { title: "Push notifications", desc: "Send unlimited messages directly to their lock screen. Free, forever.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
              { title: "Analytics dashboard", desc: "Track visits, revenue, retention — know who comes back and who doesn't.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { title: "Fidely AI", desc: "Smart recommendations to boost visits. Predict slow days, win back lost customers.", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              { title: "Multi-location", desc: "One dashboard for all your stores. Centralised data, unified strategy.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((f) => (
              <div key={f.title} style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                </div>
                <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
