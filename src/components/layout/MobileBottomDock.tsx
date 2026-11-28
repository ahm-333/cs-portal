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
      label: "المواد",
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
    <nav
      aria-label="التنقل السريع"
      className="md:hidden fixed bottom-0 inset-x-0 w-full z-40 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "var(--atelier-dock-bg)",
        borderColor: "var(--atelier-dock-border)",
        boxShadow: "var(--atelier-dock-shadow)",
      }}
    >
      <div className="mx-auto max-w-[480px] h-[58px] px-2 grid grid-cols-4 items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative h-full flex flex-col items-center justify-center gap-0.5 select-none transition-colors active:scale-[0.96]"
              style={{
                color: isActive
                  ? "var(--atelier-dock-active-fg)"
                  : "var(--text-muted)",
              }}
            >
              {isActive && (
                <>
                  <motion.span
                    layoutId="mobileDockTopIndicator"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                    className="absolute top-0 inset-x-4 h-[2px] rounded-full"
                    style={{
                      background: "var(--brand-primary)",
                    }}
                  />
                  <motion.span
                    layoutId="mobileDockActivePill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-y-1.5 inset-x-1 rounded-2xl"
                    style={{
                      background: "var(--atelier-dock-active-bg)",
                    }}
                  />
                </>
              )}
              <span className="relative z-10 flex items-center justify-center">
                <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={2.15} />
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
              <span className="relative z-10 text-[10.5px] font-extrabold leading-tight tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
