import Image from "next/image";

export interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  inverted?: boolean;
  priority?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { box: "w-7 h-7 rounded-lg", px: 28 },
  sm: { box: "w-8 h-8 rounded-[10px]", px: 32 },
  md: { box: "w-9 h-9 rounded-xl", px: 36 },
  lg: { box: "w-11 h-11 rounded-2xl", px: 44 },
  xl: { box: "w-14 h-14 rounded-2xl", px: 56 },
} as const;

export function BrandLogo({
  size = "sm",
  inverted = false,
  priority = false,
  className = "",
}: BrandLogoProps) {
  const { box, px } = SIZE_MAP[size];

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden bg-[#0b1422] transition-transform duration-200 ${box} ${
        inverted
          ? "ring-1 ring-white/20 shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          : "ring-1 ring-[#1e355c]/20 shadow-[0_4px_14px_rgba(11,20,34,0.18)]"
      } ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt="Eng. Ahmed Amir — AA Logo"
        fill
        sizes={`${px}px`}
        priority={priority}
        className="object-cover"
      />
    </span>
  );
}
