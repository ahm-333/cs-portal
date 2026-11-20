import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { LoginForm } from "@/components/layout/LoginForm";

export const metadata: Metadata = {
  title: "ملف الطالب",
  description: `أعدّ ملفك المحلي في ${SITE_CONFIG.arabicName} (الاسم، الفرقة، والقسم) لتخصيص استوديو مذاكرتك.`,
};

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function sanitizeNextPath(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = sanitizeNextPath(resolvedSearchParams.next);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
