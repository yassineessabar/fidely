import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Fidely — Digital Loyalty Cards for Apple & Google Wallet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0b051d 0%, #2C2242 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#0b051d",
              border: "3px solid #e6ffa9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#e6ffa9",
            }}
          >
            f
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            fidely
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Digital Loyalty Cards for
          <span style={{ color: "#e6ffa9" }}> Apple & Google Wallet</span>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          No app download. Launch in 24 hours. +20-30% more repeat visits.
        </div>
      </div>
    ),
    { ...size }
  );
}
