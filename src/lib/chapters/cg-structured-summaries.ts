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
      "ملخص شامل للشابتر الأول: المجالات الأربعة للرسوميات، مكونات الهاردوير الستة والـ Frame Buffer، طبيعة الضوء وكاميرا الثقب (Pinhole Camera)، العين البشرية، ونموذج الكاميرا الاصطناعية (Synthetic-Camera API).",
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
            "أي حاجة غير الأربعة دول (زي Memory أو Frame Buffer) تعتبر هاردوير مش مجال تطبيق.",
        },
        cards: [
          {
            term: "Computer Graphics Definition",
            badge: "Pages 1–3",
            enSummary:
              "Concerned with all aspects of producing pictures or images using a computer. Began humbly ~50 years ago displaying a few lines on a Cathode-Ray Tube (CRT).",
            enBullets: [
              "Input is a mathematical/geometric description (models/data) → Output is an image.",
              "Contrast with Image Processing: Image → enhanced Image.",
            ],
            arNote:
              "علم الجرافيكس مهتم بكل خطوات إنتاج الصور بالكمبيوتر من وصف رياضي، وبدأ زمان بخطوط بسيطة على شاشة CRT.",
            tone: "brand",
          },
          {
            term: "1. Display of Information & Scientific Visualization",
            badge: "Pages 5–7",
            enSummary:
              "Visualizing complex datasets so humans can interpret them quickly — from ancient maps and architecture blueprints to modern medical imaging (CT, MRI, Ultrasound) and scientific plots.",
            enBullets: [
              "Medical imaging turns raw 3D scanner measurements into readable visual cross-sections.",
              "GIS & maps represent geographic data visually.",
            ],
            arNote:
              "تحويل الأرقام والبيانات الضخمة (زي أشعة CT و MRI والخرائط) لصور واضحة العين تفهمها في ثانية.",
            tone: "neutral",
          },
          {
            term: "2. Design (CAD): Overdetermined vs. Underdetermined",
            badge: "Pages 8–12",
            enSummary:
              "Engineering design is an iterative process using Computer-Aided Design (CAD) in architecture, VLSI circuits, cars, and aircraft.",
            enBullets: [
              "Overdetermined problem: Too many constraints → NO solution exists.",
              "Underdetermined problem: Too few constraints → MANY solutions exist (designer explores interactively).",
            ],
            arNote:
              "مقارنة امتحان ثابتة: لو القيود أكتر من اللازم (Overdetermined) مفيش حل، ولو القيود أقل (Underdetermined) فيه حلول كتير فالمهندس يجربها تفاعلياً بـ CAD.",
            tone: "warm",
          },
          {
            term: "3. Simulation & Animation · 4. User Interfaces & 5 GUI Icons",
            badge: "Pages 13–25",
            enSummary:
              "Real-time flight simulators and VLSI arcade games drove graphics hardware forward; modern GUIs rely on visual paradigms (windows, menus, pointing devices) and 5 icon types.",
            enBullets: [
              "5 GUI Icon Types: (1) Resemblance (picture of object), (2) Exemplar (typical example), (3) Symbolic (abstract higher-level concept), (4) Arbitrary (learned convention), (5) Analogy (related metaphor).",
            ],
            arNote:
              "ألعاب الـ Arcade ومحاكيات الطيران طوّرت الجرافيكس، وواجهات المستخدم (GUI) بتعتمد على 5 أنواع أيقونات احفظ أسماءهم كويس.",
            tone: "mint",
          },
        ],
      },
      {
        id: "ch1-hardware",
        number: "02",
        titleEn: "Graphics System Architecture, Frame Buffer & CRT",
        titleAr: "معمارية نظام الجرافيكس والـ Frame Buffer وشاشة الـ CRT",
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
            "دي العناصر الستة للهاردوير؛ الـ Frame Buffer هو الذاكرة اللي بتخزن الصورة كبكسلات قبل ما تتعرض.",
        },
        cards: [
          {
            term: "Pixels (Pels), Raster, Resolution & Depth",
            badge: "Pages 29–32",
            enSummary:
              "Almost all modern graphics systems are raster-based: an image is stored as a 2D array of picture elements (pixels / pels) inside the Frame Buffer.",
            enBullets: [
              "Resolution: Number of pixels in the frame buffer (e.g., 1920 × 1080) → determines detail/sharpness.",
              "Depth (Precision): Number of bits stored per pixel (n bits → 2^n possible colors).",
              "1-bit deep = 2 colors (binary black & white).",
              "Full-Color (True-Color / RGB) = 24 or more bits per pixel (8 bits R + 8 bits G + 8 bits B = 16.7M colors).",
              "High Dynamic Range (HDR) = 12+ bits per color channel (36+ bits/pixel).",
            ],
            arNote:
              "الـ Resolution هو عدد البكسلات (دقة التفاصيل)، والـ Depth هو عدد البتات لكل بكسل (عدد الألوان = 2 أس عدد البتات). والـ Full-Color بيكون 24 بت أو أكتر.",
            tone: "brand",
          },
          {
            term: "CPU vs. GPU & Rasterization (Scan Conversion)",
            badge: "Page 33",
            enSummary:
              "The CPU runs application logic, while the Graphics Processing Unit (GPU) executes specialized graphical functions in parallel.",
            enBullets: [
              "Rasterization (Scan Conversion): Converting geometric primitives (lines, polygons) into discrete pixels inside the frame buffer.",
            ],
            arNote:
              "الـ GPU متخصص في العمليات الرسومية المتوازية، وعملية تحويل الخطوط والأشكال لبكسلات اسمها Rasterization أو Scan Conversion.",
            tone: "neutral",
          },
          {
            term: "CRT Monitor, DAC & Input Devices",
            badge: "Pages 34–37",
            enSummary:
              "A Cathode-Ray Tube (CRT) shoots an electron beam across a phosphor-coated screen, steered by horizontal and vertical deflection plates.",
            enBullets: [
              "DAC (Digital-to-Analog Converter): Converts digital pixel values from the frame buffer into analog voltages for the CRT beam.",
              "Refresh rate must be fast enough (~50–85 Hz) to prevent flicker.",
              "Input devices: Keyboard, Mouse, Trackball, Joystick, Data Tablet, Light Pen.",
            ],
            arNote:
              "شاشة الـ CRT بتشتغل بشعاع إلكترونات على طبقة فوسفور، والـ DAC بيحوّل الأرقام الديجيتال من الـ Frame Buffer لفولت أنالوج يحرّك الشعاع.",
            tone: "mint",
          },
        ],
        formulas: [
          {
            labelEn: "Number of Possible Colors from Bit Depth (n)",
            formula: "Colors = 2^n   |   Frame Buffer Size = Width × Height × Depth (bits)",
            workedExampleEn:
              "1-bit → 2 colors | 8-bit → 256 colors | 24-bit (Full-Color) → 2^24 ≈ 16.7 million colors",
            arNote:
              "قانون مباشر في الامتحان: لو قالك Depth = 8 bits يبقى عدد الألوان 2^8 = 256، ولو 24 bits يبقى 16.7 مليون لون (True Color).",
          },
        ],
      },
      {
        id: "ch1-optics",
        number: "03",
        titleEn: "Objects, Viewers, Light, Pinhole Camera & Human Eye",
        titleAr: "الأجسام، الضوء، كاميرا الثقب، والعين البشرية",
        cards: [
          {
            term: "Basic Entities: Objects, Viewers & Light",
            badge: "Pages 38–44",
            enSummary:
              "Forming an image requires two basic entities — Objects (independent of viewer) and a Viewer — plus Light sources illuminating the scene.",
            enBullets: [
              "Light is electromagnetic radiation in the visible spectrum: 350 nm (violet) to 780 nm (red).",
              "Physical image: Formed by real optical devices (camera/eye). Synthetic image: Computed mathematically by computer graphics.",
            ],
            arNote:
              "عشان تتكون صورة محتاج جسم (Object) ومشاهد (Viewer) ومصدر ضوء. الطيف المرئي للعين البشرية من 350 نانومتر (بنفسجي) لـ 780 نانومتر (أحمر).",
            tone: "brand",
          },
          {
            term: "Pinhole Camera & 4 Camera Specifications",
            badge: "Pages 45–51",
            enSummary:
              "A light-tight box with a tiny hole at the origin (0,0,0) and film plane at z = −d; every point (x, y, z) projects onto an inverted point (x_p, y_p, −d).",
            enBullets: [
              "Infinite depth of field (everything is in focus), but very little light enters.",
              "4 Camera Specifications: (1) Position (COP), (2) Orientation (up/view direction), (3) Focal length d (field of view), (4) Film plane size/shape.",
            ],
            arNote:
              "كاميرا الثقب بتطلّع صورة مقلوبة (عشان الإشارة السالبة في المعادلة) وكل الأجسام فيها واضحة (Infinite Depth of Field)، وتحتاج 4 مواصفات لتحديدها.",
            tone: "warm",
          },
          {
            term: "Human Visual System: Rods vs. Cones",
            badge: "Pages 52–54",
            enSummary:
              "Light enters through the Cornea, Iris (controls aperture/light amount), and Lens (focuses onto the Retina).",
            enBullets: [
              "Rods (Scotopic vision): Sensitive to low light (night vision), monochrome (no color), located mostly in periphery.",
              "Cones (Photopic vision): Active in bright light, responsible for COLOR vision (3 types: Red, Green, Blue peaks), concentrated in fovea.",
            ],
            arNote:
              "مقارنة مضمونة في الامتحان: الـ Rods للرؤية الليلية (Scotopic) بدون ألوان، أما الـ Cones ففي النور القوي (Photopic) ومسؤولة عن الألوان (3 أنواع).",
            tone: "mint",
          },
          {
            term: "Programmer's Interface (API) & Synthetic-Camera Model",
            badge: "Pages 55–58",
            enSummary:
              "An API (like OpenGL) separates the application program from the hardware, letting programmers specify 3D scenes via the Synthetic-Camera Model.",
            enBullets: [
              "4 Core Specifications in a 3D API: (1) Objects (vertices/primitives), (2) Viewer (camera), (3) Light sources, (4) Material properties.",
              "Key advantage: Objects and Viewer are specified INDEPENDENTLY.",
            ],
            arNote:
              "الـ API (زي OpenGL) بيخلّيك توصف المشهد بـ 4 حاجات منفصلة: الأجسام، الكاميرا، الإضاءة، وخصائص المواد — من غير ما تشغل بالك بنوع كارت الشاشة.",
            tone: "neutral",
          },
        ],
        formulas: [
          {
            labelEn: "Pinhole Camera Perspective Projection Equations",
            formula: "x_p = −x / (z / d) = −(d · x) / z    |    y_p = −y / (z / d) = −(d · y) / z    |    z_p = −d",
            workedExampleEn:
              "Angle of View (Field of View): θ = 2 · tan⁻¹(h / 2d), where h is film height and d is focal length.",
            arNote:
              "الإشارة السالبة معناها إن الصورة مقلوبة (Inverted) على الفيلم! وكل ما المسافة d تزيد زاوية الرؤية θ بتقل (Zoom In).",
          },
        ],
        table: {
          titleEn: "Human Retina Receptors: Rods vs. Cones",
          titleAr: "مقارنة سريعة بين الـ Rods و الـ Cones في شبكية العين",
          headers: [
            { label: "Property", dir: "ltr" },
            { label: "Rods (العصي)", dir: "ltr" },
            { label: "Cones (المخاريط)", dir: "ltr" },
          ],
          rows: [
            [
              { text: "Vision Type", dir: "ltr" },
              { text: "Scotopic (low light / night)", dir: "ltr", highlight: true },
              { text: "Photopic (bright light / day)", dir: "ltr", highlight: true },
            ],
            [
              { text: "Color Detection", dir: "ltr" },
              { text: "No (monochrome / grayscale)", dir: "ltr" },
              { text: "Yes (3 types: R, G, B)", dir: "ltr", highlight: true },
            ],
            [
              { text: "Sensitivity", dir: "ltr" },
              { text: "Very high sensitivity to dim light", dir: "ltr" },
              { text: "High spatial acuity / detail", dir: "ltr" },
            ],
          ],
        },
      },
    ],
    examTraps: [
      {
        en: "Overdetermined = TOO MANY constraints (no solution) vs. Underdetermined = TOO FEW constraints (many solutions).",
        ar: "تريكة متكررة: Overdetermined يعني مفيش حل، و Underdetermined يعني فيه حلول كتير — اوعى تعكسهم!",
      },
      {
        en: "Visible electromagnetic spectrum is strictly 350 nm (violet) to 780 nm (red).",
        ar: "احفظ الرقمين بدقة: الطيف المرئي من 350 لـ 780 نانومتر.",
      },
      {
        en: "Full-color (RGB) systems require 24 or more bits per pixel (NOT 8 bits and NOT 16 bits).",
        ar: "نظام الـ Full-Color بيحتاج 24 بت أو أكتر لكل بكسل (8 لكل قناة R, G, B).",
      },
      {
        en: "Rods = Scotopic (night, no color) | Cones = Photopic (day, 3 color types).",
        ar: "اربط حرف C في Cones بكلمة Color عشان متتلخبطش بينهم أبداً.",
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
      "ملخص شامل للشابتر الثاني: نموذج الصندوق الأسود، المجموعات السبع للدوال الرسومية، الفرق بين Geometric و Raster Primitives، المضلعات والتثليث، النصوص، ونماذج الألوان RGB و CMY والشفافية Alpha.",
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
            "Output: Graphics to Display Devices",
          ],
          captionAr:
            "المبرمج مش محتاج يعرف تفاصيل الهاردوير الداخلية؛ بيبعت مدخلات عبر الـ API وياخد رسومات كمخرج.",
        },
        cards: [
          {
            term: "1. Primitive Functions vs. 2. Attribute Functions",
            badge: "Slides 6–7",
            enSummary:
              "The single most tested distinction in Ch 2: Primitive functions define WHAT to draw; Attribute functions govern HOW it appears.",
            enBullets: [
              "Primitive functions: Low-level objects the system can display (points, line segments, polygons, pixels, text, curves).",
              "Attribute functions: Appearance properties (color, line style/width, polygon fill pattern, font/typeface).",
            ],
            arNote:
              "احفظها كده: Primitive = إيه اللي هترسمه (What)؟ Attribute = هيظهر إزاي (How: لونه، سُمكه، نوع الخط)؟",
            tone: "brand",
          },
          {
            term: "3. Viewing & 4. Transformation Functions",
            badge: "Slide 8",
            enSummary:
              "Viewing functions specify camera views (position, orientation, lens/clipping); Transformation functions move and reshape objects.",
            enBullets: [
              "Transformations include: Translation (move), Rotation (turn), and Scaling (resize).",
            ],
            arNote:
              "الـ Viewing بتتحكم في الكاميرا وزاوية النظر، والـ Transformation بتحرك وتلف وتكبّر/تصغّر الأجسام.",
            tone: "neutral",
          },
          {
            term: "5. Input, 6. Control & 7. Query Functions",
            badge: "Slides 9–11",
            enSummary:
              "The remaining 3 API groups handle user interaction, window/error management, and inspecting system capabilities.",
            enBullets: [
              "Input functions: Deal with interactive devices (keyboard, mouse, data tablet).",
              "Control functions: Communicate with the window system, initialize programs, and handle errors.",
              "Query functions: Retrieve current system properties (e.g., screen resolution, color depth, frame buffer specs) to write device-independent code.",
            ],
            arNote:
              "الـ Input بتقرأ من الماوس والكيبورد، الـ Control بتهيئ النوافذ وتعالج الأخطاء، والـ Query بتسأل الجهاز عن إمكانياته عشان الكود يشتغل على أي شاشة.",
            tone: "mint",
          },
        ],
      },
      {
        id: "ch2-primitives-polygons",
        number: "02",
        titleEn: "Geometric vs. Raster Primitives, Polygons & Triangulation",
        titleAr: "الـ Primitives والمضلعات والتثليث (Triangulation)",
        cards: [
          {
            term: "Two Classes of Primitives: Geometric vs. Raster",
            badge: "Slides 12–13",
            enSummary:
              "Geometric primitives are specified by vertices in 2D/3D space and pass through the geometric pipeline; Raster (image) primitives are arrays of pixels that bypass geometric transformations.",
            enBullets: [
              "Geometric: Points, line segments, polygons, curves (transformed, clipped, then rasterized).",
              "Raster: Bitmaps / pixel rectangles (copied directly into the frame buffer).",
            ],
            arNote:
              "الـ Geometric بتتوصف بنقاط (Vertices) وتعدي على الـ Pipeline، أما الـ Raster فهي مصفوفة بكسلات جاهزة بتتنقل مباشرة للـ Frame Buffer.",
            tone: "brand",
          },
          {
            term: "Polylines, Polygons & Simple vs. Non-Simple",
            badge: "Slides 14–18",
            enSummary:
              "A polyline is a connected sequence of line segments; when closed with a well-defined interior, it forms a polygon.",
            enBullets: [
              "Simple Polygon: No two edges cross each other → clearly defined inside and outside.",
              "Non-Simple Polygon: Edges intersect/cross → interior is ambiguous.",
              "Convex Polygon: Any line segment joining two interior points lies completely inside (all interior angles ≤ 180°).",
              "Polygon display modes: Edges only (wireframe), Filled solid color, or Pattern/Texture filled.",
            ],
            arNote:
              "المضلع البسيط (Simple) أضلاعه مبتتقاطعش فجوه وبره واضحين؛ والمحدب (Convex) أي خط بين نقطتين جواه يفضل بالكامل جواه.",
            tone: "warm",
          },
          {
            term: "Triangles & Triangulation",
            badge: "Slides 19–23",
            enSummary:
              "Every triangle is ALWAYS simple, ALWAYS convex, and ALWAYS flat (planar) — that is why GPUs break complex polygons and curved spheres down into triangles (Triangulation / Tessellation).",
            enBullets: [
              "A triangle has 3 non-collinear vertices defining a unique plane.",
              "A sphere or curved surface is approximated by a mesh of small triangles (more triangles = smoother curve).",
            ],
            arNote:
              "ليه كروت الشاشة بتعشق المثلثات؟ لأن أي مثلث دايماً Simple ودايماً Convex ودايماً مستوي (Flat) — وعشان كده بنقسّم أي مضلع معقد لمثلثات (Triangulation).",
            tone: "mint",
          },
        ],
      },
      {
        id: "ch2-text-curves",
        number: "03",
        titleEn: "Text (Stroke vs. Raster) & Curved Objects",
        titleAr: "النصوص (Stroke مقابل Raster) والأجسام المنحنية",
        table: {
          titleEn: "Stroke Text vs. Raster Text Comparison",
          titleAr: "مقارنة بين نوعي النصوص في الرسوميات",
          headers: [
            { label: "Feature", dir: "ltr" },
            { label: "Stroke Text (Vector)", dir: "ltr" },
            { label: "Raster Text (Bitmap)", dir: "ltr" },
          ],
          rows: [
            [
              { text: "Representation", dir: "ltr" },
              { text: "Built from geometric primitives (line segments / curves)", dir: "ltr" },
              { text: "Defined as rectangular arrays of bits (bitmaps)", dir: "ltr" },
            ],
            [
              { text: "Scaling & Rotation", dir: "ltr" },
              { text: "Scales & rotates smoothly with zero pixelation ✓", dir: "ltr", highlight: true },
              { text: "Becomes blocky/jagged when enlarged (requires separate bitmap per size)", dir: "ltr" },
            ],
            [
              { text: "Rendering Speed", dir: "ltr" },
              { text: "Slower (must rasterize geometric strokes)", dir: "ltr" },
              { text: "Very fast via Bit-Block Transfer (BitBlt) ✓", dir: "ltr", highlight: true },
            ],
          ],
        },
        cards: [
          {
            term: "Bit-Block Transfer (BitBlt) & Curved Objects",
            badge: "Slides 27–29",
            enSummary:
              "Raster text achieves high speed because hardware copies character bitmaps directly into the frame buffer using a single Bit-Block Transfer (BitBlt) operation.",
            enBullets: [
              "Two approaches for Curved Objects: (1) Tessellation — approximate the curve/surface with tiny line segments or flat polygons/triangles, (2) Direct mathematical/parametric evaluation (e.g., Bezier/NURBS).",
            ],
            arNote:
              "الـ Raster Text سريع جداً عشان بيستخدم Bit-Block Transfer ينسخ البكسلات مرة واحدة؛ والمنحنيات بنرسمها يا إما بتقريبها بخطوط/مثلثات صغيرة أو بمعادلات رياضية مباشرة.",
            tone: "neutral",
          },
        ],
      },
      {
        id: "ch2-color",
        number: "04",
        titleEn: "Color Perception, RGB vs. CMY, Color Solid & Alpha Opacity",
        titleAr: "إدراك الألوان، RGB مقابل CMY، مكعب الألوان، والشفافية",
        cards: [
          {
            term: "Color Distribution C(λ) & Tristimulus Theory",
            badge: "Slides 32–35",
            enSummary:
              "Physically, light has a wavelength distribution C(λ). Because the human eye has only 3 types of cones (R, G, B), we do not need to match the entire spectrum — just 3 Tristimulus values!",
            enBullets: [
              "Three-color theory lets displays reproduce almost all visible colors by mixing just 3 primaries (Red, Green, Blue).",
            ],
            arNote:
              "بدل ما نخزّن طيف كامل لكل لون، لأن العين فيها 3 أنواع مخاريط بس، يكفي نحدد 3 أرقام بس (Tristimulus Values: R, G, B).",
            tone: "brand",
          },
          {
            term: "Additive Color (RGB) vs. Subtractive Color (CMY)",
            badge: "Slides 36–37",
            enSummary:
              "Light-emitting displays add light together (RGB); ink-on-paper printers absorb/subtract wavelengths from white light (CMY).",
            enBullets: [
              "Additive (RGB — Monitors/CRTs/Projectors): Primaries Red, Green, Blue. Black = (0,0,0), White = (1,1,1).",
              "Subtractive (CMY — Printers/Pigments): Primaries Cyan, Magenta, Yellow. White paper = (0,0,0), Black = (1,1,1).",
              "Complement pairs: C = 1 − R, M = 1 − G, Y = 1 − B.",
            ],
            arNote:
              "الشاشات بتجمع ضوء (RGB Additive): صفر = أسود، والكل 1 = أبيض. أما الطابعات فبتطرح ضوء (CMY Subtractive): الورقة الفاضية أبيض، وخلط الحبر يدي أسود.",
            tone: "warm",
          },
          {
            term: "The 3D RGB Color Solid & 24-Bit Color Buffer",
            badge: "Slides 38–40",
            enSummary:
              "All representable RGB colors form a unit 3D cube (Color Solid) with corners at Black (0,0,0), White (1,1,1), R, G, B, C, M, Y; the diagonal from (0,0,0) to (1,1,1) is grayscale.",
            enBullets: [
              "24-bit RGB buffer = 8 bits/channel → 2^24 = 16,777,216 colors = 16M colors (where in CS, 1M = 2^20 = 1,048,576).",
            ],
            arNote:
              "في الجرافيكس والكمبيوتر 1M بتساوي 2^20، فـ 2^24 = 16 × 2^20 = 16M لون! وقطر مكعب الألوان من (0,0,0) لـ (1,1,1) هو درجات الرمادي.",
            tone: "mint",
          },
          {
            term: "Transparency & Opacity (RGBA Alpha Channel)",
            badge: "Slide 41",
            enSummary:
              "Adding a 4th component A (Alpha) creates RGBA (32-bit = 8 bits each), controlling how opaque or transparent a pixel/surface is.",
            enBullets: [
              "A = 1.0 → Completely OPAQUE (solid, blocks everything behind it).",
              "A = 0.0 → Completely TRANSPARENT (invisible, passes everything behind it).",
              "0 < A < 1 → Translucent / semi-transparent blending.",
            ],
            arNote:
              "احفظها عشان بتيجي صح وغلط: Alpha = 1.0 يعني مُعتم تماماً (Opaque)، و Alpha = 0.0 يعني شفاف تماماً (Transparent).",
            tone: "neutral",
          },
        ],
        formulas: [
          {
            labelEn: "RGB ↔ CMY Conversion & 24-Bit Color Count",
            formula: "C = 1 − R,  M = 1 − G,  Y = 1 − B   |   2^24 = 2^4 × 2^20 = 16M colors",
            workedExampleEn:
              "Red + Green = Yellow | Red + Blue = Magenta | Green + Blue = Cyan | R + G + B = White",
            arNote:
              "لون مكمل: لو جمعت أحمر + أخضر على الشاشة يطلع أصفر (Yellow)، وأزرق + أخضر يطلع سماوي (Cyan)، وأحمر + أزرق يطلع بنفسجي (Magenta).",
          },
        ],
      },
    ],
    examTraps: [
      {
        en: "Primitive functions specify WHAT to display; Attribute functions specify HOW to display it.",
        ar: "دايماً بتيجي MCQ: الـ Primitive بتحدد WHAT والـ Attribute بتحدد HOW.",
      },
      {
        en: "Stroke text scales cleanly (geometric); Raster text is faster via Bit-Block Transfer (BitBlt) but looks jagged when scaled.",
        ar: "لو السؤال سأل مين بيستخدم Bit-Block Transfer؟ الإجابة Raster Text فوراً.",
      },
      {
        en: "Additive = RGB (monitors, 0=Black, 1=White) vs. Subtractive = CMY (printers, 0=White, 1=Black).",
        ar: "خلي بالك من الفرق بين Additive (شاشات) و Subtractive (طابعات) وإحداثيات الأبيض والأسود في كل واحد.",
      },
      {
        en: "Alpha (Opacity): A = 1.0 is OPAQUE, A = 0.0 is TRANSPARENT (NOT the reverse!).",
        ar: "فخ شائع: A = 1.0 معناها مُعتم (Opaque) مش شفاف!",
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
      "Covers point plotting, analog vs. digital raster line drawing, rounding & stair-step jaggies, the Cartesian slope-intercept equation, and the complete derivation, 5-step algorithm, and worked example of Bresenham's integer-only line algorithm.",
    overviewAr:
      "ملخص شامل للشابتر الثالث: رسم النقطة والخط، الفرق بين الأجهزة التناظرية والرقمية، ظاهرة الـ Jaggies، اشتقاق خوارزمية Bresenham بالأعداد الصحيحة فقط، والخطوات الخمس مع مثال المحاضرة الكامل.",
    sections: [
      {
        id: "ch3-basics",
        number: "01",
        titleEn: "Point Plotting, Raster Displays & The Jaggies",
        titleAr: "رسم النقطة والشاشات الرقمية وظاهرة الـ Jaggies",
        cards: [
          {
            term: "Point Plotting & Raster Video Pipeline",
            badge: "Pages 1–7",
            enSummary:
              "Point plotting converts a single coordinate position into device operations (e.g., turning on a CRT electron beam). On raster displays, pixel intensities are stored in the Frame Buffer and read scan-line by scan-line by the Video Controller.",
            enBullets: [
              "Analog devices (random-scan/plotters): Smooth continuous deflection voltages → straight smooth lines.",
              "Digital raster devices: Can only plot discrete INTEGER pixel coordinates → lines must be sampled/approximated.",
              "Screen coordinates: Scan lines numbered bottom-to-top (or top-to-bottom) and columns numbered left-to-right.",
            ],
            arNote:
              "الأجهزة الـ Analog بترسم خط ناعم مستمر، أما الشاشات الرقمية (Raster) مبتقبلش غير أرقام صحيحة (Integer Pixels) فبنضطر نقرب النقاط.",
            tone: "brand",
          },
          {
            term: "Coordinate Rounding & Stair-Step Effect (The Jaggies)",
            badge: "Pages 8–10",
            enSummary:
              "Rounding calculated floating-point positions (e.g., (10.48, 20.51) → (10, 21)) causes non-horizontal/non-vertical lines to look like staircases — called the Stair-Step Effect or 'The Jaggies' (Aliasing).",
            enBullets: [
              "Horizontal (m = 0), vertical (m = ∞), and 45° (|m| = 1) lines appear perfectly smooth.",
              "Solutions to reduce Jaggies: (1) Higher screen resolution, (2) Antialiasing (adjusting pixel intensities along line boundaries).",
            ],
            arNote:
              "التقريب لأقرب بكسل صحيح بيعمل تعرجات شبه السلم اسمها Jaggies؛ وبتتعالج إما برفع دقة الشاشة أو بتقنية الـ Antialiasing (تعديل شدة إضاءة البكسلات).",
            tone: "warm",
          },
          {
            term: "Cartesian Slope-Intercept Line Equation",
            badge: "Pages 11–13",
            enSummary:
              "A straight line between endpoints (x₁, y₁) and (x₂, y₂) satisfies y = m·x + b.",
            enBullets: [
              "Slope: m = Δy / Δx = (y₂ − y₁) / (x₂ − x₁).",
              "Y-intercept: b = y₁ − m·x₁.",
              "If |m| < 1: sample at unit x intervals (Δx = 1) → Δy = m·Δx.",
              "If |m| > 1: sample at unit y intervals (Δy = 1) → Δx = Δy / m.",
            ],
            arNote:
              "المعادلة الديكارتية المباشرة بتحتاج ضرب وقسمة كسور (Floating-Point) وتقريب في كل خطوة، وده بطيء جداً في الهاردوير!",
            tone: "neutral",
          },
        ],
      },
      {
        id: "ch3-bresenham-derivation",
        number: "02",
        titleEn: "Bresenham's Line Algorithm: Core Idea & Derivation",
        titleAr: "فكرة واشتقاق خوارزمية Bresenham للأعداد الصحيحة",
        flowBanner: {
          labelEn: "Why Bresenham Beats Direct / DDA Methods",
          steps: [
            "Zero Floating-Point Math",
            "Integer Addition & Subtraction Only",
            "Bit-Shift Multiplication (×2)",
            "Fastest Hardware Rasterization",
          ],
          captionAr:
            "الميزة الجوهرية لـ Bresenham: كلها جمع وطرح أعداد صحيحة فقط (والضرب في 2 بيتم بـ Bit Shift)، مفيش أي كسور أو تقريب!",
        },
        cards: [
          {
            term: "Candidate Pixels & Vertical Separations (d₁, d₂)",
            badge: "Pages 15–21",
            enSummary:
              "For positive slope 0 < m < 1, after plotting (x_k, y_k), we step to x_k + 1 and choose between ONLY two candidate pixels: lower (x_k + 1, y_k) or upper (x_k + 1, y_k + 1).",
            enBullets: [
              "True y on line at x_k + 1: y = m(x_k + 1) + b.",
              "Lower distance: d₁ = y − y_k = m(x_k + 1) + b − y_k.",
              "Upper distance: d₂ = (y_k + 1) − y = y_k + 1 − m(x_k + 1) − b.",
              "If (d₁ − d₂) < 0 → d₁ < d₂ → lower pixel y_k is closer. Otherwise → upper pixel y_k + 1 is closer.",
            ],
            arNote:
              "عند كل عمود x_k + 1 عندك اختيارين بس: يا تفضل على نفس الـ y_k يا تطلع خطوة y_k + 1؛ بنقارن المسافتين d₁ و d₂ عشان نختار الأقرب للخط الحقيقي.",
            tone: "brand",
          },
          {
            term: "Eliminating Fractions via Decision Parameter p_k",
            badge: "Pages 22–24",
            enSummary:
              "Because m = Δy / Δx introduces division, Bresenham multiplies (d₁ − d₂) by Δx (> 0), keeping the exact same sign while turning every term into an integer!",
            enBullets: [
              "p_k = Δx(d₁ − d₂) = 2Δy·x_k − 2Δx·y_k + c, where constant c = 2Δy + Δx(2b − 1).",
              "Taking p_(k+1) − p_k cancels the constant c completely!",
              "p_(k+1) = p_k + 2Δy − 2Δx(y_(k+1) − y_k), where (y_(k+1) − y_k) is either 0 or 1.",
              "Initial parameter at (x₀, y₀): p₀ = 2Δy − Δx.",
            ],
            arNote:
              "العبقرية هنا: ضربنا في Δx عشان نلغي القسمة، وطرحنا p_(k+1) − p_k عشان الثابت c يطير تماماً وتبقى كل خطوة مجرد جمع رقمين صحيحين!",
            tone: "mint",
          },
        ],
        formulas: [
          {
            labelEn: "Bresenham's Line Algorithm Formulas (0 < m < 1)",
            formula:
              "p₀ = 2Δy − Δx   |   If p_k < 0 → (x_k+1, y_k), p_(k+1) = p_k + 2Δy   |   If p_k ≥ 0 → (x_k+1, y_k+1), p_(k+1) = p_k + 2Δy − 2Δx",
            workedExampleEn:
              "Lecture Example: (20, 10) → (30, 18) ⇒ Δx = 10, Δy = 8, 2Δy = 16, 2Δy − 2Δx = −4, p₀ = 16 − 10 = 6 (10 iterations: k = 0..9).",
            arNote:
              "للتدريب العملي وحل أي مسألة بالجدول والرسم، افتح بونص «شرح مسائل شابتر 3 و 4» جوا تاب الشرح التفاعلي!",
          },
        ],
      },
      {
        id: "ch3-algorithm",
        number: "03",
        titleEn: "5-Step Algorithm & Lecture Example Summary",
        titleAr: "خطوات الخوارزمية الخمسة وملخص مثال المحاضرة",
        table: {
          titleEn: "Official Lecture Example: (20, 10) → (30, 18) — First 5 Steps",
          titleAr: "أول 5 خطوات من مثال المحاضرة الرسمي (Δx=10, Δy=8, p₀=6, 2Δy=16, 2Δy−2Δx=−4)",
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
        en: "Always start from the LEFT endpoint (smaller x). If given (15,10) and (9,6), swap first to start at (9,6).",
        ar: "لازم تبدأ دايماً من النقطة اليسرى (الأصغر في x) قبل ما تحسب Δx و Δy.",
      },
      {
        en: "When p_k = 0, treat it as p_k ≥ 0 → increment y and add (2Δy − 2Δx).",
        ar: "فخ الصفر: p_k = 0 بيتبع حالة الموجب (p_k ≥ 0) مش السالب!",
      },
      {
        en: "Bresenham requires ONLY integer addition, subtraction, and multiplication by 2 (bit-shift) — NO floating-point division or rounding.",
        ar: "سؤال نظري مضمون: خوارزمية Bresenham تستخدم عمليات أعداد صحيحة فقط بدون أي Floating-Point.",
      },
      {
        en: "For steep lines (|m| > 1), swap the roles of x and y: step y by +1, p₀ = 2Δx − Δy.",
        ar: "لو الميل أكبر من 1 (Δy > Δx) بنبدّل دور x و y في القوانين.",
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
      "Covers the mathematical definition of a circle, drawbacks of Cartesian (Eq 1) and Polar (Eq 2) methods, 4-way and 8-way octant symmetry, and the complete derivation, 6-step algorithm, comparison with Bresenham's line algorithm, and worked examples (r=10, r=8, r=5) of the Midpoint Circle Algorithm.",
    overviewAr:
      "ملخص شامل للشابتر الرابع: تعريف الدائرة، عيوب المعادلة الديكارتية والقطبية، التماثل الثماني (8-Way Symmetry)، خوارزمية Midpoint Circle الكاملة بالخطوات الستة، ومقارنة مباشرة بينها وبين خوارزمية Bresenham للخط.",
    sections: [
      {
        id: "ch4-equations",
        number: "01",
        titleEn: "Circle Definition, Cartesian (Eq 1) vs. Polar (Eq 2)",
        titleAr: "تعريف الدائرة والمعادلة الديكارتية والقطبية",
        cards: [
          {
            term: "Definition of a Circle & Cartesian Equation (1)",
            badge: "Pages 1–7",
            enSummary:
              "A circle is the set of points all at a given distance r (radius) from a center position (x_c, y_c): (x − x_c)² + (y − y_c)² = r².",
            enBullets: [
              "Solving for y: y = y_c ± √(r² − (x − x_c)²), stepping x from x_c − r to x_c + r.",
              "Two Major Drawbacks of Cartesian Method: (1) Heavy computation (squaring + square root at every step), (2) Non-uniform spacing between plotted pixels (bunched at top, big gaps near sides where slope approaches ∞).",
            ],
            arNote:
              "عيوب المعادلة الديكارتية حاجتين بيتسألوا دايماً: (1) حسابات الجذر التربيعي البطيئة، (2) تباعد غير منتظم بين النقاط (زحمة فوق وفراغات واسعة على الجنب).",
            tone: "warm",
          },
          {
            term: "Parametric Polar Form (Equation 2) & Step Size 1/r",
            badge: "Pages 8–9",
            enSummary:
              "Expressing the circle with angle θ eliminates unequal spacing: x = x_c + r·cos(θ), y = y_c + r·sin(θ).",
            enBullets: [
              "To plot connected adjacent pixels, set angular step size Δθ = 1 / r radians (so arc length r·Δθ = 1 pixel).",
              "Drawback: Still computationally expensive because cos(θ) and sin(θ) are slow floating-point trigonometric functions.",
            ],
            arNote:
              "المعادلة القطبية بتحل مشكلة التباعد غير المنتظم باختيار خطوة زاوية Δθ = 1/r، لكنها لسه بطيئة بسبب حسابات sin و cos.",
            tone: "brand",
          },
        ],
      },
      {
        id: "ch4-symmetry",
        number: "02",
        titleEn: "8-Way Octant Symmetry (8× Speedup)",
        titleAr: "التماثل الثماني (توفير 8 أضعاف الحسابات)",
        flowBanner: {
          labelEn: "Computing Only 1 Octant (45°: x = 0 to x = y)",
          steps: [
            "Compute 1 point (x, y) in Octant 1",
            "Mirror across y = x → (y, x)",
            "Flip signs (±x, ±y) & (±y, ±x)",
            "All 8 Octants Plotted!",
          ],
          captionAr:
            "بنحسب ثُمن واحد بس من الدائرة (من x=0 لحد x=y يعني زاوية 45 درجة) ونستنتج الـ 7 أثمان الباقية بالتماثل بدون أي حسابات إضافية!",
        },
        cards: [
          {
            term: "The 8 Symmetric Points (Around Origin & Shifted Center)",
            badge: "Pages 10–15",
            enSummary:
              "Any point (x, y) on a circle centered at (0, 0) immediately determines 7 other points across all 8 octants.",
            enBullets: [
              "Origin (0, 0): (±x, ±y) and (±y, ±x) → 8 points total.",
              "Shifted center (x_c, y_c): (x_c ± x, y_c ± y) and (x_c ± y, y_c ± x).",
              "Special boundary cases: Points on axes (x = 0 or y = 0) or on the diagonal (x = y) generate ONLY 4 distinct points!",
              "First-octant slope ranges smoothly from 0 (at (0, r)) to −1 (at x = y).",
            ],
            arNote:
              "أي نقطة عامة تطلع 8 نقاط؛ لكن لو على المحور زي (0,10) أو على القطر زي (7,7) بتطلع 4 نقاط بس عشان التكرار. وميل الثمن الأول بيتراوح من 0 إلى −1.",
            tone: "mint",
          },
        ],
      },
      {
        id: "ch4-midpoint",
        number: "03",
        titleEn: "Midpoint Circle Algorithm & Line vs. Circle Comparison",
        titleAr: "خوارزمية Midpoint Circle ومقارنتها بـ Bresenham للخط",
        cards: [
          {
            term: "Circle Function f_circle(x, y) & Midpoint Test",
            badge: "Pages 17–20",
            enSummary:
              "To avoid square roots completely, define f_circle(x, y) = x² + y² − r² and test its sign at the midpoint M = (x_k + 1, y_k − 1/2).",
            enBullets: [
              "f_circle(x, y) < 0 → point is INSIDE the circle boundary.",
              "f_circle(x, y) = 0 → point is ON the circle boundary.",
              "f_circle(x, y) > 0 → point is OUTSIDE the circle boundary.",
              "Decision parameter p_k = f_circle(x_k + 1, y_k − 1/2): if p_k < 0 midpoint is inside → choose upper pixel y_k; if p_k ≥ 0 midpoint is on/outside → choose lower pixel y_k − 1.",
            ],
            arNote:
              "بنختبر نقطة المنتصف بين y_k و y_k − 1: لو p_k سالب يبقى المنتصف جوه الدائرة فنفضل على y_k؛ ولو صفر أو موجب يبقى بره/على الدائرة فننزل لـ y_k − 1.",
            tone: "brand",
          },
          {
            term: "The 6-Step Midpoint Circle Algorithm",
            badge: "Pages 21–23",
            enSummary:
              "Uses incremental integer arithmetic only — updating 2x and 2y by simple +2 and −2 additions each step.",
            enBullets: [
              "Step 1: Input r and (x_c, y_c); start at origin point (x₀, y₀) = (0, r).",
              "Step 2: Initial parameter p₀ = 5/4 − r (rounded to 1 − r for integer radius r).",
              "Step 3: If p_k < 0 → next (x_k+1, y_k), p_(k+1) = p_k + 2x_(k+1) + 1. Else → next (x_k+1, y_k−1), p_(k+1) = p_k + 2x_(k+1) + 1 − 2y_(k+1).",
              "Step 4: Plot symmetry points in the other 7 octants.",
              "Step 5: Shift each pixel (x, y) by (+x_c, +y_c).",
              "Step 6: Repeat Steps 3–5 until x ≥ y.",
            ],
            arNote:
              "خلي بالك: 2x_(k+1) و 2y_(k+1) بتوع النقطة الجديدة (بعد ما زودت x أو نقصت y)! وبتقف أول ما تلاقي x ≥ y.",
            tone: "mint",
          },
        ],
        formulas: [
          {
            labelEn: "Midpoint Circle Decision Parameter Update Rules",
            formula:
              "p₀ = 1 − r (or 5/4 − r)  |  p_k < 0 ⇒ p_(k+1) = p_k + 2x_(k+1) + 1  |  p_k ≥ 0 ⇒ p_(k+1) = p_k + 2x_(k+1) + 1 − 2y_(k+1)",
            workedExampleEn:
              "Lecture & Midterm Example r = 10 at (0,0): Start (0,10), p₀ = −9 → (1,10), (2,10), (3,10), (4,9), (5,9), (6,8), (7,7) — stops at x = y = 7!",
            arNote:
              "تقدر تراجع الجدول الكامل لـ r=10 و r=8 و r=5 و r=6 مع مركز مزاح في بونص «شرح مسائل شابتر 3 و 4» داخل تاب الشرح التفاعلي.",
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
              { text: "Top of circle (0, r) around origin", dir: "ltr", highlight: true },
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
              { text: "Update Increment", dir: "ltr" },
              { text: "Constant (2Δy or 2Δy − 2Δx)", dir: "ltr" },
              { text: "Dynamic (depends on 2x_(k+1) and 2y_(k+1))", dir: "ltr" },
            ],
            [
              { text: "Stopping Condition", dir: "ltr" },
              { text: "Repeat Δx times (reach x_end)", dir: "ltr" },
              { text: "Stop when x ≥ y (end of Octant 1)", dir: "ltr", highlight: true },
            ],
          ],
        },
      },
    ],
    examTraps: [
      {
        en: "Always compute Midpoint Circle around origin (0, 0) FIRST, then add (+x_c, +y_c) at the end — NEVER plug (x_c, y_c) into p_k!",
        ar: "أخطر غلطة في الميدتيرم: إياك تعوّض بالمركز (x_c, y_c) جوا معادلة p_k؛ احسب عند (0,0) وبعدين اجمع المركز.",
      },
      {
        en: "In p_(k+1) = p_k + 2x_(k+1) + 1 (− 2y_(k+1)), use the NEW coordinates x_(k+1) and y_(k+1), NOT the old x_k, y_k.",
        ar: "دايماً عوّض بالإحداثيات الجديدة x_(k+1) و y_(k+1) بعد ما تحدد النقطة الجديدة.",
      },
      {
        en: "When p_k ≥ 0 in Circle algorithm, y DECREASES (y_k − 1), opposite to Line algorithm where y increases (y_k + 1).",
        ar: "في الدائرة y بتنقص (−1) لما p_k ≥ 0 لأننا بادئين من أعلى الدائرة (0, r) ونازلين للقطر y = x.",
      },
      {
        en: "Angular step size in Polar form is Δθ = 1 / r (radians), and first-octant slope goes from 0 to −1.",
        ar: "سؤالين MCQ مضمونين: الخطوة الزاوية 1/r، وميل الثمن الأول من 0 إلى −1.",
      },
    ],
  },
];
