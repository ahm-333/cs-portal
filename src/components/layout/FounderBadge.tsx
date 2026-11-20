import Image from "next/image";

interface FounderBadgeProps {
  variant?: "hero-whisper" | "footer-colophon";
}

/**
 * Understated, high-craft founder signature using /images/founder.jpg.
 * Subtle grayscale-to-warm reveal on hover — present with quiet authority, never loud.
 */
export function FounderBadge({ variant = "hero-whisper" }: FounderBadgeProps) {
  if (variant === "footer-colophon") {
    return (
      <div className="group inline-flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]/80 px-3 py-2 transition-colors hover:border-[var(--line-strong)]">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[var(--line-strong)] bg-[var(--soft)]">
          <Image
            src="/images/founder.jpg"
            alt="مؤسس بوابة حاسبات"
            fill
            sizes="36px"
            className="object-cover object-top grayscale-[45%] contrast-[1.04] transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
        <div className="text-xs leading-snug">
          <p className="font-semibold text-[var(--ink)]">إعداد وتطوير م. أحمد</p>
          <p className="text-[11px] text-[var(--muted)]">
            مبادرة طلابية مفتوحة لطلبة حاسبات
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1 pl-3 pr-1.5 backdrop-blur-xs transition-colors hover:border-white/25 hover:bg-white/[0.11]">
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
        <Image
          src="/images/founder.jpg"
          alt="م. أحمد"
          fill
          sizes="28px"
          className="object-cover object-top grayscale-[38%] transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <span className="text-[11px] font-medium tracking-normal text-[var(--hero-sub)]">
        بإشراف <span className="font-semibold text-white">م. أحمد</span>
      </span>
    </div>
  );
}
