import type { PaginationProps, } from "element-plus"

export interface Props extends Partial<PaginationProps> {
  pager: Record<string, number>
  config?: string[]
}
