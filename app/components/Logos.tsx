"use client";

import Image from "next/image";
import { useInView } from "../hooks/useInView";

const columns = [
  [
    { name: "Café Bloom", img: "/images/brands/biz-cafe.png", h: 266 },
    { name: "Fresh Gym", img: "/images/brands/biz-gym.png", h: 266 },
    { name: "Glow Salon", img: "/images/brands/biz-salon.png", h: 266 },
    { name: "The Bakery", img: "/images/brands/biz-bakery.png", h: 266 },
  ],
  [
    { name: "Barbershop", img: "/images/brands/biz-barber.png", h: 266 },
    { name: "Pizzeria", img: "/images/brands/biz-pizza.png", h: 266 },
    { name: "Yoga Studio", img: "/images/brands/biz-yoga.png", h: 266 },
    { name: "Pet Shop", img: "/images/brands/biz-pets.png", h: 266 },
  ],
  [
    { name: "Flower Shop", img: "/images/brands/biz-flowers.png", h: 266 },
    { name: "Sushi Bar", img: "/images/brands/biz-sushi.png", h: 266 },
    { name: "Ice Cream", img: "/images/brands/biz-icecream.png", h: 266 },
    { name: "Bookstore", img: "/images/brands/biz-books.png", h: 266 },
  ],
  [
    { name: "Wine Bar", img: "/images/brands/biz-wine.png", h: 266 },
    { name: "Nail Salon", img: "/images/brands/biz-nails.png", h: 266 },
    { name: "Juice Bar", img: "/images/brands/biz-juice.png", h: 266 },
    { name: "Auto Wash", img: "/images/brands/biz-carwash.png", h: 266 },
  ],
];

export default function Logos() {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} style={{ backgroundColor: "white", padding: "80px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header row */}
        <div style={{ display: "grid", columnGap: "40px", gridTemplateColumns: "1fr auto", paddingBottom: "40px" }}>
          <h2
            className={`brands-h2 font-display ${isVisible ? "animate-fade-in-up" : ""}`}
            style={{ fontWeight: 500, fontSize: "40px", lineHeight: "42px", color: "rgb(11,5,29)", margin: 0 }}
          >
            Businesses that use Kyro
          </h2>
          <a href="#cta" style={{ placeSelf: "flex-end end", fontSize: "16px", fontWeight: 400, color: "rgb(11,5,29)", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            See all
          </a>
        </div>

        {/* 4-column grid */}
        <div
          className="brands-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "267px 267px 267px 267px",
            gap: "24px",
            height: "600px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top/bottom fades */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to bottom, rgb(255,255,255), rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to top, rgb(255,255,255), rgba(255,255,255,0))", zIndex: 2, pointerEvents: "none" }} />

          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{ display: "flex", flexDirection: "column", gap: "24px", animation: `${colIdx % 2 === 0 ? "scrollUp" : "scrollDown"} ${25 + colIdx * 5}s linear infinite` }}
            >
              {[...col, ...col].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  style={{
                    height: `${brand.h}px`,
                    width: "100%",
                    position: "relative",
                    borderRadius: "32px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={brand.img}
                    alt={brand.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)", borderRadius: "32px" }} />
                  {/* Name */}
                  <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 1 }}>
                    <span style={{ color: "white", fontSize: "16px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{brand.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
