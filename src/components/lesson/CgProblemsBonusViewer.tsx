"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Calculator,
  Circle,
  Compass,
  Info,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export type CgBonusSubTab = "cheatsheet" | "ch3" | "ch4" | "solver";

interface CgProblemsBonusViewerProps {
  defaultTab?: CgBonusSubTab;
}

// ============================================================================
// Pure Mathematical Engines (Bresenham Line & Midpoint Circle)
// ============================================================================

interface LineStep {
  k: number;
  prevX: number;
  prevY: number;
  pk: number;
  isNeg: boolean;
  nextX: number;
  nextY: number;
  nextP: number;
  formulaLabel: string;
  arithmetic: string;
}

interface LineSolution {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  swapped: boolean;
  isSteep: boolean;
  isNegSlope: boolean;
  isVertical: boolean;
  dx: number;
  dy: number;
  mText: string;
  twoDSec: number;
  twoDSecMinusTwoDPrim: number;
  p0: number;
  steps: LineStep[];
  points: Array<{ x: number; y: number }>;
}

function solveBresenhamLine(
  x1In: number,
  y1In: number,
  x2In: number,
  y2In: number
): LineSolution {
  let x1 = Math.round(x1In);
  let y1 = Math.round(y1In);
  let x2 = Math.round(x2In);
  let y2 = Math.round(y2In);
  let swapped = false;

  if (x1 > x2) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
    swapped = true;
  }

  const rawDx = x2 - x1;
  const rawDy = y2 - y1;
  const absDx = Math.abs(rawDx);
  const absDy = Math.abs(rawDy);
  const isVertical = rawDx === 0;
  const isSteep = absDy > absDx;
  const isNegSlope = rawDy < 0;
  const mText = isVertical ? "∞ (Vertical)" : (rawDy / rawDx).toFixed(3);

  const dPrimary = isSteep ? absDy : absDx;
  const dSecondary = isSteep ? absDx : absDy;
  const twoDSec = 2 * dSecondary;
  const twoDSecMinusTwoDPrim = 2 * dSecondary - 2 * dPrimary;
  const p0 = 2 * dSecondary - dPrimary;
  const yStep = isNegSlope ? -1 : 1;

  let xk = x1;
  let yk = y1;
  let pk = p0;

  const steps: LineStep[] = [];
  const points: Array<{ x: number; y: number }> = [{ x: x1, y: y1 }];
  const maxIter = Math.min(dPrimary, 60);

  for (let k = 0; k < maxIter; k++) {
    const isNeg = pk < 0;
    let nextX: number;
    let nextY: number;
    if (!isSteep) {
      nextX = xk + 1;
      nextY = isNeg ? yk : yk + yStep;
    } else {
      nextY = yk + yStep;
      nextX = isNeg ? xk : xk + 1;
    }
    const nextP = isNeg ? pk + twoDSec : pk + twoDSecMinusTwoDPrim;
    const formulaLabel = isNeg
      ? !isSteep
        ? `p${k} + 2Δy`
        : `p${k} + 2Δx`
      : !isSteep
        ? `p${k} + 2Δy − 2Δx`
        : `p${k} + 2Δx − 2Δy`;
    const arithmetic = isNeg
      ? `${pk} + ${twoDSec} = ${nextP}`
      : `${pk} + (${twoDSecMinusTwoDPrim}) = ${nextP}`;

    steps.push({
      k,
      prevX: xk,
      prevY: yk,
      pk,
      isNeg,
      nextX,
      nextY,
      nextP,
      formulaLabel,
      arithmetic,
    });
    points.push({ x: nextX, y: nextY });
    xk = nextX;
    yk = nextY;
    pk = nextP;
  }

  return {
    x1,
    y1,
    x2,
    y2,
    swapped,
    isSteep,
    isNegSlope,
    isVertical,
    dx: absDx,
    dy: absDy,
    mText,
    twoDSec,
    twoDSecMinusTwoDPrim,
    p0,
    steps,
    points,
  };
}

interface CircleStep {
  k: number;
  pk: number;
  isNeg: boolean;
  nextX: number;
  nextY: number;
  twoX: number;
  twoY: number;
  nextP: number;
  arithmetic: string;
}

interface CircleSolution {
  r: number;
  xc: number;
  yc: number;
  useFractionP0: boolean;
  p0: number;
  steps: CircleStep[];
  octantPoints: Array<{ x: number; y: number }>;
}

function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function solveMidpointCircle(
  rIn: number,
  xcIn: number,
  ycIn: number,
  useFractionP0: boolean
): CircleSolution {
  const r = Math.max(1, Math.min(35, Math.round(rIn)));
  const xc = Math.round(xcIn);
  const yc = Math.round(ycIn);
  const p0 = useFractionP0 ? 1.25 - r : 1 - r;

  let x = 0;
  let y = r;
  let pk = p0;

  const steps: CircleStep[] = [];
  const octantPoints: Array<{ x: number; y: number }> = [{ x: 0, y: r }];

  let k = 0;
  while (x < y && k < 50) {
    const isNeg = pk < 0;
    const nextX = x + 1;
    const nextY = isNeg ? y : y - 1;
    const twoX = 2 * nextX;
    const twoY = 2 * nextY;
    const nextP = isNeg ? pk + twoX + 1 : pk + twoX + 1 - twoY;
    const arithmetic = isNeg
      ? `${fmtNum(pk)} + ${twoX} + 1 = ${fmtNum(nextP)}`
      : `${fmtNum(pk)} + ${twoX} + 1 − ${twoY} = ${fmtNum(nextP)}`;

    steps.push({
      k,
      pk,
      isNeg,
      nextX,
      nextY,
      twoX,
      twoY,
      nextP,
      arithmetic,
    });
    octantPoints.push({ x: nextX, y: nextY });
    x = nextX;
    y = nextY;
    pk = nextP;
    k++;
  }

  return { r, xc, yc, useFractionP0, p0, steps, octantPoints };
}

// ============================================================================
// Worked Cases Catalog (All 8 Ch3 Cases + All 8 Ch4 Cases)
// ============================================================================

interface Ch3Case {
  id: number;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  kind: "bresenham" | "rounding" | "proof";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  examTip: string;
}

