"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

interface MaskedLineRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * MaskedLineReveal — Arabic-RTL ligature-safe editorial mask reveal.
 * Observes the stationary outer wrapper with `amount: "some"` so headings
 * inside overflow-hidden clip boxes ALWAYS reveal reliably and never clip Arabic descenders.
 */
export function MaskedLineReveal({
  children,
  delay = 0,
  className = "",
}: MaskedLineRevealProps) {
  const outerRef = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(outerRef, { once: true, amount: "some" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={`block pt-0.5 pb-2 ${className}`}>{children}</span>;
  }

  return (
    <span
      ref={outerRef}
      className={`block overflow-hidden pt-0.5 pb-2 ${className}`}
    >
      <motion.span
        className="block will-change-transform"
        initial={{ y: "88%", opacity: 0 }}
        animate={isInView ? { y: "0%", opacity: 1 } : { y: "88%", opacity: 0 }}
        transition={{
          duration: 0.68,
          delay,
          ease: EDITORIAL_EASE,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface SpringNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function SpringNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: SpringNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionVal = useMotionValue(value);
  const [display, setDisplay] = useState(() => Math.round(value));

  useEffect(() => {
    if (prefersReducedMotion) {
      motionVal.set(value);
      return;
    }

    const controls = animate(motionVal, value, {
      type: "spring",
      stiffness: 180,
      damping: 26,
      mass: 0.8,
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => {
      controls.stop();
    };
  }, [value, motionVal, prefersReducedMotion]);

  const rendered = prefersReducedMotion ? Math.round(value) : display;

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
