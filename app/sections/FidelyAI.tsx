"use client";

import { useInView } from "../hooks/useInView";
import AIPanel from "../components/illustrations/AIPanel";

const suggestions = [
  {
    title: "Low traffic predicted tomorrow",
    body: "Send a flash promo to boost visits. Based on last 4 Tuesdays, traffic drops 23%.",
    action: "Send promo now",
    color: "rgba(230,255,169,0.15)",
    border: "rgba(230,255,169,0.3)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(230,255,169)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "12 customers haven't returned",
    body: "These customers visited 2+ times but haven't been back in 10 days.",
    action: "View customers",
    color: "rgba(170,137,242,0.15)",
    border: "rgba(170,137,242,0.3)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(170,137,242)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Offer a reward today",
    body: "Your top 15 customers are due for a reward. A small incentive could drive 8+ visits.",
    action: "Create reward",
    color: "rgba(230,255,169,0.15)",
    border: "rgba(230,255,169,0.3)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(230,255,169)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    title: "VIP segment growing",
    body: "9 new customers qualified as VIP this month. Consider an exclusive perk.",
    action: "Set up perk",
    color: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function FidelyAI() {
  const { ref, isVisible } = useInView();

  return (
    <section id="fidely-ai" ref={ref} style={{ backgroundColor: "rgb(11,5,29)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 24px" }}>
        <div className="ai-grid" style={{ display: "grid", gridTemplateAreas: "'content image'", gridTemplateColumns: "1fr 1fr", columnGap: "48px", alignItems: "center" }}>
          {/* Left: text — simplified */}
          <div style={{ gridArea: "content", display: "flex", flexDirection: "column", justifyContent: "center", gap: "32px", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(230,255,169)", lineHeight: "20px", margin: 0 }}>
              Fidely AI
            </p>
            <h3 className="ai-h3 font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: 0, maxWidth: "460px" }}>
              Your smart growth assistant
            </h3>
            <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 400 }}>
              Fidely AI analyses your customer data and tells you exactly what to do to drive more revenue. No guesswork.
            </p>
            <a
              href="#cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "16px", fontWeight: 400, color: "white", textDecoration: "none",
              }}
            >
              Learn more
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Right: AI panel — no emojis */}
          <div style={{ gridArea: "image", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s" }}>
            <AIPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
