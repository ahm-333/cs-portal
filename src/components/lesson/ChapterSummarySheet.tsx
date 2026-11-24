"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
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

function getCardAccent(tone: SummaryConceptCard["tone"] = "neutral") {
  switch (tone) {
    case "brand":
      return {
        topBar: "color-mix(in srgb, var(--brand-primary) 55%, transparent)",
        badgeBg: "color-mix(in srgb, var(--brand-soft) 75%, transparent)",
        badgeFg: "var(--brand-soft-text)",
        dot: "var(--brand-primary)",
      };
    case "mint":
      return {
        topBar: "color-mix(in srgb, var(--success-fg) 52%, transparent)",
        badgeBg: "color-mix(in srgb, var(--success-soft) 75%, transparent)",
        badgeFg: "var(--success-fg)",
        dot: "var(--success-fg)",
      };
    case "warm":
      return {
        topBar: "color-mix(in srgb, var(--accent-warm) 55%, transparent)",
        badgeBg: "color-mix(in srgb, var(--accent-warm-soft) 75%, transparent)",
        badgeFg: "var(--accent-warm-text)",
        dot: "var(--accent-warm)",
      };
    default:
      return {
        topBar: "var(--border-strong)",
        badgeBg: "var(--bg-subtle)",
        badgeFg: "var(--text-secondary)",
        dot: "var(--brand-primary)",
      };
  }
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
    <div className="space-y-6">
      {/* ==================== EDITORIAL SUMMARY HERO CARD ==================== */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="border-b p-5 sm:p-6"
          style={{
            background:
              "color-mix(in srgb, var(--brand-soft) 32%, var(--bg-canvas))",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            {/* LTR English Title Block */}
            <div dir="ltr" className="min-w-0 flex-1 space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="font-mono-code inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  <Layers className="h-3 w-3" />
                  {summary.courseCode} · Chapter {summary.chapterNum}
                </span>
                <span
                  className="text-[11.5px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Comprehensive Study Sheet · {summary.sections.length} Sections
                </span>
              </div>

              <h3 className="font-en text-[19px] font-black leading-tight text-[var(--text-primary)] sm:text-[22px]">
                {summary.titleEn}
              </h3>

              <p
                className="font-en max-w-3xl text-[13.5px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {summary.overviewEn}
              </p>
            </div>

            {/* Arabic Toggle Control */}
            <button
              type="button"
              onClick={() => setShowArabic((prev) => !prev)}
              className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-bold transition-colors hover:opacity-85 cursor-pointer"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              {showArabic ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span>إخفاء العامية (اختبار نفسك)</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-[var(--success-fg)]" />
                  <span>إظهار التوضيح بالعامية</span>
                </>
              )}
            </button>
          </div>

          {showArabic ? (
            <p
              dir="rtl"
              className="mt-3 rounded-xl border px-3.5 py-2.5 text-right text-[13px] font-medium leading-relaxed"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              <span
                className="ml-1.5 font-extrabold"
                style={{ color: "var(--brand-primary)" }}
              >
                ملخص الشابتر ببساطة:
              </span>
              {summary.overviewAr}
            </p>
          ) : null}
        </div>

        {/* Quick-Jump Section Pills (Clean LTR Navigation) */}
        <div
          dir="ltr"
          className="flex items-center gap-1.5 overflow-x-auto px-4 py-3 sm:px-5"
          style={{ background: "var(--bg-surface)" }}
        >
          {summary.sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold transition-colors hover:border-[var(--border-strong)] cursor-pointer"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="font-mono-code text-[10.5px] font-extrabold"
                style={{ color: "var(--brand-primary)" }}
              >
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
            className="scroll-mt-24 space-y-4 rounded-2xl border p-4 sm:p-6"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Clean Section Header: LTR English Title + RTL Arabic Subtitle */}
            <div
              className="flex flex-col gap-2 border-b pb-3.5 sm:flex-row sm:items-end sm:justify-between"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div dir="ltr" className="flex items-start gap-3 text-left">
                <span
                  className="font-mono-code mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[12.5px] font-black"
                  style={{
                    background:
                      "color-mix(in srgb, var(--brand-soft) 80%, transparent)",
                    color: "var(--brand-soft-text)",
                  }}
                >
                  {section.number}
                </span>
                <div className="min-w-0">
                  <h4 className="font-en text-[16.5px] font-black leading-snug text-[var(--text-primary)] sm:text-[18px]">
                    {section.titleEn}
                  </h4>
                  {section.introEn ? (
                    <p
                      className="font-en mt-1 text-[13px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {section.introEn}
                    </p>
                  ) : null}
                </div>
              </div>

              {showArabic ? (
                <span
                  dir="rtl"
                  className="shrink-0 self-end rounded-lg px-2.5 py-1 text-[12px] font-bold sm:self-center"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {section.titleAr}
                </span>
              ) : null}
            </div>

            {showArabic && section.introAr ? (
              <p
                dir="rtl"
                className="rounded-xl px-3.5 py-2.5 text-right text-[13px] font-medium leading-relaxed"
                style={{
                  background: "var(--bg-canvas)",
                  color: "var(--text-secondary)",
                }}
              >
                {section.introAr}
              </p>
            ) : null}

            {/* Optional Visual Flow Banner (Always LTR so arrows point right!) */}
            {section.flowBanner ? (
              <div
                className="rounded-xl border p-4"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div
                  dir="ltr"
                  className="font-mono-code mb-2.5 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
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
                      <span
                        className="font-en rounded-lg border px-3 py-1.5 text-[12.5px] font-bold"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {step}
                      </span>
                      {idx < section.flowBanner!.steps.length - 1 ? (
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: "var(--brand-primary)" }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
                {showArabic && section.flowBanner.captionAr ? (
                  <p
                    dir="rtl"
                    className="mt-2.5 text-right text-[12.5px] font-medium leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {section.flowBanner.captionAr}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Concept Cards Grid (Clean 2-Column Editorial Layout) */}
            {section.cards && section.cards.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {section.cards.map((card, cIdx) => {
                  const accent = getCardAccent(card.tone);
                  const isWide =
                    (card.enBullets && card.enBullets.length >= 4) ||
                    (card.flowSteps && card.flowSteps.length >= 4);
                  return (
                    <div
                      key={`${card.term}-${cIdx}`}
                      className={`flex flex-col justify-between overflow-hidden rounded-xl border transition-colors ${
                        isWide ? "md:col-span-2" : ""
                      }`}
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      {/* Top Accent Hairline */}
                      <div
                        className="h-[2.5px] w-full"
                        style={{ background: accent.topBar }}
                      />

                      {/* LTR English Content */}
                      <div
                        dir="ltr"
                        className="flex-1 space-y-2.5 p-4 text-left"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="font-en text-[14.5px] font-extrabold leading-snug text-[var(--text-primary)]">
                            {card.term}
                          </h5>
                          {card.badge ? (
                            <span
                              className="font-mono-code rounded-md px-2 py-0.5 text-[10.5px] font-bold"
                              style={{
                                background: accent.badgeBg,
                                color: accent.badgeFg,
                              }}
                            >
                              {card.badge}
                            </span>
                          ) : null}
                        </div>

                        <p
                          className="font-en text-[13px] leading-[1.75]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {card.enSummary}
                        </p>

                        {card.flowSteps && card.flowSteps.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {card.flowSteps.map((st, sIdx) => (
                              <div
                                key={`${st}-${sIdx}`}
                                className="inline-flex items-center gap-1.5"
                              >
                                <span
                                  className="font-mono-code rounded-md border px-2 py-0.5 text-[11px] font-bold"
                                  style={{
                                    background: "var(--bg-surface)",
                                    borderColor: "var(--border-soft)",
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  {st}
                                </span>
                                {sIdx < card.flowSteps!.length - 1 ? (
                                  <ArrowRight
                                    className="h-3 w-3 shrink-0"
                                    style={{ color: accent.dot }}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {card.enBullets && card.enBullets.length > 0 ? (
                          <ul className="space-y-1.5 pt-1">
                            {card.enBullets.map((b, bIdx) => (
                              <li
                                key={bIdx}
                                className="font-en flex items-start gap-2 text-[12.5px] leading-[1.7]"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <span
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full opacity-80"
                                  style={{ background: accent.dot }}
                                />
                                <span className="min-w-0 flex-1">{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      {/* RTL Egyptian Arabic Calm Footer */}
                      {showArabic ? (
                        <div
                          dir="rtl"
                          className="border-t px-4 py-2.5 text-right text-[12.5px] leading-[1.75]"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span
                            className="ml-1.5 font-extrabold"
                            style={{ color: "var(--success-fg)" }}
                          >
                            ببساطة:
                          </span>
                          <span>{card.arNote}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Optional Formulas / Worked Calculations */}
            {section.formulas && section.formulas.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {section.formulas.map((f, fIdx) => (
                  <div
                    key={`${f.labelEn}-${fIdx}`}
                    className="overflow-hidden rounded-xl border"
                    style={{
                      background:
                        "color-mix(in srgb, var(--brand-soft) 32%, var(--bg-canvas))",
                      borderColor:
                        "color-mix(in srgb, var(--brand-primary) 20%, var(--border-soft))",
                    }}
                  >
                    <div dir="ltr" className="space-y-2 p-4 text-left">
                      <div
                        className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide"
                        style={{ color: "var(--brand-soft-text)" }}
                      >
                        <Calculator className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-en">{f.labelEn}</span>
                      </div>
                      <div
                        className="font-mono-code rounded-lg border px-3 py-2 text-[13px] font-extrabold"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {f.formula}
                      </div>
                      {f.workedExampleEn ? (
                        <p
                          className="font-en text-[12.5px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {f.workedExampleEn}
                        </p>
                      ) : null}
                    </div>

                    {showArabic ? (
                      <div
                        dir="rtl"
                        className="border-t px-4 py-2.5 text-right text-[12.5px] leading-relaxed"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span
                          className="ml-1.5 font-extrabold"
                          style={{ color: "var(--success-fg)" }}
                        >
                          ببساطة:
                        </span>
                        {f.arNote}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {/* Optional Structured Comparison Table (Proper per-column LTR/RTL!) */}
            {section.table ? (
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5
                    dir="ltr"
                    className="font-en text-left text-[13.5px] font-extrabold text-[var(--text-primary)]"
                  >
                    {section.table.titleEn}
                  </h5>
                  {showArabic && section.table.titleAr ? (
                    <span
                      dir="rtl"
                      className="text-[12px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {section.table.titleAr}
                    </span>
                  ) : null}
                </div>

                <div
                  className="overflow-x-auto rounded-xl border"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <table className="w-full min-w-[540px] border-collapse text-[12.5px]">
                    <thead
                      style={{
                        background: "var(--bg-subtle)",
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
                              className={`px-3.5 py-2.5 font-extrabold ${
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
                    <tbody
                      className="divide-y"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ borderColor: "var(--border-soft)" }}
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
                                    ? "font-extrabold text-[var(--brand-soft-text)]"
                                    : cIdx === 0
                                      ? "font-bold text-[var(--text-primary)]"
                                      : "text-[var(--text-secondary)]"
                                }`}
                                style={
                                  cell.highlight
                                    ? {
                                        background:
                                          "color-mix(in srgb, var(--brand-soft) 40%, transparent)",
                                      }
                                    : undefined
                                }
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
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            background:
              "color-mix(in srgb, var(--accent-warm-soft) 40%, var(--bg-surface))",
            borderColor:
              "color-mix(in srgb, var(--accent-warm) 22%, var(--border-soft))",
          }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3.5"
            style={{
              borderColor:
                "color-mix(in srgb, var(--accent-warm) 18%, var(--border-soft))",
            }}
          >
            <div
              className="flex items-center gap-2 text-[14px] font-black"
              style={{ color: "var(--accent-warm-text)" }}
            >
              <Target className="h-4 w-4 shrink-0" />
              <span>أهم تريكات ونقاط الامتحان في Chapter {summary.chapterNum}</span>
            </div>

            {onGoToQuiz ? (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                style={{ background: "var(--hero-bg)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>جرّب نفسك في الـ 15 سؤال</span>
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 sm:p-5">
            {summary.examTraps.map((trap, tIdx) => (
              <div
                key={tIdx}
                className="rounded-xl border p-3.5"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div
                  dir="ltr"
                  className="font-en flex items-start gap-2 text-left text-[13px] font-bold leading-relaxed text-[var(--text-primary)]"
                >
                  <BookOpenCheck
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--accent-warm)" }}
                  />
                  <span>{trap.en}</span>
                </div>
                {showArabic ? (
                  <p
                    dir="rtl"
                    className="mt-1.5 text-right text-[12px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {trap.ar}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
