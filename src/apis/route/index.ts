import type { RouteRecordSingleViewWithChildren, } from "vue-router"
import { get, } from "@/utils/fetch.ts"

export namespace UserResAPI {
  export interface Data {
    menuId: number // 菜单id
    res: Res[] // 资源数组
    skipAuth: boolean // 是否跳过授权
    userId: number // 用户id
  }
  export interface Res {
    code: string // 菜单资源code
    name: string // 菜单资源名称
  }
  export type Response = Data // 响应数据类型
}

export function getUserRes(id: number,) {
  return get<UserResAPI.Response>({
    url: `/mmfc/mmfc-order-manager-rest/common/pms/user/menu/res/${id}`,
  },)
}

export namespace RouteInfoAPI {
  export type PmsRouteRecordRaw = RouteRecordSingleViewWithChildren & {
    appId: number
    children: PmsRouteRecordRaw[]
    code: string
    component: string
    hidden: number
    icon: string
    id: number
    level: number
    meta: { [key: string]: any }
    name: string
    parentId: number
    path: string
    redirect: string
    requireAuth: number
    sort: number
  }

  export interface RouteInfo {
    routers: CustomRouteRecordRaw[]
    addRouters: CustomRouteRecordRaw[]
    fetched: boolean
    menuTabRouters: CustomRouteRecordRaw[]
    permissions: string[]
    resList: UserResAPI.Res[]
    skipAuth: boolean
  }

  export interface UserMenusResponse {
    menus: PmsRouteRecordRaw[]
    /**
     * 用户id
     */
    userId: number
  }

  export type Response = UserMenusResponse
}

export function fetchUserMenus() {
  return get<RouteInfoAPI.Response>({
    url: "/mmfc/mmfc-order-manager-rest/common/pms/user/menus",
    fetchOptions: {
      rawData: true,
    },
  },)
}
