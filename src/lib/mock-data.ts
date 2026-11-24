import type {
  Course,
  Lesson,
  LessonInteractive,
  Question,
} from "@/types/database";
import { CG_QUESTIONS } from "./chapters/cg-questions";
import { OS_QUESTIONS } from "./chapters/os-questions";
import { OS_SUMMARIES } from "./chapters/os-summaries";

// ============================================================================
// Deterministic UUIDs (shared with supabase/seed/seed.sql)
// ============================================================================
const COURSE_IDS = {
  DATA_STRUCTURES: "11111111-1111-4111-8111-111111111101",
  ALGORITHMS: "11111111-1111-4111-8111-111111111102",
  OPERATING_SYSTEMS: "11111111-1111-4111-8111-111111111103",
  COMPUTER_ORGANIZATION: "11111111-1111-4111-8111-111111111104",
  DATABASE_SYSTEMS: "11111111-1111-4111-8111-111111111105",
  COMPUTER_GRAPHICS: "11111111-1111-4111-8111-111111111106",
} as const;

const LESSON_IDS = {
  DS_ARRAYS: "22222222-2222-4222-8222-222222222101",
  DS_BINARY_SEARCH: "22222222-2222-4222-8222-222222222102",
  DS_LINKED_LISTS_STACKS: "22222222-2222-4222-8222-222222222103",
  ALGO_BIG_O: "22222222-2222-4222-8222-222222222201",
  ALGO_SORTING: "22222222-2222-4222-8222-222222222202",
  OS_CH1: "22222222-2222-4222-8222-222222222301",
  OS_CH2: "22222222-2222-4222-8222-222222222302",
  OS_CH3: "22222222-2222-4222-8222-222222222303",
  CG_CH1: "22222222-2222-4222-8222-222222222601",
  CG_CH2: "22222222-2222-4222-8222-222222222602",
  CG_CH3: "22222222-2222-4222-8222-222222222603",
  CG_CH4: "22222222-2222-4222-8222-222222222604",
} as const;

const INTERACTIVE_IDS = {
  BINARY_SEARCH_LAB: "33333333-3333-4333-8333-333333333101",
  SORTING_VISUALIZER_LAB: "33333333-3333-4333-8333-333333333201",
} as const;

