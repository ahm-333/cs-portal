// Comprehensive, code-free bilingual summaries for Operating Systems (CS-311).
// Every concept is stated in crisp exam-ready English with a simple Egyptian Arabic explanation.

export const OS_SUMMARIES: Record<
  string,
  {
    chapterNum: number;
    titleEn: string;
    titleAr: string;
    summary_md: string;
    key_code: string | null;
    exam_tip: string;
  }
> = {
  "22222222-2222-4222-8222-222222222301": {
    chapterNum: 1,
    titleEn: "Introduction",
    titleAr: "مقدمة في نظم التشغيل وبنية الحاسب",
    key_code: null,
    exam_tip:
      "أهم 3 أفكار امتحان في Chapter 1: الـ Kernel Mode بـ 0 والـ User Mode بـ 1، الـ Trap مقاطعة برمجية، وجدول Slide 1.29 (Registers يديرها Compiler و Cache يديره Hardware والباقي OS).",
    summary_md: `## 1. What Is an Operating System? & System Components

- **Operating System (OS):** Intermediary between the user and computer hardware.  
  *ببساطة:* ده الوسيط بينك وبين الهاردوير عشان متتعاملش مع الكهرباء والأصفار والوحايد بنفسك.
- **Four Components of a Computer System:** \`Hardware\` → \`Operating System\` → \`Application Programs\` → \`Users\`.  
  *ببساطة:* أربع طبقات فوق بعض؛ الهاردوير تحت خالص، فوقه نظام التشغيل، فوقه البرامج بتاعتك، وفوق خالص المستخدمين.
- **User View vs. System View:**
  - **User View:** Focuses on *ease of use* and good *performance* (PCs/phones), or *resource utilization* on shared servers.  
    *ببساطة:* بالنسبة للمستخدم المهم الجهاز يكون سهل وسريع.
  - **System View:** The OS acts as a **Resource Allocator** (manages CPU, memory, I/O) and a **Control Program** (prevents errors and improper use).  
    *ببساطة:* من ناحية الجهاز نفسه، النظام شغال موزّع موارد ومنظّم بيمنع البرامج تبوّظ الدنيا.
- **The Kernel:** *The one program running at all times on the computer.* Everything else is either a **system program** or an **application program**.  
  *ببساطة:* النواة هي القلب اللي شغال طول ما الجهاز مفتوح؛ وأي حاجة غيرها مجرد برنامج عادي أو أداة مساعدة.
- **Bootstrap Program:** Loaded at power-up/reboot; stored in **ROM or EPROM (Firmware)**; initializes hardware and loads the OS kernel into RAM.  
  *ببساطة:* ده أول كود بيصحى لما تدوس زرار الباور، متخزن في ذاكرة ثابتة (ROM) عشان يجهّز الجهاز ويحمّل النواة في الرام.

---

## 2. Computer-System Organization & Interrupts

- **Device Controller & Local Buffer:** Each I/O device has a hardware controller with its own local buffer; the OS communicates with it through a **Device Driver**.  
  *ببساطة:* كل جهاز (زي الهارد أو الكيبورد) ليه متحكم خاص ومخزن صغير، والـ Device Driver هو المترجم اللي بيخلي نظام التشغيل يفهمه.
- **Interrupts (Hardware vs. Software):**
  - **Hardware Interrupt:** Sent by a device controller to the CPU when an I/O operation finishes.  
    *ببساطة:* إشارة من الهاردوير للمعالج بتقوله "أنا خلصت شغلي".
  - **Trap / Exception (Software Interrupt):** Triggered by a software error (e.g., division by zero) or a user request (**System Call**).  
    *ببساطة:* مقاطعة جاية من البرنامج نفسه يا إما بسبب غلط، يا إما عشان يطلب خدمة من النواة.
- **Interrupt Vector:** Table of memory addresses pointing to each **Interrupt Service Routine (ISR)**.  
  *ببساطة:* جدول عناوين سريع عشان المعالج يعرف يروح لأي دالة تعالج المقاطعة فوراً.
- **DMA (Direct Memory Access):** Transfers entire blocks of data directly between high-speed I/O devices and main memory with only **one interrupt per block** instead of one per byte.  
  *ببساطة:* بدل ما المعالج يتعطّل على كل بايت، الـ DMA ينقل البلوك كله للرام مرة واحدة ويبلغ المعالج في الآخر بس.

---

## 3. Storage Hierarchy & Caching (Slide 1.29)

> **Golden Rule:** As you go **down** the hierarchy → **Capacity ↑**, **Access Time ↑ (Slower)**, **Cost per bit ↓**.  
> *ببساطة:* كل ما تنزل لتحت المساحة بتكبر والسعر بيرخص، بس السرعة بتقل.

| Level | Storage Type | Volatility | Managed By (موضع امتحان!) | التوضيح بالعامية |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Registers** | Volatile | **Compiler** | أسرع حاجة جوه المعالج، والـ Compiler هو اللي بيوزعها |
| **2** | **Cache** | Volatile | **Hardware** | ذاكرة سريعة جداً بين المعالج والرام، والهاردوير بيديرها أوتوماتيك |
| **3** | **Main Memory (RAM)** | Volatile | **Operating System** | بتتمسح لما الكهربا تفصل، ونظام التشغيل بيديرها |
| **4** | **Solid-State Disk (SSD / NVM)** | Nonvolatile | **Operating System** | تخزين ثابت وسريع، مش بيتمسح لما تقفل الجهاز |
| **5** | **Magnetic Disk (HDD)** | Nonvolatile | **Operating System** | تخزين ضخم ورخيص لكنه أبطأ |

- **Cache Coherency:** In multiprocessor systems, hardware ensures that updating a value in one CPU's cache is reflected across all other CPUs' caches.  
  *ببساطة:* لو معالج عدّل قيمة في الكاش بتاعه، الهاردوير بيضمن إن باقي المعالجات تشوف النسخة الجديدة مش القديمة.

---

## 4. Computer-System Architecture

| Architecture | Key Concept (English) | التوضيح بالعامية |
| :--- | :--- | :--- |
| **Single-Processor** | One main CPU executing instructions sequentially. | معالج واحد بس شايل الشغل كله |
| **Asymmetric Multiprocessing** | Master-slave model; each processor is assigned a specific task. | معالج رئيسي بيوزّع الشغل على الباقي |
| **Symmetric Multiprocessing (SMP)** | All processors are peers and share memory; each runs the OS. | كل المعالجات زي بعض ومتشاركين الذاكرة |
| **Multi-Core** | Multiple computing cores placed on a **single chip** (faster & less power). | كذا نواة على نفس الشريحة فالتواصل بينهم أسرع وأوفر طاقة |
| **Clustered Systems (Asymmetric)** | One machine stays in **hot-standby mode** while the other runs apps. | جهاز شغال والتاني واقف جاهز احتياطي لو الأول وقع |
| **Clustered Systems (Symmetric)** | Multiple nodes run applications simultaneously and monitor each other. | كل الأجهزة شغالة مع بعض وبيراقبوا بعض |

---

## 5. OS Operations, Dual-Mode & Protection

- **Multiprogramming:** Keeps several jobs in memory so the CPU always has one to run; switches when a job waits for I/O (maximizes **CPU utilization**).  
  *ببساطة:* هدفه المعالج ميفضلش فاضي أبداً؛ أول ما برنامج يستنى I/O المعالج يسيبه ويمسك غيره.
- **Timesharing (Multitasking):** Logical extension of multiprogramming where CPU switches so frequently that users interact directly (**Response Time < 1 second**).  
  *ببساطة:* تبديل سريع جداً بين البرامج عشان تحس إنهم كلهم شغالين قدامك في نفس اللحظة.
- **Dual-Mode Operation:** Hardware **mode bit** separates execution into two modes to protect the OS:
  - **User Mode (\`mode bit = 1\`):** Runs user applications with restricted access.
  - **Kernel Mode (\`mode bit = 0\`):** Runs OS code with full access to **Privileged Instructions**.  
  *ببساطة:* ده زرار أمان في الهاردوير؛ البرامج العادية شغالة بـ 1 وممنوع تلمس الهاردوير، ولما تطلب خدمة بنحوّل لـ 0 (Kernel) وننفذها بأمان.
- **Timer:** Hardware counter set by a **privileged instruction** to interrupt the CPU after a specified period, preventing **infinite loops** or a process hogging the CPU.  
  *ببساطة:* عدّاد وقت بيظبطه النظام عشان لو برنامج علّق في Loop لا نهائي، النظام يسحب منه المعالج غصب عنه.

> **Exam Tip:** Always distinguish **Mode Bit** (\`0 = Kernel\`, \`1 = User\`), **Trap** (software interrupt), **Bootstrap** (stored in ROM/EPROM), and **Managed By** (\`Registers → Compiler\`, \`Cache → Hardware\`).`,
  },

  "22222222-2222-4222-8222-222222222302": {
    chapterNum: 2,
    titleEn: "Operating System Structures",
    titleAr: "خدمات وهياكل نظم التشغيل",
    key_code: null,
    exam_tip:
      "أهم أفكار امتحان Chapter 2: الفرق بين Policy (What) و Mechanism (How)، استخدام APIs للـ Portability، وأنواع الهياكل (Monolithic الأسرع vs Microkernel الأسهل في التعديل والأبطأ بسبب IPC).",
    summary_md: `## 1. Operating-System Services

OS services are divided into two clear groups:

- **Group A — Helpful to the User:**
  1. **User Interface (UI):** \`CLI\` (Command-Line / Shell), \`GUI\` (Graphical), or \`Touch-Screen\`.
  2. **Program Execution:** Load a program into memory, run it, and end execution normally or abnormally.
  3. **I/O Operations:** Provide safe access to files and hardware devices (users cannot control I/O directly).
  4. **File-System Manipulation:** Create, delete, read, write, search files/directories, and manage permissions.
  5. **Communications:** Exchange data between processes via **Shared Memory** or **Message Passing**.
  6. **Error Detection:** Constantly detect and handle CPU, memory, I/O, and user-program errors.  
  *ببساطة:* دي الخدمات اللي بتسهل عليك كمستخدم تشغّل برامجك وتتعامل مع ملفاتك وأجهزتك من غير وجع دماغ.

- **Group B — Ensuring Efficient System Operation:**
  1. **Resource Allocation:** Distribute CPU cycles, RAM, and I/O devices fairly among multiple processes.
  2. **Logging / Accounting:** Track which users/processes consume which resources and how much.
  3. **Protection & Security:** **Protection** controls *internal* access to system resources; **Security** defends against *external* unauthorized access (authentication).  
  *ببساطة:* دي خدمات لإدارة النظام نفسه؛ Protection بتحميك من جوه الجهاز، و Security بتحميك من برا (زي الباسورد).

---

## 2. User Interfaces & System Calls

- **Command Interpreter (Shell):** Gets and executes the next user-specified command (e.g., \`bash\`, \`zsh\`, PowerShell).  
  *ببساطة:* الشاشة اللي بتكتب فيها أوامر نصية وهي تترجمها وتنفذها.
- **System Calls:** Programming interface to the services provided by the OS (usually accessed via a high-level **API** rather than directly).  
  *ببساطة:* دي الطريقة الرسمية اللي البرنامج بيكلم بيها النواة عشان يطلب خدمة زي فتح ملف أو إنشاء عملية.
- **Why Use APIs (\`Win32\`, \`POSIX\`, \`Java API\`) Instead of Direct System Calls?**
  - **Portability:** Code written against a standard API compiles and runs on any system supporting that API.
  - **Simplicity:** Hides low-level OS details from programmers.  
  *ببساطة:* بنستخدم الـ API عشان كودك يشتغل على كذا جهاز بسهولة ومش محتاج تحفظ تفاصيل النواة المعقدة.
- **3 Methods to Pass Parameters to the OS:**
  1. **Registers:** Fastest, but limited when there are more parameters than registers.
  2. **Block / Table in Memory:** Store parameters in memory and pass the *starting address* in a register (used by Linux & Solaris).
  3. **Stack:** Program pushes parameters onto the stack; OS pops them off.  
  *ببساطة:* تلات طرق نبعت بيهم البيانات للنواة: في الـ Registers لو قليلين، أو في جدول في الرام ونبعت عنوانه، أو نحطهم على الـ Stack.

### Six Categories of System Calls

| Category | Examples (English) | بتعمل إيه بالعامية؟ |
| :--- | :--- | :--- |
| **Process Control** | \`create\`, \`terminate\`, \`load\`, \`execute\`, \`wait\`, \`allocate/free memory\` | تشغيل وقفل العمليات وحجز ذاكرتها |
| **File Management** | \`create\`, \`delete\`, \`open\`, \`close\`, \`read\`, \`write\` | التعامل مع الملفات قراءة وكتابة وحذف |
| **Device Management** | \`request\`, \`release\`, \`read\`, \`write\`, \`attach/detach\` | طلب جهاز I/O واستخدامه وبعدين تسيبه |
| **Information Maintenance** | \`get/set time & date\`, \`get process/system data\` | معرفة الوقت والتاريخ وحالة النظام والعمليات |
| **Communications** | \`create connection\`, \`send/receive messages\`, \`shared memory\` | تخلي البرامج تبعت رسايل أو تشارك ذاكرة |
| **Protection** | \`get/set permissions\`, \`allow/deny user access\` | تحديد مين مسموحله يدخل على إيه |

---

## 3. Design Principles: Policy vs. Mechanism

- **Policy:** Defines **WHAT** will be done (e.g., *interrupt every 100 seconds to protect CPU*).
- **Mechanism:** Defines **HOW** to do it (e.g., *using a hardware timer*).  
  *ببساطة:* فصل الـ Policy عن الـ Mechanism بيخليك تقدر تغيّر "القرار" من غير ما تهدّ "الطريقة" اللي مبني بيها النظام.

---

## 4. Operating-System Structures (Exam Favorite!)

| Structure | Core Idea (English) | Main Advantage | Main Disadvantage | التوضيح بالعامية |
| :--- | :--- | :--- | :--- | :--- |
| **Monolithic / Simple** | Entire OS runs in a single kernel space (e.g., Original UNIX, Linux core). | **Very fast** (minimal call overhead). | Hard to maintain; one bug can crash the whole OS. | كله في حتة واحدة؛ سريع جداً بس صعب يتعدل وأي غلطة توقّع الجهاز |
| **Layered Approach** | OS split into layers: Layer 0 = Hardware, Layer N = UI. Each layer uses only layers below it. | Easy debugging and verification. | Hard to define layers cleanly; **slower** (crossing layers). | طبقات فوق بعض؛ سهل تكتشف الغلط بس أبطأ شوية |
| **Microkernel** | Moves non-essential services to **user space**; kernel does minimal IPC, memory, CPU (e.g., Mach). | Easier to extend, **more secure & reliable**. | **Performance overhead** due to user-to-kernel message passing. | نواة صغيرة جداً والباقي بره؛ أأمن بكتير بس أبطأ بسبب الرسايل الكتير |
| **Loadable Kernel Modules (LKMs)** | Core kernel + object-oriented modules loaded dynamically at runtime (Linux, Solaris). | Flexible like layers, **fast like monolithic** (no message passing). | Modules still run in kernel space. | أحسن حل وسط؛ بتحمّل الإضافات وقت الحاجة وبسرعة عالية |
| **Hybrid Systems** | Combines multiple approaches (e.g., **Windows**, **macOS**, **iOS**, **Android**). | Balances performance, security, and usability. | Higher overall architectural complexity. | خليط من كذا هيكل عشان يجمع السرعة والأمان مع بعض |

---

## 5. Debugging & System Boot

- **Core Dump:** Captures the memory of a **user process** when it fails/crashes.  
  *ببساطة:* لقطة لذاكرة برنامج عادي لما يقع عشان المبرمج يعرف السبب.
- **Crash Dump:** Captures **kernel memory** when the OS itself crashes (e.g., Blue Screen).  
  *ببساطة:* لقطة لذاكرة النواة نفسها لما النظام كله يقع.
- **System Boot:** \`BIOS / UEFI\` runs from ROM → loads **Bootloader (e.g., GRUB)** → loads the **OS Kernel** into memory and starts execution.

> **Exam Tip:** Remember **Policy = What**, **Mechanism = How**, **Core Dump = Process failure**, **Crash Dump = Kernel failure**, and **Microkernel overhead = Message Passing between user space & kernel space**.`,
  },

  "22222222-2222-4222-8222-222222222303": {
    chapterNum: 3,
    titleEn: "Processes",
    titleAr: "العمليات، الجدولة، والتواصل بين العمليات (IPC)",
    key_code: null,
    exam_tip:
      "أهم أفكار امتحان Chapter 3: أقسام الذاكرة الأربعة (Heap للديناميك)، الـ Context Switch عبء صافي (Pure Overhead)، نواتج fork()، وحساب Average Waiting Time لـ FCFS مقابل SJF.",
    summary_md: `## 1. Process Concept & Memory Layout

- **Program vs. Process:**
  - **Program:** A **passive entity** stored on disk (executable file).
  - **Process:** An **active entity** — *a program in execution* loaded in memory with its own Program Counter and resources.  
  *ببساطة:* البرنامج وهو على الهارد ملف نايم (Passive)، أول ما تشغّله ويدخل الرام يبقى Process شغال (Active).

### Four Sections of a Process in Memory

| Section | What It Stores (English) | التوضيح بالعامية |
| :--- | :--- | :--- |
| **Text Section** | Executable program code (instructions). | كود البرنامج نفسه |
| **Data Section** | **Global variables** and static variables. | المتغيرات العامة اللي شغالة على طول البرنامج |
| **Heap** | Memory **dynamically allocated during run time**. | المساحة اللي البرنامج بيحجزها وقت التشغيل |
| **Stack** | **Temporary data** (function parameters, return addresses, local variables). | بيانات مؤقتة بتتضاف وتتمسح مع كل دالة |

---

## 2. Process States & Process Control Block (PCB)

- **Five Process States:**
  1. **New:** The process is being created.
  2. **Ready:** Waiting in the **Ready Queue** to be assigned to a CPU.
  3. **Running:** Instructions are currently being executed by the CPU.
  4. **Waiting (Blocked):** Waiting for an event to occur (e.g., I/O completion or signal).
  5. **Terminated:** The process has finished execution.  
  *ببساطة:* العملية بتتولد (New) → تقف في الطابور (Ready) → تشتغل على المعالج (Running) → لو احتاجت I/O تستنى على جنب (Waiting) → ولما تخلص تقفل (Terminated).

- **PCB (Process Control Block / Task Control Block):** The OS data structure that represents every process and stores:
  - \`Process State\`, \`Process Number (PID)\`, \`Program Counter (PC)\`, \`CPU Registers\`, \`CPU Scheduling Info\`, \`Memory-Management Info\`, \`Accounting Info\`, and \`I/O Status Info\`.  
  *ببساطة:* ده البطاقة الشخصية للعملية جوه النظام؛ فيها كل بياناتها عشان لو وقفناها ورجعنالها نعرف كانت واقفة فين بالظبط.

---

## 3. Process Scheduling & Context Switch

- **Scheduling Queues:**
  - **Job Queue:** All processes currently in the system.
  - **Ready Queue:** Processes residing in main memory, ready and waiting to execute.
  - **Device (Wait) Queues:** Processes waiting for a specific I/O device.
- **Types of Schedulers:**
  - **Long-Term Scheduler (Job Scheduler):** Selects processes from disk into memory; **controls the Degree of Multiprogramming**; executes infrequently.
  - **Short-Term Scheduler (CPU Scheduler):** Selects which ready process gets the CPU next; executes **very frequently (milliseconds)** so it must be super fast.
  - **Medium-Term Scheduler:** Performs **Swapping** (temporarily moves processes out of memory to disk and back) to reduce the degree of multiprogramming.  
  *ببساطة:* الـ Long-Term بيتحكم كم برنامج يدخل الرام، والـ Short-Term بيختار مين ياخد المعالج دلوقتي، والـ Medium-Term بيريّح الرام لما تتزحم (Swapping).
- **I/O-Bound vs. CPU-Bound Processes:**
  - **I/O-Bound:** Spends more time doing I/O than computations (many short CPU bursts).
  - **CPU-Bound:** Spends more time doing computations (few very long CPU bursts).  
  *ببساطة:* أحسن خليط للنظام يكون فيه شوية I/O-bound وشوية CPU-bound عشان المعالج والأجهزة يشتغلوا سوا.
- **Context Switch:** Saving the state (PCB) of the old process and loading the saved state of the new process.
  > **Key Exam Fact:** Context-switch time is **pure overhead** because the system does **no useful work** while switching.  
  *ببساطة:* وقت التبديل بين عمليتين ده وقت ضايع (Overhead) الجهاز مش بينفّذ فيه شغل فعلي للمستخدم.

---

## 4. Operations on Processes (Creation & Termination)

- **UNIX Process System Calls:**
  - \`fork()\`: Creates a new child process (duplicate of parent). Returns **\`0\` to the child**, **child's PID (> 0) to the parent**, and **\`< 0\` on error**.
  - \`exec()\`: Replaces the process's memory space with a **new program**.
  - \`wait()\`: Parent waits for the child process to terminate and collects its exit status.
  - \`exit()\` / \`abort()\`: Normal termination vs. forced termination by parent.  
  *ببساطة:* \`fork\` بتنسخ الأب وتطلع ابن، \`exec\` بتغيّر البرنامج اللي جوه الابن، و \`wait\` بتخلي الأب يستنى ابنه يخلص.
- **Cascading Termination:** Some OSes do not allow children to exist if their parent terminates, so all descendants are automatically terminated.
- **Zombie vs. Orphan Process:**
  - **Zombie Process:** A child that has **terminated**, but its parent has **not yet called \`wait()\`** (its entry remains in the process table).
  - **Orphan Process:** A child still running after its **parent terminated without calling \`wait()\`** (adopted by \`init\` / \`systemd\`).  
  *ببساطة:* الـ Zombie ابن مات ولسه أبوه ما استلمش خبره بـ \`wait\`، أما الـ Orphan فده ابن لسه عايش وأبوه قفل وسابه.

---

## 5. CPU Scheduling Calculations (FCFS vs. SJF)

$$\\text{Turnaround Time (TAT)} = \\text{Completion Time} - \\text{Arrival Time}$$

$$\\text{Waiting Time (WT)} = \\text{Turnaround Time} - \\text{Burst Time}$$

- **FCFS (First-Come, First-Served):** Executes in arrival order; simple, non-preemptive, but suffers from the **Convoy Effect** (short processes stuck behind one long CPU-bound process).
  - *Example (\`P1=24, P2=3, P3=3\` at \`t=0\`):* Waiting times = \`0, 24, 27\` → **Avg WT = 17 ms**.
- **SJF (Shortest-Job-First):** Executes the shortest burst time first; provably **optimal** (minimum Average Waiting Time), but may cause **Starvation** for long jobs.
  - *Same Example (\`P2=3, P3=3, P1=24\`):* Waiting times = \`0, 3, 6\` → **Avg WT = 3 ms**!  
  *ببساطة:* في FCFS اللي ييجي الأول يدخل حتى لو طويل ويعطّل الباقي، أما SJF بيخلّص القصيرين الأول فالمتوسط بيقل جامد.

---

## 6. Interprocess Communication (IPC)

- **Independent vs. Cooperating Processes:** Cooperating processes share data for *Information Sharing*, *Computation Speedup*, *Modularity*, and *Convenience*.
- **Two Fundamental IPC Models:**

| Model | How It Works (English) | Best For | التوضيح بالعامية |
| :--- | :--- | :--- | :--- |
| **Shared Memory** | Processes share a common region of RAM; **OS only sets it up**, then processes communicate directly at memory speed. | Large data & **maximum speed** (sync handled by user). | أوضة ذاكرة مشتركة؛ أسرع بكتير بس المبرمج لازم ينظّم الدخول عشان البيانات متدخلش في بعض |
| **Message Passing** | Processes exchange messages via \`send()\` and \`receive()\` **through the OS Kernel**. | Small data, easier to implement, and **distributed systems**. | رسايل رايحة جاية عن طريق النواة؛ أسهل وأأمن بس أبطأ شوية |

- **Communication Details:**
  - **Direct vs. Indirect:** Direct names the exact process (\`send(P, msg)\`); Indirect uses **Mailboxes / Ports**.
  - **Synchronous (Blocking) vs. Asynchronous (Non-Blocking):** Blocking waits until the message is received/available; Non-blocking continues immediately.
  - **Buffering:** **Zero capacity** (rendezvous — sender must wait), **Bounded capacity** (fixed size queue), **Unbounded capacity** (sender never waits).
  - **Pipes:** **Ordinary Pipes** require parent-child relationship (unidirectional); **Named Pipes (FIFO)** allow unrelated processes and are bidirectional.
  - **Client-Server IPC:** **Sockets** (identified by \`IP Address + Port Number\`, e.g., \`161.25.19.8:1625\`) and **RPC (Remote Procedure Call)** using **Stubs**.

> **Exam Tip:** Remember **Shared Memory = fastest (no kernel involvement after setup)**, **Context Switch = pure overhead**, **Long-Term Scheduler = controls Degree of Multiprogramming**, and **Zombie = terminated child before parent calls \`wait()\`**.`,
  },
};
