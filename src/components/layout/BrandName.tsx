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
      ? "text-[16px] sm:text-[18px]"
      : size === "lg"
        ? "text-[22px] sm:text-[26px]"
        : "text-[19px] sm:text-[21px]";

  return (
    <span
      dir="ltr"
      className={`font-signature font-bold select-none whitespace-nowrap shrink-0 inline-flex items-baseline gap-1.5 leading-none ${sizeClass} ${className}`}
    >
      <span
        className="whitespace-nowrap"
        style={{
          color: inverted ? "#f0a786" : "var(--accent-warm)",
        }}
      >
        Eng.
      </span>
      <span
        className="whitespace-nowrap"
        style={{
          color: inverted ? "#ffffff" : "var(--text-primary)",
        }}
      >
        Ahmed Amir
      </span>
    </span>
  );
}
