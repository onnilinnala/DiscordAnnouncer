import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const dashboard = createI18n(provider, {
  en: {
    learn_more: 'Learn More',
    invite: {
      title: 'Invite the Bot',
      description: 'Try the discord bot with one-click',
      bn: 'Invite now',
    },
    servers: {
      title: 'Select Server',
      description: 'Select the server to configure',
    },
  },
  fi: {
    learn_more: 'Lue lisää',
    invite: {
      title: 'Kutsu botti',
      description: 'Kokeile bottia yhdellä klikkauksella',
      bn: 'Kutsu nyt',
    },
    servers: {
      title: 'Valitse Serveri',
      description: 'Valitse muokattava serveri',
    },
  },
});
