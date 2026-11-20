import type { Metadata } from "next";
import { isSupabaseConfigured, SITE_CONFIG } from "@/lib/config";
import { LoginForm } from "@/components/layout/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: `سجّل الدخول إلى ${SITE_CONFIG.arabicName} لمتابعة تقدمك في المواد ودرجات الكويزات.`,
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

function getStringParam(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && value.trim().length > 0 ? value.trim() : null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = sanitizeNextPath(resolvedSearchParams.next);
  const initialError = getStringParam(resolvedSearchParams.error);
  const isDemoMode = !isSupabaseConfigured();

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-cs-hero-glow px-4 py-12 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cs-grid [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"
      />
      <div className="relative z-10 flex w-full justify-center">
        <LoginForm
          nextPath={nextPath}
          initialError={initialError}
          isDemoMode={isDemoMode}
        />
      </div>
    </div>
  );
}
