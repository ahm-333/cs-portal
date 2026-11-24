import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SRC_DIR =
  "C:/Users/HP/.gemini/antigravity/brain/0f1c488c-5cbf-46d3-9570-8e142c9ffe4a/.user_uploaded";
const OUT_CHAPTERS = "D:/My Portal/src/lib/chapters/cg-chapters.ts";
const OUT_QUESTIONS = "D:/My Portal/src/lib/chapters/cg-questions.ts";
const OUT_IMG_DIR = "D:/My Portal/public/images/cg";

const LESSON_IDS = {
  1: "22222222-2222-4222-8222-222222222601",
  2: "22222222-2222-4222-8222-222222222602",
  3: "22222222-2222-4222-8222-222222222603",
  4: "22222222-2222-4222-8222-222222222604",
};

const CHAPTER_META = [
  {
    num: 1,
    file: "media_1795559826825_89033180.html",
    titleEn: "Introduction to Computer Graphics",
    titleAr: "مقدمة في الرسوميات بالحاسب",
    subtitle:
      "المجالات الأربعة للـ Computer Graphics، الهاردوير والـ Frame Buffer، الضوء والـ Pinhole Camera، والعين البشرية والـ API.",
    bonusDefaultTab: "cheatsheet",
  },
  {
    num: 2,
    file: "media_1795559826938_4d9818cd.html",
    titleEn: "Basic Concepts of Computer Graphics",
    titleAr: "المفاهيم الأساسية في الرسوميات",
    subtitle:
      "نموذج الصندوق الأسود، مجموعات الدوال السبع، الـ Primitives والـ Polygons والـ Triangulation، النصوص، ونماذج الألوان RGB و CMY.",
    bonusDefaultTab: "cheatsheet",
  },
  {
    num: 3,
    file: "media_1795559826843_2c54c286.html",
    titleEn: "Output Primitives & Bresenham's Line Algorithm",
    titleAr: "عناصر الإخراج وخوارزمية Bresenham لرسم الخطوط",
    subtitle:
      "رسم النقطة والخط، ظاهرة Jaggies، اشتقاق معامل القرار p_k في خوارزمية Bresenham بالأعداد الصحيحة، والمثال الكامل.",
    bonusDefaultTab: "ch3",
  },
  {
    num: 4,
    file: "media_1795559827137_2efb3694.html",
    titleEn: "Circle-Generating & Midpoint Algorithm",
    titleAr: "خوارزمية Midpoint لرسم الدوائر",
    subtitle:
      "معادلة الدائرة الديكارتية والقطبية، التماثل الثماني 8-Way Symmetry، واشتقاق وتطبيق خوارزمية Midpoint Circle.",
    bonusDefaultTab: "ch4",
  },
];

function loadHtmlVars(filename, vars) {
  const html = fs.readFileSync(path.join(SRC_DIR, filename), "utf8");
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .join("\n");
  const noop = () => ({
    addEventListener() {},
    innerHTML: "",
    textContent: "",
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      },
    },
    style: {},
    value: "",
    setAttribute() {},
    getAttribute() {
      return "";
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    appendChild() {},
    focus() {},
    select() {},
  });
  const ctx = {
    document: {
      getElementById: noop,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: noop,
      addEventListener() {},
      documentElement: noop(),
      body: noop(),
    },
    window: {
      addEventListener() {},
      matchMedia: () => ({ matches: false }),
      localStorage: { getItem: () => null, setItem() {} },
    },
    localStorage: { getItem: () => null, setItem() {} },
    navigator: { clipboard: { writeText: async () => {} } },
    tailwind: { config: {} },
    console,
    setTimeout() {},
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Date,
    parseInt,
    parseFloat,
    isNaN,
    __E__: {},
  };
  const tail =
    "\n;__E__={" +
    vars.map((v) => `${v}:typeof ${v}!=='undefined'?${v}:null`).join(",") +
    "};";
  vm.runInNewContext(scripts + tail, ctx);
  return ctx.__E__;
}

function decodeEntities(str) {
  return String(str || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/&times;/g, "×")
    .replace(/&minus;/g, "−")
    .replace(/&plusmn;/g, "±")
    .replace(/&le;/g, "≤")
    .replace(/&ge;/g, "≥")
    .replace(/&ne;/g, "≠")
    .replace(/&rarr;/g, "→")
    .replace(/&larr;/g, "←")
    .replace(/&harr;/g, "↔")
    .replace(/&lambda;/g, "λ")
    .replace(/&theta;/g, "θ")
    .replace(/&Delta;/g, "Δ")
    .replace(/&pi;/g, "π")
    .replace(/&deg;/g, "°")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&sup2;/g, "²")
    .replace(/&sup3;/g, "³");
}

