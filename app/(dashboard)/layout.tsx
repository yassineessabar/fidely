"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import DashHeader from "./components/DashHeader";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/loyalty": "Loyalty Cards",
  "/dashboard/customers": "Customers",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/notifications": "Notifications",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
  "/dashboard/upgrade": "Upgrade",
  "/dashboard/help": "Help & Support",
  "/dashboard/gift": "Gift Cards",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem("kyro-sidebar-open");
    if (saved === "false") setCollapsed(true);
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("kyro-sidebar-open", next ? "false" : "true");
  };

  const title = pageTitles[pathname] || (pathname.startsWith("/dashboard/loyalty/") ? "Edit Card" : "Dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "white" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 45 }}
          className="dash-overlay"
        />
      )}

      {/* Sidebar — desktop */}
      <div className="dash-sidebar-wrap">
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* Sidebar — mobile drawer */}
      <div
        className="dash-sidebar-mobile"
        style={{
          display: "none",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 260ms cubic-bezier(0.31, 0.1, 0.08, 0.96)",
        }}
      >
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavClick={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "0px" : "260px",
          transition: "margin-left 260ms cubic-bezier(0.31, 0.1, 0.08, 0.96)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="dash-main"
      >
        <DashHeader title={title} onMenuClick={() => { if (collapsed) { setCollapsed(false); localStorage.setItem("kyro-sidebar-open", "true"); } else { setMobileOpen(true); } }} />
        <main style={{ flex: 1, padding: "24px 28px", backgroundColor: "white" }}>{children}</main>
      </div>
    </div>
  );
}
