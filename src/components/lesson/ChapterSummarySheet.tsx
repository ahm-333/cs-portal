"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  Eye,
  EyeOff,
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

function getToneAccent(tone: SummaryConceptCard["tone"] = "neutral") {
  switch (tone) {
    case "brand":
      return {
        bar: "#2563eb",
        lead: "text-blue-700 dark:text-blue-300",
        pill: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      };
    case "mint":
      return {
        bar: "#059669",
        lead: "text-emerald-700 dark:text-emerald-300",
        pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      };
    case "warm":
      return {
        bar: "#c25e33",
        lead: "text-amber-800 dark:text-amber-300",
        pill: "bg-amber-500/12 text-amber-800 dark:text-amber-300",
      };
    default:
      return {
        bar: "#6366f1",
        lead: "text-indigo-700 dark:text-indigo-300",
        pill: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      };
  }
}

function HighlightedEnglishText({
  text,
  leadClass,
}: {
  text: string;
  leadClass: string;
}) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 1 && colonIdx <= 48) {
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
  const [activeSecId, setActiveSecId] = useState<string>(
    summary.sections[0]?.id ?? ""
  );

  function scrollToSection(sectionId: string) {
    setActiveSecId(sectionId);
    const el = document.getElementById(
      `summary-sec-${summary.chapterNum}-${sectionId}`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Mobile / Tablet Compact Top Bar (< xl) */}
      <div
        className="mb-5 flex items-center justify-between gap-2 border-b pb-3 xl:hidden"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div
          dir="ltr"
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto hide-scrollbar"
        >
          {summary.sections.map((sec) => {
            const active = activeSecId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold transition-colors cursor-pointer"
                style={
                  active
                    ? {
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }
                    : {
                        background: "var(--bg-canvas)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                <span className="font-mono-code text-[10px] font-black opacity-75">
                  {sec.number}
                </span>
                <span className="font-en">{sec.titleEn}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowArabic((prev) => !prev)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[11.5px] font-bold transition-colors cursor-pointer"
          style={{
            background: "var(--bg-canvas)",
            borderColor: "var(--border-soft)",
            color: "var(--text-primary)",
          }}
        >
          {showArabic ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span>إخفاء العامية</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-[var(--success-fg)]" />
              <span>إظهار العامية</span>
            </>
          )}
        </button>
      </div>

      {/* Spacious Editorial Grid: Quiet Sticky Outline (xl) + Clean Reading Paper */}
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        {/* Right Sticky Mini Outline (Desktop >= xl — Notion / Docs Style) */}
        <aside className="hidden xl:sticky xl:top-24 xl:col-span-3 xl:block">
          <div className="space-y-4 pl-2">
            <div className="space-y-1">
              <div className="text-[11px] font-extrabold tracking-wide text-[var(--text-muted)]">
                فهرس الملخص
              </div>
              <nav className="space-y-1">
                {summary.sections.map((sec) => {
                  const active = activeSecId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-right transition-colors cursor-pointer"
                      style={
                        active
                          ? {
                              background: "var(--brand-soft)",
                              color: "var(--brand-soft-text)",
                            }
                          : {
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      <span className="font-mono-code mt-0.5 text-[10.5px] font-black opacity-70">
                        {sec.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          dir="ltr"
                          className="font-en block truncate text-left text-[12px] font-bold"
                        >
                          {sec.titleEn}
                        </span>
                        <span className="block truncate text-[11px] opacity-75">
                          {sec.titleAr}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {summary.examTraps.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => scrollToSection("exam-traps")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-[12px] font-bold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/10 cursor-pointer"
                  >
                    <Target className="h-3.5 w-3.5 shrink-0" />
                    <span>تريكات الامتحان ({summary.examTraps.length})</span>
                  </button>
                ) : null}
              </nav>
            </div>

            <div
              className="border-t pt-4 space-y-2.5"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <button
                type="button"
                onClick={() => setShowArabic((prev) => !prev)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-bold transition-colors hover:opacity-85 cursor-pointer"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                {showArabic ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span>إخفاء العامية (اختبار)</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-[var(--success-fg)]" />
                    <span>إظهار الشرح بالعامية</span>
                  </>
                )}
              </button>

              {onGoToQuiz ? (
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{ background: "var(--hero-bg)" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>ابدأ كويز الشابتر</span>
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {/* Main Clean Reading Column — Open, Calm, Zero Box-Inside-Box Clutter */}
        <div className="space-y-10 xl:col-span-9 xl:max-w-[880px]">
          {summary.sections.map((section) => (
            <section
              key={section.id}
              id={`summary-sec-${summary.chapterNum}-${section.id}`}
              className="scroll-mt-24 space-y-6"
            >
              {/* Clean Editorial Section Heading (No Outer Box!) */}
              <div
                className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div dir="ltr" className="flex items-baseline gap-2.5 text-left">
                  <span className="font-mono-code text-[12px] font-black text-[var(--brand-primary)] opacity-80">
                    {section.number}
                  </span>
                  <h3 className="font-en text-[18px] sm:text-[21px] font-black tracking-tight text-[var(--text-primary)]">
                    {section.titleEn}
                  </h3>
                </div>
                {showArabic ? (
                  <span className="text-[12.5px] font-bold text-[var(--text-muted)]">
                    {section.titleAr}
                  </span>
                ) : null}
              </div>

              {/* Quiet Visual Flow Strip */}
              {section.flowBanner ? (
                <div
                  className="rounded-2xl px-4 py-3.5 sm:px-5"
                  style={{ background: "var(--bg-canvas)" }}
                >
                  <div
                    dir="ltr"
                    className="font-mono-code mb-2.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)]"
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
                          className="font-en rounded-lg border px-3 py-1 text-[12.5px] font-bold text-[var(--text-primary)]"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--border-soft)",
                          }}
                        >
                          {step}
                        </span>
                        {idx < section.flowBanner!.steps.length - 1 ? (
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--brand-primary)] opacity-70" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {showArabic && section.flowBanner.captionAr ? (
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                      {section.flowBanner.captionAr}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Clean Flat Concept Blocks (1-to-1 Paired English + Arabic — NO nested box soup!) */}
              {section.cards && section.cards.length > 0 ? (
                <div className="space-y-7">
                  {section.cards.map((card, cIdx) => {
                    const accent = getToneAccent(card.tone);
                    const hasPairedPoints =
                      Array.isArray(card.points) && card.points.length > 0;
                    const topArabic =
                      card.arSummary ||
                      (!hasPairedPoints ? card.arNote : undefined);

                    return (
                      <div key={`${card.term}-${cIdx}`} className="space-y-3.5">
                        {/* Concept Title with Subtle Left Bar */}
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center gap-2.5 pl-3 text-left"
                          style={{ borderLeft: `3px solid ${accent.bar}` }}
                        >
                          <h4 className="font-en text-[15.5px] sm:text-[16.5px] font-extrabold text-[var(--text-primary)]">
                            {card.term}
                          </h4>
                          {card.badge ? (
                            <span
                              className={`font-mono-code rounded-md px-2 py-0.5 text-[10.5px] font-bold ${accent.pill}`}
                            >
                              {card.badge}
                            </span>
                          ) : null}
                        </div>

                        {/* Core Definition (English + Calm Arabic Directly Underneath) */}
                        <div className="space-y-1.5 pl-3">
                          <p
                            dir="ltr"
                            className="font-en text-left text-[14.5px] font-medium leading-[1.8] text-[var(--text-primary)]"
                          >
                            <HighlightedEnglishText
                              text={card.enSummary}
                              leadClass={accent.lead}
                            />
                          </p>
                          {showArabic && topArabic ? (
                            <p
                              dir="rtl"
                              className="text-right text-[13px] leading-[1.8] text-[var(--text-secondary)]"
                            >
                              {topArabic}
                            </p>
                          ) : null}
                        </div>

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
                                  className="font-mono-code rounded-md border px-2.5 py-0.5 text-[11.5px] font-bold text-[var(--text-primary)]"
                                  style={{
                                    background: "var(--bg-canvas)",
                                    borderColor: "var(--border-soft)",
                                  }}
                                >
                                  {st}
                                </span>
                                {sIdx < card.flowSteps!.length - 1 ? (
                                  <ArrowRight className="h-3 w-3 shrink-0 opacity-60" />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {/* Clean Hairline-Separated 1-to-1 Bilingual Points List */}
                        {hasPairedPoints ? (
                          <div
                            className="divide-y rounded-2xl border px-4 sm:px-5"
                            style={{
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                            }}
                          >
                            {card.points!.map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                className="space-y-1.5 py-3.5 first:pt-4 last:pb-4"
                                style={{ borderColor: "var(--border-soft)" }}
                              >
                                {/* English Point (Strict LTR, Crisp Contrast) */}
                                <div
                                  dir="ltr"
                                  className="flex items-start gap-2.5 text-left"
                                >
                                  <span
                                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: accent.bar }}
                                  />
                                  <p className="font-en min-w-0 flex-1 text-[14px] leading-[1.75] text-[var(--text-primary)]">
                                    <HighlightedEnglishText
                                      text={pt.en}
                                      leadClass={accent.lead}
                                    />
                                  </p>
                                  {pt.tag ? (
                                    <span className="font-mono-code shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                                      {pt.tag}
                                    </span>
                                  ) : null}
                                </div>

                                {/* Egyptian Arabic Directly Underneath (Soft, Calm, No Heavy Box!) */}
                                {showArabic ? (
                                  <p
                                    dir="rtl"
                                    className="pr-3 text-right text-[13px] leading-[1.85] text-[var(--text-secondary)]"
                                    style={{
                                      borderRight:
                                        "2px solid color-mix(in srgb, var(--success-fg) 35%, transparent)",
                                    }}
                                  >
                                    {pt.ar}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : card.enBullets && card.enBullets.length > 0 ? (
                          <ul
                            className="divide-y rounded-2xl border px-4 sm:px-5"
                            style={{
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                            }}
                          >
                            {card.enBullets.map((b, bIdx) => (
                              <li
                                key={bIdx}
                                dir="ltr"
                                className="font-en flex items-start gap-2.5 py-3 text-left text-[13.5px] leading-[1.75] text-[var(--text-primary)]"
                                style={{ borderColor: "var(--border-soft)" }}
                              >
                                <span
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: accent.bar }}
                                />
                                <span className="min-w-0 flex-1">
                                  <HighlightedEnglishText
                                    text={b}
                                    leadClass={accent.lead}
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

              {/* Formulas Callout */}
              {section.formulas && section.formulas.length > 0 ? (
                <div className="space-y-3">
                  {section.formulas.map((f, fIdx) => (
                    <div
                      key={`${f.labelEn}-${fIdx}`}
                      className="rounded-2xl border px-4 py-4 sm:px-5 space-y-2.5"
                      style={{
                        background:
                          "color-mix(in srgb, var(--brand-soft) 35%, var(--bg-canvas))",
                        borderColor:
                          "color-mix(in srgb, var(--brand-primary) 18%, var(--border-soft))",
                      }}
                    >
                      <div
                        dir="ltr"
                        className="flex items-center gap-1.5 text-left text-[11.5px] font-extrabold uppercase tracking-wide text-[var(--brand-soft-text)]"
                      >
                        <Calculator className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-en">{f.labelEn}</span>
                      </div>
                      <div
                        dir="ltr"
                        className="font-mono-code rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] font-black text-[var(--text-primary)]"
                        style={{
                          background: "var(--bg-surface)",
                          borderColor: "var(--border-soft)",
                        }}
                      >
                        {f.formula}
                      </div>
                      {f.workedExampleEn ? (
                        <p
                          dir="ltr"
                          className="font-en text-left text-[13px] leading-relaxed text-[var(--text-secondary)]"
                        >
                          {f.workedExampleEn}
                        </p>
                      ) : null}
                      {showArabic ? (
                        <p
                          dir="rtl"
                          className="pr-3 text-right text-[13px] leading-relaxed text-[var(--text-secondary)]"
                          style={{
                            borderRight:
                              "2px solid color-mix(in srgb, var(--success-fg) 40%, transparent)",
                          }}
                        >
                          {f.arNote}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Clean Comparison Table */}
              {section.table ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h5
                      dir="ltr"
                      className="font-en text-left text-[14px] font-extrabold text-[var(--text-primary)]"
                    >
                      {section.table.titleEn}
                    </h5>
                    {showArabic && section.table.titleAr ? (
                      <span className="text-[12px] font-semibold text-[var(--text-muted)]">
                        {section.table.titleAr}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className="overflow-x-auto rounded-2xl border"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <table className="w-full min-w-[520px] border-collapse text-[13px]">
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
                                className={`border-b px-4 py-2.5 font-extrabold ${
                                  h.dir === "ltr"
                                    ? "font-en text-left"
                                    : "text-right"
                                }`}
                                style={{ borderColor: "var(--border-soft)" }}
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
                            style={{
                              background:
                                rIdx % 2 === 1
                                  ? "var(--bg-canvas)"
                                  : "var(--bg-surface)",
                              borderColor: "var(--border-soft)",
                            }}
                          >
                            {row.map((cell, cIdx) => {
                              if (!showArabic && cell.dir === "rtl") return null;
                              return (
                                <td
                                  key={cIdx}
                                  dir={cell.dir}
                                  className={`px-4 py-2.5 align-top leading-relaxed ${
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

          {/* Calm Exam Traps Final Checklist */}
          {summary.examTraps.length > 0 ? (
            <section
              id={`summary-sec-${summary.chapterNum}-exam-traps`}
              className="scroll-mt-24 rounded-2xl border p-5 sm:p-6 space-y-4"
              style={{
                background:
                  "color-mix(in srgb, var(--accent-warm-soft) 35%, var(--bg-canvas))",
                borderColor:
                  "color-mix(in srgb, var(--accent-warm) 22%, var(--border-soft))",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[15px] font-black text-[var(--accent-warm-text)]">
                  <Target className="h-4 w-4 shrink-0" />
                  <span>أهم تريكات الامتحان — Chapter {summary.chapterNum}</span>
                </div>
                {onGoToQuiz ? (
                  <button
                    type="button"
                    onClick={onGoToQuiz}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-extrabold text-white transition-opacity hover:opacity-95 cursor-pointer xl:hidden"
                    style={{ background: "var(--hero-bg)" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>ابدأ الكويز</span>
                  </button>
                ) : null}
              </div>

              <div
                className="divide-y"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--accent-warm) 16%, var(--border-soft))",
                }}
              >
                {summary.examTraps.map((trap, tIdx) => (
                  <div
                    key={tIdx}
                    className="space-y-1 py-3 first:pt-1 last:pb-0"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--accent-warm) 16%, var(--border-soft))",
                    }}
                  >
                    <div
                      dir="ltr"
                      className="font-en flex items-start gap-2 text-left text-[13.5px] font-bold leading-relaxed text-[var(--text-primary)]"
                    >
                      <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-warm)]" />
                      <span>{trap.en}</span>
                    </div>
                    {showArabic ? (
                      <p
                        dir="rtl"
                        className="pr-3 text-right text-[12.5px] leading-relaxed text-[var(--text-secondary)]"
                      >
                        {trap.ar}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
