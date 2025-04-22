import type { ComponentSize, } from "element-plus"

export interface Props {
  type?: "primary" | "success" | "warning" | "danger" | "info" | ""
  size?: ComponentSize
  truncated?: boolean
  lineClamp?: string | number
  tag?: string
}
