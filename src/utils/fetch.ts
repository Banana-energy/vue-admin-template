import type { AxiosRequestConfig, AxiosResponse, Method, } from "axios"
import to from "await-to-js"
import axios, { AxiosError, } from "axios"
import { ElMessage, } from "element-plus"
import qs from "qs"

const fetch = axios.create({
  adapter: "fetch",
  timeout: 10000,
  paramsSerializer(params,) {
    return qs.stringify(params, {
      arrayFormat: "comma",
    },)
  },
},)

function getErrorMsg() {
  return {
    CLIENT_ERROR: "客户端出错，请稍后再试!",
    SERVER_ERROR: "服务器出错，请稍后再试!",
    DEFAULT_ERROR: "未知错误，请稍后再试!",
  }
}

enum ResponseCode {
  REDIRECTION = "302",
  UNAUTHORIZED = "401",
}

interface UnAuthorizedResponse {
  redirectPath: string
}

function handleError(msg: string = getErrorMsg().DEFAULT_ERROR,) {
  ElMessage.error(msg,)
}

const { getToken, removeToken, } = useToken()
const { start, done, } = useNProgress()

fetch.interceptors.request.use((config,) => {
  start()
  if (config.headers) {
    const { localeState, } = useLocale()
    config.headers["x-referer"] = location.href
    config.headers["x-language"] = localeState.value
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
  }
  return config
}, (error,) => {
  done()
  handleError(error.message || getErrorMsg().CLIENT_ERROR,)
  return Promise.reject(error,)
},)

fetch.interceptors.response.use((response: AxiosResponse<NewResponseData<UnAuthorizedResponse> | BasicResponseData>,) => {
  done()
  const { data, config, } = response
  if (config.fetchOptions?.rawData) {
    return response
  }
  if ("responseCode" in data && (ResponseCode.REDIRECTION === data.responseCode || ResponseCode.UNAUTHORIZED === data.responseCode)) {
    removeToken()
    location.replace(data.data.redirectPath,)
    return response
  }
  if ("success" in data) {
    if (!data.success) {
      handleError(data.responseDesc || getErrorMsg().SERVER_ERROR,)
      return Promise.reject(response,)
    }
    return response
  }
  if ("isSuccess" in data) {
    if (!data.isSuccess) {
      handleError(data.msg || getErrorMsg().SERVER_ERROR,)
      return Promise.reject(response,)
    }
    return response
  }
  return response
}, (error,) => {
  done()
  if (error.code === AxiosError.ERR_CANCELED || error.code === AxiosError.ECONNABORTED) {
    return
  }
  handleError(error.message || getErrorMsg().SERVER_ERROR,)
  return Promise.reject(error,)
},)

async function formatRequest<T,>(method: Method, config: AxiosRequestConfig, headers: AxiosRequestConfig["headers"] = {},) {
  const formatConfig = {
    method,
    ...config,
    headers: {
      ...headers,
      ...config.headers,
    },
  }
  const [error, response,] = await to<AxiosResponse<T>>(
    fetch.request(formatConfig,),
  )

  if (!error && response) {
    return response.data
  }
}

// GET 请求方法
export function get<T, >(config: AxiosRequestConfig,) {
  return formatRequest<T>("GET", config,)
}

// POST JSON 请求方法
export function postJSON<T, >(config: AxiosRequestConfig,) {
  return formatRequest<T>("POST", config, {
    ...config.headers,
    "Content-Type": "application/json",
  },)
}

export function postFormData<T, >(config: AxiosRequestConfig,) {
  return formatRequest<T>("POST", config, {
    ...config.headers,
    "Content-Type": "multipart/form-data",
  },)
}

export { fetch, }
