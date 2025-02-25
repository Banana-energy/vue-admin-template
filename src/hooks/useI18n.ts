import type { I18n, } from "vue-i18n"
import { noop, } from "lodash-es"

export function useI18n() {
  const i18n = inject<I18n>("i18n",)
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
