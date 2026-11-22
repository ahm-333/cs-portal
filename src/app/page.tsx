import { CompactContactStrip } from "@/components/landing/CompactContactStrip";
import { CsMarqueeStrip } from "@/components/landing/CsMarqueeStrip";
import { DeskScrollytellingCinema } from "@/components/landing/DeskScrollytellingCinema";
import { ExpandingToolsStrips } from "@/components/landing/ExpandingToolsStrips";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { LandingCoursesShelf } from "@/components/landing/LandingCoursesShelf";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingTopbar } from "@/components/landing/LandingTopbar";
import { ScrollChaosCompare } from "@/components/landing/ScrollChaosCompare";
import { StudyStepsBridge } from "@/components/landing/StudyStepsBridge";
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

      <main id="top" className="flex-1 w-full">
        <DeskScrollytellingCinema />
        <StudyStepsBridge />
        <ExpandingToolsStrips />
        <CsMarqueeStrip />
        <ScrollChaosCompare />
        <LandingCoursesShelf
          courses={courses}
          courseLessonIdsMap={courseLessonIdsMap}
        />
        <LandingFaqSection />
        <CompactContactStrip />
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
