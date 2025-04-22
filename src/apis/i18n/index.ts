import type { i18n, } from "@/setup"
import { IMPORT_META_ENV, } from "@/constants"
import { postJSON, } from "@/utils/fetch.ts"

export function getI18nMessage() {
  return postJSON<NewResponseData<typeof i18n.global.messages.value>>({
    url: `${IMPORT_META_ENV.VITE_I18N_URL}/client/pull/text-map`,
    data: {
      app: [IMPORT_META_ENV.VITE_I18N_APP,],
      codeType: "TEXT",
    },
  },)
}
