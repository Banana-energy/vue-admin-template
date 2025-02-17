import type { ApiConfig, } from "@/components/ApiSelect"
import { get, postJSON, } from "@/utils/fetch.ts"

export namespace UserInfoAPI {
  export interface UserInfo {
    /**
     * 用户Id
     */
    userId: string
    /**
     * 用户名称
     */
    name: string
    /**
     * 用户头像
     */
    avatarUrl: string
    /**
     * 用户邮箱
     */
    email: string
  }
  export type Response = ResponseData<UserInfo>
}

export function fetchUserInfo() {
  return postJSON<UserInfoAPI.Response>({
    url: "/pdm/common/sso/client/user",
  },)
}

export namespace AllUserAPI {
  export interface Data {
    /**
     * 子类
     */
    child?: Data[] | null
    /**
     * 用户Id
     */
    id?: number | null
    /**
     * 用户名称 只有在最后一级才是用户名称 其他的都是组织架构名称
     */
    name?: null | string
  }
  export type Response = ResponseData<Data[]>
}

export function fetchAllUser() {
  return get<AllUserAPI.Response>({
    url: "/pdm-base/base/allUsers",
  },)
}

export const allUserApiConfig: ApiConfig = {
  api: fetchAllUser,
  config: {
    label: "name",
    value: "id",
    children: "child",
  },
}
