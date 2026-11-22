import Link from "next/link";

const TOP_ROW_ITEMS = [
  {
    code: "CS-213",
    label: "Data Structures",
    href: "/courses/data-structures",
    accent: "var(--success-fg)",
  },
  {
    code: "CS-215",
    label: "Computer Organization & Architecture",
    href: "/courses/computer-organization",
    accent: "var(--brand-primary)",
  },
  {
    code: "IS-211",
    label: "Database Systems",
    href: "/courses/database-systems",
    accent: "#2563eb",
  },
  {
    code: "CS-311",
    label: "Operating Systems",
    href: "/courses/operating-systems",
    accent: "var(--accent-warm)",
  },
  {
    code: "CS-321",
    label: "Computer Graphics",
    href: "/courses/computer-graphics",
    accent: "#7c3aed",
  },
] as const;

const BOTTOM_ROW_ITEMS = [
  { label: "Linked Lists & Trees", href: "/courses/data-structures" },
  { label: "CPU Pipelining & Cache", href: "/courses/computer-organization" },
  { label: "ERD · 3NF · SQL Queries", href: "/courses/database-systems" },
  { label: "SJF & Process Scheduling", href: "/courses/operating-systems" },
  { label: "Bresenham & 2D Transforms", href: "/courses/computer-graphics" },
  { label: "Zero Password · Local Save", href: "/login" },
  { label: "Exam-Night Cram Mode", href: "/courses" },
] as const;

export function CsMarqueeStrip() {
  return (
    <section
      className="py-5 w-full overflow-hidden space-y-2.5"
      aria-label="المقررات والمفاهيم المتاحة"
    >
      {/* Row 1: Clickable Courses & Codes (Leftward) */}
      <div
        className="marquee-wrap w-full max-w-[1320px] mx-auto overflow-hidden"
        dir="ltr"
      >
        <div className="marquee-track">
          {[...TOP_ROW_ITEMS, ...TOP_ROW_ITEMS].map((item, idx) => (
            <Link
              key={`${item.code}-${idx}`}
              href={item.href}
              className="group px-4 py-2 rounded-full border text-[12px] font-mono-code font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-warm)]"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.accent }}
                aria-hidden="true"
              />
              <span style={{ color: item.accent }}>{item.code}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span className="group-hover:underline">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2: Concepts & Features (Rightward Reverse Velocity) */}
      <div
        className="marquee-wrap w-full max-w-[1320px] mx-auto overflow-hidden"
        dir="ltr"
      >
        <div className="marquee-track-reverse">
          {[...BOTTOM_ROW_ITEMS, ...BOTTOM_ROW_ITEMS].map((item, idx) => (
            <Link
              key={`${item.label}-${idx}`}
              href={item.href}
              className="px-3.5 py-1.5 rounded-full border text-[11.5px] font-mono-code font-semibold whitespace-nowrap shrink-0 transition-colors hover:border-[var(--brand-primary)]"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
