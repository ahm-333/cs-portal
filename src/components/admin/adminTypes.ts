export type ActivationScope = "course" | "lesson" | "bundle";
export type AdminCodeStatus = "available" | "used" | "revoked" | "expired";
export type AdminEnrollmentStatus = "active" | "revoked" | "expired";
export type AdminUserRole = "student" | "admin";

export interface AdminCourseOption {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  yearLevel: number;
  term: number;
  isPaid: boolean;
  isPublished: boolean;
  accent: string;
  lessonCount: number;
}

export interface AdminLessonOption {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  sectionTitle: string;
  title: string;
  titleEn?: string;
  orderIndex: number;
  isFreePreview?: boolean;
}

export interface AdminCourseEnrollmentStat {
  courseId: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  yearLevel: number;
  isPaid: boolean;
  isPublished: boolean;
  lessonCount: number;
  directEnrollments: number;
  totalWithBundle: number;
  completedLessons: number;
  averageQuizScore: number | null;
  mistakesCount: number;
}

export interface AdminDistributionBucket {
  key: string;
  label: string;
  count: number;
}

export interface AdminHardChapterStat {
  lessonId: string | null;
  courseId: string;
  courseCode: string;
  label: string;
  mistakesCount: number;
}

export interface AdminActivityItem {
  id: string;
  type: "signup" | "redemption" | "enrollment";
  title: string;
  subtitle: string;
  meta: string | null;
  createdAt: string;
}

export interface AdminOverviewData {
  totalStudents: number;
  totalAdmins: number;
  activeStudents7d: number;
  activeSessionsCount: number;
  totalEnrollments: number;
  bundleEnrollments: number;
  totalCodes: number;
  unusedCodes: number;
  usedCodes: number;
  revokedCodes: number;
  expiredCodes: number;
  totalRedemptions: number;
  totalCompletedLessons: number;
  totalMistakes: number;
  totalNotes: number;
  aiRequestsToday: number;
  aiRequests7d: number;
  averageQuizScore: number | null;
  courseEnrollments: AdminCourseEnrollmentStat[];
  yearDistribution: AdminDistributionBucket[];
  deptDistribution: AdminDistributionBucket[];
  hardestChapters: AdminHardChapterStat[];
  recentActivity: AdminActivityItem[];
}

export interface AdminCodeItem {
  id: string;
  code: string;
  scopeType: ActivationScope;
  targetId: string;
  targetLabel: string;
  batchLabel: string | null;
  maxUses: number;
  usedCount: number;
  isRevoked: boolean;
  status: AdminCodeStatus;
  expiresAt: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface AdminRedemptionItem {
  id: string;
  codeId: string;
  code: string;
  scopeType: ActivationScope;
  targetId: string;
  targetLabel: string;
  batchLabel: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  ipHash: string | null;
  redeemedAt: string;
}

export interface AdminStudentEnrollmentItem {
  id: string;
  scopeType: ActivationScope;
  targetId: string;
  targetLabel: string;
  status: AdminEnrollmentStatus;
  enrolledAt: string;
  expiresAt: string | null;
}

export interface AdminStudentItem {
  id: string;
  email: string;
  phone: string | null;
  googleLinked: boolean;
  fullName: string;
  yearLevel: number;
  department: string;
  role: AdminUserRole;
  examDate: string | null;
  createdAt: string;
  lastActiveAt: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completionPercent: number;
  averageQuizScore: number | null;
  mistakesCount: number;
  notesCount: number;
  enrollments: AdminStudentEnrollmentItem[];
}

export interface AdminStudentDetailData {
  student: {
    id: string;
    email: string;
    phone: string | null;
    googleLinked: boolean;
    fullName: string;
    yearLevel: number;
    department: string;
    role: AdminUserRole;
    examDate: string | null;
    createdAt: string;
    updatedAt: string;
    lastActiveAt: string;
  };
  enrollments: AdminStudentEnrollmentItem[];
  progress: Array<{
    id: string;
    courseId: string;
    lessonId: string;
    lessonLabel: string;
    isCompleted: boolean;
    bestQuizScore: number | null;
    updatedAt: string;
  }>;
  mistakes: Array<{
    id: string;
    courseId: string;
    courseCode: string;
    lessonId: string | null;
    questionText: string;
    answerText: string;
    createdAt: string;
  }>;
  notes: Array<{
    id: string;
    lessonId: string;
    lessonLabel: string;
    content: string;
    updatedAt: string;
  }>;
  redemptions: Array<{
    id: string;
    code: string;
    targetLabel: string;
    ipHash: string | null;
    redeemedAt: string;
  }>;
  sessions: Array<{
    id: string;
    userAgent: string | null;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
  }>;
  aiUsageToday: number;
  aiDailyLimit: number;
}

export interface AdminSystemData {
  dbConnected: boolean;
  dbLatencyMs: number;
  serverTimeIso: string;
  tableCounts: {
    users: number;
    sessions: number;
    activeSessions: number;
    expiredSessions: number;
    activationCodes: number;
    enrollments: number;
    codeRedemptions: number;
    userProgress: number;
    userNotes: number;
    userMistakes: number;
    aiChatUsage: number;
  };
  envStatus: {
    databaseUrl: boolean;
    databaseUrlUnpooled: boolean;
    googleOAuth: boolean;
    geminiApiKey: boolean;
    geminiModel: string;
    aiDailyLimit: number;
    bunnyCdnHost: boolean;
    bunnyTokenKey: boolean;
    hlsSigningSecret: boolean;
    siteUrl: string;
    nodeEnv: string;
  };
  activeSessions: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: AdminUserRole;
    userAgent: string | null;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
  }>;
  aiUsage: {
    dateKey: string;
    dailyLimit: number;
    todayTotalRequests: number;
    sevenDayTotalRequests: number;
    entries: Array<{
      id: string;
      actorKey: string;
      actorType: "user" | "guest";
      actorLabel: string;
      actorEmail: string | null;
      dateKey: string;
      requestCount: number;
      updatedAt: string;
    }>;
  };
}

export const SCOPE_LABELS_AR: Record<ActivationScope, string> = {
  course: "مقرر كامل",
  lesson: "فصل محدد",
  bundle: "كل المقررات",
};

export const STATUS_LABELS_AR: Record<AdminCodeStatus, string> = {
  available: "متاح",
  used: "مستخدم",
  revoked: "ملغي",
  expired: "منتهي",
};

export function formatArabicDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function formatArabicDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 16).replace("T", " ");
  }
}
