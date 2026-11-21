export interface FooterProps {
  variant?: "default" | "compact";
  className?: string;
}

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
            Ahmed Amir Ahmed · منصة مذاكرة منظمة لطلبة الحاسبات والذكاء الاصطناعي
          </span>
          <span className="font-en font-semibold">
            Built by Ahmed Amir Ahmed
          </span>
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
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 sm:mt-0"
              style={{ background: "var(--hero-bg)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span
                  className="font-en font-extrabold text-[14.5px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  Ahmed Amir Ahmed
                </span>
                <span
                  className="font-en text-[12px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  · AI · Zagazig University
                </span>
              </div>
              <div
                className="text-[12px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                مبادرة طلابية مفتوحة لطلبة الحاسبات والذكاء الاصطناعي
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            <span
              className="font-en text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              BUILT BY
            </span>
            <span
              className="px-3 py-1 rounded-full border text-[12px] font-semibold font-en"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              Ahmed Amir Ahmed
            </span>
            <span
              className="px-3 py-1 rounded-full text-[11.5px] font-bold"
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand-soft-text)",
              }}
            >
              من طلاب لطلاب
            </span>
          </div>
        </div>

        <div
          className="pt-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right text-[11.5px]"
          style={{
            borderColor: "var(--border-soft)",
            color: "var(--text-muted)",
          }}
        >
          <span>كل الحقوق محفوظة لمبادرة بوابة حاسبات التعليمية</span>
          <span className="font-en">CS Portal · Editorial Landing Concept</span>
        </div>
      </div>
    </footer>
  );
}
