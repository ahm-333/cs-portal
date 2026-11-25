"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const TOP_ROW_ITEMS = [
  {
    code: "CS-213",
    label: "Data Structures",
    href: "/courses/data-structures",
    accent: "var(--success-fg)",
  },
  {
    code: "IS-211",
    label: "Database Systems",
    href: "/courses/database-systems",
    accent: "#2563eb",
  },
  {
    code: "CS-311",
    label: "Operating Systems",
    href: "/courses/operating-systems",
    accent: "var(--accent-warm)",
  },
  {
    code: "CS-321",
    label: "Computer Graphics",
    href: "/courses/computer-graphics",
    accent: "#7c3aed",
  },
] as const;

const BOTTOM_ROW_ITEMS = [
  { label: "Linked Lists & Trees", href: "/courses/data-structures" },
  { label: "ERD · 3NF · SQL Queries", href: "/courses/database-systems" },
  { label: "Process Scheduling & PCB", href: "/courses/operating-systems" },
  { label: "Bresenham & Midpoint Circle", href: "/courses/computer-graphics" },
  { label: "Student Notebook Summaries", href: "/courses/operating-systems" },
  { label: "Exam-Night Cram Mode", href: "/courses" },
] as const;

export function CsMarqueeStrip() {
  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);

  // 60fps Lenis-velocity-driven dual marquee (zero React re-renders)
  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let rafId = 0;
    let lastTime = performance.now();
    let x1 = 0;
    let x2 = 0;
    let smoothSkew = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const rawVel = window.__scrollVelocity ?? 0;
      const hoverScale = hoveredRef.current ? 0.22 : 1;

      // Boost speed smoothly with scroll momentum
      const velBoost = Math.min(260, Math.abs(rawVel) * 5.2);
      const speed1 = (42 + velBoost) * hoverScale;
      const speed2 = (34 + velBoost * 0.85) * hoverScale;

      const half1 = r1.scrollWidth / 2;
      const half2 = r2.scrollWidth / 2;

      if (half1 > 0) {
        x1 -= speed1 * dt;
        if (x1 <= -half1) x1 += half1;
        if (x1 > 0) x1 -= half1;
      }

      if (half2 > 0) {
        x2 += speed2 * dt;
        if (x2 >= 0) x2 -= half2;
        if (x2 < -half2) x2 += half2;
      }

      const targetSkew = Math.max(-2.6, Math.min(2.6, rawVel * 0.09));
      smoothSkew += (targetSkew - smoothSkew) * 0.1;

      r1.style.transform = `translate3d(${x1.toFixed(2)}px, 0, 0) skewX(${smoothSkew.toFixed(2)}deg)`;
      r2.style.transform = `translate3d(${x2.toFixed(2)}px, 0, 0) skewX(${(-smoothSkew * 0.75).toFixed(2)}deg)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      className="py-7 w-full overflow-hidden space-y-3 border-y"
      style={{
        borderColor: "var(--border-soft)",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(194, 94, 51, 0.025) 50%, transparent 100%)",
      }}
      aria-label="المقررات والمفاهيم المتاحة"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      {/* Row 1: Clickable Courses & Codes */}
      <div
        className="marquee-wrap w-full max-w-[1380px] mx-auto overflow-hidden"
        dir="ltr"
      >
        <div
          ref={row1Ref}
          className="flex w-max gap-3.5 will-change-transform"
        >
          {[
            ...TOP_ROW_ITEMS,
            ...TOP_ROW_ITEMS,
            ...TOP_ROW_ITEMS,
            ...TOP_ROW_ITEMS,
          ].map((item, idx) => (
            <Link
              key={`${item.code}-${idx}`}
              href={item.href}
              className="group px-4 py-2.5 rounded-full border text-[12px] font-mono-code font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-warm)] hover:shadow-md"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                style={{ background: item.accent }}
                aria-hidden="true"
              />
              <span style={{ color: item.accent }}>{item.code}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span className="group-hover:underline">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2: Concepts & Features (Opposite Velocity Phase) */}
      <div
        className="marquee-wrap w-full max-w-[1380px] mx-auto overflow-hidden"
        dir="ltr"
      >
        <div
          ref={row2Ref}
          className="flex w-max gap-3.5 will-change-transform"
        >
          {[...BOTTOM_ROW_ITEMS, ...BOTTOM_ROW_ITEMS, ...BOTTOM_ROW_ITEMS].map(
            (item, idx) => (
              <Link
                key={`${item.label}-${idx}`}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full border text-[11.5px] font-mono-code font-semibold whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[var(--brand-primary)] hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
