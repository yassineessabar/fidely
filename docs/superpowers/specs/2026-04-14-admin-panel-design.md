# Admin Panel — Full-Featured with Fidely Branding

## Context

The current admin panel is a single page (`/admin`) with a bare applications table and no sidebar navigation. As Fidely grows, admins need a proper dashboard to manage merchants, monitor platform health, and handle billing. This spec upgrades the admin panel to match the merchant dashboard's sidebar + header pattern with Fidely's Kyro branding.

## Layout

Same pattern as the merchant dashboard:

- **Dark sidebar** (Kyro Black `#0B051D`, 240px wide, collapsible to 72px)
  - Logo area (72px height) with "Admin" label beneath the Kyro logo
  - Nav items with lime accent (`#E6FFA9`) for active state
  - Collapse/expand toggle at bottom
- **Sticky header** (72px, white background)
  - Page title on the left
  - Admin avatar dropdown on the right (with logout)
- **Content area**: Off-white background (`#F9F8F5`)
- All inline styles (matching existing codebase pattern)

### Sidebar Navigation Items

| Label | Icon | Route |
|-------|------|-------|
| Dashboard | LayoutDashboard | `/admin` |
| Applications | FileText | `/admin/applications` |
| Merchants | Building2 | `/admin/merchants` |
| Invoices | Receipt | `/admin/invoices` |

## Pages

### 1. Admin Dashboard (`/admin`)

**KPI Cards** (4 across top):
- Total Merchants — count of businesses
- Pending Applications — count where status = 'pending'
- Total Customers — sum of customers across all tenants
- Monthly Revenue — sum of invoices for current month where status = 'paid'

Each card: white background, 12px border-radius, subtle border. Title in muted text (`#615F6D`), value in Kyro Black bold, with a small colored indicator.

**Recent Applications** (below KPIs, left):
- Table showing last 5 pending applications
- Columns: Name, Company, Date
- "View all" link to `/admin/applications`

**Recent Merchants** (below KPIs, right):
- Table showing last 5 approved businesses
- Columns: Name, Plan, Customers
- "View all" link to `/admin/merchants`

### 2. Applications (`/admin/applications`)

The existing applications functionality moved into the new layout:
- Tab filters: All | Pending | Approved | Rejected
- Table columns: Name, Company, Email, Phone, Date, Status, Actions
- Approve (green) and Reject (red) buttons for pending applications
- Status badges: yellow (pending), green (approved), red (rejected)

Fetches from existing `GET /api/admin/applications?status=X` endpoints.
Uses existing `POST /api/admin/applications/[id]/approve` and `POST /api/admin/applications/[id]/reject`.

### 3. Merchants (`/admin/merchants`)

**List View:**
- Table columns: Business Name, Email, Plan, Locations (count), Customers (count), Created Date
- Plan badge: color-coded (Starter = gray, Growth = purple, Enterprise = lime on dark)
- Each row clickable → navigates to `/admin/merchants/[id]`

**Detail View (`/admin/merchants/[id]`):**
- Back button to merchants list
- Business info card: name, email, phone, website, address, business type
- Plan & billing card: current plan, stripe status
- Stats row: Total Customers, Total Visits, Active Loyalty Programs
- Team members table: name, email, role, status
- Locations table: name, address, status

**Quick Actions (on detail page):**
- Change plan dropdown (starter/growth/enterprise) → PATCH
- Toggle active/suspended status → PATCH

### 4. Invoices (`/admin/invoices`)

**Summary Cards** (3 across top):
- Total Revenue — sum of all paid invoices
- MRR — sum of paid invoices for current month
- Avg. Revenue Per Merchant — total revenue / merchant count

**Table:**
- Columns: Business Name, Amount, Plan, Status, Date
- Status badges: green (paid), yellow (pending), red (failed)
- Filter tabs: All | Paid | Pending | Failed

## API Routes

