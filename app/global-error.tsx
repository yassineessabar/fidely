"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            backgroundColor: "#ffffff",
            color: "rgb(11,5,29)",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "rgb(232,255,200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 12px",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgb(97,95,109)",
              margin: "0 0 32px",
              maxWidth: "400px",
              lineHeight: "24px",
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 32px",
              backgroundColor: "rgb(11,5,29)",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
