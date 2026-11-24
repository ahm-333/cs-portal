export interface ChapterSlide {
  id: string;
  slideRef: string;
  shortLabel: string;
  title: string;
  enPoints?: string[];
  svg?: string | null;
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
  slides: ChapterSlide[];
  lab: ChapterLab;
  summary: ChapterSummaryRow[];
}
