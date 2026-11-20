"use client";

import { BookOpen, Moon, Sun } from "lucide-react";
import {
  setThemeMode,
  useThemeMode,
  type ThemeMode,
} from "@/components/layout/themeStore";

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

const THEME_OPTIONS: ReadonlyArray<{
  mode: ThemeMode;
  label: string;
  icon: typeof Sun;
}> = [
  { mode: "light", label: "فاتح", icon: Sun },
  { mode: "reading", label: "قراءة", icon: BookOpen },
  { mode: "dark", label: "داكن", icon: Moon },
];

export function ThemeSwitcher({
  compact = false,
  className = "",
}: ThemeSwitcherProps) {
  const activeMode = useThemeMode();

  return (
    <div
      role="group"
      aria-label="اختيار مظهر القراءة"
      className={`inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--bg)] p-1 ${className}`}
    >
      {THEME_OPTIONS.map(({ mode, label, icon: Icon }) => {
        const active = activeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setThemeMode(mode)}
            aria-pressed={active}
            title={`وضع ${label}`}
            className={`inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all sm:px-3 ${
              active
                ? "bg-[var(--paper)] font-bold text-[var(--accent)] shadow-[var(--shadow-pill)]"
                : "font-medium text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className={compact ? "hidden md:inline" : "inline"}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
