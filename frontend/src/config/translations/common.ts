import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const common = createI18n(provider, {
  en: {
    loading: 'Loading',
    search: 'Search',
    'select lang': 'Select your language',
    'select role': 'Select a role',
    'select channel': 'Select a channel',
    'select period': 'Select a period',
    'select time': 'Select a time',
    dashboard: 'Dashboard',
    profile: 'Profile',
    pages: 'Pages',
    logout: 'Logout',
  },
  fi: {
    loading: 'Ladataan',
    search: 'Haku',
    'select lang': 'Valitse kieli',
    'select role': 'Valitse rooli',
    'select channel': 'Valitse kanava',
    'select period': 'Valitse ajanjakso',
    'select time': 'Valitse kellonaika',
    dashboard: 'Ohjauspaneeli',
    profile: 'Profiili',
    pages: 'Sivut',
    logout: 'Kirjaudu ulos',
  },
});
