<script lang="tsx">
import { Icon, } from "@/components/Icon"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { useRouteStore, } from "@/store/Route"
import { isUrl, pathResolve, } from "@/utils/routerHelper"
import { ClickOutside, ElScrollbar, } from "element-plus"
import { cloneDeep, } from "lodash-es"
import { computed, defineComponent, onMounted, ref, unref, watch, } from "vue"
import { useRouter, } from "vue-router"
import { filterMenusPath, initTabMap, tabPathMap, } from "./helper"
import Menu from "./Menu.vue"

const { getPrefixCls, variables, } = useDesign()

const prefixCls = getPrefixCls("tab-menu",)

export default defineComponent({
  name: "TabMenu",
  directives: {
    ClickOutside,
  },
  setup() {
    const { push, currentRoute, } = useRouter()

    const appStore = useAppStore()

    const collapse = computed(() => appStore.getCollapse,)

    const fixedMenu = computed(() => appStore.getFixedMenu,)

    const permissionStore = useRouteStore()

    const routers = computed(() => permissionStore.getRouters,)

    const tabRouters = computed(() => unref(routers,).filter(v => !v?.meta?.hidden,),)

    const tabActive = ref("",)

    const setCollapse = () => {
      appStore.setCollapse(!unref(collapse,),)
    }

    onMounted(() => {
      if (unref(fixedMenu,)) {
        const path = `/${unref(currentRoute,).path.split("/",)[1]}`
        const children = unref(tabRouters,).find(
          v =>
            (v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1))
            && v.path === path,
        )?.children

        tabActive.value = path
        if (children) {
          permissionStore.setMenuTabRouters(
            cloneDeep(children,).map((v,) => {
              v.path = pathResolve(unref(tabActive,), v.path,)
              return v
            },),
          )
        }
      }
    },)

    watch(
      () => routers.value,
      (routers: CustomRouteRecordRaw[],) => {
        initTabMap(routers,)
        filterMenusPath(routers, routers,)
      },
      {
        immediate: true,
        deep: true,
      },
    )

    const showTitle = ref(true,)

    watch(
      () => collapse.value,
      (collapse: boolean,) => {
        if (!collapse) {
          setTimeout(() => {
            showTitle.value = !collapse
          }, 200,)
        } else {
          showTitle.value = !collapse
        }
      },
      {
        immediate: true,
      },
    )

    // 是否显示菜单
    const showMenu = ref(unref(fixedMenu,),)

    // tab高亮

    // tab点击事件
    const tabClick = (item: CustomRouteRecordRaw,) => {
      if (isUrl(item.path,)) {
        window.open(item.path,)
        return
      }
      const newPath = item.children ? item.path : item.path.split("/",)[0]
      const oldPath = unref(tabActive,)
      tabActive.value = item.children ? item.path : item.path.split("/",)[0]
      if (item.children) {
        if (newPath === oldPath || !unref(showMenu,)) {
          // showMenu.value = unref(fixedMenu) ? true : !unref(showMenu)
          showMenu.value = !unref(showMenu,)
        }
        if (unref(showMenu,)) {
          permissionStore.setMenuTabRouters(
            cloneDeep(item.children,).map((v,) => {
              v.path = pathResolve(unref(tabActive,), v.path,)
              return v
            },),
          )
        }
      } else {
        push(item.path,)
        permissionStore.setMenuTabRouters([],)
        showMenu.value = false
      }
    }

    // 设置高亮
    const isActive = (currentPath: string,) => {
      const { path, } = unref(currentRoute,)
      return tabPathMap[currentPath].includes(path,)
    }

    const clickOut = () => {
      if (!unref(fixedMenu,)) {
        showMenu.value = false
      }
    }

    return () => (
      <div
        id={`${variables.namespace}-menu`}
        v-click-outside={clickOut}
        class={[
          prefixCls,
          "relative bg-[var(--left-menu-bg-color)] top-0.25 layout-border__right",
          {
            "w-[var(--tab-menu-max-width)]": !unref(collapse,),
            "w-[var(--tab-menu-min-width)]": unref(collapse,),
          },
        ]}
      >
        <ElScrollbar class="!h-[calc(100%-var(--tab-menu-collapse-height)-1px)]">
          <div>
            {() => {
              return unref(tabRouters,).map((v,) => {
                const item = (
                  v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)
                    ? v
                    : {
                        ...(v?.children && v?.children[0]),
                        path: pathResolve(v.path, (v?.children && v?.children[0])?.path as string,),
                      }
                ) as CustomRouteRecordRaw
                return (
                  <div
                    class={[
                      `${prefixCls}__item`,
                      "text-center text-3 relative py-3 cursor-pointer",
                      {
                        "is-active": isActive(v.path,),
                      },
                    ]}
                    onClick={() => {
                      tabClick(item,)
                    }}
                  >
                    <div>
                      <Icon icon={item?.meta?.icon}></Icon>
                    </div>
                    {!unref(showTitle,)
                      ? undefined
                      : (
                          <p class="mt-1.25 break-words px-0.5">{(item.meta?.title || "")}</p>
                        )}
                  </div>
                )
              },)
            }}
          </div>
        </ElScrollbar>
        <div
          class={[
            `${prefixCls}--collapse`,
            "text-center h-[var(--tab-menu-collapse-height)] leading-[var(--tab-menu-collapse-height)] cursor-pointer",
          ]}
          onClick={setCollapse}
        >
          <Icon icon={unref(collapse,) ? "ep:d-arrow-right" : "ep:d-arrow-left"}></Icon>
        </div>
        <Menu
          class={[
            "!absolute top-0 z-3000",
            {
              "!left-[var(--tab-menu-min-width)]": unref(collapse,),
              "!left-[var(--tab-menu-max-width)]": !unref(collapse,),
              "!w-[var(--left-menu-max-width)] border-r-1 border-r-solid border-[var(--el-border-color)]":
                unref(showMenu,) || unref(fixedMenu,),
              "!w-0": !unref(showMenu,) && !unref(fixedMenu,),
            },
          ]}
          style="transition: width var(--transition-time-02), left var(--transition-time-02);"
        >
        </Menu>
      </div>
    )
  },
},)
</script>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-tab-menu";

.#{$prefix-cls} {
  transition: all var(--transition-time-02);

  #{&}__item {
    color: var(--left-menu-text-color);
    transition: all var(--transition-time-02);

    &:hover {
      color: var(--left-menu-text-active-color);
      // background-color: var(--left-menu-bg-active-color);
    }
  }

  &--collapse {
    color: var(--left-menu-text-color);
    background-color: var(--left-menu-bg-light-color);
  }

  .is-active {
    color: var(--left-menu-text-active-color);
    background-color: var(--left-menu-bg-active-color);
  }
}
</style>
