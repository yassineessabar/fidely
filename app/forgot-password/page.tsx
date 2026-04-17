"use client";

import { useState } from "react";
import KyroLogo from "../components/KyroLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
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
        {/* Header spacer */}
        <div style={{ minHeight: "60px" }} />

        {/* Main content */}
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
          {!success ? (
            <>
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
                Reset your password
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
                Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
              </p>

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
                      {loading ? "Sending..." : "Send reset link"}
                    </span>
                  </button>
                </div>
              </form>

              <p style={{ marginTop: "32px", fontSize: "14px", color: "rgb(97,95,109)", textAlign: "center" }}>
                Remember your password?{" "}
                <a href="/signin" style={{ color: "rgb(11,5,29)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  Sign in
                </a>
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgb(240,253,244)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>

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
                Check your email
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
                If an account exists for <strong style={{ color: "rgb(11,5,29)" }}>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
              </p>

              <div style={{ marginTop: "32px" }}>
                <a
                  href="/signin"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "50px",
                    backgroundColor: "rgb(11,5,29)",
                    borderRadius: "9999px",
                    color: "rgb(249,248,245)",
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Back to sign in
                </a>
              </div>
            </>
          )}
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

      {/* ===== RIGHT PANEL ===== */}
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
            <span style={{ display: "block" }}>We&apos;ve got</span>
            <span style={{ display: "block" }}>your</span>
            <span style={{ display: "block", color: "rgb(230,255,169)" }}>back.</span>
          </h2>
        </div>

        <div style={{ position: "absolute", top: "60px", right: "60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(170,137,242,0.2) 0%, transparent 70%)" }} />

        <div style={{ position: "absolute", top: "80px", right: "80px", width: "220px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 600 }}>Secure reset</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Link expires in 1 hour</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: i <= 3 ? "rgb(230,255,169)" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Strong password</p>
        </div>
      </div>
    </div>
  );
}
