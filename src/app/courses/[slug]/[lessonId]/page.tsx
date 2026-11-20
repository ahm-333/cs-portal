import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  CreditCard,
  Home,
  KeyRound,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseVisualMeta } from "@/lib/courseTheme";
import { getLessonPageData } from "@/lib/data";
import LessonWorkspace from "@/components/lesson/LessonWorkspace";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const data = await getLessonPageData(slug, lessonId);

  if (!data) {
    return {
      title: `الدرس غير موجود | ${SITE_CONFIG.arabicName}`,
      description: SITE_CONFIG.description,
    };
  }

  const matchedLessonMeta = data.allLessons.find(
    (item) => item.id === lessonId
  );
  const lessonTitle = data.lesson?.title ?? matchedLessonMeta?.title ?? "الدرس";
  const pageTitle = `${lessonTitle} — ${data.course.title} | ${SITE_CONFIG.arabicName}`;
  const pageDescription =
    data.course.description ??
    `ذاكر درس ${lessonTitle} ضمن مادة ${data.course.title} مع الشرح والملخص والأكواد والمعمل التفاعلي والكويز.`;
  const canonicalUrl = `${SITE_CONFIG.url}/courses/${data.course.slug}/${lessonId}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      url: canonicalUrl,
      locale: "ar_EG",
      siteName: SITE_CONFIG.arabicName,
      images: data.course.thumbnail_url
        ? [{ url: data.course.thumbnail_url, alt: data.course.title }]
        : undefined,
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params;
  const data = await getLessonPageData(slug, lessonId);

  if (!data) {
    notFound();
  }

  if (data.isLocked || !data.lesson) {
    const visual = getCourseVisualMeta(
      data.course.slug,
      data.course.title,
      data.course.year_level
    );
    const lockedLessonMeta = data.allLessons.find(
      (item) => item.id === lessonId
    );
    const freePreviewLessons = [...data.allLessons]
      .sort((a, b) => a.order_index - b.order_index)
      .filter((item) => item.is_free_preview);
    const primaryFreeLesson = freePreviewLessons[0] ?? null;

    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="مسار التنقل"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[var(--muted)] sm:text-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--accent)]"
          >
            <Home className="h-3.5 w-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
          <Link
            href={`/courses/${data.course.slug}`}
            className="transition-colors hover:text-[var(--accent)]"
          >
            {data.course.title}
          </Link>
          {lockedLessonMeta ? (
            <>
              <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
              <span className="font-bold text-[var(--ink)]">
                {lockedLessonMeta.title}
              </span>
            </>
          ) : null}
        </nav>

        {/* Study Studio Arabic Paywall Card */}
        <section className="studio-card overflow-hidden shadow-[var(--shadow-pill)]">
          {/* Pastel Top Accent Band */}
          <div
            style={{ backgroundColor: visual.tintVar }}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <span
                dir="ltr"
                className="rounded-lg bg-[var(--paper)] px-2.5 py-1 font-mono text-xs font-extrabold text-[var(--ink)] shadow-[var(--shadow-pill)]"
              >
                {visual.code}
              </span>
              <span className="text-sm font-bold text-[var(--tint-ink)]">
                {visual.arabicSubtitle}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--warn)]/30 bg-[var(--warn-soft)] px-3 py-1 text-xs font-bold text-[var(--warn)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>محتوى مدفوع للمشتركين</span>
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--warn)]/35 bg-[var(--warn-soft)] text-[var(--warn)]">
                <Lock className="h-8 w-8" />
              </div>

              <h1 className="text-2xl font-extrabold leading-snug text-[var(--ink)] sm:text-3xl">
                هذا الدرس جزء من مادة مدفوعة
              </h1>

              {lockedLessonMeta ? (
                <p className="mt-2 text-base font-bold text-[var(--accent)]">
                  {lockedLessonMeta.title}
                </p>
              ) : null}

              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                مادة{" "}
                <strong className="text-[var(--ink)]">
                  {data.course.title}
                </strong>{" "}
                تحتوي على شروحات كاملة، ملخصات منظمة بالأكواد ومعادلات الرياضة،
                معامل تفاعلية، وكويزات فورية بالتفسير.
              </p>

              {/* Price Banner */}
              <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-8 py-4">
                <span className="text-xs font-semibold text-[var(--muted)]">
                  سعر الاشتراك الكامل في المادة
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[var(--pos)] sm:text-4xl">
                    {data.course.price > 0 ? data.course.price : "—"}
                  </span>
                  <span className="text-sm font-bold text-[var(--ink)]">
                    ج.م (جنيه مصري)
                  </span>
                </div>
              </div>

              {/* Phase 3 Activation Preview Section */}
              <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 text-start">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                    <h2 className="text-sm font-bold text-[var(--ink)] sm:text-base">
                      تفعيل بكود شحن أو تحويل InstaPay (المرحلة القادمة)
                    </h2>
                  </div>
                  <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent)]">
                    قريباً — Phase 3
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                      <KeyRound className="h-4 w-4 text-[var(--pos)]" />
                      <span>تفعيل بكود شحن فوري</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--muted)]">
                      أدخل كود الاشتراك المكون من حروف وأرقام لتفعيل المادة على
                      حسابك في نفس اللحظة.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                      <CreditCard className="h-4 w-4 text-[var(--accent)]" />
                      <span>تحويل InstaPay / محفظة</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--muted)]">
                      حول قيمة المادة عبر InstaPay وارفع صورة الإيصال ليتم
                      التفعيل المباشر لحسابك.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {primaryFreeLesson ? (
                  <Link
                    href={`/courses/${data.course.slug}/${primaryFreeLesson.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--hero)] px-6 py-3 text-sm font-bold text-[var(--hero-ink)] shadow-[var(--shadow-pill)] transition-colors hover:bg-[var(--hero-deep)]"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>شاهد الدرس المجاني للمعاينة</span>
                  </Link>
                ) : null}

                <Link
                  href={`/courses/${data.course.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--bg)] px-6 py-3 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)] hover:text-[var(--accent)]"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>العودة لصفحة المادة</span>
                </Link>
              </div>

              {/* Extra free preview lessons list if more than one */}
              {freePreviewLessons.length > 1 ? (
                <div className="mt-6 border-t border-[var(--line)] pt-5 text-start">
                  <p className="mb-2.5 text-xs font-bold text-[var(--muted)]">
                    الدروس المجانية المتاحة للمعاينة في هذه المادة:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {freePreviewLessons.map((preview) => (
                      <Link
                        key={preview.id}
                        href={`/courses/${data.course.slug}/${preview.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pos)]/35 bg-[var(--pos-soft)] px-3 py-1.5 text-xs font-bold text-[var(--pos)] transition-colors hover:border-[var(--pos)]"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>{preview.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {!data.currentUser ? (
                <p className="mt-6 text-xs text-[var(--muted)]">
                  هل لديك حساب مشترك بالفعل؟{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-hover)]"
                  >
                    سجّل الدخول الآن
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <LessonWorkspace
      key={data.lesson.id}
      course={data.course}
      lesson={data.lesson}
      allLessons={data.allLessons}
      interactives={data.interactives}
      questions={data.questions}
      initialProgressMap={data.progressMap}
      currentUser={data.currentUser}
    />
  );
}
