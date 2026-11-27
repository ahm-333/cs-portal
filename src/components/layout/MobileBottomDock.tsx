"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, Home, Play, User } from "lucide-react";
import { usePortalState } from "@/lib/stores/portalStore";

type DockItemId = "home" | "courses" | "resume" | "account";

interface DockItem {
  id: DockItemId;
  label: string;
  href: string;
  icon: typeof Home;
  hasResumeDot?: boolean;
}

export function MobileBottomDock() {
  const pathname = usePathname();
  const portal = usePortalState();
  const lastVisited = portal.lastVisited;

  const resumeHref = lastVisited
    ? `/courses/${lastVisited.courseSlug}/${lastVisited.lessonId}`
    : "/courses";

  const items: ReadonlyArray<DockItem> = [
    {
      id: "home",
      label: "الرئيسية",
      href: "/",
      icon: Home,
    },
    {
      id: "courses",
      label: "المقررات",
      href: "/courses",
      icon: BookOpen,
    },
    {
      id: "resume",
      label: "كمّل",
      href: resumeHref,
      icon: Play,
      hasResumeDot: Boolean(lastVisited),
    },
    {
      id: "account",
      label: "حسابي",
      href: "/login",
      icon: User,
    },
  ];

  const activeId: DockItemId = (() => {
    if (pathname === "/") return "home";
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/profile")
    ) {
      return "account";
    }
    if (lastVisited && pathname === resumeHref) {
      return "resume";
    }
    if (pathname.startsWith("/courses")) {
      return "courses";
    }
    return "home";
  })();

  return (
    <div className="md:hidden fixed bottom-3 inset-x-4 z-40 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <nav
        aria-label="التنقل السريع"
        className="sapphire-rim pointer-events-auto mx-auto max-w-[400px] h-[56px] p-[5px] rounded-full backdrop-blur-xl border shadow-lg grid grid-cols-4 gap-1 overflow-hidden"
        style={{
          background: "var(--atelier-dock-bg)",
          borderColor: "var(--atelier-dock-border)",
          boxShadow: "var(--atelier-dock-shadow)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center justify-center gap-0.5 rounded-full select-none transition-colors active:scale-[0.97]"
              style={{
                color: isActive
                  ? "var(--atelier-dock-active-fg)"
                  : "var(--text-muted)",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileDockActivePill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--atelier-dock-active-bg)",
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                <Icon className="w-[15px] h-[15px] shrink-0" strokeWidth={2.2} />
                {item.hasResumeDot && !isActive && (
                  <span
                    className="absolute -top-0.5 -end-1.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--atelier-accent-2)",
                      boxShadow: "0 0 6px var(--atelier-accent-2)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="relative z-10 text-[10px] font-extrabold leading-tight tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
