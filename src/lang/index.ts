import KiwiIntl from "kiwi-intl";
import Cookies from "js-cookie";
import zhLocale from "../../.kiwi/zh-CN/";

type KiwiLang = {
  [key: string]: KiwiValues;
};

type KiwiValues = {
  common: Language;
};

type Language = {
  [key: string]: string;
};

type Messages = {
  [key: string]: Language;
};

export const messages: KiwiLang = {
  "zh-CN": {
    ...zhLocale,
  },
};

export function getLanguage() {
  const chooseLanguage = Cookies.get("language");
  if (chooseLanguage) {
    document.documentElement.lang = chooseLanguage;
    return chooseLanguage;
  }

  // if has not choose language
  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = language;
      return locale;
    }
  }
  document.documentElement.lang = "en_US";
  return "en_US";
}

const i18n = KiwiIntl.init(
  "zh-CN",
  Object.keys(messages).reduce<Messages>((rs, key) => {
    rs[key] = messages[key].common;
    return rs;
  }, {})
);

export default i18n;
