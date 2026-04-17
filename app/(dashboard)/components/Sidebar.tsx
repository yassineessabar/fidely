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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { label: "Loyalty", href: "/dashboard/loyalty", icon: Gift },
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
        width: collapsed ? "72px" : "240px",
        minHeight: "100vh",
        backgroundColor: "rgb(11,5,29)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Logo + close button */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          height: "72px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {collapsed ? (
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgb(230,255,169)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display" style={{ color: "rgb(11,5,29)", fontWeight: 800, fontSize: "16px" }}>f</span>
          </div>
        ) : (
          <>
            <KyroLogo color="white" height={22} />
            {onNavClick && (
              <button
                onClick={onNavClick}
                className="dash-close-btn"
                style={{
                  display: "none",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X size={18} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
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
                gap: "12px",
                padding: collapsed ? "10px 0" : "10px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "white" : "rgba(255,255,255,0.5)",
                backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && <span className="dash-nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="dash-collapse-btn" style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={onToggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "12px",
            padding: collapsed ? "10px 0" : "10px 16px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "inherit",
            transition: "color 0.15s",
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
