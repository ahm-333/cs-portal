"use client";

import { useEffect, useRef } from "react";

interface RibbonItem {
  code: string;
  label: string;
}

const RIBBON_ITEMS: readonly RibbonItem[] = [
  { code: "01", label: "فيديو الشرح" },
  { code: "02", label: "اقرأ شرح الفصل" },
  { code: "03", label: "ملخص سريع" },
  { code: "04", label: "أسئلة وكويزات" },
  {
    code: "CS",
    label: "مساحة مذاكرة منظّمة لطلبة الحاسبات والذكاء الاصطناعي",
  },
  { code: "00", label: "بدون إعلانات · حفظ تلقائي لتقدّمك" },
] as const;

// Repeat twice inside each seamless half so even ultrawide screens stay full
const HALF_SEQUENCE: readonly RibbonItem[] = [...RIBBON_ITEMS, ...RIBBON_ITEMS];

function RibbonGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex items-center shrink-0 gap-6 sm:gap-7 pr-6 sm:pr-7"
      aria-hidden={hidden || undefined}
    >
      {HALF_SEQUENCE.map((item, idx) => (
        <div
          key={`${item.code}-${idx}`}
          className="inline-flex items-center shrink-0 gap-6 sm:gap-7"
        >
          <span
            dir="rtl"
            className="inline-flex items-center gap-2 whitespace-nowrap text-[12px] sm:text-[13px] font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="font-mono-code text-[10px] sm:text-[11px] font-bold px-[7px] py-[2px] rounded-[6px] border border-[#1e355c]/20 dark:border-[#d8b07a]/25 text-[#c25e33] dark:text-[#d8b07a]"
              style={{ background: "transparent" }}
            >
              {item.code}
            </span>
            <span>{item.label}</span>
          </span>

          <span
            aria-hidden="true"
            className="inline-block w-[5px] h-[5px] rotate-45 shrink-0 bg-[#c25e33]/60 dark:bg-[#d8b07a]/60"
          />
        </div>
      ))}
    </div>
  );
}

export function CsMarqueeStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);

  // Ultra-calm, zero-skew, GPU-composited continuous drift (slows gracefully on hover)
  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = groupRef.current;
    if (!track || !firstGroup) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    let x = 0;
    let speedFactor = 1;
    const BASE_SPEED_PX_PER_SEC = 22;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const targetFactor = hoveredRef.current ? 0.28 : 1;
      speedFactor += (targetFactor - speedFactor) * 0.06;

      const loopWidth = firstGroup.offsetWidth;
      if (loopWidth > 0) {
        x -= BASE_SPEED_PX_PER_SEC * speedFactor * dt;
        if (x <= -loopWidth) {
          x += loopWidth;
        }
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      aria-label="أركان المساحة الدراسية"
      className="relative w-full overflow-hidden border-y py-3.5 sm:py-[15px] bg-[#1e355c]/[0.03] dark:bg-[#fff5e6]/[0.025]"
      style={{
        borderColor: "var(--border-soft)",
      }}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onFocus={() => {
        hoveredRef.current = true;
      }}
      onBlur={() => {
        hoveredRef.current = false;
      }}
    >
      {/* Edge-faded architectural ribbon viewport */}
      <div
        dir="ltr"
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center w-max will-change-transform motion-reduce:w-full motion-reduce:justify-center motion-reduce:flex-wrap motion-reduce:gap-y-2"
        >
          <div ref={groupRef} className="flex items-center shrink-0">
            <RibbonGroup />
          </div>
          <div className="flex items-center shrink-0 motion-reduce:hidden">
            <RibbonGroup hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
