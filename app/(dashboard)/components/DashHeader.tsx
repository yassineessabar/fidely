"use client";

import { PanelLeft } from "lucide-react";

export default function DashHeader({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  return (
    <header
      style={{
        height: "52px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid rgba(10,10,10,0.06)",
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onMenuClick}
          className="dash-menu-btn"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", borderRadius: "6px", color: "rgba(10,10,10,0.5)",
            display: "none", alignItems: "center",
          }}
        >
          <PanelLeft size={18} />
        </button>
        <h1 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: 0 }}>
          {title}
        </h1>
      </div>
    </header>
  );
}
