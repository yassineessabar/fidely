"use client";

import { PassTemplate } from "../../../lib/wallet/types";
import KyroLogo from "../../components/KyroLogo";

export default function PassCard({ template }: { template: PassTemplate }) {
  const isStamp = template.type === "stamp";

  return (
    <div style={{
      backgroundColor: "rgb(243,232,255)",
      borderRadius: "16px",
      border: "1px solid rgb(216,180,254)",
      overflow: "hidden",
      width: "100%",
      maxWidth: "380px",
    }}>
      {/* Top section: logo + header fields */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <KyroLogo color="rgb(88,28,135)" height={20} />
        {template.headerFields.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(88,28,135)",
              textTransform: "uppercase",
            }}>
              {template.headerFields[0].label}
            </p>
            <p style={{
              margin: "2px 0 0",
              fontSize: "22px",
              fontWeight: 700,
              color: "rgb(88,28,135)",
              lineHeight: 1,
            }}>
              {String(template.headerFields[0].value)}
            </p>
          </div>
        )}
      </div>

      {/* Strip image area */}
      <div style={{
        margin: "12px 20px",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "rgb(192,132,252)",
        minHeight: isStamp ? "100px" : "130px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {isStamp ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px",
            padding: "16px 20px",
            width: "100%",
          }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: "1",
                borderRadius: "50%",
                backgroundColor: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}>
                {"\u2615"}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px", width: "100%" }}>
            <p style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              textTransform: "uppercase",
              whiteSpace: "pre-line",
            }}>
              {template.type === "discount" && "5% OFF FOR\nEVERYTHING\nIN OUR STORE"}
              {template.type === "reward" && "COLLECT\nPOINTS\nGET REWARDS"}
              {template.type === "cashback" && "SPEND\nMORE\nEARN MORE"}
            </p>
          </div>
        )}
      </div>

      {/* Primary + Secondary fields */}
      <div style={{
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        {template.primaryFields.map((field) => (
          <div key={field.key} style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(147,51,234)",
              textTransform: "uppercase",
            }}>
              {field.label}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "20px",
              fontWeight: 700,
              color: "rgb(147,51,234)",
              lineHeight: 1,
            }}>
              {String(field.value)}
            </p>
          </div>
        ))}
        {template.secondaryFields.map((field) => (
          <div key={field.key} style={{ flex: 1, textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "rgb(147,51,234)",
              textTransform: "uppercase",
            }}>
              {field.label}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "20px",
              fontWeight: 700,
              color: "rgb(147,51,234)",
              lineHeight: 1,
            }}>
              {String(field.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Barcode area */}
      <div style={{
        margin: "20px",
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        <div style={{
          width: template.barcodeFormat === "QR" ? "100px" : "200px",
          height: template.barcodeFormat === "QR" ? "100px" : "50px",
          backgroundColor: "rgb(11,5,29)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "80%",
            height: "80%",
            backgroundImage: template.barcodeFormat === "QR"
              ? "repeating-conic-gradient(rgb(11,5,29) 0% 25%, white 0% 50%) 50% / 8px 8px"
              : "repeating-linear-gradient(90deg, rgb(11,5,29) 0px, rgb(11,5,29) 2px, white 2px, white 4px)",
          }} />
        </div>
        <p style={{
          margin: 0,
          fontSize: "11px",
          color: "rgb(107,114,128)",
        }}>
          Powered by Kyro
        </p>
      </div>
    </div>
  );
}
