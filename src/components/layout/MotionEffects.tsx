"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global Motion & Micro-Interaction Controller:
 * 1. Renders and updates `#scrollProgressBar` on scroll.
 * 2. Initializes Lenis smooth scroll synced with GSAP + ScrollTrigger (skipped under prefers-reduced-motion).
 * 3. Runs IntersectionObserver for `.reveal` elements across route changes.
 * 4. Handles delegated mousemove for `.spotlight-card` (`--mx`, `--my`) and `.magnetic-btn` pull.
 */
export function MotionEffects() {
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // 1. Scroll progress bar updater
  useEffect(() => {
    const updateProgress = () => {
      const bar = progressBarRef.current;
      if (!bar) return;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
      bar.style.width = `${pct}%`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  // 2. Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onLenisScroll = () => {
      ScrollTrigger.update();
      const bar = progressBarRef.current;
      if (bar) {
        const docH =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct =
          docH > 0
            ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100))
            : 0;
        bar.style.width = `${pct}%`;
      }
    };

    lenis.on("scroll", onLenisScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  // Refresh GSAP ScrollTrigger + re-scan `.reveal` elements on route changes
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const rafRefresh = requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        // ignore if plugin not active
      }
    });

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
    );
    if (nodes.length === 0) {
      return () => cancelAnimationFrame(rafRefresh);
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return () => cancelAnimationFrame(rafRefresh);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    nodes.forEach((n) => observer.observe(n));

    return () => {
      cancelAnimationFrame(rafRefresh);
      observer.disconnect();
    };
  }, [pathname]);

  // 3. Global delegated cursor spotlight (`.spotlight-card`) & magnetic pull (`.magnetic-btn`)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    let activeMagnetic: HTMLElement | null = null;

    const resetMagnetic = () => {
      if (activeMagnetic) {
        activeMagnetic.style.transform = "translate3d(0, 0, 0)";
        activeMagnetic = null;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const card = target.closest<HTMLElement>(".spotlight-card");
      const magBtn = reducedMotion
        ? null
        : target.closest<HTMLElement>(".magnetic-btn");

      if (activeMagnetic && activeMagnetic !== magBtn) {
        resetMagnetic();
      }

      if (!card && !magBtn) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }

        if (magBtn) {
          activeMagnetic = magBtn;
          const rect = magBtn.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
          const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.16;
          magBtn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
        }
      });
    };

    const onMouseLeaveDoc = () => {
      cancelAnimationFrame(frame);
      resetMagnetic();
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      cancelAnimationFrame(frame);
      resetMagnetic();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
    };
  }, []);

  return <div id="scrollProgressBar" ref={progressBarRef} aria-hidden="true" />;
}
