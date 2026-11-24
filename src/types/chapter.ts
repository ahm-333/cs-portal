export interface ChapterSlide {
  id: string;
  slideRef: string;
  shortLabel: string;
  title: string;
  enPoints?: string[];
  svg?: string | null;
  svgTheme?: "dark" | "light";
  img?: string | null;
  svgCaption?: string | null;
  tableHtml?: string | null;
  why: string;
  deepPoints: string[];
  examSpot: string;
  notebookEn: string;
  notebookAr: string;
}

export interface ChapterLabStep {
  btn: string;
  heading: string;
  badge: string;
  visualHtml?: string | null;
  detail: string;
  telemetryLeft: string;
  telemetryRight: string;
}

export interface ChapterLab {
  title: string;
  subtitle: string;
  steps: ChapterLabStep[];
}

export interface ChapterSummaryRow {
  term: string;
  en: string;
  ar: string;
}

export interface InteractiveChapterData {
  lessonId: string;
  courseCode: string;
  chapterNum: number;
  titleEn: string;
  titleAr: string;
  subtitle: string;
  bonusComponentId?: "cg-ch3-ch4-problems";
  bonusDefaultTab?: "cheatsheet" | "ch3" | "ch4" | "solver";
  slides: ChapterSlide[];
  lab: ChapterLab;
  summary: ChapterSummaryRow[];
}

// ============================================================================
// Structured Bilingual Summary Sheet (Proper LTR English + RTL Arabic)
// ============================================================================

export interface SummaryBilingualPoint {
  en: string; // English exam point (LTR) — text before ':' is auto-highlighted
  ar: string; // Simple Egyptian Arabic explanation directly underneath this exact point (RTL)
  tag?: string; // Optional short badge e.g. "Exam Trap" | "Formula"
}

export interface SummaryConceptCard {
  term: string; // English heading (LTR)
  termAr?: string; // Optional Arabic subtitle next to card heading
  badge?: string; // e.g., "Slide 1.8" or "Exam Focus"
  enSummary: string; // Main English definition/explanation (LTR)
  arSummary?: string; // Simple Egyptian Arabic explanation directly under enSummary (RTL)
  points?: SummaryBilingualPoint[]; // 1-to-1 paired English point + Arabic explanation underneath
  enBullets?: string[]; // Legacy fallback English bullets
  flowSteps?: string[]; // Optional visual pipeline e.g. ["Hardware", "OS", "Apps", "Users"]
  arNote?: string; // Legacy fallback card-level Arabic note
  tone?: "neutral" | "brand" | "mint" | "warm"; // Color-coded semantic accent
}

export interface SummaryComparisonTable {
  titleEn: string;
  titleAr?: string;
  headers: Array<{ label: string; dir: "ltr" | "rtl" }>;
  rows: Array<Array<{ text: string; dir: "ltr" | "rtl"; highlight?: boolean }>>;
}

export interface SummaryFormulaBox {
  labelEn: string;
  formula: string;
  workedExampleEn?: string;
  arNote: string;
}

export interface SummarySection {
  id: string;
  number: string; // e.g. "01"
  titleEn: string;
  titleAr: string;
  introEn?: string;
  introAr?: string;
  flowBanner?: {
    labelEn: string;
    steps: string[];
    captionAr?: string;
  };
  cards?: SummaryConceptCard[];
  table?: SummaryComparisonTable;
  formulas?: SummaryFormulaBox[];
}

export interface StructuredChapterSummary {
  lessonId: string;
  courseCode: string;
  chapterNum: number;
  titleEn: string;
  titleAr: string;
  overviewEn: string;
  overviewAr: string;
  sections: SummarySection[];
  examTraps: Array<{
    en: string;
    ar: string;
  }>;
}
