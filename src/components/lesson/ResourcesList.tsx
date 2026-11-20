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
  tintVar: string;
}

const RESOURCE_TYPE_STYLES: Record<ResourceTypeKey, ResourceTypeStyle> = {
  article: {
    label: "مقال / مرجع",
    Icon: BookOpen,
    tintVar: "var(--tint-blue)",
  },
  video: {
    label: "فيديو إضافي",
    Icon: PlayCircle,
    tintVar: "var(--tint-pink)",
  },
  tool: {
    label: "أداة تفاعلية",
    Icon: Wrench,
    tintVar: "var(--tint-sky)",
  },
  sheet: {
    label: "ملخص / شيت",
    Icon: FileSpreadsheet,
    tintVar: "var(--tint-mint)",
  },
  problem: {
    label: "مسألة برمجية",
    Icon: Code2,
    tintVar: "var(--tint-peach)",
  },
  other: {
    label: "مصدر خارجي",
    Icon: Link2,
    tintVar: "var(--tint-purple)",
  },
};

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
      <div className="studio-card flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--accent)]">
          <Link2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--ink)]">
          لا توجد مصادر إضافية لهذا الدرس
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
          سيتم إضافة المراجع والمسائل المقترحة فور توفرها لهذا الموضوع.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {resources.map((resource, index) => {
        const typeKey: ResourceTypeKey =
          resource.type && resource.type in RESOURCE_TYPE_STYLES
            ? resource.type
            : "other";
        const style = RESOURCE_TYPE_STYLES[typeKey];
        const Icon = style.Icon;
        const hostname = getHostname(resource.url);

        return (
          <a
            key={`${resource.url}-${index}`}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-card studio-card-hover group flex flex-col justify-between p-5"
          >
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div
                  style={{ backgroundColor: style.tintVar }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--tint-ink)]"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  style={{ backgroundColor: style.tintVar }}
                  className="inline-flex items-center rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs font-bold text-[var(--tint-ink)]"
                >
                  {style.label}
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                {resource.title}
              </h3>

              {resource.description ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {resource.description}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs">
              <span
                dir="ltr"
                className="truncate font-mono text-[var(--muted)]"
              >
                {hostname}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[var(--accent)]">
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
