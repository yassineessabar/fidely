"use client";

import { useState } from "react";
import { Store, Palette, Users, MapPin, Bell, CreditCard, Plug, Upload, Plus, Trash2, Check, Copy, Eye, EyeOff } from "lucide-react";

const sections = [
  { key: "business", title: "Business Details", desc: "Name, address, contact info", icon: Store },
  { key: "brand", title: "Brand Settings", desc: "Logo, colors, card design", icon: Palette },
  { key: "team", title: "Team Members", desc: "Manage access and roles", icon: Users },
  { key: "locations", title: "Locations", desc: "Add or manage your stores", icon: MapPin },
  { key: "notifications", title: "Notifications", desc: "Default push settings", icon: Bell },
  { key: "billing", title: "Billing", desc: "Plan, invoices, payment method", icon: CreditCard },
  { key: "integrations", title: "Integrations", desc: "POS, API keys, webhooks", icon: Plug },
];

const teamMembers = [
  { name: "Marie Lefèvre", email: "marie@cafebloom.com", role: "Owner", avatar: "ML", status: "Active" },
  { name: "Thomas Bernard", email: "thomas@cafebloom.com", role: "Manager", avatar: "TB", status: "Active" },
  { name: "Sophie Martin", email: "sophie@cafebloom.com", role: "Staff", avatar: "SM", status: "Active" },
];

const locations = [
  { name: "Café Bloom — Rivoli", address: "12 Rue de Rivoli, 75001 Paris", customers: 847, status: "Active" },
  { name: "Café Bloom — Marais", address: "38 Rue des Francs-Bourgeois, 75003 Paris", customers: 412, status: "Active" },
];

const invoices = [
  { date: "Mar 1, 2025", amount: "$79.00", plan: "Growth", status: "Paid" },
  { date: "Feb 1, 2025", amount: "$79.00", plan: "Growth", status: "Paid" },
  { date: "Jan 1, 2025", amount: "$79.00", plan: "Growth", status: "Paid" },
  { date: "Dec 1, 2024", amount: "$29.00", plan: "Starter", status: "Paid" },
];

const integrations = [
  { name: "Square POS", desc: "Sync transactions automatically", connected: true },
  { name: "Zapier", desc: "Connect to 5,000+ apps", connected: false },
  { name: "Google Sheets", desc: "Export customer data", connected: true },
  { name: "Mailchimp", desc: "Sync email lists", connected: false },
];

function InputField({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "6px" }}>{label}</label>
      <input
        defaultValue={value}
        type={type}
        style={{ width: "100%", height: "44px", padding: "0 14px", fontSize: "14px", color: "rgb(11,5,29)", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "10px", outline: "none", fontFamily: "inherit" }}
      />
    </div>
  );
}

function SaveBar() {
  return (
    <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
      <button style={{ padding: "10px 24px", borderRadius: "10px", border: "none", backgroundColor: "rgb(11,5,29)", color: "white", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Save changes</button>
      <button style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", color: "rgb(97,95,109)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{ width: "44px", height: "24px", borderRadius: "12px", backgroundColor: on ? "rgb(11,5,29)" : "rgb(228,227,223)", padding: "2px", cursor: "pointer", transition: "background-color 0.2s" }}>
      <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: on ? "rgb(230,255,169)" : "white", transform: on ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s" }} />
    </div>
  );
}

/* ===== Section content components ===== */

function BusinessSection() {
  return (
    <>
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>Business Details</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <InputField label="Business name" value="Café Bloom" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <InputField label="Email" value="hello@cafebloom.com" type="email" />
          <InputField label="Phone" value="+33 1 23 45 67 89" />
        </div>
        <InputField label="Address" value="12 Rue de Rivoli, 75001 Paris" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <InputField label="City" value="Paris" />
          <InputField label="Postal code" value="75001" />
        </div>
        <InputField label="Website" value="www.cafebloom.com" />
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "6px" }}>Business type</label>
          <select defaultValue="cafe" style={{ width: "100%", height: "44px", padding: "0 14px", fontSize: "14px", color: "rgb(11,5,29)", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "10px", outline: "none", fontFamily: "inherit", appearance: "none" }}>
            <option value="cafe">Café</option>
            <option value="restaurant">Restaurant</option>
            <option value="salon">Salon</option>
            <option value="barber">Barber</option>
            <option value="gym">Gym</option>
            <option value="bakery">Bakery</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>
        <SaveBar />
      </div>
    </>
  );
}

