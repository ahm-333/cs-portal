"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Calculator,
  Eye,
  EyeOff,
  PenLine,
  Printer,
  Sparkles,
  Target,
} from "lucide-react";
import type {
  StructuredChapterSummary,
  SummaryConceptCard,
} from "@/types/chapter";

interface ChapterSummarySheetProps {
  summary: StructuredChapterSummary;
  onGoToQuiz?: () => void;
}

function getMarkerClass(tone: SummaryConceptCard["tone"] = "neutral") {
  switch (tone) {
    case "brand":
      return { marker: "nb-marker-sky", dot: "#2563eb", tab: "#3b82f6" };
    case "mint":
      return { marker: "nb-marker-mint", dot: "#059669", tab: "#10b981" };
    case "warm":
      return { marker: "nb-marker-warm", dot: "#c25e33", tab: "#f59e0b" };
    default:
      return { marker: "nb-marker-yellow", dot: "#ca8a04", tab: "#eab308" };
  }
}

const BOOKMARK_COLORS = [
  { bg: "#fef08a", border: "#eab308", text: "#713f12" },
  { bg: "#bae6fd", border: "#0284c7", text: "#0c4a6e" },
  { bg: "#bbf7d0", border: "#16a34a", text: "#14532d" },
  { bg: "#fed7aa", border: "#ea580c", text: "#7c2d12" },
  { bg: "#e9d5ff", border: "#9333ea", text: "#581c87" },
];

/**
 * Highlights key term before ":" with a realistic Stabilo highlighter marker swipe
 */
function NotebookEnglishLine({
  text,
  markerClass,
}: {
  text: string;
  markerClass: string;
}) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 1 && colonIdx <= 48) {
    const lead = text.slice(0, colonIdx);
    const rest = text.slice(colonIdx + 1);
    return (
      <>
        <span className={`${markerClass} font-extrabold`}>{lead}:</span>
        <span>{rest}</span>
      </>
    );
  }
  return <>{text}</>;
}

