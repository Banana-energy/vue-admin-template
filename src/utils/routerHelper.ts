import type { RouteInfoAPI, } from "@/apis/route"
import type { RouteLocationNormalized, Router, RouteRecordNormalized, RouteRecordRaw, } from "vue-router"
import { cloneDeep, omit, } from "lodash-es"
import { createRouter, createWebHashHistory, } from "vue-router"

const modules = import.meta.glob("../views/**/*.{vue,tsx}",)

export const Layout = () => import("@/layout/BaseLayout.vue")

export function isUrl(path: string,): boolean {
  try {
    const url = new URL(path,)
    return !!url
  } catch {
    return false
  }
}

export function getParentLayout() {
  return () =>
    new Promise((resolve,) => {
      resolve({
        name: "ParentLayout",
      },)
    },)
}

export function getRawRoute(route: RouteLocationNormalized,): RouteLocationNormalized {
  if (!route) {
    return route
  }
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }),)
      : undefined) as RouteRecordNormalized[],
  }
}

// 后端控制路由生成
export function generateRoutesByServer(routes: RouteInfoAPI.PmsRouteRecordRaw[],): CustomRouteRecordRaw[] {
  const res: CustomRouteRecordRaw[] = []

  for (const route of routes) {
    const data: CustomRouteRecordRaw = {
      id: route.id,
      path: route.path,
      name: route.code,
      redirect: route.redirect,
      meta: route.meta,
    }
    if (route.component) {
      const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
      const component = route.component as string
      if (!comModule && !component.includes("#",)) {
        console.warn(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`,)
      } else {
        // 动态加载路由文件，可根据实际情况进行自定义逻辑
        data.component
          = component === "#" ? Layout : component.includes("##",) ? getParentLayout() : comModule
      }
    }
    // recursive child routes
    if (route.children) {
      data.children = generateRoutesByServer(route.children,)
    }
    res.push(data,)
  }
  return res
}

export function pathResolve(parentPath: string, path: string,) {
  if (isUrl(path,)) {
    return path
  }
  const childPath = path.startsWith("/",) || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, "/",).trim()
}

// 路由降级
export function flatMultiLevelRoutes(routes: CustomRouteRecordRaw[],) {
  const modules: CustomRouteRecordRaw[] = cloneDeep(routes,)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route,)) {
      continue
    }
    promoteRouteLevel(route,)
  }
  return modules
}

// 层级是否大于2
function isMultipleRoute(route: CustomRouteRecordRaw,) {
  if (!route || !Reflect.has(route, "children",) || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
function promoteRouteLevel(route: CustomRouteRecordRaw,) {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw,],
    history: createWebHashHistory(),
  },)

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route,)
  router = null

  route.children = route.children?.map(item => omit(item, "children",),)
}

// 添加所有子菜单
function addToChildren(routes: RouteRecordNormalized[], children: CustomRouteRecordRaw[], routeModule: CustomRouteRecordRaw,) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find(item => item.name === child.name,)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find(item => item.name === route.name,)) {
      routeModule.children?.push(route as unknown as CustomRouteRecordRaw,)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule,)
    }
  }
}
