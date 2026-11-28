"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Bug,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  ImagePlus,
  Lightbulb,
  Loader2,
  LogIn,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useAuthState } from "@/lib/stores/authStore";
import {
  PORTAL_EVENTS,
  emitToast,
  type UnlockModalEventDetail,
} from "@/lib/stores/events";
import {
  getPortalSnapshot,
  removeMistake,
  saveProfile,
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

type FeedbackType = "suggest" | "bug" | "support";
type PaymentMethod = "vodafone_cash" | "instapay";

interface FeedbackLogEntry {
  id: string;
  type: FeedbackType;
  typeLabel: string;
  title: string;
  body: string;
  createdAt: string;
  savedOnline: boolean;
}

interface PaymentConfig {
  vodafoneCashNumber: string;
  instaPayHandle: string;
}

interface SubmittedSubscription {
  courseTitle: string;
  courseCode: string;
  method: PaymentMethod;
  senderInfo: string;
  amount: number;
}

const FEEDBACK_STORAGE_KEY = "cs_portal_feedback_log";
const MAX_RECEIPT_BYTES = 900 * 1024; // 900KB cap

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  vodafoneCashNumber: "01000000000",
  instaPayHandle: "ahmed.amir@instapay",
};

const FEEDBACK_TYPES: ReadonlyArray<{
  value: FeedbackType;
  label: string;
  icon: typeof Lightbulb;
}> = [
  { value: "suggest", label: "اقتراح مادة جديدة", icon: Lightbulb },
  { value: "bug", label: "تبليغ عن مشكلة", icon: Bug },
  { value: "support", label: "رسالة لم. أحمد", icon: MessageSquare },
];

const YEARS = [1, 2, 3, 4] as const;
const DEPARTMENTS: ReadonlyArray<PortalDepartment> = ["CS", "AI", "IS", "IT"];

const DEFAULT_UNLOCK_DETAIL: UnlockModalEventDetail = {
  courseId: "11111111-1111-4111-8111-111111111103",
  courseTitle: "نظم التشغيل",
  courseCode: "CS-311",
};

function getFeedbackTypeLabel(type: FeedbackType): string {
  return FEEDBACK_TYPES.find((t) => t.value === type)?.label ?? "رسالة لم. أحمد";
}

function formatFeedbackMessage(entry: FeedbackLogEntry): string {
  return [
    `[${entry.typeLabel}]`,
    `العنوان: ${entry.title}`,
    `التفاصيل:`,
    entry.body,
    "— مرسل من بوابة Eng. Ahmed Amir",
  ].join("\n");
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("تعذّر قراءة الصورة."));
      }
    };
    reader.onerror = () => reject(new Error("تعذّر قراءة الصورة."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("صيغة الصورة غير مدعومة."));
    img.src = src;
  });
}

async function compressReceiptImage(
  file: File
): Promise<{ dataUrl: string; sizeKb: number }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("يرجى اختيار ملف صورة صالح (PNG أو JPG أو WebP).");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("حجم الصورة كبير جداً — اختر صورة أصغر من 15MB.");
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(rawDataUrl);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (rawDataUrl.length <= MAX_RECEIPT_BYTES) {
      return {
        dataUrl: rawDataUrl,
        sizeKb: Math.max(1, Math.round(rawDataUrl.length / 1024)),
      };
    }
    throw new Error("تعذّر ضغط الصورة في المتصفح.");
  }

  const maxDimensions = [1400, 1100, 880, 680];
  const qualities = [0.82, 0.7, 0.56, 0.44];

  for (let pass = 0; pass < maxDimensions.length; pass += 1) {
    const maxDim = maxDimensions[pass];
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const targetW = Math.max(1, Math.round(img.width * scale));
    const targetH = Math.max(1, Math.round(img.height * scale));

    canvas.width = targetW;
    canvas.height = targetH;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const compressed = canvas.toDataURL("image/jpeg", qualities[pass]);
    if (compressed.length <= MAX_RECEIPT_BYTES) {
      return {
        dataUrl: compressed,
        sizeKb: Math.max(1, Math.round(compressed.length / 1024)),
      };
    }
  }

  throw new Error(
    "حجم الصورة لا يزال أكبر من الحد المسموح (900KB) — جرّب التقاط سكرين شوت أصغر."
  );
}

interface GlassModalShellProps {
  ariaLabel: string;
  maxWidthClass?: string;
  onClose: () => void;
  disableBackdropClose?: boolean;
  children: ReactNode;
}

