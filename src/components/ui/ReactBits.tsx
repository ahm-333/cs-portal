"use client";

import React, { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================================
 * 1. BlurText (React Bits + GSAP ScrollTrigger — Arabic RTL Word-Safe)
 * Splits text by words (never characters, preserving Arabic ligatures) and
 * animates each word from blurred + offset into crisp focus when scrolled in.
 * ============================================================================ */
export interface BlurTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}

export function BlurText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.045,
  duration = 0.65,
  yOffset = 14,
  as: Tag = "span",
}: BlurTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const words = el.querySelectorAll<HTMLElement>("[data-rb-word]");
    if (!words.length) return;

    if (reducedMotion) {
      gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: yOffset,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, duration, yOffset]);

  const tokens = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={`inline ${className}`}
    >
      {tokens.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span
            data-rb-word
            className={`inline-block will-change-[transform,opacity,filter] ${wordClassName}`}
          >
            {word}
          </span>
          {idx < tokens.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ============================================================================
 * 2. ShinyText (React Bits Metallic Warm Editorial Shimmer)
 * ============================================================================ */
export interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  speedSec?: number;
  disabled?: boolean;
}

export function ShinyText({
  children,
  className = "",
  speedSec = 4.2,
  disabled = false,
}: ShinyTextProps) {
  return (
    <span
      className={`rb-shiny-text inline-block ${disabled ? "" : "rb-shiny-active"} ${className}`}
      style={
        {
          "--rb-shine-speed": `${speedSec}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

/* ============================================================================
 * 3. CountUp (React Bits + GSAP ScrollTrigger Numeric Counter)
 * ============================================================================ */
export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const formatVal = (v: number) =>
      `${prefix}${v.toFixed(decimals)}${suffix}`;

    if (reducedMotion) {
      el.textContent = formatVal(to);
      return;
    }

    const state = { val: from };
    el.textContent = formatVal(from);

    const ctx = gsap.context(() => {
      gsap.to(state, {
        val: to,
        duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          if (spanRef.current) {
            spanRef.current.textContent = formatVal(state.val);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [to, from, duration, prefix, suffix, decimals]);

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`}>
      {prefix}
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ============================================================================
 * 4. TiltedCard (React Bits 3D Perspective Tilt + GSAP quickTo + Glare)
 * Automatically disabled on touch devices / prefers-reduced-motion so mobile
 * scrolling remains 100% native and responsive.
 * ============================================================================ */
export interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
  scaleOnHover?: number;
  glare?: boolean;
}

export function TiltedCard({
  children,
  className = "",
  maxTiltDeg = 5.5,
  scaleOnHover = 1.015,
  glare = true,
}: TiltedCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });

    const rotateXTo = gsap.quickTo(el, "rotateX", {
      duration: 0.45,
      ease: "power3.out",
    });
    const rotateYTo = gsap.quickTo(el, "rotateY", {
      duration: 0.45,
      ease: "power3.out",
    });
    const scaleTo = gsap.quickTo(el, "scale", {
      duration: 0.45,
      ease: "power3.out",
    });

    const onEnter = () => {
      scaleTo(scaleOnHover);
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / Math.max(1, rect.width);
      const py = (e.clientY - rect.top) / Math.max(1, rect.height);

      const rX = (0.5 - py) * maxTiltDeg * 2;
      const rY = (px - 0.5) * maxTiltDeg * 2;

      rotateXTo(rX);
      rotateYTo(rY);

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(320px circle at ${(
          px * 100
        ).toFixed(1)}% ${(py * 100).toFixed(
          1
        )}%, rgba(255,255,255,0.22), transparent 65%)`;
      }
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      scaleTo(1);
      if (glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTiltDeg, scaleOnHover]);

  return (
    <div ref={wrapRef} className={`relative will-change-transform ${className}`}>
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-20"
        />
      )}
    </div>
  );
}
