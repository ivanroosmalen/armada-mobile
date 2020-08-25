import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import _ from 'lodash';

import en from './en.json';
import pt from './pt.json';
import ru from './ru.json';

import moment from 'moment/min/moment-with-locales';

const translations = { en, ru, pt };

const translate = _.memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

const setI18nConfig = () => {
  const fallback = { languageTag: 'en' }
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translations)) ||
    fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translations[languageTag] }
  i18n.locale = languageTag;
  return translations[languageTag];
}

setI18nConfig();

const setLocateConfig = (LocaleConfig) => {
    const moment_locale = moment.localeData(i18n.locale);

    let translations = {
       monthNames: moment_locale.months(),
       monthNamesShort: moment_locale.monthsShort(),
       dayNames: moment_locale.weekdays(),
       dayNamesShort: moment_locale.weekdaysShort(),
    };

    if(i18n.locale === 'pt') {
        translations.today = 'Hoje';
    }

    LocaleConfig.locales[i18n.locale] = translations
    LocaleConfig.defaultLocale = i18n.locale;

    return translations;
}

module.exports = {
    translate,
    setI18nConfig,
    i18n,
    setLocateConfig
}
