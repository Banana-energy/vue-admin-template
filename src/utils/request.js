import axios from 'axios';
import { done, start } from '@/utils/nprogress';
import { useToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { i18n } from '@/lang';
import qs from 'qs';
import to from 'await-to-js';
import env from '@/constants/env.config';
import dayjs from 'dayjs';
import { exportResponseData } from './export';

const TIMEOUT = import.meta.env.DEV ? 1000 * 20 : 5 * 1000 * 60;

const service = axios.create({
  baseURL: env.baseUrl,
  withCredentials: true,
  timeout: TIMEOUT,
});

const handleError = (msg) => {
  const localMsg = msg || i18n.get('common.DefaultError');
  ElMessage.error(localMsg);
};

service.interceptors.request.use(
  (config) => {
    start();
    const { getToken } = useToken();
    if (config.headers) {
      config.headers['x-referer'] = location.href;
      if (!config.notNeedToken && getToken()) {
        config.headers.Authorization = `${getToken()}`;
      }
      if (!config.data && !config.params) {
        // 后端根据content-type来判断是否是json请求，而没有传递参数时，axios会删除content-type
        config.headers['Content-Type'] = 'application/json';
        config.data = {};
      }
    }
    // 处理 get 请求的 data 参数
    if (config.method === 'get' && Object.keys(config.data).length) {
      config.url += '?' + qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    done();
    handleError(i18n.get('common.ClientError'));
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
    if (config.responseRes === 'blob') {
      const data = response.data;
      const contentType = response.headers['content-type'];
      let fileName;
      if (response.headers['content-disposition']) {
        fileName = decodeURI(
          response.headers['content-disposition'].match(/filename=(.*)/)?.[1] ||
          ''
        );
      } else {
        fileName = dayjs().format('YYYYMMDD');
      }
      exportResponseData(data, contentType, fileName);
      return;
    }
    const { responseCode } = data || {};
    if (responseCode !== '0001') {
      const msg =
        data?.responseDesc ||
        data?.error ||
        data?.msg ||
        data?.message ||
        i18n.get('common.ServerError');
      if (responseCode === '401' || responseCode === '302') {
        const { removeToken } = useToken();
        const userStore = useUserStore();
        userStore.resetState();
        removeToken();
        location.replace(data?.data?.redirectPath || '/');
      }
      handleError(msg);
      return Promise.reject(new Error(msg));
    }
    return data;
  },
  (error) => {
    if (!env.isProd) {
      console.error(error);
    }
    done();
    if (error.name === 'CanceledError') {
      return Promise.reject(error);
    }
    handleError(error.message || i18n.get('common.ClientError'));
    return Promise.reject(error);
  }
);

// -------------------------------------------------
//            ↓ 请求上层封装 ↓
// -------------------------------------------------

function _get(config) {
  return to(
    service.request({
      method: 'GET',
      ...config,
    })
  );
}

function _putJSON(config) {
  return to(
    service.request({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })
  );
}

function _postJSON(config) {
  return to(
    service.request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })
  );
}

function _postFormData(config) {
  return to(
    service.request({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  );
}

function _postForm(config) {
  return to(
    service.request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...config,
    })
  );
}

// 导出文件
function _exportFile(config) {
  return to(
    service.request({
      method: 'GET',
      responseType: 'blob',
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
