import type { ElMessageBoxOptions, } from "element-plus"
import { ElMessageBox, } from "element-plus"
import { noop, } from "lodash-es"
import "element-plus/es/components/message-box/style/index"

export function MessageBox(message: string, options?: ElMessageBoxOptions,) {
  const type = options?.type || "warning"
  const title = options?.title || "提示"
  const formatOptions: ElMessageBoxOptions = {
    title,
    type,
    message,
    draggable: true,
    lockScroll: true,
    showCancelButton: true,
    closeOnClickModal: false,
    ...options,
  }
  return ElMessageBox(formatOptions,).catch(noop,)
}
