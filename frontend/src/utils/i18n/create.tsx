import { ReactElement, ReactNode } from 'react';
import { Translation, TranslationModel } from './translations';

export type I18nConfig<Languages extends string, Model extends TranslationModel> = {
  useTranslations: () => Translation<Model>;
  translations: {
    [lang in Languages]: Translation<Model>;
  };
  T: (props: { text: keyof Model | ((model: Model) => ReactNode) }) => ReactElement;
};

export type I18nProvider<Languages extends string> = {
  useLang: () => Languages;
  useTranslations<Model>(text: {
    [K in Languages]: Model;
  }): Model;
  T<Model>(props: {
    [K in Languages]: Model;
  }): ReactElement;
};

export type TranslationofConfig<T> = T extends I18nConfig<never, infer Keys>
  ? Translation<Keys>
  : never;

/**
 * A type-safe light-weight implmentation of i18n
 */
export function initI18n<Languages extends string>(config: {
  /**
   * get and subscribe current langauge
   */
  useLang: () => Languages;
}): I18nProvider<Languages> {
  return {
    useLang: config.useLang,
    useTranslations(text) {
      const lang = config.useLang();

      return text[lang];
    },
    T(props) {
      const lang = config.useLang();

      return <>{props[lang]}</>;
    },
  };
}

export function createI18n<Model extends TranslationModel, Languages extends string>(
  provider: I18nProvider<Languages>,
  translations: {
    [lang in Languages]: Translation<Model>;
  }
): I18nConfig<Languages, Model> {
  return {
    translations: translations,
    useTranslations() {
      const lang = provider.useLang();
      const translation = translations[lang];

      return translation;
    },
    T({ text }) {
      const lang = provider.useLang();
      const translation = translations[lang];
      if (typeof text === 'function') return <>{text(translation)}</>;

      return <>{translation[text]}</>;
    },
  };
}
