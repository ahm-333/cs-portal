export const SITE_CONFIG = {
  name: "CS Portal",
  arabicName: "بوابة حاسبات",
  tagline:
    "منصة مذاكرة تفاعلية لطلبة حاسبات ومعلومات — ملخصات، أكواد، معامل تفاعلية، وكويزات",
  description:
    "منصة تعليمية احترافية لطلبة علوم الحاسب: شروحات فيديو، ملخصات بالأكواد ومعادلات الرياضة، معامل HTML تفاعلية لمحاكاة الخوارزميات، وكويزات فورية بالتفسير.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  feedbackUrl: "mailto:support@cs-portal.dev?subject=CS%20Portal%20Feedback",
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
