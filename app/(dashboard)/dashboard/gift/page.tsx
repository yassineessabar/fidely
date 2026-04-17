"use client";

import { useState } from "react";

const AMOUNTS = [25, 50, 100, 200];

export default function GiftPage() {
  const [activeTab, setActiveTab] = useState<"send" | "redeem">("send");
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [redeemCode, setRedeemCode] = useState("");

  const MAX_MESSAGE = 300;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "rgba(10,10,10,0.9)",
              margin: "0 0 6px",
              letterSpacing: "-0.4px",
            }}
          >
            Gift Cards
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(10,10,10,0.5)",
              margin: 0,
            }}
          >
            Send credits to a friend or colleague
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: 4,
            backgroundColor: "rgba(10,10,10,0.04)",
            borderRadius: 10,
            padding: 4,
            marginBottom: 32,
            width: "fit-content",
          }}
        >
          {(["send", "redeem"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor:
                  activeTab === tab ? "#fff" : "transparent",
                color:
                  activeTab === tab
                    ? "rgba(10,10,10,0.9)"
                    : "rgba(10,10,10,0.5)",
                boxShadow:
                  activeTab === tab
                    ? "0 1px 4px rgba(0,0,0,0.08)"
                    : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab === "send" ? "Send a Gift Card" : "Redeem a Code"}
            </button>
          ))}
        </div>

        {/* Send Tab */}
        {activeTab === "send" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* Form */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgba(10,10,10,0.06)",
                borderRadius: 16,
                padding: 32,
              }}
            >
              {/* Amount Selector */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(10,10,10,0.6)",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Amount
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border:
                          selectedAmount === amount
                            ? "2px solid #7c3aed"
                            : "1px solid rgba(10,10,10,0.1)",
                        backgroundColor:
                          selectedAmount === amount
                            ? "rgba(124,58,237,0.06)"
                            : "#fff",
                        color:
                          selectedAmount === amount
                            ? "#7c3aed"
                            : "rgba(10,10,10,0.7)",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Jane Doe"
                  style={inputStyle}
                />
              </div>

              {/* Recipient Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="jane@example.com"
                  style={inputStyle}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label style={labelStyle}>Personal Message</label>
                  <span
                    style={{
                      fontSize: 12,
                      color:
                        message.length > MAX_MESSAGE - 20
                          ? "#ef4444"
                          : "rgba(10,10,10,0.35)",
                    }}
                  >
                    {message.length}/{MAX_MESSAGE}
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_MESSAGE) {
                      setMessage(e.target.value);
                    }
                  }}
                  placeholder="Write a personal message..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 100,
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "rgba(124,58,237,0.35)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>Send Gift Card</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "2px 8px",
                    borderRadius: 20,
                    letterSpacing: "0.3px",
                  }}
                >
                  Coming Soon
                </span>
              </button>
            </div>

            {/* Preview */}
            <div style={{ position: "sticky", top: 24 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(10,10,10,0.4)",
                  margin: "0 0 12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Preview
              </p>
              <div
                style={{
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                  padding: 28,
                  aspectRatio: "1.586 / 1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow:
                    "0 20px 60px rgba(249,115,22,0.25), 0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      margin: "0 0 6px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Kyro Gift Card
                  </p>
                  <p
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: "#fff",
                      margin: 0,
                      letterSpacing: "-1px",
                    }}
                  >
                    ${selectedAmount}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      margin: "0 0 2px",
                    }}
                  >
                    From: Your Business
                  </p>
                  {recipientName && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.65)",
                        margin: 0,
                      }}
                    >
                      To: {recipientName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Redeem Tab */}
        {activeTab === "redeem" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgba(10,10,10,0.06)",
                borderRadius: 16,
                padding: 48,
                width: "100%",
                maxWidth: 440,
                textAlign: "center",
              }}
            >
              {/* Gift Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: "rgba(124,58,237,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="4"
                    rx="1"
                    stroke="#7c3aed"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 11v9a1 1 0 001 1h14a1 1 0 001-1v-9"
                    stroke="#7c3aed"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7V21"
                    stroke="#7c3aed"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7C12 7 9 7 9 4.5C9 3 10.5 2 12 4C13.5 2 15 3 15 4.5C15 7 12 7 12 7Z"
                    stroke="#7c3aed"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "rgba(10,10,10,0.9)",
                  margin: "0 0 8px",
                }}
              >
                Redeem a gift card
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(10,10,10,0.5)",
                  margin: "0 0 28px",
                }}
              >
                Enter the code from your gift card
              </p>

              <input
                type="text"
                value={redeemCode}
                onChange={(e) =>
                  setRedeemCode(e.target.value.toUpperCase().slice(0, 16))
                }
                placeholder="XXXX-XXXX-XXXX-XXXX"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(10,10,10,0.1)",
                  fontSize: 20,
                  fontFamily: "monospace",
                  fontWeight: 600,
                  textAlign: "center",
                  letterSpacing: "2px",
                  color: "rgba(10,10,10,0.9)",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 16,
                }}
              />

              <button
                disabled
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "rgba(124,58,237,0.35)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "not-allowed",
                  marginBottom: 20,
                }}
              >
                Redeem
              </button>

              <p
                style={{
                  fontSize: 12,
                  color: "rgba(10,10,10,0.35)",
                  margin: 0,
                }}
              >
                Gift cards are valid for 12 months from purchase date
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(10,10,10,0.6)",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid rgba(10,10,10,0.1)",
  fontSize: 14,
  color: "rgba(10,10,10,0.9)",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  transition: "border-color 0.15s ease",
};
