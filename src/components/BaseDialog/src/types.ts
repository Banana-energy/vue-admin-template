import type { DialogProps, } from "element-plus"

export const dialogContentMaxHeight = Symbol("dialogContentMaxHeight",) as InjectionKey<Ref<number>>

export type Props = Partial<DialogProps> & {
  loading?: boolean
  maxHeight?: string | number
}
