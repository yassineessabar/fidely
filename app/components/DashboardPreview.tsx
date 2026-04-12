"use client";

import { useInView } from "../hooks/useInView";
import DashboardMockup from "./illustrations/DashboardMockup";

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
          <div style={{ gridArea: "image", justifySelf: "center", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <DashboardMockup />
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
