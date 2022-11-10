import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { start, done } from "@/utils/nprogress";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import env from "@/config/env.config";
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
    if (token && config.headers && !config.notNeedToken) {
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
  code?: number | null;
  data?: unknown;
  msg?: string | null;
  traceId?: string | null;
}

service.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    done();
    const { data, config } = response;
    if (config.dataNotIncludeCode) {
      return data;
    }
    const { code } = data;
    if (code !== 200) {
      const msg = data.msg || TIP_MESSAGE.ServerError;
      handleError(msg);
      if (code === 401) {
        const userStore = useUserStore();
        userStore.resetState();
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

type Response<T = Record<string, never>> = {
  code: number;
  msg: string;
  data: T;
} & T;

type ResponsePromise<T> = Promise<[Error, undefined] | [null, Response<T>]>;

function _get<T = Record<string, never>>(
  config: AxiosRequestConfig
): ResponsePromise<T>;

function _get(config: AxiosRequestConfig) {
  return to(
    service.request({
      method: "get",
      ...config,
    })
  );
}

function _putJSON<T = Record<string, never>>(
  config: AxiosRequestConfig
): ResponsePromise<T>;

function _putJSON(config: AxiosRequestConfig) {
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
  config: AxiosRequestConfig
): ResponsePromise<T>;

function _postJSON(config: AxiosRequestConfig) {
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

// post formData
function _postFormData<T = Record<string, never>>(
  config: AxiosRequestConfig
): ResponsePromise<T>;

function _postFormData(config: AxiosRequestConfig) {
  return to(
    service.request({
      method: "post",
      headers: {
        "content-type": "multipart/form-data",
      },
      ...config,
    })
  );
}

// post form
function _postForm<T = Record<string, never>>(
  config: AxiosRequestConfig
): ResponsePromise<T>;
function _postForm(config: AxiosRequestConfig) {
  return to(
    service.request({
      method: "post",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      ...config,
    })
  );
}

export const postForm = _postForm;
export const postFormData = _postFormData;
export const get = _get;
export const postJSON = _postJSON;
export const putJSON = _putJSON;
