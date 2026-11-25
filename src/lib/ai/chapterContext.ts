import {
  getInteractiveChapterByLessonId,
  getStructuredSummaryByLessonId,
} from "@/lib/chapters";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import type {
  InteractiveChapterData,
  StructuredChapterSummary,
} from "@/types/chapter";
import type { Course, Lesson } from "@/types/database";
import { getChapterQuickPrompts } from "./quickPrompts";

export { getChapterQuickPrompts };

const MAX_CONTEXT_CHARS = 18_000;

export interface ChapterAiContextResult {
  courseId: string;
  courseCode: string;
  courseTitleAr: string;
  courseTitleEn: string;
  lessonId: string;
  lessonTitle: string;
  contextText: string;
  quickPrompts: string[];
  hasRichSummary: boolean;
}

function stripHtml(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&rarr;/gi, "→")
    .replace(/&larr;/gi, "←")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clampText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const trimmed = text.slice(0, Math.max(0, maxChars - 64));
  const lastBreak = Math.max(trimmed.lastIndexOf("\n"), trimmed.lastIndexOf(" "));
  const cut = lastBreak > maxChars * 0.75 ? trimmed.slice(0, lastBreak) : trimmed;
  return `${cut.trim()}\n\n[... تم اختصار بقية التفاصيل حفاظاً على حدود السياق ...]`;
}

function compileStructuredSummary(summary: StructuredChapterSummary): string {
  const parts: string[] = [];

  parts.push(
    `## الملخص المنظّم (كشكول الملخص): ${summary.titleEn} — ${summary.titleAr}`
  );
  if (summary.overviewEn || summary.overviewAr) {
    parts.push(`- نظرة عامة (EN): ${summary.overviewEn}`);
    parts.push(`- نظرة عامة (AR): ${summary.overviewAr}`);
  }

  for (const section of summary.sections) {
    const secLines: string[] = [];
    secLines.push(
      `\n### قسم ${section.number}: ${section.titleEn} (${section.titleAr})`
    );

    if (section.introEn) secLines.push(`مقدمة (EN): ${section.introEn}`);
    if (section.introAr) secLines.push(`مقدمة (AR): ${section.introAr}`);

    if (section.flowBanner) {
      secLines.push(
        `مسار/تدفق (${section.flowBanner.labelEn}): ${section.flowBanner.steps.join(" → ")}`
      );
      if (section.flowBanner.captionAr) {
        secLines.push(`توضيح المسار: ${section.flowBanner.captionAr}`);
      }
    }

    if (section.cards && section.cards.length > 0) {
      for (const card of section.cards) {
        const heading = [
          card.term,
          card.termAr ? `(${card.termAr})` : "",
          card.badge ? `[${card.badge}]` : "",
        ]
          .filter(Boolean)
          .join(" ");
        secLines.push(`- **${heading}**`);
        if (card.enSummary) secLines.push(`  EN: ${card.enSummary}`);
        if (card.arSummary) secLines.push(`  AR: ${card.arSummary}`);
        if (card.flowSteps && card.flowSteps.length > 0) {
          secLines.push(`  Pipeline: ${card.flowSteps.join(" → ")}`);
        }
        if (card.points && card.points.length > 0) {
          for (const pt of card.points) {
            const tag = pt.tag ? ` [${pt.tag}]` : "";
            secLines.push(`  *${tag} ${pt.en} => ${pt.ar}`);
          }
        }
        if (card.enBullets && card.enBullets.length > 0) {
          for (const bullet of card.enBullets) {
            secLines.push(`  * ${bullet}`);
          }
        }
        if (card.arNote) {
          secLines.push(`  ملاحظة: ${card.arNote}`);
        }
      }
    }

    if (section.table && section.table.headers.length > 0) {
      const title = [section.table.titleEn, section.table.titleAr]
        .filter(Boolean)
        .join(" — ");
      secLines.push(`جدول مقارنة: ${title}`);
      secLines.push(
        `| ${section.table.headers.map((h) => h.label).join(" | ")} |`
      );
      for (const row of section.table.rows) {
        secLines.push(`| ${row.map((cell) => cell.text).join(" | ")} |`);
      }
    }

    if (section.formulas && section.formulas.length > 0) {
      for (const f of section.formulas) {
        secLines.push(`قانون (${f.labelEn}): ${f.formula}`);
        if (f.workedExampleEn) {
          secLines.push(`  مثال محلول: ${f.workedExampleEn}`);
        }
        if (f.arNote) {
          secLines.push(`  شرح القانون: ${f.arNote}`);
        }
      }
    }

    parts.push(secLines.join("\n"));
  }

  return parts.join("\n");
}

function compileExamTraps(
  summary: StructuredChapterSummary | null,
  lesson: Lesson | null,
  course: Course | null
): string {
  const lines: string[] = [];

  if (summary?.examTraps && summary.examTraps.length > 0) {
    lines.push("## مصايد الامتحان المهمة (Exam Traps)");
    summary.examTraps.forEach((trap, idx) => {
      lines.push(`${idx + 1}. [EN] ${trap.en}\n   [AR] ${trap.ar}`);
    });
  }

  const tip = lesson?.exam_tip || course?.exam_tip;
  if (tip && tip.trim()) {
    lines.push(`## نصيحة امتحان الفصل\n${stripHtml(tip)}`);
  }

  return lines.join("\n");
}

