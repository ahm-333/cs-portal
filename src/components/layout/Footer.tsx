import Link from "next/link";
import { MessageSquarePlus, Terminal } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
                <Terminal className="h-4 w-4" />
              </span>
              <span className="text-base font-extrabold text-slate-100">
                {SITE_CONFIG.arabicName}
              </span>
              <span
                dir="ltr"
                className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-indigo-400"
              >
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              {SITE_CONFIG.tagline}. مصممة لطلبة علوم الحاسب لتبسيط المواد
              الجامعية بالشرح العملي والمحاكاة التفاعلية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              روابط سريعة
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 transition-colors hover:text-indigo-300"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/#courses"
                  className="text-slate-400 transition-colors hover:text-indigo-300"
                >
                  تصفح المواد الدراسية
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 transition-colors hover:text-indigo-300"
                >
                  لوحة مذاكرتي
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-slate-400 transition-colors hover:text-indigo-300"
                >
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Feedback / Suggestions */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              شاركنا التطوير
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              تحتاج شرح لمادة معينة أو لاحظت خطأ في ملخص أو كود؟
            </p>
            <a
              href={SITE_CONFIG.feedbackUrl}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-200"
            >
              <MessageSquarePlus className="h-4 w-4 text-indigo-400" />
              <span>اقترح مادة / بلغ عن خطأ</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800/70 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {SITE_CONFIG.arabicName} ({SITE_CONFIG.name}). جميع الحقوق
            محفوظة.
          </p>
          <p className="font-mono text-[11px] text-slate-500" dir="ltr">
            Built for late-night CS study sessions
          </p>
        </div>
      </div>
    </footer>
  );
}
