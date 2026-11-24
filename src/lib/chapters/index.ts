import type { InteractiveChapterData } from "@/types/chapter";
import { OS_CHAPTERS } from "./os-chapters";

// Unified registry of all interactive chapters across subjects.
// Add new subject chapter arrays here (e.g., ...DS_CHAPTERS, ...DB_CHAPTERS, ...CG_CHAPTERS).
const ALL_INTERACTIVE_CHAPTERS: InteractiveChapterData[] = [
  ...OS_CHAPTERS,
];

const CHAPTER_MAP = new Map<string, InteractiveChapterData>(
  ALL_INTERACTIVE_CHAPTERS.map((chapter) => [chapter.lessonId, chapter])
);

export function getInteractiveChapterByLessonId(
  lessonId: string
): InteractiveChapterData | null {
  return CHAPTER_MAP.get(lessonId) ?? null;
}

export function hasInteractiveChapter(lessonId: string): boolean {
  return CHAPTER_MAP.has(lessonId);
}
