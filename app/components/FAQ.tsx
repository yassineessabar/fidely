"use client";

import { useState } from "react";
import { useInView } from "../hooks/useInView";

const faqs = [
  {
    q: "Do my customers need to download an app?",
    a: "No. Everything works directly in Apple Wallet or Google Wallet. 2 clicks → card added. No account, no friction.",
  },
  {
    q: "How long does it take to launch?",
    a: "Your loyalty program is ready in 24 hours. We handle everything for you — you start collecting customers immediately.",
  },
  {
    q: "How do I collect customer data?",
    a: "Automatically. As soon as a customer adds the card, you collect their name, email, and phone number. No forms, no friction.",
  },
  {
    q: "Are notifications really free?",
    a: "Yes. Unlimited push notifications at $0. Compared to SMS which is paid every time. You can contact your customers anytime without spending on ads.",
  },
  {
    q: "Will this actually bring customers back?",
    a: "Yes — that's the whole point. Most businesses see +20–30% more repeat visits and higher customer lifetime value. Because you stay in their phone and remind them to come back.",
  },
  {
    q: "Does this work for my type of business?",
    a: "If your customers come back (or should come back), it works. Perfect for cafés, restaurants, barbers, salons, gyms, retail stores, and more.",
  },
  {
    q: "What if I already use paper loyalty cards?",
    a: "Perfect. You keep the same system, but now you can track customers, send reminders, and increase returns. It's the upgraded version.",
  },
  {
    q: "Is it complicated to use?",
    a: "No. Your team can use it in minutes. No technical skills required.",
  },
  {
    q: "Can I manage multiple locations?",
    a: "Yes. One dashboard, all your stores, centralised data.",
  },
  {
    q: "How much does it cost?",
    a: "Simple monthly subscription. No hidden fees. No cost per message.",
  },
  {
    q: "What if it doesn't work?",
    a: "Then you stop. No long-term commitment. No risk.",
  },
];

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          gap: "24px",
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: "20px",
            fontWeight: 500,
            color: "rgb(11,5,29)",
            lineHeight: "26px",
          }}
        >
          {q}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgb(11,5,29)"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: isOpen ? "300px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            color: "rgb(97,95,109)",
            margin: "0 0 24px",
            maxWidth: "640px",
            fontWeight: 400,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useInView();

  return (
    <section
      id="faq"
      ref={ref}
      style={{
        backgroundColor: "rgb(249,248,245)",
        padding: "80px 0",
      }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "348px 1fr",
            columnGap: "48px",
          }}
          className="faq-grid"
        >
          {/* Left: heading */}
          <div
            className="faq-left"
            style={{
              position: "sticky",
              top: "120px",
              alignSelf: "start",
            }}
          >
            <h2
              className={`font-display ${isVisible ? "animate-fade-in-up" : ""}`}
              style={{
                fontWeight: 500,
                fontSize: "40px",
                lineHeight: "42px",
                color: "rgb(11,5,29)",
                margin: "0 0 16px",
              }}
            >
              Frequently asked questions
            </h2>
            <p
              className={isVisible ? "animate-fade-in-up" : ""}
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "rgb(97,95,109)",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Everything you need to know about Fidely.
            </p>
          </div>

          {/* Right: accordion */}
          <div>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
