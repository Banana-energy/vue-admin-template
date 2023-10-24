import { getLanguage, useLocale } from '@/lang';

const { setLocale } = useLocale();

export const useLanguageStore = defineStore('LanguageStore', {
  state: () => ({
    language: getLanguage(),
  }),
  actions: {
    setLanguage(language) {
      setLocale(language);
      this.language = language;
    },
  },
});
