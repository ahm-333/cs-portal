"use client";

import type { ComponentType } from "react";
import {
  BookOpen,
  Code2,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  PlayCircle,
  Wrench,
} from "lucide-react";
import type { LessonResource } from "@/types/database";

interface ResourcesListProps {
  resources: LessonResource[];
}

type ResourceTypeKey = NonNullable<LessonResource["type"]>;

interface ResourceTypeStyle {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  badgeClass: string;
  iconBoxClass: string;
}

const RESOURCE_TYPE_STYLES: Record<ResourceTypeKey, ResourceTypeStyle> = {
  article: {
    label: "مقال / مرجع",
    Icon: BookOpen,
    badgeClass: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    iconBoxClass: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  },
  video: {
    label: "فيديو إضافي",
    Icon: PlayCircle,
    badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    iconBoxClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  },
  tool: {
    label: "أداة تفاعلية",
    Icon: Wrench,
    badgeClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    iconBoxClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  },
  sheet: {
    label: "ملخص / شيت",
    Icon: FileSpreadsheet,
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    iconBoxClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  problem: {
    label: "مسألة برمجية",
    Icon: Code2,
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    iconBoxClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  other: {
    label: "مصدر خارجي",
    Icon: Link2,
    badgeClass: "border-slate-700 bg-slate-800/80 text-slate-300",
    iconBoxClass: "border-slate-700 bg-slate-800/80 text-slate-300",
  },
};

function toSafeHttpUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500">
          <Link2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          لا توجد مصادر إضافية لهذا الدرس
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          سيتم إضافة المراجع والمسائل المقترحة فور توفرها لهذا الموضوع.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {resources.map((resource, index) => {
        const safeUrl = toSafeHttpUrl(resource.url);
        if (!safeUrl) return null;

        const typeKey: ResourceTypeKey =
          resource.type && resource.type in RESOURCE_TYPE_STYLES
            ? resource.type
            : "other";
        const style = RESOURCE_TYPE_STYLES[typeKey];
        const Icon = style.Icon;
        const hostname = getHostname(safeUrl);

        return (
          <a
            key={`${safeUrl}-${index}`}
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-950/30"
          >
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.iconBoxClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badgeClass}`}
                >
                  {style.label}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100 transition-colors group-hover:text-indigo-300">
                {resource.title}
              </h3>

              {resource.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {resource.description}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
              <span
                dir="ltr"
                className="truncate font-mono text-slate-500 group-hover:text-slate-400"
              >
                {hostname}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>فتح المصدر</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
