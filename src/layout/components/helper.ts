import type { ElDropdown, } from "element-plus"
import type { RouteLocationNormalizedLoaded, } from "vue-router"
import { isUrl, pathResolve, } from "@/utils/routerHelper"
import { findPath, } from "@/utils/tree.ts"
import { cloneDeep, } from "lodash-es"
import { reactive, ref, unref, } from "vue"

export interface TabMapTypes {
  [key: string]: string[]
}

export const tabPathMap = reactive<TabMapTypes>({},)

export function initTabMap(routes: CustomRouteRecordRaw[],) {
  for (const v of routes) {
    const meta = v.meta ?? {}
    if (!meta?.hidden) {
      tabPathMap[v.path] = []
    }
  }
}

export function getAllParentPath(treeData: CustomRouteRecordRaw[], path: string,) {
  const menuList = findPath(treeData, n => n.path === path,)
  return (menuList || []).map(item => item.path,)
}

export function filterMenusPath(routes: CustomRouteRecordRaw[], allRoutes: CustomRouteRecordRaw[],): CustomRouteRecordRaw[] {
  const res: CustomRouteRecordRaw[] = []
  for (const v of routes) {
    let data: Nullable<CustomRouteRecordRaw> = null
    const meta = v.meta ?? {}
    if (!meta.hidden || meta.canTo) {
      const allParentPath = getAllParentPath(allRoutes, v.path,)

      const fullPath = isUrl(v.path,) ? v.path : allParentPath.join("/",)

      data = cloneDeep(v,)
      data.path = fullPath
      if (v.children && data) {
        data.children = filterMenusPath(v.children, allRoutes,)
      }

      if (data) {
        res.push(data,)
      }

      if (allParentPath.length && Reflect.has(tabPathMap, allParentPath[0],)) {
        tabPathMap[allParentPath[0]].push(fullPath,)
      }
    }
  }

  return res
}

type OnlyOneChildType = CustomRouteRecordRaw & { noShowingChildren?: boolean }

interface HasOneShowingChild {
  oneShowingChild?: boolean
  onlyOneChild?: OnlyOneChildType
}

export function hasOneShowingChild(children: CustomRouteRecordRaw[] = [], parent: CustomRouteRecordRaw,): HasOneShowingChild {
  const onlyOneChild = ref<OnlyOneChildType>()

  const showingChildren = children.filter((v,) => {
    const meta = v.meta ?? {}
    if (meta.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = v
      return true
    }
  },)

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return {
      oneShowingChild: true,
      onlyOneChild: unref(onlyOneChild,),
    }
  }

  // Show parent if there are no child router to display
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true, }
    return {
      oneShowingChild: true,
      onlyOneChild: unref(onlyOneChild,),
    }
  }

  return {
    oneShowingChild: false,
    onlyOneChild: unref(onlyOneChild,),
  }
}

export interface ContextMenuSchema {
  disabled?: boolean
  divided?: boolean
  icon?: string
  label: string
  command?: (item: ContextMenuSchema) => void
}

export interface ContextMenuExpose {
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>
  tagItem: RouteLocationNormalizedLoaded
}

export function filterBreadcrumb(routes: CustomRouteRecordRaw[], parentPath = "",): CustomRouteRecordRaw[] {
  const res: CustomRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route?.meta
    if (meta?.hidden && !meta.canTo) {
      continue
    }

    const data: CustomRouteRecordRaw
      = !meta?.alwaysShow && route.children?.length === 1
        ? { ...route.children[0], path: pathResolve(route.path, route.children[0].path,), }
        : { ...route, }

    data.path = pathResolve(parentPath, data.path,)

    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path,)
    }
    if (data) {
      res.push(data,)
    }
  }
  return res
}

export function filterAffixTags(routes: CustomRouteRecordRaw[], parentPath = "",) {
  let tags: RouteLocationNormalizedLoaded[] = []
  routes.forEach((route,) => {
    const meta = route.meta ?? {}
    const tagPath = pathResolve(parentPath, route.path,)
    if (meta?.affix) {
      tags.push({ ...route, path: tagPath, fullPath: tagPath, } as RouteLocationNormalizedLoaded,)
    }
    if (route.children) {
      const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath,)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags,]
      }
    }
  },)

  return tags
}
