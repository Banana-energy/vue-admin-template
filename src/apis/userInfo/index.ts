import { get, postJSON, } from "@/utils/fetch.ts"

export namespace UserInfoAPI {
  export interface Dept {
    id: number
    uid: string
    name: string
    parentId: number
    parentUid: string
    leaderUserId: number
    leaderUserUid: string
    source: string
    type: string
    order: number
  }

  export interface UserInfo {
    id?: number
    uid?: string
    name?: string
    fullName?: string
    email?: string
    mobileCountryCode?: string
    mobile?: string
    gender?: number
    avatar?: string
    employeeNo?: string
    employeeType?: number
    status?: number
    leaderUserId?: number
    leaderUserUid?: string
    city?: string
    jobTitle?: string
    source?: string
    depts?: Dept[]
  }
  export type Response = UserInfo
}

export function fetchUserInfo() {
  return get<UserInfoAPI.Response>({
    url: "/mmfc/mmfc-order-manager-rest/common/pms/user/info",
    fetchOptions: {
      raw: true,
    },
  },)
}

export function logout() {
  return postJSON({
    url: "/mmfc/mmfc-order-manager-rest/common/sso/client/logout",
  },)
}
