"use client";

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const RETENTION_RATE = 0.10;

function Slider({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)" }}>{label}</span>
        <span className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)" }}>
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <div style={{ position: "relative", height: "6px", backgroundColor: "rgb(228,227,223)", borderRadius: "3px" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "rgb(230,255,169)",
            borderRadius: "3px",
            transition: "width 0.1s",
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          marginTop: "-6px",
          position: "relative",
          zIndex: 1,
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          cursor: "pointer",
          height: "20px",
        }}
        className="calc-slider"
      />
    </div>
  );
}

export default function Calculator() {
  const [customersPerDay, setCustomersPerDay] = useState(50);
  const [daysOpen, setDaysOpen] = useState(26);
  const [avgOrder, setAvgOrder] = useState(25);
  const [locations, setLocations] = useState(1);
  const { ref, isVisible } = useInView();

  const monthlyCustomers = customersPerDay * daysOpen;
  const returning = monthlyCustomers * RETENTION_RATE;
  const monthlyRevenue = returning * avgOrder * locations;
  const annualRevenue = monthlyRevenue * 12;

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <section
      ref={ref}
      style={{ backgroundColor: "white", padding: "80px 0" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div
          style={{ marginBottom: "48px" }}
          className={isVisible ? "animate-fade-in-up" : ""}
        >
          <h2
            className="font-display section-h2"
            style={{
              fontWeight: 500,
              fontSize: "52px",
              lineHeight: "55px",
              color: "rgb(11,5,29)",
              margin: "0 0 16px",
            }}
          >
            Calculate your lost revenue
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: 0, fontWeight: 400 }}>
            See how much money you&apos;re leaving on the table without customer retention.
          </p>
        </div>

        {/* 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
          className="calc-grid"
        >
          {/* Left: Sliders */}
          <div
            style={{
              padding: "40px",
              backgroundColor: "rgb(249,248,245)",
              borderRadius: "24px",
            }}
          >
            <Slider label="Customers per day" value={customersPerDay} min={10} max={200} step={5} onChange={setCustomersPerDay} />
            <Slider label="Days open per month" value={daysOpen} min={10} max={31} step={1} onChange={setDaysOpen} />
            <Slider label="Average order value" value={avgOrder} min={5} max={200} step={5} prefix="$" onChange={setAvgOrder} />
            <Slider label="Number of locations" value={locations} min={1} max={20} step={1} onChange={setLocations} />
          </div>

          {/* Right: Results card */}
          <div
            style={{
              backgroundColor: "rgb(11,5,29)",
              borderRadius: "24px",
              padding: "40px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Context text */}
            <p style={{ fontSize: "16px", lineHeight: "24px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              If only <span style={{ color: "white", fontWeight: 600 }}>10%</span> of your customers came back just once more…
            </p>

            {/* Big number */}
            <div>
              <p
                className="font-display"
                style={{
                  fontSize: "72px",
                  lineHeight: "72px",
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "rgb(230,255,169)",
                  letterSpacing: "-2px",
                }}
              >
                {formatCurrency(annualRevenue)}
              </p>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 400 }}>
                Additional annual revenue
              </p>
            </div>

            {/* Monthly breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Monthly</p>
                <p className="font-display" style={{ margin: "4px 0 0", color: "white", fontSize: "24px", fontWeight: 700 }}>{formatCurrency(monthlyRevenue)}</p>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Returning customers / mo</p>
                <p className="font-display" style={{ margin: "4px 0 0", color: "white", fontSize: "24px", fontWeight: 700 }}>{Math.round(returning)}</p>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { label: "×2 retention", color: "rgba(230,255,169,0.15)", text: "rgb(230,255,169)" },
                { label: "×2 profit", color: "rgba(170,137,242,0.15)", text: "rgb(170,137,242)" },
                { label: "+30% order value", color: "rgba(230,255,169,0.15)", text: "rgb(230,255,169)" },
                { label: "+more reviews", color: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.7)" },
              ].map((b) => (
                <span
                  key={b.label}
                  style={{
                    backgroundColor: b.color,
                    color: b.text,
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            {/* CTA */}
            <a
              href="#cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                height: "48px",
                padding: "0 28px",
                backgroundColor: "rgb(230,255,169)",
                color: "rgb(11,5,29)",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "100px",
                textDecoration: "none",
                transition: "box-shadow 0.3s, transform 0.3s",
                width: "100%",
              }}
            >
              Get a free demo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
