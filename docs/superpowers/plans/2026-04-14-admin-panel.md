# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin panel with Fidely branding (dark sidebar, lime accents) containing 4 pages: Dashboard (KPIs), Applications (migrated from current admin page), Merchants (list + detail), and Invoices (list + filters).

**Architecture:** Reuses the same sidebar + header layout pattern from the merchant dashboard (`app/(dashboard)/layout.tsx`). The admin layout is a server component with metadata that wraps an `AdminShell` client component (manages sidebar collapse state). All admin API routes verify auth via `verifyAdmin()` and query cross-tenant data via `createAdminClient()`. All styling uses inline styles (not Tailwind), matching existing codebase conventions.

**Tech Stack:** Next.js App Router, Supabase (service role client for cross-tenant queries), lucide-react icons, inline CSS styles.

**Spec:** Provided inline in task description.

---

## File Structure

### Create
| File | Responsibility |
|------|---------------|
| `app/admin/components/AdminSidebar.tsx` | Dark sidebar with 4 admin nav items, collapse toggle |
| `app/admin/components/AdminHeader.tsx` | Sticky 72px header with page title + avatar dropdown + logout |
| `app/admin/components/AdminShell.tsx` | Client component wrapper managing sidebar state |
| `app/admin/components/StatsCard.tsx` | Reusable KPI card for dashboard |
| `app/admin/applications/page.tsx` | Applications list (migrated from current `admin/page.tsx`) |
| `app/admin/merchants/page.tsx` | Merchants list table |
| `app/admin/merchants/[id]/page.tsx` | Merchant detail view |
| `app/admin/invoices/page.tsx` | Invoices list table with filters |
| `app/api/admin/stats/route.ts` | GET dashboard KPIs |
| `app/api/admin/merchants/route.ts` | GET list merchants |
| `app/api/admin/merchants/[id]/route.ts` | GET detail, PATCH update |
| `app/api/admin/invoices/route.ts` | GET list invoices |

### Modify
| File | Change |
|------|--------|
| `app/admin/layout.tsx` | Add AdminShell wrapper around children |
| `app/admin/page.tsx` | Replace applications table with KPI dashboard |

---

### Task 1: AdminSidebar Component

**Files:**
- Create: `app/admin/components/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar.tsx**

Create `app/admin/components/AdminSidebar.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import KyroLogo from "../../components/KyroLogo";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Merchants", href: "/admin/merchants", icon: Building2 },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
];

