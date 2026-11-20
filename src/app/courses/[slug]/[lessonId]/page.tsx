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

  const matchedLessonMeta = data.allLessons.find((item) => item.id === lessonId);
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
    const lockedLessonMeta = data.allLessons.find(
      (item) => item.id === lessonId
    );
    const freePreviewLessons = [...data.allLessons]
      .sort((a, b) => a.order_index - b.order_index)
      .filter((item) => item.is_free_preview);
    const primaryFreeLesson = freePreviewLessons[0] ?? null;

    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="مسار التنقل"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400 sm:text-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-indigo-300"
          >
            <Home className="h-3.5 w-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
          <Link
            href={`/courses/${data.course.slug}`}
            className="transition-colors hover:text-indigo-300"
          >
            {data.course.title}
          </Link>
          {lockedLessonMeta ? (
            <>
              <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-semibold text-slate-200">
                {lockedLessonMeta.title}
              </span>
            </>
          ) : null}
        </nav>

        {/* Arabic Paywall Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 start-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-950/30">
              <Lock className="h-8 w-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>محتوى مدفوع للمشتركين</span>
            </span>

            <h1 className="mt-4 text-2xl font-extrabold leading-snug text-slate-50 sm:text-3xl">
              هذا الدرس جزء من مادة مدفوعة
            </h1>

            {lockedLessonMeta ? (
              <p className="mt-2 text-base font-semibold text-indigo-300">
                {lockedLessonMeta.title}
              </p>
            ) : null}

            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              مادة{" "}
              <strong className="text-slate-100">{data.course.title}</strong>{" "}
              تحتوي على شروحات كاملة، ملخصات منظمة بالأكواد ومعادلات الرياضة،
              معامل تفاعلية، وكويزات فورية بالتفسير.
            </p>

            {/* Price Banner */}
            <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-indigo-500/30 bg-slate-950/90 px-8 py-4">
              <span className="text-xs font-medium text-slate-400">
                سعر الاشتراك الكامل في المادة
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">
                  {data.course.price > 0 ? data.course.price : "—"}
                </span>
                <span className="text-sm font-bold text-slate-300">
                  ج.م (جنيه مصري)
                </span>
              </div>
            </div>

            {/* Phase 3 Activation Preview Section */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-start">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-slate-100 sm:text-base">
                    تفعيل بكود شحن أو تحويل InstaPay (المرحلة القادمة)
                  </h2>
                </div>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
                  قريباً — Phase 3
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                    <KeyRound className="h-4 w-4 text-emerald-400" />
                    <span>تفعيل بكود شحن فوري</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    أدخل كود الاشتراك المكون من حروف وأرقام لتفعيل المادة على
                    حسابك في نفس اللحظة.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                    <CreditCard className="h-4 w-4 text-indigo-400" />
                    <span>تحويل InstaPay / محفظة</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    حول قيمة المادة عبر InstaPay وارفع صورة الإيصال ليتم التفعيل
                    المباشر لحسابك.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {primaryFreeLesson ? (
                <Link
                  href={`/courses/${data.course.slug}/${primaryFreeLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/50 transition-colors hover:bg-indigo-500"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>شاهد الدرس المجاني للمعاينة</span>
                </Link>
              ) : null}

              <Link
                href={`/courses/${data.course.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                <span>العودة لصفحة المادة</span>
              </Link>
            </div>

            {/* Extra free preview lessons list if more than one */}
            {freePreviewLessons.length > 1 ? (
              <div className="mt-6 border-t border-slate-800 pt-5 text-start">
                <p className="mb-2.5 text-xs font-bold text-slate-400">
                  الدروس المجانية المتاحة للمعاينة في هذه المادة:
                </p>
                <div className="flex flex-wrap gap-2">
                  {freePreviewLessons.map((preview) => (
                    <Link
                      key={preview.id}
                      href={`/courses/${data.course.slug}/${preview.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>{preview.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {!data.currentUser ? (
              <p className="mt-6 text-xs text-slate-400">
                هل لديك حساب مشترك بالفعل؟{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
                >
                  سجّل الدخول الآن
                </Link>
              </p>
            ) : null}
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
      isEnrolled={
        data.isEnrolled ?? (!data.course.is_paid || !data.lesson.is_free_preview)
      }
      allLessons={data.allLessons}
      interactives={data.interactives}
      questions={data.questions}
      initialProgressMap={data.progressMap}
      currentUser={data.currentUser}
    />
  );
}
