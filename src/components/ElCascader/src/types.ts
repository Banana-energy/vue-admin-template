import type { cascaderProps, ElCascader, } from "element-plus"

export type ElCascaderInstance = InstanceType<typeof ElCascader>

export type Props = Partial<ExtractPropTypes<typeof cascaderProps>>
