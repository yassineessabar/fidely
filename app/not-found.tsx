import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
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
          backgroundColor: "rgb(249,248,245)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "28px", fontWeight: 700, color: "rgb(97,95,109)" }}>?</span>
      </div>
      <h2
        style={{
          fontSize: "52px",
          fontWeight: 500,
          margin: "0 0 12px",
          lineHeight: "55px",
        }}
      >
        Page not found
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
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
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
          textDecoration: "none",
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
