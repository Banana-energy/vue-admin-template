import type { RouteInfoAPI, } from "@/apis/route"
import type { RouteRecordRaw, } from "vue-router"
import { fetchUserMenus, getUserRes, } from "@/apis/route"
import { constantRouterMap, } from "@/setup"
import router from "@/setup/vue-router"
import { flatMultiLevelRoutes, generateRoutesByServer, } from "@/utils/routerHelper.ts"
import { cloneDeep, } from "lodash-es"
import { defineStore, } from "pinia"

export const useRouteStore = defineStore("route", {
  state: (): RouteInfoAPI.RouteInfo => {
    return {
      routers: [],
      addRouters: [],
      menuTabRouters: [],
      permissions: [],
      resList: [],
      skipAuth: false,
      fetched: false,
    }
  },
  getters: {
    getRouters(): CustomRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): CustomRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters,),)
    },
    getMenuTabRouters(): CustomRouteRecordRaw[] {
      return this.menuTabRouters
    },
  },
  actions: {
    setMenuTabRouters(routers: CustomRouteRecordRaw[],): void {
      this.menuTabRouters = routers
    },
    async fetchResList(id: number,) {
      const result = await getUserRes(id,)
      if (result) {
        this.resList = result.res
        this.skipAuth = result.skipAuth
      }
      return result?.res || []
    },
    async fetchRouters() {
      const result = await fetchUserMenus()
      if (result) {
        this.generateRoutes(result.menus,)
      }
    },
    generateRoutes(routers: RouteInfoAPI.PmsRouteRecordRaw[],) {
      const routerMap = generateRoutesByServer(routers,)
      this.addRouters = routerMap.concat([
        {
          path: "/:path(.*)*",
          redirect: "/404",
          name: "404Page",
          meta: {
            hidden: true,
            breadcrumb: false,
          },
        },
      ],)
      this.routers = cloneDeep(constantRouterMap,).concat(routerMap,)
      this.addRouters.forEach((route,) => {
        router.addRoute(route as RouteRecordRaw,)
      },)
      this.fetched = true
    },
  },
},)
