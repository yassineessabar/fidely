"use client";


const plans = [
  {
    name: "Starter",
    price: "49",
    period: "/month",
    desc: "Replace paper loyalty cards with a digital experience.",
    features: [
      "1 location",
      "Digital loyalty card (Apple & Google Wallet)",
      "QR code for in-store",
      "Up to 150 customers",
      "Basic customer capture",
    ],
    excluded: ["No push notifications"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "79",
    period: "/month",
    desc: "Bring customers back automatically with campaigns and analytics.",
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Up to 10 push campaigns/month",
      "Basic analytics",
      "Up to 500 customers",
    ],
    excluded: [],
    cta: "Start free trial",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Pro",
    price: "129",
    period: "/month",
    desc: "Maximize customer retention with unlimited power.",
    features: [
      "1 location",
      "Digital loyalty card",
      "QR code",
      "Unlimited push campaigns",
      "Advanced analytics",
      "Unlimited customers",
      "Priority support",
    ],
    excluded: [],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For multi-location brands with dedicated support.",
    features: [
      "Multiple locations",
      "Centralized dashboard (multi-store)",
      "Unlimited customers",
      "Unlimited push campaigns",
      "Advanced analytics (per location + global)",
      "Custom branding",
      "Dedicated support",
    ],
    excluded: [],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 64px" }}>
            <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
              Simple, transparent pricing
            </h1>
            <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
              No hidden fees. No cost per message. Cancel anytime.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                style={{
                  borderRadius: "24px",
                  padding: "40px",
                  border: plan.highlight ? "2px solid rgb(11,5,29)" : "1px solid rgb(228,227,223)",
                  backgroundColor: plan.highlight ? "rgb(11,5,29)" : "white",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)",
                    padding: "6px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                  }}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: plan.highlight ? "white" : "rgb(11,5,29)", margin: "0 0 8px" }}>
                  {plan.name}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                  <span className="font-display" style={{ fontSize: plan.price === "Custom" ? "36px" : "48px", fontWeight: 700, color: plan.highlight ? "white" : "rgb(11,5,29)" }}>
                    {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                  </span>
                  {plan.period && <span style={{ fontSize: "16px", color: plan.highlight ? "rgba(255,255,255,0.5)" : "rgb(97,95,109)" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: plan.highlight ? "rgba(255,255,255,0.6)" : "rgb(97,95,109)", margin: "0 0 32px" }}>
                  {plan.desc}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: plan.highlight ? "rgba(255,255,255,0.8)" : "rgb(55,53,68)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "rgb(230,255,169)" : "rgb(11,5,29)"} strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {(plan as any).excluded?.map((f: string) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: plan.highlight ? "rgba(255,255,255,0.3)" : "rgba(97,95,109,0.6)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "rgba(255,255,255,0.3)" : "rgba(97,95,109,0.4)"} strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "50px", borderRadius: "9999px", fontSize: "16px", fontWeight: 500, textDecoration: "none",
                    backgroundColor: plan.highlight ? "rgb(230,255,169)" : "rgb(11,5,29)",
                    color: plan.highlight ? "rgb(11,5,29)" : "white",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p style={{ textAlign: "center", marginTop: "48px", fontSize: "14px", color: "rgb(97,95,109)" }}>
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>
    </>
  );
}
