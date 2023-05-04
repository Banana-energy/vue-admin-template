import KiwiIntl from "kiwi-intl";
// 业务多语言
import zhLocale from "./translations/zh_CN";
import enLocale from "./translations/en_US";
// element多语言
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import enUs from "element-plus/lib/locale/lang/en";
import { useCookies } from "@vueuse/integrations/useCookies";

type KiwiLang = {
  [key: string]: KiwiValues;
};

export type KiwiValues = typeof zhLocale & typeof zhCn;

export const messages: KiwiLang = {
  zh_CN: {
    ...zhLocale,
    ...zhCn,
  },
  en_US: {
    ...enLocale,
    ...enUs,
  },
};

const locale = useLocalStorage("locale", "", {
  mergeDefaults: true,
});
const cookieLocale = useCookies(["language"]);
export function useLocale() {
  const getLocale = () => locale.value;
  const setLocale = (value: string) => {
    cookieLocale.set("language", value);
    locale.value = value;
  };
  const removeLocale = () => {
    cookieLocale.remove("language");
    locale.value = null;
  };
  return {
    getLocale,
    setLocale,
    removeLocale,
  };
}

const { getLocale, setLocale } = useLocale();

export function getLanguage() {
  const chooseLanguage = getLocale();
  if (chooseLanguage && chooseLanguage in messages) {
    document.documentElement.lang = chooseLanguage;
    setLocale(chooseLanguage);
    return chooseLanguage;
  }

  // if has not choose language
  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = language;
      setLocale(locale);
      return locale;
    }
  }
  setLocale("en_US");
  document.documentElement.lang = "en_US";
  return "en_US";
}

export const i18n = KiwiIntl.init(
  getLanguage(),
  Object.keys(messages).reduce<KiwiLang>((rs, key) => {
    rs[key] = messages[key];
    return rs;
  }, {})
);
