"use client";

import { useInView } from "../hooks/useInView";
import { TrendingUp, Users, RotateCcw, CreditCard, ArrowUpRight } from "lucide-react";

const kpis = [
  { label: "Total Customers", value: "1,471", change: "+12.3%", icon: Users },
  { label: "Repeat Visits", value: "188", change: "+28.6%", icon: RotateCcw },
  { label: "Revenue Generated", value: "$16,328", change: "+18.4%", icon: TrendingUp },
  { label: "Active Cards", value: "1,247", change: "+9.1%", icon: CreditCard },
];

const chartPoints = [
  { x: 0, y: 82 }, { x: 1, y: 91 }, { x: 2, y: 88 }, { x: 3, y: 112 },
  { x: 4, y: 124 }, { x: 5, y: 138 }, { x: 6, y: 129 }, { x: 7, y: 146 },
  { x: 8, y: 152 }, { x: 9, y: 148 }, { x: 10, y: 163 },
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function MiniChart() {
  const w = 500, h = 160, px = 40, py = 20;
  const maxY = 170, minY = 70;
  const points = chartPoints.map((p, i) => {
    const x = px + (i / 10) * (w - px * 2);
    const y = py + (1 - (p.y - minY) / (maxY - minY)) * (h - py * 2);
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${h - py} L${points[0].x},${h - py} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="auto" style={{ display: "block" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(11,5,29)" stopOpacity={0.12} />
          <stop offset="100%" stopColor="rgb(11,5,29)" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[70, 100, 130, 160].map((v) => {
        const y = py + (1 - (v - minY) / (maxY - minY)) * (h - py * 2);
        return <line key={v} x1={px} x2={w - px} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />;
      })}
      <path d={area} fill="url(#chartGrad)" />
      <path d={line} fill="none" stroke="rgb(11,5,29)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <text key={i} x={p.x} y={h - 4} textAnchor="middle" fontSize="10" fill="rgb(150,148,160)">{months[i]}</text>
      ))}
    </svg>
  );
}

export default function DashboardPreview() {
  const { ref, isVisible } = useInView();

  return (
    <section id="dashboard" ref={ref} style={{ backgroundColor: "rgb(11,5,29)", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 24px" }}>
        <div
          className="dashboard-grid"
          style={{ display: "grid", gridTemplateAreas: "'image content'", gridTemplateColumns: "1.2fr 0.8fr", columnGap: "48px", alignItems: "center" }}
        >
          {/* Live dashboard UI */}
          <div style={{
            gridArea: "image",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            borderRadius: "16px",
            overflow: "hidden",
            background: "rgb(249,248,245)",
            padding: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} style={{ backgroundColor: "white", borderRadius: "12px", padding: "14px", border: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={14} color="rgb(11,5,29)" strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "rgb(34,154,22)", display: "flex", alignItems: "center", gap: "1px" }}>
                        <ArrowUpRight size={10} />
                        {kpi.change}
                      </span>
                    </div>
                    <p className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 2px" }}>{kpi.value}</p>
                    <p style={{ fontSize: "9px", color: "rgb(97,95,109)", margin: 0 }}>{kpi.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, backgroundColor: "rgb(11,5,29)", color: "white" }}>Revenue</span>
                  <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, backgroundColor: "rgb(249,248,245)", color: "rgb(97,95,109)" }}>Visits</span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["7d", "4w", "6m", "12m"].map((t, i) => (
                    <span key={t} style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 500, backgroundColor: i === 2 ? "rgb(249,248,245)" : "transparent", color: i === 2 ? "rgb(11,5,29)" : "rgb(150,148,160)" }}>{t}</span>
                  ))}
                </div>
              </div>
              <MiniChart />
            </div>
          </div>

          {/* Content side */}
          <div style={{
            gridArea: "content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "32px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s",
          }}>
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
