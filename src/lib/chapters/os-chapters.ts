import type { InteractiveChapterData } from "@/types/chapter";

// Auto-generated from verified chapter HTML sources with CS Portal theme harmonization.
// Quizzes are intentionally excluded here and live exclusively in os-questions.ts.
export const OS_CHAPTERS: InteractiveChapterData[] = [
  {
    "lessonId": "22222222-2222-4222-8222-222222222301",
    "courseCode": "CS-311",
    "chapterNum": 1,
    "titleEn": "Introduction",
    "titleAr": "مقدمة في نظم التشغيل وبنية الحاسب",
    "subtitle": "كل سلايد في Chapter 1 منفردة لوحدها (من Slide 1.4 لـ Slide 1.30): السلايد ورسمتها على اليمين، والشرح المفصل على الشمال.",
    "slides": [
      {
        "id": "s1-4",
        "slideRef": "Slide 1.4",
        "shortLabel": "1.4 رسمة المكونات",
        "title": "Four Components of a Computer System — الرسمة الهيكلية للطبقات الأربعة",
        "enPoints": [
          "Top layer: <strong>user 1, user 2, user 3, ..., user n</strong> interacting via bidirectional arrows.",
          "Second layer: <strong>system and application programs</strong> (<code>compiler</code>, <code>assembler</code>, <code>text editor</code>, ..., <code>database system</code>).",
          "Third layer: <strong>operating system</strong> sitting directly above hardware.",
          "Bottom layer: <strong>computer hardware</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 285\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m14\" viewBox=\"0 0 10 10\" refX=\"6\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#66c7a6\"/>\n    </marker>\n  </defs>\n  <rect x=\"28\" y=\"16\" width=\"110\" height=\"44\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"83\" y=\"43\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">user 1</text>\n  <rect x=\"166\" y=\"16\" width=\"110\" height=\"44\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"221\" y=\"43\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">user 2</text>\n  <rect x=\"304\" y=\"16\" width=\"110\" height=\"44\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"359\" y=\"43\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">user 3</text>\n  <text x=\"482\" y=\"44\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"20\" text-anchor=\"middle\">• • •</text>\n  <rect x=\"556\" y=\"16\" width=\"114\" height=\"44\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"613\" y=\"43\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">user n</text>\n\n  <line x1=\"83\" y1=\"64\" x2=\"83\" y2=\"96\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-start=\"url(#m14)\" marker-end=\"url(#m14)\"/>\n  <line x1=\"221\" y1=\"64\" x2=\"221\" y2=\"96\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-start=\"url(#m14)\" marker-end=\"url(#m14)\"/>\n  <line x1=\"359\" y1=\"64\" x2=\"359\" y2=\"96\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-start=\"url(#m14)\" marker-end=\"url(#m14)\"/>\n  <line x1=\"613\" y1=\"64\" x2=\"613\" y2=\"96\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-start=\"url(#m14)\" marker-end=\"url(#m14)\"/>\n\n  <rect x=\"28\" y=\"102\" width=\"642\" height=\"60\" rx=\"12\" fill=\"#152238\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"83\" y=\"124\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">compiler</text>\n  <text x=\"221\" y=\"124\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">assembler</text>\n  <text x=\"359\" y=\"124\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">text editor</text>\n  <text x=\"482\" y=\"124\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" text-anchor=\"middle\">...</text>\n  <text x=\"605\" y=\"124\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">database system</text>\n  <text x=\"350\" y=\"150\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">system and application programs</text>\n\n  <rect x=\"115\" y=\"172\" width=\"470\" height=\"46\" rx=\"12\" fill=\"rgba(194,94,51,0.2)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"200\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14.5\" font-weight=\"800\" text-anchor=\"middle\">operating system</text>\n\n  <rect x=\"210\" y=\"228\" width=\"280\" height=\"44\" rx=\"10\" fill=\"#1c2533\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"255\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" font-weight=\"700\" text-anchor=\"middle\">computer hardware</text>\n</svg>",
        "svgCaption": "Slide 1.4 · Four Components of a Computer System",
        "why": "الرسمة دي بتوضحلك «خريطة المعمار» بتاع أي جهاز كمبيوتر في العالم: مين بيكلم مين، ومين واقف في النص عشان يمنع الفوضى بين البرامج والهاردوير.",
        "deepPoints": [
          "<strong>لاحظ اتجاه الأسهم:</strong> المستخدمين (<span class='code-pill'>user 1..n</span>) بيتفاعلوا مع البرامج (<span class='en-pill'>compiler, assembler, text editor, database system</span>)، والبرامج بتنزل على الـ <span class='en-pill'>operating system</span>، وهو اللي بيدير الـ <span class='en-pill'>computer hardware</span>.",
          "<strong>ليه الـ OS محصور بين البرامج والهاردوير؟</strong> عشان مفيش برنامج تطبيق يتكلم مع الهاردوير مباشرة ويبوظ بيانات برنامج تاني؛ كل طلبات الهاردوير بتعدي عبر نظام التشغيل."
        ],
        "examSpot": "ارسم أو رتب الطبقات الأربع من أسفل لأعلى: <strong>Computer Hardware → Operating System → System &amp; Application Programs → Users</strong>.",
        "notebookEn": "Slide 1.4 Architecture (Bottom to Top):\nHardware -> Operating System -> System & Application Programs -> Users 1..n.",
        "notebookAr": "الـ OS يقف كطبقة وسيطة بين الهاردوير تحت والبرامج والمستخدمين فوق."
      },
      {
        "id": "s1-5",
        "slideRef": "Slide 1.5",
        "shortLabel": "1.5 شرح المكونات الـ 4",
        "title": "Computer System Structure — شرح المكونات الأربعة بالتفصيل والأمثلة",
        "enPoints": [
          "<strong>Hardware</strong> — provides basic computing resources: <strong>CPU, memory, I/O devices</strong>.",
          "<strong>Operating system</strong> — <strong>Controls and coordinates</strong> use of hardware among various applications and users.",
          "<strong>Application programs</strong> — define the ways in which system resources are used to solve the computing problems of users (<strong>Word processors, compilers, web browsers, database systems, video games</strong>).",
          "<strong>Users</strong> — <strong>People, machines, other computers</strong>."
        ],
        "svg": null,
        "why": "دي السلايد اللي بتترجم رسمة 1.4 لتعريفات رسمية وأمثلة محددة بتيجي مباشرة في أسئلة المقالي والاختياري.",
        "deepPoints": [
          "<strong><span class='en-pill'>Hardware</span>:</strong> موارد الحوسبة الأساسية الثلاثة (<span class='en-pill'>CPU, memory, I/O devices</span>).",
          "<strong><span class='en-pill'>Operating system</span>:</strong> وظيفته الأساسية كلمتين مهمين جداً: <strong>التحكم والتنسيق (<span class='en-pill'>Controls and coordinates</span>)</strong> لاستخدام الهاردوير.",
          "<strong><span class='en-pill'>Application programs</span>:</strong> البرامج اللي بتستخدم الموارد لحل مشاكل المستخدمين (مثل <span class='en-pill'>Word processors, compilers, web browsers, database systems, video games</span>).",
          "<strong><span class='en-pill'>Users</span>:</strong> مش بس بشر (<span class='en-pill'>People</span>) — بتشمل كمان الآلات (<span class='en-pill'>Machines</span>) والكمبيوترات الأخرى (<span class='en-pill'>Other computers</span>)."
        ],
        "examSpot": "سؤال مقالي أساسي: <strong>What are the four components of a computer system?</strong> اكتب الأربعة مع وظيفة ومثال كل واحد.",
        "notebookEn": "4 Components (Slide 1.5):\n1) Hardware (CPU, memory, I/O)\n2) Operating System (controls & coordinates)\n3) Application Programs (compilers, browsers, DB, games)\n4) Users (people, machines, other computers).",
        "notebookAr": "المكونات الأربعة: Hardware، Operating System، Application Programs، Users."
      },
      {
        "id": "s1-6",
        "slideRef": "Slide 1.6",
        "shortLabel": "1.6 تعريف وأهداف الـ OS",
        "title": "What is an Operating System? — التعريف الرسمي وأهدافه الثلاثة",
        "enPoints": [
          "A program that acts as an <strong>intermediary</strong> between a user of a computer and the computer hardware.",
          "<strong>Operating system goals:</strong>",
          "• <strong>Execute user programs</strong> and make solving user problems easier.",
          "• Make the computer system <strong>convenient</strong> to use.",
          "• Use the computer hardware in an <strong>efficient</strong> manner."
        ],
        "svg": null,
        "why": "عشان نعرف نقيس هل نظام تشغيل معين ناجح ولا لأ، لازم نعرف إيه دوره (وسيط) وإيه الـ 3 أهداف اللي اتبنى عشان يحققها.",
        "deepPoints": [
          "<strong>دور الوسيط (<span class='en-pill'>Intermediary</span>):</strong> بيخفي عنك تعقيد الدوائر الكهربائية والإشارات ويقدملك واجهة سهلة تتعامل معاها.",
          "<strong>الأهداف الـ 3:</strong> (1) تشغيل برامج المستخدم وتسهيل حل المشاكل، (2) الراحة وسهولة الاستخدام (<span class='en-pill'>Convenience</span>)، و(3) استغلال الهاردوير بكفاءة (<span class='en-pill'>Efficiency</span>) بدون إهدار للـ CPU أو الرام."
        ],
        "examSpot": "احفظ الكلمتين دول للـ MCQ: الـ OS يعمل كـ <strong>Intermediary</strong>، وأهم هدفين متوازنين هما <strong>Convenience</strong> و <strong>Efficiency</strong>.",
        "notebookEn": "Slide 1.6: OS = Intermediary between user and hardware.\nGoals: (1) Execute user programs, (2) Convenient to use, (3) Efficient hardware use.",
        "notebookAr": "نظام التشغيل وسيط بين المستخدم والهاردوير، وأهدافه: تشغيل البرامج، السهولة، والكفاءة."
      },
      {
        "id": "s1-7",
        "slideRef": "Slide 1.7",
        "shortLabel": "1.7 User vs System View",
        "title": "What Operating Systems Do — نظرة المستخدم مقابل نظرة النظام",
        "enPoints": [
          "<strong>Users view:</strong> Users want <strong>convenience, ease of use</strong> and <strong>good performance</strong>; <strong>don't care about resource utilization</strong>.",
          "<strong>System view:</strong>",
          "• OS is a <strong>resource allocator</strong> — manages all resources; decides between conflicting requests for efficient and fair resource use.",
          "• OS is a <strong>control program</strong> — controls execution of programs to prevent errors and improper use of the computer."
        ],
        "svg": null,
        "why": "نظرة الشخص اللي قاعد قدام الشاشة مختلفة تماماً عن نظرة مهندس النظام من جوه! السلايد دي بتفرق بين النظرتين.",
        "deepPoints": [
          "<strong><span class='en-pill'>Users View</span>:</strong> المستخدم الشخصي يهمه الراحة (<span class='en-pill'>Convenience</span>) وسهولة الاستخدام (<span class='en-pill'>Ease of use</span>) والأداء الجيد، ولا يهتم باستغلال الموارد (<span class='en-pill'>Resource utilization</span>).",
          "<strong><span class='en-pill'>System View</span> — دورين:</strong> (1) <strong><span class='en-pill'>Resource Allocator</span></strong> (موزع موارد) يفصل بين الطلبات المتعارضة بعدل وكفاءة، و(2) <strong><span class='en-pill'>Control Program</span></strong> (برنامج تحكم) يمنع الأخطاء والاستخدام الخاطئ للكمبيوتر."
        ],
        "examSpot": "سؤال امتحان مباشر: From the System View, the OS acts as a <strong>Resource Allocator</strong> and a <strong>Control Program</strong>.",
        "notebookEn": "Slide 1.7:\n- User View: Convenience, ease of use, good performance (ignores resource utilization).\n- System View: Resource Allocator + Control Program.",
        "notebookAr": "نظرة المستخدم: سهولة وأداء؛ نظرة النظام: Resource Allocator و Control Program."
      },
      {
        "id": "s1-8",
        "slideRef": "Slide 1.8",
        "shortLabel": "1.8 النواة The Kernel",
        "title": "Operating System Definition (Cont.) — تعريف الـ Kernel",
        "enPoints": [
          "No universally accepted definition.",
          "“Everything a vendor ships when you order an operating system” is a good approximation (but varies wildly).",
          "<strong>“The one program running at all times on the computer” is the kernel.</strong>",
          "Everything else is either: a <strong>system program</strong> (ships with the OS), or an <strong>application program</strong>."
        ],
        "svg": null,
        "why": "لما تشتري Windows أو تحمل Linux بيجي معاه متصفح وآلة حاسبة ومفكرة. هل الآلة الحاسبة جزء من الـ OS الحقيقي؟ السلايد دي بتحسم الجدل بتعريف الـ Kernel!",
        "deepPoints": [
          "<strong><span class='en-pill'>The Kernel</span>:</strong> هو <strong>البرنامج الوحيد الذي يعمل طوال الوقت على الكمبيوتر</strong>؛ موجود في الرام من لحظة الإقلاع لحد إغلاق الجهاز وبيدير كل الموارد.",
          "<strong>ما عدا الـ Kernel نوعين فقط:</strong> إما <strong><span class='en-pill'>System Program</span></strong> (برنامج نظام مساعد بيجي مع نسخة الـ OS زي مدير الملفات)، أو <strong><span class='en-pill'>Application Program</span></strong> (برنامج تطبيقي زي Chrome و Word)."
        ],
        "examSpot": "جملة امتحان ثابتة: “The one program running at all times on the computer” is <strong>the Kernel</strong>.",
        "notebookEn": "Slide 1.8: Kernel = The ONE program running at all times.\nEverything else = System program OR Application program.",
        "notebookAr": "الـ Kernel هو البرنامج الوحيد الشغال طول الوقت؛ والباقي إما System program أو Application program."
      },
      {
        "id": "s1-9",
        "slideRef": "Slide 1.9",
        "shortLabel": "1.9 Bootstrap Program",
        "title": "Computer Startup — إقلاع الكمبيوتر وبرنامج Bootstrap",
        "enPoints": [
          "<strong>bootstrap program</strong> is loaded at <strong>power-up or reboot</strong>.",
          "Typically stored in <strong>ROM or EPROM</strong>, generally known as <strong>firmware</strong>.",
          "<strong>Initializes</strong> all aspects of system.",
          "<strong>Loads operating system kernel</strong> and starts execution."
        ],
        "svg": null,
        "why": "الـ RAM ذاكرة متطايرة بتكون فاضية تماماً أول ما تدوس زرار الباور؛ فمين اللي هيشغل الـ Kernel وهو لسه على الهارد؟ برنامج صغير دائم اسمه Bootstrap.",
        "deepPoints": [
          "<strong>مكان التخزين:</strong> مخزن في ذاكرة قراءة فقط غير متطايرة <span class='en-pill'>ROM</span> أو <span class='en-pill'>EPROM</span>، ويُعرف باسم <strong><span class='en-pill'>Firmware</span></strong>.",
          "<strong>الخطوتين اللي بيعملهم عند الفتح (<span class='en-pill'>Power-up / Reboot</span>):</strong> (1) تهيئة كافة مكونات النظام (<span class='en-pill'>Initializes all aspects of system</span>)، و(2) تحميل الـ <strong><span class='en-pill'>OS Kernel</span></strong> في الـ RAM وبدء تنفيذه."
        ],
        "examSpot": "سؤال الميدتيرم Q6: <em>What is a Bootstrap Program?</em> اذكر إنه Firmware في ROM/EPROM يشتغل عند Power-up/Reboot ليهيئ النظام ويحمل الـ Kernel.",
        "notebookEn": "Slide 1.9 Bootstrap Program:\n- Loaded at power-up/reboot | Stored in ROM/EPROM (Firmware).\n- Tasks: (1) Initializes system, (2) Loads OS kernel & starts execution.",
        "notebookAr": "الـ Bootstrap مخزن في ROM (Firmware)، يهيئ النظام عند الفتح ويحمل الـ Kernel في الرام."
      },
      {
        "id": "s1-10",
        "slideRef": "Slide 1.10",
        "shortLabel": "1.10 تنظيم النظام والـ Bus",
        "title": "Computer System Organization — تنظيم النظام والـ Common Bus",
        "enPoints": [
          "One or more <strong>CPUs</strong>, <strong>device controllers</strong> connect through <strong>common bus</strong> providing access to <strong>shared memory</strong>.",
          "<strong>Concurrent execution</strong> of CPUs and devices competing for <strong>memory cycles</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 245\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- Devices top -->\n  <text x=\"235\" y=\"24\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">disks</text>\n  <line x1=\"235\" y1=\"30\" x2=\"235\" y2=\"54\" stroke=\"#64748B\" stroke-width=\"2\"/>\n\n  <text x=\"355\" y=\"24\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">mouse</text>\n  <text x=\"425\" y=\"24\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">keyboard</text>\n  <text x=\"498\" y=\"24\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">printer</text>\n  <line x1=\"355\" y1=\"30\" x2=\"400\" y2=\"54\" stroke=\"#64748B\" stroke-width=\"1.8\"/>\n  <line x1=\"425\" y1=\"30\" x2=\"425\" y2=\"54\" stroke=\"#64748B\" stroke-width=\"1.8\"/>\n  <line x1=\"498\" y1=\"30\" x2=\"450\" y2=\"54\" stroke=\"#64748B\" stroke-width=\"1.8\"/>\n\n  <text x=\"604\" y=\"24\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">monitor</text>\n  <line x1=\"604\" y1=\"30\" x2=\"604\" y2=\"54\" stroke=\"#64748B\" stroke-width=\"2\"/>\n\n  <!-- Controllers -->\n  <rect x=\"26\" y=\"54\" width=\"112\" height=\"52\" rx=\"10\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"82\" y=\"85\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"15\" font-weight=\"800\" text-anchor=\"middle\">CPU</text>\n\n  <rect x=\"168\" y=\"54\" width=\"134\" height=\"52\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"235\" y=\"77\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">disk</text>\n  <text x=\"235\" y=\"95\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" text-anchor=\"middle\">controller</text>\n\n  <rect x=\"334\" y=\"54\" width=\"180\" height=\"52\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"424\" y=\"85\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">USB controller</text>\n\n  <rect x=\"540\" y=\"54\" width=\"130\" height=\"52\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"605\" y=\"77\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">graphics</text>\n  <text x=\"605\" y=\"95\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" text-anchor=\"middle\">adapter</text>\n\n  <!-- Vertical to bus -->\n  <line x1=\"82\" y1=\"106\" x2=\"82\" y2=\"146\" stroke=\"#94A3B8\" stroke-width=\"2.2\"/>\n  <line x1=\"235\" y1=\"106\" x2=\"235\" y2=\"146\" stroke=\"#94A3B8\" stroke-width=\"2.2\"/>\n  <line x1=\"424\" y1=\"106\" x2=\"424\" y2=\"146\" stroke=\"#94A3B8\" stroke-width=\"2.2\"/>\n  <line x1=\"605\" y1=\"106\" x2=\"605\" y2=\"146\" stroke=\"#94A3B8\" stroke-width=\"2.2\"/>\n\n  <!-- Common Bus -->\n  <line x1=\"82\" y1=\"146\" x2=\"605\" y2=\"146\" stroke=\"#e58a62\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n  <text x=\"545\" y=\"137\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">common bus</text>\n\n  <line x1=\"350\" y1=\"146\" x2=\"350\" y2=\"180\" stroke=\"#e58a62\" stroke-width=\"3\"/>\n  <rect x=\"240\" y=\"180\" width=\"220\" height=\"48\" rx=\"12\" fill=\"#1c2533\" stroke=\"#7ca7f0\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"209\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"15\" font-weight=\"800\" text-anchor=\"middle\">memory</text>\n</svg>",
        "svgCaption": "Slide 1.10 · Computer System Organization (Common Bus)",
        "why": "عشان الـ CPU والأجهزة (هارد، كيبورد، شاشة) يشتغلوا سوا في نفس اللحظة، كلهم متوصلين على ناقل مشترك بيوصلهم لنفس الـ RAM.",
        "deepPoints": [
          "<strong>الـ <span class='en-pill'>Common Bus</span>:</strong> الخط الرئيسي اللي بيربط الـ <span class='en-pill'>CPU</span> مع <span class='en-pill'>disk controller</span> و<span class='en-pill'>USB controller</span> و<span class='en-pill'>graphics adapter</span> بالـ <strong><span class='en-pill'>Shared memory</span></strong>.",
          "<strong>التنفيذ المتوازي (<span class='en-pill'>Concurrent execution</span>):</strong> المعالج ومتحكمات الأجهزة بيشتغلوا بالتوازي وبيتنافسوا على دورات الذاكرة (<span class='en-pill'>Memory cycles</span>)."
        ],
        "examSpot": "تذكر: الـ CPUs والـ Device controllers متصلة عبر <strong>Common Bus</strong> للوصول إلى <strong>Shared Memory</strong> وتعمل بـ <strong>Concurrent execution</strong>.",
        "notebookEn": "Slide 1.10: CPUs + Device Controllers connect via Common Bus to Shared Memory (concurrent execution competing for memory cycles).",
        "notebookAr": "المعالج ومتحكمات الأجهزة متصلون عبر Common Bus بالذاكرة المشتركة ويعملون بالتوازي."
      },
      {
        "id": "s1-11",
        "slideRef": "Slide 1.11",
        "shortLabel": "1.11 تشغيل الـ I/O والـ Buffer",
        "title": "Computer-System Operation — آلية عمل الـ Local Buffer والمقاطعة",
        "enPoints": [
          "<strong>I/O devices and the CPU can execute concurrently.</strong>",
          "Each <strong>device controller</strong> is in charge of a particular device type and has a <strong>local buffer</strong>.",
          "<strong>CPU moves data</strong> from/to main memory to/from local buffers.",
          "<strong>I/O</strong> is from the device to local buffer of controller.",
          "Device controller informs CPU that it has finished its operation by causing an <strong>interrupt</strong>."
        ],
        "svg": null,
        "why": "لأن أجهزة الـ I/O بطيئة جداً مقارنة بالمعالج، بنفصل نقل الداتا على مرحلتين عشان المعالج ميكسلش وهو مستني الجهاز.",
        "deepPoints": [
          "<strong>المرحلة 1 (الـ <span class='en-pill'>I/O</span>):</strong> تتم بين الجهاز نفسه وبين الـ <strong><span class='en-pill'>Local buffer</span></strong> الموجود جوه الـ Device controller (والـ CPU شغال في حاجة تانية بالتوازي).",
          "<strong>المرحلة 2 (إشارة الـ <span class='en-pill'>Interrupt</span>):</strong> أول ما الـ Controller يخلص عمليته، بيبعت <strong><span class='en-pill'>Interrupt</span></strong> للـ CPU.",
          "<strong>المرحلة 3 (نقل للرام):</strong> الـ <strong><span class='en-pill'>CPU</span></strong> هو اللي بينقل البيانات بين الـ <span class='en-pill'>Main memory</span> والـ <span class='en-pill'>Local buffer</span>."
        ],
        "examSpot": "ركز: الـ <strong>I/O</strong> = الجهاز ↔ Local Buffer، والـ <strong>CPU</strong> ينقل بين الـ Main Memory ↔ Local Buffer، والـ Controller يبلغ الانتهاء عبر <strong>Interrupt</strong>.",
        "notebookEn": "Slide 1.11:\n- Each controller has a Local Buffer.\n- I/O = Device <-> Local Buffer | CPU moves = Main Memory <-> Local Buffer.\n- Controller signals finish by causing an INTERRUPT.",
        "notebookAr": "كل متحكم له Local Buffer؛ الـ I/O يتم للجهاز والـ Buffer، والمتحكم يبلغ الـ CPU بالانتهاء عبر Interrupt."
      },
      {
        "id": "s1-12",
        "slideRef": "Slide 1.12",
        "shortLabel": "1.12 Interrupt Vector & Trap",
        "title": "Common Functions of Interrupts — جدول المقاطعات والـ Trap",
        "enPoints": [
          "Interrupt transfers control to the <strong>interrupt service routine (ISR)</strong> generally through the <strong>interrupt vector</strong>, which contains the <strong>addresses of all the service routines</strong>.",
          "Interrupt architecture must <strong>save the address of the interrupted instruction</strong>.",
          "A <strong>trap</strong> or <strong>exception</strong> is a <strong>software-generated interrupt</strong> caused either by an <strong>error</strong> or a <strong>user request</strong>.",
          "<strong>An operating system is interrupt driven.</strong>"
        ],
        "svg": null,
        "why": "لما تحصل مقاطعة فجأة، المعالج محتاج يعرف فوراً أنهي كود يشغله عشان يعالجها، وإزاي يرجع لنفس النقطة اللي كان واقف عندها.",
        "deepPoints": [
          "<strong><span class='en-pill'>Interrupt Vector</span>:</strong> جدول يحتوي على عناوين جميع دوال معالجة المقاطعات (<span class='en-pill'>ISRs</span>) لتوجيه المعالج مباشرة للدالة الصحيحة.",
          "<strong>حفظ العنوان:</strong> لازم الهاردوير يحفظ عنوان التعليمة اللي اتقاطعت (<span class='en-pill'>Save address of interrupted instruction</span>) عشان يرجع يكمل بعدها.",
          "<strong><span class='en-pill'>Trap / Exception</span>:</strong> مقاطعة برمجية (<span class='en-pill'>Software-generated interrupt</span>) سببها إما خطأ برمجي (زي القسمة على صفر) أو طلب خدمة (<span class='en-pill'>System call</span>)."
        ],
        "examSpot": "سؤال متكرر جداً: <strong>Trap / Exception</strong> = <strong>Software-generated interrupt</strong> (error or user request). و <strong>Interrupt Vector</strong> = addresses of all ISRs.",
        "notebookEn": "Slide 1.12:\n- Interrupt Vector = addresses of all service routines (ISRs).\n- Must save address of interrupted instruction.\n- Trap / Exception = software-generated interrupt (error or user request).\n- OS is interrupt driven.",
        "notebookAr": "الـ Interrupt Vector يحمل عناوين الـ ISRs، والـ Trap هو مقاطعة برمجية بسبب خطأ أو طلب خدمة."
      },
      {
        "id": "s1-13",
        "slideRef": "Slide 1.13",
        "shortLabel": "1.13 هيكل التخزين",
        "title": "Storage Structure — الذاكرة الرئيسية مقابل التخزين الثانوي",
        "enPoints": [
          "<strong>Main memory</strong> — <strong>only large storage media that the CPU can access directly</strong>; <strong>random access</strong>; typically <strong>volatile</strong>.",
          "<strong>Secondary storage</strong> — extension of main memory providing large <strong>nonvolatile</strong> storage capacity.",
          "<strong>Hard disks</strong> — rigid metal/glass platters with magnetic material; surface logically divided into <strong>tracks</strong>, subdivided into <strong>sectors</strong>; managed by <strong>disk controller</strong>.",
          "<strong>Solid-state disks (SSD)</strong> — faster than hard disks, <strong>nonvolatile</strong>."
        ],
        "svg": null,
        "why": "المعالج ميقدرش ينفذ برامج مباشرة من الهارد لأنه بطيء؛ فبنحتاج الـ RAM كوسيط سريع مباشر، والهارد/SSD كمخزن دائم.",
        "deepPoints": [
          "<strong><span class='en-pill'>Main Memory (RAM)</span>:</strong> الوسيط الكبير الوحيد الذي يصل له الـ CPU مباشرة (<span class='en-pill'>Directly</span>)، ذات وصول عشوائي ومتطايرة (<span class='en-pill'>Volatile</span>).",
          "<strong><span class='en-pill'>Hard Disks</span>:</strong> سطح القرص مقسم منطقياً إلى دوائر <strong><span class='en-pill'>Tracks</span></strong>، وكل Track مقسم إلى <strong><span class='en-pill'>Sectors</span></strong>، والـ <span class='en-pill'>Disk controller</span> يدير التفاعل المنطقي.",
          "<strong><span class='en-pill'>SSDs</span>:</strong> أسرع من الـ Hard disks وغير متطايرة (<span class='en-pill'>Nonvolatile</span>)."
        ],
        "examSpot": "تذكر: <strong>Main memory</strong> هي الوحيدة الكبيرة المباشرة للـ CPU (Volatile). وسطح الهارد: <strong>Tracks → Sectors</strong>.",
        "notebookEn": "Slide 1.13:\n- Main Memory: only large storage CPU accesses directly (random access, volatile).\n- Secondary Storage: large, nonvolatile (HDD: tracks -> sectors; SSD: faster, nonvolatile).",
        "notebookAr": "الرام مباشرة ومتطايرة؛ والتخزين الثانوي غير متطاير (الهارد مقسم Tracks ← Sectors، والـ SSD أسرع)."
      },
      {
        "id": "s1-14",
        "slideRef": "Slide 1.14",
        "shortLabel": "1.14 معايير الهرم والـ Driver",
        "title": "Storage Hierarchy — معايير الترتيب الثلاثة والـ Caching والـ Device Driver",
        "enPoints": [
          "Storage systems organized in hierarchy by: <strong>Speed</strong>, <strong>Cost</strong>, and <strong>Volatility</strong>.",
          "<strong>Caching</strong> — copying information into faster storage system; main memory can be viewed as a cache for secondary storage.",
          "<strong>Device Driver</strong> for each device controller to manage I/O — provides <strong>uniform interface</strong> between controller and kernel."
        ],
        "svg": null,
        "why": "السلايد دي بتحط الـ 3 قواعد اللي اتبنى عليها هرم التخزين وبتعرّف الـ Device Driver اللي بيوحد لغة التخاطب مع النواة.",
        "deepPoints": [
          "<strong>معايير الهرم الثلاثة:</strong> السرعة (<span class='en-pill'>Speed</span>)، والتكلفة (<span class='en-pill'>Cost</span>)، والتطاير (<span class='en-pill'>Volatility</span>).",
          "<strong><span class='en-pill'>Caching</span>:</strong> نسخ المعلومات مؤقتاً إلى نظام تخزين أسرع (وحتى الرام تعتبر Cache للتخزين الثانوي).",
          "<strong><span class='en-pill'>Device Driver</span>:</strong> لكل متحكم جهاز يوجد Driver يدير الـ I/O ويوفر <strong>واجهة موحدة (<span class='en-pill'>Uniform interface</span>)</strong> بين المتحكم والـ Kernel."
        ],
        "examSpot": "احفظ: الـ <strong>Device Driver</strong> يوفر <strong>Uniform interface</strong> بين الـ Controller والـ Kernel.",
        "notebookEn": "Slide 1.14:\n- Hierarchy criteria: Speed, Cost, Volatility.\n- Caching = copying info into faster storage.\n- Device Driver = uniform interface between controller & kernel.",
        "notebookAr": "معايير الهرم: Speed, Cost, Volatility؛ والـ Device Driver يوفر واجهة موحدة بين المتحكم والنواة."
      },
      {
        "id": "s1-15",
        "slideRef": "Slide 1.15",
        "shortLabel": "1.15 رسمة هرم التخزين",
        "title": "Storage-Device Hierarchy — هرم التخزين ذو الـ 7 مستويات",
        "enPoints": [
          "<strong>Volatile (Top 3):</strong> 1. <code>registers</code> → 2. <code>cache</code> → 3. <code>main memory</code>.",
          "<strong>Nonvolatile (Bottom 4):</strong> 4. <code>solid-state disk</code> → 5. <code>hard disk</code> → 6. <code>optical disk</code> → 7. <code>magnetic tapes</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 320\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"58\" y=\"45\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\">FASTER ↑</text>\n  <text x=\"58\" y=\"64\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">SMALLER</text>\n  <text x=\"58\" y=\"82\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">HIGHER COST</text>\n\n  <text x=\"58\" y=\"254\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\">SLOWER ↓</text>\n  <text x=\"58\" y=\"272\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">LARGER</text>\n  <text x=\"58\" y=\"290\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">LOWER COST</text>\n\n  <rect x=\"295\" y=\"14\" width=\"150\" height=\"34\" rx=\"8\" fill=\"rgba(194,94,51,0.3)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"36\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">1. registers</text>\n\n  <rect x=\"268\" y=\"56\" width=\"204\" height=\"34\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"78\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">2. cache</text>\n\n  <rect x=\"240\" y=\"98\" width=\"260\" height=\"34\" rx=\"8\" fill=\"rgba(194,94,51,0.16)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"120\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">3. main memory</text>\n\n  <line x1=\"165\" y1=\"142\" x2=\"675\" y2=\"142\" stroke=\"#66c7a6\" stroke-dasharray=\"6 5\" stroke-width=\"1.5\"/>\n  <text x=\"615\" y=\"84\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">VOLATILE</text>\n  <text x=\"615\" y=\"226\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">NONVOLATILE</text>\n\n  <rect x=\"212\" y=\"152\" width=\"316\" height=\"34\" rx=\"8\" fill=\"rgba(102,199,166,0.2)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"174\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">4. solid-state disk</text>\n\n  <rect x=\"184\" y=\"194\" width=\"372\" height=\"34\" rx=\"8\" fill=\"rgba(102,199,166,0.14)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"216\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">5. hard disk</text>\n\n  <rect x=\"156\" y=\"236\" width=\"428\" height=\"34\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"370\" y=\"258\" fill=\"#E2E8F0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">6. optical disk</text>\n\n  <rect x=\"128\" y=\"278\" width=\"484\" height=\"34\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"370\" y=\"300\" fill=\"#E2E8F0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">7. magnetic tapes</text>\n</svg>",
        "svgCaption": "Slide 1.15 · Storage-Device Hierarchy (7 Levels)",
        "why": "رسمة الهرم بتلخص العلاقة العكسية بين السرعة والسعة: القمة أسرع وأغلى وأصغر ومتطايرة، والقاعدة أبطأ وأرخص وأكبر ودائمة.",
        "deepPoints": [
          "<strong>أول 3 طبقات فوق (Volatile):</strong> <span class='en-pill'>Registers → Cache → Main Memory</span> — سريعة جداً لكن بياناتها بتروح لو الكهرباء قطعت.",
          "<strong>آخر 4 طبقات تحت (Nonvolatile):</strong> <span class='en-pill'>SSD → Hard Disk → Optical Disk → Magnetic Tapes</span> — تحتفظ بالبيانات بشكل دائم."
        ],
        "examSpot": "احفظ ترتيب الـ 7 مستويات من القمة للقاعدة بدقة لأي سؤال ترتيب أو اختياري.",
        "notebookEn": "Slide 1.15 Pyramid (Top->Bottom):\nRegisters -> Cache -> Main Memory [Volatile] | SSD -> Hard Disk -> Optical Disk -> Magnetic Tapes [Nonvolatile].",
        "notebookAr": "أول 3 طبقات متطايرة (Registers, Cache, RAM) وآخر 4 طبقات غير متطايرة (SSD, HDD, Optical, Tapes)."
      },
      {
        "id": "s1-16",
        "slideRef": "Slide 1.16",
        "shortLabel": "1.16 آلية الـ Caching",
        "title": "Caching — خطوات البحث في الكاش ومشكلة إدارته",
        "enPoints": [
          "Important principle performed at many levels (in <strong>hardware, operating system, software</strong>).",
          "Information in use copied from <strong>slower to faster storage temporarily</strong>.",
          "<strong>Faster storage (cache) checked first:</strong> if it is there → used directly (fast); if not → data copied to cache and used there.",
          "Cache is smaller than storage being cached → requires careful <strong>cache size</strong> and <strong>replacement policy</strong>."
        ],
        "svg": null,
        "why": "عشان نستفيد من سرعة الكاش الصغير، لازم المعالج يدور فيه الأول قبل ما يروح للذاكرة الأبطأ، ولازم نحدد سياسة ذكية نمسح بيها البيانات القديمة لما الكاش يتملي.",
        "deepPoints": [
          "<strong>قاعدة الفحص الأولي:</strong> دائماً نفحص الكاش أولاً: لو لقينا الداتا (<span class='en-pill'>Hit</span>) بنستخدمها فوراً، ولو ملقينهاش (<span class='en-pill'>Miss</span>) بننسخها للكاش ونستخدمها منه.",
          "<strong>مشكلة تصميم الكاش:</strong> لأن حجم الكاش أصغر بكتير من الرام، أهم قرارين في إدارته هما <strong><span class='en-pill'>Cache size</span></strong> و<strong><span class='en-pill'>Replacement policy</span></strong>."
        ],
        "examSpot": "يُنفذ الـ Caching على 3 مستويات: <strong>Hardware, OS, Software</strong>، وأهم مشكلتين في إدارته: <strong>Cache size</strong> و <strong>Replacement policy</strong>.",
        "notebookEn": "Slide 1.16 Caching:\n- Performed in hardware, OS, software.\n- Check cache first -> Hit (use directly) / Miss (copy to cache & use).\n- Design problems: Cache size & Replacement policy.",
        "notebookAr": "نفحص الكاش أولاً: لو موجود نستخدمه مباشرة، وإلا ننسخه للكاش؛ وتصميمه يعتمد على الحجم وسياسة الاستبدال."
      },
      {
        "id": "s1-17",
        "slideRef": "Slide 1.17",
        "shortLabel": "1.17 تعدد المعالجات",
        "title": "Computer-System Architecture — الأنظمة متعددة المعالجات (Multiprocessors)",
        "enPoints": [
          "Most systems use a single general-purpose processor (plus special-purpose processors).",
          "<strong>Multiprocessor systems</strong> — also known as <strong>parallel systems</strong> or <strong>tightly-coupled systems</strong>.",
          "<strong>3 Advantages:</strong> (1) <strong>Increased throughput</strong>, (2) <strong>Economy of scale</strong>, (3) <strong>Increased reliability</strong> (graceful degradation or fault tolerance).",
          "<strong>2 Types:</strong> (1) <strong>Asymmetric Multiprocessing (master)</strong> — each processor assigned a specific task; (2) <strong>Symmetric Multiprocessing (SMP)</strong> — each processor performs all tasks."
        ],
        "svg": null,
        "why": "بدل الاعتماد على معالج واحد بس، بنركب أكتر من معالج في نفس الجهاز عشان نزود الإنتاجية ونوفر التكلفة ونحمي النظام من التوقف المفاجئ.",
        "deepPoints": [
          "<strong>المميزات الـ 3:</strong> (1) زيادة الإنتاجية (<span class='en-pill'>Increased throughput</span>)، (2) التوفير الاقتصادي (<span class='en-pill'>Economy of scale</span>) لمشاركة الرام والهارد، و(3) زيادة الاعتمادية (<span class='en-pill'>Increased reliability</span>) عبر <span class='en-pill'>Graceful degradation</span> أو <span class='en-pill'>Fault tolerance</span>.",
          "<strong>النوعين:</strong> في <span class='en-pill'>Asymmetric</span> معالج Master يوزع مهام محددة؛ أما في <span class='en-pill'>Symmetric (SMP)</span> فكل معالج يؤدي كل المهام كأقران متساويين (<span class='en-pill'>Peers</span>)."
        ],
        "examSpot": "قارن دائماً: <strong>Asymmetric</strong> = معالج Master؛ <strong>Symmetric (SMP)</strong> = كل المعالجات متساوية (Peers).",
        "notebookEn": "Slide 1.17 Multiprocessors (Parallel / Tightly-coupled):\n- 3 Pros: Increased throughput, Economy of scale, Increased reliability.\n- 2 Types: Asymmetric (master assigns tasks) vs Symmetric SMP (all perform all tasks).",
        "notebookAr": "الـ Multiprocessors لها 3 مميزات ونوعان: Asymmetric (Master) و Symmetric SMP (كلهم متساوون)."
      },
      {
        "id": "s1-18",
        "slideRef": "Slide 1.18",
        "shortLabel": "1.18 رسمة الـ SMP",
        "title": "Symmetric Multiprocessing Architecture — رسمة معمارية الـ SMP",
        "enPoints": [
          "Three independent processor chips: <strong>CPU₀, CPU₁, CPU₂</strong>.",
          "Each CPU has its own private <strong>registers</strong> and private <strong>cache</strong>.",
          "All CPUs connect over a shared bus to one common <strong>memory</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 230\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"18\" width=\"180\" height=\"114\" rx=\"12\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"130\" y=\"42\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">CPU₀</text>\n  <rect x=\"65\" y=\"52\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#94A3B8\"/><text x=\"130\" y=\"71\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">registers</text>\n  <line x1=\"130\" y1=\"80\" x2=\"130\" y2=\"92\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <rect x=\"65\" y=\"92\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#66c7a6\"/><text x=\"130\" y=\"111\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">cache</text>\n\n  <rect x=\"260\" y=\"18\" width=\"180\" height=\"114\" rx=\"12\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"42\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">CPU₁</text>\n  <rect x=\"285\" y=\"52\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#94A3B8\"/><text x=\"350\" y=\"71\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">registers</text>\n  <line x1=\"350\" y1=\"80\" x2=\"350\" y2=\"92\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <rect x=\"285\" y=\"92\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#66c7a6\"/><text x=\"350\" y=\"111\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">cache</text>\n\n  <rect x=\"480\" y=\"18\" width=\"180\" height=\"114\" rx=\"12\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"570\" y=\"42\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">CPU₂</text>\n  <rect x=\"505\" y=\"52\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#94A3B8\"/><text x=\"570\" y=\"71\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">registers</text>\n  <line x1=\"570\" y1=\"80\" x2=\"570\" y2=\"92\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <rect x=\"505\" y=\"92\" width=\"130\" height=\"28\" rx=\"6\" fill=\"#0c1017\" stroke=\"#66c7a6\"/><text x=\"570\" y=\"111\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">cache</text>\n\n  <line x1=\"130\" y1=\"132\" x2=\"130\" y2=\"156\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"350\" y1=\"132\" x2=\"350\" y2=\"174\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"570\" y1=\"132\" x2=\"570\" y2=\"156\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"130\" y1=\"156\" x2=\"570\" y2=\"156\" stroke=\"#e58a62\" stroke-width=\"2.5\"/>\n\n  <rect x=\"250\" y=\"174\" width=\"200\" height=\"44\" rx=\"10\" fill=\"#1c2533\" stroke=\"#66c7a6\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"201\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14.5\" font-weight=\"800\" text-anchor=\"middle\">memory (shared)</text>\n</svg>",
        "svgCaption": "Slide 1.18 · Symmetric Multiprocessing Architecture",
        "why": "الرسمة دي بتوضح إزاي المعالجات المتعددة في الـ SMP بتتشارك الـ RAM الواحدة مع احتفاظ كل معالج بمسجلاته وكاشه الخاص.",
        "deepPoints": [
          "<strong>خصوصية لكل معالج:</strong> كل معالج (<span class='code-pill'>CPU0, CPU1, CPU2</span>) جواه <span class='en-pill'>registers</span> و<span class='en-pill'>cache</span> خاصين بيه عشان السرعة.",
          "<strong>مشاركة الذاكرة:</strong> التلاتة نازلين على <strong><span class='en-pill'>Shared Memory</span></strong> واحدة — وده السبب اللي هيخلينا نحتاج <span class='en-pill'>Cache Coherency</span> في سلايد 1.30!"
        ],
        "examSpot": "في الـ SMP، لكل معالج <strong>Registers و Cache</strong> خاصين به، ويتشاركون جميعاً نفس الـ <strong>Main Memory</strong>.",
        "notebookEn": "Slide 1.18 SMP: CPU0, CPU1, CPU2 each have private registers + cache, sharing one common main memory.",
        "notebookAr": "في معمارية SMP، كل معالج يملك Registers و Cache خاصين به، ويشتركون في نفس الـ Memory."
      },
      {
        "id": "s1-19",
        "slideRef": "Slide 1.19",
        "shortLabel": "1.19 تصميم Dual-Core",
        "title": "A Dual-Core Design — المعالج ثنائي النواة على شريحة واحدة",
        "enPoints": [
          "<strong>Multi-chip and multicore</strong> designs.",
          "Places multiple computing cores (<code>CPU core₀</code> &amp; <code>CPU core₁</code>) on a <strong>single chip</strong>, each with its own registers and cache sharing memory."
        ],
        "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"115\" y=\"14\" width=\"470\" height=\"142\" rx=\"16\" fill=\"rgba(194,94,51,0.12)\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n  <text x=\"350\" y=\"36\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">SINGLE PROCESSOR CHIP (DUAL-CORE)</text>\n\n  <rect x=\"145\" y=\"48\" width=\"185\" height=\"92\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"237\" y=\"70\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">CPU core₀</text>\n  <rect x=\"170\" y=\"78\" width=\"135\" height=\"22\" rx=\"5\" fill=\"#0c1017\" stroke=\"#94A3B8\"/><text x=\"237\" y=\"93\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">registers</text>\n  <rect x=\"170\" y=\"108\" width=\"135\" height=\"22\" rx=\"5\" fill=\"#0c1017\" stroke=\"#66c7a6\"/><text x=\"237\" y=\"123\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">cache</text>\n\n  <rect x=\"370\" y=\"48\" width=\"185\" height=\"92\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"462\" y=\"70\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">CPU core₁</text>\n  <rect x=\"395\" y=\"78\" width=\"135\" height=\"22\" rx=\"5\" fill=\"#0c1017\" stroke=\"#94A3B8\"/><text x=\"462\" y=\"93\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">registers</text>\n  <rect x=\"395\" y=\"108\" width=\"135\" height=\"22\" rx=\"5\" fill=\"#0c1017\" stroke=\"#66c7a6\"/><text x=\"462\" y=\"123\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">cache</text>\n\n  <line x1=\"237\" y1=\"140\" x2=\"237\" y2=\"168\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"462\" y1=\"140\" x2=\"462\" y2=\"168\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"237\" y1=\"168\" x2=\"462\" y2=\"168\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"350\" y1=\"168\" x2=\"350\" y2=\"188\" stroke=\"#e58a62\" stroke-width=\"2.5\"/>\n\n  <rect x=\"255\" y=\"188\" width=\"190\" height=\"40\" rx=\"10\" fill=\"#1c2533\" stroke=\"#66c7a6\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"213\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">memory</text>\n</svg>",
        "svgCaption": "Slide 1.19 · A Dual-Core Design (Single Chip)",
        "why": "التواصل بين شريحتين منفصلتين على الماذربورد أبطأ وبيستهلك كهرباء أكتر؛ فالحل الحديث هو دمج نواتين أو أكتر جوه شريحة سيليكون واحدة.",
        "deepPoints": [
          "<strong>الفرق عن سلايد 1.18:</strong> هنا <code>CPU core₀</code> و<code>CPU core₁</code> جوه <strong>شريحة واحدة (<span class='en-pill'>Single chip</span>)</strong> مش شريحتين منفصلتين.",
          "<strong>الفائدة الهندسية:</strong> اتصال داخلي أسرع بكتير بين الأنوية واستهلاك طاقة أقل، مع ظهورهم لنظام التشغيل كمعالجين منفصلين."
        ],
        "examSpot": "الـ <strong>Multicore / Dual-Core</strong> يضع عدة أنوية معالجة داخل <strong>شريحة واحدة (Single chip)</strong> لسرعة أعلى وطاقة أقل.",
        "notebookEn": "Slide 1.19 Dual-Core: Multiple CPU cores (core0, core1) on a SINGLE chip, each with registers + cache, sharing memory.",
        "notebookAr": "تصميم Dual-Core يدمج نواتين داخل شريحة واحدة لسرعة تواصل أعلى واستهلاك طاقة أقل."
      },
      {
        "id": "s1-20",
        "slideRef": "Slide 1.20",
        "shortLabel": "1.20 الأنظمة العنقودية",
        "title": "Clustered Systems — الأنظمة العنقودية والإتاحة العالية",
        "enPoints": [
          "Multiple independent systems working together, usually sharing storage via a <strong>storage-area network (SAN)</strong>.",
          "Provides a <strong>high-availability service</strong> which survives failures:",
          "• <strong>Asymmetric clustering:</strong> one machine in <strong>hot-standby mode</strong>.",
          "• <strong>Symmetric clustering:</strong> multiple nodes running applications and monitoring each other.",
          "<strong>High-performance computing (HPC)</strong> clusters require applications written with <strong>parallelization</strong>."
        ],
        "svg": null,
        "why": "لو سيرفر كامل وقع، الـ Clustered System بيخلي الخدمة تفضل شغالة بدون ثانية توقف (High-Availability) عبر ربط عدة أجهزة ببعضها.",
        "deepPoints": [
          "<strong><span class='en-pill'>Asymmetric Clustering</span>:</strong> جهاز شغال والتاني في وضع <strong><span class='en-pill'>Hot-standby mode</span></strong> (احتياطي ساخن) يراقبه ويدخل مكانه فوراً عند العطل.",
          "<strong><span class='en-pill'>Symmetric Clustering</span>:</strong> كل الأجهزة شغالة بتشغل تطبيقات وتراقب بعضها في نفس الوقت.",
          "<strong><span class='en-pill'>HPC</span>:</strong> حوسبة فائقة الأداء تتطلب كتابة البرامج بـ <strong><span class='en-pill'>Parallelization</span></strong>."
        ],
        "examSpot": "اربط الكلمات المفتاحية: <strong>SAN</strong> و <strong>High-Availability</strong> ← Clustered Systems؛ <strong>Hot-standby</strong> ← Asymmetric clustering.",
        "notebookEn": "Slide 1.20 Clustered Systems:\n- Multiple systems sharing SAN for High-Availability.\n- Asymmetric = hot-standby mode | Symmetric = all nodes run apps & monitor each other.\n- HPC requires parallelization.",
        "notebookAr": "الـ Clustered Systems تربط عدة أجهزة عبر SAN لتوفير High-Availability (Asymmetric احتياطي ساخن، أو Symmetric)."
      },
      {
        "id": "s1-21",
        "slideRef": "Slide 1.21",
        "shortLabel": "1.21 رسمة الـ Cluster",
        "title": "Clustered Systems Diagram — رسمة اتصال الأجهزة والـ SAN",
        "enPoints": [
          "Multiple independent <strong>computer</strong> nodes connected horizontally by an <strong>interconnect</strong>.",
          "All nodes connect downward to a shared <strong>storage area network (SAN)</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"24\" width=\"150\" height=\"50\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"115\" y=\"54\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"700\" text-anchor=\"middle\">computer</text>\n\n  <rect x=\"275\" y=\"24\" width=\"150\" height=\"50\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"54\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"700\" text-anchor=\"middle\">computer</text>\n\n  <rect x=\"510\" y=\"24\" width=\"150\" height=\"50\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"585\" y=\"54\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"700\" text-anchor=\"middle\">computer</text>\n\n  <line x1=\"190\" y1=\"49\" x2=\"275\" y2=\"49\" stroke=\"#66c7a6\" stroke-width=\"2.5\"/>\n  <text x=\"232\" y=\"40\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">interconnect</text>\n  <line x1=\"425\" y1=\"49\" x2=\"510\" y2=\"49\" stroke=\"#66c7a6\" stroke-width=\"2.5\"/>\n  <text x=\"467\" y=\"40\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">interconnect</text>\n\n  <line x1=\"115\" y1=\"74\" x2=\"115\" y2=\"162\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"350\" y1=\"74\" x2=\"350\" y2=\"132\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"585\" y1=\"74\" x2=\"585\" y2=\"162\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"115\" y1=\"162\" x2=\"245\" y2=\"162\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n  <line x1=\"455\" y1=\"162\" x2=\"585\" y2=\"162\" stroke=\"#e58a62\" stroke-width=\"2.2\"/>\n\n  <rect x=\"245\" y=\"132\" width=\"210\" height=\"66\" rx=\"14\" fill=\"rgba(194,94,51,0.18)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"160\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">storage area network</text>\n  <text x=\"350\" y=\"180\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">(SAN)</text>\n</svg>",
        "svgCaption": "Slide 1.21 · Clustered Systems Topology",
        "why": "الرسمة بتوضح إن كل جهاز كمبيوتر مستقل بنفسه، لكنهم بيتبادلوا رسائل المراقبة عبر الـ Interconnect وبيوصلوا لنفس ملفات التخزين عبر الـ SAN.",
        "deepPoints": [
          "<strong>الـ <span class='en-pill'>Interconnect</span>:</strong> شبكة ربط سريعة بين الأجهزة للمراقبة وتبادل الحالة (<span class='en-pill'>Heartbeat</span>).",
          "<strong>الـ <span class='en-pill'>SAN</span>:</strong> مخزن مشترك يضمن إن الجهاز البديل يلاقي نفس البيانات فوراً لو الجهاز الأول وقع."
        ],
        "examSpot": "مكونين أساسيين في رسمة الـ Cluster: شبكة الربط <strong>Interconnect</strong> والتخزين المشترك <strong>Storage Area Network (SAN)</strong>.",
        "notebookEn": "Slide 1.21 Diagram: [computer] --interconnect-- [computer] --interconnect-- [computer] all sharing [SAN].",
        "notebookAr": "الأجهزة متصلة ببعضها بـ Interconnect ومشتركة جميعاً في Storage Area Network (SAN)."
      },
      {
        "id": "s1-22",
        "slideRef": "Slide 1.22",
        "shortLabel": "1.22 Multiprogramming",
        "title": "Operating System Structure — Multiprogramming vs. Timesharing",
        "enPoints": [
          "<strong>Multiprogramming (Batch system)</strong> needed for <strong>efficiency</strong>: keeps a subset of jobs in memory so <strong>CPU always has one to execute</strong>; when it waits (e.g., for <strong>I/O</strong>), OS switches to another job.",
          "<strong>Timesharing (Multitasking):</strong> CPU switches jobs <strong>so frequently</strong> that users can <strong>interact</strong> while running (<strong>interactive computing</strong>); <strong>Response time &lt; 1 second</strong>.",
          "Executing program in memory ⇒ <strong>process</strong> | Multiple ready jobs ⇒ <strong>CPU scheduling</strong> | Moving in/out of RAM ⇒ <strong>swapping</strong> | Execution not completely in RAM ⇒ <strong>virtual memory</strong>."
        ],
        "svg": null,
        "why": "دي أهم سلايد في شابتر 1: بتشرح إزاي خلّينا المعالج شغال 100% (Multiprogramming) ثم إزاي خلّينا الكمبيوتر تفاعلي مع المستخدم (Timesharing).",
        "deepPoints": [
          "<strong><span class='en-pill'>Multiprogramming</span>:</strong> هدفه الكفاءة (<span class='en-pill'>Efficiency</span>) — المعالج بيبدل لـ Job تانية لما الحالية تقف تستنى <span class='en-pill'>I/O</span>.",
          "<strong><span class='en-pill'>Timesharing (Multitasking)</span>:</strong> بيبدل بسرعة بالوقت لتوفير تفاعل مباشر (<span class='en-pill'>Interactive computing</span>) بزمن استجابة <strong><span class='en-pill'>&lt; 1 second</span></strong>.",
          "<strong>المصطلحات الأربعة:</strong> <span class='en-pill'>Process</span>، و<span class='en-pill'>CPU Scheduling</span>، و<span class='en-pill'>Swapping</span>، و<span class='en-pill'>Virtual Memory</span> (تشغيل عمليات غير موجودة بالكامل في الرام)."
        ],
        "examSpot": "سؤال الميدتيرم Q7 والمقارنة الأهم: Multiprogramming يبدل عند الـ <strong>I/O wait</strong>، والـ Timesharing يبدل بسرعة بالوقت لـ <strong>Response time &lt; 1s</strong>.",
        "notebookEn": "Slide 1.22:\n- Multiprogramming: keeps CPU busy; switches on I/O wait.\n- Timesharing: rapid switching for interactive computing (response < 1s).\n- Virtual memory: runs processes not completely in RAM.",
        "notebookAr": "الـ Multiprogramming يبدل عند انتظار I/O؛ والـ Timesharing يبدل سريعاً لاستجابة تفاعلية (< 1s)."
      },
      {
        "id": "s1-23",
        "slideRef": "Slide 1.23",
        "shortLabel": "1.23 خريطة الرام",
        "title": "Memory Layout for Multiprogrammed System — شكل الذاكرة",
        "enPoints": [
          "Memory (from address <code>0</code> to <code>512M</code>) simultaneously holds: <strong>operating system</strong> + <strong>job 1</strong> + <strong>job 2</strong> + <strong>job 3</strong> + <strong>job 4</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 265\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"195\" y=\"34\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"end\">0</text>\n  <text x=\"195\" y=\"246\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"end\">512M</text>\n\n  <rect x=\"215\" y=\"16\" width=\"270\" height=\"44\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"43\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">operating system</text>\n\n  <rect x=\"215\" y=\"64\" width=\"270\" height=\"44\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.4\"/>\n  <text x=\"350\" y=\"91\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">job 1</text>\n\n  <rect x=\"215\" y=\"112\" width=\"270\" height=\"44\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.4\"/>\n  <text x=\"350\" y=\"139\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">job 2</text>\n\n  <rect x=\"215\" y=\"160\" width=\"270\" height=\"44\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.4\"/>\n  <text x=\"350\" y=\"187\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">job 3</text>\n\n  <rect x=\"215\" y=\"208\" width=\"270\" height=\"44\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.4\"/>\n  <text x=\"350\" y=\"235\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">job 4</text>\n</svg>",
        "svgCaption": "Slide 1.23 · Memory Layout for Multiprogrammed System",
        "why": "الرسمة بتثبّت فكرة الـ Multiprogramming بصرياً: بدل برنامج واحد في الرام، فيه عدة برامج جاهزة معاً فوق بعض جنب الـ OS.",
        "deepPoints": [
          "<strong>توزيع الـ RAM:</strong> الجزء الأول محجوز للـ <span class='en-pill'>Operating system</span>، وبقية المساحة مقسمة بين <span class='code-pill'>job 1, job 2, job 3, job 4</span>.",
          "<strong>النتيجة:</strong> لو <code>job 1</code> انتظرت هارد، المعالج ينتقل لـ <code>job 2</code> في أجزاء من الملي ثانية لأنها بالفعل موجودة في الرام!"
        ],
        "examSpot": "توضح الرسمة أن الذاكرة تحتوي على <strong>نظام التشغيل + عدة Jobs معاً</strong> في نفس الوقت.",
        "notebookEn": "Slide 1.23: RAM (0..512M) holds [Operating System] + [job 1] + [job 2] + [job 3] + [job 4] simultaneously.",
        "notebookAr": "في الـ Multiprogramming توجد عدة Jobs مع نظام التشغيل داخل الرام في نفس اللحظة."
      },
      {
        "id": "s1-24",
        "slideRef": "Slide 1.24",
        "shortLabel": "1.24 Dual-Mode Operation",
        "title": "Operating-System Operations — العمل بالوضع المزدوج (Dual-Mode)",
        "enPoints": [
          "<strong>Dual-mode operation</strong> allows OS to <strong>protect itself and other system components</strong>.",
          "Two modes: <strong>User mode</strong> and <strong>Kernel mode</strong>.",
          "<strong>Mode bit</strong> provided by <strong>hardware</strong> distinguishes user code from kernel code.",
          "<strong>Privileged instructions</strong> are only executable in <strong>kernel mode</strong>.",
          "<strong>System call</strong> changes mode to kernel; <strong>return from call</strong> resets it to user."
        ],
        "svg": null,
        "why": "وجود عدة برامج في نفس الرام مع الـ OS (سلايد 1.23) يخلق خطراً أمنياً؛ فبنحتاج فاصل هاردويري يمنع البرامج من تنفيذ أوامر خطيرة.",
        "deepPoints": [
          "<strong>الهدف الأساسي:</strong> حماية نظام التشغيل ومكونات النظام (<span class='en-pill'>Protect itself and other system components</span>).",
          "<strong>الـ <span class='en-pill'>Mode Bit</span>:</strong> بت في الهاردوير يميز بين <span class='en-pill'>User Mode (1)</span> و<span class='en-pill'>Kernel Mode (0)</span>.",
          "<strong><span class='en-pill'>Privileged Instructions</span>:</strong> الأوامر الحساسة لا تُنفذ إلا في <span class='en-pill'>Kernel Mode</span> فقط."
        ],
        "examSpot": "سؤال الميدتيرم Q8: لماذا نحتاج User mode و Kernel mode؟ الإجابة: <strong>To protect the OS and other system components</strong>.",
        "notebookEn": "Slide 1.24 Dual-Mode:\n- Protects OS & system components.\n- Hardware Mode Bit: User (1) vs Kernel (0).\n- Privileged instructions execute ONLY in Kernel Mode.",
        "notebookAr": "الـ Dual-Mode يحمي النظام عبر Mode bit في الهاردوير ويحصر الأوامر الحساسة في Kernel Mode."
      },
      {
        "id": "s1-25",
        "slideRef": "Slide 1.25",
        "shortLabel": "1.25 الـ Timer والانتقال",
        "title": "Transition from User to Kernel Mode & Hardware Timer",
        "enPoints": [
          "<strong>Timer</strong> prevents <strong>infinite loop / process hogging resources</strong>.",
          "Counter decremented by the <strong>physical clock</strong>; OS sets the counter (<strong>privileged instruction</strong>).",
          "When counter reaches <strong>zero</strong>, it generates an <strong>interrupt</strong> so OS regains control.",
          "Transition diagram: User process (<code>mode bit = 1</code>) → calls system call → <code>trap (mode bit = 0)</code> → execute in kernel → <code>return (mode bit = 1)</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m125\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n    <marker id=\"m125g\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#66c7a6\"/>\n    </marker>\n  </defs>\n  <rect x=\"20\" y=\"16\" width=\"525\" height=\"76\" rx=\"12\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"622\" y=\"48\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">user mode</text>\n  <text x=\"622\" y=\"66\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">(mode bit = 1)</text>\n\n  <rect x=\"36\" y=\"35\" width=\"144\" height=\"38\" rx=\"8\" fill=\"#0c1017\" stroke=\"#7ca7f0\"/>\n  <text x=\"108\" y=\"59\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">user process executing</text>\n\n  <line x1=\"180\" y1=\"54\" x2=\"206\" y2=\"54\" stroke=\"#94A3B8\" stroke-width=\"2\" marker-end=\"url(#m125)\"/>\n\n  <rect x=\"210\" y=\"35\" width=\"132\" height=\"38\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/>\n  <text x=\"276\" y=\"59\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">calls system call</text>\n\n  <rect x=\"372\" y=\"35\" width=\"156\" height=\"38\" rx=\"8\" fill=\"rgba(74,222,128,0.16)\" stroke=\"#66c7a6\"/>\n  <text x=\"450\" y=\"59\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">return from system call</text>\n\n  <line x1=\"20\" y1=\"106\" x2=\"680\" y2=\"106\" stroke=\"#e58a62\" stroke-dasharray=\"6 5\" stroke-width=\"1.6\"/>\n\n  <rect x=\"20\" y=\"120\" width=\"525\" height=\"78\" rx=\"12\" fill=\"rgba(102,199,166,0.1)\" stroke=\"#66c7a6\" stroke-width=\"1.5\"/>\n  <text x=\"622\" y=\"152\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">kernel mode</text>\n  <text x=\"622\" y=\"170\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">(mode bit = 0)</text>\n\n  <rect x=\"248\" y=\"140\" width=\"210\" height=\"40\" rx=\"8\" fill=\"#0c1017\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"353\" y=\"165\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">execute system call</text>\n\n  <line x1=\"276\" y1=\"73\" x2=\"298\" y2=\"138\" stroke=\"#e58a62\" stroke-width=\"2.2\" marker-end=\"url(#m125)\"/>\n  <text x=\"234\" y=\"122\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" font-weight=\"700\">trap (bit=0)</text>\n\n  <line x1=\"418\" y1=\"140\" x2=\"444\" y2=\"75\" stroke=\"#66c7a6\" stroke-width=\"2.2\" marker-end=\"url(#m125g)\"/>\n  <text x=\"478\" y=\"122\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" font-weight=\"700\">return (bit=1)</text>\n</svg>",
        "svgCaption": "Slide 1.25 · User (1) ↔ Kernel (0) Mode Transition",
        "why": "لو برنامج مستخدم دخل في حلقة لا نهائية <code>while(1)</code> ومفيش مؤقت، هيسرق المعالج للأبد والنظام هيتجمد!",
        "deepPoints": [
          "<strong>عمل الـ <span class='en-pill'>Timer</span>:</strong> عداد ينقص مع الساعة الفيزيائية؛ الـ OS يضبطه بأمر <strong><span class='en-pill'>Privileged</span></strong> قبل تشغيل العملية، وعند <strong>الصفر</strong> يطلق <span class='en-pill'>Interrupt</span> لاستعادة التحكم.",
          "<strong>تتبع الـ <span class='code-pill'>mode bit</span> في الرسمة:</strong> يبدأ <code>1</code> في User Mode ← عند الـ System call يحصل <span class='code-pill'>trap</span> فيصبح <code>0</code> في Kernel Mode ← عند <span class='code-pill'>return</span> يرجع <code>1</code>."
        ],
        "examSpot": "احفظ: <strong>mode bit = 0</strong> في Kernel Mode، و<strong>mode bit = 1</strong> في User Mode، وضبط الـ Timer هو <strong>Privileged instruction</strong>.",
        "notebookEn": "Slide 1.25:\n- Timer prevents infinite loops; interrupts at ZERO; setting counter is privileged.\n- User (bit=1) --[trap]--> Kernel (bit=0) --[return]--> User (bit=1).",
        "notebookAr": "الـ Timer يمنع الحلقات اللانهائية بإطلاق Interrupt عند الصفر؛ والـ Trap يقلب mode bit لـ 0 والـ Return يرجعه لـ 1."
      },
      {
        "id": "s1-26",
        "slideRef": "Slide 1.26",
        "shortLabel": "1.26 Process Mgmt",
        "title": "Process Management Activities — أنشطة إدارة العمليات الخمسة",
        "enPoints": [
          "1. <strong>Creating and deleting</strong> both user and system processes.",
          "2. <strong>Suspending and resuming</strong> processes.",
          "3. Providing mechanisms for <strong>process synchronization</strong>.",
          "4. Providing mechanisms for <strong>process communication</strong>.",
          "5. Providing mechanisms for <strong>deadlock handling</strong>."
        ],
        "svg": null,
        "why": "السلايد دي بتلخص الخمس مسؤوليات اللي الـ OS بيعملهم عشان يدير كل الـ Processes الشغالة على الجهاز.",
        "deepPoints": [
          "<strong>إدارة دورة الحياة:</strong> إنشاء وحذف العمليات (<span class='en-pill'>Creating &amp; deleting</span>) وإيقافها مؤقتاً واستئنافها (<span class='en-pill'>Suspending &amp; resuming</span>).",
          "<strong>التنسيق والأمان بين العمليات:</strong> التزامن (<span class='en-pill'>Synchronization</span>)، والتواصل (<span class='en-pill'>Communication</span>)، ومعالجة التوقف التام (<span class='en-pill'>Deadlock handling</span>)."
        ],
        "examSpot": "احفظ الأنشطة الـ 5 لإدارة العمليات لأسئلة التعداد والاختياري.",
        "notebookEn": "Slide 1.26 Process Mgmt (5): Create/delete, Suspend/resume, Synchronization, Communication, Deadlock handling.",
        "notebookAr": "أنشطة إدارة العمليات الـ 5: إنشاء/حذف، إيقاف/استئناف، تزامن، تواصل، ومعالجة الـ Deadlock."
      },
      {
        "id": "s1-27",
        "slideRef": "Slide 1.27",
        "shortLabel": "1.27 Memory Mgmt",
        "title": "Memory Management — أنشطة إدارة الذاكرة الثلاثة",
        "enPoints": [
          "To execute a program, all (or part) of its <strong>instructions</strong> and <strong>data</strong> must be in memory.",
          "Memory management optimizes CPU utilization and computer response.",
          "<strong>3 Activities:</strong> (1) <strong>Keeping track</strong> of which parts of memory are used and by whom, (2) <strong>Deciding</strong> which processes/data move into and out of memory, (3) <strong>Allocating and deallocating</strong> memory space as needed."
        ],
        "svg": null,
        "why": "الرام مساحة محدودة ومشتركة بين عشرات البرامج، فلازم مدير دقيق يوزعها ويمنع تداخل البرامج.",
        "deepPoints": [
          "<strong>شرط التنفيذ:</strong> لازم أوامر البرنامج (<span class='en-pill'>Instructions</span>) وبياناته (<span class='en-pill'>Data</span>) تكون في الـ RAM.",
          "<strong>الأنشطة الـ 3:</strong> المتابعة (<span class='en-pill'>Keeping track</span>)، تقرير الدخول والخروج (<span class='en-pill'>Deciding</span>)، والحجز والتفريغ (<span class='en-pill'>Allocating &amp; deallocating</span>)."
        ],
        "examSpot": "سؤال مباشر: Keeping track of which parts of memory are used and by whom ← <strong>Memory Management</strong>.",
        "notebookEn": "Slide 1.27 Memory Mgmt (3): Keeping track, Deciding what moves in/out, Allocating & deallocating space.",
        "notebookAr": "إدارة الذاكرة (3): متابعة المستخدم، تقرير ما يدخل ويخرج، وحجز وتفريغ المساحات."
      },
      {
        "id": "s1-28",
        "slideRef": "Slide 1.28",
        "shortLabel": "1.28 Storage Mgmt",
        "title": "Storage Management — إدارة التخزين ونظام الملفات",
        "enPoints": [
          "OS abstracts physical storage properties into a uniform logical storage unit — <strong>file</strong>.",
          "Files organized into <strong>directories</strong> with <strong>access control</strong>.",
          "<strong>4 File-System Activities:</strong> (1) Creating and deleting files &amp; directories, (2) Primitives to manipulate them, (3) Mapping files onto secondary storage, (4) Backup onto stable (non-volatile) media."
        ],
        "svg": null,
        "why": "بدل ما المستخدم يتعامل مع Tracks و Sectors على الهارد، الـ OS بيقدم له واجهة منطقية منظمة في شكل ملفات ومجلدات.",
        "deepPoints": [
          "<strong>التجريد المنطقي:</strong> الوحدة المنطقية للتخزين هي <strong><span class='en-pill'>File</span></strong> ومرتبة داخل <strong><span class='en-pill'>Directories</span></strong> مع صلاحيات وصول (<span class='en-pill'>Access control</span>).",
          "<strong>الأنشطة الـ 4:</strong> الإنشاء والحذف، أوامر التعديل (<span class='en-pill'>Primitives</span>)، ربط الملفات بالتخزين الثانوي (<span class='en-pill'>Mapping</span>)، والنسخ الاحتياطي (<span class='en-pill'>Backup</span>)."
        ],
        "examSpot": "التجريد المنطقي لوحدة التخزين في نظام التشغيل يسمى <strong>File</strong>.",
        "notebookEn": "Slide 1.28 Storage Mgmt: Logical unit = File (in directories).\n4 Activities: Create/delete, Primitives, Mapping to secondary storage, Backup.",
        "notebookAr": "الـ OS يحوّل التخزين الفيزيائي لوحدة منطقية اسمها File مع 4 أنشطة لإدارة نظام الملفات."
      },
      {
        "id": "s1-29",
        "slideRef": "Slide 1.29",
        "shortLabel": "1.29 جدول الأداء",
        "title": "Performance of Various Levels of Storage — جدول مقارنة الأداء والإدارة",
        "enPoints": [
          "Compares Levels 1–5 across size, technology, access time (ns), bandwidth (MB/sec), <strong>Managed by</strong>, and Backed by.",
          "<strong>Movement between levels of storage hierarchy can be explicit or implicit.</strong>"
        ],
        "svg": null,
        "tableHtml": "<table class=\"clean-table ltr\">\n  <thead>\n    <tr>\n      <th class=\"ltr\">Property</th>\n      <th class=\"ltr\">1: Registers</th>\n      <th class=\"ltr\">2: Cache</th>\n      <th class=\"ltr\">3: Main Memory</th>\n      <th class=\"ltr\">4: SSD</th>\n      <th class=\"ltr\">5: Magnetic Disk</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td class=\"ltr\"><strong>Typical size</strong></td><td class=\"ltr\">&lt; 1 KB</td><td class=\"ltr\">&lt; 16 MB</td><td class=\"ltr\">&lt; 64 GB</td><td class=\"ltr\">&lt; 1 TB</td><td class=\"ltr\">&lt; 10 TB</td></tr>\n    <tr><td class=\"ltr\"><strong>Technology</strong></td><td class=\"ltr\">Multi-port CMOS</td><td class=\"ltr\">CMOS SRAM</td><td class=\"ltr\">CMOS SRAM/DRAM</td><td class=\"ltr\">Flash memory</td><td class=\"ltr\">Magnetic disk</td></tr>\n    <tr><td class=\"ltr\"><strong>Access time (ns)</strong></td><td class=\"ltr\">0.25 – 0.5</td><td class=\"ltr\">0.5 – 25</td><td class=\"ltr\">80 – 250</td><td class=\"ltr\">25,000 – 50,000</td><td class=\"ltr\">5,000,000</td></tr>\n    <tr><td class=\"ltr\"><strong>Bandwidth (MB/s)</strong></td><td class=\"ltr\">20,000 – 100,000</td><td class=\"ltr\">5,000 – 10,000</td><td class=\"ltr\">1,000 – 5,000</td><td class=\"ltr\">500</td><td class=\"ltr\">20 – 150</td></tr>\n    <tr><td class=\"ltr\"><strong>Managed by</strong></td><td class=\"ltr\"><strong>Compiler</strong></td><td class=\"ltr\"><strong>Hardware</strong></td><td class=\"ltr\"><strong>OS</strong></td><td class=\"ltr\"><strong>OS</strong></td><td class=\"ltr\"><strong>OS</strong></td></tr>\n    <tr><td class=\"ltr\"><strong>Backed by</strong></td><td class=\"ltr\">Cache</td><td class=\"ltr\">Main memory</td><td class=\"ltr\">Disk</td><td class=\"ltr\">Disk</td><td class=\"ltr\">Disk or tape</td></tr>\n  </tbody>\n</table>",
        "why": "الجدول ده بيترجم هرم سلايد 1.15 لأرقام حقيقية بالنانوثانية وبيحدد مين بالظبط المسؤول عن إدارة كل طبقة.",
        "deepPoints": [
          "<strong>أهم صف للامتحان (<span class='en-pill'>Managed by</span>):</strong><br>• <strong><span class='en-pill'>Registers</span></strong> ← يديرها الـ <strong><span class='en-pill'>Compiler</span></strong>.<br>• <strong><span class='en-pill'>Cache</span></strong> ← يديره الـ <strong><span class='en-pill'>Hardware</span></strong>.<br>• <strong><span class='en-pill'>Main Memory, SSD, Magnetic Disk</span></strong> ← يديرهم الـ <strong><span class='en-pill'>Operating System</span></strong>.",
          "<strong>فارق السرعة الهائل:</strong> الوصول للـ Register بياخد <code>0.25–0.5 ns</code> بينما الهارد المغناطيسي بياخد <code>5,000,000 ns</code> (أبطأ بعشرة مليون ضعف!)."
        ],
        "examSpot": "احفظ صف <strong>Managed by</strong> كويس جداً: Registers = <strong>Compiler</strong> | Cache = <strong>Hardware</strong> | RAM/SSD/Disk = <strong>OS</strong>.",
        "notebookEn": "Slide 1.29 Managed By:\n- L1 Registers (<1KB, 0.25-0.5ns) -> Compiler\n- L2 Cache (<16MB, 0.5-25ns) -> Hardware\n- L3–L5 (RAM, SSD, Disk) -> Operating System.",
        "notebookAr": "جدول الأداء: الـ Registers يديرها الـ Compiler، والكاش يديره الـ Hardware، والرام والأقراص يديرها الـ OS."
      },
      {
        "id": "s1-30",
        "slideRef": "Slide 1.30",
        "shortLabel": "1.30 Cache Coherency",
        "title": "Migration of Data “A” from Disk to Register & Cache Coherency",
        "enPoints": [
          "Path of variable A: <code>hard disk → main memory → cache → hardware register</code>.",
          "<strong>Multitasking environments</strong> must use the <strong>most recent value</strong> no matter where it is stored.",
          "<strong>Multiprocessor environments</strong> must provide <strong>cache coherency</strong> in <strong>hardware</strong> so all CPUs have the most recent value in their cache.",
          "<strong>Distributed environments</strong> are even more complex (several copies of a datum can exist)."
        ],
        "svg": "<svg viewBox=\"0 0 700 130\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m130\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n  </defs>\n  <rect x=\"20\" y=\"34\" width=\"128\" height=\"60\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"84\" y=\"69\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">hard disk</text>\n\n  <line x1=\"148\" y1=\"64\" x2=\"196\" y2=\"64\" stroke=\"#e58a62\" stroke-width=\"2.8\" marker-end=\"url(#m130)\"/>\n  <text x=\"172\" y=\"54\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">A</text>\n\n  <rect x=\"202\" y=\"34\" width=\"132\" height=\"60\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"268\" y=\"69\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">main memory</text>\n\n  <line x1=\"334\" y1=\"64\" x2=\"382\" y2=\"64\" stroke=\"#e58a62\" stroke-width=\"2.8\" marker-end=\"url(#m130)\"/>\n  <text x=\"358\" y=\"54\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">A</text>\n\n  <rect x=\"388\" y=\"34\" width=\"114\" height=\"60\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"445\" y=\"69\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">cache</text>\n\n  <line x1=\"502\" y1=\"64\" x2=\"546\" y2=\"64\" stroke=\"#e58a62\" stroke-width=\"2.8\" marker-end=\"url(#m130)\"/>\n  <text x=\"524\" y=\"54\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">A</text>\n\n  <rect x=\"552\" y=\"34\" width=\"128\" height=\"60\" rx=\"10\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"616\" y=\"61\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">hardware</text>\n  <text x=\"616\" y=\"79\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">register</text>\n</svg>",
        "svgCaption": "Slide 1.30 · Migration of Data A (Disk → Register)",
        "why": "لما متغير <code>A</code> يتنسخ عبر الهرم ويتعدل في كاش معالج واحد، ممكن معالج تاني يقرأ النسخة القديمة! فبنحتاج آلية هاردويرية توحد النسخ.",
        "deepPoints": [
          "<strong>مسار هجرة الداتا:</strong> <span class='code-pill'>hard disk → main memory → cache → hardware register</span>.",
          "<strong><span class='en-pill'>Cache Coherency</span> (تناسق الكاش):</strong> آلية في الـ <strong><span class='en-pill'>Hardware</span></strong> تضمن في الأنظمة متعددة المعالجات إن كل الـ CPUs تمتلك أحدث قيمة (<span class='en-pill'>Most recent value</span>) في الكاش بتاعها."
        ],
        "examSpot": "احفظ التعريف: ضمان وجود أحدث قيمة في كاش كل المعالجات في الـ Multiprocessor هو <strong>Cache Coherency</strong> (ويُنفذ في الـ <strong>Hardware</strong>).",
        "notebookEn": "Slide 1.30:\n- Path: Hard disk -> Main memory -> Cache -> Hardware register.\n- Cache Coherency (in Hardware): Ensures all CPUs in multiprocessor have the most recent value.",
        "notebookAr": "رحلة A من الهارد للـ Register؛ والـ Cache Coherency تضمن في الهاردوير أحدث قيمة في كاش كل المعالجات."
      }
    ],
    "lab": {
      "title": "⚡ معمل Chapter 1 التفاعلي: تتبّع الانتقال بين User Mode و Kernel Mode",
      "subtitle": "اضغط على كل خطوة لمشاهدة تغيّر قيمة الـ Mode Bit في الهاردوير أثناء تنفيذ System Call.",
      "steps": [
        {
          "btn": "1. User Mode",
          "heading": "تنفيذ برنامج المستخدم (User Mode)",
          "badge": "mode bit = 1",
          "detail": "يعمل البرنامج في الوضع المقيد (User Mode) ولا يمكنه تنفيذ أي Privileged Instruction.",
          "telemetryLeft": "State: User Process Executing",
          "telemetryRight": "Mode Bit: 1"
        },
        {
          "btn": "2. Trap (System Call)",
          "heading": "طلب System Call وإطلاق Trap",
          "badge": "1 → 0 (TRAP)",
          "detail": "يطلب البرنامج خدمة من النظام فيحدث Trap يقلب الهاردوير فيه الـ Mode Bit إلى 0.",
          "telemetryLeft": "Event: Software Trap",
          "telemetryRight": "Mode Bit: 1 → 0"
        },
        {
          "btn": "3. Kernel Mode",
          "heading": "تنفيذ الخدمة في النواة (Kernel Mode)",
          "badge": "mode bit = 0",
          "detail": "تنفذ النواة الأمر المحمي بأمان كامل في Kernel Mode ثم تجهز النتيجة.",
          "telemetryLeft": "State: Kernel Routine",
          "telemetryRight": "Mode Bit: 0"
        },
        {
          "btn": "4. Return",
          "heading": "العودة لوضع المستخدم (Return)",
          "badge": "0 → 1 (RETURN)",
          "detail": "يعيد النظام الـ Mode Bit إلى 1 ويكمل برنامج المستخدم تنفيذه من التعليمة التالية.",
          "telemetryLeft": "Event: Return to User",
          "telemetryRight": "Mode Bit: 0 → 1"
        }
      ]
    },
    "summary": [
      {
        "term": "Operating System",
        "en": "Intermediary between user and hardware (Resource Allocator + Control Program).",
        "ar": "وسيط بين المستخدم والهاردوير؛ موزع موارد وبرنامج تحكم."
      },
      {
        "term": "Kernel & Bootstrap",
        "en": "Kernel runs at all times; Bootstrap (ROM/Firmware) initializes system & loads kernel.",
        "ar": "النواة تعمل دائماً؛ والـ Bootstrap في الـ ROM يحمّلها."
      },
      {
        "term": "Trap / Exception",
        "en": "Software-generated interrupt caused by error or user request.",
        "ar": "مقاطعة برمجية بسبب خطأ أو طلب خدمة."
      },
      {
        "term": "Storage Managed By",
        "en": "Registers: Compiler | Cache: Hardware | RAM/SSD/Disk: OS.",
        "ar": "المسؤول عن إدارة كل مستوى في جدول سلايد 1.29."
      },
      {
        "term": "Cache Coherency",
        "en": "Hardware ensures all CPUs in multiprocessor have the most recent value.",
        "ar": "تناسق الكاش في الهاردوير بين المعالجات."
      },
      {
        "term": "Multiprogramming vs Timesharing",
        "en": "Multiprogramming switches on I/O wait; Timesharing switches rapidly (<1s).",
        "ar": "الأول لكفاءة الـ CPU والثاني للتفاعل المباشر."
      },
      {
        "term": "Dual-Mode & Timer",
        "en": "User (1) vs Kernel (0) protects OS; Timer prevents infinite loops.",
        "ar": "حماية النواة ومنع الحلقات اللانهائية."
      }
    ]
  },
  {
    "lessonId": "22222222-2222-4222-8222-222222222302",
    "courseCode": "CS-311",
    "chapterNum": 2,
    "titleEn": "Operating System Structures",
    "titleAr": "خدمات وهياكل نظم التشغيل",
    "subtitle": "كل سلايد في Chapter 2 منفردة لوحدها (من Slide 2.4 لـ Slide 2.23): السلايد ورسمتها على اليمين، والشرح المفصل على الشمال.",
    "slides": [
      {
        "id": "s2-4",
        "slideRef": "Slide 2.4",
        "shortLabel": "2.4 خريطة الخدمات",
        "title": "A View of Operating System Services — رسمة طبقات الخدمات",
        "enPoints": [
          "Top: <strong>user and other system programs</strong> → User Interfaces (<strong>GUI | batch | command line</strong>).",
          "Gateway: <strong>system calls</strong> leading to the 8 core OS services above <strong>hardware</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 265\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"28\" y=\"12\" width=\"644\" height=\"34\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"350\" y=\"34\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">user and other system programs</text>\n\n  <rect x=\"135\" y=\"54\" width=\"136\" height=\"34\" rx=\"8\" fill=\"#1c2533\" stroke=\"#66c7a6\"/>\n  <text x=\"203\" y=\"76\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">GUI</text>\n  <rect x=\"282\" y=\"54\" width=\"136\" height=\"34\" rx=\"8\" fill=\"#1c2533\" stroke=\"#66c7a6\"/>\n  <text x=\"350\" y=\"76\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">batch</text>\n  <rect x=\"429\" y=\"54\" width=\"136\" height=\"34\" rx=\"8\" fill=\"#1c2533\" stroke=\"#66c7a6\"/>\n  <text x=\"497\" y=\"76\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">command line</text>\n\n  <rect x=\"28\" y=\"96\" width=\"644\" height=\"32\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"117\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">system calls</text>\n\n  <rect x=\"28\" y=\"136\" width=\"644\" height=\"78\" rx=\"10\" fill=\"#152238\" stroke=\"#475569\"/>\n  <text x=\"115\" y=\"160\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">program execution</text>\n  <text x=\"265\" y=\"160\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">I/O operations</text>\n  <text x=\"420\" y=\"160\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">file systems</text>\n  <text x=\"580\" y=\"160\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">communication</text>\n\n  <text x=\"115\" y=\"192\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">error detection</text>\n  <text x=\"265\" y=\"192\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">resource allocation</text>\n  <text x=\"420\" y=\"192\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">accounting</text>\n  <text x=\"580\" y=\"192\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">protection &amp; security</text>\n\n  <rect x=\"28\" y=\"222\" width=\"644\" height=\"32\" rx=\"8\" fill=\"#1c2533\" stroke=\"#94A3B8\"/>\n  <text x=\"350\" y=\"243\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">hardware</text>\n</svg>",
        "svgCaption": "Slide 2.4 · A View of Operating System Services",
        "why": "الرسمة دي بتوضح السلم الكامل اللي بيمشيه المستخدم أو البرنامج عشان يوصل لأي خدمة جوه نظام التشغيل.",
        "deepPoints": [
          "<strong>واجهات التفاعل الـ 3:</strong> المستخدم بيتعامل عبر <span class='en-pill'>GUI</span> أو <span class='en-pill'>Batch</span> أو <span class='en-pill'>Command line (CLI)</span>.",
          "<strong>بوابة الـ <span class='en-pill'>System calls</span>:</strong> تحت الواجهات مباشرة، وهي اللي بتفتح الوصول للخدمات الثمانية داخل الـ OS."
        ],
        "examSpot": "الترتيب من أعلى لأسفل: User Interfaces (GUI/Batch/CLI) → <strong>System Calls</strong> → OS Services → Hardware.",
        "notebookEn": "Slide 2.4 Diagram: Programs -> [GUI | Batch | CLI] -> System Calls -> 8 OS Services -> Hardware.",
        "notebookAr": "الواجهات فوق الـ System Calls، والـ System Calls هي البوابة للخدمات الثمانية."
      },
      {
        "id": "s2-5",
        "slideRef": "Slide 2.5",
        "shortLabel": "2.5 الخدمات الـ 8",
        "title": "Operating System Services — شرح الخدمات الثمانية بالتفصيل",
        "enPoints": [
          "1. <strong>Program execution:</strong> load, run, and terminate programs.",
          "2. <strong>I/O operations:</strong> transfer data to and from I/O devices.",
          "3. <strong>File-system manipulation:</strong> read, write, delete, and search files &amp; directories.",
          "4. <strong>Communications:</strong> processes exchange information over a network.",
          "5. <strong>Error detection:</strong> detect and handle errors.",
          "6. <strong>Resource allocation:</strong> allocate resources to concurrent jobs.",
          "7. <strong>Accounting:</strong> track which users use how much and what kinds of resources.",
          "8. <strong>Protection and security:</strong> control all access to system resources and provide authentication."
        ],
        "svg": null,
        "why": "السلايد بتفصل تعريف كل خدمة من الصناديق الثمانية اللي ظهرت في رسمة سلايد 2.4.",
        "deepPoints": [
          "<strong>خدمات للمستخدم (1–5):</strong> تشغيل البرامج، نقل بيانات الـ I/O، إدارة الملفات والمجلدات، الاتصالات، واكتشاف الأخطاء.",
          "<strong>خدمات للنظام (6–8):</strong> توزيع الموارد (<span class='en-pill'>Resource allocation</span>)، تتبع استهلاك المستخدمين (<span class='en-pill'>Accounting</span>)، والتحكم في الوصول وتوثيق الهوية (<span class='en-pill'>Protection &amp; Security</span>)."
        ],
        "examSpot": "ميز بين <strong>Accounting</strong> (تتبع استهلاك الموارد) و <strong>Protection &amp; Security</strong> (التحكم في الوصول والـ Authentication).",
        "notebookEn": "Slide 2.5 (8 Services): Program execution, I/O ops, File-system, Communications, Error detection, Resource allocation, Accounting, Protection & security.",
        "notebookAr": "احفظ الـ 8 خدمات؛ أول 5 لمساعدة المستخدم وآخر 3 لكفاءة وأمان النظام."
      },
      {
        "id": "s2-6",
        "slideRef": "Slide 2.6",
        "shortLabel": "2.6 System Calls & API",
        "title": "System Calls & Most Common APIs (Win32, POSIX, Java)",
        "enPoints": [
          "<strong>System Calls:</strong> Programming interface to the services provided by the OS (typically written in C or C++).",
          "Mostly accessed via high-level <strong>API (Application Programming Interface)</strong> rather than direct system calls.",
          "<strong>API:</strong> Set of functions available to an application including parameters passed and return values.",
          "<strong>3 Most Common APIs:</strong> <strong>Win32</strong> (Windows), <strong>POSIX API</strong> (UNIX, Linux, MacOS X), <strong>Java API</strong> (JVM)."
        ],
        "svg": null,
        "why": "كتابة System Calls مباشرة صعبة ومرتبطة بنظام واحد؛ علشان كده المبرمجين يستخدموا API قياسية قابلة للنقل.",
        "deepPoints": [
          "<strong>وظيفة الـ <span class='en-pill'>API</span>:</strong> بتدي التطبيقات طريقة قياسية موحدة لطلب خدمات الـ OS مع تحديد الـ <span class='en-pill'>Parameters</span> والـ <span class='en-pill'>Return values</span>.",
          "<strong>أشهر 3 واجهات API:</strong> <span class='en-pill'>Win32</span> للويندوز، و<span class='en-pill'>POSIX API</span> ليونكس ولينكس وماك، و<span class='en-pill'>Java API</span> للـ JVM."
        ],
        "examSpot": "سؤال الميدتيرم Q1.10: أي مما يلي مثال على API؟ الإجابة: <strong>POSIX API</strong>.",
        "notebookEn": "Slide 2.6: System Call = programming interface to OS services.\n3 Common APIs: Win32 (Windows), POSIX (UNIX/Linux/Mac), Java API (JVM).",
        "notebookAr": "الـ API يسهل طلب خدمات النظام بطريقة قياسية؛ وأشهر 3 أمثلة: Win32 و POSIX و Java API."
      },
      {
        "id": "s2-7",
        "slideRef": "Slide 2.7",
        "shortLabel": "2.7 مثال read()",
        "title": "Example of Standard API — تشريح دالة read() في UNIX/Linux",
        "enPoints": [
          "Command: <code>man read</code> | Header: <code>#include &lt;unistd.h&gt;</code>.",
          "Signature: <code>ssize_t read(int fd, void *buf, size_t count)</code>.",
          "Parameters: <code>fd</code> (file descriptor), <code>buf</code> (buffer for read data), <code>count</code> (max bytes).",
          "Returns: <strong>bytes read</strong> on success, <strong><code>0</code> on End-of-File (EOF)</strong>, <strong><code>-1</code> on error</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 165\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"24\" y=\"14\" width=\"652\" height=\"136\" rx=\"12\" fill=\"#152238\" stroke=\"#66c7a6\" stroke-width=\"1.5\"/>\n  <text x=\"48\" y=\"42\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\">#include &lt;unistd.h&gt;</text>\n\n  <text x=\"48\" y=\"78\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"16\" font-weight=\"800\">ssize_t</text>\n  <text x=\"148\" y=\"78\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"16\" font-weight=\"800\">read</text>\n  <text x=\"195\" y=\"78\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"15.5\" font-weight=\"700\">(int fd, void *buf, size_t count)</text>\n\n  <path d=\"M 48 88 L 48 102 L 122 102 L 122 88\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"85\" y=\"122\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">return value</text>\n\n  <path d=\"M 148 88 L 148 102 L 190 102 L 190 88\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"1.8\"/>\n  <text x=\"169\" y=\"122\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">name</text>\n\n  <path d=\"M 205 88 L 205 102 L 545 102 L 545 88\" fill=\"none\" stroke=\"#7ca7f0\" stroke-width=\"1.8\"/>\n  <text x=\"375\" y=\"122\" fill=\"#7ca7f0\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">parameters (fd, buf, count)</text>\n</svg>",
        "svgCaption": "Slide 2.7 · POSIX read() API Signature",
        "why": "مثال عملي حقيقي من نظام Linux بيوريك شكل أي دالة API قياسية: هيدر + نوع قيمة راجعة + اسم دالة + معاملات.",
        "deepPoints": [
          "<strong>المعاملات الثلاثة:</strong> <span class='code-pill'>fd</span> رقم الملف المفتوح، <span class='code-pill'>buf</span> عنوان المخزن في الرام، <span class='code-pill'>count</span> أقصى عدد بايتات.",
          "<strong>القيم الراجعة الثلاثة:</strong> عدد البايتات المقروءة عند النجاح، أو <strong><span class='code-pill'>0</span></strong> عند نهاية الملف (<span class='en-pill'>EOF</span>)، أو <strong><span class='code-pill'>-1</span></strong> عند الخطأ."
        ],
        "examSpot": "احفظ قيم إرجاع <code>read()</code>: <strong>0 = EOF</strong>، و<strong>-1 = Error</strong>، والهيدر <code>&lt;unistd.h&gt;</code>.",
        "notebookEn": "Slide 2.7: ssize_t read(int fd, void *buf, size_t count) [#include <unistd.h>]\nReturns: bytes read (>0), 0 (EOF), -1 (Error).",
        "notebookAr": "دالة read ترجع عدد البايتات عند النجاح، و 0 عند نهاية الملف، و -1 عند الخطأ."
      },
      {
        "id": "s2-8",
        "slideRef": "Slide 2.8",
        "shortLabel": "2.8 تنفيذ System Call",
        "title": "System Call Implementation — جدول الأرقام ومكتبة وقت التشغيل",
        "enPoints": [
          "A unique <strong>number</strong> is associated with each system call.",
          "<strong>System-call interface</strong> maintains a <strong>table indexed according to these numbers</strong>.",
          "Invokes the intended system call in OS kernel and returns status &amp; return values.",
          "Details hidden from programmer by API (managed by <strong>run-time support library</strong>)."
        ],
        "svg": null,
        "why": "عشان النواة تعرف أي خدمة مطلوبة بأمان، كل System Call ليها رقم فهرس ثابت في جدول خاص داخل الـ System-call interface.",
        "deepPoints": [
          "<strong>جدول الأرقام:</strong> الـ <span class='en-pill'>System-call interface</span> يبحث برقم الـ System call في جدوله ويستدعي كود النواة المقابل.",
          "<strong>إخفاء التفاصيل:</strong> المبرمج يلتزم بالـ API فقط، والـ <span class='en-pill'>Run-time support library</span> تخفي عنه تفاصيل التنفيذ."
        ],
        "examSpot": "الـ <strong>System-call interface</strong> يحتفظ بـ <strong>table indexed according to system-call numbers</strong>.",
        "notebookEn": "Slide 2.8: Each system call has a number -> System-call interface maintains indexed table -> invokes kernel routine -> hidden by run-time support library.",
        "notebookAr": "لكل System Call رقم في جدول الـ Interface وتفاصيلها مخفية عن المبرمج بواسطة الـ API."
      },
      {
        "id": "s2-9",
        "slideRef": "Slide 2.9",
        "shortLabel": "2.9 رسمة open()",
        "title": "API – System Call – OS Relationship — رسمة استدعاء open()",
        "enPoints": [
          "<code>user application</code> calls <code>open()</code> in <strong>user mode</strong>.",
          "Passes into <strong>system call interface</strong> → looks up index <code>i</code> in table → executes <code>open()</code> in <strong>kernel mode</strong> → returns."
        ],
        "svg": "<svg viewBox=\"0 0 700 230\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m29\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#66c7a6\"/>\n    </marker>\n  </defs>\n  <rect x=\"210\" y=\"12\" width=\"280\" height=\"40\" rx=\"20\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"37\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">user application</text>\n\n  <text x=\"64\" y=\"72\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">user mode</text>\n  <text x=\"64\" y=\"116\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">kernel mode</text>\n\n  <rect x=\"155\" y=\"76\" width=\"490\" height=\"34\" rx=\"10\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"400\" y=\"98\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">system call interface</text>\n\n  <line x1=\"275\" y1=\"52\" x2=\"275\" y2=\"74\" stroke=\"#e58a62\" stroke-width=\"2.2\" marker-end=\"url(#m29)\"/>\n  <text x=\"238\" y=\"67\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">open()</text>\n  <line x1=\"425\" y1=\"76\" x2=\"425\" y2=\"54\" stroke=\"#66c7a6\" stroke-width=\"2.2\" marker-end=\"url(#m29)\"/>\n\n  <rect x=\"175\" y=\"132\" width=\"120\" height=\"84\" rx=\"10\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.5\"/>\n  <text x=\"235\" y=\"152\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">index table</text>\n  <rect x=\"190\" y=\"162\" width=\"90\" height=\"24\" rx=\"5\" fill=\"rgba(102,199,166,0.2)\" stroke=\"#66c7a6\"/>\n  <text x=\"235\" y=\"179\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">index [ i ]</text>\n\n  <rect x=\"375\" y=\"132\" width=\"250\" height=\"84\" rx=\"10\" fill=\"#152238\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"500\" y=\"158\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">open() Implementation</text>\n  <text x=\"500\" y=\"180\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" text-anchor=\"middle\">Kernel routine executes</text>\n  <text x=\"500\" y=\"200\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">return</text>\n\n  <line x1=\"235\" y1=\"110\" x2=\"235\" y2=\"130\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m29)\"/>\n  <line x1=\"295\" y1=\"174\" x2=\"371\" y2=\"174\" stroke=\"#66c7a6\" stroke-width=\"2.2\" marker-end=\"url(#m29)\"/>\n  <line x1=\"500\" y1=\"132\" x2=\"500\" y2=\"112\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m29)\"/>\n</svg>",
        "svgCaption": "Slide 2.9 · API – System Call – OS Relationship (open)",
        "why": "الرسمة دي بتوضح خطوة بخطوة إزاي نداء دالة <code>open()</code> بيعبر الحدود بين User Mode و Kernel Mode عبر جدول الأرقام.",
        "deepPoints": [
          "<strong>مسار الاستدعاء:</strong> التطبيق ينادي <code>open()</code> في User Mode ← تدخل الـ Interface ← تبحث بالرقم <code>i</code> في الجدول ← تتنفذ في Kernel Mode ← تعمل <code>return</code>."
        ],
        "examSpot": "تذكر أن الـ <strong>System Call Interface</strong> يقف بالضبط على الحد الفاصل بين <strong>User Mode</strong> و <strong>Kernel Mode</strong>.",
        "notebookEn": "Slide 2.9: user app calls open() [user mode] -> system call interface -> table index [i] -> kernel open() -> return.",
        "notebookAr": "رحلة open(): من التطبيق للـ Interface لجدول الأرقام (i) للتنفيذ داخل النواة ثم العودة."
      },
      {
        "id": "s2-10",
        "slideRef": "Slide 2.10",
        "shortLabel": "2.10 تمرير المعاملات",
        "title": "System Call Parameter Passing — الطرق الثلاثة لتمرير المعاملات",
        "enPoints": [
          "1. <strong>Registers:</strong> Simplest, but may have more parameters than registers.",
          "2. <strong>Block or table in memory:</strong> Address of block passed in a register (<strong>Linux and Solaris</strong>).",
          "3. <strong>Stack:</strong> Pushed onto stack by program and popped off by OS.",
          "<strong>Block and stack methods do NOT limit the number or length of parameters.</strong>"
        ],
        "svg": null,
        "why": "لو عدد المعاملات المبعوتة للـ System Call أكبر من عدد الـ Registers المتاحة في الـ CPU، بنحتاج بدائل بلا حد أقصى.",
        "deepPoints": [
          "<strong>الطريقة 1 (<span class='en-pill'>Registers</span>):</strong> الأبسط والأسرع لكنها محدودة بعدد المسجلات.",
          "<strong>الطريقة 2 (<span class='en-pill'>Block/Table in memory</span>):</strong> نخزن المعاملات في جدول بالرام ونبعت عنوانه في Register — ودي طريقة <strong><span class='en-pill'>Linux &amp; Solaris</span></strong>.",
          "<strong>الطريقة 3 (<span class='en-pill'>Stack</span>):</strong> البرنامج يعمل Push والـ OS يعمل Pop. وطريقتا <strong>Block و Stack بلا حد أقصى</strong>."
        ],
        "examSpot": "<strong>Linux and Solaris</strong> يستخدمان طريقة <strong>Block/table in memory</strong>؛ وطريقتا <strong>Block و Stack</strong> لا تحدّان من عدد أو طول المعاملات.",
        "notebookEn": "Slide 2.10 (3 Parameter Methods):\n1) Registers (simplest, limited)\n2) Block/Table in RAM, address in register (Linux & Solaris)\n3) Stack (push/pop). * Block & Stack have NO limit.",
        "notebookAr": "3 طرق لتمرير المعاملات: Registers (محدودة)، جدول بالرام (Linux/Solaris)، و Stack (الجدول والـ Stack غير محدودين)."
      },
      {
        "id": "s2-11",
        "slideRef": "Slide 2.11",
        "shortLabel": "2.11 رسمة الجدول X",
        "title": "Parameter Passing via Table — رسمة تمرير المعاملات عبر جدول X",
        "enPoints": [
          "User program stores parameters at memory address <code>X</code>, loads address <code>X</code> into a <strong>register</strong>, and invokes <code>system call 13</code>.",
          "OS executes code for <code>system call 13</code> and reads parameters from table <code>X</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m211\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n  </defs>\n  <rect x=\"36\" y=\"42\" width=\"188\" height=\"148\" rx=\"12\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"130\" y=\"210\" fill=\"#7ca7f0\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">user program</text>\n  <text x=\"130\" y=\"76\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">X: parameters for call</text>\n  <text x=\"130\" y=\"132\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">load address X</text>\n  <text x=\"130\" y=\"156\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">system call 13</text>\n\n  <rect x=\"295\" y=\"18\" width=\"110\" height=\"36\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"41\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"14\" font-weight=\"800\" text-anchor=\"middle\">register [ X ]</text>\n\n  <rect x=\"466\" y=\"42\" width=\"198\" height=\"148\" rx=\"12\" fill=\"#152238\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"565\" y=\"210\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">operating system</text>\n  <rect x=\"478\" y=\"88\" width=\"174\" height=\"64\" rx=\"8\" fill=\"rgba(102,199,166,0.14)\" stroke=\"#66c7a6\"/>\n  <text x=\"565\" y=\"114\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">use parameters</text>\n  <text x=\"565\" y=\"132\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">from table X (call 13)</text>\n\n  <path d=\"M 224 128 L 265 128 L 265 36 L 292 36\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"2\" marker-end=\"url(#m211)\"/>\n  <path d=\"M 405 36 L 436 36 L 436 128 L 474 128\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"2\" marker-end=\"url(#m211)\"/>\n  <path d=\"M 224 152 L 320 152 L 420 108 L 474 108\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m211)\"/>\n</svg>",
        "svgCaption": "Slide 2.11 · Parameter Passing via Table (Linux & Solaris)",
        "why": "الرسمة بتوضح الطريقة التانية (بتاعة Linux و Solaris) بصرياً: Register واحد بس شايل العنوان <code>X</code> يكفي لتمرير أي عدد من المعاملات!",
        "deepPoints": [
          "<strong>الخطوات على الرسمة:</strong> (1) وضع المعاملات في جدول عند العنوان <code>X</code>، (2) تحميل <code>X</code> في Register، (3) استدعاء <code>system call 13</code>، (4) قراءة النواة للمعاملات من الجدول <code>X</code>."
        ],
        "examSpot": "اربط الرسمة بـ <strong>Linux and Solaris</strong>: تمرير عنوان الجدول <code>X</code> في Register واحد.",
        "notebookEn": "Slide 2.11: User stores params at X -> loads X into register -> calls syscall 13 -> OS reads params from table X.",
        "notebookAr": "نضع المعاملات في جدول عنوانه X ونرسل X في Register فيقرأها الـ OS من الجدول."
      },
      {
        "id": "s2-12",
        "slideRef": "Slide 2.12",
        "shortLabel": "2.12 مثال printf/write",
        "title": "Standard C Library Example — استدعاء printf() لـ write()",
        "enPoints": [
          "C program invokes <code>printf(\"Greetings\");</code> (<strong>library call</strong> in user mode).",
          "<strong>Standard C library</strong> invokes <strong><code>write()</code> system call</strong> in kernel mode."
        ],
        "svg": "<svg viewBox=\"0 0 700 225\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"215\" y=\"12\" width=\"270\" height=\"72\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"235\" y=\"34\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">#include &lt;stdio.h&gt;  int main() {</text>\n  <text x=\"255\" y=\"56\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\">printf(\"Greetings\");</text>\n  <text x=\"235\" y=\"74\" fill=\"#94A3B8\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\">return 0; }</text>\n\n  <text x=\"64\" y=\"102\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">user mode</text>\n  <text x=\"64\" y=\"142\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">kernel mode</text>\n\n  <rect x=\"175\" y=\"104\" width=\"350\" height=\"32\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"125\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">standard C library</text>\n\n  <rect x=\"230\" y=\"162\" width=\"240\" height=\"46\" rx=\"23\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"190\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">write() system call</text>\n\n  <line x1=\"265\" y1=\"84\" x2=\"265\" y2=\"104\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n  <line x1=\"435\" y1=\"104\" x2=\"435\" y2=\"84\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"275\" y1=\"136\" x2=\"275\" y2=\"162\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n  <text x=\"232\" y=\"154\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\">write()</text>\n  <line x1=\"425\" y1=\"162\" x2=\"425\" y2=\"136\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n</svg>",
        "svgCaption": "Slide 2.12 · C Library printf() → write() System Call",
        "why": "مثال عملي بيوضح الفرق بين دالة المكتبة اللي بتكتبها في كودك وبين الـ System Call الحقيقي اللي بيحصل جوه النواة.",
        "deepPoints": [
          "<strong><span class='code-pill'>printf()</span>:</strong> مجرد Library Call داخل مكتبة C القياسية في User Mode.",
          "<strong><span class='code-pill'>write()</span>:</strong> هو الـ System Call الحقيقي اللي بيدخل Kernel Mode لطباعة النص."
        ],
        "examSpot": "دالة <code>printf()</code> هي <strong>Library call</strong> تستدعي داخلياً <strong><code>write()</code> system call</strong>.",
        "notebookEn": "Slide 2.12: C program -> printf() [library call, user mode] -> Standard C Library -> write() [system call, kernel mode].",
        "notebookAr": "دالة printf() دالة مكتبة تستدعي داخلياً نداء النظام write()."
      },
      {
        "id": "s2-13",
        "slideRef": "Slide 2.13",
        "shortLabel": "2.13 MS-DOS vs FreeBSD",
        "title": "Example of Single and Multi-Tasking — MS-DOS مقابل FreeBSD",
        "enPoints": [
          "<strong>MS-DOS (Single-tasking):</strong> At startup holds kernel + command interpreter + free memory; when running a program holds only <strong>1 process</strong>.",
          "<strong>FreeBSD (Multi-tasking):</strong> Simultaneously holds kernel + <code>process B</code> + interpreter + <code>process C</code> + free memory + <code>process D</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 245\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- FreeBSD -->\n  <text x=\"150\" y=\"22\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">FreeBSD (Multi-tasking)</text>\n  <rect x=\"65\" y=\"32\" width=\"170\" height=\"32\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"150\" y=\"53\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">process D</text>\n  <rect x=\"65\" y=\"66\" width=\"170\" height=\"24\" rx=\"4\" fill=\"#0c1017\" stroke=\"#475569\" stroke-dasharray=\"4 3\"/><text x=\"150\" y=\"82\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">free memory</text>\n  <rect x=\"65\" y=\"92\" width=\"170\" height=\"32\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"150\" y=\"113\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">process C</text>\n  <rect x=\"65\" y=\"126\" width=\"170\" height=\"26\" rx=\"4\" fill=\"rgba(102,199,166,0.18)\" stroke=\"#66c7a6\"/><text x=\"150\" y=\"144\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">interpreter</text>\n  <rect x=\"65\" y=\"154\" width=\"170\" height=\"36\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"150\" y=\"177\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" text-anchor=\"middle\">process B</text>\n  <rect x=\"65\" y=\"192\" width=\"170\" height=\"34\" rx=\"6\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/><text x=\"150\" y=\"214\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">kernel</text>\n\n  <!-- MS-DOS -->\n  <text x=\"500\" y=\"22\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">MS-DOS (Single-tasking)</text>\n  <rect x=\"345\" y=\"38\" width=\"135\" height=\"94\" rx=\"6\" fill=\"#0c1017\" stroke=\"#475569\" stroke-dasharray=\"4 3\"/><text x=\"412\" y=\"90\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">free memory</text>\n  <rect x=\"345\" y=\"134\" width=\"135\" height=\"44\" rx=\"4\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\"/><text x=\"412\" y=\"160\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">cmd interpreter</text>\n  <rect x=\"345\" y=\"180\" width=\"135\" height=\"34\" rx=\"6\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/><text x=\"412\" y=\"202\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">kernel</text>\n  <text x=\"412\" y=\"234\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11\" text-anchor=\"middle\">(a) Startup</text>\n\n  <rect x=\"515\" y=\"38\" width=\"135\" height=\"36\" rx=\"6\" fill=\"#0c1017\" stroke=\"#475569\" stroke-dasharray=\"4 3\"/><text x=\"582\" y=\"60\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">free memory</text>\n  <rect x=\"515\" y=\"76\" width=\"135\" height=\"72\" rx=\"6\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"582\" y=\"116\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">1 process</text>\n  <rect x=\"515\" y=\"150\" width=\"135\" height=\"28\" rx=\"4\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\"/><text x=\"582\" y=\"168\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">cmd interpreter</text>\n  <rect x=\"515\" y=\"180\" width=\"135\" height=\"34\" rx=\"6\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/><text x=\"582\" y=\"202\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">kernel</text>\n  <text x=\"582\" y=\"234\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11\" text-anchor=\"middle\">(b) Running 1 program</text>\n</svg>",
        "svgCaption": "Slide 2.13 · FreeBSD (Multi-tasking) vs. MS-DOS (Single-tasking)",
        "why": "مقارنة بصرية مباشرة لشكل الـ RAM في نظام بيشغل مهمة واحدة بس مقابل نظام حديث بيشغل عدة مهام معاً.",
        "deepPoints": [
          "<strong><span class='en-pill'>MS-DOS</span>:</strong> يشغل عملية واحدة فقط في الذاكرة (<span class='en-pill'>Single-tasking</span>).",
          "<strong><span class='en-pill'>FreeBSD</span>:</strong> يشغل عدة عمليات (<span class='code-pill'>B, C, D</span>) معاً في الرام (<span class='en-pill'>Multi-tasking</span>)."
        ],
        "examSpot": "<strong>MS-DOS</strong> = Single-tasking؛ <strong>FreeBSD</strong> = Multi-tasking.",
        "notebookEn": "Slide 2.13: MS-DOS = Single-tasking (1 process) | FreeBSD = Multi-tasking (multiple processes B, C, D).",
        "notebookAr": "MS-DOS أحادي المهام (عملية واحدة في الرام)، بينما FreeBSD متعدد المهام."
      },
      {
        "id": "s2-14",
        "slideRef": "Slide 2.14",
        "shortLabel": "2.14 الهياكل الستة",
        "title": "Operating System Structure — قائمة الهياكل الستة",
        "enPoints": [
          "1- <strong>Simple Structure</strong> (MS-DOS)",
          "2- <strong>Monolithic Structure</strong>",
          "3- <strong>Layered Approach</strong>",
          "4- <strong>Microkernels</strong> (Mach)",
          "5- <strong>Modules</strong>",
          "6- <strong>Hybrid Systems</strong>"
        ],
        "svg": null,
        "why": "خريطة الهياكل الستة لبناء وتنظيم كود نظام التشغيل من الأبسط والأقدم وحتى الأحدث.",
        "deepPoints": [
          "احفظ الـ 6 أنواع بالترتيب مع المثال الأشهر لكل نوع لأنها سؤال مقالي ثابت في شيت د. شروق (Q21)."
        ],
        "examSpot": "سؤال شيت د. شروق المقالي Q21: <strong>List the main types of operating system structures</strong> (الستة أنواع بالنص).",
        "notebookEn": "Slide 2.14 (6 Structures): 1-Simple (MS-DOS), 2-Monolithic (UNIX), 3-Layered, 4-Microkernels (Mach), 5-Modules (Solaris/Linux), 6-Hybrid (Mac OS X/iOS/Android).",
        "notebookAr": "الهياكل الستة: Simple, Monolithic, Layered, Microkernels, Modules, Hybrid."
      },
      {
        "id": "s2-15",
        "slideRef": "Slide 2.15",
        "shortLabel": "2.15 Simple (MS-DOS)",
        "title": "1- Simple Structure (MS-DOS) — المميزات والعيوب والرسمة",
        "enPoints": [
          "Written to provide the <strong>most functionality in the least space</strong>; <strong>not divided into modules</strong>.",
          "<strong>Advantage:</strong> Simple and easy to implement.",
          "<strong>3 Disadvantages:</strong> (1) Does not break system into subsystems, (2) No distinction between user and kernel, (3) <strong>Allows direct access to H.W.</strong>"
        ],
        "svg": "<svg viewBox=\"0 0 700 225\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m215\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n  </defs>\n  <rect x=\"115\" y=\"14\" width=\"470\" height=\"38\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"38\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"700\" text-anchor=\"middle\">application program</text>\n\n  <rect x=\"155\" y=\"68\" width=\"350\" height=\"38\" rx=\"8\" fill=\"#152238\" stroke=\"#94A3B8\"/>\n  <text x=\"330\" y=\"92\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">resident system program</text>\n\n  <rect x=\"155\" y=\"122\" width=\"270\" height=\"38\" rx=\"8\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\"/>\n  <text x=\"290\" y=\"146\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">MS-DOS device drivers</text>\n\n  <rect x=\"155\" y=\"176\" width=\"430\" height=\"38\" rx=\"8\" fill=\"rgba(194,94,51,0.2)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"370\" y=\"200\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">ROM BIOS device drivers (Hardware)</text>\n\n  <!-- Normal downward arrows -->\n  <line x1=\"250\" y1=\"52\" x2=\"250\" y2=\"66\" stroke=\"#94A3B8\" stroke-width=\"2\" marker-end=\"url(#m215)\"/>\n  <line x1=\"250\" y1=\"106\" x2=\"250\" y2=\"120\" stroke=\"#94A3B8\" stroke-width=\"2\" marker-end=\"url(#m215)\"/>\n  <line x1=\"250\" y1=\"160\" x2=\"250\" y2=\"174\" stroke=\"#94A3B8\" stroke-width=\"2\" marker-end=\"url(#m215)\"/>\n\n  <!-- Direct bypass arrows! -->\n  <line x1=\"470\" y1=\"106\" x2=\"470\" y2=\"174\" stroke=\"#e58a62\" stroke-width=\"2.2\" marker-end=\"url(#m215)\"/>\n  <line x1=\"555\" y1=\"52\" x2=\"555\" y2=\"174\" stroke=\"#e58a62\" stroke-width=\"2.5\" marker-end=\"url(#m215)\"/>\n  <text x=\"615\" y=\"120\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">Direct HW</text>\n  <text x=\"615\" y=\"135\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">Bypass!</text>\n</svg>",
        "svgCaption": "Slide 2.15 · MS-DOS Layer Structure (Direct HW Bypass)",
        "why": "أقدم وأبسط هيكل (MS-DOS) بدون حماية حقيقية؛ لاحظ الأسهم الجانبية في الرسمة اللي بتنط مباشرة للـ ROM BIOS!",
        "deepPoints": [
          "<strong>الميزة الوحيدة:</strong> بسيط وسهل التنفيذ (<span class='en-pill'>Simple and easy to implement</span>).",
          "<strong>العيوب الثلاثة:</strong> لا يقسم النظام لـ Subsystems، لا يفصل بين User و Kernel، ويسمح بالوصول المباشر للهاردوير (<span class='en-pill'>Direct access to H.W</span>)."
        ],
        "examSpot": "أخطر عيبين في MS-DOS: عدم الفصل بين User و Kernel، والسماح بالوصول المباشر للهاردوير.",
        "notebookEn": "Slide 2.15 Simple (MS-DOS): Pro = Easy to implement | Cons = No subsystems, No user/kernel distinction, Direct HW access.",
        "notebookAr": "MS-DOS بسيط وسهل التنفيذ لكنه بلا فصل بين المستخدم والنواة ويسمح بالوصول المباشر للهاردوير."
      },
      {
        "id": "s2-16",
        "slideRef": "Slide 2.16",
        "shortLabel": "2.16 Monolithic (UNIX)",
        "title": "2- UNIX System Structure (Monolithic) — الشرح والمميزات والعيوب",
        "enPoints": [
          "Consists of <strong>two separable parts</strong>: <strong>Systems programs</strong> + <strong>The Kernel</strong>.",
          "The Kernel contains everything below the system-call interface and above physical hardware in <strong>one large level</strong> (<strong>monolithic</strong>).",
          "<strong>Advantages:</strong> (1) <strong>Higher performance</strong>, (2) <strong>Add some protection</strong>.",
          "<strong>Disadvantage:</strong> <strong>Very complex to maintain later</strong>."
        ],
        "svg": null,
        "why": "تجميع كل وظائف النواة في كتلة واحدة أعطى UNIX سرعة عالية وحماية أفضل من MS-DOS، لكنه جعل الكود ضخماً وصعب الصيانة.",
        "deepPoints": [
          "<strong>التركيب:</strong> جزئين منفصلين (برامج النظام + نواة واحدة ضخمة فيها نظام الملفات والجدولة والذاكرة معاً).",
          "<strong>المميزات vs العيب:</strong> أداء أعلى (<span class='en-pill'>Higher performance</span>) وبعض الحماية، لكنه <strong>معقد جداً في الصيانة (<span class='en-pill'>Very complex to maintain</span>)</strong>."
        ],
        "examSpot": "سؤال د. شروق صح وغلط #3: هل الـ Monolithic يقسم النظام لوحدات صغيرة مستقلة؟ الإجابة <strong>False</strong>!",
        "notebookEn": "Slide 2.16 Monolithic (UNIX): All kernel services in 1 level.\nPros: Higher performance + some protection | Con: Very complex to maintain.",
        "notebookAr": "الـ Monolithic (UNIX) يضع كل خدمات النواة في مستوى واحد؛ سريع لكن صعب الصيانة."
      },
      {
        "id": "s2-17",
        "slideRef": "Slide 2.17",
        "shortLabel": "2.17 رسمة UNIX",
        "title": "Traditional UNIX System Structure — رسمة هيكل UNIX التقليدي",
        "enPoints": [
          "Described as <strong>“Beyond simple but not fully layered”</strong>.",
          "Shows the monolithic <strong>Kernel</strong> block sitting between <code>system-call interface to the kernel</code> and <code>kernel interface to the hardware</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 250\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"40\" y=\"10\" width=\"620\" height=\"30\" rx=\"7\" fill=\"#141b25\" stroke=\"#7ca7f0\"/>\n  <text x=\"350\" y=\"30\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">(the users)</text>\n\n  <rect x=\"40\" y=\"44\" width=\"620\" height=\"34\" rx=\"7\" fill=\"#152238\" stroke=\"#7ca7f0\"/>\n  <text x=\"350\" y=\"66\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" text-anchor=\"middle\">shells and commands  ·  compilers and interpreters  ·  system libraries</text>\n\n  <rect x=\"40\" y=\"82\" width=\"620\" height=\"28\" rx=\"6\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/>\n  <text x=\"350\" y=\"101\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">system-call interface to the kernel</text>\n\n  <rect x=\"40\" y=\"114\" width=\"620\" height=\"66\" rx=\"8\" fill=\"rgba(102,199,166,0.12)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"145\" y=\"138\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">signals · terminal handling</text>\n  <text x=\"145\" y=\"160\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11\" text-anchor=\"middle\">character I/O · drivers</text>\n\n  <text x=\"350\" y=\"138\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">file system · swapping</text>\n  <text x=\"350\" y=\"160\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11\" text-anchor=\"middle\">block I/O · disk/tape drivers</text>\n\n  <text x=\"555\" y=\"138\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">CPU scheduling</text>\n  <text x=\"555\" y=\"160\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11\" text-anchor=\"middle\">paging · virtual memory</text>\n\n  <rect x=\"40\" y=\"184\" width=\"620\" height=\"26\" rx=\"6\" fill=\"#1c2533\" stroke=\"#94A3B8\"/>\n  <text x=\"350\" y=\"201\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">kernel interface to the hardware</text>\n\n  <rect x=\"40\" y=\"214\" width=\"620\" height=\"28\" rx=\"7\" fill=\"#0c1017\" stroke=\"#64748B\"/>\n  <text x=\"350\" y=\"233\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" text-anchor=\"middle\">terminal controllers   |   device controllers (disks/tapes)   |   memory controllers (RAM)</text>\n</svg>",
        "svgCaption": "Slide 2.17 · Traditional UNIX System Structure",
        "why": "الرسمة توضح بعينك ليه سموه Monolithic: كل خدمات النواة محشورة في كتلة واحدة بين واجهة الـ System calls وواجهة الهاردوير.",
        "deepPoints": [
          "<strong>الكتلة الوسطى (Kernel):</strong> تضم 3 مجموعات كبيرة في نفس المستوى: معالجة الإشارات والـ Terminal، ونظام الملفات والـ Swapping، وجدولة المعالج والـ Virtual Memory."
        ],
        "examSpot": "وصف UNIX التقليدي في سلايد 2.17: <strong>Beyond simple but not fully layered</strong>.",
        "notebookEn": "Slide 2.17: Traditional UNIX = 'Beyond simple but not fully layered' (one monolithic kernel block).",
        "notebookAr": "رسمة UNIX توضح تكديس كل خدمات النواة في مستوى واحد بين واجهة النظام والهاردوير."
      },
      {
        "id": "s2-18",
        "slideRef": "Slide 2.18",
        "shortLabel": "2.18 نظام الطبقات",
        "title": "3- Layered Approach — نظام الطبقات من Layer 0 لـ Layer N",
        "enPoints": [
          "Divided into layers: bottom (<strong>layer 0</strong>) = <strong>hardware</strong>; highest (<strong>layer N</strong>) = <strong>user interface</strong>.",
          "Each layer uses functions/services of <strong>ONLY lower-level layers</strong>.",
          "<strong>Advantages:</strong> Each layer <strong>developed and debugged independently</strong> ('if error found in layer, it must be in that layer').",
          "<strong>Disadvantages:</strong> Hard to decide <strong>layer order</strong>; <strong>less efficient</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 245\" xmlns=\"http://www.w3.org/2000/svg\">\n  <circle cx=\"350\" cy=\"122\" r=\"110\" fill=\"rgba(194,94,51,0.14)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"34\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">layer N (user interface)</text>\n\n  <circle cx=\"350\" cy=\"122\" r=\"78\" fill=\"rgba(102,199,166,0.12)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"66\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">• • •  layer 1</text>\n\n  <circle cx=\"350\" cy=\"122\" r=\"44\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"118\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">layer 0</text>\n  <text x=\"350\" y=\"135\" fill=\"#7ca7f0\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">hardware</text>\n</svg>",
        "svgCaption": "Slide 2.18 · Layered Approach (Layer 0 → Layer N)",
        "why": "تقسيم النظام لحلقات متدرجة يسهّل عزل الأخطاء وتصحيحها بشكل مستقل، لكنه يبطئ التنفيذ ويجعل ترتيب الطبقات صعباً.",
        "deepPoints": [
          "<strong>قاعدة الوصول الصارمة:</strong> كل طبقة تكلم <strong>الطبقة الأدنى منها فقط</strong> ولا تقفز للهاردوير مباشرة.",
          "<strong>الميزة vs العيب:</strong> سهولة الـ Debugging والصيانة المستقلة، مقابل صعوبة الترتيب وضعف الكفاءة (<span class='en-pill'>Less efficient</span>)."
        ],
        "examSpot": "سؤال د. شروق صح وغلط #4: كل طبقة تتعامل مباشرة مع الهاردوير ← <strong>False</strong>!",
        "notebookEn": "Slide 2.18 Layered: Layer 0 = Hardware | Layer N = User Interface.\nEach uses ONLY lower layers. Pro: Easy independent debugging | Cons: Hard order, Less efficient.",
        "notebookAr": "نظام الطبقات (0 هاردوير ← N واجهة) سهل في الـ Debugging لكنه أقل كفاءة وصعب الترتيب."
      },
      {
        "id": "s2-19",
        "slideRef": "Slide 2.19",
        "shortLabel": "2.19 Microkernel",
        "title": "4- Microkernel System Structure — النواة المصغرة (Mach)",
        "enPoints": [
          "<strong>Moves as much from the kernel into user space</strong> (Example: <strong>Mach</strong>; Mac OS X kernel <strong>Darwin</strong> partly based on Mach).",
          "Communication between user modules uses <strong>message passing</strong>.",
          "<strong>4 Benefits:</strong> Easier to extend, Easier to port, More reliable, More secure.",
          "<strong>Disadvantage:</strong> <strong>Performance overhead</strong> of user-space to kernel-space communication."
        ],
        "svg": null,
        "why": "تقليل حجم الكود الشغال في Kernel Mode يرفع الأمان والاعتمادية جداً، لكن تكلفته هي بطء الأداء بسبب كثرة الرسائل.",
        "deepPoints": [
          "<strong>المميزات الـ 4:</strong> سهل التوسيع (<span class='en-pill'>Extend</span>)، سهل النقل (<span class='en-pill'>Port</span>)، أكثر اعتمادية (<span class='en-pill'>More reliable</span>)، وأكثر أماناً (<span class='en-pill'>More secure</span>).",
          "<strong>العيب الأساسي:</strong> <strong><span class='en-pill'>Performance overhead</span></strong> بسبب التواصل المستمر بـ <span class='en-pill'>Message passing</span>."
        ],
        "examSpot": "سؤال الميدتيرم Q1.9: التواصل في الـ Microkernel يتم عبر <strong>Message passing</strong>. وسؤال د. شروق #4: عيبه الأساسي هو <strong>Decreased efficiency</strong>.",
        "notebookEn": "Slide 2.19 Microkernel (Mach): Moves services to user space; uses MESSAGE PASSING.\n4 Pros: Extend, Port, Reliable, Secure | Con: Performance overhead.",
        "notebookAr": "الـ Microkernel يتواصل بالرسائل (Message passing)؛ آمن وسهل التوسيع لكنه أبطأ في الأداء."
      },
      {
        "id": "s2-20",
        "slideRef": "Slide 2.20",
        "shortLabel": "2.20 رسمة Microkernel",
        "title": "Microkernel Diagram — رسمة خروج الخدمات لوضع المستخدم",
        "enPoints": [
          "<strong>User Mode:</strong> <code>Application Program</code>, <code>File System</code>, <code>Device Driver</code> communicate via dashed <code>messages</code>.",
          "<strong>Kernel Mode (Microkernel):</strong> Only <strong>IPC</strong>, <strong>memory management</strong>, and <strong>CPU scheduling</strong> remain inside."
        ],
        "svg": "<svg viewBox=\"0 0 700 225\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"630\" y=\"42\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"800\" text-anchor=\"middle\">user mode</text>\n  <rect x=\"30\" y=\"16\" width=\"155\" height=\"46\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"107\" y=\"44\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">Application Program</text>\n\n  <rect x=\"215\" y=\"16\" width=\"155\" height=\"46\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"292\" y=\"44\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">File System</text>\n\n  <rect x=\"400\" y=\"16\" width=\"155\" height=\"46\" rx=\"10\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"477\" y=\"44\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">Device Driver</text>\n\n  <path d=\"M 107 62 L 107 96 L 265 96 L 265 62\" fill=\"none\" stroke=\"#e58a62\" stroke-dasharray=\"5 4\" stroke-width=\"2.2\"/>\n  <path d=\"M 320 62 L 320 96 L 477 96 L 477 62\" fill=\"none\" stroke=\"#e58a62\" stroke-dasharray=\"5 4\" stroke-width=\"2.2\"/>\n  <text x=\"186\" y=\"88\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">messages</text>\n  <text x=\"398\" y=\"88\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">messages</text>\n\n  <rect x=\"30\" y=\"106\" width=\"525\" height=\"66\" rx=\"12\" fill=\"rgba(102,199,166,0.12)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"630\" y=\"142\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"800\" text-anchor=\"middle\">kernel mode</text>\n  <rect x=\"48\" y=\"118\" width=\"146\" height=\"40\" rx=\"20\" fill=\"#0c1017\" stroke=\"#66c7a6\"/>\n  <text x=\"121\" y=\"143\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">IPC</text>\n  <rect x=\"218\" y=\"118\" width=\"148\" height=\"40\" rx=\"20\" fill=\"#0c1017\" stroke=\"#66c7a6\"/>\n  <text x=\"292\" y=\"143\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">memory mgmt</text>\n  <rect x=\"390\" y=\"118\" width=\"148\" height=\"40\" rx=\"20\" fill=\"#0c1017\" stroke=\"#66c7a6\"/>\n  <text x=\"464\" y=\"143\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">CPU scheduling</text>\n\n  <rect x=\"30\" y=\"182\" width=\"525\" height=\"32\" rx=\"8\" fill=\"#1c2533\" stroke=\"#94A3B8\"/>\n  <text x=\"292\" y=\"203\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">hardware</text>\n</svg>",
        "svgCaption": "Slide 2.20 · Microkernel Architecture & Messages",
        "why": "الرسمة بتوريك بعينك إزاي الـ File System والـ Device Driver طلعوا فوق للـ User Mode وبقوا يتكلموا عبر رسائل تمر بالنواة المصغرة.",
        "deepPoints": [
          "<strong>داخل النواة المصغرة فقط (3):</strong> <span class='en-pill'>IPC</span>، <span class='en-pill'>Memory management</span>، و<span class='en-pill'>CPU scheduling</span>.",
          "<strong>خارج النواة (User Mode):</strong> <span class='en-pill'>File System</span> و<span class='en-pill'>Device Driver</span> — فلو تعريف جهاز وقع، النواة مبتقعش!"
        ],
        "examSpot": "تذكر الـ 3 عناصر الباقية داخل الـ Microkernel: <strong>IPC, Memory Management, CPU Scheduling</strong>.",
        "notebookEn": "Slide 2.20: User Mode [App, File System, Device Driver] <--messages--> Microkernel [IPC, Memory Mgmt, CPU Scheduling].",
        "notebookAr": "في الـ Microkernel يخرج نظام الملفات والتعريفات لوضع المستخدم ويتواصلون عبر messages."
      },
      {
        "id": "s2-21",
        "slideRef": "Slide 2.21",
        "shortLabel": "2.21 Modules",
        "title": "5- Modules — الوحدات القابلة للتحميل (Loadable Kernel Modules)",
        "enPoints": [
          "Many modern OSes implement <strong>loadable kernel modules</strong> using an <strong>object-oriented approach</strong>.",
          "Each core component is separate, talks over <strong>known interfaces</strong>, and is <strong>loadable as needed within the kernel</strong>.",
          "Similar to layers but <strong>more flexible</strong> (Examples: <strong>Linux, Solaris</strong>)."
        ],
        "svg": null,
        "why": "أحدث طريقة عملية لبناء النواة: وحدات مستقلة بتتحمل وتُزال ديناميكياً وقت التشغيل داخل النواة حسب الحاجة.",
        "deepPoints": [
          "<strong>المرونة الديناميكية:</strong> الوحدات تُحمّل وتُلغى <strong>أثناء التشغيل (<span class='en-pill'>Dynamically at runtime</span>)</strong> داخل النواة، مما يجعل النواة صغيرة ومرنة."
        ],
        "examSpot": "أسئلة د. شروق (#6 و #11): الـ Loadable kernel modules تُحمّل وتُلغى <strong>ديناميكياً وقت التشغيل</strong>.",
        "notebookEn": "Slide 2.21 Modules (Linux, Solaris): Object-oriented, separate components, dynamically loadable at runtime within kernel.",
        "notebookAr": "الـ Modules (Linux و Solaris) وحدات منفصلة تُحمّل ديناميكياً وقت التشغيل داخل النواة."
      },
      {
        "id": "s2-22",
        "slideRef": "Slide 2.22",
        "shortLabel": "2.22 رسمة Solaris",
        "title": "Modules Advantages & Solaris Kernel Diagram",
        "enPoints": [
          "<strong>2 Advantages:</strong> (1) Kernel is <strong>small and efficient</strong> like a microkernel, (2) Modules easily linked to any other module with <strong>NO message passing</strong>.",
          "<strong>Example:</strong> Solaris (<code>core Solaris kernel</code> linked to 7 surrounding loadable modules)."
        ],
        "svg": "<svg viewBox=\"0 0 700 250\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- Spokes -->\n  <line x1=\"350\" y1=\"125\" x2=\"350\" y2=\"40\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"505\" y2=\"55\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"565\" y2=\"125\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"495\" y2=\"205\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"205\" y2=\"205\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"135\" y2=\"125\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <line x1=\"350\" y1=\"125\" x2=\"195\" y2=\"55\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n\n  <!-- 7 Modules -->\n  <rect x=\"275\" y=\"14\" width=\"150\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"350\" y=\"36\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">scheduling classes</text>\n  <rect x=\"445\" y=\"36\" width=\"130\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"510\" y=\"58\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">file systems</text>\n  <rect x=\"510\" y=\"108\" width=\"165\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"592\" y=\"130\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">loadable system calls</text>\n  <rect x=\"425\" y=\"190\" width=\"160\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"505\" y=\"212\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">executable formats</text>\n  <rect x=\"115\" y=\"190\" width=\"160\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"195\" y=\"212\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">STREAMS modules</text>\n  <rect x=\"25\" y=\"108\" width=\"165\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"107\" y=\"130\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">miscellaneous modules</text>\n  <rect x=\"100\" y=\"36\" width=\"155\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"177\" y=\"58\" fill=\"#F8FAFC\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">device &amp; bus drivers</text>\n\n  <!-- Core -->\n  <circle cx=\"350\" cy=\"125\" r=\"54\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n  <text x=\"350\" y=\"121\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">core Solaris</text>\n  <text x=\"350\" y=\"139\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">kernel</text>\n</svg>",
        "svgCaption": "Slide 2.22 · Solaris Loadable Kernel Modules",
        "why": "السلايد بتشرح ليه الـ Modules اتغلبت على عيب الـ Microkernel: أخدت صِغر النواة وشالت بطء الـ Message Passing!",
        "deepPoints": [
          "<strong>الميزتين الذهبيتين:</strong> نواة صغيرة وكفؤة، وربط مباشر بين أي وحدة وأخرى <strong>بدون Message passing</strong>.",
          "<strong>الـ 7 وحدات حول نواة Solaris:</strong> scheduling classes, file systems, loadable system calls, executable formats, STREAMS modules, miscellaneous modules, device &amp; bus drivers."
        ],
        "examSpot": "أهم فرق بين Modules و Microkernel: في الـ Modules يتم الربط مباشرة <strong>بدون Message Passing</strong>.",
        "notebookEn": "Slide 2.22 Modules (Solaris): Small & efficient kernel + direct linking with NO message passing.",
        "notebookAr": "ميزتا الـ Modules: نواة صغيرة وكفؤة، وربط مباشر بين الوحدات بدون Message passing."
      },
      {
        "id": "s2-23",
        "slideRef": "Slide 2.23",
        "shortLabel": "2.23 Hybrid Systems",
        "title": "6- Hybrid Systems — الأنظمة الهجينة الحديثة",
        "enPoints": [
          "Most modern operating systems are actually <strong>not one pure model</strong>.",
          "<strong>Hybrid</strong> combines multiple approaches to address <strong>performance, security, and usability</strong> needs.",
          "<strong>Examples:</strong> <strong>Mac OS X</strong>, <strong>iOS</strong>, <strong>Android</strong>."
        ],
        "svg": null,
        "why": "الأنظمة الحديثة بتجمع أحسن ما في الهياكل المختلفة عشان تحقق أعلى أداء وأمان وسهولة استخدام معاً.",
        "deepPoints": [
          "<strong>الهدف:</strong> تلبية 3 احتياجات معاً (<span class='en-pill'>Performance, Security, Usability</span>).",
          "<strong>الأمثلة الـ 3:</strong> <span class='en-pill'>Mac OS X</span>، <span class='en-pill'>iOS</span>، و<span class='en-pill'>Android</span>."
        ],
        "examSpot": "أمثلة الـ <strong>Hybrid Systems</strong>: <strong>Mac OS X, iOS, Android</strong>.",
        "notebookEn": "Slide 2.23 Hybrid Systems: Combines multiple models for performance, security, usability (Mac OS X, iOS, Android).",
        "notebookAr": "الأنظمة الهجينة تدمج عدة هياكل للأداء والأمان وسهولة الاستخدام، مثل Mac OS X و iOS و Android."
      }
    ],
    "lab": {
      "title": "⚡ معمل Chapter 2 التفاعلي: مقارنة الهياكل الستة لنظام التشغيل",
      "subtitle": "استعرض الفروق الجوهرية بين كل هيكل في الأداء والأمان والمرونة.",
      "steps": [
        {
          "btn": "1. Simple",
          "heading": "Simple Structure (MS-DOS)",
          "badge": "No Protection",
          "detail": "بسيط وسهل التنفيذ لكنه لا يفصل بين المستخدم والنواة ويسمح بالوصول المباشر للهاردوير.",
          "telemetryLeft": "Protection: None",
          "telemetryRight": "Example: MS-DOS"
        },
        {
          "btn": "2. Monolithic",
          "heading": "Monolithic (UNIX)",
          "badge": "High Speed",
          "detail": "نواة واحدة ضخمة سريعة وتوفر بعض الحماية، لكنها معقدة جداً في الصيانة.",
          "telemetryLeft": "Speed: High",
          "telemetryRight": "Maintainability: Complex"
        },
        {
          "btn": "3. Layered",
          "heading": "Layered Approach",
          "badge": "Easy Debug",
          "detail": "كل طبقة تستخدم الطبقة الأدنى فقط؛ سهلة التصحيح لكنها أقل كفاءة وصعبة الترتيب.",
          "telemetryLeft": "Debug: Independent",
          "telemetryRight": "Efficiency: Lower"
        },
        {
          "btn": "4. Microkernel",
          "heading": "Microkernel (Mach)",
          "badge": "Message Passing",
          "detail": "يخرج الخدمات لوضع المستخدم ويتواصل بالرسائل؛ آمن واعتمادي لكنه يعاني من Performance Overhead.",
          "telemetryLeft": "Security: Very High",
          "telemetryRight": "Comm: Message Passing"
        },
        {
          "btn": "5. Modules",
          "heading": "Loadable Kernel Modules",
          "badge": "No Msg Passing",
          "detail": "وحدات ديناميكية تُحمّل وقت التشغيل داخل النواة بدون Message Passing (Linux & Solaris).",
          "telemetryLeft": "Loading: Dynamic",
          "telemetryRight": "Overhead: Minimal"
        },
        {
          "btn": "6. Hybrid",
          "heading": "Hybrid Systems",
          "badge": "Modern OS",
          "detail": "يدمج عدة هياكل للأداء والأمان وسهولة الاستخدام (Mac OS X, iOS, Android).",
          "telemetryLeft": "Model: Multi-Model",
          "telemetryRight": "Examples: Mac/iOS/Android"
        }
      ]
    },
    "summary": [
      {
        "term": "CLI (Shell) vs GUI",
        "en": "CLI: textual commands (faster for experts). GUI: windows/icons (easier for beginners).",
        "ar": "الـ CLI أسرع للمحترفين والـ GUI أسهل للمبتدئين."
      },
      {
        "term": "System Call vs API",
        "en": "System call requests kernel service; API (Win32, POSIX, Java) is standardized function set.",
        "ar": "الـ API دوال قياسية تستدعي الـ System Calls."
      },
      {
        "term": "Parameter Passing",
        "en": "Registers (limited), Memory Table (Linux/Solaris), Stack (unlimited).",
        "ar": "تمرير المعاملات بالمسجلات أو الجدول أو الـ Stack."
      },
      {
        "term": "Monolithic vs Microkernel",
        "en": "Monolithic: 1 fast kernel, hard to maintain. Microkernel: message passing, secure, overhead.",
        "ar": "المتكتل سريع وصعب الصيانة؛ المصغر آمن وأبطأ."
      },
      {
        "term": "Loadable Kernel Modules",
        "en": "Dynamic runtime modules inside kernel with NO message passing.",
        "ar": "وحدات ديناميكية بدون تمرير رسائل."
      }
    ]
  },
  {
    "lessonId": "22222222-2222-4222-8222-222222222303",
    "courseCode": "CS-311",
    "chapterNum": 3,
    "titleEn": "Processes",
    "titleAr": "العمليات، الجدولة، والتواصل بين العمليات (IPC)",
    "subtitle": "كل سلايد في Chapter 3 منفردة لوحدها (من Slide 3.4 لـ Slide 3.30): السلايد ورسمتها على اليمين، والشرح المفصل على الشمال.",
    "slides": [
      {
        "id": "s3-4",
        "slideRef": "Slide 3.4",
        "shortLabel": "3.4 مفهوم الـ Process",
        "title": "Process Concept — تعريف العملية وأقسامها في الذاكرة",
        "enPoints": [
          "Batch systems → <strong>jobs</strong>; Time-shared systems → <strong>user programs or tasks</strong>.",
          "<strong>Process</strong> — <strong>a program in execution</strong>; progresses in sequential fashion.",
          "<strong>Parts:</strong> <strong>text section</strong> (program code), current activity (<strong>program counter</strong>, CPU registers), <strong>stack</strong> (temporary data: function parameters, return addresses, local variables), <strong>data section</strong> (global variables), <strong>heap</strong> (memory dynamically allocated during run time)."
        ],
        "svg": null,
        "why": "دي السلايد الأساسية اللي بتعرّف يعني إيه Process وإيه الخمس حاجات اللي بتتكوّن منهم جوه الذاكرة.",
        "deepPoints": [
          "<strong><span class='en-pill'>Text section</span>:</strong> كود البرنامج التنفيذي.",
          "<strong><span class='en-pill'>Data section</span>:</strong> المتغيرات العامة (<span class='en-pill'>Global variables</span>).",
          "<strong><span class='en-pill'>Heap</span>:</strong> الذاكرة المحجوزة ديناميكياً وقت التشغيل (<span class='en-pill'>Dynamically allocated during run time</span>).",
          "<strong><span class='en-pill'>Stack</span>:</strong> البيانات المؤقتة (<span class='en-pill'>Function parameters, return addresses, local variables</span>)."
        ],
        "examSpot": "سؤال الميدتيرم Q3 و Q1.6: الـ <strong>Heap</strong> للذاكرة الديناميكية وقت التشغيل، والـ <strong>Text</strong> للكود، والـ <strong>Data</strong> للمتغيرات العامة، والـ <strong>Stack</strong> للبيانات المؤقتة.",
        "notebookEn": "Slide 3.4 Process = program in execution.\n4 Sections: Text (code), Data (globals), Heap (dynamic runtime), Stack (temp: params, return addr, locals).",
        "notebookAr": "العملية هي برنامج قيد التنفيذ مقسم لـ Text و Data و Heap و Stack."
      },
      {
        "id": "s3-5",
        "slideRef": "Slide 3.5",
        "shortLabel": "3.5 رسمة الذاكرة",
        "title": "Process in Memory — رسمة توزيع العملية من 0 إلى max",
        "enPoints": [
          "From address <code>0</code> (bottom) to <code>max</code> (top): <code>text</code> → <code>data</code> → <code>heap ↑</code> → free space → <code>↓ stack</code>."
        ],
        "svg": "<svg viewBox=\"0 0 700 245\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"195\" y=\"36\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"end\">max</text>\n  <text x=\"195\" y=\"218\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"end\">0</text>\n\n  <rect x=\"210\" y=\"16\" width=\"230\" height=\"40\" rx=\"8\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"325\" y=\"41\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">stack  ↓</text>\n  <text x=\"460\" y=\"40\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\">temporary data (local vars)</text>\n\n  <rect x=\"210\" y=\"60\" width=\"230\" height=\"46\" rx=\"6\" fill=\"#0c1017\" stroke=\"#475569\" stroke-dasharray=\"5 4\"/>\n  <text x=\"325\" y=\"88\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">↓  free memory  ↑</text>\n\n  <rect x=\"210\" y=\"110\" width=\"230\" height=\"36\" rx=\"8\" fill=\"rgba(102,199,166,0.18)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"325\" y=\"133\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">heap  ↑</text>\n  <text x=\"460\" y=\"132\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\">dynamic runtime memory</text>\n\n  <rect x=\"210\" y=\"150\" width=\"230\" height=\"34\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.5\"/>\n  <text x=\"325\" y=\"172\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">data</text>\n  <text x=\"460\" y=\"171\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\">global variables</text>\n\n  <rect x=\"210\" y=\"188\" width=\"230\" height=\"34\" rx=\"8\" fill=\"#1c2533\" stroke=\"#94A3B8\" stroke-width=\"1.5\"/>\n  <text x=\"325\" y=\"210\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">text</text>\n  <text x=\"460\" y=\"209\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\">program code</text>\n</svg>",
        "svgCaption": "Slide 3.5 · Process in Memory (0 to max)",
        "why": "عشان الـ Stack والـ Heap حجمهم بيتغير أثناء التشغيل، بنحطهم في وش بعض وبينهم مساحة فاضية عشان يستغلوا الذاكرة بأفضل كفاءة.",
        "deepPoints": [
          "<strong>من أسفل (0):</strong> <span class='code-pill'>text</span> ثم <span class='code-pill'>data</span> ثم <span class='code-pill'>heap ↑</span> (ينمو لأعلى).",
          "<strong>من أعلى (max):</strong> <span class='code-pill'>stack ↓</span> (ينمو لأسفل) وبينهم مساحة حرة مشتركة."
        ],
        "examSpot": "تذكر اتجاه النمو: الـ <strong>Heap ينمو لأعلى ↑</strong> والـ <strong>Stack ينمو لأسفل ↓</strong>.",
        "notebookEn": "Slide 3.5 Memory Layout: [0: text] -> [data] -> [heap ↑] ... free ... [↓ stack :max].",
        "notebookAr": "الـ Heap ينمو لأعلى والـ Stack ينمو لأسفل وبينهما المساحة الحرة."
      },
      {
        "id": "s3-6",
        "slideRef": "Slide 3.6",
        "shortLabel": "3.6 Program vs Process",
        "title": "Process Concept (Cont.) — الفرق بين Program و Process",
        "enPoints": [
          "<strong>Program is a <em>passive</em> entity</strong> stored on disk (executable file); <strong>process is <em>active</em></strong>.",
          "Program becomes process when <strong>executable file is loaded into memory</strong>.",
          "<strong>One program can be several processes</strong> (e.g., multiple users executing the same program)."
        ],
        "svg": null,
        "why": "الفرق بين الملف الساكن على الهارد والنسخة الحية الشغالة منه في الرام.",
        "deepPoints": [
          "<strong><span class='en-pill'>Program</span>:</strong> كيان <strong>سلبي (<span class='en-pill'>Passive</span>)</strong> مخزن على القرص.",
          "<strong><span class='en-pill'>Process</span>:</strong> كيان <strong>نشط (<span class='en-pill'>Active</span>)</strong> يعمل في الذاكرة، والبرنامج الواحد يمكن تشغيله كعدة عمليات مستقلة."
        ],
        "examSpot": "سؤال الميدتيرم Q2 وصح وغلط د. شروق #20: الـ <strong>Program</strong> هو الـ Passive entity على الهارد، والـ <strong>Process</strong> هي الـ Active entity في الرام.",
        "notebookEn": "Slide 3.6: Program = PASSIVE entity on disk | Process = ACTIVE entity in memory.",
        "notebookAr": "البرنامج كيان سلبي على الهارد، والعملية كيان نشط يعمل في الرام."
      },
      {
        "id": "s3-7",
        "slideRef": "Slide 3.7",
        "shortLabel": "3.7 الحالات الـ 5",
        "title": "Process State — الحالات الخمس ومخطط الانتقال",
        "enPoints": [
          "<strong>new:</strong> being created | <strong>ready:</strong> waiting to be assigned to a processor (CPU).",
          "<strong>running:</strong> instructions are being executed | <strong>waiting:</strong> waiting for an event (I/O).",
          "<strong>terminated:</strong> finished execution."
        ],
        "svg": "<svg viewBox=\"0 0 700 225\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m37\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#94A3B8\"/>\n    </marker>\n  </defs>\n  <rect x=\"20\" y=\"24\" width=\"106\" height=\"40\" rx=\"20\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"73\" y=\"49\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">new</text>\n\n  <rect x=\"180\" y=\"88\" width=\"120\" height=\"42\" rx=\"21\" fill=\"rgba(102,199,166,0.18)\" stroke=\"#66c7a6\" stroke-width=\"1.8\"/>\n  <text x=\"240\" y=\"114\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">ready</text>\n\n  <rect x=\"395\" y=\"88\" width=\"126\" height=\"42\" rx=\"21\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"458\" y=\"114\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">running</text>\n\n  <rect x=\"288\" y=\"168\" width=\"124\" height=\"40\" rx=\"20\" fill=\"#141b25\" stroke=\"#A78BFA\" stroke-width=\"1.6\"/>\n  <text x=\"350\" y=\"193\" fill=\"#C4B5FD\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">waiting</text>\n\n  <rect x=\"562\" y=\"24\" width=\"118\" height=\"40\" rx=\"20\" fill=\"#1c2533\" stroke=\"#F87171\" stroke-width=\"1.6\"/>\n  <text x=\"621\" y=\"49\" fill=\"#FCA5A5\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"800\" text-anchor=\"middle\">terminated</text>\n\n  <path d=\"M 126 44 Q 168 48 195 86\" fill=\"none\" stroke=\"#94A3B8\" stroke-width=\"1.8\" marker-end=\"url(#m37)\"/>\n  <text x=\"172\" y=\"54\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\">admitted</text>\n\n  <path d=\"M 300 116 Q 348 130 393 116\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m37)\"/>\n  <text x=\"348\" y=\"142\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">scheduler dispatch</text>\n\n  <path d=\"M 395 96 Q 348 60 302 96\" fill=\"none\" stroke=\"#f0a786\" stroke-width=\"1.8\" marker-end=\"url(#m37)\"/>\n  <text x=\"348\" y=\"70\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">interrupt</text>\n\n  <path d=\"M 458 130 Q 458 178 416 186\" fill=\"none\" stroke=\"#A78BFA\" stroke-width=\"1.8\" marker-end=\"url(#m37)\"/>\n  <text x=\"502\" y=\"172\" fill=\"#C4B5FD\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\">I/O or event wait</text>\n\n  <path d=\"M 288 186 Q 240 178 240 134\" fill=\"none\" stroke=\"#A78BFA\" stroke-width=\"1.8\" marker-end=\"url(#m37)\"/>\n  <text x=\"166\" y=\"174\" fill=\"#C4B5FD\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\">I/O completion</text>\n\n  <path d=\"M 498 88 Q 528 50 558 45\" fill=\"none\" stroke=\"#F87171\" stroke-width=\"1.8\" marker-end=\"url(#m37)\"/>\n  <text x=\"524\" y=\"56\" fill=\"#FCA5A5\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\">exit</text>\n</svg>",
        "svgCaption": "Slide 3.7 · Process State Transition Diagram",
        "why": "يتابع نظام التشغيل كل عملية عبر 5 حالات واضحة لتنظيم دورها على المعالج وأجهزة الـ I/O.",
        "deepPoints": [
          "<strong>الانتقالات الستة:</strong> <code>new → ready (admitted)</code>، <code>ready → running (scheduler dispatch)</code>، <code>running → ready (interrupt)</code>، <code>running → waiting (I/O wait)</code>، <code>waiting → ready (I/O completion)</code>، و<code>running → terminated (exit)</code>.",
          "<strong>تنبيه مهم:</strong> عند انتهاء الـ I/O تنتقل العملية من <code>waiting</code> إلى <strong><code>ready</code></strong> (وليس <code>running</code> مباشرة!)."
        ],
        "examSpot": "سؤال الميدتيرم Q4 و Q1.1 و Q1.3: حالة <strong>Ready</strong> تنتظر الـ <strong>CPU</strong>، وحالة <strong>Waiting</strong> تنتظر الـ <strong>I/O</strong>.",
        "notebookEn": "Slide 3.7 (5 States): new -> ready (waits CPU) <-> running -> terminated; running -> waiting (waits I/O) -> ready.",
        "notebookAr": "الحالات الخمس: New, Ready (تنتظر CPU), Running, Waiting (تنتظر I/O), Terminated."
      },
      {
        "id": "s3-8",
        "slideRef": "Slide 3.8",
        "shortLabel": "3.8 الـ PCB",
        "title": "Process Control Block (PCB / Task Control Block)",
        "enPoints": [
          "Information associated with each process: (1) <strong>Process state</strong> &amp; number (PID), (2) <strong>Program counter</strong>, (3) <strong>CPU registers</strong>, (4) <strong>CPU scheduling info</strong>, (5) <strong>Memory-management info</strong>, (6) <strong>Accounting info</strong>, (7) <strong>I/O status info</strong> (open files)."
        ],
        "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect x=\"210\" y=\"12\" width=\"280\" height=\"32\" rx=\"6\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\"/>\n  <text x=\"350\" y=\"33\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">process state</text>\n  <rect x=\"210\" y=\"46\" width=\"280\" height=\"30\" rx=\"4\" fill=\"#141b25\" stroke=\"#7ca7f0\"/>\n  <text x=\"350\" y=\"66\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" text-anchor=\"middle\">process number (PID)</text>\n  <rect x=\"210\" y=\"78\" width=\"280\" height=\"30\" rx=\"4\" fill=\"#141b25\" stroke=\"#66c7a6\"/>\n  <text x=\"350\" y=\"98\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" font-weight=\"700\" text-anchor=\"middle\">program counter</text>\n  <rect x=\"210\" y=\"110\" width=\"280\" height=\"44\" rx=\"4\" fill=\"#152238\" stroke=\"#7ca7f0\"/>\n  <text x=\"350\" y=\"137\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"700\" text-anchor=\"middle\">CPU registers</text>\n  <rect x=\"210\" y=\"156\" width=\"280\" height=\"30\" rx=\"4\" fill=\"#141b25\" stroke=\"#94A3B8\"/>\n  <text x=\"350\" y=\"176\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" text-anchor=\"middle\">memory limits</text>\n  <rect x=\"210\" y=\"188\" width=\"280\" height=\"34\" rx=\"6\" fill=\"#141b25\" stroke=\"#94A3B8\"/>\n  <text x=\"350\" y=\"210\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12.5\" text-anchor=\"middle\">list of open files  ·  accounting</text>\n</svg>",
        "svgCaption": "Slide 3.8 · Process Control Block (PCB) Structure",
        "why": "الـ PCB هو ملف الهوية الكامل اللي بيحفظ كل بيانات العملية عشان نعرف نوقفها ونرجع نكملها من غير ما تفقد أي معلومة.",
        "deepPoints": [
          "<strong>البيانات الـ 7 داخل الـ <span class='en-pill'>PCB</span>:</strong> الحالة والـ PID، عداد البرنامج (<span class='en-pill'>Program counter</span>)، مسجلات المعالج (<span class='en-pill'>CPU registers</span>)، معلومات الجدولة، حدود الذاكرة، المحاسبة، وقائمة الملفات المفتوحة."
        ],
        "examSpot": "سؤال الميدتيرم Q1.2 وشيت د. شروق #22: يحتوي الـ PCB على <strong>Process state, program counter, and CPU registers</strong>.",
        "notebookEn": "Slide 3.8 PCB (Task Control Block): state, PID, program counter, CPU registers, scheduling, memory limits, accounting, open files.",
        "notebookAr": "الـ PCB يحفظ الحالة، الـ PID، الـ Program Counter، المسجلات، حدود الذاكرة، والملفات المفتوحة."
      },
      {
        "id": "s3-9",
        "slideRef": "Slide 3.9",
        "shortLabel": "3.9 Context Switch",
        "title": "CPU Switch From Process to Process — رسمة الـ Context Switch",
        "enPoints": [
          "When an <strong>interrupt or system call</strong> occurs while P₀ executes: OS executes <strong><code>save state into PCB₀</code></strong> → <strong><code>reload state from PCB₁</code></strong> → P₁ executes."
        ],
        "svg": "<svg viewBox=\"0 0 700 250\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m39\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n  </defs>\n  <rect x=\"40\" y=\"12\" width=\"140\" height=\"30\" rx=\"8\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"110\" y=\"32\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">Process P₀</text>\n  <rect x=\"255\" y=\"12\" width=\"190\" height=\"30\" rx=\"8\" fill=\"rgba(194,94,51,0.2)\" stroke=\"#e58a62\"/><text x=\"350\" y=\"32\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">Operating System</text>\n  <rect x=\"520\" y=\"12\" width=\"140\" height=\"30\" rx=\"8\" fill=\"#141b25\" stroke=\"#66c7a6\"/><text x=\"590\" y=\"32\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">Process P₁</text>\n\n  <!-- P0 executes -->\n  <line x1=\"110\" y1=\"44\" x2=\"110\" y2=\"74\" stroke=\"#7ca7f0\" stroke-width=\"5\"/>\n  <text x=\"66\" y=\"64\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\">executing</text>\n  <line x1=\"110\" y1=\"74\" x2=\"110\" y2=\"215\" stroke=\"#475569\" stroke-dasharray=\"4 4\" stroke-width=\"2\"/>\n  <text x=\"78\" y=\"150\" fill=\"#64748B\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\">idle</text>\n  <line x1=\"110\" y1=\"215\" x2=\"110\" y2=\"242\" stroke=\"#7ca7f0\" stroke-width=\"5\"/>\n\n  <!-- OS boxes -->\n  <rect x=\"265\" y=\"68\" width=\"170\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#e58a62\"/><text x=\"350\" y=\"87\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">save state into PCB₀</text>\n  <rect x=\"265\" y=\"104\" width=\"170\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#66c7a6\"/><text x=\"350\" y=\"123\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">reload state from PCB₁</text>\n\n  <rect x=\"265\" y=\"160\" width=\"170\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#e58a62\"/><text x=\"350\" y=\"179\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">save state into PCB₁</text>\n  <rect x=\"265\" y=\"196\" width=\"170\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#7ca7f0\"/><text x=\"350\" y=\"215\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">reload state from PCB₀</text>\n\n  <!-- P1 executes -->\n  <line x1=\"590\" y1=\"44\" x2=\"590\" y2=\"122\" stroke=\"#475569\" stroke-dasharray=\"4 4\" stroke-width=\"2\"/>\n  <line x1=\"590\" y1=\"122\" x2=\"590\" y2=\"168\" stroke=\"#66c7a6\" stroke-width=\"5\"/>\n  <text x=\"632\" y=\"150\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\">executing</text>\n  <line x1=\"590\" y1=\"168\" x2=\"590\" y2=\"242\" stroke=\"#475569\" stroke-dasharray=\"4 4\" stroke-width=\"2\"/>\n\n  <!-- Connectors -->\n  <line x1=\"114\" y1=\"74\" x2=\"262\" y2=\"82\" stroke=\"#e58a62\" stroke-width=\"1.8\" marker-end=\"url(#m39)\"/>\n  <line x1=\"435\" y1=\"118\" x2=\"585\" y2=\"122\" stroke=\"#66c7a6\" stroke-width=\"1.8\" marker-end=\"url(#m39)\"/>\n  <line x1=\"585\" y1=\"168\" x2=\"438\" y2=\"174\" stroke=\"#e58a62\" stroke-width=\"1.8\" marker-end=\"url(#m39)\"/>\n  <line x1=\"265\" y1=\"210\" x2=\"115\" y2=\"215\" stroke=\"#7ca7f0\" stroke-width=\"1.8\" marker-end=\"url(#m39)\"/>\n</svg>",
        "svgCaption": "Slide 3.9 · Context Switch (P₀ ↔ P₁)",
        "why": "الرسمة توضح خطوات انتقال المعالج فعلياً من عملية P₀ إلى P₁ باستخدام الـ PCB بتاع كل واحدة.",
        "deepPoints": [
          "<strong>خطوتا التبديل:</strong> (1) حفظ حالة العملية القديمة في <span class='code-pill'>PCB0</span>، ثم (2) تحميل حالة العملية الجديدة من <span class='code-pill'>PCB1</span>."
        ],
        "examSpot": "سؤال الميدتيرم Q1.5: انتقال المعالج من عملية لأخرى يسمى <strong>Context switch</strong>.",
        "notebookEn": "Slide 3.9 Context Switch: save state into PCB0 -> reload state from PCB1.",
        "notebookAr": "عند تبديل المعالج يحدث Context Switch: حفظ حالة P0 في PCB0 وتحميل حالة P1 من PCB1."
      },
      {
        "id": "s3-13",
        "slideRef": "Slide 3.13",
        "shortLabel": "3.13 طوابير الجدولة",
        "title": "Process Scheduling — الطوابير الثلاثة للجدولة",
        "enPoints": [
          "<strong>Process scheduler</strong> selects among available processes for next execution on CPU.",
          "<strong>3 Scheduling Queues:</strong>",
          "• <strong>Job queue:</strong> set of <strong>all processes in the system</strong>.",
          "• <strong>Ready queue:</strong> set of all processes <strong>residing in main memory, ready and waiting to execute</strong>.",
          "• <strong>Device queues:</strong> set of processes <strong>waiting for an I/O device</strong>."
        ],
        "svg": null,
        "why": "عشان العمليات الجاهزة والمنتظرة متختلطش ببعض، الـ OS بيرتبهم في 3 طوابير منظمة تهاجر العمليات بينهم.",
        "deepPoints": [
          "<strong><span class='en-pill'>Job queue</span>:</strong> كل العمليات في النظام.",
          "<strong><span class='en-pill'>Ready queue</span>:</strong> العمليات الموجودة في الرام وجاهزة للتنفيذ على الـ CPU.",
          "<strong><span class='en-pill'>Device queues</span>:</strong> العمليات المنتظرة لأجهزة الإدخال والإخراج."
        ],
        "examSpot": "سؤال شيت د. شروق المقالي #25: اذكر طوابير الجدولة الثلاثة (<strong>Job queue, Ready queue, Device queues</strong>).",
        "notebookEn": "Slide 3.13 (3 Queues): Job queue (all), Ready queue (in RAM ready for CPU), Device queues (waiting for I/O).",
        "notebookAr": "الطوابير الثلاثة: Job queue، Ready queue، و Device queues."
      },
      {
        "id": "s3-14",
        "slideRef": "Slide 3.14",
        "shortLabel": "3.14 مخطط الطوابير",
        "title": "Representation of Process Scheduling — مخطط الطوابير (Queueing Diagram)",
        "enPoints": [
          "<strong>Queueing diagram</strong> represents queues, resources, and flows.",
          "From <code>CPU</code>, a process either exits OR returns to <code>ready queue</code> via 4 paths: <strong>I/O request</strong>, <strong>time slice expired</strong>, <strong>fork a child</strong>, or <strong>wait for an interrupt</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 700 245\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m314\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#66c7a6\"/>\n    </marker>\n  </defs>\n  <rect x=\"135\" y=\"16\" width=\"160\" height=\"36\" rx=\"8\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"215\" y=\"39\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">ready queue</text>\n\n  <circle cx=\"545\" cy=\"34\" r=\"26\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"545\" y=\"39\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">CPU</text>\n\n  <line x1=\"45\" y1=\"34\" x2=\"132\" y2=\"34\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m314)\"/>\n  <line x1=\"295\" y1=\"34\" x2=\"516\" y2=\"34\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m314)\"/>\n  <line x1=\"571\" y1=\"34\" x2=\"665\" y2=\"34\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m314)\"/>\n  <text x=\"635\" y=\"25\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\">exit</text>\n\n  <!-- 4 return paths -->\n  <line x1=\"545\" y1=\"60\" x2=\"545\" y2=\"216\" stroke=\"#94A3B8\" stroke-width=\"1.8\"/>\n  <line x1=\"75\" y1=\"42\" x2=\"75\" y2=\"216\" stroke=\"#94A3B8\" stroke-width=\"1.8\"/>\n  <line x1=\"75\" y1=\"42\" x2=\"132\" y2=\"42\" stroke=\"#66c7a6\" stroke-width=\"1.8\" marker-end=\"url(#m314)\"/>\n\n  <!-- Path 1: I/O -->\n  <rect x=\"340\" y=\"72\" width=\"145\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#7ca7f0\"/><text x=\"412\" y=\"91\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">I/O request → queue</text>\n  <circle cx=\"215\" cy=\"86\" r=\"18\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"215\" y=\"90\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\">I/O</text>\n  <line x1=\"545\" y1=\"86\" x2=\"488\" y2=\"86\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <line x1=\"340\" y1=\"86\" x2=\"235\" y2=\"86\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <line x1=\"197\" y1=\"86\" x2=\"75\" y2=\"86\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n\n  <!-- Path 2: Time slice -->\n  <rect x=\"295\" y=\"114\" width=\"190\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#e58a62\"/><text x=\"390\" y=\"133\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">time slice expired</text>\n  <line x1=\"545\" y1=\"128\" x2=\"485\" y2=\"128\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <line x1=\"295\" y1=\"128\" x2=\"75\" y2=\"128\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n\n  <!-- Path 3: fork -->\n  <rect x=\"295\" y=\"156\" width=\"190\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#66c7a6\"/><text x=\"390\" y=\"175\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">fork a child → child runs</text>\n  <line x1=\"545\" y1=\"170\" x2=\"485\" y2=\"170\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <line x1=\"295\" y1=\"170\" x2=\"75\" y2=\"170\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n\n  <!-- Path 4: interrupt -->\n  <rect x=\"295\" y=\"198\" width=\"190\" height=\"28\" rx=\"6\" fill=\"#152238\" stroke=\"#A78BFA\"/><text x=\"390\" y=\"217\" fill=\"#C4B5FD\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">wait for an interrupt</text>\n  <line x1=\"545\" y1=\"212\" x2=\"485\" y2=\"212\" stroke=\"#A78BFA\" stroke-width=\"1.6\"/>\n  <line x1=\"295\" y1=\"212\" x2=\"75\" y2=\"212\" stroke=\"#A78BFA\" stroke-width=\"1.6\"/>\n</svg>",
        "svgCaption": "Slide 3.14 · Queueing Diagram (4 Return Paths)",
        "why": "الرسمة دي بتلخص كل السكك اللي ممكن تمشيها العملية بعد ما تدخل الـ CPU وترجع تاني للـ Ready Queue.",
        "deepPoints": [
          "<strong>المسارات الأربعة للعودة للـ Ready queue:</strong> طلب I/O، أو انتهاء الشريحة الزمنية (<span class='en-pill'>Time slice expired</span>)، أو إنشاء ابن بـ <span class='code-pill'>fork</span>، أو انتظار مقاطعة (<span class='en-pill'>Wait for an interrupt</span>)."
        ],
        "examSpot": "المستطيلات تمثل الطوابير (Queues) والدوائر تمثل الموارد (CPU / I/O).",
        "notebookEn": "Slide 3.14 Queueing Diagram: ready queue -> CPU -> exits OR returns via (I/O request, time slice expired, fork child, wait for interrupt).",
        "notebookAr": "مخطط الطوابير يوضح 4 مسارات لعودة العملية من الـ CPU إلى الـ Ready queue."
      },
      {
        "id": "s3-15",
        "slideRef": "Slide 3.15",
        "shortLabel": "3.15 المجدولات الثلاثة",
        "title": "Schedulers — Short-Term, Long-Term, & Medium-Term (Swapping)",
        "enPoints": [
          "<strong>Short-term (CPU) scheduler:</strong> selects from ready queue &amp; allocates CPU; invoked <strong>frequently (ms) → must be fast</strong>.",
          "<strong>Long-term (Job) scheduler:</strong> brings jobs into ready queue; invoked <strong>infrequently (sec/min)</strong>; <strong>controls the degree of multiprogramming</strong>.",
          "<strong>Medium-term scheduler:</strong> decreases degree of multiprogramming via <strong>swapping</strong> (swap out to disk / swap in to RAM)."
        ],
        "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m315\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#e58a62\"/>\n    </marker>\n  </defs>\n  <!-- Top: Swapped out -->\n  <rect x=\"200\" y=\"14\" width=\"280\" height=\"42\" rx=\"10\" fill=\"rgba(194,94,51,0.18)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"340\" y=\"33\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">partially executed</text>\n  <text x=\"340\" y=\"49\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">swapped-out processes (Disk)</text>\n\n  <!-- Swap in / Swap out arrows -->\n  <path d=\"M 200 35 L 95 35 L 95 104 L 195 104\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m315)\"/>\n  <text x=\"145\" y=\"26\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">swap in</text>\n\n  <path d=\"M 555 104 L 615 104 L 615 35 L 484 35\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"2\" marker-end=\"url(#m315)\"/>\n  <text x=\"555\" y=\"26\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">swap out</text>\n\n  <!-- Ready -> CPU -->\n  <rect x=\"200\" y=\"88\" width=\"160\" height=\"36\" rx=\"8\" fill=\"#141b25\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"280\" y=\"111\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">ready queue</text>\n\n  <line x1=\"360\" y1=\"106\" x2=\"495\" y2=\"106\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m315)\"/>\n\n  <circle cx=\"525\" cy=\"106\" r=\"24\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"525\" y=\"111\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">CPU</text>\n\n  <!-- I/O bottom -->\n  <rect x=\"330\" y=\"152\" width=\"170\" height=\"32\" rx=\"8\" fill=\"#152238\" stroke=\"#7ca7f0\"/>\n  <text x=\"415\" y=\"173\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" text-anchor=\"middle\">I/O waiting queues</text>\n  <path d=\"M 525 130 L 525 168 L 502 168\" fill=\"none\" stroke=\"#7ca7f0\" stroke-width=\"1.8\"/>\n  <path d=\"M 330 168 L 150 168 L 150 116 L 195 116\" fill=\"none\" stroke=\"#7ca7f0\" stroke-width=\"1.8\" marker-end=\"url(#m315)\"/>\n</svg>",
        "svgCaption": "Slide 3.15 · Medium-Term Scheduler & Swapping",
        "why": "توزيع مهام الجدولة على 3 مجدولات بسرعات مختلفة بيوازن بين سرعة توزيع المعالج وبين عدم امتلاء الرام.",
        "deepPoints": [
          "<strong><span class='en-pill'>Short-term</span>:</strong> يوزع الـ CPU كل ملي ثانية (لازم سريع جداً).",
          "<strong><span class='en-pill'>Long-term</span>:</strong> يجلب المهام من الـ Job pool ويتحكم في <strong><span class='en-pill'>Degree of multiprogramming</span></strong>.",
          "<strong><span class='en-pill'>Medium-term</span>:</strong> ينفذ <strong><span class='en-pill'>Swapping</span></strong> (إخراج مؤقت للهارد ثم إرجاع للرام)."
        ],
        "examSpot": "سؤال الميدتيرم Q5 وشيت د. شروق (#7, #11, #12, #17, #23, #24): <strong>Short-term</strong> يوزع الـ CPU، و<strong>Long-term</strong> يتحكم في الـ Degree of multiprogramming.",
        "notebookEn": "Slide 3.15 Schedulers:\n1) Short-term (CPU): ms, fast, allocates CPU.\n2) Long-term (Job): sec/min, controls degree of multiprogramming.\n3) Medium-term: Swapping (swap out / swap in).",
        "notebookAr": "الـ Short-term يوزع المعالج، والـ Long-term يتحكم في عدد العمليات بالرام، والـ Medium-term ينفذ Swapping."
      },
      {
        "id": "s3-16",
        "slideRef": "Slide 3.16",
        "shortLabel": "3.16 I/O vs CPU-bound",
        "title": "I/O-Bound Process vs. CPU-Bound Process",
        "enPoints": [
          "<strong>I/O-bound process:</strong> spends <strong>more time doing I/O</strong> than computations; <strong>many short CPU bursts</strong>.",
          "<strong>CPU-bound process:</strong> spends <strong>more time doing computations</strong>; <strong>few very long CPU bursts</strong>."
        ],
        "svg": null,
        "why": "تصنيف العمليات حسب طبيعة استهلاكها يساعد الـ Long-term scheduler على اختيار خليط متوازن يبقي الـ CPU وأجهزة الـ I/O مشغولين معاً.",
        "deepPoints": [
          "<strong><span class='en-pill'>I/O-bound</span>:</strong> وقت أكثر في الإدخال/الإخراج ← <span class='en-pill'>many short CPU bursts</span>.",
          "<strong><span class='en-pill'>CPU-bound</span>:</strong> وقت أكثر في الحسابات ← <span class='en-pill'>few very long CPU bursts</span>."
        ],
        "examSpot": "سؤال الميدتيرم Q1.4: العملية التي تقضي وقتاً أطول في الإدخال والإخراج تسمى <strong>I/O-bound process</strong>.",
        "notebookEn": "Slide 3.16: I/O-bound (more I/O, many short CPU bursts) vs CPU-bound (more computation, few long CPU bursts).",
        "notebookAr": "I/O-bound تقضي وقتها في I/O بفترات معالج قصيرة، و CPU-bound تقضي وقتها في الحسابات بفترات طويلة."
      },
      {
        "id": "s3-18",
        "slideRef": "Slide 3.18",
        "shortLabel": "3.18 Operations Intro",
        "title": "Operations on Processes — آليات إنشاء وإنهاء العمليات",
        "enPoints": [
          "System must provide mechanisms for: <strong>process creation</strong> and <strong>process termination</strong>."
        ],
        "svg": null,
        "why": "تمهيد لقسم العمليات الديناميكية: كيف تولد العملية في النظام وكيف تنتهي بأمان.",
        "deepPoints": [
          "لازم الـ OS يوفر System Calls واضحة لإنشاء العمليات (<span class='code-pill'>fork/exec</span>) وإنهائها (<span class='code-pill'>exit/abort/wait</span>)."
        ],
        "examSpot": "العمليتان الأساسيتان على الـ Processes: <strong>Process Creation</strong> و <strong>Process Termination</strong>.",
        "notebookEn": "Slide 3.18: OS provides mechanisms for Process Creation and Process Termination.",
        "notebookAr": "الآليتان الأساسيتان على العمليات هما الإنشاء (Creation) والإنهاء (Termination)."
      },
      {
        "id": "s3-19",
        "slideRef": "Slide 3.19",
        "shortLabel": "3.19 شجرة العمليات",
        "title": "Process Creation — شجرة العمليات، الـ PID، وخيارات التنفيذ والموارد",
        "enPoints": [
          "<strong>Parent</strong> creates <strong>children</strong> forming a <strong>tree of processes</strong>; managed via unique <strong>PID</strong>.",
          "<strong>3 Resource Sharing Options:</strong> share all, share subset, or share none.",
          "<strong>2 Execution Options:</strong> execute <strong>concurrently</strong> OR parent <strong>waits</strong> until children terminate."
        ],
        "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- Root -->\n  <circle cx=\"350\" cy=\"30\" r=\"24\" fill=\"rgba(194,94,51,0.24)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"350\" y=\"27\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" font-weight=\"800\" text-anchor=\"middle\">init</text>\n  <text x=\"350\" y=\"40\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"9.5\" text-anchor=\"middle\">pid=1</text>\n\n  <!-- Level 2 -->\n  <line x1=\"330\" y1=\"45\" x2=\"150\" y2=\"85\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <line x1=\"350\" y1=\"54\" x2=\"350\" y2=\"78\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n  <line x1=\"370\" y1=\"45\" x2=\"550\" y2=\"85\" stroke=\"#94A3B8\" stroke-width=\"1.6\"/>\n\n  <rect x=\"95\" y=\"82\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"150\" y=\"103\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">login (8415)</text>\n  <rect x=\"290\" y=\"82\" width=\"120\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"350\" y=\"103\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">kthreadd (2)</text>\n  <rect x=\"495\" y=\"82\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"550\" y=\"103\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11\" text-anchor=\"middle\">sshd (3028)</text>\n\n  <!-- Level 3 -->\n  <line x1=\"150\" y1=\"116\" x2=\"150\" y2=\"142\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <line x1=\"330\" y1=\"116\" x2=\"295\" y2=\"142\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <line x1=\"370\" y1=\"116\" x2=\"405\" y2=\"142\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <line x1=\"550\" y1=\"116\" x2=\"550\" y2=\"142\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n\n  <rect x=\"95\" y=\"142\" width=\"110\" height=\"30\" rx=\"15\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\"/><text x=\"150\" y=\"161\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" font-weight=\"700\" text-anchor=\"middle\">bash (8416)</text>\n  <rect x=\"238\" y=\"142\" width=\"102\" height=\"30\" rx=\"15\" fill=\"#152238\" stroke=\"#64748B\"/><text x=\"289\" y=\"161\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">khelper (6)</text>\n  <rect x=\"358\" y=\"142\" width=\"108\" height=\"30\" rx=\"15\" fill=\"#152238\" stroke=\"#64748B\"/><text x=\"412\" y=\"161\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">pdflush (200)</text>\n  <rect x=\"495\" y=\"142\" width=\"110\" height=\"30\" rx=\"15\" fill=\"#152238\" stroke=\"#64748B\"/><text x=\"550\" y=\"161\" fill=\"#CBD5E1\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">sshd (3610)</text>\n\n  <!-- Level 4 under bash -->\n  <line x1=\"130\" y1=\"172\" x2=\"88\" y2=\"190\" stroke=\"#94A3B8\" stroke-width=\"1.4\"/>\n  <line x1=\"170\" y1=\"172\" x2=\"212\" y2=\"190\" stroke=\"#94A3B8\" stroke-width=\"1.4\"/>\n  <text x=\"88\" y=\"206\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">ps (9298)</text>\n  <text x=\"212\" y=\"206\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"10.5\" text-anchor=\"middle\">emacs (9204)</text>\n</svg>",
        "svgCaption": "Slide 3.19 · A Tree of Processes in Linux (init pid=1)",
        "why": "كل عملية في النظام بتتولد من عملية أب فوقها، مكونة شجرة تبدأ في لينكس من عملية <code>init (pid = 1)</code>.",
        "deepPoints": [
          "<strong>خيارات التنفيذ (2):</strong> إما يعمل الأب والابن معاً بالتوازي (<span class='en-pill'>Concurrently</span>)، أو ينتظر الأب انتهاء الابن.",
          "<strong>خيارات الموارد (3):</strong> مشاركة الكل، أو جزء (<span class='en-pill'>Subset</span>)، أو عدم المشاركة."
        ],
        "examSpot": "سؤال شيت د. شروق صح وغلط #19: لا يشترط أن ينتظر الأب انتهاء الابن، يمكنهما العمل <strong>Concurrently</strong>!",
        "notebookEn": "Slide 3.19: Tree of processes (unique PID); Resources (all/subset/none); Execution (concurrent OR parent waits).",
        "notebookAr": "كل عملية لها PID فريد، ويمكن للأب والابن العمل بالتوازي أو انتظار الأب."
      },
      {
        "id": "s3-20",
        "slideRef": "Slide 3.20",
        "shortLabel": "3.20 fork() & exec()",
        "title": "Process Creation (Cont.) — دوال UNIX (fork و exec)",
        "enPoints": [
          "<strong>Address space:</strong> child duplicate of parent OR child has a new program loaded into it.",
          "<strong><code>fork()</code>:</strong> creates a new process (duplicate of parent).",
          "<strong><code>exec()</code>:</strong> used after <code>fork()</code> to replace the process's memory space with a new program."
        ],
        "svg": "<svg viewBox=\"0 0 700 175\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <marker id=\"m320\" viewBox=\"0 0 10 10\" refX=\"7\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\">\n      <path d=\"M0 1 L10 5 L0 9 z\" fill=\"#66c7a6\"/>\n    </marker>\n  </defs>\n  <rect x=\"32\" y=\"66\" width=\"110\" height=\"42\" rx=\"21\" fill=\"rgba(194,94,51,0.22)\" stroke=\"#e58a62\" stroke-width=\"1.8\"/>\n  <text x=\"87\" y=\"92\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13.5\" font-weight=\"800\" text-anchor=\"middle\">fork()</text>\n\n  <!-- Parent path -->\n  <path d=\"M 132 70 Q 250 26 420 34\" fill=\"none\" stroke=\"#7ca7f0\" stroke-width=\"2\" marker-end=\"url(#m320)\"/>\n  <text x=\"275\" y=\"26\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">parent</text>\n\n  <rect x=\"425\" y=\"14\" width=\"110\" height=\"40\" rx=\"20\" fill=\"#141b25\" stroke=\"#7ca7f0\" stroke-width=\"1.6\"/>\n  <text x=\"480\" y=\"39\" fill=\"#7ca7f0\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">wait()</text>\n\n  <line x1=\"535\" y1=\"34\" x2=\"650\" y2=\"34\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m320)\"/>\n  <text x=\"595\" y=\"25\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">resumes</text>\n\n  <!-- Child path -->\n  <path d=\"M 132 104 Q 185 138 232 138\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m320)\"/>\n  <text x=\"175\" y=\"148\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\">child</text>\n\n  <rect x=\"236\" y=\"118\" width=\"114\" height=\"40\" rx=\"20\" fill=\"rgba(102,199,166,0.16)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/>\n  <text x=\"293\" y=\"143\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">exec()</text>\n\n  <line x1=\"350\" y1=\"138\" x2=\"420\" y2=\"138\" stroke=\"#66c7a6\" stroke-width=\"2\" marker-end=\"url(#m320)\"/>\n\n  <rect x=\"425\" y=\"118\" width=\"110\" height=\"40\" rx=\"20\" fill=\"#1c2533\" stroke=\"#F87171\" stroke-width=\"1.6\"/>\n  <text x=\"480\" y=\"143\" fill=\"#FCA5A5\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">exit()</text>\n\n  <!-- Signal up to wait -->\n  <line x1=\"480\" y1=\"118\" x2=\"480\" y2=\"58\" stroke=\"#f0a786\" stroke-dasharray=\"5 4\" stroke-width=\"2\" marker-end=\"url(#m320)\"/>\n</svg>",
        "svgCaption": "Slide 3.20 · UNIX fork() → exec() → exit() & wait()",
        "why": "آلية UNIX الشهيرة لفصل عملية الاستنساخ (<code>fork</code>) عن عملية تحميل برنامج جديد (<code>exec</code>).",
        "deepPoints": [
          "<strong><span class='code-pill'>fork()</span>:</strong> تنشئ عملية ابن مطابقة للأب (ترجع <code>0</code> في الابن و PID الابن في الأب).",
          "<strong><span class='code-pill'>exec()</span>:</strong> تستبدل مساحة ذاكرة الابن ببرنامج جديد، وبعدها ينهي الابن بـ <span class='code-pill'>exit()</span> فينبه الأب الواقف عند <span class='code-pill'>wait()</span>."
        ],
        "examSpot": "أسئلة شيت د. شروق (#4 و #10): <strong><code>fork()</code></strong> تنشئ عملية ابن مطابقة للأب، و<strong><code>exec()</code></strong> تستبدل الذاكرة ببرنامج جديد.",
        "notebookEn": "Slide 3.20: fork() creates duplicate child; exec() replaces memory with new program; parent calls wait() until child calls exit().",
        "notebookAr": "دالة fork() تستنسخ الأب، و exec() تحمّل برنامجاً جديداً في ذاكرة الابن."
      },
      {
        "id": "s3-23",
        "slideRef": "Slide 3.23",
        "shortLabel": "3.23 exit() & abort()",
        "title": "Process Termination — الإنهاء الطبيعي (exit) والإجباري (abort)",
        "enPoints": [
          "<strong><code>exit()</code>:</strong> process finishes last statement, asks OS to delete it, returns status via <code>wait()</code>, OS deallocates resources.",
          "<strong><code>abort()</code>:</strong> parent terminates child for 3 reasons: (1) child exceeded allocated resources, (2) task no longer required, (3) parent is exiting."
        ],
        "svg": null,
        "why": "كيف تنتهي العملية وتعود مواردها للنظام، ومتى يضطر الأب لإيقاف ابنه إجبارياً.",
        "deepPoints": [
          "<strong><span class='code-pill'>exit()</span>:</strong> إنهاء طبيعي وتفريغ الموارد.",
          "<strong><span class='code-pill'>abort()</span>:</strong> إنهاء إجباري من الأب لـ 3 أسباب (تجاوز الموارد، انتهاء الحاجة للمهمة، أو خروج الأب)."
        ],
        "examSpot": "سؤال شيت د. شروق #5: دالة إنهاء العملية في UNIX هي <strong><code>exit()</code></strong>.",
        "notebookEn": "Slide 3.23: exit() = normal deletion & resource deallocation | abort() = parent kills child (3 reasons).",
        "notebookAr": "exit() تنهي العملية طبيعياً، و abort() يستخدمها الأب لإنهاء ابنه إجبارياً."
      },
      {
        "id": "s3-24",
        "slideRef": "Slide 3.24",
        "shortLabel": "3.24 Zombie vs Orphan",
        "title": "Process Termination (Cont.) — Cascading Termination, Zombie, & Orphan",
        "enPoints": [
          "<strong>Cascading termination:</strong> OS terminates all children and grandchildren if parent terminates.",
          "<strong><code>pid = wait(&amp;status);</code></strong> — parent waits for child termination and receives PID &amp; status.",
          "<strong>Zombie:</strong> no parent waiting (parent did NOT invoke <code>wait()</code>).",
          "<strong>Orphan:</strong> parent terminated without invoking <code>wait()</code>."
        ],
        "svg": null,
        "why": "مقارنة مصيرية بين حالتين شائعتين عند نسيان استدعاء <code>wait()</code>.",
        "deepPoints": [
          "<strong><span class='en-pill'>Zombie</span>:</strong> الابن انتهى، لكن الأب لم ينادِ <code>wait()</code>.",
          "<strong><span class='en-pill'>Orphan</span>:</strong> الأب انتهى ومات بدون ما ينادي <code>wait()</code> والابن ما زال يعمل."
        ],
        "examSpot": "احفظ الفرق: <strong>Zombie</strong> = لا يوجد أب ينتظر (لم ينادِ wait)؛ <strong>Orphan</strong> = الأب مات دون wait.",
        "notebookEn": "Slide 3.24: Cascading = OS kills all descendants | Zombie = child ended, no parent wait() | Orphan = parent terminated without wait().",
        "notebookAr": "الـ Zombie ابن انتهى دون wait()؛ والـ Orphan ابن مات أبوه دون wait()."
      },
      {
        "id": "s3-25",
        "slideRef": "Slide 3.25",
        "shortLabel": "3.25 IPC والأسباب الـ 4",
        "title": "Interprocess Communication (IPC) — المستقلة مقابل المتعاونة والأسباب الأربعة",
        "enPoints": [
          "<strong>Independent process</strong> cannot affect/be affected; <strong>Cooperating process</strong> can affect/be affected by other processes.",
          "<strong>4 Reasons for Cooperating Processes:</strong> (1) <strong>Information sharing</strong>, (2) <strong>Computation speedup</strong>, (3) <strong>Modularity</strong>, (4) <strong>Convenience</strong>.",
          "<strong>2 Models of IPC:</strong> <strong>Shared memory</strong> &amp; <strong>Message passing</strong>."
        ],
        "svg": null,
        "why": "تعاون العمليات يرفع السرعة والمرونة ويتطلب آلية تواصل منظمة (IPC).",
        "deepPoints": [
          "<strong>الأسباب الأربعة (سؤال د. شروق #26):</strong> Information sharing, Computation speedup, Modularity, Convenience.",
          "<strong>نموذجا الـ <span class='en-pill'>IPC</span>:</strong> <span class='en-pill'>Shared Memory</span> و<span class='en-pill'>Message Passing</span>."
        ],
        "examSpot": "سؤال شيت د. شروق المقالي #26: اذكر مميزات تعاون العمليات الأربعة.",
        "notebookEn": "Slide 3.25 IPC: 4 Cooperation Reasons (Information sharing, Computation speedup, Modularity, Convenience); 2 Models (Shared memory, Message passing).",
        "notebookAr": "أسباب التعاون الأربعة ونموذجا الـ IPC: الذاكرة المشتركة وتمرير الرسائل."
      },
      {
        "id": "s3-26",
        "slideRef": "Slide 3.26",
        "shortLabel": "3.26 رسمة IPC",
        "title": "Communications Models — رسمة Message Passing مقابل Shared Memory",
        "enPoints": [
          "<strong>(a) Message passing:</strong> Process A &amp; B exchange messages through a <code>message queue [m₀..mₙ]</code> inside the <strong>kernel</strong>.",
          "<strong>(b) Shared memory:</strong> Process A &amp; B directly access a common <code>shared memory</code> region."
        ],
        "svg": "<svg viewBox=\"0 0 700 205\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"175\" y=\"20\" fill=\"#f0a786\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">(a) Message Passing</text>\n  <rect x=\"78\" y=\"30\" width=\"194\" height=\"32\" rx=\"7\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"175\" y=\"51\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">process A</text>\n  <rect x=\"78\" y=\"68\" width=\"194\" height=\"32\" rx=\"7\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"175\" y=\"89\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">process B</text>\n  <rect x=\"78\" y=\"126\" width=\"194\" height=\"62\" rx=\"9\" fill=\"rgba(194,94,51,0.16)\" stroke=\"#e58a62\" stroke-width=\"1.6\"/>\n  <text x=\"175\" y=\"147\" fill=\"#f0a786\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"11.5\" font-weight=\"700\" text-anchor=\"middle\">message queue [m₀..mₙ]</text>\n  <text x=\"175\" y=\"172\" fill=\"#CBD5E1\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">kernel</text>\n  <path d=\"M 272 46 L 300 46 L 300 148 L 274 148\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n  <path d=\"M 78 84 L 50 84 L 50 148 L 76 148\" fill=\"none\" stroke=\"#e58a62\" stroke-width=\"2\"/>\n\n  <text x=\"525\" y=\"20\" fill=\"#66c7a6\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"13\" font-weight=\"800\" text-anchor=\"middle\">(b) Shared Memory</text>\n  <rect x=\"428\" y=\"30\" width=\"194\" height=\"30\" rx=\"7\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"525\" y=\"50\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">process A</text>\n  <rect x=\"428\" y=\"66\" width=\"194\" height=\"30\" rx=\"7\" fill=\"rgba(102,199,166,0.22)\" stroke=\"#66c7a6\" stroke-width=\"1.6\"/><text x=\"525\" y=\"86\" fill=\"#66c7a6\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\">shared memory</text>\n  <rect x=\"428\" y=\"102\" width=\"194\" height=\"30\" rx=\"7\" fill=\"#141b25\" stroke=\"#7ca7f0\"/><text x=\"525\" y=\"122\" fill=\"#F8FAFC\" font-family=\"JetBrains Mono,ui-monospace,monospace\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">process B</text>\n  <rect x=\"428\" y=\"152\" width=\"194\" height=\"36\" rx=\"8\" fill=\"#1c2533\" stroke=\"#94A3B8\"/><text x=\"525\" y=\"175\" fill=\"#94A3B8\" font-family=\"Inter,system-ui,sans-serif\" font-size=\"12\" font-weight=\"700\" text-anchor=\"middle\">kernel</text>\n  <path d=\"M 428 45 L 402 45 L 402 81 L 426 81\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n  <path d=\"M 622 117 L 648 117 L 648 81 L 624 81\" fill=\"none\" stroke=\"#66c7a6\" stroke-width=\"2\"/>\n</svg>",
        "svgCaption": "Slide 3.26 · (a) Message Passing vs. (b) Shared Memory",
        "why": "الرسمة توضح الفرق المعماري: في تمرير الرسائل كل رسالة تعدي على الـ Kernel، أما في الذاكرة المشتركة فالوصول مباشر في الـ User space.",
        "deepPoints": [
          "<strong>(a) <span class='en-pill'>Message passing</span>:</strong> تمر الرسائل بطابور داخل النواة.",
          "<strong>(b) <span class='en-pill'>Shared memory</span>:</strong> وصول مباشر لمنطقة ذاكرة مشتركة بدون تدخل النواة في كل قراءة وكتابة."
        ],
        "examSpot": "الـ <strong>Shared Memory</strong> أسرع لأن النواة لا تتدخل في كل عملية قراءة وكتابة.",
        "notebookEn": "Slide 3.26: (a) Message passing goes through Kernel queue; (b) Shared memory gives direct access between Process A & B.",
        "notebookAr": "تمرير الرسائل يمر عبر طابور النواة، والذاكرة المشتركة تمنح وصولاً مباشراً بين العمليتين."
      },
      {
        "id": "s3-27",
        "slideRef": "Slide 3.27",
        "shortLabel": "3.27 Shared Memory",
        "title": "IPC – Shared Memory — الذاكرة المشتركة ونموذج Producer-Consumer",
        "enPoints": [
          "Area of memory shared among communicating processes; under control of <strong>user processes, NOT the OS</strong>.",
          "Major issue: providing mechanisms to <strong>synchronize</strong> access.",
          "<strong>Producer-Consumer Buffers:</strong> <strong>unbounded-buffer</strong> (no practical size limit) vs. <strong>bounded-buffer</strong> (fixed buffer size)."
        ],
        "svg": null,
        "why": "الذاكرة المشتركة سريعة جداً لكنها تلقي مسؤولية التزامن (Synchronization) على عاتق عمليات المستخدم.",
        "deepPoints": [
          "<strong>التحكم:</strong> تحت تحكم <strong>عمليات المستخدم وليس الـ OS</strong>، والتحدي الأكبر هو <strong><span class='en-pill'>Synchronization</span></strong>.",
          "<strong>أنواع الـ Buffer:</strong> <span class='en-pill'>Unbounded-buffer</span> بلا حد أقصى، و<span class='en-pill'>Bounded-buffer</span> حجم ثابت (ينتظر المنتج إذا امتلأ)."
        ],
        "examSpot": "تذكر: التواصل في <strong>Shared Memory</strong> تحت تحكم <strong>User processes</strong> وليس الـ OS.",
        "notebookEn": "Slide 3.27 Shared Memory: Controlled by user processes (not OS); key issue = synchronization; Unbounded vs Bounded buffer.",
        "notebookAr": "الـ Shared Memory تحت تحكم عمليات المستخدم وتحتاج Synchronization، ولها Bounded و Unbounded buffer."
      },
      {
        "id": "s3-28",
        "slideRef": "Slide 3.28",
        "shortLabel": "3.28 Message Passing",
        "title": "IPC – Message Passing — التواصل بـ send و receive",
        "enPoints": [
          "Processes communicate <strong>without resorting to shared variables</strong>.",
          "Provides 2 operations: <strong><code>send(message)</code></strong> and <strong><code>receive(message)</code></strong> (fixed or variable size).",
          "Processes P &amp; Q establish a <strong>communication link</strong> (Synchronous/asynchronous, Automatic/explicit buffering)."
        ],
        "svg": null,
        "why": "نموذج آمن ومناسب للأنظمة الموزعة وتبادل البيانات الصغيرة بدون متغيرات مشتركة.",
        "deepPoints": [
          "<strong>العمليتان:</strong> <span class='code-pill'>send(message)</span> و<span class='code-pill'>receive(message)</span> عبر رابط اتصال (<span class='en-pill'>Communication link</span>) بدون متغيرات مشتركة."
        ],
        "examSpot": "يتميز الـ <strong>Message Passing</strong> بالتواصل <strong>بدون متغيرات مشتركة</strong> عبر <code>send()</code> و <code>receive()</code>.",
        "notebookEn": "Slide 3.28 Message Passing: No shared variables; send(message) & receive(message) over a communication link.",
        "notebookAr": "تمرير الرسائل يتواصل عبر send/receive بدون أي متغيرات مشتركة."
      },
      {
        "id": "s3-29",
        "slideRef": "Slide 3.29",
        "shortLabel": "3.29 Synchronization",
        "title": "Synchronization — Blocking (Synchronous) vs Non-Blocking & Rendezvous",
        "enPoints": [
          "<strong>Blocking = synchronous:</strong> blocking send (waits until received), blocking receive (waits until available).",
          "<strong>Non-blocking = asynchronous:</strong> non-blocking send (sends &amp; continues), non-blocking receive (valid message or Null message).",
          "<strong>If both send and receive are blocking, we have a <code>rendezvous</code>.</strong>"
        ],
        "svg": null,
        "why": "تحديد هل العملية تنتظر أم تكمل فوراً عند إرسال أو استقبال الرسالة.",
        "deepPoints": [
          "<strong><span class='en-pill'>Blocking = Synchronous</span>:</strong> يوجد انتظار.",
          "<strong><span class='en-pill'>Non-blocking = Asynchronous</span>:</strong> يعود فوراً (والاستقبال يرجع رسالة صالحة أو <code>Null</code>).",
          "<strong><span class='en-pill'>Rendezvous</span>:</strong> عندما يكون الـ send والـ receive كلاهما Blocking معاً."
        ],
        "examSpot": "سؤال امتحان مباشر: Both send and receive are blocking = <strong>Rendezvous</strong>.",
        "notebookEn": "Slide 3.29: Blocking = Synchronous | Non-blocking = Asynchronous | Both blocking = RENDEZVOUS.",
        "notebookAr": "Blocking متزامن، Non-blocking غير متزامن، وإذا كان كلاهما Blocking يسمى Rendezvous."
      },
      {
        "id": "s3-30",
        "slideRef": "Slide 3.30",
        "shortLabel": "3.30 Buffering",
        "title": "Buffering — أنواع طابور الرسائل الثلاثة",
        "enPoints": [
          "Queue of messages attached to the link — implemented in 3 ways:",
          "1. <strong>Zero capacity:</strong> no messages queued; sender must wait for receiver (<strong>rendezvous</strong>).",
          "2. <strong>Bounded capacity:</strong> finite length of <em>n</em> messages; sender waits if link is full.",
          "3. <strong>Unbounded capacity:</strong> infinite length; <strong>sender never waits</strong>."
        ],
        "svg": null,
        "why": "سعة الطابور المرتبط برابط الرسائل تحدد متى ينتظر المرسل ومتى يكمل فوراً.",
        "deepPoints": [
          "<strong>1) <span class='en-pill'>Zero capacity</span>:</strong> بدون طابور = <strong>Rendezvous</strong>.",
          "<strong>2) <span class='en-pill'>Bounded capacity</span>:</strong> طول محدود <em>n</em>؛ المرسل ينتظر لو امتلأ.",
          "<strong>3) <span class='en-pill'>Unbounded capacity</span>:</strong> طول لا نهائي؛ المرسل <strong>لا ينتظر أبداً</strong>."
        ],
        "examSpot": "اربط: <strong>Zero capacity</strong> = Rendezvous؛ <strong>Unbounded capacity</strong> = Sender never waits.",
        "notebookEn": "Slide 3.30 Buffering: Zero capacity (rendezvous), Bounded capacity (n msgs, waits if full), Unbounded capacity (never waits).",
        "notebookAr": "أنواع الـ Buffering الثلاثة: Zero (Rendezvous)، Bounded (طول n)، و Unbounded (المرسل لا ينتظر)."
      }
    ],
    "lab": {
      "title": "⚡ معمل Chapter 3 التفاعلي: حل مسائل الميدتيرم (FCFS & SJF)",
      "subtitle": "قارن بين الحل الرسمي لمسألة الميدتيرم Q9 (FCFS) ومسألة الميدتيرم Q10 (SJF).",
      "steps": [
        {
          "btn": "مسألة Q9: FCFS",
          "heading": "Midterm Q9 — First-Come, First-Served (P1=24, P2=3, P3=3)",
          "badge": "Avg Wait = 17",
          "visualHtml": "<div class=\"gantt-row\">\n                  <div class=\"gantt-seg\" style=\"width:74%;background:#e58a62;\"><div>P1</div><div style=\"font-size:0.75rem;\">0 → 24</div></div>\n                  <div class=\"gantt-seg\" style=\"width:13%;background:#1d6b52;\"><div>P2</div><div style=\"font-size:0.75rem;\">24 → 27</div></div>\n                  <div class=\"gantt-seg\" style=\"width:13%;background:#1e355c;\"><div>P3</div><div style=\"font-size:0.75rem;\">27 → 30</div></div>\n                </div>",
          "detail": "في FCFS ننفذ العمليات بنفس ترتيب وصولها: P1(0–24)، P2(24–27)، P3(27–30). أوقات الانتظار: P1=0، P2=24، P3=27 ← المتوسط = (0 + 24 + 27) ÷ 3 = 17.",
          "telemetryLeft": "Order: P1(24) → P2(3) → P3(3)",
          "telemetryRight": "Average Waiting Time = 17 ms"
        },
        {
          "btn": "مسألة Q10: SJF",
          "heading": "Midterm Q10 — Shortest-Job-First (P1=6, P2=8, P3=7, P4=3)",
          "badge": "Avg Wait = 7",
          "visualHtml": "<div class=\"gantt-row\">\n                  <div class=\"gantt-seg\" style=\"width:14%;background:#1d6b52;\"><div>P4</div><div style=\"font-size:0.75rem;\">0 → 3</div></div>\n                  <div class=\"gantt-seg\" style=\"width:25%;background:#e58a62;\"><div>P1</div><div style=\"font-size:0.75rem;\">3 → 9</div></div>\n                  <div class=\"gantt-seg\" style=\"width:29%;background:#6D28D9;\"><div>P3</div><div style=\"font-size:0.75rem;\">9 → 16</div></div>\n                  <div class=\"gantt-seg\" style=\"width:32%;background:#1e355c;\"><div>P2</div><div style=\"font-size:0.75rem;\">16 → 24</div></div>\n                </div>",
          "detail": "في SJF نرتب تصاعدياً حسب أصغر Burst Time: P4(3) → P1(6) → P3(7) → P2(8). أوقات الانتظار: P4=0، P1=3، P3=9، P2=16 ← المتوسط = (3 + 16 + 9 + 0) ÷ 4 = 7.",
          "telemetryLeft": "Sorted: P4(3) → P1(6) → P3(7) → P2(8)",
          "telemetryRight": "Average Waiting Time = 7 ms"
        }
      ]
    },
    "summary": [
      {
        "term": "Program vs Process",
        "en": "Program: passive file on disk. Process: active program in execution.",
        "ar": "البرنامج سلبي على الهارد، والعملية نشطة في الرام."
      },
      {
        "term": "Memory Sections",
        "en": "Text (code), Data (globals), Heap (dynamic), Stack (temp/local).",
        "ar": "أقسام الذاكرة الأربعة للعملية."
      },
      {
        "term": "Ready vs Waiting",
        "en": "Ready waits for CPU; Waiting waits for I/O or event.",
        "ar": "Ready تنتظر المعالج و Waiting تنتظر I/O."
      },
      {
        "term": "PCB & Context Switch",
        "en": "PCB stores state/PC/registers; Context switch saves PCB0 and reloads PCB1.",
        "ar": "كتلة التحكم وتبديل السياق."
      },
      {
        "term": "3 Schedulers",
        "en": "Short-term (CPU, ms), Long-term (degree of multiprogramming), Medium-term (Swapping).",
        "ar": "المجدولات الثلاثة."
      },
      {
        "term": "Zombie vs Orphan",
        "en": "Zombie: child ended without wait(). Orphan: parent ended without wait().",
        "ar": "الزومبي واليتيم."
      }
    ]
  }
];