export default function AdminSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
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
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          height: "72px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {collapsed ? (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgb(230,255,169)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="font-display"
              style={{
                color: "rgb(11,5,29)",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              f
            </span>
          </div>
        ) : (
          <div>
            <KyroLogo color="white" height={22} />
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
                marginTop: "2px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
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
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div
        style={{
          padding: "16px 8px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
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
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "admin/components/AdminSidebar" || echo "No errors in AdminSidebar"`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/components/AdminSidebar.tsx
git commit -m "feat(admin): add AdminSidebar component with 4 nav items"
```

---

### Task 2: AdminHeader Component

**Files:**
- Create: `app/admin/components/AdminHeader.tsx`

- [ ] **Step 1: Create AdminHeader.tsx**

Create `app/admin/components/AdminHeader.tsx`:

```tsx
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
              boxShadow: profileOpen
                ? "0 0 0 2px rgb(230,255,169)"
                : "none",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              A
            </span>
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(220,38,38,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
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
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "admin/components/AdminHeader" || echo "No errors in AdminHeader"`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/components/AdminHeader.tsx
git commit -m "feat(admin): add AdminHeader component with logout dropdown"
```

---

### Task 3: StatsCard Component

**Files:**
- Create: `app/admin/components/StatsCard.tsx`

- [ ] **Step 1: Create StatsCard.tsx**

Create `app/admin/components/StatsCard.tsx`:

```tsx
export default function StatsCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid rgb(228,227,223)",
        padding: "24px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 600,
          color: "rgb(97,95,109)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </p>
      <p
        className="font-display"
        style={{
          margin: "8px 0 0",
          fontSize: "28px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "rgb(97,95,109)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/components/StatsCard.tsx
git commit -m "feat(admin): add StatsCard reusable KPI component"
```

---

### Task 4: AdminShell and Layout

**Files:**
- Create: `app/admin/components/AdminShell.tsx`
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Create AdminShell.tsx**

Create `app/admin/components/AdminShell.tsx`:

```tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/merchants": "Merchants",
  "/admin/invoices": "Invoices",
};

function getTitle(pathname: string): string {
  // Exact match first
  if (titleMap[pathname]) return titleMap[pathname];
  // Merchant detail pages
  if (pathname.startsWith("/admin/merchants/")) return "Merchant Detail";
  // Fallback
  return "Admin";
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "rgb(249,248,245)",
      }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 45,
          }}
          className="dash-overlay"
        />
      )}

      {/* Sidebar — desktop */}
      <div className="dash-sidebar-wrap">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      <div
        className="dash-sidebar-mobile"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
      >
        <AdminSidebar
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "72px" : "240px",
          transition: "margin-left 0.2s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="dash-main"
      >
        <AdminHeader
          title={getTitle(pathname)}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main style={{ flex: 1, padding: "32px" }}>{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update layout.tsx**

Replace the entire contents of `app/admin/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
  title: "Admin — Fidely",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "admin/" || echo "No errors"`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/components/AdminShell.tsx app/admin/layout.tsx
git commit -m "feat(admin): add AdminShell layout wrapper with sidebar+header"
```

---

### Task 5: Dashboard Stats API

**Files:**
- Create: `app/api/admin/stats/route.ts`

- [ ] **Step 1: Create stats API route**

Create `app/api/admin/stats/route.ts`:

```ts
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const [businessesRes, pendingRes, customersRes, invoicesRes] =
    await Promise.all([
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("signup_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending" as any),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("invoices")
        .select("amount")
        .eq("status", "paid" as any)
        .gte(
          "invoice_date",
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          )
            .toISOString()
            .split("T")[0]
        ),
    ]);

  const monthlyRevenue = (invoicesRes.data ?? []).reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  return NextResponse.json({
    totalMerchants: businessesRes.count ?? 0,
    pendingApplications: pendingRes.count ?? 0,
    totalCustomers: customersRes.count ?? 0,
    monthlyRevenue,
  });
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "api/admin/stats" || echo "No errors"`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/stats/route.ts
git commit -m "feat(admin): add GET /api/admin/stats endpoint for dashboard KPIs"
```

---

### Task 6: Dashboard Page

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Replace admin/page.tsx with dashboard**

Replace the entire contents of `app/admin/page.tsx` with:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "./components/StatsCard";

type Stats = {
  totalMerchants: number;
  pendingApplications: number;
  totalCustomers: number;
  monthlyRevenue: number;
};

type Application = {
  id: string;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  approved: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  rejected: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/applications?status=pending"),
      ]);

      if (statsRes.status === 401 || appsRes.status === 401) {
        router.push("/signin");
        return;
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setRecentApps((data.applications ?? []).slice(0, 5));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "rgb(97,95,109)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatsCard
          label="Total Merchants"
          value={stats?.totalMerchants ?? 0}
        />
        <StatsCard
          label="Pending Applications"
          value={stats?.pendingApplications ?? 0}
        />
        <StatsCard
          label="Total Customers"
          value={stats?.totalCustomers ?? 0}
        />
        <StatsCard
          label="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
      </div>

      {/* Recent Pending Applications */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgb(228,227,223)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            className="font-display"
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "rgb(11,5,29)",
            }}
          >
            Recent Pending Applications
          </h2>
          <Link
            href="/admin/applications"
            style={{
              fontSize: "13px",
              color: "rgb(108,71,255)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View all
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "rgb(97,95,109)",
              fontSize: "14px",
            }}
          >
            No pending applications.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Company", "Email", "Date", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "rgb(97,95,109)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    {app.first_name} {app.last_name}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(11,5,29)",
                    }}
                  >
                    {app.company_name}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {app.email}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(app.created_at).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          statusColors[app.status].bg,
                        color: statusColors[app.status].text,
                        textTransform: "capitalize",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "admin/page" || echo "No errors"`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat(admin): replace admin page with KPI dashboard"
```

