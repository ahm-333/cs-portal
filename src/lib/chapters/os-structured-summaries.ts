import type { StructuredChapterSummary } from "@/types/chapter";

// Detailed, 1-to-1 paired bilingual study summaries for Operating Systems (CS-311).
// Every English concept & bullet has its simple Egyptian Arabic explanation immediately underneath.
export const OS_STRUCTURED_SUMMARIES: StructuredChapterSummary[] = [
  // ==========================================================================
  // CHAPTER 1: INTRODUCTION
  // ==========================================================================
  {
    lessonId: "22222222-2222-4222-8222-222222222301",
    courseCode: "CS-311",
    chapterNum: 1,
    titleEn: "Chapter 1: Introduction to Operating Systems",
    titleAr: "مقدمة في نظم التشغيل وبنية الحاسب",
    overviewEn:
      "Covers what an Operating System is, the 4 system layers, Kernel & Bootstrap startup, Hardware vs. Software Interrupts, DMA, the complete Storage Hierarchy (Slide 1.29), Multiprocessor & Clustered architectures, Multiprogramming vs. Timesharing, and Dual-Mode + Timer hardware protection.",
    overviewAr:
      "كل سطر إنجليزي وتحته شرحه بالعامية مباشرة: يعني إيه نظام تشغيل، إزاي الجهاز بيصحى (Bootstrap)، الـ Interrupts والـ DMA، هرم الذاكرة، أنواع المعالجات، والحماية بالـ Dual-Mode والـ Timer.",
    sections: [
      {
        id: "overview",
        number: "01",
        titleEn: "What Is an Operating System? & System Layers",
        titleAr: "ما هو نظام التشغيل وطبقات النظام",
        flowBanner: {
          labelEn: "Four Components of a Computer System (Bottom → Top)",
          steps: [
            "Computer Hardware (CPU, RAM, I/O)",
            "Operating System",
            "System & Application Programs",
            "Users (People / Machines)",
          ],
          captionAr:
            "أربع طبقات فوق بعض: الهاردوير تحت خالص، فوقه نظام التشغيل كوسيط، فوقه برامجك زي المتصفح والـ Compiler، وفوق خالص المستخدمين.",
        },
        cards: [
          {
            term: "Operating System (OS)",
            termAr: "تعريف وأهداف نظام التشغيل",
            badge: "Core Definition",
            tone: "brand",
            enSummary:
              "Operating System: A program that acts as an intermediary between a user of a computer and the computer hardware.",
            arSummary:
              "الوسيط بينك وبين الهاردوير عشان تستخدم الجهاز بسهولة من غير ما تتعامل مع تفاصيل الكهرباء والأصفار والوحايد.",
            points: [
              {
                en: "Goal 1 — Execute User Programs: Runs programs and makes solving user problems much easier.",
                ar: "يشغّل برامجك ويسهّل عليك حل مشاكلك على الجهاز.",
              },
              {
                en: "Goal 2 — Convenience: Makes the computer system convenient and pleasant to use.",
                ar: "يخلي استخدام الكمبيوتر مريح وسهل للمستخدم.",
              },
              {
                en: "Goal 3 — Efficiency: Uses the computer hardware in an efficient, fair manner.",
                ar: "يستغل موارد الهاردوير (المعالج والرام) بأعلى كفاءة بدون هدر.",
              },
            ],
          },
          {
            term: "User View vs. System View",
            termAr: "منظور المستخدم مقابل منظور النظام",
            badge: "Slide 1.5–1.6",
            tone: "neutral",
            enSummary:
              "How we define the OS depends on whether we look from the user's perspective or the hardware's perspective.",
            arSummary:
              "تعريف نظام التشغيل بيختلف حسب إنت باصصله كمستخدم ولا باصصله من ناحية الجهاز نفسه:",
            points: [
              {
                en: "User View (PC / Mobile): Designed primarily for ease of use, good performance, and battery life — NOT resource sharing.",
                ar: "بالنسبة للمستخدم العادي على اللاب أو الموبايل، المهم السهولة والسرعة والبطارية مش مشاركة الموارد.",
              },
              {
                en: "User View (Shared Mainframe / Server): Must keep all users happy by maximizing resource utilization.",
                ar: "على السيرفرات المشتركة، المهم إن كل المستخدمين ياخدوا حقهم ويستغلوا الجهاز كويس.",
              },
              {
                en: "System View — Resource Allocator: Manages all resources (CPU time, RAM, storage, I/O) and resolves conflicting requests fairly.",
                ar: "من ناحية الجهاز، الـ OS شغال «موزّع موارد» يدي كل برنامج وقت معالج ومساحة رام بعدل.",
                tag: "Exam Focus",
              },
              {
                en: "System View — Control Program: Controls execution of user programs to prevent errors and improper use of the computer.",
                ar: "وكمان شغال «مراقب/برنامج تحكم» يمنع أي برنامج يبوّظ الدنيا أو يتعدّى على غيره.",
                tag: "Exam Focus",
              },
            ],
          },
          {
            term: "The Kernel & Bootstrap Program",
            termAr: "النواة وبرنامج الإقلاع",
            badge: "Slides 1.8–1.9 · Exam Favorite",
            tone: "warm",
            enSummary:
              "The Kernel is the core program running at all times, loaded into RAM at startup by the Bootstrap Program.",
            arSummary:
              "النواة هي قلب النظام الشغال طول الوقت، والـ Bootstrap هو اللي بيصحيها أول ما تدوس باور.",
            points: [
              {
                en: "The Kernel: The ONE program running at all times on the computer; everything else is either a system program or an application program.",
                ar: "النواة هي البرنامج الوحيد اللي شغال طول ما الجهاز مفتوح؛ وأي حاجة غيرها يا System Program يا Application.",
                tag: "Exam Favorite",
              },
              {
                en: "System Programs vs. Application Programs: System programs ship with the OS (not part of the kernel); Application programs are user apps (browsers, editors); Mobile OSes also include Middleware.",
                ar: "برامج النظام بتيجي مع الويندوز/لينكس كأدوات مساعدة (ومش جزء من النواة)، والتطبيقات هي برامجك العادية، والموبايل فيه طبقة Middleware.",
              },
              {
                en: "Bootstrap Program (Firmware): Stored in nonvolatile ROM or EPROM; initializes CPU registers, device controllers, and memory, then loads the OS kernel into RAM.",
                ar: "أول كود بيصحى لما تدوس زرار الباور، متخزّن في ROM/EPROM عشان ميتمسحش، يجهّز الهاردوير ويحمّل النواة للرام.",
                tag: "Exam Focus",
              },
            ],
          },
        ],
      },
      {
        id: "organization-interrupts",
        number: "02",
        titleEn: "Computer-System Organization, Interrupts & DMA",
        titleAr: "تنظيم الحاسب، المقاطعات، والوصول المباشر للذاكرة",
        cards: [
          {
            term: "Device Controllers, Interrupts, Traps & DMA",
            termAr: "المتحكمات، المقاطعات، والـ DMA",
            badge: "Slides 1.10–1.16",
            tone: "mint",
            enSummary:
              "Modern computers are interrupt-driven: CPUs and device controllers execute concurrently and coordinate via Interrupts and DMA.",
            arSummary:
              "المعالج وأجهزة الـ I/O بيشتغلوا في نفس الوقت (Concurrently)، والـ Interrupts والـ DMA هم اللي بينظموا الشغل بينهم:",
            points: [
              {
                en: "Device Controller & Device Driver: Each I/O device has a hardware controller with a local buffer; the OS uses a software Device Driver to provide a uniform interface.",
                ar: "كل جهاز ليه متحكم هاردوير بمخزن صغير (Local Buffer)، والـ Device Driver هو المترجم السوفتوير اللي بيخلّي نظام التشغيل يفهمه.",
              },
              {
                en: "Hardware Interrupt: Triggered by a device controller sending a signal over the system bus when an I/O operation finishes.",
                ar: "مقاطعة جاية من الهاردوير عشان تقول للمعالج «أنا خلصت القراءة/الكتابة».",
                tag: "Exam Focus",
              },
              {
                en: "Trap / Exception: A SOFTWARE-generated interrupt caused either by an error (division by zero) or a user request (System Call).",
                ar: "مقاطعة برمجية من البرنامج نفسه بسبب غلط (زي القسمة على صفر) أو طلب خدمة من النظام (System Call).",
                tag: "Exam Trap",
              },
              {
                en: "Interrupt Vector vs. Polling: Interrupt Vector is an array of ISR addresses for O(1) direct jump (fast), whereas Polling checks each device one by one (slow).",
                ar: "الـ Interrupt Vector جدول عناوين بيودّي المعالج على طول للدالة الصح، بدل ما يقعد يسأل الأجهزة واحد واحد (Polling).",
              },
              {
                en: "Direct Memory Access (DMA): High-speed controller transfers an entire data block straight to RAM without CPU intervention — generating only ONE interrupt per block (not per byte).",
                ar: "الـ DMA بينقل بلوك بيانات كامل من الجهاز للرام مباشرة من غير ما يعطّل المعالج، ويبعت مقاطعة واحدة بس لما البلوك يخلص.",
                tag: "Exam Focus",
              },
            ],
          },
        ],
      },
      {
        id: "storage-hierarchy",
        number: "03",
        titleEn: "Storage Hierarchy & Caching (Slide 1.29)",
        titleAr: "هرم الذاكرة والتخزين والكاش",
        flowBanner: {
          labelEn:
            "Top (Fastest · Smallest · Costliest · Volatile)  →  Bottom (Slowest · Largest · Cheapest · Nonvolatile)",
          steps: [
            "Registers",
            "Cache",
            "Main Memory (RAM)",
            "Solid-State Disk (SSD)",
            "Hard Disk (HDD)",
            "Optical / Tape",
          ],
          captionAr:
            "كل ما تنزل لتحت: المساحة بتكبر (Capacity ↑)، السعر لكل بت بيقل (Cost ↓)، والسرعة بتقل (Access Time ↑).",
        },
        cards: [
          {
            term: "Main Memory, Secondary Storage & Cache Coherency",
            termAr: "الرام، التخزين الدائم، والكاش",
            badge: "Slides 1.13–1.30",
            tone: "brand",
            enSummary:
              "Computers combine fast volatile memory with large nonvolatile storage and use caching across levels to bridge the speed gap.",
            arSummary:
              "الجهاز بيجمع بين ذاكرة سريعة مؤقتة وتخزين دائم ضخم، ويستخدم الكاش عشان يسد فرق السرعة بينهم:",
            points: [
              {
                en: "Main Memory (RAM): Only large storage media the CPU can access directly; Random Access; Volatile (loses data on power off).",
                ar: "الرام هي الذاكرة الكبيرة الوحيدة اللي المعالج بيكلمها مباشرة، بس بياناتها بتتمسح لما الكهربا تفصل (Volatile).",
              },
              {
                en: "Secondary Storage (SSD / HDD / NVM): Large, Nonvolatile permanent extension of main memory.",
                ar: "التخزين الدائم (Nonvolatile) اللي بيحفظ ملفاتك حتى بعد ما تطفي الجهاز.",
              },
              {
                en: "Caching & Cache Coherency: Copying frequently used data into faster memory; in multiprocessors, Cache Coherency ensures updating a value in one CPU's cache updates all other CPUs' caches.",
                ar: "الكاش بيخلي البيانات المهمة قريبة وسريعة؛ والـ Cache Coherency بيضمن إن كل المعالجات شايفين أحدث نسخة من البيانات مش نسخة قديمة.",
              },
            ],
          },
        ],
        table: {
          titleEn: "Storage Management Responsibility Table (Slide 1.29 — Must Memorize!)",
          titleAr: "جدول المسؤول عن إدارة كل مستوى (سؤال امتحان مضمون)",
          headers: [
            { label: "Level", dir: "ltr" },
            { label: "Storage Type", dir: "ltr" },
            { label: "Volatility", dir: "ltr" },
            { label: "Managed By", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Level 1", dir: "ltr" },
              { text: "Registers", dir: "ltr" },
              { text: "Volatile", dir: "ltr" },
              { text: "Compiler", dir: "ltr", highlight: true },
              { text: "أسرع ذاكرة جوه المعالج، الـ Compiler هو اللي بيديرها", dir: "rtl" },
            ],
            [
              { text: "Level 2", dir: "ltr" },
              { text: "Cache", dir: "ltr" },
              { text: "Volatile", dir: "ltr" },
              { text: "Hardware", dir: "ltr", highlight: true },
              { text: "بين المعالج والرام، بيديرها الهاردوير تلقائياً", dir: "rtl" },
            ],
            [
              { text: "Level 3", dir: "ltr" },
              { text: "Main Memory (RAM)", dir: "ltr" },
              { text: "Volatile", dir: "ltr" },
              { text: "Operating System", dir: "ltr" },
              { text: "الذاكرة الرئيسية للبرامج الشغالة، يديرها نظام التشغيل", dir: "rtl" },
            ],
            [
              { text: "Level 4", dir: "ltr" },
              { text: "SSD / HDD", dir: "ltr" },
              { text: "Nonvolatile", dir: "ltr" },
              { text: "Operating System", dir: "ltr" },
              { text: "التخزين الدائم، يديره نظام التشغيل", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "architectures-protection",
        number: "04",
        titleEn: "Architectures, Multiprogramming, Dual-Mode & Timer",
        titleAr: "المعماريات، تعدد البرامج، الوضع المزدوج، والمؤقت",
        table: {
          titleEn: "Comparison of System Architectures (Slides 1.17–1.20)",
          titleAr: "مقارنة معماريات أنظمة الحاسب",
          headers: [
            { label: "Architecture", dir: "ltr" },
            { label: "How It Works (English)", dir: "ltr" },
            { label: "Key Benefit / Detail", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Asymmetric Multiprocessing", dir: "ltr" },
              { text: "Boss-worker relationship; each CPU is assigned a specific task.", dir: "ltr" },
              { text: "Boss schedules and allocates work.", dir: "ltr" },
              { text: "معالج رئيسي بيوزّع الشغل على الباقي", dir: "rtl" },
            ],
            [
              { text: "Symmetric Multiprocessing (SMP)", dir: "ltr", highlight: true },
              { text: "All processors are peers sharing RAM and running the OS.", dir: "ltr" },
              { text: "Increased throughput, economy of scale, graceful degradation.", dir: "ltr", highlight: true },
              { text: "كل المعالجات متساوية؛ لو واحد وقع الباقي يكمل", dir: "rtl" },
            ],
            [
              { text: "Multi-Core Systems", dir: "ltr" },
              { text: "Multiple computing cores placed on a single chip.", dir: "ltr" },
              { text: "Faster on-chip communication & much lower power.", dir: "ltr", highlight: true },
              { text: "كذا نواة على نفس الشريحة — أسرع وأوفر كهرباء", dir: "rtl" },
            ],
            [
              { text: "Asymmetric Clustering", dir: "ltr", highlight: true },
              { text: "One machine runs apps while another is in hot-standby mode.", dir: "ltr" },
              { text: "Instant failover (high availability).", dir: "ltr" },
              { text: "جهاز شغال والتاني احتياطي ساخن (hot-standby)", dir: "rtl" },
            ],
            [
              { text: "Symmetric Clustering", dir: "ltr" },
              { text: "Multiple nodes run apps simultaneously and monitor each other.", dir: "ltr" },
              { text: "More efficient — uses all available hardware.", dir: "ltr" },
              { text: "كل الأجهزة شغالة مع بعض وبتراقب بعض", dir: "rtl" },
            ],
          ],
        },
        cards: [
          {
            term: "Multiprogramming, Timesharing, Dual-Mode & Hardware Timer",
            termAr: "تعدد البرامج والحماية بالوضع المزدوج والمؤقت",
            badge: "Slides 1.22–1.25 · Exam Favorite",
            tone: "warm",
            enSummary:
              "OSes keep CPUs busy via Multiprogramming/Timesharing and protect the system using Dual-Mode hardware and a Timer.",
            arSummary:
              "إزاي النظام بيشغّل كذا برنامج بكفاءة ويحمي نفسه من أي برنامج يعلّق أو يبوّظ الهاردوير:",
            flowSteps: [
              "User Mode (bit = 1)",
              "System Call / Trap",
              "Kernel Mode (bit = 0)",
              "Return to User (bit = 1)",
            ],
            points: [
              {
                en: "Multiprogramming vs. Timesharing: Multiprogramming maximizes CPU utilization by switching whenever a job waits for I/O; Timesharing (Multitasking) switches so frequently that users interact directly (Response Time < 1s).",
                ar: "الـ Multiprogramming هدفه المعالج ميفضلش فاضي وقت الـ I/O، أما الـ Timesharing فبيبدّل بسرعة رهيبة عشان تتفاعل مع البرامج لحظياً.",
              },
              {
                en: "Dual-Mode Operation (Mode Bit): User Mode (mode bit = 1) is restricted; Kernel Mode (mode bit = 0) has full access to Privileged Instructions (I/O, timer, interrupts).",
                ar: "أهم حماية في الهاردوير: User Mode = 1 (صلاحية محدودة) و Kernel Mode = 0 (صلاحية كاملة لتنفيذ الأوامر المحمية).",
                tag: "Exam Trap",
              },
              {
                en: "Hardware Timer: OS sets a countdown counter (a Privileged Instruction) so if a user program enters an infinite loop, the timer interrupts at 0 and reclaims the CPU.",
                ar: "عدّاد وقت بيظبطه النظام عشان لو برنامج دخل في Loop لا نهائي، العداد يصفّر ويسحب المعالج منه غصب عنه.",
              },
              {
                en: "Virtualization & Kernel Data Structures: Hypervisor (VMM) runs multiple guest OSes on one machine; kernels use Linked Lists, BSTs, Hash Maps, and Bitmaps.",
                ar: "الـ Virtualization بيشغّل كذا نظام تشغيل على نفس الجهاز بـ Hypervisor، والنواة مبنية بـ Linked Lists و Trees و Bitmaps.",
              },
            ],
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Kernel Mode = mode bit 0  |  User Mode = mode bit 1 (do NOT swap them!).",
        ar: "احفظها كويس: 0 للـ Kernel (الصلاحية الكاملة) و 1 للـ User.",
      },
      {
        en: "Slide 1.29 Trap: Registers → Compiler | Cache → Hardware | RAM / SSD / HDD → OS.",
        ar: "أشهر تركة في الشابتر: الـ Registers بيديرها الـ Compiler والكاش بيديره الهاردوير.",
      },
      {
        en: "Trap / Exception is a SOFTWARE-generated interrupt, NOT a hardware interrupt.",
        ar: "الـ Trap مقاطعة برمجية (بسبب غلط أو System Call) مش من جهاز هاردوير.",
      },
      {
        en: "DMA generates 1 interrupt per BLOCK (not per byte), and setting the Timer is a Privileged Instruction.",
        ar: "الـ DMA بيبعت مقاطعة واحدة لكل بلوك، وضبط الـ Timer أمر محمي للنواة فقط.",
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 2: OPERATING SYSTEM STRUCTURES
  // ==========================================================================
  {
    lessonId: "22222222-2222-4222-8222-222222222302",
    courseCode: "CS-311",
    chapterNum: 2,
    titleEn: "Chapter 2: Operating System Structures",
    titleAr: "خدمات وهياكل نظم التشغيل",
    overviewEn:
      "Covers OS services (user-facing vs. system-efficiency), CLI/GUI user interfaces, System Calls & Standard APIs (POSIX, Win32, Java), the 3 parameter-passing methods, the 6 system-call categories, Policy vs. Mechanism, all 6 OS architectures (Monolithic to Hybrid), Debugging (Core vs. Crash Dump), and System Boot.",
    overviewAr:
      "كل سطر إنجليزي وتحته شرحه بالعامية: خدمات النظام، الـ System Calls والـ APIs، طرق تمرير المعاملات، Policy مقابل Mechanism، ومقارنة الـ 6 هياكل لبناء أنظمة التشغيل.",
    sections: [
      {
        id: "os-services",
        number: "01",
        titleEn: "Operating-System Services",
        titleAr: "خدمات نظام التشغيل",
        cards: [
          {
            term: "User-Facing Services vs. System-Efficiency Services",
            termAr: "خدمات المستخدم مقابل خدمات كفاءة وأمان النظام",
            badge: "Slides 2.2–2.3",
            tone: "brand",
            enSummary:
              "OS services split into 6 user-helpful services and 3 system-efficiency & security services.",
            arSummary:
              "خدمات نظام التشغيل متقسمة جزئين: جزء عشان يسهّل شغلك كمستخدم، وجزء عشان ينظم ويحمي الجهاز:",
            points: [
              {
                en: "User Services (6): User Interface (CLI/GUI/Touch), Program Execution, I/O Operations, File-System Manipulation, Communications (IPC), and Error Detection.",
                ar: "خدماتك اليومية كمستخدم: واجهة استخدام، تشغيل برامج، قراءة/كتابة أجهزة وملفات، تواصل بين البرامج، واكتشاف الأخطاء.",
              },
              {
                en: "Resource Allocation & Accounting: Fairly distribute CPU/RAM/I/O among concurrent users and log resource usage.",
                ar: "توزيع موارد الجهاز بعدل بين البرامج وتسجيل مين استخدم قد إيه.",
              },
              {
                en: "Protection vs. Security: Protection controls INTERNAL access to system resources; Security defends against EXTERNAL unauthorized access (passwords, authentication).",
                ar: "فرق مهم: الـ Protection حماية داخلية بين البرامج وبعضها، أما الـ Security فحماية خارجية ضد الاختراق زي الباسورد.",
                tag: "Exam Focus",
              },
            ],
          },
        ],
      },
      {
        id: "ui-syscalls",
        number: "02",
        titleEn: "User Interfaces, System Calls, APIs & Parameter Passing",
        titleAr: "الواجهات، استدعاءات النظام، الـ APIs، وتمرير المعاملات",
        flowBanner: {
          labelEn: "How a User Program Requests a Kernel Service",
          steps: [
            "User Application",
            "Standard API (POSIX / Win32 / Java)",
            "System-Call Interface (Index Table)",
            "Kernel Routine (Mode Bit = 0)",
            "Return Result",
          ],
          captionAr:
            "البرنامج بيكلم الـ API السهل ← الـ API بيبعت رقم الـ System Call للواجهة ← النواة بتنفذ في Kernel Mode وترجّع النتيجة.",
        },
        cards: [
          {
            term: "Shell vs. GUI, Standard APIs & 3 Parameter-Passing Methods",
            termAr: "الـ Shell، الـ APIs، وطرق تمرير المعاملات",
            badge: "Slides 2.4–2.12 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Programmers invoke kernel services through portable Standard APIs and pass parameters via Registers, Memory Block/Table, or Stack.",
            arSummary:
              "المبرمجين بيستخدموا APIs جاهزة بدل الـ System Calls المباشرة، وبيبعتوا البيانات للنواة بواحدة من 3 طرق:",
            points: [
              {
                en: "Command Interpreter (Shell) vs. GUI: The Shell (bash/zsh) fetches, translates, and executes text commands; GUI provides desktop windows, icons, and mouse/touch interaction.",
                ar: "الـ Shell بيترجم وينفّذ أوامر نصية، أما الـ GUI فواجهة النوافذ والأيقونات بالماوس أو اللمس.",
              },
              {
                en: "Why APIs (POSIX, Win32, Java) Over Direct System Calls?: (1) Program Portability across OSes, (2) Much simpler than raw system calls.",
                ar: "بنفضّل الـ APIs لسببين: الكود يشتغل على كذا جهاز بسهولة (Portability) وأبسط بكتير من استدعاء النواة مباشرة.",
                tag: "Midterm Q",
              },
              {
                en: "Method 1 — Registers: Fastest and simplest, but limited if there are more parameters than available CPU registers.",
                ar: "أسرع طريقة لو عدد المعاملات قليل يكفي الـ Registers بتاعة المعالج.",
              },
              {
                en: "Method 2 — Block/Table in Memory: Store parameters in RAM and pass ONLY the starting address in a register (used by Linux & Solaris — no count limit).",
                ar: "نحط المعاملات في جدول في الرام ونبعت عنوان بدايته في Register (زي Linux) — ملهاش حد أقصى.",
                tag: "Exam Focus",
              },
              {
                en: "Method 3 — Stack: Program pushes parameters onto the stack; OS pops them off (also no limit on parameter count).",
                ar: "البرنامج يعمل Push للمعاملات على الـ Stack والنظام يعملها Pop — برضه ملهاش حد أقصى.",
              },
              {
                en: "Linker vs. Loader: Linker combines object files and libraries into one executable; Loader brings the executable into RAM to run.",
                ar: "الـ Linker بيجمّع ملفات الكود والمكتبات في ملف تنفيذي واحد، والـ Loader بيرفعه للرام عشان يشتغل.",
              },
            ],
          },
        ],
        table: {
          titleEn: "Six Categories of System Calls (Slide 2.10)",
          titleAr: "الفئات الستة لاستدعاءات النظام",
          headers: [
            { label: "Category", dir: "ltr" },
            { label: "Key Operations (English)", dir: "ltr" },
            { label: "بتعمل إيه بالعامية؟", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Process Control", dir: "ltr", highlight: true },
              { text: "create/terminate, load, execute, wait, allocate/free memory.", dir: "ltr" },
              { text: "إنشاء وتشغيل وإيقاف العمليات وحجز الذاكرة", dir: "rtl" },
            ],
            [
              { text: "File Management", dir: "ltr" },
              { text: "create, delete, open, close, read, write, get/set attributes.", dir: "ltr" },
              { text: "إنشاء وقراءة وكتابة وحذف الملفات", dir: "rtl" },
            ],
            [
              { text: "Device Management", dir: "ltr" },
              { text: "request/release device, read, write, attach/detach.", dir: "ltr" },
              { text: "حجز جهاز I/O واستخدامه وتحريره", dir: "rtl" },
            ],
            [
              { text: "Information Maintenance", dir: "ltr" },
              { text: "get/set time/date, system data, process/file attributes.", dir: "ltr" },
              { text: "الوقت والتاريخ ومعلومات النظام والعمليات", dir: "rtl" },
            ],
            [
              { text: "Communications", dir: "ltr" },
              { text: "send/receive messages, attach shared memory.", dir: "ltr" },
              { text: "تواصل البرامج بالرسائل أو الذاكرة المشتركة", dir: "rtl" },
            ],
            [
              { text: "Protection", dir: "ltr" },
              { text: "control access, get/set permissions, allow/deny users.", dir: "ltr" },
              { text: "تحديد صلاحيات الدخول للملفات والموارد", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "design-structures",
        number: "03",
        titleEn: "Policy vs. Mechanism, OS Structures, Debugging & Boot",
        titleAr: "مبادئ التصميم، الهياكل الستة، الأخطاء والإقلاع",
        cards: [
          {
            term: "Policy vs. Mechanism & Core Dump vs. Crash Dump",
            termAr: "فصل السياسة عن الآلية وأنواع تفريغ الذاكرة",
            badge: "Slides 2.13 & 2.24 · Exam Favorite",
            tone: "mint",
            enSummary:
              "Clean OS design separates WHAT to do from HOW to do it, and uses memory dumps and tracing tools to debug crashes.",
            arSummary:
              "مبدئين مهمين جداً وبييجوا دايماً في الاختياري:",
            points: [
              {
                en: "Policy (WHAT) vs. Mechanism (HOW): Policy decides WHAT will be done (e.g., interrupt every 100s); Mechanism determines HOW to do it (hardware timer) — separating them gives maximum flexibility.",
                ar: "الـ Policy بتحدد «إيه القرار» (What)، والـ Mechanism بتحدد «إزاي يتنفذ» (How) عشان نغيّر القواعد من غير ما نهدّ الكود.",
                tag: "Exam Favorite",
              },
              {
                en: "Core Dump vs. Crash Dump: Core Dump captures memory of a failed USER PROCESS; Crash Dump captures KERNEL MEMORY when the OS itself crashes.",
                ar: "برنامج عادي وقع = Core Dump، النواة (Kernel) نفسها وقعت (شاشة زرقاء) = Crash Dump.",
                tag: "Exam Trap",
              },
              {
                en: "System Boot Sequence: Power On → BIOS/UEFI (in ROM) → Bootloader (e.g., GRUB) → Load OS Kernel into RAM.",
                ar: "خطوات الإقلاع: الباور ← الـ BIOS/UEFI من الـ ROM ← الـ Bootloader زي GRUB ← تحميل النواة في الرام.",
              },
            ],
          },
        ],
        table: {
          titleEn: "Complete Comparison of Operating System Structures (Slides 2.15–2.22)",
          titleAr: "مقارنة هياكل نظم التشغيل",
          headers: [
            { label: "Structure", dir: "ltr" },
            { label: "Design & Examples", dir: "ltr" },
            { label: "Pros", dir: "ltr" },
            { label: "Cons", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Simple / Monolithic", dir: "ltr", highlight: true },
              { text: "Entire OS runs in single kernel space (MS-DOS, Original UNIX, Linux core).", dir: "ltr" },
              { text: "Very fast (minimal overhead).", dir: "ltr" },
              { text: "Hard to maintain; one bug can crash entire OS.", dir: "ltr" },
              { text: "كله في مكان واحد — سريع بس صعب التعديل", dir: "rtl" },
            ],
            [
              { text: "Layered Approach", dir: "ltr" },
              { text: "Layer 0 = Hardware, Layer N = User Interface; each uses only lower layers.", dir: "ltr" },
              { text: "Easy construction & debugging.", dir: "ltr" },
              { text: "Hard to order layers; slower traversing layers.", dir: "ltr" },
              { text: "طبقات فوق بعض — سهل تكتشف الغلط بس أبطأ", dir: "rtl" },
            ],
            [
              { text: "Microkernel", dir: "ltr", highlight: true },
              { text: "Moves non-essential services to User Space (Mach).", dir: "ltr" },
              { text: "Easier to extend/port; more reliable & secure.", dir: "ltr" },
              { text: "Overhead of user-to-kernel message passing.", dir: "ltr" },
              { text: "نواة صغيرة وأأمن بس أبطأ بسبب الرسايل", dir: "rtl" },
            ],
            [
              { text: "Loadable Kernel Modules (LKMs)", dir: "ltr", highlight: true },
              { text: "Core kernel + modules loaded dynamically at runtime (Linux, Solaris).", dir: "ltr" },
              { text: "Flexible like layered + fast like monolithic (no message passing).", dir: "ltr" },
              { text: "Modules execute inside kernel space.", dir: "ltr" },
              { text: "أفضل حل وسط: مرونة وسرعة بدون رسائل", dir: "rtl" },
            ],
            [
              { text: "Hybrid Systems", dir: "ltr" },
              { text: "Combines multiple structures (Windows, macOS XNU, iOS, Android).", dir: "ltr" },
              { text: "Balances speed, security, and usability.", dir: "ltr" },
              { text: "More complex architecture.", dir: "ltr" },
              { text: "خليط من كذا هيكل (كل الأنظمة الحديثة)", dir: "rtl" },
            ],
          ],
        },
      },
    ],
    examTraps: [
      {
        en: "Policy = WHAT will be done  |  Mechanism = HOW to do it.",
        ar: "Policy يعني إيه القرار، Mechanism يعني إزاي يتنفذ.",
      },
      {
        en: "Microkernel's main drawback is performance overhead from user-to-kernel message passing.",
        ar: "عيب الـ Microkernel الأساسي هو البطء بسبب كترة الـ Message Passing.",
      },
      {
        en: "Core Dump = User Process crash  |  Crash Dump = OS Kernel crash.",
        ar: "Core للبرنامج العادي، و Crash للنواة نفسها.",
      },
      {
        en: "Layered Approach: Layer 0 = Hardware  |  Layer N = User Interface.",
        ar: "الطبقة صفر دايماً الهاردوير، والطبقة العليا N هي واجهة المستخدم.",
      },
    ],
  },

  // ==========================================================================
  // CHAPTER 3: PROCESSES
  // ==========================================================================
  {
    lessonId: "22222222-2222-4222-8222-222222222303",
    courseCode: "CS-311",
    chapterNum: 3,
    titleEn: "Chapter 3: Processes, Scheduling & IPC",
    titleAr: "العمليات، الجدولة، والتواصل بين العمليات (IPC)",
    overviewEn:
      "Covers Program vs. Process, the 4 memory sections (Text, Data, Heap, Stack), the 5 Process States, PCB structure, Scheduling Queues & the 3 Schedulers, Context Switch overhead, fork()/exec()/wait() & Zombie/Orphan processes, FCFS vs. SJF Midterm calculations, and IPC.",
    overviewAr:
      "كل نقطة في شابتر 3 وتحتها شرحها بالعامية: البرنامج مقابل العملية، أقسام الذاكرة الأربعة، الحالات الخمسة والـ PCB، المجدولين وعبء التبديل، fork/Zombie/Orphan، مسائل FCFS و SJF، والـ IPC.",
    sections: [
      {
        id: "process-memory",
        number: "01",
        titleEn: "Process Concept, 4 Memory Sections, States & PCB",
        titleAr: "مفهوم العملية، أقسام الذاكرة، الحالات الخمسة والـ PCB",
        flowBanner: {
          labelEn: "5 Process States Lifecycle",
          steps: [
            "New (admitted)",
            "Ready (dispatch)",
            "Running",
            "Waiting (I/O wait)",
            "Terminated (exit)",
          ],
          captionAr:
            "العملية تتولد (New) ← تدخل طابور الجاهزية (Ready) ← تشتغل (Running) ← لو طلبت I/O تستنى (Waiting) وترجع Ready (مش Running مباشرة!) ← وتقفل (Terminated).",
        },
        cards: [
          {
            term: "Program vs. Process & The 4 Memory Sections",
            termAr: "البرنامج مقابل العملية وأقسام الذاكرة الأربعة",
            badge: "Slides 3.4–3.5 · Midterm Q3",
            tone: "brand",
            enSummary:
              "A program is a passive file on disk; once loaded into RAM with a Program Counter it becomes an active Process divided into 4 memory sections.",
            arSummary:
              "البرنامج وهو على الهارد ملف نايم (Passive)؛ أول ما يشتغل في الرام يبقى Process نشط (Active) متقسّم لـ 4 أقسام:",
            points: [
              {
                en: "Text Section: Contains the executable program code (machine instructions).",
                ar: "الـ Text فيه كود البرنامج التنفيذي نفسه.",
              },
              {
                en: "Data Section: Contains global variables and static variables.",
                ar: "الـ Data فيه المتغيرات العامة (Global & Static).",
              },
              {
                en: "Heap: Memory dynamically allocated during run time (grows upward).",
                ar: "الـ Heap للذاكرة الديناميكية اللي بتتحجز وقت التشغيل (زي new / malloc).",
                tag: "Exam Focus",
              },
              {
                en: "Stack: Contains temporary data — function parameters, return addresses, and local variables (grows downward).",
                ar: "الـ Stack للبيانات المؤقتة زي المتغيرات المحلية ومعاملات الدوال وعناوين الرجوع.",
                tag: "Exam Focus",
              },
            ],
          },
          {
            term: "Process Control Block (PCB) & State Transitions",
            termAr: "كتلة التحكم PCB وانتقالات الحالات",
            badge: "Slides 3.6–3.7",
            tone: "mint",
            enSummary:
              "The PCB is the kernel record storing everything needed to pause and resume a process cleanly.",
            arSummary:
              "الـ PCB ده البطاقة الشخصية لكل عملية جوه النظام عشان لما يوقّفها ويشغّل غيرها يرجّعها من نفس السطر بالظبط:",
            points: [
              {
                en: "Inside PCB: Process State, PID, Program Counter (PC), CPU Registers, Scheduling Info (priority), Memory Management Info, Accounting, and I/O Status (open files).",
                ar: "مكونات الـ PCB: حالة العملية، رقمها (PID)، مؤشر السطر الجاي (PC)، سجلات المعالج، الأولوية، جدول الذاكرة، والملفات المفتوحة.",
              },
              {
                en: "Waiting → Ready Transition: When I/O finishes, a process ALWAYS returns to the Ready Queue — NEVER directly to Running!",
                ar: "تريكة امتحان: لما الـ I/O يخلص، العملية بترجع لـ Ready تستنى دورها مش Running على طول.",
                tag: "Exam Trap",
              },
            ],
          },
        ],
      },
      {
        id: "scheduling-operations",
        number: "02",
        titleEn: "Schedulers, Context Switch, fork()/exec() & Scheduling Math",
        titleAr: "المجدولين، التبديل، إنشاء العمليات، ومسائل FCFS و SJF",
        cards: [
          {
            term: "Context Switch, fork()/exec()/wait() & Zombie vs. Orphan",
            termAr: "عبء التبديل وعمليات UNIX والـ Zombie مقابل Orphan",
            badge: "Slides 3.10–3.19 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Switching processes costs pure overhead, while UNIX creates and manages process trees via fork(), exec(), and wait().",
            arSummary:
              "أهم مفاهيم التبديل وإنشاء وإنهاء العمليات اللي بتتكرر في كل امتحان:",
            points: [
              {
                en: "Context Switch: Saving old PCB and loading new PCB — time spent is PURE OVERHEAD (zero useful user work).",
                ar: "الـ Context Switch يُعتبر وقت ضايع صافي (Pure Overhead) لأن الجهاز مش بيعمل أي شغل مفيد للمستخدم أثناء التبديل.",
                tag: "Exam Favorite",
              },
              {
                en: "I/O-Bound vs. CPU-Bound: I/O-bound has many short CPU bursts; CPU-bound has few long CPU bursts. Long-Term Scheduler balances both.",
                ar: "الـ I/O-bound بتقضي أغلب وقتها في أجهزة الإدخال والإخراج، والـ CPU-bound بتقضي وقتها في الحسابات؛ ولازم خليط متوازن بينهم.",
              },
              {
                en: "fork(), exec(), wait(): fork() duplicates the process (returns 0 to Child, Child PID > 0 to Parent); exec() replaces memory with a new program; wait() makes Parent wait for Child.",
                ar: "fork() بترجع 0 للابن ورقم الابن للأب، و exec() بتبدّل البرنامج اللي جوه الابن، و wait() بتخلّي الأب يستنى ابنه.",
                tag: "Exam Trap",
              },
              {
                en: "Zombie vs. Orphan: A Zombie is a terminated child whose parent hasn't called wait() yet; an Orphan is a still-running child whose parent already exited (adopted by init/systemd).",
                ar: "الـ Zombie ابن مات وأبوه لسه مستلمهوش بـ wait()، أما الـ Orphan فابن لسه شغال وأبوه قفل وسابه فـ init بيتبنّاه.",
                tag: "Exam Focus",
              },
            ],
          },
        ],
        table: {
          titleEn: "Comparison of the Three Schedulers (Slides 3.12–3.13)",
          titleAr: "مقارنة المجدولين الثلاثة",
          headers: [
            { label: "Scheduler", dir: "ltr" },
            { label: "Primary Job (English)", dir: "ltr" },
            { label: "Frequency", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Long-Term (Job)", dir: "ltr", highlight: true },
              { text: "Loads processes from disk to RAM; controls Degree of Multiprogramming.", dir: "ltr" },
              { text: "Infrequent (sec/min)", dir: "ltr" },
              { text: "بيحدد كام عملية تدخل الرام (Degree of Multiprogramming)", dir: "rtl" },
            ],
            [
              { text: "Short-Term (CPU)", dir: "ltr", highlight: true },
              { text: "Selects which ready process runs next on CPU.", dir: "ltr" },
              { text: "Very frequent (ms — ultra-fast)", dir: "ltr" },
              { text: "بيختار مين ياخد المعالج دلوقتي حالاً", dir: "rtl" },
            ],
            [
              { text: "Medium-Term", dir: "ltr" },
              { text: "Performs Swapping (moves processes out of RAM to disk and back).", dir: "ltr" },
              { text: "Intermediate", dir: "ltr" },
              { text: "بيعمل Swapping لما الرام تتزحم", dir: "rtl" },
            ],
          ],
        },
        formulas: [
          {
            labelEn: "Midterm CPU Scheduling Formulas & Worked Example (P1=24, P2=3, P3=3 at t=0)",
            formula:
              "TAT = Completion − Arrival  |  WT = TAT − Burst  |  FCFS Avg WT = 17 ms  |  SJF Avg WT = 3 ms",
            workedExampleEn:
              "FCFS runs P1→P2→P3: WT = (0+24+27)/3 = 17 ms (Convoy Effect). SJF runs P2→P3→P1: WT = (0+3+6)/3 = 3 ms (Optimal minimum Avg WT).",
            arNote:
              "في FCFS العملية الطويلة P1 عطّلت القصيرين (Convoy Effect) فالمتوسط طلع 17؛ أما SJF خلّصت القصيرين الأول فنزّلت المتوسط لـ 3 بس!",
          },
        ],
      },
      {
        id: "ipc",
        number: "03",
        titleEn: "Interprocess Communication (IPC)",
        titleAr: "التواصل بين العمليات (IPC)",
        cards: [
          {
            term: "Shared Memory vs. Message Passing, Synchronization, Pipes & Sockets",
            termAr: "طرق التواصل بين العمليات بالتفصيل",
            badge: "Slides 3.23–3.35",
            tone: "brand",
            enSummary:
              "Cooperating processes communicate for Information Sharing, Computation Speedup, Modularity, and Convenience.",
            arSummary:
              "العمليات المتعاونة بتتواصل بواحدة من طريقتين أساسيتين (ذاكرة مشتركة أو رسائل) بالإضافة للـ Pipes والـ Sockets:",
            points: [
              {
                en: "Shared Memory vs. Message Passing: Shared Memory is FASTER (kernel only sets up region; user handles sync); Message Passing uses send()/receive() via kernel (easier for small data & distributed networks).",
                ar: "الـ Shared Memory أسرع بكتير لأن النواة بتتدخل مرة واحدة في الإعداد بس؛ أما الـ Message Passing فأسهل للبيانات الصغيرة والشبكات.",
                tag: "Exam Favorite",
              },
              {
                en: "Direct vs. Indirect Communication: Direct explicitly names processes — send(P, msg); Indirect uses Mailboxes/Ports shared by multiple processes.",
                ar: "Direct يعني تبعت للشخص باسمه مباشرة، Indirect يعني تحط الرسالة في صندوق بريد (Mailbox).",
              },
              {
                en: "Blocking (Synchronous) vs. Non-Blocking (Asynchronous): Blocking sender/receiver waits until transfer completes; Non-blocking continues immediately.",
                ar: "Blocking معناها «قف واستنى»، و Non-Blocking معناها «ابعت وكمّل شغلك فوراً».",
              },
              {
                en: "Buffering Capacities: Zero Capacity = Rendezvous (sender MUST wait); Bounded = fixed queue n; Unbounded = sender never waits.",
                ar: "Zero Capacity اسمها Rendezvous (المرسل لازم يستنى المستلم)، Bounded طابور بحجم ثابت، Unbounded طابور مفتوح.",
                tag: "Exam Focus",
              },
              {
                en: "Ordinary vs. Named Pipes, Sockets & RPC: Ordinary pipes are unidirectional (parent-child only); Named pipes (FIFO) are bidirectional for UNRELATED processes; Socket = IP Address + Port Number; RPC uses Stubs over networks.",
                ar: "الـ Ordinary Pipe اتجاه واحد وللأب والابن بس؛ الـ Named Pipe اتجاهين ولعمليات ملهاش علاقة ببعض؛ والـ Socket = IP + Port.",
              },
            ],
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Heap = dynamically allocated at runtime | Stack = temporary data (params, return addr, locals).",
        ar: "Heap للديناميك وقت التشغيل، Stack للمؤقت، Data للـ globals، Text للكود.",
      },
      {
        en: "Long-Term Scheduler controls Degree of Multiprogramming; Medium-Term performs Swapping.",
        ar: "التحكم في Degree of Multiprogramming وظيفة الـ Long-Term Scheduler.",
      },
      {
        en: "Context Switch time is PURE OVERHEAD (zero useful work while switching).",
        ar: "الـ Context Switch وقت ضايع بالكامل (Pure Overhead).",
      },
      {
        en: "fork() returns 0 to the Child and Child's PID (> 0) to the Parent.",
        ar: "0 راجع للابن (Child) ورقم الابن راجع للأب (Parent).",
      },
      {
        en: "Zombie = terminated child before parent calls wait() | Orphan = running child whose parent exited.",
        ar: "الـ Zombie مات وأبوه لسه مستلمهوش، والـ Orphan عايش وأبوه سابه ومات.",
      },
    ],
  },
];
