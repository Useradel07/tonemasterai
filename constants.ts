import { ToneOption, ToneCategory, Translations, LanguageCode, PlatformFormat } from './types';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export const TARGET_LANGUAGES = [
  { code: 'English', label: 'English 🇺🇸' },
  { code: 'Spanish', label: 'Spanish 🇪🇸' },
  { code: 'French', label: 'French 🇫🇷' },
  { code: 'German', label: 'German 🇩🇪' },
  { code: 'Italian', label: 'Italian 🇮🇹' },
  { code: 'Portuguese', label: 'Portuguese 🇵🇹' },
  { code: 'Chinese (Simplified)', label: 'Chinese 🇨🇳' },
  { code: 'Japanese', label: 'Japanese 🇯🇵' },
  { code: 'Arabic', label: 'Arabic 🇸🇦' },
  { code: 'Hindi', label: 'Hindi 🇮🇳' },
];

export const PLATFORMS: { id: PlatformFormat; labelKey: string; icon: string }[] = [
  { id: 'none', labelKey: 'none', icon: 'FileText' },
  { id: 'email', labelKey: 'email', icon: 'Mail' },
  { id: 'linkedin', labelKey: 'linkedin', icon: 'Linkedin' },
  { id: 'whatsapp', labelKey: 'whatsapp', icon: 'MessageCircle' },
  { id: 'slack', labelKey: 'slack', icon: 'Hash' },
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'corporate',
    labelKey: 'corporate',
    descriptionKey: 'corporateDesc',
    iconName: 'Briefcase',
    category: ToneCategory.PROFESSIONAL,
    systemPrompt: 'Rewrite the text to be professional, corporate, and suitable for a workplace environment. Remove slang, correct grammar, and maintain a polite but objective demeanor.'
  },
  {
    id: 'empathetic',
    labelKey: 'empathetic',
    descriptionKey: 'empatheticDesc',
    iconName: 'Heart',
    category: ToneCategory.PROFESSIONAL,
    systemPrompt: 'Rewrite the text to be empathetic, warm, and understanding. Focus on validating feelings and using gentle language.'
  },
  {
    id: 'legal',
    labelKey: 'legal',
    descriptionKey: 'legalDesc',
    iconName: 'Scale',
    category: ToneCategory.PROFESSIONAL,
    systemPrompt: 'Rewrite the text to be formal, precise, and authoritative, suitable for legal correspondence. Avoid ambiguity.'
  },
  {
    id: 'genz',
    labelKey: 'genz',
    descriptionKey: 'genzDesc',
    iconName: 'Zap',
    category: ToneCategory.CASUAL,
    systemPrompt: 'Rewrite the text using Gen-Z slang, internet terminology, and a very casual aesthetic. Make it sound trendy and youthful.'
  },
  {
    id: 'academic',
    labelKey: 'academic',
    descriptionKey: 'academicDesc',
    iconName: 'GraduationCap',
    category: ToneCategory.ACADEMIC,
    systemPrompt: 'Rewrite the text to be academic and scholarly. Use sophisticated vocabulary and complex sentence structures suitable for research.'
  },
  {
    id: 'persuasive',
    labelKey: 'persuasive',
    descriptionKey: 'persuasiveDesc',
    iconName: 'Rocket',
    category: ToneCategory.PROFESSIONAL,
    systemPrompt: 'Rewrite the text to be persuasive and sales-oriented. Use strong verbs, benefits-focused language, and a clear call to action.'
  },
];