---

### Task 7: Applications Page (migrate)

**Files:**
- Create: `app/admin/applications/page.tsx`

- [ ] **Step 1: Create applications/page.tsx**

Create `app/admin/applications/page.tsx` with the exact content migrated from the old `app/admin/page.tsx`, but remove the header/logout (now handled by AdminShell) and remove the outer `minHeight: 100vh` wrapper:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  company_name: string;
  company_size: string | null;
  role: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  approved: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  rejected: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const tabs = ["all", "pending", "approved", "rejected"] as const;

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    const res = await fetch(`/api/admin/applications${params}`);
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeTab, router]);

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    setActionLoading(id);
    const res = await fetch(`/api/admin/applications/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      fetchApplications();
    } else {
      const data = await res.json();
      alert(data.error || `Failed to ${action}`);
    }
    setActionLoading(null);
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                activeTab === tab ? "rgb(11,5,29)" : "white",
              color:
                activeTab === tab ? "white" : "rgb(97,95,109)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            Loading...
          </div>
        ) : applications.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            No {activeTab !== "all" ? activeTab : ""} applications.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {[
                  "Name",
                  "Company",
                  "Email",
                  "Phone",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    {app.first_name} {app.last_name}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(11,5,29)",
                    }}
                  >
                    {app.company_name}
                    {app.company_size && (
                      <span
                        style={{
                          color: "rgb(97,95,109)",
                          fontSize: "12px",
                          marginLeft: "6px",
                        }}
                      >
                        ({app.company_size})
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {app.email}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {app.phone || "\u2014"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(app.created_at).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          statusColors[app.status].bg,
                        color: statusColors[app.status].text,
                        textTransform: "capitalize",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {app.status === "pending" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleAction(app.id, "approve")
                          }
                          disabled={actionLoading === app.id}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "rgb(22,163,74)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor:
                              actionLoading === app.id
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              actionLoading === app.id
                                ? 0.6
                                : 1,
                            fontFamily: "inherit",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleAction(app.id, "reject")
                          }
                          disabled={actionLoading === app.id}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgb(220,38,38)",
                            backgroundColor: "white",
                            color: "rgb(220,38,38)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor:
                              actionLoading === app.id
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              actionLoading === app.id
                                ? 0.6
                                : 1,
                            fontFamily: "inherit",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/applications/page.tsx
git commit -m "feat(admin): migrate applications table to /admin/applications"
```

---

### Task 8: Merchants API Routes

**Files:**
- Create: `app/api/admin/merchants/route.ts`
- Create: `app/api/admin/merchants/[id]/route.ts`

- [ ] **Step 1: Create merchants list API**

Create `app/api/admin/merchants/route.ts`:

```ts
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan");
  const search = searchParams.get("search");

  const supabase = createAdminClient();

  let query = supabase
    .from("businesses")
    .select(
      "id, name, email, phone, city, plan, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (plan && ["starter", "growth", "enterprise"].includes(plan)) {
    query = query.eq("plan", plan as any);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ merchants: data });
}
```

- [ ] **Step 2: Create merchant detail/update API**

Create `app/api/admin/merchants/[id]/route.ts`:

```ts
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;

  const [businessRes, profilesRes, locationsRes, customersRes, invoicesRes] =
    await Promise.all([
      supabase.from("businesses").select("*").eq("id", id).single(),
      supabase
        .from("profiles")
        .select("id, first_name, last_name, email, role, status, created_at")
        .eq("business_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("locations")
        .select("id, name, address, city, status")
        .eq("business_id", id),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("business_id", id),
      supabase
        .from("invoices")
        .select("id, amount, status, invoice_date, plan")
        .eq("business_id", id)
        .order("invoice_date", { ascending: false })
        .limit(10),
    ]);

  if (businessRes.error || !businessRes.data) {
    return NextResponse.json(
      { error: "Merchant not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    business: businessRes.data,
    team: profilesRes.data ?? [],
    locations: locationsRes.data ?? [],
    customerCount: customersRes.count ?? 0,
    recentInvoices: invoicesRes.data ?? [],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { id } = params;
  const body = await request.json();

  // Only allow updating plan for now
  const allowedFields: Record<string, boolean> = { plan: true };
  const updates: Record<string, unknown> = {};

  for (const key of Object.keys(body)) {
    if (allowedFields[key]) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("businesses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ business: data });
}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "api/admin/merchants" || echo "No errors"`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/merchants/route.ts app/api/admin/merchants/\[id\]/route.ts
git commit -m "feat(admin): add merchants list and detail API routes"
```

---

### Task 9: Merchants List Page

**Files:**
- Create: `app/admin/merchants/page.tsx`

- [ ] **Step 1: Create merchants list page**

Create `app/admin/merchants/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Merchant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  plan: "starter" | "growth" | "enterprise";
  created_at: string;
};

