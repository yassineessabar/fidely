"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KyroLogo from "../components/KyroLogo";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "rgb(255,255,255)",
        minHeight: "100vh",
      }}
    >
      {/* ===== LEFT PANEL ===== */}
      <div
        className="signup-left"
        style={{
          maxWidth: "640px",
          width: "100%",
          height: "100vh",
          flexGrow: 1,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — language selector */}
        <div
          style={{
            paddingLeft: "48px",
            paddingRight: "40px",
            paddingTop: "16px",
            minHeight: "60px",
            maxWidth: "1680px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "9999px",
              padding: "6px 12px",
              fontFamily: "inherit",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(11,5,29)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Language"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 500, lineHeight: "16px", color: "rgb(11,5,29)" }}>
              English
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Main content — centered */}
        <div
          style={{
            paddingLeft: "48px",
            paddingRight: "48px",
            maxWidth: "1680px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            className="font-display signup-heading"
            style={{
              fontSize: "35px",
              fontWeight: 400,
              lineHeight: "40px",
              letterSpacing: "0.1px",
              color: "rgb(11,5,29)",
              margin: 0,
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: "rgb(97,95,109)",
              margin: "12px 0 0",
            }}
          >
            Sign in to manage your loyalty cards, track your customers, and grow your revenue.
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "rgb(254,242,242)",
                border: "1px solid rgb(252,165,165)",
                borderRadius: "12px",
                fontSize: "14px",
                color: "rgb(185,28,28)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div style={{ marginTop: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgb(11,5,29)",
                  marginBottom: "8px",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "50px",
                  padding: "0 16px",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "rgb(11,5,29)",
                  backgroundColor: "rgb(249,248,245)",
                  border: "1px solid rgb(228,227,223)",
                  borderRadius: "12px",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Password input */}
            <div style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgb(11,5,29)",
                  }}
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  style={{
                    fontSize: "13px",
                    color: "rgb(147,51,234)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "50px",
                  padding: "0 16px",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "rgb(11,5,29)",
                  backgroundColor: "rgb(249,248,245)",
                  border: "1px solid rgb(228,227,223)",
                  borderRadius: "12px",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Sign in button */}
            <div style={{ marginTop: "24px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "50px",
                  backgroundColor: loading ? "rgb(107,100,120)" : "rgb(11,5,29)",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                }}
              >
                <span style={{ color: "rgb(249,248,245)", fontSize: "16px", fontWeight: 500, lineHeight: "18px" }}>
                  {loading ? "Signing in..." : "Sign in"}
                </span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgb(228,227,223)" }} />
            <span style={{ fontSize: "12px", color: "rgb(97,95,109)" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgb(228,227,223)" }} />
          </div>

          {/* Google sign in */}
          <button
            style={{
              width: "100%",
              height: "50px",
              marginTop: "24px",
              backgroundColor: "white",
              borderRadius: "9999px",
              border: "1px solid rgb(228,227,223)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              transition: "background-color 0.2s, border-color 0.2s",
              fontFamily: "inherit",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)", lineHeight: "18px" }}>
              Continue with Google
            </span>
          </button>

          {/* Sign up link */}
          <p style={{ marginTop: "32px", fontSize: "14px", color: "rgb(97,95,109)", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" style={{ color: "rgb(11,5,29)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Sign up
            </a>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingBottom: "40px",
            maxWidth: "1680px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ alignSelf: "center" }}>
            <KyroLogo color="#959391" height={20} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Help center", href: "/help" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "17px",
                  color: "rgb(11,5,29)",
                  textDecoration: "underline",
                  textUnderlineOffset: "1.8px",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Hero ===== */}
      <div
        className="signup-right"
        style={{
          flexGrow: 2,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgb(11,5,29) 0%, rgb(44,34,66) 50%, rgb(108,71,255) 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingLeft: "50px",
            paddingRight: "50px",
            paddingBottom: "60px",
          }}
        >
          <h2
            className="font-display signup-hero-text"
            style={{
              fontSize: "86px",
              fontWeight: 700,
              lineHeight: "86px",
              letterSpacing: "0.1px",
              color: "rgb(249,248,245)",
              margin: 0,
            }}
          >
            <span style={{ display: "block" }}>Bring your</span>
            <span style={{ display: "block" }}>customers</span>
            <span style={{ display: "block", color: "rgb(230,255,169)" }}>back.</span>
          </h2>
        </div>

        <div style={{ position: "absolute", top: "60px", right: "60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(170,137,242,0.2) 0%, transparent 70%)" }} />

        <div style={{ position: "absolute", top: "80px", right: "80px", width: "220px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-display" style={{ color: "#6C47FF", fontWeight: 800, fontSize: "14px" }}>f</span>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 600 }}>Kyro Card</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Your Business</p>
            </div>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Points</p>
            <p style={{ margin: "2px 0 0", color: "white", fontSize: "24px", fontWeight: 700 }}>247</p>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "180px", right: "60px", display: "flex", gap: "12px" }}>
          {[
            { label: "Repeat rate", value: "+34%", color: "rgb(230,255,169)" },
            { label: "Revenue", value: "+31%", color: "white" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{s.label}</p>
              <p style={{ margin: "4px 0 0", color: s.color, fontSize: "20px", fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
