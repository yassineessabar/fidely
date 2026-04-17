"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I create my first loyalty card?",
    a: "Go to Loyalty in the sidebar, click + New Card, pick a template or start from scratch. Customize your branding, set up rewards, and publish.",
  },
  {
    q: "How do customers add the card to their wallet?",
    a: "Share your card link or QR code. Customers fill in their details and the card is added directly to Apple Wallet. No app download needed.",
  },
  {
    q: "Can I send push notifications?",
    a: "Yes! Go to Campaigns to send notifications to all your card members. You can send promos, birthday offers, or location-based alerts.",
  },
  {
    q: "How does the birthday campaign work?",
    a: "Enable it in your card settings under Card Logic. Set the offer message and reward type. The system automatically sends it on each member's birthday.",
  },
  {
    q: "Is there a limit on customers?",
    a: "On the Free Beta plan, there are no limits on cards or customer enrollments. Enjoy unlimited access while we're in beta.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(10,10,10,0.9)",
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            Help & Support
          </h1>
          <div
            style={{
              width: 40,
              height: 2,
              background: "linear-gradient(90deg, #f97316, #10b981)",
              borderRadius: 2,
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              fontSize: 15,
              color: "rgba(10,10,10,0.5)",
              margin: 0,
            }}
          >
            Find answers, get support, or reach out to our team
          </p>
        </div>

        {/* Action Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            {
              title: "Documentation",
              desc: "Guides, tutorials, and API reference",
              bg: "linear-gradient(135deg, #f97316, #ea580c)",
            },
            {
              title: "Community",
              desc: "Join other merchants using Kyro",
              bg: "linear-gradient(135deg, #14b8a6, #0d9488)",
            },
            {
              title: "Contact Support",
              desc: "Get help from our team",
              bg: "linear-gradient(135deg, #475569, #334155)",
            },
          ].map((card) => (
            <ActionCard key={card.title} {...card} />
          ))}
        </div>

        {/* FAQ */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid rgba(10,10,10,0.06)",
            borderRadius: 16,
            padding: 32,
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "rgba(10,10,10,0.9)",
              margin: "0 0 24px",
            }}
          >
            Common Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                isLast={i === faqs.length - 1}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* Contact */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid rgba(10,10,10,0.06)",
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "rgba(10,10,10,0.9)",
              margin: "0 0 8px",
            }}
          >
            Still need help?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(10,10,10,0.5)",
              margin: "0 0 4px",
            }}
          >
            Email us at{" "}
            <a
              href="mailto:hello@wearekyro.com"
              style={{
                color: "rgba(10,10,10,0.9)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              hello@wearekyro.com
            </a>
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(10,10,10,0.4)",
              margin: 0,
            }}
          >
            We typically respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  bg,
}: {
  title: string;
  desc: string;
  bg: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        borderRadius: 16,
        padding: 24,
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.15s ease",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.8)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  isLast,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(10,10,10,0.06)",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(10,10,10,0.9)",
          }}
        >
          {question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(10,10,10,0.4)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <p
          style={{
            fontSize: 14,
            color: "rgba(10,10,10,0.6)",
            margin: "0 0 18px",
            lineHeight: 1.65,
            paddingRight: 36,
          }}
        >
          {answer}
        </p>
      )}
    </div>
  );
}
