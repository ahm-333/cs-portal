import { NextResponse, type NextRequest } from "next/server";
import { hasUserAccessToLesson } from "@/lib/activation/codes";
import { getServerSession } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db";
import {
  MOCK_COURSES,
  MOCK_INTERACTIVES,
  MOCK_LESSONS,
} from "@/lib/mock-data";
import type { LessonInteractive } from "@/types/database";

const PRIVATE_NO_STORE = "private, no-store";

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

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول أو إنشاء حساب أولاً." },
      { status: 401, headers: { "Cache-Control": PRIVATE_NO_STORE } }
    );
  }

  if (course.is_paid && !lesson.is_free_preview) {
    let isAuthorized = false;

    if (isDatabaseConfigured()) {
      try {
        isAuthorized =
          session.role === "admin" ||
          (await hasUserAccessToLesson(
            session.id,
            course.id,
            lesson.id,
            course.is_paid,
            lesson.is_free_preview
          ));
      } catch (err) {
        console.error("[api/interactives] Access check failed:", err);
        return NextResponse.json(
          { error: "تعذّر التحقق من صلاحية المعمل حالياً. حاول مرة أخرى." },
          { status: 503, headers: { "Cache-Control": PRIVATE_NO_STORE } }
        );
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "هذا المعمل متاح للمشتركين في المادة فقط" },
        { status: 403, headers: { "Cache-Control": PRIVATE_NO_STORE } }
      );
    }
  }

  return NextResponse.json<LessonInteractive>(interactive, {
    status: 200,
    headers: { "Cache-Control": PRIVATE_NO_STORE },
  });
}
