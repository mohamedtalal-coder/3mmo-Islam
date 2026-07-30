// ============================================================
// PER-CLIENT CONFIG
// This is the ONLY file that should change when onboarding a new
// teacher/client. Core app code should never need edits.
// ============================================================

export const siteConfig = {
  teacher: {
    name: "عمو إسلام", // Config-driven name
    subject: "اللغة العربية", // Config-driven subject
    bio: "معلم خبير بشرح مبسط ومحتوى متكامل يضمن لك التفوق في اللغة العربية بأسلوب ممتع وشيق.",
    photoUrl: "/teacher-photo.jpeg",
    logoUrl: "/logo.svg",
  },

  hero: {
    eyebrow: "منصة تعليمية",
    headline: "اللغة العربية هتتفهم صح وأقرب لعقلك",
    subheadline:
      "شرح واضح ومحتوى مرتب يخليك تمشي خطوة بخطوة من أول قواعد النحو لحد بلاغة النصوص.",
    ctaLabel: "ابدأ رحلتك",
  },

  theme: {
    colors: {
      background: "#FAF6EE",
      primary: "#1C2A39",
      gold: "#C19B6C",
      goldLight: "#E8C77B",
      text: "#1C2A39",
      textMuted: "#64748B",
    },
    fonts: {
      display: "var(--font-display)", // Rakkas
      body: "var(--font-body)", // IBM Plex Sans Arabic
      ui: "var(--font-ui)", // Cairo
    },
  },

  features: {
    quizzes: true,
    certificates: true,
    community: false,
    notifications: true,
  },

  stats: {
    yearsExperience: 15,
    satisfactionRate: "99%",
  },

  testimonials: [
    {
      studentName: "أحمد محمود",
      studentRole: "الصف الثالث الثانوي",
      quote: "بفضل الله ثم شرح عمو إسلام قدرت أفهم النحو بشكل كامل بعد ما كان معقد جداً بالنسبة لي. طريقة الشرح ممتازة ومبسطة وتوصل المعلومة بسهولة.",
      rating: 5,
    },
    {
      studentName: "سارة خالد",
      studentRole: "الصف الثاني الثانوي",
      quote: "أفضل منصة تعليمية للغة العربية، الشرح منظم والمتابعة مستمرة. حصص البلاغة والنصوص بقت أسهل كتير وممتعة جداً.",
      rating: 5,
    },
    {
      studentName: "عمر طارق",
      studentRole: "الصف الثالث الثانوي",
      quote: "الشرح وافي والمذكرات ممتازة جداً. عمو إسلام بيرد على كل أسئلتنا ومابيبخلش علينا بأي مجهود. شكراً جداً يا مستر على تعبك معانا.",
      rating: 5,
    },
    {
      studentName: "نورهان سعيد",
      studentRole: "الصف الأول الثانوي",
      quote: "منصة ممتازة وسهلة الاستخدام. طريقة عرض فيديوهات الأدب والنصوص واضحة جداً والتدريبات المرفقة مع كل درس بتثبت المعلومة.",
      rating: 5,
    },
  ],

  faq: [
    {
      question: "هل يمكنني الوصول لمحتوى الدورة أكثر من مرة؟",
      answer: "نعم، بمجرد اشتراكك في الدورة يمكنك مشاهدة الفيديوهات والوصول للمحتوى في أي وقت طوال فترة صلاحية اشتراكك.",
    },
    {
      question: "كيف يمكنني دفع قيمة الاشتراك؟",
      answer: "نوفر طرق دفع متعددة وآمنة تشمل البطاقات البنكية، والمحافظ الإلكترونية (مثل فودافون كاش)، والدفع عن طريق خدمات فوري.",
    },
    {
      question: "هل توجد متابعة وامتحانات دورية؟",
      answer: "بالتأكيد، كل دورة تحتوي على امتحانات قصيرة بعد كل درس واختبارات شاملة بعد كل وحدة لضمان استيعابك الكامل للمادة.",
    },
    {
      question: "ماذا أفعل إذا واجهت مشكلة تقنية في المنصة؟",
      answer: "يمكنك التواصل مع فريق الدعم الفني الخاص بنا في أي وقت عبر زر الواتساب الموجود أسفل الموقع وسنقوم بحل مشكلتك فوراً.",
    },
  ],

  poweredByCredit: true,

  payments: {
    // Filled in per-client during setup — never commit real keys
    paymobApiKey: process.env.PAYMOB_API_KEY ?? "",
    paymobIntegrationId: process.env.PAYMOB_INTEGRATION_ID ?? "",
    paymobPublicKey: process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY ?? "",
    paymobHmacSecret: process.env.PAYMOB_HMAC_SECRET ?? "",
  },


} as const;

export type SiteConfig = typeof siteConfig;
