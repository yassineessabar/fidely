"use client";

import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const testimonials = [
  { quote: "We saw +30% revenue in just 3 weeks. No ads, no extra staff. Fidely paid for itself on day one. Absolute game-changer for our café.", author: "Marie L.", date: "15th of March 2025", bg: "rgb(44,34,66)", text: "white", starsWhite: true },
  { quote: "Super simple to set up and my customers actually love it — they ask about their points every visit. Best decision for our business.", author: "Thomas B.", date: "8th of March 2025", bg: "rgb(170,137,242)", text: "rgb(11,5,29)", starsWhite: false },
  { quote: "We replaced paper cards in one day. Now we know exactly who our regulars are and can reward them properly. The data alone is worth it.", author: "Sophie D.", date: "2nd of March 2025", bg: "rgb(230,255,169)", text: "rgb(11,5,29)", starsWhite: false },
  { quote: "The push notifications are a game changer. We send a promo on slow days and the shop fills up. It's free marketing. Can't believe we didn't do this sooner.", author: "Lucas M.", date: "22nd of February 2025", bg: "rgb(228,227,223)", text: "rgb(11,5,29)", starsWhite: false },
  { quote: "I was skeptical at first, but the data speaks. Retention went from 20% to 55% in a month. Fidely just works — simple and effective.", author: "Julie R.", date: "14th of February 2025", bg: "rgb(249,248,245)", text: "rgb(11,5,29)", starsWhite: false },
];

export default function Testimonials() {
  const { ref, isVisible } = useInView();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -382 : 382, behavior: "smooth" });
  };

  return (
    <section id="testimonials" ref={ref} style={{ backgroundColor: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div
          className="testimonials-layout"
          style={{
            display: "grid",
            columnGap: "48px",
            gridTemplateAreas: "'. . controls' 'heading carousel carousel' 'cta carousel carousel' '. carousel carousel'",
            gridTemplateColumns: "348px auto auto",
          }}
        >
          {/* Controls */}
          <div style={{ gridArea: "controls", display: "flex", justifyContent: "flex-end", gap: "8px", alignItems: "center" }}>
            <button onClick={() => scroll("left")} style={{ width: "40px", height: "40px", borderRadius: "100px", border: "none", backgroundColor: "rgb(228,227,223)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 }} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => scroll("right")} style={{ width: "40px", height: "40px", borderRadius: "100px", border: "none", backgroundColor: "rgb(249,248,245)", boxShadow: "rgb(228,227,223) 0px 0px 0px 1px inset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(11,5,29)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Heading */}
          <div style={{ gridArea: "heading" }}>
            <h3
              className={`font-display ${isVisible ? "animate-fade-in-up" : ""}`}
              style={{ fontWeight: 700, fontSize: "52px", lineHeight: "57.2px", color: "rgb(11,5,29)", margin: "0 0 16px" }}
            >
              Businesses love Fidely
            </h3>
            <p style={{ fontSize: "20px", lineHeight: "32px", color: "rgb(97,95,109)", margin: "0 0 40px", fontWeight: 400 }}>
              500+ local businesses grow their revenue with Fidely every day.
            </p>
          </div>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="testimonials-scroll"
            style={{
              gridArea: "carousel",
              overflowX: "scroll",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              margin: "-6px -8px -6px -16px",
              padding: "6px 8px 6px 16px",
              display: "flex",
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} style={{ scrollSnapAlign: "start", paddingRight: "24px", flexShrink: 0 }}>
                <div
                  style={{
                    width: "358px",
                    height: "418.5px",
                    padding: "32px",
                    borderRadius: "24px",
                    border: "1px solid rgb(226,226,231)",
                    boxShadow: "rgba(0,0,0,0.1) 0px 2px 4px 0px",
                    backgroundColor: t.bg,
                    display: "grid",
                    gridTemplateAreas: "'heading' 'author'",
                    gridTemplateRows: "1fr auto",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease-out ${i * 0.1}s, transform 0.5s ease-out ${i * 0.1}s`,
                  }}
                >
                  <div style={{ gridArea: "heading" }}>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: "2px", marginBottom: "32px" }}>
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} width="20" height="20" viewBox="0 0 24 24" fill={t.starsWhite ? "white" : "rgb(11,5,29)"}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p style={{ fontSize: "20px", fontWeight: 500, lineHeight: "24px", color: t.text, margin: 0 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div style={{ gridArea: "author", paddingTop: "32px", alignSelf: "self-end" }}>
                    <p style={{ fontSize: "16px", fontWeight: 500, lineHeight: "24px", color: t.text, margin: 0 }}>
                      {t.author} — {t.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: "64px", color: "rgb(97,95,109)", fontSize: "12px", lineHeight: "12.6px" }}>
          Customer reviews reflect their personal experience and opinion.
        </p>
      </div>
    </section>
  );
}
