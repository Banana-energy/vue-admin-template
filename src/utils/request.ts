import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { start, done } from "@/utils/nprogress";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import env from "@/config/env";
import qs from "qs";
import to from "await-to-js";

const TIMEOUT = import.meta.env.DEV ? 1000 * 20 : 5 * 1000 * 60;

const enum TIP_MESSAGE {
  ServerError = "服务端出错，请稍后再试!",
  ClientError = "请求发生错误，请稍后再试!",
  DefaultError = "发生未知错误，请稍后再试!",
}

const service = axios.create({
  baseURL: env.baseUrl,
  withCredentials: true,
  timeout: TIMEOUT,
});

const handleError = (msg: string) => {
  const localMsg = msg || TIP_MESSAGE.DefaultError;
  ElMessage.error(localMsg);
};

service.interceptors.request.use(
  (config) => {
    start();
    const token = sessionStorage.getItem("Token");
    if (token && config.headers && !(config as RequestConfig).notNeedToken) {
      config.headers.satoken = token;
    }
    // 处理 get 请求的 data 参数
    if (config.method === "get" && config.data) {
      config.url += "?" + qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    done();
    handleError(TIP_MESSAGE.ClientError);
    return Promise.reject(error);
  }
);

interface ResponseData {
  code?: string | null;
  data?: unknown;
  msg?: string | null;
  traceId?: string | null;
}

service.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    done();
    const { data, config } = response;
    if ((config as RequestConfig).dataNotIncludeCode) {
      return data;
    }
    const { code } = data;
    if (code !== "200") {
      const msg = data.msg || TIP_MESSAGE.ServerError;
      handleError(msg);
      if (code === "token.error") {
        const userStore = useUserStore();
        userStore.resetToken();
        location.reload();
      }
      return Promise.reject(new Error(msg));
    }
    return data;
  },
  (error: Error) => {
    if (import.meta.env.DEV) {
      console.error(error);
    }
    done();
    handleError(error.message || TIP_MESSAGE.ClientError);
    return Promise.reject(error);
  }
);

// -------------------------------------------------
//            ↓ 请求上层封装 ↓
// -------------------------------------------------

// 扩展 axios 请求配置
type RequestConfig = AxiosRequestConfig & {
  // 请求地址，不带 baseURL
  url: string;
  // 反回值是否没有 code 属性
  dataNotIncludeCode?: boolean;
  // 不要携带 token
  notNeedToken?: boolean;
};

type Response<T = Record<string, never>> = {
  code: number;
  msg: string;
  data: T;
} & T;

type ResponsePromise<T> = Promise<[Error, undefined] | [null, Response<T>]>;

function _get<T = Record<string, never>>(
  config: RequestConfig
): ResponsePromise<T>;

function _get(config: RequestConfig) {
  return to(
    service.request({
      method: "get",
      ...config,
    })
  );
}

function _putJSON<T = Record<string, never>>(
  config: RequestConfig
): ResponsePromise<T>;

function _putJSON(config: RequestConfig) {
  return to(
    service.request({
      method: "put",
      headers: {
        "context-type": "application/json",
      },
      ...config,
    })
  );
}

function _postJSON<T = Record<string, never>>(
  config: RequestConfig
): ResponsePromise<T>;

function _postJSON(config: RequestConfig) {
  return to(
    service.request({
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      ...config,
    })
  );
}

export const get = _get;
export const postJSON = _postJSON;
export const putJSON = _putJSON;
