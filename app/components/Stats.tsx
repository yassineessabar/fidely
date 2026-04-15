"use client";

import { useInView } from "../hooks/useInView";

const stats = [
  {
    value: "3.2×",
    label: "More repeat visits",
    sublabel: "vs. traditional punch cards",
  },
  {
    value: "92%",
    label: "Pass retention rate",
    sublabel: "customers keep their card",
  },
  {
    value: "<5min",
    label: "Onboarding time",
    sublabel: "from signup to live program",
  },
];

export default function Stats() {
  const { ref, isVisible } = useInView();

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "rgb(11,5,29)",
        padding: "80px 0",
      }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <p
          className={isVisible ? "animate-fade-in-up" : ""}
          style={{
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8B6FFF",
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          By the numbers
        </p>
        <h2
          className={`font-display ${isVisible ? "animate-fade-in-up" : ""}`}
          style={{
            fontWeight: 500,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            color: "white",
            margin: "0 0 64px",
            textAlign: "center",
          }}
        >
          Performance you can count on
        </h2>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={isVisible ? "animate-fade-in-up" : ""}
              style={{
                animationDelay: `${i * 100}ms`,
                textAlign: "center",
                padding: "32px 16px",
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(40px, 5vw, 56px)",
                  fontWeight: 600,
                  color: "white",
                  lineHeight: 1,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
