"use client";

import { useState } from "react";
import KyroLogo from "./KyroLogo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 700,
        inset: "0px",
      }}
    >
      {/* Overlay for mobile menu */}
      {mobileOpen && (
        <div
          style={{
            display: "block",
            zIndex: 1000,
            backgroundColor: "rgba(14,14,22,0.44)",
            position: "fixed",
            inset: "0px",
            pointerEvents: "auto",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Top bar */}
      <div
        style={{
          padding: "0px 40px",
          position: "sticky",
          zIndex: 1009,
          backgroundColor: "rgb(255,255,255)",
          left: 0,
          right: 0,
          top: 0,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Main nav bar */}
        <div style={{ height: "72px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "48px",
              maxWidth: "1680px",
              margin: "0 auto",
              height: "72px",
            }}
          >
            {/* Left: hamburger + logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  display: "none",
                  appearance: "none",
                  background: mobileOpen ? "rgb(11,5,29)" : "rgb(230,255,169)",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                  height: "40px",
                  width: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                className="mobile-nav-btn"
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.5 4.5L15.5 15.5M15.5 4.5L4.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 5H18M2 10H18M2 15H18" stroke="rgb(11,5,29)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>

              {/* Logo */}
              <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <KyroLogo color="rgb(11,5,29)" height={30} />
              </a>
            </div>

            {/* Center: Nav links */}
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: "4px",
                flex: 1,
              }}
              className="desktop-nav"
            >
              <li>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgb(11,5,29)",
                    backgroundColor: dropdownOpen ? "rgb(228,224,247)" : "transparent",
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background-color 0.2s",
                  }}
                >
                  Discover Kyro
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </li>
              <li>
                <a href="#how-it-works" style={{ display: "flex", alignItems: "center", padding: "8px 16px", fontSize: "14px", fontWeight: 500, color: "rgb(55,53,68)", textDecoration: "none", borderRadius: "999px", transition: "color 0.2s" }}>
                  How it works
                </a>
              </li>
              <li>
                <a href="#why-kyro" style={{ display: "flex", alignItems: "center", padding: "8px 16px", fontSize: "14px", fontWeight: 500, color: "rgb(55,53,68)", textDecoration: "none", borderRadius: "999px", transition: "color 0.2s" }}>
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" style={{ display: "flex", alignItems: "center", padding: "8px 16px", fontSize: "14px", fontWeight: 500, color: "rgb(55,53,68)", textDecoration: "none", borderRadius: "999px", transition: "color 0.2s" }}>
                  Testimonials
                </a>
              </li>
            </ul>

            {/* Right: Sign in + CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto" }} className="desktop-nav">
              <a
                href="/signin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 16px",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgb(11,5,29)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Sign in
              </a>
              <a
                href="/signup"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 20px",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "white",
                  backgroundColor: "rgb(11,5,29)",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Get started
              </a>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "0 16px",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgb(11,5,29)",
                  backgroundColor: "white",
                  border: "1.5px solid rgb(11,5,29)",
                  borderRadius: "999px",
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Book demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown panel */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "104px",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            zIndex: 999,
            padding: "32px 40px",
          }}
        >
          <div style={{ maxWidth: "1680px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(97,95,109)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>For businesses</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href="/business" onClick={() => setDropdownOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "8px 0" }}>Loyalty cards</a>
                <a href="/business" onClick={() => setDropdownOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "8px 0" }}>Customer dashboard</a>
                <a href="/pricing" onClick={() => setDropdownOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "8px 0" }}>Pricing</a>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(97,95,109)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>For customers</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href="/customers" onClick={() => setDropdownOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "8px 0" }}>How it works</a>
                <a href="/customers" onClick={() => setDropdownOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "8px 0" }}>Rewards & offers</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        style={{
          display: mobileOpen ? "flex" : "none",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "375px",
          backgroundColor: "white",
          zIndex: 1002,
          padding: "80px 24px 24px",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        <a href="/business" onClick={() => setMobileOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>For businesses</a>
        <a href="/customers" onClick={() => setMobileOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>For customers</a>
        <a href="/pricing" onClick={() => setMobileOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Pricing</a>
        <a href="/blog" onClick={() => setMobileOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Blog</a>
        <a href="/help" onClick={() => setMobileOpen(false)} style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>Help</a>
        <div style={{ marginTop: "auto", paddingTop: "24px" }}>
          <a
            href="/signup"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0 20px",
              height: "48px",
              fontSize: "16px",
              fontWeight: 500,
              color: "white",
              backgroundColor: "rgb(11,5,29)",
              borderRadius: "999px",
              textDecoration: "none",
              width: "100%",
            }}
          >
            Get started
          </a>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0 20px",
              height: "48px",
              fontSize: "16px",
              fontWeight: 500,
              color: "rgb(11,5,29)",
              backgroundColor: "white",
              border: "1.5px solid rgb(11,5,29)",
              borderRadius: "999px",
              textDecoration: "none",
              width: "100%",
            }}
          >
            Book demo
          </a>
        </div>
      </div>

    </header>
  );
}
