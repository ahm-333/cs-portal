"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  PORTAL_EVENTS,
  emitToast,
  type UnlockModalEventDetail,
} from "@/lib/stores/events";
import {
  getPortalSnapshot,
  removeMistake,
  saveProfile,
  unlockCourse,
  usePortalState,
  type PortalDepartment,
} from "@/lib/stores/portalStore";
import type { SearchIndexItem } from "@/types/database";

type ActiveModal =
  | null
  | "cmdk"
  | "profile"
  | "mistakes"
  | "feedback"
  | "unlock";

const YEARS = [1, 2, 3, 4] as const;
const DEPARTMENTS: ReadonlyArray<PortalDepartment> = ["CS", "AI", "IS", "IT"];

const DEFAULT_UNLOCK_DETAIL: UnlockModalEventDetail = {
  courseId: "33333333-3333-4333-8333-333333333333",
  courseTitle: "نظم التشغيل",
  courseCode: "CS-311",
  unlockCode: "AI2026",
};

export function GlobalModalsHost() {
  const router = useRouter();
  const portal = usePortalState();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // 1. Command Palette (Ctrl+K) state
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [cmdkQuery, setCmdkQuery] = useState("");
  const [cmdkSelectedIndex, setCmdkSelectedIndex] = useState(0);
  const cmdkInputRef = useRef<HTMLInputElement | null>(null);
  const fetchInFlightRef = useRef(false);

  // 2. Profile Modal state
  const [profileName, setProfileName] = useState("");
  const [profileYear, setProfileYear] = useState<number>(2);
  const [profileDept, setProfileDept] = useState<PortalDepartment>("CS");

  // 4. Feedback Modal state
  const [fbTitle, setFbTitle] = useState("");
  const [fbBody, setFbBody] = useState("");

  // 5. Paid Course Unlock Modal state
  const [unlockDetail, setUnlockDetail] =
    useState<UnlockModalEventDetail>(DEFAULT_UNLOCK_DETAIL);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const unlockInputRef = useRef<HTMLInputElement | null>(null);

  const ensureSearchIndex = useCallback(async () => {
    if (searchIndex !== null || fetchInFlightRef.current) return;
    fetchInFlightRef.current = true;
    setSearchLoading(true);
    setSearchError(false);

    try {
      const res = await fetch("/api/search-index");
      if (!res.ok) throw new Error("Failed to fetch search index");
      const data = (await res.json()) as SearchIndexItem[];
      setSearchIndex(Array.isArray(data) ? data : []);
    } catch {
      setSearchError(true);
    } finally {
      setSearchLoading(false);
      fetchInFlightRef.current = false;
    }
  }, [searchIndex]);

  const openCmdk = useCallback(() => {
    setCmdkQuery("");
    setCmdkSelectedIndex(0);
    setActiveModal("cmdk");
    void ensureSearchIndex();
    window.setTimeout(() => cmdkInputRef.current?.focus(), 40);
  }, [ensureSearchIndex]);

  const openProfile = useCallback(() => {
    const snap = getPortalSnapshot();
    setProfileName(snap.profile.name);
    setProfileYear(snap.profile.year);
    setProfileDept(snap.profile.dept);
    setActiveModal("profile");
  }, []);

  const openMistakes = useCallback(() => {
    setActiveModal("mistakes");
  }, []);

  const openFeedback = useCallback(() => {
    setFbTitle("");
    setFbBody("");
    setActiveModal("feedback");
  }, []);

  const openUnlock = useCallback((detail?: UnlockModalEventDetail) => {
    setUnlockDetail(detail ?? DEFAULT_UNLOCK_DETAIL);
    setUnlockInput("");
    setUnlockError(null);
    setActiveModal("unlock");
    window.setTimeout(() => unlockInputRef.current?.focus(), 40);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Listen to PORTAL_EVENTS & global keyboard shortcuts (Ctrl/Cmd+K, Escape)
  useEffect(() => {
    const onOpenCmdk = () => openCmdk();
    const onOpenProfile = () => openProfile();
    const onOpenMistakes = () => openMistakes();
    const onOpenFeedback = () => openFeedback();
    const onOpenUnlock = (event: Event) => {
      const custom = event as CustomEvent<UnlockModalEventDetail | undefined>;
      openUnlock(custom.detail);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActiveModal((prev) => {
          if (prev === "cmdk") return null;
          setCmdkQuery("");
          setCmdkSelectedIndex(0);
          void ensureSearchIndex();
          window.setTimeout(() => cmdkInputRef.current?.focus(), 40);
          return "cmdk";
        });
      } else if (event.key === "Escape") {
        setActiveModal((prev) => (prev !== null ? null : prev));
      }
    };

    window.addEventListener(PORTAL_EVENTS.OPEN_CMDK, onOpenCmdk);
    window.addEventListener(PORTAL_EVENTS.OPEN_PROFILE, onOpenProfile);
    window.addEventListener(PORTAL_EVENTS.OPEN_MISTAKES, onOpenMistakes);
    window.addEventListener(PORTAL_EVENTS.OPEN_FEEDBACK, onOpenFeedback);
    window.addEventListener(PORTAL_EVENTS.OPEN_UNLOCK, onOpenUnlock);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener(PORTAL_EVENTS.OPEN_CMDK, onOpenCmdk);
      window.removeEventListener(PORTAL_EVENTS.OPEN_PROFILE, onOpenProfile);
      window.removeEventListener(PORTAL_EVENTS.OPEN_MISTAKES, onOpenMistakes);
      window.removeEventListener(PORTAL_EVENTS.OPEN_FEEDBACK, onOpenFeedback);
      window.removeEventListener(PORTAL_EVENTS.OPEN_UNLOCK, onOpenUnlock);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    ensureSearchIndex,
    openCmdk,
    openProfile,
    openMistakes,
    openFeedback,
    openUnlock,
  ]);

  const filteredSearchHits = useMemo(() => {
    const list = searchIndex ?? [];
    const term = cmdkQuery.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) =>
      `${item.title} ${item.sub} ${item.type}`.toLowerCase().includes(term)
    );
  }, [searchIndex, cmdkQuery]);

  function handleSelectSearchHit(item: SearchIndexItem) {
    closeModal();
    const targetUrl = item.lessonId
      ? `/courses/${item.courseSlug}/${item.lessonId}`
      : `/courses/${item.courseSlug}`;
    router.push(targetUrl);
  }

  function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanName = profileName.trim() || "طالب حاسبات";
    saveProfile({
      name: cleanName,
      year: profileYear,
      dept: profileDept,
      saved: true,
    });
    closeModal();
    emitToast(`أهلاً يا ${cleanName}! تم تخصيص مقررات فرقتك`);
  }

  function handleFeedbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFbTitle("");
    setFbBody("");
    closeModal();
    emitToast("شكراً لمشاركتك! تم استلام ملاحظتك");
  }

  async function handleUnlockSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const expectedCode = (unlockDetail.unlockCode || "AI2026")
      .trim()
      .toUpperCase();
    const entered = unlockInput.trim().toUpperCase();

    if (entered === expectedCode) {
      unlockCourse(unlockDetail.courseId);
      setUnlockInput("");
      setUnlockError(null);
      closeModal();
      emitToast("تم تفعيل المقرر بالكامل بنجاح! 🎉");
      try {
        const confettiModule = await import("canvas-confetti");
        const confetti = confettiModule.default;
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#c25e33", "#66c7a6", "#7ca7f0"],
        });
      } catch {
        // ignore confetti load errors
      }
    } else {
      const errMsg = `الكود غير صحيح — جرّب الكود التجريبي ${expectedCode}`;
      setUnlockError(errMsg);
      emitToast(errMsg);
    }
  }

  if (activeModal === null) {
    return null;
  }

  // 1. Command Palette (Ctrl+K)
  if (activeModal === "cmdk") {
    const safeSelected =
      filteredSearchHits.length > 0
        ? Math.min(cmdkSelectedIndex, filteredSearchHits.length - 1)
        : 0;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="بحث سريع في المقررات والدروس"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        className="fixed inset-0 z-50 modal-backdrop flex items-start justify-center pt-20 p-4"
      >
        <div className="surface-card rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
          <div
            className="p-4 border-b flex items-center gap-3"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <Search
              className="w-4 h-4 shrink-0"
              style={{ color: "var(--accent-warm)" }}
            />
            <input
              ref={cmdkInputRef}
              type="text"
              dir="rtl"
              value={cmdkQuery}
              onChange={(e) => {
                setCmdkQuery(e.target.value);
                setCmdkSelectedIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && filteredSearchHits.length > 0) {
                  e.preventDefault();
                  setCmdkSelectedIndex(
                    (prev) => (prev + 1) % filteredSearchHits.length
                  );
                } else if (
                  e.key === "ArrowUp" &&
                  filteredSearchHits.length > 0
                ) {
                  e.preventDefault();
                  setCmdkSelectedIndex(
                    (prev) =>
                      (prev - 1 + filteredSearchHits.length) %
                      filteredSearchHits.length
                  );
                } else if (
                  e.key === "Enter" &&
                  filteredSearchHits[safeSelected]
                ) {
                  e.preventDefault();
                  handleSelectSearchHit(filteredSearchHits[safeSelected]);
                }
              }}
              placeholder="ابحث عن مادة، درس، أو مصطلح (مثل: Linked List, SJF, Big-O)..."
              className="w-full bg-transparent text-[13.5px] font-semibold outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              type="button"
              onClick={closeModal}
              className="text-[11px] font-mono-code px-2 py-1 rounded-lg border cursor-pointer"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
                color: "var(--text-muted)",
              }}
            >
              ESC
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-2.5 space-y-1.5">
            {searchLoading ? (
              <div
                className="p-5 text-center text-[12.5px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                جاري تحميل فهرس المقررات والدروس...
              </div>
            ) : searchError ? (
              <div
                className="p-5 text-center text-[12.5px] font-bold space-y-2"
                style={{ color: "var(--danger-fg)" }}
              >
                <div>تعذّر تحميل نتائج البحث حالياً.</div>
                <button
                  type="button"
                  onClick={() => void ensureSearchIndex()}
                  className="px-3 py-1 rounded-lg border text-[11.5px] cursor-pointer"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : filteredSearchHits.length === 0 ? (
              <div
                className="p-5 text-center text-[12.5px] font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                لا توجد نتائج مطابقة لـ &quot;{cmdkQuery}&quot;
              </div>
            ) : (
              filteredSearchHits.map((hit, idx) => {
                const isSelected = idx === safeSelected;
                return (
                  <button
                    key={`${hit.courseSlug}-${hit.lessonId ?? "course"}-${idx}`}
                    type="button"
                    onMouseEnter={() => setCmdkSelectedIndex(idx)}
                    onClick={() => handleSelectSearchHit(hit)}
                    className="w-full text-right px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    style={{
                      background: isSelected ? "var(--bg-hover)" : "transparent",
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="text-[13px] font-bold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {hit.title}
                      </div>
                      <div
                        className="text-[11px] font-en truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {hit.sub}
                      </div>
                    </div>
                    <span
                      className="text-[10.5px] font-bold px-2 py-0.5 rounded-md shrink-0"
                      style={{
                        background:
                          hit.type === "مقرر"
                            ? "var(--brand-soft)"
                            : "var(--bg-subtle)",
                        color:
                          hit.type === "مقرر"
                            ? "var(--brand-soft-text)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {hit.type}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Profile Setup Modal
  if (activeModal === "profile") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="إعداد ملفك المحلي"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      >
        <div className="surface-card rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                إعداد ملفك المحلي
              </h3>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                لتخصيص مقررات فرقتك وحفظ تقدمك بدون باسورد
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="إغلاق"
              className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold shrink-0 cursor-pointer"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="modalProfileNameInput"
                className="block text-[12px] font-bold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                الاسم
              </label>
              <input
                id="modalProfileNameInput"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="مثال: أحمد"
                className="w-full px-3.5 py-2.5 rounded-xl border text-[13.5px] outline-none"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <div
                className="text-[12px] font-bold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                الفرقة الدراسية
              </div>
              <div className="grid grid-cols-2 gap-2">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setProfileYear(y)}
                    className={`filter-pill py-2 rounded-xl text-[12.5px] cursor-pointer ${
                      profileYear === y ? "active" : ""
                    }`}
                  >
                    الفرقة <span className="font-en">{y}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-[12px] font-bold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                التخصص
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setProfileDept(d)}
                    className={`filter-pill py-2 rounded-xl text-[12.5px] font-en cursor-pointer ${
                      profileDept === d ? "active" : ""
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-[13.5px] font-extrabold text-white cursor-pointer transition-opacity hover:opacity-95"
              style={{ background: "#c25e33" }}
            >
              حفظ وتفعيل مقررات فرقتي ←
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Mistake Bank Modal
  if (activeModal === "mistakes") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="بنك الأخطاء والمراجعة السريعة"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      >
        <div className="surface-card rounded-3xl max-w-lg w-full max-h-[82vh] overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                بنك الأخطاء والمراجعة السريعة
              </h3>
              <p
                className="text-[12px]"
                style={{ color: "var(--text-muted)" }}
              >
                أي سؤال تغلط فيه أو تحفظه في الكويز بيتجمع هنا
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="إغلاق"
              className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold shrink-0 cursor-pointer"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {portal.mistakes.length === 0 ? (
              <div
                className="p-6 rounded-2xl text-center text-[13px] font-bold"
                style={{
                  background: "var(--bg-canvas)",
                  color: "var(--text-secondary)",
                }}
              >
                مفيش أسئلة في بنك المراجعة حالياً. أي سؤال تغلط فيه أو تحفظه في
                كويز أي مادة هيظهر هنا تلقائياً.
              </div>
            ) : (
              portal.mistakes.map((item, idx) => (
                <div
                  key={`${item.courseCode}-${idx}-${item.q.slice(0, 20)}`}
                  className="p-4 rounded-2xl border space-y-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="font-mono-code text-[10.5px] font-bold px-2 py-0.5 rounded"
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand-soft-text)",
                      }}
                    >
                      {item.courseCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeMistake(idx);
                        emitToast("تمت إزالة السؤال من بنك الأخطاء ✓");
                      }}
                      className="text-[11px] font-bold hover:underline cursor-pointer"
                      style={{ color: "var(--success-fg)" }}
                    >
                      تمت المراجعة ✓
                    </button>
                  </div>
                  <div
                    className="text-[13px] font-extrabold leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.q}
                  </div>
                  <div
                    className="text-[12px] font-bold"
                    style={{ color: "var(--success-fg)" }}
                  >
                    الإجابة الصح: {item.ansText}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Feedback / Suggest Course Modal
  if (activeModal === "feedback") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="اقترح مادة أو بلّغ عن خطأ"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      >
        <div className="surface-card rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3
              className="text-lg font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              اقترح مادة / بلّغ عن خطأ
            </h3>
            <button
              type="button"
              onClick={closeModal}
              aria-label="إغلاق"
              className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold shrink-0 cursor-pointer"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={fbTitle}
              onChange={(e) => setFbTitle(e.target.value)}
              placeholder="اسم المادة أو عنوان الملاحظة"
              className="w-full px-3.5 py-2.5 rounded-xl border text-[13px] outline-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            <textarea
              rows={3}
              required
              value={fbBody}
              onChange={(e) => setFbBody(e.target.value)}
              placeholder="اكتب تفاصيل الاقتراح أو الخطأ..."
              className="w-full px-3.5 py-2.5 rounded-xl border text-[13px] outline-none resize-none"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-[13.5px] font-extrabold text-white cursor-pointer transition-opacity hover:opacity-95"
              style={{ background: "var(--hero-bg)" }}
            >
              إرسال الملاحظة
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 5. Paid Course Unlock Modal
  const displayCode = (unlockDetail.unlockCode || "AI2026").trim().toUpperCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="تفعيل المقرر بالكامل"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
    >
      <div className="surface-card rounded-3xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span
              className="text-[11px] font-extrabold"
              style={{ color: "var(--accent-warm)" }}
            >
              تفعيل المقرر بالكامل
            </span>
            <h3
              className="text-lg font-black mt-0.5"
              style={{ color: "var(--text-primary)" }}
            >
              {unlockDetail.courseTitle} · {unlockDetail.courseCode}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-xl border flex items-center justify-center font-bold shrink-0 cursor-pointer"
            style={{
              background: "var(--bg-subtle)",
              borderColor: "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          تواصل مع{" "}
          <strong className="font-en" style={{ color: "var(--text-primary)" }}>
            Ahmed Amir Ahmed
          </strong>{" "}
          للحصول على كود التفعيل، أو جرّب الكود التجريبي{" "}
          <span
            className="font-mono-code font-bold px-1.5 py-0.5 rounded"
            style={{
              background: "var(--success-soft)",
              color: "var(--success-fg)",
            }}
          >
            {displayCode}
          </span>{" "}
          لفتح الدروس المغلقة الآن.
        </p>

        <form onSubmit={handleUnlockSubmit} className="space-y-3">
          <input
            ref={unlockInputRef}
            type="text"
            dir="ltr"
            value={unlockInput}
            onChange={(e) => {
              setUnlockInput(e.target.value);
              if (unlockError) setUnlockError(null);
            }}
            placeholder={`Enter code: ${displayCode}`}
            className="w-full px-3.5 py-2.5 rounded-xl border font-mono-code text-[13px] font-bold outline-none"
            style={{
              background: "var(--bg-canvas)",
              borderColor: unlockError
                ? "var(--danger-fg)"
                : "var(--border-soft)",
              color: "var(--text-primary)",
            }}
          />
          {unlockError && (
            <p
              className="text-[12px] font-bold"
              style={{ color: "var(--danger-fg)" }}
            >
              {unlockError}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-[13px] font-extrabold text-white cursor-pointer transition-opacity hover:opacity-95"
            style={{ background: "#c25e33" }}
          >
            تفعيل المقرر الآن ←
          </button>
        </form>
      </div>
    </div>
  );
}

export default GlobalModalsHost;