export default function ChapterSummarySheet({
  summary,
  onGoToQuiz,
}: ChapterSummarySheetProps) {
  const [showArabic, setShowArabic] = useState(true);

  function scrollToSection(sectionId: string) {
    const el = document.getElementById(
      `summary-sec-${summary.chapterNum}-${sectionId}`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-[1040px] space-y-3">
      {/* ==================== STICKY BOOKMARK TABS ON TOP EDGE OF NOTEBOOK ==================== */}
      <div className="flex flex-wrap items-end justify-between gap-2 px-1 sm:px-3">
        {/* Colored Paper Bookmark Tabs */}
        <div
          dir="ltr"
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5"
        >
          {summary.sections.map((sec, idx) => {
            const c = BOOKMARK_COLORS[idx % BOOKMARK_COLORS.length];
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-t-xl rounded-b-md border px-3 py-1.5 text-[11.5px] font-extrabold shadow-2xs transition-transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: c.bg,
                  borderColor: c.border,
                  color: c.text,
                }}
              >
                <span className="font-mono-code text-[10px] font-black opacity-75">
                  {sec.number}
                </span>
                <span className="font-en max-w-[160px] truncate">
                  {sec.titleEn}
                </span>
              </button>
            );
          })}
          {summary.examTraps.length > 0 ? (
            <button
              type="button"
              onClick={() => scrollToSection("exam-traps")}
              className="inline-flex shrink-0 items-center gap-1 rounded-t-xl rounded-b-md border border-rose-400 bg-rose-100 px-3 py-1.5 text-[11.5px] font-extrabold text-rose-900 shadow-2xs transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Target className="h-3 w-3 shrink-0" />
              <span>تريكات الامتحان</span>
            </button>
          ) : null}
        </div>

        {/* Notebook Tools: Hide Arabic + Print PDF */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowArabic((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[11.5px] font-bold transition-colors hover:opacity-85 cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            {showArabic ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>إخفاء شرح القلم</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-[var(--success-fg)]" />
                <span>إظهار الشرح بالعامية</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            title="طباعة أو حفظ الكشكول كـ PDF"
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[11.5px] font-bold transition-colors hover:opacity-85 cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* ==================== OPEN RULED STUDENT NOTEBOOK SHEET ==================== */}
      <div className="notebook-paper relative overflow-hidden rounded-2xl border sm:rounded-[26px]">
        {/* Left Spiral Binding Ring Column (Desktop/Tablet — Realistic Student Notebook Feel!) */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:flex absolute inset-y-0 left-0 z-10 w-12 flex-col items-center justify-around border-r py-8"
          style={{
            background:
              "linear-gradient(90deg, rgba(15, 23, 42, 0.055) 0%, transparent 100%)",
            borderColor: "rgba(225, 29, 72, 0.24)",
          }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="relative flex items-center">
              <span
                className="h-3.5 w-3.5 rounded-full border shadow-inner"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "rgba(100, 116, 139, 0.35)",
                }}
              />
              <span
                className="absolute -left-2.5 h-[3px] w-4 rounded-full"
                style={{ background: "rgba(100, 116, 139, 0.38)" }}
              />
            </div>
          ))}
        </div>

        {/* Double Red Margin Line next to Spiral Gutter (Desktop/Tablet) */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute inset-y-0 left-[52px] w-[1px]"
          style={{ background: "rgba(225, 29, 72, 0.16)" }}
        />

        {/* Notebook Content Page */}
        <div className="relative z-10 px-4 py-6 sm:py-8 sm:pr-10 sm:pl-20 space-y-10">
          {/* Notebook Page Top Title Stamp */}
          <div
            className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-dashed pb-4"
            style={{ borderColor: "rgba(100, 116, 139, 0.24)" }}
          >
            <div dir="ltr" className="text-left space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-code inline-flex items-center gap-1 rounded-md bg-rose-500/12 px-2 py-0.5 text-[11px] font-black text-rose-700 dark:text-rose-300">
                  <Bookmark className="h-3 w-3" />
                  {summary.courseCode} · Ch.{summary.chapterNum} Notes
                </span>
                <span className="font-signature text-[15px] text-[var(--accent-warm)]">
                  Eng. Ahmed Amir
                </span>
              </div>
              <h2 className="font-en text-[20px] sm:text-[24px] font-black tracking-tight text-[var(--text-primary)]">
                {summary.titleEn}
              </h2>
            </div>

            {showArabic ? (
              <span className="nb-ink-ar inline-flex items-center gap-1.5 text-[13px] font-extrabold">
                <PenLine className="h-3.5 w-3.5 shrink-0" />
                <span>كشكول: {summary.titleAr}</span>
              </span>
            ) : null}
          </div>

          {/* ==================== NOTEBOOK SECTIONS ==================== */}
          {summary.sections.map((section) => (
            <section
              key={section.id}
              id={`summary-sec-${summary.chapterNum}-${section.id}`}
              className="scroll-mt-24 space-y-6"
            >
              {/* Underlined Notebook Section Heading */}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div dir="ltr" className="flex items-center gap-2.5 text-left">
                  <span className="nb-marker-yellow font-mono-code text-[13px] font-black">
                    #{section.number}
                  </span>
                  <h3 className="font-en text-[18px] sm:text-[20px] font-black text-[var(--text-primary)] underline decoration-amber-400/75 decoration-[3px] underline-offset-[6px]">
                    {section.titleEn}
                  </h3>
                </div>
                {showArabic ? (
                  <span className="nb-ink-ar text-[12.5px] font-extrabold">
                    ({section.titleAr})
                  </span>
                ) : null}
              </div>

              {/* Hand-Sketched Flow Diagram */}
              {section.flowBanner ? (
                <div
                  className="rounded-xl border-2 border-dashed px-4 py-3.5 space-y-2.5"
                  style={{
                    borderColor: "rgba(37, 99, 235, 0.28)",
                    background: "rgba(37, 99, 235, 0.035)",
                  }}
                >
                  <div
                    dir="ltr"
                    className="font-mono-code text-left text-[11px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300"
                  >
                    ✎ {section.flowBanner.labelEn}
                  </div>
                  <div
                    dir="ltr"
                    className="flex flex-wrap items-center gap-2 text-left"
                  >
                    {section.flowBanner.steps.map((step, idx) => (
                      <div
                        key={`${step}-${idx}`}
                        className="inline-flex items-center gap-2"
                      >
                        <span
                          className="font-en rounded-lg border px-3 py-1 text-[12.5px] font-extrabold text-[var(--text-primary)]"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-strong)",
                          }}
                        >
                          {step}
                        </span>
                        {idx < section.flowBanner!.steps.length - 1 ? (
                          <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {showArabic && section.flowBanner.captionAr ? (
                    <p
                      dir="rtl"
                      className="nb-ink-ar text-right text-[13px] font-semibold leading-relaxed"
                    >
                      ✏️ {section.flowBanner.captionAr}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Notebook Concept Notes (Directly on the Ruled Paper — Zero Heavy Cards!) */}
              {section.cards && section.cards.length > 0 ? (
                <div className="space-y-8">
                  {section.cards.map((card, cIdx) => {
                    const style = getMarkerClass(card.tone);
                    const hasPairedPoints =
                      Array.isArray(card.points) && card.points.length > 0;
                    const topArabic =
                      card.arSummary ||
                      (!hasPairedPoints ? card.arNote : undefined);

                    return (
                      <div key={`${card.term}-${cIdx}`} className="space-y-3">
                        {/* Topic Sub-Heading in Notebook */}
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center gap-2 text-left"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: style.dot }}
                          />
                          <h4 className="font-en text-[15.5px] sm:text-[17px] font-black text-[var(--text-primary)]">
                            {card.term}
                          </h4>
                          {card.badge ? (
                            <span className="font-mono-code rounded border border-dashed border-slate-400/50 px-2 py-0.5 text-[10.5px] font-bold text-[var(--text-muted)]">
                              {card.badge}
                            </span>
                          ) : null}
                        </div>

                        {/* Core Definition Line + Student Blue-Ink Margin Note Underneath */}
                        <div className="space-y-1.5 pl-3">
                          <p
                            dir="ltr"
                            className="font-en text-left text-[14.5px] font-semibold leading-[1.9] text-[var(--text-primary)]"
                          >
                            <NotebookEnglishLine
                              text={card.enSummary}
                              markerClass={style.marker}
                            />
                          </p>
                          {showArabic && topArabic ? (
                            <p
                              dir="rtl"
                              className="nb-ink-ar text-right text-[13.5px] font-semibold leading-[1.9]"
                            >
                              ↳ {topArabic}
                            </p>
                          ) : null}
                        </div>

                        {/* Optional Inline Flow */}
                        {card.flowSteps && card.flowSteps.length > 0 ? (
                          <div
                            dir="ltr"
                            className="flex flex-wrap items-center gap-1.5 pl-3 text-left"
                          >
                            {card.flowSteps.map((st, sIdx) => (
                              <div
                                key={`${st}-${sIdx}`}
                                className="inline-flex items-center gap-1.5"
                              >
                                <span
                                  className="font-mono-code rounded-md border border-dashed px-2.5 py-0.5 text-[11.5px] font-bold text-[var(--text-primary)]"
                                  style={{
                                    borderColor: "var(--border-strong)",
                                    background: "var(--bg-surface)",
                                  }}
                                >
                                  {st}
                                </span>
                                {sIdx < card.flowSteps!.length - 1 ? (
                                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-65" />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {/* 1-to-1 Paired English Lines + Student Blue-Ink Arabic Notes Directly Underneath */}
                        {hasPairedPoints ? (
                          <ul className="space-y-4 pl-2 sm:pl-4 pt-1">
                            {card.points!.map((pt, pIdx) => (
                              <li key={pIdx} className="space-y-1">
                                <div
                                  dir="ltr"
                                  className="flex items-start gap-2.5 text-left"
                                >
                                  <span className="font-mono-code mt-0.5 text-[12px] font-black text-rose-600 dark:text-rose-400 shrink-0">
                                    {pIdx + 1})
                                  </span>
                                  <p className="font-en min-w-0 flex-1 text-[14px] sm:text-[14.5px] font-medium leading-[1.85] text-[var(--text-primary)]">
                                    <NotebookEnglishLine
                                      text={pt.en}
                                      markerClass={style.marker}
                                    />
                                  </p>
                                  {pt.tag ? (
                                    <span className="shrink-0 -rotate-1 rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300">
                                      ★ {pt.tag}
                                    </span>
                                  ) : null}
                                </div>

                                {showArabic ? (
                                  <p
                                    dir="rtl"
                                    className="nb-ink-ar pr-2 text-right text-[13px] sm:text-[13.5px] font-semibold leading-[1.85]"
                                  >
                                    ✏️ {pt.ar}
                                  </p>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        ) : card.enBullets && card.enBullets.length > 0 ? (
                          <ul className="space-y-2.5 pl-4 pt-1">
                            {card.enBullets.map((b, bIdx) => (
                              <li
                                key={bIdx}
                                dir="ltr"
                                className="font-en flex items-start gap-2 text-left text-[14px] leading-[1.85] text-[var(--text-primary)]"
                              >
                                <span className="font-mono-code font-black text-rose-600 dark:text-rose-400">
                                  •
                                </span>
                                <span className="min-w-0 flex-1">
                                  <NotebookEnglishLine
                                    text={b}
                                    markerClass={style.marker}
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Hand-Boxed Formulas (Dashed Ink Box like a real exam notebook!) */}
              {section.formulas && section.formulas.length > 0 ? (
                <div className="space-y-4">
                  {section.formulas.map((f, fIdx) => (
                    <div
                      key={`${f.labelEn}-${fIdx}`}
                      className="relative rounded-xl border-2 border-dashed p-4 sm:p-5 space-y-2"
                      style={{
                        borderColor: "rgba(194, 94, 51, 0.45)",
                        background: "rgba(194, 94, 51, 0.04)",
                      }}
                    >
                      <div
                        dir="ltr"
                        className="flex items-center gap-1.5 text-left text-[11.5px] font-black uppercase tracking-wide text-[var(--accent-warm)]"
                      >
                        <Calculator className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-en">Formula · {f.labelEn}</span>
                      </div>
                      <div
                        dir="ltr"
                        className="font-mono-code text-left text-[14px] sm:text-[15px] font-black text-[var(--text-primary)] py-1"
                      >
                        {f.formula}
                      </div>
                      {f.workedExampleEn ? (
                        <p
                          dir="ltr"
                          className="font-en text-left text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]"
                        >
                          <strong className="text-[var(--text-primary)]">
                            Ex:
                          </strong>{" "}
                          {f.workedExampleEn}
                        </p>
                      ) : null}
                      {showArabic ? (
                        <p
                          dir="rtl"
                          className="nb-ink-ar pt-1 text-right text-[13px] font-semibold leading-relaxed"
                        >
                          ✏️ {f.arNote}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Hand-Ruled Comparison Table */}
              {section.table ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h5
                      dir="ltr"
                      className="font-en text-left text-[14.5px] font-black text-[var(--text-primary)]"
                    >
                      ▤ {section.table.titleEn}
                    </h5>
                    {showArabic && section.table.titleAr ? (
                      <span className="nb-ink-ar text-[12px] font-bold">
                        {section.table.titleAr}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className="overflow-x-auto rounded-xl border-2"
                    style={{ borderColor: "rgba(100, 116, 139, 0.28)" }}
                  >
                    <table className="w-full min-w-[520px] border-collapse text-[13px]">
                      <thead
                        style={{
                          background: "rgba(100, 116, 139, 0.10)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <tr>
                          {section.table.headers.map((h, hIdx) => {
                            if (!showArabic && h.dir === "rtl") return null;
                            return (
                              <th
                                key={hIdx}
                                dir={h.dir}
                                className={`border-b-2 px-3.5 py-2.5 font-black ${
                                  h.dir === "ltr"
                                    ? "font-en text-left"
                                    : "text-right"
                                }`}
                                style={{
                                  borderColor: "rgba(100, 116, 139, 0.25)",
                                }}
                              >
                                {h.label}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{ borderColor: "rgba(100, 116, 139, 0.20)" }}
                      >
                        {section.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              borderColor: "rgba(100, 116, 139, 0.20)",
                            }}
                          >
                            {row.map((cell, cIdx) => {
                              if (!showArabic && cell.dir === "rtl") return null;
                              return (
                                <td
                                  key={cIdx}
                                  dir={cell.dir}
                                  className={`px-3.5 py-2.5 align-top leading-relaxed ${
                                    cell.dir === "ltr"
                                      ? "font-en text-left"
                                      : "text-right"
                                  } ${
                                    cell.highlight
                                      ? "font-black"
                                      : cIdx === 0
                                        ? "font-extrabold text-[var(--text-primary)]"
                                        : cell.dir === "rtl"
                                          ? "nb-ink-ar font-semibold"
                                          : "text-[var(--text-secondary)]"
                                  }`}
                                >
                                  {cell.highlight ? (
                                    <span className="nb-marker-yellow">
                                      {cell.text}
                                    </span>
                                  ) : (
                                    cell.text
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </section>
          ))}

          {/* ==================== PINNED STICKY NOTE: EXAM TRAPS ==================== */}
          {summary.examTraps.length > 0 ? (
            <section
              id={`summary-sec-${summary.chapterNum}-exam-traps`}
              className="scroll-mt-24 pt-2"
            >
              <div className="nb-sticky-note relative rounded-2xl border p-5 sm:p-6 space-y-4">
                {/* Translucent Tape Strip at Top Center */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-24 rounded-sm bg-amber-300/45 dark:bg-amber-400/20 backdrop-blur-[1px] rotate-[-1deg]"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[15.5px] font-black">
                    <Target className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>
                      📌 ورقة تريكات الامتحان — Chapter {summary.chapterNum}
                    </span>
                  </div>

                  {onGoToQuiz ? (
                    <button
                      type="button"
                      onClick={onGoToQuiz}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-extrabold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
                      style={{ background: "#c25e33" }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>اختبر نفسك في الكويز دلوقتي</span>
                    </button>
                  ) : null}
                </div>

                <ul className="space-y-3">
                  {summary.examTraps.map((trap, tIdx) => (
                    <li
                      key={tIdx}
                      className="space-y-1 border-b border-dashed pb-2.5 last:border-b-0 last:pb-0"
                      style={{ borderColor: "rgba(180, 130, 20, 0.28)" }}
                    >
                      <div
                        dir="ltr"
                        className="font-en text-left text-[13.5px] font-extrabold leading-relaxed"
                      >
                        <span className="mr-1.5 text-rose-600 dark:text-rose-400">
                          !
                        </span>
                        {trap.en}
                      </div>
                      {showArabic ? (
                        <p
                          dir="rtl"
                          className="text-right text-[12.5px] font-bold leading-relaxed opacity-85"
                        >
                          ✏️ {trap.ar}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
