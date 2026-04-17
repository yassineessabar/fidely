"use client";

import { useState, useEffect } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  stamps: number;
  points: number;
  status: string;
  cardName: string;
  cardType: string;
  joinedAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/merchant/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "rgb(97,95,109)" }}>
        Loading customers...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: 0 }}>
            Customers
          </h1>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", marginTop: "4px" }}>
            {customers.length} total customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid rgb(228,227,223)",
            fontSize: "14px",
            fontFamily: "inherit",
            width: "260px",
            outline: "none",
          }}
        />
      </div>

      {customers.length === 0 ? (
        <div style={{
          padding: "48px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid rgb(228,227,223)",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "rgb(11,5,29)", margin: "0 0 8px" }}>
            No customers yet
          </h2>
          <p style={{ fontSize: "14px", color: "rgb(97,95,109)", maxWidth: "400px", margin: "0 auto", lineHeight: "20px" }}>
            Customers will appear here once they sign up for your loyalty card. Share your card link to start enrolling customers.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid rgb(228,227,223)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgb(228,227,223)" }}>
                {["Name", "Email", "Card", "Progress", "Status", "Joined"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgb(97,95,109)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgb(243,242,238)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "rgb(11,5,29)" }}>
                    {c.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>{c.cardName}</td>
                  <td style={{ padding: "14px 16px", color: "rgb(11,5,29)", fontWeight: 500 }}>
                    {c.cardType === "stamp" ? `${c.stamps} stamps` : `${c.points} pts`}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: c.status === "active" ? "rgb(220,252,231)" : "rgb(254,226,226)",
                        color: c.status === "active" ? "rgb(22,101,52)" : "rgb(153,27,27)",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgb(97,95,109)" }}>
                    {new Date(c.joinedAt).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && search && (
            <div style={{ padding: "32px", textAlign: "center", color: "rgb(97,95,109)" }}>
              No customers matching &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
