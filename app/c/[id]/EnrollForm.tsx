"use client";

import { useState, useRef, FormEvent } from "react";

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
    padding: "14px 16px",
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
        <div style={{ display: "flex", gap: "8px" }}>
          <div
            style={{
              ...inputStyle,
              width: "auto",
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "14px 12px",
              opacity: 0.7,
            }}
          >
            <span style={{ fontSize: "18px" }}>🇦🇺</span>
            <span style={{ fontSize: "14px", color: primaryColor }}>+61</span>
          </div>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="400 000 000"
            style={{ ...inputStyle, flex: 1 }}
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
          style={{
            ...inputStyle,
            colorScheme: "dark",
            minHeight: "52px",
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
          backgroundColor: accentColor || "#6C47FF",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 700,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.7 : 1,
          boxShadow: `0 4px 16px ${accentColor}40`,
          transition: "opacity 0.2s, transform 0.1s",
        }}
      >
        {loading ? "Creating your card..." : "Get My Loyalty Card"}
      </button>

      <div
        style={{
          marginTop: "14px",
          textAlign: "center",
          fontSize: "12px",
          color: primaryColor,
          opacity: 0.3,
        }}
      >
        Added straight to your Apple Wallet
      </div>
    </form>
  );
}
