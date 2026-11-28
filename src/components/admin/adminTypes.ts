export type ActivationScope = "course" | "lesson" | "bundle";
export type AdminCodeStatus = "available" | "used" | "revoked" | "expired";
export type AdminEnrollmentStatus = "active" | "revoked" | "expired";
export type AdminUserRole = "student" | "admin";

export type AdminTab =
  | "overview"
  | "subscriptions"
  | "students"
  | "courses"
  | "security"
  | "inbox"
  | "system";

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
  price?: number;
  isLocked?: boolean;
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
  price?: number;
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
  type: "signup" | "redemption" | "enrollment" | "subscription";
  title: string;
  subtitle: string;
  meta: string | null;
  createdAt: string;
}

export interface AdminDailySeriesPoint {
  label: string;
  dateKey: string;
  signups: number;
  enrollments: number;
  completions: number;
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
  // Executive Command Center extensions
  estimatedRevenue?: number;
  pendingSubscriptionsCount?: number;
  securityAlertsCount?: number;
  unreadNotificationsCount?: number;
  openMessagesCount?: number;
  dailySeries?: AdminDailySeriesPoint[];
  dbLatencyMs?: number;
}

export type AdminSubscriptionStatus = "pending" | "approved" | "rejected";
export type AdminPaymentMethod = "vodafone_cash" | "instapay";

export interface AdminSubscriptionRequest {
  id: string;
  userId: string;
  studentName?: string;
  userName?: string;
  studentEmail?: string;
  userEmail?: string;
  studentPhone?: string | null;
  userPhone?: string | null;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  amount: number;
  method: AdminPaymentMethod | string;
  senderInfo: string;
  receiptData: string | null;
  status: AdminSubscriptionStatus;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export type AdminNotificationType = "security" | "payment" | "message";
export type AdminNotificationSeverity = "info" | "warning" | "critical";

export interface AdminNotificationItem {
  id: string;
  type: AdminNotificationType;
  severity: AdminNotificationSeverity;
  title: string;
  body: string;
  userId: string | null;
  metaJson: string | null;
  isRead: boolean;
  createdAt: string;
}

export type AdminMessageType = "suggest" | "bug" | "support";
export type AdminMessageStatus = "open" | "resolved";

export interface AdminStudentMessageItem {
  id: string;
  userId: string | null;
  senderName: string;
  senderPhone: string | null;
  senderEmail: string | null;
  type: AdminMessageType;
  title: string;
  body: string;
  status: AdminMessageStatus;
  createdAt: string;
}

export interface AdminCourseOverride {
  courseId: string;
  isPublished: boolean;
  isPaid: boolean;
  price: number;
  isLocked: boolean;
  freeLessonIds?: string[];
  freeLessonIdsJson?: string | null;
  updatedAt?: string | null;
}

export interface AdminSiteSettings {
  maxDevicesPerUser: number;
  enforceSingleSession: boolean;
  aiDailyLimit: number;
  registrationOpen: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  announcementAudience: string;
  vodafoneCashNumber: string;
  instaPayHandle: string;
  updatedAt?: string | null;
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
  // Security & device telemetry
  isSuspended?: boolean;
  suspendReason?: string | null;
  devicesCount?: number;
  deviceAlert?: boolean;
  activeDeviceNames?: string[];
}

export interface AdminStudentDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  firstSeenAt?: string | null;
  lastSeenAt: string;
  isActiveNow: boolean;
  isBlocked: boolean;
}

export interface AdminStudentChapterGrade {
  lessonId: string;
  title: string;
  orderIndex?: number;
  isCompleted: boolean;
  bestQuizScore: number | null;
  updatedAt?: string | null;
}

export interface AdminStudentCourseBreakdown {
  courseId: string;
  courseCode?: string;
  code?: string;
  courseTitle?: string;
  title?: string;
  isPaid?: boolean;
  isEnrolled: boolean;
  completedCount: number;
  totalLessons: number;
  lastLessonTitle: string | null;
  averageQuizScore: number | null;
  chapterGrades: AdminStudentChapterGrade[];
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
    isSuspended?: boolean;
    suspendReason?: string | null;
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
    deviceId?: string | null;
    deviceName?: string | null;
    ipAddress?: string | null;
    lastSeenAt?: string | null;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
  }>;
  courseBreakdown?: AdminStudentCourseBreakdown[];
  devices?: AdminStudentDevice[];
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
    deviceName?: string | null;
    ipAddress?: string | null;
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
  course: "مادة كاملة",
  lesson: "فصل محدد",
  bundle: "كل المواد",
};

export const STATUS_LABELS_AR: Record<AdminCodeStatus, string> = {
  available: "متاح",
  used: "مستخدم",
  revoked: "ملغي",
  expired: "منتهي",
};

export const SUBSCRIPTION_STATUS_AR: Record<AdminSubscriptionStatus, string> = {
  pending: "معلّق",
  approved: "مقبول",
  rejected: "مرفوض",
};

export const PAYMENT_METHOD_AR: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "InstaPay",
};

export const MESSAGE_TYPE_AR: Record<AdminMessageType, string> = {
  bug: "تبليغ خطأ",
  suggest: "اقتراح مادة",
  support: "رسالة",
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

export function formatRelativeArabicTime(
  iso: string | null | undefined
): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const ts = date.getTime();
  if (Number.isNaN(ts)) return "—";
  const diffSec = Math.round((Date.now() - ts) / 1000);
  if (diffSec < 60) return "الآن";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `منذ ${diffMin} د`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `منذ ${diffHr} س`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `منذ ${diffDay} ي`;
  return formatArabicDate(iso);
}

export function formatEgp(amount: number | null | undefined): string {
  const safe = Number.isFinite(amount) ? Number(amount) : 0;
  try {
    return `${new Intl.NumberFormat("ar-EG").format(safe)} ج.م`;
  } catch {
    return `${safe} ج.م`;
  }
}