// ============================================================================
// Embedded Single-File Interactive HTML Labs (mirroring content/labs/*.html)
// ============================================================================
const BINARY_SEARCH_LAB_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مختبر البحث الثنائي التفاعلي — Binary Search Lab</title>
  <style>
    :root {
      --bg-root: #020617;
      --bg-card: #0f172a;
      --bg-elev: #1e293b;
      --border: #1e293b;
      --border-strong: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --indigo: #6366f1;
      --indigo-soft: rgba(99, 102, 241, 0.16);
      --emerald: #10b981;
      --emerald-soft: rgba(16, 185, 129, 0.16);
      --amber: #f59e0b;
      --amber-soft: rgba(245, 158, 11, 0.18);
      --sky: #38bdf8;
      --sky-soft: rgba(56, 189, 248, 0.16);
      --rose: #f43f5e;
      --rose-soft: rgba(244, 63, 94, 0.16);
      --radius: 14px;
      --font-ar: system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif;
      --font-mono: ui-monospace, "Cascadia Code", "Fira Code", Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 42%),
                  radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.08), transparent 40%),
                  var(--bg-root);
      color: var(--text-main);
      font-family: var(--font-ar);
      min-height: 100vh;
      padding: 16px;
      line-height: 1.55;
    }

    .app {
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 18px;
    }

    .title-group h1 {
      font-size: 1.15rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .title-group p {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.74rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      font-family: var(--font-mono);
      direction: ltr;
    }

    .badge-indigo {
      background: var(--indigo-soft);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.35);
    }

    .badge-emerald {
      background: var(--emerald-soft);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }

    .controls-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: flex-end;
      justify-content: space-between;
    }

    .control-group {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 10px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field label {
      font-size: 0.76rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    input[type="number"], select {
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      color: var(--text-main);
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 0.9rem;
      font-family: var(--font-mono);
      direction: ltr;
      text-align: center;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input[type="number"] { width: 108px; }
    input[type="number"]:focus, select:focus {
      border-color: var(--indigo);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    button {
      font-family: var(--font-ar);
      font-size: 0.83rem;
      font-weight: 700;
      padding: 8px 13px;
      border-radius: 10px;
      border: 1px solid var(--border-strong);
      background: var(--bg-elev);
      color: var(--text-main);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.12s, background 0.18s, border-color 0.18s, opacity 0.18s;
      user-select: none;
    }

    button:hover:not(:disabled) {
      background: #273549;
      border-color: #475569;
    }

    button:active:not(:disabled) { transform: scale(0.97); }
    button:disabled { opacity: 0.42; cursor: not-allowed; }

    .btn-primary {
      background: var(--indigo);
      border-color: #818cf8;
      color: #fff;
    }
    .btn-primary:hover:not(:disabled) { background: #4f46e5; border-color: #818cf8; }

    .btn-success {
      background: var(--emerald);
      border-color: #34d399;
      color: #022c22;
    }
    .btn-success:hover:not(:disabled) { background: #059669; color: #fff; }

    .presets {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 7px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--border-strong);
    }

    .presets-label {
      font-size: 0.76rem;
      color: var(--text-muted);
      margin-left: 4px;
    }

    .chip {
      font-family: var(--font-mono);
      font-size: 0.76rem;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      color: #cbd5e1;
      direction: ltr;
    }

    .chip.active {
      background: var(--indigo-soft);
      border-color: var(--indigo);
      color: #c7d2fe;
    }

    .chip.miss {
      border-style: dashed;
      color: #fda4af;
    }

    .speed-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    input[type="range"] {
      accent-color: var(--indigo);
      width: 96px;
      cursor: pointer;
    }

    .stage-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stage-hint {
      font-size: 0.76rem;
      color: var(--text-muted);
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      display: inline-block;
    }

    .array-scroll {
      overflow-x: auto;
      padding: 8px 4px 12px;
      direction: ltr;
    }

    .array-track {
      display: flex;
      justify-content: center;
      gap: 7px;
      min-width: max-content;
      margin: 0 auto;
    }

    .cell-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 52px;
      transition: opacity 0.28s ease, transform 0.25s ease;
    }

    .cell-wrap.discarded {
      opacity: 0.24;
      transform: scale(0.94);
    }

    .cell-wrap.discarded .cell-box {
      text-decoration: line-through;
      border-style: dashed;
    }

    .ptr-top {
      height: 24px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 2px;
      margin-bottom: 4px;
    }

    .ptr-bottom {
      height: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 3px;
      margin-top: 4px;
    }

    .ptr-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 6px;
      line-height: 1.4;
      letter-spacing: 0.02em;
    }

    .ptr-low { background: var(--sky-soft); color: var(--sky); border: 1px solid rgba(56, 189, 248, 0.45); }
    .ptr-high { background: rgba(168, 85, 247, 0.18); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.45); }
    .ptr-mid { background: var(--amber-soft); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.55); }
    .ptr-found { background: var(--emerald-soft); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.65); }

    .cell-box {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: var(--bg-elev);
      border: 2px solid var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.22s ease;
      position: relative;
    }

    .cell-box:hover {
      border-color: var(--indigo);
      transform: translateY(-2px);
    }

    .cell-wrap.in-range .cell-box {
      background: rgba(99, 102, 241, 0.14);
      border-color: rgba(99, 102, 241, 0.55);
    }

    .cell-wrap.is-mid .cell-box {
      background: var(--amber-soft);
      border-color: var(--amber);
      color: #fef3c7;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16);
      transform: translateY(-4px) scale(1.05);
    }

    .cell-wrap.is-found .cell-box {
      background: var(--emerald-soft);
      border-color: var(--emerald);
      color: #d1fae5;
      box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.22);
      transform: translateY(-5px) scale(1.08);
    }

    .cell-idx {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-dim);
      margin-top: 4px;
    }

    .explain-box {
      border-radius: 12px;
      padding: 13px 15px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid var(--border-strong);
      border-right: 4px solid var(--indigo);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .explain-box.state-found { border-right-color: var(--emerald); background: rgba(16, 185, 129, 0.08); }
    .explain-box.state-notfound { border-right-color: var(--rose); background: rgba(244, 63, 94, 0.08); }
    .explain-box.state-step { border-right-color: var(--amber); }

    .explain-title {
      font-size: 0.92rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .explain-text {
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    .code-pill {
      display: inline-block;
      direction: ltr;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      padding: 2px 7px;
      border-radius: 6px;
      color: #a5b4fc;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .metric {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 11px 13px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .metric-label {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .metric-value {
      font-family: var(--font-mono);
      font-size: 1.2rem;
      font-weight: 800;
      direction: ltr;
      text-align: right;
    }

    .metric-sub {
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    .val-indigo { color: #a5b4fc; }
    .val-emerald { color: #34d399; }
    .val-amber { color: #fbbf24; }
    .val-sky { color: #38bdf8; }

    .vars-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      direction: ltr;
      justify-content: flex-end;
    }

    .var-pill {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      padding: 4px 10px;
      color: #e2e8f0;
    }

    .progress-bar {
      height: 5px;
      background: var(--bg-root);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--indigo), var(--emerald));
      width: 0%;
      transition: width 0.25s ease;
    }

    @media (max-width: 720px) {
      body { padding: 10px; }
      .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .cell-wrap { width: 44px; }
      .cell-box { width: 42px; height: 42px; font-size: 0.88rem; }
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="title-group">
        <h1>
          <span>مختبر البحث الثنائي التفاعلي</span>
          <span class="badge badge-indigo">Binary Search</span>
        </h1>
        <p>تتبّع مؤشرات <span class="code-pill">low</span> و <span class="code-pill">mid</span> و <span class="code-pill">high</span> خطوة بخطوة وقارن الكفاءة مع البحث الخطي.</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="badge badge-emerald">Time: O(log n)</span>
        <span class="badge badge-indigo">Space: O(1)</span>
      </div>
    </header>

    <section class="card">
      <div class="controls-grid">
        <div class="control-group">
          <div class="field">
            <label for="targetInput">القيمة المطلوبة (Target)</label>
            <input id="targetInput" type="number" value="42" />
          </div>
          <div class="field">
            <label for="sizeSelect">حجم المصفوفة (n)</label>
            <select id="sizeSelect">
              <option value="11">11 عنصر</option>
              <option value="15" selected>15 عنصر</option>
              <option value="19">19 عنصر</option>
            </select>
          </div>
          <button id="btnNewArray" title="توليد مصفوفة مرتبة جديدة">مصفوفة جديدة</button>
        </div>

        <div class="control-group">
          <div class="btn-row">
            <button id="btnPrev">السابق</button>
            <button id="btnNext" class="btn-primary">الخطوة التالية</button>
            <button id="btnPlay" class="btn-success">تشغيل تلقائي</button>
            <button id="btnReset">إعادة</button>
          </div>
          <div class="speed-wrap">
            <span>السرعة</span>
            <input id="speedRange" type="range" min="300" max="1800" step="100" value="950" />
          </div>
        </div>
      </div>

      <div class="presets" id="presetsRow"></div>
    </section>

    <section class="card">
      <div class="stage-header">
        <div class="stage-hint">اضغط على أي خلية في المصفوفة لاختيارها كقيمة مطلوبة مباشرة:</div>
        <div class="legend">
          <span class="legend-item"><span class="dot" style="background:#38bdf8"></span> low (البداية)</span>
          <span class="legend-item"><span class="dot" style="background:#f59e0b"></span> mid (المنتصف)</span>
          <span class="legend-item"><span class="dot" style="background:#c084fc"></span> high (النهاية)</span>
          <span class="legend-item"><span class="dot" style="background:#10b981"></span> تم العثور عليه</span>
        </div>
      </div>

      <div class="array-scroll">
        <div class="array-track" id="arrayTrack"></div>
      </div>

      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    </section>

    <section class="explain-box" id="explainBox">
      <div class="explain-title">
        <span id="explainTitle">جاهز للبدء</span>
        <div class="vars-strip" id="varsStrip"></div>
      </div>
      <div class="explain-text" id="explainText"></div>
    </section>

    <section class="metrics-grid">
      <div class="metric">
        <span class="metric-label">خطوات البحث الثنائي</span>
        <span class="metric-value val-emerald" id="metricBinary">0</span>
        <span class="metric-sub" id="metricMaxLog">الحد الأقصى: 4 خطوات</span>
      </div>
      <div class="metric">
        <span class="metric-label">مقارنات البحث الخطي</span>
        <span class="metric-value val-amber" id="metricLinear">0</span>
        <span class="metric-sub" id="metricLinearSub">لو بحثنا عنصراً بعنصر</span>
      </div>
      <div class="metric">
        <span class="metric-label">العناصر المتبقية في النطاق</span>
        <span class="metric-value val-sky" id="metricRemaining">15</span>
        <span class="metric-sub" id="metricDiscarded">تم استبعاد 0 عنصر</span>
      </div>
      <div class="metric">
        <span class="metric-label">مقدار التوفير</span>
        <span class="metric-value val-indigo" id="metricSaved">0</span>
        <span class="metric-sub" id="metricSavedSub">مقارنة تم توفيرها</span>
      </div>
    </section>
  </div>

  <script>
    (function () {
      var DEFAULT_ARRAYS = {
        11: [4, 9, 14, 21, 27, 35, 42, 56, 63, 78, 91],
        15: [3, 8, 12, 17, 23, 29, 34, 42, 48, 55, 61, 69, 77, 84, 95],
        19: [2, 6, 11, 15, 20, 25, 31, 37, 42, 49, 54, 60, 67, 73, 79, 85, 90, 94, 99]
      };

      var state = {
        arr: DEFAULT_ARRAYS[15].slice(),
        target: 42,
        steps: [],
        stepIndex: 0,
        timer: null
      };

      var elTrack = document.getElementById("arrayTrack");
      var elTarget = document.getElementById("targetInput");
      var elSize = document.getElementById("sizeSelect");
      var elPresets = document.getElementById("presetsRow");
      var elExplainBox = document.getElementById("explainBox");
      var elExplainTitle = document.getElementById("explainTitle");
      var elExplainText = document.getElementById("explainText");
      var elVarsStrip = document.getElementById("varsStrip");
      var elProgress = document.getElementById("progressFill");

      var btnPrev = document.getElementById("btnPrev");
      var btnNext = document.getElementById("btnNext");
      var btnPlay = document.getElementById("btnPlay");
      var btnReset = document.getElementById("btnReset");
      var btnNewArray = document.getElementById("btnNewArray");
      var speedRange = document.getElementById("speedRange");

      var mBinary = document.getElementById("metricBinary");
      var mMaxLog = document.getElementById("metricMaxLog");
      var mLinear = document.getElementById("metricLinear");
      var mLinearSub = document.getElementById("metricLinearSub");
      var mRemaining = document.getElementById("metricRemaining");
      var mDiscarded = document.getElementById("metricDiscarded");
      var mSaved = document.getElementById("metricSaved");
      var mSavedSub = document.getElementById("metricSavedSub");

      function generateSortedArray(size) {
        var res = [];
        var cur = Math.floor(Math.random() * 6) + 2;
        for (var i = 0; i < size; i++) {
          res.push(cur);
          cur += Math.floor(Math.random() * 8) + 3;
        }
        return res;
      }

      function computeLinearCost(arr, target) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === target) return i + 1;
        }
        return arr.length;
      }

      function buildSteps(arr, target) {
        var steps = [];
        var low = 0;
        var high = arr.length - 1;
        var comparisons = 0;

        steps.push({
          low: low,
          high: high,
          mid: null,
          status: "init",
          comparisons: 0,
          title: "الحالة الابتدائية — تهيئة النطاق الكامل",
          text:
            "نبحث عن القيمة " + target + " داخل مصفوفة مرتّبة طولها " + arr.length +
            " عنصراً. نبدأ بالنطاق الكامل من الفهرس 0 حتى " + high +
            ". اضغط «الخطوة التالية» أو «تشغيل تلقائي» لحساب المنتصف."
        });

        while (low <= high) {
          var mid = Math.floor((low + high) / 2);
          comparisons += 1;
          var val = arr[mid];

          if (val === target) {
            steps.push({
              low: low,
              high: high,
              mid: mid,
              status: "found",
              comparisons: comparisons,
              title: "تم العثور على القيمة في الخطوة #" + comparisons + "!",
              text:
                "نحسب mid = ⌊(" + low + " + " + high + ") / 2⌋ = " + mid +
                ". نجد أن arr[" + mid + "] = " + val + " وتطابق الهدف (" + target +
                ") تماماً! توقّف البحث بنجاح عند الفهرس " + mid + "."
            });
            return steps;
          } else if (val < target) {
            steps.push({
              low: low,
              high: high,
              mid: mid,
              status: "go-right",
              comparisons: comparisons,
              title: "الخطوة #" + comparisons + ": arr[mid] أصغر من الهدف → نتجه يميناً",
              text:
                "mid = ⌊(" + low + " + " + high + ") / 2⌋ = " + mid +
                ". القيمة arr[" + mid + "] = " + val + " أصغر من " + target +
                ". بما أن المصفوفة مرتّبة تصاعدياً، نستبعد النصف الأيسر كاملاً (من " +
                low + " إلى " + mid + ") ونُحدّث low = mid + 1 = " + (mid + 1) + "."
            });
            low = mid + 1;
          } else {
            steps.push({
              low: low,
              high: high,
              mid: mid,
              status: "go-left",
              comparisons: comparisons,
              title: "الخطوة #" + comparisons + ": arr[mid] أكبر من الهدف → نتجه يساراً",
              text:
                "mid = ⌊(" + low + " + " + high + ") / 2⌋ = " + mid +
                ". القيمة arr[" + mid + "] = " + val + " أكبر من " + target +
                ". نستبعد النصف الأيمن كاملاً (من " + mid + " إلى " + high +
                ") ونُحدّث high = mid - 1 = " + (mid - 1) + "."
            });
            high = mid - 1;
          }
        }

        steps.push({
          low: low,
          high: high,
          mid: null,
          status: "not-found",
          comparisons: comparisons,
          title: "القيمة غير موجودة في المصفوفة",
          text:
            "أصبح low (" + low + ") أكبر من high (" + high +
            ") مما يعني أن نطاق البحث فارغ تماماً. استغرق إثبات عدم وجود القيمة " +
            target + " فقط " + comparisons + " مقارنات بدلاً من فحص جميع العناصر (" + arr.length + ")."
        });
        return steps;
      }

      function stopPlay() {
        if (state.timer) {
          clearInterval(state.timer);
          state.timer = null;
        }
        btnPlay.textContent = "تشغيل تلقائي";
      }

      function renderPresets() {
        var arr = state.arr;
        var picks = [
          { val: arr[0], label: arr[0] + " (أول عنصر)" },
          { val: arr[Math.floor(arr.length / 2)], label: arr[Math.floor(arr.length / 2)] + " (المنتصف)" },
          { val: arr[arr.length - 2], label: arr[arr.length - 2] + " (قرب النهاية)" },
          { val: arr[Math.floor(arr.length / 2)] + 1, label: (arr[Math.floor(arr.length / 2)] + 1) + " (غير موجود)", miss: true }
        ];
        while (arr.indexOf(picks[3].val) !== -1) {
          picks[3].val += 1;
          picks[3].label = picks[3].val + " (غير موجود)";
        }

        elPresets.innerHTML = '<span class="presets-label">أمثلة سريعة للتجربة:</span>';
        picks.forEach(function (p) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "chip" + (p.miss ? " miss" : "") + (state.target === p.val ? " active" : "");
          b.textContent = p.label;
          b.addEventListener("click", function () {
            setTarget(p.val);
          });
          elPresets.appendChild(b);
        });
      }

      function render() {
        var step = state.steps[state.stepIndex];
        var arr = state.arr;
        var n = arr.length;

        elTrack.innerHTML = "";
        for (var i = 0; i < n; i++) {
          var wrap = document.createElement("div");
          var inRange = step.low <= step.high && i >= step.low && i <= step.high;
          var isMid = step.mid === i;
          var isFound = step.status === "found" && isMid;

          wrap.className = "cell-wrap" +
            (inRange ? " in-range" : " discarded") +
            (isFound ? " is-found" : (isMid ? " is-mid" : ""));

          var ptrTop = document.createElement("div");
          ptrTop.className = "ptr-top";
          if (isFound) {
            ptrTop.innerHTML = '<span class="ptr-tag ptr-found">FOUND</span>';
          } else if (isMid) {
            ptrTop.innerHTML = '<span class="ptr-tag ptr-mid">mid</span>';
          }

          var box = document.createElement("div");
          box.className = "cell-box";
          box.textContent = arr[i];
          box.title = "اضغط لجعل " + arr[i] + " هو الهدف";
          (function (val) {
            box.addEventListener("click", function () {
              setTarget(val);
            });
          })(arr[i]);

          var idx = document.createElement("div");
          idx.className = "cell-idx";
          idx.textContent = i;

          var ptrBottom = document.createElement("div");
          ptrBottom.className = "ptr-bottom";
          if (step.low === i && step.high === i) {
            ptrBottom.innerHTML = '<span class="ptr-tag ptr-low">L</span><span class="ptr-tag ptr-high">H</span>';
          } else {
            if (step.low === i) ptrBottom.innerHTML += '<span class="ptr-tag ptr-low">low</span>';
            if (step.high === i) ptrBottom.innerHTML += '<span class="ptr-tag ptr-high">high</span>';
          }

          wrap.appendChild(ptrTop);
          wrap.appendChild(box);
          wrap.appendChild(idx);
          wrap.appendChild(ptrBottom);
          elTrack.appendChild(wrap);
        }

        elExplainBox.className = "explain-box " + (
          step.status === "found" ? "state-found" :
          step.status === "not-found" ? "state-notfound" :
          step.status === "init" ? "" : "state-step"
        );
        elExplainTitle.textContent = step.title;
        elExplainText.textContent = step.text;

        var midLabel = step.mid === null ? "—" : step.mid + " (val=" + arr[step.mid] + ")";
        elVarsStrip.innerHTML =
          '<span class="var-pill">target = ' + state.target + '</span>' +
          '<span class="var-pill" style="color:#38bdf8">low = ' + step.low + '</span>' +
          '<span class="var-pill" style="color:#fbbf24">mid = ' + midLabel + '</span>' +
          '<span class="var-pill" style="color:#d8b4fe">high = ' + step.high + '</span>';

        var linearTotal = computeLinearCost(arr, state.target);
        var maxLog = Math.ceil(Math.log2(n + 1));
        var remaining = step.low <= step.high ? (step.high - step.low + 1) : 0;
        var discarded = n - remaining;
        var saved = Math.max(0, linearTotal - step.comparisons);

        mBinary.textContent = step.comparisons;
        mMaxLog.textContent = "الحد الأقصى النظري: " + maxLog + " خطوات";
        mLinear.textContent = linearTotal;
        mLinearSub.textContent = arr.indexOf(state.target) !== -1
          ? "موقعه بالبحث الخطي: " + linearTotal + " خطوة"
          : "يفحص كل العناصر (" + n + ") لإثبات غيابه";
        mRemaining.textContent = remaining;
        mDiscarded.textContent = "تم استبعاد " + discarded + " عنصر (" + Math.round((discarded / n) * 100) + "%)";
        mSaved.textContent = step.status === "init" ? "—" : ("+" + saved);
        mSavedSub.textContent = step.status === "init"
          ? "ابدأ الخطوات لرؤية الفرق"
          : "وفّر البحث الثنائي " + saved + " مقارنة";

        var pct = state.steps.length <= 1 ? 100 : (state.stepIndex / (state.steps.length - 1)) * 100;
        elProgress.style.width = pct + "%";

        btnPrev.disabled = state.stepIndex === 0;
        btnNext.disabled = state.stepIndex >= state.steps.length - 1;
        if (state.stepIndex >= state.steps.length - 1) {
          stopPlay();
        }
      }

      function rebuild() {
        stopPlay();
        state.steps = buildSteps(state.arr, state.target);
        state.stepIndex = 0;
        renderPresets();
        render();
      }

      function setTarget(val) {
        if (isNaN(val)) return;
        state.target = val;
        elTarget.value = val;
        rebuild();
      }

      elTarget.addEventListener("change", function () {
        var v = parseInt(elTarget.value, 10);
        if (!isNaN(v)) setTarget(v);
      });

      elTarget.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var v = parseInt(elTarget.value, 10);
          if (!isNaN(v)) setTarget(v);
        }
      });

      elSize.addEventListener("change", function () {
        var sz = parseInt(elSize.value, 10);
        state.arr = DEFAULT_ARRAYS[sz] ? DEFAULT_ARRAYS[sz].slice() : generateSortedArray(sz);
        state.target = state.arr[Math.floor(state.arr.length * 0.65)];
        elTarget.value = state.target;
        rebuild();
      });

      btnNewArray.addEventListener("click", function () {
        var sz = parseInt(elSize.value, 10);
        state.arr = generateSortedArray(sz);
        state.target = state.arr[Math.floor(Math.random() * sz)];
        elTarget.value = state.target;
        rebuild();
      });

      btnPrev.addEventListener("click", function () {
        stopPlay();
        if (state.stepIndex > 0) {
          state.stepIndex -= 1;
          render();
        }
      });

      btnNext.addEventListener("click", function () {
        stopPlay();
        if (state.stepIndex < state.steps.length - 1) {
          state.stepIndex += 1;
          render();
        }
      });

      btnReset.addEventListener("click", function () {
        stopPlay();
        state.stepIndex = 0;
        render();
      });

      btnPlay.addEventListener("click", function () {
        if (state.timer) {
          stopPlay();
          return;
        }
        if (state.stepIndex >= state.steps.length - 1) {
          state.stepIndex = 0;
          render();
        }
        btnPlay.textContent = "إيقاف مؤقت";
        var delay = 2100 - parseInt(speedRange.value, 10);
        state.timer = setInterval(function () {
          if (state.stepIndex < state.steps.length - 1) {
            state.stepIndex += 1;
            render();
          } else {
            stopPlay();
          }
        }, delay);
      });

      speedRange.addEventListener("input", function () {
        if (state.timer) {
          stopPlay();
          btnPlay.click();
        }
      });

      rebuild();
    })();
  </script>
