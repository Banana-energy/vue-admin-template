import type { App, Directive, } from "vue"
import { useRouteStore, } from "@/store/Route"
import { intersection, isArray, } from "lodash-es"

export function hasPermission(value: string | string[],) {
  const routeStore = useRouteStore()

  const skipAuth = routeStore.skipAuth
  if (skipAuth) {
    return true
  }

  const permissions = routeStore.resList?.map(item => item.code,) || []
  if (!value) {
    console.error("hasPermission: value is required",)
    return false
  }

  if (!isArray(value,)) {
    return permissions?.includes(value,)
  }

  return intersection(value, permissions,).length > 0
}

const authDirective: Directive<any, string | string[]> = {
  mounted(el, binding,) {
    const value = binding.value
    const hasAuth = hasPermission(value,)
    if (!hasAuth) {
      el.parentNode?.removeChild(el,)
    }
  },
}

export function setupAuth(app: App<Element>,) {
  app.directive("auth", authDirective,)
}
