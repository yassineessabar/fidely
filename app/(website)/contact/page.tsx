"use client";


export default function ContactPage() {
  return (
    <>
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }} className="ai-grid">
            {/* Left: info */}
            <div>
              <h1 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 16px" }}>
                Get in touch
              </h1>
              <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: "0 0 48px", fontWeight: 400 }}>
                Have a question? Want a demo? We&apos;d love to hear from you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {[
                  { label: "Sales", value: "sales@fidely.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { label: "Support", value: "help@fidely.com", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { label: "Office", value: "Paris, France", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(97,95,109)" }}>{item.label}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: 500, color: "rgb(11,5,29)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "40px" }}>
              <h2 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 32px" }}>
                Send us a message
              </h2>
              <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Full name", type: "text", placeholder: "Your name" },
                  { label: "Email", type: "email", placeholder: "you@business.com" },
                  { label: "Business name", type: "text", placeholder: "Your business" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "8px" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      style={{ width: "100%", height: "50px", padding: "0 16px", fontSize: "16px", color: "rgb(11,5,29)", backgroundColor: "white", border: "1px solid rgb(228,227,223)", borderRadius: "12px", outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "8px" }}>Message</label>
                  <textarea
                    placeholder="Tell us about your needs..."
                    rows={4}
                    style={{ width: "100%", padding: "14px 16px", fontSize: "16px", color: "rgb(11,5,29)", backgroundColor: "white", border: "1px solid rgb(228,227,223)", borderRadius: "12px", outline: "none", fontFamily: "inherit", resize: "vertical" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: "100%", height: "50px", backgroundColor: "rgb(11,5,29)", color: "white", borderRadius: "9999px", border: "none", fontSize: "16px", fontWeight: 500, cursor: "pointer", transition: "background-color 0.2s" }}
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
