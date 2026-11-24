"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  CornerDownLeft,
  Eye,
  EyeOff,
  Layers,
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

function getToneTheme(tone: SummaryConceptCard["tone"] = "neutral") {
  switch (tone) {
    case "brand":
      return {
        rail: "#2563eb",
        headerBg:
          "linear-gradient(90deg, rgba(37, 99, 235, 0.10) 0%, rgba(99, 102, 241, 0.03) 100%)",
        badgeClass:
          "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        leadClass: "text-blue-700 dark:text-blue-300",
        dotBg: "#3b82f6",
      };
    case "mint":
      return {
        rail: "#059669",
        headerBg:
          "linear-gradient(90deg, rgba(16, 185, 129, 0.10) 0%, rgba(20, 184, 166, 0.03) 100%)",
        badgeClass:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        leadClass: "text-emerald-700 dark:text-emerald-300",
        dotBg: "#10b981",
      };
    case "warm":
      return {
        rail: "#d97706",
        headerBg:
          "linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.03) 100%)",
        badgeClass:
          "border-amber-500/30 bg-amber-500/12 text-amber-800 dark:text-amber-300",
        leadClass: "text-amber-800 dark:text-amber-300",
        dotBg: "#f59e0b",
      };
    default:
      return {
        rail: "#7c3aed",
        headerBg:
          "linear-gradient(90deg, rgba(124, 58, 237, 0.09) 0%, rgba(99, 102, 241, 0.03) 100%)",
        badgeClass:
          "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        leadClass: "text-violet-700 dark:text-violet-300",
        dotBg: "#8b5cf6",
      };
  }
}

/**
 * Splits "Key Term: explanation..." so the English key term stands out cleanly.
 */
