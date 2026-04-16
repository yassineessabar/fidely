"use client";

import { useState, useRef, FormEvent } from "react";

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
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First call: create enrollment and get membership code back
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

      // Redirect to the direct pass download URL
      // This lets Safari handle the pkpass MIME type natively
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
    <form ref={formRef} onSubmit={handleSubmit} style={{ width: "100%" }}>
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
        <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
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
