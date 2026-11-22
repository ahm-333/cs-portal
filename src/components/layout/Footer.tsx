import Image from "next/image";
import Link from "next/link";
import { BrandName } from "@/components/layout/BrandName";

export interface FooterProps {
  variant?: "default" | "compact";
  className?: string;
}

const COURSE_SHORTCUTS = [
  { code: "CS-213", label: "هياكل البيانات", href: "/courses/data-structures" },
  { code: "CS-215", label: "تنظيم ومعمارية الحاسب", href: "/courses/computer-organization" },
  { code: "IS-211", label: "نظم قواعد البيانات", href: "/courses/database-systems" },
  { code: "CS-311", label: "نظم التشغيل", href: "/courses/operating-systems" },
  { code: "CS-321", label: "الرسوميات بالحاسب", href: "/courses/computer-graphics" },
] as const;

const QUICK_LINKS = [
  { label: "مكتبة المقررات", href: "/courses" },
  { label: "إعداد كارنيه الطالب", href: "/login" },
  { label: "اختر فرقتك", href: "/#courses-picker" },
  { label: "الفرق بينا ومن غيرنا", href: "/#chaos-compare" },
  { label: "الأدوات الخمسة", href: "/#five-tools" },
  { label: "التواصل والمجتمع", href: "/#community" },
] as const;

export function Footer({ variant = "default", className = "" }: FooterProps) {
  if (variant === "compact") {
    return (
      <footer
        className={`border-t mt-8 ${className}`}
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div
          className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right text-[12px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>
            Eng. Ahmed Amir · منصة مذاكرة منظمة لطلبة الحاسبات والذكاء الاصطناعي
          </span>
          <BrandName size="sm" />
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`border-t ${className}`}
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-soft)",
      }}
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-9 flex flex-col gap-7">
        {/* 3-Column Architectural Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7">
          {/* Col 1: Brand & System Status */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#c25e33] shrink-0 shadow-sm">
                <Image
                  src="/images/founder.jpg"
                  alt="Eng. Ahmed Amir"
                  fill
                  sizes="40px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <BrandName size="lg" />
                <div
                  className="font-en text-[11.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  AI · Zagazig University
                </div>
              </div>
            </div>

            <p
              className="text-[12.5px] leading-relaxed max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              مبادرة طلابية مفتوحة لطلبة الحاسبات والذكاء الاصطناعي — تجمع
              الفيديو والمعمل التفاعلي والملخص والكويز في مساحة واحدة هادية.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold"
                style={{
                  background: "var(--success-soft)",
                  color: "var(--success-fg)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>100% Free · Local Privacy</span>
              </span>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-bold"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                من طلاب لطلاب
              </span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="md:col-span-3 space-y-2.5">
            <div
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              روابط سريعة
            </div>
            <ul className="space-y-1.5">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[12.5px] font-semibold hover:underline transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Courses & Keyboard Tip */}
          <div className="md:col-span-4 space-y-2.5">
            <div
              className="text-[12px] font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              دخول سريع للمقررات
            </div>
            <div className="space-y-1.5">
              {COURSE_SHORTCUTS.map((course) => (
                <Link
                  key={course.code}
                  href={course.href}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-[12px] font-bold transition-colors hover:border-[var(--accent-warm)]"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="min-w-0 truncate">{course.label}</span>
                  <span
                    className="font-mono-code text-[10.5px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0"
                    style={{
                      background: "var(--bg-subtle)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    {course.code}
                  </span>
                </Link>
              ))}
            </div>
            <div
              className="pt-1 text-[11px] font-semibold flex flex-wrap items-center gap-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              <span>نصيحة: اضغط</span>
              <kbd
                className="font-mono-code px-1.5 py-0.5 rounded border text-[10px]"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              >
                Ctrl+K
              </kbd>
              <span>للبحث الفوري من أي صفحة.</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right text-[11.5px]"
          style={{
            borderColor: "var(--border-soft)",
            color: "var(--text-muted)",
          }}
        >
          <span>كل الحقوق محفوظة لمبادرة بوابة حاسبات التعليمية</span>
          <span className="font-en font-semibold">
            CS Portal · Eng. Ahmed Amir
          </span>
        </div>
      </div>
    </footer>
  );
}
