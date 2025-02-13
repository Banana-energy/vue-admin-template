import { useDesign, } from "@/hooks/useDesign"
import { isUrl, pathResolve, } from "@/utils/routerHelper"
import { ElMenuItem, ElSubMenu, } from "element-plus"
import { unref, } from "vue"
import { hasOneShowingChild, } from "./helper"
import { useRenderMenuTitle, } from "./useRenderMenuTitle"
import "element-plus/theme-chalk/src/menu-item.scss"
import "element-plus/theme-chalk/src/sub-menu.scss"

const { getPrefixCls, } = useDesign()
const prefixCls = getPrefixCls("submenu",)

const { renderMenuTitle, } = useRenderMenuTitle()

export function useRenderMenuItem(menuMode: "vertical" | "horizontal",) {
  const renderMenuItem = (routers: CustomRouteRecordRaw[], parentPath = "/",) => {
    return routers
      .filter(v => !v.meta?.hidden,)
      .map((v,) => {
        const meta = v.meta ?? {}
        const { oneShowingChild, onlyOneChild, } = hasOneShowingChild(v.children, v,)
        const fullPath = isUrl(v.path,) ? v.path : pathResolve(parentPath, v.path,)

        if (
          oneShowingChild
          && (!onlyOneChild?.children || onlyOneChild?.noShowingChildren)
          && !meta?.alwaysShow
        ) {
          return (
            <ElMenuItem
              index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path,) : fullPath}
            >
              {{
                default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta,),
              }}
            </ElMenuItem>
          )
        } else {
          return (
            <ElSubMenu
              index={fullPath}
              teleported
              popperClass={unref(menuMode,) === "vertical" ? `${prefixCls}-popper--vertical` : ""}
            >
              {{
                title: () => renderMenuTitle(meta,),
                default: () => renderMenuItem(v.children!, fullPath,),
              }}
            </ElSubMenu>
          )
        }
      },)
  }

  return {
    renderMenuItem,
  }
}
