export default function DashboardMockup() {
  const barHeights = [35, 48, 28, 55, 42, 68, 45, 72, 58, 80, 65, 85];

  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Browser frame */}
      <rect x="0" y="0" width="560" height="380" rx="16" fill="white" />
      <rect x="0" y="0" width="560" height="40" rx="16" fill="#FAFAFA" />
      <rect x="0" y="28" width="560" height="12" fill="#FAFAFA" />

      {/* Traffic lights */}
      <circle cx="20" cy="20" r="5" fill="#FF6058" />
      <circle cx="36" cy="20" r="5" fill="#FFC130" />
      <circle cx="52" cy="20" r="5" fill="#27CA40" />

      {/* URL bar */}
      <rect x="170" y="10" width="220" height="20" rx="4" fill="white" />
      <text x="210" y="24" fontSize="8" fill="#9CA3AF" fontFamily="sans-serif">dashboard.kyro.com</text>

      {/* Sidebar */}
      <rect x="0" y="40" width="60" height="340" fill="#0B051D" />

      {/* Sidebar logo */}
      <rect x="14" y="52" width="32" height="32" rx="8" fill="rgb(230,255,169)" />
      <text x="24" y="73" fontSize="14" fill="#0B051D" fontWeight="800" fontFamily="sans-serif">f</text>

      {/* Sidebar nav items */}
      {[92, 116, 140, 164, 188].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="36" height="20" rx="6" fill={i === 0 ? "rgba(255,255,255,0.1)" : "transparent"} />
          <rect x="20" y={y + 5} width="20" height="2" rx="1" fill={i === 0 ? "white" : "rgba(255,255,255,0.3)"} />
          <rect x="22" y={y + 10} width="16" height="2" rx="1" fill={i === 0 ? "white" : "rgba(255,255,255,0.2)"} />
        </g>
      ))}

      {/* Main content area */}
      <rect x="60" y="40" width="500" height="340" fill="#F9F8F5" />

      {/* Header */}
      <text x="80" y="68" fontSize="14" fill="#0B051D" fontWeight="700" fontFamily="sans-serif">Dashboard</text>
      <rect x="460" y="52" width="80" height="24" rx="6" fill="white" stroke="#E5E5E5" strokeWidth="1" />
      <text x="480" y="68" fontSize="8" fill="#9CA3AF" fontFamily="sans-serif">Last 30 days</text>

      {/* KPI Cards */}
      {[
        { x: 80, label: "Customers", value: "1,471", change: "+12%" },
        { x: 190, label: "Repeat Visits", value: "188", change: "+28%" },
        { x: 300, label: "Revenue", value: "$16.3k", change: "+18%" },
        { x: 410, label: "Active Cards", value: "1,247", change: "+9%" },
      ].map((card) => (
        <g key={card.label}>
          <rect x={card.x} y="84" width="100" height="64" rx="10" fill="white" />
          <text x={card.x + 10} y="102" fontSize="8" fill="#9CA3AF" fontFamily="sans-serif">{card.label}</text>
          <text x={card.x + 10} y="122" fontSize="16" fill="#0B051D" fontWeight="700" fontFamily="sans-serif">{card.value}</text>
          <text x={card.x + 10} y="138" fontSize="8" fill="#22C55E" fontWeight="600" fontFamily="sans-serif">{card.change}</text>
        </g>
      ))}

      {/* Chart area */}
      <rect x="80" y="162" width="320" height="168" rx="10" fill="white" />
      <text x="96" y="182" fontSize="10" fill="#0B051D" fontWeight="600" fontFamily="sans-serif">Revenue over time</text>

      {/* Chart bars */}
      {barHeights.map((h, i) => (
        <rect
          key={i}
          x={100 + i * 24}
          y={310 - h * 1.4}
          width="16"
          height={h * 1.4}
          rx="3"
          fill={i >= 9 ? "#0B051D" : "rgba(11,5,29,0.15)"}
        />
      ))}

      {/* Chart labels */}
      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
        <text key={m + i} x={108 + i * 24} y="324" fontSize="7" fill="#9CA3AF" fontFamily="sans-serif" textAnchor="middle">{m}</text>
      ))}

      {/* Right sidebar - Top Customers */}
      <rect x="412" y="162" width="128" height="168" rx="10" fill="white" />
      <text x="424" y="182" fontSize="10" fill="#0B051D" fontWeight="600" fontFamily="sans-serif">Top Customers</text>

      {[
        { name: "Sophie M.", pts: "480", y: 200 },
        { name: "Marc D.", pts: "360", y: 228 },
        { name: "Julie R.", pts: "290", y: 256 },
        { name: "Thomas B.", pts: "240", y: 284 },
        { name: "Léa P.", pts: "195", y: 312 },
      ].map((c, i) => (
        <g key={c.name}>
          <circle cx="434" cy={c.y + 6} r="10" fill={["#FFE0EB", "#DBEAFE", "#D1FAE5", "#FEF3C7", "#E9D5FF"][i]} />
          <text x="434" y={c.y + 10} fontSize="7" fill="#0B051D" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">{c.name.slice(0, 2)}</text>
          <text x="450" y={c.y + 4} fontSize="9" fill="#0B051D" fontWeight="500" fontFamily="sans-serif">{c.name}</text>
          <text x="450" y={c.y + 14} fontSize="7" fill="#6C47FF" fontWeight="600" fontFamily="sans-serif">{c.pts} pts</text>
        </g>
      ))}

      {/* Bottom action cards */}
      <rect x="80" y="342" width="230" height="32" rx="8" fill="white" />
      <rect x="92" y="348" width="20" height="20" rx="5" fill="rgba(230,255,169,0.3)" />
      <text x="120" y="362" fontSize="9" fill="#0B051D" fontWeight="500" fontFamily="sans-serif">Send a reward reminder →</text>

      <rect x="320" y="342" width="220" height="32" rx="8" fill="white" />
      <rect x="332" y="348" width="20" height="20" rx="5" fill="rgba(170,137,242,0.3)" />
      <text x="360" y="362" fontSize="9" fill="#0B051D" fontWeight="500" fontFamily="sans-serif">Reactivate 67 inactive customers →</text>
    </svg>
  );
}
