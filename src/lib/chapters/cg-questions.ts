import type { Question } from "@/types/database";

// Official Computer Graphics (CS-321) Sheets & Midterms Question Bank (85 questions across Chapters 1–4)
// Extracted from بنك الشيتات والميدتيرمات الشامل (Chapters 1–4).
export const CG_QUESTIONS: Question[] = [
  {
    "id": "44444444-4444-4444-8444-444444446001",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "............... is one of the four major areas of computer graphics.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Memory",
      "Frame Buffer",
      "Design",
      "Programming"
    ],
    "correct_index": 2,
    "explanation": "[شيت Exercise (1) — Q2]\nالإجابة الصحيحة هي (c) Design؛ لأن المجالات الأربعة الرئيسية للجرافيكس في المحاضرة الأولى هي: (1) Display of Information، (2) Design، (3) Simulation and Animation، (4) User Interfaces. أما Memory و Frame buffer فهي مكونات هاردوير.\n\n🎯 مفتاح الحل: One of the four major areas of computer graphics ➔ Design (أو User Interfaces / Simulation / Display of Information)",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444446002",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "In full-color systems, there are .................. bits per pixel.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "22",
      "16",
      "24",
      "128"
    ],
    "correct_index": 2,
    "explanation": "[شيت Exercise (1) — Q4 & Q8]\nالإجابة الصحيحة هي (c) 24؛ في أنظمة الألوان الكاملة (Full-color / True-color systems) يوجد 24 بت (أو أكثر) لكل بكسل (8 بت للأحمر + 8 بت للأخضر + 8 بت للأزرق = 24 بت).\n\n🎯 مفتاح الحل: Full-color systems bits per pixel ➔ 24 (or more) bits per pixel",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444446003",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "Our interaction with computers has become dominated by a visual paradigm that includes windows, icons, menus and pointing device, such as a mouse that is called ..................",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Simulation",
      "User Interfaces",
      "Animation",
      "Programming"
    ],
    "correct_index": 1,
    "explanation": "[شيت Exercise (1) — Q6]\nالإجابة الصحيحة هي (b) User Interfaces؛ واجهات المستخدم الرسومية (GUI) هي التي تعتمد على النوافذ (Windows)، الأيقونات (Icons)، القوائم (Menus)، والماوس (Pointing device).\n\n🎯 مفتاح الحل: Visual paradigm + windows, icons, menus, mouse ➔ User Interfaces",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444446004",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "The field of .......................... provides graphical tools that help researchers to interpret the vast quantity of data that they generate.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Mathematics",
      "Fluid flow",
      "Scientific Visualization",
      "Biology"
    ],
    "correct_index": 2,
    "explanation": "[شيت Exercise (1) — Q7]\nالإجابة الصحيحة هي (c) Scientific Visualization (التصور العلمي — Slide 5 في المحاضرة الأولى)؛ وهو المجال الذي يوفر أدوات رسومية لمساعدة الباحثين على تفسير الكميات الهائلة من البيانات.\n\n🎯 مفتاح الحل: Graphical tools to interpret vast quantity of data ➔ Scientific Visualization",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444446005",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "................. is the number of pixels in the frame buffer which determines the detail you can see in the image.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Resolution",
      "Depth",
      "Contrast",
      "Illumination"
    ],
    "correct_index": 0,
    "explanation": "[شيت Exercise (1) — Q8]\nالإجابة الصحيحة هي (a) Resolution؛ الدقة (Resolution) هي عدد البكسلات في الـ Frame buffer وهي المسؤولة عن مقدار التفاصيل (Detail) التي نراها في الصورة.\n\n🎯 مفتاح الحل: Number of pixels in frame buffer / Determines the detail in the image ➔ Resolution",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444446006",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "The ................ allows the user to indicate a position on the screen and almost always incorporates one or more buttons to allow the user to send signals or interrupts to the computer.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Input device",
      "Pointing device",
      "Design Tools",
      "Programming"
    ],
    "correct_index": 1,
    "explanation": "[شيت Exercise (1) — Q9]\nالإجابة الصحيحة هي (b) Pointing device (أداة الإشارة كالماوس — Slide 31 في المحاضرة الأولى)؛ لأنها تسمح بتحديد موقع على الشاشة وتحتوي على زر أو أكثر لإرسال إشارات أو مقاطعات (Interrupts) للكمبيوتر.\n\n🎯 مفتاح الحل: Indicate a position on the screen + buttons to send signals/interrupts ➔ Pointing device",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444446007",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "The ..................... of the frame buffer is defined as the number of bits that are used for each pixel.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Illumination",
      "Memory",
      "Resolution",
      "Depth"
    ],
    "correct_index": 3,
    "explanation": "[شيت Exercise (1) — Q10]\nالإجابة الصحيحة هي (d) Depth (أو Precision)؛ عمق الـ Frame buffer يُعرّف بأنه عدد البتات المستخدمة لكل بكسل (Number of bits used for each pixel) ويحدد عدد الألوان.\n\n🎯 مفتاح الحل: Number of bits used for each pixel ➔ Depth (or Precision)",
    "order_index": 7
  },
  {
    "id": "44444444-4444-4444-8444-444444446008",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "The visible spectrum has wavelengths in the range of ................. nanometers (nm).",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "800 to 910",
      "100 to 209",
      "350 to 780",
      "210 to 290"
    ],
    "correct_index": 2,
    "explanation": "[شيت Exercise (1) — Q11]\nالإجابة الصحيحة هي (c) 350 to 780 نانومتر (من الأزرق/البنفسجي عند 350 nm إلى الأحمر عند 780 nm — موجودة نصاً في المحاضرة 1 سلايد 38 والمحاضرة 2 سلايد 30).\n\n🎯 مفتاح الحل: Visible spectrum wavelengths in nm ➔ 350 to 780 nm",
    "order_index": 8
  },
  {
    "id": "44444444-4444-4444-8444-444444446009",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The .................... functions define the low-level objects or atomic entities that our system can display.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Input",
      "Query",
      "Transformation",
      "Primitive"
    ],
    "correct_index": 3,
    "explanation": "[شيت Exercise (1) — Q12]\nالإجابة الصحيحة هي (d) Primitive؛ دوال الـ Primitive هي التي تعرّف الكائنات الأولية منخفضة المستوى (Low-level objects or atomic entities) مثل النقاط والخطوط والمضلعات.\n\n🎯 مفتاح الحل: Define low-level objects or atomic entities ➔ Primitive functions",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444446010",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "In field of ................., images generated by conversion of data to geometric entities that can be displayed have yielded new insights into complex processes.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Biology",
      "Scientific visualization",
      "Molecular biology",
      "Animation"
    ],
    "correct_index": 2,
    "explanation": "[شيت كام سكانر Ex (1) — Q3]\nفي السلايد 6 من المحاضرة الأولى مكتوب نصاً: 'in the fields of fluid flow, molecular biology, and mathematics, images generated by conversion of data into geometric entities that can be displayed have yielded new insights into complex processes' (والمجال العام في سلايد 5 هو Scientific visualization).\n\n🎯 مفتاح الحل: Images generated by conversion of data to geometric entities yielded new insights ➔ Molecular biology (ضمن Scientific visualization)",
    "order_index": 9
  },
  {
    "id": "44444444-4444-4444-8444-444444446011",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "Design problems that are ........................... have multiple solutions that satisfy the design criteria.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "overdetermined",
      "underdetermined",
      "sub-determined",
      "super-determined"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (1) — Q4 (تصحيح مهم!)]\n⚠️ تصحيح ذهبي مهم جداً (غلطة في التظليل الأصفر القديم بالشيت!): في المحاضرة الأولى سلايد 10 مكتوب نصاً:\n• Overdetermined: there is NO solution that satisfies all the criteria.\n• Underdetermined: there are MULTIPLE solutions that satisfy the design criteria.\nإذن طالما السؤال يقول have multiple solutions فالإجابة الصحيحة علمياً هي (b) underdetermined!\n\n🎯 مفتاح الحل: Multiple solutions satisfy design criteria ➔ Underdetermined | No solution satisfies criteria ➔ Overdetermined",
    "order_index": 10
  },
  {
    "id": "44444444-4444-4444-8444-444444446012",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "....................... is the part of the memory where the pixels are stored in.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Depth",
      "Frame buffer",
      "Resolution",
      "Precision"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (1) — Q5]\nالإجابة الصحيحة هي (b) Frame buffer؛ هو الجزء المخصص من الذاكرة لتخزين قيم البكسلات (Pixels) قبل عرضها على الشاشة.\n\n🎯 مفتاح الحل: Part of memory where pixels are stored ➔ Frame buffer",
    "order_index": 11
  },
  {
    "id": "44444444-4444-4444-8444-444444446013",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "In a/an ......................... frame buffer only two colors are used.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "1-bit-deep",
      "2-bit-deep",
      "4-bit-deep",
      "8-bit-deep"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (1) — Q9]\nالإجابة الصحيحة هي (a) 1-bit-deep؛ لأن عدد الألوان يساوي 2¹ = 2 colors (لونان فقط مثل أبيض وأسود). بينما 2-bit يعطي 4 ألوان، و 4-bit يعطي 16 لوناً، و 8-bit يعطي 256 لوناً.\n\n🎯 مفتاح الحل: Only two colors are used ➔ 1-bit-deep frame buffer (2^1 = 2)",
    "order_index": 12
  },
  {
    "id": "44444444-4444-4444-8444-444444446014",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "........................... systems use 12 or more bits for each color component.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "True-color",
      "High dynamic range",
      "RGB-color",
      "Full-color"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (1) — Q10]\nالإجابة الصحيحة هي (b) High dynamic range (HDR)؛ لأن أنظمة الـ True-color / Full-color القياسية تستخدم 8 بت لكل مركبة لونية (24 بت للبكسل)، بينما أنظمة الـ HDR تستخدم 12 بت أو أكثر لكل مركبة لونية.\n\n🎯 مفتاح الحل: 12 or more bits for each color component ➔ High dynamic range (HDR)",
    "order_index": 13
  },
  {
    "id": "44444444-4444-4444-8444-444444446015",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "[Pinhole Camera Figure] The ................... usually is given by the position of the center of the lens, which is the center of projection (COP).",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Camera location",
      "Orientation",
      "Resolution",
      "Depth"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Exercise (2) — Q1 (الكاميرا)]\nالإجابة الصحيحة هي (a) Camera location (موقع الكاميرا — Slide 49 في المحاضرة الأولى)؛ يُحدد بموقع مركز العدسة الذي يمثل مركز الإسقاط (Center of Projection — COP).\n\n🎯 مفتاح الحل: Position of center of the lens / Center of projection (COP) ➔ Camera location",
    "order_index": 14
  },
  {
    "id": "44444444-4444-4444-8444-444444446016",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "[Pinhole Camera Figure] Once we have positioned the camera, we can place the ................, or a camera coordinate system with its origin at the center of projection. We can then rotate the camera independently around the three axes of this system.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Camera location",
      "Orientation",
      "Hight",
      "Shift"
    ],
    "correct_index": 1,
    "explanation": "[شيت محلول Exercise (2) — Q2 (الكاميرا)]\nالإجابة الصحيحة هي (b) Orientation (توجيه الكاميرا — Slide 49 في المحاضرة الأولى)؛ يتم بوضع نظام إحداثيات الكاميرا عند الـ COP وتدوير الكاميرا حول المحاور الثلاثة.\n\n🎯 مفتاح الحل: Camera coordinate system at COP / Rotate camera around three axes ➔ Orientation",
    "order_index": 15
  },
  {
    "id": "44444444-4444-4444-8444-444444446017",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "[Pinhole Camera Figure] The ..................... of the lens determines the size of the image on the film plane or, equivalently, the portion of the world the camera sees.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Orientation",
      "Camera location",
      "Focal length",
      "Depth"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Exercise (2) — Q3 (الكاميرا)]\nالإجابة الصحيحة هي (c) Focal length (البعد البؤري للعدسة — Slide 50 في المحاضرة الأولى)؛ هو الذي يحدد حجم الصورة على مستوى الفيلم (Size of the image on the film plane) ومساحة المشهد المرئي.\n\n🎯 مفتاح الحل: Determines size of the image on the film plane / portion of the world camera sees ➔ Focal length",
    "order_index": 16
  },
  {
    "id": "44444444-4444-4444-8444-444444446018",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The ........................ functions allow us to perform operations ranging from choosing the color with which we display a line segment to picking a pattern with which to fill the inside of a polygon, to selecting a typeface for the title on a graph.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Transformation",
      "Attribute",
      "Viewing",
      "Primitive"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (2) — Q1]\nالإجابة الصحيحة هي (b) Attribute (Slide 7 في المحاضرة الثانية)؛ دوال الخصائص (Attributes) هي التي تحدد اللون، ونمط ملء المضلع، وشكل الخط النصي (Typeface).\n\n🎯 مفتاح الحل: Choosing color, pattern to fill polygon, selecting typeface ➔ Attribute functions",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444446019",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The ........................... functions allow us to carry out transformation of objects, such as rotation, translation and scaling.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Transformation",
      "Attribute",
      "Viewing",
      "Primitives"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (2) — Q2]\nالإجابة الصحيحة هي (a) Transformation (Slide 9 في المحاضرة الثانية)؛ دوال التحويلات هي المسؤولة عن الدوران (Rotation)، الإزاحة (Translation)، والتحجيم (Scaling).\n\n🎯 مفتاح الحل: Rotation, translation and scaling ➔ Transformation functions",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444446020",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "............................ is a set of successive vertices (and line segments) that are to be connected.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Strip",
      "Segment",
      "Polyline"
    ],
    "correct_index": 3,
    "explanation": "[شيت كام سكانر Ex (2) — Q3 & Ex (6) Q3]\nالإجابة الصحيحة هي (d) Polyline (Slide 18 في المحاضرة الثانية)؛ الخط المتعدد (Polyline) هو سلسلة من الرؤوس المتتالية والقطع المستقيمة المتصلة دون اشتراط إغلاقها أو ملئها.\n\n🎯 مفتاح الحل: Successive vertices (and line segments) that are connected ➔ Polyline",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444446021",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "............................ can be defined for an object that has a border that can be described by a line loop but also has a well-defined interior.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Strip",
      "Segment",
      "Polyline"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (2) — Q4 & Ex (6) Q5]\nالإجابة الصحيحة هي (a) Polygon (المضلع — Slide 19 في المحاضرة الثانية)؛ يتميز بأن حدوده عبارة عن مسار مغلق (Line loop) وله منطقة داخلية محددة جيداً (Well-defined interior).\n\n🎯 مفتاح الحل: Border described by a line loop + well-defined interior ➔ Polygon",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444446022",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "By ......................... we use vertices to specify line segments or curves that outline each character (constructed as are other geometric objects).",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Raster text",
      "Stroke text",
      "Bit blocks",
      "Triangulation"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (2) — Q5 & Ex (6) Q7]\nالإجابة الصحيحة هي (b) Stroke text (Slide 26 في المحاضرة الثانية)؛ النص الخطي (Stroke text) يُبنى كباقي الكائنات الهندسية باستخدام الرؤوس والخطوط والمنحنيات لتحديد شكل الحرف.\n\n🎯 مفتاح الحل: Vertices specify line segments or curves outlining each character / constructed as geometric objects ➔ Stroke text",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444446023",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "By .......................... characters are defined as rectangles of bits called bit blocks with each block defined a single character by the pattern of 0 and 1 bits in the block.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Raster text",
      "Stroke text",
      "Bit blocks",
      "Triangulation"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (2) — Q6]\nالإجابة الصحيحة هي (a) Raster text (Slide 28 في المحاضرة الثانية)؛ النص النقطي (Raster text) يعرّف كل حرف كمستطيل من البتات (0 و 1) يسمى Bit block.\n\n🎯 مفتاح الحل: Characters defined as rectangles of bits (0 and 1) called bit blocks ➔ Raster text",
    "order_index": 7
  },
  {
    "id": "44444444-4444-4444-8444-444444446024",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In ........................ color(s) the primary colors (Red, Green and Blue) add together to give the perceived color and is used in projectors and slide (positive) film.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Subtractive",
      "Complementary",
      "Additive",
      "Multiplicative"
    ],
    "correct_index": 2,
    "explanation": "[شيت كام سكانر Ex (2) — Q7]\nالإجابة الصحيحة هي (c) Additive (Slide 33 في المحاضرة الثانية)؛ النظام اللوني الجمعي (Additive color) يجمع الأحمر والأخضر والأزرق (RGB) معاً لإعطاء اللون المدرك ويُستخدم في الشاشات والبروجيكتور.\n\n🎯 مفتاح الحل: Primary colors (Red, Green, Blue) add together ➔ Additive color",
    "order_index": 8
  },
  {
    "id": "44444444-4444-4444-8444-444444446025",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The cyan color is considered ................................. color.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Subtractive",
      "Complementary",
      "Additive",
      "Multiplicative"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (2) — Q8]\nالإجابة الصحيحة هي (a) Subtractive (Slide 34 في المحاضرة الثانية)؛ الألوان (Cyan, Magenta, Yellow) هي الألوان الأساسية في النظام الطرحي (Subtractive color system) وهي ألوان مكملة (Complementary) لـ RGB.\n\n🎯 مفتاح الحل: Cyan, Magenta, Yellow (CMY) ➔ Subtractive color",
    "order_index": 9
  },
  {
    "id": "44444444-4444-4444-8444-444444446026",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In a 24-bit RGB color system, each color component (or each pixel) consists of .................... bit(s).",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "1",
      "8 (bits per R, G, B component)",
      "24 (bits per pixel total)",
      "36"
    ],
    "correct_index": 1,
    "explanation": "[شيت كام سكانر Ex (2) — Q9]\nفي السلايد 38 من المحاضرة الثانية: في نظام 24-bit RGB يوجد 3 بايت (24 بت) لكل بكسل، بواقع 1 بايت = 8 بت لكل مركبة لونية (R, G, B). في الشيت المرفق تم تظليل (b) 8 باعتبار السؤال يقصد كل قناة لونية (ولو سألك عن البكسل الكامل في Full-color تكون 24 بت).\n\n🎯 مفتاح الحل: Bits per RGB component = 8 bits | Bits per Full-color pixel = 24 bits",
    "order_index": 10
  },
  {
    "id": "44444444-4444-4444-8444-444444446027",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "Possible range of values for a 24-bit color system is ..........................",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "1 to 2^24",
      "0 to 2^(24-1)",
      "0 to 2^24",
      "0 to 2^24 - 1"
    ],
    "correct_index": 3,
    "explanation": "[شيت كام سكانر Ex (2) — Q10]\nالإجابة الصحيحة هي (d) 0 to 2²⁴ − 1؛ أي نظام ثنائي مكون من n بت يعطي 2ⁿ احتمالاً يبدأ ترقيمها من 0 وينتهي عند 2ⁿ − 1.\n\n🎯 مفتاح الحل: Possible range of values for n-bit system ➔ 0 to 2^n - 1",
    "order_index": 11
  },
  {
    "id": "44444444-4444-4444-8444-444444446028",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In Computer Graphics, primitives could be separated into two classes: geometric primitives and ............... primitives.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Image/Raster",
      "Polyline",
      "Depth"
    ],
    "correct_index": 1,
    "explanation": "[شيت محلول Ex (6) — Q2]\nالإجابة الصحيحة هي (b) Image/Raster (Slide 15 في المحاضرة الثانية)؛ تنقسم الـ Primitives إلى فئتين: Geometric primitives و Image (or Raster) primitives.\n\n🎯 مفتاح الحل: Two classes of primitives: geometric primitives and ➔ Image/Raster primitives",
    "order_index": 12
  },
  {
    "id": "44444444-4444-4444-8444-444444446029",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "In Computer Graphics, ................. produced when a line is generated as a series of pixel positions.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Stair-step effect",
      "Polyline",
      "Depth"
    ],
    "correct_index": 1,
    "explanation": "[شيت محلول Ex (6) — Q8]\nالإجابة الصحيحة هي (b) Stair-step effect (أو The Jaggies — Slide 8 في المحاضرة الثالثة)؛ يظهر التعرج السلمي عندما يُرسم الخط كسلسلة من مواقع البكسلات الصحيحة.\n\n🎯 مفتاح الحل: Produced when a line is generated as a series of pixel positions ➔ Stair-step effect (the jaggies)",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444446030",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In Computer Graphics, an .............. for interfacing with graphic system can contain hundreds of individual functions.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Image/Raster",
      "API",
      "Depth"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (6) — Q12]\nالإجابة الصحيحة هي (c) API (Application Programmer's Interface — Slide 5 في المحاضرة الثانية)؛ واجهة برمجة التطبيقات للتعامل مع نظام الجرافيكس يمكن أن تحتوي على مئات الدوال الفردية.\n\n🎯 مفتاح الحل: Interfacing with graphic system + hundreds of individual functions ➔ API",
    "order_index": 13
  },
  {
    "id": "44444444-4444-4444-8444-444444446031",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "In computer graphics we start with an application whose inputs are a set of vertices specifying geometric objects and whose output is an array of ..... in the frame buffer.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Pixels",
      "Lines",
      "Colors",
      "Images"
    ],
    "correct_index": 0,
    "explanation": "[شيت كام سكانر Ex (5) — Q2]\nالإجابة الصحيحة هي (a) Pixels (المحاضرة 1 سلايد 21 و 24)؛ وظيفة معالج الجرافيكس هي أخذ مواصفات الكائنات الهندسية (Vertices/Primitives) وإخراج مصفوفة من البكسلات (Array of pixels) في الـ Frame buffer.\n\n🎯 مفتاح الحل: Output is an array of ..... in the frame buffer ➔ Pixels",
    "order_index": 17
  },
  {
    "id": "44444444-4444-4444-8444-444444446032",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "If the two end points of a line segment are (x1, y1) and (x2, y2), the slope of the line (m) can be represented by:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "m = (y2 + y1) / (x2 + x1)",
      "m = (y2 - y1) / (x2 - x1)",
      "m = Δy / Δx",
      "Both b and c"
    ],
    "correct_index": 3,
    "explanation": "[شيت كام سكانر Ex (5) — Q10]\nالإجابة الصحيحة هي (d) Both b and c؛ لأن ميل الخط المستقيم يُكتب m = (y₂ − y₁)/(x₂ − x₁) (Slide 12) ويُكتب أيضاً m = Δy / Δx (Slide 17).\n\n🎯 مفتاح الحل: Slope of the line (m) formula ➔ Both (y2 - y1)/(x2 - x1) and Δy / Δx",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444446033",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "A line can be represented in terms of its slope as follows:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "y = f(x)",
      "x = f(x)",
      "y = mx + b",
      "b and c"
    ],
    "correct_index": 2,
    "explanation": "[شيت كام سكانر Ex (6) — Q3]\nالإجابة الصحيحة هي (c) y = mx + b (Slide 11 في المحاضرة الثالثة: Cartesian slope-intercept equation).\n\n🎯 مفتاح الحل: Line represented in terms of its slope ➔ y = mx + b",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444446034",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "A circle centered at the origin is represented by ..........................",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "f(x, y) = 0",
      "ax + by + c = 0",
      "x^2 + y^2 - r^2 = 0",
      "a and b"
    ],
    "correct_index": 2,
    "explanation": "[شيت كام سكانر Ex (6) — Q5]\nالإجابة الصحيحة هي (c) x² + y² − r² = 0 (Slide 20 في المحاضرة الرابعة)؛ وهي المعادلة الضمنية لدائرة نصف قطرها r ومركزها نقطة الأصل (0, 0).\n\n🎯 مفتاح الحل: Circle centered at the origin equation ➔ x^2 + y^2 - r^2 = 0",
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-444444446035",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 0, what is the value of decision parameter p0?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "2",
      "6",
      "3",
      "4"
    ],
    "correct_index": 1,
    "explanation": "[شيت محلول Ex (4) — Q1 (Bresenham Line)]\nالحل بالخطوات: Δx = 30 − 20 = 10 و Δy = 18 − 10 = 8. إذن p₀ = 2Δy − Δx = 2(8) − 10 = 16 − 10 = 6.\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 0 ➔ p0 = 6",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444446036",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 0, what is the generated pixel position (x1, y1)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(20, 10)",
      "(20, 11)",
      "(21, 11)",
      "(10, 20)"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (4) — Q2 & Ex (3) Q1]\nالحل بالخطوات: نقطة البداية هي (20, 10)، وبما أن p₀ = 6 ≥ 0 نزيد كلاً من x و y بمقدار 1 فتكون النقطة المولدة عند k = 0 هي (21, 11).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 0 pixel ➔ (21, 11)",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444446037",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 1, what is the generated pixel position (x2, y2)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(22, 12)",
      "(21, 11)",
      "(21, 12)",
      "(21, 13)"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Ex (4) — Q3 & Ex (3) Q2]\nالحل بالخطوات: عند k = 1 لدينا p₁ = p₀ + (2Δy − 2Δx) = 6 − 4 = 2 ≥ 0، فنزيد x و y بمقدار 1 من (21, 11) لتصبح النقطة (22, 12).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 1 pixel ➔ (22, 12)",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444446038",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 2, what is the value of decision parameter p2?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "2",
      "-6",
      "-2",
      "5"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (4) — Q4]\nالحل بالخطوات: بما أن p₁ = 2 ≥ 0، نطرح 4 (2Δy − 2Δx = −4) فتكون p₂ = 2 − 4 = −2.\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 2 parameter ➔ p2 = -2",
    "order_index": 7
  },
  {
    "id": "44444444-4444-4444-8444-444444446039",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 2, what is the generated pixel position (x3, y3)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(22, 13)",
      "(23, 13)",
      "(22, 12)",
      "(23, 12)"
    ],
    "correct_index": 3,
    "explanation": "[شيت محلول Ex (4) — Q5 & Ex (3) Q3]\nالحل بالخطوات: لأن p₂ = −2 < 0 (سالبة!)، نزيد x بمقدار 1 وتظل y ثابتة عند 12، فتكون النقطة هي (23, 12).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 2 pixel (p2 = -2 < 0) ➔ (23, 12)",
    "order_index": 8
  },
  {
    "id": "44444444-4444-4444-8444-444444446040",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 3, what is the value of decision parameter p3 (and pixel position)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "12 (pixel 24,12)",
      "10 (pixel 24,13)",
      "14 (and pixel is (24, 13))",
      "13 (pixel 23,13)"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (4) — Q6 & Ex (3) Q4]\nالحل بالخطوات: لأن p₂ = −2 < 0 نجمع 2Δy = +16 فتصبح p₃ = −2 + 16 = 14، وبما أن 14 ≥ 0 نرسم عند k = 3 النقطة (24, 13).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 3 ➔ p3 = 14 and pixel = (24, 13)",
    "order_index": 9
  },
  {
    "id": "44444444-4444-4444-8444-444444446041",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 4, what is the generated pixel position (with p4 = 10)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(24, 13)",
      "(24, 14)",
      "(25, 13)",
      "(25, 14)"
    ],
    "correct_index": 3,
    "explanation": "[شيت محلول Ex (4) — Q7 & Ex (3) Q5]\nالحل بالخطوات: عند k = 4 لدينا p₄ = 14 − 4 = 10 ≥ 0، فنزيد x و y بمقدار 1 من (24, 13) لتصبح النقطة (25, 14).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 4 ➔ p4 = 10, pixel = (25, 14)",
    "order_index": 10
  },
  {
    "id": "44444444-4444-4444-8444-444444446042",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 5, what is the generated pixel position (with p5 = 6)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(26, 15)",
      "(26, 14)",
      "(25, 16)",
      "(26, 16)"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Ex (4) — Q8 & Ex (3) Q6]\nالحل بالخطوات: عند k = 5 لدينا p₅ = 10 − 4 = 6 ≥ 0، فنزيد x و y بمقدار 1 من (25, 14) لتصبح النقطة (26, 15).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 5 ➔ p5 = 6, pixel = (26, 15)",
    "order_index": 11
  },
  {
    "id": "44444444-4444-4444-8444-444444446043",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 6, what are the value of decision parameter p6 and the generated pixel position?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p6 = 6 and (26, 17)",
      "p6 = -6 and (26, 16)",
      "p6 = 2 and (27, 16)",
      "p6 = -2 and (27, 17)"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (4) — Q9 & Q10 & Ex (3) Q7]\nالحل بالخطوات: عند k = 6 لدينا p₆ = 6 − 4 = 2 ≥ 0، فنزيد x و y بمقدار 1 من (26, 15) لتصبح النقطة (27, 16).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 6 ➔ p6 = 2, pixel = (27, 16)",
    "order_index": 12
  },
  {
    "id": "44444444-4444-4444-8444-444444446044",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 7, what are the value of decision parameter p7 and the generated pixel position?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p7 = 6 and (28, 17)",
      "p7 = -6 and (26, 16)",
      "p7 = 2 and (27, 17)",
      "p7 = -2 and (28, 16)"
    ],
    "correct_index": 3,
    "explanation": "[شيت محلول Ex (4) — Q11 & Q12 & Ex (3) Q8]\nالحل بالخطوات: عند k = 7 لدينا p₇ = 2 − 4 = −2 < 0 (سالبة للمرة الثانية!)، فنثبت y = 16 ونزيد x فقط لتصبح النقطة (28, 16).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) at k = 7 ➔ p7 = -2, pixel = (28, 16)",
    "order_index": 13
  },
  {
    "id": "44444444-4444-4444-8444-444444446045",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[Bresenham Line (20,10) to (30,18)] For k = 8 and k = 9, what are (p8, pixel at k=8) and (p9, pixel at k=9)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "k=8: p8 = 14, pixel (29, 17) | k=9: p9 = 10, pixel (30, 18)",
      "k=8: p8 = 10, pixel (28, 18) | k=9: p9 = 6, pixel (30, 17)",
      "k=8: p8 = -2, pixel (29, 18) | k=9: p9 = 14, pixel (30, 18)",
      "k=8: p8 = 6, pixel (27, 18) | k=9: p9 = 2, pixel (29, 18)"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Ex (4) — Q13, Q14, Q15 & Ex (3) Q9, Q10]\nالحل بالخطوات: لأن p₇ = −2 < 0 نجمع 16 فتصبح p₈ = 14 ≥ 0 وترسم (29, 17)؛ ثم نطرح 4 فتصبح p₉ = 10 ≥ 0 وترسم نقطة النهاية (30, 18).\n\n🎯 مفتاح الحل: k=8 ➔ p8=14, (29,17) | k=9 ➔ p9=10, (30,18)",
    "order_index": 14
  },
  {
    "id": "44444444-4444-4444-8444-444444446046",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10 at (0,0), start (0,10)] For k = 0, the value of the decision parameter p0 is:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "9",
      "-6",
      "-9",
      "6"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (5) — Q1 (Midpoint Circle r=10)]\nالحل بالخطوات: p₀ = 1 − r = 1 − 10 = −9، وبما أن p₀ < 0 فإن النقطة المولدة عند k = 0 هي (1, 10).\n\n🎯 مفتاح الحل: Circle r = 10 at k = 0 ➔ p0 = -9, pixel = (1, 10)",
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-444444446047",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10] For k = 1, what is the generated pixel position (with p1 = -6)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(2, 12)",
      "(1, 11)",
      "(2, 11)",
      "(2, 10)"
    ],
    "correct_index": 3,
    "explanation": "[شيت محلول Ex (5) — Q2 (Midpoint Circle r=10)]\nالحل بالخطوات: عند k = 0 رسمنا (1, 10) فكانت 2x₁ = 2 ومنها p₁ = −9 + 2 + 1 = −6 < 0. وبما أن p₁ < 0 نثبت y = 10 ونزيد x بـ 1 لتصبح النقطة عند k = 1 هي (2, 10).\n\n🎯 مفتاح الحل: Circle r = 10 at k = 1 ➔ p1 = -6, pixel = (2, 10)",
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-444444446048",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10] For k = 2, what are the value of the decision parameter p2 and the generated pixel position?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p2 = -1 and pixel is (3, 10)",
      "p2 = -3 and pixel is (3, 12)",
      "p2 = 6 and pixel is (3, 11)",
      "p2 = 2 and pixel is (2, 13)"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Ex (5) — Q3 & Q4 (Midpoint Circle r=10)]\nالحل بالخطوات: من النقطة (2, 10) لدينا 2x₂ = 4، إذن p₂ = p₁ + 2x₂ + 1 = −6 + 4 + 1 = −1. ولأن p₂ = −1 < 0 نرسم النقطة (3, 10).\n\n🎯 مفتاح الحل: Circle r = 10 at k = 2 ➔ p2 = -1, pixel = (3, 10)",
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-444444446049",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10] For k = 3, what are the value of the decision parameter p3 and the generated pixel position?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p3 = 5 and pixel is (4, 10)",
      "p3 = 7 and pixel is (5, 9)",
      "p3 = 6 and pixel is (4, 9)",
      "p3 = -6 and pixel is (4, 8)"
    ],
    "correct_index": 2,
    "explanation": "[شيت محلول Ex (5) — Q5 & Q6 (Midpoint Circle r=10)]\nالحل بالخطوات: من النقطة (3, 10) لدينا 2x₃ = 6، إذن p₃ = p₂ + 2x₃ + 1 = −1 + 6 + 1 = 6. ولأن p₃ = 6 ≥ 0 (موجبة!) تزيد x بـ 1 وتنقص y بـ 1 لتصبح النقطة (4, 9).\n\n🎯 مفتاح الحل: Circle r = 10 at k = 3 ➔ p3 = 6, pixel = (4, 9)",
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-444444446050",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10] For k = 4, what is the generated pixel position (with p4 = -3)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(4, 10)",
      "(5, 9)",
      "(5, 8)",
      "(6, 9)"
    ],
    "correct_index": 1,
    "explanation": "[شيت محلول Ex (5) — Q7 (Midpoint Circle r=10)]\nالحل بالخطوات: عند (4, 9) كانت 2x₄ = 8, 2y₄ = 18، ومنها p₄ = 6 + 8 + 1 − 18 = −3 < 0. ولأن p₄ < 0 نثبت y = 9 ونزيد x بـ 1 لتصبح النقطة (5, 9).\n\n🎯 مفتاح الحل: Circle r = 10 at k = 4 ➔ p4 = -3, pixel = (5, 9)",
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-444444446051",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Midpoint Circle r = 10] For k = 5 and k = 6, what are p5, the pixel at k = 5, and p6 (where pixel at k = 6 is (7, 7))?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p5 = 8, pixel at k=5 is (6, 8), and p6 = 5",
      "p5 = -8, pixel at k=5 is (5, 8), and p6 = 4",
      "p5 = 7, pixel at k=5 is (7, 7), and p6 = 3",
      "p5 = -6, pixel at k=5 is (6, 7), and p6 = 6"
    ],
    "correct_index": 0,
    "explanation": "[شيت محلول Ex (5) — Q8, Q9, Q10 (Midpoint Circle r=10)]\nالحل بالخطوات: من (5, 9) لدينا 2x₅ = 10، إذن p₅ = −3 + 10 + 1 = 8 ≥ 0 فترسم النقطة (6, 8) حيث 2x₆ = 12, 2y₆ = 16. ثم p₆ = 8 + 12 + 1 − 16 = 5 ≥ 0 فترسم (7, 7) ونتوقف لأن x = y = 7!\n\n🎯 مفتاح الحل: Circle r = 10 at k = 5 & 6 ➔ p5 = 8, pixel (6,8) | p6 = 5, pixel (7,7)",
    "order_index": 7
  },
  {
    "id": "44444444-4444-4444-8444-444444446052",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The basic geometric structures that describe a scene on display is called: _________",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Attributes",
      "Output primitive",
      "Lines",
      "Curves"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q1]\nالإجابة الصحيحة هي (b) Output primitive؛ الهياكل الهندسية الأساسية التي تصف المشهد على الشاشة (مثل النقاط والخطوط والمضلعات والدوائر) تسمى Output primitives.\n\n🎯 مفتاح الحل: Basic geometric structures that describe a scene on display ➔ Output primitive",
    "order_index": 14
  },
  {
    "id": "44444444-4444-4444-8444-444444446053",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "What is the formula for calculating the slope 'm' of a line?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "m = dy / dx",
      "m = dx / dy",
      "y = mx + c",
      "None of the above"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (AI) — Q2]\nالإجابة الصحيحة هي (a) m = dy / dx (فرق الصادات على فرق السينات Δy / Δx).\n\n🎯 مفتاح الحل: Formula for calculating slope 'm' ➔ m = dy / dx",
    "order_index": 15
  },
  {
    "id": "44444444-4444-4444-8444-444444446054",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "In the equation of a line, y = mx + b, b is _________",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "the height at which the line crosses the x-axis",
      "constant",
      "the height at which the line crosses the y-axis (y-intercept)",
      "slope of a line"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (AI) — Q5 & Mid 2024 Q3]\nالإجابة الصحيحة هي (c) the height at which the line crosses the y-axis (وهو تعريف الـ y-intercept أي الجزء المقطوع من محور الصادات عند x = 0).\n\n🎯 مفتاح الحل: In y = mx + b, b is ➔ the height at which the line crosses the y-axis (y-intercept)",
    "order_index": 16
  },
  {
    "id": "44444444-4444-4444-8444-444444446055",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "_________, of the frame buffer, defined as the number of bits that are used for each pixel.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "The view",
      "The GPU",
      "The memory",
      "The depth"
    ],
    "correct_index": 3,
    "explanation": "[Midterm 2025 (AI) — Q6]\nالإجابة الصحيحة هي (d) The depth؛ عمق الـ Frame buffer هو عدد البتات المستخدمة لكل بكسل.\n\n🎯 مفتاح الحل: Number of bits used for each pixel ➔ The depth",
    "order_index": 18
  },
  {
    "id": "44444444-4444-4444-8444-444444446056",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "In circle drawing algorithm we use _________",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "4-Symmetry",
      "2-Symmetry",
      "8-Symmetry",
      "No Symmetry"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (AI) — Q7]\nالإجابة الصحيحة هي (c) 8-Symmetry (التماثل الثماني بين الـ 8 أثمان — Octant symmetry).\n\n🎯 مفتاح الحل: In circle drawing algorithm we use ➔ 8-Symmetry",
    "order_index": 8
  },
  {
    "id": "44444444-4444-4444-8444-444444446057",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "If a line is to be drawn from (2, 3) to (5, 8) using Bresenham's line drawing algorithm, the third point to be plotted is _______.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(3, 5)",
      "(3, 6)",
      "(4, 7)",
      "(4, 8)"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (AI) — Q8 (مسألة مهمة!)]\nتعال نحلها بالورقة والقلم بطريقتين عشان تفهم فكرة السؤال:\n• النقطة الأولى هي نقطة البداية (2, 3). هنا Δx = 5 − 2 = 3 و Δy = 8 − 3 = 5.\n• لو عوضت في قوانين x القياسية مباشرة: p₀ = 2Δy − Δx = 10 − 3 = 7 ≥ 0 فنرسم النقطة الثانية (3, 4) ثم الثالثة (4, 5)؛ أما لو مشينا على المحور صاحب التغير الأكبر (Δy = 5 > Δx = 3):\n• النقطة الأولى (1st point): (2, 3).\n• عند الخطوة الأولى: p₀ = 2Δx − Δy = 6 − 5 = 1 ≥ 0 فنزيد y و x معاً فتكون النقطة الثانية (2nd point): (3, 4)، وتصبح p₁ = 1 + 2(3) − 2(5) = 1 + 6 − 10 = −3 < 0.\n• عند الخطوة الثانية: لأن p₁ = −3 < 0 نزيد y بـ 1 وتظل x ثابتة عند 3 فتكون النقطة الثالثة (3rd point to be plotted) هي (3, 5)!\n\n🎯 مفتاح الحل: Line from (2,3) to (5,8), third point to be plotted ➔ (3, 5) [1st=(2,3), 2nd=(3,4), 3rd=(3,5)]",
    "order_index": 17
  },
  {
    "id": "44444444-4444-4444-8444-444444446058",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The _________ functions enable us to communicate with the window system, to initialize our programs, and to deal with any errors that take place during the execution of our programs.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Attribute",
      "Control",
      "Viewing",
      "Input"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q9 & Mid 2024 Q15]\nالإجابة الصحيحة هي (b) Control (Slide 11 في المحاضرة الثانية نصاً)؛ دوال التحكم (Control functions) هي المسؤولة عن التواصل مع نظام النوافذ، وتهيئة البرامج، والتعامل مع الأخطاء.\n\n🎯 مفتاح الحل: Communicate with window system + initialize programs + deal with errors ➔ Control functions",
    "order_index": 15
  },
  {
    "id": "44444444-4444-4444-8444-444444446059",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In Computer Graphics, an _________ for interfacing with graphic system can contain hundreds of individual functions.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Polygon",
      "Image/Raster",
      "API",
      "Depth"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (AI) — Q10]\nالإجابة الصحيحة هي (c) API (Application Programmer's Interface — Slide 5 في المحاضرة الثانية).\n\n🎯 مفتاح الحل: Interfacing with graphic system + hundreds of functions ➔ API",
    "order_index": 16
  },
  {
    "id": "44444444-4444-4444-8444-444444446060",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "RGB color model is used for _________",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Painting",
      "Sketching",
      "Printing",
      "Computer display"
    ],
    "correct_index": 3,
    "explanation": "[Midterm 2025 (AI) — Q11 & Mid 2025 Gen Q9 & Mid 2024 Q4]\nالإجابة الصحيحة هي (d) Computer display؛ نموذج الألوان الجمعي RGB يُستخدم في شاشات العرض (Computer displays)، بينما CMYK يُستخدم في الطباعة (Printing).\n\n🎯 مفتاح الحل: RGB color model is used for ➔ Computer display",
    "order_index": 17
  },
  {
    "id": "44444444-4444-4444-8444-444444446061",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "The intersection of primary colors in the CMYK color model will generate the _________",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Green color",
      "White color",
      "Black color",
      "Dark red"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (AI) — Q12 & Mid 2025 Gen Q10 & Mid 2024 Q6]\nالإجابة الصحيحة هي (c) Black color (Slide 34 في المحاضرة الثانية)؛ تقاطع الألوان الأساسية في نظام CMYK الطرحي يعطي اللون الأسود (بينما تقاطع RGB الجمعي يعطي اللون الأبيض).\n\n🎯 مفتاح الحل: Intersection of primary colors in CMYK ➔ Black color (وفي RGB ➔ White color)",
    "order_index": 18
  },
  {
    "id": "44444444-4444-4444-8444-444444446062",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "Which is the correct circle equation?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "(x - xc) + (y - yc) = r^2",
      "(x - xc)^2 + (y - yc)^2 = r^2",
      "(x - xc)^2 + (y - yc)^2 = r",
      "None of these"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q13]\nالإجابة الصحيحة هي (b) (x − x_c)² + (y − y_c)² = r² (Slide 4 في المحاضرة الرابعة — نظرية فيثاغورس).\n\n🎯 مفتاح الحل: Correct circle equation ➔ (x - xc)^2 + (y - yc)^2 = r^2",
    "order_index": 9
  },
  {
    "id": "44444444-4444-4444-8444-444444446063",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "Equation of initial decision parameter for Bresenham line algorithm (for |m| < 1) is:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "p0 = Δy – Δx",
      "p0 = 2 Δy – Δx",
      "p0 = 2 Δy – 2 Δx",
      "p0 = Δy – 2 Δx"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q14 & Mid 2024 Q7]\nالإجابة الصحيحة هي (b) p₀ = 2Δy − Δx (Slide 25 في المحاضرة الثالثة).\n\n🎯 مفتاح الحل: Initial decision parameter p0 for Bresenham line ➔ p0 = 2Δy - Δx",
    "order_index": 18
  },
  {
    "id": "44444444-4444-4444-8444-444444446064",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "What is a 'frame buffer' in graphics?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "A temporary storage for video frames (memory where pixels are stored)",
      "A section of the hard drive for storing animations",
      "A GPU feature for storing completed 3D models",
      "A compression algorithm for raster images"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (AI) — Q15]\nالإجابة الصحيحة هي (a) A temporary storage for video frames؛ الـ Frame buffer هو ذاكرة سريعة تخزن بكسلات إطار الفيديو الحالي ليقرأها الـ Video controller ويعرضها على الشاشة.\n\n🎯 مفتاح الحل: What is a frame buffer ➔ A temporary storage for video frames",
    "order_index": 19
  },
  {
    "id": "44444444-4444-4444-8444-444444446065",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "In _________ color systems, the primaries are usually complementary colors: cyan, magenta, and yellow.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Full",
      "Additive",
      "Subtractive",
      "Solid"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (AI) — Q16 & Mid 2024 Q20]\nالإجابة الصحيحة هي (c) Subtractive (Slide 34 في المحاضرة الثانية نصاً).\n\n🎯 مفتاح الحل: Primaries are complementary colors: cyan, magenta, yellow ➔ Subtractive color systems",
    "order_index": 19
  },
  {
    "id": "44444444-4444-4444-8444-444444446066",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "What role does computer graphics play in data visualization?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Creating physical prototypes",
      "Representing data in visual formats",
      "Simulating market trends",
      "Designing mobile applications"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q17]\nالإجابة الصحيحة هي (b) Representing data in visual formats (تمثيل البيانات في صور وأشكال بصرية يسهل فهمها وتفسيرها — المحاضرة 1 سلايد 4–6).\n\n🎯 مفتاح الحل: Role of computer graphics in data visualization ➔ Representing data in visual formats",
    "order_index": 20
  },
  {
    "id": "44444444-4444-4444-8444-444444446067",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "Slope of the line joining the points (1, 2) and (3, 4) is _____________.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "0",
      "1",
      "2",
      "3"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q18 & Mid 2024 Q9]\nالحل بالخطوات: m = (y₂ − y₁) / (x₂ − x₁) = (4 − 2) / (3 − 1) = 2 / 2 = 1.\n\n🎯 مفتاح الحل: Slope joining (1, 2) and (3, 4) ➔ m = (4-2)/(3-1) = 1",
    "order_index": 19
  },
  {
    "id": "44444444-4444-4444-8444-444444446068",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "What is the main benefit of octant symmetry in the Midpoint Circle Algorithm?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Reduces computation by a factor of eight",
      "Simplifies the algorithm",
      "Ensures higher accuracy",
      "Enhances visual quality"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (AI) — Q19]\nالإجابة الصحيحة هي (a) Reduces computation by a factor of eight (يقلل الحسابات بمعامل 8 مرات لأننا نحسب ثُمناً واحداً فقط 1/8 من الدائرة ونعكس النقاط للـ 7 أثمان الأخرى — المحاضرة 4 سلايد 10–13).\n\n🎯 مفتاح الحل: Main benefit of octant symmetry in Midpoint Circle ➔ Reduces computation by a factor of eight",
    "order_index": 10
  },
  {
    "id": "44444444-4444-4444-8444-444444446069",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "What is the primary input for Bresenham's Line Algorithm?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Radius and center point",
      "Two endpoints of the line",
      "Major and minor axes",
      "Angle and distance"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (AI) — Q20]\nالإجابة الصحيحة هي (b) Two endpoints of the line (الخطوة 1 في سلايد 25: Input the two line endpoints).\n\n🎯 مفتاح الحل: Primary input for Bresenham's Line Algorithm ➔ Two endpoints of the line",
    "order_index": 20
  },
  {
    "id": "44444444-4444-4444-8444-444444446070",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "Primitive functions are used to define:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Colors of objects",
      "Types of fonts",
      "Low-level objects like points and lines",
      "Types of transformations"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (General) — MCQ Q1]\nالإجابة الصحيحة هي (C) Low-level objects like points and lines (Slide 6 في المحاضرة الثانية).\n\n🎯 مفتاح الحل: Primitive functions are used to define ➔ Low-level objects like points and lines",
    "order_index": 20
  },
  {
    "id": "44444444-4444-4444-8444-444444446071",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "A color solid is a:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "2D object",
      "Mathematical expression",
      "Polygon",
      "3D representation of a color model"
    ],
    "correct_index": 3,
    "explanation": "[Midterm 2025 (General) — MCQ Q2]\nالإجابة الصحيحة هي (D) 3D representation of a color model (مكعب الألوان الثلاثي الأبعاد — Slide 36 في المحاضرة الثانية).\n\n🎯 مفتاح الحل: A color solid is a ➔ 3D representation of a color model",
    "order_index": 21
  },
  {
    "id": "44444444-4444-4444-8444-444444446072",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "Polygons are important because:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "They are colorful",
      "They can approximate surfaces and are rendered rapidly",
      "They are easy to draw manually",
      "They only use straight lines"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (General) — MCQ Q3]\nالإجابة الصحيحة هي (B) They can approximate surfaces and are rendered rapidly (Slide 20 في المحاضرة الثانية نصاً: 1. The system can display polygons rapidly, 2. Polygons can be used to approximate arbitrary surfaces).\n\n🎯 مفتاح الحل: Polygons are important because ➔ They can approximate surfaces and are rendered rapidly",
    "order_index": 22
  },
  {
    "id": "44444444-4444-4444-8444-444444446073",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "How many bits does each RGB component have in a 24-bit system?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "2",
      "4",
      "8",
      "16"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (General) — MCQ Q4]\nالإجابة الصحيحة هي (C) 8؛ لأن 24 بت مقسمة بالتساوي على 3 مركبات لونية (Red, Green, Blue) بواقع 24 / 3 = 8 bits (1 byte) لكل لون (Slide 38 في المحاضرة الثانية).\n\n🎯 مفتاح الحل: Bits per RGB component in a 24-bit system ➔ 8 bits",
    "order_index": 23
  },
  {
    "id": "44444444-4444-4444-8444-444444446074",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "Attribute functions determine:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "The input from mouse",
      "The view of the camera",
      "How objects are displayed",
      "The order of rendering"
    ],
    "correct_index": 2,
    "explanation": "[Midterm 2025 (General) — MCQ Q5]\nالإجابة الصحيحة هي (C) How objects are displayed (Slide 14 في المحاضرة الثانية: If primitives are the 'what' of an API, then attributes are the 'how').\n\n🎯 مفتاح الحل: Attribute functions determine ➔ How objects are displayed",
    "order_index": 24
  },
  {
    "id": "44444444-4444-4444-8444-444444446075",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "What does A = 0.0 represent in transparency?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Fully transparent",
      "Partially transparent",
      "Fully opaque",
      "Blurry"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (General) — MCQ Q6]\nالإجابة الصحيحة هي (A) Fully transparent (شفاف تماماً يمرر كل الضوء — Slide 41 في المحاضرة الثانية؛ بينما A = 1.0 تعني Fully opaque معتم تماماً).\n\n🎯 مفتاح الحل: A = 0.0 in transparency ➔ Fully transparent (A = 1.0 ➔ Fully opaque)",
    "order_index": 25
  },
  {
    "id": "44444444-4444-4444-8444-444444446076",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "The y-intercept 'b' can be calculated using which formula?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "y2 - y1",
      "y1 - m * x1",
      "x2 - x1",
      "m * x2 - y2"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2025 (General) — MCQ Q7]\nالإجابة الصحيحة هي (B) y1 - m * x1 (Slide 12 في المحاضرة الثالثة).\n\n🎯 مفتاح الحل: Formula for y-intercept 'b' ➔ b = y1 - m * x1",
    "order_index": 21
  },
  {
    "id": "44444444-4444-4444-8444-444444446077",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "For the line from (20,10) to (30,18), how many pixels are plotted (generated in the loop) using Bresenham's algorithm?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "correct_index": 3,
    "explanation": "[Midterm 2025 (General) — MCQ Q8]\nالإجابة الصحيحة بين الاختيارات هي (D) 10؛ لأن عدد خطوات التوليد في الجدول يساوي Δx = 30 − 20 = 10 خطوات (من k=0 إلى k=9، وبالإضافة لنقطة البداية يكون الإجمالي 11 بكسل).\n\n🎯 مفتاح الحل: Line (20,10) to (30,18) pixels generated in loop (Δx) ➔ 10",
    "order_index": 22
  },
  {
    "id": "44444444-4444-4444-8444-444444446078",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[True/False — Mid 2025 General Q14 (فخ امتحانات مشهور!)] 'Only the first quadrant needs to be computed in Bresenham's circle algorithm.'",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "False (✗) — Only the first OCTANT (one-eighth sector from x=0 to x=y) needs to be computed, not the whole quadrant!",
      "True (✓) — The whole first quadrant must be computed"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (General) — True/False Q11 to Q15]\n⚠️ فخ امتحانات خطير (الطالب في صورة ورقة الامتحان غلط فيه!): في خوارزمية الدائرة نحن لا نحتاج لحساب الربع الأول بالكامل (First quadrant = 90°)، بل نحسب فقط الثُمن الأول (First OCTANT = 45° من x = 0 إلى x = y)! أما باقي الـ 10 جمل صح وغلط في الامتحان فهي:\n• Q11: In circle, the point (x, y) maps to 7 other points using symmetry ➔ True (✓)\n• Q12: Standard ellipses align their axes with coordinate axes ➔ True (✓)\n• Q13: Bresenham's algorithm uses floating-point arithmetic ➔ False (✗) (Uses integer arithmetic only)\n• Q15: Jaggies are more visible at high resolution ➔ False (✗) (More visible at LOW resolution)\n\n🎯 مفتاح الحل: Only first quadrant vs. first octant in circle algorithm ➔ First OCTANT only (x = 0 to x = y)",
    "order_index": 11
  },
  {
    "id": "44444444-4444-4444-8444-444444446079",
    "lesson_id": "22222222-2222-4222-8222-222222222603",
    "question_text": "[True/False — Mid 2025 General Q16–Q20] Which of the following statements from Midterm 2025 General is FALSE?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Q19: 'RGB is a subtractive color system.' (FALSE — RGB is an ADDITIVE color system!)",
      "Q16: 'Bresenham's algorithm selects between two nearest pixels at each step.' (TRUE)",
      "Q17: 'CRT monitors use electron beams for display.' (TRUE)",
      "Q18 & Q20: 'Raster characters are stored as bit blocks' & 'Control functions handle startup and errors' (Both TRUE)"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2025 (General) — True/False Q16 to Q20]\nفي الأسئلة من 16 إلى 20 في ميدتيرم 2025 General:\n• Q16: True (✓) — خوارزمية Bresenham تختار بين أقرب بكسلين في كل خطوة.\n• Q17: True (✓) — شاشات CRT تستخدم حزم الإلكترونات.\n• Q18: True (✓) — الحروف النقطية (Raster characters) تُخزن كـ Bit blocks.\n• Q19: False (✗) — نظام RGB هو نظام جمعي (Additive) وليس طرحياً (Subtractive).\n• Q20: True (✓) — دوال التحكم (Control functions) مسؤولة عن بدء التشغيل والتعامل مع الأخطاء.\n\n🎯 مفتاح الحل: RGB is subtractive ➔ False (RGB is Additive; CMY is Subtractive)",
    "order_index": 23
  },
  {
    "id": "44444444-4444-4444-8444-444444446080",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "[Mid 2024 Q1] Which of the following is an example of a computer graphics application used in the field of education and training?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Virtual surgical simulations",
      "3D modeling for game development",
      "Financial market analysis",
      "Social media management"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2024 — Q1 & Q2]\nالإجابة الصحيحة هي (a) Virtual surgical simulations (محاكيات الجراحة الافتراضية لتعليم وتدريب الأطباء — مثل محاكيات الطيران في قسم Simulation & Animation بالمحاضرة الأولى). وفي السؤال الثاني Q2: Which is NOT a function of 2D image editing software? الإجابة هي (b) 3D modeling.\n\n🎯 مفتاح الحل: CG application in education/training ➔ Virtual surgical simulations / Flight simulators",
    "order_index": 21
  },
  {
    "id": "44444444-4444-4444-8444-444444446081",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Mid 2024 Q5] If one octant of the circle is generated, to complete the generation of a full circle, how many symmetric octant sections/points are mapped (or how many symmetry axes reflections are used)?",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "8 total octants (7 other octants mapped using 3 symmetry reflections: 45° line, y-axis, x-axis)",
      "1 reflection only",
      "2 octants only",
      "No reflections needed"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2024 — Q5]\nلتكملة الدائرة الكاملة من ثُمن واحد: الدائرة مقسمة إلى 8 أثمان (8 octants) (نولّد ثُمناً واحداً ونسقط النقطة في الـ 7 أثمان الأخرى)، ويتم ذلك عبر 3 انعكاسات تماثل متتالية: (1) حول خط 45° لتكملة الربع الأول، (2) حول محور y لتكملة النصف العلوي (الربع الثاني)، (3) حول محور x لتكملة النصف السفلي (الربعين الثالث والرابع)!\n\n🎯 مفتاح الحل: Full circle from one octant ➔ 8 octants total (7 other octants via 3 symmetry reflections: 45°, y-axis, x-axis)",
    "order_index": 12
  },
  {
    "id": "44444444-4444-4444-8444-444444446082",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Mid 2024 Q8] To change the position of a circle or ellipse we translate:",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Center coordinates only without redrawing",
      "Center coordinates and redraw the figure in new location",
      "Outline coordinates only",
      "All of the mentioned"
    ],
    "correct_index": 1,
    "explanation": "[Midterm 2024 — Q8]\nالإجابة الصحيحة هي (b) Center coordinates and redraw the figure in new location (كما في الخطوة 5 من خوارزمية الدائرة: نحسب النقاط حول الأصل ثم نضيف إحداثيات المركز الجديد (x_c, y_c) ونرسم الشكل في موقعه الجديد).\n\n🎯 مفتاح الحل: Change position of a circle or ellipse ➔ Translate center coordinates and redraw the figure in new location",
    "order_index": 13
  },
  {
    "id": "44444444-4444-4444-8444-444444446083",
    "lesson_id": "22222222-2222-4222-8222-222222222601",
    "question_text": "[Mid 2024 Q12 & Q13] Color depth can be defined by _______ which can be displayed on a display unit; and if an object allows most/all light to pass through it then it is _______.",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "Bits per pixel ; transparent",
      "Bytes per second ; opaque",
      "Megabyte per pixel ; solid",
      "None of these"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2024 — Q12 & Q13]\nفي Q12: عمق اللون (Color depth) يُعرّف بـ (a) Bits per pixel (المحاضرة 1 سلايد 22). وفي Q13: الجسم الذي يسمح بمرور كل الضوء من خلاله هو (a) transparent (المحاضرة 2 سلايد 41).\n\n🎯 مفتاح الحل: Color depth = Bits per pixel | Passes all light = Transparent",
    "order_index": 22
  },
  {
    "id": "44444444-4444-4444-8444-444444446084",
    "lesson_id": "22222222-2222-4222-8222-222222222602",
    "question_text": "[Mid 2024 Q16 — True/False] 'Vector graphics is composed of Pixels.'",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "False (b) — Raster graphics is composed of pixels; vector graphics uses geometric primitives/lines",
      "True (a)"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2024 — Q16 (True/False)]\nالإجابة الصحيحة هي (b) False؛ لأن رسوميات الـ Raster (Bitmap) هي التي تتكون من بكسلات (Pixels)، بينما رسوميات الـ Vector تتكون من معادلات وكيانات هندسية (خطوط ومنحنيات).\n\n🎯 مفتاح الحل: Vector graphics is composed of pixels ➔ False (Raster graphics is composed of pixels)",
    "order_index": 26
  },
  {
    "id": "44444444-4444-4444-8444-444444446085",
    "lesson_id": "22222222-2222-4222-8222-222222222604",
    "question_text": "[Mid 2024 Q17 — True/False] 'Circle is defined as set of points such that the sum of the distances is same for all points.'",
    "code_snippet": null,
    "code_lang": null,
    "options": [
      "False (b) — That is the definition of an Ellipse! A circle is the set of points at a given distance r from a single center (xc, yc)",
      "True (a)"
    ],
    "correct_index": 0,
    "explanation": "[Midterm 2024 — Q17 (True/False — تريكة مهمة!)]\n⚠️ تريكة امتحانات ذكية جداً: الشكل الذي يكون فيه مجموع المسافتين من بؤرتين ثابتاً لجميع النقاط (Sum of distances is the same) هو القطع الناقص (Ellipse) وليس الدائرة! أما الدائرة (Circle) فهي مجموعة النقاط التي تبعد مسافة ثابتة واحدة r عن نقطة مركز واحدة (x_c, y_c) (المحاضرة 4 سلايد 3). لذا العبارة False (b)!\n\n🎯 مفتاح الحل: Sum of distances is same for all points ➔ False for Circle (That is an Ellipse!)",
    "order_index": 14
  }
];
