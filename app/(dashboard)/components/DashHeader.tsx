"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, PanelLeft, LogOut, Settings, User, HelpCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashHeader({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [bizName, setBizName] = useState("");
  const [bizEmail, setBizEmail] = useState("");

  useEffect(() => {
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        if (d.cards && d.cards.length > 0) {
          const bd = d.cards[0].business_details || {};
          if (bd.name) setBizName(bd.name);
          if (bd.email) setBizEmail(bd.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/signin");
    router.refresh();
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const menuItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "rgba(10,10,10,0.8)",
    fontSize: "13px",
    fontWeight: 500,
    transition: "background-color 0.1s",
    border: "none",
    background: "none",
    width: "100%",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <header
      style={{
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid rgba(10,10,10,0.06)",
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onMenuClick}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px", borderRadius: "6px", color: "rgba(10,10,10,0.5)",
            display: "flex", alignItems: "center",
          }}
        >
          <PanelLeft size={18} />
        </button>
        <div style={{ width: "1px", height: "16px", backgroundColor: "rgba(10,10,10,0.1)" }} />
        <h1 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(10,10,10,0.8)", margin: 0 }}>
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Upgrade button */}
        <Link
          href="/dashboard/billing"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid rgba(10,10,10,0.08)",
            backgroundColor: "transparent",
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(10,10,10,0.8)",
            textDecoration: "none",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          Upgrade
        </Link>

        {/* Notification bell */}
        <Link
          href="/dashboard/notifications"
          style={{
            width: "34px", height: "34px", borderRadius: "8px",
            border: "1px solid rgba(10,10,10,0.08)",
            backgroundColor: "white", display: "flex",
            alignItems: "center", justifyContent: "center",
            position: "relative", color: "rgba(10,10,10,0.6)",
            textDecoration: "none",
          }}
        >
          <Bell size={16} />
        </Link>

        {/* User avatar + dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: "none",
              transition: "transform 0.15s",
              transform: profileOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>
              {bizName ? bizName.slice(0, 2).toUpperCase() : "KY"}
            </span>
          </button>

          {profileOpen && (
            <>
              {/* Backdrop */}
              <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setProfileOpen(false)} />

              {/* Dropdown */}
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "224px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid rgba(10,10,10,0.08)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  zIndex: 100,
                  padding: "6px",
                }}
              >
                {/* User info */}
                <div style={{ padding: "10px 12px", marginBottom: "4px" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "rgba(10,10,10,0.9)" }}>
                    {bizName || "My Business"}
                  </p>
                  {bizEmail && (
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "rgba(10,10,10,0.4)" }}>{bizEmail}</p>
                  )}
                  <div style={{
                    display: "inline-block", marginTop: "6px",
                    padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600,
                    backgroundColor: "rgba(245,158,11,0.12)", color: "rgb(180,83,9)",
                  }}>
                    Free Beta
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(10,10,10,0.06)", margin: "2px 0" }} />

                {/* Menu items */}
                <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} style={menuItemStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <User size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} style={menuItemStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <Settings size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Settings
                </Link>
                <Link href="/dashboard/billing" onClick={() => setProfileOpen(false)} style={menuItemStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <CreditCard size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Billing
                </Link>
                <Link href="/help" onClick={() => setProfileOpen(false)} style={menuItemStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <HelpCircle size={15} style={{ color: "rgba(10,10,10,0.4)" }} /> Help
                </Link>

                <div style={{ height: "1px", backgroundColor: "rgba(10,10,10,0.06)", margin: "2px 0" }} />

                <button
                  onClick={handleLogout}
                  style={{ ...menuItemStyle, color: "rgb(220,38,38)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <LogOut size={15} style={{ color: "rgb(220,38,38)" }} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
