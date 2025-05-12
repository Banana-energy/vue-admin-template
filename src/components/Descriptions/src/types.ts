type Primitive = string | number | boolean | symbol | bigint | null | undefined

type Join<K, P,> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never

type FieldPaths<T,> = {
  [K in keyof T]-?: T[K] extends Primitive
    ? `${K & string}`
    : `${K & string}` | Join<K & string, FieldPaths<NonNullable<T[K]>>>
}[keyof T]

export interface DescriptionItem<T extends Record<string, any> = Record<string, any>,> {
  span?: number
  field: FieldPaths<T>
  label?: string
  width?: string | number
  minWidth?: string | number
  align?: "left" | "center" | "right"
  labelAlign?: "left" | "center" | "right"
  className?: string
  labelClassName?: string
  [key: string]: any
}

export interface Props {
  column?: number
  title?: string
  message?: string
  collapse?: boolean
  border?: boolean
  labelSuffix?: string
  descriptions?: DescriptionItem[]
  data?: Record<string, any>
}

export const defaultProps = {
  title: "",
  column: 2,
  message: "",
  collapse: true,
  border: false,
  labelSuffix: ":",
  descriptions: (): DescriptionItem[] => [],
  data: () => ({}),
}
