# CLAUDE.md — Kyro Merchant Dashboard

You are a senior product engineer and SaaS UX designer.

Your task is to design and build the **merchant-side dashboard** for **Kyro**, a loyalty and retention platform for local businesses.

## Product goal

Build a clean, fast, premium dashboard that helps merchants:

- track customer retention
- see revenue impact
- manage loyalty programs
- send push campaigns
- monitor repeat visits
- get AI recommendations

The dashboard should feel like a mix of **Stripe**, **Klarna**, and **Linear**:
minimal, modern, spacious, sharp, business-focused.

## Core principle

This is **not** a complex admin panel.

It must be:

- simple to use
- revenue-focused
- visually premium
- easy for non-technical merchants
- mobile-responsive
- fast to scan in 5 seconds

Merchants should instantly understand:

1. how many customers they have
2. how many came back
3. how much revenue Kyro generated
4. what action to take next

## Tech stack

Build with:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- lucide-react icons
- recharts for charts
- Framer Motion for subtle animations

## Layout structure

Create a merchant dashboard with:

- left sidebar
- top header
- main content area
- responsive mobile behavior

### Sidebar navigation

Include these items:

1. Dashboard
2. Customers
3. Campaigns
4. Loyalty Programs
5. Analytics
6. AI Assistant
7. Settings

Sidebar style:

- dark or neutral premium tone
- simple icons
- active item highlighted
- collapsible on desktop
- drawer on mobile

## Top header

Header should include:

- page title
- date range selector
- search bar
- notifications icon
- merchant profile dropdown

Optional merchant quick switch if multiple locations exist.

## Dashboard page

This is the default merchant home.

### Top KPI cards

Show 4 main cards:

1. Total Customers
2. Repeat Visits
3. Revenue Generated
4. Active Loyalty Cards

Each card should include:

- metric value
- small trend percentage
- comparison vs previous period

Example:
- Revenue Generated: €16,328
- +28.6% vs last month

### Main chart section

Include a clean chart area with:

- Revenue over time
- Visits over time toggle

Use tabs:
- Today
- 7 days
- 4 weeks
- 6 months
- 12 months

### Secondary stats

Include smaller insight cards such as:

- New visits
- Repeat visits
- Referral conversions
- Customer lifetime value
- ROI (example: €1 → €7.86)

### Action panel

Create a section called:

**Recommended actions**

Examples:
- Send a reward reminder
- Reactivate inactive customers
- Launch a lunch-time promo
- Reward your top 20 customers

Each action should have a CTA button.

## Customers page

Build a customer management page.

### Customer table

Columns:

- Name
- Visits
- Points
- Last Visit
- Status
- Total Spend
- Card Type

Filters:

- Active
- Inactive
- VIP
- New
- High value

Features:

- search customer
- sort by visits / spend / inactivity
- click row for customer profile
- export CSV

### Customer profile drawer/page

When clicking a customer, show:

- full name
- contact details
- birthday
- number of visits
- loyalty balance
- last visit
- visit frequency chart
- campaign history
- reward history
- notes / tags

Also show quick actions:

- Send push
- Add points
- Redeem reward
- Tag customer

## Campaigns page

This page helps merchants send wallet push notifications.

### Campaign dashboard

Show:

- Draft campaigns
- Sent campaigns
- Open / engagement rate
- Revenue attributed

### Create campaign flow

Merchant should be able to:

- choose audience
- write message
- preview notification
- schedule now / later

Campaign types:

- Reward unlocked
- We miss you
- Birthday gift
- Flash offer
- Nearby reminder
- Referral push

Add templates merchants can reuse.

## Loyalty Programs page

This page manages the loyalty logic.

### Supported program types

Show cards or tabs for:

- Stamp card
- Points
- Cashback
- Referral
- VIP / Tiering
- Subscriptions
- Passes
- Gift rewards

### Program builder

Merchant can configure:

- program name
- reward threshold
- reward type
- points/stamps rules
- expiry rules
- welcome offer

Also show live preview of the wallet card.

## Analytics page

This page goes deeper into performance.

### Main sections

1. Retention
2. Revenue
3. Customer frequency
4. Program performance
5. Location performance

### Metrics to include

- repeat customer rate
- retention rate
- average visits per customer
- average order value uplift
- loyalty revenue
- referral revenue
- inactive customer percentage
- top-performing campaign

### Visuals

Use clean charts only.

Recommended:
- line chart for revenue / visits
- bar chart for retention cohorts
- segmented chart for customer groups
- leaderboard for top members

## AI Assistant page

Create a page called:

**Kyro AI**

Purpose:
give merchants smart, actionable suggestions.

### AI modules

1. Smart Recommendations
   - “Traffic is down this week — send a lunch promo”
   - “43 customers haven’t visited in 10 days”
   - “Your VIP customers are close to a reward”

2. Suggested Campaigns
   - one-click launchable campaigns
   - editable before sending

3. Revenue Opportunities
   - estimate missed revenue
   - identify underperforming customer segments

4. Natural language prompt box
   Merchant can ask:
   - “Who hasn’t visited in 2 weeks?”
   - “Create a birthday offer campaign”
   - “Show me my top 20 customers”

Keep it elegant and premium, not gimmicky.

## Settings page

Include:

- business details
- brand settings
- logo upload
- wallet card colors
- team members
- location management
- notification defaults
- billing
- integrations

## Design direction

The UI should feel:

- premium
- modern
- calm
- conversion-oriented
- easy to understand

### Styling rules

- generous whitespace
- large headings
- minimal borders
- soft shadows
- rounded-2xl cards
- clean typography hierarchy
- no clutter
- no overly bright colors except subtle brand accent

Suggested accent:
- deep purple or elegant neutral

## Mobile responsiveness

On mobile:

- sidebar becomes drawer
- KPI cards stack vertically
- charts resize cleanly
- tables become cards/list view
- actions remain easy to tap

## Merchant-first UX priorities

Always prioritize these:

1. Revenue clarity
2. Customer clarity
3. Simple actions
4. Fast navigation
5. Low cognitive load

Merchants should never feel overwhelmed.

## MVP priority order

If building in phases, build in this order:

### V1
- Dashboard
- Customers
- Campaigns
- Loyalty Programs

### V2
- Analytics
- AI Assistant
- Settings polish

## Example dashboard summary

At a glance, merchants should see:

- 1,471 new visits
- 188 repeat visits
- €17,298 gross revenue
- €16,328 loyalty revenue
- €970 referral revenue
- ROI: €1 → €7.86

Plus:
- top customers
- best-performing campaign
- recommended next action

## Output requirement

Build the merchant dashboard as a **production-ready SaaS interface** with:

- reusable components
- clean folder structure
- responsive layout
- realistic dummy data
- polished UI
- strong UX hierarchy

Do not build a generic admin panel.
Build a premium retention operating system for local merchants.
