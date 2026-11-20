import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { LoginForm } from "@/components/layout/LoginForm";

export const metadata: Metadata = {
  title: "ملف الطالب",
  description: `أعدّ ملفك المحلي في ${SITE_CONFIG.arabicName} (الاسم، الفرقة، والقسم) لتخصيص لوحة مذاكرتك.`,
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
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-cs-hero-glow px-4 py-12 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cs-grid [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"
      />
      <div className="relative z-10 flex w-full justify-center">
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
