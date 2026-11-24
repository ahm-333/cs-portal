#!/usr/bin/env node
/**
 * Reusable Chapter HTML -> CS Portal Data Ingestor
 *
 * Extracts `const CHAPTER = {...};` from standalone study HTML pages,
 * harmonizes SVG & visualHtml colors to CS Portal's Warm Editorial Navy +
 * Terracotta (#c25e33 / #e58a62) + Mint (#1d6b52 / #66c7a6) + Brand Blue
 * (#1e355c / #7ca7f0) design system, and outputs:
 *   1) <subject>-chapters.ts  (InteractiveChapterData[] — NO quiz inside!)
 *   2) <subject>-questions.ts (Question[] for QuizEngine)
 *   3) <subject>-summary-md.json (Markdown summary per chapter for Summary tab)
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Color harmonization map: converts old standalone HTML palette
 * into CS Portal's exact Warm Editorial Navy palette.
 */
const COLOR_REPLACEMENTS = [
  // Terracotta warm accent
  [/rgba\(\s*232\s*,\s*106\s*,\s*51\s*,/gi, "rgba(194,94,51,"],
  [/#E86A33/gi, "#e58a62"],
  [/#FDBA74/gi, "#f0a786"],
  // Mint / Emerald success accent
  [/rgba\(\s*45\s*,\s*212\s*,\s*191\s*,/gi, "rgba(102,199,166,"],
  [/#2DD4BF/gi, "#66c7a6"],
  [/#0F766E/gi, "#1d6b52"],
  [/#4ADE80/gi, "#66c7a6"],
  // Editorial Navy / Brand Blue accent
  [/rgba\(\s*96\s*,\s*165\s*,\s*250\s*,/gi, "rgba(124,167,240,"],
  [/#60A5FA/gi, "#7ca7f0"],
  [/#1D4ED8/gi, "#1e355c"],
  // Dark Editorial Navy surfaces inside SVGs
  [/#0B1120/gi, "#0c1017"],
  [/#162033/gi, "#141b25"],
  [/#141E33/gi, "#152238"],
  [/#141D31/gi, "#152238"],
  [/#1E293B/gi, "#1c2533"],
  // Font family harmonization inside SVGs
  [/Plus Jakarta Sans,sans-serif/g, "Inter,system-ui,sans-serif"],
  [/JetBrains Mono,monospace/g, "JetBrains Mono,ui-monospace,monospace"],
];

function harmonizeHtmlColors(str) {
  if (!str || typeof str !== "string") return str;
  let out = str;
  for (const [pattern, replacement] of COLOR_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function stripOptionLetterPrefix(option) {
  return option.replace(/^[A-F]\.\s+/i, "").trim();
}

function extractChapterFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const lines = html.split(/\r?\n/);
  const targetLine = lines.find((line) =>
    line.trim().startsWith("const CHAPTER =")
  );
  if (!targetLine) {
    throw new Error(`Could not find "const CHAPTER =" line in ${htmlPath}`);
  }
  const jsonStr = targetLine
    .trim()
    .replace(/^const CHAPTER\s*=\s*/, "")
    .replace(/;\s*$/, "");
  return JSON.parse(jsonStr);
}

function buildSummaryMarkdown(chapter) {
  const lines = [];
  lines.push(`## الملخص الذهبي — Chapter ${chapter.chapterNum}: ${chapter.titleEn}`);
  lines.push("");
  lines.push(
    `جدول المراجعة السريعة لأهم مفاهيم **${chapter.titleAr}** (${chapter.titleEn}) قبل الامتحان:`
  );
  lines.push("");
  lines.push("| المفهوم (Term) | الصياغة الإنجليزية (Exam Definition) | المعنى بالعربي |");
  lines.push("| :--- | :--- | :--- |");
  for (const row of chapter.summary) {
    const safeTerm = String(row.term).replace(/\|/g, "\\|");
    const safeEn = String(row.en).replace(/\|/g, "\\|");
    const safeAr = String(row.ar).replace(/\|/g, "\\|");
    lines.push(`| **${safeTerm}** | ${safeEn} | ${safeAr} |`);
  }
  lines.push("");
  lines.push("### أبرز نقاط الكشكول (Quick Exam Notebook)");
  lines.push("");
  // Include compact bullets from key slides (up to 8 high-yield slides)
  const notebookSlides = chapter.slides
    .filter((s) => s.notebookAr && s.notebookEn)
    .slice(0, 8);
  for (const slide of notebookSlides) {
    lines.push(`- **${slide.slideRef} — ${slide.shortLabel}:** ${slide.notebookAr}`);
  }
  return lines.join("\n");
}

function buildKeyCode(chapter) {
  // Concatenate compact English notebook notes from first 6 core slides as LTR quick-reference block
  return chapter.slides
    .filter((s) => s.notebookEn)
    .slice(0, 6)
    .map((s) => `// [${s.slideRef}] ${s.shortLabel}\n${s.notebookEn}`)
    .join("\n\n");
}

export function ingestSubjectChapters({
  subjectKey,
  courseCode,
  chaptersConfig,
  outDir,
}) {
  const interactiveChapters = [];
  const quizQuestions = [];
  const lessonHelpers = {};

  for (const cfg of chaptersConfig) {
    const raw = extractChapterFromHtml(cfg.htmlPath);

    const slides = raw.slides.map((s) => ({
      id: s.id,
      slideRef: s.slideRef,
      shortLabel: s.shortLabel,
      title: s.title,
      ...(s.enPoints ? { enPoints: s.enPoints } : {}),
      ...(s.svg ? { svg: harmonizeHtmlColors(s.svg) } : { svg: null }),
      ...(s.svgCaption ? { svgCaption: s.svgCaption } : {}),
      ...(s.tableHtml ? { tableHtml: harmonizeHtmlColors(s.tableHtml) } : {}),
      why: s.why,
      deepPoints: s.deepPoints,
      examSpot: s.examSpot,
      notebookEn: s.notebookEn,
      notebookAr: s.notebookAr,
    }));

    const lab = {
      title: raw.lab.title,
      subtitle: raw.lab.subtitle,
      steps: raw.lab.steps.map((st) => ({
        btn: st.btn,
        heading: st.heading,
        badge: st.badge,
        ...(st.visualHtml
          ? { visualHtml: harmonizeHtmlColors(st.visualHtml) }
          : {}),
        detail: st.detail,
        telemetryLeft: st.telemetryLeft,
        telemetryRight: st.telemetryRight,
      })),
    };

    const chapterData = {
      lessonId: cfg.lessonId,
      courseCode,
      chapterNum: raw.chapterNum,
      titleEn: raw.titleEn,
      titleAr: raw.titleAr,
      subtitle: raw.subtitle,
      slides,
      lab,
      summary: raw.summary,
    };

    interactiveChapters.push(chapterData);

    // Extract Quiz Questions for QuizEngine (separate from Interactive Explanation!)
    raw.quiz.forEach((q, idx) => {
      const qNum = String(idx + 1).padStart(2, "0");
      quizQuestions.push({
        id: `${cfg.questionIdPrefix}${qNum}`,
        lesson_id: cfg.lessonId,
        question_text: `${q.q} (${q.ref})`,
        code_snippet: null,
        code_lang: null,
        options: q.options.map(stripOptionLetterPrefix),
        correct_index: q.ans,
        explanation: q.exp,
        order_index: idx + 1,
      });
    });

    lessonHelpers[cfg.lessonId] = {
      chapterNum: raw.chapterNum,
      titleEn: raw.titleEn,
      titleAr: raw.titleAr,
      summary_md: buildSummaryMarkdown(raw),
      key_code: buildKeyCode(raw),
      exam_tip:
        raw.slides[raw.slides.length - 1]?.examSpot?.replace(/<[^>]+>/g, "") ||
        "",
    };
  }

  fs.mkdirSync(outDir, { recursive: true });

  const chaptersFile = path.join(outDir, `${subjectKey}-chapters.ts`);
  const questionsFile = path.join(outDir, `${subjectKey}-questions.ts`);
  const summariesFile = path.join(outDir, `${subjectKey}-summaries.ts`);

  const constPrefix = subjectKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

  fs.writeFileSync(
    chaptersFile,
    `import type { InteractiveChapterData } from "@/types/chapter";\n\n// Auto-generated from verified chapter HTML sources with CS Portal theme harmonization.\n// Quizzes are intentionally excluded here and live exclusively in ${subjectKey}-questions.ts.\nexport const ${constPrefix}_CHAPTERS: InteractiveChapterData[] = ${JSON.stringify(
      interactiveChapters,
      null,
      2
    )};\n`,
    "utf8"
  );

  fs.writeFileSync(
    questionsFile,
    `import type { Question } from "@/types/database";\n\n// Auto-generated quiz bank for ${courseCode} (${subjectKey}).\nexport const ${constPrefix}_QUESTIONS: Question[] = ${JSON.stringify(
      quizQuestions,
      null,
      2
    )};\n`,
    "utf8"
  );

  fs.writeFileSync(
    summariesFile,
    `// Auto-generated Markdown summaries & LTR quick-reference notes for ${courseCode}.\nexport const ${constPrefix}_SUMMARIES: Record<\n  string,\n  {\n    chapterNum: number;\n    titleEn: string;\n    titleAr: string;\n    summary_md: string;\n    key_code: string;\n    exam_tip: string;\n  }\n> = ${JSON.stringify(lessonHelpers, null, 2)};\n`,
    "utf8"
  );

  console.log(
    `✅ Ingested ${interactiveChapters.length} chapters (${interactiveChapters.reduce(
      (a, c) => a + c.slides.length,
      0
    )} slides, ${quizQuestions.length} quiz questions) into ${outDir}`
  );
}

// CLI entry point for Operating Systems (or pass JSON config path as argv[2])
if (process.argv[1] && process.argv[1].endsWith("ingest-chapter-html.mjs")) {
  const configArg = process.argv[2];
  if (configArg) {
    const cfg = JSON.parse(fs.readFileSync(configArg, "utf8"));
    ingestSubjectChapters(cfg);
  }
}