function HighlightedEnglishText({
  text,
  leadClass,
}: {
  text: string;
  leadClass: string;
}) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 1 && colonIdx <= 46) {
    const lead = text.slice(0, colonIdx);
    const rest = text.slice(colonIdx + 1);
    return (
      <>
        <strong className={`font-extrabold ${leadClass}`}>{lead}:</strong>
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
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ==================== VIBRANT SUMMARY HERO CARD ==================== */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Multi-tone Top Accent Bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, #2563eb 0%, #7c3aed 38%, #059669 72%, #d97706 100%)",
          }}
        />

        <div
          className="border-b p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--brand-soft) 38%, var(--bg-canvas)) 0%, var(--bg-canvas) 100%)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* LTR English Title Block */}
            <div dir="ltr" className="min-w-0 flex-1 space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-code inline-flex items-center gap-1 rounded-lg bg-gradient-to-l from-indigo-600 to-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  <Layers className="h-3 w-3" />
                  {summary.courseCode} · Chapter {summary.chapterNum}
                </span>
                <span className="inline-flex items-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  Bilingual Study Sheet · {summary.sections.length} Sections
                </span>
              </div>

              <h3 className="font-en text-[20px] font-black leading-tight text-[var(--text-primary)] sm:text-[23px]">
                {summary.titleEn}
              </h3>

              <p className="font-en max-w-3xl text-[13.5px] leading-[1.75] text-[var(--text-secondary)]">
                {summary.overviewEn}
              </p>
            </div>

            {/* Arabic Toggle Button */}
            <button
              type="button"
              onClick={() => setShowArabic((prev) => !prev)}
              className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12px] font-extrabold transition-all cursor-pointer ${
                showArabic
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/15"
                  : "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15"
              }`}
            >
              {showArabic ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>إخفاء العامية (اختبار نفسك)</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>إظهار التوضيح بالعامية</span>
                </>
              )}
            </button>
          </div>

          {showArabic ? (
            <div
              dir="rtl"
              className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-[var(--bg-surface)] px-4 py-3 text-right text-[13.5px] font-medium leading-[1.8] text-[var(--text-secondary)]"
            >
              <CornerDownLeft className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="ml-1.5 font-black text-emerald-700 dark:text-emerald-400">
                  ملخص الشابتر ببساطة:
                </span>
                {summary.overviewAr}
              </div>
            </div>
          ) : null}
        </div>

        {/* Quick-Jump Section Pills (Clean LTR) */}
        <div
          dir="ltr"
          className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-5"
          style={{ background: "var(--bg-surface)" }}
        >
          {summary.sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] px-3 py-1.5 text-[12px] font-bold text-[var(--text-primary)] transition-all hover:border-indigo-400/60 hover:bg-indigo-500/[0.06] cursor-pointer"
            >
              <span className="font-mono-code inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/12 text-[10.5px] font-black text-indigo-700 dark:text-indigo-300">
                {sec.number}
              </span>
              <span className="font-en">{sec.titleEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== STRUCTURED SECTIONS ==================== */}
      <div className="space-y-6">
        {summary.sections.map((section) => (
          <section
            key={section.id}
            id={`summary-sec-${summary.chapterNum}-${section.id}`}
            className="scroll-mt-24 space-y-5 rounded-2xl border p-4 sm:p-6"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Section Header: LTR English Title + RTL Arabic Pill */}
            <div
              className="flex flex-col gap-2.5 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div dir="ltr" className="flex items-start gap-3 text-left">
                <span className="font-mono-code mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-[13px] font-black text-white shadow-xs">
                  {section.number}
                </span>
                <div className="min-w-0">
                  <h4 className="font-en text-[17.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[19.5px]">
                    {section.titleEn}
                  </h4>
                  {section.introEn ? (
                    <p className="font-en mt-1 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                      {section.introEn}
                    </p>
                  ) : null}
                </div>
              </div>

              {showArabic ? (
                <span
                  dir="rtl"
                  className="shrink-0 self-end rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08] px-3 py-1 text-[12.5px] font-extrabold text-indigo-800 dark:text-indigo-300 sm:self-center"
                >
                  {section.titleAr}
                </span>
              ) : null}
            </div>

            {showArabic && section.introAr ? (
              <div
                dir="rtl"
                className="flex items-start gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] px-4 py-2.5 text-right text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]"
              >
                <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{section.introAr}</span>
              </div>
            ) : null}

            {/* Visual Flow Pipeline Banner */}
            {section.flowBanner ? (
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/[0.06] via-indigo-500/[0.04] to-emerald-500/[0.05] p-4">
                <div
                  dir="ltr"
                  className="font-mono-code mb-3 text-left text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300"
                >
                  {section.flowBanner.labelEn}
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
                      <span className="font-en rounded-xl border border-blue-500/25 bg-[var(--bg-surface)] px-3.5 py-1.5 text-[13px] font-extrabold text-[var(--text-primary)] shadow-2xs">
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
                    className="mt-3 flex items-start gap-1.5 text-right text-[12.5px] font-semibold leading-relaxed text-[var(--text-secondary)]"
                  >
                    <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{section.flowBanner.captionAr}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Spacious Full-Width Concept Cards (1-to-1 Paired English + Arabic!) */}
            {section.cards && section.cards.length > 0 ? (
              <div className="space-y-4">
                {section.cards.map((card, cIdx) => {
                  const theme = getToneTheme(card.tone);
                  const hasPairedPoints =
                    Array.isArray(card.points) && card.points.length > 0;
                  const topArabic =
                    card.arSummary || (!hasPairedPoints ? card.arNote : undefined);

                  return (
                    <div
                      key={`${card.term}-${cIdx}`}
                      className="overflow-hidden rounded-2xl border"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        borderLeftWidth: "4px",
                        borderLeftColor: theme.rail,
                      }}
                    >
                      {/* Card Header Strip */}
                      <div
                        className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5"
                        style={{
                          background: theme.headerBg,
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center gap-2.5 text-left"
                        >
                          <h5 className="font-en text-[15.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[16.5px]">
                            {card.term}
                          </h5>
                          {card.badge ? (
                            <span
                              className={`font-mono-code rounded-lg border px-2 py-0.5 text-[10.5px] font-extrabold ${theme.badgeClass}`}
                            >
                              {card.badge}
                            </span>
                          ) : null}
                        </div>

                        {showArabic && card.termAr ? (
                          <span
                            dir="rtl"
                            className="text-[12.5px] font-bold text-[var(--text-secondary)]"
                          >
                            {card.termAr}
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-3.5 p-4 sm:p-5">
                        {/* Main Definition (English + Arabic immediately underneath) */}
                        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5 sm:p-4">
                          <p
                            dir="ltr"
                            className="font-en text-left text-[14px] font-semibold leading-[1.8] text-[var(--text-primary)]"
                          >
                            <HighlightedEnglishText
                              text={card.enSummary}
                              leadClass={theme.leadClass}
                            />
                          </p>

                          {card.flowSteps && card.flowSteps.length > 0 ? (
                            <div
                              dir="ltr"
                              className="mt-2.5 flex flex-wrap items-center gap-1.5 text-left"
                            >
                              {card.flowSteps.map((st, sIdx) => (
                                <div
                                  key={`${st}-${sIdx}`}
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <span className="font-mono-code rounded-lg border border-[var(--border-soft)] bg-[var(--bg-canvas)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--text-primary)]">
                                    {st}
                                  </span>
                                  {sIdx < card.flowSteps!.length - 1 ? (
                                    <ArrowRight
                                      className="h-3.5 w-3.5 shrink-0"
                                      style={{ color: theme.dotBg }}
                                    />
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {showArabic && topArabic ? (
                            <div
                              dir="rtl"
                              className="mt-2.5 flex items-start gap-2 border-t border-dashed pt-2.5 text-right text-[13px] font-medium leading-[1.8] text-[var(--text-secondary)]"
                              style={{ borderColor: "var(--border-soft)" }}
                            >
                              <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>{topArabic}</span>
                            </div>
                          ) : null}
                        </div>

                        {/* 1-to-1 Paired English Point + Egyptian Arabic Explanation Underneath */}
                        {hasPairedPoints ? (
                          <div className="space-y-2.5">
                            {card.points!.map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]"
                              >
                                {/* English Point (Strict LTR) */}
                                <div
                                  dir="ltr"
                                  className="flex items-start gap-3 px-4 py-3 text-left"
                                >
                                  <span
                                    className="font-mono-code mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10.5px] font-black text-white"
                                    style={{ background: theme.dotBg }}
                                  >
                                    {pIdx + 1}
                                  </span>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <p className="font-en text-[13.5px] font-medium leading-[1.75] text-[var(--text-primary)]">
                                      <HighlightedEnglishText
                                        text={pt.en}
                                        leadClass={theme.leadClass}
                                      />
                                    </p>
                                  </div>
                                  {pt.tag ? (
                                    <span className="font-mono-code shrink-0 rounded-md border border-amber-500/30 bg-amber-500/12 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 dark:text-amber-300">
                                      {pt.tag}
                                    </span>
                                  ) : null}
                                </div>

                                {/* Immediate Egyptian Arabic Explanation for THIS exact point */}
                                {showArabic ? (
                                  <div
                                    dir="rtl"
                                    className="flex items-start gap-2 border-t px-4 py-2.5 text-right text-[12.5px] font-medium leading-[1.8]"
                                    style={{
                                      background:
                                        "color-mix(in srgb, var(--success-soft) 35%, var(--bg-canvas))",
                                      borderColor: "var(--border-soft)",
                                      color: "var(--text-secondary)",
                                    }}
                                  >
                                    <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <span>{pt.ar}</span>
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : card.enBullets && card.enBullets.length > 0 ? (
                          <ul className="space-y-2">
                            {card.enBullets.map((b, bIdx) => (
                              <li
                                key={bIdx}
                                dir="ltr"
                                className="font-en flex items-start gap-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-left text-[13px] leading-[1.75] text-[var(--text-primary)]"
                              >
                                <span
                                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                                  style={{ background: theme.dotBg }}
                                />
                                <span className="min-w-0 flex-1">
                                  <HighlightedEnglishText
                                    text={b}
                                    leadClass={theme.leadClass}
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Formulas & Worked Calculations */}
            {section.formulas && section.formulas.length > 0 ? (
              <div className="space-y-3">
                {section.formulas.map((f, fIdx) => (
                  <div
                    key={`${f.labelEn}-${fIdx}`}
                    className="overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/[0.08] via-indigo-500/[0.04] to-transparent"
                  >
                    <div dir="ltr" className="space-y-2.5 p-4 text-left sm:p-5">
                      <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                        <Calculator className="h-4 w-4 shrink-0" />
                        <span className="font-en">{f.labelEn}</span>
                      </div>
                      <div className="font-mono-code rounded-xl border border-violet-500/25 bg-[var(--bg-surface)] px-4 py-3 text-[13.5px] font-black text-[var(--text-primary)] shadow-2xs">
                        {f.formula}
                      </div>
                      {f.workedExampleEn ? (
                        <p className="font-en text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">
                          <strong className="text-violet-700 dark:text-violet-300">
                            Example:
                          </strong>{" "}
                          {f.workedExampleEn}
                        </p>
                      ) : null}
                    </div>

                    {showArabic ? (
                      <div
                        dir="rtl"
                        className="flex items-start gap-2 border-t border-violet-500/15 bg-[var(--bg-surface)] px-4 py-3 text-right text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:px-5"
                      >
                        <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{f.arNote}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {/* Clean Comparison Table */}
            {section.table ? (
              <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5
                    dir="ltr"
                    className="font-en text-left text-[14.5px] font-black text-[var(--text-primary)]"
                  >
                    {section.table.titleEn}
                  </h5>
                  {showArabic && section.table.titleAr ? (
                    <span
                      dir="rtl"
                      className="rounded-lg bg-[var(--bg-canvas)] px-2.5 py-1 text-[12px] font-bold text-[var(--text-secondary)]"
                    >
                      {section.table.titleAr}
                    </span>
                  ) : null}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[var(--border-soft)]">
                  <table className="w-full min-w-[540px] border-collapse text-[13px]">
                    <thead className="bg-indigo-600/[0.09] text-[var(--text-primary)]">
                      <tr>
                        {section.table.headers.map((h, hIdx) => {
                          if (!showArabic && h.dir === "rtl") return null;
                          return (
                            <th
                              key={hIdx}
                              dir={h.dir}
                              className={`border-b border-[var(--border-soft)] px-4 py-3 font-black ${
                                h.dir === "ltr"
                                  ? "font-en text-left"
                                  : "text-right"
                              }`}
                            >
                              {h.label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-soft)]">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={
                            rIdx % 2 === 1
                              ? "bg-[var(--bg-canvas)]/70"
                              : "bg-[var(--bg-surface)]"
                          }
                        >
                          {row.map((cell, cIdx) => {
                            if (!showArabic && cell.dir === "rtl") return null;
                            return (
                              <td
                                key={cIdx}
                                dir={cell.dir}
                                className={`px-4 py-3 align-top leading-relaxed ${
                                  cell.dir === "ltr"
                                    ? "font-en text-left"
                                    : "text-right"
                                } ${
                                  cell.highlight
                                    ? "bg-blue-500/[0.08] font-extrabold text-blue-700 dark:text-blue-300"
                                    : cIdx === 0
                                      ? "font-extrabold text-[var(--text-primary)]"
                                      : "text-[var(--text-secondary)]"
                                }`}
                              >
                                {cell.text}
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
      </div>

      {/* ==================== EXAM TRAPS & RAPID CHECKLIST ==================== */}
      {summary.examTraps.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.10] via-orange-500/[0.04] to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 px-5 py-4">
            <div className="flex items-center gap-2.5 text-[15px] font-black text-amber-800 dark:text-amber-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                <Target className="h-4 w-4" />
              </span>
              <span>
                أهم تريكات ونقاط الامتحان في Chapter {summary.chapterNum}
              </span>
            </div>

            {onGoToQuiz ? (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 px-4 py-1.5 text-[12px] font-extrabold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>اختبر نفسك في كويز الشابتر</span>
              </button>
            ) : null}
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {summary.examTraps.map((trap, tIdx) => (
              <div
                key={tIdx}
                className="overflow-hidden rounded-xl border border-amber-500/20 bg-[var(--bg-surface)]"
              >
                <div
                  dir="ltr"
                  className="font-en flex items-start gap-2.5 px-4 py-3 text-left text-[13.5px] font-bold leading-relaxed text-[var(--text-primary)]"
                >
                  <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{trap.en}</span>
                </div>
                {showArabic ? (
                  <div
                    dir="rtl"
                    className="flex items-start gap-2 border-t border-amber-500/15 bg-amber-500/[0.05] px-4 py-2.5 text-right text-[12.5px] font-semibold leading-relaxed text-[var(--text-secondary)]"
                  >
                    <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{trap.ar}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