### New Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `GET /api/admin/stats` | GET | Dashboard KPIs |
| `GET /api/admin/merchants` | GET | List all businesses with aggregated stats |
| `GET /api/admin/merchants/[id]` | GET | Single merchant with profiles, locations, stats |
| `PATCH /api/admin/merchants/[id]` | PATCH | Update merchant plan or status |
| `GET /api/admin/invoices` | GET | List all invoices with business names |

### Existing Routes (unchanged)

- `GET /api/admin/applications`
- `POST /api/admin/applications/[id]/approve`
- `POST /api/admin/applications/[id]/reject`

### Route Details

**GET /api/admin/stats**
Returns:
```json
{
  "totalMerchants": 42,
  "pendingApplications": 3,
  "totalCustomers": 5847,
  "monthlyRevenue": 2940
}
```
Queries: COUNT on businesses, COUNT on signup_applications (pending), COUNT on customers, SUM on invoices (current month, paid).

**GET /api/admin/merchants**
Optional query: `?search=term`
Returns array of businesses with aggregated customer_count and location_count.

**GET /api/admin/merchants/[id]**
Returns single business with:
- Business details
- profiles (team members) for that business_id
- locations for that business_id
- Aggregated stats: customer count, visit count, active program count

**PATCH /api/admin/merchants/[id]**
Body: `{ plan?: "starter" | "growth" | "enterprise" }`
Updates the business row. Admin-only via verifyAdmin().

**GET /api/admin/invoices**
Optional query: `?status=paid|pending|failed`
Returns all invoices joined with business name, ordered by date desc.

## File Structure

```
app/admin/
  layout.tsx              — Admin shell (sidebar + header + content)
  page.tsx                — Dashboard (KPIs + recent tables)
  applications/
    page.tsx              — Applications list (migrated from current admin/page)
  merchants/
    page.tsx              — Merchants list
    [id]/
      page.tsx            — Merchant detail
  invoices/
    page.tsx              — Invoices list
  components/
    AdminSidebar.tsx      — Dark sidebar with admin nav items
    AdminHeader.tsx       — Sticky header with title + avatar dropdown
    StatsCard.tsx         — Reusable KPI card component

app/api/admin/
  stats/route.ts          — GET dashboard KPIs
  merchants/route.ts      — GET list merchants
  merchants/[id]/route.ts — GET detail, PATCH update
  invoices/route.ts       — GET list invoices
  applications/           — (existing, unchanged)
```

## Branding Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| Kyro Black | `#0B051D` | Sidebar bg, text, buttons |
| Kyro Lime | `#E6FFA9` | Active nav, notification dot, accent |
| Kyro White | `#F9F8F5` | Content area bg |
| Kyro Purple | `#6C47FF` | Growth plan badge |
| Muted | `#615F6D` | Secondary text, labels |
| Warm Gray | `#E4E3DF` | Borders, dividers |
| Success Green | `rgb(22,163,74)` | Approve button, paid badge |
| Error Red | `rgb(220,38,38)` | Reject button, failed badge |
| Warning Yellow | `rgb(133,77,14)` on `rgb(254,249,195)` | Pending badge |

Typography: `font-display` class for headings (Klarna Title Bold), system font for body.

## Auth & Security

All admin pages and API routes protected by:
- Middleware: `/admin/*` requires authenticated user with `user_type = 'admin'`
- API routes: `verifyAdmin()` check returning 401 if not admin
- Service role client (`createAdminClient()`) for cross-tenant queries that bypass RLS

## Verification

1. Admin sidebar renders with 4 nav items, active state matches current route
2. Dashboard shows live KPI counts from database
3. Applications page works exactly as before (approve/reject flow)
4. Merchants list shows all businesses with correct counts
5. Merchant detail shows business info, team, locations, stats
6. Change plan on merchant detail updates the business row
7. Invoices list shows all invoices with filters
8. Non-admin users redirected away from all /admin/* routes
9. All pages use Fidely branding (Kyro Black sidebar, lime accents, off-white content)
