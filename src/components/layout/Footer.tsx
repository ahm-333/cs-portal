import Link from "next/link";
import { Cpu, MessageSquarePlus } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { FounderBadge } from "@/components/layout/FounderBadge";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* Brand + Quiet Colophon */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--hero)] text-[var(--hero-ink)]">
                <Cpu className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-[var(--ink)]">
                {SITE_CONFIG.arabicName}
              </span>
              <span
                dir="ltr"
                className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--accent)]"
              >
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {SITE_CONFIG.tagline}. مساحة مذاكرة هندسية هادئة لطلبة علوم
              الحاسب.
            </p>
            <div>
              <FounderBadge variant="footer-colophon" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-[var(--ink)]">روابط سريعة</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  المقررات الدراسية
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  كمّل رحلتك
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  ملف الطالب
                </Link>
              </li>
            </ul>
          </div>

          {/* Feedback / Suggestions */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold text-[var(--ink)]">
              شاركنا التطوير
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              تحتاج شرحاً لمادة معينة أو لاحظت خطأً في ملخص أو كود؟ يسعدنا
              تواصلك.
            </p>
            <a
              href={SITE_CONFIG.feedbackUrl}
              className="mt-3.5 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:bg-[var(--signal-soft)] hover:text-[var(--signal)]"
            >
              <MessageSquarePlus className="h-4 w-4 text-[var(--signal)]" />
              <span>اقترح مادة / بلغ عن خطأ</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)] sm:flex-row">
          <p>
            © {year} {SITE_CONFIG.arabicName} ({SITE_CONFIG.name}). جميع الحقوق
            محفوظة.
          </p>
          <p className="font-mono text-[11px]" dir="ltr">
            CS PORTAL // SWISS ACADEMIC ATELIER
          </p>
        </div>
      </div>
    </footer>
  );
}
