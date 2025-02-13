export interface DescriptionItem<T extends Recordable = Record<string, any>,> {
  span?: number
  field: keyof T
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
  title?: string
  message?: string
  collapse?: boolean
  border?: boolean
  labelSuffix?: string
  descriptions?: DescriptionItem[]
  data?: Recordable
}

export const defaultProps = {
  title: "",
  message: "",
  collapse: true,
  border: true,
  labelSuffix: ":",
  descriptions: (): DescriptionItem[] => [],
  data: () => ({}),
}
