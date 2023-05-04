import { getLanguage, useLocale } from "@/lang";

interface LanguageState {
  language: string;
}

const { setLocale } = useLocale();

export const useLanguageStore = defineStore("LanguageStore", {
  state: (): LanguageState => ({
    language: getLanguage(),
  }),
  actions: {
    setLanguage(language: string) {
      setLocale(language);
      this.language = language;
    },
  },
});
