import { CompactContactStrip } from "@/components/landing/CompactContactStrip";
import { CsMarqueeStrip } from "@/components/landing/CsMarqueeStrip";
import { ExpandingToolsStrips } from "@/components/landing/ExpandingToolsStrips";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { InteractiveDeskHero } from "@/components/landing/InteractiveDeskHero";
import { LandingCoursesShelf } from "@/components/landing/LandingCoursesShelf";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingTopbar } from "@/components/landing/LandingTopbar";
import { RealitySwitchSection } from "@/components/landing/RealitySwitchSection";
import { StudentCompareSplit } from "@/components/landing/StudentCompareSplit";
import { Footer } from "@/components/layout/Footer";
import { getCourseDetailBySlug, getPublishedCourses } from "@/lib/data";

export default async function HomePage() {
  const courses = await getPublishedCourses();
  const details = await Promise.all(
    courses.map((course) => getCourseDetailBySlug(course.slug))
  );

  const courseLessonIdsMap: Record<string, string[]> = {};
  for (const detail of details) {
    if (!detail) continue;
    courseLessonIdsMap[detail.course.id] = detail.lessons.map((l) => l.id);
  }

  return (
    <div id="landingView" className="flex-1 flex flex-col w-full">
      <LandingTopbar />

      <main className="flex-1 w-full">
        <InteractiveDeskHero />
        <StudentCompareSplit />
        <ExpandingToolsStrips />
        <CsMarqueeStrip />
        <LandingCoursesShelf
          courses={courses}
          courseLessonIdsMap={courseLessonIdsMap}
        />
        <RealitySwitchSection />
        <LandingFaqSection />
        <CompactContactStrip />
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
