"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import DashHeader from "./components/DashHeader";

const pageTitles: Record<string, string> = {
  "/dashboard": "Insights",
  "/dashboard/loyalty": "Links",
  "/dashboard/appearance": "Appearance",
  "/dashboard/customers": "Audience",
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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Check if merchant needs onboarding (no cards yet)
  useEffect(() => {
    localStorage.removeItem("kyro-sidebar-open");
    fetch("/api/merchant/cards")
      .then((r) => r.json())
      .then((d) => {
        if (!d.cards || d.cards.length === 0) {
          router.replace("/onboarding");
        } else {
          setReady(true);
        }
      })
      .catch(() => setReady(true));
  }, [router]);

  const title = pageTitles[pathname] || (pathname.startsWith("/dashboard/loyalty/") ? "Edit Card" : "Dashboard");

  if (!ready) {
    return <div style={{ minHeight: "100vh", backgroundColor: "white" }} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "white", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
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
        <Sidebar collapsed={false} onToggle={() => {}} />
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
          marginLeft: "260px",
          transition: "margin-left 260ms cubic-bezier(0.31, 0.1, 0.08, 0.96)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="dash-main"
      >
        <DashHeader title={title} onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, padding: "28px 32px", backgroundColor: "#fafafa", minHeight: 0 }}>{children}</main>
      </div>
    </div>
  );
}
