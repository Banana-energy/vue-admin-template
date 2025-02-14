import { postFormData, postJSON, } from "@/utils/fetch.ts"

export namespace UploadAPI {
  export type Response = ResponseData<BaseFileDTO[]>
}

export namespace GetOSSSignAPI {
  export interface Params {
    /**
     * 唯一配置id
     */
    configCode?: string
    /**
     * 文件名
     */
    fileName: string
    /**
     * 文件类型
     */
    fileType?: string
    /**
     * 文件大小，单位KB
     */
    kbSize?: number
  }
  export interface Data {
    accessid?: string
    /**
     * 上传回调信息
     */
    callback?: string
    configCode?: string
    /**
     * sign有效期
     */
    expire?: string
    /**
     * 前端请求上传的host
     */
    host?: string
    objectName?: string
    originName?: string
    /**
     * 加密后的策略
     */
    policy?: string
    /**
     * 校验签名
     */
    signature?: string
  }
  export type Request = Params
  export type Response = ResponseData<Data>
}

/**
 * OSS上传无过期时间文件
 * @param files
 */
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

export function getOSSSign(data: GetOSSSignAPI.Request,) {
  return postJSON<GetOSSSignAPI.Response>({
    url: "/pdm-base/base/getOssSign",
    data,
  },)
}