</body>
</html>`;

const SORTING_VISUALIZER_LAB_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مُحاكاة خوارزميات الترتيب — Sorting Visualizer Lab</title>
  <style>
    :root {
      --bg-root: #020617;
      --bg-card: #0f172a;
      --bg-elev: #1e293b;
      --border: #1e293b;
      --border-strong: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --indigo: #6366f1;
      --indigo-soft: rgba(99, 102, 241, 0.16);
      --emerald: #10b981;
      --emerald-soft: rgba(16, 185, 129, 0.16);
      --amber: #f59e0b;
      --rose: #f43f5e;
      --sky: #38bdf8;
      --radius: 14px;
      --font-ar: system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif;
      --font-mono: ui-monospace, "Cascadia Code", "Fira Code", Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.12), transparent 45%),
                  radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 40%),
                  var(--bg-root);
      color: var(--text-main);
      font-family: var(--font-ar);
      min-height: 100vh;
      padding: 16px;
      line-height: 1.5;
    }

    .app {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .header {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .title-group h1 {
      font-size: 1.15rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .title-group p {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .algo-tabs {
      display: inline-flex;
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      border-radius: 11px;
      padding: 4px;
      gap: 4px;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 7px 13px;
      border-radius: 8px;
      font-family: var(--font-ar);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .tab-btn:hover { color: var(--text-main); }
    .tab-btn.active {
      background: var(--indigo);
      color: #fff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 15px 16px;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    button.ctrl {
      font-family: var(--font-ar);
      font-size: 0.82rem;
      font-weight: 700;
      padding: 8px 13px;
      border-radius: 10px;
      border: 1px solid var(--border-strong);
      background: var(--bg-elev);
      color: var(--text-main);
      cursor: pointer;
      transition: background 0.18s, transform 0.1s, opacity 0.18s;
    }

    button.ctrl:hover:not(:disabled) { background: #293548; }
    button.ctrl:active:not(:disabled) { transform: scale(0.97); }
    button.ctrl:disabled { opacity: 0.4; cursor: not-allowed; }

    button.ctrl-play {
      background: var(--emerald);
      border-color: #34d399;
      color: #022c22;
    }
    button.ctrl-play:hover:not(:disabled) { background: #059669; color: #fff; }

    button.ctrl-primary {
      background: var(--indigo);
      border-color: #818cf8;
      color: #fff;
    }
    button.ctrl-primary:hover:not(:disabled) { background: #4f46e5; }

    .sliders {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
    }

    .slider-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .slider-val {
      font-family: var(--font-mono);
      color: #e2e8f0;
      min-width: 28px;
      text-align: center;
      direction: ltr;
    }

    input[type="range"] {
      accent-color: var(--indigo);
      width: 96px;
      cursor: pointer;
    }

    .presets {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding-top: 11px;
      border-top: 1px dashed var(--border-strong);
      justify-content: space-between;
    }

    .preset-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }

    .chip {
      font-family: var(--font-ar);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid var(--border-strong);
      background: var(--bg-root);
      color: #cbd5e1;
      cursor: pointer;
    }

    .chip:hover { border-color: var(--indigo); color: #fff; }

    .complexity-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      direction: ltr;
    }

    .c-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 9px;
      border-radius: 8px;
      background: var(--bg-root);
      border: 1px solid var(--border-strong);
      color: #cbd5e1;
    }

    .c-badge b { color: #a5b4fc; }
    .c-badge.good b { color: #34d399; }

    .stage-top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .leg {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      display: inline-block;
    }

    .bars-stage {
      height: 248px;
      background: var(--bg-root);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 12px 10px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 6px;
      direction: ltr;
      overflow: hidden;
    }

    .bar-col {
      flex: 1;
      max-width: 54px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
    }

    .bar-val {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: #cbd5e1;
    }

    .bar {
      width: 100%;
      border-radius: 7px 7px 3px 3px;
      background: linear-gradient(180deg, #6366f1 0%, #3730a3 100%);
      transition: height 0.16s ease, background 0.16s ease, transform 0.16s ease;
      min-height: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }

    .bar.comparing {
      background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
      transform: scaleY(1.02);
    }

    .bar.swapping {
      background: linear-gradient(180deg, #fb7185 0%, #e11d48 100%);
      transform: scaleY(1.04);
    }

    .bar.pivot {
      background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
    }

    .bar.sorted {
      background: linear-gradient(180deg, #34d399 0%, #059669 100%);
    }

    .bar-idx {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-dim);
    }

    .explain-bar {
      margin-top: 12px;
      padding: 11px 14px;
      border-radius: 11px;
      background: rgba(30, 41, 59, 0.55);
      border: 1px solid var(--border-strong);
      border-right: 4px solid var(--indigo);
      font-size: 0.85rem;
      color: #e2e8f0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .explain-bar.done {
      border-right-color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
    }

    .step-pill {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #94a3b8;
      direction: ltr;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }

    .stat {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 11px 13px;
    }

    .stat-label {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .stat-val {
      font-family: var(--font-mono);
      font-size: 1.2rem;
      font-weight: 800;
      margin-top: 2px;
      direction: ltr;
      text-align: right;
    }

    .c-amber { color: #fbbf24; }
    .c-rose { color: #fb7185; }
    .c-emerald { color: #34d399; }
    .c-indigo { color: #a5b4fc; }

    .progress-track {
      height: 5px;
      background: var(--bg-root);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--indigo), var(--emerald));
      transition: width 0.15s ease;
    }

    @media (max-width: 720px) {
      body { padding: 10px; }
      .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .bars-stage { height: 205px; gap: 3px; padding: 12px 6px 8px; }
      .bar-val { font-size: 0.62rem; }
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="title-group">
        <h1>مُحاكاة خوارزميات الترتيب التفاعلية</h1>
        <p id="algoSubtitle">قارن بصرياً بين الترتيب الفقاعي والاختيار والإدراج مع عداد المقارنات والتبديلات.</p>
      </div>
      <div class="algo-tabs" role="tablist">
        <button class="tab-btn active" data-algo="bubble">Bubble Sort</button>
        <button class="tab-btn" data-algo="selection">Selection Sort</button>
        <button class="tab-btn" data-algo="insertion">Insertion Sort</button>
      </div>
    </header>

    <section class="card">
      <div class="toolbar">
        <div class="btn-row">
          <button id="btnPlay" class="ctrl ctrl-play">تشغيل</button>
          <button id="btnPrev" class="ctrl">السابق</button>
          <button id="btnNext" class="ctrl ctrl-primary">خطوة</button>
          <button id="btnReset" class="ctrl">إعادة</button>
          <button id="btnShuffle" class="ctrl">خلط عشوائي</button>
        </div>

        <div class="sliders">
          <label class="slider-item">
            <span>الحجم</span>
            <input id="sizeRange" type="range" min="6" max="20" value="12" />
            <span class="slider-val" id="sizeVal">12</span>
          </label>
          <label class="slider-item">
            <span>السرعة</span>
            <input id="speedRange" type="range" min="1" max="10" value="6" />
            <span class="slider-val" id="speedVal">6x</span>
          </label>
        </div>
      </div>

      <div class="presets">
        <div class="preset-group">
          <span style="font-size:0.76rem;color:#94a3b8;">شكل البيانات:</span>
          <button class="chip" data-pattern="random">عشوائي</button>
          <button class="chip" data-pattern="nearly">شبه مرتّبة (أفضل حالة)</button>
          <button class="chip" data-pattern="reversed">معكوسة (أسوأ حالة)</button>
        </div>
        <div class="complexity-badges" id="complexityBadges"></div>
      </div>
    </section>

    <section class="card">
      <div class="stage-top">
        <div class="legend">
          <span class="leg"><span class="swatch" style="background:#6366f1"></span> غير مرتّب</span>
          <span class="leg"><span class="swatch" style="background:#f59e0b"></span> مقارنة</span>
          <span class="leg"><span class="swatch" style="background:#f43f5e"></span> تبديل / إزاحة</span>
          <span class="leg"><span class="swatch" style="background:#38bdf8"></span> العنصر المختار / المفتاح</span>
          <span class="leg"><span class="swatch" style="background:#10b981"></span> في موضعه النهائي</span>
        </div>
      </div>

      <div class="bars-stage" id="barsStage"></div>
      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>

      <div class="explain-bar" id="explainBar">
        <span id="explainText">اضغط «تشغيل» أو «خطوة» لبدء المحاكاة.</span>
        <span class="step-pill" id="stepCounter">0 / 0</span>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat">
        <div class="stat-label">عدد المقارنات (Comparisons)</div>
        <div class="stat-val c-amber" id="statComp">0</div>
      </div>
      <div class="stat">
        <div class="stat-label">التبديلات / النقلات (Swaps)</div>
        <div class="stat-val c-rose" id="statSwap">0</div>
      </div>
      <div class="stat">
        <div class="stat-label">العناصر المرتّبة</div>
        <div class="stat-val c-emerald" id="statSorted">0</div>
      </div>
      <div class="stat">
        <div class="stat-label">الحالة الحالية</div>
        <div class="stat-val c-indigo" id="statStatus" style="font-size:0.95rem;font-family:var(--font-ar);">جاهز</div>
      </div>
    </section>
  </div>

  <script>
    (function () {
      var ALGO_INFO = {
        bubble: {
          name: "الترتيب الفقاعي (Bubble Sort)",
          desc: "يقارن كل عنصرين متجاورين ويبدّلهما إذا كانا بترتيب خاطئ، فتصعد القيم الكبرى لنهاية المصفوفة.",
          best: "O(n)",
          avg: "O(n²)",
          worst: "O(n²)",
          space: "O(1)",
          stable: "Stable"
        },
        selection: {
          name: "ترتيب الاختيار (Selection Sort)",
          desc: "يبحث في كل دورة عن أصغر عنصر في الجزء غير المرتّب ويضعه مباشرة في موضعه الصحيح بأقل عدد تبديلات.",
          best: "O(n²)",
          avg: "O(n²)",
          worst: "O(n²)",
          space: "O(1)",
          stable: "Unstable"
        },
        insertion: {
          name: "الترتيب بالإدراج (Insertion Sort)",
          desc: "يبني المصفوفة المرتّبة عنصراً تلو الآخر بإدراج كل «مفتاح» في موضعه الصحيح — ممتاز للمصفوفات شبه المرتّبة!",
          best: "O(n)",
          avg: "O(n²)",
          worst: "O(n²)",
          space: "O(1)",
          stable: "Stable"
        }
      };

      var state = {
        algo: "bubble",
        size: 12,
        speed: 6,
        baseArray: [],
        frames: [],
        frameIdx: 0,
        timer: null
      };

      var elStage = document.getElementById("barsStage");
      var elExplainBar = document.getElementById("explainBar");
      var elExplainText = document.getElementById("explainText");
      var elStepCounter = document.getElementById("stepCounter");
      var elProgress = document.getElementById("progressFill");
      var elBadges = document.getElementById("complexityBadges");
      var elSubtitle = document.getElementById("algoSubtitle");

      var statComp = document.getElementById("statComp");
      var statSwap = document.getElementById("statSwap");
      var statSorted = document.getElementById("statSorted");
      var statStatus = document.getElementById("statStatus");

      var btnPlay = document.getElementById("btnPlay");
      var btnPrev = document.getElementById("btnPrev");
      var btnNext = document.getElementById("btnNext");
      var btnReset = document.getElementById("btnReset");
      var btnShuffle = document.getElementById("btnShuffle");
      var sizeRange = document.getElementById("sizeRange");
      var sizeVal = document.getElementById("sizeVal");
      var speedRange = document.getElementById("speedRange");
      var speedVal = document.getElementById("speedVal");

      function makeArray(size, pattern) {
        var arr = [];
        if (pattern === "reversed") {
          for (var i = 0; i < size; i++) {
            arr.push(Math.round(95 - (i * (80 / Math.max(1, size - 1)))));
          }
        } else if (pattern === "nearly") {
          for (var j = 0; j < size; j++) {
            arr.push(Math.round(15 + (j * (80 / Math.max(1, size - 1)))));
          }
          if (size >= 4) {
            var a = Math.floor(size / 3);
            var tmp = arr[a]; arr[a] = arr[a + 1]; arr[a + 1] = tmp;
            var b = Math.max(1, size - 3);
            var tmp2 = arr[b]; arr[b] = arr[b + 1]; arr[b + 1] = tmp2;
          }
        } else {
          for (var k = 0; k < size; k++) {
            arr.push(Math.floor(Math.random() * 82) + 14);
          }
        }
        return arr;
      }

      function cloneSorted(setObj) {
        var out = {};
        for (var k in setObj) {
          if (Object.prototype.hasOwnProperty.call(setObj, k)) out[k] = true;
        }
        return out;
      }

      function buildBubbleFrames(input) {
        var arr = input.slice();
        var n = arr.length;
        var frames = [];
        var sorted = {};
        var comp = 0;
        var swaps = 0;

        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [], sorted: {},
          comp: 0, swaps: 0, done: false,
          msg: "البداية: سنمر على المصفوفة ونقارن كل عنصرين متجاورين."
        });

        for (var i = 0; i < n - 1; i++) {
          var swappedInPass = false;
          for (var j = 0; j < n - i - 1; j++) {
            comp++;
            frames.push({
              arr: arr.slice(), comparing: [j, j + 1], swapping: [], pivot: [],
              sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
              msg: "مقارنة arr[" + j + "]=" + arr[j] + " مع arr[" + (j + 1) + "]=" + arr[j + 1]
            });

            if (arr[j] > arr[j + 1]) {
              var t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
              swaps++;
              swappedInPass = true;
              frames.push({
                arr: arr.slice(), comparing: [], swapping: [j, j + 1], pivot: [],
                sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
                msg: "تبديل! لأن " + arr[j + 1] + " > " + arr[j] + " ننقله لليمين."
              });
            }
          }
          sorted[n - 1 - i] = true;
          if (!swappedInPass) {
            for (var k = 0; k < n; k++) sorted[k] = true;
            frames.push({
              arr: arr.slice(), comparing: [], swapping: [], pivot: [],
              sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: true,
              msg: "تحسين مبكّر (Early Exit): لم يحدث أي تبديل في هذه الدورة، إذن المصفوفة مرتّبة بالكامل!"
            });
            return frames;
          }
        }
        for (var m = 0; m < n; m++) sorted[m] = true;
        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [],
          sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: true,
          msg: "اكتمل الترتيب الفقاعي بنجاح!"
        });
        return frames;
      }

      function buildSelectionFrames(input) {
        var arr = input.slice();
        var n = arr.length;
        var frames = [];
        var sorted = {};
        var comp = 0;
        var swaps = 0;

        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [], sorted: {},
          comp: 0, swaps: 0, done: false,
          msg: "البداية: في كل دورة نبحث عن أصغر عنصر ونضعه في بداية الجزء غير المرتّب."
        });

        for (var i = 0; i < n - 1; i++) {
          var minIdx = i;
          frames.push({
            arr: arr.slice(), comparing: [], swapping: [], pivot: [minIdx],
            sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
            msg: "الدورة " + (i + 1) + ": نفترض أن الأصغر هو arr[" + minIdx + "]=" + arr[minIdx]
          });

          for (var j = i + 1; j < n; j++) {
            comp++;
            frames.push({
              arr: arr.slice(), comparing: [j], swapping: [], pivot: [minIdx],
              sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
              msg: "مقارنة arr[" + j + "]=" + arr[j] + " مع الأصغر الحالي arr[" + minIdx + "]=" + arr[minIdx]
            });
            if (arr[j] < arr[minIdx]) {
              minIdx = j;
              frames.push({
                arr: arr.slice(), comparing: [], swapping: [], pivot: [minIdx],
                sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
                msg: "وجدنا قيمة أصغر! الأصغر الجديد هو arr[" + minIdx + "]=" + arr[minIdx]
              });
            }
          }

          if (minIdx !== i) {
            var tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
            swaps++;
            frames.push({
              arr: arr.slice(), comparing: [], swapping: [i, minIdx], pivot: [],
              sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
              msg: "نبدّل الأصغر (" + arr[i] + ") إلى الموضع النهائي index " + i
            });
          }
          sorted[i] = true;
        }
        for (var m = 0; m < n; m++) sorted[m] = true;
        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [],
          sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: true,
          msg: "اكتمل ترتيب الاختيار بنجاح! لاحظ قلة عدد التبديلات (" + swaps + " فقط)."
        });
        return frames;
      }

      function buildInsertionFrames(input) {
        var arr = input.slice();
        var n = arr.length;
        var frames = [];
        var sorted = { 0: true };
        var comp = 0;
        var swaps = 0;

        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [], sorted: cloneSorted(sorted),
          comp: 0, swaps: 0, done: false,
          msg: "البداية: نعتبر العنصر الأول arr[0]=" + arr[0] + " مرتّباً، ثم نُدرج باقي العناصر تباعاً."
        });

        for (var i = 1; i < n; i++) {
          var key = arr[i];
          var j = i - 1;
          frames.push({
            arr: arr.slice(), comparing: [], swapping: [], pivot: [i],
            sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
            msg: "نختار المفتاح key = arr[" + i + "] = " + key + " لإدراجه في الجزء المرتّب."
          });

          while (j >= 0) {
            comp++;
            frames.push({
              arr: arr.slice(), comparing: [j], swapping: [], pivot: [j + 1],
              sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
              msg: "مقارنة key=" + key + " مع arr[" + j + "]=" + arr[j]
            });

            if (arr[j] > key) {
              arr[j + 1] = arr[j];
              arr[j] = key;
              swaps++;
              frames.push({
                arr: arr.slice(), comparing: [], swapping: [j, j + 1], pivot: [],
                sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: false,
                msg: "إزاحة " + arr[j + 1] + " لليمين لفتح مكان للمفتاح " + key
              });
              j--;
            } else {
              break;
            }
          }
          for (var k = 0; k <= i; k++) sorted[k] = true;
        }

        for (var m = 0; m < n; m++) sorted[m] = true;
        frames.push({
          arr: arr.slice(), comparing: [], swapping: [], pivot: [],
          sorted: cloneSorted(sorted), comp: comp, swaps: swaps, done: true,
          msg: "اكتمل الترتيب بالإدراج بنجاح!"
        });
        return frames;
      }

      function stopPlay() {
        if (state.timer) {
          clearInterval(state.timer);
          state.timer = null;
        }
        btnPlay.textContent = "تشغيل";
      }

      function renderComplexity() {
        var info = ALGO_INFO[state.algo];
        elSubtitle.textContent = info.desc;
        elBadges.innerHTML =
          '<span class="c-badge good">Best: <b>' + info.best + '</b></span>' +
          '<span class="c-badge">Avg: <b>' + info.avg + '</b></span>' +
          '<span class="c-badge">Worst: <b>' + info.worst + '</b></span>' +
          '<span class="c-badge good">Space: <b>' + info.space + '</b></span>' +
          '<span class="c-badge">' + info.stable + '</span>';
      }

      function renderFrame() {
        var f = state.frames[state.frameIdx];
        var maxVal = Math.max.apply(null, f.arr.concat([100]));

        elStage.innerHTML = "";
        for (var i = 0; i < f.arr.length; i++) {
          var col = document.createElement("div");
          col.className = "bar-col";

          var val = document.createElement("div");
          val.className = "bar-val";
          val.textContent = f.arr[i];

          var bar = document.createElement("div");
          var cls = "bar";
          if (f.swapping.indexOf(i) !== -1) cls += " swapping";
          else if (f.comparing.indexOf(i) !== -1) cls += " comparing";
          else if (f.pivot.indexOf(i) !== -1) cls += " pivot";
          else if (f.sorted[i]) cls += " sorted";
          bar.className = cls;
          bar.style.height = Math.max(10, Math.round((f.arr[i] / maxVal) * 185)) + "px";

          var idx = document.createElement("div");
          idx.className = "bar-idx";
          idx.textContent = i;

          col.appendChild(val);
          col.appendChild(bar);
          col.appendChild(idx);
          elStage.appendChild(col);
        }

        elExplainText.textContent = f.msg;
        elExplainBar.className = "explain-bar" + (f.done ? " done" : "");
        elStepCounter.textContent = state.frameIdx + " / " + (state.frames.length - 1);

        var pct = state.frames.length <= 1 ? 100 : (state.frameIdx / (state.frames.length - 1)) * 100;
        elProgress.style.width = pct + "%";

        statComp.textContent = f.comp;
        statSwap.textContent = f.swaps;
        statSorted.textContent = Object.keys(f.sorted).length + " / " + f.arr.length;
        statStatus.textContent = f.done ? "مرتّبة ✓" : (state.frameIdx === 0 ? "جاهز" : "جاري الترتيب...");

        btnPrev.disabled = state.frameIdx === 0;
        btnNext.disabled = state.frameIdx >= state.frames.length - 1;
        if (state.frameIdx >= state.frames.length - 1) stopPlay();
      }

      function rebuildFrames() {
        stopPlay();
        if (state.algo === "bubble") state.frames = buildBubbleFrames(state.baseArray);
        else if (state.algo === "selection") state.frames = buildSelectionFrames(state.baseArray);
        else state.frames = buildInsertionFrames(state.baseArray);
        state.frameIdx = 0;
        renderComplexity();
        renderFrame();
      }

      function getDelayMs() {
        return Math.max(45, Math.round(1050 - state.speed * 100));
      }

      function startPlay() {
        if (state.frameIdx >= state.frames.length - 1) {
          state.frameIdx = 0;
          renderFrame();
        }
        btnPlay.textContent = "إيقاف";
        state.timer = setInterval(function () {
          if (state.frameIdx < state.frames.length - 1) {
            state.frameIdx += 1;
            renderFrame();
          } else {
            stopPlay();
          }
        }, getDelayMs());
      }

      var tabBtns = document.querySelectorAll(".tab-btn");
      tabBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          tabBtns.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          state.algo = btn.getAttribute("data-algo");
          rebuildFrames();
        });
      });

      document.querySelectorAll(".chip[data-pattern]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          var pat = chip.getAttribute("data-pattern");
          state.baseArray = makeArray(state.size, pat);
          rebuildFrames();
        });
      });

      btnPlay.addEventListener("click", function () {
        if (state.timer) stopPlay();
        else startPlay();
      });

      btnPrev.addEventListener("click", function () {
        stopPlay();
        if (state.frameIdx > 0) {
          state.frameIdx -= 1;
          renderFrame();
        }
      });

      btnNext.addEventListener("click", function () {
        stopPlay();
        if (state.frameIdx < state.frames.length - 1) {
          state.frameIdx += 1;
          renderFrame();
        }
      });

      btnReset.addEventListener("click", function () {
        stopPlay();
        state.frameIdx = 0;
        renderFrame();
      });

      btnShuffle.addEventListener("click", function () {
        state.baseArray = makeArray(state.size, "random");
        rebuildFrames();
      });

      sizeRange.addEventListener("input", function () {
        state.size = parseInt(sizeRange.value, 10);
        sizeVal.textContent = state.size;
        state.baseArray = makeArray(state.size, "random");
        rebuildFrames();
      });

      speedRange.addEventListener("input", function () {
        state.speed = parseInt(speedRange.value, 10);
        speedVal.textContent = state.speed + "x";
        if (state.timer) {
          stopPlay();
          startPlay();
        }
      });

      state.baseArray = makeArray(state.size, "random");
      rebuildFrames();
    })();
  </script>
</body>
</html>`;

