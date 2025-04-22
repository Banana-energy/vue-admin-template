import { i18n, } from "@/setup/vue-i18n"
import { noop, } from "lodash-es"

export function useI18n() {
  if (!i18n) {
    return {
      t: () => "",
      setLocaleMessage: noop,
    }
  }
  const { t, ...methods } = i18n.global

  return {
    t,
    ...methods,
  }
}
