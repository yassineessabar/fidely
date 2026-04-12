"use client";

import { useInView } from "../hooks/useInView";

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
            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Panel header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6C47FF, #AA89F2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: 600 }}>Fidely AI</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>4 new recommendations</p>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#E6FFA9" }} />
              </div>

              {/* Suggestion cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: s.color,
                      borderRadius: "14px",
                      padding: "16px",
                      border: `1px solid ${s.border}`,
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", color: "white", fontSize: "13px", fontWeight: 600 }}>{s.title}</p>
                        <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: "18px" }}>{s.body}</p>
                        <span style={{ color: "#AA89F2", fontSize: "12px", fontWeight: 600 }}>{s.action} →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