export const DICTIONARY: Translations = {
  en: {
    appName: "ToneMaster AI",
    appDesc: "Elevate your communication with AI-powered refinement.",
    inputLabel: "Original Draft",
    inputPlaceholder: "Paste your rough draft, angry email, or scattered thoughts here...",
    outputLabel: "Polished Result",
    outputPlaceholder: "Your refined message will appear here...",
    rewriteButton: "Refine Text",
    processing: "Polishing...",
    copy: "Copy",
    copied: "Copied!",
    selectTone: "Select Tone",
    settings: "Settings",
    language: "Interface Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    poweredBy: "Powered by Groq Llama 3",
    errorEmpty: "Please enter text to refine.",
    errorGeneric: "Something went wrong.",
    charCount: "chars",
    listen: "Listen",
    analysisTitle: "Tone Analysis",
    originalTone: "Original Sentiment",
    newTone: "Refined Sentiment",
    historyTitle: "History",
    restore: "Restore",
    clearHistory: "Clear",
    noHistory: "No recent history",
    targetLanguage: "Translate To",
    format: "Format For",
    formats: {
      none: "Standard Text",
      email: "Email (Subject + Body)",
      linkedin: "LinkedIn Post",
      whatsapp: "WhatsApp Message",
      slack: "Slack Message"
    },
    tones: {
      corporate: "Corporate",
      empathetic: "Empathetic",
      legal: "Legal / Formal",
      genz: "Gen-Z / Casual",
      academic: "Academic",
      persuasive: "Persuasive"
    },
    descriptions: {
      corporateDesc: "Professional and objective.",
      empatheticDesc: "Warm and understanding.",
      legalDesc: "Precise and authoritative.",
      genzDesc: "Trendy and casual.",
      academicDesc: "Scholarly and complex.",
      persuasiveDesc: "Action-oriented sales copy."
    }
  },
  fr: {
    appName: "Maître de Ton AI",
    appDesc: "Élevez votre communication grâce au raffinement par IA.",
    inputLabel: "Brouillon Original",
    inputPlaceholder: "Collez votre brouillon ou vos idées ici...",
    outputLabel: "Résultat Poli",
    outputPlaceholder: "Votre message affiné apparaîtra ici...",
    rewriteButton: "Raffiner le texte",
    processing: "Traitement...",
    copy: "Copier",
    copied: "Copié !",
    selectTone: "Choisir le ton",
    settings: "Paramètres",
    language: "Langue de l'interface",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    poweredBy: "Propulsé par Groq Llama 3",
    errorEmpty: "Veuillez entrer du texte.",
    errorGeneric: "Une erreur est survenue.",
    charCount: "caractères",
    listen: "Écouter",
    analysisTitle: "Analyse du Ton",
    originalTone: "Sentiment Original",
    newTone: "Sentiment Affiné",
    historyTitle: "Historique",
    restore: "Restaurer",
    clearHistory: "Effacer",
    noHistory: "Pas d'historique récent",
    targetLanguage: "Traduire en",
    format: "Format Pour",
    formats: {
      none: "Texte Standard",
      email: "Email (Objet + Corps)",
      linkedin: "Post LinkedIn",
      whatsapp: "Message WhatsApp",
      slack: "Message Slack"
    },
    tones: {
      corporate: "Entreprise",
      empathetic: "Empathique",
      legal: "Juridique",
      genz: "Gen-Z / Cool",
      academic: "Académique",
      persuasive: "Persuasif"
    },
    descriptions: {
      corporateDesc: "Professionnel et objectif.",
      empatheticDesc: "Chaleureux et compréhensif.",
      legalDesc: "Précis et autoritaire.",
      genzDesc: "Tendance et décontracté.",
      academicDesc: "Savant et complexe.",
      persuasiveDesc: "Orienté vers l'action."
    }
  },
  ar: {
    appName: "سيد النبرة",
    appDesc: "ارتقِ بمراسلاتك باستخدام التنقيح المدعوم بالذكاء الاصطناعي.",
    inputLabel: "المسودة الأصلية",
    inputPlaceholder: "أدخل مسودتك أو أفكارك غير المرتبة هنا...",
    outputLabel: "النتيجة المنقحة",
    outputPlaceholder: "ستظهر رسالتك المحسنة هنا...",
    rewriteButton: "تحسين النص",
    processing: "جاري المعالجة...",
    copy: "نسخ",
    copied: "تم النسخ!",
    selectTone: "اختر النبرة",
    settings: "الإعدادات",
    language: "لغة الواجهة",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    poweredBy: "مدعوم بواسطة Groq Llama 3",
    errorEmpty: "الرجاء إدخال نص للتحسين.",
    errorGeneric: "حدث خطأ ما.",
    charCount: "حرف",
    listen: "استمع",
    analysisTitle: "تحليل النبرة",
    originalTone: "الشعور الأصلي",
    newTone: "الشعور المحسن",
    historyTitle: "السجل",
    restore: "استعادة",
    clearHistory: "مسح",
    noHistory: "لا يوجد سجل حديث",
    targetLanguage: "ترجم إلى",
    format: "تنسيق لـ",
    formats: {
      none: "نص قياسي",
      email: "بريد إلكتروني",
      linkedin: "منشور لينكد إن",
      whatsapp: "رسالة واتساب",
      slack: "رسالة سلاك"
    },
    tones: {
      corporate: "مهني / شركات",
      empathetic: "متعاطف",
      legal: "قانوني / رسمي",
      genz: "شبابي / عامي",
      academic: "أكاديمي",
      persuasive: "إقناعي"
    },
    descriptions: {
      corporateDesc: "مهني وموضوعي.",
      empatheticDesc: "دافئ ومتفهم.",
      legalDesc: "دقيق وذو سلطة.",
      genzDesc: "عصري وغير رسمي.",
      academicDesc: "علمي ومعقد.",
      persuasiveDesc: "موجه نحو العمل والمبيعات."
    }
  }
};