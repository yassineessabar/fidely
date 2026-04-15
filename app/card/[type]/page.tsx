"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import KyroLogo from "../../components/KyroLogo";

const passTypes: Record<string, { title: string; subtitle: string; desc: string; icon: string; color: string; bgColor: string; rules: string; points?: string; expiry: string }> = {
  punch: {
    title: "Punch Card",
    subtitle: "Buy 9, get the 10th free",
    desc: "Collect stamps with every visit and earn a free reward.",
    icon: "☕",
    color: "rgb(230,255,169)",
    bgColor: "rgb(11,5,29)",
    rules: "Collect 1 stamp per visit. After 9 stamps, redeem your free reward. Card resets after redemption.",
    points: "1 stamp per visit",
    expiry: "12 months from issue",
  },
  reward: {
    title: "Reward Card",
    subtitle: "Earn points, unlock rewards",
    desc: "Earn points with every purchase and redeem exclusive rewards.",
    icon: "🎁",
    color: "rgb(170,137,242)",
    bgColor: "rgb(44,34,66)",
    rules: "Earn 1 point per $1 spent. Redeem points for rewards at any time. Points never expire.",
    points: "1 point per $1",
    expiry: "No expiry",
  },
  membership: {
    title: "Membership Card",
    subtitle: "Your VIP access pass",
    desc: "Unlock member-only benefits, priority access, and exclusive perks.",
    icon: "👑",
    color: "rgb(230,255,169)",
    bgColor: "rgb(11,5,29)",
    rules: "Membership is valid for 12 months. Renew to keep your benefits. VIP perks include early access and special discounts.",
    expiry: "12 months, renewable",
  },
  cashback: {
    title: "Cashback Card",
    subtitle: "Get money back on every visit",
    desc: "Earn cashback on every purchase, redeemable on your next visit.",
    icon: "💰",
    color: "rgb(100,200,150)",
    bgColor: "rgb(15,76,58)",
    rules: "Earn 5% cashback on every purchase. Minimum $50 balance to redeem. Cashback credited instantly.",
    points: "5% cashback",
    expiry: "6 months from last activity",
  },
  discount: {
    title: "Discount Card",
    subtitle: "Exclusive discounts, always",
    desc: "Present your card for instant discounts on every purchase.",
    icon: "🏷️",
    color: "rgb(255,200,100)",
    bgColor: "rgb(100,70,20)",
    rules: "Show your card at checkout for an instant discount. Valid on all items unless otherwise stated.",
    points: "10% off every purchase",
    expiry: "6 months from issue",
  },
};

function FormInput({ label, name, type = "text", placeholder, required = true, autoComplete }: {
  label?: string; name: string; type?: string; placeholder: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "6px" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%", height: "50px", padding: "0 16px",
            fontSize: "16px", color: "rgb(11,5,29)",
            backgroundColor: "white", border: "1px solid rgb(213,213,221)",
            borderRadius: "10px", outline: "none", fontFamily: "inherit",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        />
        {required && (
          <span style={{ position: "absolute", top: "2px", right: "10px", color: "rgb(137,135,137)", fontSize: "14px" }}>*</span>
        )}
      </div>
    </div>
  );
}

