export type CoursePastelKey = "peach" | "mint" | "pink" | "blue" | "purple" | "sky";

export interface CourseVisualMeta {
  code: string;
  englishTitle: string;
  arabicSubtitle: string;
  shortTagline: string;
  pastel: CoursePastelKey;
  tintVar: string;
}

const KNOWN_COURSE_META: Record<string, CourseVisualMeta> = {
  "data-structures": {
    code: "CS213",
    englishTitle: "Data Structures",
    arabicSubtitle: "هياكل البيانات والتطبيق العملي",
    shortTagline: "رتّب بياناتك وافهم الذاكرة خطوة بخطوة",
    pastel: "peach",
    tintVar: "var(--tint-peach)",
  },
  algorithms: {
    code: "CS214",
    englishTitle: "Algorithms",
    arabicSubtitle: "تحليل وتصميم الخوارزميات",
    shortTagline: "قِس كفاءة الكود وفكّر بخوارزميات ذكية",
    pastel: "mint",
    tintVar: "var(--tint-mint)",
  },
  "operating-systems": {
    code: "CS311",
    englishTitle: "Operating Systems",
    arabicSubtitle: "نظم التشغيل وإدارة المعالج",
    shortTagline: "اكتشف اللي بيحصل في الخلفية جوه النظام",
    pastel: "pink",
    tintVar: "var(--tint-pink)",
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
    code: `CS${yearLevel}0${(hash % 9) + 1}`,
    englishTitle,
    arabicSubtitle: arabicSubtitle || title,
    shortTagline: "ابدأ المذاكرة خطوة بخطوة بوضوح",
    pastel,
    tintVar: `var(--tint-${pastel})`,
  };
}
