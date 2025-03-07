import type { DialogProps, } from "element-plus"

export type Props = Partial<DialogProps> & {
  loading?: boolean
  maxHeight?: string | number
}
