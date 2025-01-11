import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const guild = createI18n(provider, {
  en: {
    announcements: 'Announcements',
    banner: {
      title: 'Getting Started',
      description: 'Create your bot and type something',
    },
    error: {
      'not found': 'Where is it?',
      'not found description': "The bot can't access the server, let's invite him!",
      load: 'Failed to load guild',
    },
    bn: {
      'enable feature': 'Enable',
      'config feature': 'Config',
      invite: 'Invite bot',
      settings: 'Settings',
    },
  },
  fi: {
    announcements: 'Ilmoitukset',
    banner: {
      title: 'Aloitus',
      description: 'Luo botti ja kirjoita jotain',
    },
    error: {
      'not found': 'Missä se on?',
      'not found description': 'Botilla ei ole pääsyä serverille, kutsutaan se!',
      load: 'Serverin lataus epäonnistui',
    },
    bn: {
      'enable feature': 'Ota käyttöön',
      'config feature': 'Asetukset',
      invite: 'Kutsu botti',
      settings: 'Asetukset',
    },
  },
});
