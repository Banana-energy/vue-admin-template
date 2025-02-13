import { postJSON, } from "@/utils/fetch.ts"

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
