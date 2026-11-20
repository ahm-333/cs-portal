import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import {
  MOCK_COURSES,
  MOCK_INTERACTIVES,
  MOCK_LESSONS,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { InteractiveSourceType, LessonInteractive } from "@/types/database";

const PUBLIC_FREE_CACHE =
  "public, s-maxage=3600, stale-while-revalidate=86400";
const PRIVATE_NO_STORE = "private, no-store";

interface JoinedCourseRef {
  id: string;
  is_paid: boolean;
  is_published: boolean;
}

interface JoinedLessonRef {
  id: string;
  is_free_preview: boolean;
  courses: JoinedCourseRef | JoinedCourseRef[] | null;
}

interface InteractiveQueryRow {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  order_index: number;
  source_type: string;
  html_content: string | null;
  external_url: string | null;
  default_height: number;
  created_at: string;
  lessons: JoinedLessonRef | JoinedLessonRef[] | null;
}

function extractParentCourse(
  lessonsField: JoinedLessonRef | JoinedLessonRef[] | null
): JoinedCourseRef | null {
  const lessonRef = Array.isArray(lessonsField)
    ? lessonsField[0] ?? null
    : lessonsField;
  if (!lessonRef || !lessonRef.courses) {
    return null;
  }
  return Array.isArray(lessonRef.courses)
    ? lessonRef.courses[0] ?? null
    : lessonRef.courses;
}

function toSourceType(value: string): InteractiveSourceType {
  return value === "external_url" ? "external_url" : "html_code";
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const interactiveId = typeof id === "string" ? id.trim() : "";

  if (!interactiveId) {
    return NextResponse.json(
      { error: "Invalid interactive id" },
      { status: 400, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  // Demo / Fallback Mode
  if (!isSupabaseConfigured()) {
    const interactive = MOCK_INTERACTIVES.find(
      (item) => item.id === interactiveId
    );
    if (!interactive) {
      return NextResponse.json(
        { error: "Interactive lab not found" },
        { status: 404, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    const lesson = MOCK_LESSONS.find((l) => l.id === interactive.lesson_id);
    const course = lesson
      ? MOCK_COURSES.find((c) => c.id === lesson.course_id)
      : undefined;

    if (!lesson || !course || !course.is_published) {
      return NextResponse.json(
        { error: "Interactive lab not found" },
        { status: 404, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    if (course.is_paid && !lesson.is_free_preview) {
      return NextResponse.json(
        { error: "هذا المعمل متاح للمشتركين في المادة فقط" },
        { status: 403, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    const cacheControl =
      course.is_paid === false ? PUBLIC_FREE_CACHE : PRIVATE_NO_STORE;

    return NextResponse.json<LessonInteractive>(interactive, {
      status: 200,
      headers: { "Cache-Control": cacheControl },
    });
  }

  // Supabase Mode (RLS enforces course/lesson/enrollment visibility automatically)
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lesson_interactives")
      .select(
        "id, lesson_id, title, description, order_index, source_type, html_content, external_url, default_height, created_at, lessons!inner(id, is_free_preview, courses!inner(id, is_paid, is_published))"
      )
      .eq("id", interactiveId)
      .maybeSingle<InteractiveQueryRow>();

    if (error) {
      return NextResponse.json(
        { error: "Failed to load interactive lab" },
        { status: 500, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Interactive lab not found or access denied" },
        { status: 404, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }

    const parentCourse = extractParentCourse(data.lessons);
    const isFreeCourse = parentCourse?.is_paid === false;
    const cacheControl = isFreeCourse ? PUBLIC_FREE_CACHE : PRIVATE_NO_STORE;

    const payload: LessonInteractive = {
      id: data.id,
      lesson_id: data.lesson_id,
      title: data.title,
      description: data.description,
      order_index: data.order_index,
      source_type: toSourceType(data.source_type),
      html_content: data.html_content,
      external_url: data.external_url,
      default_height: data.default_height,
      created_at: data.created_at,
    };

    return NextResponse.json<LessonInteractive>(payload, {
      status: 200,
      headers: { "Cache-Control": cacheControl },
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error loading interactive lab" },
      { status: 500, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }
}
