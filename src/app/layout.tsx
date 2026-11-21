import type { Metadata, Viewport } from "next";
import { Cairo, Inter, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
import { MotionEffects } from "@/components/layout/MotionEffects";
import { ToastProvider } from "@/components/layout/ToastProvider";
import { GlobalModalsHost } from "@/components/modals/GlobalModalsHost";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("cs_portal_theme");var isDark=t==="dark";document.documentElement.dataset.theme=isDark?"dark":"light";if(isDark){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`;

function getSafeMetadataBase(): URL {
  try {
    return new URL(SITE_CONFIG.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: getSafeMetadataBase(),
  title: {
    default: "Ahmed Amir Ahmed — مساحة مذاكرة هندسية منظمة",
    template: "%s | Ahmed Amir Ahmed — CS Portal",
  },
  description:
    "منصة شرح مواد حاسبات والذكاء الاصطناعي — فيديوهات شرح مرتبة، ملخصات منظمة بالأكواد ومعادلات الرياضة، معامل تفاعلية، وكويزات تثبيت مع حفظ تلقائي للتقدم.",
  keywords: [
    "Ahmed Amir Ahmed",
    "بوابة حاسبات",
    "حاسبات ومعلومات",
    "ذكاء اصطناعي",
    "جامعة الزقازيق",
    "علوم الحاسب",
    "هياكل البيانات",
    "الخوارزميات",
    "نظم التشغيل",
    "CS Portal",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
  ],
  authors: [{ name: "Ahmed Amir Ahmed" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: SITE_CONFIG.url,
    siteName: "Ahmed Amir Ahmed — CS Portal",
    title: "Ahmed Amir Ahmed — مساحة مذاكرة هندسية منظمة",
    description:
      "منصة شرح مواد حاسبات والذكاء الاصطناعي — فيديوهات، ملخصات، معامل تفاعلية، وكويزات تثبيت في مكان واحد.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Amir Ahmed — مساحة مذاكرة هندسية منظمة",
    description:
      "منصة شرح مواد حاسبات والذكاء الاصطناعي — فيديوهات، ملخصات، معامل تفاعلية، وكويزات تثبيت في مكان واحد.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1319" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="light"
      suppressHydrationWarning
      className={`${cairo.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Static anti-flash theme bootstrap script — reads user preference before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--brand-soft)] selection:text-[var(--brand-soft-text)]">
        <MotionEffects />
        <ToastProvider>
          {children}
          <GlobalModalsHost />
        </ToastProvider>
      </body>
    </html>
  );
}
