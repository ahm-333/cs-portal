import type { StructuredChapterSummary } from "@/types/chapter";

const CG_LESSON_IDS = {
  CH1: "22222222-2222-4222-8222-222222222601",
  CH2: "22222222-2222-4222-8222-222222222602",
  CH3: "22222222-2222-4222-8222-222222222603",
  CH4: "22222222-2222-4222-8222-222222222604",
} as const;

export const CG_STRUCTURED_SUMMARIES: StructuredChapterSummary[] = [
  // ============================================================================
  // CHAPTER 1: Introduction to Computer Graphics
  // ============================================================================
  {
    lessonId: CG_LESSON_IDS.CH1,
    courseCode: "CS-321",
    chapterNum: 1,
    titleEn: "Introduction to Computer Graphics",
    titleAr: "مقدمة في الرسوميات بالحاسب",
    overviewEn:
      "Covers the four major application areas of computer graphics, hardware architecture (frame buffer, raster, bit depth, CRT & DAC), physical light & imaging (pinhole camera projection), the human visual system (rods vs. cones), and the synthetic-camera API model.",
    overviewAr:
      "كل سطر إنجليزي تحتيه شرحه بالعامية مباشرة: المجالات الأربعة للرسوميات، الهاردوير والـ Frame Buffer، الضوء وكاميرا الثقب، العين البشرية، ونموذج الكاميرا الاصطناعية (API).",
    sections: [
      {
        id: "ch1-areas",
        number: "01",
        titleEn: "Definition & Four Major Application Areas",
        titleAr: "التعريف والمجالات الأربعة الرئيسية",
        flowBanner: {
          labelEn: "Four Major Areas of Computer Graphics",
          steps: [
            "1. Display of Information",
            "2. Design (CAD)",
            "3. Simulation & Animation",
            "4. User Interfaces (GUI)",
          ],
          captionAr:
            "أي حاجة غير الأربعة دول (زي Memory أو Frame Buffer) تعتبر مكونات هاردوير مش مجال تطبيق.",
        },
        cards: [
          {
            term: "Computer Graphics Definition & Evolution",
            termAr: "تعريف وتطور الرسوميات بالحاسب",
            badge: "Pages 1–3",
            tone: "brand",
            enSummary:
              "Computer Graphics: Concerned with all aspects of producing pictures or images using a computer.",
            arSummary:
              "علم الجرافيكس مهتم بكل خطوات إنتاج الصور والرسومات باستخدام الكمبيوتر.",
            points: [
              {
                en: "Historical Origin: Began humbly 50 years ago with displaying a few lines on a Cathode-Ray Tube (CRT).",
                ar: "البداية كانت بسيطة جداً من حوالي 50 سنة برسم شوية خطوط على شاشة CRT قديمة.",
              },
              {
                en: "Computer Graphics vs. Image Processing: Graphics takes a mathematical model/data → outputs an image; Image Processing takes an image → outputs an enhanced image.",
                ar: "الفرق الجوهري: في الجرافيكس بنبدأ بوصف رياضي ونطلع صورة، أما في معالجة الصور فبنبدأ بصورة ونحسّنها أو نعدّلها.",
                tag: "Exam Focus",
              },
            ],
          },
          {
            term: "1. Display of Information & 2. Design (CAD)",
            termAr: "عرض المعلومات والتصميم الهندسي",
            badge: "Pages 5–12",
            tone: "warm",
            enSummary:
              "Graphics turns raw datasets into visual insight (maps, medical scans) and empowers interactive engineering design (CAD).",
            arSummary:
              "أول مجالين: تحويل الأرقام والبيانات لصور واضحة، ومساعدة المهندسين في التصميم التفاعلي.",
            points: [
              {
                en: "Scientific & Medical Visualization: Converts raw 3D scanner measurements (CT, MRI, Ultrasound) and GIS maps into readable images.",
                ar: "زي أشعة CT و MRI والخرائط الجغرافية — بتحوّل بيانات ضخمة لصورة العين تفهمها في ثانية.",
              },
              {
                en: "Iterative Design & CAD: Computer-Aided Design is used for buildings, VLSI circuits, cars, and aircraft through repeated visual testing.",
                ar: "التصميم الهندسي عملية تكرارية بنستخدم فيها برامج CAD لتصميم المباني والدوائر الإلكترونية والعربيات والطيارات.",
              },
              {
                en: "Overdetermined Problem: Has TOO MANY constraints → NO solution exists.",
                ar: "لو القيود والشروط أكتر من اللازم → مفيش أي حل يحققهم كلهم مع بعض.",
                tag: "Exam Trap",
              },
              {
                en: "Underdetermined Problem: Has TOO FEW constraints → MANY solutions exist (designer explores interactively with CAD).",
                ar: "لو القيود قليلة → فيه حلول كتير جداً، فالمهندس يجربها ويشوف الأنسب تفاعلياً على الشاشة.",
                tag: "Exam Trap",
              },
            ],
          },
          {
            term: "3. Simulation & Animation · 4. User Interfaces & 5 GUI Icons",
            termAr: "المحاكاة والواجهات الرسومية وأنواع الأيقونات",
            badge: "Pages 13–25",
            tone: "mint",
            enSummary:
              "Real-time flight simulators and VLSI arcade games accelerated graphics hardware, while GUIs standardized visual interaction through windows, menus, and 5 icon types.",
            arSummary:
              "محاكيات الطيران والألعاب طوّرت كروت الشاشة بسرعة، وواجهات المستخدم (GUI) بتعتمد على النوافذ والقوائم و 5 أنواع أيقونات.",
            points: [
              {
                en: "Resemblance Icon: A direct picture of the actual physical object (e.g., a folder or printer).",
                ar: "أيقونة تشابه مباشر — صورة حقيقية للحاجة نفسها زي صورة طابعة أو فولدر.",
              },
              {
                en: "Exemplar Icon: Shows a typical example representing a whole category (e.g., knife & fork for a restaurant).",
                ar: "أيقونة مثال — بتعرض مثال مشهور يعبّر عن الفئة كلها زي شوكة وسكينة للمطعم.",
              },
              {
                en: "Symbolic Icon: Conveys an abstract or higher-level concept (e.g., cracked glass for fragile).",
                ar: "أيقونة رمزية — بتوصّل معنى مجرد زي كوباية مكسورة بمعنى «قابل للكسر».",
              },
              {
                en: "Arbitrary Icon: Has no visual connection and must be learned by convention (e.g., radiation symbol or power icon).",
                ar: "أيقونة اعتباطية/متعارف عليها — شكلها ملهوش علاقة مباشرة بالمعنى لكن الناس اتعودت عليها زي علامة الباور.",
              },
              {
                en: "Analogy Icon: Uses a familiar metaphor from another domain (e.g., a magnifying glass for Search).",
                ar: "أيقونة تشبيه/استعارة — بتستلف فكرة مألوفة زي العدسة المكبرة للتعبير عن البحث.",
              },
            ],
          },
        ],
      },
      {
        id: "ch1-hardware",
        number: "02",
        titleEn: "Graphics System Architecture, Frame Buffer & CRT",
        titleAr: "معمارية الهاردوير، الـ Frame Buffer، وشاشة الـ CRT",
        flowBanner: {
          labelEn: "6 Major Hardware Elements Pipeline",
          steps: [
            "Input Devices",
            "CPU / Processor",
            "Memory",
            "GPU",
            "Frame Buffer (Raster)",
            "Output Device (CRT/LCD)",
          ],
          captionAr:
            "دي العناصر الستة للهاردوير؛ الـ Frame Buffer هو الذاكرة اللي بتخزّن الصورة كبكسلات قبل عرضها على الشاشة.",
        },
        cards: [
          {
            term: "Raster, Pixels (Pels), Resolution & Bit Depth",
            termAr: "الشبكة النقطية، البكسلات، الدقة وعمق الألوان",
            badge: "Pages 29–32",
            tone: "brand",
            enSummary:
              "Modern graphics systems are raster-based: an image is stored as a 2D array of picture elements (pixels / pels) inside the Frame Buffer.",
            arSummary:
              "الشاشات الحديثة كلها Raster: يعني الصورة متخزّنة كمصفوفة ثنائية الأبعاد من البكسلات جوا الـ Frame Buffer.",
            points: [
              {
                en: "Resolution: Number of pixels in the frame buffer (Width × Height) — determines how much visual detail can be seen.",
                ar: "الـ Resolution هو عدد البكسلات (الطول × العرض)، وكل ما زاد كل ما تفاصيل الصورة بقت أوضح وأنعم.",
              },
              {
                en: "Depth (Precision): Number of bits stored for each pixel; n bits per pixel yields 2^n possible colors.",
                ar: "الـ Depth هو عدد البتات لكل بكسل، وعدد الألوان الممكنة بيساوي 2 أس عدد البتات (2^n).",
                tag: "Formula",
              },
              {
                en: "1-Bit Deep Frame Buffer: Allows only 2¹ = 2 colors (binary black and white).",
                ar: "لو العمق 1 بت بس → لونين اتنين فقط (أبيض وأسود).",
              },
              {
                en: "Full-Color (True-Color / RGB) System: Uses 24 or more bits per pixel (8 bits R + 8 bits G + 8 bits B = 16.7M colors).",
                ar: "نظام الـ Full-Color بيحتاج 24 بت أو أكتر لكل بكسل (8 أحمر + 8 أخضر + 8 أزرق).",
                tag: "Exam Focus",
              },
              {
                en: "High Dynamic Range (HDR): Uses 12 or more bits per color component (36+ bits/pixel) for richer contrast.",
                ar: "أنظمة الـ HDR بتستخدم 12 بت أو أكتر لكل قناة لون عشان تدّي تباين وواقعية أعلى بكتير.",
              },
            ],
          },
          {
            term: "CPU vs. GPU, Rasterization, CRT & DAC",
            termAr: "المعالج وكارت الشاشة والـ CRT والـ DAC",
            badge: "Pages 33–37",
            tone: "neutral",
            enSummary:
              "The GPU accelerates parallel graphics operations, rasterizing geometric shapes into pixels that a DAC converts into analog CRT voltages.",
            arSummary:
              "الـ GPU متخصص في الشغل الرسومي المتوازي، والـ DAC بيحوّل أرقام البكسلات لفولت يحرّك شعاع شاشة الـ CRT.",
            points: [
              {
                en: "Rasterization (Scan Conversion): Converting geometric primitives (lines, polygons) into discrete pixel values inside the frame buffer.",
                ar: "الـ Rasterization هي عملية تحويل الأشكال الهندسية والخطوط لبكسلات فعلية جوا الـ Frame Buffer.",
                tag: "Definition",
              },
              {
                en: "Cathode-Ray Tube (CRT): Directs an electron beam via horizontal and vertical deflection plates onto a phosphor-coated screen.",
                ar: "شاشة الـ CRT بتضرب شعاع إلكترونات بيتوجّه بألواح انحراف أفقية ورأسية عشان ينوّر طبقة الفوسفور.",
              },
              {
                en: "DAC (Digital-to-Analog Converter): Converts digital pixel values in the frame buffer into analog voltages driving the CRT.",
                ar: "الـ DAC هو المحوّل اللي بيقلب الأرقام الديجيتال لفولت أنالوج مناسب لتشغيل الـ CRT.",
              },
              {
                en: "Common Input Devices: Keyboard, Mouse, Trackball, Joystick, Data Tablet, and Light Pen.",
                ar: "أجهزة الإدخال اللي بتاخد أوامر المستخدم وتبعتها لنظام الجرافيكس.",
              },
            ],
          },
        ],
        formulas: [
          {
            labelEn: "Color Count & Frame Buffer Memory Size",
            formula: "Possible Colors = 2^n   |   Buffer Size (bits) = Width × Height × n",
            workedExampleEn:
              "8-bit depth → 2^8 = 256 colors | 24-bit Full-Color → 2^24 ≈ 16.7 million colors",
            arNote:
              "سؤال تعويض مباشر في الامتحان: عدد الألوان = 2 أس الـ Depth، وحجم الـ Frame Buffer = العرض × الطول × عدد البتات.",
          },
        ],
      },
      {
        id: "ch1-optics",
        number: "03",
        titleEn: "Light, Pinhole Camera, Human Visual System & 3D API",
        titleAr: "الضوء، كاميرا الثقب، العين البشرية، ونموذج الـ API",
        cards: [
          {
            term: "Objects, Viewers, Visible Light & Pinhole Camera",
            termAr: "الأجسام والضوء وكاميرا الثقب",
            badge: "Pages 38–51",
            tone: "brand",
            enSummary:
              "An image is formed by two independent entities — Objects and a Viewer — illuminated by electromagnetic Light, modeled mathematically by the Pinhole Camera.",
            arSummary:
              "عشان تتكوّن صورة محتاج كيانين مستقلين (جسم ومُشاهد) بالإضافة لمصدر ضوء، وأبسط نموذج ليهم هو كاميرا الثقب.",
            points: [
              {
                en: "Visible Electromagnetic Spectrum: Light visible to humans lies strictly between 350 nm (violet) and 780 nm (red).",
                ar: "الطيف المرئي للعين البشرية محصور بين 350 نانومتر (بنفسجي) و 780 نانومتر (أحمر) — الرقمين دول حفظ!",
                tag: "Exam Focus",
              },
              {
                en: "Pinhole Camera Property: Produces an inverted image with INFINITE depth of field (every object is in focus), though very little light enters.",
                ar: "كاميرا الثقب بتطلّع صورة مقلوبة وكل حاجة فيها واضحة مهما كانت المسافة (Infinite Depth of Field)، بس الإضاءة قليلة.",
              },
              {
                en: "4 Necessary Camera Specifications: (1) Position (COP), (2) Orientation (view/up vectors), (3) Focal length d (field of view), (4) Film plane size/shape.",
                ar: "الأربع مواصفات اللازمة لتحديد أي كاميرا: مكانها، اتجاهها، البُعد البؤري (زاوية الرؤية)، ومقاس الفيلم.",
              },
            ],
          },
          {
            term: "Human Visual System: Rods vs. Cones",
            termAr: "العين البشرية: العصي مقابل المخاريط",
            badge: "Pages 52–54",
            tone: "mint",
            enSummary:
              "Light passes through the Cornea, Iris (controls aperture), and Lens onto the Retina, which contains two types of light receptors.",
            arSummary:
              "الضوء بيدخل من القرنية والقزحية والعدسة لحد الشبكية، واللي فيها نوعين من المستقبلات الضوئية:",
            points: [
              {
                en: "Rods (Scotopic Vision): High sensitivity for low-light / night vision; monochromatic (cannot detect color).",
                ar: "الـ Rods شغالة في الضلمة والإضاءة الخافتة (Scotopic) بس مبتشوفش ألوان (أبيض وأسود/رمادي).",
                tag: "Exam Focus",
              },
              {
                en: "Cones (Photopic Vision): Active in bright daylight; responsible for COLOR vision with 3 types sensitive to Red, Green, and Blue.",
                ar: "الـ Cones شغالة في النور القوي (Photopic) وهي المسؤولة عن رؤية الألوان (3 أنواع: أحمر وأخضر وأزرق) — اربط C بـ Color!",
                tag: "Exam Focus",
              },
            ],
          },
          {
            term: "Application Programming Interface (API) & Synthetic-Camera Model",
            termAr: "واجهة البرمجة ونموذج الكاميرا الاصطناعية",
            badge: "Pages 55–58",
            tone: "warm",
            enSummary:
              "A graphics API (such as OpenGL) isolates the programmer from hardware details using the 3D Synthetic-Camera Model.",
            arSummary:
              "الـ API زي OpenGL بيفصل المبرمج عن تعقيد كارت الشاشة، وبيخليك تبني المشهد بـ 4 مواصفات واضحة:",
            points: [
              {
                en: "4 Core 3D API Specifications: (1) Objects (vertices/primitives), (2) Viewer (camera), (3) Light sources, (4) Material properties.",
                ar: "الأربع حاجات اللي بتوصفهم في أي 3D API: الأجسام، الكاميرا، مصادر الضوء، وخصائص المواد.",
              },
              {
                en: "Independence Advantage: Objects and Viewer are specified completely independently, so moving the camera never requires redefining objects.",
                ar: "ميزة قوية جداً: تعريف الأجسام منفصل تماماً عن الكاميرا، يعني تقدر تلف الكاميرا براحتك من غير ما تعيد تعريف الأجسام.",
              },
            ],
          },
        ],
        formulas: [
          {
            labelEn: "Pinhole Camera Perspective Projection & Field of View",
            formula: "x_p = −(d · x) / z   |   y_p = −(d · y) / z   |   θ = 2 · tan⁻¹(h / 2d)",
            workedExampleEn:
              "Negative sign means the projected image on the film plane (z = −d) is inverted. Increasing d narrows angle of view θ (zoom in).",
            arNote:
              "السالب في المعادلة معناه إن الصورة بتطلع مقلوبة على الفيلم، وكل ما تزوّد d زاوية الرؤية θ بتضيق (كأنك بتعمل Zoom In).",
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Overdetermined = TOO MANY constraints (NO solution) vs. Underdetermined = TOO FEW constraints (MANY solutions).",
        ar: "تريكة امتحان ثابتة: Overdetermined مفيش حل، و Underdetermined فيه حلول كتير — إوعى تعكسهم!",
      },
      {
        en: "Visible spectrum is strictly 350 nm (violet) to 780 nm (red).",
        ar: "احفظ الرقمين بدقة: الطيف المرئي من 350 لـ 780 نانومتر.",
      },
      {
        en: "Full-color (RGB) systems require 24 or more bits per pixel.",
        ar: "نظام الـ Full-Color بيحتاج 24 بت أو أكتر لكل بكسل (مش 8 ومش 16).",
      },
      {
        en: "Rods = Scotopic (night, NO color) | Cones = Photopic (day, 3 color types).",
        ar: "اربط حرف C في Cones بكلمة Color عشان متتلخبطش بينهم في الامتحان.",
      },
    ],
  },

  // ============================================================================
  // CHAPTER 2: Basic Concepts of Computer Graphics
  // ============================================================================
  {
    lessonId: CG_LESSON_IDS.CH2,
    courseCode: "CS-321",
    chapterNum: 2,
    titleEn: "Basic Concepts of Computer Graphics",
    titleAr: "المفاهيم الأساسية في الرسوميات",
    overviewEn:
      "Covers the graphics system black-box model, the 7 major groups of API functions, geometric vs. raster primitives, simple vs. non-simple polygons, triangulation, stroke vs. raster text, curved objects, and color models (RGB additive vs. CMY subtractive, 24-bit buffers, and alpha opacity).",
    overviewAr:
      "كل نقطة إنجليزي وتحتها شرحها بالعامية فوراً: الصندوق الأسود، المجموعات السبع للدوال، الـ Primitives والمضلعات والتثليث، النصوص، ونماذج الألوان RGB و CMY والشفافية.",
    sections: [
      {
        id: "ch2-blackbox-api",
        number: "01",
        titleEn: "Black Box Model & 7 Major Groups of Graphics Functions",
        titleAr: "نموذج الصندوق الأسود والمجموعات السبع لدوال الجرافيكس",
        flowBanner: {
          labelEn: "Graphics System as a Black Box",
          steps: [
            "Inputs: Function Calls + Input Measurements + OS Messages",
            "Graphics System (Black Box)",
            "Output: Graphics to Output Devices",
          ],
          captionAr:
            "المبرمج مش بيشغل باله بالدوائر الداخلية؛ بيبعت 3 مدخلات للصندوق الأسود وياخد رسومات كمخرج.",
        },
        cards: [
          {
            term: "The 7 Major Groups of Graphics API Functions",
            termAr: "المجموعات السبع الأساسية لدوال الجرافيكس",
            badge: "Slides 5–11",
            tone: "brand",
            enSummary:
              "Every graphics API organizes its commands into 7 core functional categories — memorize the exact role of each group!",
            arSummary:
              "أي مكتبة جرافيكس بتقسّم دوالها لـ 7 مجموعات رئيسية، وكل واحدة فيهم موضع سؤال MCQ:",
            points: [
              {
                en: "1. Primitive Functions (THE WHAT): Define low-level geometric/raster objects the system can display (points, line segments, polygons, pixels, text, curves).",
                ar: "بتحدد «إيه اللي هيترسم» (What): نقط، خطوط، مضلعات، بكسلات، نصوص، منحنيات.",
                tag: "Exam Favorite",
              },
              {
                en: "2. Attribute Functions (THE HOW): Govern the appearance of primitives (color, line style/width, polygon fill pattern, typeface).",
                ar: "بتحدد «الشكل هيظهر إزاي» (How): لونه إيه، الخط متقطع ولا متصل، سُمكه كام، نوع الفونت.",
                tag: "Exam Favorite",
              },
              {
                en: "3. Viewing Functions: Specify various views and camera parameters (position, orientation, lens/clipping volume).",
                ar: "بتتحكم في الكاميرا وزاوية التصوير والجزء اللي ظاهر من المشهد.",
              },
              {
                en: "4. Transformation Functions: Perform geometric operations on objects — Translation (move), Rotation (turn), and Scaling (resize).",
                ar: "بتحرّك وتلف وتكبّر أو تصغّر الأجسام في المشهد.",
              },
              {
                en: "5. Input Functions: Allow applications to interact with diverse input devices (keyboard, mouse, data tablet).",
                ar: "بتقرأ مدخلات وحركة المستخدم من الماوس والكيبورد والتاتش.",
              },
              {
                en: "6. Control Functions: Communicate with the window system, initialize programs, and handle errors.",
                ar: "بتتعامل مع نظام النوافذ، وتهيّئ البرنامج عند التشغيل، وتعالج الأخطاء.",
              },
              {
                en: "7. Query Functions: Retrieve current system properties (e.g., screen resolution, color depth) to write device-independent code.",
                ar: "بتسأل الجهاز عن إمكانياته (دقة الشاشة وعمق الألوان) عشان الكود بتاعك يشتغل صح على أي جهاز.",
              },
            ],
          },
        ],
      },
      {
        id: "ch2-primitives-polygons",
        number: "02",
        titleEn: "Primitives, Polygons, Triangles & Text",
        titleAr: "الـ Primitives، المضلعات، المثلثات، والنصوص",
        cards: [
          {
            term: "Geometric vs. Raster Primitives & Polygons",
            termAr: "الـ Primitives الهندسية مقابل النقطية والمضلعات",
            badge: "Slides 12–23",
            tone: "warm",
            enSummary:
              "Primitives split into vertex-based Geometric primitives and pixel-based Raster primitives; complex polygons are broken down into triangles for reliable rendering.",
            arSummary:
              "العناصر الأساسية بتنقسم لهندسية (نقط وإحداثيات) ونقطية (مصفوفة بكسلات)، وأي مضلع معقد بنقسّمه لمثلثات.",
            points: [
              {
                en: "Geometric Primitives: Specified by vertices in 2D/3D (points, lines, polygons, curves) and pass through the full geometric pipeline.",
                ar: "بتتوصف بنقط وإحداثيات (Vertices) وتعدي على كل مراحل التحويل والقص والرسم.",
              },
              {
                en: "Raster (Image) Primitives: Rectangular arrays of pixels (bitmaps) that bypass geometric transformations and copy straight into the frame buffer.",
                ar: "مصفوفة بكسلات جاهزة بتتنقل مباشرة للـ Frame Buffer من غير ما تعدي على التحويلات الهندسية.",
              },
              {
                en: "Simple vs. Non-Simple Polygon: In a Simple polygon no two edges cross (clear interior); in a Non-Simple polygon edges intersect (ambiguous interior).",
                ar: "المضلع البسيط (Simple) أضلاعه مبتتقاطعش فداخله وخارجه واضحين؛ أما غير البسيط أضلاعه بتتقاطع.",
                tag: "Exam Focus",
              },
              {
                en: "Convex Polygon: Any line segment connecting two interior points stays completely inside the polygon.",
                ar: "المضلع المحدب (Convex): أي خط توصله بين نقطتين جواه يفضل بالكامل جوا المضلع وميخرجش بره.",
              },
              {
                en: "Why Triangles & Triangulation?: Every triangle is ALWAYS simple, ALWAYS convex, and ALWAYS flat (planar) — so GPUs split polygons and curved spheres into triangle meshes.",
                ar: "ليه المثلث هو بطل الجرافيكس؟ لأنه دايماً Simple ودايماً Convex ودايماً مستوي (Flat)، فعشان كده بنقسّم أي مضلع أو كرة لمثلثات (Triangulation).",
                tag: "Exam Favorite",
              },
            ],
          },
          {
            term: "Text Forms (Stroke vs. Raster) & Curved Objects",
            termAr: "أنواع النصوص (Stroke مقابل Raster) والمنحنيات",
            badge: "Slides 24–29",
            tone: "mint",
            enSummary:
              "Text can be built geometrically (Stroke) for crisp scaling or stored as bitmaps (Raster) for blazing speed via Bit-Block Transfer.",
            arSummary:
              "النصوص ليها طريقتين: طريقة هندسية ناعمة عند التكبير (Stroke) وطريقة بكسلات سريعة جداً (Raster).",
            points: [
              {
                en: "Stroke Text (Vector): Constructed from geometric line segments and curves → scales and rotates smoothly with zero pixelation, but slower to draw.",
                ar: "الـ Stroke Text مرسوم بخطوط ومنحنيات هندسية، فلو كبّرته أو لفيته يفضل ناعم جداً وميبكسلش، لكنه أبطأ.",
              },
              {
                en: "Raster Text (Bitmap): Defined as rectangular bit arrays → extremely fast because hardware copies characters in one Bit-Block Transfer (BitBlt) operation, but becomes jagged if enlarged.",
                ar: "الـ Raster Text متخزّن كـ Bitmap وبيترسم بسرعة صاروخية بعملية Bit-Block Transfer (BitBlt)، بس بيبكسل لو كبّرته.",
                tag: "Exam Focus",
              },
              {
                en: "Two Approaches for Curved Objects: (1) Tessellation — approximate curves/surfaces with small straight segments or flat triangles; (2) Direct mathematical/parametric evaluation.",
                ar: "رسم المنحنيات بيتم بطريقتين: يا إما نقرّبه بخطوط/مثلثات صغيرة جداً، يا إما نحسبه بالمعادلات الرياضية مباشرة.",
              },
            ],
          },
        ],
      },
      {
        id: "ch2-color",
        number: "03",
        titleEn: "Color Perception, RGB vs. CMY, Color Solid & Alpha",
        titleAr: "إدراك الألوان، RGB مقابل CMY، مكعب الألوان، والشفافية",
        cards: [
          {
            term: "Tristimulus Color, Additive (RGB) vs. Subtractive (CMY) & RGBA",
            termAr: "نظرية الألوان الثلاثية و RGB مقابل CMY والشفافية",
            badge: "Slides 32–41",
            tone: "brand",
            enSummary:
              "Because human vision uses 3 cone types, any color can be represented by 3 Tristimulus values — added on light-emitting monitors (RGB) or subtracted on ink printers (CMY).",
            arSummary:
              "عشان العين فيها 3 أنواع مخاريط بس، يكفينا 3 أرقام لتمثيل أي لون: بالجمع في الشاشات (RGB) أو بالطرح في الطابعات (CMY).",
            points: [
              {
                en: "Additive Color Model (RGB — Monitors/Displays): Adds light from Red, Green, Blue primaries. Black = (0,0,0), White = (1,1,1).",
                ar: "نموذج الجمع (RGB) للشاشات: لو طفيت الألوان التلاتة (0,0,0) يطلع أسود، ولو نوّرتهم كلهم (1,1,1) يطلع أبيض.",
                tag: "Exam Focus",
              },
              {
                en: "Subtractive Color Model (CMY — Printers/Ink): Pigments absorb (subtract) wavelengths from white paper. Primaries: Cyan, Magenta, Yellow. White = (0,0,0), Black = (1,1,1).",
                ar: "نموذج الطرح (CMY) للطابعات: الورقة الفاضية أبيض (0,0,0)، ولما تخلط أحبار Cyan و Magenta و Yellow يمتصوا الضوء ويطلع أسود (1,1,1).",
                tag: "Exam Focus",
              },
              {
                en: "3D RGB Color Solid: Unit cube whose corners are Black, White, R, G, B, C, M, Y; the diagonal from (0,0,0) to (1,1,1) represents all shades of gray.",
                ar: "مكعب الألوان ثلاثي الأبعاد أركانه التمانية هي الألوان الأساسية والأبيض والأسود، والقطر بين الأسود والأبيض هو تدرجات الرمادي.",
              },
              {
                en: "24-Bit Color Buffer (16M Colors): 8 bits per channel → 2^24 = 2^4 × 2^20 = 16M colors (where in CS, 1M = 2^20 = 1,048,576).",
                ar: "في الكمبيوتر 1M بتساوي 2^20، فـ 24 بت بتساوي 2^24 = 16M لون (حوالي 16.7 مليون لون).",
                tag: "Formula",
              },
              {
                en: "Opacity / Alpha Channel (RGBA): A = 1.0 means completely OPAQUE (solid); A = 0.0 means completely TRANSPARENT (invisible).",
                ar: "فخ صح وغلط مشهور: قيمة A = 1.0 معناها مُعتم تماماً (Opaque)، وقيمة A = 0.0 معناها شفاف تماماً (Transparent).",
                tag: "Exam Trap",
              },
            ],
          },
        ],
        formulas: [
          {
            labelEn: "RGB ↔ CMY Complement Relations",
            formula: "C = 1 − R   |   M = 1 − G   |   Y = 1 − B",
            workedExampleEn:
              "R + G = Yellow | R + B = Magenta | G + B = Cyan | R + G + B = White",
            arNote:
              "كل لون في CMY هو مكمّل اللون المقابل ليه في RGB (مثلاً Cyan هو أبيض ناقص الأحمر، يعني أخضر + أزرق).",
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Primitive functions = WHAT to display | Attribute functions = HOW to display it.",
        ar: "سؤال MCQ مضمون: Primitive بتحدد WHAT و Attribute بتحدد HOW.",
      },
      {
        en: "Raster Text uses Bit-Block Transfer (BitBlt) for speed; Stroke Text scales cleanly without pixelation.",
        ar: "لو السؤال ذكر Bit-Block Transfer اختار Raster Text فوراً.",
      },
      {
        en: "Additive = RGB (monitors: 0=Black, 1=White) vs. Subtractive = CMY (printers: 0=White, 1=Black).",
        ar: "متلخبطش بين Additive (شاشات) و Subtractive (طابعات)!",
      },
      {
        en: "Alpha (Opacity): A = 1.0 is OPAQUE, A = 0.0 is TRANSPARENT.",
        ar: "A = 1.0 معناها مُعتم (Opaque) مش شفاف!",
      },
    ],
  },

  // ============================================================================
  // CHAPTER 3: Output Primitives & Bresenham's Line Algorithm
  // ============================================================================
  {
    lessonId: CG_LESSON_IDS.CH3,
    courseCode: "CS-321",
    chapterNum: 3,
    titleEn: "Output Primitives & Bresenham's Line Algorithm",
    titleAr: "عناصر الإخراج وخوارزمية Bresenham لرسم الخطوط",
    overviewEn:
      "Covers point plotting, analog vs. digital raster line drawing, coordinate rounding & stair-step jaggies, the Cartesian slope-intercept equation, and the complete derivation, 5-step algorithm, and worked example of Bresenham's integer-only line algorithm.",
    overviewAr:
      "كل خطوة وقانون في شابتر 3 وتحتها شرحها بالعامية: رسم النقطة والخط، الـ Jaggies، اشتقاق معامل القرار p_k في Bresenham بالأعداد الصحيحة، والخطوات الخمس.",
    sections: [
      {
        id: "ch3-basics",
        number: "01",
        titleEn: "Point Plotting, Raster Displays & The Jaggies",
        titleAr: "رسم النقطة والشاشات الرقمية وظاهرة الـ Jaggies",
        cards: [
          {
            term: "Point Plotting, Analog vs. Digital & Coordinate Rounding",
            termAr: "رسم النقطة والفرق بين الأنالوج والديجيتال والتقريب",
            badge: "Pages 1–13",
            tone: "warm",
            enSummary:
              "Raster displays can only illuminate discrete integer pixel positions, forcing continuous line coordinates to be rounded.",
            arSummary:
              "الشاشات الرقمية مبتعرفش غير إحداثيات صحيحة (Integer Pixels)، وده السبب إننا بنحتاج خوارزميات ذكية لرسم الخط.",
            points: [
              {
                en: "Point Plotting & Video Controller: Pixel values are written into the Frame Buffer, then read scan-line by scan-line by the Video Controller to illuminate the screen.",
                ar: "البرنامج بيكتب قيم البكسلات في الـ Frame Buffer، والـ Video Controller بيقراها صف بصف عشان يعرضها على الشاشة.",
              },
              {
                en: "Analog vs. Digital Devices: Analog devices apply smooth continuous deflection voltages (smooth lines); digital raster devices plot discrete integer pixels.",
                ar: "الأجهزة التناظرية بترسم خط ناعم مستمر بالفولت، أما الشاشات الرقمية بترسم نقط متقطعة على شبكة أعداد صحيحة.",
              },
              {
                en: "Stair-Step Effect ('The Jaggies'): Rounding floating-point coordinates (e.g., (10.48, 20.51) → (10, 21)) makes oblique lines look like staircases.",
                ar: "تقريب الأرقام العشرية لأقرب بكسل صحيح بيعمل تعرجات شبه السلم اسمها Jaggies (بتختفي بس في الخط الأفقي والرأسي والـ 45 درجة).",
                tag: "Exam Focus",
              },
              {
                en: "Smoothing Raster Lines: Reduced by increasing screen resolution or applying Antialiasing (adjusting pixel intensities along boundaries).",
                ar: "علاج الـ Jaggies بحاجتين: يا نرفع الـ Resolution، يا نستخدم Antialiasing (تعديل درجات إضاءة البكسلات على الحواف).",
              },
              {
                en: "Cartesian Equation (y = m·x + b): Slope m = Δy/Δx, intercept b = y₁ − m·x₁ — slow in hardware because it needs floating-point multiplication/division and rounding every step.",
                ar: "المعادلة الديكارتية المباشرة بطيئة لأنها بتحتاج ضرب وقسمة كسور وتقريب في كل بكسل.",
              },
            ],
          },
        ],
      },
      {
        id: "ch3-bresenham-derivation",
        number: "02",
        titleEn: "Bresenham's Line Algorithm: Core Idea & Derivation",
        titleAr: "فكرة واشتقاق خوارزمية Bresenham للأعداد الصحيحة",
        flowBanner: {
          labelEn: "Why Bresenham Is Fast & Hardware-Friendly",
          steps: [
            "Zero Floating-Point Math",
            "Integer Addition & Subtraction Only",
            "×2 via Bit-Shift",
            "Exact Nearest Pixel Choice",
          ],
          captionAr:
            "خوارزمية Bresenham كلها جمع وطرح أعداد صحيحة فقط (والضرب في 2 بيحصل بـ Bit Shift) من غير أي كسور أو تقريب!",
        },
        cards: [
          {
            term: "Step-by-Step Derivation of p_k and p_(k+1) (for 0 < m < 1)",
            termAr: "خطوات اشتقاق معامل القرار p_k في الامتحان",
            badge: "Pages 14–26",
            tone: "brand",
            enSummary:
              "At each column x_k + 1, we compare distances d₁ (lower pixel y_k) and d₂ (upper pixel y_k + 1) and eliminate fractions by multiplying by Δx.",
            arSummary:
              "في كل خطوة بنختار بين بكسلين بس (نفس y_k أو اللي فوقه y_k + 1) حسب إشارة معامل القرار p_k:",
            points: [
              {
                en: "Step 1 — True y & Separations: y = m(x_k + 1) + b; lower separation d₁ = y − y_k; upper separation d₂ = (y_k + 1) − y.",
                ar: "d₁ هي المسافة للبكسل السفلي، و d₂ هي المسافة للبكسل العلوي؛ لو d₁ − d₂ < 0 يبقى السفلي أقرب.",
              },
              {
                en: "Step 2 — Integer Decision Parameter p_k: Multiply (d₁ − d₂) by Δx (> 0) to remove division: p_k = 2Δy·x_k − 2Δx·y_k + c, where c = 2Δy + Δx(2b − 1).",
                ar: "ضربنا في Δx الموجب عشان نلغي الكسر m = Δy/Δx من غير ما نغيّر الإشارة، فتحولت المعادلة كلها لأعداد صحيحة.",
                tag: "Derivation",
              },
              {
                en: "Step 3 — Recursive Update (Eliminating c): Subtracting p_(k+1) − p_k cancels constant c: p_(k+1) = p_k + 2Δy − 2Δx(y_(k+1) − y_k).",
                ar: "لما طرحنا p_(k+1) − p_k الثابت c طار تماماً! و (y_(k+1) − y_k) يا إما 0 أو 1.",
                tag: "Derivation",
              },
              {
                en: "Step 4 — Initial Value p₀: Evaluated at starting point (x₀, y₀) → p₀ = 2Δy − Δx.",
                ar: "أول معامل قرار بنبدأ بيه دايماً: p₀ = 2Δy − Δx.",
                tag: "Formula",
              },
              {
                en: "Step 5 — Decision Rule (Repeat Δx times): If p_k < 0 → plot (x_k+1, y_k) & add 2Δy. If p_k ≥ 0 → plot (x_k+1, y_k+1) & add (2Δy − 2Δx).",
                ar: "القاعدة الذهبية للجدول: سالب → ثبّت y واجمع 2Δy؛ صفر أو موجب → زوّد y+1 واجمع (2Δy − 2Δx).",
                tag: "Exam Focus",
              },
            ],
          },
        ],
        formulas: [
          {
            labelEn: "Bresenham's Line Algorithm Summary Formulas (0 < m < 1)",
            formula:
              "p₀ = 2Δy − Δx  |  p_k < 0 ⇒ (x+1, y), p + 2Δy  |  p_k ≥ 0 ⇒ (x+1, y+1), p + 2Δy − 2Δx",
            workedExampleEn:
              "(20, 10) → (30, 18): Δx = 10, Δy = 8, 2Δy = 16, 2Δy − 2Δx = −4, p₀ = 6 (10 steps: k = 0..9).",
            arNote:
              "لحل كل حالات المسائل (بما فيها الميل الحاد m > 1 والميل السالب) افتح بونص «شرح مسائل شابتر 3 و 4» جوا تاب الشرح التفاعلي.",
          },
        ],
        table: {
          titleEn: "Official Lecture Example: (20, 10) → (30, 18) — First 5 Steps",
          titleAr: "أول 5 خطوات من مثال المحاضرة الرسمي",
          headers: [
            { label: "k", dir: "ltr" },
            { label: "p_k", dir: "ltr" },
            { label: "Rule", dir: "ltr" },
            { label: "Plotted Pixel", dir: "ltr" },
            { label: "Next p_(k+1)", dir: "ltr" },
          ],
          rows: [
            [
              { text: "0", dir: "ltr" },
              { text: "6", dir: "ltr", highlight: true },
              { text: "≥ 0 (+1, +1)", dir: "ltr" },
              { text: "(21, 11)", dir: "ltr", highlight: true },
              { text: "6 + (−4) = 2", dir: "ltr" },
            ],
            [
              { text: "1", dir: "ltr" },
              { text: "2", dir: "ltr" },
              { text: "≥ 0 (+1, +1)", dir: "ltr" },
              { text: "(22, 12)", dir: "ltr", highlight: true },
              { text: "2 + (−4) = −2", dir: "ltr" },
            ],
            [
              { text: "2", dir: "ltr" },
              { text: "−2", dir: "ltr" },
              { text: "< 0 (+1, +0)", dir: "ltr" },
              { text: "(23, 12)", dir: "ltr", highlight: true },
              { text: "−2 + 16 = 14", dir: "ltr" },
            ],
            [
              { text: "3", dir: "ltr" },
              { text: "14", dir: "ltr" },
              { text: "≥ 0 (+1, +1)", dir: "ltr" },
              { text: "(24, 13)", dir: "ltr", highlight: true },
              { text: "14 + (−4) = 10", dir: "ltr" },
            ],
            [
              { text: "4", dir: "ltr" },
              { text: "10", dir: "ltr" },
              { text: "≥ 0 (+1, +1)", dir: "ltr" },
              { text: "(25, 14)", dir: "ltr", highlight: true },
              { text: "10 + (−4) = 6", dir: "ltr" },
            ],
          ],
        },
      },
    ],
    examTraps: [
      {
        en: "Always start from the LEFT endpoint (smaller x). If given (15, 10) and (9, 6), swap first to start at (9, 6).",
        ar: "لازم تبدأ دايماً من النقطة اليسرى (الأصغر في x) قبل ما تحسب Δx و Δy.",
      },
      {
        en: "When p_k = 0, treat it as p_k ≥ 0 → increment y and add (2Δy − 2Δx).",
        ar: "فخ الصفر: p_k = 0 بيتبع حالة الموجب (p_k ≥ 0) مش السالب!",
      },
      {
        en: "Bresenham uses ONLY integer addition, subtraction, and multiplication by 2 (bit-shift) — NO floating-point operations.",
        ar: "سؤال نظري مضمون: خوارزمية Bresenham بتستخدم أعداد صحيحة فقط بدون أي Floating-Point.",
      },
      {
        en: "For steep lines (|m| > 1), swap x and y roles: step y by +1 and use p₀ = 2Δx − Δy.",
        ar: "لو الميل أكبر من 1 (Δy > Δx) بنبدّل دور x و y في كل القوانين.",
      },
    ],
  },

  // ============================================================================
  // CHAPTER 4: Circle-Generating & Midpoint Algorithm
  // ============================================================================
  {
    lessonId: CG_LESSON_IDS.CH4,
    courseCode: "CS-321",
    chapterNum: 4,
    titleEn: "Circle-Generating & Midpoint Algorithm",
    titleAr: "خوارزمية Midpoint لرسم الدوائر",
    overviewEn:
      "Covers the circle definition, drawbacks of Cartesian (Eq 1) and Polar (Eq 2) methods, 8-way octant symmetry, and the complete derivation, 6-step algorithm, comparison with Bresenham's line algorithm, and worked examples (r=10, r=8, r=5).",
    overviewAr:
      "كل سطر في شابتر 4 وتحته شرحه بالعامية: المعادلة الديكارتية والقطبية، التماثل الثماني، خوارزمية Midpoint Circle بالخطوات الستة، ومقارنتها بـ Bresenham.",
    sections: [
      {
        id: "ch4-equations",
        number: "01",
        titleEn: "Circle Equations (Cartesian vs. Polar) & 8-Way Symmetry",
        titleAr: "معادلات الدائرة والتماثل الثماني",
        flowBanner: {
          labelEn: "8-Way Octant Symmetry (8× Speedup)",
          steps: [
            "Compute 1 Octant (45°: x = 0 to x = y)",
            "Reflect across y = x → (y, x)",
            "Flip Signs (±x, ±y) & (±y, ±x)",
            "All 8 Octants Done!",
          ],
          captionAr:
            "بنحسب ثُمن واحد بس من الدائرة (زاوية 45 درجة من x=0 لحد x=y) ونستنتج الـ 7 أثمان الباقية بدون أي حسابات إضافية!",
        },
        cards: [
          {
            term: "Cartesian Equation (1), Polar Form (2) & Octant Symmetry",
            termAr: "المعادلة الديكارتية والقطبية والتماثل الثماني",
            badge: "Pages 1–16",
            tone: "warm",
            enSummary:
              "Direct Cartesian and Polar circle equations are too slow for raster hardware, which motivates 8-way symmetry and incremental integer arithmetic.",
            arSummary:
              "المعادلة الديكارتية والقطبية بطيئتين على الهاردوير، وده اللي خلّانا نستخدم التماثل الثماني وخوارزمية Midpoint.",
            points: [
              {
                en: "Cartesian Equation (1): (x − x_c)² + (y − y_c)² = r² → y = y_c ± √(r² − (x − x_c)²).",
                ar: "دي المعادلة الديكارتية اللي بنعوّض فيها بـ x ونحسب y بالجذر التربيعي.",
              },
              {
                en: "Two Drawbacks of Cartesian Method: (1) Heavy square-root computations at every step, (2) Non-uniform spacing between pixels (bunched at top, gaps on sides).",
                ar: "عيوب الطريقة الديكارتية حاجتين بيتسألوا دايماً: الجذر التربيعي التقيل، وتباعد غير منتظم بين البكسلات.",
                tag: "Exam Focus",
              },
              {
                en: "Polar Parametric Form (Equation 2): x = x_c + r·cos(θ), y = y_c + r·sin(θ) with angular step size Δθ = 1 / r radians — fixes spacing, but cos/sin are still slow!",
                ar: "المعادلة القطبية بتحل مشكلة التباعد بخطوة زاوية Δθ = 1/r، لكن حسابات sin و cos لسه تقيلة على المعالج.",
                tag: "Formula",
              },
              {
                en: "8-Way Symmetry Rule: Every general point (x, y) yields 8 points: (±x, ±y) and (±y, ±x); shifted by (+x_c, +y_c). Boundary points (x=0, y=0, or x=y) yield only 4 distinct points!",
                ar: "أي نقطة عادية بتطلع 8 نقاط؛ لكن لو على المحور (زي (0,10)) أو على القطر (زي (7,7)) بتطلع 4 نقاط مميزة بس!",
                tag: "Exam Trap",
              },
              {
                en: "First-Octant Slope Range: As we move from top (0, r) to diagonal (x = y), the circle slope varies smoothly from 0 to −1.",
                ar: "في الثُمن الأول ميل الدائرة بيبدأ من 0 فوق خالص لحد −1 عند القطر x = y.",
              },
            ],
          },
        ],
      },
      {
        id: "ch4-midpoint",
        number: "02",
        titleEn: "Midpoint Circle Algorithm (6 Steps) & Comparison",
        titleAr: "خوارزمية Midpoint Circle بالخطوات الستة ومقارنتها بالخط",
        cards: [
          {
            term: "Circle Function f_circle(x, y) & The 6-Step Algorithm",
            termAr: "دالة الدائرة والخطوات الستة للخوارزمية",
            badge: "Pages 17–27",
            tone: "mint",
            enSummary:
              "Midpoint Circle eliminates square roots by testing f_circle(x, y) = x² + y² − r² at the midpoint (x_k + 1, y_k − 1/2) using integer increments.",
            arSummary:
              "عشان نلغي الجذر التربيعي بنختبر إشارة دالة الدائرة عند نقطة المنتصف بين y_k و y_k − 1:",
            points: [
              {
                en: "Sign of f_circle(x, y) = x² + y² − r²: Negative (< 0) = INSIDE circle; Zero (= 0) = ON boundary; Positive (> 0) = OUTSIDE circle.",
                ar: "لو الناتج سالب يبقى النقطة جوه الدائرة، لو صفر يبقى على المحيط بالظبط، لو موجب يبقى بره الدائرة.",
                tag: "Exam Focus",
              },
              {
                en: "Step 1 — Origin Setup: Input radius r and center (x_c, y_c); ALWAYS start computing around origin at (x₀, y₀) = (0, r).",
                ar: "ابدأ دايماً من أعلى نقطة عند نقطة الأصل (0, r) — إوعى تدخّل المركز (x_c, y_c) في الحسابات!",
              },
              {
                en: "Step 2 — Initial Parameter p₀: p₀ = 5/4 − r (rounded to integer p₀ = 1 − r whenever r is an integer).",
                ar: "أول قيمة لـ p₀ بتساوي 1 − r لو نصف القطر رقم صحيح (أو 5/4 − r لو كسر أو مطلوب بالنص).",
                tag: "Formula",
              },
              {
                en: "Step 3 — Decision Test: If p_k < 0 → next (x_k+1, y_k) and p_(k+1) = p_k + 2x_(k+1) + 1. If p_k ≥ 0 → next (x_k+1, y_k−1) and p_(k+1) = p_k + 2x_(k+1) + 1 − 2y_(k+1).",
                ar: "لو p_k سالب ثبّت y واجمع 2x_(k+1)+1؛ لو صفر أو موجب نزّل y−1 واطرح كمان 2y_(k+1) — خلي بالك بتستخدم x,y الجداد!",
                tag: "Exam Favorite",
              },
              {
                en: "Steps 4, 5 & 6 — Symmetry, Shift & Stop: Mirror into all 8 octants, shift every pixel by (+x_c, +y_c), and STOP as soon as x ≥ y.",
                ar: "طلّع الـ 7 نقاط المتماثلة، اجمع المركز (+x_c, +y_c) في الآخر، وقف اللوب أول ما تلاقي x ≥ y.",
              },
            ],
          },
        ],
        formulas: [
          {
            labelEn: "Midpoint Circle Complete Update Formulas",
            formula:
              "p₀ = 1 − r (or 5/4 − r)  |  p_k < 0 ⇒ p + 2x_(k+1) + 1  |  p_k ≥ 0 ⇒ p + 2x_(k+1) + 1 − 2y_(k+1)",
            workedExampleEn:
              "r = 10 at (0,0): Start (0,10), p₀ = −9 → (1,10), (2,10), (3,10), (4,9), (5,9), (6,8), (7,7) — stops at x = y = 7.",
            arNote:
              "راجع الجدول الكامل لـ r=10 و r=8 و r=5 والمركز المزاح (20,30) في بونص «شرح مسائل شابتر 3 و 4» جوا تاب الشرح التفاعلي.",
          },
        ],
        table: {
          titleEn: "Bresenham Line (Ch 3) vs. Midpoint Circle (Ch 4)",
          titleAr: "مقارنة سريعة عشان متلخبطش القوانين في الامتحان",
          headers: [
            { label: "Feature", dir: "ltr" },
            { label: "Bresenham Line (Ch 3)", dir: "ltr" },
            { label: "Midpoint Circle (Ch 4)", dir: "ltr" },
          ],
          rows: [
            [
              { text: "Starting Point", dir: "ltr" },
              { text: "Left endpoint (x₀, y₀)", dir: "ltr" },
              { text: "Top point (0, r) at origin", dir: "ltr", highlight: true },
            ],
            [
              { text: "Initial p₀", dir: "ltr" },
              { text: "p₀ = 2Δy − Δx", dir: "ltr", highlight: true },
              { text: "p₀ = 1 − r  (or 5/4 − r)", dir: "ltr", highlight: true },
            ],
            [
              { text: "When p_k ≥ 0", dir: "ltr" },
              { text: "y INCREASES: y_k + 1", dir: "ltr" },
              { text: "y DECREASES: y_k − 1", dir: "ltr", highlight: true },
            ],
            [
              { text: "Increment Terms", dir: "ltr" },
              { text: "Constant (2Δy or 2Δy − 2Δx)", dir: "ltr" },
              { text: "Dynamic (2x_(k+1) and 2y_(k+1))", dir: "ltr" },
            ],
            [
              { text: "Stopping Condition", dir: "ltr" },
              { text: "Repeat Δx times", dir: "ltr" },
              { text: "Stop when x ≥ y", dir: "ltr", highlight: true },
            ],
          ],
        },
      },
    ],
    examTraps: [
      {
        en: "Always compute Midpoint Circle around origin (0, 0) FIRST, then add (+x_c, +y_c) at the end — NEVER plug (x_c, y_c) into p_k!",
        ar: "أخطر غلطة في الميدتيرم: احسب الجدول عند (0,0) الأول، وفي الآخر خالص اجمع المركز (+x_c, +y_c).",
      },
      {
        en: "Always use the NEW coordinates 2x_(k+1) and 2y_(k+1) when updating p_(k+1).",
        ar: "دايماً عوّض بإحداثيات النقطة الجديدة (بعد ما زوّدت x أو نقصت y) مش القديمة!",
      },
      {
        en: "When p_k ≥ 0 in Circle algorithm, y DECREASES (y_k − 1), opposite to Bresenham Line where y increases.",
        ar: "في الدائرة y بتنقص (−1) لما p_k ≥ 0 لأننا نازلين من فوق (0, r) لحد القطر x = y.",
      },
      {
        en: "Polar step size Δθ = 1 / r (radians), and first-octant slope ranges from 0 to −1.",
        ar: "سؤالين MCQ مضمونين: الخطوة الزاوية 1/r، وميل الثُمن الأول من 0 إلى −1.",
      },
    ],
  },
];
