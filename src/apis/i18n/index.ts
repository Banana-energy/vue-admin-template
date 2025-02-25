import type { Message, } from "@/hooks/useLocale.ts"
import { IMPORT_META_ENV, } from "@/constants"
import { postJSON, } from "@/utils/fetch.ts"

export function getI18nMessage() {
  return postJSON<NewResponseData<Message>>({
    url: `${IMPORT_META_ENV.VITE_I18N_URL}/client/pull/text-map`,
    data: {
      app: [IMPORT_META_ENV.VITE_I18N_APP,],
      codeType: "TEXT",
    },
  },)
}
