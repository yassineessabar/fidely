"use client";

import { useState } from "react";

const categories = [
  {
    title: "Getting started",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    articles: [
      "How to set up your first loyalty card",
      "Customizing your card design",
      "Setting up your QR code",
      "Adding your first customer",
    ],
  },
  {
    title: "Customer management",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    articles: [
      "How customers add their card",
      "Viewing customer data",
      "Customer segmentation",
      "Exporting your customer list",
    ],
  },
  {
    title: "Notifications",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    articles: [
      "Sending your first push notification",
      "Scheduling notifications",
      "Best practices for notifications",
      "Notification analytics",
    ],
  },
  {
    title: "Analytics & insights",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    articles: [
      "Understanding your dashboard",
      "Tracking repeat visits",
      "Revenue attribution",
      "Fidely AI recommendations",
    ],
  },
  {
    title: "Billing & account",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    articles: [
      "Managing your subscription",
      "Changing your plan",
      "Billing FAQ",
      "Cancellation policy",
    ],
  },
  {
    title: "Integrations",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    articles: [
      "API documentation",
      "Connecting to your POS",
      "Zapier integration",
      "Webhook setup",
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      {/* Hero / search */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0 60px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "white", margin: "0 0 24px" }}>
            How can we help?
          </h1>
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", height: "56px", padding: "0 24px", fontSize: "16px",
                color: "rgb(11,5,29)", backgroundColor: "white", border: "none",
                borderRadius: "9999px", outline: "none", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {categories.map((cat) => (
              <div key={cat.title} style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={cat.icon} />
                  </svg>
                </div>
                <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 16px" }}>{cat.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {cat.articles.map((article) => (
                    <li key={article}>
                      <a href="#" style={{ fontSize: "14px", color: "rgb(97,95,109)", textDecoration: "none", lineHeight: "20px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div style={{ textAlign: "center", marginTop: "64px" }}>
            <p style={{ fontSize: "20px", color: "rgb(97,95,109)", margin: "0 0 16px" }}>
              Can&apos;t find what you&apos;re looking for?
            </p>
            <a href="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "50px", padding: "0 32px", backgroundColor: "rgb(11,5,29)", color: "white", borderRadius: "9999px", fontSize: "16px", fontWeight: 500, textDecoration: "none" }}>
              Contact support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
