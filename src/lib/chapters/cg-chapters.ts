import type { InteractiveChapterData } from "@/types/chapter";

// Auto-generated from official CS-321 Computer Graphics lecture HTML decks
// (Interactive slide explanations ONLY — summaries & quizzes are handled separately in CS Portal).
export const CG_CHAPTERS: InteractiveChapterData[] = [
  {
    "lessonId": "22222222-2222-4222-8222-222222222601",
    "courseCode": "CS-321",
    "chapterNum": 1,
    "titleEn": "Introduction to Computer Graphics",
    "titleAr": "مقدمة في الرسوميات بالحاسب",
    "subtitle": "المجالات الأربعة للـ Computer Graphics، الهاردوير والـ Frame Buffer، الضوء والـ Pinhole Camera، والعين البشرية والـ API.",
    "bonusComponentId": "cg-ch3-ch4-problems",
    "bonusDefaultTab": "cheatsheet",
    "slides": [
      {
        "id": "cg1-s1",
        "slideRef": "Pages 1, 2 & 3",
        "shortLabel": "1. Introduction & Evolution",
        "title": "Introduction & Evolution of Computer Graphics",
        "enPoints": [
          "<span class=\"cg-emph\">Computer graphics</span> is concerned with <strong>all aspects of producing pictures or images using a computer</strong>.",
          "The field began humbly <strong>50 years ago</strong>, with the display of a few lines on a <strong>cathode ray tube (CRT)</strong>.",
          "Currently, we can generate images by computer that are <span class=\"cg-emph\">indistinguishable</span> from photographs of real objects."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف علم <span class='en-term' dir='ltr'>Computer graphics</span>: هو العلم المهتم بـ <span class='hl-yellow'>جميع جوانب إنتاج الصور أو الرسومات باستخدام الكمبيوتر</span>.",
        "deepPoints": [
          "المجال ده بدأ بداية متواضعة من حوالي <strong>50 سنة</strong> بمجرد عرض شوية خطوط بسيطة على شاشة أنبوبة أشعة الكاثود <span class='en-term' dir='ltr'>Cathode Ray Tube (CRT)</span>.",
          "حالياً وصلنا لمرحلة إننا بنقدر نولد صور بالكمبيوتر <span class='hl-rose'>لا يمكن تفرقتها (Indistinguishable)</span> عن الصور الفوتوغرافية الحقيقية.",
          "<strong>الفرق الجوهري بين Computer Graphics و Image Processing:</strong> في <span class=\"math-pill\">Computer Graphics</span> المدخل هو وصف رياضي/هندسي (<span class=\"math-pill\">Models / Data</span>) والمخرج صورة، بينما في <span class=\"math-pill\">Image Processing</span> المدخل والمخرج كلاهما صورة.",
          "<strong>تطور المجال في 50 سنة:</strong> انتقل من رسم خطوط بسيطة على <span class=\"math-pill\">CRT</span> إلى توليد مشاهد ثلاثية الأبعاد واقعية بالكامل (<span class=\"math-pill\">Photorealistic 3D Rendering</span>) بالزمن الحقيقي."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is computer graphics concerned with, and how did the field begin 50 years ago?</div><div><strong>الإجابة النموذجية:</strong> It is concerned with all aspects of producing pictures or images using a computer; it began 50 years ago with displaying a few lines on a cathode ray tube (CRT).</div>",
        "notebookEn": "Computer Graphics Definition: Concerned with all aspects of producing pictures or images using a computer.\nHistorical Evolution: Began 50 years ago with a few lines on a CRT; today generates images indistinguishable from real photographs.",
        "notebookAr": "علم الجرافيكس بيهتم بكل تفاصيل إنتاج الصور والرسومات بالكمبيوتر.\nبدأ من 50 سنة بخطوط بسيطة على شاشة CRT، ودلوقتي بيطلع صور متفرقهاش عن الحقيقة."
      },
      {
        "id": "cg1-s2",
        "slideRef": "Page 4",
        "shortLabel": "2. Four Major Areas",
        "title": "Four Major Areas of Computer Graphics Applications",
        "enPoints": [
          "The applications of computer graphics are many and varied; we can, however, divide them into <strong>four major areas</strong>:",
          "1. <strong>Display of Information</strong>",
          "2. <strong>Design</strong>",
          "3. <strong>Simulation and Animation</strong>",
          "4. <strong>User Interfaces</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تطبيقات الجرافيكس كتيرة ومتنوعة جداً، بس بنقسمها إلى <span class='hl-cyan'>4 مجالات رئيسية (Four major areas)</span>:",
        "deepPoints": [
          "1️⃣ عرض البيانات والمعلومات <span class='en-term' dir='ltr'>Display of Information</span>.",
          "2️⃣ التصميم الهندسي والمعماري <span class='en-term' dir='ltr'>Design</span>.",
          "3️⃣ المحاكاة والرسوم المتحركة <span class='en-term' dir='ltr'>Simulation and Animation</span>.",
          "4️⃣ واجهات المستخدم الرسومية <span class='en-term' dir='ltr'>User Interfaces</span>.",
          "<strong>تقسيم التطبيقات الأربعة ثابت في الامتحانات:</strong> احفظ الأربعة بالترتيب: <span class=\"math-pill\">Display of Information</span>، <span class=\"math-pill\">Design</span>، <span class=\"math-pill\">Simulation & Animation</span>، و <span class=\"math-pill\">User Interfaces</span>.",
          "<strong>فخ شائع في MCQ:</strong> لو جالك مثال زي <span class=\"math-pill\">Medical Imaging</span> أو <span class=\"math-pill\">Weather Maps</span> يتصنف تحت <span class=\"math-pill\">Display of Information</span> مش <span class=\"math-pill\">Design</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the four major areas into which computer graphics applications are divided?</div><div><strong>الإجابة النموذجية:</strong> 1. Display of Information, 2. Design, 3. Simulation and Animation, 4. User Interfaces.</div>",
        "notebookEn": "Four Major Application Areas: (1) Display of Information, (2) Design, (3) Simulation and Animation, (4) User Interfaces.",
        "notebookAr": "الأربع مجالات الأساسية لتطبيقات الجرافيكس (احفظهم بالترتيب)."
      },
      {
        "id": "cg1-s3",
        "slideRef": "Pages 5, 6 & 7",
        "shortLabel": "3. Display of Information",
        "title": "1. Display of Information & Scientific Visualization",
        "enPoints": [
          "The field of <span class=\"cg-emph\">scientific visualization</span> provides graphical tools that help researchers to <strong>interpret the vast quantity of data</strong> that they generate.",
          "In fields such as <span class=\"cg-emph\">fluid flow</span>, <span class=\"cg-emph\">molecular biology</span>, and <span class=\"cg-emph\">mathematics</span>, images generated by <strong>conversion of data to geometric entities</strong> that can be displayed have yielded new insights into complex processes.",
          "The system used a <strong>mathematical model</strong> to generate the data."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أول مجال هو <span class='en-term' dir='ltr'>Display of Information</span>، وأهم تطبيق فيه هو التصور العلمي <span class='hl-rose'>Scientific visualization</span>.",
        "deepPoints": [
          "وظيفة الـ <span class='en-term' dir='ltr'>Scientific visualization</span> إنه بيوفر أدوات رسومية تساعد الباحثين في <span class='hl-yellow'>تفسير الكميات الضخمة من البيانات (Interpret vast quantity of data)</span>.",
          "في مجالات زي سريان الموائع <span class='en-term' dir='ltr'>Fluid flow</span>، البيولوجيا الجزيئية <span class='en-term' dir='ltr'>Molecular biology</span>، والرياضيات <span class='en-term' dir='ltr'>Mathematics</span>، بنحول البيانات إلى <span class='hl-emerald'>كيانات هندسية (Geometric entities)</span> نقدر نعرضها على الشاشة عشان نفهم العمليات المعقدة.",
          "<strong>ليه Scientific Visualization ضروري؟</strong> الباحثين في <span class=\"math-pill\">Fluid Flow</span> و <span class=\"math-pill\">Molecular Biology</span> بيطلعوا ملايين الأرقام، والعين البشرية تكتشف الأنماط في صورة ملونة أسرع بمراحل من جدول أرقام.",
          "<strong>معلومة مفتاحية:</strong> التصور العلمي (<span class=\"math-pill\">Scientific Visualization</span>) هدفه <strong>تفسير بيانات ضخمة</strong> (<span class=\"math-pill\">Interpret vast quantity of data</span>) وليس إنشاء رسوم ترفيهية."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which field provides graphical tools to help researchers interpret vast quantities of data in fluid flow, molecular biology, and mathematics?</div><div><strong>الإجابة النموذجية:</strong> Scientific visualization (by converting data to geometric entities).</div>",
        "notebookEn": "Scientific Visualization (Area 1: Display of Information): Helps researchers interpret vast quantities of data by converting data into geometric entities (used in fluid flow, molecular biology, mathematics).",
        "notebookAr": "الـ Scientific visualization بيحول البيانات الضخمة لأشكال هندسية عشان الباحثين يفهموها."
      },
      {
        "id": "cg1-s4",
        "slideRef": "Pages 8, 9 & 10",
        "shortLabel": "4. Design: Iterative Process,",
        "title": "2. Design: Iterative Process, Overdetermined vs. Underdetermined",
        "enPoints": [
          "Professions such as <strong>engineering and architecture</strong> are concerned with <span class=\"cg-emph\">design</span>. Starting with a set of specifications, they seek a <strong>cost-effective solution</strong> that satisfies the specifications.",
          "<strong>Design is an iterative process.</strong> Rarely in the real world is a problem specified such that there is a <span class=\"cg-emph\">unique</span> optimal solution.",
          "Design problems are either <span class=\"cg-emph\">overdetermined</span>, such that they <strong>possess no solution</strong> that satisfies all the criteria, or <span class=\"cg-emph\">underdetermined</span>, such that they <strong>have multiple solutions</strong> that satisfy the design criteria."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المجال الثاني هو <span class='en-term' dir='ltr'>Design</span> في الهندسة والعمارة، والهدف فيه الوصول لـ <span class='hl-emerald'>حل اقتصادي فعال (Cost-effective solution)</span> يحقق المواصفات المطلوبة.",
        "deepPoints": [
          "<strong>طبيعة عملية التصميم:</strong> التصميم هو <span class='hl-yellow'>عملية تكرارية (Iterative process)</span> (المصمم يولد تصميم، يختبره، ويستخدم النتيجة لاستكشاف حلول أخرى)، ونادراً جداً في الواقع ما يكون للمشكلة حل مثالي وحيد <span class='en-term' dir='ltr'>Unique optimal solution</span>.",
          "<strong>مقارنة امتحان مهمة جداً (صفحة 10):</strong> مشاكل التصميم إما:",
          "1️⃣ <span class='hl-rose'>Overdetermined</span>: مقيدة بشروط متعارضة زيادة عن اللزوم، فبالتالي <strong>ليس لها أي حل (Possess NO solution)</strong> يحقق كل المعايير.",
          "2️⃣ <span class='hl-cyan'>Underdetermined</span>: مرنة بحيث يكون لها <strong>حلول متعددة (Have MULTIPLE solutions)</strong> تحقق معايير التصميم.",
          "<strong>الفرق القاتل في الامتحان بين المشكلتين:</strong> <span class=\"math-pill\">Overdetermined</span> = شروط كثيرة جداً لدرجة إنه <strong>مفيش ولا حل</strong> يرضيهم كلهم (<span class=\"math-pill\">No solution</span>)، أما <span class=\"math-pill\">Underdetermined</span> = شروط أقل من اللازم فبيطلع <strong>حلول كتير جداً</strong> (<span class=\"math-pill\">Many solutions</span>).",
          "<strong>ليه التصميم عملية تكرارية (Iterative)؟</strong> المصمم يجرّب بدائل ويشوف النتيجة بصرياً فوراً ويعدل المواصفات لحد ما يوصل لأفضل حل من حيث التكلفة (<span class=\"math-pill\">Cost-effective solution</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the difference between overdetermined and underdetermined design problems?</div><div><strong>الإجابة النموذجية:</strong> Overdetermined problems possess NO solution that satisfies all criteria, whereas underdetermined problems have MULTIPLE solutions that satisfy the design criteria.</div>",
        "notebookEn": "Nature of Design: Design is an iterative process seeking a cost-effective solution; rarely is there a unique optimal solution.\nOverdetermined vs. Underdetermined Problems: Overdetermined = possesses NO solution satisfying all criteria | Underdetermined = has MULTIPLE solutions satisfying criteria.",
        "notebookAr": "التصميم عملية تكرارية (نجرب ونعدل)، ونادراً ما يكون فيه حل وحيد مثالي.\nالـ Overdetermined ملهاش ولا حل يحقق كل الشروط، أما الـ Underdetermined ليها حلول كتير."
      },
      {
        "id": "cg1-s5",
        "slideRef": "Pages 11 & 12",
        "shortLabel": "5. Computer-Aided Design Fi…",
        "title": "Computer-Aided Design (CAD) Fields",
        "enPoints": [
          "Today, the use of interactive graphical tools in <span class=\"cg-emph\">computer-aided design (CAD)</span> pervades fields such as:",
          "1. <strong>Architecture</strong>",
          "2. <strong>The design of mechanical parts</strong>",
          "3. <strong>Very-large-scale integrated (VLSI) circuits</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أدوات الجرافيكس التفاعلية في التصميم بمساعدة الحاسب <span class='hl-rose'>Computer-Aided Design (CAD)</span> منتشرة في <strong>3 مجالات أساسية</strong>:",
        "deepPoints": [
          "1️⃣ الهندسة المعمارية <span class='en-term' dir='ltr'>Architecture</span>.",
          "2️⃣ تصميم الأجزاء الميكانيكية <span class='en-term' dir='ltr'>Design of mechanical parts</span>.",
          "3️⃣ تصميم الدوائر المتكاملة واسعة النطاق <span class='en-term' dir='ltr'>Very-Large-Scale Integrated (VLSI) circuits</span>.",
          "<strong>مجالات CAD الأساسية:</strong> الهندسة المعمارية (<span class=\"math-pill\">Architecture</span>)، تصميم الأجزاء الميكانيكية (<span class=\"math-pill\">Mechanical Parts</span>)، وتصميم الدوائر المتكاملة فائقة الكثافة (<span class=\"math-pill\">VLSI Circuits</span>).",
          "<strong>ميزة الجرافيكس التفاعلي في CAD:</strong> تقدر تكتشف تعارض الأجزاء أو أخطاء التصميم قبل التصنيع الفعلي، مما يوفر وقتاً وتكلفة ضخمة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the three main fields where Computer-Aided Design (CAD) pervades?</div><div><strong>الإجابة النموذجية:</strong> 1. Architecture, 2. The design of mechanical parts, 3. Very-large-scale integrated (VLSI) circuits.</div>",
        "notebookEn": "Three Major Fields of CAD: (1) Architecture, (2) Design of mechanical parts, (3) Very-large-scale integrated (VLSI) circuits.",
        "notebookAr": "أهم 3 مجالات للـ CAD: العمارة، قطع الغيار الميكانيكية، وشرائح الـ VLSI الإلكترونية."
      },
      {
        "id": "cg1-s6",
        "slideRef": "Pages 13, 14, 15 & 16",
        "shortLabel": "6. Simulation and Animation",
        "title": "3. Simulation and Animation (Flight Simulators & VLSI Arcade Games)",
        "enPoints": [
          "Once graphics systems evolved to be capable of generating sophisticated images in <strong>real time</strong>, designers and researchers began to use them as <strong>simulators</strong>.",
          "<strong>Graphical flight simulators</strong> have proved both to <strong>increase safety</strong> and to <strong>reduce training expenses</strong>.",
          "The use of <strong>special VLSI chips</strong> has led to a generation of <strong>arcade games</strong> as sophisticated as flight simulators (e.g., F16 Fighter Simulator, Driving Car Simulator)."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المجال الثالث هو <span class='en-term' dir='ltr'>Simulation and Animation</span>: أول ما أنظمة الجرافيكس اتطورت وبقت قادرة تولد صور معقدة في <span class='hl-yellow'>الوقت الفعلي (Real time)</span>، بدأ استخدامها كأجهزة محاكاة <span class='en-term' dir='ltr'>Simulators</span>.",
        "deepPoints": [
          "<strong>محاكيات الطيران الرسومية (Graphical flight simulators):</strong> أثبتت نجاحها في حاجتين مهمين جداً: <span class='hl-emerald'>زيادة الأمان (Increase safety)</span> و <span class='hl-cyan'>تقليل تكاليف التدريب (Reduce training expenses)</span>.",
          "استخدام شرائح <span class='en-term' dir='ltr'>Special VLSI chips</span> أدى لظهور جيل من ألعاب الأركيد <span class='en-term' dir='ltr'>Arcade games</span> بنفس دقة وتعقيد محاكيات الطيران.",
          "<strong>نقطة التحول التاريخية:</strong> بمجرد ما أنظمة الجرافيكس قدرت تولّد صور معقدة في <span class=\"math-pill\">Real Time</span>، ظهرت محاكيات الطيران (<span class=\"math-pill\">Flight Simulators</span>) وأثبتت كفاءة عالية جداً في تقليل تكلفة ومخاطر التدريب.",
          "<strong>علاقة VLSI بالألعاب:</strong> تطور شرائح <span class=\"math-pill\">VLSI</span> خفض التكلفة وسمح بنقل الجرافيكس التفاعلي من الأجهزة العملاقة إلى ألعاب الأركيد والأنظمة المنزلية."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What two major benefits have graphical flight simulators proved to provide?</div><div><strong>الإجابة النموذجية:</strong> They increase safety and reduce training expenses.</div>",
        "notebookEn": "Real-Time Simulators & Flight Simulators: Real-time image generation enabled simulators; flight simulators increase safety and reduce training expenses.\nSpecial VLSI Chips in Gaming: Led to arcade games as sophisticated as flight simulators.",
        "notebookAr": "محاكيات الطيران في الـ Real time بتزود الأمان وبتقلل تكلفة التدريب.\nشرائح الـ VLSI الخاصة خلت ألعاب الفيديو بنفس قوة محاكيات الطيران."
      },
      {
        "id": "cg1-s7",
        "slideRef": "Pages 17, 18 & 19",
        "shortLabel": "7. User Interfaces: Visual",
        "title": "4. User Interfaces: Visual Paradigm & Network Browsers",
        "enPoints": [
          "Our interaction with computers has become dominated by a <strong>visual paradigm</strong> that includes <strong>windows, icons, menus, and a pointing device</strong>, such as a mouse.",
          "From a user's perspective, windowing systems such as <span class=\"cg-emph\">Microsoft Windows</span> and the <span class=\"cg-emph\">Macintosh Operating System</span> differ only in details.",
          "Millions of people access the Internet through <span class=\"cg-emph\">graphical network browsers</span>, such as <strong>Firefox, Chrome, Safari, and Internet Explorer</strong>, that use these same interface tools."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المجال الرابع هو واجهات المستخدم <span class='en-term' dir='ltr'>User Interfaces</span>: تعاملنا مع الكمبيوتر بقى محكوم بـ <span class='hl-yellow'>نموذج بصري (Visual paradigm)</span> بيتكون من 4 عناصر (WIMP): النوافذ <span class='en-term' dir='ltr'>Windows</span>، الأيقونات <span class='en-term' dir='ltr'>Icons</span>، القوائم <span class='en-term' dir='ltr'>Menus</span>، وجهاز التأشير <span class='en-term' dir='ltr'>Pointing device</span> زي الماوس.",
        "deepPoints": [
          "من وجهة نظر المستخدم، أنظمة النوافذ زي <span class='en-term' dir='ltr'>Microsoft Windows</span> و <span class='en-term' dir='ltr'>Macintosh OS</span> بتختلف فقط في التفاصيل البسيطة.",
          "ملايين المستخدمين بيدخلوا على الإنترنت من خلال متصفحات الشبكة الرسومية <span class='hl-rose'>Graphical network browsers</span> (زي Firefox, Chrome, Safari, Internet Explorer) اللي بتستخدم نفس أدوات الواجهة دي.",
          "<strong>نموذج WIMP في واجهات المستخدم:</strong> الواجهات الحديثة تعتمد على 4 عناصر أساسية: <span class=\"math-pill\">Windows</span> + <span class=\"math-pill\">Icons</span> + <span class=\"math-pill\">Menus</span> + <span class=\"math-pill\">Pointing Device (Mouse)</span>.",
          "<strong>تأثير متصفحات الشبكة:</strong> المتصفحات (<span class=\"math-pill\">Network Browsers</span>) وحدت تجربة التعامل مع المعلومات على الإنترنت عبر نفس النموذج البصري بدون كتابة أوامر نصية معقدة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What four elements make up the 'visual paradigm' dominating our interaction with computers?</div><div><strong>الإجابة النموذجية:</strong> Windows, icons, menus, and a pointing device (such as a mouse).</div>",
        "notebookEn": "Visual Paradigm (GUI Elements): Includes windows, icons, menus, and a pointing device (mouse); used in Windows, Mac OS, and graphical network browsers (Firefox, Chrome, Safari, IE).",
        "notebookAr": "الـ Visual paradigm بيتكون من نوافذ وأيقونات وقوائم وماوس، وبيستخدم في أنظمة التشغيل ومتصفحات الإنترنت."
      },
      {
        "id": "cg1-s8",
        "slideRef": "Pages 20, 21, 22, 23, 24 & 25",
        "shortLabel": "8. The Five Types",
        "title": "The Five Types of GUI Icons",
        "enPoints": [
          "The <strong>GUI (Graphical User Interface)</strong> consists of different icons such as:",
          "1. <strong>Program icons</strong> (e.g., MATLAB, Adobe Reader, Recycle Bin)",
          "2. <strong>Object icons</strong> (e.g., Desktop, Documents, Local Disk C:, DVD Drive)",
          "3. <strong>Menu icons</strong> (e.g., New, Open, Save, Save As, Print)",
          "4. <strong>Check-Box icons</strong> (square toggle boxes in settings dialogs)",
          "5. <strong>Spinner icons</strong> (numeric boxes with up/down increment arrows)"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تتكون واجهة المستخدم الرسومية <span class='en-term' dir='ltr'>GUI</span> من <span class='hl-cyan'>5 أنواع مختلفة من الأيقونات</span> (موضع سؤال تعداد أو اختياري):",
        "deepPoints": [
          "1️⃣ <span class='en-term' dir='ltr'>Program icons</span> (صفحة 21): أيقونات تشغيل البرامج على سطح المكتب.",
          "2️⃣ <span class='en-term' dir='ltr'>Object icons</span> (صفحة 22): أيقونات المجلدات والملفات والأقراص الصلبة.",
          "3️⃣ <span class='en-term' dir='ltr'>Menu icons</span> (صفحة 23): الأيقونات الموجودة داخل قوائم الأوامر مثل فتح وحفظ وطباعة.",
          "4️⃣ <span class='en-term' dir='ltr'>Check-Box icons</span> (صفحة 24): مربعات وضع علامة صح لتفعيل أو إلغاء خيارات الإعدادات.",
          "5️⃣ <span class='en-term' dir='ltr'>Spinner icons</span> (صفحة 25): خانات الأرقام المزودة بأسهم صغيرة لأعلى وأسفل لزيادة أو إنقاص القيمة.",
          "<strong>راجع الفرق بين أنواع الأيقونات الخمسة:</strong> <span class=\"math-pill\">Program</span> (تشغيل تطبيق مثل MATLAB)، <span class=\"math-pill\">Object</span> (ملفات وأقراص مثل Desktop/Documents)، <span class=\"math-pill\">Shortcut</span> (اختصار بسهم صغير)، <span class=\"math-pill\">System</span> (إعدادات النظام)، و <span class=\"math-pill\">Toolbar</span> (أدوات داخل التطبيق).",
          "<strong>سؤال متكرر:</strong> <span class=\"math-pill\">Recycle Bin</span> مذكورة في السلايد كمثال مع <span class=\"math-pill\">Program icons</span> أو أيقونات سطح المكتب، فالتزم حرفياً بأمثلة السلايد في الامتحان."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: List the five types of icons that a GUI consists of.</div><div><strong>الإجابة النموذجية:</strong> 1. Program icons, 2. Object icons, 3. Menu icons, 4. Check-Box icons, 5. Spinner icons.</div>",
        "notebookEn": "Five Types of GUI Icons: (1) Program icons, (2) Object icons, (3) Menu icons, (4) Check-Box icons, (5) Spinner icons.",
        "notebookAr": "الـ 5 أنواع للأيقونات في واجهة المستخدم الرسومية GUI."
      },
      {
        "id": "cg1-s9",
        "slideRef": "Pages 26, 27 & 28",
        "shortLabel": "9. Graphics System Architec…",
        "title": "Graphics System Architecture (The 6 Major Elements)",
        "enPoints": [
          "A <strong>computer graphic system</strong> is a computer system; as such, it must have all the components of a <strong>general-purpose computer system</strong>.",
          "There are <strong>six major elements</strong> in our system:",
          "1. <strong>Input devices</strong>",
          "2. <strong>Central Processing Unit (CPU)</strong>",
          "3. <strong>Graphics Processing Unit (GPU)</strong>",
          "4. <strong>Memory</strong> (CPU Memory &amp; GPU Memory)",
          "5. <strong>Frame buffer</strong>",
          "6. <strong>Output devices</strong>"
        ],
        "svg": "<svg viewBox=\"0 0 540 250\" ><rect x=\"5\" y=\"5\" width=\"530\" height=\"240\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <!-- Input devices -->\n                <rect x=\"25\" y=\"25\" width=\"75\" height=\"36\" rx=\"5\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"62\" y=\"47\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Keyboard</text>\n                <rect x=\"25\" y=\"95\" width=\"75\" height=\"36\" rx=\"5\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"62\" y=\"117\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Data Tablet</text>\n                <rect x=\"25\" y=\"165\" width=\"75\" height=\"36\" rx=\"5\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"62\" y=\"187\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Mouse</text>\n                <path d=\"M100,43 L125,43 L125,183 L100,183 M100,113 L150,113\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <!-- CPU & CPU Memory -->\n                <rect x=\"150\" y=\"85\" width=\"82\" height=\"54\" fill=\"#bae6fd\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n                <text x=\"191\" y=\"108\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Central</text>\n                <text x=\"191\" y=\"124\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">processor</text>\n                <rect x=\"150\" y=\"170\" width=\"82\" height=\"50\" fill=\"#bae6fd\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n                <text x=\"191\" y=\"192\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">CPU</text>\n                <text x=\"191\" y=\"208\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Memory</text>\n                <line x1=\"191\" y1=\"139\" x2=\"191\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <!-- GPU & GPU Memory -->\n                <line x1=\"232\" y1=\"112\" x2=\"262\" y2=\"112\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <rect x=\"262\" y=\"85\" width=\"82\" height=\"54\" fill=\"#bae6fd\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n                <text x=\"303\" y=\"108\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Graphics</text>\n                <text x=\"303\" y=\"124\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">processor</text>\n                <rect x=\"262\" y=\"170\" width=\"82\" height=\"50\" fill=\"#bae6fd\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n                <text x=\"303\" y=\"192\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">GPU</text>\n                <text x=\"303\" y=\"208\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Memory</text>\n                <line x1=\"303\" y1=\"139\" x2=\"303\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <!-- Frame Buffer & Output -->\n                <line x1=\"344\" y1=\"112\" x2=\"374\" y2=\"112\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <rect x=\"374\" y=\"85\" width=\"76\" height=\"54\" fill=\"#bae6fd\" stroke=\"#0284c7\" stroke-width=\"2\"/>\n                <text x=\"412\" y=\"108\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Frame</text>\n                <text x=\"412\" y=\"124\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">buffer</text>\n                <line x1=\"450\" y1=\"112\" x2=\"475\" y2=\"112\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <rect x=\"475\" y=\"72\" width=\"46\" height=\"76\" rx=\"4\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"2.5\"/>\n                <text x=\"498\" y=\"114\" font-family=\"Inter\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Display</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "نظام الجرافيكس هو في الأساس نظام كمبيوتر متكامل، وبالتالي لازم يحتوي على كل مكونات الكمبيوتر العام <span class='en-term' dir='ltr'>General-purpose computer system</span>.",
        "deepPoints": [
          "<strong>يتكون نظام الجرافيكس من <span class='hl-yellow'>6 عناصر رئيسية (Six major elements)</span> كما في المخطط (صفحة 27–28):</strong>",
          "1️⃣ أجهزة الإدخال <span class='en-term' dir='ltr'>Input devices</span> (كيبورد، تابلت، ماوس).",
          "2️⃣ وحدة المعالجة المركزية <span class='en-term' dir='ltr'>Central Processing Unit (CPU)</span>.",
          "3️⃣ وحدة معالجة الرسوميات <span class='en-term' dir='ltr'>Graphics Processing Unit (GPU)</span>.",
          "4️⃣ الذاكرة <span class='en-term' dir='ltr'>Memory</span> (ذاكرة الـ CPU وذاكرة الـ GPU).",
          "5️⃣ ذاكرة الإطار <span class='en-term' dir='ltr'>Frame buffer</span>.",
          "6️⃣ أجهزة الإخراج <span class='en-term' dir='ltr'>Output devices</span> (الشاشة).",
          "<strong>المكونات الستة لنظام الجرافيكس:</strong> <span class=\"math-pill\">1. Input devices</span>، <span class=\"math-pill\">2. Processor (CPU)</span>، <span class=\"math-pill\">3. Memory</span>، <span class=\"math-pill\">4. Frame Buffer</span>، <span class=\"math-pill\">5. Output devices</span>، و <span class=\"math-pill\">6. Graphics Processor (GPU)</span>.",
          "<strong>ليه الـ Frame Buffer متميز عن الذاكرة العادية؟</strong> لأنه الجزء المخصص لتخزين مصفوفة البكسلات الجاهزة للعرض المباشر على الشاشة بسرعة عالية ومستمرة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the six major hardware elements in a computer graphics system?</div><div><strong>الإجابة النموذجية:</strong> 1. Input devices, 2. CPU, 3. GPU, 4. Memory, 5. Frame buffer, 6. Output devices.</div>",
        "notebookEn": "Six Major Elements of a Graphics System: (1) Input devices, (2) Central Processing Unit (CPU), (3) Graphics Processing Unit (GPU), (4) Memory, (5) Frame buffer, (6) Output devices.",
        "notebookAr": "الـ 6 مكونات الأساسية لأي نظام جرافيكس (بالترتيب من الإدخال للإخراج)."
      },
      {
        "id": "cg1-s10",
        "slideRef": "Page 29",
        "shortLabel": "10. Pixels, the Raster,",
        "title": "Pixels, the Raster, and Frame Buffer Depth (Precision)",
        "enPoints": [
          "The image we see on the output device is an <strong>array—the raster—of picture elements, or pixels</strong>, produced by the graphics system.",
          "The pixels are stored in a part of memory called the <span class=\"cg-emph\">frame buffer</span>.",
          "The <span class=\"cg-emph\">depth</span>, or <span class=\"cg-emph\">precision</span>, of the frame buffer, is defined as the <strong>number of bits that are used for each pixel</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "3 تعريفات امتحانية في غاية الأهمية في صفحة 29:",
        "deepPoints": [
          "1️⃣ <span class='hl-cyan'>The Raster</span>: الصورة اللي بنشوفها على جهاز الإخراج هي عبارة عن مصفوفة <span class='en-term' dir='ltr'>Array</span> من عناصر الصورة <span class='en-term' dir='ltr'>Picture elements (pixels)</span>.",
          "2️⃣ <span class='hl-rose'>Frame Buffer</span>: هو الجزء المخصص من الذاكرة اللي بتتخزن فيه البكسلات <span class='en-term' dir='ltr'>Part of memory where pixels are stored</span>.",
          "3️⃣ <span class='hl-yellow'>Depth (or Precision) of the Frame Buffer</span>: يُعرّف بأنه <strong>عدد البتات المستخدمة لكل بكسل (Number of bits that are used for each pixel)</strong>.",
          "<strong>تعريفان لازم تفرق بينهم بدقة:</strong> <span class=\"math-pill\">Raster</span> هو مصفوفة البكسلات ثنائية الأبعاد نفسها، بينما <span class=\"math-pill\">Frame Buffer</span> هو جزء الذاكرة اللي بيخزن المصفوفة دي.",
          "<strong>ما المقصود بـ Depth (Precision)؟</strong> عدد البتات المخصصة لكل بكسل (<span class=\"math-pill\">bits/pixel</span>)، وكل ما يزيد العمق تزيد عدد الألوان اللي يقدر النظام يعرضها بدقة أعلى."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How is the depth (or precision) of the frame buffer defined, and where are pixels stored?</div><div><strong>الإجابة النموذجية:</strong> Pixels are stored in the frame buffer; its depth (or precision) is defined as the number of bits used for each pixel.</div>",
        "notebookEn": "Raster & Pixels: The displayed image is an array (the raster) of picture elements (pixels).\nFrame Buffer & Its Depth (Precision): Frame buffer = part of memory storing pixels | Depth (precision) = number of bits used for each pixel.",
        "notebookAr": "الـ Raster هو مصفوفة البكسلات المعروضة على الشاشة.\nالـ Frame buffer هو الذاكرة اللي بتشيل البكسلات، والـ Depth أو Precision هو عدد الـ bits لكل بكسل."
      },
      {
        "id": "cg1-s11",
        "slideRef": "Pages 30 & 31",
        "shortLabel": "11. Pels / Pixels,",
        "title": "Pels / Pixels, Bit Depth & Number of Possible Colors",
        "enPoints": [
          "These picture elements (known as <strong>pels</strong> or, more commonly, <strong>pixels</strong>) can be either on or off, as in the <strong>1-bit bitmap</strong> (2 colors: 0, 1).",
          "By using more bits to describe them, we can represent varying shades of color (<span dir='ltr'>2<sup>n</sup></span> colors):",
          "&bull; <strong>1-bit:</strong> 2 colors &nbsp;|&nbsp; <strong>2-bit:</strong> 4 colors",
          "&bull; <span class=\"cg-emph\">1. 4 bits for 16 colors;</span>",
          "&bull; <span class=\"cg-emph\">2. 8 bits for 256 colors;</span>",
          "&bull; <span class=\"cg-emph\">3. 15 bits for 32,768 colors;</span>",
          "&bull; <span class=\"cg-emph\">4. 16 bits for 65,536 colors;</span>",
          "&bull; <span class=\"cg-emph\">5. 24 bits for 16,772,216 (2<sup>24</sup> = 16,777,216) colors.</span>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عناصر الصورة بيتقال عليها اختصاراً <span class='hl-yellow'>Pels</span> أو الاسم الأشهر <span class='hl-yellow'>Pixels</span>.",
        "deepPoints": [
          "في الـ <span class='en-term' dir='ltr'>1-bit bitmap</span> البكسل بيكون إما منور أو مطفي (On or Off يعني لونين بس: 0 أو 1).",
          "كل ما نزود عدد البتات (<span dir='ltr'>n bits</span>)، عدد الألوان الممكنة بيزيد بالقانون <span class='math-pill'>2<sup>n</sup> colors</span>:",
          "• <strong>4 bits:</strong> <span dir='ltr'>2<sup>4</sup> = 16 colors</span>.",
          "• <strong>8 bits:</strong> <span dir='ltr'>2<sup>8</sup> = 256 colors</span>.",
          "• <strong>15 bits:</strong> <span dir='ltr'>2<sup>15</sup> = 32,768 colors</span>.",
          "• <strong>16 bits:</strong> <span dir='ltr'>2<sup>16</sup> = 65,536 colors</span>.",
          "• <strong>24 bits:</strong> ملايين الألوان (<span dir='ltr'>2<sup>24</sup> = 16,777,216</span> ومكتوبة في السلايد <span dir='ltr'>16,772,216</span> — احفظ الرقمين للاختيارات!).",
          "<strong>القانون الذهبي لحساب الألوان:</strong> لو عمق اللون <span class=\"math-pill\">n bits/pixel</span>، فعدد الألوان الممكنة = <span class=\"math-pill\">2^n</span>. مثال: <span class=\"math-pill\">1-bit → 2 colors</span>، <span class=\"math-pill\">8-bit → 256 colors</span>، <span class=\"math-pill\">24-bit → 16,777,216 colors</span>.",
          "<strong>مصطلح بديل مهم:</strong> كلمة <span class=\"math-pill\">Pel</span> هي اختصار لـ <span class=\"math-pill\">Picture Element</span> وهي مرادف تماماً لـ <span class=\"math-pill\">Pixel</span> وبتيجي في أسئلة الصح والغلط."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How many colors can be represented using 4 bits, 8 bits, 15 bits, 16 bits, and 24 bits per pixel?</div><div><strong>الإجابة النموذجية:</strong> 4 bits = 16; 8 bits = 256; 15 bits = 32,768; 16 bits = 65,536; 24 bits = 16,772,216 (2^24) colors.</div>",
        "notebookEn": "Pels / Pixels & Bit Depth Color Counts (2^n): 1-bit = 2 | 2-bit = 4 | 4-bit = 16 | 8-bit = 256 | 15-bit = 32,768 | 16-bit = 65,536 | 24-bit = 16,772,216 (16.7M) colors.",
        "notebookAr": "حفظ جدول عدد الألوان لكل Bit depth بالقانون 2 أس عدد البتات."
      },
      {
        "id": "cg1-s12",
        "slideRef": "Page 32",
        "shortLabel": "12. Full-Color Systems",
        "title": "Full-Color Systems (24 or More Bits per Pixel)",
        "enPoints": [
          "In <span class=\"cg-emph\">full-color systems</span>, there are <strong>24 (or more) bits per pixel</strong>.",
          "Such systems can display sufficient colors to represent most images <strong>realistically</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف أنظمة الألوان الكاملة <span class='hl-rose'>Full-color systems</span> (وتسمى أيضاً True-color systems): هي الأنظمة اللي بيكون فيها <strong>24 بت (أو أكتر) لكل بكسل (24 or more bits per pixel)</strong>.",
        "deepPoints": [
          "الأنظمة دي بتقدر تعرض درجات ألوان كافية لتمثيل معظم الصور بواقعية تامة <span class='hl-emerald'>Realistically</span>.",
          "<strong>كيف تتوزع الـ 24-bit في أنظمة Full-Color؟</strong> تُقسم بالتساوي على 3 قنوات: <span class=\"math-pill\">8 bits Red</span> + <span class=\"math-pill\">8 bits Green</span> + <span class=\"math-pill\">8 bits Blue</span>، يعني <span class=\"math-pill\">256 × 256 × 256 ≈ 16.7M colors</span>.",
          "<strong>ليه بنحتاج أحياناً أكثر من 24-bit (مثل 32-bit)؟</strong> الـ 8 بتات الإضافية تُستخدم لقناة الشفافية <span class=\"math-pill\">Alpha Channel (RGBA)</span> أو لمحاذاة الذاكرة (<span class=\"math-pill\">Memory Alignment</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How many bits per pixel are there in 'full-color systems'?</div><div><strong>الإجابة النموذجية:</strong> 24 (or more) bits per pixel.</div>",
        "notebookEn": "Full-Color Systems Definition: Systems with 24 (or more) bits per pixel, capable of displaying sufficient colors to represent images realistically.",
        "notebookAr": "نظام الـ Full-color هو اللي بيستخدم 24 بت أو أكتر لكل بكسل."
      },
      {
        "id": "cg1-s13",
        "slideRef": "Page 33",
        "shortLabel": "13. The CPU, the",
        "title": "The CPU, the GPU & the Graphical Function",
        "enPoints": [
          "In a <strong>simple system</strong>, there may be only one processor, the <span class=\"cg-emph\">(CPU)</span> of the system, which must do <strong>both the normal processing and the graphical processing</strong>.",
          "The <span class=\"cg-emph\">graphical function</span> of the processor is to <strong>take specifications of graphical primitives and to assign values to the pixels in the frame buffer</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في الأنظمة البسيطة <span class='en-term' dir='ltr'>Simple system</span>، ممكن يكون فيه معالج واحد بس هو الـ <span class='en-term' dir='ltr'>CPU</span>، وساعتها بيقوم بالمعالجة العادية والمعالجة الرسومية مع بعض.",
        "deepPoints": [
          "<strong>ما هي الوظيفة الرسومية للمعالج (<span class='hl-rose'>The graphical function of the processor</span>)؟</strong>",
          "هي إنه ياخد مواصفات الأشكال الأولية <span class='hl-yellow'>Take specifications of graphical primitives</span> ويحولها ويعيّن قيم للبكسلات جوه الـ Frame buffer <span class='hl-emerald'>Assign values to the pixels in the frame buffer</span> (وهذه العملية تسمى أيضاً Scan conversion أو Rasterization).",
          "<strong>الوظيفة الجرافيكية الأساسية للمعالج (Rasterization / Scan Conversion):</strong> تحويل الأوصاف الهندسية المجردة (مثل نقطتي بداية ونهاية خط) إلى مجموعة بكسلات مضاءة داخل الـ <span class=\"math-pill\">Frame Buffer</span>.",
          "<strong>متى نحتاج GPU؟</strong> في الأنظمة البسيطة يقوم الـ <span class=\"math-pill\">CPU</span> بكل شيء، أما في الأنظمة الحديثة فيتولى الـ <span class=\"math-pill\">GPU</span> العمليات الرسومية بالتوازي لتسريع الرسم."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the main graphical function of the processor (CPU/GPU)?</div><div><strong>الإجابة النموذجية:</strong> To take specifications of graphical primitives and assign values to the pixels in the frame buffer.</div>",
        "notebookEn": "Graphical Function of the Processor (CPU/GPU): Takes specifications of graphical primitives and assigns values to the pixels in the frame buffer.",
        "notebookAr": "الوظيفة الرسومية للمعالج هي إنه ياخد أوصاف الـ Primitives ويلون البكسلات المناسبة في الـ Frame buffer."
      },
      {
        "id": "cg1-s14",
        "slideRef": "Pages 34 & 35",
        "shortLabel": "14. Output Devices: The",
        "title": "Output Devices: The Cathode-Ray Tube (CRT) & DAC",
        "enPoints": [
          "Until recently, the dominant type of display (or monitor) was the <strong>cathode-ray tube (<span class=\"cg-emph\">CRT</span>)</strong>.",
          "When <strong>electrons strike the phosphor coating</strong> on the tube, <strong>light is emitted</strong>.",
          "The output of the computer is converted, by <span class=\"cg-emph\">digital-to-analog converters (DAC)</span>, to <strong>voltages across the x and y deflection plates</strong>.",
          "Light appears on the surface of the CRT when a <strong>sufficiently intense beam of electrons</strong> is directed at the phosphor."
        ],
        "svg": "<svg viewBox=\"0 0 460 220\" ><rect x=\"5\" y=\"5\" width=\"450\" height=\"210\" fill=\"#fff\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n                <path d=\"M120,85 L235,85 L375,25 L375,195 L235,135 L120,135 Z\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <ellipse cx=\"375\" cy=\"110\" rx=\"22\" ry=\"85\" fill=\"#bae6fd\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <rect x=\"135\" y=\"104\" width=\"22\" height=\"12\" fill=\"#e2e8f0\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <ellipse cx=\"176\" cy=\"110\" rx=\"6\" ry=\"20\" fill=\"#bae6fd\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <rect x=\"195\" y=\"96\" width=\"42\" height=\"28\" fill=\"#bae6fd\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <line x1=\"157\" y1=\"110\" x2=\"232\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <line x1=\"232\" y1=\"110\" x2=\"375\" y2=\"68\" stroke=\"#e11d48\" stroke-width=\"2.5\"/>\n                <text x=\"48\" y=\"114\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">Electron gun</text>\n                <text x=\"155\" y=\"175\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">Focus</text>\n                <text x=\"192\" y=\"55\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">y deflect</text>\n                <text x=\"260\" y=\"128\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">x deflect</text>\n                <text x=\"348\" y=\"114\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">Phosphor</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "لفترة قريبة كان النوع السائد من الشاشات هو أنبوبة أشعة الكاثود <span class='hl-rose'>Cathode-Ray Tube (CRT)</span>.",
        "deepPoints": [
          "<strong>فكرة عمل الـ CRT في 3 نقاط:</strong>",
          "1️⃣ مدفع الإلكترونات <span class='en-term' dir='ltr'>Electron gun</span> يطلق شعاع إلكترونات يمر عبر نظام التركيز <span class='en-term' dir='ltr'>Focus</span>، ولما الإلكترونات تصطدم بطبقة الفسفور <span class='hl-emerald'>Phosphor coating</span> ينبعث الضوء.",
          "2️⃣ مخرجات الكمبيوتر الرقمية بتتحول عن طريق <span class='hl-yellow'>محولات رقمية-تماثلية (Digital-to-analog converters)</span> إلى <strong>جهود كهربائية (Voltages)</strong> عبر ألواح الانحراف الأفقية والرأسية <span class='en-term' dir='ltr'>x and y deflection plates</span> لتوجيه الشعاع.",
          "<strong>مبدأ عمل CRT خطوة بخطوة:</strong> مدفع إلكترونات يطلق شعاعاً يمر عبر ملفات انحراف (<span class=\"math-pill\">Deflection Coils</span>) ليصطدم بطبقة الفوسفور (<span class=\"math-pill\">Phosphor Coating</span>) فينبعث الضوء.",
          "<strong>دور الـ DAC (Digital-to-Analog Converter):</strong> الـ <span class=\"math-pill\">Frame Buffer</span> يخزن قيماً رقمية (<span class=\"math-pill\">Digital</span>)، بينما الـ <span class=\"math-pill\">CRT</span> جهاز تناظري (<span class=\"math-pill\">Analog</span>)، فيحول الـ DAC القيم الرقمية إلى جهد كهربائي يحدد شدة الإضاءة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In a CRT display, what converts the digital output of the computer into voltages across the x and y deflection plates?</div><div><strong>الإجابة النموذجية:</strong> Digital-to-analog converters (DAC).</div>",
        "notebookEn": "CRT Operation & Digital-to-Analog Converters: Electrons strike phosphor coating -> light is emitted. Computer output is converted by digital-to-analog converters (DAC) to voltages across x and y deflection plates.",
        "notebookAr": "في الـ CRT الإلكترونات بتخبط الفسفور فينور، والـ DAC بيحول إشارة الكمبيوتر لجهود على ألواح الانحراف x و y."
      },
      {
        "id": "cg1-s15",
        "slideRef": "Pages 36 & 37",
        "shortLabel": "15. Input Devices",
        "title": "Input Devices (Keyboard, Mouse, Joystick, Data Tablet, Trackball)",
        "enPoints": [
          "Most graphics systems provide a <span class=\"cg-emph\">keyboard</span> and <span class='underline font-bold'>at least one other input device</span>.",
          "The most common input devices are the <span class=\"cg-emph\">mouse</span>, the <span class=\"cg-emph\">joystick</span>, and the <span class=\"cg-emph\">data tablet</span> (plus the <strong>trackball</strong> shown in Slide 37).",
          "These devices allow a user to <strong>indicate a particular location on the display</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "معظم أنظمة الجرافيكس بتوفر لوحة مفاتيح <span class='hl-rose'>Keyboard</span> و <strong>على الأقل جهاز إدخال آخر واحد</strong>.",
        "deepPoints": [
          "أشهر أجهزة الإدخال لتحديد المواقع على الشاشة هي: الماوس <span class='en-term' dir='ltr'>Mouse</span>، عصا التحكم <span class='en-term' dir='ltr'>Joystick</span>، لوح البيانات الرقمي <span class='en-term' dir='ltr'>Data tablet</span>، وكرة التتبع <span class='en-term' dir='ltr'>Trackball</span>.",
          "الأجهزة دي بتسمح للمستخدم إنه يشير إلى موقع معين على الشاشة <span class='hl-cyan'>Indicate a particular location on the display</span>.",
          "<strong>التكامل بين أجهزة الإدخال:</strong> الكيبورد مثالي للنصوص والأوامر، بينما أجهزة التأشير (<span class=\"math-pill\">Mouse, Joystick, Data Tablet, Trackball</span>) مصممة لتحديد الإحداثيات المكانية (<span class=\"math-pill\">2D/3D Positioning</span>) والتفاعل المباشر.",
          "<strong>تطبيق كل جهاز:</strong> الـ <span class=\"math-pill\">Data Tablet</span> للرسم الهندسي الدقيق، الـ <span class=\"math-pill\">Joystick</span> للمحاكاة والألعاب، والـ <span class=\"math-pill\">Trackball</span> للتحكم الثابت دون تحريك الجهاز كله."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the most common input devices that allow a user to indicate a particular location on the display?</div><div><strong>الإجابة النموذجية:</strong> The mouse, the joystick, the data tablet (and trackball).</div>",
        "notebookEn": "Common Graphics Input Devices: Keyboard + at least one pointing device (Mouse, Joystick, Data tablet, Trackball) to indicate a particular location on the display.",
        "notebookAr": "أجهزة الإدخال الأساسية: الكيبورد + الماوس أو الـ Joystick أو الـ Data tablet أو الـ Trackball."
      },
      {
        "id": "cg1-s16",
        "slideRef": "Page 38",
        "shortLabel": "16. Images: Physical and",
        "title": "Images: Physical and Synthetic (Realistic 3D Images)",
        "enPoints": [
          "In modern systems, we want to exploit the capabilities of the software and hardware to create <span class=\"cg-emph\">realistic</span> images of <strong>computer-generated three-dimensional objects</strong>.",
          "This task involves many aspects of <strong>image formation</strong>, such as <strong>lighting, shading, and properties of materials</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في الأنظمة الحديثة هدفنا نستغل قدرات السوفتوير والهاردوير عشان ننشئ <span class='hl-rose'>صور واقعية (Realistic images)</span> لأجسام ثلاثية الأبعاد مولدة بالكمبيوتر.",
        "deepPoints": [
          "المهمة دي بتتضمن جوانب عديدة من عملية تكوين الصورة <span class='en-term' dir='ltr'>Image formation</span> مثل: الإضاءة <span class='hl-yellow'>Lighting</span>، التظليل <span class='hl-cyan'>Shading</span>، وخصائص المواد والأسطح <span class='hl-emerald'>Properties of materials</span>.",
          "<strong>الهدف من الصور التركيبية (Synthetic Images):</strong> محاكاة الكيفية التي يتفاعل بها الضوء مع الأجسام ثلاثية الأبعاد في العالم الحقيقي لإنتاج صورة واقعية بالكامل باستخدام الحاسوب.",
          "<strong>العناصر المتداخلة في الواقعية:</strong> لا يكفي شكل الجسم فقط، بل نحتاج هندسة (<span class=\"math-pill\">Geometry</span>) + إضاءة (<span class=\"math-pill\">Lighting</span>) + خامات (<span class=\"math-pill\">Materials</span>) + منظور الكاميرا (<span class=\"math-pill\">Projection</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What aspects of image formation are involved in creating realistic images of 3D objects?</div><div><strong>الإجابة النموذجية:</strong> Lighting, shading, and properties of materials.</div>",
        "notebookEn": "Aspects of Realistic 3D Image Formation: Involves lighting, shading, and properties of materials.",
        "notebookAr": "تكوين صور ثلاثية الأبعاد واقعية بيعتمد على الإضاءة (Lighting) والتظليل (Shading) وخصائص المادة (Material properties)."
      },
      {
        "id": "cg1-s17",
        "slideRef": "Pages 39 & 40",
        "shortLabel": "17. Objects and Viewers",
        "title": "Objects and Viewers (The Two Basic Entities)",
        "enPoints": [
          "<strong>Two basic entities</strong> must be part of any image-formation process: <span class=\"cg-emph\">Object and Viewer</span>.",
          "We form <strong>objects</strong> by specifying the positions in space of various <strong>geometric primitives</strong>, such as <span class='underline font-bold'>points, lines, and polygons</span>.",
          "To form an image, we must have someone or something that is <span class=\"cg-emph\">viewing</span> our objects. <strong>It is the viewer that forms the image of our objects.</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أي عملية تكوين صورة لازم يكون فيها <span class='hl-rose'>كيانين أساسيين (Two basic entities): الجسم (Object) والمشاهد/الكاميرا (Viewer)</span>.",
        "deepPoints": [
          "1️⃣ <strong>الجسم (Object):</strong> موجود في الفراغ بشكل مستقل، وبنكونه في الجرافيكس عن طريق تحديد مواقع الأشكال الهندسية الأولية <span class='en-term' dir='ltr'>Geometric primitives</span> مثل النقاط <span class='en-term' dir='ltr'>Points</span>، الخطوط <span class='en-term' dir='ltr'>Lines</span>، والمضلعات <span class='en-term' dir='ltr'>Polygons</span>.",
          "2️⃣ <strong>المشاهد (Viewer):</strong> هو اللي بيكوّن الصورة! في صفحة 40 لو فيه 3 مشاهدين (A, B, C) بيبصوا على نفس المبنى من زوايا مختلفة، كل مشاهد هيكوّن صورة مختلفة لنفس الـ Object.",
          "<strong>الكيانان الأساسيان لتكوين أي صورة:</strong> <span class=\"math-pill\">Object</span> (الجسم المُكوّن من <span class=\"math-pill\">Geometric Primitives</span> مثل النقاط والخطوط والمضلعات) و <span class=\"math-pill\">Viewer</span> (الكاميرا أو العين التي تشاهد المشهد).",
          "<strong>استقلالية الكيانين:</strong> الأجسام موجودة في الفضاء بشكل مستقل عن الكاميرا؛ تغيير مكان أو زاوية الـ <span class=\"math-pill\">Viewer</span> يغيّر الصورة الناتجة دون تعديل إحداثيات الأجسام نفسها."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What two basic entities must be part of any image-formation process, and which one actually forms the image?</div><div><strong>الإجابة النموذجية:</strong> Object and Viewer; it is the viewer that forms the image of our objects.</div>",
        "notebookEn": "Two Basic Entities of Image Formation: Object (formed by geometric primitives: points, lines, polygons) and Viewer (it is the viewer that forms the image).",
        "notebookAr": "الكيانين الأساسيين لتكوين أي صورة هما الـ Object والـ Viewer، والـ Viewer هو اللي بيكوّن الصورة."
      },
      {
        "id": "cg1-s18",
        "slideRef": "Pages 41 & 42",
        "shortLabel": "18. Light and Images",
        "title": "Light and Images",
        "enPoints": [
          "If there is <span class=\"cg-emph\">no light source</span>, the objects would be <span class=\"cg-emph\">dark</span>, and there would be <span class=\"cg-emph\">nothing visible in our image</span>.",
          "We must indicate how the color enters the picture or what the effects of the <strong>surface properties of the objects</strong> are."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "حتى لو عندنا Object وعندنا Viewer، لو مفيش مصدر ضوء <span class='hl-rose'>No light source</span>، الأجسام هتكون مظلمة <span class='en-term' dir='ltr'>Dark</span> ومش هيظهر أي شيء مرئي في الصورة!",
        "deepPoints": [
          "الضوء بيسقط من المصدر على سطح الـ Object، وجزء منه بينعكس يدخل للكاميرا (Viewer) حسب خصائص سطح الجسم <span class='en-term' dir='ltr'>Surface properties</span>.",
          "<strong>لا رؤية بدون مصدر ضوء:</strong> بدون <span class=\"math-pill\">Light Source</span> تبقى الأجسام سوداء تماماً، وتحدد خصائص السطح (<span class=\"math-pill\">Surface Properties</span>) مقدار الضوء المنعكس أو الممتص أو النافذ.",
          "<strong>تحديد اللون النهائي للبكسل:</strong> ينتج من تفاعل لون الضوء الساقط مع خصائص مادة السطح وزاوية النظر."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What happens in the image-formation process if there is no light source?</div><div><strong>الإجابة النموذجية:</strong> The objects would be dark, and there would be nothing visible in our image.</div>",
        "notebookEn": "Role of Light Source in Image Formation: Without a light source, objects are dark and nothing is visible; light interacts with object surface properties to enter the viewer.",
        "notebookAr": "من غير مصدر ضوء الأجسام هتبقى مظلمة ومفيش صورة هتتكون."
      },
      {
        "id": "cg1-s19",
        "slideRef": "Pages 43 & 44",
        "shortLabel": "19. The Electromagnetic Spec…",
        "title": "The Electromagnetic Spectrum & Visible Light (350–780 nm)",
        "enPoints": [
          "The electromagnetic spectrum includes Gamma rays, X-rays, Ultraviolet, <strong>Visible</strong>, Infrared, Microwaves, and Radio waves.",
          "<span class=\"cg-emph\">The visible spectrum</span>, which has wavelengths in the range of <strong>350 to 780 nanometers (nm)</strong>, is called <strong>(visible) light</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 440 200\" ><rect x=\"5\" y=\"5\" width=\"430\" height=\"190\" fill=\"#fff\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n                <defs><linearGradient id=\"visGrad\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0%\" stop-color=\"#3b82f6\"/><stop offset=\"50%\" stop-color=\"#10b981\"/><stop offset=\"100%\" stop-color=\"#ef4444\"/></linearGradient></defs>\n                <rect x=\"35\" y=\"45\" width=\"370\" height=\"28\" fill=\"#e2e8f0\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <text x=\"40\" y=\"36\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">X rays</text>\n                <text x=\"220\" y=\"36\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">Light</text>\n                <text x=\"365\" y=\"36\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">Radio</text>\n                <line x1=\"175\" y1=\"73\" x2=\"135\" y2=\"125\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <line x1=\"265\" y1=\"73\" x2=\"305\" y2=\"125\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <rect x=\"135\" y=\"125\" width=\"170\" height=\"32\" fill=\"url(#visGrad)\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <text x=\"155\" y=\"118\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#1d4ed8\">Blue</text>\n                <text x=\"220\" y=\"118\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#047857\">Green</text>\n                <text x=\"285\" y=\"118\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"end\" fill=\"#b91c1c\">Red</text>\n                <text x=\"135\" y=\"176\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">350 nm</text>\n                <text x=\"220\" y=\"176\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">λ (nm)</text>\n                <text x=\"305\" y=\"176\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">780 nm</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الضوء المرئي هو جزء صغير من الطيف الكهرومغناطيسي <span class='en-term' dir='ltr'>Electromagnetic spectrum</span> يقع بين الأشعة فوق البنفسجية (Ultraviolet) والأشعة تحت الحمراء (Infrared).",
        "deepPoints": [
          "احفظ الرقم ده كويس جداً (يتكرر في الشابتر الأول والثاني): الطيف المرئي <span class='hl-rose'>Visible spectrum (light)</span> يتراوح طوله الموجي من <span class='hl-yellow'>350 إلى 780 نانومتر (nm)</span> (حيث 350 nm جهة الأزرق/البنفسجي، والأخضر في المنتصف، و 780 nm جهة الأحمر).",
          "<strong>المدى الرقمي الإلزامي حفظه:</strong> الطيف المرئي (<span class=\"math-pill\">Visible Spectrum</span>) يمتد من <span class=\"math-pill\">350 nm</span> (البنفسجي/الأزرق — طول موجي قصير وطاقة عالية) إلى <span class=\"math-pill\">780 nm</span> (الأحمر — طول موجي طويل وطاقة أقل).",
          "<strong>موقع الضوء المرئي في الطيف الكهرومغناطيسي:</strong> يقع بين الأشعة فوق البنفسجية (<span class=\"math-pill\">Ultraviolet &lt; 350 nm</span>) والأشعة تحت الحمراء (<span class=\"math-pill\">Infrared &gt; 780 nm</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the wavelength range of the visible spectrum (visible light)?</div><div><strong>الإجابة النموذجية:</strong> 350 to 780 nanometers (nm).</div>",
        "notebookEn": "Visible Spectrum (Visible Light) Wavelength Range: Wavelengths in the range of 350 to 780 nanometers (nm) (from Blue at ~350 nm, Green in the middle, to Red at ~780 nm).",
        "notebookAr": "الضوء المرئي طوله الموجي من 350 إلى 780 نانومتر."
      },
      {
        "id": "cg1-s20",
        "slideRef": "Pages 45, 46, 47, 48 & 49",
        "shortLabel": "20. Imaging Systems: The",
        "title": "Imaging Systems: The Pinhole Camera & Projection Equation",
        "enPoints": [
          "We introduce <strong>two imaging systems</strong>: (1) <span class=\"cg-emph\">The pinhole camera</span> and (2) <span class=\"cg-emph\">The human visual system</span>.",
          "A <strong>pinhole camera</strong> is a box with a small hole in the center of one side of the box. The <strong>film</strong> is placed inside the box on the side <strong>opposite the pinhole</strong>, located a <strong>distance <em>d</em> from the pinhole</strong>.",
          "By similar triangles (side view and top view), the projected coordinates of point <span dir='ltr'>(x, y, z)</span> on the film plane at <span dir='ltr'>z<sub>p</sub> = &minus;d</span> are:",
          "<div class=\"cg-emph\">y<sub>p</sub> = &minus; y / (z / d) &nbsp;&nbsp;&nbsp; and &nbsp;&nbsp;&nbsp; x<sub>p</sub> = &minus; x / (z / d)</div>"
        ],
        "svg": "<svg viewBox=\"0 0 440 220\" ><rect x=\"5\" y=\"5\" width=\"430\" height=\"210\" fill=\"#fff\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n                <rect x=\"85\" y=\"65\" width=\"140\" height=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"225\" y1=\"20\" x2=\"225\" y2=\"185\" stroke=\"#0f172a\" stroke-width=\"1.8\"/>\n                <line x1=\"85\" y1=\"110\" x2=\"395\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"1.5\" stroke-dasharray=\"4,3\"/>\n                <line x1=\"225\" y1=\"110\" x2=\"395\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"1.8\"/>\n                <!-- Light ray passing through pinhole -->\n                <line x1=\"345\" y1=\"82\" x2=\"85\" y2=\"142\" stroke=\"#e11d48\" stroke-width=\"2.5\"/>\n                <circle cx=\"345\" cy=\"82\" r=\"5\" fill=\"#0f172a\"/>\n                <line x1=\"345\" y1=\"82\" x2=\"345\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/>\n                <text x=\"354\" y=\"86\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(y, z)</text>\n                <text x=\"30\" y=\"146\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#e11d48\">(yₚ, -d)</text>\n                <line x1=\"85\" y1=\"172\" x2=\"225\" y2=\"172\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <text x=\"155\" y=\"190\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">d</text>\n                <text x=\"225\" y=\"15\" font-family=\"Inter\" font-size=\"13\" font-style=\"italic\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"#0f172a\">y</text>\n                <text x=\"405\" y=\"114\" font-family=\"Inter\" font-size=\"13\" font-style=\"italic\" font-weight=\"bold\" fill=\"#0f172a\">z</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بندرس نظامين للتصوير <span class='en-term' dir='ltr'>Two imaging systems</span>: الكاميرا ذات الثقب <span class='en-term' dir='ltr'>Pinhole camera</span> والجهاز البصري للإنسان <span class='en-term' dir='ltr'>Human visual system</span>.",
        "deepPoints": [
          "<strong>تركيب الـ Pinhole camera:</strong> هي صندوق بفتحة صغيرة جداً في منتصف أحد جوانبه، والفيلم <span class='en-term' dir='ltr'>Film plane</span> موضوع في الجانب المقابل للثقب على مسافة اسمها <span class='math-pill'>d</span> من الثقب (عند <span dir='ltr'>z = &minus;d</span>).",
          "من تشابه المثلثات في المسقط الجانبي والعلوي، إحداثي الصورة المسقطة للنقطة <span dir='ltr'>(x, y, z)</span> على الفيلم بيعطى بالقانون:",
          "<div class='text-center my-1'><span class='math-pill'>y<sub>p</sub> = &minus; y / (z / d) = &minus; d &middot; y / z</span> &nbsp; و &nbsp; <span class='math-pill'>x<sub>p</sub> = &minus; x / (z / d) = &minus; d &middot; x / z</span></div>",
          "(الإشارة السالبة معناها إن الصورة بتتكون مقلوبة داخل الصندوق!).",
          "<strong>معادلة الإسقاط في الكاميرا ذات الثقب (Pinhole Camera):</strong> باستخدام تشابه المثلثات: <span class=\"math-pill\">x_p = -x / (z/d)</span> و <span class=\"math-pill\">y_p = -y / (z/d)</span>، والإشارة السالبة تعني أن الصورة المتكونة على الفيلم <strong>مقلوبة (Inverted)</strong>.",
          "<strong>زاوية الرؤية (Field of View):</strong> كل ما تقل المسافة <span class=\"math-pill\">d</span> (البعد البؤري) تزيد زاوية الرؤية (<span class=\"math-pill\">Wide Angle</span>)، وكل ما تزيد <span class=\"math-pill\">d</span> تضيق زاوية الرؤية وتكبر الصورة (<span class=\"math-pill\">Zoom In</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In a pinhole camera where the film plane is at distance d from the pinhole, what is the projection formula for y_p of a point (x, y, z)?</div><div><strong>الإجابة النموذجية:</strong> y_p = - y / (z / d) (and similarly x_p = - x / (z / d)).</div>",
        "notebookEn": "Pinhole Camera Structure & Projection Equation: Box with small hole in center of one side; film is opposite at distance d. Projection of (x,y,z) is y_p = - y / (z/d) and x_p = - x / (z/d).",
        "notebookAr": "الكاميرا ذات الثقب الفيلم فيها على بعد d، وقانون إسقاط النقطة هو y_p = -y / (z/d)."
      },
      {
        "id": "cg1-s21",
        "slideRef": "Pages 50 & 51",
        "shortLabel": "21. Camera Specifications",
        "title": "Camera Specifications (The 4 Necessary Specifications)",
        "enPoints": [
          "We can identify <strong>four types of necessary camera specifications</strong>:",
          "1. <strong>Position</strong> (Center of Projection — COP)",
          "2. <strong>Orientation</strong> (camera rotation/aiming)",
          "3. <strong>Focal length</strong> (distance <em>d</em>)",
          "4. <strong>Film plane</strong> (width <em>w</em> and height <em>h</em>)"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عشان نوصف أي كاميرا في نظام الجرافيكس، بنحتاج نحدد <span class='hl-cyan'>4 مواصفات ضرورية (Four types of necessary specifications)</span>:",
        "deepPoints": [
          "1️⃣ <strong>الموقع (Position):</strong> مكان الكاميرا أو مركز الإسقاط <span class='en-term' dir='ltr'>Center of Projection (COP)</span>.",
          "2️⃣ <strong>الاتجاه (Orientation):</strong> زاوية دوران وتوجيه الكاميرا.",
          "3️⃣ <strong>البعد البؤري (Focal length):</strong> المسافة البؤرية للعدسة أو الثقب.",
          "4️⃣ <strong>مستوى الفيلم (Film plane):</strong> أبعاد الفيلم (العرض <span dir='ltr'>w</span> والارتفاع <span dir='ltr'>h</span>).",
          "<strong>المواصفات الأربعة للكاميرا:</strong> <span class=\"math-pill\">1. Position (COP)</span> مكان الكاميرا، <span class=\"math-pill\">2. Orientation</span> اتجاهها ودورانها، <span class=\"math-pill\">3. Focal length (d)</span> البعد البؤري، و <span class=\"math-pill\">4. Film plane</span> حجم وشكل مستوى الفيلم.",
          "<strong>علاقة المواصفات بدرجات الحرية:</strong> الموقع يعطي 3 إحداثيات (<span class=\"math-pill\">x, y, z</span>) والاتجاه يعطي 3 زوايا دوران (<span class=\"math-pill\">Roll, Pitch, Yaw</span>) لتحديد الكاميرا بدقة تامة في الفضاء."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the four types of necessary camera specifications?</div><div><strong>الإجابة النموذجية:</strong> 1. Position, 2. Orientation, 3. Focal length, 4. Film plane.</div>",
        "notebookEn": "Four Necessary Camera Specifications: (1) Position, (2) Orientation, (3) Focal length, (4) Film plane.",
        "notebookAr": "الأربع مواصفات اللازمة لتحديد الكاميرا: المكان، الاتجاه، البعد البؤري، ومستوى الفيلم."
      },
      {
        "id": "cg1-s22",
        "slideRef": "Pages 52 & 53",
        "shortLabel": "22. The Human Visual",
        "title": "The Human Visual System: Cornea, Lens & Iris",
        "enPoints": [
          "Our extremely complex visual system has all the components of a <strong>physical imaging system</strong>, such as a <span class=\"cg-emph\">camera</span> or a <span class=\"cg-emph\">microscope</span>.",
          "<span class=\"cg-emph\">Light</span> enters the eye through the <strong>lens and cornea</strong>.",
          "The <span class=\"cg-emph\">iris</span> opens and closes to <strong>adjust the amount of light entering the eye</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 430 220\" ><rect x=\"5\" y=\"5\" width=\"420\" height=\"210\" fill=\"#fff\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/>\n                <circle cx=\"220\" cy=\"110\" r=\"80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"3\"/>\n                <path d=\"M292,75 Q318,110 292,145\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"3\"/>\n                <ellipse cx=\"282\" cy=\"110\" rx=\"11\" ry=\"26\" fill=\"#bae6fd\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"292\" y1=\"76\" x2=\"292\" y2=\"94\" stroke=\"#e11d48\" stroke-width=\"4\"/>\n                <line x1=\"292\" y1=\"126\" x2=\"292\" y2=\"144\" stroke=\"#e11d48\" stroke-width=\"4\"/>\n                <path d=\"M142,125 L95,142 M145,138 L100,155\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <text x=\"215\" y=\"48\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Cornea</text>\n                <text x=\"220\" y=\"95\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">Lens</text>\n                <text x=\"232\" y=\"138\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#e11d48\">Iris</text>\n                <text x=\"160\" y=\"75\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Retina</text>\n                <text x=\"160\" y=\"130\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#059669\">Rods &amp; cones</text>\n                <text x=\"65\" y=\"182\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Optic nerve</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الجهاز البصري للإنسان <span class='en-term' dir='ltr'>Human Visual System</span> فيه كل مكونات أنظمة التصوير الفيزيائية زي الكاميرا أو الميكروسكوب:",
        "deepPoints": [
          "• <strong>القرنية والعدسة (Cornea and Lens):</strong> بيدخل الضوء للعين من خلالهم.",
          "• <strong>القزحية (<span class='hl-rose'>Iris</span>):</strong> بتفتح وتقفل عشان <strong>تضبط وتتحكم في كمية الضوء الداخلة للعين (Adjust the amount of light entering the eye)</strong> (تعمل مثل فتحة العدسة Aperture في الكاميرا).",
          "<strong>المطابقة بين العين البشرية والكاميرا:</strong> القرنية والعدسة (<span class=\"math-pill\">Cornea & Lens</span>) تقابل عدسة الكاميرا لتجميع الضوء، والقزحية (<span class=\"math-pill\">Iris</span>) تقابل فتحة العدسة (<span class=\"math-pill\">Aperture</span>) لتنظيم كمية الضوء الداخل.",
          "<strong>ميزة تكيف العين:</strong> عضلات العين تغيّر تحدب العدسة تلقائياً (<span class=\"math-pill\">Accommodation</span>) للتركيز على الأجسام القريبة والبعيدة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In the human visual system, how does light enter the eye, and what is the function of the iris?</div><div><strong>الإجابة النموذجية:</strong> Light enters through the lens and cornea; the iris opens and closes to adjust the amount of light entering the eye.</div>",
        "notebookEn": "Eye Optical Components (Cornea, Lens, Iris): Light enters through the lens and cornea; the iris opens and closes to adjust the amount of light entering the eye.",
        "notebookAr": "الضوء بيدخل من القرنية والعدسة، والقزحية (Iris) بتفتح وتقفل عشان تتحكم في كمية الضوء."
      },
      {
        "id": "cg1-s23",
        "slideRef": "Page 54",
        "shortLabel": "23. The Retina: Rods",
        "title": "The Retina: Rods (Scotopic) vs. Cones (Photopic)",
        "enPoints": [
          "The <span class=\"cg-emph\">lens</span> forms an image on a two-dimensional structure called the <strong>retina</strong> at the back of the eye.",
          "The <span class=\"cg-emph\">rods and cones</span> are <strong>light sensors</strong> and are located on the <strong>retina</strong>.",
          "The <strong>sizes of the rods and cones</strong> determine the <strong>resolution of our visual systems</strong>.",
          "<span class=\"cg-emph\">Rods</span> are responsible for vision at <strong>low light levels (scotopic vision)</strong>. <span class=\"cg-emph\">Cones</span> are active at <strong>higher light levels (photopic vision)</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "سلايد 54 من أهم سلايدات الامتحان على الإطلاق — ركز في كل جملة فيها:",
        "deepPoints": [
          "1️⃣ <strong>الشبكية (<span class='hl-cyan'>Retina</span>):</strong> هي هيكل ثنائي الأبعاد في مؤخرة العين تتكون عليه الصورة بواسطة العدسة (تناظر الفيلم في الكاميرا).",
          "2️⃣ <strong>المستشعرات الضوئية (<span class='hl-yellow'>Rods and Cones</span>):</strong> تقع على الشبكية، و<strong>أحجامها (Sizes) هي اللي بتحدد دقة نظامنا البصري (Determine the resolution of our visual systems)</strong>.",
          "3️⃣ <strong>العصيات (<span class='hl-emerald'>Rods</span>):</strong> مسؤولة عن الرؤية في مستويات الإضاءة المنخفضة وتسمى <span class='en-term' dir='ltr'>Scotopic vision</span>.",
          "4️⃣ <strong>المخاريط (<span class='hl-rose'>Cones</span>):</strong> تنشط في مستويات الإضاءة العالية وتسمى <span class='en-term' dir='ltr'>Photopic vision</span> (وهي المسؤولة عن الألوان).",
          "<strong>المقارنة الذهبية في الامتحان بين Rods و Cones:</strong> الـ <span class=\"math-pill\">Rods</span> مسؤولة عن الرؤية الليلية والأبيض والأسود (<span class=\"math-pill\">Scotopic / Low-light</span>) وحساسيتها للضوء عالية، بينما الـ <span class=\"math-pill\">Cones</span> مسؤولة عن رؤية الألوان في الإضاءة القوية (<span class=\"math-pill\">Photopic / Color</span>) وتوجد في 3 أنواع (R, G, B).",
          "<strong>موقع التكوين:</strong> تتكون الصورة على الشبكية (<span class=\"math-pill\">Retina</span>) وهي سطح ثنائي الأبعاد في مؤخرة العين يضم هذه المستشعرات الضوئية."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Compare Rods and Cones in terms of location, light levels, vision type names, and what determines the resolution of our visual system.</div><div><strong>الإجابة النموذجية:</strong> Both are light sensors on the retina whose sizes determine visual resolution. Rods handle low light levels (scotopic vision); Cones are active at higher light levels (photopic vision).</div>",
        "notebookEn": "Retina & Visual Resolution: The lens forms an image on the 2D retina at the back of the eye; the sizes of the rods and cones on the retina determine visual resolution.\nRods vs. Cones: Rods = low light levels (scotopic vision) | Cones = higher light levels (photopic vision).",
        "notebookAr": "الصورة بتتكون على الشبكية (Retina)، وأحجام الـ Rods والـ Cones بتحدد دقة الرؤية (Resolution).\nالـ Rods للإضاءة الضعيفة (Scotopic)، والـ Cones للإضاءة العالية والألوان (Photopic)."
      },
      {
        "id": "cg1-s24",
        "slideRef": "Pages 55, 56 & 57",
        "shortLabel": "24. The Programmer's Interface",
        "title": "The Programmer's Interface & Application Programming Interface (API)",
        "enPoints": [
          "In a typical application, such as a painting program, the user sees menus and icons that represent possible actions. By clicking on these items, the user guides the software and produces images <strong>without having to write programs</strong>.",
          "The <strong>interface between an application program and a graphics system</strong> can be specified through a set of functions that resides in a <strong>graphics library</strong>.",
          "These specifications are called the <span class=\"cg-emph\">application programming interface (API)</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المستخدم العادي لبرنامج رسام <span class='en-term' dir='ltr'>Painting program</span> بيضغط على الأيقونات والقوائم عشان يطلع صور من غير ما يكتب كود برمجي.",
        "deepPoints": [
          "لكن المبرمج اللي بيكتب برنامج الجرافيكس بيتعامل مع النظام من خلال واجهة اسمها <span class='hl-rose'>Application Programming Interface (API)</span>.",
          "<strong>تعريف الـ API (صفحة 57):</strong> هي الواجهة بين برنامج التطبيق <span class='en-term' dir='ltr'>Application program</span> ونظام الجرافيكس <span class='en-term' dir='ltr'>Graphics system</span>، وبتتوصف من خلال مجموعة دوال موجودة في مكتبة رسومية <span class='hl-yellow'>Set of functions that resides in a graphics library</span>.",
          "<strong>الفرق بين دور المستخدم ودور المبرمج:</strong> المستخدم العادي يتفاعل مع القوائم والأيقونات الجاهزة، بينما المبرمج (<span class=\"math-pill\">Graphics Programmer</span>) يكتب كوداً يتعامل مباشرة مع <span class=\"math-pill\">Graphics API</span> (مثل OpenGL) لبناء هذه الأدوات.",
          "<strong>هدف الـ API:</strong> توفير واجهة برمجية مجردة تفصل المبرمج عن تعقيدات الهاردوير وتسمح بتشغيل البرنامج على أجهزة متعددة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the interface between an application program and a graphics system (specified through a set of functions in a graphics library) called?</div><div><strong>الإجابة النموذجية:</strong> The Application Programming Interface (API).</div>",
        "notebookEn": "Application Programming Interface (API) Definition: The interface between an application program and a graphics system, specified through a set of functions residing in a graphics library.",
        "notebookAr": "الـ API هي حلقة الوصل بين البرنامج اللي بنكتبه ونظام الجرافيكس عن طريق دوال جاهزة في مكتبة الجرافيكس."
      },
      {
        "id": "cg1-s25",
        "slideRef": "Page 58",
        "shortLabel": "25. Three-Dimensional APIs &",
        "title": "Three-Dimensional APIs & the Synthetic-Camera Model",
        "enPoints": [
          "If we are to follow the <strong>synthetic-camera model</strong>, we need functions in the API to specify the following <strong>four components</strong>:",
          "1. <strong>Objects</strong>",
          "2. <strong>A viewer</strong>",
          "3. <strong>Light sources</strong>",
          "4. <strong>Material properties</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "السلايد الأخيرة (صفحة 58) بتربط كل مفاهيم تكوين الصورة بالبرمجة ثلاثية الأبعاد:",
        "deepPoints": [
          "لما نتبع نموذج الكاميرا الاصطناعية <span class='hl-cyan'>Synthetic-camera model</span> في أي <span class='en-term' dir='ltr'>3D API</span> (زي OpenGL)، بنحتاج دوال في الـ API عشان نحدد <strong>4 عناصر أساسية</strong>:",
          "1️⃣ الأجسام <span class='en-term' dir='ltr'>Objects</span>.",
          "2️⃣ المشاهد أو الكاميرا <span class='en-term' dir='ltr'>A viewer</span>.",
          "3️⃣ مصادر الإضاءة <span class='en-term' dir='ltr'>Light sources</span>.",
          "4️⃣ خصائص المواد والأسطح <span class='en-term' dir='ltr'>Material properties</span>.",
          "<strong>المكونات الأربعة لنموذج الكاميرا التركيبية (Synthetic-Camera Model):</strong> أي 3D API (مثل OpenGL) لازم يوفر دوال لتعريف: <span class=\"math-pill\">1. Objects</span>، <span class=\"math-pill\">2. Viewer</span>، <span class=\"math-pill\">3. Light Sources</span>، و <span class=\"math-pill\">4. Material Properties</span>.",
          "<strong>ليه النموذج ده هو الأساس؟</strong> لأنه يطابق الفيزياء الحقيقية للتصوير مع فصل كامل بين تعريف المشهد وتعريف الكاميرا، مما يسهل تسريعه على الـ <span class=\"math-pill\">GPU Pipeline</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Following the synthetic-camera model, what four things do we need functions in a 3D API to specify?</div><div><strong>الإجابة النموذجية:</strong> 1. Objects, 2. A viewer, 3. Light sources, 4. Material properties.</div>",
        "notebookEn": "Synthetic-Camera Model in 3D APIs (4 Specifications): (1) Objects, (2) A viewer, (3) Light sources, (4) Material properties.",
        "notebookAr": "في نموذج الكاميرا الاصطناعية (Synthetic-camera model) بنحتاج دوال تحدد: الأجسام، المشاهد، مصادر الضوء، وخصائص المواد."
      }
    ],
    "lab": {
      "title": "",
      "subtitle": "",
      "steps": []
    },
    "summary": []
  },
  {
    "lessonId": "22222222-2222-4222-8222-222222222602",
    "courseCode": "CS-321",
    "chapterNum": 2,
    "titleEn": "Basic Concepts of Computer Graphics",
    "titleAr": "المفاهيم الأساسية في الرسوميات",
    "subtitle": "نموذج الصندوق الأسود، مجموعات الدوال السبع، الـ Primitives والـ Polygons والـ Triangulation، النصوص، ونماذج الألوان RGB و CMY.",
    "bonusComponentId": "cg-ch3-ch4-problems",
    "bonusDefaultTab": "cheatsheet",
    "slides": [
      {
        "id": "cg2-s1",
        "slideRef": "Slides 3 & 4",
        "shortLabel": "1. Graphics System as",
        "title": "Graphics System as a Black Box",
        "enPoints": [
          "We can think of the <strong>graphics system as a black box</strong> whose inputs are:",
          "1. <strong>Function calls</strong> from an application program;",
          "2. <strong>Measurements from input devices</strong>, such as the mouse and keyboard;",
          "3. Possibly other input, such as <strong>messages from the operating system</strong>.",
          "The <strong>outputs</strong> are primarily the <strong>graphics sent to our output devices</strong>."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-1.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "بنتخيل نظام الجرافيكس <span class='en-term' dir='ltr'>Graphics system</span> كأنه <span class='hl-yellow'>صندوق أسود (Black box)</span> بياخد مدخلات ويطلع مخرجات.",
        "deepPoints": [
          "<strong>المدخلات (Inputs) للصندوق ده 3 حاجات تحت بعض:</strong>",
          "1️⃣ استدعاءات الدوال <span class='en-term' dir='ltr'>Function calls</span> اللي جاية من برنامج التطبيق.",
          "2️⃣ القياسات والقراءات <span class='en-term' dir='ltr'>Measurements from input devices</span> اللي جاية من الماوس والكيبورد.",
          "3️⃣ رسائل نظام التشغيل <span class='en-term' dir='ltr'>Messages from the operating system</span>.",
          "<strong>المخرجات (Outputs):</strong> هي الرسومات والصور اللي بتتبعت لأجهزة الإخراج <span class='hl-emerald'>Graphics sent to output devices</span>.",
          "<strong>فكرة الـ Black Box في تصميم الأنظمة:</strong> المبرمج لا يحتاج لمعرفة تفاصيل الدوائر الداخلية للـ GPU؛ يكفيه معرفة <strong>المدخلات</strong> (<span class=\"math-pill\">API Function Calls + Input Measurements</span>) و<strong>المخرجات</strong> (<span class=\"math-pill\">Rendered Image on Display</span>).",
          "<strong>ميزة هذا التجريد (Abstraction):</strong> يمكنك ترقية كارت الشاشة أو تغيير نظام العرض بدون إعادة كتابة كود التطبيق."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: When treating the graphics system as a black box, what are its 3 inputs and its primary output?</div><div><strong>الإجابة النموذجية:</strong> المدخلات: (1) Function calls، (2) Measurements from input devices، (3) OS messages — والمخرجات: Graphics sent to output devices.</div>",
        "notebookEn": "Graphics System (Black Box) Inputs: 1. Function calls from application program | 2. Measurements from input devices (mouse/keyboard) | 3. Messages from OS.\nGraphics System (Black Box) Outputs: Primarily the graphics sent to our output devices.",
        "notebookAr": "مدخلات نظام الجرافيكس: أوامر الدوال من البرنامج، قراءات الماوس والكيبورد، ورسائل نظام التشغيل.\nمخرجات النظام: الرسومات والصور المرسلة لشاشة العرض."
      },
      {
        "id": "cg2-s2",
        "slideRef": "Slide 5",
        "shortLabel": "2. Seven Major Groups",
        "title": "Seven Major Groups of Graphics Functions",
        "enPoints": [
          "A graphics system performs multiple tasks to produce output and handle user input.",
          "These functions are divided into <strong>seven major groups</strong>:",
          "1. <strong>Primitive functions</strong>",
          "2. <strong>Attribute functions</strong>",
          "3. <strong>Viewing functions</strong>",
          "4. <strong>Transformation functions</strong>",
          "5. <strong>Input functions</strong>",
          "6. <strong>Control functions</strong>",
          "7. <strong>Query functions</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "نظام الجرافيكس بيقوم بمهام كتير عشان يطلع المخرجات ويتعامل مع مدخلات المستخدم، وعشان كده بنقسم دوال الجرافيكس إلى <span class='hl-cyan'>7 مجموعات رئيسية</span>:",
        "deepPoints": [
          "1️⃣ <span class='en-term' dir='ltr'>Primitive functions</span> ⬅️ بتحدد إيه الأشكال الأساسية اللي هتترسم.",
          "2️⃣ <span class='en-term' dir='ltr'>Attribute functions</span> ⬅️ بتحدد خصائص ومظهر الشكل (لونه، تظليله، نوع الخط).",
          "3️⃣ <span class='en-term' dir='ltr'>Viewing functions</span> ⬅️ بتحدد زاوية الرؤية والكاميرا.",
          "4️⃣ <span class='en-term' dir='ltr'>Transformation functions</span> ⬅️ بتنفذ الدوران والتحريك والتكبير.",
          "5️⃣ <span class='en-term' dir='ltr'>Input functions</span> ⬅️ بتتعامل مع الكيبورد والماوس والتابلت.",
          "6️⃣ <span class='en-term' dir='ltr'>Control functions</span> ⬅️ بتتواصل مع نظام النوافذ وتهيئ البرنامج وتعالج الأخطاء.",
          "7️⃣ <span class='en-term' dir='ltr'>Query functions</span> ⬅️ بتقرأ إعدادات الكاميرا وقيم الـ Frame buffer.",
          "<strong>خريطة المجموعات السبع لدوال الـ API:</strong> احفظهم كمنظومة متكاملة: <span class=\"math-pill\">1. Primitive</span> (ماذا نرسم) + <span class=\"math-pill\">2. Attribute</span> (كيف يظهر) + <span class=\"math-pill\">3. Viewing</span> (من أين نراه) + <span class=\"math-pill\">4. Transformation</span> (تحريكه وتدويره) + <span class=\"math-pill\">5. Input</span> (تفاعل المستخدم) + <span class=\"math-pill\">6. Control</span> (النوافذ والنظام) + <span class=\"math-pill\">7. Query</span> (استعلام الحالة).",
          "<strong>سؤال شائع:</strong> أي دالة في OpenGL تندرج تحت واحدة من هذه الفئات السبع بالضبط."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Into how many major groups are graphics functions divided?</div><div><strong>الإجابة النموذجية:</strong> تنقسم إلى 7 مجموعات رئيسية (Seven major groups) — احفظ أسماء السبعة بالترتيب.</div>",
        "notebookEn": "Seven Major Groups of Graphics Functions: (1) Primitive, (2) Attribute, (3) Viewing, (4) Transformation, (5) Input, (6) Control, (7) Query functions.",
        "notebookAr": "السبع مجموعات الأساسية لدوال أي مكتبة جرافيكس."
      },
      {
        "id": "cg2-s3",
        "slideRef": "Slide 6",
        "shortLabel": "3. Primitive Functions",
        "title": "1. Primitive Functions",
        "enPoints": [
          "<span class=\"cg-emph\">The primitive functions</span> define the <strong>low-level objects or atomic entities</strong> that our system can display.",
          "Depending on the API, the primitives can include:",
          "&bull; <span class=\"cg-emph\">points, line segments, polygons, pixels, text, and various types of curves and surfaces</span>.",
          "These primitives are usually those that can be <strong>displayed rapidly on the hardware</strong>. The usual sets include points, line segments, polygons, and sometimes text."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف <span class='en-term' dir='ltr'>Primitive functions</span>: هي الدوال اللي بتعرّف <span class='hl-yellow'>الكائنات منخفضة المستوى أو الوحدات الذرية الأساسية (Low-level objects or atomic entities)</span> اللي النظام يقدر يعرضها على الشاشة.",
        "deepPoints": [
          "أمثلة الـ <span class='en-term' dir='ltr'>Primitives</span> حسب الـ API بتشمل:",
          "• النقاط <span class='en-term' dir='ltr'>Points</span> والقطع المستقيمة <span class='en-term' dir='ltr'>Line segments</span> والمضلعات <span class='en-term' dir='ltr'>Polygons</span>.",
          "• البكسلات <span class='en-term' dir='ltr'>Pixels</span> والنصوص <span class='en-term' dir='ltr'>Text</span> والمنحنيات والأسطح <span class='en-term' dir='ltr'>Curves &amp; Surfaces</span>.",
          "عادةً الـ Primitives الأساسية بتكون هي الأشكال اللي الهاردوير يقدر يعرضها بسرعة عالية جداً <span class='hl-emerald'>Displayed rapidly on the hardware</span>.",
          "<strong>معنى Atomic Entities:</strong> الـ <span class=\"math-pill\">Primitives</span> هي الوحدات البنائية الأساسية التي لا تتجزأ على مستوى الهاردوير (نقاط، قطع مستقيمة، مضلعات، نصوص، ومنحنيات في بعض الـ APIs).",
          "<strong>كل مشهد ثلاثي الأبعاد ضخم</strong> (شخصيات ألعاب، مباني، سيارات) يُبنى في النهاية من آلاف أو ملايين الـ <span class=\"math-pill\">Primitives</span> البسيطة دي."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which functions define the low-level objects or atomic entities that our system can display?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Primitive functions.</div>",
        "notebookEn": "Primitive Functions Definition: Define the low-level objects or atomic entities that our system can display rapidly on the hardware.\nExamples of Primitives: Points, line segments, polygons, pixels, text, curves, and surfaces.",
        "notebookAr": "دوال بتعرف الوحدات الأساسية الأولية اللي الهاردوير بيرسمها بسرعة.\nأمثلتها: النقاط، الخطوط، المضلعات، البكسلات، النصوص، والمنحنيات."
      },
      {
        "id": "cg2-s4",
        "slideRef": "Slide 7",
        "shortLabel": "4. Attribute Functions",
        "title": "2. Attribute Functions (The 'What' vs. The 'How')",
        "enPoints": [
          "<span class=\"cg-emph\">Attribute functions</span> allow us to perform operations ranging from:",
          "&bull; <strong>Choosing the color</strong> with which we display a line segment,",
          "&bull; <strong>Picking a pattern</strong> with which to fill the inside of a polygon,",
          "&bull; <strong>Selecting a typeface</strong> for the titles on a graph.",
          "<strong>If primitives are the <span class=\"cg-emph\">what</span> of an API—the primitive objects that can be displayed—then attributes are the <span class=\"cg-emph\">how</span>.</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف <span class='en-term' dir='ltr'>Attribute functions</span>: هي الدوال اللي بتخلينا نتحكم في مظهر وخصائص الشكل اللي بنرسمه.",
        "deepPoints": [
          "<strong>أمثلة على العمليات اللي بتعملها:</strong>",
          "1️⃣ اختيار اللون <span class='en-term' dir='ltr'>Choosing the color</span> اللي هنعرض بيه قطعة مستقيمة.",
          "2️⃣ اختيار النقشة <span class='en-term' dir='ltr'>Picking a pattern</span> اللي هنملا بيها مضلع من جوه.",
          "3️⃣ اختيار شكل الفونت <span class='en-term' dir='ltr'>Selecting a typeface</span> لعناوين الرسم البياني.",
          "<strong>القاعدة الذهبية:</strong> لو كانت الـ <span class='en-term' dir='ltr'>Primitives</span> هي الـ <span class='hl-yellow'>WHAT</span> (إيه الشكل اللي هيترسم؟)، فإن الـ <span class='en-term' dir='ltr'>Attributes</span> هي الـ <span class='hl-rose'>HOW</span> (الشكل ده هيترسم ويظهر إزاي؟).",
          "<strong>القاعدة الذهبية للتفريق:</strong> <span class=\"math-pill\">Primitive Functions</span> تحدد <strong>ماذا (What)</strong> يُرسم (خط، مضلع، نص)، بينما <span class=\"math-pill\">Attribute Functions</span> تحدد <strong>كيف (How)</strong> يظهر (اللون، السُمك، نمط التعبئة، نوع الخط).",
          "<strong>تأثير الـ State Machine:</strong> في أغلب الـ APIs، بمجرد ما تضبط خاصية (مثل اللون الأحمر)، بتفضل فعّالة على كل الأشكال المرسومة بعدها لحد ما تغيرها."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: If primitives are the 'what' of an API, then what are the 'how'?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Attributes (أو Attribute functions).</div>",
        "notebookEn": "Attribute Functions Operations: Choosing line color, picking polygon fill pattern, and selecting text typeface.\nCore API Rule (What vs. How): If primitives are the WHAT of an API (objects to display), then attributes are the HOW (how they are displayed).",
        "notebookAr": "بتحدد لون الخط، ونقشة تعبئة المضلع، وشكل الخط الكتابي.\nالـ Primitives هي (إيه اللي هيترسم What)، والـ Attributes هي (هيظهر إزاي How)."
      },
      {
        "id": "cg2-s5",
        "slideRef": "Slide 8",
        "shortLabel": "5. Viewing Functions &",
        "title": "3. Viewing Functions & 4. Transformation Functions",
        "enPoints": [
          "<span class=\"cg-emph\">The viewing functions</span> allow us to <strong>specify various views</strong>.",
          "One of the characteristics of a good API is that it provides the user with a set of <span class=\"cg-emph\">transformation functions</span> that allows her to carry out transformations of objects, such as:",
          "&bull; <strong>Rotation</strong>",
          "&bull; <strong>Translation</strong>",
          "&bull; <strong>Scaling</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "3️⃣ <span class='en-term' dir='ltr'>Viewing functions</span>: بتسمح لنا نحدد مناظر وزوايا الرؤية المختلفة للمشهد <span class='hl-cyan'>Specify various views</span>.",
        "deepPoints": [
          "4️⃣ <span class='en-term' dir='ltr'>Transformation functions</span>: من أهم خصائص الـ API الجيدة إنها توفر دوال لإجراء التحويلات الهندسية الثلاثة على الأجسام:",
          "• <strong>Rotation:</strong> تدوير الجسم بزاوية معينة.",
          "• <strong>Translation:</strong> تحريك أو نقل الجسم من مكان لمكان.",
          "• <strong>Scaling:</strong> تكبير أو تصغير حجم الجسم.",
          "<strong>التفريق الدقيق بين Viewing و Transformation:</strong> دوال <span class=\"math-pill\">Viewing</span> تحدد موقع واتجاه وعدسة الكاميرا، بينما دوال <span class=\"math-pill\">Transformation</span> تغيّر الجسم نفسه عبر <span class=\"math-pill\">Translation</span> (إزاحة) و <span class=\"math-pill\">Rotation</span> (دوران) و <span class=\"math-pill\">Scaling</span> (تكبير/تصغير).",
          "<strong>رياضياً:</strong> تحريك الكاميرا للأمام يكافئ تحريك المشهد كله للخلف، لكن فصلهما برمجياً يسهل بناء المشاهد المعقدة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which functions allow carrying out rotation, translation, and scaling of objects?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Transformation functions.</div>",
        "notebookEn": "Viewing Functions: Allow us to specify various views of the scene.\nTransformation Functions: Carry out geometric transformations on objects: Rotation, Translation, and Scaling.",
        "notebookAr": "دوال الرؤية بتحدد زاوية ومنظور المشاهدة.\nدوال التحويلات بتنفذ الدوران والتحريك والتكبير/التصغير."
      },
      {
        "id": "cg2-s6",
        "slideRef": "Slide 9",
        "shortLabel": "6. Input Functions",
        "title": "5. Input Functions",
        "enPoints": [
          "For interactive applications, an API must provide a set of <span class=\"cg-emph\">input functions</span> to allow us to deal with the <strong>diverse forms of input</strong> that characterize modern graphics systems.",
          "We need functions to deal with devices such as:",
          "&bull; <strong>Keyboards</strong>",
          "&bull; <strong>Mice</strong>",
          "&bull; <strong>Data tablets</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "5️⃣ <span class='en-term' dir='ltr'>Input functions</span>: عشان نعمل تطبيقات تفاعلية <span class='en-term' dir='ltr'>Interactive applications</span>، لازم الـ API توفر دوال إدخال تتعامل مع الأشكال المتنوعة للمدخلات.",
        "deepPoints": [
          "الدوال دي هي المسؤولة عن قراءة بيانات الأجهزة زي الكيبورد <span class='en-term' dir='ltr'>Keyboards</span>، الماوس <span class='en-term' dir='ltr'>Mice</span>، وألواح الرسم <span class='en-term' dir='ltr'>Data tablets</span>.",
          "<strong>ليه Input Functions أساسية في التطبيقات التفاعلية؟</strong> لأن برامج الرسم والألعاب تعتمد على أحداث مستمرة من الماوس والكيبورد والتاتش، وتوفر دوال الإدخال قراءة الإحداثيات وحالة الأزرار في الزمن الحقيقي.",
          "<strong>تنوع الأجهزة:</strong> الـ API الجيد يعزل المبرمج عن اختلافات أجهزة الإدخال ويقدم له واجهة موحدة لقراءة الأحداث (<span class=\"math-pill\">Events</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which functions are required in interactive applications to deal with keyboards, mice, and data tablets?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Input functions.</div>",
        "notebookEn": "Input Functions: Allow interactive applications to deal with diverse input devices such as keyboards, mice, and data tablets.",
        "notebookAr": "دوال الإدخال بتتعامل مع الكيبورد والماوس والتابلت في البرامج التفاعلية."
      },
      {
        "id": "cg2-s7",
        "slideRef": "Slide 10",
        "shortLabel": "7. Control Functions",
        "title": "6. Control Functions",
        "enPoints": [
          "In any real application, we also have to worry about handling the complexities of working in a <strong>multiprocessing, multi-window environment</strong>.",
          "The <span class=\"cg-emph\">control functions</span> enable us to:",
          "1. <strong>Communicate with the window system</strong>,",
          "2. <strong>Initialize our programs</strong>, and",
          "3. <strong>Deal with any errors</strong> that take place during the execution of our programs."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في التطبيقات الفعلية بنشتغل في بيئة متعددة البرامج والنوافذ <span class='en-term' dir='ltr'>Multiprocessing, multi-window environment</span>.",
        "deepPoints": [
          "عشان كده بنحتاج المجموعة السادسة <span class='en-term' dir='ltr'>Control functions</span> اللي بتقوم بـ <strong>3 وظائف محددة تحت بعض</strong>:",
          "1️⃣ التواصل مع نظام النوافذ <span class='hl-cyan'>Communicate with the window system</span>.",
          "2️⃣ تهيئة وإعداد البرنامج عند التشغيل <span class='hl-yellow'>Initialize our programs</span>.",
          "3️⃣ التعامل مع أي أخطاء تحدث أثناء تنفيذ البرنامج <span class='hl-rose'>Deal with any errors during execution</span>.",
          "<strong>متى نستخدم Control Functions؟</strong> عند تشغيل البرنامج داخل نظام تشغيل متعدد النوافذ (<span class=\"math-pill\">Multi-window / Multiprocessing</span>): فتح نافذة الرسم، تهيئة بيئة العرض، التعامل مع تغيير حجم النافذة، وإنهاء البرنامج بأمان.",
          "<strong>أمثلة عملية:</strong> إنشاء النافذة (<span class=\"math-pill\">Window Initialization</span>) والتواصل مع <span class=\"math-pill\">Window System</span> ومعالجة أخطاء التشغيل."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which functions enable us to communicate with the window system, initialize programs, and deal with execution errors?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Control functions.</div>",
        "notebookEn": "Control Functions (3 Key Responsibilities): 1. Communicate with the window system | 2. Initialize our programs | 3. Deal with errors during execution.",
        "notebookAr": "دوال التحكم بتتواصل مع نظام النوافذ، وتهيئ البرنامج، وتعالج الأخطاء وقت التشغيل."
      },
      {
        "id": "cg2-s8",
        "slideRef": "Slide 11",
        "shortLabel": "8. Query Functions",
        "title": "7. Query Functions",
        "enPoints": [
          "Within our applications we can often use other information within the API, including:",
          "&bull; <strong>Camera parameters</strong>, or",
          "&bull; <strong>Values in the frame buffer</strong>.",
          "A good API provides this information through a set of <span class=\"cg-emph\">query functions</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المجموعة السابعة والأخيرة هي <span class='en-term' dir='ltr'>Query functions</span> (دوال الاستعلام).",
        "deepPoints": [
          "لو البرنامج بتاعنا احتاج يعرف أو يقرأ معلومات متسجلة جوه الـ API — زي <span class='hl-emerald'>إعدادات الكاميرا (Camera parameters)</span> أو <span class='hl-yellow'>قيم البكسلات الموجودة في الـ Frame buffer</span> — بنستخدم دوال الاستعلام <span class='en-term' dir='ltr'>Query functions</span>.",
          "<strong>أهمية Query Functions في كتابة كود محمول (Portable):</strong> تسمح للبرنامج بسؤال النظام أثناء التشغيل: ما هي أبعاد الشاشة الحالية؟ ما هي إعدادات الكاميرا؟ ما هي قيم الـ <span class=\"math-pill\">Frame Buffer</span>؟",
          "<strong>الفرق عن Control:</strong> دوال <span class=\"math-pill\">Control</span> <strong>تأمر</strong> النظام بفعل شيء، أما <span class=\"math-pill\">Query</span> <strong>تستعلم</strong> فقط عن الحالة والقيم الداخلية."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How does a good API provide internal information such as camera parameters or values in the frame buffer?</div><div><strong>الإجابة النموذجية:</strong> Through a set of Query functions.</div>",
        "notebookEn": "Query Functions: Provide internal API information to the application, including camera parameters or values in the frame buffer.",
        "notebookAr": "دوال الاستعلام بنقرأ بيها معلومات من جوه الـ API زي إعدادات الكاميرا وقيم الـ Frame buffer."
      },
      {
        "id": "cg2-s9",
        "slideRef": "Slides 12 & 13",
        "shortLabel": "9. Two Classes of",
        "title": "Two Classes of Primitives: Geometric vs. Raster",
        "enPoints": [
          "Minimal systems typically support <strong>lines, polygons, and some form of text</strong> (strings of characters), all of which can be generated efficiently in hardware.",
          "We can separate primitives into <strong>two classes</strong>:",
          "1. <span class=\"cg-emph\">Geometric primitives</span>",
          "2. <span class=\"cg-emph\">Image, or raster, primitives</span>",
          "<span class=\"cg-emph\">Geometric primitives</span> are specified in the <strong>problem domain</strong> and include <strong>points, line segments, polygons, curves, and surfaces</strong>.",
          "A point can be displayed as a single pixel or a small group of pixels."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أبسط أنظمة الجرافيكس <span class='en-term' dir='ltr'>Minimal systems</span> بتدعم 3 عناصر أساسية بكفاءة في الهاردوير: الخطوط <span class='en-term' dir='ltr'>Lines</span>، المضلعات <span class='en-term' dir='ltr'>Polygons</span>، والنصوص <span class='en-term' dir='ltr'>Text</span>.",
        "deepPoints": [
          "<strong>بنقسم الـ Primitives إلى فئتين (Two classes):</strong>",
          "1️⃣ <span class='en-term' dir='ltr'>Geometric primitives</span>: ودي بتتوصف في نطاق المشكلة الهندسي <span class='hl-cyan'>Specified in the problem domain</span> وبتشمل: النقاط، القطع المستقيمة، المضلعات، المنحنيات، والأسطح.",
          "2️⃣ <span class='en-term' dir='ltr'>Image, or raster, primitives</span>: ودي بتتعامل مباشرة مع مصفوفات البكسلات في الـ Frame buffer.",
          "<strong>مقارنة حاسمة في الامتحان:</strong> <span class=\"math-pill\">Geometric Primitives</span> تمر عبر الـ <span class=\"math-pill\">Geometric Pipeline</span> (يمكن تدويرها وتكبيرها وعرضها من زوايا مختلفة)، أما <span class=\"math-pill\">Raster Primitives</span> (مثل مصفوفات البكسلات <span class=\"math-pill\">Bitmaps/Pixmaps</span>) فتُكتب مباشرة في الـ <span class=\"math-pill\">Frame Buffer</span> وتكون أسرع لكنها أقل مرونة في التحويلات.",
          "<strong>الحد الأدنى لأي نظام جرافيكس:</strong> دعم الخطوط (<span class=\"math-pill\">Lines</span>) والمضلعات (<span class=\"math-pill\">Polygons</span>) والنصوص (<span class=\"math-pill\">Text</span>) بكفاءة على الهاردوير."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the two classes of primitives, and where are geometric primitives specified?</div><div><strong>الإجابة النموذجية:</strong> الفئتان هما: (1) Geometric primitives و (2) Image (or raster) primitives — وتوصف الـ Geometric primitives في الـ Problem domain.</div>",
        "notebookEn": "Minimal Hardware-Supported Primitives: Lines, polygons, and some form of text (strings of characters).\nTwo Classes of Primitives: 1. Geometric primitives (specified in the problem domain: points, line segments, polygons, curves, surfaces) | 2. Image (or raster) primitives.",
        "notebookAr": "أبسط الأنظمة بتدعم الخطوط والمضلعات والنصوص مباشرة في الهاردوير.\nالـ Primitives نوعين: هندسية (Geometric في الـ Problem domain) ونقطية (Image/Raster)."
      },
      {
        "id": "cg2-s10",
        "slideRef": "Slides 14 & 15",
        "shortLabel": "10. Line Segments &",
        "title": "Line Segments & Point / Line-Segment Types",
        "enPoints": [
          "Finite sections of lines between two vertices are called <span class=\"cg-emph\">line segments</span>.",
          "You can use a sequence of line segments to <strong>connect data values for a graph</strong>.",
          "You can also use line segments to <strong>display the edges of closed objects</strong>, such as polygons, that have interiors."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-10.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "الأجزاء المحدودة من الخطوط اللي بتوصل بين رأسين <span class='en-term' dir='ltr'>Two vertices</span> بنسميها <span class='hl-yellow'>Line segments (القطع المستقيمة)</span>.",
        "deepPoints": [
          "بنستخدم سلسلة من القطع المستقيمة في غرضين:",
          "1️⃣ توصيل قيم البيانات في رسم بياني <span class='en-term' dir='ltr'>Connect data values for a graph</span>.",
          "2️⃣ رسم حواف الأجسام المغلقة <span class='en-term' dir='ltr'>Display the edges of closed objects</span> زي المضلعات اللي ليها جزء داخلي.",
          "<strong>الفرق بين Line و Line Segment:</strong> الخط الرياضي ممتد للمالانهاية، أما في الجرافيكس فنرسم <span class=\"math-pill\">Line Segment</span> (قطعة مستقيمة محدودة بين رأسين <span class=\"math-pill\">Two Vertices</span>).",
          "<strong>أوضاع الربط في OpenGL:</strong> <span class=\"math-pill\">GL_POINTS</span> نقاط منفصلة، <span class=\"math-pill\">GL_LINES</span> أزواج خطوط مستقلة، <span class=\"math-pill\">GL_LINE_STRIP</span> سلسلة مفتوحة متصلة، و <span class=\"math-pill\">GL_LINE_LOOP</span> سلسلة مغلقة تصل آخر نقطة بأول نقطة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What do we call finite sections of lines between two vertices?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Line segments.</div>",
        "notebookEn": "Line Segments Definition & Uses: Finite sections of lines between two vertices; used to connect graph data or display edges of closed objects (polygons).",
        "notebookAr": "القطعة المستقيمة هي خط محدد بين نقطتين، بنوصل بيها الرسوم البيانية أو حواف المضلعات."
      },
      {
        "id": "cg2-s11",
        "slideRef": "Slides 16 & 17",
        "shortLabel": "11. Polygons & Methods",
        "title": "Polygons & Methods of Displaying a Polygon",
        "enPoints": [
          "<span class=\"cg-emph\">Polygons</span> play a special role in computer graphics because we can <strong>display them rapidly</strong> and use them to <strong>approximate arbitrary surfaces</strong>.",
          "We can render a polygon in a variety of ways:",
          "1. <strong>We can render only its edges,</strong>",
          "2. <strong>We can render its interior with a solid color or a pattern,</strong>",
          "3. <strong>We can render or not render the edges.</strong>"
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-11.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "المضلعات <span class='en-term' dir='ltr'>Polygons</span> ليها دور خاص جداً في الجرافيكس لسببين:",
        "deepPoints": [
          "1️⃣ نقدر نعرضها بسرعة كبيرة على الهاردوير <span class='hl-emerald'>Display them rapidly</span>.",
          "2️⃣ نقدر نستخدمها لتقريب أي أسطح منحنية أو معقدة <span class='hl-cyan'>Approximate arbitrary surfaces</span>.",
          "<strong>طرق عرض ورسم المضلع الثلاثة:</strong>",
          "• رسم الحواف فقط <span class='en-term' dir='ltr'>Render only its edges</span>.",
          "• ملء الجزء الداخلي بلون مصمت أو بنقشة <span class='en-term' dir='ltr'>Solid color or a pattern</span>.",
          "• إظهار الحواف مع التعبئة أو عدم إظهارها <span class='en-term' dir='ltr'>Render or not render the edges</span>.",
          "<strong>ليه المضلعات (Polygons) هي عمود الجرافيكس ثلاثي الأبعاد؟</strong> لأن الـ GPU يقدر يرسمها بسرعة هائلة، وأي سطح منحنٍ معقد يمكن تقريبه بشبكة من المضلعات (<span class=\"math-pill\">Polygon Mesh</span>).",
          "<strong>طرق العرض الثلاثة:</strong> <span class=\"math-pill\">1. Edges only (Wireframe)</span>، <span class=\"math-pill\">2. Filled with solid color/pattern</span>، أو <span class=\"math-pill\">3. Vertices only</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why do polygons play a special role in computer graphics?</div><div><strong>الإجابة النموذجية:</strong> Because we can display them rapidly and use them to approximate arbitrary surfaces.</div>",
        "notebookEn": "Special Role of Polygons: Can be displayed rapidly and used to approximate arbitrary surfaces.\nThree Ways to Render a Polygon: 1. Render only its edges | 2. Render its interior with a solid color or pattern | 3. Render or not render the edges.",
        "notebookAr": "المضلعات سريعة جداً في العرض وبنستخدمها لتقريب أي سطح منحني.\nطرق عرض المضلع: حواف فقط، أو تلوين الداخل بلون/نقشة، مع إظهار أو إخفاء الحواف."
      },
      {
        "id": "cg2-s12",
        "slideRef": "Slide 18",
        "shortLabel": "12. Simple vs. Non-Simple",
        "title": "Simple vs. Non-Simple Polygons",
        "enPoints": [
          "<strong>Polygons: (a) Simple vs. (b) Non-simple.</strong>",
          "1. <strong>Simple polygon (a):</strong> No two edges cross each other (well-defined interior).",
          "2. <strong>Non-simple polygon (b):</strong> Edges intersect each other between vertices."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-12.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "الفرق بين المضلع البسيط والمضلع غير البسيط في الرسمة:",
        "deepPoints": [
          "• <strong>(a) Simple Polygon:</strong> حوافه لا تتقاطع مع بعضها أبداً إلا عند الرؤوس، فبيكون الجزء الداخلي <span class='en-term' dir='ltr'>Interior</span> واضح وسهل التلوين.",
          "• <strong>(b) Non-simple Polygon:</strong> الحواف بتقطع بعضها في النص (زي النجمة الخماسية المتقاطعة)، وده بيصعّب تحديد الجزء الداخلي.",
          "<strong>معيار التمييز البسيط:</strong> في <span class=\"math-pill\">Simple Polygon</span> لا يتقاطع أي ضلعين إلا عند الرؤوس المشتركة فيكون له داخل وخارج محدد بوضوح، أما <span class=\"math-pill\">Non-Simple Polygon</span> فتتقاطع أضلاعه في المنتصف مما يسبب التباساً أثناء التعبئة (<span class=\"math-pill\">Filling Ambiguity</span>).",
          "<strong>سؤال امتحان مباشر:</strong> لماذا يفضل الهاردوير المضلعات البسيطة والمحدبة (<span class=\"math-pill\">Simple & Convex</span>)؟ لضمان سرعة التلوين بدون حسابات تقاطع معقدة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What do we call a polygon whose edges cross/intersect each other as in figure (b)?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Non-simple polygon.</div>",
        "notebookEn": "Simple vs. Non-Simple Polygons: Simple polygon = edges do not intersect; Non-simple polygon = edges cross/intersect each other.",
        "notebookAr": "المضلع البسيط أضلاعه لا تتقاطع، بينما غير البسيط أضلاعه تتقاطع مع بعضها."
      },
      {
        "id": "cg2-s13",
        "slideRef": "Slides 19 & 23",
        "shortLabel": "13. Approximating a Sphere",
        "title": "Approximating a Sphere & Triangle Display Modes",
        "enPoints": [
          "<strong>Triangles can be displayed in three ways:</strong>",
          "1. <strong>As points corresponding to the vertices</strong>",
          "2. <strong>As edges</strong>",
          "3. <strong>With the interiors filled.</strong>",
          "<strong>The third way is the default one.</strong>"
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-13.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "نقدر نقرب سطح الكرة <span class='en-term' dir='ltr'>Sphere approximation</span> باستخدام شبكة من المضلعات أو المثلثات.",
        "deepPoints": [
          "<strong>المثلثات بتتعرض بـ 3 طرق تحت بعض:</strong>",
          "1️⃣ كنقاط عند الرؤوس فقط <span class='en-term' dir='ltr'>As points corresponding to the vertices</span>.",
          "2️⃣ كحواف مفرغة <span class='en-term' dir='ltr'>As edges</span>.",
          "3️⃣ بملء الجزء الداخلي <span class='hl-yellow'>With the interiors filled</span>.",
          "معلومة امتحان مهمة جداً: <span class='hl-rose'>الطريقة التالتة (ملء الجزء الداخلي) هي الوضع الافتراضي (The third way is the default one)</span>.",
          "<strong>تقريب الكرة بالمضلعات:</strong> كلما زاد عدد المثلثات أو الأرباع المُكوّنة للكرة، زادت نعومة السطح على حساب زيادة وقت الحساب (<span class=\"math-pill\">Quality vs. Performance Trade-off</span>).",
          "<strong>الوضع الافتراضي للمثلثات:</strong> يمكن عرض المثلث كنقاط (<span class=\"math-pill\">Vertices</span>) أو حواف (<span class=\"math-pill\">Edges</span>) أو مُعبّأ (<span class=\"math-pill\">Filled</span>)، والتعبئة هي <span class=\"math-pill\">Default Mode</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the default way for displaying triangles in computer graphics?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي الطريقة الثالثة: With the interiors filled.</div>",
        "notebookEn": "Three Ways to Display Triangles: 1. Points at vertices | 2. Edges | 3. With the interiors filled (DEFAULT MODE).",
        "notebookAr": "طرق عرض المثلث: نقاط، أو حواف، أو مملوء من الداخل (والمملوء هو الوضع الافتراضي)."
      },
      {
        "id": "cg2-s14",
        "slideRef": "Slides 20, 21 & 22",
        "shortLabel": "14. Triangulation of Polygons",
        "title": "Triangulation of Polygons",
        "enPoints": [
          "<strong>The triangle is simple, flat, and convex.</strong> Consequently, triangles are easy to render.",
          "The usual strategy is to start with a list of vertices and generate a set of triangles consistent with the polygon defined by the list, a process known as <span class=\"cg-emph\">triangulation</span>."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-14.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "<strong>ليه المثلث سهل جداً في الرندر؟</strong> لأن أي مثلث في الدنيا بيحقق <span class='hl-emerald'>3 شروط دايماً: بسيط (Simple)، مسطح في مستوى واحد (Flat)، ومحدب (Convex)</span>.",
        "deepPoints": [
          "عشان كده الاستراتيجية المعتادة مع أي مضلع هي إننا نبدأ بقائمة الرؤوس بتاعته ونحوله لمجموعة مثلثات متوافقة معاه، والعملية دي اسمها <span class='hl-rose'>Triangulation (التثليث)</span>.",
          "<strong>الخصائص الثلاث السحرية للمثلث:</strong> أي مثلث (3 نقاط غير مستقيمة) هو دائماً <span class=\"math-pill\">1. Simple</span>، <span class=\"math-pill\">2. Flat (Planar)</span>، و <span class=\"math-pill\">3. Convex</span> — وهذه الضمانات لا تتوفر تلقائياً في المضلعات ذات 4 رؤوس أو أكثر.",
          "<strong>عملية التثليث (Triangulation):</strong> تقسيم أي مضلع معقد إلى مجموعة مثلثات متجاورة (<span class=\"math-pill\">Triangle Strip / Fan</span>) حتى يضمن الـ GPU رسمه بشكل صحيح وسريع."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why are triangles easy to render, and what is the process of converting a polygon into triangles called?</div><div><strong>الإجابة النموذجية:</strong> لأن المثلث Simple, flat, and convex — وتسمى العملية Triangulation.</div>",
        "notebookEn": "Properties of a Triangle: The triangle is always simple, flat, and convex, making it easy to render.\nTriangulation Definition: Starting with a polygon's list of vertices and generating a consistent set of triangles.",
        "notebookAr": "المثلث دايماً بسيط ومسطح ومحدب وعشان كده رسمه سهل وسريع.\nالـ Triangulation هو تحويل المضلع لمجموعة مثلثات من قائمة الرؤوس."
      },
      {
        "id": "cg2-s15",
        "slideRef": "Slide 24",
        "shortLabel": "15. Text Annotation &",
        "title": "Text Annotation & Fonts",
        "enPoints": [
          "Graphical output in applications such as data analysis and display requires <strong>annotation</strong>, such as labels on graphs.",
          "<span class=\"cg-emph\">Fonts</span> are <strong>families of typefaces of a particular style</strong>, such as <strong>Times, Computer Modern, or Helvetica</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في تطبيقات تحليل وعرض البيانات بنحتاج نضيف نصوص توضيحية <span class='en-term' dir='ltr'>Annotation</span> زي العناوين والأرقام على الرسوم البيانية.",
        "deepPoints": [
          "تعريف <span class='hl-yellow'>Fonts</span>: هي عائلات من أشكال الحروف ليها ستايل أو طابع معين <span class='en-term' dir='ltr'>Families of typefaces of a particular style</span>.",
          "الأمثلة الثلاثة المذكورة في السلايد: <span class='en-term' dir='ltr'>Times</span>، <span class='en-term' dir='ltr'>Computer Modern</span>، و <span class='en-term' dir='ltr'>Helvetica</span>.",
          "<strong>الفرق بين Annotation و Font:</strong> <span class=\"math-pill\">Annotation</span> هو إضافة نصوص توضيحية وتسميات على الرسوم البيانية، بينما <span class=\"math-pill\">Font</span> هو عائلة تصميم الحروف بنمط موحد (مثل <span class=\"math-pill\">Times, Courier, Helvetica</span>).",
          "<strong>أهمية النصوص في الجرافيكس:</strong> لا يقتصر الجرافيكس على الصور فقط؛ بل تُستخدم النصوص لتسمية المحاور والقيم في <span class=\"math-pill\">Data Visualization</span> وواجهات المستخدم."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are families of typefaces of a particular style (such as Times, Computer Modern, or Helvetica) called?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Fonts.</div>",
        "notebookEn": "Fonts Definition & Examples: Families of typefaces of a particular style, such as Times, Computer Modern, or Helvetica.",
        "notebookAr": "الفونت هو عائلة خطوط بطابع معين زي Times و Computer Modern و Helvetica."
      },
      {
        "id": "cg2-s16",
        "slideRef": "Slides 25 & 26",
        "shortLabel": "16. Forms of Text:",
        "title": "Forms of Text: 1. Stroke Text",
        "enPoints": [
          "There are <strong>two forms of text</strong>: <span class=\"cg-emph\">stroke and raster</span>.",
          "<span class=\"cg-emph\">Stroke text</span> is <strong>constructed as are other geometric objects</strong>.",
          "We use <strong>vertices to specify line segments or curves</strong> that outline each character.",
          "If the characters are defined by closed boundaries, we can fill them."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-16.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "النصوص في الجرافيكس نوعين: <span class='en-term' dir='ltr'>Stroke text</span> و <span class='en-term' dir='ltr'>Raster text</span>.",
        "deepPoints": [
          "<strong>النوع الأول (Stroke text):</strong> بيتبني بالظبط زي باقي الأشكال الهندسية <span class='hl-cyan'>Constructed as other geometric objects</span>.",
          "بنستخدم فيه رؤوس <span class='en-term' dir='ltr'>Vertices</span> عشان نحدد القطع المستقيمة أو المنحنيات اللي بترسم الإطار الخارجي لكل حرف (زي خطوط <span class='en-term' dir='ltr'>PostScript</span>)، ولو الحرف مغلق نقدر نلونه من الداخل.",
          "<strong>كيف يُبنى Stroke Text (Vector Text)؟</strong> يُعرّف كل حرف ككائن هندسي باستخدام رؤوس (<span class=\"math-pill\">Vertices</span>) وقطع مستقيمة أو منحنيات، تماماً مثل باقي الـ <span class=\"math-pill\">Geometric Primitives</span>.",
          "<strong>الميزة الكبرى والعيب:</strong> يمكن تكبيره وتصغيره وتدويره بحرية تامة بدون بكسلة (<span class=\"math-pill\">Scale/Rotate smoothly</span>)، لكنه يتطلب معالجة هندسية أكبر من <span class=\"math-pill\">Raster Text</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which form of text is constructed like other geometric objects using vertices to specify line segments or curves?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Stroke text.</div>",
        "notebookEn": "Two Forms of Text in Graphics: (1) Stroke text and (2) Raster text.\nStroke Text (e.g., PostScript font): Constructed like geometric objects using vertices to specify line segments or curves outlining each character.",
        "notebookAr": "النصوص نوعين: نصوص هندسية (Stroke) ونصوص نقطية (Raster).\nالـ Stroke text بيترسم كأشكال هندسية برؤوس ومنحنيات، فبيحافظ على دقته لما يكبر."
      },
      {
        "id": "cg2-s17",
        "slideRef": "Slides 27 & 28",
        "shortLabel": "17. Forms of Text:",
        "title": "Forms of Text: 2. Raster Text & Bit-Block Transfer",
        "enPoints": [
          "<span class=\"cg-emph\">Raster text</span> is <strong>simple and fast</strong>.",
          "Characters are defined as <strong>rectangles of bits called <span class=\"cg-emph\">bit blocks</span></strong>. Each block defines a single character by the <strong>pattern of 0 and 1 bits</strong> in the block.",
          "A raster character can be placed in the frame buffer rapidly by a <span class=\"cg-emph\">bit-block transfer operation</span>."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-17.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "<strong>النوع الثاني (Raster text):</strong> بيتميز بإنه <span class='hl-emerald'>بسيط وسريع (Simple and fast)</span>.",
        "deepPoints": [
          "كل حرف بيتعرف كمستطيل من البتات اسمه <span class='hl-yellow'>Bit block</span>، جواه نمط من الأصفار والوحايد (<span dir='ltr'>0 and 1 bits</span>) بيحدد شكل الحرف.",
          "بيتم وضع الحرف في الـ Frame buffer بسرعة كبيرة عن طريق عملية اسمها <span class='hl-rose'>Bit-block transfer operation</span>.",
          "رسمة حرف الـ <strong>A</strong> بتوضح إننا لما نكبر الـ Raster text بتكرار البكسلات <span class='en-term' dir='ltr'>Raster-character replication</span> بيظهر فيه تعرج وبكسلة.",
          "<strong>كيف يعمل Raster Text (Bitmap Text)؟</strong> كل حرف محفوظ مسبقاً كمستطيل من البتات (<span class=\"math-pill\">Bit Block</span> من 0 و 1)، وعند العرض يُنسخ مباشرة للـ <span class=\"math-pill\">Frame Buffer</span> عبر عملية <span class=\"math-pill\">Bit-Block Transfer (BitBlt)</span> فائقة السرعة.",
          "<strong>العيب الجوهري (موضع سؤال):</strong> إذا حاولت تكبيره أو تدويره يظهر متعرجاً ومُبكسلاً (<span class=\"math-pill\">Blocky / Aliased</span>) لأنه مجرد بكسلات ثابتة الحجم."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In raster text, what are the rectangles of 0 and 1 bits called, and how are they placed rapidly in the frame buffer?</div><div><strong>الإجابة النموذجية:</strong> تسمى المستطيلات Bit blocks، وتوضع في الـ Frame buffer بواسطة Bit-block transfer operation.</div>",
        "notebookEn": "Raster Text & Bit Blocks: Simple and fast; characters are defined as rectangles of 0 and 1 bits called 'bit blocks'.\nBit-Block Transfer Operation: Rapidly copies a raster character bit block into the frame buffer.",
        "notebookAr": "الـ Raster text بسيط وسريع، والحرف بيتخزن كمستطيل أصفار ووحايد اسمه Bit block.\nعملية نقل سريعة بتنسخ بلوك الحرف مباشرة للـ Frame buffer."
      },
      {
        "id": "cg2-s18",
        "slideRef": "Slide 29",
        "shortLabel": "18. Curved Objects",
        "title": "Curved Objects (Two Approaches)",
        "enPoints": [
          "We can take <strong>two approaches</strong> to creating a richer set of curved objects:",
          "1. <span class=\"cg-emph\">First</span>, we can <strong>use the primitives that we have to approximate curves and surfaces</strong>.",
          "2. <span class=\"cg-emph\">The other approach</span>, is to <strong>start with the mathematical definitions of curved objects</strong> and then build graphics functions to implement those objects."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عشان نعمل أشكال ومنحنيات وأسطح دائرية <span class='en-term' dir='ltr'>Curved objects</span>، عندنا <strong>طريقتين تحت بعض</strong>:",
        "deepPoints": [
          "1️⃣ <strong>التقريب بالـ Primitives المتاحة:</strong> نستخدم الأشكال المستقيمة اللي عندنا (زي القطع المستقيمة والمضلعات) لتقريب شكل المنحنى أو السطح.",
          "2️⃣ <strong>التعريف الرياضي المباشر:</strong> نبدأ من المعادلات الرياضية للمنحنيات <span class='hl-yellow'>Mathematical definitions of curved objects</span> ونبني دوال جرافيكس ترسمها مباشرة.",
          "<strong>الطريقتان لرسم الأجسام المنحنية:</strong> <span class=\"math-pill\">الطريقة الأولى:</span> تقريب المنحنى أو السطح بشبكة من الخطوط والمثلثات الصغيرة (<span class=\"math-pill\">Tessellation / Approximation</span>). <span class=\"math-pill\">الطريقة الثانية:</span> تعريف دوال رياضية دقيقة للمنحنيات والأسطح (مثل <span class=\"math-pill\">Bézier / NURBS</span>) داخل الـ API.",
          "<strong>المفاضلة:</strong> التقريب أسرع في العرض المباشر على الهاردوير، بينما التمثيل الرياضي أدق في برامج الـ <span class=\"math-pill\">CAD</span> والتصميم الصناعي."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the two approaches to creating curved objects in computer graphics?</div><div><strong>الإجابة النموذجية:</strong> الإجابة: (1) تقريب المنحنيات بالـ Primitives المتاحة، أو (2) البدء بالتعريفات الرياضية (Mathematical definitions) للمنحنيات.</div>",
        "notebookEn": "Two Approaches to Creating Curved Objects: 1. Approximate curves and surfaces using existing primitives | 2. Start with mathematical definitions of curved objects and build graphics functions.",
        "notebookAr": "طريقتين لرسم المنحنيات: إما تقريبها بخطوط ومضلعات، أو استخدام معادلاتها الرياضية مباشرة."
      },
      {
        "id": "cg2-s19",
        "slideRef": "Slides 30 & 31",
        "shortLabel": "19. Attributes for Lines",
        "title": "Attributes for Lines and Polygons",
        "enPoints": [
          "Properties that describe <strong>how an object should be rendered</strong> are called <span class=\"cg-emph\">attributes</span>.",
          "Available attributes depend on the type of object:",
          "&bull; A <strong>line</strong> could be <strong>black or green</strong>; it could be <strong>solid or dashed</strong>.",
          "&bull; A <strong>polygon</strong> could be <strong>filled with a single color or with a pattern</strong>."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-19.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف <span class='hl-rose'>Attributes</span>: هي الخصائص اللي بتوصف إزاي الكائن هيترسم ويظهر على الشاشة <span class='en-term' dir='ltr'>How an object should be rendered</span>.",
        "deepPoints": [
          "الخصائص بتختلف حسب نوع الشكل:",
          "• <strong>خصائص الخط (Line attributes):</strong> اللون (أسود أو أخضر)، السُمك، والنمط (<span class='en-term' dir='ltr'>Solid</span> متصل أو <span class='en-term' dir='ltr'>Dashed</span> متقطع).",
          "• <strong>خصائص المضلع (Polygon attributes):</strong> التعبئة بلون واحد <span class='en-term' dir='ltr'>Single color</span> أو بنقشة <span class='en-term' dir='ltr'>Pattern</span>.",
          "<strong>تخصيص الخصائص حسب نوع الكائن:</strong> خصائص الخط تشمل <span class=\"math-pill\">Color, Width, Style (Solid/Dashed/Dotted)</span>، بينما خصائص المضلع تشمل <span class=\"math-pill\">Fill Color, Fill Pattern, Edge Style, Interior Mode</span>.",
          "<strong>قاعدة مهمة:</strong> الخاصية التي تنطبق على كائن قد لا يكون لها معنى لكائن آخر (مثلاً نمط التعبئة <span class=\"math-pill\">Fill Pattern</span> للمضلعات وليس للخطوط)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What do we call the properties that describe how an object should be rendered?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: Attributes.</div>",
        "notebookEn": "Attributes Definition & Examples: Properties describing how an object should be rendered (Line: color, solid/dashed; Polygon: single color or pattern fill).",
        "notebookAr": "الـ Attributes هي الخصائص اللي بتوصف الشكل هيظهر إزاي (زي لون الخط متصل ولا متقطع، وتعبئة المضلع)."
      },
      {
        "id": "cg2-s20",
        "slideRef": "Slides 32, 33 & 34",
        "shortLabel": "20. Color Perception &",
        "title": "Color Perception & Wavelength Distribution C(λ)",
        "enPoints": [
          "We can use the model of the <strong>human visual system</strong> to obtain a simple but useful <strong>color model</strong>.",
          "A visible color can be characterized by a <strong>function <span dir='ltr'>C(&lambda;)</span></strong> that occupies wavelengths from about <strong>350 to 780 nm</strong>.",
          "The value for a given wavelength <span dir='ltr'>&lambda;</span> in the visible spectrum gives the <strong>intensity of that wavelength</strong> in the color."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-20.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "بنستخدم نموذج الجهاز البصري للإنسان عشان نستنتج نموذج ألوان <span class='en-term' dir='ltr'>Color model</span> بسيط ومفيد في الجرافيكس.",
        "deepPoints": [
          "أي لون مرئي بنعبر عنه بدالة توزيع اسمها <span class='hl-yellow' dir='ltr'>C(&lambda;)</span> بتمتد على الأطوال الموجية للطيف المرئي من <strong>350 إلى 780 نانومتر (nm)</strong>.",
          "قيمة الدالة <span dir='ltr'>C(&lambda;)</span> عند أي طول موجي <span dir='ltr'>&lambda;</span> بتعبر عن <span class='hl-cyan'>شدة هذا الطول الموجي (Intensity of that wavelength)</span> في اللون.",
          "<strong>ما هي الدالة C(λ)؟</strong> هي التوزيع الطيفي للضوء (<span class=\"math-pill\">Spectral Distribution</span>) عبر الأطوال الموجية المرئية (<span class=\"math-pill\">350–780 nm</span>)، لكن العين لا تخزن المنحنى بالكامل بل تختزله إلى 3 استجابات فقط.",
          "<strong>الأثر الهندسي:</strong> هذا الاختزال هو السبب الذي جعل الشاشات تحتاج 3 ألوان أساسية فقط بدلاً من توليد كل طول موجي على حدة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What does the function C(λ) (from 350 to 780 nm) represent for a given wavelength λ?</div><div><strong>الإجابة النموذجية:</strong> تعطي شدة ذلك الطول الموجي في اللون (The intensity of that wavelength in the color).</div>",
        "notebookEn": "Visible Color Distribution Function C(λ): Occupies wavelengths from 350 to 780 nm; its value at λ gives the intensity of that wavelength in the color.",
        "notebookAr": "الدالة C(λ) بتحدد شدة كل طول موجي في اللون في نطاق الضوء المرئي (350 إلى 780 nm)."
      },
      {
        "id": "cg2-s21",
        "slideRef": "Slide 35",
        "shortLabel": "21. Three Cones, Tristimulus",
        "title": "Three Cones, Tristimulus Values & Additive Color",
        "enPoints": [
          "The human visual system has <strong>three types of cones</strong> responsible for color vision.",
          "A display needs only <strong>three primary colors</strong> to produce the <strong>three tri-stimulus values</strong> needed for a human observer.",
          "The <strong>CRT</strong> is one example of the use of <span class=\"cg-emph\">additive color</span>, where the primary colors add together to give the perceived color."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الجهاز البصري للإنسان فيه <span class='hl-yellow'>3 أنواع من المخاريط (Three types of cones)</span> مسؤولة عن رؤية الألوان.",
        "deepPoints": [
          "عشان كده أي شاشة عرض محتاجة <span class='hl-cyan'>3 ألوان أولية فقط (Three primary colors)</span> عشان تنتج القيم الثلاثية <span class='en-term' dir='ltr'>Three tri-stimulus values</span> اللازمة للعين البشرية.",
          "شاشة الـ <strong>CRT</strong> هي مثال على <span class='hl-rose'>نظام الألوان الجمعي (Additive color)</span>، حيث تُجمع الألوان الأولية الثلاثة معاً لتكوين اللون المرئي.",
          "<strong>نظرية القيم الثلاثية (Tristimulus Values):</strong> لأن الشبكية تحتوي على 3 أنواع من المخاريط (<span class=\"math-pill\">R, G, B Cones</span>)، يكفي مزج 3 ألوان أساسية في نظام <strong>جمعي (<span class=\"math-pill\">Additive RGB</span>)</strong> لتوليد أي لون تدركه العين.",
          "<strong>قاعدة الجمع اللوني (الشاشات):</strong> <span class=\"math-pill\">R+G = Yellow</span>، <span class=\"math-pill\">G+B = Cyan</span>، <span class=\"math-pill\">R+B = Magenta</span>، و <span class=\"math-pill\">R+G+B = White</span>، وغياب الضوء = <span class=\"math-pill\">Black</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why does a display need only three primary colors, and what color model does a CRT use?</div><div><strong>الإجابة النموذجية:</strong> لأن العين بها 3 أنواع من الـ Cones فتحتاج فقط لإنتاج الـ Three tri-stimulus values — وتستخدم الـ CRT نظام Additive color.</div>",
        "notebookEn": "Three Cones & Tristimulus Values: Human eye has 3 types of cones for color vision -> displays need only 3 primary colors to produce the 3 tri-stimulus values.\nAdditive Color Example (CRT): Primary colors add together to give the perceived color.",
        "notebookAr": "لأن العين فيها 3 أنواع مخاريط للألوان، الشاشة بتحتاج 3 ألوان أولية بس.\nالـ CRT مثال على النظام الجمعي (Additive color) حيث تتجمع الإضاءات الملونة معاً."
      },
      {
        "id": "cg2-s22",
        "slideRef": "Slides 36 & 37",
        "shortLabel": "22. Subtractive Color vs.",
        "title": "Subtractive Color (CMY) vs. Additive Color (RGB)",
        "enPoints": [
          "In <span class=\"cg-emph\">subtractive</span> systems, the primaries are usually the <span class=\"cg-emph\">complementary colors</span>: <strong>cyan, magenta, and yellow</strong>.",
          "You need to know only that an <strong>RGB additive system</strong> has a dual with a <strong>CMY subtractive system</strong>."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-22.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "في الأنظمة الطرحية <span class='en-term' dir='ltr'>Subtractive systems</span> (زي الطباعة والأحبار)، الألوان الأولية بتكون هي <span class='hl-rose'>الألوان المكملة (Complementary colors)</span> وهي: السيان، الماجنتا، والأصفر <span class='en-term' dir='ltr'>Cyan, Magenta, and Yellow (CMY)</span>.",
        "deepPoints": [
          "نظام <span class='en-term' dir='ltr'>RGB Additive</span> هو المقابل المزدوج (<span class='en-term' dir='ltr'>Dual</span>) لنظام <span class='en-term' dir='ltr'>CMY Subtractive</span>:",
          "• في <strong>(a) Additive color (RGB):</strong> جمع الثلاثة معاً في المنتصف يعطي <strong>الأبيض (White)</strong>.",
          "• في <strong>(b) Subtractive color (CMY):</strong> خلط الثلاثة معاً في المنتصف يعطي <strong>الأسود (Black)</strong>.",
          "<strong>المقارنة الأشهر في امتحانات Chapter 2:</strong> نظام <span class=\"math-pill\">RGB (Additive)</span> خاص بالشاشات والبروجيكتور (يبدأ بالأسود ويضيف ضوءاً ليصل للأبيض)، بينما نظام <span class=\"math-pill\">CMY (Subtractive)</span> خاص بالطباعة والحبر (يبدأ بالورق الأبيض ويمتص الضوء ليصل للأسود).",
          "<strong>علاقة الثنائية (Dual Relationship):</strong> <span class=\"math-pill\">C = 1 - R</span>، <span class=\"math-pill\">M = 1 - G</span>، <span class=\"math-pill\">Y = 1 - B</span> — كل لون في CMY هو المكمّل (<span class=\"math-pill\">Complementary</span>) للونه المقابل في RGB."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the primary colors in a subtractive system, and what is the dual of the RGB additive system?</div><div><strong>الإجابة النموذجية:</strong> الألوان الأولية الطرحية هي الألوان المكملة (Cyan, Magenta, Yellow)، ونظام CMY Subtractive هو الـ Dual لنظام RGB Additive.</div>",
        "notebookEn": "Subtractive Color System (CMY): Primaries are the complementary colors: Cyan, Magenta, and Yellow (combining all three yields Black).\nDuality of RGB and CMY: The RGB additive system (center = White) is the dual of the CMY subtractive system (center = Black).",
        "notebookAr": "في النظام الطرحي (CMY) الألوان الأساسية هي السيان والماجنتا والأصفر، وخلطهم يدي أسود.\nنظام RGB الجمعي (مجموعهم أبيض) عكس ومكمل لنظام CMY الطرحي (مجموعهم أسود)."
      },
      {
        "id": "cg2-s23",
        "slideRef": "Slide 38",
        "shortLabel": "23. The Color Solid",
        "title": "The Color Solid (3D RGB Cube)",
        "enPoints": [
          "A <span class=\"cg-emph\">color solid</span> is the <strong>three-dimensional representation of a color model</strong>, an analog of the two-dimensional color wheel."
        ],
        "svg": null,
        "img": "/images/cg/ch2-slide-23.webp",
        "svgCaption": null,
        "tableHtml": null,
        "why": "تعريف <span class='hl-yellow'>Color solid (مجسم الألوان)</span>: هو التمثيل ثلاثي الأبعاد لنموذج الألوان <span class='en-term' dir='ltr'>Three-dimensional representation of a color model</span>، وهو المناظر ثلاثي الأبعاد لعجلة الألوان ثنائية الأبعاد <span class='en-term' dir='ltr'>2D color wheel</span>.",
        "deepPoints": [
          "في المكعب المرسوم: نقطة الأصل <span dir='ltr'>(0,0,0)</span> هي <strong>Black</strong>، والركن المقابل <span dir='ltr'>(1,1,1)</span> هو <strong>White</strong>، والمحاور هي <span dir='ltr'>R, G, B</span>.",
          "<strong>هندسة مكعب الألوان (3D RGB Color Cube):</strong> المحاور الثلاثة هي <span class=\"math-pill\">R, G, B ∈ [0, 1]</span>. نقطة الأصل <span class=\"math-pill\">(0,0,0)</span> هي الأسود، والزاوية المقابلة <span class=\"math-pill\">(1,1,1)</span> هي الأبيض.",
          "<strong>القطر الرئيسي للمكعب:</strong> الخط الواصل من <span class=\"math-pill\">(0,0,0)</span> إلى <span class=\"math-pill\">(1,1,1)</span> حيث <span class=\"math-pill\">R = G = B</span> يمثل جميع درجات الرمادي (<span class=\"math-pill\">Grayscale Axis</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the three-dimensional representation of a color model (an analog of the 2D color wheel) called?</div><div><strong>الإجابة النموذجية:</strong> الإجابة هي: A color solid.</div>",
        "notebookEn": "Color Solid Definition: The three-dimensional representation of a color model, an analog of the two-dimensional color wheel.",
        "notebookAr": "الـ Color solid هو التمثيل ثلاثي الأبعاد لنموذج الألوان على شكل مكعب."
      },
      {
        "id": "cg2-s24",
        "slideRef": "Slides 39 & 40",
        "shortLabel": "24. RGB Color Buffers",
        "title": "RGB Color Buffers & 24-Bit Memory Calculation",
        "enPoints": [
          "In a three-primary-color, additive-color <strong>RGB system</strong>, there are conceptually <strong>separate buffers for red, green, and blue images</strong>.",
          "Each pixel has <strong>separate red, green, and blue components</strong> that correspond to locations in memory.",
          "In a typical system, there might be a <strong>1280 &times; 1024 array of pixels</strong>, and each pixel might consist of <strong>24 bits (3 bytes): 1 byte for each of red, green, and blue</strong>.",
          "For our 24-bit example, there are <strong>2<sup>24</sup> possible colors</strong>, sometimes referred to as <strong>16M colors</strong>, where <strong>M denotes 2<sup>20</sup></strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في نظام <span class='en-term' dir='ltr'>RGB</span> الجمعي، بيكون فيه مخازن ذاكرة منفصلة <span class='en-term' dir='ltr'>Separate buffers</span> لكل لون من الأحمر والأخضر والأزرق.",
        "deepPoints": [
          "<strong>حسابات نظام الـ 24-bit في سلايد 40 (مهمة جداً):</strong>",
          "• كل بكسل بيتكون من <span class='hl-yellow'>24 bits = 3 Bytes</span> بحيث كل لون من (Red, Green, Blue) بياخد <strong>1 Byte (8 bits)</strong>.",
          "• عدد الألوان الممكنة = <span class='hl-rose' dir='ltr'>2<sup>24</sup> colors</span>، وبنسميها اختصاراً <span class='hl-emerald' dir='ltr'>16M colors</span>.",
          "• ركز جداً: حرف الـ <strong>M</strong> هنا يرمز إلى <span dir='ltr'>2<sup>20</sup></span> (لأن <span dir='ltr'>2<sup>24</sup> = 2<sup>4</sup> &times; 2<sup>20</sup> = 16M</span>).",
          "<strong>حساب حجم الـ Frame Buffer في الامتحان:</strong> الحجم بالبايت = <span class=\"math-pill\">Width × Height × (Bits per Pixel / 8)</span>. مثال: شاشة <span class=\"math-pill\">1024 × 768</span> بعمق <span class=\"math-pill\">24-bit (3 Bytes)</span> تحتاج <span class=\"math-pill\">1024 × 768 × 3 = 2,359,296 Bytes ≈ 2.25 MB</span>.",
          "<strong>تنظيم الذاكرة المفاهيمي:</strong> وجود 3 مخازن منفصلة منطقياً لـ <span class=\"math-pill\">R, G, B</span> يسهّل معالجة كل قناة لونية أو تعديلها بشكل مستقل."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In a 24-bit RGB system referred to as having 16M colors (2^24), what does M denote?</div><div><strong>الإجابة النموذجية:</strong> حرف M يرمز إلى 2^20 (وليس 10^6).</div>",
        "notebookEn": "RGB Buffers & 24-Bit Pixel Structure: Separate buffers for R, G, and B; each 24-bit pixel uses 3 bytes (1 byte for Red, 1 byte for Green, 1 byte for Blue).\n16M Colors Notation: 24-bit gives 2^24 possible colors = 16M colors, where M denotes 2^20.",
        "notebookAr": "في نظام 24 بت كل بكسل بياخد 3 بايت (1 بايت لكل لون من الأحمر والأخضر والأزرق).\nعدد الألوان 2^24 بنختصره بـ 16M لون، وحرف الـ M هنا بيساوي 2^20."
      },
      {
        "id": "cg2-s25",
        "slideRef": "Slide 41",
        "shortLabel": "25. Transparency and Opacity",
        "title": "Transparency and Opacity (A = 0.0 to 1.0)",
        "enPoints": [
          "<span class=\"cg-emph\">Transparency and opacity</span> are <strong>complements of each other</strong>.",
          "An <span class=\"cg-emph\">opaque</span> object <strong>passes no light through it</strong>;",
          "A <span class=\"cg-emph\">transparent</span> object <strong>passes all light</strong>.",
          "<strong>Opacity values</strong> can range from <strong>fully transparent (<span dir='ltr'>A = 0.0</span>)</strong> to <strong>fully opaque (<span dir='ltr'>A = 1.0</span>)</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الشفافية <span class='en-term' dir='ltr'>Transparency</span> والعتمة <span class='en-term' dir='ltr'>Opacity</span> صفتان متكاملتان عكس بعض <span class='hl-cyan'>Complements of each other</span>:",
        "deepPoints": [
          "• الجسم المعتم <span class='hl-rose'>Opaque object</span>: <strong>لا يمرر أي ضوء من خلاله (passes no light through it)</strong>، وقيمة الـ Opacity له تساوي <span class='font-mono font-bold' dir='ltr'>A = 1.0</span>.",
          "• الجسم الشفاف <span class='hl-emerald'>Transparent object</span>: <strong>يمرر كل الضوء من خلاله (passes all light)</strong>، وقيمة الـ Opacity له تساوي <span class='font-mono font-bold' dir='ltr'>A = 0.0</span>.",
          "<strong>العلاقة الرياضية بين Opacity و Transparency:</strong> هما مكمّلان لبعضهما: <span class=\"math-pill\">Transparency = 1 - Opacity</span>. القيمة <span class=\"math-pill\">α = 1.0</span> تعني جسم معتم تماماً (<span class=\"math-pill\">Fully Opaque</span> — لا يمرر ضوءاً)، و <span class=\"math-pill\">α = 0.0</span> تعني شفاف تماماً (<span class=\"math-pill\">Fully Transparent</span> — يمرر كل الضوء).",
          "<strong>التطبيق العملي (Alpha Blending):</strong> يُخزن معامل <span class=\"math-pill\">α</span> كقناة رابعة (<span class=\"math-pill\">RGBA</span>) لمزج الأجسام الزجاجية أو النصف شفافة مع الخلفية بسلاسة."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the opacity values (A) for a fully transparent object vs. a fully opaque object?</div><div><strong>الإجابة النموذجية:</strong> الشفاف تماماً (Fully transparent) قيمته A = 0.0، والمعتم تماماً (Fully opaque) قيمته A = 1.0.</div>",
        "notebookEn": "Opaque vs. Transparent Objects: Transparency and opacity are complements; an opaque object passes NO light, while a transparent object passes ALL light.\nOpacity Value Range (Alpha Channel A): Ranges from fully transparent (A = 0.0) to fully opaque (A = 1.0).",
        "notebookAr": "الجسم المعتم (Opaque) لا يمرر أي ضوء، والجسم الشفاف (Transparent) يمرر كل الضوء.\nقيمة العتمة A بتبدأ من 0.0 (شفاف بالكامل) لحد 1.0 (معتم بالكامل)."
      }
    ],
    "lab": {
      "title": "",
      "subtitle": "",
      "steps": []
    },
    "summary": []
  },
  {
    "lessonId": "22222222-2222-4222-8222-222222222603",
    "courseCode": "CS-321",
    "chapterNum": 3,
    "titleEn": "Output Primitives & Bresenham's Line Algorithm",
    "titleAr": "عناصر الإخراج وخوارزمية Bresenham لرسم الخطوط",
    "subtitle": "رسم النقطة والخط، ظاهرة Jaggies، اشتقاق معامل القرار p_k في خوارزمية Bresenham بالأعداد الصحيحة، والمثال الكامل.",
    "bonusComponentId": "cg-ch3-ch4-problems",
    "bonusDefaultTab": "ch3",
    "slides": [
      {
        "id": "cg3-s1",
        "slideRef": "Pages 1, 2 & 3",
        "shortLabel": "1. Output Primitives: Point",
        "title": "Output Primitives: Point Plotting",
        "enPoints": [
          "<strong>Point plotting</strong> is accomplished by converting a single coordinate position furnished by an application program into appropriate operations for the output device in use.",
          "With a <strong>CRT monitor</strong>, for example, the electron beam <span class=\"cg-emph\">is turned on</span> to illuminate the screen phosphor at the selected location."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عملية رسم النقطة <span class='en-term' dir='ltr'>Point plotting</span> بتتم عن طريق تحويل إحداثي نقطة واحدة جاي من برنامج التطبيق <span class='en-term' dir='ltr'>Application program</span> إلى عمليات مناسبة لجهاز الإخراج المستخدم.",
        "deepPoints": [
          "على سبيل المثال في شاشة الـ <span class='en-term' dir='ltr'>CRT monitor</span>، شعاع الإلكترونات <span class='hl-rose'>يتم تشغيله (is turned on)</span> عشان ينوّر الفسفور بتاع الشاشة في المكان المطلوب.",
          "<b>إزاي النقطة بتتنقل من الكود للشاشة؟</b> لما تكتب أمر رسم نقطة زي <span class='math-pill'>plotPixel(x, y)</span> في برنامجك، نظام الجرافيكس بيترجم الإحداثي ده لعنوان في الـ <span class='en-term' dir='ltr'>Frame Buffer</span> (أو يوجه شعاع الإلكترونات في شاشة الـ CRT للمكان ده ويفتحه <span class='en-term' dir='ltr'>Turned ON</span>).",
          "النقطة <span class='en-term' dir='ltr'>Point</span> هي حجر الأساس (البذرة) اللي بنبني منها كل الأشكال التانية: لأن أي خط أو دائرة على شاشات الـ Raster ما هو إلا سلسلة نقاط مرسومة ورا بعض!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How is point plotting accomplished on a CRT monitor?</div><div><strong>الإجابة النموذجية:</strong> By converting a single coordinate position from the application program and turning on the electron beam to illuminate the screen phosphor at the selected location.</div>",
        "notebookEn": "Point Plotting Mechanism: Converts a single coordinate position from an application program into operations for the output device.\nPoint Plotting on a CRT Monitor: The electron beam is turned on to illuminate the screen phosphor at the selected location.",
        "notebookAr": "رسم النقطة بيحول إحداثي النقطة اللي بعته البرنامج لأمر يفهمه جهاز العرض.\nفي شاشة CRT شعاع الإلكترونات بيتفتح (Turned on) فينور الفسفور عند النقطة دي."
      },
      {
        "id": "cg3-s2",
        "slideRef": "Pages 4 & 5",
        "shortLabel": "2. Line Drawing &",
        "title": "Line Drawing & Analog Devices",
        "enPoints": [
          "<strong>Line drawing</strong> is accomplished by calculating intermediate positions along the line path between two specified endpoint positions.",
          "An output device is then directed to <span class=\"cg-emph\">fill</span> in these positions between the endpoints.",
          "For <strong>analog devices</strong>, such as a <strong>vector pen plotter</strong> or a <strong>random-scan display</strong>, a straight line can be drawn <strong>smoothly</strong> from one endpoint to the other."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "رسم الخط المستقيم <span class='en-term' dir='ltr'>Line drawing</span> بيتم عن طريق حساب المواقع الوسيطة <span class='hl-yellow'>Intermediate positions</span> على طول مسار الخط بين نقطتي النهاية المحددين <span class='en-term' dir='ltr'>Two specified endpoint positions</span>.",
        "deepPoints": [
          "بعدها بنوجه جهاز الإخراج إنه <span class='hl-rose'>يملأ (fill)</span> المواقع دي ما بين نقطتي البداية والنهاية.",
          "في الأجهزة التماثلية <span class='en-term' dir='ltr'>Analog devices</span> — زي راسم القلم المتجه <span class='en-term' dir='ltr'>Vector pen plotter</span> أو شاشة المسح العشوائي <span class='en-term' dir='ltr'>Random-scan display</span> — الخط المستقيم بيترسم <span class='hl-emerald'>بكل نعومة وسلاسة (smoothly)</span> من نقطة للتانية بدون تكسير.",
          "<b>ليه أجهزة الـ Analog (زي الـ Vector Pen Plotter أو Random-Scan) خطها ناعم 100%؟</b> لأن الشعاع أو القلم بيتحرك مباشرة من نقطة البداية <span class='math-pill'>(x₁, y₁)</span> لنقطة النهاية <span class='math-pill'>(x₂, y₂)</span> على مسار الخط نفسه من غير ما يضطر يلتزم بشبكة مربعات (Pixels).",
          "عشان كده في الـ <span class='en-term' dir='ltr'>Random-scan display</span> مفيش حاجة اسمها تقريب لأعداد صحيحة ولا بيظهر فيها تعرج (No Jaggies)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How do analog devices (such as a vector pen plotter or random-scan display) draw a straight line?</div><div><strong>الإجابة النموذجية:</strong> They draw a straight line smoothly from one endpoint to the other.</div>",
        "notebookEn": "Line Drawing Principle: Calculates intermediate positions along the line path between two specified endpoints, then directs the output device to fill them.\nAnalog Devices (Vector Pen Plotter / Random-Scan): Draw a straight line smoothly from one endpoint to the other.",
        "notebookAr": "رسم الخط بيحسب النقاط اللي في النص بين البداية والنهاية والشاشة تلونها.\nالأجهزة الـ Analog بترسم الخط ناعم ومستمر (Smoothly) من غير بكسلة."
      },
      {
        "id": "cg3-s3",
        "slideRef": "Page 6",
        "shortLabel": "3. Deflection Voltages vs.",
        "title": "Deflection Voltages vs. Digital Discrete Points",
        "enPoints": [
          "<strong>Linearly varying horizontal and vertical deflection voltages</strong> are generated that are proportional to the required changes in the x and y directions to produce the smooth line.",
          "<strong>Digital devices</strong> display a <span class=\"cg-emph\">straight line segment</span> by plotting <strong>discrete points</strong> between the two endpoints.",
          "<strong>Discrete coordinate positions</strong> along the line path are calculated from the <strong>equation of the line</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في أجهزة الـ Analog، إزاي الخط بيطلع ناعم؟ عن طريق توليد <span class='hl-cyan'>جهود انحراف أفقية ورأسية تتغير خطياً (Linearly varying horizontal and vertical deflection voltages)</span> وبتتناسب طردياً مع التغير المطلوب في اتجاهي <span dir='ltr'>x</span> و <span dir='ltr'>y</span>.",
        "deepPoints": [
          "أما في الأجهزة الرقمية <span class='en-term' dir='ltr'>Digital devices</span>، فبتعرض القطعة المستقيمة <span class='hl-rose'>Straight line segment</span> عن طريق رسم <span class='hl-yellow'>نقاط منفصلة متقطعة (Discrete points)</span> بين نقطتي النهاية.",
          "الإحداثيات المنفصلة دي بتتحسب من <strong>معادلة الخط المستقيم (Equation of the line)</strong>.",
          "<b>الفرق الفيزيائي الجوهري:</b> في الـ <span class='en-term' dir='ltr'>Analog</span> الفولت الأفقي والرأسي بيتغير بشكل متصل وخطي (<span class='en-term' dir='ltr'>Linearly varying voltages</span>) بنسبة تساوي ميل الخط.",
          "أما في الـ <span class='en-term' dir='ltr'>Digital / Raster</span> الشاشة متقسمة لمربعات ثابتة، فلازم نعوّض في معادلة الخط ونختار بكسلات منفصلة (<span class='en-term' dir='ltr'>Discrete points</span>) تقرب شكل الخط."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How do digital devices display a straight line segment compared to analog devices?</div><div><strong>الإجابة النموذجية:</strong> Digital devices plot discrete points between the two endpoints calculated from the equation of the line.</div>",
        "notebookEn": "Smooth Line in Analog Devices: Produced by linearly varying horizontal and vertical deflection voltages proportional to changes in x and y.\nDigital Devices Line Display: Display a straight line segment by plotting discrete points between endpoints, calculated from the equation of the line.",
        "notebookAr": "الخط الناعم في الـ Analog بيتكون بجهود انحراف بتتغير خطياً مع x و y.\nالأجهزة الرقمية بترسم الخط على هيئة نقاط منفصلة (Discrete points) محسوبة من معادلة الخط."
      },
      {
        "id": "cg3-s4",
        "slideRef": "Page 7",
        "shortLabel": "4. Raster Video Display",
        "title": "Raster Video Display & Integer Screen Locations",
        "enPoints": [
          "For a <strong>raster video display</strong>, the line color (intensity) is then loaded into the <strong>frame buffer</strong> at the corresponding pixel coordinates.",
          "Reading from the frame buffer, the <strong>video controller</strong> then \"plots\" the screen pixels.",
          "<strong>Screen locations are referenced with integer values</strong>, so plotted positions may only <strong>approximate actual line positions</strong> between two specified endpoints."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "في شاشات الـ <span class='en-term' dir='ltr'>Raster video display</span>، الخطوات بتمشي بالترتيب ده:",
        "deepPoints": [
          "1️⃣ لون الخط أو شدة إضاءته <span class='en-term' dir='ltr'>Line color (intensity)</span> بيتحمّل في الـ <span class='hl-yellow'>Frame buffer</span> عند إحداثيات البكسلات المناظرة.",
          "2️⃣ الـ <span class='hl-cyan'>Video controller</span> يقرأ من الـ Frame buffer ويرسم البكسلات على الشاشة.",
          "3️⃣ لأن مواقع الشاشة بتتعرف بـ <span class='hl-rose'>قيم صحيحة فقط (Integer values)</span>، فالمواقع المرسومة بتكون مجرد <strong>تقريب (Approximate)</strong> للمواقع الحقيقية للخط.",
          "<b>رحلة رسم الخط في شاشات الـ Raster (3 مراحل بالترتيب):</b><br>1️⃣ الخوارزمية تحسب إحداثيات البكسلات الصحيحة <span class='math-pill'>(x, y)</span> من معادلة الخط.<br>2️⃣ يتخزن لون الخط (<span class='en-term' dir='ltr'>Line color / intensity</span>) في الـ <span class='en-term' dir='ltr'>Frame buffer</span> في الخانات المقابلة.<br>3️⃣ الـ <span class='en-term' dir='ltr'>Video controller</span> يقرأ الـ Frame buffer وينوّر البكسلات على الشاشة.",
          "بسبب إن عناوين الشاشة أعداد صحيحة فقط (<span class='en-term' dir='ltr'>Integer values</span>)، البكسلات المرسومة بتكون مجرد <b>تقريب (Approximation)</b> للمسار الرياضي الحقيقي."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why do plotted pixel positions on a raster screen only approximate actual line positions?</div><div><strong>الإجابة النموذجية:</strong> Because screen locations are referenced with integer values.</div>",
        "notebookEn": "Raster Display Line Pipeline: Line color (intensity) is loaded into the frame buffer -> Video controller reads frame buffer and plots screen pixels.\nInteger Approximation Rule: Screen locations are referenced with integer values, so plotted positions only approximate actual line positions.",
        "notebookAr": "لون الخط بيتخزن في الـ Frame buffer وبعدين الـ Video controller يقراه وينوره على الشاشة.\nلأن إحداثيات الشاشة أعداد صحيحة بس، النقاط المرسومة بتكون تقريب لمسار الخط الحقيقي."
      },
      {
        "id": "cg3-s5",
        "slideRef": "Pages 8 & 9",
        "shortLabel": "5. Coordinate Rounding &",
        "title": "Coordinate Rounding & Stair-Step Effect ('The Jaggies')",
        "enPoints": [
          "A computed line position of <span class=\"cg-emph\">(10.48, 20.51)</span>, for example, would be converted to pixel position <span class=\"cg-emph\">(10, 21)</span>.",
          "Thus <strong>rounding of coordinate values to integers</strong> causes lines to be displayed with a <strong>stair-step appearance (\"the jaggies\")</strong>.",
          "The characteristic stair-step shape of raster lines is particularly noticeable on systems with <strong>low resolution</strong>, and we can improve their appearance somewhat by displaying them on <strong>high-resolution systems</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 420 210\" ><rect x=\"10\" y=\"10\" width=\"400\" height=\"190\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"3\"/><line x1=\"25\" y1=\"175\" x2=\"395\" y2=\"175\" stroke=\"#0f172a\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n                <g fill=\"#1e293b\">\n                    <circle cx=\"45\" cy=\"135\" r=\"11\"/><circle cx=\"70\" cy=\"135\" r=\"11\"/><circle cx=\"95\" cy=\"135\" r=\"11\"/>\n                    <circle cx=\"120\" cy=\"110\" r=\"11\"/><circle cx=\"145\" cy=\"110\" r=\"11\"/><circle cx=\"170\" cy=\"110\" r=\"11\"/>\n                    <circle cx=\"195\" cy=\"85\" r=\"11\"/><circle cx=\"220\" cy=\"85\" r=\"11\"/><circle cx=\"245\" cy=\"85\" r=\"11\"/>\n                    <circle cx=\"270\" cy=\"60\" r=\"11\"/><circle cx=\"295\" cy=\"60\" r=\"11\"/><circle cx=\"320\" cy=\"60\" r=\"11\"/>\n                    <circle cx=\"345\" cy=\"35\" r=\"11\"/><circle cx=\"370\" cy=\"35\" r=\"11\"/><circle cx=\"390\" cy=\"35\" r=\"11\"/>\n                </g>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "مثال رقمي مهم جداً للامتحان: لو حسبنا نقطة على الخط وطلعت <span class='math-pill'>(10.48, 20.51)</span>، لما نحولها لبكسل صحيح على الشاشة بتتقرب لـ <span class='hl-rose'>(10, 21)</span> (لأن 10.48 أقرب لـ 10، و 20.51 أقرب لـ 21).",
        "deepPoints": [
          "عملية تقريب الإحداثيات لأعداد صحيحة <span class='en-term' dir='ltr'>Rounding of coordinate values to integers</span> بتخلي الخطوط تظهر بمظهر سُلّمي متعرج اسمه <span class='hl-yellow'>Stair-step appearance (\"the jaggies\")</span>.",
          "التعرج ده بيبان بوضوح شديد في الشاشات ذات الدقة المنخفضة <span class='en-term' dir='ltr'>Low resolution</span>، ونقدر نحسّن مظهره نسبياً بعرضه على أنظمة عالية الدقة <span class='hl-emerald'>High-resolution systems</span>.",
          "السبب الجذري للـ Jaggies: الشاشة شبكة أرقام <b>صحيحة</b> فقط، والخط الحقيقي بيعدّي على إحداثيات عشرية، فلازم <b>نقرّب (round)</b> لأقرب بكسل. مثال المحاضرة: <span class='math-pill'>(10.48, 20.51) → (10, 21)</span> ومثال آخر: <span class='math-pill'>(3.4, 2.6) → (3, 3)</span>.",
          "<b>قاعدة التقريب الحسابية:</b> لو الكسر أقل من <span class='math-pill'>0.5</span> بنقرب للأقل (زي <span class='math-pill'>10.48 → 10</span>)، ولو الكسر <span class='math-pill'>0.5</span> أو أكتر بنقرب للأعلى (زي <span class='math-pill'>20.51 → 21</span>). كل ما زادت الدقة (Resolution) أو استخدمنا Anti-aliasing، الدرج بيقل لكن مبيختفيش تمامًا."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What pixel position does the computed coordinate (10.48, 20.51) convert to, and what visual artifact does this rounding cause?</div><div><strong>الإجابة النموذجية:</strong> It converts to (10, 21), causing a stair-step appearance known as 'the jaggies'.</div>",
        "notebookEn": "Rounding Example & The Jaggies: Computed position (10.48, 20.51) converts to integer pixel (10, 21); rounding causes a stair-step appearance ('the jaggies').\nResolution Impact on Jaggies: Particularly noticeable on low-resolution systems; appearance improves on high-resolution systems.",
        "notebookAr": "النقطة (10.48, 20.51) بتتقرب لـ (10, 21)، والتقريب ده بيعمل تعرج شبه السلم اسمه Jaggies.\nالتعرج بيبان أوي في الشاشات الـ Low resolution وبيتحسن في الـ High resolution."
      },
      {
        "id": "cg3-s6",
        "slideRef": "Page 10",
        "shortLabel": "6. Smoothing Raster Lines",
        "title": "Smoothing Raster Lines & Screen Coordinate Numbering",
        "enPoints": [
          "More effective techniques for <strong>smoothing raster lines</strong> are based on <strong>adjusting pixel intensities along the line paths</strong>.",
          "For the raster-graphics device-level algorithms, object positions are specified directly in <span class=\"cg-emph\">integer device coordinates</span>.",
          "Pixel positions are referenced according to <strong>scan-line number</strong> and <strong>column number</strong> (pixel position across a scan line).",
          "<strong>Scan lines</strong> are numbered consecutively from <strong>0, starting at the bottom of the screen</strong>; and <strong>pixel columns</strong> are numbered from <strong>0, left to right across each scan line</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الطرق الأكثر فاعلية لتنعيم خطوط الـ Raster <span class='en-term' dir='ltr'>Smoothing raster lines</span> بتعتمد على <span class='hl-cyan'>ضبط وتعديل شدة إضاءة البكسلات على طول مسار الخط (Adjusting pixel intensities along the line paths)</span>.",
        "deepPoints": [
          "في خوارزميات مستوى الجهاز <span class='en-term' dir='ltr'>Device-level algorithms</span>، مواقع الأجسام بتتحدد مباشرة بـ <span class='hl-rose'>إحداثيات الجهاز الصحيحة (Integer device coordinates)</span>.",
          "<strong>ترقيم الشاشة (موضع سؤال مؤكد):</strong>",
          "• <strong>خطوط المسح (Scan lines — المحور الرأسي Y):</strong> مترقمة بالتتابع من <strong>0 بدايةً من أسفل الشاشة (Bottom of the screen)</strong>.",
          "• <strong>أعمدة البكسلات (Pixel columns — المحور الأفقي X):</strong> مترقمة من <strong>0 من اليسار لليمين (Left to right)</strong> عبر كل خط مسح.",
          "<b>إزاي بننعم الخط (Smoothing / Antialiasing)؟</b> بدل ما البكسل يكون يا أبيض 100% يا أسود 0%، بنخلي البكسلات القريبة من مسار الخط تنور بدرجات متفاوتة (<span class='en-term' dir='ltr'>Adjusting pixel intensities</span>) فالعين تشوف الخط ناعم ومفهوش سنون السلم!",
          "<b>خلّي بالك من نظام الإحداثيات في المحاضرة:</b> نقطة الأصل <span class='math-pill'>(0, 0)</span> موجودة في <b>أسفل يسار الشاشة (Bottom-Left)</b>؛ خطوط المسح <span class='en-term' dir='ltr'>Scan lines (Y)</span> بتبدأ من 0 من تحت لفوق، والأعمدة <span class='en-term' dir='ltr'>Columns (X)</span> بتبدأ من 0 من الشمال لليمين."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How are scan lines and pixel columns numbered on a raster screen, and what are more effective line-smoothing techniques based on?</div><div><strong>الإجابة النموذجية:</strong> Scan lines are numbered from 0 starting at the bottom of the screen; pixel columns from 0 left to right. Smoothing is based on adjusting pixel intensities along the line paths.</div>",
        "notebookEn": "Smoothing Raster Lines (Antialiasing idea): Based on adjusting pixel intensities along the line paths.\nScan-Line & Column Numbering: Scan lines: from 0 starting at the bottom of the screen | Pixel columns: from 0 left to right across each scan line.",
        "notebookAr": "تنعيم الخطوط بشكل فعال بيتم عن طريق تعديل شدة إضاءة البكسلات على مسار الخط.\nخطوط المسح (Y) بتبدأ من 0 من أسفل الشاشة، والأعمدة (X) بتبدأ من 0 من الشمال لليمين."
      },
      {
        "id": "cg3-s7",
        "slideRef": "Page 11",
        "shortLabel": "7. Cartesian Slope-Intercep…",
        "title": "Cartesian Slope-Intercept Equation of a Straight Line",
        "enPoints": [
          "The <strong>Cartesian slope-intercept equation</strong> for a straight line is:",
          "<div class=\"cg-emph\">y = m &middot; x + b</div>",
          "With: <strong>m</strong> representing the <strong>slope of the line</strong>, and <strong>b</strong> as the <strong>y-intercept</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المعادلة الديكارتية للخط المستقيم بدلالة الميل والجزء المقطوع <span class='en-term' dir='ltr'>Cartesian slope-intercept equation</span> هي:",
        "deepPoints": [
          "<div class='text-center my-2'><span class='math-pill text-base'>y = m &middot; x + b</span></div>",
          "حيث <span class='hl-yellow'>m هو ميل الخط (Slope of the line)</span>، و <span class='hl-cyan'>b هو الجزء المقطوع من محور الصادات (y-intercept)</span>.",
          "<b>فهم معادلة الخط <span class='math-pill'>y = m · x + b</span> هندسياً:</b> الميل <span class='math-pill'>m</span> بيقولك: <i>كل ما نمشي خطوة واحدة يمين في اتجاه x، الـ y هتزيد بكام؟</i>",
          "والثابت <span class='math-pill'>b</span> (<span class='en-term' dir='ltr'>y-intercept</span>) هو قيمة <span class='math-pill'>y</span> لما الخط يقطع محور الصادات عند <span class='math-pill'>x = 0</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In the Cartesian slope-intercept equation y = m . x + b, what do m and b represent?</div><div><strong>الإجابة النموذجية:</strong> m represents the slope of the line, and b represents the y-intercept.</div>",
        "notebookEn": "Cartesian Slope-Intercept Equation: y = m . x + b, where m is the slope of the line and b is the y-intercept.",
        "notebookAr": "معادلة الخط المستقيم هي y = m.x + b حيث m الميل و b الجزء المقطوع من محور y."
      },
      {
        "id": "cg3-s8",
        "slideRef": "Pages 12 & 13",
        "shortLabel": "8. Calculating Slope and",
        "title": "Calculating Slope (m) and Y-Intercept (b) from Endpoints",
        "enPoints": [
          "Given that the two endpoints of a line segment are specified at positions <strong>(x<sub>1</sub>, y<sub>1</sub>)</strong> and <strong>(x<sub>2</sub>, y<sub>2</sub>)</strong>, we can determine values for the slope <strong>m</strong> and y intercept <strong>b</strong> with the following calculations:",
          "<div class=\"cg-emph\">m = (y<sub>2</sub> &minus; y<sub>1</sub>) / (x<sub>2</sub> &minus; x<sub>1</sub>)</div>",
          "<div class=\"cg-emph\">b = y<sub>1</sub> &minus; m &middot; x<sub>1</sub></div>"
        ],
        "svg": "<svg viewBox=\"0 0 360 220\" ><rect x=\"10\" y=\"10\" width=\"340\" height=\"200\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <line x1=\"80\" y1=\"25\" x2=\"80\" y2=\"185\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"55\" y1=\"160\" x2=\"310\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"80\" y1=\"105\" x2=\"92\" y2=\"105\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"80\" y1=\"50\" x2=\"92\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"160\" y1=\"148\" x2=\"160\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"250\" y1=\"148\" x2=\"250\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"160\" y1=\"105\" x2=\"250\" y2=\"50\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n                <circle cx=\"160\" cy=\"105\" r=\"5\" fill=\"#0f172a\"/><circle cx=\"250\" cy=\"50\" r=\"5\" fill=\"#0f172a\"/>\n                <text x=\"55\" y=\"110\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">y₁</text>\n                <text x=\"55\" y=\"55\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">y₂</text>\n                <text x=\"152\" y=\"180\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">x₁</text>\n                <text x=\"242\" y=\"180\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">x₂</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "لو معانا نقطتي البداية والنهاية لقطعة مستقيمة وهما <span class='math-pill'>(x<sub>1</sub>, y<sub>1</sub>)</span> و <span class='math-pill'>(x<sub>2</sub>, y<sub>2</sub>)</span>، نقدر نحسب الميل <span dir='ltr'>m</span> والجزء المقطوع <span dir='ltr'>b</span> بالقانونين دول:",
        "deepPoints": [
          "1️⃣ قانون الميل: <span class='math-pill'>m = (y<sub>2</sub> &minus; y<sub>1</sub>) / (x<sub>2</sub> &minus; x<sub>1</sub>)</span> (فرق الصادات على فرق السينات).",
          "2️⃣ قانون الجزء المقطوع: <span class='math-pill'>b = y<sub>1</sub> &minus; m &middot; x<sub>1</sub></span>.",
          "مثال تطبيقي: لـ <span class='math-pill'>(20,10)→(30,18)</span> نحسب <span class='math-pill'>m = (18−10)/(30−20) = 8/10 = 0.8</span> ثم <span class='math-pill'>b = y₁ − m·x₁ = 10 − 0.8·20 = −6</span>.",
          "<b>تحقق دايمًا:</b> عوّض بنقطة النهاية <span class='math-pill'>y = 0.8·30 − 6 = 18 ✓</span>. لو طلعت غلط يبقى في خطأ في m أو b.",
          "<b>ليه مبنرسمش الخط بالتعويض المباشر في <span class='math-pill'>y = round(m·x + b)</span>؟</b> لأن كل بكسل هيحتاج عملية ضرب في كسر عشري (<span class='math-pill'>m·x</span>) وعملية تقريب (<span class='math-pill'>round</span>)، وده بطيء جداً لو بنرسم ملايين الخطوط في الثانية!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Write the formulas for calculating the slope m and y-intercept b given two endpoints (x1, y1) and (x2, y2).</div><div><strong>الإجابة النموذجية:</strong> m = (y2 - y1) / (x2 - x1) and b = y1 - m . x1.</div>",
        "notebookEn": "Slope and Y-Intercept Formulas: m = (y2 - y1) / (x2 - x1) | b = y1 - m . x1",
        "notebookAr": "قوانين حساب الميل m والجزء المقطوع b بمعلومية نقطتين."
      },
      {
        "id": "cg3-s9",
        "slideRef": "Page 14",
        "shortLabel": "9. Bresenham's Line Algorit…",
        "title": "Bresenham's Line Algorithm: Core Characteristics",
        "enPoints": [
          "<strong>Bresenham's algorithm</strong> is an <strong>accurate and efficient raster line-generating algorithm</strong>.",
          "This scan converts lines using <span class=\"cg-emph\">only incremental integer calculations</span> that can be adapted to display <strong>circles and other curves</strong>.",
          "The <strong>vertical axes</strong> show <strong>scan-line positions</strong>, and the <strong>horizontal axes</strong> identify <strong>pixel columns</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "خوارزمية برزنهام <span class='en-term' dir='ltr'>Bresenham's algorithm</span> هي خوارزمية توليد خطوط نقطية تتميز بأنها <span class='hl-emerald'>دقيقة وفعالة وسريعة جداً (Accurate and efficient)</span>.",
        "deepPoints": [
          "<strong>سر سرعتها وكفاءتها (موضع سؤال امتحانات متكرر):</strong> إنها بتعمل Scan conversion للخطوط باستخدام <span class='hl-yellow'>حسابات الأعداد الصحيحة التزايدية فقط (Only incremental integer calculations)</span> بدون أي كسور عشرية أو عمليات ضرب/قسمة معقدة أثناء التكرار!",
          "كمان الخوارزمية دي نقدر نعدّلها عشان ترسم <strong>الدوائر والمنحنيات الأخرى (Circles and other curves)</strong>.",
          "المحور الرأسي بيمثل مواقع خطوط المسح <span class='en-term' dir='ltr'>Scan-line positions</span>، والمحور الأفقي بيحدد أعمدة البكسلات <span class='en-term' dir='ltr'>Pixel columns</span>.",
          "<b>عبقرية خوارزمية Bresenham في سطر واحد:</b> استبدلت الكسور العشرية والضرب والتقريب بـ <b>عمليات جمع وطرح أعداد صحيحة فقط (<span class='en-term' dir='ltr'>Only incremental integer calculations</span>)</b> واختبار إشارة الرقم (موجب ولا سالب).",
          "عشان كده هي أسرع وأدق خوارزمية في الهاردوير، ونفس الفكرة بتاعتها بنطبقها في الشابتر الجاي لرسم الدوائر (<span class='en-term' dir='ltr'>Bresenham / Midpoint Circle Algorithm</span>)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why is Bresenham's line algorithm so accurate and efficient, and what else can it be adapted to display?</div><div><strong>الإجابة النموذجية:</strong> Because it scan-converts lines using ONLY incremental integer calculations; it can also be adapted to display circles and other curves.</div>",
        "notebookEn": "Bresenham's Algorithm Key Feature: Accurate and efficient raster line-generating algorithm that uses ONLY incremental integer calculations (adaptable to circles and other curves).\nAxes Representation: Vertical axes = scan-line positions (Y) | Horizontal axes = pixel columns (X).",
        "notebookAr": "خوارزمية Bresenham سريعة ودقيقة لأنها بتستخدم جمع وطرح أعداد صحيحة فقط (Incremental integer calculations) وتصلح للدوائر والمنحنيات.\nالمحور الرأسي هو الـ Scan-lines والأفقي هو الـ Pixel columns."
      },
      {
        "id": "cg3-s10",
        "slideRef": "Pages 15 & 16",
        "shortLabel": "10. Sampling at Unit",
        "title": "Sampling at Unit X Intervals: Choosing the Closer Pixel",
        "enPoints": [
          "<strong>Sampling at unit x intervals</strong> in these examples, we need to decide <strong>which of two possible pixel positions is closer to the line path</strong> at each sample step.",
          "Starting from the left endpoint <strong>(10, 11)</strong> shown in the Figure, we need to determine at the next sample position (column 11) whether to plot the pixel at position <span class=\"cg-emph\">(11, 11)</span> or the one at <span class=\"cg-emph\">(11, 12)</span>."
        ],
        "svg": "<svg viewBox=\"0 0 380 240\" ><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <g stroke=\"#64748b\" stroke-width=\"1.5\">\n                    <line x1=\"70\" y1=\"20\" x2=\"70\" y2=\"210\"/><line x1=\"130\" y1=\"20\" x2=\"130\" y2=\"210\"/><line x1=\"190\" y1=\"20\" x2=\"190\" y2=\"210\"/><line x1=\"250\" y1=\"20\" x2=\"250\" y2=\"210\"/><line x1=\"310\" y1=\"20\" x2=\"310\" y2=\"210\"/>\n                    <line x1=\"50\" y1=\"45\" x2=\"345\" y2=\"45\"/><line x1=\"50\" y1=\"90\" x2=\"345\" y2=\"90\"/><line x1=\"50\" y1=\"135\" x2=\"345\" y2=\"135\"/><line x1=\"50\" y1=\"180\" x2=\"345\" y2=\"180\"/>\n                </g>\n                <circle cx=\"100\" cy=\"135\" r=\"20\" fill=\"#0f172a\"/>\n                <line x1=\"130\" y1=\"122\" x2=\"338\" y2=\"35\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <text x=\"148\" y=\"62\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Specified</text>\n                <text x=\"148\" y=\"78\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Line Path</text>\n                <line x1=\"180\" y1=\"82\" x2=\"212\" y2=\"98\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <text x=\"42\" y=\"50\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">13</text>\n                <text x=\"42\" y=\"95\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">12</text>\n                <text x=\"42\" y=\"140\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">11</text>\n                <text x=\"42\" y=\"185\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">10</text>\n                <text x=\"92\" y=\"202\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">10</text>\n                <text x=\"152\" y=\"202\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">11</text>\n                <text x=\"212\" y=\"202\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">12</text>\n                <text x=\"272\" y=\"202\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">13</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "لما بنمشي خطوة واحدة في اتجاه <span dir='ltr'>x</span> كل مرة <span class='en-term' dir='ltr'>Sampling at unit x intervals</span>، بنحتاج نقرر: <strong>أي بكسل من البكسلين المتاحين أقرب لمسار الخط الحقيقي؟</strong>",
        "deepPoints": [
          "في الرسمة (صفحة 16): بدأنا من النقطة اليسرى عند العمود 10 وخط المسح 11 يعني <span class='math-pill'>(10, 11)</span>.",
          "عند الخطوة التالية (العمود <span dir='ltr'>x = 11</span>)، قدامنا اختيارين فقط: إما نرسم البكسل اللي على نفس المستوى <span class='hl-emerald'>(11, 11)</span> أو البكسل اللي فوقه <span class='hl-rose'>(11, 12)</span> حسب مين فيهم أقرب للخط.",
          "ليه بنزوّد x بمقدار 1 بس؟ لأن <span class='math-pill'>0 &lt; m &lt; 1</span> يعني y بتزيد <b>أقل من 1</b> مع كل خطوة x، فعند كل عمود في بكسلين مرشحين بس: <span class='math-pill'>y<sub>k</sub></span> أو <span class='math-pill'>y<sub>k</sub>+1</span>.",
          "الخوارزمية في الآخر بتسأل سؤال واحد: <b>الخط الحقيقي أقرب لأنهي بكسل في العمود ده؟</b>"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Starting from pixel (10, 11) for a line with positive slope less than 1, what are the two candidate pixel positions at column 11?</div><div><strong>الإجابة النموذجية:</strong> The two candidate positions are (11, 11) and (11, 12).</div>",
        "notebookEn": "Unit X Sampling Decision: At each step, decide which of two candidate pixel positions is closer to the actual line path (e.g., from (10,11) choose between (11,11) and (11,12)).",
        "notebookAr": "في كل خطوة بنزود x بـ 1 ونختار البكسل الأقرب للخط: يا إما نفس الـ y (11,11) يا إما الـ y اللي فوقها (11,12)."
      },
      {
        "id": "cg3-s11",
        "slideRef": "Page 17",
        "shortLabel": "11. Bresenham's Approach for",
        "title": "Bresenham's Approach for Positive Slope Less Than 1",
        "enPoints": [
          "To illustrate Bresenham's approach, we first consider the scan-conversion process for lines with <span class=\"cg-emph\">positive slope less than 1</span> (<span dir='ltr'>0 &lt; m &lt; 1</span>).",
          "<div class=\"cg-emph\">m = &Delta;y / &Delta;x</div>",
          "where <strong>&Delta;y</strong> and <strong>&Delta;x</strong> are the <span class=\"cg-emph\">vertical</span> and <span class=\"cg-emph\">horizontal</span> separations of the endpoint positions."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عشان نشرح طريقة Bresenham الأساسية، بندرس حالة الخطوط اللي ليها <span class='hl-rose'>ميل موجب أقل من 1 (Positive slope less than 1)</span>، يعني <span class='math-pill'>0 &lt; m &lt; 1</span> (وده معناه إن <span dir='ltr'>&Delta;y &lt; &Delta;x</span>).",
        "deepPoints": [
          "الميل <span dir='ltr'>m</span> بيساوي <span class='math-pill'>m = &Delta;y / &Delta;x</span>:",
          "• <strong>&Delta;y:</strong> هي المسافة أو الفرق الرأسي <span class='hl-yellow'>Vertical separation</span> بين نقطتي النهاية.",
          "• <strong>&Delta;x:</strong> هي المسافة أو الفرق الأفقي <span class='hl-cyan'>Horizontal separation</span> بين نقطتي النهاية.",
          "<b>ماذا لو كان الميل أكبر من 1 (<span class='math-pill'>m &gt; 1</span>)؟</b> لو <span class='math-pill'>m &gt; 1</span> يبقى <span class='math-pill'>Δy &gt; Δx</span> (الخط واقف لفوق أكتر ما هو ماشي بالعرض)، وساعتها بنعكس الأدوار: نمشي خطوة واحدة في اتجاه <span class='math-pill'>y</span> ونختار بين <span class='math-pill'>x<sub>k</sub></span> و <span class='math-pill'>x<sub>k</sub> + 1</span>!",
          "وفي منهجنا التركيز الأساسي في الإثبات والمسائل بيكون على الحالة القياسية <span class='math-pill'>0 &lt; m &lt; 1</span> حيث <span class='math-pill'>Δy &lt; Δx</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In m = Δy / Δx, what do Δy and Δx represent?</div><div><strong>الإجابة النموذجية:</strong> Δy is the vertical separation and Δx is the horizontal separation of the endpoint positions.</div>",
        "notebookEn": "Standard Bresenham Slope Condition: Derived first for lines with positive slope less than 1 (0 < m < 1), where m = Δy / Δx (vertical over horizontal separation).",
        "notebookAr": "الحالة القياسية لـ Bresenham هي خط ميله موجب أقل من 1، حيث Δy الفرق الرأسي و Δx الفرق الأفقي."
      },
      {
        "id": "cg3-s12",
        "slideRef": "Page 18",
        "shortLabel": "12. Candidate Pixels at",
        "title": "Candidate Pixels at Column x_(k+1)",
        "enPoints": [
          "For the plotted point <span class=\"cg-emph\">(x<sub>k</sub>, y<sub>k</sub>)</span>, we need to decide which pixel to plot in column <span class=\"cg-emph\">x<sub>k+1</sub></span>.",
          "Our choices are the pixels at positions:",
          "<div class=\"cg-emph\">(x<sub>k+1</sub>, y<sub>k</sub>) &nbsp;&nbsp; Or &nbsp;&nbsp; (x<sub>k+1</sub>, y<sub>k+1</sub>)</div>",
          "(where <span dir='ltr'>x<sub>k+1</sub> = x<sub>k</sub> + 1</span> and <span dir='ltr'>y<sub>k+1</sub> = y<sub>k</sub> + 1</span>)."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بشكل عام: لو إحنا واقفين دلوقتي عند البكسل المرسوم <span class='math-pill'>(x<sub>k</sub>, y<sub>k</sub>)</span>، وعايزين نختار البكسل الجديد في العمود التالي <span class='math-pill'>x<sub>k+1</sub> = x<sub>k</sub> + 1</span>:",
        "deepPoints": [
          "الاختيارات المتاحة قدامنا هما بكسلين اتنين بس:",
          "1️⃣ البكسل السفلي: <span class='hl-emerald'>(x<sub>k</sub> + 1, y<sub>k</sub>)</span> (نفس خط المسح <span dir='ltr'>y<sub>k</sub></span>).",
          "2️⃣ البكسل العلوي: <span class='hl-rose'>(x<sub>k</sub> + 1, y<sub>k</sub> + 1)</span> (نطلع خط مسح واحد لفوق <span dir='ltr'>y<sub>k</sub> + 1</span>).",
          "<b>تثبيت الرموز عشان متتلخبطش في الإثبات:</b> النقطة اللي إحنا واقفين عندها دلوقتي اسمها <span class='math-pill'>(x<sub>k</sub>, y<sub>k</sub>)</span>، والعمود اللي جاي اسمه <span class='math-pill'>x<sub>k+1</sub> = x<sub>k</sub> + 1</span>.",
          "إحنا عارفين يقيناً إن الإحداثي السيني الجديد هو <span class='math-pill'>x<sub>k</sub> + 1</span>؛ كل الحيرة والاختيار في الإحداثي الصادي: هل نختار <span class='math-pill'>y<sub>k</sub></span> (ثابت) ولا <span class='math-pill'>y<sub>k</sub> + 1</span> (يزيد 1)؟"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Given pixel (x_k, y_k), what are the two possible pixel choices to plot in column x_(k+1)?</div><div><strong>الإجابة النموذجية:</strong> (x_k + 1, y_k) or (x_k + 1, y_k + 1).</div>",
        "notebookEn": "General Candidate Pixels at Step k: From (x_k, y_k), the two choices at column x_(k+1) are (x_k + 1, y_k) and (x_k + 1, y_k + 1).",
        "notebookAr": "من النقطة (x_k, y_k) بنختار بين (x_k + 1, y_k) أو (x_k + 1, y_k + 1)."
      },
      {
        "id": "cg3-s13",
        "slideRef": "Pages 19 & 20",
        "shortLabel": "13. Vertical Separations d₁",
        "title": "Vertical Separations d₁ and Equation of d₁",
        "enPoints": [
          "The answer depends on the value of <span class=\"cg-emph\">d<sub>1</sub></span> and <span class=\"cg-emph\">d<sub>2</sub></span>.",
          "The equation of the straight line at column <span dir='ltr'>x<sub>k</sub> + 1</span> is: <span class=\"cg-emph\">y = m(x<sub>k</sub> + 1) + b</span>",
          "Since: <span class=\"cg-emph\">d<sub>1</sub> = y &minus; y<sub>k</sub></span>",
          "Then: <div class=\"cg-emph\">d<sub>1</sub> = m(x<sub>k</sub> + 1) + b &minus; y<sub>k</sub></div>"
        ],
        "svg": "<svg viewBox=\"0 0 380 240\" ><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"3\"/>\n                <line x1=\"90\" y1=\"25\" x2=\"90\" y2=\"205\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"50\" y1=\"175\" x2=\"335\" y2=\"175\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"82\" y1=\"80\" x2=\"98\" y2=\"80\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"82\" y1=\"108\" x2=\"98\" y2=\"108\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"82\" y1=\"148\" x2=\"98\" y2=\"148\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"195\" y1=\"167\" x2=\"195\" y2=\"183\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"135\" y1=\"138\" x2=\"320\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <circle cx=\"195\" cy=\"80\" r=\"5.5\" fill=\"#0f172a\"/>\n                <circle cx=\"195\" cy=\"108\" r=\"5.5\" fill=\"#4f46e5\"/>\n                <circle cx=\"195\" cy=\"148\" r=\"5.5\" fill=\"#0f172a\"/>\n                <path d=\"M250,80 L256,80 L256,108 L250,108\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <path d=\"M250,108 L256,108 L256,148 L250,148\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/>\n                <text x=\"265\" y=\"98\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" fill=\"#e11d48\">d₂</text>\n                <text x=\"265\" y=\"133\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" fill=\"#059669\">d₁</text>\n                <text x=\"35\" y=\"85\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">yₖ + 1</text>\n                <text x=\"62\" y=\"113\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" fill=\"#4f46e5\">y</text>\n                <text x=\"58\" y=\"152\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">yₖ</text>\n                <text x=\"175\" y=\"200\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">xₖ + 1</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بص على الرسمة في صفحة 19: عند العمود <span dir='ltr'>x<sub>k</sub> + 1</span>، الارتفاع الحقيقي للخط هو <span class='math-pill'>y = m(x<sub>k</sub> + 1) + b</span>.",
        "deepPoints": [
          "بنقيس مسافتين رأسيتين عشان نعرف الخط أقرب لمين:",
          "• المسافة السفلية <span class='hl-emerald' dir='ltr'>d<sub>1</sub></span>: هي المسافة بين ارتفاع الخط الحقيقي <span dir='ltr'>y</span> والبكسل السفلي <span dir='ltr'>y<sub>k</sub></span>، يعني <span class='math-pill'>d<sub>1</sub> = y &minus; y<sub>k</sub></span>.",
          "بالتعويض عن قيمة <span dir='ltr'>y</span> نحصل على معادلة <span dir='ltr'>d<sub>1</sub></span>: <span class='math-pill'>d<sub>1</sub> = m(x<sub>k</sub> + 1) + b &minus; y<sub>k</sub></span>.",
          "لازم تفتكر: <span class='math-pill'>d₁ + d₂ = 1</span> دايمًا (المسافة بين البكسلين = 1). عشان كده بنقارن d₁ و d₂ بالفرق بينهم.",
          "<span class='math-pill'>d₁ − d₂ &lt; 0</span> ⇒ الخط أقرب للبكسل السفلي <span class='math-pill'>y<sub>k</sub></span>، و <span class='math-pill'>d₁ − d₂ ≥ 0</span> ⇒ الأقرب العلوي <span class='math-pill'>y<sub>k</sub>+1</span>.",
          "<b>مثال بالأرقام للتخيل:</b> لو <span class='math-pill'>y<sub>k</sub> = 11</span> و <span class='math-pill'>y<sub>k</sub> + 1 = 12</span>، والخط الحقيقي عدى عند ارتفاع <span class='math-pill'>y = 11.3</span> ⬅️ تبقى <span class='math-pill'>d₁ = 11.3 − 11 = 0.3</span> و <span class='math-pill'>d₂ = 12 − 11.3 = 0.7</span>، إذن <span class='math-pill'>d₁ &lt; d₂</span> فالخط أقرب للبكسل السفلي 11!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In Bresenham's derivation, how is the lower vertical separation d1 defined in terms of y and y_k?</div><div><strong>الإجابة النموذجية:</strong> d1 = y - y_k = m(x_k + 1) + b - y_k.</div>",
        "notebookEn": "Lower Vertical Separation (d1): y = m(x_k + 1) + b => d1 = y - y_k = m(x_k + 1) + b - y_k.",
        "notebookAr": "المسافة d1 هي بعد الخط الحقيقي y عن البكسل السفلي y_k."
      },
      {
        "id": "cg3-s14",
        "slideRef": "Page 21",
        "shortLabel": "14. Upper Separation d₂",
        "title": "Upper Separation d₂ and the Difference (d₁ − d₂)",
        "enPoints": [
          "Similarly, for the upper pixel <span dir='ltr'>y<sub>k</sub> + 1</span>: <span class=\"cg-emph\">d<sub>2</sub> = (y<sub>k</sub> + 1) &minus; y</span>",
          "Then: <span class=\"cg-emph\">d<sub>2</sub> = y<sub>k</sub> + 1 &minus; m(x<sub>k</sub> + 1) &minus; b</span>",
          "The <strong>difference between these two separations</strong> is:",
          "<div class=\"cg-emph\">d<sub>1</sub> &minus; d<sub>2</sub> = 2m(x<sub>k</sub> + 1) &minus; 2y<sub>k</sub> + 2b &minus; 1</div>",
          "From this difference, a <strong>decision parameter <span class=\"cg-emph\">p<sub>k</sub></span></strong> is deduced."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بالمثل نحسب المسافة الرأسية الثانية <span class='hl-rose' dir='ltr'>d<sub>2</sub></span> (بين البكسل العلوي <span dir='ltr'>y<sub>k</sub> + 1</span> والخط الحقيقي <span dir='ltr'>y</span>): <span class='math-pill'>d<sub>2</sub> = (y<sub>k</sub> + 1) &minus; y = y<sub>k</sub> + 1 &minus; m(x<sub>k</sub> + 1) &minus; b</span>.",
        "deepPoints": [
          "<strong>ليه بنطرح <span dir='ltr'>(d<sub>1</sub> &minus; d<sub>2</sub>)</span>؟</strong> لأن إشارة الطرح بتقولنا فوراً مين الأصغر:",
          "• لو <span class='math-pill'>d<sub>1</sub> &minus; d<sub>2</sub> &lt; 0</span> (سالب) ⬅️ يبقى <span dir='ltr'>d<sub>1</sub> &lt; d<sub>2</sub></span> يعني البكسل السفلي <span dir='ltr'>y<sub>k</sub></span> هو الأقرب!",
          "• لو <span class='math-pill'>d<sub>1</sub> &minus; d<sub>2</sub> &ge; 0</span> (موجب أو صفر) ⬅️ يبقى <span dir='ltr'>d<sub>2</sub> &le; d<sub>1</sub></span> يعني البكسل العلوي <span dir='ltr'>y<sub>k</sub> + 1</span> هو الأقرب!",
          "ناتج طرح المعادلتين معاً يعطي: <span class='math-pill'>d<sub>1</sub> &minus; d<sub>2</sub> = 2m(x<sub>k</sub> + 1) &minus; 2y<sub>k</sub> + 2b &minus; 1</span>، ومنها نستنتج معامل القرار <span class='hl-yellow' dir='ltr'>Decision parameter p<sub>k</sub></span>.",
          "<b>إزاي جمعنا وطرحنا المعادلتين في صفحة 21؟</b><br>عندنا <span class='math-pill'>d₁ = y − y<sub>k</sub></span> و <span class='math-pill'>d₂ = y<sub>k</sub> + 1 − y</span>.<br>لما نطرح <span class='math-pill'>d₁ − d₂ = (y − y<sub>k</sub>) − (y<sub>k</sub> + 1 − y) = 2y − 2y<sub>k</sub> − 1</span>.<br>شيل <span class='math-pill'>y</span> وحط مكانها <span class='math-pill'>m(x<sub>k</sub> + 1) + b</span> يطلع فورا: <span class='math-pill'>d₁ − d₂ = 2m(x<sub>k</sub> + 1) − 2y<sub>k</sub> + 2b − 1</span>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the formula for the difference (d1 - d2) between the two vertical separations?</div><div><strong>الإجابة النموذجية:</strong> d1 - d2 = 2m(x_k + 1) - 2y_k + 2b - 1.</div>",
        "notebookEn": "Upper Separation (d2) & Difference (d1 - d2): d2 = (y_k + 1) - y => d1 - d2 = 2m(x_k + 1) - 2y_k + 2b - 1.",
        "notebookAr": "بنطرح d1 - d2 عشان نعرف مين الأقرب للخط من إشارة الناتج، ومنها بنطلع معامل القرار p_k."
      },
      {
        "id": "cg3-s15",
        "slideRef": "Page 22",
        "shortLabel": "15. Defining the Integer",
        "title": "Defining the Integer Decision Parameter p_k",
        "enPoints": [
          "Replace the slope <strong>m</strong> by <strong>&Delta;y / &Delta;x</strong> (where <strong>&Delta;x</strong> is the horizontal separation and <strong>&Delta;y</strong> is the vertical separation of the endpoints).",
          "Multiply <span dir='ltr'>(d<sub>1</sub> &minus; d<sub>2</sub>)</span> by <span dir='ltr'>&Delta;x</span> to define the decision parameter at step <span dir='ltr'>k</span>:",
          "<div class=\"cg-emph\">p<sub>k</sub> = &Delta;x (d<sub>1</sub> &minus; d<sub>2</sub>)</div>",
          "Then: <span class='font-mono font-bold'>p<sub>k</sub> = &Delta;x ( 2m(x<sub>k</sub> + 1) &minus; 2y<sub>k</sub> + 2b &minus; 1 )</span>, or:",
          "<div class=\"cg-emph\">p<sub>k</sub> = 2&Delta;y &middot; x<sub>k</sub> &minus; 2&Delta;x &middot; y<sub>k</sub> + c</div>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "المشكلة في معادلة <span dir='ltr'>(d<sub>1</sub> &minus; d<sub>2</sub>)</span> إن فيها الميل <span class='math-pill'>m = &Delta;y / &Delta;x</span> يعني فيها قسمة وكسور!",
        "deepPoints": [
          "عشان نتخلص من المقام <span dir='ltr'>&Delta;x</span> ونخلي الحسابات كلها أعداد صحيحة، بنضرب الطرفين في <span class='hl-cyan' dir='ltr'>&Delta;x</span> (وبما إن <span dir='ltr'>&Delta;x &gt; 0</span> فالإشارة مش هتتغير!).",
          "بالتالي نعرّف معامل القرار <span class='math-pill'>p<sub>k</sub> = &Delta;x (d<sub>1</sub> &minus; d<sub>2</sub>)</span>، وله نفس إشارة <span dir='ltr'>(d<sub>1</sub> &minus; d<sub>2</sub>)</span> بالظبط.",
          "لما نفك القوس ونجمع الحدود الثابتة في ثابت واحد اسمه <span dir='ltr'>c</span>، بتبقى المعادلة النهائية لـ <span dir='ltr'>p<sub>k</sub></span> هي: <span class='hl-emerald' dir='ltr'>p<sub>k</sub> = 2&Delta;y &middot; x<sub>k</sub> &minus; 2&Delta;x &middot; y<sub>k</sub> + c</span>.",
          "ليه بنضرب في Δx؟ (1) Δx موجبة فإشارة الفرق متتغيرش، (2) بنتخلص من الكسر <span class='math-pill'>m = Δy/Δx</span> فنشتغل بأعداد <b>صحيحة</b> بس (أسرع وأدق من الـ floating point).",
          "<b>القاعدة النهائية:</b> <span class='math-pill'>p<sub>k</sub> &lt; 0 ⇒ ارسم (x<sub>k</sub>+1, y<sub>k</sub>)</span> وغير كده <span class='math-pill'>(x<sub>k</sub>+1, y<sub>k</sub>+1)</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How is the decision parameter p_k defined in terms of Δx and (d1 - d2), and what is its expanded integer form?</div><div><strong>الإجابة النموذجية:</strong> p_k = Δx(d1 - d2) = 2Δy . x_k - 2Δx . y_k + c.</div>",
        "notebookEn": "Decision Parameter p_k Definition: p_k = Δx(d1 - d2) = 2Δy . x_k - 2Δx . y_k + c (multiplying by Δx removes fractions while keeping the same sign).",
        "notebookAr": "بنضرب (d1 - d2) في Δx عشان نطير الكسر ويبقى p_k عدد صحيح ليه نفس الإشارة."
      },
      {
        "id": "cg3-s16",
        "slideRef": "Page 23",
        "shortLabel": "16. Eliminating the Constant",
        "title": "Eliminating the Constant c & Parameter p_(k+1)",
        "enPoints": [
          "The constant <strong>c</strong> is defined as:",
          "<div class=\"cg-emph\">c = 2&Delta;y + &Delta;x (2b &minus; 1)</div>",
          "Which is <strong>independent of pixel position</strong> and will be <strong>eliminated in the recursive calculations</strong> for <span dir='ltr'>p<sub>k</sub></span>.",
          "At step <strong>k + 1</strong>, the decision parameter is:",
          "<div class=\"cg-emph\">p<sub>k+1</sub> = 2&Delta;y &middot; x<sub>k+1</sub> &minus; 2&Delta;x &middot; y<sub>k+1</sub> + c</div>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الثابت <span class='math-pill'>c = 2&Delta;y + &Delta;x(2b &minus; 1)</span> لا يعتمد نهائياً على إحداثيات البكسل <span class='hl-yellow'>Independent of pixel position</span> (ثابت طول الخط).",
        "deepPoints": [
          "وعشان كده لما نكتب معادلة الخطوة التالية <span dir='ltr'>p<sub>k+1</sub></span> ونطرح منها <span dir='ltr'>p<sub>k</sub></span>، الثابت <span dir='ltr'>c</span> <strong>هيطير تماماً (Eliminated in the recursive calculations)</strong> ومش هنحتاج نحسبه أصلاً في الخطوات التكرارية!",
          "<b>تفصيلة استنتاج الثابت <span class='math-pill'>c</span> (صفحة 23):</b><br>لما ضربنا في <span class='math-pill'>Δx</span> بقت المعادلة: <span class='math-pill'>p<sub>k</sub> = 2Δy(x<sub>k</sub> + 1) − 2Δx·y<sub>k</sub> + Δx(2b − 1)</span>.<br>فك القوس الأول <span class='math-pill'>2Δy·x<sub>k</sub> + 2Δy</span>، وجمع الحدود اللي مفيهاش <span class='math-pill'>x<sub>k</sub></span> أو <span class='math-pill'>y<sub>k</sub></span> مع بعض يطلع الثابت <span class='math-pill'>c = 2Δy + Δx(2b − 1)</span>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the formula for the constant c in p_k, and why can we eliminate it in recursive calculations?</div><div><strong>الإجابة النموذجية:</strong> c = 2Δy + Δx(2b - 1); it is eliminated because it is independent of pixel position and cancels out when subtracting p_k from p_(k+1).</div>",
        "notebookEn": "Constant c & Why It Cancels Out: c = 2Δy + Δx(2b - 1); independent of pixel position, so it is eliminated when computing p_(k+1) - p_k.",
        "notebookAr": "الثابت c لا يعتمد على مكان البكسل، فبيطير لما بنطرح p_(k+1) - p_k."
      },
      {
        "id": "cg3-s17",
        "slideRef": "Page 24",
        "shortLabel": "17. Recursive Formula for",
        "title": "Recursive Formula for Next Decision Parameter p_(k+1)",
        "enPoints": [
          "Subtracting <span dir='ltr'>p<sub>k</sub></span> from <span dir='ltr'>p<sub>k+1</sub></span>:",
          "<div class='text-center font-mono text-xs sm:text-sm font-bold my-1'>p<sub>k+1</sub> &minus; p<sub>k</sub> = 2&Delta;y (x<sub>k+1</sub> &minus; x<sub>k</sub>) &minus; 2&Delta;x (y<sub>k+1</sub> &minus; y<sub>k</sub>)</div>",
          "Since <strong>x<sub>k+1</sub> = x<sub>k</sub> + 1</strong> (so <span dir='ltr'>x<sub>k+1</sub> &minus; x<sub>k</sub> = 1</span>), we can write:",
          "<div class=\"cg-emph\">p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y &minus; 2&Delta;x (y<sub>k+1</sub> &minus; y<sub>k</sub>)</div>",
          "The term <strong>(y<sub>k+1</sub> &minus; y<sub>k</sub>)</strong> is either <strong>\"0\"</strong> or <strong>\"1\"</strong> depending on the sign of parameter <strong>p<sub>k</sub></strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "لما بنطرح <span dir='ltr'>p<sub>k+1</sub> &minus; p<sub>k</sub></span> ونعوض عن <span class='math-pill'>x<sub>k+1</sub> &minus; x<sub>k</sub> = 1</span> (لأننا بنزود <span dir='ltr'>x</span> بـ 1 في كل خطوة)، بنوصل للمعادلة التكرارية الأم:",
        "deepPoints": [
          "<div class='text-center my-2'><span class='math-pill text-base'>p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y &minus; 2&Delta;x (y<sub>k+1</sub> &minus; y<sub>k</sub>)</span></div>",
          "ركز في القوس <span class='hl-yellow' dir='ltr'>(y<sub>k+1</sub> &minus; y<sub>k</sub>)</span>: قيمته إما <strong>0</strong> أو <strong>1</strong> حسب إشارة <span dir='ltr'>p<sub>k</sub></span>:",
          "• لو <span dir='ltr'>p<sub>k</sub> &lt; 0</span>: الـ <span dir='ltr'>y</span> مش بتزيد (<span dir='ltr'>y<sub>k+1</sub> = y<sub>k</sub></span>)، فيكون القوس = <strong>0</strong>، وتصبح المعادلة: <span class='hl-emerald' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y</span>.",
          "• لو <span dir='ltr'>p<sub>k</sub> &ge; 0</span>: الـ <span dir='ltr'>y</span> بتزيد 1 (<span dir='ltr'>y<sub>k+1</sub> = y<sub>k</sub> + 1</span>)، فيكون القوس = <strong>1</strong>، وتصبح المعادلة: <span class='hl-rose' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y &minus; 2&Delta;x</span>.",
          "الفرق <span class='math-pill'>p<sub>k+1</sub> − p<sub>k</sub> = 2Δy − 2Δx(y<sub>k+1</sub> − y<sub>k</sub>)</span> وبما إن <span class='math-pill'>y<sub>k+1</sub> − y<sub>k</sub></span> إما 0 أو 1 يطلع عندنا حالتين بالظبط:",
          "• لو <span class='math-pill'>p<sub>k</sub> &lt; 0</span> (y ثابتة): <span class='math-pill'>p<sub>k+1</sub> = p<sub>k</sub> + 2Δy</span>.<br>• لو <span class='math-pill'>p<sub>k</sub> ≥ 0</span> (y بتزيد 1): <span class='math-pill'>p<sub>k+1</sub> = p<sub>k</sub> + 2Δy − 2Δx</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In p_(k+1) = p_k + 2Δy - 2Δx(y_(k+1) - y_k), what are the possible values of the term (y_(k+1) - y_k) and what do they depend on?</div><div><strong>الإجابة النموذجية:</strong> The term (y_(k+1) - y_k) is either 0 (when p_k < 0) or 1 (when p_k >= 0), depending on the sign of parameter p_k.</div>",
        "notebookEn": "Master Recursive Equation for p_(k+1): p_(k+1) = p_k + 2Δy - 2Δx(y_(k+1) - y_k), where (y_(k+1) - y_k) is 0 if p_k = 0.",
        "notebookAr": "المعادلة العامة لحساب p_(k+1): لو p_k سالبة القوس بـ 0 فنزود 2Δy بس، ولو موجبة القوس بـ 1 فنزود (2Δy - 2Δx)."
      },
      {
        "id": "cg3-s18",
        "slideRef": "Page 25",
        "shortLabel": "18. Bresenham's Line Algorit…",
        "title": "Bresenham's Line Algorithm: Steps 1, 2 & 3 (Initialization)",
        "enPoints": [
          "<strong>1.</strong> Input the two line endpoints and store the left endpoint in <span class=\"cg-emph\">(x<sub>0</sub>, y<sub>0</sub>)</span>.",
          "<strong>2.</strong> Load <span class=\"cg-emph\">(x<sub>0</sub>, y<sub>0</sub>)</span> into the frame buffer; that is, <strong>plot the first point</strong>.",
          "<strong>3.</strong> Calculate constants <span class=\"cg-emph\">&Delta;x, &Delta;y, 2&Delta;y</span>, and <span class=\"cg-emph\">2&Delta;y &minus; 2&Delta;x</span>, then obtain the starting value for the <strong>initial decision parameter</strong> as:",
          "<div class=\"cg-emph\">p<sub>0</sub> = 2&Delta;y &minus; &Delta;x</div>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أول 3 خطوات رسمية في خوارزمية Bresenham (مرحلة التجهيز قبل الـ Loop):",
        "deepPoints": [
          "1️⃣ ندخل نقطتي النهاية للخط ونخزن النقطة اليسرى في <span class='math-pill'>(x<sub>0</sub>, y<sub>0</sub>)</span>.",
          "2️⃣ نحمّل <span class='math-pill'>(x<sub>0</sub>, y<sub>0</sub>)</span> في الـ Frame buffer (يعني نرسم أول نقطة فوراً).",
          "3️⃣ نحسب الثوابت الأربعة: <span class='math-pill'>&Delta;x</span>، <span class='math-pill'>&Delta;y</span>، <span class='math-pill'>2&Delta;y</span>، و <span class='math-pill'>2&Delta;y &minus; 2&Delta;x</span>، ثم نحسب القيمة الابتدائية لمعامل القرار <span class='hl-rose' dir='ltr'>p<sub>0</sub> = 2&Delta;y &minus; &Delta;x</span>.",
          "<b>سؤال ذكي: جت منين معادلة البداية <span class='math-pill'>p₀ = 2Δy − Δx</span>؟</b><br>عوّض بـ <span class='math-pill'>k = 0</span> وبقيمة <span class='math-pill'>b = y₀ − (Δy/Δx)x₀</span> في معادلة <span class='math-pill'>p₀ = 2Δy·x₀ − 2Δx·y₀ + 2Δy + Δx(2b − 1)</span>؛ هتلاقي كل الحدود اللي فيها <span class='math-pill'>x₀</span> و <span class='math-pill'>y₀</span> بتطير مع بعض ويتبقى بالظبط <span class='math-pill'>p₀ = 2Δy − Δx</span>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the formula for the initial decision parameter p0 in Bresenham's line algorithm?</div><div><strong>الإجابة النموذجية:</strong> p0 = 2Δy - Δx.</div>",
        "notebookEn": "Bresenham Initialization (Steps 1–3): 1. Store left endpoint in (x0, y0) | 2. Plot (x0, y0) | 3. Compute Δx, Δy, 2Δy, 2Δy - 2Δx, and initial parameter p0 = 2Δy - Δx.",
        "notebookAr": "خطوات البداية: ارسم (x0, y0)، واحسب الثوابت، واحسب أول معامل قرار بالقانون p0 = 2Δy - Δx."
      },
      {
        "id": "cg3-s19",
        "slideRef": "Page 26",
        "shortLabel": "19. Bresenham's Line Algorit…",
        "title": "Bresenham's Line Algorithm: Steps 4 & 5 (Iterative Loop)",
        "enPoints": [
          "<strong>4.</strong> At each <span dir='ltr'>x<sub>k</sub></span> along the line, starting at <span dir='ltr'>k = 0</span>, perform the following test:",
          "&bull; <strong class=\"cg-emph\">If p<sub>k</sub> &lt; 0:</strong> the next point to plot is <span class=\"cg-emph\">(x<sub>k</sub> + 1, y<sub>k</sub>)</span> and <span class=\"cg-emph\">p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y</span>",
          "&bull; <strong class=\"cg-emph\">Otherwise (p<sub>k</sub> &ge; 0):</strong> the next point to plot is <span class=\"cg-emph\">(x<sub>k</sub> + 1, y<sub>k</sub> + 1)</span> and <span class=\"cg-emph\">p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y &minus; 2&Delta;x</span>",
          "<strong>5.</strong> Repeat step 4 <span class='font-bold underline'>&Delta;x times</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الخطوتين 4 و 5 هما قلب حل أي مسألة في الامتحان:",
        "deepPoints": [
          "4️⃣ عند كل <span dir='ltr'>x<sub>k</sub></span> بدايةً من <span class='math-pill'>k = 0</span> بنختبر إشارة <span dir='ltr'>p<sub>k</sub></span>:",
          "• <strong>لو <span dir='ltr'>p<sub>k</sub> &lt; 0</span> (سالب):</strong> النقطة الجديدة هي <span class='hl-emerald' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub>)</span>، ومعامل القرار الجديد <span class='hl-emerald' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y</span>.",
          "• <strong>غير كده (<span dir='ltr'>p<sub>k</sub> &ge; 0</span> موجب أو صفر):</strong> النقطة الجديدة هي <span class='hl-rose' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub> + 1)</span>، ومعامل القرار الجديد <span class='hl-rose' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2&Delta;y &minus; 2&Delta;x</span>.",
          "5️⃣ نكرر الخطوة الرابعة عدد مرات يساوي <span class='hl-yellow' dir='ltr'>&Delta;x times</span> (يعني من <span dir='ltr'>k = 0</span> لحد <span dir='ltr'>k = &Delta;x &minus; 1</span>).",
          "<b>أخطاء شائعة:</b> (1) نسيان إن x بتزيد <u>دايمًا</u> وy هي اللي شرطية. (2) خلط الحالتين: السالبة تجمع <span class='math-pill'>2Δy</span> والموجبة تجمع <span class='math-pill'>2Δy−2Δx</span>. (3) نسيان رسم نقطة البداية.",
          "<b>تحقق سريع من حلك:</b> عدد البكسلات = <span class='math-pill'>Δx + 1</span>، وآخر نقطة لازم تطابق نقطة النهاية."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In Step 4 of Bresenham's algorithm, what is the next point and p_(k+1) when p_k < 0 versus when p_k >= 0, and how many times is Step 4 repeated?</div><div><strong>الإجابة النموذجية:</strong> If p_k < 0: plot (x_k + 1, y_k) and p_(k+1) = p_k + 2Δy. Otherwise: plot (x_k + 1, y_k + 1) and p_(k+1) = p_k + 2Δy - 2Δx. Repeated Δx times.</div>",
        "notebookEn": "Bresenham Decision Test (Step 4) & Loop Count (Step 5): If p_k plot (x_k+1, y_k), p_(k+1) = p_k + 2Δy | If p_k >= 0 -> plot (x_k+1, y_k+1), p_(k+1) = p_k + 2Δy - 2Δx | Repeat Δx times.",
        "notebookAr": "قوانين التعويض في الجدول: لو سالب ثبت الـ y واجمع 2Δy، ولو موجب زود الـ y واجمع (2Δy - 2Δx)، وكرر Δx مرات."
      },
      {
        "id": "cg3-s20",
        "slideRef": "Pages 27 & 28",
        "shortLabel": "20. Solved Example Setup:",
        "title": "Solved Example Setup: Endpoints (20, 10) and (30, 18)",
        "enPoints": [
          "<strong>Problem:</strong> To illustrate the algorithm, we digitize the line with endpoints <strong>(20, 10)</strong> and <strong>(30, 18)</strong>.",
          "This line has a <strong>slope of 0.8</strong>, with <strong>&Delta;x = 10</strong>, <strong>&Delta;y = 8</strong>.",
          "The <strong>initial decision parameter</strong> has the value: <span class=\"cg-emph\">p<sub>0</sub> = 2&Delta;y &minus; &Delta;x = 16 &minus; 10 = 6</span>.",
          "The <strong>increments</strong> for calculating successive decision parameters are: <span class=\"cg-emph\">2&Delta;y = 16</span>, and <span class=\"cg-emph\">2&Delta;y &minus; 2&Delta;x = &minus;4</span>.",
          "We plot the initial point <strong>(x<sub>0</sub>, y<sub>0</sub>) = (20, 10)</strong>, and determine successive pixel positions along the line path."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "تطبيق مباشر على مسألة المحاضرة <span class='math-pill'>(20, 10) &rarr; (30, 18)</span>:",
        "deepPoints": [
          "1️⃣ حساب الفروق والميل: <span class='math-pill'>&Delta;x = 30 &minus; 20 = 10</span>، و <span class='math-pill'>&Delta;y = 18 &minus; 10 = 8</span>، والميل <span class='math-pill'>m = 8/10 = 0.8</span>.",
          "2️⃣ حساب <span dir='ltr'>p<sub>0</sub></span>: <span class='hl-yellow' dir='ltr'>p<sub>0</sub> = 2&Delta;y &minus; &Delta;x = 2(8) &minus; 10 = 6</span>.",
          "3️⃣ حساب مقدارَي الزيادة: <span class='hl-emerald' dir='ltr'>2&Delta;y = 16</span> (نجمعه لما تكون <span dir='ltr'>p<sub>k</sub></span> سالبة)، و <span class='hl-rose' dir='ltr'>2&Delta;y &minus; 2&Delta;x = 16 &minus; 20 = &minus;4</span> (نجمعه لما تكون <span dir='ltr'>p<sub>k</sub></span> موجبة أو صفر).",
          "4️⃣ نرسم نقطة البداية <span class='math-pill'>(20, 10)</span> ونبدأ الجدول لـ 10 خطوات (<span dir='ltr'>k = 0</span> إلى <span dir='ltr'>k = 9</span>).",
          "<b>إزاي تكتب الحل في ورقة الامتحان وتاخد الدرجة النهائية؟</b><br>قبل ما ترسم الجدول، اكتب 5 سطور مرتبين: (1) <span class='math-pill'>(x₀, y₀) = (20, 10)</span>، (2) <span class='math-pill'>Δx = 10, Δy = 8</span>، (3) <span class='math-pill'>p₀ = 2Δy − Δx = 6</span>، (4) <span class='math-pill'>2Δy = 16</span>، و (5) <span class='math-pill'>2Δy − 2Δx = −4</span>. السطور دي لوحدها عليها نص درجة المسألة!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: For the line from (20, 10) to (30, 18), what are the values of Δx, Δy, p0, 2Δy, and 2Δy - 2Δx?</div><div><strong>الإجابة النموذجية:</strong> Δx = 10, Δy = 8, p0 = 6, 2Δy = 16, and 2Δy - 2Δx = -4.</div>",
        "notebookEn": "Solved Example Constants ((20,10) to (30,18)): Δx = 10, Δy = 8, m = 0.8 | p0 = 2(8) - 10 = 6 | 2Δy = 16 | 2Δy - 2Δx = -4 | Initial point = (20, 10).",
        "notebookAr": "ثوابت مثال المحاضرة: Δx=10, Δy=8, p0=6، والزيادات هي +16 في السالب و -4 في الموجب."
      },
      {
        "id": "cg3-s21",
        "slideRef": "Page 29",
        "shortLabel": "21. Solved Example: Complete",
        "title": "Solved Example: Complete Iteration Table (k = 0 to 9)",
        "enPoints": [
          "Successive values of <span dir='ltr'>k</span>, <span dir='ltr'>p<sub>k</sub></span>, and plotted pixel <span dir='ltr'>(x<sub>k+1</sub>, y<sub>k+1</sub>)</span>:",
          "<span class='font-mono'>&bull; k=0: p<sub>0</sub> = 6 &rarr; (21, 11) &nbsp;|&nbsp; k=1: p<sub>1</sub> = 2 &rarr; (22, 12)</span>",
          "<span class='font-mono'>&bull; k=2: p<sub>2</sub> = &minus;2 &rarr; (23, 12) &nbsp;|&nbsp; k=3: p<sub>3</sub> = 14 &rarr; (24, 13)</span>",
          "<span class='font-mono'>&bull; k=4: p<sub>4</sub> = 10 &rarr; (25, 14) &nbsp;|&nbsp; k=5: p<sub>5</sub> = 6 &rarr; (26, 15)</span>",
          "<span class='font-mono'>&bull; k=6: p<sub>6</sub> = 2 &rarr; (27, 16) &nbsp;|&nbsp; k=7: p<sub>7</sub> = &minus;2 &rarr; (28, 16)</span>",
          "<span class='font-mono'>&bull; k=8: p<sub>8</sub> = 14 &rarr; (29, 17) &nbsp;|&nbsp; k=9: p<sub>9</sub> = 10 &rarr; (30, 18)</span>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "لاحظ النمط الجميل اللي بيتكرر في جدول صفحة 29:",
        "deepPoints": [
          "• في أول خطوتين (<span dir='ltr'>k=0, 1</span>): كانت <span dir='ltr'>p<sub>k</sub></span> موجبة (6 ثم 2)، فطرحنا 4 في كل مرة وزودنا <span dir='ltr'>y</span> بـ 1.",
          "• عند <span class='hl-emerald' dir='ltr'>k = 2</span> و <span class='hl-emerald' dir='ltr'>k = 7</span>: أصبحت <span dir='ltr'>p<sub>k</sub> = &minus;2</span> (سالبة!)، فثبتنا الـ <span dir='ltr'>y</span> عند 12 (في <span dir='ltr'>k=2</span>) وعند 16 (في <span dir='ltr'>k=7</span>)، وجمعنا <span dir='ltr'>+16</span> فطلعت <span dir='ltr'>p<sub>k+1</sub> = &minus;2 + 16 = 14</span>.",
          "• في الخطوة الأخيرة <span class='hl-yellow' dir='ltr'>k = 9</span>: وصلنا بالظبط لنقطة النهاية <span dir='ltr'>(30, 18)</span>!",
          "طريقة مراجعة الجدول: لكل صف قارن y المرسومة مع y الحقيقية <span class='math-pill'>0.8x − 6</span> مقرّبة لأقرب عدد صحيح، لازم يتطابقوا.",
          "لاحظ نمط المثال: بما إن <span class='math-pill'>m = 0.8</span> فـ y بتزيد في حوالي 8 خطوات من 10، وبتثبت في خطوتين فقط (لما p سالبة عند k=2 وعند k=7)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In the solved example from (20, 10) to (30, 18), at which steps k does p_k become negative (-2), causing y to stay unchanged?</div><div><strong>الإجابة النموذجية:</strong> At k = 2 (plotting (23, 12)) and at k = 7 (plotting (28, 16)).</div>",
        "notebookEn": "Solved Example Table Highlights: p_k sequence: 6, 2, -2, 14, 10, 6, 2, -2, 14, 10 | Negative at k=2 -> (23,12) and k=7 -> (28,16) | Ends at k=9 -> (30,18).",
        "notebookAr": "في الجدول القيمة بتطلع سالبة (-2) مرتين بس عند k=2 وعند k=7 فبنثبت فيهم الـ y ونزود 16."
      },
      {
        "id": "cg3-s22",
        "slideRef": "Page 30",
        "shortLabel": "22. Solved Example: Plotted",
        "title": "Solved Example: Plotted Pixel Positions Along the Line Path",
        "enPoints": [
          "<strong>Figure (Page 30):</strong> Pixel positions plotted along the line path between <strong>(20, 10)</strong> and <strong>(30, 18)</strong>.",
          "Total pixels plotted = <strong>11 pixels</strong> (the initial endpoint <span dir='ltr'>(20, 10)</span> plus the <span dir='ltr'>&Delta;x = 10</span> generated pixels from <span dir='ltr'>k = 0</span> to <span dir='ltr'>k = 9</span>)."
        ],
        "svg": "<svg viewBox=\"0 0 400 260\" ><rect x=\"10\" y=\"10\" width=\"380\" height=\"240\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <g stroke=\"#94a3b8\" stroke-width=\"1\">\n                    <line x1=\"70\" y1=\"25\" x2=\"70\" y2=\"215\"/><line x1=\"95\" y1=\"25\" x2=\"95\" y2=\"215\"/><line x1=\"120\" y1=\"25\" x2=\"120\" y2=\"215\"/><line x1=\"145\" y1=\"25\" x2=\"145\" y2=\"215\"/><line x1=\"170\" y1=\"25\" x2=\"170\" y2=\"215\"/><line x1=\"195\" y1=\"25\" x2=\"195\" y2=\"215\"/><line x1=\"220\" y1=\"25\" x2=\"220\" y2=\"215\"/><line x1=\"245\" y1=\"25\" x2=\"245\" y2=\"215\"/><line x1=\"270\" y1=\"25\" x2=\"270\" y2=\"215\"/><line x1=\"295\" y1=\"25\" x2=\"295\" y2=\"215\"/><line x1=\"320\" y1=\"25\" x2=\"320\" y2=\"215\"/>\n                    <line x1=\"55\" y1=\"40\" x2=\"345\" y2=\"40\"/><line x1=\"55\" y1=\"60\" x2=\"345\" y2=\"60\"/><line x1=\"55\" y1=\"80\" x2=\"345\" y2=\"80\"/><line x1=\"55\" y1=\"100\" x2=\"345\" y2=\"100\"/><line x1=\"55\" y1=\"120\" x2=\"345\" y2=\"120\"/><line x1=\"55\" y1=\"140\" x2=\"345\" y2=\"140\"/><line x1=\"55\" y1=\"160\" x2=\"345\" y2=\"160\"/><line x1=\"55\" y1=\"180\" x2=\"345\" y2=\"180\"/><line x1=\"55\" y1=\"200\" x2=\"345\" y2=\"200\"/>\n                </g>\n                <line x1=\"70\" y1=\"200\" x2=\"320\" y2=\"40\" stroke=\"#e11d48\" stroke-width=\"2\"/>\n                <g fill=\"#1e293b\">\n                    <circle cx=\"70\" cy=\"200\" r=\"8\"/><circle cx=\"95\" cy=\"180\" r=\"8\"/><circle cx=\"120\" cy=\"160\" r=\"8\"/><circle cx=\"145\" cy=\"160\" r=\"8\"/><circle cx=\"170\" cy=\"140\" r=\"8\"/><circle cx=\"195\" cy=\"120\" r=\"8\"/><circle cx=\"220\" cy=\"100\" r=\"8\"/><circle cx=\"245\" cy=\"80\" r=\"8\"/><circle cx=\"270\" cy=\"80\" r=\"8\"/><circle cx=\"295\" cy=\"60\" r=\"8\"/><circle cx=\"320\" cy=\"40\" r=\"8\"/>\n                </g>\n                <text x=\"32\" y=\"204\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">10</text>\n                <text x=\"32\" y=\"104\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">15</text>\n                <text x=\"32\" y=\"44\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">18</text>\n                <text x=\"62\" y=\"232\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">20</text>\n                <text x=\"87\" y=\"232\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">21</text>\n                <text x=\"112\" y=\"232\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">22</text>\n                <text x=\"187\" y=\"232\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">25</text>\n                <text x=\"312\" y=\"232\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">30</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الرسمة النهائية في صفحة 30 بتوضح الـ <strong>11 بكسل</strong> اللي اترسموا على الشبكة:",
        "deepPoints": [
          "• نقطة البداية <span class='math-pill'>(20, 10)</span> + الـ 10 نقاط اللي طلعوا من الجدول.",
          "• لاحظ في الرسمة إن عند <span dir='ltr'>x = 22, 23</span> البكسلين جنب بعض على نفس الارتفاع <span dir='ltr'>y = 12</span>، وعند <span dir='ltr'>x = 27, 28</span> البكسلين جنب بعض على نفس الارتفاع <span dir='ltr'>y = 16</span>.",
          "<b>ملاحظة مهمة على الرسمة في صفحة 30:</b> لاحظ إن عدد خطوات الجدول هو <span class='math-pill'>Δx = 10</span> خطوات (من <span class='math-pill'>k=0</span> لـ <span class='math-pill'>k=9</span>)، لكن عدد الدوائر السوداء المرسومة على الشبكة هو <b>11 بكسل</b> لأن نقطة البداية <span class='math-pill'>(20, 10)</span> اترسمت في الخطوة رقم 2 قبل بداية الجدول!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Including the starting point (20, 10), how many total pixels are plotted for the line from (20, 10) to (30, 18)?</div><div><strong>الإجابة النموذجية:</strong> 11 pixels in total (the initial point (20, 10) plus Δx = 10 points generated in the loop).</div>",
        "notebookEn": "Total Plotted Pixels Count: Total pixels = Δx + 1 (1 initial endpoint + Δx loop steps = 1 + 10 = 11 pixels).",
        "notebookAr": "إجمالي عدد البكسلات المرسومة للخط بيساوي (Δx + 1) لأننا بنعد نقطة البداية معاهم."
      }
    ],
    "lab": {
      "title": "",
      "subtitle": "",
      "steps": []
    },
    "summary": []
  },
  {
    "lessonId": "22222222-2222-4222-8222-222222222604",
    "courseCode": "CS-321",
    "chapterNum": 4,
    "titleEn": "Circle-Generating & Midpoint Algorithm",
    "titleAr": "خوارزمية Midpoint لرسم الدوائر",
    "subtitle": "معادلة الدائرة الديكارتية والقطبية، التماثل الثماني 8-Way Symmetry، واشتقاق وتطبيق خوارزمية Midpoint Circle.",
    "bonusComponentId": "cg-ch3-ch4-problems",
    "bonusDefaultTab": "ch4",
    "slides": [
      {
        "id": "cg4-s1",
        "slideRef": "Pages 1, 2 & 3",
        "shortLabel": "1. Circle-Generating Algori…",
        "title": "Circle-Generating Algorithm & Definition of a Circle",
        "enPoints": [
          "<strong>Circles</strong> are frequently used in pictures and graphs.",
          "A procedure for generating either <span class=\"cg-emph\">full circles</span> or <span class=\"cg-emph\">circular arcs</span> is included in most graphics packages.",
          "More generally, a single procedure can be provided to display either <strong>circular or elliptical curves</strong>.",
          "A <strong>circle</strong> is defined as the set of points that are all at <span class=\"cg-emph\">a given distance <em>r</em> from a center position (x<sub>c</sub>, y<sub>c</sub>)</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الدوائر <span class='en-term' dir='ltr'>Circles</span> بنستخدمها بكثرة جداً في الصور والرسوم البيانية.",
        "deepPoints": [
          "أغلب حزم الجرافيكس <span class='en-term' dir='ltr'>Graphics packages</span> بيكون فيها دالة جاهزة لتوليد إما <span class='hl-rose'>دوائر كاملة (Full circles)</span> أو <span class='hl-rose'>أقواس دائرية (Circular arcs)</span>، وبشكل أعم ممكن دالة واحدة ترسم المنحنيات الدائرية أو البيضاوية <span class='en-term' dir='ltr'>Circular or elliptical curves</span>.",
          "<strong>التعريف الهندسي للدائرة (موضع سؤال):</strong> هي مجموعة النقاط التي تقع جميعها على <span class='hl-yellow'>مسافة ثابتة ومحددة <em>r</em> (نصف القطر) من موقع المركز (x<sub>c</sub>, y<sub>c</sub>)</span>.",
          "<b>ليه أغلب برامج الجرافيكس بترسم الدائرة والقطع الناقص (Ellipse) بنفس الفكرة؟</b> لأن الدائرة هي حالة خاصة من الشكل البيضاوي تساوي فيها نصف القطر الأفقي مع الرأسي (<span class='math-pill'>r<sub>x</sub> = r<sub>y</sub> = r</span>).",
          "في الامتحان لو سألك عن تعريف الدائرة: لازم تذكر الركنين الأساسيين: <b>مسافة ثابتة <span class='math-pill'>r</span></b> + <b>نقطة مركز <span class='math-pill'>(x<sub>c</sub>, y<sub>c</sub>)</span></b>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How is a circle geometrically defined in computer graphics?</div><div><strong>الإجابة النموذجية:</strong> As the set of points that are all at a given distance r from a center position (xc, yc).</div>",
        "notebookEn": "Circle Procedures in Graphics Packages: Generate either full circles or circular arcs (or more generally, circular or elliptical curves).\nGeometric Definition of a Circle: The set of points that are all at a given distance r from a center position (xc, yc).",
        "notebookAr": "مكتبات الجرافيكس بتوفر دوال لرسم دوائر كاملة أو أقواس دائرية أو أشكال بيضاوية.\nتعريف الدائرة: كل النقاط اللي بتبعد مسافة ثابتة r عن نقطة المركز (xc, yc)."
      },
      {
        "id": "cg4-s2",
        "slideRef": "Pages 4 & 5",
        "shortLabel": "2. Pythagorean Theorem in",
        "title": "Pythagorean Theorem in Cartesian Coordinates",
        "enPoints": [
          "This distance relationship is expressed by the <strong>Pythagorean theorem</strong> in <strong>Cartesian coordinates</strong> as:",
          "<div class=\"cg-emph\">(x &minus; x<sub>c</sub>)<sup>2</sup> + (y &minus; y<sub>c</sub>)<sup>2</sup> = r<sup>2</sup></div>",
          "<strong>Figure (Page 5):</strong> Circle with center coordinates <strong>(x<sub>c</sub>, y<sub>c</sub>)</strong> and radius <strong>r</strong>."
        ],
        "svg": "<svg viewBox=\"0 0 380 230\" >\n                <rect x=\"10\" y=\"10\" width=\"360\" height=\"210\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <line x1=\"70\" y1=\"20\" x2=\"70\" y2=\"205\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <line x1=\"35\" y1=\"165\" x2=\"350\" y2=\"165\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <circle cx=\"215\" cy=\"110\" r=\"82\" fill=\"none\" stroke=\"#1e293b\" stroke-width=\"3\"/>\n                <circle cx=\"215\" cy=\"110\" r=\"4\" fill=\"#0f172a\"/>\n                <line x1=\"215\" y1=\"110\" x2=\"286\" y2=\"69\" stroke=\"#0f172a\" stroke-width=\"3\"/>\n                <line x1=\"63\" y1=\"110\" x2=\"77\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"215\" y1=\"158\" x2=\"215\" y2=\"172\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <text x=\"40\" y=\"114\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" fill=\"#0f172a\">y<tspan dy=\"4\" font-size=\"11\">c</tspan></text>\n                <text x=\"208\" y=\"190\" font-family=\"Inter\" font-size=\"14\" font-style=\"italic\" font-weight=\"bold\" fill=\"#0f172a\">x<tspan dy=\"4\" font-size=\"11\">c</tspan></text>\n                <text x=\"242\" y=\"82\" font-family=\"Inter\" font-size=\"15\" font-style=\"italic\" font-weight=\"bold\" fill=\"#e11d48\">r</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "علاقة المسافة الثابتة دي بنعبّر عنها رياضياً باستخدام <strong>نظرية فيثاغورس</strong> <span class='en-term' dir='ltr'>Pythagorean theorem</span> في الإحداثيات الديكارتية <span class='en-term' dir='ltr'>Cartesian coordinates</span> بالمعادلة الشهيرة:",
        "deepPoints": [
          "<div class='text-center my-2'><span class='math-pill text-base'>(x &minus; x<sub>c</sub>)<sup>2</sup> + (y &minus; y<sub>c</sub>)<sup>2</sup> = r<sup>2</sup></span></div>",
          "ولو الدائرة مركزها نقطة الأصل <span class='math-pill'>(0, 0)</span>، المعادلة بتتبسط وتبقى: <span class='math-pill'>x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></span>.",
          "<b>إزاي جت معادلة الدائرة من مثلث فيثاغورس؟</b> تخيل مثلث قائم الزاوية قاعدته الأفقية هي فرق السينات <span class='math-pill'>(x &minus; x<sub>c</sub>)</span>، وارتفاعه الرأسي هو فرق الصادات <span class='math-pill'>(y &minus; y<sub>c</sub>)</span>، والوتر بتاعه هو نصف القطر <span class='math-pill'>r</span>؛ بتطبيق فيثاغورس (مربع القاعدة + مربع الارتفاع = مربع الوتر) تطلع المعادلة فوراً!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Which theorem expresses the circle distance relationship in Cartesian coordinates, and what is the equation?</div><div><strong>الإجابة النموذجية:</strong> The Pythagorean theorem: (x - xc)^2 + (y - yc)^2 = r^2.</div>",
        "notebookEn": "Cartesian Circle Equation (Pythagorean Theorem): (x - xc)^2 + (y - yc)^2 = r^2, where (xc, yc) is the center and r is the radius.",
        "notebookAr": "معادلة الدائرة في الإحداثيات الديكارتية مستنتجة من نظرية فيثاغورس."
      },
      {
        "id": "cg4-s3",
        "slideRef": "Page 6",
        "shortLabel": "3. Stepping Along X-Axis",
        "title": "Stepping Along X-Axis Using Cartesian Equation (1)",
        "enPoints": [
          "We could use this equation to calculate the position of points on a circle circumference by stepping along the x axis in unit steps from <span class=\"cg-emph\">x<sub>c</sub> &minus; r</span> to <span class=\"cg-emph\">x<sub>c</sub> + r</span> and calculating the corresponding y values at each position as:",
          "<div class=\"cg-emph\">y = y<sub>c</sub> &plusmn; &radic;( r<sup>2</sup> &minus; (x<sub>c</sub> &minus; x)<sup>2</sup> ) &nbsp;&nbsp;&nbsp; (1)</div>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أول طريقة بدائية لرسم الدائرة هي إننا نمشي على محور <span dir='ltr'>x</span> خطوة بخطوة (بمقدار 1 بكسل) من أقصى شمال الدائرة <span class='hl-rose' dir='ltr'>x<sub>c</sub> &minus; r</span> لحد أقصى يمين الدائرة <span class='hl-rose' dir='ltr'>x<sub>c</sub> + r</span>.",
        "deepPoints": [
          "وعند كل قيمة لـ <span dir='ltr'>x</span>، نحسب قيمتي <span dir='ltr'>y</span> (النصف العلوي <span dir='ltr'>+</span> والنصف السفلي <span dir='ltr'>&minus;</span>) من المعادلة رقم (1):",
          "<div class='text-center my-2'><span class='math-pill'>y = y<sub>c</sub> &plusmn; &radic;( r<sup>2</sup> &minus; (x<sub>c</sub> &minus; x)<sup>2</sup> )</span></div>",
          "<b>مثال بالأرقام على المعادلة الديكارتية (1):</b> لو دائرة مركزها <span class='math-pill'>(0, 0)</span> ونصف قطرها <span class='math-pill'>r = 10</span>، عند <span class='math-pill'>x = 6</span> بنعوّض: <span class='math-pill'>y = &plusmn;&radic;(100 &minus; 36) = &plusmn;&radic;64 = &plusmn;8</span>.",
          "لاحظ إن إشارة <span class='math-pill'>&plusmn;</span> بتطلع نقطتين في كل خطوة: واحدة فوق المركز <span class='math-pill'>y<sub>c</sub> + &radic;...</span> وواحدة تحت المركز <span class='math-pill'>y<sub>c</sub> &minus; &radic;...</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: When using the direct Cartesian equation y = yc ± sqrt(r^2 - (xc - x)^2), over what range of x values do we step?</div><div><strong>الإجابة النموذجية:</strong> In unit steps along the x axis from xc - r to xc + r.</div>",
        "notebookEn": "Direct Cartesian Circle Method (Equation 1): Step along x in unit steps from (xc - r) to (xc + r) and compute y = yc ± sqrt(r^2 - (xc - x)^2).",
        "notebookAr": "الطريقة المباشرة بتمشي على محور x من xc-r لحد xc+r وتحسب y بالجذر التربيعي."
      },
      {
        "id": "cg4-s4",
        "slideRef": "Page 7",
        "shortLabel": "4. Two Major Problems",
        "title": "Two Major Problems with the Cartesian Square-Root Method",
        "enPoints": [
          "But this is <strong>not the best method</strong> for generating a circle.",
          "<strong>Problem 1:</strong> It involves <strong>considerable computation at each step</strong> (multiplications and square roots).",
          "<strong>Problem 2:</strong> Moreover, the <strong>spacing between plotted pixel positions is not uniform</strong>.",
          "We could adjust the spacing by <strong>interchanging x and y</strong> whenever the absolute value of the slope of the circle is greater than 1, but this simply <strong>increases the computation and processing</strong> required by the algorithm."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "<strong>ليه معادلة الجذر التربيعي (1) طريقة سيئة لرسم الدائرة؟ (سؤال امتحانات مشهور جداً!):</strong>",
        "deepPoints": [
          "1️⃣ <strong>العيب الأول (حسابات ثقيلة جداً):</strong> بتحتاج حسابات كبيرة في كل خطوة <span class='hl-rose'>Considerable computation at each step</span> بسبب عمليات التربيع والجذر التربيعي.",
          "2️⃣ <strong>العيب الثاني (المسافات بين البكسلات غير منتظمة):</strong> التباعد بين البكسلات المرسومة غير متساوٍ <span class='hl-yellow'>Spacing between plotted pixel positions is not uniform</span> — عند قمة الدائرة البكسلات بتكون جنب بعض، ولما نقرب من الأطراف (<span dir='ltr'>x<sub>c</sub> &plusmn; r</span>) الميل بيزيد جداً فالبكسلات بتبعد عن بعض وتعمل فجوات!",
          "3️⃣ <strong>محاولة علاج التباعد:</strong> ممكن نبدّل دور <span dir='ltr'>x</span> و <span dir='ltr'>y</span> لما القيمة المطلقة لميل الدائرة تكون أكبر من 1 (<span dir='ltr'>|slope| &gt; 1</span>)، لكن ده بيزود الحسابات والمعالجة أكتر!",
          "<b>ليه المسافات بين البكسلات بتطلع غير منتظمة (Non-uniform spacing) في المعادلة الديكارتية؟</b><br>بص على الفرق بين <span class='math-pill'>x = 0 &rarr; 1</span> وبين <span class='math-pill'>x = 9 &rarr; 10</span> في دائرة نصف قطرها 10:<br>• عند <span class='math-pill'>x = 0</span>: <span class='math-pill'>y = 10</span>، وعند <span class='math-pill'>x = 1</span>: <span class='math-pill'>y = &radic;99 &approx; 9.95</span> (الـ y اتغيرت بـ 0.05 بس!).<br>• أما عند <span class='math-pill'>x = 9</span>: <span class='math-pill'>y = &radic;19 &approx; 4.36</span>، وعند <span class='math-pill'>x = 10</span>: <span class='math-pill'>y = 0</span> (الـ y نطت أكتر من 4 بكسلات مرة واحدة فعملت فجوة كبيرة في الجنب!)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What are the two main drawbacks of generating a circle directly with y = yc ± sqrt(r^2 - (xc - x)^2)?</div><div><strong>الإجابة النموذجية:</strong> 1. It involves considerable computation (multiplications and square roots) at each step. 2. The spacing between plotted pixel positions is not uniform.</div>",
        "notebookEn": "Drawbacks of Cartesian Circle Equation (1): 1. Considerable computation at each step (square roots & multiplications) | 2. Spacing between plotted pixels is NOT uniform.\nInterchanging x and y Fix: Interchanging x and y when |slope| > 1 adjusts spacing, but increases computation and processing.",
        "notebookAr": "عيوب معادلة الجذر التربيعي: (1) حسابات ثقيلة في كل خطوة، (2) المسافات بين البكسلات غير منتظمة.\nتبديل x و y لما ميل الدائرة يعدي 1 بيظبط المسافات بس بيزود وقت الحسابات أكتر."
      },
      {
        "id": "cg4-s5",
        "slideRef": "Pages 8 & 9",
        "shortLabel": "5. Parametric Polar Coordin…",
        "title": "Parametric Polar Coordinates (Equation 2) & Step Size 1/r",
        "enPoints": [
          "Another way to <strong>eliminate the unequal spacing</strong> is to calculate points along the circular boundary using <strong>polar coordinates <em>r</em> and <em>&theta;</em></strong>:",
          "<div class=\"cg-emph\">x = x<sub>c</sub> + r cos &theta;, &nbsp;&nbsp; y = y<sub>c</sub> + r sin &theta; &nbsp;&nbsp; (2)</div>",
          "Using a <strong>fixed angular step size</strong> plots a circle with <strong>equally spaced points</strong> along the circumference.",
          "Larger angular separations can be connected with <strong>straight line segments</strong> to approximate the circular path.",
          "For a more continuous boundary on a raster display, we can set the <strong>step size at <span class=\"cg-emph\">1 / r</span></strong> (which plots pixel positions that are approximately <strong>one unit apart</strong>)."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "عشان نقضي على مشكلة المسافات غير المنتظمة <span class='en-term' dir='ltr'>Eliminate unequal spacing</span>، بنستخدم الإحداثيات القطبية <span class='hl-cyan'>Polar coordinates (r and &theta;)</span> في المعادلة (2):",
        "deepPoints": [
          "<div class='text-center my-1.5'><span class='math-pill'>x = x<sub>c</sub> + r cos &theta;</span> &nbsp; , &nbsp; <span class='math-pill'>y = y<sub>c</sub> + r sin &theta;</span></div>",
          "• لما بنمشي بخطوة زاوية ثابتة <span class='en-term' dir='ltr'>Fixed angular step size</span>، النقاط بتطلع <strong>متساوية المسافات (Equally spaced points)</strong> على طول المحيط.",
          "• لو اخترنا زوايا كبيرة، بنوصل النقاط بـ <strong>قطع مستقيمة (Straight line segments)</strong> لتقريب شكل الدائرة.",
          "• <strong>معلومة امتحانات مهمة جداً:</strong> عشان نحصل على محيط متصل وناعم على شاشة الـ Raster، بنضبط حجم الخطوة الزاوية عند <span class='hl-rose' dir='ltr'>Step size = 1 / r</span>، وده بيخلي المسافة بين كل بكسل والتاني حوالي <strong>وحدة واحدة (One unit apart)</strong>!",
          "<b>ليه الخطوة الزاوية المثالية في الطريقة القطبية بتساوي <span class='math-pill'>1 / r</span>؟</b><br>من قوانين الهندسة، طول القوس <span class='math-pill'>S = r &middot; &Delta;&theta;</span>. إحنا عايزين المسافة القوسية بين كل بكسل والتاني تساوي <b>1 بكسل</b> (<span class='math-pill'>S = 1</span>)، فبنحط <span class='math-pill'>r &middot; &Delta;&theta; = 1</span> ومنها <span class='math-pill'>&Delta;&theta; = 1 / r</span> (بالتقدير الدائري Radians)!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In parametric polar circle generation, what angular step size for θ produces a continuous boundary with pixel positions approximately one unit apart?</div><div><strong>الإجابة النموذجية:</strong> Setting the angular step size at 1 / r.</div>",
        "notebookEn": "Parametric Polar Circle Equations (2): x = xc + r cos(θ), y = yc + r sin(θ) -> eliminates unequal spacing using a fixed angular step size.\nOptimal Polar Step Size (1 / r): Setting angular step size at 1/r plots pixel positions approximately one unit apart for a continuous boundary.",
        "notebookAr": "المعادلات القطبية بتحل مشكلة التباعد غير المنتظم وبتطلع نقاط على مسافات متساوية.\nاختيار خطوة الزاوية بـ (1/r) بيخلي البكسلات تبعد عن بعض بمقدار 1 بكسل تقريباً."
      },
      {
        "id": "cg4-s6",
        "slideRef": "Pages 10, 11 & 12",
        "shortLabel": "6. Reducing Computation Using",
        "title": "Reducing Computation Using Quadrant & Octant Symmetry",
        "enPoints": [
          "Computation can be reduced by considering the <span class=\"cg-emph\">symmetry of circles</span>: <span class=\"cg-emph\">the shape of the circle is similar in each quadrant</span>.",
          "We can generate the circle section in the <strong>second quadrant</strong> by noting that the two circle sections are <u>symmetric with respect to the y axis</u>.",
          "Circle sections in the <strong>third and fourth quadrants</strong> can be obtained from sections in the first and second quadrants by considering <strong>symmetry about the x axis</strong>.",
          "We can take this one step further and note that there is also <strong>symmetry between octants</strong>: circle sections in adjacent octants within one quadrant are symmetric with respect to the <strong>45&deg; line</strong> dividing the <span class=\"cg-emph\">two octants</span>."
        ],
        "svg": "<svg viewBox=\"0 0 360 230\" >\n                <rect x=\"10\" y=\"10\" width=\"340\" height=\"210\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"180\" y1=\"20\" x2=\"180\" y2=\"210\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"40\" y1=\"115\" x2=\"320\" y2=\"115\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <circle cx=\"180\" cy=\"115\" r=\"78\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <circle cx=\"180\" cy=\"37\" r=\"4.5\" fill=\"#4f46e5\"/>\n                <circle cx=\"180\" cy=\"193\" r=\"4.5\" fill=\"#4f46e5\"/>\n                <circle cx=\"102\" cy=\"115\" r=\"4.5\" fill=\"#4f46e5\"/>\n                <circle cx=\"258\" cy=\"115\" r=\"4.5\" fill=\"#4f46e5\"/>\n                <text x=\"205\" y=\"75\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#4f46e5\">Quad I</text>\n                <text x=\"118\" y=\"75\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#059669\">Quad II</text>\n                <text x=\"115\" y=\"160\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#d97706\">Quad III</text>\n                <text x=\"202\" y=\"160\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#e11d48\">Quad IV</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "إزاي نقلل كمية الحسابات لثُمن (1/8) الوقت؟ باستغلال خاصية <strong>تماثل الدائرة (Symmetry of circles)</strong>:",
        "deepPoints": [
          "1️⃣ <strong>التماثل بين الأرباع الأربعة (Quadrants):</strong>",
          "• <strong>الربع الثاني مع الربع الأول:</strong> متماثلان حول <strong>محور الصادات (Symmetric with respect to the y-axis)</strong>.",
          "• <strong>الربع الثالث والرابع مع الأول والثاني:</strong> متماثلان حول <strong>محور السينات (Symmetry about the x-axis)</strong>.",
          "2️⃣ <strong>التماثل بين الأثمان الثمانية (Octants):</strong>",
          "• كل ربع مقسوم لنصفين (ثُمنين) بخط زاويته <span class='hl-yellow'>45&deg; line (خط x = y)</span>، والثُمنان المتجاوران داخل نفس الربع متماثلان تماماً حول خط الـ <span dir='ltr'>45&deg;</span>!",
          "<b>قاعدة الإشارات في التماثل الرباعي والثماني:</b><br>• الانعكاس حول <b>محور الصادات (y-axis)</b>: بيعكس إشارة <span class='math-pill'>x</span> فقط <span class='math-pill'>(x, y) &rarr; (&minus;x, y)</span>.<br>• الانعكاس حول <b>محور السينات (x-axis)</b>: بيعكس إشارة <span class='math-pill'>y</span> فقط <span class='math-pill'>(x, y) &rarr; (x, &minus;y)</span>.<br>• الانعكاس حول <b>خط الـ 45 درجة (<span class='math-pill'>x = y</span>)</b>: بيبدّل مكان الرقمين <span class='math-pill'>(x, y) &rarr; (y, x)</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: With respect to which line are circle sections in adjacent octants within one quadrant symmetric?</div><div><strong>الإجابة النموذجية:</strong> With respect to the 45° line (the line x = y) dividing the two octants.</div>",
        "notebookEn": "Quadrant Symmetry (4-Way): Quad I & II are symmetric across the y-axis; Quad III & IV are obtained from Quad I & II by symmetry across the x-axis.\nOctant Symmetry (8-Way): Adjacent octants within one quadrant are symmetric with respect to the 45° line dividing the two octants.",
        "notebookAr": "الربع الأول والثاني متماثلان حول محور y، والثالث والرابع متماثلان معهما حول محور x.\nالثُمنان المتجاوران في نفس الربع متماثلان حول خط الـ 45 درجة."
      },
      {
        "id": "cg4-s7",
        "slideRef": "Pages 13, 14 & 15",
        "shortLabel": "7. Mapping One Point",
        "title": "Mapping One Point (x, y) into 7 Other Octants (x = 0 to x = y)",
        "enPoints": [
          "The point at position <strong>(x, y)</strong> on a <strong>one-eighth circle sector</strong> is mapped into the <strong>seven circle points</strong> in the other octants of the <em>xy</em> plane.",
          "Taking advantage of the circle symmetry in this way, we can generate all pixel positions around a circle by calculating only the points within the sector from:",
          "<div class=\"cg-emph\">x = 0 &nbsp;&nbsp; to &nbsp;&nbsp; x = y</div>"
        ],
        "svg": "<svg viewBox=\"0 0 420 265\" >\n                <rect x=\"10\" y=\"10\" width=\"400\" height=\"245\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <!-- Shaded first octant from x=0 to x=y -->\n                <path d=\"M 210 132 L 210 46 A 86 86 0 0 1 271 71 Z\" fill=\"#e0e7ff\" stroke=\"none\"/>\n                <line x1=\"210\" y1=\"22\" x2=\"210\" y2=\"242\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"65\" y1=\"132\" x2=\"355\" y2=\"132\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"210\" y1=\"132\" x2=\"271\" y2=\"71\" stroke=\"#0f766e\" stroke-width=\"2\" stroke-dasharray=\"4,3\"/>\n                <circle cx=\"210\" cy=\"132\" r=\"86\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"3\"/>\n                <!-- 8 Octant Points -->\n                <circle cx=\"243\" cy=\"53\" r=\"5\" fill=\"#be123c\"/><text x=\"248\" y=\"46\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(x, y)</text>\n                <circle cx=\"289\" cy=\"99\" r=\"5\" fill=\"#be123c\"/><text x=\"298\" y=\"103\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(y, x)</text>\n                <circle cx=\"177\" cy=\"53\" r=\"5\" fill=\"#be123c\"/><text x=\"122\" y=\"46\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(&minus;x, y)</text>\n                <circle cx=\"131\" cy=\"99\" r=\"5\" fill=\"#be123c\"/><text x=\"72\" y=\"103\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(&minus;y, x)</text>\n                <circle cx=\"131\" cy=\"165\" r=\"5\" fill=\"#be123c\"/><text x=\"64\" y=\"172\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(&minus;y, &minus;x)</text>\n                <circle cx=\"177\" cy=\"211\" r=\"5\" fill=\"#be123c\"/><text x=\"114\" y=\"232\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(&minus;x, &minus;y)</text>\n                <circle cx=\"243\" cy=\"211\" r=\"5\" fill=\"#be123c\"/><text x=\"242\" y=\"232\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(x, &minus;y)</text>\n                <circle cx=\"289\" cy=\"165\" r=\"5\" fill=\"#be123c\"/><text x=\"298\" y=\"172\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">(y, &minus;x)</text>\n                <text x=\"234\" y=\"122\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f766e\">45&deg;</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بفضل التماثل الثماني، أي نقطة <span class='math-pill'>(x, y)</span> نحسبها في ثُمن واحد من الدائرة <span class='en-term' dir='ltr'>One-eighth circle sector</span> بنقدر نستنتج منها فوراً <strong>الـ 7 نقاط التانية</strong> في باقي الأثمان السبعة بمجرد تبديل الإشارات وتبديل <span dir='ltr'>x</span> مع <span dir='ltr'>y</span>:",
        "deepPoints": [
          "<div class='text-center my-1.5'><span class='math-pill'>(x, y), (y, x), (&minus;x, y), (&minus;y, x), (&minus;x, &minus;y), (&minus;y, &minus;x), (x, &minus;y), (y, &minus;x)</span></div>",
          "عشان كده إحنا بنحسب النقاط فقط في القطاع (الثُمن الأول) اللي بيبدأ من <span class='hl-rose' dir='ltr'>x = 0 to x = y</span>!",
          "<b>إزاي تطلع الـ 8 نقاط المتماثلة لأي نقطة بدون حفظ؟</b><br>خد النقطة الأصلية <span class='math-pill'>(x, y)</span> وبدّل الرقمين تبقى <span class='math-pill'>(y, x)</span>. كده معاك نقطتين في الربع الأول!<br>حط لكل واحدة فيهم الـ 4 إشارات الممكنة: <span class='math-pill'>(+, +), (&minus;, +), (&minus;, &minus;), (+, &minus;)</span> يطلع معاك الـ 8 نقاط في ثانية واحدة!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: By taking advantage of 8-way octant symmetry, over what sector do we need to calculate circle points, and how many other octant points does each (x, y) map into?</div><div><strong>الإجابة النموذجية:</strong> We calculate only the points within the sector from x = 0 to x = y, and each point (x, y) is mapped into 7 circle points in the other octants.</div>",
        "notebookEn": "8-Way Octant Mapping & Calculation Sector: Calculate points only in the one-eighth sector from x = 0 to x = y; map each (x, y) into 7 points: (y,x), (-x,y), (-y,x), (-x,-y), (-y,-x), (x,-y), (y,-x).",
        "notebookAr": "بنحسب بس من x = 0 لحد x = y، وكل نقطة بتطلع لنا 7 نقاط تانية بالتماثل."
      },
      {
        "id": "cg4-s8",
        "slideRef": "Page 16",
        "shortLabel": "8. Why Forms and",
        "title": "Why Forms (1) and (2) Are Still Slow vs. Incremental Integer Operations",
        "enPoints": [
          "Determining pixel positions along a circle circumference using either forms <strong>(1)</strong> and <strong>(2)</strong> still requires a <strong>good deal of computation time</strong>.",
          "The <strong>Cartesian form (1)</strong> involves <strong>multiplications and square root calculations</strong>, while the <strong>parametric form (2)</strong> contains <strong>multiplications and trigonometric calculations</strong>.",
          "More efficient circle algorithms are based on <span class=\"cg-emph\">incremental calculation of decision parameters</span>, as in the Bresenham's line drawing algorithm, which involves <strong>only simple integer operations</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "حتى بعد استخدام التماثل الثماني، المعادلة (1) والمعادلة (2) لسه بياخدوا وقت حسابات طويل:",
        "deepPoints": [
          "• <strong>الصيغة الديكارتية (1):</strong> فيها ضرب وحساب جذور تربيعية <span class='hl-rose'>Multiplications and square root calculations</span>.",
          "• <strong>الصيغة البارامترية القطبية (2):</strong> فيها ضرب وحساب دوال مثلثية <span class='hl-yellow'>Multiplications and trigonometric calculations</span>.",
          "• <strong>الحل الأسرع والأكفأ:</strong> خوارزميات الدائرة المبنية على <span class='hl-emerald'>الحساب التزايدي لمعاملات القرار (Incremental calculation of decision parameters)</span> زي خوارزمية Bresenham للخط، واللي بتحتاج <strong>عمليات أعداد صحيحة بسيطة فقط (Only simple integer operations)</strong>!",
          "<b>مقارنة العمليات الحسابية في الـ Loop (سؤال امتحانات متكرر):</b><br>• المعادلة (1) الديكارتية: طرح + تربيع + <b>جذر تربيعي (Square root)</b>.<br>• المعادلة (2) القطبية: ضرب + <b>دوال مثلثية (sin / cos)</b>.<br>• خوارزمية Bresenham / Midpoint: <b>جمع وطرح أعداد صحيحة فقط (Simple integer additions/subtractions)</b>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Why do Cartesian form (1) and parametric polar form (2) still require a good deal of computation time compared to Bresenham's approach?</div><div><strong>الإجابة النموذجية:</strong> Form (1) involves multiplications and square roots, while Form (2) involves multiplications and trigonometric calculations; Bresenham's approach uses incremental decision parameters with only simple integer operations.</div>",
        "notebookEn": "Computation Bottlenecks in Eq (1) & Eq (2) vs. Incremental Method: Cartesian (1) needs multiplications + square roots | Polar (2) needs multiplications + trig functions | Bresenham uses incremental decision parameters with simple integer operations.",
        "notebookAr": "الطريقة الديكارتية بطيئة بسبب الجذور، والقطبية بطيئة بسبب sin/cos، أما Bresenham فبتستخدم جمع وطرح أعداد صحيحة بس."
      },
      {
        "id": "cg4-s9",
        "slideRef": "Page 17",
        "shortLabel": "9. Adapting Bresenham to",
        "title": "Adapting Bresenham to Circles Without Square Roots",
        "enPoints": [
          "Bresenham's line drawing algorithm for raster displays <span class=\"cg-emph\">is adapted</span> to circle generation by setting up <strong>decision parameters</strong> for finding the <strong>closest pixel to the circumference</strong> at each sampling step.",
          "The circle equation (1), however, is <strong>nonlinear</strong>, so that square-root evaluations would be required to compute pixel distances from a circular path.",
          "<strong>Bresenham's circle drawing algorithm avoids these square-root calculations by comparing the squares of the pixel separation distances.</strong>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "خوارزمية Bresenham لرسم الخطوط تم تكييفها <span class='en-term' dir='ltr'>is adapted</span> لرسم الدوائر عن طريق إعداد <strong>معاملات قرار (Decision parameters)</strong> لاختيار البكسل الأقرب لمحيط الدائرة عند كل خطوة.",
        "deepPoints": [
          "لكن معادلة الدائرة <strong>غير خطية (Nonlinear)</strong>، فحساب المسافة المباشرة عن المحيط هيحتاج جذر تربيعي.",
          "<strong>إزاي خوارزمية Bresenham للدائرة هربت من الجذر التربيعي؟ (موضع سؤال مهم جداً):</strong> عن طريق <span class='hl-emerald'>مقارنة مربعات مسافات فصل البكسلات (Comparing the squares of the pixel separation distances)</span> بدل المسافات نفسها!",
          "<b>يعني إيه مقارنة مربعات المسافات (Comparing squares of distances)؟</b><br>بدل ما نحسب المسافة بالجذر <span class='math-pill'>d = &radic;(x<sup>2</sup> + y<sup>2</sup>) &minus; r</span>، بنربع الطرفين ونقارن <span class='math-pill'>x<sup>2</sup> + y<sup>2</sup></span> مع <span class='math-pill'>r<sup>2</sup></span> مباشرة بدون أي جذور!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How does Bresenham's circle drawing algorithm avoid square-root calculations caused by the nonlinear circle equation?</div><div><strong>الإجابة النموذجية:</strong> By comparing the squares of the pixel separation distances.</div>",
        "notebookEn": "How Bresenham Avoids Square Roots in Circles: Although the circle equation is nonlinear, Bresenham avoids square-root calculations by comparing the squares of the pixel separation distances.",
        "notebookAr": "خوارزمية Bresenham للدائرة بتتخلص من الجذر التربيعي عن طريق مقارنة مربعات المسافات بدل المسافات نفسها."
      },
      {
        "id": "cg4-s10",
        "slideRef": "Page 18",
        "shortLabel": "10. Bresenham's Circle Algor…",
        "title": "Bresenham's Circle Algorithm: Origin Setup (0, 0)",
        "enPoints": [
          "<strong>Bresenham's algorithm</strong> is an <strong>accurate and efficient raster circle-generating algorithm</strong>.",
          "As in the raster line algorithm, we <strong>sample at unit intervals</strong> and determine the <strong>closest pixel position</strong> to the specified circle path at each step.",
          "For a given radius <strong>r</strong> and screen center position <strong>(x<sub>c</sub>, y<sub>c</sub>)</strong>, we can first set up our algorithm to calculate pixel positions around a circle path <strong>centered at the coordinate origin (0, 0)</strong>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "خوارزمية Bresenham للدائرة هي خوارزمية <span class='hl-emerald'>دقيقة وفعالة (Accurate and efficient)</span> لتوليد الدوائر على شاشات الـ Raster.",
        "deepPoints": [
          "بنأخذ عينات على فترات وحدة واحدة <span class='en-term' dir='ltr'>Sample at unit intervals</span> ونحدد البكسل الأقرب لمسار الدائرة في كل خطوة.",
          "<strong>فكرة التبسيط الذكية:</strong> لأي نصف قطر <span dir='ltr'>r</span> وأي مركز شاشة <span dir='ltr'>(x<sub>c</sub>, y<sub>c</sub>)</span>، بنحسب الأول مواقع البكسلات حول دائرة <strong>مركزها نقطة الأصل <span class='hl-yellow' dir='ltr'>(0, 0)</span></strong>، وبعدين ننقل كل نقطة للمركز الحقيقي!",
          "<b>ليه بنفرّق بين حساب الدائرة عند <span class='math-pill'>(0, 0)</span> ورسمها عند <span class='math-pill'>(x<sub>c</sub>, y<sub>c</sub>)</span>؟</b><br>لأن قوانين التماثل الثماني البسيطة <span class='math-pill'>(&plusmn;x, &plusmn;y)</span> و <span class='math-pill'>(&plusmn;y, &plusmn;x)</span> مبتشتغلش بالشكل المباشر ده إلا لما يكون المركز هو <span class='math-pill'>(0, 0)</span>؛ فبنطلع الـ 8 نقاط عند <span class='math-pill'>(0, 0)</span> الأول، وبعدين نجمع <span class='math-pill'>(x<sub>c</sub>, y<sub>c</sub>)</span> على كل نقطة وقت التلوين!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: For a circle with radius r and center (xc, yc), where do we first center the circle path when setting up Bresenham's circle algorithm?</div><div><strong>الإجابة النموذجية:</strong> At the coordinate origin (0, 0), and then shift each calculated position to (xc, yc).</div>",
        "notebookEn": "Origin-Centered Setup Strategy: First calculate pixel positions around a circle centered at the coordinate origin (0, 0), then translate to (xc, yc).",
        "notebookAr": "بنحسب نقاط الدائرة الأول كأن مركزها (0,0) للتسهيل، وبعدين نضيف إحداثيات المركز (xc, yc)."
      },
      {
        "id": "cg4-s11",
        "slideRef": "Pages 19 & 20",
        "shortLabel": "11. Slope in the",
        "title": "Slope in the First Octant (0 to −1) & Midpoint Test",
        "enPoints": [
          "Then each calculated position <strong>(x, y)</strong> is moved to its proper screen position by adding <strong>x<sub>c</sub> to x</strong> and <strong>y<sub>c</sub> to y</strong> (written on slide 19 as <span dir='ltr'>x<sub>c</sub> to y</span>, and explicitly given on slide 23 as <span dir='ltr'>x = x + x<sub>c</sub>, y = y + y<sub>c</sub></span>).",
          "Along the circle section from <strong>x = 0 to x = y</strong> in the first quadrant, the <strong>slope of the curve varies from 0 to &minus;1</strong>.",
          "Therefore, we can take <strong>unit steps in the positive x direction</strong> over this octant and use a <strong>decision parameter</strong> to determine which of the <strong>two possible y positions</strong> (<span dir='ltr'>y<sub>k</sub></span> or <span dir='ltr'>y<sub>k</sub> &minus; 1</span>) is closer to the circle path at each step."
        ],
        "svg": "<svg viewBox=\"0 0 400 245\" >\n                <rect x=\"10\" y=\"10\" width=\"380\" height=\"225\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <g stroke=\"#64748b\" stroke-width=\"1.8\">\n                    <line x1=\"120\" y1=\"30\" x2=\"120\" y2=\"195\"/><line x1=\"205\" y1=\"30\" x2=\"205\" y2=\"195\"/><line x1=\"290\" y1=\"30\" x2=\"290\" y2=\"195\"/>\n                    <line x1=\"80\" y1=\"65\" x2=\"345\" y2=\"65\"/><line x1=\"80\" y1=\"125\" x2=\"345\" y2=\"125\"/><line x1=\"80\" y1=\"185\" x2=\"345\" y2=\"185\"/>\n                </g>\n                <!-- Plotted pixel at (xk, yk) -->\n                <circle cx=\"120\" cy=\"65\" r=\"24\" fill=\"#1e293b\"/>\n                <!-- Candidate pixels at xk+1 -->\n                <circle cx=\"205\" cy=\"65\" r=\"6\" fill=\"#059669\"/>\n                <circle cx=\"205\" cy=\"125\" r=\"6\" fill=\"#e11d48\"/>\n                <!-- Midpoint at (xk+1, yk - 1/2) -->\n                <circle cx=\"205\" cy=\"95\" r=\"5\" fill=\"#4f46e5\"/>\n                <line x1=\"185\" y1=\"115\" x2=\"201\" y2=\"99\" stroke=\"#4f46e5\" stroke-width=\"2\"/>\n                <text x=\"135\" y=\"132\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#4f46e5\">Midpoint</text>\n                <!-- Circle arc x^2 + y^2 - r^2 = 0 -->\n                <path d=\"M 90 52 Q 210 75 315 190\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"3\"/>\n                <text x=\"225\" y=\"55\" font-family=\"Inter\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">x² + y² &minus; r² = 0</text>\n                <text x=\"52\" y=\"70\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">y<tspan dy=\"4\" font-size=\"11\">k</tspan></text>\n                <text x=\"32\" y=\"130\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">y<tspan dy=\"4\" font-size=\"11\">k</tspan><tspan dy=\"-4\"> &minus; 1</tspan></text>\n                <text x=\"112\" y=\"215\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">x<tspan dy=\"4\" font-size=\"11\">k</tspan></text>\n                <text x=\"188\" y=\"215\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">x<tspan dy=\"4\" font-size=\"11\">k</tspan><tspan dy=\"-4\"> + 1</tspan></text>\n                <text x=\"273\" y=\"215\" font-family=\"Inter\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">x<tspan dy=\"4\" font-size=\"11\">k</tspan><tspan dy=\"-4\"> + 2</tspan></text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "بعد حساب النقطة <span dir='ltr'>(x, y)</span> حول نقطة الأصل، بننقلها لمكانها الصحيح على الشاشة بجمع <span class='math-pill'>x = x + x<sub>c</sub></span> و <span class='math-pill'>y = y + y<sub>c</sub></span>.",
        "deepPoints": [
          "<strong>ركز في المعلومة دي للامتحان:</strong> على طول قوس الدائرة في الثُمن الأول (من <span dir='ltr'>x = 0</span> عند القمة <span dir='ltr'>(0, r)</span> لحد <span dir='ltr'>x = y</span>)، <strong>ميل المنحنى بيتدرج من <span class='hl-rose' dir='ltr'>0 to &minus;1</span></strong>.",
          "وطالما القيمة المطلقة للميل أقل من أو تساوي 1، بنمشي <strong>خطوات وحدة في اتجاه x الموجب (Unit steps in positive x direction)</strong>، ونستخدم معامل القرار عشان نختار بين البكسلين المرشحين: إما <span class='hl-emerald' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub>)</span> أو <span class='hl-rose' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub> &minus; 1)</span> (لاحظ إن <span dir='ltr'>y</span> هنا إما تثبت أو <strong>تنقص 1</strong> لأن القوس نازل لتحت!).",
          "<b>ملاحظة مهمة على سلايد 19:</b> مكتوب في السلايد <i>adding x<sub>c</sub> to x and x<sub>c</sub> to y</i> ودي غلطة مطبعية بسيطة في السلايد، والصح طبعاً هو <b>adding x<sub>c</sub> to x and y<sub>c</sub> to y</b> زي ما مكتوب بوضوح في سلايد 23: <span class='math-pill'>x = x + x<sub>c</sub> , y = y + y<sub>c</sub></span>.",
          "<b>ليه الميل في الثُمن الأول بيتراوح من 0 إلى &minus;1؟</b> لأن مشتقة معادلة الدائرة <span class='math-pill'>x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></span> هي <span class='math-pill'>dy/dx = &minus;x / y</span>؛ عند <span class='math-pill'>x = 0</span> يكون الميل <span class='math-pill'>0</span>، وعند <span class='math-pill'>x = y</span> يكون الميل <span class='math-pill'>&minus;1</span>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: Along the circle section from x = 0 to x = y in the first quadrant, how does the slope of the curve vary, and in which direction do we take unit steps?</div><div><strong>الإجابة النموذجية:</strong> The slope varies from 0 to -1, so we take unit steps in the positive x direction.</div>",
        "notebookEn": "First Octant Slope & Sampling Direction: From x = 0 to x = y in the 1st quadrant, the slope varies from 0 to -1; take unit steps in positive x and choose between y_k and y_k - 1.",
        "notebookAr": "في الثُمن الأول من x=0 لحد x=y ميل القوس بيتغير من 0 لـ -1، فبنمشي خطوة +1 في x ونختار بين y_k أو y_k - 1."
      },
      {
        "id": "cg4-s12",
        "slideRef": "Page 21",
        "shortLabel": "12. Algorithm Steps 1",
        "title": "Algorithm Steps 1 & 2: First Point (0, r) and Initial Parameter p₀",
        "enPoints": [
          "<strong>1.</strong> Input the radius <span class=\"cg-emph\">r</span> and circle center <strong>(x<sub>c</sub>, y<sub>c</sub>)</strong> and obtain the <strong>first point</strong> on the circumference of a circle centered on the origin as:",
          "<div class=\"cg-emph\">(x<sub>0</sub>, y<sub>0</sub>) = (0, r)</div>",
          "<strong>2.</strong> Calculate the <strong>initial value of the decision parameter</strong> as:",
          "<div class=\"cg-emph\">p<sub>0</sub> = 5/4 &minus; r &nbsp;&nbsp; (or &nbsp; p<sub>0</sub> = 1 &minus; r &nbsp; for integer r)</div>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "أول خطوتين رسميتين في خوارزمية رسم الدائرة (Midpoint Circle Algorithm):",
        "deepPoints": [
          "1️⃣ ندخل نصف القطر <span dir='ltr'>r</span> ومركز الدائرة <span dir='ltr'>(x<sub>c</sub>, y<sub>c</sub>)</span>، ونحدد أول نقطة على محيط الدائرة المتمركزة عند نقطة الأصل وهي قمة الدائرة: <span class='hl-rose' dir='ltr'>(x<sub>0</sub>, y<sub>0</sub>) = (0, r)</span>.",
          "2️⃣ نحسب القيمة الابتدائية لمعامل القرار <span dir='ltr'>p<sub>0</sub></span> بالقانون: <span class='hl-yellow' dir='ltr'>p<sub>0</sub> = 5/4 &minus; r</span> (ولما يكون نصف القطر <span dir='ltr'>r</span> عدداً صحيحاً بنقرّب <span dir='ltr'>5/4</span> لـ <span dir='ltr'>1</span> فيكون <span class='hl-emerald' dir='ltr'>p<sub>0</sub> = 1 &minus; r</span> كما في مثال المحاضرة صفحة 24).",
          "<b>إمتى أستخدم <span class='math-pill'>p<sub>0</sub> = 5/4 &minus; r</span> وإمتى أستخدم <span class='math-pill'>p<sub>0</sub> = 1 &minus; r</span>؟</b><br>• لو السؤال نظري في الـ MCQ ويسألك عن القانون الأصلي في خطوات الخوارزمية (سلايد 21) اختار <span class='math-pill'>p<sub>0</sub> = 5/4 &minus; r</span>.<br>• لو بتحل مسألة جدول بأرقام صحيحة زي <span class='math-pill'>r = 10</span> (سلايد 24)، استخدم <span class='math-pill'>p<sub>0</sub> = 1 &minus; r = &minus;9</span>."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: What is the first point (x0, y0) on a circle centered at the origin, and what is the formula for the initial decision parameter p0?</div><div><strong>الإجابة النموذجية:</strong> (x0, y0) = (0, r), and p0 = 5/4 - r (or p0 = 1 - r for integer radius r).</div>",
        "notebookEn": "Circle Algorithm Steps 1 & 2 (Initialization): 1. First point at origin: (x0, y0) = (0, r) | 2. Initial decision parameter: p0 = 5/4 - r (or p0 = 1 - r).",
        "notebookAr": "أول نقطة في الدائرة هي (0, r)، ومعامل القرار الابتدائي هو p0 = 5/4 - r أو بالصحيح p0 = 1 - r."
      },
      {
        "id": "cg4-s13",
        "slideRef": "Page 22",
        "shortLabel": "13. Algorithm Step 3:",
        "title": "Algorithm Step 3: Decision Test for p_k < 0 vs. p_k ≥ 0",
        "enPoints": [
          "<strong>3.</strong> At each <span class=\"cg-emph\">x<sub>k</sub></span> along the line, starting at <span class=\"cg-emph\">k = 0</span>, perform the following test:",
          "&bull; <strong class=\"cg-emph\">If p<sub>k</sub> &lt; 0:</strong> the next point along the circle is <strong>(x<sub>k+1</sub>, y<sub>k</sub>)</strong>, and <span class=\"cg-emph\">p<sub>k+1</sub> = p<sub>k</sub> + 2x<sub>k+1</sub> + 1</span>",
          "&bull; <strong class=\"cg-emph\">Otherwise (p<sub>k</sub> &ge; 0):</strong> the next point along the circle is <strong>(x<sub>k</sub> + 1, y<sub>k</sub> &minus; 1)</strong>, and <span class=\"cg-emph\">p<sub>k+1</sub> = p<sub>k</sub> + 2x<sub>k+1</sub> + 1 &minus; 2y<sub>k+1</sub></span>",
          "<strong>Where:</strong> <span class='font-mono font-bold'>2x<sub>k+1</sub> = 2x<sub>k</sub> + 2</span> and <span class='font-mono font-bold'>2y<sub>k+1</sub> = 2y<sub>k</sub> &minus; 2</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الخطوة رقم 3 هي قلب خوارزمية الدائرة (احفظها صم):",
        "deepPoints": [
          "عند كل خطوة <span dir='ltr'>k</span> بدايةً من <span dir='ltr'>k = 0</span>، بنزوّد <span dir='ltr'>x</span> دايماً بمقدار 1 (<span class='math-pill'>x<sub>k+1</sub> = x<sub>k</sub> + 1</span>) ونبص على إشارة <span dir='ltr'>p<sub>k</sub></span>:",
          "1️⃣ <strong>لو <span dir='ltr'>p<sub>k</sub> &lt; 0</span> (سالب):</strong> النقطة الجديدة هي <span class='hl-emerald' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub>)</span> (الـ <span dir='ltr'>y</span> ثابتة)، ونحدث معامل القرار بالقانون: <span class='hl-emerald' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2x<sub>k+1</sub> + 1</span>.",
          "2️⃣ <strong>غير كده (<span dir='ltr'>p<sub>k</sub> &ge; 0</span> موجب أو صفر):</strong> النقطة الجديدة هي <span class='hl-rose' dir='ltr'>(x<sub>k</sub> + 1, y<sub>k</sub> &minus; 1)</span> (الـ <span dir='ltr'>y</span> تنقص 1)، ونحدث معامل القرار بالقانون: <span class='hl-rose' dir='ltr'>p<sub>k+1</sub> = p<sub>k</sub> + 2x<sub>k+1</sub> + 1 &minus; 2y<sub>k+1</sub></span>.",
          "حيث <span class='math-pill'>2x<sub>k+1</sub> = 2x<sub>k</sub> + 2</span> دايماً بتزيد 2، و <span class='math-pill'>2y<sub>k+1</sub> = 2y<sub>k</sub> &minus; 2</span> بتنقص 2 لما <span dir='ltr'>y</span> تنقص 1.",
          "<b>السر اللي بيمنع أي غلطة حسابية في جدول الدائرة:</b><br>رتب أعمدة جدولك زي سلايد 26 بالظبط: <span class='math-pill'>k | p<sub>k</sub> | (x<sub>k+1</sub>, y<sub>k+1</sub>) | 2x<sub>k+1</sub> | 2y<sub>k+1</sub></span>.<br>في كل سطر: طلع النقطة الجديدة <span class='math-pill'>(x<sub>k+1</sub>, y<sub>k+1</sub>)</span> الأول، واضربها في 2 عشان تملأ عمودي <span class='math-pill'>2x<sub>k+1</sub></span> و <span class='math-pill'>2y<sub>k+1</sub></span>، وبعدين استخدم الرقمين دول لحساب <span class='math-pill'>p<sub>k+1</sub></span> للسطر اللي بعده!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In Step 3 of the circle algorithm, what are the next point and p_(k+1) when p_k < 0 versus when p_k >= 0?</div><div><strong>الإجابة النموذجية:</strong> If p_k < 0: next point is (x_k + 1, y_k) and p_(k+1) = p_k + 2x_(k+1) + 1. Otherwise (p_k >= 0): next point is (x_k + 1, y_k - 1) and p_(k+1) = p_k + 2x_(k+1) + 1 - 2y_(k+1).</div>",
        "notebookEn": "Circle Algorithm Decision Rules (Step 3): If p_k (x_k+1, y_k) and p_(k+1) = p_k + 2x_(k+1) + 1 | If p_k >= 0 -> (x_k+1, y_k - 1) and p_(k+1) = p_k + 2x_(k+1) + 1 - 2y_(k+1).",
        "notebookAr": "قوانين الجدول: لو p_k سالبة ثبت الـ y واجمع (2x_k+1 + 1)، ولو موجبة نقص الـ y بـ 1 واطرح كمان 2y_k+1."
      },
      {
        "id": "cg4-s14",
        "slideRef": "Page 23",
        "shortLabel": "14. Algorithm Steps 4,",
        "title": "Algorithm Steps 4, 5 & 6: Symmetry, Center Shift & Stopping Condition",
        "enPoints": [
          "<strong>4.</strong> Determine <strong>symmetry points</strong> in the other <strong>seven octants</strong>.",
          "<strong>5.</strong> Move each calculated pixel position <strong>(x, y)</strong> onto the circular path centered on <strong>(x<sub>c</sub>, y<sub>c</sub>)</strong> and plot the coordinate values:",
          "<div class=\"cg-emph\">x = x + x<sub>c</sub> , &nbsp;&nbsp;&nbsp; y = y + y<sub>c</sub></div>",
          "<strong>6.</strong> Repeat <u>step 3 through 5</u> until <span class=\"cg-emph\">x &ge; y</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "باقي خطوات خوارزمية الدائرة (الخطوات 4 و 5 و 6):",
        "deepPoints": [
          "4️⃣ نستنتج نقاط التماثل في الأثمان السبعة الأخرى <span class='en-term' dir='ltr'>Other seven octants</span>.",
          "5️⃣ ننقل كل نقطة محسوبة <span dir='ltr'>(x, y)</span> إلى مسار الدائرة المتمركز عند <span dir='ltr'>(x<sub>c</sub>, y<sub>c</sub>)</span> عن طريق الجمع المباشر: <span class='math-pill'>x = x + x<sub>c</sub></span> و <span class='math-pill'>y = y + y<sub>c</sub></span> ونرسمها.",
          "6️⃣ <strong>شرط التوقف (موضع سؤال مؤكد):</strong> نكرر الخطوات من 3 إلى 5 لحد ما يتحقق الشرط <span class='hl-rose' dir='ltr'>x &ge; y</span> (يعني أول ما الإحداثي <span dir='ltr'>x</span> يساوي أو يعدّي <span dir='ltr'>y</span> بنقف فوراً!).",
          "<b>ليه بنقف لما <span class='math-pill'>x &ge; y</span> مش لما <span class='math-pill'>x = r</span>؟</b><br>لأن من <span class='math-pill'>x = 0</span> لحد <span class='math-pill'>x = y</span> إحنا بنكون رسمنا الثُمن الأول كله (<span class='math-pill'>45&deg;</span>)، وبمجرد انعكاس النقاط دي بـ <span class='math-pill'>(y, x)</span> بيترسم الثُمن الثاني تلقائياً لحد <span class='math-pill'>(r, 0)</span> من غير ما نعيد الحسابات!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: When does the loop (repeating steps 3 through 5) terminate in the Midpoint/Bresenham circle algorithm?</div><div><strong>الإجابة النموذجية:</strong> When x >= y.</div>",
        "notebookEn": "Circle Algorithm Steps 4, 5 & 6 (Symmetry, Translation & Stop): 4. Find symmetry points in other 7 octants | 5. Shift by x = x + xc, y = y + yc | 6. Repeat Steps 3–5 until x >= y.",
        "notebookAr": "بنطلع الـ 7 نقاط المتماثلة، ونجمع عليهم المركز (xc, yc)، ونكرر لحد ما x >= y."
      },
      {
        "id": "cg4-s15",
        "slideRef": "Pages 21–23 Recap",
        "shortLabel": "15. Line Bresenham vs.",
        "title": "Line Bresenham vs. Circle Midpoint: Key Formula Differences",
        "enPoints": [
          "<strong>Starting Point:</strong> Line starts at left endpoint <span dir='ltr'>(x<sub>0</sub>, y<sub>0</sub>)</span>; Circle starts at top of origin <span dir='ltr'>(0, r)</span>.",
          "<strong>Initial Parameter p<sub>0</sub>:</strong> Line uses <span dir='ltr'>p<sub>0</sub> = 2&Delta;y &minus; &Delta;x</span>; Circle uses <span dir='ltr'>p<sub>0</sub> = 5/4 &minus; r &approx; 1 &minus; r</span>.",
          "<strong>Y Direction:</strong> Line (<span dir='ltr'>0 &lt; m &lt; 1</span>) increments <span dir='ltr'>y</span> (<span dir='ltr'>y<sub>k</sub> + 1</span> when <span dir='ltr'>p<sub>k</sub> &ge; 0</span>); Circle decrements <span dir='ltr'>y</span> (<span dir='ltr'>y<sub>k</sub> &minus; 1</span> when <span dir='ltr'>p<sub>k</sub> &ge; 0</span>).",
          "<strong>Stopping Rule:</strong> Line repeats <span dir='ltr'>&Delta;x</span> times; Circle repeats until <span dir='ltr'>x &ge; y</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "<strong>مقارنة سريعة جداً عشان متخلطش بين قوانين الشابتر الثالث (الخط) والشابتر الرابع (الدائرة) في الامتحان:</strong>",
        "deepPoints": [
          "• <strong>نقطة البداية:</strong> في الخط <span class='math-pill'>(x<sub>0</sub>, y<sub>0</sub>)</span> المعطاة؛ في الدائرة <span class='math-pill'>(0, r)</span>.",
          "• <strong>قانون <span dir='ltr'>p<sub>0</sub></span>:</strong> في الخط <span class='math-pill'>2&Delta;y &minus; &Delta;x</span>؛ في الدائرة <span class='math-pill'>1 &minus; r</span> (أو <span class='math-pill'>5/4 &minus; r</span>).",
          "• <strong>لما <span dir='ltr'>p<sub>k</sub> &ge; 0</span>:</strong> في الخط <span dir='ltr'>y</span> بتزيد (<span class='math-pill'>y<sub>k</sub> + 1</span>)؛ في الدائرة <span dir='ltr'>y</span> بتنقص (<span class='math-pill'>y<sub>k</sub> &minus; 1</span>).",
          "• <strong>التوقف:</strong> في الخط بعد <span class='math-pill'>&Delta;x</span> خطوات؛ في الدائرة لما <span class='math-pill'>x &ge; y</span>.",
          "<b>جدول مقارنة سريع في دماغك:</b> في خط Bresenham كنا بنزود ثوابت ثابتة طول المسألة (<span class='math-pill'>2&Delta;y</span> أو <span class='math-pill'>2&Delta;y &minus; 2&Delta;x</span>)، أما في الدائرة فالمقدار اللي بنجمعه (<span class='math-pill'>2x<sub>k+1</sub> + 1</span>) <b>بيتغير وبيكبر في كل خطوة</b> لأن الدائرة منحنية وميلها بيتغير!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: How does the update of y when p_k >= 0 differ between Bresenham's line algorithm (0 < m < 1) and the Midpoint circle algorithm?</div><div><strong>الإجابة النموذجية:</strong> In the line algorithm y increases by 1 (y_k + 1), whereas in the circle algorithm y decreases by 1 (y_k - 1).</div>",
        "notebookEn": "Bresenham Line vs. Midpoint Circle Quick Contrast: Line: p0 = 2Δy - Δx, y -> y+1 when p_k>=0, stops after Δx steps | Circle: p0 = 1 - r, y -> y-1 when p_k>=0, stops when x >= y.",
        "notebookAr": "الفرق الجوهري: في الدائرة p0 = 1-r، والـ y بتنقص 1 لما p_k>=0، وبنقف لما x >= y."
      },
      {
        "id": "cg4-s16",
        "slideRef": "Pages 24 & 25",
        "shortLabel": "16. Example 2 Setup:",
        "title": "Example 2 Setup: Midpoint Circle-Drawing for r = 10",
        "enPoints": [
          "<strong>Problem:</strong> Given a circle radius <strong>r = 10</strong>, and centered at the coordinate origin.",
          "We demonstrate the mid-point circle algorithm by determining positions along the circle octant in the first quadrant from <strong>x = 0 to x = y</strong>.",
          "The <strong>initial value of the decision parameter</strong> is: <span class=\"cg-emph\">p<sub>0</sub> = 1 &minus; r = &minus;9</span>.",
          "For the circle centered on the coordinate origin, the <strong>initial point</strong> is <span class=\"cg-emph\">(x<sub>0</sub>, y<sub>0</sub>) = (0, 10)</span>, and <strong>initial increment terms</strong> are: <span class=\"cg-emph\">2x<sub>0</sub> = 0, &nbsp; 2y<sub>0</sub> = 20</span>."
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "مسألة المحاضرة الرسمية (صفحات 24 و 25): دائرة نصف قطرها <span class='math-pill'>r = 10</span> ومركزها نقطة الأصل <span class='math-pill'>(0, 0)</span>:",
        "deepPoints": [
          "1️⃣ <strong>نقطة البداية:</strong> <span class='hl-emerald' dir='ltr'>(x<sub>0</sub>, y<sub>0</sub>) = (0, 10)</span>.",
          "2️⃣ <strong>معامل القرار الابتدائي:</strong> <span class='hl-yellow' dir='ltr'>p<sub>0</sub> = 1 &minus; r = 1 &minus; 10 = &minus;9</span>.",
          "3️⃣ <strong>المعاملات الابتدائية:</strong> <span class='math-pill'>2x<sub>0</sub> = 0</span> و <span class='math-pill'>2y<sub>0</sub> = 2(10) = 20</span>.",
          "<b>تأكد من حفظ الـ 4 أرقام الابتدائية لمثال <span class='math-pill'>r = 10</span>:</b><br>1. <span class='math-pill'>(x<sub>0</sub>, y<sub>0</sub>) = (0, 10)</span><br>2. <span class='math-pill'>p<sub>0</sub> = 1 &minus; 10 = &minus;9</span><br>3. <span class='math-pill'>2x<sub>0</sub> = 0</span><br>4. <span class='math-pill'>2y<sub>0</sub> = 20</span>"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: For a circle of radius r = 10 centered at the origin, what are (x0, y0), p0, 2x0, and 2y0?</div><div><strong>الإجابة النموذجية:</strong> (x0, y0) = (0, 10), p0 = 1 - 10 = -9, 2x0 = 0, and 2y0 = 20.</div>",
        "notebookEn": "Solved Example Setup (r = 10 at Origin): (x0, y0) = (0, 10) | p0 = 1 - r = -9 | 2x0 = 0 | 2y0 = 20 | Sector: x = 0 to x = y.",
        "notebookAr": "معطيات مسألة المحاضرة r=10: أول نقطة (0,10)، و p0 = -9، و 2x0 = 0، و 2y0 = 20."
      },
      {
        "id": "cg4-s17",
        "slideRef": "Page 26",
        "shortLabel": "17. Solved Example Table:",
        "title": "Solved Example Table: Successive Values for r = 10 (k = 0 to 6)",
        "enPoints": [
          "Successive decision parameter values and positions along the circle path (Page 26):",
          "<span class='font-mono'>&bull; k=0: p<sub>0</sub> = &minus;9 &rarr; (1, 10), &nbsp; 2x<sub>1</sub> = 2, &nbsp; 2y<sub>1</sub> = 20</span>",
          "<span class='font-mono'>&bull; k=1: p<sub>1</sub> = &minus;6 &rarr; (2, 10), &nbsp; 2x<sub>2</sub> = 4, &nbsp; 2y<sub>2</sub> = 20</span>",
          "<span class='font-mono'>&bull; k=2: p<sub>2</sub> = &minus;1 &rarr; (3, 10), &nbsp; 2x<sub>3</sub> = 6, &nbsp; 2y<sub>3</sub> = 20</span>",
          "<span class='font-mono'>&bull; k=3: p<sub>3</sub> = 6 &nbsp;&rarr; (4, 9), &nbsp;&nbsp; 2x<sub>4</sub> = 8, &nbsp; 2y<sub>4</sub> = 18</span>",
          "<span class='font-mono'>&bull; k=4: p<sub>4</sub> = &minus;3 &rarr; (5, 9), &nbsp;&nbsp; 2x<sub>5</sub> = 10, 2y<sub>5</sub> = 18</span>",
          "<span class='font-mono'>&bull; k=5: p<sub>5</sub> = 8 &nbsp;&rarr; (6, 8), &nbsp;&nbsp; 2x<sub>6</sub> = 12, 2y<sub>6</sub> = 16</span>",
          "<span class='font-mono'>&bull; k=6: p<sub>6</sub> = 5 &nbsp;&rarr; (7, 7), &nbsp;&nbsp; 2x<sub>7</sub> = 14, 2y<sub>7</sub> = 14 &nbsp; [STOP: x = y = 7]</span>"
        ],
        "svg": null,
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "ركز في تسلسل الأرقام في جدول صفحة 26:",
        "deepPoints": [
          "• في أول 3 خطوات (<span dir='ltr'>k = 0, 1, 2</span>): كانت <span dir='ltr'>p<sub>k</sub></span> سالبة (<span dir='ltr'>&minus;9, &minus;6, &minus;1</span>)، فثبتنا <span dir='ltr'>y = 10</span>، وجمعنا <span dir='ltr'>2x<sub>k+1</sub> + 1</span> (أي <span dir='ltr'>+3, +5, +7</span>) فطلعت <span dir='ltr'>p<sub>3</sub> = 6</span>.",
          "• عند <span class='hl-rose' dir='ltr'>k = 3</span> (<span dir='ltr'>p<sub>3</sub> = 6 &ge; 0</span>): نقصنا <span dir='ltr'>y</span> بـ 1 فبقت النقطة <span dir='ltr'>(4, 9)</span>، وحسبنا <span dir='ltr'>p<sub>4</sub> = 6 + 8 + 1 &minus; 18 = &minus;3</span>.",
          "• عند <span class='hl-emerald' dir='ltr'>k = 4</span> (<span dir='ltr'>p<sub>4</sub> = &minus;3 &lt; 0</span>): ثبتنا <span dir='ltr'>y = 9</span> فبقت النقطة <span dir='ltr'>(5, 9)</span>، وحسبنا <span dir='ltr'>p<sub>5</sub> = &minus;3 + 10 + 1 = 8</span>.",
          "• عند <span class='hl-rose' dir='ltr'>k = 5</span> (<span dir='ltr'>p<sub>5</sub> = 8 &ge; 0</span>): نقصنا <span dir='ltr'>y</span> بـ 1 فبقت النقطة <span dir='ltr'>(6, 8)</span>، وحسبنا <span dir='ltr'>p<sub>6</sub> = 8 + 12 + 1 &minus; 16 = 5</span>.",
          "• عند <span class='hl-yellow' dir='ltr'>k = 6</span> (<span dir='ltr'>p<sub>6</sub> = 5 &ge; 0</span>): نقصنا <span dir='ltr'>y</span> بـ 1 فبقت النقطة <span dir='ltr'>(7, 7)</span>، وهنا <span dir='ltr'>x = y = 7</span> فنوقف الجدول فوراً!",
          "<b>تشتيك ذكي على جدول <span class='math-pill'>r = 10</span>:</b><br>لاحظ إن عمود <span class='math-pill'>2x<sub>k+1</sub></span> بيمشي زوجي منتظم: <span class='math-pill'>2, 4, 6, 8, 10, 12, 14</span>.<br>وعمود <span class='math-pill'>2y<sub>k+1</sub></span> بيبدأ بـ <span class='math-pill'>20, 20, 20</span> ولما <span class='math-pill'>p<sub>k</sub></span> بتطلع موجبة بينقص 2 فيبقى <span class='math-pill'>18, 18, 16, 14</span>!"
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: In the Midpoint Circle table for r = 10, at which steps k is p_k non-negative (>= 0), causing y to decrease by 1?</div><div><strong>الإجابة النموذجية:</strong> At k = 3 (p3 = 6 -> (4, 9)), k = 5 (p5 = 8 -> (6, 8)), and k = 6 (p6 = 5 -> (7, 7)).</div>",
        "notebookEn": "Solved Example Table Sequence (r = 10): p_k values: -9, -6, -1, 6, -3, 8, 5 | Plotted octant points: (0,10), (1,10), (2,10), (3,10), (4,9), (5,9), (6,8), (7,7).",
        "notebookAr": "تسلسل معامل القرار: -9 ثم -6 ثم -1 ثم 6 ثم -3 ثم 8 ثم 5، ونتوقف عند k=6 لأن النقطة (7,7) تحقق x = y."
      },
      {
        "id": "cg4-s18",
        "slideRef": "Page 27",
        "shortLabel": "18. Solved Example Figure:",
        "title": "Solved Example Figure: First Quadrant Pixel Plot (y = x Symmetry)",
        "enPoints": [
          "<strong>Figure (Page 27):</strong> Plotted pixel positions along the circle path in the first quadrant for <strong>r = 10</strong>.",
          "<strong>8 black filled circles:</strong> Initial point <span dir='ltr'>(0, 10)</span> plus the 7 generated points from <span dir='ltr'>(1, 10)</span> to <span dir='ltr'>(7, 7)</span> along the first octant.",
          "<strong>7 open circles:</strong> Symmetry points reflected across the <span dir='ltr'>y = x</span> (<span dir='ltr'>45&deg;</span>) line from <span dir='ltr'>(8, 6)</span> down to <span dir='ltr'>(10, 0)</span>."
        ],
        "svg": "<svg viewBox=\"0 0 400 280\" >\n                <rect x=\"10\" y=\"10\" width=\"380\" height=\"260\" fill=\"#fff\" stroke=\"#0f172a\" stroke-width=\"2.5\"/>\n                <g stroke=\"#cbd5e1\" stroke-width=\"1\">\n                    <line x1=\"65\" y1=\"30\" x2=\"65\" y2=\"230\"/><line x1=\"85\" y1=\"30\" x2=\"85\" y2=\"230\"/><line x1=\"105\" y1=\"30\" x2=\"105\" y2=\"230\"/><line x1=\"125\" y1=\"30\" x2=\"125\" y2=\"230\"/><line x1=\"145\" y1=\"30\" x2=\"145\" y2=\"230\"/><line x1=\"165\" y1=\"30\" x2=\"165\" y2=\"230\"/><line x1=\"185\" y1=\"30\" x2=\"185\" y2=\"230\"/><line x1=\"205\" y1=\"30\" x2=\"205\" y2=\"230\"/><line x1=\"225\" y1=\"30\" x2=\"225\" y2=\"230\"/><line x1=\"245\" y1=\"30\" x2=\"245\" y2=\"230\"/><line x1=\"265\" y1=\"30\" x2=\"265\" y2=\"230\"/>\n                    <line x1=\"65\" y1=\"30\" x2=\"265\" y2=\"30\"/><line x1=\"65\" y1=\"50\" x2=\"265\" y2=\"50\"/><line x1=\"65\" y1=\"70\" x2=\"265\" y2=\"70\"/><line x1=\"65\" y1=\"90\" x2=\"265\" y2=\"90\"/><line x1=\"65\" y1=\"110\" x2=\"265\" y2=\"110\"/><line x1=\"65\" y1=\"130\" x2=\"265\" y2=\"130\"/><line x1=\"65\" y1=\"150\" x2=\"265\" y2=\"150\"/><line x1=\"65\" y1=\"170\" x2=\"265\" y2=\"170\"/><line x1=\"65\" y1=\"190\" x2=\"265\" y2=\"190\"/><line x1=\"65\" y1=\"210\" x2=\"265\" y2=\"210\"/><line x1=\"65\" y1=\"230\" x2=\"265\" y2=\"230\"/>\n                </g>\n                <!-- Axes -->\n                <line x1=\"65\" y1=\"20\" x2=\"65\" y2=\"235\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <line x1=\"60\" y1=\"230\" x2=\"285\" y2=\"230\" stroke=\"#0f172a\" stroke-width=\"2\"/>\n                <!-- Symmetry line y = x -->\n                <line x1=\"65\" y1=\"230\" x2=\"265\" y2=\"30\" stroke=\"#4f46e5\" stroke-width=\"2\" stroke-dasharray=\"5,4\"/>\n                <text x=\"270\" y=\"34\" font-family=\"Inter\" font-size=\"12\" font-weight=\"bold\" fill=\"#4f46e5\">y = x</text>\n                <!-- Ideal quarter circle -->\n                <path d=\"M 65 30 A 200 200 0 0 1 265 230\" fill=\"none\" stroke=\"#e11d48\" stroke-width=\"2\"/>\n                <!-- Primary octant pixels (filled black): (0,10),(1,10),(2,10),(3,10),(4,9),(5,9),(6,8),(7,7) -->\n                <g fill=\"#0f172a\">\n                    <circle cx=\"65\" cy=\"30\" r=\"8\"/><circle cx=\"85\" cy=\"30\" r=\"8\"/><circle cx=\"105\" cy=\"30\" r=\"8\"/><circle cx=\"125\" cy=\"30\" r=\"8\"/>\n                    <circle cx=\"145\" cy=\"50\" r=\"8\"/><circle cx=\"165\" cy=\"50\" r=\"8\"/><circle cx=\"185\" cy=\"70\" r=\"8\"/><circle cx=\"205\" cy=\"90\" r=\"8\"/>\n                </g>\n                <!-- Symmetric octant pixels (open circles): (8,6),(9,5),(9,4),(10,3),(10,2),(10,1),(10,0) -->\n                <g fill=\"#ffffff\" stroke=\"#0f172a\" stroke-width=\"2.2\">\n                    <circle cx=\"225\" cy=\"110\" r=\"8\"/><circle cx=\"245\" cy=\"130\" r=\"8\"/><circle cx=\"245\" cy=\"150\" r=\"8\"/>\n                    <circle cx=\"265\" cy=\"170\" r=\"8\"/><circle cx=\"265\" cy=\"190\" r=\"8\"/><circle cx=\"265\" cy=\"210\" r=\"8\"/><circle cx=\"265\" cy=\"230\" r=\"8\"/>\n                </g>\n                <text x=\"42\" y=\"34\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">10</text>\n                <text x=\"46\" y=\"94\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">7</text>\n                <text x=\"46\" y=\"134\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">5</text>\n                <text x=\"46\" y=\"234\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">0</text>\n                <text x=\"62\" y=\"248\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">0</text>\n                <text x=\"162\" y=\"248\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">5</text>\n                <text x=\"202\" y=\"248\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">7</text>\n                <text x=\"258\" y=\"248\" font-family=\"Inter\" font-size=\"11\" font-weight=\"bold\" fill=\"#0f172a\">10</text>\n            </svg>",
        "svgTheme": "light",
        "img": null,
        "svgCaption": null,
        "tableHtml": null,
        "why": "الرسمة النهائية في صفحة 27 بتلخص فكرة الشابتر كله بصرياً:",
        "deepPoints": [
          "• <strong>الدوائر السوداء المظللة (8 بكسلات):</strong> هي نقاط الثُمن الأول اللي حسبناها: نقطة البداية <span class='math-pill'>(0, 10)</span> + الـ 7 نقاط اللي طلعوا من الجدول لحد <span class='math-pill'>(7, 7)</span> على خط الـ <span dir='ltr'>y = x</span>.",
          "• <strong>الدوائر البيضاء المفتوحة (7 بكسلات):</strong> هي انعكاس النقاط دي حول خط الـ <span class='hl-cyan' dir='ltr'>y = x (45&deg;)</span> بتبديل الإحداثيات: <span class='math-pill'>(8, 6), (9, 5), (9, 4), (10, 3), (10, 2), (10, 1), (10, 0)</span>.",
          "<b>كم إجمالي عدد البكسلات المرسومة في الربع الأول في صفحة 27؟</b><br>عندنا 8 بكسلات سوداء في الثُمن الأول من <span class='math-pill'>(0, 10)</span> لـ <span class='math-pill'>(7, 7)</span> + 7 بكسلات بيضاء منعكسة من <span class='math-pill'>(8, 6)</span> لـ <span class='math-pill'>(10, 0)</span> = <b>15 بكسل</b> في الربع الأول (لأن النقطة <span class='math-pill'>(7, 7)</span> مشتركة على خط <span class='math-pill'>y = x</span> ومبتتكررش!)."
        ],
        "examSpot": "<div dir=\"ltr\" class=\"font-en text-left font-bold mb-1.5\">Q: For r = 10, how many pixels are plotted in the first octant (from x = 0 to x = y, including the initial point (0, 10))?</div><div><strong>الإجابة النموذجية:</strong> 8 pixels in the first octant: (0,10), (1,10), (2,10), (3,10), (4,9), (5,9), (6,8), and (7,7).</div>",
        "notebookEn": "First Octant vs. First Quadrant Pixel Count (r = 10): First octant has 8 pixels ((0,10) to (7,7)) | Reflecting across y = x adds 7 more pixels ((8,6) to (10,0)) = 15 pixels in Quadrant I.",
        "notebookAr": "الثُمن الأول فيه 8 بكسلات (شامل نقطة البداية)، وبالانعكاس حول خط y=x يكتمل الربع الأول بـ 15 بكسل."
      }
    ],
    "lab": {
      "title": "",
      "subtitle": "",
      "steps": []
    },
    "summary": []
  }
];