// ============================================================================
// Courses
// ============================================================================
export const MOCK_COURSES: Course[] = [
  {
    id: COURSE_IDS.DATA_STRUCTURES,
    slug: "data-structures",
    code: "CS-213",
    title: "هياكل البيانات",
    title_en: "Data Structures",
    description:
      "بناء وفهم هياكل البيانات الأساسية من المصفوفات والقوائم المترابطة وحتى المكدسات والطوابير بتطبيقات C++ عملية ومعامل محاكاة تفاعلية.",
    thumbnail_url: null,
    year_level: 2,
    term: 1,
    is_paid: false,
    price: 0,
    is_published: true,
    accent: "#1d6b52",
    icon: "git-fork",
    duration_minutes: 45,
    site_url: "cs-portal.app/courses/data-structures",
    exam_tip:
      "💡 فكرة امتحان متكررة: لو نسيت تربط n->next = head قبل ما تغيّر head = n، هتفقد باقي القائمة بالكامل (Memory Leak).",
    cheat_sheet: {
      headers: ["العملية", "Array", "Singly Linked List"],
      rows: [
        ["Access by Index", "O(1)", "O(n)"],
        ["Insert at Head", "O(n)", "O(1) ✓"],
        ["Delete at Head", "O(n)", "O(1) ✓"],
        ["Memory Layout", "متجاور (Contiguous)", "ديناميكي بالمؤشرات"],
      ],
    },
    lab_type: "linked-list",
    lab_title: "معمل القائمة المترابطة (Live Linked List)",
    lab_hint:
      "اضغط على Push Head لإضافة عقدة جديدة في البداية في زمن O(1)، أو Pop Head لحذف أول عقدة فوراً.",
    created_at: "2025-09-01T10:00:00Z",
  },
  {
    id: COURSE_IDS.ALGORITHMS,
    slug: "algorithms",
    code: "CS-214",
    title: "تحليل وتصميم الخوارزميات",
    title_en: "Algorithms",
    description:
      "استراتيجيات تصميم الخوارزميات الفعّالة: تحليل التعقيد Big-O، فرّق تسد، البحث الثنائي، وخوارزميات الترتيب الأساسية عملياً عبر محاكي بصري تفاعلي.",
    thumbnail_url: null,
    year_level: 2,
    term: 2,
    is_paid: false,
    price: 0,
    is_published: false,
    accent: "#1e355c",
    icon: "workflow",
    duration_minutes: 35,
    site_url: "cs-portal.app/courses/algorithms",
    exam_tip:
      "💡 فكرة امتحان: نكتب low + (high - low) / 2 بدل (low + high) / 2 لتجنب حدوث Integer Overflow في الأرقام الكبيرة.",
    cheat_sheet: {
      headers: ["الخوارزمية", "Best / Avg", "Worst Case"],
      rows: [
        ["Binary Search", "O(1) / O(log n)", "O(log n) ✓"],
        ["Merge Sort", "O(n log n)", "O(n log n) ✓"],
        ["Quick Sort", "O(n log n)", "O(n²)"],
        ["Linear Search", "O(1) / O(n)", "O(n)"],
      ],
    },
    lab_type: "binary-search",
    lab_title: "معمل البحث الثنائي (Interactive Binary Search)",
    lab_hint:
      'اضغط "الخطوة التالية" وشوف إزاي الخوارزمية بتقسم المصفوفة للنص في كل مقارنة للوصول للرقم 31.',
    created_at: "2025-09-02T10:00:00Z",
  },
  {
    id: COURSE_IDS.OPERATING_SYSTEMS,
    slug: "operating-systems",
    code: "CS-311",
    title: "نظم التشغيل",
    title_en: "Operating Systems",
    description:
      "فهم آلية عمل نظام التشغيل: إدارة العمليات والخيوط، جدولة المعالج (CPU Scheduling)، التزامن، وإدارة الذاكرة بشرح منظم وكويزات.",
    thumbnail_url: null,
    year_level: 3,
    term: 1,
    is_paid: true,
    price: 150,
    is_published: true,
    accent: "#c25e33",
    icon: "cpu",
    duration_minutes: 65,
    site_url: "cs-portal.app/courses/operating-systems",
    exam_tip:
      "💡 فكرة امتحان مهمة: خوارزمية SJF تعطي أقل Average Waiting Time لكنها قد تسبب Starvation للعمليات الطويلة (الحل: Aging).",
    cheat_sheet: {
      headers: ["الخوارزمية", "الميزة الأساسية", "أشهر عيب"],
      rows: [
        ["FCFS", "بسيطة جداً في التنفيذ", "Convoy Effect"],
        ["SJF", "أقل Average Waiting Time ✓", "Starvation للعمليات الطويلة"],
        ["Round Robin", "عادلة للـ Time-Sharing", "زيادة Context Switch لو q صغير"],
      ],
    },
    lab_type: "cpu-scheduling",
    lab_title: "محاكي جدولة المعالج (CPU Scheduling Gantt Chart)",
    lab_hint:
      "بدّل بين خوارزمية FCFS و SJF وشوف إزاي ترتيب العمليات بيقلل متوسط وقت الانتظار (Average Waiting Time).",
    unlock_code: "AI2026",
    created_at: "2025-09-03T10:00:00Z",
  },
  {
    id: COURSE_IDS.COMPUTER_ORGANIZATION,
    slug: "computer-organization",
    code: "CS-215",
    title: "تنظيم ومعمارية الحاسب",
    title_en: "Computer Organization and Architecture",
    description:
      "فهم البنية الداخلية للحاسب: تمثيل البيانات، الدوائر المنطقية، وحدة المعالجة المركزية (CPU & ALU)، خطوط الأنابيب (Pipelining)، وهرمية الذاكرة والـ Cache.",
    thumbnail_url: null,
    year_level: 2,
    term: 1,
    is_paid: false,
    price: 0,
    is_published: false,
    accent: "#1e355c",
    icon: "circuit-board",
    duration_minutes: 0,
    site_url: "cs-portal.app/courses/computer-organization",
    exam_tip:
      "جاري تجهيز ملخصات ليلة الامتحان ومسائل الـ Cache والـ Pipelining لهذا المقرر.",
    cheat_sheet: {
      headers: ["الموضوع", "المفهوم الأساسي", "نقطة التركيز"],
      rows: [
        ["Number Systems", "Binary / Two's Complement", "تمثيل الأعداد السالبة والـ Overflow"],
        ["CPU Datapath", "Fetch · Decode · Execute", "دورة تنفيذ الأمر وسجلات المعالج"],
        ["Cache Memory", "Direct / Associative Mapping", "حساب Tag / Index / Offset"],
      ],
    },
    lab_type: "cpu-scheduling",
    lab_title: "معمل تنظيم الحاسب (قريباً)",
    lab_hint: "سيتم إضافة المعامل التفاعلية مع رفع محاضرات المقرر.",
    created_at: "2025-09-04T10:00:00Z",
  },
  {
    id: COURSE_IDS.DATABASE_SYSTEMS,
    slug: "database-systems",
    code: "IS-211",
    title: "نظم قواعد البيانات",
    title_en: "Database Systems",
    description:
      "تصميم قواعد البيانات العلائقية: مخططات ERD، التحويل للـ Relational Schema، قواعد التطبيع (Normalization)، واستعلامات SQL العملية والمعاملات.",
    thumbnail_url: null,
    year_level: 2,
    term: 2,
    is_paid: false,
    price: 0,
    is_published: true,
    accent: "#2563eb",
    icon: "database",
    duration_minutes: 0,
    site_url: "cs-portal.app/courses/database-systems",
    exam_tip:
      "جاري تجهيز ملخصات SQL وخطوات التحويل من ERD لـ 3NF لهذا المقرر.",
    cheat_sheet: {
      headers: ["المرحلة", "القاعدة", "الهدف"],
      rows: [
        ["1NF", "قيم ذرية (Atomic Values)", "إزالة التكرار داخل الخلية"],
        ["2NF", "لا اعتماد جزئي (No Partial Dep.)", "الاعتماد الكامل على المفتاح الأساسي"],
        ["3NF", "لا اعتماد متعدي (No Transitive Dep.)", "فصل الأعمدة غير المفتاحية المستقلة"],
      ],
    },
    lab_type: "linked-list",
    lab_title: "معمل استعلامات SQL (قريباً)",
    lab_hint: "سيتم إضافة التطبيقات التفاعلية مع رفع محاضرات المقرر.",
    created_at: "2025-09-05T10:00:00Z",
  },
  {
    id: COURSE_IDS.COMPUTER_GRAPHICS,
    slug: "computer-graphics",
    code: "CS-321",
    title: "الرسوميات بالحاسب",
    title_en: "Computer Graphics",
    description:
      "الشرح التفاعلي الكامل لمقرر Computer Graphics (Chapters 1–4): الأساسيات ونماذج الألوان RGB/CMY، خوارزمية Bresenham لرسم الخطوط، وخوارزمية Midpoint للدوائر مع بنك 85 سؤال شيت وميدتيرم وحاسبة مسائل.",
    thumbnail_url: null,
    year_level: 3,
    term: 1,
    is_paid: false,
    price: 0,
    is_published: true,
    accent: "#7c3aed",
    icon: "box",
    duration_minutes: 95,
    site_url: "cs-portal.app/courses/computer-graphics",
    exam_tip:
      "💡 فكرة امتحان مهمة: خوارزمية Bresenham للخط تبدأ بـ p₀ = 2Δy − Δx وتزيد y عند p_k ≥ 0، بينما Midpoint للدائرة تبدأ من (0, r) بـ p₀ = 1 − r وتنقص y عند p_k ≥ 0.",
    cheat_sheet: {
      headers: ["الشابتر / الخوارزمية", "القانون الأساسي", "ملاحظة امتحان سريعة"],
      rows: [
        ["Ch 1 · Frame Buffer & Eye", "Colors = 2^n · Visible 350–780 nm", "Full-Color = 24+ bits · Cones = Photopic (Color)"],
        ["Ch 2 · API & Color Models", "RGB (Additive) vs CMY (Subtractive)", "Primitive = What · Attribute = How · A=1.0 Opaque"],
        ["Ch 3 · Bresenham Line", "p₀ = 2Δy − Δx (Integer Only)", "عند p_k ≥ 0 نزوّد y+1 ونجمع 2Δy − 2Δx"],
        ["Ch 4 · Midpoint Circle", "p₀ = 1 − r (8-Way Symmetry)", "احسب عند (0,0) الأول وقف عند x ≥ y ثم اجمع (+x_c, +y_c)"],
      ],
    },
    lab_type: "binary-search",
    lab_title: "شرح مسائل شابتر 3 و 4 وحاسبة Bresenham & Midpoint",
    lab_hint: "افتح تبويب «الشرح التفاعلي» واضغط على «شرح مسائل شابتر 3 و 4 (بونص)» لتجربة الحاسبة والـ 16 حالة محلولة.",
    created_at: "2025-09-06T10:00:00Z",
  },
];

