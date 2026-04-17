"use client";

import { useInView } from "../../hooks/useInView";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Scan",
    desc: "Point your camera at the QR code on the counter. No app needed — your phone handles it.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(230,255,169)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h3" /><path d="M20 7V4h-3" /><path d="M4 17v3h3" /><path d="M20 17v3h-3" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M10 10h4v4h-4z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Add to Wallet",
    desc: "One tap to add your loyalty card to Apple Wallet or Google Wallet. Done in 2 seconds.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(230,255,169)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Earn rewards",
    desc: "Every visit counts. Watch your progress grow and get notified when a reward is ready.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(230,255,169)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const benefits = [
  {
    title: "No app download",
    desc: "Works with the wallet already on your phone. Nothing to install, nothing to update.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "No account needed",
    desc: "No email. No password. No forms. Just scan the code and you're in.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M16 3l2 2-2 2" />
      </svg>
    ),
  },
  {
    title: "Free rewards",
    desc: "Earn points or stamps every visit. Unlock free products and exclusive deals automatically.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
        <path d="M12 12V3" />
        <path d="M2 12h20" />
        <path d="M12 3a4 4 0 014 4H8a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: "Lock screen alerts",
    desc: "Get notified when you have a reward waiting or a flash deal nearby. Never miss out.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    title: "Works everywhere",
    desc: "Apple Wallet, Google Wallet — it doesn't matter. One card works on every phone.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Always with you",
    desc: "Your card lives in your phone. No plastic to carry, no paper to lose. It's just there.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(108,71,255)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
];

export default function CustomersPage() {
  const hero = useInView();
  const stepsSection = useInView();
  const benefitsSection = useInView();
  const ctaSection = useInView();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://wearekyro.com" },
          { "@type": "ListItem", position: 2, name: "For Customers", item: "https://wearekyro.com/customers" },
        ],
      }) }} />

      {/* ===== HERO ===== */}
      <section
        ref={hero.ref}
        style={{
          backgroundColor: "rgb(11,5,29)",
          padding: "120px 0 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "-200px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-150px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
            <div
              className={hero.isVisible ? "animate-fade-in-up" : ""}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(230,255,169,0.1)",
                border: "1px solid rgba(230,255,169,0.2)",
                marginBottom: "32px",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgb(230,255,169)" }} />
              <span style={{ fontSize: "13px", fontWeight: 500, color: "rgb(230,255,169)" }}>For customers</span>
            </div>

            <h1
              className={`font-display ${hero.isVisible ? "animate-fade-in-up" : ""}`}
              style={{
                fontSize: "clamp(40px, 7vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 500,
                color: "white",
                margin: "0 0 24px",
                animationDelay: "100ms",
              }}
            >
              Rewards in your
              <span style={{ display: "block", color: "rgb(230,255,169)" }}>wallet, not an app</span>
            </h1>

            <p
              className={hero.isVisible ? "animate-fade-in-up" : ""}
              style={{
                fontSize: "18px",
                lineHeight: "28px",
                color: "rgba(255,255,255,0.6)",
                margin: "0 auto 40px",
                maxWidth: "520px",
                fontWeight: 400,
                animationDelay: "200ms",
              }}
            >
              Scan a QR code. Add your card. Earn rewards. It takes 2 taps and lives right in Apple Wallet or Google Wallet.
            </p>

            <div
              className={hero.isVisible ? "animate-fade-in-up" : ""}
              style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", animationDelay: "300ms" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Apple Wallet</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14.8 8.5c.6.35.6 1.25 0 1.6l-14.8 8.5c-.66.5-1.6.03-1.6-.8z" fill="#4285F4"/></svg>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Google Wallet</span>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div
            className={hero.isVisible ? "animate-fade-in-up" : ""}
            style={{
              marginTop: "64px",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              animationDelay: "400ms",
            }}
          >
            <Image
              src="/images/customers/customers-hero.png"
              alt="Customer adding loyalty card to Apple Wallet"
              width={1140}
              height={500}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        ref={stepsSection.ref}
        style={{ backgroundColor: "white", padding: "100px 0" }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className={stepsSection.isVisible ? "animate-fade-in-up" : ""}
            style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 64px" }}
          >
            <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(108,71,255)", margin: "0 0 12px" }}>
              3 steps
            </p>
            <h2 className="font-display section-h2" style={{ fontSize: "48px", lineHeight: 1.1, fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
              How it works
            </h2>
            <p style={{ fontSize: "17px", lineHeight: "26px", color: "rgb(97,95,109)", margin: 0 }}>
              From zero to rewards in under 10 seconds.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="pricing-grid">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={stepsSection.isVisible ? "animate-fade-in-up" : ""}
                style={{
                  animationDelay: `${i * 120}ms`,
                  backgroundColor: "rgb(11,5,29)",
                  borderRadius: "24px",
                  padding: "40px 32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background number */}
                <span
                  className="font-display"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-10px",
                    fontSize: "160px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.03)",
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {s.num}
                </span>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(230,255,169,0.08)",
                    border: "1px solid rgba(230,255,169,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}>
                    {s.icon}
                  </div>

                  <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "8px" }}>
                    Step {s.num}
                  </span>

                  <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 600, color: "white", margin: "0 0 12px" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "15px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section
        ref={benefitsSection.ref}
        style={{ backgroundColor: "rgb(249,248,245)", padding: "100px 0" }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "64px", alignItems: "start" }} className="ai-grid">
            {/* Left — sticky heading */}
            <div
              className={benefitsSection.isVisible ? "animate-fade-in-up" : ""}
              style={{ position: "sticky", top: "120px" }}
            >
              <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(108,71,255)", margin: "0 0 12px" }}>
                Benefits
              </p>
              <h2 className="font-display section-h2" style={{ fontSize: "44px", lineHeight: 1.1, fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 20px" }}>
                Why you&apos;ll love it
              </h2>
              <p style={{ fontSize: "17px", lineHeight: "26px", color: "rgb(97,95,109)", margin: "0 0 32px", maxWidth: "360px" }}>
                No downloads. No friction. Just rewards that live right in your phone.
              </p>

              <div style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Image
                  src="/images/customers/customers-wallet.png"
                  alt="Loyalty card in phone wallet"
                  width={400}
                  height={300}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>

            {/* Right — benefit cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="dashboard-kpi-row">
              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className={benefitsSection.isVisible ? "animate-fade-in-up" : ""}
                  style={{
                    animationDelay: `${i * 80}ms`,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "28px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(108,71,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}>
                    {b.icon}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "17px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: "21px", color: "rgb(97,95,109)", margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section
        ref={ctaSection.ref}
        style={{
          backgroundColor: "rgb(11,5,29)",
          padding: "100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,71,255,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2
            className={`font-display section-h2 ${ctaSection.isVisible ? "animate-fade-in-up" : ""}`}
            style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1, fontWeight: 500, color: "white", margin: "0 0 20px" }}
          >
            Next time you see a QR code — scan it
          </h2>
          <p
            className={ctaSection.isVisible ? "animate-fade-in-up" : ""}
            style={{ fontSize: "17px", lineHeight: "26px", color: "rgba(255,255,255,0.5)", margin: "0 0 40px", animationDelay: "100ms" }}
          >
            Join thousands of customers who earn rewards without downloading another app.
          </p>
          <div
            className={ctaSection.isVisible ? "animate-fade-in-up" : ""}
            style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", animationDelay: "200ms" }}
          >
            <a
              href="/business"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "999px",
                backgroundColor: "white",
                color: "rgb(11,5,29)",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              Are you a business?
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
