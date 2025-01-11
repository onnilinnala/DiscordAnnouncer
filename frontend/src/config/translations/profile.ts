import { createI18n } from '@/utils/i18n';
import { common } from './common';
import { provider } from './provider';

export const profile = createI18n(provider, {
  en: {
    logout: common.translations.en.logout,
    language: 'Language',
    'language description': 'Select your language',
    settings: 'Settings',
    'dark mode': 'Dark Mode',
    'dark mode description': 'Enables dark theme in order to protect your eyes',
    'dev mode': 'Developer Mode',
    'dev mode description': 'Used for debugging and testing',
  },
  fi: {
    logout: common.translations.fi.logout,
    language: 'Kieli',
    'language description': 'Valitse kieli',
    settings: 'Asetukset',
    'dark mode': 'Tumma Tila',
    'dark mode description': 'Ota tumma tila käyttöön suojataksesi silmiäsi',
    'dev mode': 'Kehittäjä tila',
    'dev mode description': 'Käytetään vikojen etsintään ja testaamiseen',
  },
});
