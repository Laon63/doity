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

i18n
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    supportedLngs: ['en', 'ko'],
    ns: ['common', 'memo'], // Namespaces
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
