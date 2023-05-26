import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    // 请求地址，不带 baseURL
    url: string;
    // 反回值是否没有 code 属性
    dataNotIncludeCode?: boolean;
    // 不要携带 token
    notNeedToken?: boolean;
  }
}
