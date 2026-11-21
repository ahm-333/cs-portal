"use client";

import { Moon, Sun } from "lucide-react";
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
      className={`inline-flex items-center rounded-xl border p-1 ${className}`}
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-soft)",
      }}
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
            className={`inline-flex min-h-[30px] items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all cursor-pointer sm:px-3 ${
              active ? "font-bold shadow-xs" : "font-medium hover:opacity-85"
            }`}
            style={{
              background: active ? "var(--brand-soft)" : "transparent",
              color: active ? "var(--brand-soft-text)" : "var(--text-muted)",
            }}
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
