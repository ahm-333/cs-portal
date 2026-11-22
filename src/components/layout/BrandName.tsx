"use client";

export interface BrandNameProps {
  className?: string;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandName({
  className = "",
  inverted = false,
  size = "md",
}: BrandNameProps) {
  const sizeClass =
    size === "sm"
      ? "text-[11px] sm:text-[12.5px]"
      : size === "lg"
        ? "text-[14.5px] sm:text-[17px]"
        : "text-[12px] sm:text-[14.5px]";

  return (
    <span
      dir="ltr"
      className={`font-brand font-extrabold uppercase tracking-[0.055em] select-none whitespace-nowrap shrink-0 inline-flex items-baseline gap-1.5 ${sizeClass} ${className}`}
    >
      <span
        className="font-mono-code text-[0.84em] font-extrabold tracking-[0.08em] whitespace-nowrap"
        style={{
          color: inverted ? "#f0a786" : "var(--accent-warm)",
        }}
      >
        ENG.
      </span>
      <span
        className="whitespace-nowrap"
        style={{
          color: inverted ? "#ffffff" : "var(--text-primary)",
        }}
      >
        AHMED AMIR
      </span>
    </span>
  );
}