const SUB_MAP = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "k": "ₖ", "c": "c", "x": "ₓ", "i": "ᵢ", "n": "ₙ",
  "+": "₊", "-": "₋", "−": "₋",
};
const SUP_MAP = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "−": "⁻", "n": "ⁿ",
};

function toSub(s) {
  const clean = s.replace(/<[^>]+>/g, "").trim();
  if (/^[0-9k]+$/.test(clean)) {
    return clean.split("").map((c) => SUB_MAP[c] || c).join("");
  }
  return `_${clean}`;
}

function toSup(s) {
  const clean = s.replace(/<[^>]+>/g, "").trim();
  if (/^[0-9+\-−n]+$/.test(clean)) {
    return clean.split("").map((c) => SUP_MAP[c] || c).join("");
  }
  return `^${clean}`;
}

function htmlToPlain(str) {
  if (!str) return "";
  let s = String(str);
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<sub>([\s\S]*?)<\/sub>/gi, (_, inner) => toSub(inner));
  s = s.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_, inner) => toSup(inner));
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
  return s;
}

function harmonizeSlideHtml(html) {
  if (!html) return "";
  let s = String(html);
  // Calm down saturated Tailwind text classes inside original slides to clean portal emphasis
  s = s.replace(
    /class=['"][^'"]*text-(?:indigo|blue|sky|cyan|teal|emerald|green|amber|orange|red|rose|pink|purple|violet)-\d+[^'"]*['"]/g,
    'class="cg-emph"'
  );
  // Keep en-term, math-pill, hl-yellow, hl-cyan, hl-emerald, hl-rose (styled calmly in globals.css!)
  // Remove inline loud colors if any
  s = s.replace(/style=['"][^'"]*background:\s*#fef9c3[^'"]*['"]/gi, "");
  return s.trim();
}

function makeShortLabel(num, title) {
  const clean = title
    .replace(/^\d+\.\s*/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/&amp;/g, "&")
    .trim();
  const words = clean.split(/\s+/).slice(0, 3).join(" ");
  return `${num}. ${words.length > 26 ? words.slice(0, 24) + "…" : words}`;
}

// Ensure output image directory exists
fs.mkdirSync(OUT_IMG_DIR, { recursive: true });

const chaptersOut = [];

for (const meta of CHAPTER_META) {
  const data = loadHtmlVars(meta.file, ["SLIDES", "FIGURES", "DEEP_DIVE"]);
  const slides = [];
  console.log(`\n=== Chapter ${meta.num}: ${data.SLIDES.length} slides ===`);

  for (const s of data.SLIDES) {
    if (meta.num === 1) {
      console.log(`  [${s.num}] (${s.slides_ref}) ${s.title}`);
    }

    let svg = null;
    let svgTheme = undefined;
    if (s.svg_key && data.FIGURES && data.FIGURES[s.svg_key]) {
      svg = String(data.FIGURES[s.svg_key])
        .replace(/class="w-full max-h-\d+"/g, "")
        .trim();
      svgTheme = "light";
    }

    let img = null;
    if (s.img && typeof s.img === "string" && s.img.startsWith("data:image/")) {
      const m = s.img.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (m) {
        const ext = m[1] === "jpeg" ? "jpg" : m[1];
        const fname = `ch${meta.num}-slide-${s.num}.${ext}`;
        const outPath = path.join(OUT_IMG_DIR, fname);
        fs.writeFileSync(outPath, Buffer.from(m[2], "base64"));
        img = `/images/cg/${fname}`;
      }
    }

    const explainArr = Array.isArray(s.explain)
      ? s.explain.map(harmonizeSlideHtml).filter(Boolean)
      : [];
    const deepArr =
      data.DEEP_DIVE && Array.isArray(data.DEEP_DIVE[s.num])
        ? data.DEEP_DIVE[s.num].map(harmonizeSlideHtml).filter(Boolean)
        : [];

    const why =
      explainArr[0] ||
      `شرح مبسّط لـ <strong>${s.title}</strong> وأهم النقاط المطلوبة في الامتحان.`;
    const deepPoints = [...explainArr.slice(1), ...deepArr];
    if (deepPoints.length === 0 && explainArr[0]) {
      deepPoints.push(explainArr[0]);
    }

    let examSpot = "";
    if (s.exam_spot && typeof s.exam_spot === "object") {
      const q = harmonizeSlideHtml(s.exam_spot.q || "");
      const a = harmonizeSlideHtml(s.exam_spot.a || "");
      examSpot = `<div dir="ltr" class="font-en text-left font-bold mb-1.5">Q: ${q}</div><div><strong>الإجابة النموذجية:</strong> ${a}</div>`;
    } else if (typeof s.exam_spot === "string") {
      examSpot = harmonizeSlideHtml(s.exam_spot);
    }

    const nbArr = Array.isArray(s.notebook) ? s.notebook : [];
    const notebookEn = nbArr
      .map((item) => {
        const head = htmlToPlain(item.en || "");
        const sub = htmlToPlain(item.en_sub || "");
        return sub ? `${head} ${sub}` : head;
      })
      .filter(Boolean)
      .join("\n");
    const notebookAr = nbArr
      .map((item) => htmlToPlain(item.ar || ""))
      .filter(Boolean)
      .join("\n");

    slides.push({
      id: `cg${meta.num}-s${s.num}`,
      slideRef: s.slides_ref || `Slide ${s.num}`,
      shortLabel: makeShortLabel(s.num, s.title),
      title: s.title,
      enPoints: (s.en_bullets || []).map(harmonizeSlideHtml),
      svg,
      svgTheme,
      img,
      svgCaption: null,
      tableHtml: null,
      why,
      deepPoints,
      examSpot,
      notebookEn: notebookEn || s.title,
      notebookAr: notebookAr || `نقطة أساسية في ${s.title}.`,
    });
  }

  chaptersOut.push({
    lessonId: LESSON_IDS[meta.num],
    courseCode: "CS-321",
    chapterNum: meta.num,
    titleEn: meta.titleEn,
    titleAr: meta.titleAr,
    subtitle: meta.subtitle,
    bonusComponentId: "cg-ch3-ch4-problems",
    bonusDefaultTab: meta.bonusDefaultTab,
    slides,
    lab: {
      title: "",
      subtitle: "",
      steps: [],
    },
    summary: [],
  });
}

// Write cg-chapters.ts
const chaptersTs = `import type { InteractiveChapterData } from "@/types/chapter";

// Auto-generated from official CS-321 Computer Graphics lecture HTML decks
// (Interactive slide explanations ONLY — summaries & quizzes are handled separately in CS Portal).
export const CG_CHAPTERS: InteractiveChapterData[] = ${JSON.stringify(
  chaptersOut,
  null,
  2
)};
`;
fs.writeFileSync(OUT_CHAPTERS, chaptersTs, "utf8");
console.log(
  `\nWrote ${OUT_CHAPTERS} (${(chaptersTs.length / 1024).toFixed(1)} KB)`
);

// Extract 85 official questions from Master Exam & Sheets Bank
const bank = loadHtmlVars("media_1795559827038_347e7f96.html", ["QUESTIONS"]);
const chCounters = { 1: 0, 2: 0, 3: 0, 4: 0 };
const questionsOut = (bank.QUESTIONS || []).map((q) => {
  const ch = q.ch;
  chCounters[ch] = (chCounters[ch] || 0) + 1;
  const cleanExp = htmlToPlain(q.exp);
  const triggerLine = q.trigger ? `\n\n🎯 مفتاح الحل: ${htmlToPlain(q.trigger)}` : "";
  const srcPrefix = q.srcLabel ? `[${q.srcLabel}]\n` : "";

  return {
    id: `44444444-4444-4444-8444-444444446${String(q.id).padStart(3, "0")}`,
    lesson_id: LESSON_IDS[ch],
    question_text: htmlToPlain(q.q),
    code_snippet: null,
    code_lang: null,
    options: (q.options || []).map((opt) => htmlToPlain(opt)),
    correct_index: q.ans,
    explanation: `${srcPrefix}${cleanExp}${triggerLine}`.trim(),
    order_index: chCounters[ch],
  };
});

const questionsTs = `import type { Question } from "@/types/database";

// Official Computer Graphics (CS-321) Sheets & Midterms Question Bank (85 questions across Chapters 1–4)
// Extracted from بنك الشيتات والميدتيرمات الشامل (Chapters 1–4).
export const CG_QUESTIONS: Question[] = ${JSON.stringify(
  questionsOut,
  null,
  2
)};
`;
fs.writeFileSync(OUT_QUESTIONS, questionsTs, "utf8");
console.log(
  `Wrote ${OUT_QUESTIONS} (${questionsOut.length} questions, breakdown: ${JSON.stringify(
    chCounters
  )})`
);
