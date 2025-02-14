import type { ElMessageBoxOptions, } from "element-plus"
import { ElMessageBox, } from "element-plus"
import { noop, } from "lodash-es"

export function MessageBox(message: string, options?: ElMessageBoxOptions,) {
  const type = options?.type || "warning"
  const title = options?.title || "提示"
  const formatOptions: ElMessageBoxOptions = {
    title,
    type,
    message,
    draggable: true,
    showCancelButton: true,
    ...options,
  }
  return ElMessageBox(formatOptions,).catch(noop,)
}
