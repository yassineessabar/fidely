"use client";

import { useState, FormEvent } from "react";

export default function EnrollForm({
  cardId,
  backgroundColor,
  primaryColor,
  accentColor,
}: {
  cardId: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setSuccess(true);
      window.location.href = url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#x2705;</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: primaryColor, marginBottom: "8px" }}>
          You're all set!
        </div>
        <div style={{ fontSize: "14px", color: primaryColor, opacity: 0.7 }}>
          Your loyalty card should be opening now. Add it to your wallet to start collecting rewards.
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: `1px solid ${primaryColor}20`,
    backgroundColor: `${primaryColor}08`,
    color: primaryColor,
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600 as const,
    color: primaryColor,
    opacity: 0.6,
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Full Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Phone</label>
        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+61 412 345 678" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Date of Birth</label>
        <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} style={{ ...inputStyle, colorScheme: "dark", WebkitAppearance: "none" as any, appearance: "none" as any }} />
      </div>
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#ff000020", color: "#ff6b6b", fontSize: "14px", marginBottom: "16px" }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} style={{
        width: "100%", padding: "16px", borderRadius: "12px", backgroundColor: accentColor || "#6C47FF",
        color: "#fff", fontSize: "16px", fontWeight: 700, border: "none",
        cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1,
      }}>
        {loading ? "Creating your card..." : "Get My Loyalty Card"}
      </button>
    </form>
  );
}
