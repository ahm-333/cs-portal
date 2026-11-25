export interface SocialLinkItem {
  id: "telegram" | "whatsapp" | "youtube" | "linkedin" | "github";
  label: string;
  icon: "send" | "message-circle" | "youtube" | "linkedin" | "github";
  color: string;
  url?: string;
}

export const SITE_CONFIG = {
  name: "Eng. Ahmed Amir",
  arabicName: "بوابة حاسبات",
  tagline: "Eng. Ahmed Amir — بوابة حاسبات والذكاء الاصطناعي",
  description:
    "منصة مذاكرة هندسية منظمة لطلبة الحاسبات والذكاء الاصطناعي تجمع بين الفيديوهات، المعامل التفاعلية، الملخصات بالأكواد ومعادلات الرياضة، والكويزات الفورية.",
  instructorName: "Eng. Ahmed Amir",
  instructorTitle: "AI · Zagazig University",
  instructorBio:
    "مساحة مذاكرة هادية ومنظمة تجمع الفيديو، المعمل التفاعلي، الملخصات الواضحة، والكويزات عشان تذاكر بهدوء وتفهم صح.",
  universityBadge: "AI · Zagazig Univ.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  feedbackUrl: "mailto:support@cs-portal.dev?subject=CS%20Portal%20Feedback",
  socialLinks: [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: "message-circle",
      color: "var(--success-fg)",
      url: undefined,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: "linkedin",
      color: "var(--brand-primary)",
      url: undefined,
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: "send",
      color: "#0284c7",
      url: undefined,
    },
  ] satisfies SocialLinkItem[],
  years: [
    { value: 1, label: "الفرقة الأولى" },
    { value: 2, label: "الفرقة الثانية" },
    { value: 3, label: "الفرقة الثالثة" },
    { value: 4, label: "الفرقة الرابعة" },
  ] as const,
  terms: [
    { value: 1, label: "الترم الأول" },
    { value: 2, label: "الترم الثاني" },
  ] as const,
};
