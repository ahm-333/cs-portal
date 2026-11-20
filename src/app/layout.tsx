import type { Metadata, Viewport } from "next";
import { Alexandria, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
import { Navbar } from "@/components/layout/Navbar";
import { AppNavRail } from "@/components/layout/AppNavRail";
import { Footer } from "@/components/layout/Footer";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-alexandria",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("cs_portal_theme");if(t==="light"||t==="reading"||t==="dark"){document.documentElement.dataset.theme=t;if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}}catch(e){}})();`;

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
    default: `${SITE_CONFIG.arabicName} — ${SITE_CONFIG.name}`,
    template: `%s | ${SITE_CONFIG.arabicName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "بوابة حاسبات",
    "حاسبات ومعلومات",
    "علوم الحاسب",
    "هياكل البيانات",
    "الخوارزميات",
    "نظم التشغيل",
    "CS Portal",
    "Computer Science",
    "Data Structures",
    "Algorithms",
    "Interactive Labs",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.arabicName} (${SITE_CONFIG.name})`,
    title: `${SITE_CONFIG.arabicName} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.arabicName} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#171a2c" },
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
      className={`${alexandria.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Static anti-flash theme bootstrap script — reads user preference before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] font-sans antialiased selection:bg-[var(--soft)] selection:text-[var(--accent)]">
        <Navbar />
        <AppNavRail />
        <div className="flex min-h-[calc(100vh-72px)] flex-1 flex-col pb-20 lg:pb-0 lg:pr-[224px]">
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
