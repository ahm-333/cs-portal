export type CoursePastelKey = "peach" | "mint" | "pink" | "blue" | "purple" | "sky";

export interface CourseVisualMeta {
  code: string;
  monographNumber: string;
  englishTitle: string;
  arabicSubtitle: string;
  shortTagline: string;
  pastel: CoursePastelKey;
  tintVar: string;
  spineVar: string;
}

const KNOWN_COURSE_META: Record<string, CourseVisualMeta> = {
  "data-structures": {
    code: "CS·213",
    monographNumber: "01",
    englishTitle: "Data Structures",
    arabicSubtitle: "هياكل البيانات والتطبيق العملي",
    shortTagline: "تنظيم الذاكرة والبحث والهياكل الخطية خطوة بخطوة",
    pastel: "peach",
    tintVar: "var(--tint-peach)",
    spineVar: "var(--spine-peach)",
  },
  algorithms: {
    code: "CS·214",
    monographNumber: "02",
    englishTitle: "Algorithms",
    arabicSubtitle: "تحليل وتصميم الخوارزميات",
    shortTagline: "قياس التعقيد الزمني ومحاكاة خوارزميات الترتيب",
    pastel: "mint",
    tintVar: "var(--tint-mint)",
    spineVar: "var(--spine-mint)",
  },
  "operating-systems": {
    code: "CS·311",
    monographNumber: "03",
    englishTitle: "Operating Systems",
    arabicSubtitle: "نظم التشغيل وإدارة المعالج",
    shortTagline: "العمليات والجدولة وكيف يدير النظام موارد الجهاز",
    pastel: "pink",
    tintVar: "var(--tint-pink)",
    spineVar: "var(--spine-pink)",
  },
  "computer-organization": {
    code: "CS·215",
    monographNumber: "02",
    englishTitle: "Computer Organization and Architecture",
    arabicSubtitle: "تنظيم ومعمارية الحاسب",
    shortTagline: "بنية المعالج والـ Datapath والـ Pipelining وهرمية الذاكرة",
    pastel: "blue",
    tintVar: "var(--tint-blue)",
    spineVar: "var(--spine-blue)",
  },
  "database-systems": {
    code: "IS·211",
    monographNumber: "04",
    englishTitle: "Database Systems",
    arabicSubtitle: "نظم قواعد البيانات العلائقية",
    shortTagline: "مخططات ERD والتطبيع واستعلامات SQL العملية",
    pastel: "sky",
    tintVar: "var(--tint-sky)",
    spineVar: "var(--spine-sky)",
  },
  "computer-graphics": {
    code: "CS·321",
    monographNumber: "05",
    englishTitle: "Computer Graphics",
    arabicSubtitle: "الرسوميات بالحاسب والتحويلات",
    shortTagline: "خوارزميات الرسم والتحويلات الهندسية والـ Clipping",
    pastel: "purple",
    tintVar: "var(--tint-purple)",
    spineVar: "var(--spine-purple)",
  },
};

const FALLBACK_PASTELS: CoursePastelKey[] = [
  "blue",
  "purple",
  "sky",
  "mint",
  "peach",
  "pink",
];

export function getCourseVisualMeta(
  slug: string,
  title: string,
  yearLevel = 2
): CourseVisualMeta {
  const known = KNOWN_COURSE_META[slug];
  if (known) return known;

  const hash = slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const pastel = FALLBACK_PASTELS[hash % FALLBACK_PASTELS.length];
  const matchEn = title.match(/\(([A-Za-z0-9\s&-]+)\)/);
  const englishTitle = matchEn ? matchEn[1].trim() : title;
  const arabicSubtitle = matchEn ? title.replace(matchEn[0], "").trim() : title;

  return {
    code: `CS·${yearLevel}0${(hash % 9) + 1}`,
    monographNumber: String((hash % 9) + 1).padStart(2, "0"),
    englishTitle,
    arabicSubtitle: arabicSubtitle || title,
    shortTagline: "مذاكرة منهجية بالأكواد والمعامل التفاعلية",
    pastel,
    tintVar: `var(--tint-${pastel})`,
    spineVar: `var(--spine-${pastel})`,
  };
}

/** Splits mixed Arabic + parenthetical English lesson titles cleanly so parentheses never miswrap in RTL. */
export function splitBilingualTitle(raw: string): {
  primary: string;
  secondaryEn: string | null;
} {
  const match = raw.match(/\(([A-Za-z0-9\s&/.,:+\-#]+)\)\s*$/);
  if (!match) return { primary: raw, secondaryEn: null };
  return {
    primary: raw.slice(0, match.index).trim(),
    secondaryEn: match[1].trim(),
  };
}
