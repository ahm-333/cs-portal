import type {
  InteractiveChapterData,
  StructuredChapterSummary,
} from "@/types/chapter";
import { OS_CHAPTERS } from "./os-chapters";
import { OS_STRUCTURED_SUMMARIES } from "./os-structured-summaries";

// Unified registry of all interactive chapters across subjects.
// Add new subject chapter arrays here (e.g., ...DS_CHAPTERS, ...DB_CHAPTERS, ...CG_CHAPTERS).
const ALL_INTERACTIVE_CHAPTERS: InteractiveChapterData[] = [
  ...OS_CHAPTERS,
];

const CHAPTER_MAP = new Map<string, InteractiveChapterData>(
  ALL_INTERACTIVE_CHAPTERS.map((chapter) => [chapter.lessonId, chapter])
);

const ALL_STRUCTURED_SUMMARIES: StructuredChapterSummary[] = [
  ...OS_STRUCTURED_SUMMARIES,
];

const SUMMARY_MAP = new Map<string, StructuredChapterSummary>(
  ALL_STRUCTURED_SUMMARIES.map((summary) => [summary.lessonId, summary])
);

export function getInteractiveChapterByLessonId(
  lessonId: string
): InteractiveChapterData | null {
  return CHAPTER_MAP.get(lessonId) ?? null;
}

export function hasInteractiveChapter(lessonId: string): boolean {
  return CHAPTER_MAP.has(lessonId);
}

export function getStructuredSummaryByLessonId(
  lessonId: string
): StructuredChapterSummary | null {
  return SUMMARY_MAP.get(lessonId) ?? null;
}
