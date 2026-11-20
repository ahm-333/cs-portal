import type { Metadata, Viewport } from "next";
import { Cairo, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
  themeColor: "#020617",
  colorScheme: "dark",
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
      className={`dark ${cairo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-100">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