function compileInteractiveChapter(chapter: InteractiveChapterData): string {
  const lines: string[] = [];
  lines.push(
    `## ملاحظات السلايدات التفاعلية (${chapter.titleEn} — ${chapter.titleAr})`
  );

  for (const slide of chapter.slides) {
    const slideBlock: string[] = [];
    slideBlock.push(`- ${slide.slideRef}: ${stripHtml(slide.title)}`);
    const why = stripHtml(slide.why);
    if (why) slideBlock.push(`  الفكرة: ${why}`);

    if (slide.deepPoints && slide.deepPoints.length > 0) {
      const cleanedPoints = slide.deepPoints
        .map((p) => stripHtml(p))
        .filter(Boolean);
      if (cleanedPoints.length > 0) {
        slideBlock.push(`  تفاصيل: ${cleanedPoints.join(" | ")}`);
      }
    }

    const examSpot = stripHtml(slide.examSpot);
    if (examSpot) slideBlock.push(`  موضع امتحان: ${examSpot}`);

    const nbEn = stripHtml(slide.notebookEn);
    const nbAr = stripHtml(slide.notebookAr);
    if (nbEn) slideBlock.push(`  كشكول (EN): ${nbEn}`);
    if (nbAr) slideBlock.push(`  كشكول (AR): ${nbAr}`);

    lines.push(slideBlock.join("\n"));
  }

  if (chapter.summary && chapter.summary.length > 0) {
    lines.push("\n### جدول مصطلحات السلايدات:");
    for (const row of chapter.summary) {
      lines.push(
        `- ${stripHtml(row.term)}: ${stripHtml(row.en)} — ${stripHtml(row.ar)}`
      );
    }
  }

  return lines.join("\n");
}

function compileCheatSheet(course: Course): string {
  const sheet = course.cheat_sheet;
  if (!sheet || !sheet.headers.length || !sheet.rows.length) return "";

  const lines: string[] = [
    `## ورقة القوانين السريعة للمقرر (${course.code} Cheat Sheet)`,
    `| ${sheet.headers.join(" | ")} |`,
  ];

  for (const row of sheet.rows) {
    lines.push(`| ${row.join(" | ")} |`);
  }

  return lines.join("\n");
}

/**
 * Compiles the full study material for a chapter ("كشكول الملخص") into a clean,
 * bounded (~18,000 chars) context string prioritized for exam-focused AI tutoring.
 */
export function buildChapterAiContext(
  courseId: string,
  lessonId: string
): ChapterAiContextResult | null {
  const course = MOCK_COURSES.find((c) => c.id === courseId) ?? null;
  const lesson =
    MOCK_LESSONS.find((l) => l.id === lessonId && l.course_id === courseId) ??
    null;

  if (!course || !lesson) {
    return null;
  }

  const structuredSummary = getStructuredSummaryByLessonId(lesson.id);
  const interactiveChapter = getInteractiveChapterByLessonId(lesson.id);

  const headerBlock = [
    "=== كشكول الملخص للفصل ===",
    `المقرر: ${course.code} — ${course.title} (${course.title_en})`,
    `الفصل / الدرس: ${lesson.title}${lesson.title_en ? ` (${lesson.title_en})` : ""}`,
    lesson.section_title ? `القسم: ${lesson.section_title}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const examTrapsBlock = compileExamTraps(structuredSummary, lesson, course);
  const structuredBlock = structuredSummary
    ? compileStructuredSummary(structuredSummary)
    : "";
  const keyCodeBlock =
    lesson.key_code && lesson.key_code.trim()
      ? `## الكود الأساسي للدرس (Key Code)\n\`\`\`\n${lesson.key_code.trim()}\n\`\`\``
      : "";
  const summaryMdBlock =
    lesson.summary_md && lesson.summary_md.trim()
      ? `## ملخص الدرس المكتوب (Markdown)\n${lesson.summary_md.trim()}`
      : "";
  const interactiveBlock = interactiveChapter
    ? compileInteractiveChapter(interactiveChapter)
    : "";
  const cheatSheetBlock = compileCheatSheet(course);

  // Prioritize highest-value study blocks first so exam traps & structured notes
  // are never dropped before supplementary slide/markdown repetition.
  const orderedBlocks = [
    headerBlock,
    examTrapsBlock,
    structuredBlock,
    keyCodeBlock,
    // If no structured summary exists, lesson.summary_md is primary; otherwise keep as secondary
    structuredSummary ? "" : summaryMdBlock,
    interactiveBlock,
    structuredSummary ? summaryMdBlock : "",
    cheatSheetBlock,
  ].filter((block) => block.trim().length > 0);

  let assembled = "";
  for (const block of orderedBlocks) {
    const separator = assembled ? "\n\n" : "";
    const remainingBudget = MAX_CONTEXT_CHARS - assembled.length - separator.length;
    if (remainingBudget <= 120) break;

    if (block.length <= remainingBudget) {
      assembled += `${separator}${block}`;
    } else {
      assembled += `${separator}${clampText(block, remainingBudget)}`;
      break;
    }
  }

  const quickPrompts = getChapterQuickPrompts(lesson.id, lesson.title);

  return {
    courseId: course.id,
    courseCode: course.code,
    courseTitleAr: course.title,
    courseTitleEn: course.title_en,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    contextText: assembled,
    quickPrompts,
    hasRichSummary: Boolean(structuredSummary || interactiveChapter),
  };
}
