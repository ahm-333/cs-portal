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
            className="inline-flex items-center gap-2.5 whitespace-nowrap text-[12px] sm:text-[13px] font-bold text-[#1e2c44] transition-colors duration-200 hover:text-[#111a2c] dark:text-[#d8d3c9] dark:hover:text-[#f6f4ef]"
          >
            <span className="font-mono-code text-[10px] sm:text-[11px] font-extrabold px-[7px] py-[2px] rounded-[6px] border border-[#1e355c]/[0.18] bg-white/95 text-[#b54d24] shadow-[0_1px_2px_rgba(18,28,45,0.06)] dark:border-[#d8b07a]/30 dark:bg-[#d8b07a]/[0.08] dark:text-[#e7c592] dark:shadow-none">
              {item.code}
            </span>
            <span>{item.label}</span>
          </span>

          <span
            aria-hidden="true"
            className="inline-block w-[5px] h-[5px] rotate-45 shrink-0 bg-[#c25e33]/75 dark:bg-[#d8b07a]/70"
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

  // Ultra-calm, zero-skew, GPU-composited continuous drift with frame-rate-independent hover deceleration
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

      // Frame-rate-independent exponential smoothing for silky hover deceleration
      const targetFactor = hoveredRef.current ? 0.18 : 1;
      const damp = 1 - Math.exp(-5.5 * dt);
      speedFactor += (targetFactor - speedFactor) * damp;

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
      className="relative w-full overflow-hidden border-y border-[#1e355c]/[0.15] bg-white/55 py-3.5 sm:py-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-[2px] dark:border-[#fff5e6]/[0.09] dark:bg-[#fff5e6]/[0.025] dark:shadow-[inset_0_1px_0_rgba(238,210,164,0.06)]"
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
