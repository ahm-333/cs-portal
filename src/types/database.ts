export type UserRole = "student" | "admin";
export type VideoProvider = "youtube" | "bunny";
export type InteractiveSourceType = "html_code" | "external_url";
export type EnrollmentStatus = "active" | "expired";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  year_level: number | null;
  department: string | null;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  year_level: number; // 1 | 2 | 3 | 4
  term: number; // 1 | 2
  is_paid: boolean;
  price: number;
  is_published: boolean;
  created_at: string;
}

export interface LessonResource {
  title: string;
  url: string;
  type?: "article" | "video" | "tool" | "sheet" | "problem" | "other";
  description?: string;
}

/** Lightweight projection for lesson lists/sidebars (omits summary_md to save Supabase egress). */
export interface LessonSummaryItem {
  id: string;
  course_id: string;
  section_title: string;
  title: string;
  order_index: number;
  is_free_preview: boolean;
  duration_minutes?: number | null;
}

export interface Lesson extends LessonSummaryItem {
  video_provider: VideoProvider;
  video_id: string | null;
  summary_md: string | null;
  resources: LessonResource[];
  created_at: string;
}

/** Lightweight metadata for interactive labs (omits html_content until lazy-loaded). */
export interface LessonInteractiveMeta {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  order_index: number;
  source_type: InteractiveSourceType;
  external_url: string | null;
  default_height: number;
}

export interface LessonInteractive extends LessonInteractiveMeta {
  html_content: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  question_text: string;
  code_snippet: string | null;
  code_lang: string | null;
  options: string[];
  correct_index: number;
  explanation: string | null;
  order_index: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  best_quiz_score: number | null;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  expires_at: string | null;
}

export interface CurrentUser {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

export interface CourseWithStats extends Course {
  lesson_count: number;
  completed_count?: number;
  is_enrolled?: boolean;
}

export interface CourseDetailData {
  course: Course;
  lessons: LessonSummaryItem[];
  progressMap: Record<string, UserProgress>;
  isEnrolled: boolean;
  currentUser: CurrentUser | null;
}

export interface LessonPageData {
  course: Course;
  lesson: Lesson | null;
  isLocked: boolean;
  isEnrolled?: boolean;
  allLessons: LessonSummaryItem[];
  interactives: LessonInteractiveMeta[];
  questions: Question[];
  progressMap: Record<string, UserProgress>;
  currentUser: CurrentUser | null;
}

export interface DashboardCourseProgress {
  course: Course;
  totalLessons: number;
  completedLessons: number;
  averageQuizScore: number | null;
  nextLessonId: string | null;
}

export interface DashboardData {
  currentUser: CurrentUser | null;
  courses: DashboardCourseProgress[];
  totalCompletedLessons: number;
  totalLessonsAcrossEnrolled: number;
  overallAverageQuizScore: number | null;
  isDemoMode: boolean;
}
