import { postFormData, } from "@/utils/fetch.ts"

export namespace UploadAPI {
  export type Response = ResponseData<BaseFileDTO[]>
}

export function uploadFilesWithoutExpire(files: File[],) {
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i],)
  }
  return postFormData<UploadAPI.Response>({
    url: "/pdm-base/file/batchUploadNoExpire",
    data: formData,
  },)
}
