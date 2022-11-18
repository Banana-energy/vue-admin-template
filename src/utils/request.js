import axios from "axios";
import { start, done } from "@/utils/nprogress";
import { useToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import qs from "qs";
import to from "await-to-js";
import env from "@/constants/env.config";
import dayjs from "dayjs";
import { exportResponseData } from "./export";

const TIMEOUT = import.meta.env.DEV ? 1000 * 20 : 5 * 1000 * 60;

const service = axios.create({
  baseURL: env.baseUrl,
  withCredentials: true,
  timeout: TIMEOUT,
});

const handleError = (msg) => {
  const localMsg = msg || i18n.get("common.DefaultError");
  ElMessage.error(localMsg);
};

service.interceptors.request.use(
  (config) => {
    start();
    const { getToken } = useToken();
    if (config.headers) {
      if (!config.notNeedToken && getToken()) {
        config.headers.Authorization = `${getToken()}`;
      }
    }
    // 处理 get 请求的 data 参数
    if (config.method === "get" && config.data) {
      config.url += "?" + qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    done();
    handleError(i18n.get("common.ClientError"));
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    done();
    const { data, config } = response;
    if (config.dataNotIncludeCode) {
      return data;
    }
    if (config.responseType === "blob") {
      const data = response.data;
      const contentType = response.headers["content-type"];
      let fileName;
      if (response.headers["content-disposition"]) {
        fileName = decodeURI(
          response.headers["content-disposition"].match(/filename=(.*)/)?.[1] ||
            ""
        );
      } else {
        fileName = dayjs().format("YYYYMMDD");
      }
      exportResponseData(data, contentType, fileName);
      return;
    }
    const { code } = data || {};
    if (code !== 200) {
      const msg = data.msg || i18n.get("ServerError");
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
  (error) => {
    if (!env.isProd) {
      console.error(error);
    }
    done();
    handleError(error.message || i18n.get("common.ClientError"));
    return Promise.reject(error);
  }
);

// -------------------------------------------------
//            ↓ 请求上层封装 ↓
// -------------------------------------------------

function _get(config) {
  return to(
    service.request({
      method: "GET",
      ...config,
    })
  );
}
function _putJSON(config) {
  return to(
    service.request({
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    })
  );
}

function _postJSON(config) {
  return to(
    service.request({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    })
  );
}

function _postFormData(config) {
  return to(
    service.request({
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    })
  );
}

function _postForm(config) {
  return to(
    service.request({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...config,
    })
  );
}

// 导出文件
function _exportFile(config) {
  return to(
    service.request({
      method: "GET",
      responseType: "blob",
      ...config,
    })
  );
}

export const postForm = _postForm;
export const postFormData = _postFormData;
export const get = _get;
export const postJSON = _postJSON;
export const putJSON = _putJSON;
export const exportFile = _exportFile;
