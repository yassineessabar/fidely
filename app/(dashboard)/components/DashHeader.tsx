"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, LogOut, Settings, User } from "lucide-react";
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <header
      style={{
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onMenuClick}
          className="dash-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            color: "rgb(11,5,29)",
          }}
        >
          <Menu size={22} />
        </button>
        <h1
          className="font-display"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "rgb(11,5,29)",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            backgroundColor: "rgb(249,248,245)",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.06)",
            width: "220px",
          }}
          className="dash-search"
        >
          <Search size={16} color="rgb(97,95,109)" />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              background: "none",
              outline: "none",
              fontSize: "14px",
              color: "rgb(11,5,29)",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Notifications */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.06)",
            backgroundColor: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Bell size={18} color="rgb(11,5,29)" />
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "rgb(230,255,169)",
              border: "2px solid white",
            }}
          />
        </button>

        {/* Avatar + dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgb(11,5,29)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "box-shadow 0.15s",
              boxShadow: profileOpen ? "0 0 0 2px rgb(230,255,169)" : "none",
            }}
          >
            <span style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>{bizName ? bizName.slice(0, 2).toUpperCase() : "–"}</span>
          </div>

          {/* Dropdown menu */}
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "240px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              {/* User info */}
              <div style={{ padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{bizName || "My Business"}</p>
                {bizEmail && <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgb(97,95,109)" }}>{bizEmail}</p>}
              </div>

              {/* Menu items */}
              <div style={{ padding: "6px" }}>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "rgb(11,5,29)",
                    fontSize: "14px",
                    fontWeight: 400,
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <User size={16} color="rgb(97,95,109)" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "rgb(11,5,29)",
                    fontSize: "14px",
                    fontWeight: 400,
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(249,248,245)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Settings size={16} color="rgb(97,95,109)" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div style={{ padding: "6px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "none",
                    color: "rgb(220,38,38)",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <LogOut size={16} color="rgb(220,38,38)" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
