import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const auth = createI18n(provider, {
  en: {
    login: 'Sign in',
    'login description': 'Login and start using the bot today!',
    login_bn: 'Login with Discord',
  },
  fi: {
    login: 'Kirjaudu sisään',
    'login description': 'Kirjaudu sisään ja aloita botin käyttö heti!',
    login_bn: 'Kirjaudu sisään Discordilla',
  },
});