const CH3_CASES: Ch3Case[] = [
  {
    id: 1,
    shortLabel: "1. مسألة المحاضرة (20,10)→(30,18)",
    badge: "الحالة 1 · مسألة المحاضرة الرسمية",
    title: "Digitize the line with endpoints (20, 10) and (30, 18)",
    subtitle: "الحالة القياسية الأشهر في الامتحان: ميل موجب أقل من 1 (m = 0.8) و p₀ > 0.",
    kind: "bresenham",
    x1: 20,
    y1: 10,
    x2: 30,
    y2: 18,
    examTip:
      "دي أهم مسألة في شابتر 3 وبتيجي بالنص في الميدتيرم والفاينل: Δx = 10, Δy = 8, 2Δy = 16, 2Δy − 2Δx = −4, p₀ = 6، وعدد الخطوات k من 0 لـ 9.",
  },
  {
    id: 2,
    shortLabel: "2. بداية سالبة p₀ < 0",
    badge: "الحالة 2 · p₀ < 0 في البداية",
    title: "Digitize the line from (1, 1) to (8, 3)",
    subtitle: "مثال لما يكون الميل صغير (m = 2/7) فـ p₀ يطلع سالب من أول خطوة و y تثبت.",
    kind: "bresenham",
    x1: 1,
    y1: 1,
    x2: 8,
    y2: 3,
    examTip:
      "لما p_k < 0: بنختار (x_k + 1, y_k) يعني y بتثبت، وبنجمع 2Δy فقط على p_k.",
  },
  {
    id: 3,
    shortLabel: "3. حالة التساوي p_k = 0",
    badge: "الحالة 3 · فخ الصفر (p_k = 0)",
    title: "Digitize the line from (2, 2) to (10, 6)",
    subtitle: "لما p_k يساوي صفر بالظبط (p_k = 0) نتعامل معاه إزاي؟",
    kind: "bresenham",
    x1: 2,
    y1: 2,
    x2: 10,
    y2: 6,
    examTip:
      "فخ امتحان شهير جداً: شرط الثبات هو p_k < 0 فقط! أما الصفر (p_k = 0) فبيتبع قاعدة p_k ≥ 0 يعني نزوّد y ونجمع (2Δy − 2Δx).",
  },
  {
    id: 4,
    shortLabel: "4. نقطتين معكوستين (15,10)→(9,6)",
    badge: "الحالة 4 · ترتيب النقطتين",
    title: "Digitize the line with endpoints (15, 10) and (9, 6)",
    subtitle: "الدكتور بيدّيك النقطة اللي على اليمين الأول عشان يختبر الخطوة الأولى في الخوارزمية.",
    kind: "bresenham",
    x1: 15,
    y1: 10,
    x2: 9,
    y2: 6,
    examTip:
      "أول قاعدة في خوارزمية Bresenham: نبدأ دائماً من النقطة اليسرى (الأصغر في x). يعني نبدّل النقطتين ونبدأ من (9, 6) لحد (15, 10).",
  },
  {
    id: 5,
    shortLabel: "5. ميل حاد m > 1",
    badge: "الحالة 5 · ميل أكبر من 1 (m > 1)",
    title: "Digitize the steep line from (2, 1) to (5, 7)",
    subtitle: "هنا Δy = 6 > Δx = 3 (الميل m = 2 > 1)، فبنبدّل دور x و y في الحسابات.",
    kind: "bresenham",
    x1: 2,
    y1: 1,
    x2: 5,
    y2: 7,
    examTip:
      "لما |m| > 1: بنمشي خطوة ثابتة في y (y_{k+1} = y_k + 1) ونختار x_k أو x_k + 1، ويصبح p₀ = 2Δx − Δy، والزيادات 2Δx و (2Δx − 2Δy).",
  },
  {
    id: 6,
    shortLabel: "6. ميل سالب m < 0",
    badge: "الحالة 6 · ميل سالب (−1 < m < 0)",
    title: "Digitize the line with negative slope from (1, 8) to (7, 5)",
    subtitle: "الخط نازل لتحت: x بتزيد +1 كل خطوة، و y يا إما تثبت أو تقل −1.",
    kind: "bresenham",
    x1: 1,
    y1: 8,
    x2: 7,
    y2: 5,
    examTip:
      "مع الميل السالب ناخد |Δy| بالموجب في حساب الثوابت p₀, 2|Δy|, 2|Δy|−2Δx، والفرق الوحيد إنه عند p_k ≥ 0 بننقص y بمقدار 1 (y_k − 1).",
  },
  {
    id: 7,
    shortLabel: "7. معادلة الخط والتقريب",
    badge: "الحالة 7 · y = mx + b & Rounding",
    title: "Cartesian Line Equation (y = m·x + b) & Pixel Rounding",
    subtitle: "مسائل سريعة على حساب الميل m والـ y-intercept b وتقريب الإحداثيات العشرية للشبكة.",
    kind: "rounding",
    examTip:
      "لو جالك إحداثي عشري زي (10.48, 20.51) قربه لأقرب Integer باستخدام round(): 10.48 → 10 و 20.51 → 21.",
  },
  {
    id: 8,
    shortLabel: "8. إثبات قوانين Bresenham",
    badge: "الحالة 8 · سؤال الإثبات المقالي",
    title: "Derive Bresenham's Decision Parameter p_k and p_(k+1)",
    subtitle: "خطوات الإثبات الرياضي الكاملة اللي بتكتبها في ورقة الامتحان من d₁ و d₂ لحد p_(k+1).",
    kind: "proof",
    examTip:
      "مفتاح الإثبات كله في 3 أسطر: احسب d₁ − d₂، اضرب في Δx عشان تتخلص من الكسر فتطلع p_k، وبعدين اطرح p_(k+1) − p_k عشان الثابت c يطير!",
  },
];

interface Ch4Case {
  id: number;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  kind: "circle" | "symmetry" | "cartesian_polar" | "mcq_speed" | "algorithm";
  r?: number;
  xc?: number;
  yc?: number;
  useFractionP0?: boolean;
  examTip: string;
}

const CH4_CASES: Ch4Case[] = [
  {
    id: 1,
    shortLabel: "1. مسألة المحاضرة والميدتيرم r = 10",
    badge: "الحالة 1 · مسألة المحاضرة وميدتيرم 2025",
    title: "Midpoint Circle-Drawing for r = 10 centered at (0, 0)",
    subtitle: "المسألة الرسمية في السلايدات والميدتيرم: البداية (0, 10)، p₀ = 1 − 10 = −9، حتى x ≥ y.",
    kind: "circle",
    r: 10,
    xc: 0,
    yc: 0,
    useFractionP0: false,
    examTip:
      "حفظ سريع للتأكد من حلك في الامتحان: r = 10 بيقف عند النقطة (7, 7) بعد 7 خطوات (k = 0..6)، وأول 3 نقاط بعد (0,10) هم (1,10), (2,10), (3,10) لأن p₀ = −9 سالب!",
  },
  {
    id: 2,
    shortLabel: "2. مركز مزاح r = 6 عند (20,30)",
    badge: "الحالة 2 · مركز غير نقطة الأصل (x_c, y_c)",
    title: "Midpoint Circle for r = 6 centered at (xc, yc) = (20, 30)",
    subtitle: "القاعدة الذهبية: احسب الدائرة كأنها عند (0, 0) الأول، وبعدين اجمع (20, 30) على كل نقطة!",
    kind: "circle",
    r: 6,
    xc: 20,
    yc: 30,
    useFractionP0: false,
    examTip:
      "إياك تعوّض بالمركز (20, 30) جوا معادلة p_k! احسب الجدول كله عند (0, 0) من (0, 6)، وفي العمود الأخير اجمع x_final = x + 20 و y_final = y + 30.",
  },
  {
    id: 3,
    shortLabel: "3. مسألة الميدتيرم r = 8",
    badge: "الحالة 3 · مسألة ميدتيرم 2024",
    title: "Midpoint Circle Algorithm for r = 8 centered at (0, 0)",
    subtitle: "تدريب مهم على شرط التوقف (x ≥ y): آخر خطوة بتقف عند x = 6, y = 5.",
    kind: "circle",
    r: 8,
    xc: 0,
    yc: 0,
    useFractionP0: false,
    examTip:
      "لاحظ إنه مش لازم x تساوي y بالظبط عشان نقف! أول ما تلاقي x ≥ y (زي (6, 5) هنا) تقف فوراً وتكمل باقي الدائرة بالتناظر الثماني.",
  },
  {
    id: 4,
    shortLabel: "4. القانون الكسري r = 5 (5/4 − r)",
    badge: "الحالة 4 · مسألة ميدتيرم 2025 بالقانون الكسري",
    title: "Midpoint Circle for r = 5 using Exact p₀ = 5/4 − r = −3.75",
    subtitle: "نفس النقاط بالظبط هتطلع سواء استخدمت p₀ = 1 − r (لـ r صحيح) أو p₀ = 5/4 − r (لو r كسر أو مطلوب بالنص).",
    kind: "circle",
    r: 5,
    xc: 0,
    yc: 0,
    useFractionP0: true,
    examTip:
      "لما يكون r عدد صحيح، بنقرب 5/4 − r إلى 1 − r عشان نشتغل بأعداد صحيحة بس، والنتيجة (النقاط المرسومة) متطابقة 100%!",
  },
  {
    id: 5,
    shortLabel: "5. التماثل الثماني 8-Way Symmetry",
    badge: "الحالة 5 · استنتاج الـ 8 نقاط",
    title: "8-Way Symmetry Points & Shifted Center Mapping",
    subtitle: "إزاي تطلّع الـ 8 نقاط من نقطة واحدة (x, y) وامتى يكونوا 4 نقاط بس!",
    kind: "symmetry",
    examTip:
      "تريكة امتحان: أي نقطة عامة (x, y) بتولّد 8 نقاط، لكن لو x = 0 أو y = 0 أو x = y (على المحاور أو القطر) بتولّد 4 نقاط مميزة فقط!",
  },
  {
    id: 6,
    shortLabel: "6. المعادلة الديكارتية والقطبية 1/r",
    badge: "الحالة 6 · Cartesian Eq (1) & Polar Eq (2)",
    title: "Cartesian Equation, Polar Parametric Form & Step Size Δθ = 1/r",
    subtitle: "مقارنة سريعة + مسائل حساب حجم الخطوة الزاوية وعيوب الجذر التربيعي.",
    kind: "cartesian_polar",
    examTip:
      "عيب المعادلة الديكارتية حاجتين: (1) حسابات الجذر التربيعي التقيلة، (2) تباعد غير منتظم (Unequal Spacing) بين النقاط لما الميل يقرب من الرأسي.",
  },
  {
    id: 7,
    shortLabel: "7. قواعد الـ MCQ في 15 ثانية",
    badge: "الحالة 7 · حل سريع للـ MCQ",
    title: "15-Second MCQ Decision Rules for Midpoint Circle",
    subtitle: "القوانين الجاهزة اللي تحل بيها أي سؤال اختياري في شابتر 4 بدون ما تعمل الجدول كله.",
    kind: "mcq_speed",
    examTip:
      "في الـ MCQ ركز على إشارة p_k وافتكر إن 2x_{k+1} و 2y_{k+1} بتوع النقطة الجديدة (بعد التحديث) مش القديمة!",
  },
  {
    id: 8,
    shortLabel: "8. خطوات الخوارزمية الستة",
    badge: "الحالة 8 · نص الخوارزمية للامتحان",
    title: "Complete 6-Step Midpoint Circle Algorithm",
    subtitle: "الصيغة المنظمة المعتمدة من السلايدات لو السؤال طلب Write the Midpoint Circle Algorithm.",
    kind: "algorithm",
    examTip:
      "الخوارزمية 6 خطوات بالترتيب: (1) إدخال r,(xc,yc) وبدء (0,r) — (2) p₀ = 5/4 − r أو 1 − r — (3) اختبار p_k — (4) التناظر الثماني — (5) إزاحة المركز — (6) التكرار حتى x ≥ y.",
  },
];

