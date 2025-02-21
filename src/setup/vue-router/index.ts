import type { App, } from "vue"
import type { RouteRecordRaw, } from "vue-router"
import { TOKEN_NAME, useToken, } from "@/hooks/useToken.ts"
import { useRouteStore, } from "@/store/Route"
import { useUserStore, } from "@/store/UserInfo"
import { Layout, } from "@/utils/routerHelper.ts"
import { cloneDeep, } from "lodash-es"
import { createRouter, createWebHistory, } from "vue-router"
import { checkVersionFn, findRouteByName, } from "./helper.ts"

export const constantRouterMap: CustomRouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    name: "Root",
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: "/home",
    component: Layout,
    name: "home",
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        path: "",
        component: () => import("@/views/workbench/index.vue"),
        name: "Home",
        meta: {
          affix: true,
          icon: "cil:house",
          title: "Home",
        },
      },
    ],
  },
  {
    path: "/redirect",
    component: Layout,
    name: "RedirectIndex",
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/views/redirect/redirect.vue"),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: "/not-found",
    component: () => import("@/views/error/not-found.vue"),
    name: "NotFound",
    meta: {
      hidden: true,
      title: "Not Found",
      noTagsView: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [],
  scrollBehavior: () => ({ left: 0, top: 0, }),
},)

const { start, done, } = useNProgress()

const { loadStart, loadDone, } = usePageLoading()

const { setToken, } = useToken()

router.beforeEach(async(to, from, next,) => {
  const userStore = useUserStore()

  const routeStore = useRouteStore()
  start()
  loadStart()
  checkVersionFn()
  // todo 初始化国际化资源
  const { name, } = to
  const token = to.query[TOKEN_NAME]
  if (token && typeof token === "string") {
    setToken(token,)
    const query = cloneDeep(to.query,)
    Reflect.deleteProperty(query, TOKEN_NAME,)
    next({
      path: to.path,
      query: { ...query, },
      replace: true,
    },)
    return
  }
  if (!userStore.userId) {
    const result = await userStore.getUserInfo()
    if (!result) {
      next()
      return
    }
  }

  if (routeStore.fetched && typeof name === "string") {
    const route = findRouteByName(
      routeStore.routers,
      name,
    )
    if (route?.id) {
      await routeStore.fetchResList(route.id,)
    }
    next()
    return
  }
  await routeStore.fetchRouters()
  const redirectPath = from.query.redirect || to.path
  const redirect = decodeURIComponent(redirectPath as string,)
  const nextData = to.path === redirect ? { ...to, replace: true, } : { path: redirect, }
  next(nextData,)
},)

router.afterEach((to,) => {
  done()
  loadDone()
},)

export function setupRouter(app: App<Element>,) {
  constantRouterMap.forEach((route,) => {
    router.addRoute(route as RouteRecordRaw,)
  },)
  app.use(router,)
}

export default router
