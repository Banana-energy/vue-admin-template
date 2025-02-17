import type { UploadProgressEvent, UploadRequestHandler, UploadRequestOptions, } from "element-plus"
import { getOSSSign, } from "@/apis/upload"
import { isNil, } from "lodash-es"

export interface OssUploadFile {
  /**
   * 文件内型
   */
  contentType: string
  /**
   * 文件下载地址
   */
  downLoadUrl: string
  /**
   * 相对文件路径
   */
  objectName: string
  /**
   * 文件名
   */
  originFileName: string
  /**
   * 文件大小
   */
  size: number
}

/**
 * 上传过程中 AJAX 请求的错误类。
 */
export class UploadAjaxError extends Error {
  name = "UploadAjaxError"
  status: number
  method: string
  url: string
  /**
   * 创建 UploadAjaxError 实例。
   * @param {string} message 错误信息。
   * @param {number} status HTTP 状态码。
   * @param {string} method HTTP 方法。
   * @param {string} url 请求的 URL。
   */
  constructor(message: string, status: number, method: string, url: string,) {
    super(message,)
    this.status = status
    this.method = method
    this.url = url
  }
}
/**
 * 从 XMLHttpRequest 获取响应体。
 * @param {XMLHttpRequest} xhr XMLHttpRequest 实例。
 * @returns {XMLHttpRequestResponseType} 响应体内容。
 */
function getBody(xhr: XMLHttpRequest,): XMLHttpRequestResponseType {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text,)
  } catch {
    return text
  }
}
/**
 * 获取上传过程中的错误信息。
 * @param {string} action 执行的动作或 URL。
 * @param {UploadRequestOptions} option 上传请求选项。
 * @param {XMLHttpRequest} xhr XMLHttpRequest 实例。
 * @returns {UploadAjaxError} 上传 AJAX 错误实例。
 */
function getError(
  action: string,
  option: UploadRequestOptions,
  xhr: XMLHttpRequest,
): UploadAjaxError {
  let msg: string
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`
  }

  return new UploadAjaxError(msg, xhr.status, option.method, action,)
}

export const httpRequest: UploadRequestHandler = (option: UploadRequestOptions,) => {
  if (typeof XMLHttpRequest === "undefined")
    throw new Error("XMLHttpRequest is undefined",)
  const xhr = new XMLHttpRequest()

  getOSSSign({ fileName: option.file.name, },)
    .then((response,) => {
      if (!response) {
        option.onError(getError("getOSSSign", option, xhr,),)
        return
      }
      const { datas, } = response
      const {
        originName: name,
        objectName: key,
        policy,
        accessid: OSSAccessKeyId,
        callback,
        signature,
        host,
      } = datas

      option.action = host!
      const action = option.action

      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt,) => {
          const progressEvt = evt as UploadProgressEvent
          progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
          option.onProgress(progressEvt,)
        },)
      }

      const formData = new FormData()
      const form = Object.assign(
        { name: encodeURIComponent(name!,), key, policy, OSSAccessKeyId, callback, signature, },
        { success_action_status: 200, },
      )
      Object.entries(form,).forEach(([key, value,],) => {
        if (typeof value !== "undefined") {
          formData.set(key, value.toString(),)
        }
      },)
      // 使用Object.entries会将file对象转为普通Object对象
      formData.set("file", option.file,)

      xhr.addEventListener("error", () => {
        option.onError(getError(action, option, xhr,),)
      },)

      xhr.addEventListener("load", () => {
        if (xhr.status !== 200) {
          return option.onError(getError(action, option, xhr,),)
        }
        option.onSuccess(getBody(xhr,),)
      },)

      xhr.open(option.method, action, true,)

      if (option.withCredentials && "withCredentials" in xhr) {
        xhr.withCredentials = true
      }

      const headers = option.headers || {}
      if (headers instanceof Headers) {
        headers.forEach((value, key,) => xhr.setRequestHeader(key, value,),)
      } else {
        for (const [key, value,] of Object.entries(headers,)) {
          if (isNil(value,))
            continue
          xhr.setRequestHeader(key, String(value,),)
        }
      }
      xhr.send(formData,)
    },)
    .catch(() => {
      option.onError(getError("get", option, xhr,),)
    },)

  return xhr
}
