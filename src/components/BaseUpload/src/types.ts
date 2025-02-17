import type { UploadProps, UploadRequestHandler, } from "element-plus"
import { getToken, } from "@/hooks/useToken.ts"

export interface Props extends Partial<UploadProps> {
  httpRequest?: UploadRequestHandler
  modelValue?: BaseFileDTO[]
  sizeLimit?: number
  hideOnExceeded?: boolean
}

export const defaultProps = {
  modelValue: () => [],
  limit: 0,
  accept: "",
  sizeLimit: 0,
  autoUpload: true,
  showFileList: true,
  hideOnExceeded: true,
  headers: () => ({
    "x-sso-auth": getToken(),
  }),
}
