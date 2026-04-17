"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import KyroLogo from "../../components/KyroLogo";
import {
  LayoutDashboard,
  Users,
  Send,
  Gift,
  Bell,
  CreditCard,
  Settings,
  PanelLeft,
  X,
  Gem,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Loyalty", href: "/dashboard/loyalty", icon: Gift },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  onToggle,
  onNavClick,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className="dash-sidebar"
      style={{
        width: collapsed ? "0px" : "260px",
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        transition: "width 260ms cubic-bezier(0.31, 0.1, 0.08, 0.96)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Logo + toggle */}
      <div
        style={{
          padding: "16px 16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: "260px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            height: "26px", width: "26px", borderRadius: "7px",
            backgroundColor: "#0a0a0a", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "9px", fontWeight: 900, color: "white", letterSpacing: "-0.06em" }}>K</span>
          </div>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(10,10,10,0.9)" }}>
            Kyro
          </span>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(10,10,10,0.4)", padding: "4px",
            borderRadius: "6px", display: "flex", alignItems: "center",
          }}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: "1px", minWidth: "260px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.5)",
                backgroundColor: isActive ? "rgba(10,10,10,0.06)" : "transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.03)";
                  e.currentTarget.style.color = "rgba(10,10,10,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(10,10,10,0.5)";
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div style={{ padding: "12px 14px", minWidth: "260px" }}>
        <Link
          href="/dashboard/billing"
          onClick={onNavClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(10,10,10,0.06)",
            backgroundColor: "rgba(10,10,10,0.02)",
            textDecoration: "none",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.02)"; }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "rgba(10,10,10,0.8)" }}>
              Upgrade your plan
            </p>
            <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(10,10,10,0.35)", fontWeight: 500 }}>
              Get more features
            </p>
          </div>
          <Gem size={18} style={{ color: "rgba(10,10,10,0.25)" }} />
        </Link>
      </div>

      {/* Mobile close button (hidden on desktop, shown via CSS) */}
      {onNavClick && (
        <button
          onClick={onNavClick}
          className="dash-close-btn"
          style={{
            display: "none",
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(10,10,10,0.06)", border: "none",
            borderRadius: "8px", padding: "6px", cursor: "pointer",
            color: "rgba(10,10,10,0.5)",
          }}
        >
          <X size={18} />
        </button>
      )}
    </aside>
  );
}
