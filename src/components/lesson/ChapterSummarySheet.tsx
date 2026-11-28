"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Eye,
  EyeOff,
  FileText,
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

function getToneAccent(tone: SummaryConceptCard["tone"] = "neutral") {
  switch (tone) {
    case "mint":
      return {
        rail: "var(--success-fg)",
        softBg: "var(--success-soft)",
        softFg: "var(--success-fg)",
        border: "color-mix(in srgb, var(--success-fg) 28%, var(--border-soft))",
      };
    case "warm":
      return {
        rail: "var(--accent-warm)",
        softBg: "var(--accent-warm-soft)",
        softFg: "var(--accent-warm-text)",
        border: "color-mix(in srgb, var(--accent-warm) 30%, var(--border-soft))",
      };
    case "brand":
      return {
        rail: "var(--brand-primary)",
        softBg: "var(--brand-soft)",
        softFg: "var(--brand-soft-text)",
        border: "color-mix(in srgb, var(--brand-primary) 26%, var(--border-soft))",
      };
    default:
      return {
        rail: "var(--accent-warm)",
        softBg: "var(--brand-soft)",
        softFg: "var(--brand-soft-text)",
        border: "var(--border-soft)",
      };
  }
}

/**
 * Highlights key term before ":" with a refined Atelier accent pill
 */
