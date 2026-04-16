"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

function useIsApple() {
  const [isApple, setIsApple] = useState(true);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsApple(/iPhone|iPad|iPod|Macintosh/.test(ua));
  }, []);
  return isApple;
}

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function EnrollForm({
  cardId,
  backgroundColor,
  primaryColor,
  secondaryColor,
  accentColor,
}: {
  cardId: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isApple = useIsApple();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/enroll/${cardId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, dob }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const data = await res.json();
      window.location.href = `/api/enroll/${cardId}/pass?code=${data.membership_code}`;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0 16px",
    height: "52px",
    borderRadius: "12px",
    border: `1px solid ${primaryColor}15`,
    backgroundColor: `${primaryColor}06`,
    color: primaryColor,
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600 as const,
    color: primaryColor,
    opacity: 0.5,
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Phone</label>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: primaryColor,
              opacity: 0.5,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🇦🇺
          </span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0400 000 000"
            style={{ ...inputStyle, paddingLeft: "42px" }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Date of Birth</label>
        <input
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          style={{
            ...inputStyle,
            colorScheme: "dark",
            display: "block",
            WebkitAppearance: "none" as any,
            MozAppearance: "none" as any,
            appearance: "none" as any,
            minWidth: 0,
          }}
        />
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "#ff000015",
            color: "#ff6b6b",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          backgroundColor: isApple ? "#000" : "#fff",
          color: isApple ? "#fff" : "#000",
          fontSize: "16px",
          fontWeight: 600,
          border: isApple ? "none" : "1px solid #dadce0",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          transition: "opacity 0.2s",
        }}
      >
        {loading ? (
          "Adding to Wallet..."
        ) : (
          <>
            {isApple ? <AppleIcon /> : <GoogleIcon />}
            {isApple ? "Add to Apple Wallet" : "Add to Google Wallet"}
          </>
        )}
      </button>
    </form>
  );
}
