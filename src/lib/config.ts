export interface SocialLinkItem {
  id: "telegram" | "whatsapp" | "youtube" | "linkedin" | "github";
  label: string;
  icon: "send" | "message-circle" | "youtube" | "linkedin" | "github";
  color: string;
  url?: string;
}

export const SITE_CONFIG = {
  name: "Ahmed Amir Ahmed",
  arabicName: "منصة شرح مواد حاسبات",
  tagline: "منصة شرح مواد حاسبات — مساحة مذاكرة هندسية منظمة",
  description:
    "منصة شرح مواد حاسبات والذكاء الاصطناعي بأسلوب عملي منظّم يجمع بين الفيديوهات، الشرح التفاعلي، الملخصات بالأكواد ومعادلات الرياضة، والكويزات الفورية بالتفسير.",
  instructorName: "Ahmed Amir Ahmed",
  instructorTitle: "طالب فرقة تانية AI — جامعة الزقازيق",
  instructorBio:
    "بشرح مواد الحاسبات والذكاء الاصطناعي بأسلوب عملي منظّم يجمع بين الفيديو، التطبيق التفاعلي، الملخصات الواضحة، والكويزات عشان تذاكر بهدوء وتفهم صح.",
  universityBadge: "AI · Zagazig Univ.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  feedbackUrl: "mailto:support@cs-portal.dev?subject=CS%20Portal%20Feedback",
  socialLinks: [
    {
      id: "telegram",
      label: "Telegram",
      icon: "send",
      color: "#0284c7",
      url: undefined,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: "message-circle",
      color: "var(--success-fg)",
      url: undefined,
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: "youtube",
      color: "#c25e33",
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
      id: "github",
      label: "GitHub",
      icon: "github",
      color: "var(--text-primary)",
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
