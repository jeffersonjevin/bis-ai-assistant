import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

export const STORAGE_KEY = 'bis_lang';
export const DEFAULT_LANGUAGE = 'eng';

export interface SupportedLanguage {
  code: string;
  nativeLabel: string;
}

/** Languages shown in the navbar dropdown, in display order. */
export const supportedLanguages: SupportedLanguage[] = [
  { code: 'eng', nativeLabel: 'English' },
  { code: 'hin', nativeLabel: 'हिन्दी' },
  { code: 'tam', nativeLabel: 'தமிழ்' },
  { code: 'tel', nativeLabel: 'తెలుగు' },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', nativeLabel: 'മലയാളം' },
  { code: 'mr', nativeLabel: 'मराठी' },
  { code: 'bn', nativeLabel: 'বাংলা' },
];

function getInitialLanguage(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;
  return DEFAULT_LANGUAGE;
}

const resources = Object.fromEntries(
  Object.entries(translations).map(([code, dict]) => [code, { translation: dict }])
);

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false, // React already escapes output
  },
  returnNull: false,
});

/** Switch language and persist the choice to localStorage. */
export function setLanguage(code: string) {
  if (!translations[code]) return;
  i18n.changeLanguage(code);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, code);
  }
}

export default i18n;
