import type { UploadInstance, UploadRequestHandler, } from "element-plus"

export type UploadProps = UploadInstance["$props"]

export interface Props extends /* @vue-ignore */ UploadProps {
  httpRequest?: UploadRequestHandler
  modelValue?: BaseFileDTO[]
  sizeLimit?: number
  hideOnExceeded?: boolean
}
