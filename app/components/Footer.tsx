import KyroLogo from "./KyroLogo";

const footerColumns: Record<string, { label: string; href: string }[]> = {
  Kyro: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Business: [
    { label: "For businesses", href: "/business" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case studies", href: "/blog" },
    { label: "Features", href: "/#why-kyro" },
  ],
  Support: [
    { label: "Help center", href: "/help" },
    { label: "FAQ", href: "/#faq" },
    { label: "Getting started", href: "/help" },
    { label: "Contact support", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <>
      {/* Disclaimer bar */}
      <div
        style={{
          backgroundColor: "rgb(29,25,42)",
          padding: "24px 40px",
          borderBottom: "1px solid rgb(55,53,68)",
        }}
      >
        <div style={{ maxWidth: "1760px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "12.6px",
              color: "rgb(196,195,202)",
              margin: 0,
            }}
          >
            Results may vary. Revenue and retention metrics shown reflect
            averages from Kyro merchants.{" "}
            <a
              href="#"
              className="footer-link"
              style={{
                color: "rgb(196,195,202)",
                textDecoration: "underline",
              }}
            >
              Learn more
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "rgb(29,25,42)",
          color: "rgb(196,195,202)",
          lineHeight: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1760px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ padding: "72px 40px 48px", width: "100%" }}>

            {/* Market selector — Australia flag */}
            <div style={{ marginBottom: "48px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "100px",
                border: "1px solid rgb(55,53,68)",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}>
                {/* Australia flag */}
                <svg width="24" height="16" viewBox="0 0 36 24" fill="none">
                  <rect width="36" height="24" rx="2" fill="#00008B"/>
                  {/* Union Jack simplified */}
                  <path d="M0 0L15 10M15 0L0 10" stroke="white" strokeWidth="2"/>
                  <path d="M0 0L15 10M15 0L0 10" stroke="#C8102E" strokeWidth="1"/>
                  <path d="M7.5 0V10M0 5H15" stroke="white" strokeWidth="3"/>
                  <path d="M7.5 0V10M0 5H15" stroke="#C8102E" strokeWidth="1.5"/>
                  {/* Commonwealth Star */}
                  <circle cx="9" cy="18" r="2" fill="white"/>
                  {/* Southern Cross */}
                  <circle cx="28" cy="6" r="1.2" fill="white"/>
                  <circle cx="32" cy="10" r="1.2" fill="white"/>
                  <circle cx="29" cy="14" r="1.2" fill="white"/>
                  <circle cx="24" cy="11" r="1.2" fill="white"/>
                  <circle cx="27" cy="10" r="0.8" fill="white"/>
                </svg>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "rgb(249,248,245)" }}>Australia</span>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{ marginLeft: "4px" }}>
                  <path d="M1 1L6 6L11 1" stroke="rgb(196,195,202)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* 6-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr 1fr 1fr 1fr",
                gap: "32px",
              }}
              className="footer-grid"
            >
              {/* Columns 1-3: Link columns */}
              {Object.entries(footerColumns).map(
                ([category, links]) => (
                  <div key={category}>
                    <h5
                      className="font-display"
                      style={{
                        color: "rgb(249,248,245)",
                        fontSize: "20px",
                        fontWeight: 700,
                        margin: "0 0 20px",
                        lineHeight: "25.2px",
                      }}
                    >
                      {category}
                    </h5>
                    <ul
                      style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0",
                      }}
                    >
                      {links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="footer-link"
                            style={{
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "rgb(196,195,202)",
                              textDecoration: "none",
                              lineHeight: "14.7px",
                              padding: "8px 0",
                              display: "block",
                              transition: "color 0.2s",
                            }}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* Column 4: Industries */}
              <div>
                <h5
                  className="font-display"
                  style={{
                    color: "rgb(249,248,245)",
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: "0 0 20px",
                    lineHeight: "25.2px",
                  }}
                >
                  Industries
                </h5>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                  }}
                >
                  {[
                    "Cafés",
                    "Restaurants",
                    "Salons",
                    "Barbers",
                    "Bakeries",
                    "Gyms",
                    "Retail",
                  ].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="footer-link"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "rgb(196,195,202)",
                          textDecoration: "none",
                          lineHeight: "14.7px",
                          padding: "8px 0",
                          display: "block",
                          transition: "color 0.2s",
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Card Types */}
              <div>
                <h5
                  className="font-display"
                  style={{
                    color: "rgb(249,248,245)",
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: "0 0 20px",
                    lineHeight: "25.2px",
                  }}
                >
                  Card Types
                </h5>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                  }}
                >
                  {[
                    "Punch Cards",
                    "Reward Cards",
                    "Cashback Cards",
                    "Discount Cards",
                  ].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="footer-link"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "rgb(196,195,202)",
                          textDecoration: "none",
                          lineHeight: "14.7px",
                          padding: "8px 0",
                          display: "block",
                          transition: "color 0.2s",
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 6: Follow / Social */}
              <div>
                <h5
                  className="font-display"
                  style={{
                    color: "rgb(249,248,245)",
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: "0 0 20px",
                    lineHeight: "25.2px",
                  }}
                >
                  Follow
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    {
                      label: "Facebook",
                      d: "M5.156 17.437H1.734V8.531H0V5.578H1.734V3.844C1.734 1.437 2.929 0 5.703 0h2.461v2.953H6.727c-1.149 0-1.571.422-1.571 1.289V5.578h3.047L7.89 8.531H5.156v8.906z",
                      vb: "0 0 9 18",
                      w: 8,
                      h: 18,
                    },
                    {
                      label: "LinkedIn",
                      d: "M18 16.937h-3.879v-6.086c0-1.675-.669-2.552-1.917-2.552-1.36 0-2.139.92-2.139 2.552v6.086H6.264V5.981h3.801v1.478s1.144-1.813 3.31-1.813c2.165 0 4.625 1.322 4.625 5.067v6.224zM2.093 4.419a2.21 2.21 0 110-4.419 2.21 2.21 0 010 4.42zM.132 5.981h3.95v10.956H.131V5.98z",
                      vb: "0 0 18 17",
                      w: 18,
                      h: 17,
                    },
                    {
                      label: "X",
                      d: "M11.397 8.748L17.354 1.824H15.822L10.715 7.764L6.653 1.824H1.538L7.783 10.963L1.538 18.224H3.07L8.462 11.944L12.766 18.224H17.882L11.397 8.748ZM9.24 11.047L8.554 10.073L3.624 2.963H5.92L9.852 8.698L10.537 9.672L15.823 17.133H13.527L9.24 11.047Z",
                      vb: "0 0 20 20",
                      w: 20,
                      h: 20,
                    },
                    {
                      label: "Instagram",
                      d: "M10 1.802c2.67 0 2.987.01 4.042.058 2.71.124 3.976 1.41 4.1 4.1.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.1-1.055.048-1.37.058-4.042.058-2.67 0-2.986-.01-4.04-.058-2.717-.125-3.977-1.416-4.1-4.1-.049-1.055-.059-1.37-.059-4.042 0-2.67.01-2.985.058-4.04.124-2.69 1.387-3.977 4.1-4.1C7.014 1.812 7.33 1.802 10 1.802zM10 0C7.284 0 6.944.012 5.878.06 2.246.227.228 2.242.06 5.877.013 6.944 0 7.284 0 10s.012 3.057.06 4.123c.167 3.632 2.182 5.65 5.818 5.817C6.944 19.988 7.284 20 10 20s3.057-.012 4.123-.06c3.629-.167 5.652-2.182 5.816-5.817.05-1.066.061-1.407.061-4.123s-.012-3.056-.06-4.122C19.77 2.249 17.756.228 14.124.06 13.057.013 12.716 0 10 0zm0 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
                      vb: "0 0 20 20",
                      w: 20,
                      h: 20,
                    },
                    {
                      label: "TikTok",
                      d: "M16.6 5.82s-.51.29-1.18.29c-.88 0-1.83-.33-1.83-.33V12a5 5 0 11-5-5v2.5a2.5 2.5 0 102.5 2.5V0h2.5a3.5 3.5 0 003.01 3.18V5.82z",
                      vb: "0 0 20 20",
                      w: 20,
                      h: 20,
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      className="footer-social"
                      aria-label={social.label}
                      style={{
                        width: "48px",
                        height: "48px",
                        border: "1px solid rgb(55,53,68)",
                        borderRadius: "8px",
                        backgroundColor: "rgb(29,25,42)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                      }}
                    >
                      <svg
                        width={social.w}
                        height={social.h}
                        viewBox={social.vb}
                        fill="rgb(255,255,255)"
                      >
                        <path d={social.d} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Large Kyro wordmark logo */}
            <div style={{ marginTop: "96px" }}>
              <KyroLogo color="rgb(255,255,255)" height={160} />
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid rgb(55,53,68)",
                margin: "32px 0",
              }}
            />

            {/* Bottom bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "128px",
                alignItems: "center",
                paddingBottom: "16px",
              }}
              className="footer-bottom"
            >
              {/* Left: copyright */}
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: "rgb(196,195,202)",
                  margin: 0,
                }}
              >
                &copy; 2024-2025 Kyro. All rights reserved. Kyro
                is a digital loyalty platform for local businesses.
              </p>

              {/* Right: links */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "24px",
                }}
              >
                {[
                  { label: "Privacy policy", href: "/privacy" },
                  { label: "Terms of service", href: "/terms" },
                  { label: "Cookie policy", href: "#" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="footer-link"
                    style={{
                      fontSize: "14px",
                      color: "rgb(196,195,202)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
