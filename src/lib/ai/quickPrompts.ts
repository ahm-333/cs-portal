import {
  getInteractiveChapterByLessonId,
  getStructuredSummaryByLessonId,
} from "@/lib/chapters";

function stripBasicHtml(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizePromptTitle(raw: string, maxLen = 48): string {
  const clean = stripBasicHtml(raw);
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

/**
 * Generates 4 smart, chapter-specific quick-prompt chips grounded in the chapter's
 * actual sections, tables, formulas, slides, or exam traps.
 * Safe to import from both Server and Client components (no mock-data bundle cost).
 */
export function getChapterQuickPrompts(
  lessonId: string,
  lessonTitle: string
): string[] {
  const structured = getStructuredSummaryByLessonId(lessonId);
  const interactive = getInteractiveChapterByLessonId(lessonId);
  const cleanLessonTitle = sanitizePromptTitle(lessonTitle, 44);

  if (structured) {
    const prompts: string[] = [];

    const firstSection = structured.sections[0];
    if (firstSection) {
      const secLabel = sanitizePromptTitle(
        firstSection.titleAr || firstSection.titleEn,
        42
      );
      prompts.push(`اشرحلي «${secLabel}» بالعامية المصرية وبمثال بسيط`);
    }

    const sectionWithTable = structured.sections.find(
      (s) => s.table && s.table.rows.length > 0
    );
    const sectionWithFormula = structured.sections.find(
      (s) => s.formulas && s.formulas.length > 0
    );

    if (sectionWithFormula && sectionWithFormula.formulas?.[0]) {
      const fLabel = sanitizePromptTitle(
        sectionWithFormula.formulas[0].labelEn,
        36
      );
      prompts.push(`وضّحلي قانون ${fLabel} بمثال محلول خطوة بخطوة`);
    } else if (sectionWithTable?.table) {
      const tLabel = sanitizePromptTitle(
        sectionWithTable.table.titleAr || sectionWithTable.table.titleEn,
        38
      );
      prompts.push(`لخّصلي مقارنة «${tLabel}» في نقاط سريعة للامتحان`);
    } else if (structured.sections[1]) {
      const sec2Label = sanitizePromptTitle(
        structured.sections[1].titleAr || structured.sections[1].titleEn,
        42
      );
      prompts.push(`إيه أهم النقاط في «${sec2Label}» اللي لازم أحفظها؟`);
    }

    if (structured.examTraps.length > 0) {
      const firstTrapShort = sanitizePromptTitle(structured.examTraps[0].ar, 40);
      prompts.push(
        `إيه أهم مصايد الامتحان في الفصل ده؟ (زي: ${firstTrapShort})`
      );
    } else {
      prompts.push("إيه أهم مصايد الامتحان والأسئلة المتوقعة في الفصل ده؟");
    }

    prompts.push("اختبرني بسؤالين MCQ من كشكول الملخص وصححلي إجابتي خطوة بخطوة");

    const unique = Array.from(new Set(prompts));
    while (unique.length < 4) {
      unique.push(`لخّصلي أهم أفكار «${cleanLessonTitle}» ليلة الامتحان`);
    }
    return unique.slice(0, 4);
  }

  if (interactive && interactive.slides.length > 0) {
    const s1 = sanitizePromptTitle(
      interactive.slides[0].shortLabel || interactive.slides[0].title,
      38
    );
    const midSlide =
      interactive.slides[Math.floor(interactive.slides.length / 2)];
    const s2 = midSlide
      ? sanitizePromptTitle(midSlide.shortLabel || midSlide.title, 38)
      : cleanLessonTitle;

    return [
      `اشرحلي «${s1}» بالعامية مع مثال عملي واضح`,
      `وضّحلي فكرة «${s2}» وإزاي بتيجي في الامتحان`,
      "إيه أهم مصايد الامتحان والمقارنات في الفصل ده؟",
      "اختبرني بسؤالين سريعين من ملخص الفصل وصححلي إجابتي",
    ];
  }

  return [
    `اشرحلي الفكرة الأساسية في «${cleanLessonTitle}» بالعامية البسيطة`,
    `لخّصلي أهم القوانين والأكواد في «${cleanLessonTitle}» ليلة الامتحان`,
    "إيه أشهر الأخطاء ومصايد الامتحان اللي لازم أخلي بالي منها هنا؟",
    "اختبرني بسؤالين MCQ على الدرس ده ووضّحلي سبب الإجابة الصح",
  ];
}
