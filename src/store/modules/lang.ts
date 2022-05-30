import { getLanguage } from "@/lang";
import Cookies from "js-cookie";

interface LanguageState {
  language: string;
}

export const useLanguageStore = defineStore("LanguageStore", {
  state: (): LanguageState => ({
    language: getLanguage(),
  }),
  actions: {
    setLanguage(language: string) {
      Cookies.set("language", language);
      this.language = language;
    },
  },
});