// ============================================================================
// Lessons
// ============================================================================
export const MOCK_LESSONS: Lesson[] = [
  // ---------- Course 1: Data Structures ----------
  {
    id: LESSON_IDS.DS_ARRAYS,
    course_id: COURSE_IDS.DATA_STRUCTURES,
    section_title: "الأسبوع الأول: الأساسيات والبحث",
    title: "المصفوفات والمؤشرات وتحليل التعقيد",
    title_en: "Arrays, Pointers & Big-O",
    order_index: 1,
    is_free_preview: true,
    duration_minutes: 15,
    video_provider: "youtube",
    video_id: "RBSGKlAvoiM",
    chapters: [
      {
        time: "00:00",
        name: "تمثيل المصفوفة في الذاكرة المتجاورة",
        pct: "28%",
        visual: "Address(A[i]) = Base + i × sizeof(T)  ⇒  O(1)",
      },
      {
        time: "05:30",
        name: "المصفوفة الديناميكية ومضاعفة السعة",
        pct: "64%",
        visual: "std::vector::push_back()  ⇒  O(1) Amortized",
      },
      {
        time: "10:45",
        name: "الإزاحة Shifting وتكلفة الإدراج في البداية",
        pct: "92%",
        visual: "insert(begin) shifts n elements  ⇒  O(n)",
      },
    ],
    key_code: `struct Node {
  int data;
  Node* next;
  Node(int v) : data(v), next(nullptr) {}
};

void insertHead(Node*& head, int val) {
  Node* n = new Node(val);
  n->next = head;
  head = n;
}`,
    exam_tip:
      "💡 فكرة امتحان متكررة: الوصول لعنصر في المصفوفة A[i] زمنه ثابت O(1) بفضل التجاور في الذاكرة، لكن الإدراج في البداية O(n) بسبب الإزاحة (Shifting).",
    summary_md: `## ما هي المصفوفة (Array)؟

المصفوفة هي **هيكل بيانات خطي متجاور في الذاكرة (Contiguous Memory)** يخزّن عناصر من نفس النوع. سر قوتها أن المعالج يستطيع حساب عنوان أي عنصر \`A[i]\` مباشرة في زمن ثابت $O(1)$ دون المرور على العناصر السابقة:

$$\\text{Address}(A[i]) = \\text{BaseAddress} + i \\times \\text{sizeof}(T)$$

### مقارنة العمليات الأساسية في المصفوفات

| العملية | المصفوفة الثابتة | المصفوفة الديناميكية (\`std::vector\`) | ملاحظات |
| :--- | :---: | :---: | :--- |
| الوصول العشوائي \`A[i]\` | $O(1)$ | $O(1)$ | بفضل التجاور في الذاكرة وCache Locality |
| الإدراج في النهاية | غير مدعوم | $O(1)$ Amortized | تتضاعف السعة ($2\\times$) عند الامتلاء |
| الإدراج / الحذف في البداية أو المنتصف | $O(n)$ | $O(n)$ | يتطلب إزاحة (Shifting) لباقي العناصر |
| البحث الخطي (Linear Search) | $O(n)$ | $O(n)$ | إذا كانت المصفوفة غير مرتّبة |

### مثال عملي بلغة C++

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> scores = {85, 92, 78, 96};
    scores.push_back(88); // O(1) amortized

    // الوصول المباشر O(1)
    cout << "Element at index 2: " << scores[2] << "\\n";

    // الإدراج في البداية يزيح كل العناصر: O(n)
    scores.insert(scores.begin(), 100);
    return 0;
}
\`\`\`

> **ملاحظة امتحانية هامة:** في C++ عند مضاعفة حجم \`std::vector\`، تكون تكلفة النسخ في أسوأ عملية منفردة $O(n)$، لكن **التكلفة المتوسطة المستهلكة (Amortized Cost)** لكل \`push_back\` هي $O(1)$.`,
    resources: [
      {
        title: "VisuAlgo — Array & Sorting Visualizations",
        url: "https://visualgo.net/en/array",
        type: "tool",
        description: "تمثيل بصري تفاعلي للمصفوفات وحركة العناصر داخل الذاكرة.",
      },
      {
        title: "GeeksforGeeks — Array Data Structure",
        url: "https://www.geeksforgeeks.org/array-data-structure/",
        type: "article",
        description: "مرجع شامل لخصائص المصفوفات وأشهر المسائل التدريبية عليها.",
      },
      {
        title: "NeetCode — Arrays & Hashing Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "problem",
        description: "مسائل مرتّبة لتقوية مهارات حل المسائل على المصفوفات.",
      },
    ],
    created_at: "2025-09-01T10:10:00Z",
  },
  {
    id: LESSON_IDS.DS_BINARY_SEARCH,
    course_id: COURSE_IDS.DATA_STRUCTURES,
    section_title: "الأسبوع الأول: الأساسيات والبحث",
    title: "البحث الثنائي (Binary Search)",
    title_en: "Binary Search & Divide-and-Conquer",
    order_index: 2,
    is_free_preview: true,
    duration_minutes: 16,
    video_provider: "youtube",
    video_id: "P3YID7liBug",
    chapters: [
      {
        time: "00:00",
        name: "شرط الترتيب وفكرة استبعاد نصف المجال",
        pct: "30%",
        visual: "Sorted Array ⇒ T(n) = T(n/2) + O(1) ⇒ O(log n)",
      },
      {
        time: "06:10",
        name: "حساب المنتصف بأمان ضد Integer Overflow",
        pct: "65%",
        visual: "int mid = low + (high - low) / 2;",
      },
      {
        time: "11:40",
        name: "تحديث المؤشرات low و high وتجنب Infinite Loop",
        pct: "94%",
        visual: "low = mid + 1  |  high = mid - 1",
      },
    ],
    key_code: `int binarySearch(int arr[], int n, int target) {
  int low = 0, high = n - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    exam_tip:
      "💡 فكرة امتحان: نكتب low + (high - low) / 2 بدل (low + high) / 2 لتجنب حدوث Integer Overflow في الأرقام الكبيرة.",
    summary_md: `## فكرة البحث الثنائي (Divide & Conquer)

بدلاً من فحص العناصر واحداً تلو الآخر بزمن $O(n)$، يستغل البحث الثنائي **شرط أن تكون المصفوفة مرتّبة (Sorted)** ليقارن القيمة المطلوبة بعنصر المنتصف \`arr[mid]\` ويستبعد **نصف مجال البحث كاملاً** في كل خطوة!

### معادلة التكرار والتعقيد الزمني

$$T(n) = T\\left(\\frac{n}{2}\\right) + O(1) \\implies T(n) = O(\\log_2 n)$$

عند البحث داخل مليون عنصر ($n = 10^6$):
- **البحث الخطي:** قد يحتاج حتى $1{,}000{,}000$ مقارنة.
- **البحث الثنائي:** يحتاج على الأكثر $\\lceil \\log_2(10^6) \\rceil = 20$ مقارنة فقط!

### جدول مقارنة سريع

| المعيار | Linear Search | Binary Search |
| :--- | :---: | :---: |
| شرط الترتيب المسبق | غير مطلوب | **مطلوب حتماً** |
| أفضل حالة (Best Case) | $O(1)$ | $O(1)$ |
| أسوأ حالة (Worst Case) | $O(n)$ | $O(\\log n)$ |
| تعقيد المساحة (Iterative) | $O(1)$ | $O(1)$ |

### الكود الاحترافي الآمن من Overflow (C++)

\`\`\`cpp
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = static_cast<int>(arr.size()) - 1;

    while (low <= high) {
        // نتجنب (low + high) / 2 لمنع Integer Overflow
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid;        // تم العثور على القيمة
        } else if (arr[mid] < target) {
            low = mid + 1;     // نستبعد النصف الأيسر
        } else {
            high = mid - 1;    // نستبعد النصف الأيمن
        }
    }
    return -1; // غير موجود
}
\`\`\`

> **جرّب بنفسك:** افتح **مختبر البحث الثنائي التفاعلي** أسفل الدرس لتتبّع المؤشرات \`low\` و \`mid\` و \`high\` عملياً.`,
    resources: [
      {
        title: "CP-Algorithms — Binary Search",
        url: "https://cp-algorithms.com/num_methods/binary_search.html",
        type: "article",
        description: "شرح متقدم للبحث الثنائي والبحث على الإجابة (Binary Search on Answer).",
      },
      {
        title: "NeetCode — Binary Search Practice List",
        url: "https://neetcode.io/practice",
        type: "problem",
        description: "أفضل مسائل LeetCode المنسّقة للتدرب على Binary Search.",
      },
      {
        title: "GeeksforGeeks — Binary Search Algorithm",
        url: "https://www.geeksforgeeks.org/binary-search/",
        type: "article",
        description: "مقارنة بين النسخة التكرارية (Iterative) والعودية (Recursive).",
      },
    ],
    created_at: "2025-09-01T10:20:00Z",
  },
  {
    id: LESSON_IDS.DS_LINKED_LISTS_STACKS,
    course_id: COURSE_IDS.DATA_STRUCTURES,
    section_title: "الأسبوع الثاني: هياكل البيانات الخطية",
    title: "القوائم المترابطة والمكدسات (Linked Lists & Stacks)",
    title_en: "Singly & Doubly Linked Lists, Stacks",
    order_index: 3,
    is_free_preview: true,
    duration_minutes: 14,
    video_provider: "youtube",
    video_id: "njTh_OwMljA",
    chapters: [
      {
        time: "00:00",
        name: "بنية العقدة Node في الذاكرة",
        pct: "28%",
        visual: "Struct Node { int data; Node* next; }",
      },
      {
        time: "05:40",
        name: "الإدراج في البداية Insert Head",
        pct: "64%",
        visual: "HEAD → [NEW] → [14] → [29] → NULL",
      },
      {
        time: "11:20",
        name: "حذف عقدة وتحليل Big-O والمكدس Stack",
        pct: "92%",
        visual: "Time Complexity: O(1) at Head · O(n) at Tail",
      },
    ],
    key_code: `struct Node {
  int data;
  Node* next;
  Node(int v) : data(v), next(nullptr) {}
};

void insertHead(Node*& head, int val) {
  Node* n = new Node(val);
  n->next = head;
  head = n;
}`,
    exam_tip:
      "💡 فكرة امتحان متكررة: لو نسيت تربط n->next = head قبل ما تغيّر head = n، هتفقد باقي القائمة بالكامل (Memory Leak).",
    summary_md: `## القوائم المترابطة (Linked Lists)

تتكوّن القائمة المترابطة من **عُقد (Nodes)** موزعة في الذاكرة، بحيث تحتوي كل عقدة على البيانات (\`data\`) ومؤشر للعقدة التالية (\`next\`). يتيح ذلك الإدراج والحذف في البداية بزمن $O(1)$ دون إزاحة، لكنه يفقد ميزة الوصول العشوائي فيصبح الوصول للعنصر رقم $k$ بتكلفة $O(k)$.

## المكدس (Stack — LIFO)

المكدس يعمل بمبدأ **آخر من يدخل هو أول من يخرج (Last In, First Out)**. تُستخدم المكدسات في:
1. تتبّع استدعاءات الدوال (**Call Stack**).
2. فحص توازن الأقواس (**Balanced Parentheses**).
3. التراجع والإعادة (**Undo / Redo**) في المحررات.

### مقارنة الأداء

| العملية | Array | Singly Linked List (مع \`head\`) | Stack |
| :--- | :---: | :---: | :---: |
| الإدراج في البداية / \`push\` | $O(n)$ | $O(1)$ | $O(1)$ |
| الحذف من البداية / \`pop\` | $O(n)$ | $O(1)$ | $O(1)$ |
| الوصول بالعنصر رقم $i$ | $O(1)$ | $O(n)$ | غير متاح مباشرة |
| استهلاك الذاكرة الإضافي | $O(1)$ | مؤشر لكل عقدة | $O(1)$ |

### تطبيق فحص الأقواس المتوازنة بلغة Python

\`\`\`python
def is_balanced(expr: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for ch in expr:
        if ch in "([{":
            stack.append(ch)            # Push: O(1)
        elif ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()                 # Pop: O(1)

    return len(stack) == 0

print(is_balanced("{[()()]}"))  # True
print(is_balanced("([)]"))      # False
\`\`\`

التعقيد الزمني للخوارزمية هو $O(n)$ والمكاني $O(n)$ في أسوأ حالة (عندما تكون جميع الأحرف أقواس فتح).`,
    resources: [
      {
        title: "VisuAlgo — Linked List, Stack & Queue",
        url: "https://visualgo.net/en/list",
        type: "tool",
        description: "محاكاة تفاعلية لإدراج وحذف العقد في القوائم المترابطة والمكدس.",
      },
      {
        title: "GeeksforGeeks — Stack Data Structure",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
        type: "article",
        description: "شرح مفصّل لتطبيقات المكدس وتحويل التعبيرات Infix إلى Postfix.",
      },
    ],
    created_at: "2025-09-01T10:30:00Z",
  },

  // ---------- Course 2: Algorithms ----------
  {
    id: LESSON_IDS.ALGO_BIG_O,
    course_id: COURSE_IDS.ALGORITHMS,
    section_title: "الأسبوع الأول: تحليل التعقيد",
    title: "التعقيد الزمني وتحليل Big-O وفرّق تسد",
    title_en: "Asymptotic Analysis & Divide & Conquer",
    order_index: 1,
    is_free_preview: true,
    duration_minutes: 18,
    video_provider: "youtube",
    video_id: "8hly31xKli0",
    chapters: [
      {
        time: "00:00",
        name: "فكرة Divide & Conquer والتحليل التقاربي",
        pct: "30%",
        visual: "Divide → Conquer → Combine",
      },
      {
        time: "07:10",
        name: "تحليل Binary Search خطوة بخطوة",
        pct: "66%",
        visual: "T(n) = T(n/2) + O(1)  ⇒  O(log n)",
      },
      {
        time: "13:05",
        name: "مقارنة Merge Sort و Quick Sort و Master Theorem",
        pct: "94%",
        visual: "Worst Case: Merge O(n log n) vs Quick O(n²)",
      },
    ],
    key_code: `int binarySearch(int arr[], int n, int target) {
  int low = 0, high = n - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    exam_tip:
      "💡 فكرة امتحان: نكتب low + (high - low) / 2 بدل (low + high) / 2 لتجنب حدوث Integer Overflow في الأرقام الكبيرة.",
    summary_md: `## لماذا ندرس التحليل التقاربي (Asymptotic Analysis)؟

قياس سرعة الخوارزمية بالثواني يعتمد على سرعة المعالج ولغة البرمجة. لذلك نستخدم **التحليل التقاربي** لقياس معدل نمو عدد العمليات بالنسبة لحجم المدخلات $n$ عندما $n \\to \\infty$:

$$f(n) = O(g(n)) \\iff \\exists\\, c > 0,\\; n_0 \\ge 0 \\text{ بحيث } 0 \\le f(n) \\le c \\cdot g(n) \\;\\forall\\, n \\ge n_0$$

### ترتيب رتب التعقيد من الأسرع إلى الأبطأ

| الرتبة | الاسم | مثال خوارزمي | أداء عند $n = 10^4$ |
| :---: | :--- | :--- | :---: |
| $O(1)$ | ثابت (Constant) | الوصول لعنصر في مصفوفة | $1$ عملية |
| $O(\\log n)$ | لوغاريتمي (Logarithmic) | Binary Search | $\\approx 14$ عملية |
| $O(n)$ | خطي (Linear) | Linear Search | $10^4$ عملية |
| $O(n \\log n)$ | خطي-لوغاريتمي | Merge Sort / Quick Sort (Avg) | $\\approx 1.3 \\times 10^5$ |
| $O(n^2)$ | تربيعي (Quadratic) | Bubble / Insertion Sort | $10^8$ عملية |
| $O(2^n)$ | أُسي (Exponential) | Fibonacci العودي الساذج | مستحيل عملياً |

### تحليل حلقة متداخلة شهيرة في الامتحانات (C++)

\`\`\`cpp
long long analyze(int n) {
    long long count = 0;
    for (int i = 0; i < n; i++) {          // تتكرر n مرة
        for (int j = 1; j < n; j *= 2) {   // تتضاعف j: تتكرر log2(n) مرة
            count++;
        }
    }
    return count; // الإجمالي: O(n log n)
}
\`\`\`

### نظرية الماستر السريعة (Master Theorem)

لعلاقة التكرار من الشكل:

$$T(n) = a\\,T\\left(\\frac{n}{b}\\right) + f(n)$$

مثلاً في Merge Sort نجد $T(n) = 2T(n/2) + O(n)$ حيث $a=2, b=2, n^{\\log_b a} = n^1$، وبما أن $f(n) = \\Theta(n)$ فإن الناتج هو $T(n) = \\Theta(n \\log n)$.`,
    resources: [
      {
        title: "Big-O Cheat Sheet",
        url: "https://www.bigocheatsheet.com/",
        type: "sheet",
        description: "ورقة مراجعة بصرية لتعقيد أغلب هياكل البيانات وخوارزميات الترتيب.",
      },
      {
        title: "CP-Algorithms — Time Complexity Analysis",
        url: "https://cp-algorithms.com/",
        type: "article",
        description: "مرجع عملي لتحليل الخوارزميات وهياكل البيانات التنافسية.",
      },
      {
        title: "GeeksforGeeks — Asymptotic Notations",
        url: "https://www.geeksforgeeks.org/types-of-asymptotic-notations-in-complexity-analysis-of-algorithms/",
        type: "article",
        description: "الفرق الدقيق بين رموز Big-O و Big-Omega و Big-Theta.",
      },
    ],
    created_at: "2025-09-02T10:10:00Z",
  },
  {
    id: LESSON_IDS.ALGO_SORTING,
    course_id: COURSE_IDS.ALGORITHMS,
    section_title: "الأسبوع الثاني: الترتيب",
    title: "خوارزميات الترتيب الأساسية",
    title_en: "Sorting Algorithms (Bubble, Selection, Insertion)",
    order_index: 2,
    is_free_preview: true,
    duration_minutes: 17,
    video_provider: "youtube",
    video_id: "kPRA0W1kECg",
    chapters: [
      {
        time: "00:00",
        name: "مقارنة Bubble و Selection و Insertion Sort",
        pct: "28%",
        visual: "Best Case Insertion: O(n) · Selection: O(n²)",
      },
      {
        time: "06:45",
        name: "حساب عدد المقارنات في أسوأ حالة",
        pct: "65%",
        visual: "Σ i (1..n-1) = n(n - 1) / 2 = Θ(n²)",
      },
      {
        time: "12:30",
        name: "الاستقرار (Stability) وأقل عدد تبديلات",
        pct: "95%",
        visual: "Selection Sort Swaps ≤ n - 1  |  Insertion is Stable",
      },
    ],
    key_code: `void insertionSort(vector<int>& arr) {
  int n = static_cast<int>(arr.size());
  for (int i = 1; i < n; i++) {
    int key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
    exam_tip:
      "💡 فكرة امتحان: خوارزمية Insertion Sort تحقق O(n) على المصفوفات شبه المرتّبة ومستقرة (Stable)، بينما Selection Sort لا تتجاوز n - 1 تبديلاً.",
    summary_md: `## خوارزميات الترتيب التربيعية $O(n^2)$

رغم وجود خوارزميات أسرع مثل Merge Sort بزمن $O(n \\log n)$، تظل خوارزميات الترتيب الأساسية (**Bubble**, **Selection**, **Insertion**) حجر الأساس لفهم تحليل الخوارزميات، بل إن **Insertion Sort** يُستخدم فعلياً داخل مكتبات الترتيب الهجينة (مثل Timsort في Python) عندما يكون حجم الجزء صغيراً أو شبه مرتّب!

### مقارنة شاملة بين الخوارزميات الثلاث

| الخوارزمية | أفضل حالة | الحالة المتوسطة | أسوأ حالة | المساحة | مستقرة (Stable)؟ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** (مع Early Exit) | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | نعم |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | لا (افتراضياً) |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | نعم |

### عدد المقارنات في أسوأ حالة

في أسوأ حالة (مصفوفة مرتّبة عكسياً)، يساوي عدد المقارنات مجموع المتسلسلة الحسابية:

$$\\sum_{i=1}^{n-1} i = \\frac{n(n - 1)}{2} = \\Theta(n^2)$$

### تطبيق Insertion Sort بلغة C++

\`\`\`cpp
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = static_cast<int>(arr.size());
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // نزيح العناصر الأكبر من key خطوة لليمين
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
\`\`\`

> **جرّب في المختبر التفاعلي بالأسفل:** اختر نمط **"شبه مرتّبة"** وقارن عدد مقارنات **Insertion Sort** مقابل **Selection Sort** لتشاهد فرق $O(n)$ مقابل $O(n^2)$ بعينك!`,
    resources: [
      {
        title: "VisuAlgo — Sorting Visualizer",
        url: "https://visualgo.net/en/sorting",
        type: "tool",
        description: "محاكاة تفاعلية متقدمة لجميع خوارزميات الترتيب.",
      },
      {
        title: "GeeksforGeeks — Insertion Sort",
        url: "https://www.geeksforgeeks.org/insertion-sort-algorithm/",
        type: "article",
        description: "شرح تفصيلي لخوارزمية الإدراج ومتى تتفوق عملياً.",
      },
      {
        title: "NeetCode — Sorting Algorithms Overview",
        url: "https://neetcode.io/courses",
        type: "article",
        description: "ملخص عملي لخوارزميات الترتيب الأساسية والمتقدمة.",
      },
    ],
    created_at: "2025-09-02T10:20:00Z",
  },

  // ---------- Course 3: Operating Systems (Chapters 1, 2, 3 — Full Interactive + Quizzes) ----------
  {
    id: LESSON_IDS.OS_CH1,
    course_id: COURSE_IDS.OPERATING_SYSTEMS,
    section_title: "Chapter 1 · Introduction",
    title: "Chapter 1: Introduction (مقدمة في نظم التشغيل وبنية الحاسب)",
    title_en: "Chapter 1: Introduction",
    order_index: 1,
    is_free_preview: true,
    duration_minutes: 22,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "مكونات الحاسب الأربعة ودور الـ Kernel",
        pct: "30%",
        visual: "Users → Apps → Operating System (Kernel) → Hardware",
      },
      {
        time: "08:00",
        name: "Interrupts و Storage Hierarchy",
        pct: "65%",
        visual: "Registers → Cache → RAM → SSD → Disk",
      },
      {
        time: "15:00",
        name: "Dual-Mode Operation & Timer Protection",
        pct: "95%",
        visual: "User Mode (1) ⇄ Trap/System Call ⇄ Kernel Mode (0)",
      },
    ],
    key_code: OS_SUMMARIES[LESSON_IDS.OS_CH1].key_code,
    exam_tip: `💡 فكرة امتحان: ${OS_SUMMARIES[LESSON_IDS.OS_CH1].exam_tip}`,
    summary_md: OS_SUMMARIES[LESSON_IDS.OS_CH1].summary_md,
    resources: [
      {
        title: "OSTEP — Operating Systems: Three Easy Pieces",
        url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
        type: "article",
        description: "أشهر مرجع مجاني مفتوح المصدر في نظم التشغيل.",
      },
      {
        title: "GeeksforGeeks — Operating Systems Basics",
        url: "https://www.geeksforgeeks.org/operating-systems/",
        type: "article",
        description: "مرجع سريع لمفاهيم الـ Kernel والمقاطعات و Dual-Mode.",
      },
    ],
    created_at: "2025-09-03T10:10:00Z",
  },
  {
    id: LESSON_IDS.OS_CH2,
    course_id: COURSE_IDS.OPERATING_SYSTEMS,
    section_title: "Chapter 2 · Operating System Structures",
    title: "Chapter 2: Operating System Structures (خدمات وهياكل نظم التشغيل)",
    title_en: "Chapter 2: Operating System Structures",
    order_index: 2,
    is_free_preview: true,
    duration_minutes: 20,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "خدمات نظام التشغيل والواجهات (CLI / GUI)",
        pct: "30%",
        visual: "UI (CLI/GUI) → System Calls → OS Services → Hardware",
      },
      {
        time: "07:30",
        name: "System Calls و APIs (POSIX / Win32 / Java)",
        pct: "65%",
        visual: "User App → API → System Call Interface → Kernel",
      },
      {
        time: "14:00",
        name: "هياكل نظام التشغيل (Monolithic, Layered, Microkernel, Hybrid)",
        pct: "95%",
        visual: "Simple | Layered | Microkernel | Modules | Hybrid",
      },
    ],
    key_code: OS_SUMMARIES[LESSON_IDS.OS_CH2].key_code,
    exam_tip: `💡 فكرة امتحان: ${OS_SUMMARIES[LESSON_IDS.OS_CH2].exam_tip}`,
    summary_md: OS_SUMMARIES[LESSON_IDS.OS_CH2].summary_md,
    resources: [
      {
        title: "GeeksforGeeks — Structures of Operating System",
        url: "https://www.geeksforgeeks.org/operating-system-structure/",
        type: "article",
        description: "مقارنة تفصيلية بين Monolithic و Microkernel و Hybrid.",
      },
    ],
    created_at: "2025-09-03T10:20:00Z",
  },
  {
    id: LESSON_IDS.OS_CH3,
    course_id: COURSE_IDS.OPERATING_SYSTEMS,
    section_title: "Chapter 3 · Processes",
    title: "Chapter 3: Processes (العمليات، الجدولة، والتواصل IPC)",
    title_en: "Chapter 3: Processes",
    order_index: 3,
    is_free_preview: true,
    duration_minutes: 23,
    video_provider: "youtube",
    video_id: "EWkQl0n0w5M",
    chapters: [
      {
        time: "00:00",
        name: "مفهوم Process وأقسام الذاكرة والـ PCB",
        pct: "25%",
        visual: "Text | Data | Heap | Stack  +  PCB (PID, State, PC)",
      },
      {
        time: "08:15",
        name: "دورة حياة العملية وجدولة المعالج (FCFS vs SJF)",
        pct: "65%",
        visual: "New → Ready → Running → Waiting → Terminated",
      },
      {
        time: "15:30",
        name: "التواصل بين العمليات (IPC: Shared Memory & Message Passing)",
        pct: "95%",
        visual: "Shared Memory (Fast)  vs  Message Passing (Kernel)",
      },
    ],
    key_code: OS_SUMMARIES[LESSON_IDS.OS_CH3].key_code,
    exam_tip: `💡 فكرة امتحان: ${OS_SUMMARIES[LESSON_IDS.OS_CH3].exam_tip}`,
    summary_md: OS_SUMMARIES[LESSON_IDS.OS_CH3].summary_md,
    resources: [
      {
        title: "GeeksforGeeks — CPU Scheduling in OS",
        url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/",
        type: "article",
        description: "أمثلة محلولة بمخططات Gantt Chart لخوارزميات FCFS و SJF.",
      },
      {
        title: "GeeksforGeeks — Inter Process Communication (IPC)",
        url: "https://www.geeksforgeeks.org/inter-process-communication-ipc/",
        type: "article",
        description: "مقارنة Shared Memory مقابل Message Passing والـ Pipes.",
      },
    ],
    created_at: "2025-09-03T10:30:00Z",
  },

  // ---------- Course 4: Computer Graphics (CS-321 — Chapters 1 to 4 + Bonus Problems + 85 Official Questions) ----------
  {
    id: LESSON_IDS.CG_CH1,
    course_id: COURSE_IDS.COMPUTER_GRAPHICS,
    section_title: "Chapter 1 · Introduction to Computer Graphics",
    title: "Chapter 1: Introduction to Computer Graphics (مقدمة في الرسوميات)",
    title_en: "Chapter 1: Introduction to Computer Graphics",
    order_index: 1,
    is_free_preview: true,
    duration_minutes: 25,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "المجالات الأربعة للرسوميات و CAD و GUI Icons",
        pct: "30%",
        visual: "Display · Design (CAD) · Simulation · User Interfaces",
      },
      {
        time: "09:00",
        name: "الهاردوير، Frame Buffer، Bit Depth وشاشة CRT",
        pct: "65%",
        visual: "Colors = 2^n  |  Full-Color ≥ 24-bit RGB  |  DAC → CRT",
      },
      {
        time: "17:00",
        name: "الضوء، Pinhole Camera، العين البشرية والـ API",
        pct: "95%",
        visual: "350–780 nm  |  Rods (Scotopic) vs Cones (Photopic)",
      },
    ],
    key_code: null,
    exam_tip:
      "💡 فكرة امتحان: Overdetermined يعني قيود زيادة (لا يوجد حل) و Underdetermined يعني حلول كتير؛ الطيف المرئي 350–780 nm؛ والـ Cones مسؤولة عن الألوان (Photopic).",
    summary_md:
      "ملخص شامل لـ Chapter 1: المجالات الأربعة للرسوميات، معمارية الهاردوير والـ Frame Buffer، كاميرا الثقب والعين البشرية، والـ Synthetic-Camera API.",
    resources: [
      {
        title: "OpenGL Official Documentation",
        url: "https://www.opengl.org/",
        type: "article",
        description: "المرجع الرسمي لمفاهيم Synthetic-Camera API والرسوميات ثلاثية الأبعاد.",
      },
    ],
    created_at: "2025-09-06T10:10:00Z",
  },
  {
    id: LESSON_IDS.CG_CH2,
    course_id: COURSE_IDS.COMPUTER_GRAPHICS,
    section_title: "Chapter 2 · Basic Concepts",
    title: "Chapter 2: Basic Concepts (المفاهيم الأساسية والألوان)",
    title_en: "Chapter 2: Basic Concepts of Computer Graphics",
    order_index: 2,
    is_free_preview: true,
    duration_minutes: 25,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "نموذج الصندوق الأسود ومجموعات الدوال السبع",
        pct: "30%",
        visual: "Primitive (What)  vs  Attribute (How)  |  7 API Groups",
      },
      {
        time: "09:00",
        name: "الـ Primitives والمضلعات والتثليث والنصوص",
        pct: "65%",
        visual: "Simple/Convex Polygons · Triangulation · Stroke vs Raster Text",
      },
      {
        time: "17:30",
        name: "إدراك الألوان RGB (Additive) و CMY (Subtractive) و Alpha",
        pct: "95%",
        visual: "2^24 = 16M Colors (1M = 2^20)  |  A=1.0 Opaque · A=0.0 Transparent",
      },
    ],
    key_code: null,
    exam_tip:
      "💡 فكرة امتحان: Primitive = What و Attribute = How؛ Raster Text أسرع بسبب Bit-Block Transfer؛ و Alpha = 1.0 معناه Opaque (مُعتم) وليس شفاف.",
    summary_md:
      "ملخص شامل لـ Chapter 2: نموذج الصندوق الأسود، المجموعات السبع لدوال الـ API، المضلعات والنصوص، ونماذج الألوان RGB و CMY والشفافية.",
    resources: [
      {
        title: "GeeksforGeeks — Computer Graphics Basics",
        url: "https://www.geeksforgeeks.org/computer-graphics-2/",
        type: "article",
        description: "مراجعة سريعة لمفاهيم الـ Primitives ونماذج الألوان RGB و CMY.",
      },
    ],
    created_at: "2025-09-06T10:20:00Z",
  },
  {
    id: LESSON_IDS.CG_CH3,
    course_id: COURSE_IDS.COMPUTER_GRAPHICS,
    section_title: "Chapter 3 · Output Primitives & Bresenham",
    title: "Chapter 3: Output Primitives & Bresenham's Line Algorithm",
    title_en: "Chapter 3: Output Primitives & Bresenham's Line Algorithm",
    order_index: 3,
    is_free_preview: true,
    duration_minutes: 25,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "رسم النقطة والخط والتقريب وظاهرة Jaggies",
        pct: "30%",
        visual: "y = m·x + b  |  Coordinate Rounding → Stair-Step (Jaggies)",
      },
      {
        time: "09:00",
        name: "اشتقاق معامل القرار p_k في خوارزمية Bresenham",
        pct: "65%",
        visual: "p₀ = 2Δy − Δx  |  p_k < 0 → +2Δy  |  p_k ≥ 0 → +2Δy − 2Δx",
      },
      {
        time: "17:00",
        name: "تطبيق مثال المحاضرة (20,10)→(30,18) والحالات الخاصة",
        pct: "95%",
        visual: "Δx=10, Δy=8, p₀=6  ⇒  10 Integer Iterations (k = 0..9)",
      },
    ],
    key_code: null,
    exam_tip:
      "💡 فكرة امتحان: ابدأ دايماً من النقطة اليسرى (الأصغر في x)؛ وعند p_k = 0 نعاملها كحالة p_k ≥ 0 (نزوّد y ونجمع 2Δy − 2Δx).",
    summary_md:
      "ملخص شامل لـ Chapter 3: رسم النقطة والخط، ظاهرة Jaggies، اشتقاق خوارزمية Bresenham بالأعداد الصحيحة، والجدول الكامل لمثال المحاضرة.",
    resources: [
      {
        title: "GeeksforGeeks — Bresenham's Line Generation Algorithm",
        url: "https://www.geeksforgeeks.org/bresenhams-line-generation-algorithm/",
        type: "article",
        description: "شرح إضافي وأمثلة محلولة لخوارزمية Bresenham لرسم الخطوط.",
      },
    ],
    created_at: "2025-09-06T10:30:00Z",
  },
  {
    id: LESSON_IDS.CG_CH4,
    course_id: COURSE_IDS.COMPUTER_GRAPHICS,
    section_title: "Chapter 4 · Midpoint Circle Algorithm",
    title: "Chapter 4: Circle-Generating & Midpoint Algorithm",
    title_en: "Chapter 4: Circle-Generating & Midpoint Algorithm",
    order_index: 4,
    is_free_preview: true,
    duration_minutes: 20,
    video_provider: "youtube",
    video_id: "26QPDBe-NB8",
    chapters: [
      {
        time: "00:00",
        name: "المعادلة الديكارتية (1) والقطبية (2) والتماثل الثماني",
        pct: "30%",
        visual: "Δθ = 1/r  |  8-Way Octant Symmetry (8× Speedup)",
      },
      {
        time: "07:30",
        name: "خوارزمية Midpoint Circle والخطوات الستة",
        pct: "65%",
        visual: "(0, r), p₀ = 1 − r  |  p_(k+1) = p_k + 2x_(k+1) + 1 (− 2y_(k+1))",
      },
      {
        time: "14:00",
        name: "مثال r = 10 والمركز المزاح ومقارنة الخط بالدائرة",
        pct: "95%",
        visual: "r=10 ⇒ (0,10)→(7,7)  |  Stop when x ≥ y  |  Shift (+x_c, +y_c)",
      },
    ],
    key_code: null,
    exam_tip:
      "💡 فكرة امتحان: احسب الدائرة عند (0, 0) الأول واجمع المركز (+x_c, +y_c) في الآخر؛ وعوّض بـ 2x_(k+1) و 2y_(k+1) بتوع النقطة الجديدة!",
    summary_md:
      "ملخص شامل لـ Chapter 4: المعادلة الديكارتية والقطبية، التماثل الثماني 8-Way Symmetry، وخوارزمية Midpoint Circle بالخطوات الستة ومقارنتها بـ Bresenham.",
    resources: [
      {
        title: "GeeksforGeeks — Mid-Point Circle Drawing Algorithm",
        url: "https://www.geeksforgeeks.org/mid-point-circle-drawing-algorithm/",
        type: "article",
        description: "شرح إضافي وأمثلة على خوارزمية Midpoint لرسم الدوائر والتماثل الثماني.",
      },
    ],
    created_at: "2025-09-06T10:40:00Z",
  },
];

