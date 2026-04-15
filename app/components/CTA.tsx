"use client";

import Image from "next/image";
import { useInView } from "../hooks/useInView";

export default function CTA() {
  const { ref, isVisible } = useInView();

  return (
    <section id="cta" ref={ref} style={{ backgroundColor: "rgb(232,255,200)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 24px", position: "relative" }}>
        <div
          className="cta-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}
        >
          {/* Text */}
          <div style={{ maxWidth: "750px", zIndex: 1, position: "relative", opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
            <h4
              className="cta-h4 font-display"
              style={{ fontSize: "52px", lineHeight: "54.6px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}
            >
              Stop losing customers every day
            </h4>
            <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgb(11,5,29)", margin: "0 0 32px", fontWeight: 400 }}>
              Every day without Kyro means missed revenue. Join 500+ local businesses and start bringing customers back — automatically.
            </p>
            <a
              href="#"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: "40px", padding: "12px 20px",
                backgroundColor: "rgb(11,5,29)", color: "white",
                fontSize: "16px", fontWeight: 500, lineHeight: "16px",
                borderRadius: "100px", textDecoration: "none",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
            >
              Get Kyro
            </a>
          </div>

          {/* Phone visual */}
          <div style={{ display: "flex", justifyContent: "center", zIndex: 0, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s" }}>
            <div style={{ width: "460px", position: "relative", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.15))" }}>
              <Image
                src="/images/how-it-works/losing-customer.png"
                alt="Stop losing customers"
                width={460}
                height={460}
                style={{ width: "100%", height: "auto", borderRadius: "24px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