// ============================================================================
// Clean Portal-Themed Mini Pixel Grid Plotters (SVG)
// ============================================================================

function LinePixelPlot({ sol }: { sol: LineSolution }) {
  const xs = sol.points.map((p) => p.x);
  const ys = sol.points.map((p) => p.y);
  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = Math.min(...ys) - 1;
  const maxY = Math.max(...ys) + 1;
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const W = 420;
  const H = 220;
  const pad = 28;
  const mapX = (x: number) => pad + ((x - minX) / spanX) * (W - pad * 2);
  const mapY = (y: number) => H - pad - ((y - minY) / spanY) * (H - pad * 2);

  return (
    <div
      dir="ltr"
      className="rounded-xl border p-3"
      style={{
        background: "var(--bg-canvas)",
        borderColor: "var(--border-soft)",
      }}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)]">
        <span className="font-mono-code">
          Raster Plot: ({sol.x1}, {sol.y1}) → ({sol.x2}, {sol.y2})
        </span>
        <span className="font-mono-code">{sol.points.length} pixels</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-h-[220px]">
        {/* Ideal mathematical line */}
        <line
          x1={mapX(sol.x1)}
          y1={mapY(sol.y1)}
          x2={mapX(sol.x2)}
          y2={mapY(sol.y2)}
          stroke="var(--accent-warm)"
          strokeWidth="1.6"
          strokeDasharray="5 4"
          opacity="0.7"
        />
        {/* Plotted integer pixels */}
        {sol.points.map((pt, idx) => {
          const cx = mapX(pt.x);
          const cy = mapY(pt.y);
          const isEnd = idx === 0 || idx === sol.points.length - 1;
          return (
            <g key={`${pt.x}-${pt.y}-${idx}`}>
              <rect
                x={cx - 6}
                y={cy - 6}
                width="12"
                height="12"
                rx="3"
                fill={isEnd ? "var(--accent-warm)" : "var(--brand-primary)"}
                opacity={isEnd ? 0.95 : 0.82}
              />
              {sol.points.length <= 14 ? (
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="var(--text-secondary)"
                >
                  ({pt.x},{pt.y})
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CirclePixelPlot({ sol }: { sol: CircleSolution }) {
  const maxVal = sol.r + 2;
  const W = 260;
  const H = 260;
  const pad = 26;
  const mapX = (x: number) => pad + (x / maxVal) * (W - pad * 2);
  const mapY = (y: number) => H - pad - (y / maxVal) * (H - pad * 2);

  // Full first quadrant points by reflecting (x, y) -> (y, x)
  const mirrored = sol.octantPoints.map((p) => ({ x: p.y, y: p.x }));

  return (
    <div
      dir="ltr"
      className="rounded-xl border p-3"
      style={{
        background: "var(--bg-canvas)",
        borderColor: "var(--border-soft)",
      }}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)]">
        <span className="font-mono-code">First Quadrant (r = {sol.r})</span>
        <span className="font-mono-code">
          {sol.octantPoints.length} octant pts
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[240px]">
        {/* Axes */}
        <line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke="var(--border-strong)"
          strokeWidth="1.2"
        />
        <line
          x1={pad}
          y1={H - pad}
          x2={pad}
          y2={pad}
          stroke="var(--border-strong)"
          strokeWidth="1.2"
        />
        {/* y = x symmetry diagonal */}
        <line
          x1={mapX(0)}
          y1={mapY(0)}
          x2={mapX(sol.r)}
          y2={mapY(sol.r)}
          stroke="var(--accent-warm)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          opacity="0.65"
        />
        {/* Ideal quarter arc */}
        <path
          d={`M ${mapX(0)} ${mapY(sol.r)} A ${((sol.r / maxVal) * (W - pad * 2)).toFixed(1)} ${((sol.r / maxVal) * (H - pad * 2)).toFixed(1)} 0 0 1 ${mapX(sol.r)} ${mapY(0)}`}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1.4"
          strokeDasharray="3 3"
        />
        {/* Reflected Octant 2 (lighter mint) */}
        {mirrored.map((pt, i) => (
          <circle
            key={`m-${i}`}
            cx={mapX(pt.x)}
            cy={mapY(pt.y)}
            r="4.5"
            fill="var(--success-fg)"
            opacity="0.48"
          />
        ))}
        {/* Computed Octant 1 (primary navy/blue) */}
        {sol.octantPoints.map((pt, i) => (
          <g key={`o-${i}`}>
            <circle
              cx={mapX(pt.x)}
              cy={mapY(pt.y)}
              r="5.5"
              fill={i === 0 ? "var(--accent-warm)" : "var(--brand-primary)"}
            />
            {sol.octantPoints.length <= 10 ? (
              <text
                x={mapX(pt.x) + 7}
                y={mapY(pt.y) - 5}
                fontSize="8.5"
                fontWeight="700"
                fill="var(--text-secondary)"
              >
                ({pt.x},{pt.y})
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <div className="mt-1.5 flex items-center justify-center gap-4 text-[10.5px] font-semibold text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
          Octant 1 (computed)
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="h-2.5 w-2.5 rounded-full opacity-60"
            style={{ background: "var(--success-fg)" }}
          />
          Octant 2 (y, x)
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Reusable Walkthrough Renderers
// ============================================================================

function LineWalkthroughCard({
  sol,
  badge,
  title,
  subtitle,
  examTip,
}: {
  sol: LineSolution;
  badge?: string;
  title: string;
  subtitle?: string;
  examTip?: string;
}) {
  return (
    <div
      className="space-y-4 rounded-2xl border p-4 sm:p-5"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-soft)",
      }}
    >
      {/* Header */}
      <div className="space-y-1">
        {badge ? (
          <span
            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              background:
                "color-mix(in srgb, var(--brand-soft) 75%, transparent)",
              color: "var(--brand-soft-text)",
            }}
          >
            {badge}
          </span>
        ) : null}
        <h4
          dir="ltr"
          className="font-en text-left text-[15px] font-black text-[var(--text-primary)] sm:text-[16px]"
        >
          {title}
        </h4>
        {subtitle ? (
          <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Special Case Banner */}
      {sol.swapped || sol.isSteep || sol.isNegSlope ? (
        <div
          className="rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold leading-relaxed"
          style={{
            background:
              "color-mix(in srgb, var(--accent-warm-soft) 55%, var(--bg-canvas))",
            borderColor:
              "color-mix(in srgb, var(--accent-warm) 25%, transparent)",
            color: "var(--text-primary)",
          }}
        >
          {sol.swapped ? (
            <p>
              ⚠️ <strong>تم تبديل النقطتين تلقائياً:</strong> بدأنا من النقطة اليسرى
              الأصغر في <span className="en-term">x</span> لتصبح البداية{" "}
              <span className="math-pill">
                ({sol.x1}, {sol.y1})
              </span>{" "}
              والنهاية{" "}
              <span className="math-pill">
                ({sol.x2}, {sol.y2})
              </span>
              .
            </p>
          ) : null}
          {sol.isSteep ? (
            <p>
              ⚠️ <strong>ميل حاد (|m| &gt; 1):</strong> لأن{" "}
              <span className="math-pill">Δy = {sol.dy} &gt; Δx = {sol.dx}</span>،
              نثبت الخطوة على <span className="en-term">y</span> ونبدّل دور{" "}
              <span className="en-term">Δx, Δy</span> في معادلات{" "}
              <span className="math-pill">p₀ = 2Δx − Δy</span>.
            </p>
          ) : null}
          {sol.isNegSlope ? (
            <p>
              ⚠️ <strong>ميل سالب (m &lt; 0):</strong> نستخدم{" "}
              <span className="math-pill">|Δy| = {sol.dy}</span> في الثوابت، وعند{" "}
              <span className="math-pill">p_k ≥ 0</span> ننقص{" "}
              <span className="en-term">y</span> بمقدار <span className="math-pill">−1</span>.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Constants + Visual Plot Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div
          dir="ltr"
          className="grid grid-cols-2 gap-2.5 rounded-xl border p-3.5 text-left sm:grid-cols-3 lg:col-span-7"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
            <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
              Δx &amp; |Δy|
            </div>
            <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--text-primary)]">
              Δx = {sol.dx}, Δy = {sol.dy}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
            <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
              Slope (m)
            </div>
            <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--text-primary)]">
              m = {sol.mText}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
            <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
              Start Point (x₀, y₀)
            </div>
            <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--text-primary)]">
              ({sol.x1}, {sol.y1})
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
            <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
              {sol.isSteep ? "2Δx (if p_k < 0)" : "2Δy (if p_k < 0)"}
            </div>
            <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--brand-soft-text)]">
              +{sol.twoDSec}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
            <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
              {sol.isSteep ? "2Δx − 2Δy (p_k ≥ 0)" : "2Δy − 2Δx (p_k ≥ 0)"}
            </div>
            <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--accent-warm-text)]">
              {sol.twoDSecMinusTwoDPrim}
            </div>
          </div>
          <div
            className="rounded-lg border p-2.5"
            style={{
              background:
                "color-mix(in srgb, var(--success-soft) 55%, var(--bg-surface))",
              borderColor:
                "color-mix(in srgb, var(--success-fg) 25%, transparent)",
            }}
          >
            <div className="text-[10.5px] font-bold text-[var(--success-fg)]">
              Initial p₀ = {sol.isSteep ? "2Δx − Δy" : "2Δy − Δx"}
            </div>
            <div className="font-mono-code mt-0.5 text-[14px] font-black text-[var(--success-fg)]">
              p₀ = {sol.p0}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <LinePixelPlot sol={sol} />
        </div>
      </div>

      {/* Exam Iteration Table */}
      <div
        dir="ltr"
        className="overflow-x-auto rounded-xl border"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <table className="clean-table w-full text-left">
          <thead>
            <tr>
              <th className="ltr">k</th>
              <th className="ltr">p_k</th>
              <th className="ltr">Sign / Rule</th>
              <th className="ltr">Next Pixel (x_{"{k+1}"}, y_{"{k+1}"})</th>
              <th className="ltr">p_{"{k+1}"} Calculation</th>
            </tr>
          </thead>
          <tbody>
            {sol.steps.map((st) => (
              <tr key={st.k}>
                <td className="ltr font-mono-code font-bold">{st.k}</td>
                <td className="ltr font-mono-code font-extrabold text-[var(--text-primary)]">
                  {st.pk}
                </td>
                <td className="ltr">
                  <span
                    className="inline-block rounded-md px-2 py-0.5 font-mono-code text-[11px] font-bold"
                    style={
                      st.isNeg
                        ? {
                            background:
                              "color-mix(in srgb, var(--brand-soft) 70%, transparent)",
                            color: "var(--brand-soft-text)",
                          }
                        : {
                            background:
                              "color-mix(in srgb, var(--success-soft) 70%, transparent)",
                            color: "var(--success-fg)",
                          }
                    }
                  >
                    {st.isNeg ? "p_k < 0 (stay)" : "p_k ≥ 0 (step)"}
                  </span>
                </td>
                <td className="ltr font-mono-code font-black text-[var(--text-primary)]">
                  ({st.nextX}, {st.nextY})
                </td>
                <td className="ltr font-mono-code text-[12px]">
                  <span className="opacity-70">{st.formulaLabel} = </span>
                  <strong className="text-[var(--text-primary)]">
                    {st.arithmetic}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {examTip ? (
        <div
          className="rounded-xl border px-4 py-3 text-[12.5px] leading-relaxed"
          style={{
            background:
              "color-mix(in srgb, var(--success-soft) 40%, var(--bg-canvas))",
            borderColor:
              "color-mix(in srgb, var(--success-fg) 20%, transparent)",
            color: "var(--text-primary)",
          }}
        >
          <strong className="text-[var(--success-fg)]">🎯 نصيحة الامتحان:</strong>{" "}
          {examTip}
        </div>
      ) : null}
    </div>
  );
}

function CircleWalkthroughCard({
  sol,
  badge,
  title,
  subtitle,
  examTip,
}: {
  sol: CircleSolution;
  badge?: string;
  title: string;
  subtitle?: string;
  examTip?: string;
}) {
  const isShifted = sol.xc !== 0 || sol.yc !== 0;

  return (
    <div
      className="space-y-4 rounded-2xl border p-4 sm:p-5"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-soft)",
      }}
    >
      <div className="space-y-1">
        {badge ? (
          <span
            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold"
            style={{
              background:
                "color-mix(in srgb, var(--brand-soft) 75%, transparent)",
              color: "var(--brand-soft-text)",
            }}
          >
            {badge}
          </span>
        ) : null}
        <h4
          dir="ltr"
          className="font-en text-left text-[15px] font-black text-[var(--text-primary)] sm:text-[16px]"
        >
          {title}
        </h4>
        {subtitle ? (
          <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Constants + Visual Plot */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          <div
            dir="ltr"
            className="grid grid-cols-2 gap-2.5 rounded-xl border p-3.5 text-left"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
              <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
                Radius &amp; Center
              </div>
              <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--text-primary)]">
                r = {sol.r}, C = ({sol.xc}, {sol.yc})
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
              <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
                First Point (x₀, y₀)
              </div>
              <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--text-primary)]">
                (0, {sol.r})
                {isShifted ? ` → (${sol.xc}, ${sol.r + sol.yc})` : ""}
              </div>
            </div>
            <div
              className="rounded-lg border p-2.5"
              style={{
                background:
                  "color-mix(in srgb, var(--success-soft) 55%, var(--bg-surface))",
                borderColor:
                  "color-mix(in srgb, var(--success-fg) 25%, transparent)",
              }}
            >
              <div className="text-[10.5px] font-bold text-[var(--success-fg)]">
                Initial p₀ = {sol.useFractionP0 ? "5/4 − r" : "1 − r"}
              </div>
              <div className="font-mono-code mt-0.5 text-[14px] font-black text-[var(--success-fg)]">
                p₀ = {fmtNum(sol.p0)}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-2.5">
              <div className="text-[10.5px] font-bold text-[var(--text-muted)]">
                Stopping Condition
              </div>
              <div className="font-mono-code mt-0.5 text-[13px] font-black text-[var(--accent-warm-text)]">
                Stop when x ≥ y ({sol.steps.length} steps)
              </div>
            </div>
          </div>

          <div
            dir="ltr"
            className="rounded-xl border px-3.5 py-2.5 font-mono-code text-[11.5px] leading-relaxed text-[var(--text-secondary)]"
            style={{
              background: "var(--bg-canvas)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div>
              <strong className="text-[var(--brand-soft-text)]">
                If p_k &lt; 0:
              </strong>{" "}
              next = (x_k + 1, y_k) &nbsp;|&nbsp; p_(k+1) = p_k + 2x_(k+1) + 1
            </div>
            <div>
              <strong className="text-[var(--success-fg)]">If p_k ≥ 0:</strong>{" "}
              next = (x_k + 1, y_k − 1) &nbsp;|&nbsp; p_(k+1) = p_k + 2x_(k+1) +
              1 − 2y_(k+1)
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <CirclePixelPlot sol={sol} />
        </div>
      </div>

      {/* Exam Iteration Table */}
      <div
        dir="ltr"
        className="overflow-x-auto rounded-xl border"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <table className="clean-table w-full text-left">
          <thead>
            <tr>
              <th className="ltr">k</th>
              <th className="ltr">p_k</th>
              <th className="ltr">(x_{"{k+1}"}, y_{"{k+1}"})</th>
              {isShifted ? <th className="ltr">Shifted (+xc,+yc)</th> : null}
              <th className="ltr">2x_{"{k+1}"}</th>
              <th className="ltr">2y_{"{k+1}"}</th>
              <th className="ltr">p_{"{k+1}"} Calculation</th>
            </tr>
          </thead>
          <tbody>
            {sol.steps.map((st) => (
              <tr key={st.k}>
                <td className="ltr font-mono-code font-bold">{st.k}</td>
                <td className="ltr font-mono-code font-extrabold text-[var(--text-primary)]">
                  {fmtNum(st.pk)}
                </td>
                <td className="ltr font-mono-code font-black text-[var(--text-primary)]">
                  ({st.nextX}, {st.nextY})
                </td>
                {isShifted ? (
                  <td className="ltr font-mono-code font-bold text-[var(--accent-warm-text)]">
                    ({st.nextX + sol.xc}, {st.nextY + sol.yc})
                  </td>
                ) : null}
                <td className="ltr font-mono-code">{st.twoX}</td>
                <td className="ltr font-mono-code">{st.twoY}</td>
                <td className="ltr font-mono-code text-[12px]">
                  <strong className="text-[var(--text-primary)]">
                    {st.arithmetic}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {examTip ? (
        <div
          className="rounded-xl border px-4 py-3 text-[12.5px] leading-relaxed"
          style={{
            background:
              "color-mix(in srgb, var(--success-soft) 40%, var(--bg-canvas))",
            borderColor:
              "color-mix(in srgb, var(--success-fg) 20%, transparent)",
            color: "var(--text-primary)",
          }}
        >
          <strong className="text-[var(--success-fg)]">🎯 نصيحة الامتحان:</strong>{" "}
          {examTip}
        </div>
      ) : null}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CgProblemsBonusViewer({
  defaultTab = "cheatsheet",
}: CgProblemsBonusViewerProps) {
  const [subTab, setSubTab] = useState<CgBonusSubTab>(defaultTab);
  const [selectedCh3Id, setSelectedCh3Id] = useState<number>(1);
  const [selectedCh4Id, setSelectedCh4Id] = useState<number>(1);

  // Live Custom Solver State
  const [solverMode, setSolverMode] = useState<"line" | "circle">("line");
  const [lx1, setLx1] = useState(20);
  const [ly1, setLy1] = useState(10);
  const [lx2, setLx2] = useState(30);
  const [ly2, setLy2] = useState(18);
  const [cr, setCr] = useState(10);
  const [cxc, setCxc] = useState(0);
  const [cyc, setCyc] = useState(0);
  const [cFrac, setCFrac] = useState(false);

  const activeCh3 =
    CH3_CASES.find((c) => c.id === selectedCh3Id) ?? CH3_CASES[0];
  const activeCh4 =
    CH4_CASES.find((c) => c.id === selectedCh4Id) ?? CH4_CASES[0];

  const activeCh3Sol = useMemo(() => {
    if (activeCh3.kind !== "bresenham") return null;
    return solveBresenhamLine(
      activeCh3.x1 ?? 0,
      activeCh3.y1 ?? 0,
      activeCh3.x2 ?? 10,
      activeCh3.y2 ?? 8
    );
  }, [activeCh3]);

  const activeCh4Sol = useMemo(() => {
    if (activeCh4.kind !== "circle") return null;
    return solveMidpointCircle(
      activeCh4.r ?? 10,
      activeCh4.xc ?? 0,
      activeCh4.yc ?? 0,
      Boolean(activeCh4.useFractionP0)
    );
  }, [activeCh4]);

  const customLineSol = useMemo(
    () => solveBresenhamLine(lx1, ly1, lx2, ly2),
    [lx1, ly1, lx2, ly2]
  );

  const customCircleSol = useMemo(
    () => solveMidpointCircle(cr, cxc, cyc, cFrac),
    [cr, cxc, cyc, cFrac]
  );

  return (
    <div className="space-y-4">
      {/* Calm Bonus Header */}
      <div
        className="rounded-2xl border p-4 sm:p-5"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background:
                    "color-mix(in srgb, var(--accent-warm-soft) 75%, transparent)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Sparkles className="h-3 w-3" />
                <span>بونص إضافي · مسائل شابتر 3 و 4</span>
              </span>
              <span className="font-mono-code text-[11px] font-semibold text-[var(--text-muted)]">
                Bresenham Line + Midpoint Circle
              </span>
            </div>
            <h3 className="text-[16px] font-black text-[var(--text-primary)] sm:text-[18px]">
              الخلاصة الشاملة في مسائل شابتر 3 و 4 (خطوة بخطوة + حاسبة تفاعلية)
            </h3>
            <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              كل أفكار مسائل الميدتيرم والفاينل محلولة بالجدول والرسم، مع حاسبة
              بتحل أي مسألة تكتبها بالخطوات الكاملة.
            </p>
          </div>
        </div>

        {/* 4 Sub-Tab Pills */}
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-3.5" style={{ borderColor: "var(--border-soft)" }}>
          {(
            [
              { id: "cheatsheet", label: "خلاصة القوانين", icon: BookOpen },
              { id: "ch3", label: "مسائل شابتر 3 (8 حالات)", icon: TrendingUp },
              { id: "ch4", label: "مسائل شابتر 4 (8 حالات)", icon: Circle },
              { id: "solver", label: "حاسبة تحل أي مسألة", icon: Calculator },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12px] font-bold transition-all cursor-pointer"
                style={
                  active
                    ? {
                        background: "var(--hero-bg)",
                        borderColor: "var(--hero-bg)",
                        color: "#ffffff",
                      }
                    : {
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SUB-TAB 1: CHEAT SHEET ================= */}
      {subTab === "cheatsheet" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Ch3 Card */}
            <div
              className="space-y-3 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[14.5px] font-black text-[var(--text-primary)]">
                  📐 Chapter 3 · Bresenham&apos;s Line (0 &lt; m &lt; 1)
                </h4>
                <span className="font-mono-code rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--brand-soft-text)]">
                  Integer Only
                </span>
              </div>
              <div
                dir="ltr"
                className="space-y-2 rounded-xl border p-3.5 font-mono-code text-[12px] leading-relaxed text-[var(--text-primary)]"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div>1. Start at left endpoint (x₀, y₀) where x₀ &lt; x_end</div>
                <div>2. Δx = x_end − x₀ , &nbsp; Δy = y_end − y₀</div>
                <div>3. Constants: 2Δy , &nbsp; 2Δy − 2Δx</div>
                <div className="font-black text-[var(--brand-soft-text)]">
                  4. Initial: p₀ = 2Δy − Δx
                </div>
                <div className="border-t pt-2" style={{ borderColor: "var(--border-soft)" }}>
                  • If <strong>p_k &lt; 0</strong>: plot (x_k + 1, y_k), &nbsp; p_(k+1) = p_k + 2Δy
                </div>
                <div>
                  • If <strong>p_k ≥ 0</strong>: plot (x_k + 1, y_k + 1), &nbsp; p_(k+1) = p_k + 2Δy − 2Δx
                </div>
                <div>5. Repeat Δx times (k = 0, 1, …, Δx − 1)</div>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                ببساطة: كل خطوة <span className="en-term">x</span> بتزيد 1 ثابت. لو{" "}
                <span className="math-pill">p_k</span> سالب نثبت{" "}
                <span className="en-term">y</span> ونجمع{" "}
                <span className="math-pill">2Δy</span>، ولو صفر أو موجب نزوّد{" "}
                <span className="en-term">y</span> ونجمع{" "}
                <span className="math-pill">2Δy − 2Δx</span>.
              </p>
            </div>

            {/* Ch4 Card */}
            <div
              className="space-y-3 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[14.5px] font-black text-[var(--text-primary)]">
                  ⭕ Chapter 4 · Midpoint Circle (First Octant)
                </h4>
                <span className="font-mono-code rounded-md bg-[var(--success-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--success-fg)]">
                  8-Way Symmetry
                </span>
              </div>
              <div
                dir="ltr"
                className="space-y-2 rounded-xl border p-3.5 font-mono-code text-[12px] leading-relaxed text-[var(--text-primary)]"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div>1. Compute around origin first: (x₀, y₀) = (0, r)</div>
                <div className="font-black text-[var(--success-fg)]">
                  2. Initial: p₀ = 1 − r &nbsp;(integer r) &nbsp;or&nbsp; 5/4 − r
                </div>
                <div className="border-t pt-2" style={{ borderColor: "var(--border-soft)" }}>
                  • If <strong>p_k &lt; 0</strong>: next = (x_k + 1, y_k)
                  <br />
                  &nbsp;&nbsp;p_(k+1) = p_k + 2x_(k+1) + 1
                </div>
                <div>
                  • If <strong>p_k ≥ 0</strong>: next = (x_k + 1, y_k − 1)
                  <br />
                  &nbsp;&nbsp;p_(k+1) = p_k + 2x_(k+1) + 1 − 2y_(k+1)
                </div>
                <div>3. Generate 7 symmetric points &amp; shift by (+x_c, +y_c)</div>
                <div>4. Stop as soon as x ≥ y</div>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                ببساطة: بنبدأ من فوق <span className="math-pill">(0, r)</span> ونمشي
                يمين (<span className="en-term">x+1</span>). لو{" "}
                <span className="math-pill">p_k</span> سالب نفضل جوه الدائرة فـ{" "}
                <span className="en-term">y</span> تثبت؛ لو صفر أو موجب ننزل{" "}
                <span className="math-pill">y − 1</span>.
              </p>
            </div>
          </div>

          {/* 5 Exam Special Cases */}
          <div
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="mb-3 flex items-center gap-2 text-[14px] font-black text-[var(--text-primary)]">
              <Target className="h-4 w-4 text-[var(--accent-warm)]" />
              <span>أهم 5 تريكات وحالات خاصة في مسائل الامتحان</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {[
                {
                  t: "1. فخ النقطتين المعكوستين (x₁ > x₂)",
                  d: "لو الدكتور عطاك (15,10) و (9,6) لازم تبدأ باليسرى (9,6) الأول قبل ما تحسب Δx و Δy.",
                },
                {
                  t: "2. فخ الصفر (p_k = 0)",
                  d: "في الخط والدائرة معاً: الصفر يتبع حالة p_k ≥ 0! يعني تغيّر y (تزيد +1 في الخط، وتقل −1 في الدائرة).",
                },
                {
                  t: "3. ميل أكبر من 1 (|m| > 1)",
                  d: "لما Δy > Δx بنبدّل دور x و y: الخطوة الثابتة تصبح y+1 و p₀ = 2Δx − Δy.",
                },
                {
                  t: "4. مركز الدائرة غير (0, 0)",
                  d: "إوعى تدخّل (x_c, y_c) جوا الجدول! حل عند (0, 0) وبعد ما تخلص اجمع (+x_c, +y_c) على كل نقطة.",
                },
                {
                  t: "5. التماثل الثماني: 8 نقاط ولا 4؟",
                  d: "أي نقطة عامة (x, y) تعطي 8 نقاط: (±x,±y) و (±y,±x). لكن لو x = 0 أو y = 0 أو x = y بتعطي 4 نقاط مميزة فقط!",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-3 text-[12.5px] leading-relaxed"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-extrabold text-[var(--text-primary)]">
                    {item.t}
                  </div>
                  <p className="mt-1 text-[var(--text-secondary)]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* ================= SUB-TAB 2: CH3 WORKED CASES ================= */}
      {subTab === "ch3" ? (
        <div className="space-y-4">
          {/* Case Selector Strip */}
          <div className="flex flex-wrap gap-1.5">
            {CH3_CASES.map((c) => {
              const active = c.id === activeCh3.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCh3Id(c.id)}
                  className="rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer"
                  style={
                    active
                      ? {
                          background: "var(--brand-soft)",
                          borderColor:
                            "color-mix(in srgb, var(--brand-primary) 35%, transparent)",
                          color: "var(--brand-soft-text)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  {c.shortLabel}
                </button>
              );
            })}
          </div>

          {activeCh3.kind === "bresenham" && activeCh3Sol ? (
            <LineWalkthroughCard
              sol={activeCh3Sol}
              badge={activeCh3.badge}
              title={activeCh3.title}
              subtitle={activeCh3.subtitle}
              examTip={activeCh3.examTip}
            />
          ) : null}

          {activeCh3.kind === "rounding" ? (
            <div
              className="space-y-4 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--brand-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--brand-soft-text)]">
                {activeCh3.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh3.title}
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  dir="ltr"
                  className="space-y-2 rounded-xl border p-4 text-left font-mono-code text-[12px]"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-bold text-[var(--brand-soft-text)]">
                    Example A: Find m and b for (2, 3) and (6, 11)
                  </div>
                  <div>m = (y₂ − y₁) / (x₂ − x₁) = (11 − 3) / (6 − 2) = 8 / 4 = 2</div>
                  <div>b = y₁ − m·x₁ = 3 − 2(2) = −1</div>
                  <div className="font-black text-[var(--success-fg)]">
                    Equation: y = 2x − 1
                  </div>
                </div>
                <div
                  dir="ltr"
                  className="space-y-2 rounded-xl border p-4 text-left font-mono-code text-[12px]"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-bold text-[var(--accent-warm-text)]">
                    Example B: Coordinate Rounding to Nearest Integer
                  </div>
                  <div>(10.48, 20.51) → round → (10, 21)</div>
                  <div>(10.72, 20.49) → round → (11, 20)</div>
                  <div className="text-[var(--text-secondary)]">
                    Rounding error creates the stair-step effect (Jaggies / Aliasing).
                  </div>
                </div>
              </div>
              <p className="text-[12.5px] text-[var(--text-secondary)]">
                🎯 {activeCh3.examTip}
              </p>
            </div>
          ) : null}

          {activeCh3.kind === "proof" ? (
            <div
              className="space-y-3 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--brand-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--brand-soft-text)]">
                {activeCh3.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh3.title}
              </h4>
              <div className="space-y-2.5">
                {[
                  {
                    step: "Step 1 · True y at column x_k + 1",
                    eq: "y = m(x_k + 1) + b",
                    ar: "دي قيمة y الحقيقية على الخط الرياضي عند العمود التالي.",
                  },
                  {
                    step: "Step 2 · Vertical Separations d₁ and d₂",
                    eq: "d₁ = y − y_k = m(x_k + 1) + b − y_k   |   d₂ = (y_k + 1) − y",
                    ar: "d₁ هي المسافة للبكسل السفلي y_k، و d₂ هي المسافة للبكسل العلوي y_k + 1.",
                  },
                  {
                    step: "Step 3 · Difference (d₁ − d₂)",
                    eq: "d₁ − d₂ = 2m(x_k + 1) − 2y_k + 2b − 1",
                    ar: "لو d₁ − d₂ < 0 يبقى السفلي أقرب، ولو ≥ 0 يبقى العلوي أقرب.",
                  },
                  {
                    step: "Step 4 · Eliminate Division by Multiplying by Δx",
                    eq: "p_k = Δx(d₁ − d₂) = 2Δy·x_k − 2Δx·y_k + c   (c = 2Δy + Δx(2b − 1))",
                    ar: "ضربنا في Δx الموجب عشان نلغي الكسر m = Δy/Δx من غير ما نغيّر الإشارة!",
                  },
                  {
                    step: "Step 5 · Recursive Update (p_(k+1) − p_k)",
                    eq: "p_(k+1) − p_k = 2Δy(x_(k+1) − x_k) − 2Δx(y_(k+1) − y_k) = 2Δy − 2Δx(y_(k+1) − y_k)",
                    ar: "الثابت c طار تماماً! و (y_(k+1) − y_k) يا إما 0 (لو p_k < 0) أو 1 (لو p_k ≥ 0).",
                  },
                  {
                    step: "Step 6 · Initial Decision Parameter p₀",
                    eq: "p₀ = 2Δy − Δx   (evaluated at (x₀, y₀) where y₀ = m·x₀ + b)",
                    ar: "بالتعويض بنقطة البداية (x₀, y₀) تطلع قيمة البداية البسيطة p₀ = 2Δy − Δx.",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border p-3.5"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      dir="ltr"
                      className="font-en text-left text-[12px] font-extrabold text-[var(--brand-soft-text)]"
                    >
                      {s.step}
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono-code mt-1 text-left text-[12.5px] font-bold text-[var(--text-primary)]"
                    >
                      {s.eq}
                    </div>
                    <p className="mt-1.5 text-[12px] text-[var(--text-secondary)]">
                      {s.ar}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= SUB-TAB 3: CH4 WORKED CASES ================= */}
      {subTab === "ch4" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {CH4_CASES.map((c) => {
              const active = c.id === activeCh4.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCh4Id(c.id)}
                  className="rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-all cursor-pointer"
                  style={
                    active
                      ? {
                          background: "var(--success-soft)",
                          borderColor:
                            "color-mix(in srgb, var(--success-fg) 35%, transparent)",
                          color: "var(--success-fg)",
                        }
                      : {
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  {c.shortLabel}
                </button>
              );
            })}
          </div>

          {activeCh4.kind === "circle" && activeCh4Sol ? (
            <CircleWalkthroughCard
              sol={activeCh4Sol}
              badge={activeCh4.badge}
              title={activeCh4.title}
              subtitle={activeCh4.subtitle}
              examTip={activeCh4.examTip}
            />
          ) : null}

          {activeCh4.kind === "symmetry" ? (
            <div
              className="space-y-4 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success-fg)]">
                {activeCh4.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh4.title}
              </h4>
              <div
                dir="ltr"
                className="grid grid-cols-2 gap-2 rounded-xl border p-4 text-left font-mono-code text-[12.5px] sm:grid-cols-4"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                {[
                  "(+x, +y)",
                  "(-x, +y)",
                  "(+x, -y)",
                  "(-x, -y)",
                  "(+y, +x)",
                  "(-y, +x)",
                  "(+y, -x)",
                  "(-y, -x)",
                ].map((pt) => (
                  <div
                    key={pt}
                    className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-2 text-center font-bold text-[var(--text-primary)]"
                  >
                    {pt}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-[12.5px]">
                <div
                  className="rounded-xl border p-3.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-extrabold text-[var(--text-primary)]">
                    مثال 1: نقطة عامة (3, 9) عند (0, 0) → 8 نقاط
                  </div>
                  <p dir="ltr" className="font-mono-code mt-1.5 text-left text-[12px] text-[var(--text-secondary)]">
                    (3,9), (-3,9), (3,-9), (-3,-9), (9,3), (-9,3), (9,-3), (-9,-3)
                  </p>
                </div>
                <div
                  className="rounded-xl border p-3.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-extrabold text-[var(--accent-warm-text)]">
                    مثال 2 (فخ): نقطة على المحور (0, 10) أو القطر (7, 7) → 4 نقاط فقط!
                  </div>
                  <p dir="ltr" className="font-mono-code mt-1.5 text-left text-[12px] text-[var(--text-secondary)]">
                    (0,10), (0,-10), (10,0), (-10,0) — no duplicates!
                  </p>
                </div>
              </div>
              <p className="text-[12.5px] text-[var(--text-secondary)]">
                🎯 {activeCh4.examTip}
              </p>
            </div>
          ) : null}

          {activeCh4.kind === "cartesian_polar" ? (
            <div
              className="space-y-4 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success-fg)]">
                {activeCh4.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh4.title}
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  dir="ltr"
                  className="space-y-2 rounded-xl border p-4 text-left"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-en text-[13px] font-extrabold text-[var(--brand-soft-text)]">
                    Equation (1): Cartesian Form
                  </div>
                  <div className="font-mono-code text-[12.5px] font-bold text-[var(--text-primary)]">
                    (x − x_c)² + (y − y_c)² = r²
                    <br />y = y_c ± √(r² − (x − x_c)²)
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">
                    Drawbacks: (1) Heavy square-root calculations, (2) Non-uniform spacing between plotted pixels.
                  </div>
                </div>
                <div
                  dir="ltr"
                  className="space-y-2 rounded-xl border p-4 text-left"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="font-en text-[13px] font-extrabold text-[var(--success-fg)]">
                    Equation (2): Polar Parametric Form
                  </div>
                  <div className="font-mono-code text-[12.5px] font-bold text-[var(--text-primary)]">
                    x = x_c + r·cos(θ) , &nbsp; y = y_c + r·sin(θ)
                    <br />
                    Angular step size: Δθ = 1 / r (radians)
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">
                    Solves unequal spacing, but still slow because cos(θ) &amp; sin(θ) are expensive floating-point trig calls!
                  </div>
                </div>
              </div>
              <p className="text-[12.5px] text-[var(--text-secondary)]">
                🎯 {activeCh4.examTip}
              </p>
            </div>
          ) : null}

          {activeCh4.kind === "mcq_speed" ? (
            <div
              className="space-y-3 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success-fg)]">
                {activeCh4.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh4.title}
              </h4>
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {[
                  {
                    q: "Given r = 10, what is p₀?",
                    a: "p₀ = 1 − r = −9 (or 5/4 − 10 = −8.75 if exact fractional).",
                  },
                  {
                    q: "At (x_k, y_k) = (3, 10) with p_k = −2 < 0, what is next pixel & p_(k+1)?",
                    a: "Next = (4, 10). Then p_(k+1) = −2 + 2(4) + 1 = +7.",
                  },
                  {
                    q: "At (x_k, y_k) = (4, 10) with p_k = +7 ≥ 0, what is next pixel & p_(k+1)?",
                    a: "Next = (5, 9). Then p_(k+1) = 7 + 2(5) + 1 − 2(9) = 0.",
                  },
                  {
                    q: "What is the slope range in the first octant (from x = 0 to x = y)?",
                    a: "From 0 (at top (0, r)) to −1 (at diagonal x = y).",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    dir="ltr"
                    className="rounded-xl border p-3.5 text-left"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="font-en text-[12.5px] font-extrabold text-[var(--text-primary)]">
                      {item.q}
                    </div>
                    <div className="font-mono-code mt-1.5 text-[12px] font-semibold text-[var(--success-fg)]">
                      ⇒ {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeCh4.kind === "algorithm" ? (
            <div
              className="space-y-3 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
              }}
            >
              <span className="inline-flex rounded-md bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success-fg)]">
                {activeCh4.badge}
              </span>
              <h4 dir="ltr" className="font-en text-left text-[15.5px] font-black text-[var(--text-primary)]">
                {activeCh4.title}
              </h4>
              <ol
                dir="ltr"
                className="space-y-2 rounded-xl border p-4 text-left font-en text-[13px] leading-relaxed text-[var(--text-primary)]"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <li>
                  <strong>1. Input:</strong> Radius <code>r</code> and center{" "}
                  <code>(x_c, y_c)</code>, obtain first point at origin:{" "}
                  <code>(x₀, y₀) = (0, r)</code>.
                </li>
                <li>
                  <strong>2. Initial parameter:</strong>{" "}
                  <code>p₀ = 5/4 − r</code> (or <code>1 − r</code> for integer{" "}
                  <code>r</code>).
                </li>
                <li>
                  <strong>3. Decision test at each x_k (k = 0, 1, …):</strong>{" "}
                  If <code>p_k &lt; 0</code>, next is{" "}
                  <code>(x_k + 1, y_k)</code> and{" "}
                  <code>p_(k+1) = p_k + 2x_(k+1) + 1</code>. Otherwise, next is{" "}
                  <code>(x_k + 1, y_k − 1)</code> and{" "}
                  <code>p_(k+1) = p_k + 2x_(k+1) + 1 − 2y_(k+1)</code>.
                </li>
                <li>
                  <strong>4. Symmetry:</strong> Determine symmetry points in the
                  other seven octants.
                </li>
                <li>
                  <strong>5. Translate:</strong> Move each calculated pixel{" "}
                  <code>(x, y)</code> to <code>(x + x_c, y + y_c)</code>.
                </li>
                <li>
                  <strong>6. Stop:</strong> Repeat Steps 3 through 5 until{" "}
                  <code>x ≥ y</code>.
                </li>
              </ol>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= SUB-TAB 4: INTERACTIVE CUSTOM SOLVER ================= */}
      {subTab === "solver" ? (
        <div className="space-y-4">
          <div
            className="space-y-4 rounded-2xl border p-4 sm:p-5"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[14px] font-black text-[var(--text-primary)]">
                <Compass className="h-4 w-4 text-[var(--brand-primary)]" />
                <span>اختر نوع المسألة وأدخل أرقامك</span>
              </div>
              <div
                className="inline-flex rounded-xl border p-0.5"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSolverMode("line")}
                  className="rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors cursor-pointer"
                  style={
                    solverMode === "line"
                      ? { background: "var(--hero-bg)", color: "#fff" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  Bresenham Line (Ch3)
                </button>
                <button
                  type="button"
                  onClick={() => setSolverMode("circle")}
                  className="rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors cursor-pointer"
                  style={
                    solverMode === "circle"
                      ? { background: "var(--hero-bg)", color: "#fff" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  Midpoint Circle (Ch4)
                </button>
              </div>
            </div>

            {solverMode === "line" ? (
              <div className="space-y-3">
                <div dir="ltr" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "x₁", val: lx1, set: setLx1 },
                    { label: "y₁", val: ly1, set: setLy1 },
                    { label: "x₂", val: lx2, set: setLx2 },
                    { label: "y₂", val: ly2, set: setLy2 },
                  ].map((f) => (
                    <label key={f.label} className="block space-y-1">
                      <span className="font-mono-code text-[11px] font-bold text-[var(--text-muted)]">
                        {f.label}
                      </span>
                      <input
                        type="number"
                        value={f.val}
                        onChange={(e) => f.set(Number(e.target.value) || 0)}
                        className="font-mono-code w-full rounded-xl border px-3 py-2 text-center text-[13.5px] font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                        }}
                      />
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
                  <span className="inline-flex items-center gap-1 font-bold text-[var(--text-muted)]">
                    <Info className="h-3.5 w-3.5" /> أمثلة سريعة:
                  </span>
                  {[
                    { label: "(20,10)→(30,18)", vals: [20, 10, 30, 18] },
                    { label: "(1,1)→(8,3)", vals: [1, 1, 8, 3] },
                    { label: "(2,2)→(10,6)", vals: [2, 2, 10, 6] },
                    { label: "(2,1)→(5,7) Steep", vals: [2, 1, 5, 7] },
                    { label: "(1,8)→(7,5) Neg", vals: [1, 8, 7, 5] },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setLx1(preset.vals[0]);
                        setLy1(preset.vals[1]);
                        setLx2(preset.vals[2]);
                        setLy2(preset.vals[3]);
                      }}
                      className="font-mono-code rounded-lg border px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:opacity-85 cursor-pointer"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div dir="ltr" className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Radius (r)", val: cr, set: setCr },
                    { label: "Center x_c", val: cxc, set: setCxc },
                    { label: "Center y_c", val: cyc, set: setCyc },
                  ].map((f) => (
                    <label key={f.label} className="block space-y-1">
                      <span className="font-mono-code text-[11px] font-bold text-[var(--text-muted)]">
                        {f.label}
                      </span>
                      <input
                        type="number"
                        value={f.val}
                        onChange={(e) => f.set(Number(e.target.value) || 0)}
                        className="font-mono-code w-full rounded-xl border px-3 py-2 text-center text-[13.5px] font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                        }}
                      />
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cFrac}
                      onChange={(e) => setCFrac(e.target.checked)}
                    />
                    <span>استخدام القانون الكسري الدقيق (p₀ = 5/4 − r)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "r=10 (0,0)", r: 10, xc: 0, yc: 0, f: false },
                      { label: "r=8 (0,0)", r: 8, xc: 0, yc: 0, f: false },
                      { label: "r=5 (5/4−r)", r: 5, xc: 0, yc: 0, f: true },
                      { label: "r=6 (20,30)", r: 6, xc: 20, yc: 30, f: false },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setCr(preset.r);
                          setCxc(preset.xc);
                          setCyc(preset.yc);
                          setCFrac(preset.f);
                        }}
                        className="font-mono-code rounded-lg border px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:opacity-85 cursor-pointer"
                        style={{
                          background: "var(--bg-canvas)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {solverMode === "line" ? (
            <LineWalkthroughCard
              sol={customLineSol}
              badge="Live Custom Solution · Ch 3"
              title={`Bresenham Line: (${lx1}, ${ly1}) → (${lx2}, ${ly2})`}
            />
          ) : (
            <CircleWalkthroughCard
              sol={customCircleSol}
              badge="Live Custom Solution · Ch 4"
              title={`Midpoint Circle: r = ${Math.max(1, Math.min(35, Math.round(cr)))}, Center = (${cxc}, ${cyc})`}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
