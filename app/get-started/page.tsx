"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KyroLogo from "../components/KyroLogo";

export default function GetStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("1");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const canContinue = step === 1 ? companyName.trim().length > 0 : (email.trim().length > 0 && password.length >= 6 && firstName.trim().length > 0);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, companyName, companySize, phone: phone ? `+61${phone.replace(/\s/g, "")}` : "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", backgroundColor: "white", minHeight: "100vh" }}>
      {/* Left */}
      <div className="signup-left" style={{ maxWidth: 640, width: "100%", height: "100vh", flexGrow: 1, flexShrink: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ minHeight: 60 }} />

        <div style={{ paddingLeft: 48, paddingRight: 48, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 20, paddingBottom: 20 }}>

          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{
                height: 4, borderRadius: 99, flex: 1,
                backgroundColor: s <= step ? "#0B051D" : "rgba(10,10,10,0.08)",
                transition: "background-color 0.3s",
              }} />
            ))}
          </div>

          {step === 1 && (
            <>
              <h1 className="font-display" style={{ fontSize: 32, fontWeight: 400, color: "#0B051D", margin: "0 0 8px" }}>
                Tell us about your business
              </h1>
              <p style={{ fontSize: 15, color: "rgb(97,95,109)", margin: "0 0 32px" }}>
                This helps us set up your loyalty program
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Business name"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter" && canContinue) setStep(2); }}
                  style={{
                    width: "100%", height: 52, padding: "0 16px",
                    fontSize: 16, color: "#0B051D",
                    backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                    borderRadius: 12, outline: "none", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />

                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  style={{
                    width: "100%", height: 52, padding: "0 16px",
                    fontSize: 16, color: companySize ? "#0B051D" : "rgb(97,95,109)",
                    backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                    borderRadius: 12, outline: "none", fontFamily: "inherit",
                    boxSizing: "border-box", appearance: "none" as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230b051d' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
                    paddingRight: 40, cursor: "pointer",
                  }}
                >
                  <option value="" disabled>Team size</option>
                  <option value="1">1 location</option>
                  <option value="2-5">2–5 locations</option>
                  <option value="6-20">6–20 locations</option>
                  <option value="20+">20+ locations</option>
                </select>

                <div style={{ display: "flex", border: "1px solid rgb(228,227,223)", borderRadius: 12, overflow: "hidden", backgroundColor: "rgb(249,248,245)" }}>
                  <div style={{ flex: "0 0 72px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRight: "1px solid rgb(228,227,223)", padding: "0 10px", fontSize: 14 }}>
                    <span>🇦🇺</span>
                    <span style={{ fontSize: 13, color: "rgb(97,95,109)" }}>+61</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setPhone(v); }}
                    maxLength={10}
                    placeholder="412 345 678"
                    style={{
                      flex: 1, height: 52, padding: "0 16px",
                      fontSize: 16, color: "#0B051D",
                      backgroundColor: "rgb(249,248,245)", border: "none",
                      borderRadius: 0, outline: "none", fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinue}
                  style={{
                    width: "100%", height: 52, borderRadius: 99, border: "none",
                    backgroundColor: canContinue ? "#0B051D" : "rgba(10,10,10,0.08)",
                    color: canContinue ? "white" : "rgba(10,10,10,0.3)",
                    fontSize: 16, fontWeight: 500, cursor: canContinue ? "pointer" : "not-allowed",
                    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Continue
                  {canContinue && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display" style={{ fontSize: 32, fontWeight: 400, color: "#0B051D", margin: "0 0 8px" }}>
                Create your account
              </h1>
              <p style={{ fontSize: 15, color: "rgb(97,95,109)", margin: "0 0 32px" }}>
                Setting up <strong style={{ color: "#0B051D" }}>{companyName}</strong>
              </p>

              {error && (
                <div style={{
                  marginBottom: 16, padding: "12px 16px",
                  backgroundColor: "rgb(254,242,242)", border: "1px solid rgb(252,165,165)",
                  borderRadius: 12, fontSize: 14, color: "rgb(185,28,28)",
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    autoFocus
                    style={{
                      width: "100%", height: 52, padding: "0 16px",
                      fontSize: 16, color: "#0B051D",
                      backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                      borderRadius: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    style={{
                      width: "100%", height: 52, padding: "0 16px",
                      fontSize: 16, color: "#0B051D",
                      backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                      borderRadius: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  style={{
                    width: "100%", height: 52, padding: "0 16px",
                    fontSize: 16, color: "#0B051D",
                    backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                    borderRadius: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  onKeyDown={(e) => { if (e.key === "Enter" && canContinue && !loading) handleSubmit(); }}
                  style={{
                    width: "100%", height: 52, padding: "0 16px",
                    fontSize: 16, color: "#0B051D",
                    backgroundColor: "rgb(249,248,245)", border: "1px solid rgb(228,227,223)",
                    borderRadius: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!canContinue || loading}
                  style={{
                    width: "100%", height: 52, borderRadius: 99, border: "none",
                    backgroundColor: canContinue && !loading ? "#0B051D" : "rgba(10,10,10,0.08)",
                    color: canContinue && !loading ? "white" : "rgba(10,10,10,0.3)",
                    fontSize: 16, fontWeight: 500, cursor: canContinue && !loading ? "pointer" : "not-allowed",
                    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginTop: 4,
                  }}
                >
                  {loading ? "Creating account..." : "Get Started"}
                  {!loading && canContinue && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "none", border: "none", fontSize: 14, color: "rgb(97,95,109)",
                    cursor: "pointer", fontFamily: "inherit", padding: "8px 0",
                  }}
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          {/* Terms */}
          <p style={{ marginTop: 24, fontSize: 12, lineHeight: "17px", color: "rgb(97,95,109)" }}>
            By continuing, you agree to our{" "}
            <a href="/terms" style={{ color: "#0B051D", textDecoration: "underline", textUnderlineOffset: "1.8px" }}>Terms of Service</a>{" "}and{" "}
            <a href="/privacy" style={{ color: "#0B051D", textDecoration: "underline", textUnderlineOffset: "1.8px" }}>Privacy Policy</a>.
          </p>

          <p style={{ marginTop: 16, fontSize: 14, color: "rgb(97,95,109)", textAlign: "center" }}>
            Already have an account?{" "}
            <a href="/signin" style={{ color: "#0B051D", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>Sign in</a>
          </p>
        </div>

        {/* Footer */}
        <div style={{ paddingLeft: 48, paddingRight: 48, paddingBottom: 24, paddingTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <KyroLogo color="#959391" height={20} />
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Help center", href: "/help" }].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 12, color: "#0B051D", textDecoration: "underline", textUnderlineOffset: "1.8px" }}>{label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="signup-right" style={{
        flexGrow: 2, flexShrink: 0, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0B051D 0%, rgb(44,34,66) 50%, rgb(108,71,255) 100%)",
        minHeight: "100vh",
      }}>
        <div style={{ position: "absolute", top: 20, bottom: 20, left: 20, right: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingLeft: 50, paddingRight: 50, paddingBottom: 60 }}>
          <h2 className="font-display signup-hero-text" style={{ fontSize: 86, fontWeight: 700, lineHeight: "86px", color: "rgb(249,248,245)", margin: 0 }}>
            <span style={{ display: "block" }}>Bring your</span>
            <span style={{ display: "block" }}>customers</span>
            <span style={{ display: "block", color: "rgb(230,255,169)" }}>back.</span>
          </h2>
        </div>
        <div style={{ position: "absolute", top: 60, right: 60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,255,169,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,137,242,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 80, right: 80, width: 220, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, padding: 20, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-display" style={{ color: "#6C47FF", fontWeight: 800, fontSize: 14 }}>K</span>
            </div>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: 12, fontWeight: 600 }}>Kyro Card</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{companyName || "Your Business"}</p>
            </div>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 12 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.5px" }}>Points</p>
            <p style={{ margin: "2px 0 0", color: "white", fontSize: 24, fontWeight: 700 }}>247</p>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 180, right: 60, display: "flex", gap: 12 }}>
          {[{ label: "Repeat rate", value: "+34%", color: "rgb(230,255,169)" }, { label: "Revenue", value: "+31%", color: "white" }].map((s) => (
            <div key={s.label} style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{s.label}</p>
              <p style={{ margin: "4px 0 0", color: s.color, fontSize: 20, fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
