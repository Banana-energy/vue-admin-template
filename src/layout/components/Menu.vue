<script lang="tsx">
import type { PropType, } from "vue"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { useRouteStore, } from "@/store/Route"
import { isUrl, } from "@/utils/routerHelper.ts"
import { ElMenu, ElScrollbar, } from "element-plus"
import { useRouter, } from "vue-router"
import { useRenderMenuItem, } from "./useRenderMenuItem"
import "element-plus/theme-chalk/src/menu.scss"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("menu",)

export default defineComponent({
  name: "MenuList",
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined,
    },
  },
  setup(props,) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout,)

    const { push, currentRoute, } = useRouter()

    const permissionStore = useRouteStore()

    const menuMode = computed(() => {
      // 竖
      const vertical: LayoutType[] = ["classic", "topLeft", "cutMenu",]

      if (vertical.includes(unref(layout,),)) {
        return "vertical"
      } else {
        return "horizontal"
      }
    },)

    const routers = computed(() =>
      unref(layout,) === "cutMenu" ? permissionStore.getMenuTabRouters : permissionStore.getRouters,
    )

    const collapse = computed(() => appStore.getCollapse,)

    const uniqueOpened = computed(() => appStore.getUniqueOpened,)

    const activeMenu = computed(() => {
      const { meta, path, } = unref(currentRoute,)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    },)

    const menuSelect = (index: string,) => {
      if (props.menuSelect) {
        props.menuSelect(index,)
      }
      // 自定义事件
      if (isUrl(index,)) {
        window.open(index,)
      } else {
        push(index,)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout,) === "top") {
        return renderMenu()
      } else {
        return <ElScrollbar>{renderMenu()}</ElScrollbar>
      }
    }

    function renderMenu() {
      return (
        <ElMenu
          defaultActive={unref(activeMenu,)}
          mode={unref(menuMode,)}
          collapse={
            unref(layout,) === "top" || unref(layout,) === "cutMenu" ? false : unref(collapse,)
          }
          uniqueOpened={unref(layout,) === "top" ? false : unref(uniqueOpened,)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          popperClass={
            unref(menuMode,) === "vertical"
              ? `${prefixCls}-popper--vertical`
              : `${prefixCls}-popper--horizontal`
          }
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem, } = useRenderMenuItem(menuMode.value,)
              return renderMenuItem(unref(routers,),)
            },
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode,)}`,
          "h-full overflow-hidden flex-col bg-[var(--left-menu-bg-color)]",
          {
            "w-[var(--left-menu-min-width)]": unref(collapse,) && unref(layout,) !== "cutMenu",
            "w-[var(--left-menu-max-width)]": !unref(collapse,) && unref(layout,) !== "cutMenu",
          },
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  },
},)
</script>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-menu";

.#{$prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  :deep(.#{$elNamespace}-menu) {
    width: 100% !important;
    border-right: none;

    // 设置选中时子标题的颜色
    .is-active {
      & > .#{$elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    // 设置子菜单悬停的高亮和背景色
    .#{$elNamespace}-sub-menu__title,
    .#{$elNamespace}-menu-item {
      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-color) !important;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .#{$elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .#{$elNamespace}-menu-item.is-active {
      position: relative;
    }

    // 设置子菜单的背景颜色
    .#{$elNamespace}-menu {
      .#{$elNamespace}-sub-menu__title,
      .#{$elNamespace}-menu-item:not(.is-active) {
        background-color: var(--left-menu-bg-light-color) !important;
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.#{$elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .#{$elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-collapse-bg-active-color) !important;
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    .#{$prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  #{&}__horizontal {
    height: calc(var(--top-tool-height)) !important;

    :deep(.#{$elNamespace}-menu--horizontal) {
      height: calc(var(--top-tool-height));
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .#{$elNamespace}-sub-menu.is-active {
        .#{$elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .#{$elNamespace}-menu-item.is-active {
        position: relative;

        &::after {
          display: none !important;
        }
      }

      .#{$prefix-cls}__title {
        max-height: calc(var(--top-tool-height) - 2px) !important;
        line-height: calc(var(--top-tool-height) - 2px);
      }
    }
  }
}
</style>

<style lang="scss">
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-menu-popper";

.#{$prefix-cls}--vertical,
.#{$prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-color) !important;
    }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }
  }
}

$submenu-prefix-cls: "#{$adminNamespace}-submenu-popper";

// 设置子菜单溢出时滚动样式
.#{$submenu-prefix-cls}--vertical {
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(144 147 153 / 30%);
    border-radius: 4px;
  }
}
</style>