function GlassModalShell({
  ariaLabel,
  maxWidthClass = "max-w-lg",
  onClose,
  disableBackdropClose = false,
  children,
}: GlassModalShellProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !disableBackdropClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[80] bg-[#0c1322]/58 dark:bg-black/74 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={`sapphire-rim relative ${maxWidthClass} w-full max-h-[90dvh] overflow-y-auto rounded-t-[26px] sm:rounded-[26px] border backdrop-blur-2xl bg-[#fffdf9]/96 dark:bg-[#12141c]/96 border-[#162847]/[0.14] dark:border-[#d8b07a]/[0.20] shadow-[0_24px_64px_rgba(18,28,45,0.22)] dark:shadow-[0_32px_76px_rgba(0,0,0,0.72)]`}
      >
        <div
          aria-hidden="true"
          className="w-10 h-1 rounded-full mx-auto mt-3 mb-1 sm:hidden"
          style={{ background: "var(--border-strong)" }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}

export function GlobalModalsHost() {
  const router = useRouter();
  const portal = usePortalState();
  const auth = useAuthState();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // 1. Command Palette (⌘K) state
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [cmdkQuery, setCmdkQuery] = useState("");
  const [cmdkSelectedIndex, setCmdkSelectedIndex] = useState(0);
  const cmdkInputRef = useRef<HTMLInputElement | null>(null);
  const cmdkListRef = useRef<HTMLDivElement | null>(null);
  const fetchInFlightRef = useRef(false);

  // 2. Profile Modal state
  const [profileName, setProfileName] = useState("");
  const [profileYear, setProfileYear] = useState<number>(2);
  const [profileDept, setProfileDept] = useState<PortalDepartment>("CS");

  // 3. Feedback / Contact Modal state
  const [fbType, setFbType] = useState<FeedbackType>("suggest");
  const [fbTitle, setFbTitle] = useState("");
  const [fbBody, setFbBody] = useState("");
  const [fbGuestName, setFbGuestName] = useState("");
  const [fbGuestPhone, setFbGuestPhone] = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] =
    useState<FeedbackLogEntry | null>(null);

  // 4. Subscription Request Modal state (replaces old Activation Code modal)
  const [unlockDetail, setUnlockDetail] =
    useState<UnlockModalEventDetail>(DEFAULT_UNLOCK_DETAIL);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(
    DEFAULT_PAYMENT_CONFIG
  );
  const [paymentConfigLoading, setPaymentConfigLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("vodafone_cash");
  const [senderInfo, setSenderInfo] = useState("");
  const [receiptData, setReceiptData] = useState<string | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<{
    name: string;
    sizeKb: number;
  } | null>(null);
  const [receiptCompressing, setReceiptCompressing] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [subSubmitted, setSubSubmitted] =
    useState<SubmittedSubscription | null>(null);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

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

  const loadPaymentConfig = useCallback(async () => {
    setPaymentConfigLoading(true);
    try {
      const res = await fetch("/api/site-config", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json().catch(() => null)) as {
        vodafoneCashNumber?: string;
        instaPayHandle?: string;
        settings?: {
          vodafoneCashNumber?: string;
          instaPayHandle?: string;
        };
      } | null;
      if (!data) return;
      const vf = (
        data.vodafoneCashNumber ??
        data.settings?.vodafoneCashNumber ??
        ""
      ).trim();
      const ip = (
        data.instaPayHandle ??
        data.settings?.instaPayHandle ??
        ""
      ).trim();
      setPaymentConfig({
        vodafoneCashNumber: vf || DEFAULT_PAYMENT_CONFIG.vodafoneCashNumber,
        instaPayHandle: ip || DEFAULT_PAYMENT_CONFIG.instaPayHandle,
      });
    } catch {
      // Keep default fallback payment config gracefully
    } finally {
      setPaymentConfigLoading(false);
    }
  }, []);

  const openCmdk = useCallback(() => {
    setCmdkQuery("");
    setCmdkSelectedIndex(0);
    setActiveModal("cmdk");
    void ensureSearchIndex();
    window.setTimeout(() => cmdkInputRef.current?.focus(), 60);
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
    setFbType("suggest");
    setFbTitle("");
    setFbBody("");
    setFbSubmitting(false);
    setSubmittedFeedback(null);
    setActiveModal("feedback");
  }, []);

  const openUnlock = useCallback(
    (detail?: UnlockModalEventDetail) => {
      setUnlockDetail(detail ?? DEFAULT_UNLOCK_DETAIL);
      setPaymentMethod("vodafone_cash");
      setSenderInfo("");
      setReceiptData(null);
      setReceiptMeta(null);
      setSubError(null);
      setSubLoading(false);
      setSubSubmitted(null);
      setCopiedTarget(false);
      setActiveModal("unlock");
      void loadPaymentConfig();
    },
    [loadPaymentConfig]
  );

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
        if (activeModal === "cmdk") {
          setActiveModal(null);
        } else {
          openCmdk();
        }
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
    activeModal,
    openCmdk,
    openProfile,
    openMistakes,
    openFeedback,
    openUnlock,
  ]);

  useEffect(() => {
    if (activeModal === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

  const filteredSearchHits = useMemo(() => {
    const list = searchIndex ?? [];
    const term = cmdkQuery.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) =>
      `${item.title} ${item.sub} ${item.type}`.toLowerCase().includes(term)
    );
  }, [searchIndex, cmdkQuery]);

  function scrollSelectedCmdkOptionIntoView(index: number) {
    window.requestAnimationFrame(() => {
      const container = cmdkListRef.current;
      if (!container) return;
      const el = container.querySelector<HTMLElement>(
        `[data-cmdk-index="${index}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    });
  }

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
    emitToast(`أهلاً يا ${cleanName}! تم تخصيص مقررات فرقتك ✓`);
  }

  async function handleFeedbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fbSubmitting) return;

    const cleanTitle = fbTitle.trim();
    const cleanBody = fbBody.trim();
    if (!cleanTitle || !cleanBody) return;

    const typeLabel = getFeedbackTypeLabel(fbType);
    const senderName =
      auth.user?.fullName ||
      fbGuestName.trim() ||
      portal.profile.name ||
      "طالب بالمنصة";
    const senderPhone = auth.user?.phone || fbGuestPhone.trim() || undefined;
    const senderEmail = auth.user?.email || undefined;

    setFbSubmitting(true);
    let savedOnline = false;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          type: fbType,
          title: cleanTitle,
          body: cleanBody,
          senderName,
          senderPhone,
          senderEmail,
        }),
      });
      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
      } | null;
      if (res.ok && payload?.ok) {
        savedOnline = true;
      }
    } catch {
      savedOnline = false;
    } finally {
      setFbSubmitting(false);
    }

    const entry: FeedbackLogEntry = {
      id: `fb_${Date.now()}`,
      type: fbType,
      typeLabel,
      title: cleanTitle,
      body: cleanBody,
      createdAt: new Date().toISOString(),
      savedOnline,
    };

    try {
      const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const existing = Array.isArray(parsed) ? parsed : [];
      window.localStorage.setItem(
        FEEDBACK_STORAGE_KEY,
        JSON.stringify([entry, ...existing].slice(0, 50))
      );
    } catch {
      // ignore storage quota errors
    }

    setSubmittedFeedback(entry);
    setFbTitle("");
    setFbBody("");
    if (savedOnline) {
      emitToast("تم إرسال رسالتك إلى م. أحمد بنجاح ✓");
    } else {
      emitToast("تعذّر الإرسال المباشر الآن — تم حفظ رسالتك محلياً ويمكنك نسخها");
    }
  }

  async function handleCopyFeedbackMessage() {
    if (!submittedFeedback) return;
    const ok = await copyTextToClipboard(formatFeedbackMessage(submittedFeedback));
    emitToast(
      ok
        ? "تم نسخ رسالتك — يمكنك إرسالها على واتساب أو تليجرام ✓"
        : "تعذّر النسخ التلقائي — يمكنك نسخ النص يدوياً"
    );
  }

  async function handleCopyPaymentDestination() {
    const target =
      paymentMethod === "vodafone_cash"
        ? paymentConfig.vodafoneCashNumber
        : paymentConfig.instaPayHandle;
    const ok = await copyTextToClipboard(target);
    if (ok) {
      setCopiedTarget(true);
      emitToast(
        paymentMethod === "vodafone_cash"
          ? "تم نسخ رقم فودافون كاش ✓"
          : "تم نسخ حساب InstaPay ✓"
      );
      window.setTimeout(() => setCopiedTarget(false), 2000);
    } else {
      emitToast("تعذّر النسخ التلقائي — انسخ الرقم يدوياً");
    }
  }

  async function handleReceiptChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubError(null);
    setReceiptCompressing(true);
    try {
      const { dataUrl, sizeKb } = await compressReceiptImage(file);
      setReceiptData(dataUrl);
      setReceiptMeta({ name: file.name, sizeKb });
    } catch (err) {
      setSubError(
        err instanceof Error ? err.message : "تعذّر تجهيز صورة الإيصال."
      );
      setReceiptData(null);
      setReceiptMeta(null);
    } finally {
      setReceiptCompressing(false);
      if (receiptInputRef.current) {
        receiptInputRef.current.value = "";
      }
    }
  }

  async function handleSubscriptionSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (subLoading) return;

    const cleanSender = senderInfo.trim();
    if (cleanSender.length < 4) {
      setSubError(
        paymentMethod === "vodafone_cash"
          ? "أدخل رقم محفظة فودافون كاش المحوّل منها."
          : "أدخل حساب InstaPay أو الرقم المحوّل منه."
      );
      return;
    }

    setSubLoading(true);
    setSubError(null);

    try {
      const res = await fetch("/api/subscriptions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          courseId: unlockDetail.courseId,
          courseCode: unlockDetail.courseCode,
          courseTitle: unlockDetail.courseTitle,
          amount: unlockDetail.price ?? 0,
          method: paymentMethod,
          senderInfo: cleanSender,
          ...(receiptData ? { receiptData } : {}),
        }),
      });

      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !payload?.ok) {
        const msg =
          payload?.error ||
          "تعذّر إرسال طلب الاشتراك حالياً — تأكد من البيانات وحاول مرة أخرى.";
        setSubError(msg);
        return;
      }

      setSubSubmitted({
        courseTitle: unlockDetail.courseTitle,
        courseCode: unlockDetail.courseCode,
        method: paymentMethod,
        senderInfo: cleanSender,
        amount: unlockDetail.price ?? 0,
      });
      emitToast("تم استلام طلب الاشتراك بنجاح ✓");
    } catch {
      setSubError("تعذّر الاتصال بالسيرفر — تحقق من الإنترنت وحاول مرة أخرى.");
    } finally {
      setSubLoading(false);
    }
  }

  const safeSelected =
    filteredSearchHits.length > 0
      ? Math.min(cmdkSelectedIndex, filteredSearchHits.length - 1)
      : 0;

  const activePaymentDestination =
    paymentMethod === "vodafone_cash"
      ? paymentConfig.vodafoneCashNumber
      : paymentConfig.instaPayHandle;

  const isLoggedIn = auth.status === "authenticated" && auth.user !== null;

  return (
    <AnimatePresence>
      {activeModal === "cmdk" && (
        <GlassModalShell
          key="modal-cmdk"
          ariaLabel="بحث سريع في المقررات والفصول"
          maxWidthClass="max-w-xl"
          onClose={closeModal}
        >
          <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-0">
            <div
              className="px-4 py-3.5 sm:px-5 sm:py-4 border-b flex items-center gap-3"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "var(--brand-soft)",
                  color: "var(--brand-soft-text)",
                }}
              >
                <Search className="w-4 h-4" />
              </div>
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
                    const next = (safeSelected + 1) % filteredSearchHits.length;
                    setCmdkSelectedIndex(next);
                    scrollSelectedCmdkOptionIntoView(next);
                  } else if (
                    e.key === "ArrowUp" &&
                    filteredSearchHits.length > 0
                  ) {
                    e.preventDefault();
                    const next =
                      (safeSelected - 1 + filteredSearchHits.length) %
                      filteredSearchHits.length;
                    setCmdkSelectedIndex(next);
                    scrollSelectedCmdkOptionIntoView(next);
                  } else if (
                    e.key === "Enter" &&
                    filteredSearchHits[safeSelected]
                  ) {
                    e.preventDefault();
                    handleSelectSearchHit(filteredSearchHits[safeSelected]);
                  }
                }}
                placeholder="ابحث عن مقرر أو فصل (مثال: Linked List, SJF, SQL)..."
                className="w-full min-h-[38px] bg-transparent text-[14px] font-bold outline-none placeholder:font-semibold"
                style={{ color: "var(--text-primary)" }}
              />
              {cmdkQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setCmdkQuery("");
                    setCmdkSelectedIndex(0);
                    cmdkInputRef.current?.focus();
                  }}
                  aria-label="مسح البحث"
                  className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer shrink-0"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={closeModal}
                aria-label="إغلاق"
                className="w-8 h-8 sm:w-auto sm:h-7 sm:px-2 rounded-lg border inline-flex items-center justify-center cursor-pointer shrink-0 transition-colors hover:opacity-80"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-muted)",
                }}
              >
                <X className="w-4 h-4 sm:hidden shrink-0" />
                <span className="hidden sm:inline text-[10.5px] font-mono-code font-bold">
                  ESC
                </span>
              </button>
            </div>

            <div
              ref={cmdkListRef}
              role="listbox"
              aria-label="نتائج البحث السريع"
              className="max-h-[320px] overflow-y-auto p-2.5 space-y-1"
            >
              {searchLoading ? (
                <div
                  className="py-10 text-center text-[13px] font-bold flex flex-col items-center gap-2.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <span>جاري تحميل فهرس المقررات والفصول...</span>
                </div>
              ) : searchError ? (
                <div className="py-8 px-4 text-center space-y-3">
                  <div className="text-[13px] font-bold text-rose-600 dark:text-rose-400">
                    تعذّر تحميل نتائج البحث حالياً.
                  </div>
                  <button
                    type="button"
                    onClick={() => void ensureSearchIndex()}
                    className="min-h-[38px] px-4 py-1.5 rounded-xl border text-[12px] font-bold cursor-pointer transition-colors hover:opacity-90"
                    style={{
                      background: "var(--bg-subtle)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : filteredSearchHits.length === 0 ? (
                <div
                  className="py-10 px-4 text-center text-[13px] font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  لا توجد نتائج مطابقة لـ &quot;{cmdkQuery}&quot;
                </div>
              ) : (
                filteredSearchHits.map((hit, idx) => {
                  const isSelected = idx === safeSelected;
                  const isCourse = hit.type === "مقرر";
                  return (
                    <button
                      key={`${hit.courseSlug}-${hit.lessonId ?? "course"}-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-cmdk-index={idx}
                      onMouseEnter={() => setCmdkSelectedIndex(idx)}
                      onClick={() => handleSelectSearchHit(hit)}
                      className={`w-full text-right px-3.5 py-2.5 min-h-[50px] rounded-2xl border flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-[#162847]/[0.07] dark:bg-[#d8b07a]/[0.12] border-[#162847]/20 dark:border-[#d8b07a]/35"
                          : "border-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: isCourse
                              ? "var(--brand-soft)"
                              : "var(--bg-subtle)",
                            color: isCourse
                              ? "var(--brand-soft-text)"
                              : "var(--text-muted)",
                          }}
                        >
                          {isCourse ? (
                            <BookOpen className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-[13.5px] font-extrabold truncate"
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
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: isCourse
                              ? "var(--brand-soft)"
                              : "var(--bg-subtle)",
                            color: isCourse
                              ? "var(--brand-soft-text)"
                              : "var(--text-secondary)",
                          }}
                        >
                          {isCourse ? "مقرر" : "فصل"}
                        </span>
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{
                              background: "var(--accent-warm-soft)",
                              color: "var(--accent-warm-text)",
                            }}
                          >
                            ↵
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div
              className="px-4 sm:px-5 py-2.5 border-t flex items-center justify-between gap-2 text-[11px] font-semibold"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--bg-subtle)",
                color: "var(--text-muted)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <kbd
                  className="font-mono-code px-1.5 py-0.5 rounded border text-[10px]"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  ↑↓
                </kbd>
                <span>للتنقل</span>
                <span>·</span>
                <kbd
                  className="font-mono-code px-1.5 py-0.5 rounded border text-[10px]"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  Enter
                </kbd>
                <span>للفتح</span>
              </span>
              <span className="font-mono-code text-[10.5px] font-bold">
                {filteredSearchHits.length} نتيجة
              </span>
            </div>
          </div>
        </GlassModalShell>
      )}

      {activeModal === "profile" && (
        <GlassModalShell
          key="modal-profile"
          ariaLabel="تخصيص بياناتك الدراسية"
          maxWidthClass="max-w-md"
          onClose={closeModal}
        >
          <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3
                  className="text-lg font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  بياناتك الدراسية
                </h3>
                <p
                  className="text-[12px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  لتخصيص مقررات فرقتك وتخصصك على المنصة
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:opacity-80"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[13.5px] font-bold outline-none transition-colors"
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
                      className={`filter-pill min-h-[42px] py-2 rounded-xl text-[12.5px] cursor-pointer ${
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
                      className={`filter-pill min-h-[42px] py-2 rounded-xl text-[12.5px] font-en cursor-pointer ${
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
                className="w-full min-h-[46px] py-2.5 rounded-2xl text-[13.5px] font-extrabold cursor-pointer transition-all hover:brightness-105 active:scale-[0.99]"
                style={{
                  background: "var(--atelier-cta-bg)",
                  color: "var(--atelier-cta-fg)",
                  boxShadow: "var(--atelier-cta-shadow)",
                }}
              >
                حفظ التغييرات ←
              </button>
            </form>
          </div>
        </GlassModalShell>
      )}

      {activeModal === "mistakes" && (
        <GlassModalShell
          key="modal-mistakes"
          ariaLabel="بنك الأخطاء والمراجعة السريعة"
          maxWidthClass="max-w-lg"
          onClose={closeModal}
        >
          <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className="text-lg font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    بنك الأخطاء
                  </h3>
                  <span
                    className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--brand-soft)",
                      color: "var(--brand-soft-text)",
                    }}
                  >
                    {portal.mistakes.length}
                  </span>
                </div>
                <p
                  className="text-[12px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  الأسئلة التي أخطأت فيها أو حفظتها للمراجعة من الكويزات
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:opacity-80"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60dvh] overflow-y-auto pe-0.5">
              {portal.mistakes.length === 0 ? (
                <div
                  className="p-8 rounded-2xl border text-center space-y-2.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl mx-auto flex items-center justify-center"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div
                    className="text-[14px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    بنك الأخطاء فاضي تماماً!
                  </div>
                  <p
                    className="text-[12px] leading-relaxed max-w-xs mx-auto"
                    style={{ color: "var(--text-muted)" }}
                  >
                    أي سؤال تغلط فيه أو تحفظه أثناء حل الكويزات هيتجمع هنا
                    للمراجعة السريعة قبل الامتحان.
                  </p>
                </div>
              ) : (
                portal.mistakes.map((item, idx) => (
                  <div
                    key={`${item.courseCode}-${idx}-${item.q.slice(0, 24)}`}
                    className="p-4 rounded-2xl border space-y-3 transition-colors"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        dir="ltr"
                        className="font-mono-code text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg"
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
                          emitToast("ممتاز! تمت إزالة السؤال من بنك الأخطاء ✓");
                        }}
                        className="min-h-[32px] px-3 py-1 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-105 active:scale-[0.98]"
                        style={{
                          background: "var(--success-soft)",
                          color: "var(--success-fg)",
                        }}
                      >
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>أتقنته (حذف)</span>
                      </button>
                    </div>

                    <div
                      className="text-[13.5px] font-extrabold leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.q}
                    </div>

                    <div className="rounded-xl border border-[#15664b]/25 dark:border-[#6ec4a3]/25 bg-[#15664b]/[0.08] dark:bg-[#6ec4a3]/[0.10] px-3.5 py-2.5 flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: "var(--success-fg)" }}
                      />
                      <div className="text-[12.5px] leading-relaxed">
                        <span
                          className="font-extrabold"
                          style={{ color: "var(--success-fg)" }}
                        >
                          الإجابة الصحيحة:{" "}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.ansText}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassModalShell>
      )}

      {activeModal === "feedback" && (
        <GlassModalShell
          key="modal-feedback"
          ariaLabel="تواصل معنا أو بلّغ عن مشكلة"
          maxWidthClass="max-w-md"
          onClose={closeModal}
          disableBackdropClose={fbSubmitting}
        >
          <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  className="text-lg font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  تواصل مع م. أحمد
                </h3>
                <p
                  className="text-[12px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {submittedFeedback
                    ? submittedFeedback.savedOnline
                      ? "وصلت رسالتك مباشرة إلى لوحة م. أحمد"
                      : "تم حفظ رسالتك محلياً لتتمكن من إرسالها بسهولة"
                    : "اقترح مادة، بلّغ عن مشكلة، أو اكتب رسالتك مباشرة"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={fbSubmitting}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:opacity-80 disabled:opacity-50"
                style={{
                  background: "var(--bg-subtle)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-primary)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedFeedback ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-[#15664b]/25 dark:border-[#6ec4a3]/25 bg-[#15664b]/[0.08] dark:bg-[#6ec4a3]/[0.10] space-y-2">
                  <div
                    className="flex items-center gap-2 text-[13.5px] font-black"
                    style={{ color: "var(--success-fg)" }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {submittedFeedback.savedOnline
                        ? "تم إرسال رسالتك بنجاح ✓"
                        : "تم حفظ رسالتك محلياً ✓"}
                    </span>
                  </div>
                  <div
                    className="text-[11.5px] font-bold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {submittedFeedback.typeLabel} · {submittedFeedback.title}
                  </div>
                  <p
                    className="text-[12px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {submittedFeedback.body}
                  </p>
                </div>

                {!submittedFeedback.savedOnline && (
                  <button
                    type="button"
                    onClick={() => void handleCopyFeedbackMessage()}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl text-[13px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105"
                    style={{
                      background: "var(--atelier-cta-bg)",
                      color: "var(--atelier-cta-fg)",
                    }}
                  >
                    <Copy className="w-4 h-4 shrink-0" />
                    <span>نسخ الرسالة لإرسالها على واتساب</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedFeedback(null);
                      setFbTitle("");
                      setFbBody("");
                    }}
                    className="min-h-[42px] px-3 py-2 rounded-xl border text-[12.5px] font-bold cursor-pointer transition-colors"
                    style={{
                      background: "var(--bg-subtle)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    رسالة جديدة
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="min-h-[42px] px-3 py-2 rounded-xl border text-[12.5px] font-bold cursor-pointer transition-colors"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div className="grid grid-cols-3 gap-2">
                  {FEEDBACK_TYPES.map((item) => {
                    const Icon = item.icon;
                    const isActive = fbType === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFbType(item.value)}
                        className={`min-h-[62px] px-2 py-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                          isActive
                            ? "border-[#162847] dark:border-[#d8b07a] bg-[#162847]/[0.08] dark:bg-[#d8b07a]/[0.14]"
                            : "hover:opacity-90"
                        }`}
                        style={
                          isActive
                            ? { color: "var(--text-primary)" }
                            : {
                                background: "var(--bg-canvas)",
                                borderColor: "var(--border-soft)",
                                color: "var(--text-secondary)",
                              }
                        }
                      >
                        <Icon
                          className="w-4 h-4 shrink-0"
                          style={{
                            color: isActive
                              ? "var(--brand-primary)"
                              : "var(--text-muted)",
                          }}
                        />
                        <span className="leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {!isLoggedIn && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fbGuestName}
                      onChange={(e) => setFbGuestName(e.target.value)}
                      placeholder="اسمك (اختياري)"
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border text-[12.5px] font-semibold outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <input
                      type="tel"
                      dir="ltr"
                      value={fbGuestPhone}
                      onChange={(e) => setFbGuestPhone(e.target.value)}
                      placeholder="010... (اختياري)"
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border text-[12.5px] font-mono-code text-left outline-none"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                )}

                <input
                  type="text"
                  required
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  placeholder={
                    fbType === "suggest"
                      ? "اسم المادة المقترحة (مثال: Algorithms)"
                      : fbType === "bug"
                        ? "عنوان المشكلة أو اسم الفصل"
                        : "موضوع الرسالة"
                  }
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[13px] font-bold outline-none"
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
                  placeholder={
                    fbType === "suggest"
                      ? "اكتب الفرقة والتخصص وتفاصيل المادة التي تحتاجها..."
                      : fbType === "bug"
                        ? "اشرح المشكلة باختصار لنصلحها فوراً..."
                        : "اكتب رسالتك لم. أحمد..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border text-[13px] leading-relaxed outline-none resize-none"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={fbSubmitting}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 disabled:opacity-65"
                  style={{
                    background: "var(--atelier-cta-bg)",
                    color: "var(--atelier-cta-fg)",
                    boxShadow: "var(--atelier-cta-shadow)",
                  }}
                >
                  {fbSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </GlassModalShell>
      )}

      {activeModal === "unlock" && (
        <GlassModalShell
          key="modal-unlock"
          ariaLabel="طلب اشتراك في المقرر"
          maxWidthClass="max-w-lg"
          onClose={closeModal}
          disableBackdropClose={subLoading}
        >
          <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--brand-soft)",
                      color: "var(--brand-soft-text)",
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>الاشتراك في المقرر</span>
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono-code text-[11px] font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {unlockDetail.courseCode}
                  </span>
                </div>
                <h3
                  className="text-lg font-black mt-1 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {unlockDetail.courseTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {typeof unlockDetail.price === "number" &&
                  unlockDetail.price > 0 && (
                    <span
                      className="px-3 py-1 rounded-xl text-[13px] font-black"
                      style={{
                        background: "var(--success-soft)",
                        color: "var(--success-fg)",
                      }}
                    >
                      {unlockDetail.price} ج.م
                    </span>
                  )}
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={subLoading}
                  aria-label="إغلاق"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: "var(--bg-subtle)",
                    borderColor: "var(--border-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {auth.status === "loading" ? (
              <div
                className="rounded-2xl border p-6 flex items-center justify-center gap-2.5 text-[13px] font-bold"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
                <span>جاري التحقق من حسابك...</span>
              </div>
            ) : !isLoggedIn ? (
              <div
                className="rounded-2xl border p-5 space-y-4"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--brand-soft)",
                      color: "var(--brand-soft-text)",
                    }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4
                      className="text-[14px] font-black"
                      style={{ color: "var(--text-primary)" }}
                    >
                      سجّل دخولك أولاً لتفعيل الاشتراك على حسابك
                    </h4>
                    <p
                      className="text-[12.5px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      عند تسجيل الدخول أو إنشاء حساب طالب، يتم ربط اشتراكك
                      بحسابك مباشرة وتتمكن من متابعة حالة التفعيل من صفحتك.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextPath =
                      typeof window !== "undefined"
                        ? window.location.pathname
                        : "/courses";
                    closeModal();
                    router.push(
                      `/login?next=${encodeURIComponent(nextPath)}`
                    );
                  }}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105"
                  style={{
                    background: "var(--atelier-cta-bg)",
                    color: "var(--atelier-cta-fg)",
                    boxShadow: "var(--atelier-cta-shadow)",
                  }}
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>تسجيل الدخول أو إنشاء حساب</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : subSubmitted ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#15664b]/25 dark:border-[#6ec4a3]/25 bg-[#15664b]/[0.08] dark:bg-[#6ec4a3]/[0.10] p-5 text-center space-y-2.5">
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                    style={{
                      background: "var(--success-soft)",
                      color: "var(--success-fg)",
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4
                    className="text-[15px] font-black leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    تم استلام طلبك! سيتم تفعيل المادة فور مراجعة التحويل.
                  </h4>
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    يمكنك متابعة حالة طلب الاشتراك في أي وقت من صفحة حسابك.
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-3.5 text-[12px] space-y-1.5"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ color: "var(--text-muted)" }}>المقرر</span>
                    <span
                      className="font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {subSubmitted.courseTitle} ({subSubmitted.courseCode})
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ color: "var(--text-muted)" }}>
                      وسيلة الدفع
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {subSubmitted.method === "vodafone_cash"
                        ? "فودافون كاش"
                        : "InstaPay"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ color: "var(--text-muted)" }}>
                      بيانات المحوّل
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono-code font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {subSubmitted.senderInfo}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      router.push("/login");
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-2xl text-[12.5px] font-extrabold cursor-pointer transition-all hover:brightness-105"
                    style={{
                      background: "var(--atelier-cta-bg)",
                      color: "var(--atelier-cta-fg)",
                    }}
                  >
                    متابعة الطلب في حسابي
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="min-h-[44px] px-3.5 py-2 rounded-2xl border text-[12.5px] font-bold cursor-pointer transition-colors"
                    style={{
                      background: "var(--bg-subtle)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
                {/* Step 1: Payment method selector */}
                <div className="space-y-2">
                  <div
                    className="text-[12px] font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    1. اختر وسيلة التحويل
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("vodafone_cash");
                        setCopiedTarget(false);
                      }}
                      className={`min-h-[54px] px-3.5 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-[13px] font-extrabold transition-all cursor-pointer ${
                        paymentMethod === "vodafone_cash"
                          ? "border-[#162847] dark:border-[#d8b07a] bg-[#162847]/[0.08] dark:bg-[#d8b07a]/[0.15]"
                          : "hover:opacity-90"
                      }`}
                      style={
                        paymentMethod === "vodafone_cash"
                          ? { color: "var(--text-primary)" }
                          : {
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      <Smartphone
                        className="w-4 h-4 shrink-0"
                        style={{
                          color:
                            paymentMethod === "vodafone_cash"
                              ? "var(--accent-warm)"
                              : "var(--text-muted)",
                        }}
                      />
                      <span>فودافون كاش</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("instapay");
                        setCopiedTarget(false);
                      }}
                      className={`min-h-[54px] px-3.5 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-[13px] font-extrabold transition-all cursor-pointer ${
                        paymentMethod === "instapay"
                          ? "border-[#162847] dark:border-[#d8b07a] bg-[#162847]/[0.08] dark:bg-[#d8b07a]/[0.15]"
                          : "hover:opacity-90"
                      }`}
                      style={
                        paymentMethod === "instapay"
                          ? { color: "var(--text-primary)" }
                          : {
                              background: "var(--bg-canvas)",
                              borderColor: "var(--border-soft)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      <CreditCard
                        className="w-4 h-4 shrink-0"
                        style={{
                          color:
                            paymentMethod === "instapay"
                              ? "var(--brand-primary)"
                              : "var(--text-muted)",
                        }}
                      />
                      <span className="font-en">InstaPay</span>
                    </button>
                  </div>
                </div>

                {/* Payment number/handle box with 1-click Copy */}
                <div
                  className="rounded-2xl border p-3.5 space-y-2"
                  style={{
                    background: "var(--bg-canvas)",
                    borderColor: "var(--border-strong)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold">
                    <span style={{ color: "var(--text-muted)" }}>
                      {paymentMethod === "vodafone_cash"
                        ? "حوّل قيمة الاشتراك على رقم فودافون كاش:"
                        : "حوّل قيمة الاشتراك على حساب InstaPay:"}
                    </span>
                    {paymentConfigLoading && (
                      <Loader2
                        className="w-3.5 h-3.5 animate-spin shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      dir="ltr"
                      className="font-mono-code text-[15px] sm:text-[16px] font-black tracking-wide truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {activePaymentDestination}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyPaymentDestination()}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl border text-[11.5px] font-extrabold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: copiedTarget
                          ? "var(--success-soft)"
                          : "var(--bg-surface)",
                        borderColor: copiedTarget
                          ? "transparent"
                          : "var(--border-soft)",
                        color: copiedTarget
                          ? "var(--success-fg)"
                          : "var(--text-primary)",
                      }}
                    >
                      {copiedTarget ? (
                        <>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 shrink-0" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2: Sender Info */}
                <div>
                  <label
                    htmlFor="subSenderInfo"
                    className="block text-[12px] font-extrabold mb-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    2.{" "}
                    {paymentMethod === "vodafone_cash"
                      ? "رقم المحفظة المحوّل منها"
                      : "حساب InstaPay أو الرقم المحوّل منه"}
                  </label>
                  <input
                    id="subSenderInfo"
                    type="text"
                    dir="ltr"
                    required
                    value={senderInfo}
                    disabled={subLoading}
                    onChange={(e) => {
                      setSenderInfo(e.target.value);
                      if (subError) setSubError(null);
                    }}
                    placeholder={
                      paymentMethod === "vodafone_cash"
                        ? "01012345678"
                        : "yourname@instapay أو 01012345678"
                    }
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[13.5px] font-mono-code font-bold text-left outline-none disabled:opacity-60"
                    style={{
                      background: "var(--bg-canvas)",
                      borderColor: "var(--border-soft)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Step 3: Optional Receipt Screenshot Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[12px] font-extrabold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      3. صورة إيصال التحويل{" "}
                      <span
                        className="font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        (اختياري)
                      </span>
                    </span>
                    <span
                      className="text-[10.5px] font-semibold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      تسرّع المراجعة والتفعيل
                    </span>
                  </div>

                  <input
                    ref={receiptInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handleReceiptChange(e)}
                    className="hidden"
                  />

                  {receiptData && receiptMeta ? (
                    <div
                      className="rounded-2xl border p-2.5 flex items-center justify-between gap-3"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shrink-0">
                          <Image
                            src={receiptData}
                            alt="صورة إيصال التحويل"
                            width={48}
                            height={48}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-[12px] font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {receiptMeta.name}
                          </div>
                          <div
                            dir="ltr"
                            className="font-mono-code text-[10.5px] text-right"
                            style={{ color: "var(--success-fg)" }}
                          >
                            تم التجهيز · {receiptMeta.sizeKb} KB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptData(null);
                          setReceiptMeta(null);
                        }}
                        aria-label="إزالة الصورة"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 cursor-pointer shrink-0 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={receiptCompressing || subLoading}
                      onClick={() => receiptInputRef.current?.click()}
                      className="w-full min-h-[54px] px-4 py-3 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-[12.5px] font-bold cursor-pointer transition-colors hover:opacity-90 disabled:opacity-60"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-strong)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {receiptCompressing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>جاري تجهيز الصورة...</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus
                            className="w-4 h-4 shrink-0"
                            style={{ color: "var(--brand-primary)" }}
                          />
                          <span>إرفاق سكرين شوت التحويل</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {subError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 flex items-start gap-2 text-[12px] font-bold text-rose-700 dark:text-rose-300"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{subError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={subLoading || receiptCompressing}
                  className="w-full min-h-[48px] py-3 px-4 rounded-2xl text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-65 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--atelier-cta-bg)",
                    color: "var(--atelier-cta-fg)",
                    boxShadow: "var(--atelier-cta-shadow)",
                  }}
                >
                  {subLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>إرسال طلب الاشتراك ✓</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </GlassModalShell>
      )}
    </AnimatePresence>
  );
}

export default GlobalModalsHost;
