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
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-wait disabled:opacity-80 ${
          isCompleted
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
            : "border-slate-700 bg-slate-900 text-slate-200 hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-indigo-200"
        }`}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <Circle className="h-4 w-4 text-slate-400" />
        )}
        <span>{isCompleted ? "تمت المذاكرة ✓" : "تحديد كمكتمل"}</span>
      </button>

      {errorMsg ? (
        <span className="text-xs text-rose-400" role="alert">
          {errorMsg}
        </span>
      ) : null}
    </div>
  );
}
