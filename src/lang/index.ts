import KiwiIntl from "kiwi-intl";
import Cookies from "js-cookie";
// 业务多语言
import zhLocale from "./translations/zh_CN";
import enLocale from "./translations/en_US";
// element多语言
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import enUs from "element-plus/lib/locale/lang/en";

type KiwiLang = {
  [key: string]: KiwiValues;
};

type KiwiValues = {
  [key in keyof typeof zhLocale]: Language | string;
} & typeof zhCn;

type Language = {
  [key: string]: string | Language | string[];
};

type Messages = {
  [key in keyof KiwiLang]: KiwiValues;
};

const messages: KiwiLang = {
  zh_CN: {
    ...zhLocale,
    ...zhCn,
  },
  en_US: {
    ...enLocale,
    ...enUs,
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

export function getCurrentMessage() {
  return messages[getLanguage()];
}

export const i18n = KiwiIntl.init(
  getLanguage(),
  Object.keys(messages).reduce<Messages>((rs, key) => {
    rs[key] = messages[key];
    return rs;
  }, {})
);
