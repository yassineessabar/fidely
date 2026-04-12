
export default function CustomersPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "rgb(11,5,29)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "rgb(230,255,169)", margin: "0 0 16px" }}>For customers</p>
          <h1 className="font-display" style={{ fontSize: "66px", lineHeight: "72.6px", fontWeight: 500, color: "white", margin: "0 0 24px", maxWidth: "700px" }}>
            Loyalty, made simple
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgba(255,255,255,0.7)", margin: 0, maxWidth: "600px", fontWeight: 400 }}>
            Add your loyalty card in 2 clicks. No app. No account. Just rewards, right in your wallet.
          </p>
        </div>
      </section>

      {/* How it works for customers */}
      <section style={{ backgroundColor: "white", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "52px", lineHeight: "55px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 48px" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="pricing-grid">
            {[
              { step: "1", title: "Scan the QR code", desc: "At the counter, scan the store's QR code with your phone camera." },
              { step: "2", title: "Add to your wallet", desc: "Tap 'Add to Apple Wallet' or 'Add to Google Wallet'. That's it." },
              { step: "3", title: "Earn rewards automatically", desc: "Every visit earns points. Get notifications when rewards are ready." },
            ].map((s) => (
              <div key={s.step} style={{ backgroundColor: "rgb(249,248,245)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgb(11,5,29)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <span className="font-display" style={{ color: "white", fontSize: "20px", fontWeight: 700 }}>{s.step}</span>
                </div>
                <h3 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ backgroundColor: "rgb(249,248,245)", padding: "80px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h2 className="font-display" style={{ fontSize: "40px", lineHeight: "42px", fontWeight: 500, color: "rgb(11,5,29)", margin: "0 0 48px", textAlign: "center" }}>
            Why you&apos;ll love it
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }} className="pricing-grid">
            {[
              { title: "No app to download", desc: "Works with the wallet already on your phone." },
              { title: "No account needed", desc: "No email, no password. Just scan and go." },
              { title: "Free rewards", desc: "Earn points and unlock free products automatically." },
              { title: "Exclusive offers", desc: "Get deals sent directly to your lock screen." },
            ].map((b) => (
              <div key={b.title} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px" }}>
                <h3 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>{b.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "20px", color: "rgb(97,95,109)", margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