function DossierEnglishLine({
  text,
  softBg,
  softFg,
}: {
  text: string;
  softBg: string;
  softFg: string;
}) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 1 && colonIdx <= 48) {
    const lead = text.slice(0, colonIdx);
    const rest = text.slice(colonIdx + 1);
    return (
      <>
        <span
          className="inline rounded-md px-1.5 py-0.5 font-extrabold"
          style={{
            background: softBg,
            color: softFg,
          }}
        >
          {lead}:
        </span>
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
    <div className="mx-auto max-w-[1060px] space-y-4">
      {/* ==================== ATELIER NAVIGATION CHIPS + DOSSIER CONTROLS ==================== */}
      <div
        className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border px-3 py-2.5 sm:px-4"
        style={{
          background: "var(--bg-canvas)",
          borderColor: "var(--border-soft)",
        }}
      >
        {/* Clean Section Navigation Chips */}
        <div
          dir="ltr"
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5"
        >
          {summary.sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-all hover:border-[var(--border-strong)] cursor-pointer"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="font-mono-code rounded px-1.5 py-0.5 text-[10px] font-black"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                {sec.number}
              </span>
              <span className="font-en max-w-[165px] truncate">
                {sec.titleEn}
              </span>
            </button>
          ))}
          {summary.examTraps.length > 0 ? (
            <button
              type="button"
              onClick={() => scrollToSection("exam-traps")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11.5px] font-extrabold transition-all hover:opacity-90 cursor-pointer"
              style={{
                background: "var(--accent-warm-soft)",
                borderColor:
                  "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                color: "var(--accent-warm-text)",
              }}
            >
              <Target className="h-3.5 w-3.5 shrink-0" />
              <span>تريكات الامتحان</span>
            </button>
          ) : null}
        </div>

        {/* Dossier Controls: Toggle Arabic Explanation + Print PDF */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowArabic((prev) => !prev)}
            aria-pressed={showArabic}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[11.5px] font-bold transition-colors hover:border-[var(--border-strong)] cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            {showArabic ? (
              <>
                <EyeOff
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--text-muted)" }}
                />
                <span>إخفاء الشرح العربي</span>
              </>
            ) : (
              <>
                <Eye
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--success-fg)" }}
                />
                <span>إظهار الشرح العربي</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            title="طباعة أو حفظ الملخص كـ PDF"
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[11.5px] font-bold transition-colors hover:border-[var(--border-strong)] cursor-pointer"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
            }}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* ==================== ATELIER REVISION DOSSIER HEADER ==================== */}
      <div
        className="sapphire-rim relative overflow-hidden rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-soft)",
          boxShadow: "var(--shadow-card)",
          borderRightWidth: "3.5px",
          borderRightColor: "var(--accent-warm)",
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div dir="ltr" className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono-code inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-black"
                style={{
                  background: "var(--accent-warm-soft)",
                  borderColor:
                    "color-mix(in srgb, var(--accent-warm) 32%, transparent)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <FileText className="h-3 w-3" />
                {summary.courseCode} · CH.{summary.chapterNum} REVISION DOSSIER
              </span>
              <span
                className="font-signature text-[15px]"
                style={{ color: "var(--accent-warm)" }}
              >
                Eng. Ahmed Amir
              </span>
            </div>

            <h2
              className="font-en text-[20px] sm:text-[24px] font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {summary.titleEn}
            </h2>
          </div>

          {showArabic ? (
            <div
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[12.5px] font-extrabold"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              <BookOpen
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "var(--success-fg)" }}
              />
              <span>ملخص: {summary.titleAr}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ==================== LAYERED ATELIER DOSSIER SECTIONS ==================== */}
      <div className="space-y-5">
        {summary.sections.map((section, sectionIdx) => {
          const isEmeraldSection = sectionIdx % 2 === 1;
          const sectionAccent = isEmeraldSection
            ? "var(--success-fg)"
            : "var(--accent-warm)";
          const sectionSoftBg = isEmeraldSection
            ? "var(--success-soft)"
            : "var(--accent-warm-soft)";
          const sectionSoftFg = isEmeraldSection
            ? "var(--success-fg)"
            : "var(--accent-warm-text)";

          return (
            <section
              key={section.id}
              id={`summary-sec-${summary.chapterNum}-${section.id}`}
              className="scroll-mt-24 overflow-hidden rounded-2xl border"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                boxShadow: "var(--shadow-card)",
                borderRightWidth: "3px",
                borderRightColor: sectionAccent,
              }}
            >
              {/* Section Header */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3.5 sm:px-6"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div dir="ltr" className="flex items-center gap-2.5 text-left">
                  <span
                    className="font-mono-code inline-flex h-7 min-w-[32px] items-center justify-center rounded-lg px-2 text-[11.5px] font-black"
                    style={{
                      background: sectionSoftBg,
                      color: sectionSoftFg,
                    }}
                  >
                    #{section.number}
                  </span>
                  <h3
                    className="font-en text-[16.5px] sm:text-[18.5px] font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {section.titleEn}
                  </h3>
                </div>
                {showArabic ? (
                  <span
                    className="text-[12.5px] font-extrabold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {section.titleAr}
                  </span>
                ) : null}
              </div>

              <div className="space-y-5 p-4 sm:p-6">
                {/* Architectural Flow Diagram */}
                {section.flowBanner ? (
                  <div
                    className="space-y-2.5 rounded-xl border p-4"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      dir="ltr"
                      className="font-mono-code text-left text-[10.5px] font-black uppercase tracking-wider"
                      style={{ color: "var(--accent-warm)" }}
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
                            className="font-en rounded-lg border px-3 py-1 text-[12.5px] font-extrabold"
                            style={{
                              background: "var(--bg-surface)",
                              borderColor: "var(--border-strong)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {step}
                          </span>
                          {idx < section.flowBanner!.steps.length - 1 ? (
                            <ArrowRight
                              className="h-4 w-4 shrink-0"
                              style={{ color: "var(--accent-warm)" }}
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                    {showArabic && section.flowBanner.captionAr ? (
                      <p
                        dir="rtl"
                        className="text-right text-[13px] font-semibold leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {section.flowBanner.captionAr}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {/* Layered Concept Cards */}
                {section.cards && section.cards.length > 0 ? (
                  <div className="space-y-4">
                    {section.cards.map((card, cIdx) => {
                      const tone = getToneAccent(card.tone);
                      const hasPairedPoints =
                        Array.isArray(card.points) && card.points.length > 0;
                      const topArabic =
                        card.arSummary ||
                        (!hasPairedPoints ? card.arNote : undefined);

                      return (
                        <div
                          key={`${card.term}-${cIdx}`}
                          className="space-y-3 rounded-xl border p-4 sm:p-5"
                          style={{
                            background: "var(--bg-canvas)",
                            borderColor: "var(--border-soft)",
                            borderRightWidth: "2.5px",
                            borderRightColor: tone.rail,
                          }}
                        >
                          {/* Concept Term Header */}
                          <div
                            dir="ltr"
                            className="flex flex-wrap items-center gap-2 text-left"
                          >
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: tone.rail }}
                            />
                            <h4
                              className="font-en text-[15px] sm:text-[16.5px] font-black"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {card.term}
                            </h4>
                            {card.badge ? (
                              <span
                                className="font-mono-code rounded-md border px-2 py-0.5 text-[10.5px] font-bold"
                                style={{
                                  background: "var(--bg-subtle)",
                                  borderColor: "var(--border-soft)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {card.badge}
                              </span>
                            ) : null}
                          </div>

                          {/* Core Definition + Arabic Explanation */}
                          <div className="space-y-1.5">
                            <p
                              dir="ltr"
                              className="font-en text-left text-[14px] font-semibold leading-[1.85]"
                              style={{ color: "var(--text-primary)" }}
                            >
                              <DossierEnglishLine
                                text={card.enSummary}
                                softBg={tone.softBg}
                                softFg={tone.softFg}
                              />
                            </p>
                            {showArabic && topArabic ? (
                              <p
                                dir="rtl"
                                className="rounded-lg border px-3 py-2 text-right text-[13px] font-semibold leading-[1.85]"
                                style={{
                                  background: "var(--bg-surface)",
                                  borderColor: "var(--border-soft)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {topArabic}
                              </p>
                            ) : null}
                          </div>

                          {/* Optional Inline Flow */}
                          {card.flowSteps && card.flowSteps.length > 0 ? (
                            <div
                              dir="ltr"
                              className="flex flex-wrap items-center gap-1.5 text-left"
                            >
                              {card.flowSteps.map((st, sIdx) => (
                                <div
                                  key={`${st}-${sIdx}`}
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <span
                                    className="font-mono-code rounded-md border px-2.5 py-0.5 text-[11.5px] font-bold"
                                    style={{
                                      borderColor: "var(--border-strong)",
                                      background: "var(--bg-surface)",
                                      color: "var(--text-primary)",
                                    }}
                                  >
                                    {st}
                                  </span>
                                  {sIdx < card.flowSteps!.length - 1 ? (
                                    <ArrowRight
                                      className="h-3.5 w-3.5 shrink-0"
                                      style={{ color: "var(--text-muted)" }}
                                    />
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {/* Paired Bilingual Points */}
                          {hasPairedPoints ? (
                            <ul className="space-y-3 pt-1">
                              {card.points!.map((pt, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="space-y-1.5 rounded-xl border p-3"
                                  style={{
                                    background: "var(--bg-surface)",
                                    borderColor: "var(--border-soft)",
                                  }}
                                >
                                  <div
                                    dir="ltr"
                                    className="flex items-start gap-2.5 text-left"
                                  >
                                    <span
                                      className="font-mono-code mt-0.5 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded px-1 text-[10.5px] font-black"
                                      style={{
                                        background: tone.softBg,
                                        color: tone.softFg,
                                      }}
                                    >
                                      {String(pIdx + 1).padStart(2, "0")}
                                    </span>
                                    <p
                                      className="font-en min-w-0 flex-1 text-[13.5px] sm:text-[14px] font-medium leading-[1.8]"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      <DossierEnglishLine
                                        text={pt.en}
                                        softBg={tone.softBg}
                                        softFg={tone.softFg}
                                      />
                                    </p>
                                    {pt.tag ? (
                                      <span
                                        className="shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-black"
                                        style={{
                                          background: "var(--accent-warm-soft)",
                                          borderColor:
                                            "color-mix(in srgb, var(--accent-warm) 35%, transparent)",
                                          color: "var(--accent-warm-text)",
                                        }}
                                      >
                                        ★ {pt.tag}
                                      </span>
                                    ) : null}
                                  </div>

                                  {showArabic ? (
                                    <p
                                      dir="rtl"
                                      className="border-t pt-1.5 text-right text-[12.5px] sm:text-[13px] font-semibold leading-[1.8]"
                                      style={{
                                        borderColor: "var(--border-soft)",
                                        color: "var(--text-secondary)",
                                      }}
                                    >
                                      {pt.ar}
                                    </p>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          ) : card.enBullets && card.enBullets.length > 0 ? (
                            <ul className="space-y-2 pt-1">
                              {card.enBullets.map((b, bIdx) => (
                                <li
                                  key={bIdx}
                                  dir="ltr"
                                  className="font-en flex items-start gap-2.5 text-left text-[13.5px] leading-[1.8]"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  <span
                                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: tone.rail }}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <DossierEnglishLine
                                      text={b}
                                      softBg={tone.softBg}
                                      softFg={tone.softFg}
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

                {/* Architectural Formulas Block */}
                {section.formulas && section.formulas.length > 0 ? (
                  <div className="space-y-3">
                    {section.formulas.map((f, fIdx) => (
                      <div
                        key={`${f.labelEn}-${fIdx}`}
                        className="space-y-2 rounded-xl border p-4 sm:p-5"
                        style={{
                          background:
                            "color-mix(in srgb, var(--accent-warm-soft) 35%, var(--bg-canvas))",
                          borderColor:
                            "color-mix(in srgb, var(--accent-warm) 30%, var(--border-soft))",
                          borderRightWidth: "3px",
                          borderRightColor: "var(--accent-warm)",
                        }}
                      >
                        <div
                          dir="ltr"
                          className="flex items-center gap-1.5 text-left text-[11px] font-black uppercase tracking-wider"
                          style={{ color: "var(--accent-warm-text)" }}
                        >
                          <Calculator className="h-3.5 w-3.5 shrink-0" />
                          <span className="font-mono-code">
                            Formula · {f.labelEn}
                          </span>
                        </div>
                        <div
                          dir="ltr"
                          className="font-mono-code rounded-lg border px-3.5 py-2.5 text-left text-[13.5px] sm:text-[14.5px] font-black"
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
                            dir="ltr"
                            className="font-en text-left text-[13px] font-medium leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <strong style={{ color: "var(--text-primary)" }}>
                              Ex:
                            </strong>{" "}
                            {f.workedExampleEn}
                          </p>
                        ) : null}
                        {showArabic ? (
                          <p
                            dir="rtl"
                            className="pt-0.5 text-right text-[13px] font-semibold leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
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
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h5
                        dir="ltr"
                        className="font-en text-left text-[14px] font-black"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {section.table.titleEn}
                      </h5>
                      {showArabic && section.table.titleAr ? (
                        <span
                          className="text-[12px] font-bold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {section.table.titleAr}
                        </span>
                      ) : null}
                    </div>

                    <div
                      className="overflow-x-auto rounded-xl border"
                      style={{
                        borderColor: "var(--border-soft)",
                        background: "var(--bg-canvas)",
                      }}
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
                                  className={`border-b px-3.5 py-2.5 font-black ${
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
                              className="transition-colors hover:bg-[var(--bg-hover)]"
                              style={{ borderColor: "var(--border-soft)" }}
                            >
                              {row.map((cell, cIdx) => {
                                if (!showArabic && cell.dir === "rtl")
                                  return null;
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
                                          : "text-[var(--text-secondary)] font-medium"
                                    }`}
                                  >
                                    {cell.highlight ? (
                                      <span
                                        className="rounded-md px-1.5 py-0.5 font-extrabold"
                                        style={{
                                          background: "var(--accent-warm-soft)",
                                          color: "var(--accent-warm-text)",
                                        }}
                                      >
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
              </div>
            </section>
          );
        })}

        {/* ==================== EXAM TRAPS ARCHITECTURAL CALLOUT ==================== */}
        {summary.examTraps.length > 0 ? (
          <section
            id={`summary-sec-${summary.chapterNum}-exam-traps`}
            className="scroll-mt-24"
          >
            <div
              className="sapphire-rim space-y-4 rounded-2xl border p-5 sm:p-6"
              style={{
                background:
                  "color-mix(in srgb, var(--accent-warm-soft) 50%, var(--bg-surface))",
                borderColor:
                  "color-mix(in srgb, var(--accent-warm) 36%, var(--border-soft))",
                borderRightWidth: "3.5px",
                borderRightColor: "var(--accent-warm)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "var(--accent-warm-soft)",
                      color: "var(--accent-warm-text)",
                    }}
                  >
                    <Target className="h-4 w-4" />
                  </span>
                  <div>
                    <div
                      className="font-mono-code text-[10.5px] font-black uppercase tracking-wider"
                      style={{ color: "var(--accent-warm-text)" }}
                    >
                      EXAM TRAPS · CHAPTER {summary.chapterNum}
                    </div>
                    <h3
                      className="text-[15.5px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      تريكات الامتحان — ركّز قبل ما تحل
                    </h3>
                  </div>
                </div>

                {onGoToQuiz ? (
                  <button
                    type="button"
                    onClick={onGoToQuiz}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-extrabold transition-opacity hover:opacity-92 cursor-pointer"
                    style={{
                      background: "var(--atelier-cta-bg)",
                      color: "var(--atelier-cta-fg)",
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>اختبر نفسك ←</span>
                  </button>
                ) : null}
              </div>

              <ul className="space-y-2.5">
                {summary.examTraps.map((trap, tIdx) => (
                  <li
                    key={tIdx}
                    className="space-y-1 rounded-xl border p-3.5"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div
                      dir="ltr"
                      className="font-en flex items-start gap-2 text-left text-[13.5px] font-extrabold leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span
                        className="font-mono-code mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-black"
                        style={{
                          background: "var(--accent-warm-soft)",
                          color: "var(--accent-warm-text)",
                        }}
                      >
                        !
                      </span>
                      <span className="min-w-0 flex-1">{trap.en}</span>
                    </div>
                    {showArabic ? (
                      <p
                        dir="rtl"
                        className="pr-1 text-right text-[12.5px] font-semibold leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {trap.ar}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : onGoToQuiz ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onGoToQuiz}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-extrabold transition-opacity hover:opacity-92 cursor-pointer"
              style={{
                background: "var(--atelier-cta-bg)",
                color: "var(--atelier-cta-fg)",
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>اختبر نفسك ←</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