// ============================================================================
// Interactive HTML Labs
// ============================================================================
export const MOCK_INTERACTIVES: LessonInteractive[] = [
  {
    id: INTERACTIVE_IDS.BINARY_SEARCH_LAB,
    lesson_id: LESSON_IDS.DS_BINARY_SEARCH,
    title: "مختبر البحث الثنائي التفاعلي (Binary Search Lab)",
    description:
      "تتبّع مؤشرات low و mid و high خطوة بخطوة، وشاهد استبعاد نصف المصفوفة في كل خطوة مقارنةً بالبحث الخطي.",
    order_index: 1,
    source_type: "html_code",
    external_url: null,
    default_height: 690,
    html_content: BINARY_SEARCH_LAB_HTML,
    created_at: "2025-09-01T10:25:00Z",
  },
  {
    id: INTERACTIVE_IDS.SORTING_VISUALIZER_LAB,
    lesson_id: LESSON_IDS.ALGO_SORTING,
    title: "مُحاكي خوارزميات الترتيب (Sorting Visualizer Lab)",
    description:
      "قارن بصرياً بين Bubble Sort و Selection Sort و Insertion Sort مع عدّاد فوري للمقارنات والتبديلات وشارات Big-O.",
    order_index: 1,
    source_type: "html_code",
    external_url: null,
    default_height: 700,
    html_content: SORTING_VISUALIZER_LAB_HTML,
    created_at: "2025-09-02T10:25:00Z",
  },
];

