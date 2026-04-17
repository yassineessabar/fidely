"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import KyroLogo from "../../components/KyroLogo";
import {
  LayoutDashboard,
  Users,
  Send,
  Gift,
  Palette,
  PanelLeft,
  X,
  Gem,
  Bell,
  LogOut,
  Settings,
  User,
  HelpCircle,
  CreditCard,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { label: "Links", href: "/dashboard/loyalty", icon: Gift },
  { label: "Insights", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audience", href: "/dashboard/customers", icon: Users },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Send },
];

function SidebarBottomBar({ onNavClick }: { onNavClick?: () => void }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("kyro-theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [bizName, setBizName] = useState("");

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        if (d.cards && d.cards.length > 0) {
          const bd = d.cards[0].business_details || {};
          if (bd.name) setBizName(bd.name);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/signin");
    router.refresh();
  };

  const menuItem: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 12px", borderRadius: "8px", textDecoration: "none",
    color: "rgba(10,10,10,0.8)", fontSize: "13px", fontWeight: 500,
    transition: "background-color 0.1s", border: "none", background: "none",
    width: "100%", cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const,
  };

  return (
    <div className="dash-bottom-bar" style={{ padding: "10px 14px 16px", minWidth: "260px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Avatar + name */}
        <div ref={dropdownRef} style={{ position: "relative", flex: 1 }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 8px", borderRadius: "8px", width: "100%",
              fontFamily: "inherit", transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>
                {bizName ? bizName.slice(0, 2).toUpperCase() : "KY"}
              </span>
            </div>
            <span className="dash-bottom-name" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {bizName || "My Business"}
            </span>
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setProfileOpen(false)} />
              <div style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: "224px",
                backgroundColor: "white", borderRadius: "12px",
                border: "1px solid rgba(10,10,10,0.08)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                zIndex: 100, padding: "6px",
              }}>
                {/* User info */}
                <div style={{ padding: "10px 12px", marginBottom: "4px" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "rgba(10,10,10,0.85)" }}>{bizName || "My Business"}</p>
                  <div style={{ display: "inline-block", marginTop: "4px", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, backgroundColor: "rgba(245,158,11,0.12)", color: "rgb(180,83,9)" }}>
                    Free Beta
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(10,10,10,0.06)", margin: "2px 0" }} />

                <Link href="/dashboard/profile" onClick={() => { setProfileOpen(false); onNavClick?.(); }} style={menuItem}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <User size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Profile
                </Link>
                <Link href="/dashboard/upgrade" onClick={() => { setProfileOpen(false); onNavClick?.(); }} style={menuItem}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <Gem size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Upgrade Plan
                </Link>
                <Link href="/dashboard/help" onClick={() => { setProfileOpen(false); onNavClick?.(); }} style={menuItem}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <HelpCircle size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Help
                </Link>
                <Link href="/dashboard/gift" onClick={() => { setProfileOpen(false); onNavClick?.(); }} style={menuItem}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <Gift size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Send a Gift Card
                </Link>

                <div style={{ height: "1px", backgroundColor: "rgba(10,10,10,0.06)", margin: "2px 0" }} />

                {/* Theme toggle */}
                <button
                  onClick={() => {
                    const next = theme === "dark" ? "light" : "dark";
                    setTheme(next);
                    document.documentElement.classList.toggle("dark", next === "dark");
                    localStorage.setItem("kyro-theme", next);
                  }}
                  style={menuItem}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {theme === "dark"
                    ? <><Sun size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Light Mode</>
                    : <><Moon size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Dark Mode</>
                  }
                </button>

                <div style={{ height: "1px", backgroundColor: "rgba(10,10,10,0.06)", margin: "2px 0" }} />

                <button style={{ ...menuItem, color: "rgb(220,38,38)" }} onClick={handleLogout}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <LogOut size={15} style={{ color: "rgb(220,38,38)" }} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notification bell */}
        <Link
          className="dash-bottom-bell"
          href="/dashboard/notifications"
          onClick={onNavClick}
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.4)", textDecoration: "none",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <Bell size={18} />
        </Link>
      </div>
    </div>
  );
}

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
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        transition: "width 260ms cubic-bezier(0.31, 0.1, 0.08, 0.96)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo + toggle */}
      <div
        className="dash-logo-area"
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
            height: "28px", width: "28px", borderRadius: "8px",
            background: "linear-gradient(135deg, #fff, #e5e5e5)",
            display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}>
            <span style={{ fontSize: "10px", fontWeight: 900, color: "#111", letterSpacing: "-0.06em" }}>K</span>
          </div>
          <span className="dash-nav-label" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.95)" }}>
            Kyro
          </span>
        </div>
        <button
          className="dash-nav-label"
          onClick={onToggle}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", padding: "4px",
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
                color: isActive ? "white" : "rgba(255,255,255,0.5)",
                backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.8} />
              <span className="dash-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="dash-upgrade-banner" style={{ padding: "8px 14px 0", minWidth: "260px" }}>
        <Link
          href="/dashboard/upgrade"
          onClick={onNavClick}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)",
            textDecoration: "none", transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Upgrade your plan</p>
            <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Get more features</p>
          </div>
          <Gem size={18} style={{ color: "rgba(255,255,255,0.25)" }} />
        </Link>
      </div>

      {/* Bottom bar: avatar + notification */}
      <SidebarBottomBar onNavClick={onNavClick} />

      {/* Mobile close button */}
      {onNavClick && (
        <button onClick={onNavClick} className="dash-close-btn"
          style={{ display: "none", position: "absolute", top: "16px", right: "16px", background: "rgba(10,10,10,0.06)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
          <X size={18} />
        </button>
      )}
    </aside>
  );
}
