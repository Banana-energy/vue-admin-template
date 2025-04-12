import type { App, } from "vue"
import type { RouteRecordRaw, } from "vue-router"
import { IMPORT_META_ENV, } from "@/constants"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"
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
      title: "Home",
      activeMenu: "/home",
    },
    children: [
      {
        path: "/home",
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

const { localeState, setLocale, } = useLocale()

const whiteList = [
  "/home",
  "/not-found",
  "/redirect",
]

router.beforeEach(async(to, from,) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()
  start()
  loadStart()
  await setLocale(localeState.value,)
  checkVersionFn()
  const { name, } = to
  const query = cloneDeep(to.query,)
  const token = query[TOKEN_NAME]
  if (token && typeof token === "string") {
    setToken(token,)
    Reflect.deleteProperty(query, TOKEN_NAME,)
    Reflect.deleteProperty(query, "wg_oauth_refresh",)
    Reflect.deleteProperty(query, "wg_oauth",)
    return {
      path: to.path,
      query: { ...query, },
      replace: true,
    }
  }
  if (!userStore.uid) {
    const result = await userStore.getUserInfo()
    if (!result) {
      return whiteList.includes(to.path,)
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
    return true
  }
  const result = await routeStore.fetchRouters()
  if (!result) {
    if (!whiteList.includes(to.path,)) {
      return {
        name: "NotFound",
        replace: true,
      }
    }
    return true
  }
  const redirectPath = from.query.redirect || to.path
  const redirect = decodeURIComponent(redirectPath as string,)
  return to.path === redirect ? to.path : redirect
},)

router.afterEach((to,) => {
  document.title = `${IMPORT_META_ENV.VITE_APP_TITLE} - ${useI18nTitle(to.meta,)}`
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
