"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KyroLogo from "../components/KyroLogo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
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
        {/* Header */}
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
                Set a new password
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
                Choose a strong password for your account.
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
                    New password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "rgb(11,5,29)",
                      marginBottom: "8px",
                    }}
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
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
                      {loading ? "Updating..." : "Update password"}
                    </span>
                  </button>
                </div>
              </form>
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
                Password updated
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
                Your password has been updated successfully. Redirecting you to sign in...
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
                  Go to sign in
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
            <span style={{ display: "block" }}>Fresh</span>
            <span style={{ display: "block", color: "rgb(230,255,169)" }}>start.</span>
          </h2>
        </div>

        <div style={{ position: "absolute", top: "60px", right: "60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(170,137,242,0.2) 0%, transparent 70%)" }} />
      </div>
    </div>
  );
}
