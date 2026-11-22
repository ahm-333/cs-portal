import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookmarkCheck,
  CheckSquare,
  Cpu,
  FileCode2,
  Globe,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { BrandName } from "@/components/layout/BrandName";
import { Footer } from "@/components/layout/Footer";
import CourseWorkspaceClient from "@/components/lesson/CourseWorkspaceClient";
import { SITE_CONFIG } from "@/lib/config";
import { getCourseDetailBySlug, getLessonPageData } from "@/lib/data";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

function getYearLabel(yearLevel: number): string {
  return (
    SITE_CONFIG.years.find((y) => y.value === yearLevel)?.label ??
    `الفرقة ${yearLevel}`
  );
}

function getTermLabel(term: number): string {
  return (
    SITE_CONFIG.terms.find((t) => t.value === term)?.label ?? `الترم ${term}`
  );
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCourseDetailBySlug(slug);

  if (!data) {
    return {
      title: "المادة غير موجودة",
      description: SITE_CONFIG.description,
    };
  }

  const { course, lessons } = data;
  const yearLabel = getYearLabel(course.year_level);
  const termLabel = getTermLabel(course.term);
  const metaDescription =
    course.description ||
    `ذاكر مادة ${course.title} (${yearLabel} — ${termLabel}) على ${SITE_CONFIG.arabicName} مع ${lessons.length} دروس وملخصات ومعامل تفاعلية وكويزات.`;

  return {
    title: `${course.code} · ${course.title}`,
    description: metaDescription,
    openGraph: {
      type: "article",
      locale: "ar_EG",
      siteName: `${SITE_CONFIG.arabicName} (${SITE_CONFIG.name})`,
      title: `${course.title} | ${SITE_CONFIG.arabicName}`,
      description: metaDescription,
      url: `${SITE_CONFIG.url}/courses/${course.slug}`,
      ...(course.thumbnail_url ? { images: [course.thumbnail_url] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ${SITE_CONFIG.arabicName}`,
      description: metaDescription,
      ...(course.thumbnail_url ? { images: [course.thumbnail_url] } : {}),
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const courseDetail = await getCourseDetailBySlug(slug);

  if (!courseDetail) {
    notFound();
  }

  const sortedLessons = [...courseDetail.lessons].sort(
    (a, b) => a.order_index - b.order_index
  );
  const firstLesson =
    (courseDetail.course.is_paid
      ? sortedLessons.find((l) => l.is_free_preview)
      : undefined) ?? sortedLessons[0];

  if (!firstLesson) {
    const course = courseDetail.course;
    const yearLabel = getYearLabel(course.year_level);
    const termLabel = getTermLabel(course.term);
    const preparedModules = [
      {
        title: "فيديوهات الشرح",
        sub: "مقسمة لفصول زمنية",
        icon: PlayCircle,
      },
      {
        title: "الشرح التفاعلي",
        sub: "معامل محاكاة حية",
        icon: Cpu,
      },
      {
        title: "موقع المادة",
        sub: "خريطة الدروس والمصادر",
        icon: Globe,
      },
      {
        title: "الملخصات والأكواد",
        sub: "أكواد نظيفة ومعادلات",
        icon: FileCode2,
      },
      {
        title: "الكويزات والتثبيت",
        sub: "اختبارات + بنك أخطاء",
        icon: CheckSquare,
      },
    ] as const;

    return (
      <div className="min-h-screen flex flex-col w-full">
        {/* Topbar */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            <Link
              href="/courses"
              className="flex items-center gap-2.5 min-w-0"
              title="العودة لمكتبة المقررات"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-[1.5px] ring-[#c25e33] shrink-0">
                <Image
                  src="/images/founder.jpg"
                  alt="ENG. AHMED AMIR"
                  fill
                  sizes="32px"
                  className="object-cover object-[50%_15%]"
                />
              </div>
              <BrandName size="md" className="truncate" />
            </Link>

            <Link
              href="/courses"
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-extrabold transition-colors hover:border-[var(--accent-warm)]"
              style={{
                background: "var(--bg-canvas)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              <span>كل المقررات</span>
            </Link>
          </div>
        </header>

        {/* Course Prepared Workspace Shell */}
        <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
          <section className="surface-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="font-mono-code text-[12px] font-extrabold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  {course.code}
                </span>
                <span
                  className="text-[12px] font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {yearLabel} · {termLabel}
                </span>
              </div>

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold"
                style={{
                  background: "var(--accent-warm-soft)",
                  color: "var(--accent-warm-text)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>مساحة المادة جاهزة · جاري رفع الدروس</span>
              </span>
            </div>

            <div className="space-y-2">
              <div
                className="font-en text-[13px] font-bold tracking-wide"
                style={{ color: course.accent || "var(--brand-primary)" }}
              >
                {course.title_en}
              </div>
              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {course.title}
              </h1>
              {course.description && (
                <p
                  className="text-[14px] leading-relaxed max-w-2xl"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {course.description}
                </p>
              )}
            </div>

            {/* 5 Prepared Tool Slots */}
            <div
              className="pt-5 border-t space-y-3"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div
                className="text-[12px] font-extrabold"
                style={{ color: "var(--text-muted)" }}
              >
                الأدوات المجهزة داخل هذا المقرر فور نزول المحاضرات:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {preparedModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.title}
                      className="rounded-2xl border p-3.5 space-y-1.5"
                      style={{
                        background: "var(--bg-canvas)",
                        borderColor: "var(--border-soft)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: course.accent || "var(--accent-warm)" }}
                      />
                      <div
                        className="text-[12.5px] font-extrabold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {mod.title}
                      </div>
                      <div
                        className="text-[11px] font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {mod.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-course progress & mistake bank placeholder note */}
            <div
              className="rounded-2xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                background: "var(--bg-subtle)",
                borderColor: "var(--border-soft)",
              }}
            >
              <div className="flex items-center gap-2.5 text-[12.5px] font-bold">
                <BookmarkCheck
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
                <span style={{ color: "var(--text-secondary)" }}>
                  شريط التقدم وبنك أخطاء المادة ونسخة الـ JSON هيتفعّلوا تلقائياً
                  مع أول درس ينزل هنا.
                </span>
              </div>
              <Link
                href="/courses"
                className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-extrabold text-white shrink-0"
                style={{ background: "var(--hero-bg)" }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span>العودة للمقررات</span>
              </Link>
            </div>
          </section>
        </main>

        <Footer variant="compact" />
      </div>
    );
  }

  const lessonData = await getLessonPageData(slug, firstLesson.id);
  if (!lessonData) {
    notFound();
  }

  return (
    <CourseWorkspaceClient
      key={firstLesson.id}
      data={lessonData}
      requestedLessonId={firstLesson.id}
    />
  );
}
