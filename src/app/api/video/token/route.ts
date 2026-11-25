import { NextResponse, type NextRequest } from "next/server";
import { hasUserAccessToLesson } from "@/lib/activation/codes";
import { getServerSession } from "@/lib/auth/session";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/mock-data";
import {
  buildWatermarkPayload,
  signHlsPlaybackUrl,
} from "@/lib/video/signer";
import type { VideoTokenResponse } from "@/types/database";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
};

function parseLessonId(raw: unknown): string | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const value = (raw as Record<string, unknown>).lessonId;
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 128 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_JSON", error: "بيانات الطلب غير صالحة." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const lessonId = parseLessonId(rawBody);
  if (!lessonId) {
    return NextResponse.json(
      { ok: false, code: "INVALID_LESSON_ID", error: "معرّف الفصل مطلوب." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const lesson = MOCK_LESSONS.find((item) => item.id === lessonId);
  if (!lesson) {
    return NextResponse.json(
      {
        ok: false,
        code: "LESSON_NOT_FOUND",
        error: "لم يتم العثور على الفصل المطلوب.",
      },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const course = MOCK_COURSES.find((item) => item.id === lesson.course_id);
  if (!course || !course.is_published) {
    return NextResponse.json(
      {
        ok: false,
        code: "COURSE_NOT_FOUND",
        error: "المقرر غير متاح حالياً.",
      },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const requiresPaidAccess = course.is_paid && !lesson.is_free_preview;

  let session: Awaited<ReturnType<typeof getServerSession>> = null;
  try {
    session = await getServerSession();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "AUTH_UNAVAILABLE",
        error: "تعذّر التحقق من جلسة المستخدم حالياً. حاول مرة أخرى.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        error: "يجب إنشاء حساب أو تسجيل الدخول أولاً لمشاهدة الفيديوهات.",
      },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  if (requiresPaidAccess) {
    const isAdmin = session.role === "admin";
    let hasAccess = isAdmin;

    if (!hasAccess) {
      try {
        hasAccess = await hasUserAccessToLesson(
          session?.id ?? null,
          course.id,
          lesson.id,
          course.is_paid,
          lesson.is_free_preview
        );
      } catch {
        return NextResponse.json(
          {
            ok: false,
            code: "ACCESS_CHECK_FAILED",
            error: "تعذّر التحقق من صلاحية الاشتراك حالياً. حاول مرة أخرى.",
          },
          { status: 503, headers: NO_STORE_HEADERS }
        );
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        {
          ok: false,
          code: "FORBIDDEN",
          error: "هذا الفيديو متاح للمشتركين فقط.",
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }
  }

  const hlsPath =
    lesson.hls_path?.trim() ||
    (lesson.video_provider === "hls" ? lesson.video_id?.trim() || null : null);

  if (!hlsPath) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_HLS_STREAM",
        error: "لم يتم ربط بث HLS لهذا الفصل بعد.",
      },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const signed = signHlsPlaybackUrl(hlsPath);
  if (!signed) {
    return NextResponse.json(
      {
        ok: false,
        code: "VIDEO_CDN_NOT_CONFIGURED",
        error: "إعدادات خادم البث المشفر (Bunny HLS) غير مكتملة بعد.",
      },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const watermark = buildWatermarkPayload(session);

  const responsePayload: VideoTokenResponse = {
    playbackUrl: signed.playbackUrl,
    provider: "hls",
    expiresAt: signed.expiresAt,
    watermark,
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}
