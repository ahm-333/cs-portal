"use client";

import { useEffect, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

interface MaskedLineRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MaskedLineReveal({
  children,
  delay = 0,
  className = "",
}: MaskedLineRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={`block ${className}`}>{children}</span>;
  }

  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.65,
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
    <span className={className}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
