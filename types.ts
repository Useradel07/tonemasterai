export enum ToneCategory {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  CREATIVE = 'Creative',
  ACADEMIC = 'Academic'
}

export type LanguageCode = 'en' | 'fr' | 'ar';

export interface ToneOption {
  id: string;
  labelKey: string;
  descriptionKey: string;
  iconName: string;
  category: ToneCategory;
  systemPrompt: string;
}

export interface RewriteResult {
  rewrittenText: string;
  originalScore: number; // 0 to 100
  newScore: number;      // 0 to 100
  improvement: string;   // e.g., "More Professional"
}

export type PlatformFormat = 'none' | 'email' | 'linkedin' | 'whatsapp' | 'slack';

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  rewrittenText: string;
  toneId: string;
  platform: PlatformFormat;
  targetLanguage: string;
}

export interface Translations {
  [key: string]: {
    appName: string;
    appDesc: string;
    inputLabel: string;
    inputPlaceholder: string;
    outputLabel: string;
    outputPlaceholder: string;
    rewriteButton: string;
    processing: string;
    copy: string;
    copied: string;
    selectTone: string;
    settings: string;
    language: string;
    darkMode: string;
    lightMode: string;
    poweredBy: string;
    errorEmpty: string;
    errorGeneric: string;
    charCount: string;
    listen: string;
    analysisTitle: string;
    originalTone: string;
    newTone: string;
    historyTitle: string;
    restore: string;
    clearHistory: string;
    noHistory: string;
    targetLanguage: string;
    format: string;
    formats: {
      none: string;
      email: string;
      linkedin: string;
      whatsapp: string;
      slack: string;
    };
    tones: { [key: string]: string };
    descriptions: { [key: string]: string };
  }
}