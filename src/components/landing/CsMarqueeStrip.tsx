const MARQUEE_ITEMS = [
  { label: "CS-213 · Data Structures", color: "var(--text-secondary)" },
  { label: "O(1) Instant Access", color: "var(--accent-warm)" },
  { label: "CS-214 · Algorithms", color: "var(--text-secondary)" },
  { label: "Interactive Binary Search", color: "var(--success-fg)" },
  { label: "CS-311 · Operating Systems", color: "var(--text-secondary)" },
  { label: "Clean LTR C++ Code", color: "var(--brand-primary)" },
  { label: "Zero Password · Local Save", color: "var(--text-secondary)" },
] as const;

export function CsMarqueeStrip() {
  return (
    <section className="py-4" aria-hidden="true">
      <div className="marquee-wrap max-w-[1320px] mx-auto" dir="ltr">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span
              key={`${item.label}-${idx}`}
              className="px-4 py-2 rounded-full border text-[12px] font-mono-code font-bold"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: item.color,
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
