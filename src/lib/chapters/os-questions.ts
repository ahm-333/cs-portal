import type { Question } from "@/types/database";

// Expanded Operating Systems (CS-311) exam bank: 45 verified questions (15 per chapter).
// Combines all original chapter slide questions + additional high-yield Midterm & Final questions.
export const OS_QUESTIONS: Question[] = [
  // ==========================================================================
  // Chapter 1: Introduction (15 Questions)
  // ==========================================================================
  {
    id: "44444444-4444-4444-8444-444444444601",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "Which program is described as 'the one program running at all times on the computer'? (Slide 1.8)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Bootstrap program",
      "The Kernel",
      "Compiler",
      "Device driver",
    ],
    correct_index: 1,
    explanation:
      "الـ Kernel (النواة) هو البرنامج الوحيد اللي بيفضل شغال طول الوقت على الجهاز، وأي حاجة غيره إما System Program أو Application Program.",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444602",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "Where is the bootstrap program typically stored? (Slide 1.9)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Main memory (RAM)",
      "CPU Registers",
      "ROM or EPROM (Firmware)",
      "Cache memory",
    ],
    correct_index: 2,
    explanation:
      "الـ Bootstrap بيتخزن في ROM أو EPROM (Firmware) لأنها ذاكرة ثابتة غير متطايرة (Nonvolatile) مش بتتمسح لما الكهربا تفصل.",
    order_index: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444603",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "A software-generated interrupt caused either by an error or a user request is called a: (Slide 1.12)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Device controller",
      "Trap or exception",
      "Interrupt vector",
      "Local buffer",
    ],
    correct_index: 1,
    explanation:
      "المقاطعة البرمجية (Software-generated interrupt) اسمها Trap أو Exception، وبتحصل يا إما بسبب خطأ زي القسمة على صفر أو لما البرنامج يطلب System Call.",
    order_index: 3,
  },
  {
    id: "44444444-4444-4444-8444-444444444604",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "In Slide 1.29, Level 1 Registers and Level 2 Cache are managed by: (Slide 1.29)",
    code_snippet: null,
    code_lang: null,
    options: [
      "OS and OS",
      "Compiler and Hardware",
      "Hardware and Compiler",
      "User and Disk Controller",
    ],
    correct_index: 1,
    explanation:
      "في جدول Slide 1.29 الشهير: الـ Registers بيديرها الـ Compiler، والـ Cache بيديره الـ Hardware، بينما RAM والـ SSD والـ Disk بيديرهم نظام التشغيل (OS).",
    order_index: 4,
  },
  {
    id: "44444444-4444-4444-8444-444444444605",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "In a clustered system, which mode keeps one machine in hot-standby mode? (Slide 1.20)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Symmetric clustering",
      "Asymmetric clustering",
      "SMP",
      "Timesharing",
    ],
    correct_index: 1,
    explanation:
      "في الـ Asymmetric clustering بيكون في جهاز شغال والتاني واقف في وضع الاستعداد الساخن (hot-standby mode) عشان يمسك مكانه فوراً لو وقع.",
    order_index: 5,
  },
  {
    id: "44444444-4444-4444-8444-444444444606",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "What is the mode bit value in Kernel Mode, and what type of instruction sets the timer? (Slide 1.25)",
    code_snippet: null,
    code_lang: null,
    options: [
      "1; User instruction",
      "0; Privileged instruction",
      "0; User instruction",
      "1; Privileged instruction",
    ],
    correct_index: 1,
    explanation:
      "في Kernel Mode بتكون قيمة الـ mode bit = 0 (أما User Mode = 1)، وضبط المؤقت (Timer) أمر محمي (Privileged instruction) للنواة فقط.",
    order_index: 6,
  },
  {
    id: "44444444-4444-4444-8444-444444444607",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "From the system's point of view, the Operating System is primarily viewed as a:",
    code_snippet: null,
    code_lang: null,
    options: [
      "Compiler and Text Editor",
      "Resource Allocator and Control Program",
      "Hardware Controller and Cache Manager",
      "User Interface and Web Browser",
    ],
    correct_index: 1,
    explanation:
      "من وجهة نظر النظام (System View)، نظام التشغيل بيشتغل كـ Resource Allocator (موزّع موارد) و Control Program (برنامج تحكم بيمنع الأخطاء).",
    order_index: 7,
  },
  {
    id: "44444444-4444-4444-8444-444444444608",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "What is the primary advantage of DMA (Direct Memory Access) for high-speed I/O devices?",
    code_snippet: null,
    code_lang: null,
    options: [
      "It eliminates the need for RAM",
      "It generates one interrupt per block instead of one interrupt per byte",
      "It replaces the Operating System kernel",
      "It allows user programs to run privileged instructions",
    ],
    correct_index: 1,
    explanation:
      "الـ DMA بينقل بلوك كامل من البيانات مباشرة بين جهاز الـ I/O والرام، وبيبعت Interrupt واحدة بس للبلوك كله بدل ما يعطّل المعالج عند كل بايت.",
    order_index: 8,
  },
  {
    id: "44444444-4444-4444-8444-444444444609",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "Which software component understands a specific device controller and provides a uniform interface to the rest of the OS?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Bootstrap loader",
      "Device driver",
      "Interrupt vector",
      "Assembler",
    ],
    correct_index: 1,
    explanation:
      "الـ Device Driver هو البرنامج اللي فاهم تفاصيل الـ Device Controller وبيقدم واجهة موحدة لنظام التشغيل.",
    order_index: 9,
  },
  {
    id: "44444444-4444-4444-8444-444444444610",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "What is the main purpose of Multiprogramming in an Operating System?",
    code_snippet: null,
    code_lang: null,
    options: [
      "To guarantee response time under 1 millisecond",
      "To increase CPU utilization by always keeping the CPU busy with another job during I/O wait",
      "To reduce the size of Main Memory (RAM)",
      "To disable hardware interrupts",
    ],
    correct_index: 1,
    explanation:
      "هدف الـ Multiprogramming الأساسي هو رفع كفاءة استغلال المعالج (CPU utilization) بحيث أول ما برنامج يستنى I/O المعالج يشتغل على برنامج تاني فوراً.",
    order_index: 10,
  },
  {
    id: "44444444-4444-4444-8444-444444444611",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "How does Timesharing (Multitasking) differ from basic Multiprogramming?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Timesharing does not keep multiple jobs in memory",
      "Timesharing switches the CPU so frequently that users can interact with each program (response time < 1s)",
      "Timesharing only works on single-user batch machines",
      "Timesharing disables dual-mode operation",
    ],
    correct_index: 1,
    explanation:
      "الـ Timesharing هو امتداد للـ Multiprogramming، بس بيبدّل المعالج بسرعة كبيرة جداً عشان المستخدم يقدر يتفاعل مع البرامج مباشرة بزمن استجابة أقل من ثانية.",
    order_index: 11,
  },
  {
    id: "44444444-4444-4444-8444-444444444612",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "What happens if a user-mode program attempts to execute a privileged instruction directly?",
    code_snippet: null,
    code_lang: null,
    options: [
      "The CPU executes it normally and ignores the mode bit",
      "The hardware treats it as illegal and traps it to the Operating System",
      "The system automatically switches permanently to Kernel Mode",
      "The instruction is stored in the bootstrap ROM",
    ],
    correct_index: 1,
    explanation:
      "الهاردوير بيفحص الـ mode bit، ولو لقى برنامج في User Mode (1) بيحاول ينفذ أمر محمي (Privileged) بيعتبره غير قانوني ويبعت Trap فوراً لنظام التشغيل.",
    order_index: 12,
  },
  {
    id: "44444444-4444-4444-8444-444444444613",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "Why does an Operating System use a hardware Timer?",
    code_snippet: null,
    code_lang: null,
    options: [
      "To speed up disk access times",
      "To prevent a user program from getting stuck in an infinite loop and hogging the CPU",
      "To compress files in secondary storage",
      "To synchronize caches across clustered servers",
    ],
    correct_index: 1,
    explanation:
      "الـ Timer بيضمن إن نظام التشغيل يحافظ على السيطرة على المعالج؛ لو برنامج دخل في Infinite Loop العدّاد بيصفر ويبعت Interrupt ترجع التحكم للنواة.",
    order_index: 13,
  },
  {
    id: "44444444-4444-4444-8444-444444444614",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "In the storage hierarchy, moving DOWN from Registers toward Magnetic Disk generally results in:",
    code_snippet: null,
    code_lang: null,
    options: [
      "Higher cost per bit and faster access",
      "Larger capacity, slower access time, and lower cost per bit",
      "Smaller capacity and higher volatility",
      "Faster access time and larger capacity",
    ],
    correct_index: 1,
    explanation:
      "كل ما ننزل في هرم التخزين لتحت: السعة بتكبر (Larger capacity)، السرعة بتقل (Slower access)، والتكلفة لكل بت بترخص (Lower cost per bit).",
    order_index: 14,
  },
  {
    id: "44444444-4444-4444-8444-444444444615",
    lesson_id: "22222222-2222-4222-8222-222222222301",
    question_text:
      "Which property ensures that when one CPU modifies a cached value in a multiprocessor system, all other CPUs see the most recent value?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Virtualization",
      "Cache coherency",
      "Interrupt vectoring",
      "Asymmetric clustering",
    ],
    correct_index: 1,
    explanation:
      "تناسق الكاش (Cache Coherency) هي الخاصية اللي بيضمنها الهاردوير عشان كل المعالجات تشوف أحدث قيمة معدّلة ومحدش يقرأ نسخة قديمة.",
    order_index: 15,
  },

  // ==========================================================================
  // Chapter 2: Operating System Structures (15 Questions)
  // ==========================================================================
  {
    id: "44444444-4444-4444-8444-444444444701",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "The command interpreter, or shell, is responsible for: (Dr. Shoruk Ch2 #8)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Interfacing directly with hardware",
      "Managing memory resources",
      "Translating and executing user commands",
      "Allocating CPU time",
    ],
    correct_index: 2,
    explanation:
      "وظيفة الـ Shell (Command Interpreter) الأساسية هي استقبال وترجمة وتنفيذ الأوامر النصية اللي بيدخلها المستخدم.",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444702",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Which of the following is an example of a standard API? (Slide 2.6 · Midterm Q1.10)",
    code_snippet: null,
    code_lang: null,
    options: ["BIOS", "POSIX API", "Bootstrap", "GRUB"],
    correct_index: 1,
    explanation:
      "أشهر تلاتة Standard APIs في الشابتر هما: POSIX API (لأنظمة UNIX/Linux/macOS)، و Win32 API (لويندوز)، و Java API (لـ JVM).",
    order_index: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444703",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Which parameter passing method stores parameters in memory and passes the address in a register? (Slide 2.9)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Direct registers only",
      "Block or table in memory",
      "Only Stack",
      "Cache line",
    ],
    correct_index: 1,
    explanation:
      "طريقة Block or Table in Memory بتخزن الباراميترز في الذاكرة وتبعت عنوان البداية بس في Register، ودي المستخدمة في Linux و Solaris.",
    order_index: 3,
  },
  {
    id: "44444444-4444-4444-8444-444444444704",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "In OS design, separating Policy from Mechanism means separating: (Slide 2.13)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Hardware from Software",
      "WHAT will be done from HOW to do it",
      "User mode from Kernel mode",
      "CLI from GUI",
    ],
    correct_index: 1,
    explanation:
      "الـ Policy بتحدد «إيه اللي هيتعمل» (WHAT)، والـ Mechanism بتحدد «إزاي يتعمل» (HOW)، وفصلهم بيدّي مرونة عالية لتغيير السياسات لاحقاً.",
    order_index: 4,
  },
  {
    id: "44444444-4444-4444-8444-444444444705",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "What is the main disadvantage of the Microkernel structure? (Slide 2.18)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Impossible to extend",
      "Performance overhead of user space to kernel space communication",
      "No protection at all",
      "Cannot use message passing",
    ],
    correct_index: 1,
    explanation:
      "أكبر عيب في الـ Microkernel هو عبء الأداء (Performance Overhead) الناتج عن كترة الرسائل (Message Passing) بين User Space و Kernel Space.",
    order_index: 5,
  },
  {
    id: "44444444-4444-4444-8444-444444444706",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "A file containing kernel memory captured when the OS kernel fails is called a: (Slide 2.24)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Core dump",
      "Crash dump",
      "System call table",
      "Bootstrap image",
    ],
    correct_index: 1,
    explanation:
      "لما النواة (Kernel) نفسها تقع بيتسجل Crash Dump، أما لما برنامج مستخدم عادي (User Process) يقع بيتسجل Core Dump.",
    order_index: 6,
  },
  {
    id: "44444444-4444-4444-8444-444444444707",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Which of the following OS services is designed primarily to ensure efficient operation of the system itself rather than direct user convenience?",
    code_snippet: null,
    code_lang: null,
    options: [
      "User Interface (UI)",
      "Program Execution",
      "Resource Allocation and Accounting",
      "File-System Manipulation",
    ],
    correct_index: 2,
    explanation:
      "الخدمات المخصصة لكفاءة النظام نفسه هي: Resource Allocation و Logging/Accounting و Protection & Security.",
    order_index: 7,
  },
  {
    id: "44444444-4444-4444-8444-444444444708",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "How does Protection differ from Security in Operating Systems?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Protection is for external attackers; Security is for internal processes",
      "Protection controls internal access to system resources; Security defends against external unauthorized access",
      "Protection only applies to files; Security only applies to CPUs",
      "They are identical terms with no distinction",
    ],
    correct_index: 1,
    explanation:
      "الـ Protection بتنظم وصول البرامج والمستخدمين للموارد جوه النظام، أما الـ Security فبتحمي النظام من الاختراق الخارجي عن طريق التحقق من الهوية (Authentication).",
    order_index: 8,
  },
  {
    id: "44444444-4444-4444-8444-444444444709",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Why do application developers typically program against an API instead of invoking system calls directly?",
    code_snippet: null,
    code_lang: null,
    options: [
      "APIs bypass the operating system kernel completely",
      "APIs improve program portability and hide low-level OS details",
      "System calls cannot be used in C or C++",
      "APIs disable dual-mode protection",
    ],
    correct_index: 1,
    explanation:
      "الميزة الأساسية للـ API هي الـ Portability (كودك يشتغل على أي نظام بيدعم نفس الـ API) وتبسيط التعامل بدل الدخول في تفاصيل الـ System Calls المعقدة.",
    order_index: 9,
  },
  {
    id: "44444444-4444-4444-8444-444444444710",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Which system call category includes operations like open(), read(), write(), and close()?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Process Control",
      "File Management",
      "Information Maintenance",
      "Protection",
    ],
    correct_index: 1,
    explanation:
      "أوامر إنشاء وفتح وقراءة وكتابة وإغلاق وحذف الملفات تابعة لفئة File Management.",
    order_index: 10,
  },
  {
    id: "44444444-4444-4444-8444-444444444711",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "In the Layered Approach to OS structure, what is placed at Layer 0 and Layer N respectively?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Layer 0 = User Interface; Layer N = Hardware",
      "Layer 0 = Hardware; Layer N = User Interface",
      "Layer 0 = Applications; Layer N = Kernel",
      "Layer 0 = File System; Layer N = CPU Registers",
    ],
    correct_index: 1,
    explanation:
      "في الهيكل الطبقي (Layered Approach)، الطبقة السفلى Layer 0 هي الهاردوير، والطبقة العليا Layer N هي واجهة المستخدم (User Interface).",
    order_index: 11,
  },
  {
    id: "44444444-4444-4444-8444-444444444712",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Why are Loadable Kernel Modules (LKMs) considered more efficient than a Microkernel?",
    code_snippet: null,
    code_lang: null,
    options: [
      "They run entirely in user space",
      "Modules communicate directly inside kernel space without message-passing overhead",
      "They do not require hardware interrupts",
      "They store the entire OS in ROM",
    ],
    correct_index: 1,
    explanation:
      "الـ LKMs بتجمع بين المرونة والسرعة لأن كل الموديولز بتشتغل جوه مساحة النواة وتتواصل مباشرة من غير عبء الـ Message Passing الموجود في الـ Microkernel.",
    order_index: 12,
  },
  {
    id: "44444444-4444-4444-8444-444444444713",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Modern operating systems such as Windows, macOS, iOS, and Android predominantly use which architecture?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Pure MS-DOS simple structure",
      "Strict single-layer structure",
      "Hybrid structure",
      "Batch-only structure",
    ],
    correct_index: 2,
    explanation:
      "أغلب الأنظمة الحديثة زي Windows و macOS و iOS و Android بتستخدم Hybrid Structure عشان تجمع مزايا الأداء والأمان والمرونة مع بعض.",
    order_index: 13,
  },
  {
    id: "44444444-4444-4444-8444-444444444714",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "When a user-space application crashes, which diagnostic file captures the process's memory image?",
    code_snippet: null,
    code_lang: null,
    options: ["Crash dump", "Core dump", "Interrupt vector", "PCB table"],
    correct_index: 1,
    explanation:
      "لما برنامج مستخدم عادي (Process) يقع بيتسجل Core Dump، أما Crash Dump فده خاص بوقوع النواة (Kernel).",
    order_index: 14,
  },
  {
    id: "44444444-4444-4444-8444-444444444715",
    lesson_id: "22222222-2222-4222-8222-222222222302",
    question_text:
      "Which system call mechanism maps a system-call number to the exact kernel routine to execute?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Device buffer",
      "System-call interface table",
      "Command interpreter",
      "Linker table",
    ],
    correct_index: 1,
    explanation:
      "الـ System-Call Interface بيحتفظ بجدول مفهرس برقم كل System Call، وبمجرد وصول الرقم بيستدعي الدالة المقابلة ليها في النواة.",
    order_index: 15,
  },

  // ==========================================================================
  // Chapter 3: Processes (15 Questions)
  // ==========================================================================
  {
    id: "44444444-4444-4444-8444-444444444801",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Which section of a process contains memory dynamically allocated during run time? (Midterm Q3 / Slide 3.4)",
    code_snippet: null,
    code_lang: null,
    options: ["Text section", "Data section", "Heap", "Stack"],
    correct_index: 2,
    explanation:
      "الـ Heap هو القسم المخصص للذاكرة اللي بتتحجز ديناميكياً وقت التشغيل (Runtime)، أما الـ Stack فللبيانات المؤقتة والـ Data للمتغيرات العامة والـ Text للكود.",
    order_index: 1,
  },
  {
    id: "44444444-4444-4444-8444-444444444802",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Which scheduler controls the degree of multiprogramming? (Slide 3.12)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Short-term scheduler",
      "Long-term scheduler",
      "Device driver",
      "Dispatcher",
    ],
    correct_index: 1,
    explanation:
      "الـ Long-Term Scheduler (Job Scheduler) هو اللي بيتحكم في عدد العمليات الموجودة في الذاكرة (Degree of Multiprogramming).",
    order_index: 2,
  },
  {
    id: "44444444-4444-4444-8444-444444444803",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Context-switch time is considered pure overhead because: (Slide 3.10)",
    code_snippet: null,
    code_lang: null,
    options: [
      "It runs only in user mode",
      "The system does no useful work while switching",
      "It deletes the PCB",
      "It requires disk formatting",
    ],
    correct_index: 1,
    explanation:
      "زمن الـ Context Switch يُعتبر عبء صافي (Pure Overhead) لأن النظام مش بينفذ أي شغل مفيد للمستخدم أثناء حفظ واسترجاع حالة العمليتين.",
    order_index: 3,
  },
  {
    id: "44444444-4444-4444-8444-444444444804",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "What does fork() return to the child process and parent process respectively? (Slide 3.17)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Parent PID to child; 0 to parent",
      "0 to child; Child PID to parent",
      "-1 to both",
      "1 to child; 1 to parent",
    ],
    correct_index: 1,
    explanation:
      "دالة fork() بترجع 0 للعملية الابن (Child)، وبترجع رقم الابن (Child PID) للأب (Parent)، وبترجع قيمة سالبة لو حصل خطأ.",
    order_index: 4,
  },
  {
    id: "44444444-4444-4444-8444-444444444805",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Three processes P1(24), P2(3), P3(3) arrive at t=0. What is the Average Waiting Time under FCFS and SJF respectively? (Midterm Q9)",
    code_snippet: null,
    code_lang: null,
    options: [
      "FCFS = 3, SJF = 17",
      "FCFS = 17, SJF = 3",
      "FCFS = 10, SJF = 6",
      "FCFS = 24, SJF = 3",
    ],
    correct_index: 1,
    explanation:
      "في FCFS أوقات الانتظار (0 + 24 + 27) ÷ 3 = 17. أما في SJF بننفذ القصيرين الأول فتبقى أوقات الانتظار (0 + 3 + 6) ÷ 3 = 3.",
    order_index: 5,
  },
  {
    id: "44444444-4444-4444-8444-444444444806",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Which IPC model is faster because the OS is only needed to establish the communication region, not for every transfer? (Slide 3.23)",
    code_snippet: null,
    code_lang: null,
    options: [
      "Message passing",
      "Shared memory",
      "Ordinary pipes",
      "RPC",
    ],
    correct_index: 1,
    explanation:
      "الـ Shared Memory أسرع بكتير لأن تدخل النواة بيحصل مرة واحدة في البداية لإنشاء المنطقة المشتركة، وبعدها القراءة والكتابة بتتم بسرعة الرام مباشرة.",
    order_index: 6,
  },
  {
    id: "44444444-4444-4444-8444-444444444807",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Which statement accurately distinguishes a Program from a Process?",
    code_snippet: null,
    code_lang: null,
    options: [
      "A program is active in RAM; a process is passive on disk",
      "A program is a passive entity on disk; a process is an active entity in execution",
      "Both program and process are passive entities",
      "A single program can only ever create one process",
    ],
    correct_index: 1,
    explanation:
      "البرنامج (Program) كيان ساكن (Passive) مخزّن على الهارد، أما العملية (Process) فهي كيان نشط (Active) شغال في الذاكرة، وممكن نفس البرنامج يتفتح منه أكتر من Process.",
    order_index: 7,
  },
  {
    id: "44444444-4444-4444-8444-444444444808",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "When a Running process requests an I/O operation (such as reading from disk), which state does it transition to immediately?",
    code_snippet: null,
    code_lang: null,
    options: ["New", "Ready", "Waiting (Blocked)", "Terminated"],
    correct_index: 2,
    explanation:
      "أول ما العملية تطلب I/O بتخرج من المعالج وتدخل حالة Waiting (Blocked) لحد ما الـ I/O يخلص، وبعدها ترجع للـ Ready Queue.",
    order_index: 8,
  },
  {
    id: "44444444-4444-4444-8444-444444444809",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "Which of the following is stored inside a Process Control Block (PCB)?",
    code_snippet: null,
    code_lang: null,
    options: [
      "The BIOS firmware code",
      "Process state, PID, Program Counter, and CPU registers",
      "Only the source code of the application",
      "The hard disk partition table",
    ],
    correct_index: 1,
    explanation:
      "الـ PCB بيحتفظ بكل بيانات العملية اللازمة لإيقافها واستئنافها: حالتها، رقمها (PID)، الـ Program Counter، والـ CPU Registers.",
    order_index: 9,
  },
  {
    id: "44444444-4444-4444-8444-444444444810",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "What is a Zombie process in UNIX/Linux systems?",
    code_snippet: null,
    code_lang: null,
    options: [
      "A process stuck in an infinite CPU loop",
      "A terminated child process whose parent has not yet invoked wait()",
      "A child process whose parent terminated before it finished",
      "A process that uses zero RAM",
    ],
    correct_index: 1,
    explanation:
      "الـ Zombie هو ابن خلّص شغله (Terminated) بس أبوه لسه معملش wait() عشان يستلم حالة خروجه، فبيفضل اسمه موجود في جدول العمليات.",
    order_index: 10,
  },
  {
    id: "44444444-4444-4444-8444-444444444811",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "What happens to an Orphan process when its parent terminates without calling wait()?",
    code_snippet: null,
    code_lang: null,
    options: [
      "It immediately crashes the entire OS",
      "It is adopted by the init (or systemd) process as its new parent",
      "It permanently locks the CPU",
      "It is converted into a hardware interrupt",
    ],
    correct_index: 1,
    explanation:
      "في أنظمة UNIX/Linux، لو الأب مات وساب الابن شغال (Orphan)، عملية الـ init (أو systemd) بتتبنّى الابن وتعمله wait() لما يخلص.",
    order_index: 11,
  },
  {
    id: "44444444-4444-4444-8444-444444444812",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "What is the primary role of the Medium-Term Scheduler?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Selecting the next process to run on the CPU every few milliseconds",
      "Temporarily swapping processes out of memory to disk and back to manage memory load",
      "Compiling C programs into machine code",
      "Assigning IP addresses to sockets",
    ],
    correct_index: 1,
    explanation:
      "الـ Medium-Term Scheduler بيعمل Swapping (بيطلع عمليات مؤقتاً من الرام للهارد ويرجعها تاني) عشان يخفف الضغط على الذاكرة.",
    order_index: 12,
  },
  {
    id: "44444444-4444-4444-8444-444444444813",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "In IPC Message Passing, what does 'Zero Capacity' buffering (Rendezvous) mean?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Messages can be queued infinitely without waiting",
      "The queue holds zero waiting messages, so the sender must block until the receiver accepts the message",
      "Messages are automatically deleted before delivery",
      "Processes must share physical memory",
    ],
    correct_index: 1,
    explanation:
      "في Zero Capacity مفيش Buffer يخزن رسائل، فالمُرسِل لازم يستنى (Block) لحد ما المُستقبِل يكون جاهز يستلم الرسالة لحظياً (Rendezvous).",
    order_index: 13,
  },
  {
    id: "44444444-4444-4444-8444-444444444814",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "How does a Named Pipe (FIFO) differ from an Ordinary Pipe?",
    code_snippet: null,
    code_lang: null,
    options: [
      "Named pipes only work between parent and child processes",
      "Named pipes allow unrelated processes to communicate and support bidirectional communication",
      "Ordinary pipes persist permanently after processes exit",
      "Named pipes cannot be used on UNIX systems",
    ],
    correct_index: 1,
    explanation:
      "الـ Ordinary Pipe لازم علاقة أب وابن واتجاه واحد، أما الـ Named Pipe (FIFO) فبتسمح لعمليات ملهاش علاقة ببعض تتواصل وفي الاتجاهين.",
    order_index: 14,
  },
  {
    id: "44444444-4444-4444-8444-444444444815",
    lesson_id: "22222222-2222-4222-8222-222222222303",
    question_text:
      "A Socket used for client-server IPC communication is uniquely identified by:",
    code_snippet: null,
    code_lang: null,
    options: [
      "Process ID and Stack pointer",
      "An IP address concatenated with a Port number",
      "A file descriptor and mode bit",
      "A MAC address and cache line",
    ],
    correct_index: 1,
    explanation:
      "الـ Socket بيتعرّف بشكل فريد عن طريق دمج الـ IP Address مع الـ Port Number (مثلاً 161.25.19.8:1625).",
    order_index: 15,
  },
];
