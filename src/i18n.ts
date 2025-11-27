import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common_en from './i18n/en/common.json';
import memo_en from './i18n/en/memo.json';
import common_ko from './i18n/ko/common.json';
import memo_ko from './i18n/ko/memo.json';

const resources = {
  en: {
    common: common_en,
    memo: memo_en,
  },
  ko: {
    common: common_ko,
    memo: memo_ko,
  },
};

// Initialize i18next and export the function to be awaited
export const initializeI18n = () =>
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ko'],
    ns: ['common', 'memo'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    // We are awaiting init, so we don't need suspense for translations
    react: {
      useSuspense: false,
    },
  });

export default i18n;
