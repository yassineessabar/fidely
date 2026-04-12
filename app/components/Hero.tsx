"use client";

export default function Hero() {
  return (
    <div style={{
      width: "100%",
      height: "600px",
      overflow: "visible",
      borderRadius: "0px",
      margin: "0px",
      position: "relative",
      backgroundColor: "rgb(11, 5, 29)",
    }}>
      <div
        className="hero-grid"
        style={{
          height: "600px",
          textAlign: "start",
          gridTemplateRows: "604.5px",
          gridTemplateColumns: "517.305px 379.391px 517.305px",
          margin: "0px",
          padding: "0px 24px",
          position: "sticky",
          alignItems: "end",
          display: "grid",
          top: "0px",
          overflow: "hidden",
        }}
      >
        {/* Column 1: Staggered headline */}
        <h1
          className="hero-h1 font-display animate-hero-headline"
          style={{
            placeSelf: "center end",
            flexDirection: "column",
            alignSelf: "center",
            alignItems: "flex-start",
            margin: "0px -50px 0px 0px",
            position: "relative",
            fontSize: "90px",
            lineHeight: "99px",
            display: "flex",
            justifySelf: "end",
            maxWidth: "100%",
            zIndex: 5,
            padding: "0px",
            color: "rgb(255, 255, 255)",
            fontWeight: 700,
          }}
        >
          <span style={{ zIndex: 4, marginLeft: "80px", whiteSpace: "nowrap", display: "block" }}>
            Loyalty
          </span>
          <span style={{ zIndex: 1, whiteSpace: "nowrap", display: "block" }}>
            that
          </span>
          <span style={{ zIndex: 4, marginLeft: "160px", whiteSpace: "nowrap", display: "block", color: "rgb(230, 255, 169)" }}>
            pays.
          </span>
        </h1>

        {/* Column 2: Center phone mockup */}
        <div
          className="animate-hero-image"
          style={{
            order: 0,
            marginTop: "0px",
            zIndex: 2,
            marginLeft: "-110px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Phone frame */}
          <div style={{
            height: "600px",
            maxWidth: "none",
            position: "relative",
            bottom: "-36.7px",
            width: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}>
            <div style={{
              width: "260px",
              height: "530px",
              backgroundColor: "#1a1a2e",
              borderRadius: "40px",
              border: "3px solid #2a2a3e",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(160deg, #6C47FF 0%, #8B6FFF 40%, #AA89F2 100%)",
                borderRadius: "37px",
                display: "flex",
                flexDirection: "column",
                padding: "36px 18px 18px",
              }}>
                {/* Dynamic Island */}
                <div style={{ width: "76px", height: "22px", backgroundColor: "#1a1a2e", borderRadius: "20px", margin: "-14px auto 20px" }} />

                {/* Wallet Card */}
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "18px",
                  padding: "18px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      backgroundColor: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span className="font-display" style={{ color: "#6C47FF", fontWeight: 800, fontSize: "15px" }}>f</span>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "white", fontSize: "13px", fontWeight: 600 }}>Fidely Card</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>Café Bloom</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px" }}>Points Balance</p>
                    <p style={{ margin: "3px 0", color: "white", fontSize: "28px", fontWeight: 700 }}>247</p>
                    <div style={{ width: "100%", height: "5px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "65%", height: "100%", backgroundColor: "white", borderRadius: "3px" }} />
                    </div>
                    <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "9px" }}>53 more to your reward</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                    {[
                      { val: "12", label: "Visits" },
                      { val: "3", label: "Rewards" },
                      { val: "Gold", label: "Tier" },
                    ].map((s) => (
                      <div key={s.label} style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "8px",
                        textAlign: "center",
                      }}>
                        <p style={{ margin: 0, color: "white", fontSize: "12px", fontWeight: 700 }}>{s.val}</p>
                        <p style={{ margin: "1px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "8px" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification */}
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "12px",
                  marginTop: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "7px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: "13px",
                    }}>🎁</div>
                    <div>
                      <p style={{ margin: 0, color: "white", fontSize: "10px", fontWeight: 600 }}>Café Bloom</p>
                      <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>Your free coffee is ready!</p>
                    </div>
                  </div>
                </div>

                {/* Apple Wallet badge */}
                <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                  <div style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span style={{ color: "white", fontSize: "10px", fontWeight: 500 }}>Add to Apple Wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Subtitle + Star + CTA */}
        <div
          className="animate-hero-right"
          style={{
            order: 0,
            zIndex: 4,
            placeSelf: "center start",
            maxWidth: "320px",
            margin: "0px 0px 0px 8px",
            padding: "0px",
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Inner wrapper with column-reverse (star above subtitle) */}
          <div style={{
            alignItems: "flex-start",
            flexDirection: "column-reverse",
            position: "relative",
            top: "0px",
            display: "flex",
            gap: "16px",
          }}>
            <p className="hero-subtitle" style={{
              margin: "0px",
              padding: "0px",
              color: "rgb(255, 255, 255)",
              fontSize: "26px",
              fontWeight: 400,
              lineHeight: "36px",
              maxWidth: "700px",
            }}>
              Digital loyalty cards your customers actually use. Collect data, send free notifications, and drive repeat visits — automatically.
            </p>

            {/* Star rating row */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "row wrap", gap: "8px" }}>
              <div style={{ display: "flex", flexFlow: "row wrap", gap: "4px" }}>
                <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                  <path d="M15.819 18.954L14.214 18.037C13.153 17.431 12.072 16.901 11.002 16.463C10.655 16.321 10.323 16.196 10 16.081C9.677 16.196 9.345 16.32 8.999 16.462C7.928 16.901 6.847 17.431 5.786 18.037L4.181 18.954L4.557 17.144C4.805 15.95 4.975 14.758 5.062 13.603C5.09 13.229 5.106 12.875 5.115 12.532C4.906 12.26 4.685 11.982 4.443 11.698C3.695 10.815 2.857 9.951 1.952 9.128L0.584 7.884L2.422 7.683C3.633 7.55 4.818 7.345 5.946 7.07C6.31 6.981 6.652 6.886 6.982 6.79C7.175 6.506 7.371 6.21 7.567 5.891C8.175 4.908 8.738 3.844 9.24 2.73L10 1.045L10.76 2.73C11.263 3.844 11.825 4.909 12.433 5.892C12.629 6.21 12.825 6.506 13.019 6.79C13.348 6.886 13.689 6.981 14.053 7.07C15.178 7.344 16.365 7.55 17.578 7.684L19.416 7.887L18.048 9.129C17.144 9.95 16.306 10.815 15.557 11.697C15.315 11.982 15.094 12.26 14.884 12.532C14.894 12.875 14.91 13.229 14.938 13.603C15.025 14.756 15.195 15.947 15.443 17.144L15.819 18.954Z" fill="white" />
                </svg>
                <p style={{
                  margin: "0px",
                  color: "rgb(255, 255, 255)",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}>
                  Loved by 500+ businesses
                </p>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <a
            href="#cta"
            style={{
              inset: "0px",
              margin: "0px",
              position: "relative",
              zIndex: 4,
              color: "rgb(11, 5, 29)",
              background: "rgb(230, 255, 169)",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              padding: "12px 20px",
              display: "flex",
              flexShrink: 0,
              lineHeight: "16px",
              fontSize: "16px",
              height: "40px",
              width: "min-content",
              borderRadius: "100px",
              whiteSpace: "nowrap",
              transition: "box-shadow 0.3s, background 0.3s, color 0.3s, transform 0.3s",
              fontWeight: 500,
              boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px 1px inset",
            }}
          >
            <span>Book a demo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