const planColors: Record<string, { bg: string; text: string }> = {
  starter: { bg: "rgb(249,248,245)", text: "rgb(97,95,109)" },
  growth: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  enterprise: { bg: "rgb(230,255,169)", text: "rgb(11,5,29)" },
};

const plans = ["all", "starter", "growth", "enterprise"] as const;

export default function MerchantsPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] =
    useState<(typeof plans)[number]>("all");
  const [search, setSearch] = useState("");

  const fetchMerchants = useCallback(async () => {
    const params = new URLSearchParams();
    if (activePlan !== "all") params.set("plan", activePlan);
    if (search.trim()) params.set("search", search.trim());
    const qs = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`/api/admin/merchants${qs}`);
    if (res.ok) {
      const data = await res.json();
      setMerchants(data.merchants);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activePlan, search, router]);

  useEffect(() => {
    setLoading(true);
    fetchMerchants();
  }, [fetchMerchants]);

  return (
    <div>
      {/* Filters row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Plan tabs */}
        <div style={{ display: "flex", gap: "4px" }}>
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => setActivePlan(plan)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  activePlan === plan ? "rgb(11,5,29)" : "white",
                color:
                  activePlan === plan ? "white" : "rgb(97,95,109)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {plan}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid rgb(228,227,223)",
            fontSize: "14px",
            fontFamily: "inherit",
            color: "rgb(11,5,29)",
            backgroundColor: "white",
            outline: "none",
            width: "260px",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            Loading...
          </div>
        ) : merchants.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            No merchants found.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {["Name", "Email", "City", "Plan", "Joined"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "rgb(97,95,109)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr
                  key={m.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    router.push(`/admin/merchants/${m.id}`)
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgb(249,248,245)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    <Link
                      href={`/admin/merchants/${m.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {m.name}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {m.email || "\u2014"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {m.city || "\u2014"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          planColors[m.plan]?.bg ??
                          "rgb(249,248,245)",
                        color:
                          planColors[m.plan]?.text ??
                          "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {m.plan}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(m.created_at).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/merchants/page.tsx
git commit -m "feat(admin): add merchants list page with plan filter and search"
```

---

### Task 10: Merchant Detail Page

**Files:**
- Create: `app/admin/merchants/[id]/page.tsx`

- [ ] **Step 1: Create merchant detail page**

Create `app/admin/merchants/[id]/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StatsCard from "../../components/StatsCard";

type Business = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  website: string | null;
  business_type: string | null;
  company_size: string | null;
  plan: "starter" | "growth" | "enterprise";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
};

type TeamMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  status: string | null;
  created_at: string;
};

type Location = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  status: string | null;
};

type Invoice = {
  id: string;
  amount: number;
  status: string;
  invoice_date: string;
  plan: string;
};

const planOptions = ["starter", "growth", "enterprise"] as const;

const invoiceStatusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  failed: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

export default function MerchantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [planUpdating, setPlanUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/merchants/${id}`);
      if (res.status === 401) {
        router.push("/signin");
        return;
      }
      if (res.status === 404) {
        router.push("/admin/merchants");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        setTeam(data.team);
        setLocations(data.locations);
        setCustomerCount(data.customerCount);
        setRecentInvoices(data.recentInvoices);
      }
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handlePlanChange = async (newPlan: string) => {
    if (!business || newPlan === business.plan) return;
    setPlanUpdating(true);
    const res = await fetch(`/api/admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    if (res.ok) {
      const data = await res.json();
      setBusiness(data.business);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update plan");
    }
    setPlanUpdating(false);
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "rgb(97,95,109)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!business) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "rgb(97,95,109)",
        }}
      >
        Merchant not found.
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/merchants"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          color: "rgb(97,95,109)",
          textDecoration: "none",
          marginBottom: "24px",
        }}
      >
        <ArrowLeft size={16} />
        Back to merchants
      </Link>

      {/* Business name + plan selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            className="font-display"
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: "rgb(11,5,29)",
            }}
          >
            {business.name}
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "14px",
              color: "rgb(97,95,109)",
            }}
          >
            Created{" "}
            {new Date(business.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Plan selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "rgb(97,95,109)",
            }}
          >
            Plan:
          </span>
          <select
            value={business.plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            disabled={planUpdating}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgb(228,227,223)",
              fontSize: "14px",
              fontFamily: "inherit",
              color: "rgb(11,5,29)",
              backgroundColor: "white",
              cursor: planUpdating ? "not-allowed" : "pointer",
              opacity: planUpdating ? 0.6 : 1,
            }}
          >
            {planOptions.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatsCard label="Customers" value={customerCount} />
        <StatsCard label="Team Members" value={team.length} />
        <StatsCard label="Locations" value={locations.length} />
      </div>

      {/* Info grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Business Info */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid rgb(228,227,223)",
            padding: "24px",
          }}
        >
          <h3
            className="font-display"
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: 600,
              color: "rgb(11,5,29)",
            }}
          >
            Business Info
          </h3>
          {[
            { label: "Email", value: business.email },
            { label: "Phone", value: business.phone },
            { label: "Address", value: business.address },
            { label: "City", value: business.city },
            { label: "Website", value: business.website },
            { label: "Type", value: business.business_type },
            { label: "Size", value: business.company_size },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "rgb(97,95,109)",
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgb(11,5,29)",
                  fontWeight: 500,
                }}
              >
                {row.value || "\u2014"}
              </span>
            </div>
          ))}
        </div>

        {/* Team */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid rgb(228,227,223)",
            padding: "24px",
          }}
        >
          <h3
            className="font-display"
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: 600,
              color: "rgb(11,5,29)",
            }}
          >
            Team
          </h3>
          {team.length === 0 ? (
            <p
              style={{
                color: "rgb(97,95,109)",
                fontSize: "14px",
              }}
            >
              No team members.
            </p>
          ) : (
            team.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    {member.first_name} {member.last_name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "12px",
                      color: "rgb(97,95,109)",
                    }}
                  >
                    {member.email}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgb(97,95,109)",
                    textTransform: "capitalize",
                  }}
                >
                  {member.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid rgb(228,227,223)",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h3
            className="font-display"
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: 600,
              color: "rgb(11,5,29)",
            }}
          >
            Locations
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "12px",
            }}
          >
            {locations.map((loc) => (
              <div
                key={loc.id}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgb(11,5,29)",
                  }}
                >
                  {loc.name}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: "rgb(97,95,109)",
                  }}
                >
                  {[loc.address, loc.city].filter(Boolean).join(", ") ||
                    "\u2014"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgb(228,227,223)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <h3
            className="font-display"
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "rgb(11,5,29)",
            }}
          >
            Recent Invoices
          </h3>
        </div>
        {recentInvoices.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "rgb(97,95,109)",
              fontSize: "14px",
            }}
          >
            No invoices yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {["Date", "Plan", "Amount", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(inv.invoice_date).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(11,5,29)",
                      textTransform: "capitalize",
                    }}
                  >
                    {inv.plan}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    ${Number(inv.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          invoiceStatusColors[inv.status]?.bg ??
                          "rgb(249,248,245)",
                        color:
                          invoiceStatusColors[inv.status]?.text ??
                          "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/merchants/\[id\]/page.tsx
git commit -m "feat(admin): add merchant detail page with info, team, locations, invoices"
```

---

### Task 11: Invoices API Route

**Files:**
- Create: `app/api/admin/invoices/route.ts`

- [ ] **Step 1: Create invoices list API**

Create `app/api/admin/invoices/route.ts`:

```ts
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();

  let query = supabase
    .from("invoices")
    .select(
      "id, business_id, amount, currency, plan, status, invoice_date, pdf_url, created_at, businesses!inner(name)"
    )
    .order("invoice_date", { ascending: false });

  if (status && ["paid", "pending", "failed"].includes(status)) {
    query = query.eq("status", status as any);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten business name into each invoice row
  const invoices = (data ?? []).map((inv: any) => ({
    id: inv.id,
    business_id: inv.business_id,
    business_name: inv.businesses?.name ?? "Unknown",
    amount: inv.amount,
    currency: inv.currency,
    plan: inv.plan,
    status: inv.status,
    invoice_date: inv.invoice_date,
    pdf_url: inv.pdf_url,
    created_at: inv.created_at,
  }));

  // Also return summary counts
  const [paidRes, pendingRes, failedRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("amount")
      .eq("status", "paid" as any),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending" as any),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed" as any),
  ]);

  const totalRevenue = (paidRes.data ?? []).reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  return NextResponse.json({
    invoices,
    summary: {
      totalRevenue,
      pendingCount: pendingRes.count ?? 0,
      failedCount: failedRes.count ?? 0,
    },
  });
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "api/admin/invoices" || echo "No errors"`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/invoices/route.ts
git commit -m "feat(admin): add GET /api/admin/invoices endpoint with summary stats"
```

---

### Task 12: Invoices Page

**Files:**
- Create: `app/admin/invoices/page.tsx`

- [ ] **Step 1: Create invoices list page**

Create `app/admin/invoices/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatsCard from "../components/StatsCard";

type Invoice = {
  id: string;
  business_id: string;
  business_name: string;
  amount: number;
  currency: string;
  plan: string;
  status: "paid" | "pending" | "failed";
  invoice_date: string;
  pdf_url: string | null;
  created_at: string;
};

type Summary = {
  totalRevenue: number;
  pendingCount: number;
  failedCount: number;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgb(220,252,231)", text: "rgb(22,101,52)" },
  pending: { bg: "rgb(254,249,195)", text: "rgb(133,77,14)" },
  failed: { bg: "rgb(254,226,226)", text: "rgb(153,27,27)" },
};

const statusTabs = ["all", "paid", "pending", "failed"] as const;

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] =
    useState<(typeof statusTabs)[number]>("all");

  const fetchInvoices = useCallback(async () => {
    const params =
      activeStatus !== "all" ? `?status=${activeStatus}` : "";
    const res = await fetch(`/api/admin/invoices${params}`);
    if (res.ok) {
      const data = await res.json();
      setInvoices(data.invoices);
      setSummary(data.summary);
    } else if (res.status === 401) {
      router.push("/signin");
    }
    setLoading(false);
  }, [activeStatus, router]);

  useEffect(() => {
    setLoading(true);
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div>
      {/* Summary cards */}
      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatsCard
            label="Total Revenue"
            value={`$${summary.totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle="All-time paid invoices"
          />
          <StatsCard
            label="Pending"
            value={summary.pendingCount}
            subtitle="Awaiting payment"
          />
          <StatsCard
            label="Failed"
            value={summary.failedCount}
            subtitle="Payment failed"
          />
        </div>
      )}

      {/* Status tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
        }}
      >
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                activeStatus === tab ? "rgb(11,5,29)" : "white",
              color:
                activeStatus === tab ? "white" : "rgb(97,95,109)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            Loading...
          </div>
        ) : invoices.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "rgb(97,95,109)",
            }}
          >
            No {activeStatus !== "all" ? activeStatus : ""} invoices.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {[
                  "Merchant",
                  "Date",
                  "Plan",
                  "Amount",
                  "Status",
                  "PDF",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    <Link
                      href={`/admin/merchants/${inv.business_id}`}
                      style={{
                        textDecoration: "none",
                        color: "rgb(108,71,255)",
                      }}
                    >
                      {inv.business_name}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(97,95,109)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(inv.invoice_date).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "rgb(11,5,29)",
                      textTransform: "capitalize",
                    }}
                  >
                    {inv.plan}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                    }}
                  >
                    ${Number(inv.amount).toFixed(2)}{" "}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgb(97,95,109)",
                        textTransform: "uppercase",
                      }}
                    >
                      {inv.currency}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor:
                          statusColors[inv.status]?.bg ??
                          "rgb(249,248,245)",
                        color:
                          statusColors[inv.status]?.text ??
                          "rgb(97,95,109)",
                        textTransform: "capitalize",
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {inv.pdf_url ? (
                      <a
                        href={inv.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "13px",
                          color: "rgb(108,71,255)",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Download
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(97,95,109)",
                        }}
                      >
                        {"\u2014"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/invoices/page.tsx
git commit -m "feat(admin): add invoices page with summary cards and status filters"
```

---

### Task 13: Verification

- [ ] **Step 1: Type-check all files**

Run: `npx tsc --noEmit --pretty`
Expected: No errors.

- [ ] **Step 2: Verify dev server compiles**

Run: `npx next build 2>&1 | tail -20`
Expected: All routes compile successfully including:
- `/admin` (dashboard)
- `/admin/applications`
- `/admin/merchants`
- `/admin/merchants/[id]`
- `/admin/invoices`
- `/api/admin/stats`
- `/api/admin/merchants`
- `/api/admin/merchants/[id]`
- `/api/admin/invoices`

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(admin): resolve any type-check issues from admin panel build"
```

---

## Self-Review Notes

**Spec coverage check:**
- Dashboard with KPIs: Task 5 (API) + Task 6 (page) -- covered
- Applications page migrated: Task 7 -- covered (stripped header/logout, kept all table logic)
- Merchants list: Task 8 (API) + Task 9 (page) -- covered
- Merchant detail: Task 8 (API detail route) + Task 10 (page) -- covered
- Invoices list + filters: Task 11 (API) + Task 12 (page) -- covered
- Sidebar + Header layout: Task 1 + Task 2 + Task 4 -- covered
- Same brand tokens used throughout: verified (Kyro Black, Lime, Cream, Muted, etc.)
- All inline styles, no Tailwind: verified
- All API routes use `verifyAdmin()` + `createAdminClient()`: verified
- KyroLogo import path from admin components: `../../components/KyroLogo` -- correct (admin/components/ -> app/components/)

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency check:**
- `StatsCard` props `{ label, value, subtitle? }` used consistently in Tasks 3, 6, 10, 12
- `statusColors` map pattern reused identically where needed
- API response shapes match what the page components destructure

---

Plan complete. I was unable to save the file directly due to read-only mode. The full plan content above should be saved to `docs/superpowers/plans/2026-04-14-admin-panel.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?

### Critical Files for Implementation
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/(dashboard)/components/Sidebar.tsx` -- primary pattern to mirror for AdminSidebar
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/(dashboard)/layout.tsx` -- layout shell pattern to replicate for AdminShell
- `/Users/yassineessabar/Documents/GitHub/fidely-card/app/admin/page.tsx` -- current code to migrate to applications/page.tsx
- `/Users/yassineessabar/Documents/GitHub/fidely-card/lib/admin-auth.ts` -- auth verification used by all API routes
- `/Users/yassineessabar/Documents/GitHub/fidely-card/lib/supabase/admin.ts` -- service role client for cross-tenant queries