function BrandSection() {
  const colors = ["#6C47FF", "#0B051D", "#E6FFA9", "#AA89F2", "#FF6B6B", "#4ECDC4", "#FFD93D", "#1A1A2E"];

  return (
    <>
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>Brand Settings</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Logo upload */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "10px" }}>Logo</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "16px", backgroundColor: "rgb(11,5,29)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="font-display" style={{ color: "rgb(230,255,169)", fontSize: "28px", fontWeight: 800 }}>f</span>
            </div>
            <div>
              <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)", marginBottom: "4px" }}>
                <Upload size={14} /> Upload logo
              </button>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(97,95,109)" }}>PNG, JPG, SVG. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Brand color */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "10px" }}>Brand color</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {colors.map((c, i) => (
              <div key={c} style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: c, cursor: "pointer", border: i === 0 ? "3px solid rgb(11,5,29)" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.15s" }}>
                {i === 0 && <Check size={16} color="white" strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>

        {/* Card style */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "rgb(11,5,29)", marginBottom: "10px" }}>Card style</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { label: "Gradient", bg: "linear-gradient(135deg, #6C47FF, #AA89F2)" },
              { label: "Dark", bg: "linear-gradient(135deg, #0B051D, #2C2242)" },
              { label: "Light", bg: "linear-gradient(135deg, #E6FFA9, #c8e880)" },
            ].map((s, i) => (
              <div key={s.label} style={{ borderRadius: "12px", overflow: "hidden", border: i === 0 ? "2px solid rgb(11,5,29)" : "2px solid transparent", cursor: "pointer" }}>
                <div style={{ height: "80px", background: s.bg, display: "flex", alignItems: "flex-end", padding: "8px 12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: i === 2 ? "rgb(11,5,29)" : "white" }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <InputField label="Card title" value="Café Bloom" />
        <InputField label="Card subtitle" value="Loyalty Card" />
        <SaveBar />
      </div>
    </>
  );
}

function TeamSection() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Team Members</h2>
        <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "rgb(11,5,29)", color: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={14} /> Invite member
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {teamMembers.map((m, i) => (
          <div key={m.email} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", borderBottom: i < teamMembers.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgb(249,248,245)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "rgb(11,5,29)", flexShrink: 0 }}>{m.avatar}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{m.name}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "rgb(97,95,109)" }}>{m.email}</p>
            </div>
            <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, backgroundColor: m.role === "Owner" ? "rgba(230,255,169,0.2)" : "rgb(249,248,245)", color: m.role === "Owner" ? "rgb(80,140,20)" : "rgb(97,95,109)" }}>{m.role}</span>
            {m.role !== "Owner" && (
              <button style={{ padding: "6px", borderRadius: "6px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "rgb(97,95,109)" }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function LocationsSection() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>Locations</h2>
        <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "rgb(11,5,29)", color: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={14} /> Add location
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {locations.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", backgroundColor: "rgb(249,248,245)", borderRadius: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={20} color="rgb(11,5,29)" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{l.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgb(97,95,109)" }}>{l.address}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "rgb(11,5,29)" }}>{l.customers}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(97,95,109)" }}>customers</p>
            </div>
            <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, backgroundColor: "rgba(230,255,169,0.2)", color: "rgb(80,140,20)" }}>{l.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function NotificationsSection() {
  const prefs = [
    { label: "Welcome notification", desc: "Sent when a customer adds their card", on: true },
    { label: "Reward reminders", desc: "Remind customers when they're close to a reward", on: true },
    { label: "Birthday messages", desc: "Automatic birthday wish + offer", on: true },
    { label: "Inactivity alerts", desc: "Send a 'We miss you' after X days", on: false },
    { label: "Weekly summary", desc: "Weekly stats sent to your email", on: true },
    { label: "Campaign reports", desc: "Results after each campaign", on: false },
  ];

  return (
    <>
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>Notification Defaults</h2>
      <p style={{ fontSize: "13px", color: "rgb(97,95,109)", margin: "0 0 24px" }}>Control which automatic notifications are enabled.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {prefs.map((p, i) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i < prefs.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{p.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgb(97,95,109)" }}>{p.desc}</p>
            </div>
            <Toggle on={p.on} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Inactivity threshold</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "rgb(97,95,109)" }}>Send &quot;We miss you&quot; after</span>
          <input defaultValue="14" type="number" style={{ width: "60px", height: "36px", padding: "0 10px", fontSize: "14px", color: "rgb(11,5,29)", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", outline: "none", fontFamily: "inherit", textAlign: "center" }} />
          <span style={{ fontSize: "14px", color: "rgb(97,95,109)" }}>days of inactivity</span>
        </div>
      </div>
      <div style={{ marginTop: "24px" }}><SaveBar /></div>
    </>
  );
}

function BillingSection() {
  return (
    <>
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>Billing</h2>

      {/* Current plan */}
      <div style={{ backgroundColor: "rgb(11,5,29)", borderRadius: "16px", padding: "28px", color: "white", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, backgroundColor: "rgba(230,255,169,0.2)", color: "rgb(230,255,169)", marginBottom: "8px", display: "inline-block" }}>Current plan</span>
            <p className="font-display" style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 700 }}>Growth</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="font-display" style={{ margin: 0, fontSize: "32px", fontWeight: 700 }}>$79<span style={{ fontSize: "16px", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo</span></p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
          <span>3 locations</span>
          <span>Unlimited customers</span>
          <span>Kyro AI included</span>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <button style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "rgb(230,255,169)", color: "rgb(11,5,29)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Upgrade plan</button>
          <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel plan</button>
        </div>
      </div>

      {/* Payment method */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Payment method</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "10px" }}>
          <div style={{ width: "40px", height: "28px", borderRadius: "4px", backgroundColor: "rgb(11,5,29)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>VISA</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>•••• •••• •••• 4242</p>
            <p style={{ margin: 0, fontSize: "11px", color: "rgb(97,95,109)" }}>Expires 12/2026</p>
          </div>
          <button style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "white", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: "rgb(11,5,29)" }}>Update</button>
        </div>
      </div>

      {/* Invoices */}
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Invoices</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {invoices.map((inv, i) => (
          <div key={inv.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < invoices.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{inv.date}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgb(97,95,109)" }}>{inv.plan} plan</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)" }}>{inv.amount}</span>
              <span style={{ padding: "3px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 500, backgroundColor: "rgba(230,255,169,0.2)", color: "rgb(80,140,20)" }}>{inv.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function IntegrationsSection() {
  const [showKey, setShowKey] = useState(false);

  return (
    <>
      <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>Integrations</h2>

      {/* API key */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>API Key</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "44px", padding: "0 14px", backgroundColor: "rgb(249,248,245)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "10px", display: "flex", alignItems: "center", fontSize: "14px", color: "rgb(11,5,29)", fontFamily: "monospace" }}>
            {showKey ? "fid_live_sk_a1b2c3d4e5f6g7h8i9j0" : "fid_live_sk_••••••••••••••••••••"}
          </div>
          <button onClick={() => setShowKey(!showKey)} style={{ width: "44px", height: "44px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {showKey ? <EyeOff size={16} color="rgb(97,95,109)" /> : <Eye size={16} color="rgb(97,95,109)" />}
          </button>
          <button style={{ width: "44px", height: "44px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Copy size={16} color="rgb(97,95,109)" />
          </button>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "rgb(97,95,109)" }}>Use this key to authenticate API requests.</p>
      </div>

      {/* Webhook URL */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Webhook URL</h3>
        <InputField label="" value="https://yoursite.com/api/kyro/webhook" />
        <div style={{ marginTop: "12px" }}><SaveBar /></div>
      </div>

      {/* Connected apps */}
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 12px" }}>Connected Apps</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {integrations.map((int) => (
          <div key={int.name} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", backgroundColor: "rgb(249,248,245)", borderRadius: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plug size={18} color="rgb(11,5,29)" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(11,5,29)" }}>{int.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgb(97,95,109)" }}>{int.desc}</p>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: "8px", border: int.connected ? "1px solid rgba(0,0,0,0.08)" : "none", backgroundColor: int.connected ? "white" : "rgb(11,5,29)", color: int.connected ? "rgb(97,95,109)" : "white", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              {int.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===== Main Settings Page ===== */

export default function SettingsPage() {
  const [active, setActive] = useState("business");

  const panels: Record<string, React.ReactNode> = {
    business: <BusinessSection />,
    brand: <BrandSection />,
    team: <TeamSection />,
    locations: <LocationsSection />,
    notifications: <NotificationsSection />,
    billing: <BillingSection />,
    integrations: <IntegrationsSection />,
  };

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 8px" }}>Settings</h1>
      <p style={{ fontSize: "14px", color: "rgb(97,95,109)", margin: "0 0 32px" }}>Manage your business and account</p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }} className="dash-chart-grid">
        {/* Left: nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", borderRadius: "10px", border: "none",
                  backgroundColor: isActive ? "white" : "transparent",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "background-color 0.15s",
                }}
              >
                <Icon size={18} color={isActive ? "rgb(11,5,29)" : "rgb(97,95,109)"} strokeWidth={1.5} />
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: isActive ? 600 : 400, color: isActive ? "rgb(11,5,29)" : "rgb(97,95,109)" }}>{s.title}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "rgb(97,95,109)" }}>{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: active panel */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", border: "1px solid rgba(0,0,0,0.04)" }}>
          {panels[active]}
        </div>
      </div>
    </div>
  );
}
