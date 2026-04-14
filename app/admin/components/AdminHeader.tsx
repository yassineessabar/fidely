"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <span style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>A</span>
          </div>

          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div style={{ padding: "6px" }}>
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
