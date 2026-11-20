"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface CompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onToggle: (nextCompleted: boolean) => void;
}

export default function CompleteButton({
  lessonId,
  isCompleted,
  onToggle,
}: CompleteButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    if (isSaving) return;

    const previousState = isCompleted;
    const nextState = !isCompleted;

    setErrorMsg(null);
    onToggle(nextState);
    setIsSaving(true);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          is_completed: nextState,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch {
      onToggle(previousState);
      setErrorMsg("تعذّر حفظ التقدم، حاول مرة أخرى");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSaving}
        aria-pressed={isCompleted}
        className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all disabled:cursor-wait disabled:opacity-80 ${
          isCompleted
            ? "border-[var(--pos)]/40 bg-[var(--pos-soft)] text-[var(--pos)] hover:border-[var(--pos)]"
            : "border-[var(--line-strong)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)]"
        }`}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4 text-[var(--muted)]" />
        )}
        <span>{isCompleted ? "تمت المذاكرة ✓" : "تحديد كمكتمل"}</span>
      </button>

      {errorMsg ? (
        <span className="text-xs font-medium text-[var(--neg)]" role="alert">
          {errorMsg}
        </span>
      ) : null}
    </div>
  );
}
