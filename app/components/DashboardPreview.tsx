"use client";

import { useInView } from "../hooks/useInView";

export default function DashboardPreview() {
  const { ref, isVisible } = useInView();

  return (
    <section id="dashboard" ref={ref} style={{ backgroundColor: "rgb(11,5,29)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 24px" }}>
        <div
          className="dashboard-grid"
          style={{ display: "grid", gridTemplateAreas: "'image content'", gridTemplateColumns: "1fr 1fr", columnGap: "48px", alignItems: "center" }}
        >
          {/* Image / Visual side */}
          <div style={{ gridArea: "image", justifySelf: "center", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Overview</p>
                  <p style={{ margin: "4px 0 0", color: "white", fontSize: "20px", fontWeight: 700 }}>Customer Dashboard</p>
                </div>
                <div style={{ padding: "6px 14px", backgroundColor: "rgba(108,71,255,0.2)", borderRadius: "8px" }}>
                  <span style={{ color: "#AA89F2", fontSize: "12px", fontWeight: 600 }}>Last 30 days</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "Customers", value: "1,247", change: "+12%", color: "#E6FFA9" },
                  { label: "Visits", value: "3,891", change: "+23%", color: "#E6FFA9" },
                  { label: "Retention", value: "68%", change: "+8%", color: "#E6FFA9" },
                ].map((s) => (
                  <div key={s.label} style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{s.label}</p>
                    <p style={{ margin: "4px 0", color: "white", fontSize: "22px", fontWeight: 700 }}>{s.value}</p>
                    <span style={{ color: s.color, fontSize: "12px", fontWeight: 600 }}>{s.change}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
                {[35, 42, 28, 55, 48, 62, 45, 70, 58, 75, 68, 82].map((h, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: i >= 9 ? "#6C47FF" : "rgba(108,71,255,0.3)", borderRadius: "3px 3px 0 0", height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Content side */}
          <div style={{ gridArea: "content", display: "flex", flexDirection: "column", justifyContent: "center", gap: "32px", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "white", lineHeight: "20px", margin: 0 }}>
              All your customers in one place
            </p>
            <h3 className="dashboard-h3 font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: 0, maxWidth: "460px" }}>
              Smart insights, real growth
            </h3>
            <p style={{ fontSize: "20px", lineHeight: "32px", color: "white", margin: 0, fontWeight: 400 }}>
              Track visits, revenue, and retention. Know who comes back — and who doesn&apos;t. Make better decisions with real data.
            </p>
            <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 400, color: "white", textDecoration: "none" }}>
              Learn more
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
