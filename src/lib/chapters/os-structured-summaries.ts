import type { StructuredChapterSummary } from "@/types/chapter";

// Detailed, structured bilingual study summaries for Operating Systems (CS-311).
// Strict LTR for all English exam content + clean RTL Egyptian Arabic clarifications.
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
      "الشابتر ده بيأسسك في المادة كلها: يعني إيه نظام تشغيل، إزاي الجهاز بيصحى من الصفر (Bootstrap)، إزاي المعالج بيتعامل مع الأجهزة بالـ Interrupts والـ DMA، هرم الذاكرة ومين بيدير كل مستوى فيه، الفرق بين أنواع المعالجات، وإزاي النظام بيحمي نفسه بالـ Dual-Mode والـ Timer.",
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
            badge: "Core Definition",
            tone: "brand",
            enSummary:
              "A program that acts as an intermediary between a user of a computer and the computer hardware.",
            enBullets: [
              "Executes user programs and makes solving user problems easier.",
              "Makes the computer system convenient to use.",
              "Uses the computer hardware in an efficient manner.",
            ],
            arNote:
              "الوسيط بينك وبين الهاردوير؛ يخليك تستخدم الجهاز بسهولة ومن غير ما تتعامل مع تفاصيل الكهرباء والأصفار والوحايد، وفي نفس الوقت يستغل موارد الجهاز صح.",
          },
          {
            term: "User View vs. System View",
            badge: "Slide 1.5–1.6",
            tone: "neutral",
            enSummary:
              "How we define the OS depends on whether we look from the user's perspective or the hardware's perspective.",
            enBullets: [
              "User View (PC / Mobile): Designed for ease of use, good performance, and battery/usability—not resource sharing.",
              "User View (Shared Mainframe / Server): Must keep all users happy by maximizing resource utilization.",
              "System View — Resource Allocator: Manages all resources (CPU time, memory space, storage, I/O) and resolves conflicting requests fairly.",
              "System View — Control Program: Controls execution of user programs to prevent errors and improper use of the computer.",
            ],
            arNote:
              "بالنسبة للمستخدم العادي المهم السهولة والسرعة؛ أما من ناحية النظام نفسه، الـ OS ليه دورين أساسيين: موزّع موارد (Resource Allocator) وبرنامج تحكم بيمنع البرامج تبوّظ الدنيا (Control Program).",
          },
          {
            term: "The Kernel",
            badge: "Slide 1.8 · Exam Favorite",
            tone: "warm",
            enSummary:
              "The one program running at all times on the computer. Everything else is either a system program or an application program.",
            enBullets: [
              "System Programs: Ship with the OS to support execution (not part of the kernel itself).",
              "Application Programs: All programs not associated with OS operation (browsers, editors, databases).",
              "Middleware (Mobile OS): Extra frameworks providing services to app developers (databases, multimedia, graphics).",
            ],
            arNote:
              "الـ Kernel هو القلب اللي شغال طول ما الجهاز مفتوح؛ وأي برنامج غيره يا إما أداة تبع النظام (System Program) يا إما تطبيق عادي (Application Program).",
          },
          {
            term: "Bootstrap Program (System Startup)",
            badge: "Slide 1.9",
            tone: "mint",
            enSummary:
              "The initial program that runs when a computer is powered up or rebooted.",
            enBullets: [
              "Typically stored in ROM or EPROM, generally known as Firmware (nonvolatile).",
              "Initializes all aspects of the system (CPU registers, device controllers, memory contents).",
              "Locates the OS kernel on storage, loads it into main memory (RAM), and starts its execution.",
            ],
            arNote:
              "ده أول كود بيشتغل لما تدوس زرار الباور؛ متخزّن في ذاكرة ثابتة (ROM/EPROM) مش بتتمسح، وظيفته يجهّز الهاردوير ويحمّل النواة في الرام.",
          },
        ],
      },
      {
        id: "organization-interrupts",
        number: "02",
        titleEn: "Computer-System Organization, Interrupts & DMA",
        titleAr: "تنظيم الحاسب، المقاطعات، والوصول المباشر للذاكرة",
        introEn:
          "Modern computer systems are interrupt-driven: CPUs and device controllers execute concurrently while competing for memory cycles through a shared bus.",
        introAr:
          "المعالج وأجهزة الـ I/O بيشتغلوا في نفس الوقت (Concurrently)، والـ Interrupts هي وسيلة التواصل اللي بتنظم الشغل بينهم من غير ما المعالج يضيع وقته في الانتظار.",
        cards: [
          {
            term: "Device Controller, Local Buffer & Device Driver",
            badge: "Slide 1.10",
            tone: "brand",
            enSummary:
              "Each I/O device type has a dedicated hardware controller with local buffer storage and special-purpose registers.",
            enBullets: [
              "CPU moves data between main memory and local buffers.",
              "I/O moves data between the physical device and the controller's local buffer.",
              "Device Driver: OS software that understands a specific controller and provides a uniform interface to the rest of the OS.",
            ],
            arNote:
              "كل جهاز ليه متحكم هاردوير (Device Controller) ومخزن صغير (Local Buffer)، والـ Device Driver هو المترجم السوفتوير اللي بيخلي نظام التشغيل يفهمه.",
          },
          {
            term: "Hardware Interrupt vs. Trap (Exception)",
            badge: "Slide 1.12 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Interrupts signal events to the CPU so the OS can react immediately.",
            enBullets: [
              "Hardware Interrupt: Triggered by a device controller sending a signal over the system bus when an I/O operation finishes.",
              "Trap / Exception: A software-generated interrupt caused either by an error (division by zero, invalid memory access) or a user request (System Call).",
              "Interrupt Handling: CPU saves its current state (registers + Program Counter), jumps to the Interrupt Service Routine (ISR) via the Interrupt Vector, then resumes.",
            ],
            arNote:
              "فرق مهم جداً في الامتحان: الـ Hardware Interrupt بتيجي من الهاردوير لما يخلص شغل، أما الـ Trap / Exception فمقاطعة برمجية من البرنامج بسبب غلط أو طلب خدمة (System Call).",
          },
          {
            term: "Interrupt Vector vs. Polling",
            badge: "Slide 1.11",
            tone: "neutral",
            enSummary:
              "Two ways the CPU figures out which device caused an interrupt.",
            enBullets: [
              "Polling: CPU checks each device one by one (slower).",
              "Vectored Interrupt System: Uses an Interrupt Vector (array of memory addresses) to jump directly to the exact ISR in O(1).",
            ],
            arNote:
              "بدل ما المعالج يسأل الأجهزة واحد واحد (Polling)، الـ Interrupt Vector بيكون جدول عناوين يودّيه على طول على الدالة الصح.",
          },
          {
            term: "Direct Memory Access (DMA)",
            badge: "Slide 1.16",
            tone: "mint",
            enSummary:
              "Used for high-speed I/O devices able to transmit information close to memory speeds.",
            enBullets: [
              "Device controller transfers an entire block of data directly from its buffer to main memory without CPU intervention.",
              "Generates only ONE interrupt per block instead of one interrupt per byte.",
              "Frees the CPU to execute other programs while the data transfer happens.",
            ],
            arNote:
              "بدل ما المعالج يتعطّل على كل بايت بيتنقل من الهارد للرام، الـ DMA بينقل البلوك كله مباشرة ويبعت مقاطعة واحدة بس في الآخر.",
          },
        ],
      },
      {
        id: "storage-hierarchy",
        number: "03",
        titleEn: "Storage Hierarchy & Caching (Slide 1.29)",
        titleAr: "هرم الذاكرة والتخزين والكاش",
        flowBanner: {
          labelEn: "Top (Fastest · Smallest · Costliest · Volatile)  →  Bottom (Slowest · Largest · Cheapest · Nonvolatile)",
          steps: [
            "Registers",
            "Cache",
            "Main Memory (RAM)",
            "Solid-State Disk (SSD)",
            "Hard Disk (HDD)",
            "Optical / Tape",
          ],
          captionAr:
            "كل ما تنزل لتحت في الهرم: المساحة بتكبر (Capacity ↑)، السعر لكل بت بيقل (Cost ↓)، والسرعة بتقل (Access Time ↑).",
        },
        cards: [
          {
            term: "Main Memory (RAM) vs. Secondary Storage",
            badge: "Slide 1.13–1.14",
            tone: "neutral",
            enSummary:
              "Why computers need both volatile main memory and nonvolatile secondary storage.",
            enBullets: [
              "Main Memory (RAM): Only large storage media the CPU can access directly; Random Access; typically Volatile (loses contents on power loss).",
              "Secondary Storage (HDD / SSD / NVM): Extension of main memory providing large, Nonvolatile permanent storage.",
              "NVM (Non-Volatile Memory / SSD): Faster than magnetic disks and increasingly popular as primary persistent storage.",
            ],
            arNote:
              "الرام سريعة والمعالج بيكلمها مباشرة بس بتتمسح لما الكهربا تفصل (Volatile)، عشان كده محتاجين تخزين دائم زي الـ SSD والـ HDD (Nonvolatile).",
          },
          {
            term: "Caching & Cache Coherency",
            badge: "Slide 1.28–1.30",
            tone: "brand",
            enSummary:
              "Copying information into a faster storage system temporarily; main memory acts as a cache for secondary storage.",
            enBullets: [
              "When data is needed, the system checks the cache first (Cache Hit = fast; Cache Miss = copy from slower level).",
              "Cache Coherency (Multiprocessor): Hardware mechanism ensuring that an update to a value in one CPU's cache is immediately reflected in all other CPUs' caches.",
            ],
            arNote:
              "الـ Caching يعني نخلي البيانات اللي بنستخدمها كتير في مكان أسرع؛ والـ Cache Coherency بيضمن إن لو معالج عدّل قيمة، باقي المعالجات تشوف النسخة الجديدة مش القديمة.",
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
              { text: "أسرع ذاكرة جوه المعالج، الـ Compiler هو اللي بيوزعها", dir: "rtl" },
            ],
            [
              { text: "Level 2", dir: "ltr" },
              { text: "Cache", dir: "ltr" },
              { text: "Volatile", dir: "ltr" },
              { text: "Hardware", dir: "ltr", highlight: true },
              { text: "ذاكرة سريعة جداً بين المعالج والرام، بيديرها الهاردوير تلقائياً", dir: "rtl" },
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
              { text: "Solid-State Disk (SSD)", dir: "ltr" },
              { text: "Nonvolatile", dir: "ltr" },
              { text: "Operating System", dir: "ltr" },
              { text: "تخزين دائم وسريع، يديره نظام التشغيل", dir: "rtl" },
            ],
            [
              { text: "Level 5", dir: "ltr" },
              { text: "Magnetic Disk (HDD)", dir: "ltr" },
              { text: "Nonvolatile", dir: "ltr" },
              { text: "Operating System", dir: "ltr" },
              { text: "تخزين دائم ضخم ورخيص، يديره نظام التشغيل", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "architectures",
        number: "04",
        titleEn: "Computer-System Architectures",
        titleAr: "معماريات أنظمة الحاسب",
        introEn:
          "Systems are classified by the number of general-purpose processors used: Single-Processor, Multiprocessor (SMP/Asymmetric & Multi-core), and Clustered Systems.",
        introAr:
          "الأنظمة بتتقسم حسب عدد المعالجات وإزاي متوصلين ببعض، والفرق بين كل نوع بيجي كتير في أسئلة الـ MCQ.",
        table: {
          titleEn: "Comparison of System Architectures (Slides 1.17–1.20)",
          titleAr: "مقارنة المعماريات الأساسية",
          headers: [
            { label: "Architecture", dir: "ltr" },
            { label: "How It Works (English)", dir: "ltr" },
            { label: "Key Benefit / Detail", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Single-Processor", dir: "ltr" },
              { text: "One main CPU executing a general-purpose instruction set.", dir: "ltr" },
              { text: "May still have special-purpose processors (disk, keyboard).", dir: "ltr" },
              { text: "معالج واحد أساسي شايل تنفيذ البرامج كلها", dir: "rtl" },
            ],
            [
              { text: "Asymmetric Multiprocessing", dir: "ltr" },
              { text: "Boss-worker (master-slave) relationship; each processor is assigned a specific task.", dir: "ltr" },
              { text: "Boss processor schedules and allocates work.", dir: "ltr" },
              { text: "في معالج رئيسي بيوزّع الشغل على باقي المعالجات", dir: "rtl" },
            ],
            [
              { text: "Symmetric Multiprocessing (SMP)", dir: "ltr" },
              { text: "All processors are peers; each runs the OS and shares physical memory.", dir: "ltr" },
              { text: "Increased throughput, economy of scale, graceful degradation.", dir: "ltr", highlight: true },
              { text: "كل المعالجات متساوية ومتشاركين الرام، لو واحد وقع الباقي يكمل", dir: "rtl" },
            ],
            [
              { text: "Multi-Core Systems", dir: "ltr" },
              { text: "Multiple computing cores placed on a single chip.", dir: "ltr" },
              { text: "On-chip communication is faster & uses significantly less power.", dir: "ltr", highlight: true },
              { text: "كذا نواة على نفس الشريحة فبتكون أسرع وأوفر في الكهرباء", dir: "rtl" },
            ],
            [
              { text: "Asymmetric Clustering", dir: "ltr" },
              { text: "Multiple machines coupled via SAN; one machine runs apps while another is in hot-standby mode.", dir: "ltr" },
              { text: "High availability: standby takes over instantly if active fails.", dir: "ltr", highlight: true },
              { text: "جهاز شغال والتاني واقف احتياطي ساخن (hot-standby) يمسك فوراً لو الأول وقع", dir: "rtl" },
            ],
            [
              { text: "Symmetric Clustering", dir: "ltr" },
              { text: "Multiple nodes run applications simultaneously and monitor each other.", dir: "ltr" },
              { text: "More efficient—uses all available hardware.", dir: "ltr" },
              { text: "كل الأجهزة شغالة مع بعض وبتراقب بعض في نفس الوقت", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "operations-protection",
        number: "05",
        titleEn: "OS Operations, Dual-Mode & Timer Protection",
        titleAr: "تشغيل النظام، الوضع المزدوج، والحماية بالمؤقت",
        cards: [
          {
            term: "Multiprogramming vs. Timesharing (Multitasking)",
            badge: "Slide 1.22",
            tone: "brand",
            enSummary:
              "Both keep multiple jobs in memory, but they optimize for different goals.",
            enBullets: [
              "Multiprogramming (Batch): Maximizes CPU utilization. Whenever the running job waits for I/O, the OS switches to another job so the CPU is never idle.",
              "Timesharing (Multitasking): Logical extension where the CPU switches between jobs so frequently that users can interact directly with each program (Response Time < 1 second).",
              "Requires CPU Scheduling, Swapping, and Virtual Memory when processes don't all fit in RAM.",
            ],
            arNote:
              "الـ Multiprogramming هدفه المعالج ميفضلش فاضي أبداً (بيبدّل وقت الـ I/O)، أما الـ Timesharing فبيبدّل بسرعة رهيبة عشان تتفاعل مع البرامج لحظياً (استجابة أقل من ثانية).",
          },
          {
            term: "Dual-Mode Operation (User Mode vs. Kernel Mode)",
            badge: "Slide 1.24 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Hardware provides a Mode Bit to distinguish whether the CPU is executing user code or OS kernel code.",
            flowSteps: [
              "User Process (mode bit = 1)",
              "System Call / Trap",
              "Kernel Mode (mode bit = 0)",
              "Return to User (mode bit = 1)",
            ],
            enBullets: [
              "User Mode (mode bit = 1): Restricted execution; cannot execute privileged instructions directly.",
              "Kernel Mode / Supervisor Mode (mode bit = 0): Full hardware access; can execute Privileged Instructions (I/O control, timer management, interrupt control, switching to user mode).",
              "If a user program attempts a privileged instruction, hardware treats it as illegal and traps it to the OS.",
            ],
            arNote:
              "ده أهم نظام أمان في الهاردوير: البرامج العادية بتشتغل بـ mode bit = 1 وممنوع تلمس الهاردوير؛ ولما تطلب خدمة بنحوّل لـ 0 (Kernel Mode) وننفذها ونرجّعها 1 تاني.",
          },
          {
            term: "Hardware Timer",
            badge: "Slide 1.25",
            tone: "mint",
            enSummary:
              "Prevents a user program from getting stuck in an infinite loop or hogging the CPU indefinitely.",
            enBullets: [
              "OS sets a hardware counter before handing control to a user process.",
              "Every clock tick decrements the counter; when it reaches 0, a hardware interrupt returns control to the OS.",
              "Setting or modifying the timer is strictly a Privileged Instruction (Kernel Mode only).",
            ],
            arNote:
              "عدّاد وقت بيظبطه النظام بأمر محمي (Privileged) عشان لو برنامج علّق في Loop لا نهائي، العداد يصفّر ويسحب المعالج منه غصب عنه.",
          },
          {
            term: "Virtualization & Kernel Data Structures",
            badge: "Slides 1.26–1.27",
            tone: "neutral",
            enSummary:
              "Core software foundations used inside modern operating systems.",
            enBullets: [
              "Virtualization: Allows a single physical machine to run multiple guest OSes concurrently using a Virtual Machine Manager (VMM / Hypervisor).",
              "Common Kernel Data Structures: Singly/Doubly/Circular Linked Lists, Binary Search Trees, Hash Maps, and Bitmaps (strings of n binary digits tracking resource status).",
            ],
            arNote:
              "الـ Virtualization بيخليك تشغّل كذا نظام تشغيل على نفس الجهاز باستخدام Hypervisor، والنواة من جوه مبنية بهياكل بيانات زي Linked Lists و Trees و Bitmaps.",
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
        ar: "أشهر تركة في الشابتر: الـ Registers مش بيديرها الـ OS، بيديرها الـ Compiler، والكاش بيديره الهاردوير.",
      },
      {
        en: "Trap / Exception is a SOFTWARE-generated interrupt, NOT a hardware interrupt.",
        ar: "الـ Trap مقاطعة برمجية (بسبب غلط أو System Call)، مش من جهاز هاردوير.",
      },
      {
        en: "Bootstrap Program lives in ROM/EPROM (Firmware), never in volatile RAM initially.",
        ar: "الـ Bootstrap متخزّن في ROM/EPROM عشان ميتمسحش لما الكهربا تفصل.",
      },
      {
        en: "Asymmetric Clustering keeps one node in hot-standby mode; Symmetric runs apps on all nodes.",
        ar: "كلمة hot-standby mode مرتبطة دايماً بـ Asymmetric Clustering.",
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
      "الشابتر ده بيشرحلك إيه الخدمات اللي نظام التشغيل بيقدمها، إزاي البرامج بتطلب منه خدمات عبر الـ System Calls والـ APIs، الفرق الجوهري بين Policy و Mechanism، ومقارنة الـ 6 هياكل لبناء أنظمة التشغيل (من Monolithic لحد Microkernel و Hybrid).",
    sections: [
      {
        id: "os-services",
        number: "01",
        titleEn: "Operating-System Services",
        titleAr: "خدمات نظام التشغيل",
        introEn:
          "OS services fall into two clean categories: services directly helpful to users, and services ensuring efficient, safe operation of the system itself.",
        introAr:
          "خدمات نظام التشغيل متقسمة نصّين: نص عشان يسهّل حياة المستخدم، ونص عشان يدير الجهاز بكفاءة وأمان.",
        cards: [
          {
            term: "Group A — Services Helpful to the User",
            badge: "6 Core Services",
            tone: "brand",
            enSummary:
              "Functions that make programming and using the computer convenient and reliable.",
            enBullets: [
              "User Interface (UI): CLI (Command-Line / Shell), GUI (desktop/icons), or Touch-Screen.",
              "Program Execution: Load a program into memory, run it, and terminate execution normally or abnormally.",
              "I/O Operations: Safe access to files and hardware devices (users cannot control I/O directly for safety).",
              "File-System Manipulation: Create, delete, read, write, search files/directories, and manage permissions.",
              "Communications: Exchange information between processes via Shared Memory or Message Passing.",
              "Error Detection: Continuously monitor and handle CPU, memory, I/O, and user-program errors.",
            ],
            arNote:
              "دول الخدمات اللي بتتعامل معاهم يومياً كمستخدم: واجهة، تشغيل برامج، طباعة وقراءة أجهزة، إدارة ملفات، تواصل بين البرامج، واكتشاف الأخطاء.",
          },
          {
            term: "Group B — Services for System Efficiency",
            badge: "3 Core Services",
            tone: "mint",
            enSummary:
              "Functions that keep multi-user/multiprogrammed systems fair, tracked, and secure.",
            enBullets: [
              "Resource Allocation: Distribute CPU cycles, RAM, file storage, and I/O fairly among concurrent processes.",
              "Logging / Accounting: Track which users and processes use which resources and how much.",
              "Protection: Ensures all internal access to system resources is strictly controlled.",
              "Security: Defends the system against external unauthorized access via user authentication (passwords, biometrics).",
            ],
            arNote:
              "خلّي بالك من الفرق بين Protection (حماية وتنظيم داخلي بين البرامج والمستخدمين) و Security (حماية من بره زي الباسورد ومنع الاختراق).",
          },
        ],
      },
      {
        id: "ui-syscalls",
        number: "02",
        titleEn: "User Interfaces, System Calls & APIs",
        titleAr: "واجهات المستخدم، استدعاءات النظام، والـ APIs",
        flowBanner: {
          labelEn: "How a User Program Requests a Kernel Service",
          steps: [
            "User Application",
            "Standard API (POSIX / Win32 / Java)",
            "System-Call Interface (Index Table)",
            "Kernel Routine (Mode Bit = 0)",
            "Return Result to User App",
          ],
          captionAr:
            "البرنامج بيكلم الـ API السهل ← الـ API بيبعت رقم الـ System Call للواجهة ← النواة بتدخل Kernel Mode تنفّذ المطلوب وترجّع النتيجة.",
        },
        cards: [
          {
            term: "Command Interpreter (Shell) vs. GUI",
            badge: "Slides 2.4–2.5",
            tone: "neutral",
            enSummary:
              "The two classic ways humans command an operating system.",
            enBullets: [
              "CLI / Shell (bash, zsh, sh): Fetches a command from the user, translates it, and executes it (built-in or external program).",
              "GUI (Graphical User Interface): User-friendly desktop metaphor with windows, icons, mouse/touch gestures (e.g., Windows, macOS Aqua, GNOME/KDE).",
            ],
            arNote:
              "الـ Shell بيترجم وينفّذ الأوامر النصية (موضع سؤال في شيت د. شروق!)، أما الـ GUI فواجهة النوافذ والأيقونات اللي بنستخدمها بالماوس أو اللمس.",
          },
          {
            term: "Why Programmers Prefer APIs Over Direct System Calls",
            badge: "Slide 2.6 · Midterm Q1.10",
            tone: "brand",
            enSummary:
              "Standard APIs (Win32 for Windows, POSIX for UNIX/Linux/macOS, Java API for JVM) wrap low-level system calls.",
            enBullets: [
              "Program Portability: Code written against a standard API compiles and runs on any OS supporting that API.",
              "Simplicity: Actual system calls are more detailed and harder to work with directly.",
              "Run-Time Support Library maps each API call to the corresponding OS system-call number.",
            ],
            arNote:
              "بنكتب كودنا على API زي POSIX أو Win32 عشان سببَين: الكود يشتغل على كذا جهاز بسهولة (Portability) وأبسط بكتير من استدعاء النواة مباشرة.",
          },
          {
            term: "Three Methods to Pass Parameters to the OS",
            badge: "Slide 2.9 · Exam Favorite",
            tone: "warm",
            enSummary:
              "When invoking a system call, extra data (like filename or buffer size) must be passed to the kernel.",
            enBullets: [
              "1. Registers: Simplest and fastest, but fails if there are more parameters than available CPU registers.",
              "2. Block or Table in Memory: Store parameters in memory and pass only the starting address in a register (used by Linux and Solaris—no limit on count/length).",
              "3. Stack: Program pushes parameters onto the stack; the OS pops them off (also no limit on count/length).",
            ],
            arNote:
              "تلات طرق نبعت بيهم البيانات للنواة: في الـ Registers لو قليلين، أو في Block/Table في الرام ونبعت عنوانها في Register (زي Linux)، أو نحطهم على الـ Stack.",
          },
          {
            term: "System Programs, Linkers & Loaders",
            badge: "Slides 2.11–2.12",
            tone: "neutral",
            enSummary:
              "System utilities provide a convenient environment for program development and execution.",
            enBullets: [
              "Categories: File management, status info, file modification (editors), programming-language support (compilers/debuggers), program loading, communications, background services (daemons).",
              "Linker: Combines relocatable object files and libraries into a single binary executable.",
              "Loader: Brings the executable file into main memory so it can run on the CPU.",
            ],
            arNote:
              "الـ Linker بيجمّع ملفات الكود والمكتبات في ملف تنفيذي واحد، والـ Loader هو اللي بيرفعه للرام عشان يشتغل.",
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
              { text: "create/terminate process, load, execute, wait, allocate/free memory, dump memory on error.", dir: "ltr" },
              { text: "إنشاء وتشغيل وإيقاف العمليات وحجز الذاكرة ليها", dir: "rtl" },
            ],
            [
              { text: "File Management", dir: "ltr" },
              { text: "create, delete, open, close, read, write, reposition, get/set file attributes.", dir: "ltr" },
              { text: "التعامل مع الملفات قراءة وكتابة وحذف وتعديل خصائصها", dir: "rtl" },
            ],
            [
              { text: "Device Management", dir: "ltr" },
              { text: "request device, release device, read, write, logically attach/detach devices.", dir: "ltr" },
              { text: "حجز جهاز I/O واستخدامه وبعدين تحريره لغيرك", dir: "rtl" },
            ],
            [
              { text: "Information Maintenance", dir: "ltr" },
              { text: "get/set time or date, get system data, get/set process/file/device attributes.", dir: "ltr" },
              { text: "معرفة الوقت والتاريخ ومعلومات النظام والعمليات", dir: "rtl" },
            ],
            [
              { text: "Communications", dir: "ltr" },
              { text: "create/delete connection, send/receive messages (Message Passing), attach shared memory.", dir: "ltr" },
              { text: "تواصل البرامج مع بعضها بالرسائل أو الذاكرة المشتركة", dir: "rtl" },
            ],
            [
              { text: "Protection", dir: "ltr" },
              { text: "control access to resources, get/set permissions, allow/deny user access.", dir: "ltr" },
              { text: "تحديد صلاحيات مين يقدر يدخل على الملفات والموارد", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "design-structures",
        number: "03",
        titleEn: "Design Principles & The 6 OS Structures",
        titleAr: "مبادئ التصميم والهياكل الستة لنظم التشغيل",
        cards: [
          {
            term: "Separating Policy from Mechanism",
            badge: "Slide 2.13 · Exam Favorite",
            tone: "warm",
            enSummary:
              "One of the most important principles in operating-system design for maximum flexibility.",
            enBullets: [
              "Policy: Defines WHAT will be done (e.g., 'interrupt every 100 seconds to protect CPU').",
              "Mechanism: Defines HOW to do it (e.g., 'use a hardware timer construct').",
              "Benefit: Allows policy decisions to be changed later without rewriting the underlying mechanism.",
            ],
            arNote:
              "احفظها كده: Policy = WHAT (إيه القرار)، و Mechanism = HOW (إزاي هننفذه)؛ فصلهم بيخليك تغيّر القواعد مستقبلاً من غير ما تهدّ البناء الأساسي.",
          },
          {
            term: "User Goals vs. System Goals",
            badge: "Slide 2.13",
            tone: "neutral",
            enSummary:
              "Two sets of design targets that OS architects must balance.",
            enBullets: [
              "User Goals: OS should be convenient to use, easy to learn, reliable, safe, and fast.",
              "System Goals: OS should be easy to design, implement, and maintain, as well as flexible, reliable, error-free, and efficient.",
            ],
            arNote:
              "أهداف المستخدم (سهل وسريع وآمن) وأهداف مصمم النظام (سهل يتبرمج ويتعدل ويتصان).",
          },
        ],
        table: {
          titleEn: "Complete Comparison of Operating System Structures (Slides 2.15–2.22)",
          titleAr: "مقارنة الهياكل الستة لنظام التشغيل",
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
              { text: "Entire OS runs in a single kernel address space (MS-DOS, Original UNIX, Linux core).", dir: "ltr" },
              { text: "Very high performance (minimal syscall overhead).", dir: "ltr" },
              { text: "Hard to implement/maintain; one bug can crash entire OS.", dir: "ltr" },
              { text: "كله في مكان واحد؛ سريع جداً بس صعب يتعدل وأي غلطة توقّع النظام", dir: "rtl" },
            ],
            [
              { text: "Layered Approach", dir: "ltr" },
              { text: "Divided into N layers: Layer 0 = Hardware, Layer N = User Interface. Each uses only lower layers.", dir: "ltr" },
              { text: "Simple construction & easy debugging/verification.", dir: "ltr" },
              { text: "Hard to define layer order cleanly; slower traversing layers.", dir: "ltr" },
              { text: "طبقات فوق بعض؛ سهل تكتشف الغلط بس أبطأ شوية", dir: "rtl" },
            ],
            [
              { text: "Microkernel", dir: "ltr", highlight: true },
              { text: "Moves non-essential services to User Space; tiny kernel handles minimal IPC/memory/CPU (Mach).", dir: "ltr" },
              { text: "Easier to extend & port; more reliable & secure.", dir: "ltr" },
              { text: "Performance overhead of user-to-kernel message passing.", dir: "ltr" },
              { text: "نواة صغيرة والباقي بره؛ أأمن وأسهل في التوسيع بس أبطأ بسبب الرسايل", dir: "rtl" },
            ],
            [
              { text: "Loadable Kernel Modules (LKMs)", dir: "ltr", highlight: true },
              { text: "Object-oriented core kernel + modules loaded dynamically at runtime (Linux, Solaris).", dir: "ltr" },
              { text: "Flexible like layered + fast like monolithic (no message passing).", dir: "ltr" },
              { text: "Modules still execute inside kernel space.", dir: "ltr" },
              { text: "أحسن حل وسط: إضافات بتتحمّل وقت الحاجة وبنفس سرعة الـ Monolithic", dir: "rtl" },
            ],
            [
              { text: "Hybrid Systems", dir: "ltr" },
              { text: "Combines multiple approaches (Windows, macOS XNU, iOS, Android).", dir: "ltr" },
              { text: "Balances performance, security, and usability in real-world OSes.", dir: "ltr" },
              { text: "More complex overall architecture.", dir: "ltr" },
              { text: "خليط من كذا هيكل، وده اللي شغالة بيه الأنظمة الحديثة فعلياً", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "debugging-boot",
        number: "04",
        titleEn: "OS Debugging & System Boot",
        titleAr: "اكتشاف الأخطاء وإقلاع النظام",
        flowBanner: {
          labelEn: "System Boot Sequence",
          steps: [
            "Power On",
            "BIOS / UEFI (in ROM)",
            "Bootloader (e.g., GRUB)",
            "Load OS Kernel into RAM",
            "Start System Services",
          ],
          captionAr:
            "خطوات تشغيل الجهاز: الباور يشتغل ← الـ BIOS/UEFI يصحى من الـ ROM ← يشغّل الـ Bootloader (زي GRUB) ← يحمّل النواة في الرام.",
        },
        cards: [
          {
            term: "Core Dump vs. Crash Dump",
            badge: "Slide 2.24 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Diagnostic memory snapshots generated when software fails.",
            enBullets: [
              "Core Dump: Captures the memory of a USER PROCESS when an application fails/crashes.",
              "Crash Dump: Captures KERNEL MEMORY when the operating system kernel itself fails (e.g., Blue Screen / Kernel Panic).",
              "Log Files: Record error information for administrators to diagnose failures.",
            ],
            arNote:
              "فرق مهم جداً: برنامج عادي وقع = Core Dump، النواة (Kernel) نفسها وقعت = Crash Dump.",
          },
          {
            term: "Performance Tuning & Tracing Tools",
            badge: "Slide 2.24",
            tone: "mint",
            enSummary:
              "Tools used to monitor bottlenecks and trace execution across user & kernel space.",
            enBullets: [
              "System Monitors: Windows Task Manager, UNIX top command.",
              "Tracing Tools: DTrace, strace (traces system calls), perf, and BCC/eBPF on Linux.",
            ],
            arNote:
              "أدوات زي Task Manager و top و strace بتساعد المهندس يعرف إيه البرنامج اللي خانق المعالج أو الرام.",
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Policy = WHAT will be done  |  Mechanism = HOW to do it.",
        ar: "دايماً بيجي اختياري: Policy يعني إيه اللي هيتعمل، Mechanism يعني إزاي يتعمل.",
      },
      {
        en: "Standard APIs = POSIX API, Win32 API, Java API (NOT BIOS or GRUB!).",
        ar: "الـ BIOS والـ GRUB تبع الإقلاع، أما POSIX و Win32 و Java فدول Standard APIs.",
      },
      {
        en: "Microkernel's main drawback is performance overhead from user-to-kernel message passing.",
        ar: "رغم إن الـ Microkernel أأمن وأسهل في التوسيع، عيبه الأساسي البطء بسبب كترة الـ Message Passing.",
      },
      {
        en: "LKMs (Loadable Kernel Modules) avoid message passing because modules communicate directly inside kernel space.",
        ar: "الـ LKMs أسرع من الـ Microkernel لأن الموديولز بتتكلم مع بعض جوه النواة مباشرة.",
      },
      {
        en: "Core Dump = User Process crash  |  Crash Dump = OS Kernel crash.",
        ar: "متلخبطش بينهم: Core للبرنامج العادي، و Crash للنواة نفسها.",
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
      "Covers Program vs. Process, the 4 memory sections (Text, Data, Heap, Stack), the 5 Process States, PCB structure, Scheduling Queues & the 3 Schedulers, Context Switch overhead, fork()/exec()/wait() & Zombie/Orphan processes, FCFS vs. SJF Midterm calculations, and IPC (Shared Memory, Message Passing, Pipes, Sockets, RPC).",
    overviewAr:
      "ده من أهم شباتر الميدتيرم والفاينال: الفرق بين البرنامج والعملية، أقسام الذاكرة الأربعة، حالات العملية الخمسة والـ PCB، أنواع المجدولين وعبء الـ Context Switch، عمليات إنشاء وإنهاء العمليات (fork/Zombie/Orphan)، مسائل حساب FCFS و SJF، وكل طرق التواصل بين العمليات (IPC).",
    sections: [
      {
        id: "process-memory",
        number: "01",
        titleEn: "Process Concept & Memory Layout",
        titleAr: "مفهوم العملية وأقسامها في الذاكرة",
        cards: [
          {
            term: "Program vs. Process",
            badge: "Slide 3.4",
            tone: "brand",
            enSummary:
              "A process is a program in execution; its execution must progress in a sequential fashion.",
            enBullets: [
              "Program: A passive entity stored on disk (an executable file).",
              "Process: An active entity loaded into memory with a Program Counter and allocated resources.",
              "A single program can become several separate processes (e.g., opening multiple browser windows).",
              "Terminology: Batch systems call them 'jobs'; Time-shared systems call them 'user programs' or 'tasks'.",
            ],
            arNote:
              "البرنامج وهو على الهارد ملف نايم (Passive)؛ أول ما تشغّله ويدخل الرام يبقى Process نشط (Active)، وممكن نفس البرنامج يتفتح منه كذا Process في نفس الوقت.",
          },
          {
            term: "Four Sections of a Process in Memory",
            badge: "Midterm Q3 · Must Memorize",
            tone: "warm",
            enSummary:
              "Every process's address space in RAM is divided into four distinct sections.",
            enBullets: [
              "Text Section: Contains the executable program code (machine instructions).",
              "Data Section: Contains global variables and static variables.",
              "Heap: Memory that is dynamically allocated during run time (grows upward).",
              "Stack: Contains temporary data—function parameters, return addresses, and local variables (grows downward).",
            ],
            arNote:
              "سؤال ميدتيرم مضمون: Text للكود، Data للمتغيرات العامة، Heap للذاكرة الديناميكية وقت التشغيل، و Stack للبيانات المؤقتة زي المتغيرات المحلية والـ Parameters.",
          },
        ],
      },
      {
        id: "states-pcb",
        number: "02",
        titleEn: "Process States & Process Control Block (PCB)",
        titleAr: "حالات العملية الخمسة وكتلة التحكم PCB",
        flowBanner: {
          labelEn: "Process State Lifecycle",
          steps: [
            "New (admitted)",
            "Ready (scheduler dispatch)",
            "Running",
            "Waiting (I/O or event wait)",
            "Terminated (exit)",
          ],
          captionAr:
            "العملية تتولد (New) ← تدخل طابور الجاهزية (Ready) ← تشتغل على المعالج (Running) ← لو طلبت I/O تستنى (Waiting) وترجع Ready ← ولما تخلص تقفل (Terminated).",
        },
        cards: [
          {
            term: "Key State Transitions",
            badge: "Slide 3.6",
            tone: "brand",
            enSummary:
              "Only ONE process can be Running on a single CPU core at any instant, while many can be Ready or Waiting.",
            enBullets: [
              "Running → Ready: Happens on a Timer Interrupt (time slice expired / preemption).",
              "Running → Waiting: Happens when the process requests I/O or waits for an event.",
              "Waiting → Ready: Happens once the I/O operation or awaited event completes (NEVER directly to Running!).",
              "Running → Terminated: Process finishes execution via exit() or is aborted.",
            ],
            arNote:
              "خلّي بالك: لما الـ I/O يخلص العملية بترجع لـ Ready مش Running مباشرة! ولازم تستنى دورها في الـ Ready Queue تاني.",
          },
          {
            term: "Process Control Block (PCB / Task Control Block)",
            badge: "Slide 3.7",
            tone: "mint",
            enSummary:
              "The kernel data structure that represents each process and stores all state needed to pause and resume it.",
            enBullets: [
              "Process State (new, ready, running, waiting, halted) & Process Number (PID).",
              "Program Counter (PC): Address of the next instruction to execute.",
              "CPU Registers: Accumulators, index registers, stack pointers, general-purpose registers.",
              "CPU-Scheduling Info (priority, queue pointers), Memory-Management Info (page tables), Accounting Info, and I/O Status Info (open files).",
            ],
            arNote:
              "الـ PCB ده البطاقة الشخصية لكل عملية جوه النظام؛ فيها كل تفاصيلها عشان لما النظام يوقّفها ويشغّل غيرها، يعرف يرجّعها من نفس السطر بالظبط.",
          },
        ],
      },
      {
        id: "scheduling-context-switch",
        number: "03",
        titleEn: "Scheduling Queues, Schedulers & Context Switch",
        titleAr: "طوابير الجدولة، أنواع المجدولين، والتبديل",
        cards: [
          {
            term: "Three Process Scheduling Queues",
            badge: "Slide 3.11",
            tone: "neutral",
            enSummary:
              "Processes migrate among linked-list queues of PCBs throughout their lifetime.",
            enBullets: [
              "Job Queue: Set of all processes currently in the system.",
              "Ready Queue: Set of all processes residing in main memory, ready and waiting to execute.",
              "Device (Wait) Queues: Set of processes waiting for a specific I/O device.",
            ],
            arNote:
              "كل الطوابير دي عبارة عن Linked Lists من الـ PCBs؛ الجاهز للتنفيذ في Ready Queue واللي مستني جهاز في Device Queue.",
          },
          {
            term: "Context Switch (Pure Overhead)",
            badge: "Slide 3.10 · Exam Favorite",
            tone: "warm",
            enSummary:
              "Switching the CPU from one process to another requires saving the old process's state into its PCB and loading the new process's saved state from its PCB.",
            enBullets: [
              "Context-switch time is PURE OVERHEAD because the system does NO useful work while switching.",
              "More complex OS and PCB → longer context-switch time.",
              "Speed depends heavily on hardware support (e.g., multiple sets of registers per CPU).",
            ],
            arNote:
              "احفظ الجملة دي زي اسمك: الـ Context Switch يُعتبر عبء صافي (Pure Overhead) لأن الجهاز مش بيعمل أي شغل مفيد للمستخدم أثناء التبديل.",
          },
          {
            term: "I/O-Bound vs. CPU-Bound Processes",
            badge: "Slide 3.12",
            tone: "brand",
            enSummary:
              "The Long-Term Scheduler should select a balanced mix of both process types.",
            enBullets: [
              "I/O-Bound Process: Spends more time doing I/O than computations; has many short CPU bursts.",
              "CPU-Bound Process: Spends more time doing computations; has few very long CPU bursts.",
              "Good Mix Goal: Keeps both the CPU and I/O devices busy simultaneously (prevents idle queues).",
            ],
            arNote:
              "لو كل العمليات I/O-bound المعالج هيفضل فاضي، ولو كلهم CPU-bound أجهزة الـ I/O هتفضل فاضية؛ عشان كده لازم خليط متوازن بينهم.",
          },
        ],
        table: {
          titleEn: "Comparison of the Three Schedulers (Slides 3.12–3.13)",
          titleAr: "مقارنة المجدولين الثلاثة",
          headers: [
            { label: "Scheduler", dir: "ltr" },
            { label: "Primary Job (English)", dir: "ltr" },
            { label: "Frequency / Speed", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Long-Term (Job Scheduler)", dir: "ltr", highlight: true },
              { text: "Selects processes from disk to load into memory; controls the Degree of Multiprogramming.", dir: "ltr" },
              { text: "Infrequent (seconds/minutes) — can be slower.", dir: "ltr" },
              { text: "بيحدد كام عملية تدخل الرام (Degree of Multiprogramming)", dir: "rtl" },
            ],
            [
              { text: "Short-Term (CPU Scheduler)", dir: "ltr", highlight: true },
              { text: "Selects which ready process gets the CPU next (Dispatcher hands over control).", dir: "ltr" },
              { text: "Very frequent (milliseconds) — MUST be ultra-fast.", dir: "ltr" },
              { text: "بيختار مين ياخد المعالج دلوقتي حالاً، فلازم يكون سريع جداً", dir: "rtl" },
            ],
            [
              { text: "Medium-Term Scheduler", dir: "ltr" },
              { text: "Performs Swapping: moves processes temporarily out of RAM to disk and back later.", dir: "ltr" },
              { text: "Intermediate — reduces memory load when overcrowded.", dir: "ltr" },
              { text: "بيعمل Swapping عشان يريّح الرام لما تتزحم ويرجّع العمليات تاني", dir: "rtl" },
            ],
          ],
        },
      },
      {
        id: "operations-processes",
        number: "04",
        titleEn: "Operations on Processes: Creation & Termination",
        titleAr: "إنشاء وإنهاء العمليات (fork, exec, Zombie & Orphan)",
        cards: [
          {
            term: "UNIX Process Creation: fork(), exec(), wait()",
            badge: "Slide 3.17 · Exam Favorite",
            tone: "brand",
            enSummary:
              "Parent processes create child processes forming a tree of processes, each identified by a unique PID.",
            enBullets: [
              "fork(): Creates a duplicate child process. Returns 0 to the child, returns the Child's PID (> 0) to the parent, and returns < 0 on failure.",
              "exec(): Replaces the calling process's memory space with a completely new program.",
              "wait(): Causes the parent to wait until its child terminates and collects the child's exit status.",
              "Resource Sharing Options: Parent & children share all resources, share a subset, or share none.",
            ],
            arNote:
              "دايماً بيجي في الامتحان: fork() بترجع 0 للابن و Child PID للأب، و exec() بتغيّر البرنامج اللي جوه الابن، و wait() بتخلي الأب يستنى ابنه يخلص.",
          },
          {
            term: "Process Termination, Zombie & Orphan",
            badge: "Slide 3.19",
            tone: "warm",
            enSummary:
              "Processes end via exit() (normal) or abort() (forced by parent when child exceeds resources or is no longer needed).",
            enBullets: [
              "Cascading Termination: In some OSes, if a parent terminates, ALL its children are automatically terminated by the OS.",
              "Zombie Process: A child that has terminated, but its parent has NOT yet called wait() (entry stays in the process table).",
              "Orphan Process: A child still running after its parent terminated without invoking wait() (adopted by init / systemd in UNIX/Linux).",
            ],
            arNote:
              "الفرق بينهم سهل: الـ Zombie ابن مات ولسه أبوه معملش wait()، أما الـ Orphan فابن لسه شغال وأبوه قفل وسابه فـ init بيتبنّاه.",
          },
        ],
      },
      {
        id: "cpu-scheduling-math",
        number: "05",
        titleEn: "CPU Scheduling Calculations (FCFS vs. SJF)",
        titleAr: "مسائل جدولة المعالج (الميدتيرم)",
        formulas: [
          {
            labelEn: "Core Scheduling Formulas",
            formula: "TAT = Completion − Arrival   |   WT = TAT − Burst",
            workedExampleEn:
              "When all processes arrive at t = 0: Waiting Time = Start Time, and Average Waiting Time = (Σ WT) / n.",
            arNote:
              "الـ Turnaround Time هو إجمالي الوقت من لحظة الوصول لحد ما العملية خلصت؛ والـ Waiting Time هو الوقت اللي استنته بس من غير وقت شغلها.",
          },
          {
            labelEn: "Midterm Q9 Worked Example: P1(24), P2(3), P3(3) at t = 0",
            formula: "FCFS Avg WT = (0 + 24 + 27)/3 = 17 ms  |  SJF Avg WT = (0 + 3 + 6)/3 = 3 ms",
            workedExampleEn:
              "FCFS suffers from the Convoy Effect (short jobs stuck behind P1=24). SJF executes shortest jobs first (P2 → P3 → P1) and achieves optimal minimum Average Waiting Time.",
            arNote:
              "في FCFS العملية الطويلة P1 عطّلت القصيرين (Convoy Effect) فالمتوسط طلع 17؛ أما SJF خلّصت القصيرين الأول فنزلت المتوسط لـ 3 بس!",
          },
        ],
      },
      {
        id: "ipc",
        number: "06",
        titleEn: "Interprocess Communication (IPC)",
        titleAr: "التواصل بين العمليات (IPC)",
        introEn:
          "Cooperating processes share data for four reasons: Information Sharing, Computation Speedup, Modularity, and Convenience.",
        introAr:
          "العمليات المتعاونة بتحتاج تتواصل مع بعض لـ 4 أسباب: مشاركة بيانات، تسريع الحسابات، تقسيم النظام لوحدات، وراحة المستخدم.",
        table: {
          titleEn: "Shared Memory vs. Message Passing (Slide 3.23)",
          titleAr: "مقارنة نموذجي التواصل بين العمليات",
          headers: [
            { label: "Feature", dir: "ltr" },
            { label: "Shared Memory", dir: "ltr" },
            { label: "Message Passing", dir: "ltr" },
            { label: "ببساطة", dir: "rtl" },
          ],
          rows: [
            [
              { text: "Mechanism", dir: "ltr" },
              { text: "Processes read/write directly to a shared RAM region.", dir: "ltr" },
              { text: "Processes exchange messages via send() and receive() through the Kernel.", dir: "ltr" },
              { text: "الأول أوضة ذاكرة مشتركة، والتاني رسائل عبر النواة", dir: "rtl" },
            ],
            [
              { text: "Speed", dir: "ltr" },
              { text: "FASTER — OS only sets up the region; transfers run at memory speed.", dir: "ltr", highlight: true },
              { text: "Slower — requires kernel system calls for every message.", dir: "ltr" },
              { text: "الـ Shared Memory أسرع بكتير لأنه مش محتاج النواة في كل نقلة", dir: "rtl" },
            ],
            [
              { text: "Best Use Case", dir: "ltr" },
              { text: "Large amounts of data on the same machine.", dir: "ltr" },
              { text: "Smaller data, easier to implement, and distributed/networked systems.", dir: "ltr" },
              { text: "الرسائل أسهل للبيانات الصغيرة والأنظمة الموزعة على الشبكة", dir: "rtl" },
            ],
            [
              { text: "Synchronization", dir: "ltr" },
              { text: "Must be handled manually by the user processes.", dir: "ltr" },
              { text: "Managed cleanly by the OS kernel (no conflicts).", dir: "ltr" },
              { text: "في الذاكرة المشتركة المبرمج لازم ينظم الدخول عشان البيانات متتلخبطش", dir: "rtl" },
            ],
          ],
        },
        cards: [
          {
            term: "Direct vs. Indirect Communication & Synchronization",
            badge: "Slides 3.27–3.29",
            tone: "brand",
            enSummary:
              "Key naming and blocking properties of Message Passing.",
            enBullets: [
              "Direct: Processes explicitly name each other — send(P, msg) and receive(Q, msg); exactly 1 link per pair.",
              "Indirect: Messages go through Mailboxes / Ports — multiple processes can share a mailbox.",
              "Blocking (Synchronous): Sender blocks until message is received; Receiver blocks until a message is available.",
              "Non-Blocking (Asynchronous): Sender sends and continues immediately; Receiver gets either a valid message or null.",
            ],
            arNote:
              "Direct يعني تبعت للشخص باسمه، Indirect يعني تحط الرسالة في صندوق بريد (Mailbox). و Blocking معناها «استنى»، و Non-Blocking معناها «كمّل شغلك».",
          },
          {
            term: "Buffering, Pipes, Sockets & RPC",
            badge: "Slides 3.30–3.35",
            tone: "mint",
            enSummary:
              "Buffering capacities and real-world IPC mechanisms.",
            enBullets: [
              "Buffering: Zero Capacity (Rendezvous—sender must wait), Bounded Capacity (fixed queue n), Unbounded Capacity (sender never waits).",
              "Ordinary Pipes: Unidirectional, require a Parent-Child relationship, vanish when processes finish.",
              "Named Pipes (FIFO): Bidirectional, allow UNRELATED processes, persist as filesystem entries.",
              "Sockets: Endpoints for network communication identified by IP Address + Port Number (e.g., 161.25.19.8:1625).",
              "RPC (Remote Procedure Call): Abstracts procedure calls across networked systems using client/server Stubs.",
            ],
            arNote:
              "أشهر الفروق في الامتحان: Zero Capacity = Rendezvous، الـ Named Pipe بتشتغل بين عمليات ملهاش علاقة ببعض وفي الاتجاهين، والـ Socket = IP + Port.",
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Heap = dynamically allocated at runtime | Stack = temporary data (params, return addr, locals).",
        ar: "لازم تفرق بين الـ 4 أقسام: Heap للديناميك، Stack للمؤقت، Data للـ globals، Text للكود.",
      },
      {
        en: "Long-Term Scheduler controls the Degree of Multiprogramming; Medium-Term performs Swapping.",
        ar: "سؤال متكرر: التحكم في Degree of Multiprogramming وظيفة الـ Long-Term Scheduler.",
      },
      {
        en: "Context Switch time is PURE OVERHEAD (zero useful work is performed while switching).",
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
      {
        en: "Shared Memory is faster than Message Passing because the kernel is only involved during setup.",
        ar: "الذاكرة المشتركة أسرع لأن تدخل النواة بيحصل مرة واحدة بس في البداية.",
      },
    ],
  },
];
