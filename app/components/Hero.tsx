"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "580px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#0B051D",
      }}
    >
      {/* Background gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,255,169,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main grid */}
      <div
        className="hero-grid"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gridTemplateRows: "580px",
          alignItems: "end",
          position: "relative",
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
            color: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              zIndex: 4,
              marginLeft: "80px",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            Loyalty
          </span>
          <span
            style={{ zIndex: 1, whiteSpace: "nowrap", display: "block" }}
          >
            that
          </span>
          <span
            style={{
              zIndex: 4,
              marginLeft: "160px",
              whiteSpace: "nowrap",
              display: "block",
              color: "#E6FFA9",
            }}
          >
            pays.
          </span>
        </h1>

        {/* Column 2: Hero image — hand holding phone with Kyro card */}
        <div
          className="animate-hero-image"
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
            marginLeft: "-80px",
            marginRight: "-80px",
          }}
        >
          {/* Subtle glow behind phone */}
          <div
            style={{
              position: "absolute",
              bottom: "120px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "280px",
              height: "350px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(108,71,255,0.2) 0%, rgba(230,255,169,0.06) 50%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              bottom: "-30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Image
              src="/images/hero/hero-main.png"
              alt="Hand holding smartphone showing Kyro digital loyalty card"
              width={560}
              height={747}
              style={{
                width: "auto",
                height: "660px",
                maxHeight: "660px",
                objectFit: "contain",
                filter:
                  "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
              }}
              priority
            />
          </div>
        </div>

        {/* Column 3: Subtitle + Star + CTA */}
        <div
          className="animate-hero-right"
          style={{
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
          <div
            style={{
              alignItems: "flex-start",
              flexDirection: "column-reverse",
              position: "relative",
              display: "flex",
              gap: "16px",
            }}
          >
            <p
              className="hero-subtitle"
              style={{
                margin: "0px",
                padding: "0px",
                color: "#FFFFFF",
                fontSize: "26px",
                fontWeight: 400,
                lineHeight: "36px",
                maxWidth: "580px",
              }}
            >
              Every tap builds loyalty. Every loyalty builds revenue.
            </p>

            {/* Star rating row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexFlow: "row wrap",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: "4px",
                }}
              >
                <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                  <path
                    d="M15.819 18.954L14.214 18.037C13.153 17.431 12.072 16.901 11.002 16.463C10.655 16.321 10.323 16.196 10 16.081C9.677 16.196 9.345 16.32 8.999 16.462C7.928 16.901 6.847 17.431 5.786 18.037L4.181 18.954L4.557 17.144C4.805 15.95 4.975 14.758 5.062 13.603C5.09 13.229 5.106 12.875 5.115 12.532C4.906 12.26 4.685 11.982 4.443 11.698C3.695 10.815 2.857 9.951 1.952 9.128L0.584 7.884L2.422 7.683C3.633 7.55 4.818 7.345 5.946 7.07C6.31 6.981 6.652 6.886 6.982 6.79C7.175 6.506 7.371 6.21 7.567 5.891C8.175 4.908 8.738 3.844 9.24 2.73L10 1.045L10.76 2.73C11.263 3.844 11.825 4.909 12.433 5.892C12.629 6.21 12.825 6.506 13.019 6.79C13.348 6.886 13.689 6.981 14.053 7.07C15.178 7.344 16.365 7.55 17.578 7.684L19.416 7.887L18.048 9.129C17.144 9.95 16.306 10.815 15.557 11.697C15.315 11.982 15.094 12.26 14.884 12.532C14.894 12.875 14.91 13.229 14.938 13.603C15.025 14.756 15.195 15.947 15.443 17.144L15.819 18.954Z"
                    fill="white"
                  />
                </svg>
                <p
                  style={{
                    margin: "0px",
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  Loved by 500+ businesses
                </p>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <a
            href="/signup"
            style={{
              margin: "0px",
              position: "relative",
              zIndex: 4,
              color: "#0B051D",
              background: "#E6FFA9",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px 20px",
              display: "flex",
              flexShrink: 0,
              lineHeight: "16px",
              fontSize: "16px",
              height: "40px",
              width: "min-content",
              borderRadius: "100px",
              whiteSpace: "nowrap",
              transition:
                "box-shadow 0.3s, background 0.3s, color 0.3s, transform 0.3s",
              fontWeight: 500,
              boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px 1px inset",
            }}
          >
            <span>Get Kyro</span>
          </a>

          {/* No app needed — wallet icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            {/* Apple Wallet icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <rect x="2" y="4" width="20" height="5" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <rect x="2" y="8" width="20" height="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
            </svg>
            {/* Google Wallet icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <path d="M2 9h20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <rect x="5" y="14" width="6" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
              No app needed — lives in Apple & Google Wallet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
