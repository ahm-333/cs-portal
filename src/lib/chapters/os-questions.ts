import type { Question } from "@/types/database";

// Auto-generated quiz bank for CS-311 (os).
export const OS_QUESTIONS: Question[] = [
  {
    "id": "44444444-4444-4444-8444-444444444601",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "Which program is described as 'the one program running at all times on the computer'? (Slide 1.8)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Bootstrap program",
      "The Kernel",
      "Compiler",
      "Device driver"
    ],
    "correct_index": 1,
    "explanation": "الـ Kernel هو البرنامج الوحيد الذي يعمل طوال الوقت على الكمبيوتر.",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444444602",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "Where is the bootstrap program typically stored? (Slide 1.9)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Main memory (RAM)",
      "CPU Registers",
      "ROM or EPROM (Firmware)",
      "Cache memory"
    ],
    "correct_index": 2,
    "explanation": "يُخزن في ROM أو EPROM (Firmware) لأنها غير متطايرة.",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444444603",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "A software-generated interrupt caused either by an error or a user request is called a: (Slide 1.12)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Device controller",
      "Trap or exception",
      "Interrupt vector",
      "Local buffer"
    ],
    "correct_index": 1,
    "explanation": "المقاطعة البرمجية تسمى Trap أو Exception.",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444444604",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "In Slide 1.29, Level 1 Registers and Level 2 Cache are managed by: (Slide 1.29)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "OS and OS",
      "Compiler and Hardware",
      "Hardware and Compiler",
      "User and Disk Controller"
    ],
    "correct_index": 1,
    "explanation": "الـ Registers يديرها الـ Compiler والـ Cache يديره الـ Hardware.",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444444605",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "In a clustered system, which mode keeps one machine in hot-standby mode? (Slide 1.20)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Symmetric clustering",
      "Asymmetric clustering",
      "SMP",
      "Timesharing"
    ],
    "correct_index": 1,
    "explanation": "الـ Asymmetric clustering يبقي جهازاً في وضع الاستعداد الساخن (hot-standby mode).",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444444606",
    "lesson_id": "22222222-2222-4222-8222-222222222301",
    "question_text": "What is the mode bit value in Kernel Mode, and what type of instruction sets the timer? (Slide 1.25)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "1; User instruction",
      "0; Privileged instruction",
      "0; User instruction",
      "1; Privileged instruction"
    ],
    "correct_index": 1,
    "explanation": "في Kernel Mode يكون mode bit = 0، وضبط المؤقت Privileged instruction.",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444444701",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "The command interpreter, or shell, is responsible for: (Dr. Shoruk Ch2 #8)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Interfacing directly with hardware",
      "Managing memory resources",
      "Translating and executing user commands",
      "Allocating CPU time"
    ],
    "correct_index": 2,
    "explanation": "وظيفة الـ Shell هي ترجمة وتنفيذ أوامر المستخدم النصية.",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444444702",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "Which of the following is an example of a standard API? (Slide 2.6 · Midterm Q1.10)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "BIOS API",
      "POSIX API",
      "HTML API",
      "DOS API"
    ],
    "correct_index": 1,
    "explanation": "أشهر 3 APIs هي Win32 و POSIX و Java API.",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444444703",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "What does POSIX read() return on End-of-File (EOF) vs. on Error? (Slide 2.7)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "0 on EOF, -1 on error",
      "-1 on EOF, 0 on error",
      "1 on EOF, 0 on error",
      "-1 on both"
    ],
    "correct_index": 0,
    "explanation": "ترجع 0 عند نهاية الملف (EOF) و -1 عند حدوث خطأ.",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444444704",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "Which parameter-passing approach is used by Linux and Solaris? (Slide 2.10)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Registers only",
      "Block/table in memory with address in a register",
      "Magnetic tape",
      "Message queues"
    ],
    "correct_index": 1,
    "explanation": "يستخدم Linux و Solaris جدولاً في الذاكرة وتمرير عنوانه في Register.",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444444705",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "The primary disadvantage of a microkernel system structure is: (Dr. Shoruk Ch2 #4)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Increased system crashes",
      "Larger kernel codebase",
      "Decreased efficiency due to frequent communication",
      "Lack of modularity"
    ],
    "correct_index": 2,
    "explanation": "العيب الأساسي للـ Microkernel هو بطء الكفاءة (Performance overhead) بسبب تمرير الرسائل.",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444444706",
    "lesson_id": "22222222-2222-4222-8222-222222222302",
    "question_text": "In a modular kernel, modules are: (Dr. Shoruk Ch2 #6)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Loaded at compile time only",
      "Loaded into the kernel dynamically at runtime",
      "Run only in user space",
      "Assigned fixed memory"
    ],
    "correct_index": 1,
    "explanation": "تُحمّل الوحدات ديناميكياً داخل النواة وقت التشغيل.",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444444801",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "Dynamically allocated memory during runtime resides in the: (Slide 3.4 · Midterm Q1.6)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Stack",
      "Data Section",
      "Heap",
      "Text Section"
    ],
    "correct_index": 2,
    "explanation": "الـ Heap مخصص للذاكرة الديناميكية وقت التشغيل.",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444444802",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "What is the state of a process waiting for CPU time? (Slide 3.7 · Dr. Shoruk Ch3 #8)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Running",
      "Waiting",
      "Ready",
      "New"
    ],
    "correct_index": 2,
    "explanation": "العملية الجاهزة التي تنتظر الـ CPU تكون في حالة Ready.",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444444803",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "Switching the CPU from one process to another is called: (Slide 3.9 · Midterm Q1.5)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Process creation",
      "Context switch",
      "Cascading termination",
      "Spooling"
    ],
    "correct_index": 1,
    "explanation": "يسمى Context switch (حفظ PCB0 وتحميل PCB1).",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444444804",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "True or False: The main role of the long-term scheduler is to allocate CPU time. (Slide 3.15 · Dr. Shoruk T/F #17)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "explanation": "خطأ (False)! تخصيص الـ CPU هو دور الـ Short-term scheduler.",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444444805",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "What is the role of fork() in UNIX? (Slide 3.20 · Dr. Shoruk Ch3 #4)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Creates a new process duplicating the parent",
      "Terminates current process",
      "Loads a new program",
      "Swaps to disk"
    ],
    "correct_index": 0,
    "explanation": "دالة fork() تستنسخ الأب لإنشاء عملية ابن جديدة.",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444444806",
    "lesson_id": "22222222-2222-4222-8222-222222222303",
    "question_text": "A terminated child whose parent did NOT invoke wait() is a: (Slide 3.24)",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Orphan",
      "Zombie",
      "Daemon",
      "Independent"
    ],
    "correct_index": 1,
    "explanation": "الـ Zombie ابن انتهى ولم ينادِ أبوه wait().",
    "order_index": 6
  }
];
