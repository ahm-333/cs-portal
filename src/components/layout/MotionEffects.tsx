"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
    __scrollVelocity?: number;
  }
}

/**
 * Global Motion & Micro-Interaction Controller (GSAP + Lenis + GPU Compositing):
 * 1. Updates `#scrollProgressBar` via GPU `transform: scaleX(...)` (zero layout thrash).
 * 2. Initializes Lenis smooth momentum scroll on desktop pointer devices (synced 1:1 with
 *    GSAP ticker + ScrollTrigger), skipping unnecessary RAF work on touch-only devices.
 * 3. Refreshes ScrollTrigger on route/layout shifts and triggers `.reveal` elements cleanly.
 * 4. Handles delegated cursor spotlight (`.spotlight-card`) and elastic `.magnetic-btn` pull.
 */
export function MotionEffects() {
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // 1. GPU-composited Scroll Progress Bar updater (native scroll & resize fallback)
  useEffect(() => {
    let rafId = 0;

    const applyProgress = () => {
      rafId = 0;
      const bar = progressBarRef.current;
      if (!bar) return;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const scheduleProgress = () => {
      // When Lenis is driving desktop scroll, let `onLenisScroll` update the bar once per tick.
      if (window.__lenis) return;
      if (!rafId) {
        rafId = requestAnimationFrame(applyProgress);
      }
    };

    const onResize = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(applyProgress);
      }
    };

    applyProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  // 2. Lenis smooth scroll synced with GSAP ticker + ScrollTrigger (desktop wheel devices)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchOnly =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (reducedMotion || isTouchOnly) {
      window.__scrollVelocity = 0;
      return;
    }

    let isDisposed = false;

    const lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1.0,
      smoothWheel: true,
    });
    window.__lenis = lenis;
    window.__scrollVelocity = 0;

    const onLenisScroll = (e: Lenis) => {
      ScrollTrigger.update();
      window.__scrollVelocity = e.velocity;
      const bar = progressBarRef.current;
      if (bar) {
        const progress = Number.isFinite(e.progress)
          ? Math.min(1, Math.max(0, e.progress))
          : 0;
        bar.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
    };

    lenis.on("scroll", onLenisScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const dest = document.querySelector<HTMLElement>(hash);
      if (!dest) return;
      event.preventDefault();
      lenis.scrollTo(dest, { offset: -72, duration: 1.05 });
    };

    document.addEventListener("click", onAnchorClick);

    // Refresh ScrollTrigger once fonts finish loading to keep pinned geometry exact
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isDisposed) return;
        try {
          ScrollTrigger.refresh();
        } catch {
          // ignore
        }
      });
    }

    return () => {
      isDisposed = true;
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      window.__scrollVelocity = 0;
      lenis.destroy();
    };
  }, []);

  // 3. Refresh GSAP ScrollTrigger + animate `.reveal` elements on route changes
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
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            observer.unobserve(el);
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

  // 4. Global delegated cursor spotlight (`.spotlight-card`) & GSAP magnetic pull (`.magnetic-btn`)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    let activeMagnetic: HTMLElement | null = null;

    const resetMagnetic = () => {
      if (activeMagnetic) {
        gsap.to(activeMagnetic, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.45)",
          overwrite: "auto",
        });
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

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }

        if (magBtn) {
          activeMagnetic = magBtn;
          const rect = magBtn.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.2;
          const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.2;
          gsap.to(magBtn, {
            x: dx,
            y: dy,
            duration: 0.28,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });
    };

    const onMouseLeaveDoc = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      resetMagnetic();
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resetMagnetic();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
    };
  }, []);

  return <div id="scrollProgressBar" ref={progressBarRef} aria-hidden="true" />;
}
