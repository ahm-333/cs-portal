import Link from "next/link";
import { BrandName } from "@/components/layout/BrandName";

export interface FooterProps {
  variant?: "default" | "compact";
  className?: string;
}

const FOOTER_LINKS = [
  { label: "المقررات", href: "/courses" },
  { label: "الأركان", href: "/#interactive-showcase" },
  { label: "الأسئلة", href: "/#faq" },
  { label: "التواصل", href: "/#community" },
] as const;

export function Footer({ variant = "default", className = "" }: FooterProps) {
  if (variant === "compact") {
    return (
      <footer
        className={`border-t mt-8 backdrop-blur-md bg-[var(--bg-surface)]/80 border-[#1e355c]/12 dark:border-[#fff5e6]/10 ${className}`}
      >
        <div
          className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right text-[12px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>
            Eng. Ahmed Amir · مساحة مذاكرة منظّمة لطلبة الحاسبات والذكاء
            الاصطناعي
          </span>
          <BrandName size="sm" />
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`border-t backdrop-blur-md bg-[var(--bg-surface)]/80 border-[#1e355c]/12 dark:border-[#fff5e6]/10 ${className}`}
    >
      <div
        className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 md:pt-6 md:pb-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-5 text-center md:text-right text-[12px]"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1">
          <BrandName size="sm" />
          <span aria-hidden="true" className="hidden sm:inline opacity-40">
            ·
          </span>
          <span>مساحة مذاكرة منظّمة لطلبة الحاسبات والذكاء الاصطناعي</span>
        </div>

        <nav
          aria-label="روابط التذييل"
          className="hidden md:flex items-center gap-5"
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-0.5 text-[12px] font-bold transition-colors duration-200 text-[var(--text-secondary)] hover:text-[#c25e33] dark:hover:text-[#d8b07a] after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:rounded-full after:bg-[#c25e33] dark:after:bg-[#d8b07a] after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
