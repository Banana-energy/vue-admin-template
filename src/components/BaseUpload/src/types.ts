import type { UploadInstance, } from "element-plus"

export type UploadProps = UploadInstance["$props"]

export interface Props extends /* @vue-ignore */ UploadProps {
  modelValue?: BaseFileDTO[]
  sizeLimit?: number
  hideOnExceeded?: boolean
}