// ============================================================================
// Quiz Questions (16 realistic CS questions across all 7 lessons)
// ============================================================================
export const MOCK_QUESTIONS: Question[] = [
  // --- Lesson 1: Arrays & Memory Layout ---
  {
    id: "44444444-4444-4444-8444-444444444101",
    lesson_id: LESSON_IDS.DS_ARRAYS,
    question_text:
      "إذا بدأت مصفوفة أعداد صحيحة (كل عنصر 4 Bytes) عند العنوان 1000 في الذاكرة، فما عنوان العنصر arr[5]؟",
    code_snippet: "int arr[10]; // Base address = 1000, sizeof(int) = 4",
    code_lang: "cpp",
    options: ["1005", "1020", "1024", "1016"],
    correct_index: 1,
    explanation:
      "لأن الفهرسة تبدأ من 0، فإن عنوان arr[5] يساوي Base + 5 × 4 = 1000 + 20 = 1020 في زمن ثابت O(1).",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444102",
    lesson_id: LESSON_IDS.DS_ARRAYS,
    question_text:
      "ما التعقيد الزمني لعملية إدراج عنصر جديد في بداية مصفوفة ديناميكية (std::vector) تحتوي على n عنصر؟",
    code_snippet: "vec.insert(vec.begin(), 99);",
    code_lang: "cpp",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct_index: 2,
    explanation:
      "الإدراج في بداية المصفوفة يتطلب إزاحة (Shifting) جميع العناصر الـ n الموجودة بمقدار خانة واحدة لليمين، مما يستغرق O(n).",
    order_index: 2,
  },

  // --- Lesson 2: Binary Search ---
  {
    id: "44444444-4444-4444-8444-444444444201",
    lesson_id: LESSON_IDS.DS_BINARY_SEARCH,
    question_text:
      "لماذا نُفضّل كتابة السطر التالي لحساب المنتصف mid بدلاً من (low + high) / 2 في لغات مثل C++ و Java؟",
    code_snippet: "int mid = low + (high - low) / 2;",
    code_lang: "cpp",
    options: [
      "لتقليل التعقيد الزمني من O(log n) إلى O(1)",
      "لتفادي حدوث Integer Overflow عندما تكون قيمتا low و high كبيرتين",
      "لكي يعمل البحث الثنائي على المصفوفات غير المرتّبة",
      "لأن القسمة على 2 لا تعمل مع الأعداد الفردية",
    ],
    correct_index: 1,
    explanation:
      "عندما يقترب كل من low و high من INT_MAX فإن مجموعهما (low + high) يتجاوز سعة int ويسبب Overflow؛ بينما طرح (high - low) آمن تماماً ويعطي نفس النتيجة الرياضية.",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444202",
    lesson_id: LESSON_IDS.DS_BINARY_SEARCH,
    question_text:
      "في أسوأ حالة، ما أقصى عدد من المقارنات يحتاجه البحث الثنائي للبحث داخل مصفوفة مرتّبة حجمها 1024 عنصراً؟",
    code_snippet: null,
    code_lang: null,
    options: ["10 أو 11 مقارنة فقط", "512 مقارنة", "1024 مقارنة", "32 مقارنة"],
    correct_index: 0,
    explanation:
      "بما أن 2^10 = 1024، فإن خوارزمية البحث الثنائي تقسّم المجال للنصف في كل خطوة فتحتاج على الأكثر ⌊log2(1024)⌋ + 1 = 11 مقارنة فقط!",
    order_index: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444203",
    lesson_id: LESSON_IDS.DS_BINARY_SEARCH,
    question_text:
      "ما الخطأ المنطقي في كود البحث الثنائي التالي عند البحث عن عنصر غير موجود؟",
    code_snippet: `int low = 0, high = n - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) low = mid;
    else high = mid;
}`,
    code_lang: "cpp",
    options: [
      "شرط الحلقة يجب أن يكون low < 0",
      "قد يدخل في حلقة لا نهائية (Infinite Loop) لأن low و high لا يتجاوزان mid",
      "استخدام else if يضاعف التعقيد الزمني",
      "الكود صحيح تماماً ولا يوجد به أي خطأ",
    ],
    correct_index: 1,
    explanation:
      "عدم كتابة low = mid + 1 و high = mid - 1 يجعل المؤشرين عالقين عند نفس القيمة عندما يتبقى عنصر واحد أو عنصران، مما يؤدي لحلقة لا نهائية.",
    order_index: 3,
  },

  // --- Lesson 3: Linked Lists & Stacks ---
  {
    id: "44444444-4444-4444-8444-444444444301",
    lesson_id: LESSON_IDS.DS_LINKED_LISTS_STACKS,
    question_text: "ما المخرجات التي سيطبعها كود المكدس (Stack) التالي؟",
    code_snippet: `stack = []
stack.append(10)
stack.append(20)
stack.append(30)
stack.pop()
stack.append(40)
print(stack.pop(), stack[-1])`,
    code_lang: "python",
    options: ["40 20", "30 20", "10 20", "40 30"],
    correct_index: 0,
    explanation:
      "بعد push(10, 20, 30) ثم pop() يُحذف 30 فيتبقى [10, 20]. بعد push(40) يصبح [10, 20, 40]. أول pop يطبع 40، ثم العنصر العلوي stack[-1] هو 20.",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444302",
    lesson_id: LESSON_IDS.DS_LINKED_LISTS_STACKS,
    question_text:
      "أي من العمليات التالية تتم في زمن O(1) في القائمة المترابطة الأحادية (Singly Linked List) بمؤشر head فقط؟",
    code_snippet: null,
    code_lang: null,
    options: [
      "الوصول للعنصر في المنتصف",
      "الإدراج والحذف في بداية القائمة (عند head)",
      "البحث عن قيمة محددة",
      "الحذف من نهاية القائمة",
    ],
    correct_index: 1,
    explanation:
      "تعديل مؤشر head لإضافة أو حذف أول عقدة يتطلب خطوتين ثابتتين فقط O(1)، بينما الوصول للمنتصف أو النهاية يتطلب المرور على العقد O(n).",
    order_index: 2,
  },

  // --- Lesson 4: Big-O Time Complexity ---
  {
    id: "44444444-4444-4444-8444-444444444401",
    lesson_id: LESSON_IDS.ALGO_BIG_O,
    question_text: "ما التعقيد الزمني الدقيق للدالة التالية بدلالة n؟",
    code_snippet: `void mystery(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < n; j *= 2) {
            // O(1) operation
        }
    }
}`,
    code_lang: "cpp",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correct_index: 2,
    explanation:
      "الحلقة الخارجية تدور n مرة، وفي كل دورة تضاعف الحلقة الداخلية المتغير j فيدور log₂(n) مرة؛ إذن الإجمالي n × log₂(n) = O(n log n).",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444402",
    lesson_id: LESSON_IDS.ALGO_BIG_O,
    question_text:
      "عند تبسيط الدالة T(n) = 5n² + 100n log n + 999 باستخدام رمز Big-O، ماذا تكون النتيجة؟",
    code_snippet: null,
    code_lang: null,
    options: ["O(n log n)", "O(5n²)", "O(n²)", "O(n³)"],
    correct_index: 2,
    explanation:
      "في رمز Big-O نحتفظ فقط بالحد الأعلى نمواً (Dominant Term) وهو n² ونهمل الثوابت المضروبة فيه والحدود الأقل درجة.",
    order_index: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444403",
    lesson_id: LESSON_IDS.ALGO_BIG_O,
    question_text:
      "باستخدام Master Theorem، ما حل علاقة التكرار T(n) = 2T(n/2) + O(n)؟",
    code_snippet: null,
    code_lang: null,
    options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(log n)"],
    correct_index: 1,
    explanation:
      "هنا a = 2 و b = 2 وبالتالي n^(log_b a) = n¹ = n، وهو يطابق f(n) = Θ(n) (الحالة الثانية في Master Theorem)، فيكون الحل Θ(n log n).",
    order_index: 3,
  },

  // --- Lesson 5: Basic Sorting Algorithms ---
  {
    id: "44444444-4444-4444-8444-444444444501",
    lesson_id: LESSON_IDS.ALGO_SORTING,
    question_text:
      "أي من خوارزميات الترتيب التالية تحقق تعقيداً زمنياً O(n) في أفضل حالة عندما تكون المصفوفة شبه مرتّبة؟",
    code_snippet: null,
    code_lang: null,
    options: [
      "Selection Sort",
      "Insertion Sort",
      "كلاهما دائماً O(n²)",
      "لا توجد خوارزمية ترتيب تصل إلى O(n)",
    ],
    correct_index: 1,
    explanation:
      "في Insertion Sort يتوقف اللوب الداخلي فوراً إذا كان العنصر أكبر من سابقه، مما يجعلها O(n) على المصفوفات المرتّبة أو شبه المرتّبة، بينما Selection Sort تفحص دائماً كل الجزء المتبقي في O(n²).",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444502",
    lesson_id: LESSON_IDS.ALGO_SORTING,
    question_text:
      "إذا كانت تكلفة الكتابة/التبديل في الذاكرة (Swaps) باهظة جداً، فأي خوارزمية من الثلاث تضمن ألا يتجاوز عدد التبديلات n - 1؟",
    code_snippet: null,
    code_lang: null,
    options: [
      "Bubble Sort",
      "Insertion Sort",
      "Selection Sort",
      "جميعها تقوم بنفس عدد التبديلات O(n²)",
    ],
    correct_index: 2,
    explanation:
      "تقوم Selection Sort بتبديل واحد فقط على الأكثر في نهاية كل دورة خارجية، لذا لا يتجاوز إجمالي تبديلاتها O(n) حتى في أسوأ حالة.",
    order_index: 2,
  },

  // --- Operating Systems (CS-311): Chapters 1, 2, 3 (45 Verified Exam Questions) ---
  ...OS_QUESTIONS,

  // --- Computer Graphics (CS-321): Chapters 1–4 (85 Official Sheet & Midterm Questions) ---
  ...CG_QUESTIONS,
];
