"use client";

export default function CampaignsPage() {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>
          Campaigns
        </h1>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
          Reach your customers with targeted notifications
        </p>
      </div>

      <div style={{
        padding: "48px",
        textAlign: "center",
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid rgb(228,227,223)",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📣</div>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
          No campaigns yet
        </h2>
        <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
          Send notifications to your customers from the card dashboard. Go to your published card to send your first notification.
        </p>
      </div>
    </div>
  );
}
