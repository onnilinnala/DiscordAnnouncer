import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const announcement = createI18n(provider, {
  en: {
    unsaved: 'Save Changes',
    error: {
      'not enabled': 'Not Enabled',
      'not enabled description': 'Try enable this feature?',
      'not found': 'Not Found',
      'not found description': "Hmm... Weird we can't find it",
    },
    bn: {
      enable: 'Enable Feature',
      disable: 'Disable',
      save: 'Save',
      discard: 'Discard',
    },
  },
  fi: {
    unsaved: 'Tallenna Muutokset',
    error: {
      'not enabled': 'Ei käytössä',
      'not enabled description': 'Käynnistä toiminto?',
      'not found': 'Ei tuloksia',
      'not found description': 'Hmm... En onnistu löytämään sitä',
    },
    bn: {
      enable: 'Ota toiminto käyttöön',
      disable: 'Poista toiminto käytöstä',
      save: 'Tallenna',
      discard: 'Hylkää',
    },
  },
});
