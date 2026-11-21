"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Global Motion & Micro-Interaction Controller (GSAP + Lenis + React Bits):
 * 1. Renders and updates `#scrollProgressBar` on scroll.
 * 2. Initializes Lenis smooth scroll synced with GSAP ticker + ScrollTrigger,
 *    exposes `window.__lenis`, and intercepts in-page `#anchor` links for smooth gliding.
 * 3. Runs GSAP ScrollTrigger batch entrance for `.reveal` elements across route changes.
 * 4. Handles delegated mousemove for `.spotlight-card` (`--mx`, `--my`) and GSAP `quickTo` `.magnetic-btn` pull.
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

  // 2. Lenis smooth scroll synced with GSAP ticker + ScrollTrigger + smooth #anchor clicks
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
    window.__lenis = lenis;

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

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const dest = document.querySelector<HTMLElement>(hash);
      if (!dest) return;
      event.preventDefault();
      lenis.scrollTo(dest, { offset: -64, duration: 1.15 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
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

  // 4. Global delegated cursor spotlight (`.spotlight-card`) & GSAP quickTo magnetic pull (`.magnetic-btn`)
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
          duration: 0.45,
          ease: "elastic.out(1, 0.5)",
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
          const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
          const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
          gsap.to(magBtn, {
            x: dx,
            y: dy,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });
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
