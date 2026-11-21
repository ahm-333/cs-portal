"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const LESSON_ROUTE_RE = /^\/courses\/[^/]+\/[^/]+/;

export function isLessonPathname(pathname: string | null): boolean {
  return Boolean(pathname && LESSON_ROUTE_RE.test(pathname));
}

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLessonPage = isLessonPathname(pathname);

  return (
    <div
      className={`atelier-canvas flex min-h-[calc(100vh-72px)] flex-1 flex-col ${
        isLessonPage ? "pb-0" : "pb-20 md:pb-0"
      }`}
    >
      {children}
    </div>
  );
}