export default function CardEnrollPage() {
  const params = useParams();
  const type = (params.type as string) || "punch";
  const pass = passTypes[type] || passTypes.punch;
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "rgb(249,248,245)" }}>
      {/* Header bar */}
      <div style={{
        backgroundColor: pass.color,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        height: "60px",
        padding: "6px 0",
        marginBottom: "40px",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "47px",
        }}>
          <KyroLogo color="rgb(11,5,29)" height={22} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px 40px" }}>
        {/* Title */}
        <h2 className="font-display" style={{
          fontSize: "24px", fontWeight: 700, lineHeight: "32px",
          color: "rgb(11,5,29)", margin: "0 0 8px", textAlign: "center",
        }}>
          {pass.subtitle}
        </h2>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", textAlign: "center", margin: "0 0 24px" }}>
          {pass.desc}
        </p>

        {/* Card preview */}
        <div style={{
          background: `linear-gradient(135deg, ${pass.bgColor}, ${pass.bgColor === "rgb(11,5,29)" ? "rgb(44,34,66)" : pass.bgColor})`,
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            backgroundColor: "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", flexShrink: 0,
          }}>
            {pass.icon}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{pass.title}</p>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Café Bloom</p>
            {pass.points && (
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: pass.color, fontWeight: 600 }}>{pass.points}</p>
            )}
          </div>
        </div>

        {/* Form card */}
        <div style={{
          backgroundColor: "white",
          border: "1px solid rgb(213,213,221)",
          borderRadius: "12px",
        }}>
          <div style={{ padding: "24px" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <FormInput name="firstName" placeholder="First name" autoComplete="given-name" />
                <FormInput name="lastName" placeholder="Last name" autoComplete="family-name" />

                {/* Phone with country */}
                <div style={{ display: "flex", border: "1px solid rgb(213,213,221)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    flex: "0 0 60px", display: "flex", alignItems: "center", justifyContent: "center",
                    borderRight: "1px solid rgb(213,213,221)", backgroundColor: "white", fontSize: "20px",
                    position: "relative", cursor: "pointer",
                  }}>
                    <select style={{
                      position: "absolute", inset: 0, opacity: 0, cursor: "pointer",
                      fontSize: "14px", fontFamily: "inherit",
                    }}>
                      <option value="FR">France (+33)</option>
                      <option value="US">United States (+1)</option>
                      <option value="GB">United Kingdom (+44)</option>
                      <option value="DE">Germany (+49)</option>
                      <option value="ES">Spain (+34)</option>
                      <option value="IT">Italy (+39)</option>
                      <option value="BE">Belgium (+32)</option>
                      <option value="CH">Switzerland (+41)</option>
                      <option value="NL">Netherlands (+31)</option>
                      <option value="PT">Portugal (+351)</option>
                      <option value="CA">Canada (+1)</option>
                      <option value="AU">Australia (+61)</option>
                      <option value="JP">Japan (+81)</option>
                      <option value="MA">Morocco (+212)</option>
                      <option value="TN">Tunisia (+216)</option>
                    </select>
                    🇫🇷
                  </div>
                  <div style={{ flex: 1, position: "relative" }}>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue="+33"
                      autoComplete="tel"
                      style={{
                        width: "100%", height: "50px", padding: "0 16px",
                        fontSize: "16px", color: "rgb(11,5,29)",
                        backgroundColor: "white", border: "none",
                        outline: "none", fontFamily: "inherit",
                      }}
                    />
                    <span style={{ position: "absolute", top: "2px", right: "10px", color: "rgb(137,135,137)", fontSize: "14px" }}>*</span>
                  </div>
                </div>

                <FormInput name="email" type="email" placeholder="Email" autoComplete="email" />
                <FormInput name="birthday" placeholder="Date of birth (DD/MM/YYYY)" autoComplete="bday" />
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <div
                    onClick={() => setTermsChecked(!termsChecked)}
                    style={{
                      width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                      backgroundColor: termsChecked ? "rgb(11,5,29)" : "white",
                      border: termsChecked ? "none" : "1px solid rgb(213,213,221)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "background-color 0.2s",
                    }}
                  >
                    {termsChecked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500, lineHeight: "20px" }}>
                    I have read and accept the terms of use.
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <div
                    onClick={() => setPrivacyChecked(!privacyChecked)}
                    style={{
                      width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                      backgroundColor: privacyChecked ? "rgb(11,5,29)" : "white",
                      border: privacyChecked ? "none" : "1px solid rgb(213,213,221)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "background-color 0.2s",
                    }}
                  >
                    {privacyChecked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "14px", color: "rgb(11,5,29)", fontWeight: 500, lineHeight: "20px" }}>
                    I agree that my personal data can be used for marketing purposes.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div style={{ marginTop: "32px" }}>
                <button
                  type="submit"
                  style={{
                    width: "100%", height: "56px",
                    backgroundColor: "rgb(11,5,29)", color: "white",
                    border: "none", borderRadius: "10px",
                    fontSize: "16px", fontWeight: 600, fontFamily: "inherit",
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background-color 0.2s",
                  }}
                >
                  Get the card
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "rgb(137,135,137)", lineHeight: "18px" }}>
                  After installing, press the &quot;Add&quot; button in the card preview
                </p>
              </div>

              {/* Accordion sections */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { key: "card", title: "Card information", content: (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div><span style={{ fontSize: "12px", color: "rgb(137,135,137)" }}>Card type</span><p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)" }}>{pass.title}</p></div>
                      <div><span style={{ fontSize: "12px", color: "rgb(137,135,137)" }}>Description</span><p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)" }}>{pass.subtitle}</p></div>
                      {pass.points && <div><span style={{ fontSize: "12px", color: "rgb(137,135,137)" }}>Earning rate</span><p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)" }}>{pass.points}</p></div>}
                      <div><span style={{ fontSize: "12px", color: "rgb(137,135,137)" }}>Expiry</span><p style={{ margin: "2px 0 0", fontSize: "14px", color: "rgb(11,5,29)" }}>{pass.expiry}</p></div>
                    </div>
                  )},
                  { key: "rules", title: "Redemption rules", content: (
                    <p style={{ margin: 0, fontSize: "14px", color: "rgb(11,5,29)", lineHeight: "22px" }}>{pass.rules}</p>
                  )},
                  { key: "privacy", title: "Privacy policy", content: (
                    <p style={{ margin: 0, fontSize: "14px", color: "rgb(11,5,29)", lineHeight: "22px" }}>
                      Your data is collected to provide the loyalty card service. We do not share your information with third parties without your consent. You can request data deletion at any time.
                    </p>
                  )},
                  { key: "terms", title: "Terms of use", content: (
                    <div style={{ fontSize: "14px", color: "rgb(11,5,29)", lineHeight: "22px" }}>
                      <p style={{ margin: "0 0 8px" }}>1. Present your card at checkout to earn or redeem.</p>
                      <p style={{ margin: "0 0 8px" }}>2. Cards are non-transferable and cannot be combined.</p>
                      <p style={{ margin: "0 0 8px" }}>3. The business reserves the right to modify the program.</p>
                      <p style={{ margin: 0 }}>4. Rewards have no cash value unless stated otherwise.</p>
                    </div>
                  )},
                ].map((section) => (
                  <div key={section.key} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.key)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "rgb(137,135,137)" }}>{section.title}</span>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(137,135,137)" strokeWidth="2"
                        style={{ transform: expandedSection === section.key ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div style={{
                      maxHeight: expandedSection === section.key ? "300px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                      paddingBottom: expandedSection === section.key ? "16px" : "0",
                    }}>
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Other card types */}
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "12px", color: "rgb(137,135,137)", textAlign: "center", marginBottom: "12px" }}>Other card types</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(passTypes).filter(([k]) => k !== type).map(([key, p]) => (
              <a
                key={key}
                href={`/card/${key}`}
                style={{
                  padding: "6px 14px", borderRadius: "100px",
                  backgroundColor: "white", border: "1px solid rgb(213,213,221)",
                  fontSize: "12px", fontWeight: 500, color: "rgb(11,5,29)",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
                  transition: "border-color 0.2s",
                }}
              >
                {p.icon} {p.title}
              </a>
            ))}
          </div>
        </div>

        {/* Powered by */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgb(137,135,137)", margin: "0 0 8px" }}>Powered by</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <KyroLogo color="rgb(137,135,137)" height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
