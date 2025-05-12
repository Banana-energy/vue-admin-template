<script lang="tsx">
import type { RouteLocationNormalizedLoaded, } from "vue-router"
import { Icon, } from "@/components/Icon"
import { useDesign, } from "@/hooks/useDesign"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"
import { useAppStore, } from "@/store/App"
import { useRouteStore, } from "@/store/Route"
import { filter, treeToList, } from "@/utils/tree"
import { ElBreadcrumb, ElBreadcrumbItem, } from "element-plus"
import { TransitionGroup, } from "vue"
import { useRouter, } from "vue-router"
import { filterBreadcrumb, } from "./helper"
import "element-plus/theme-chalk/src/breadcrumb.scss"
import "element-plus/theme-chalk/src/breadcrumb-item.scss"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("breadcrumb",)

// 面包屑图标

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const appStore = useAppStore()
    const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon,)

    const { currentRoute, } = useRouter()

    const levelList = ref<CustomRouteRecordRaw[]>([],)

    const permissionStore = useRouteStore()

    const menuRouters = computed(() => {
      const routers = permissionStore.getRouters
      return filterBreadcrumb(routers,)
    },)

    const getBreadcrumb = () => {
      const currentPath = currentRoute.value.matched.slice(-1,)[0].path
      levelList.value = filter<CustomRouteRecordRaw>(unref(menuRouters,), (node: CustomRouteRecordRaw,) => {
        return node.path === currentPath
      },)
    }

    const renderBreadcrumb = () => {
      const breadcrumbList = treeToList<CustomRouteRecordRaw[]>(unref(levelList,),)
      return breadcrumbList.map((v,) => {
        const disabled = !v.redirect || v.redirect === "noredirect"
        const meta = v.meta
        return (
          <ElBreadcrumbItem to={{ path: disabled ? "" : v.path, }} key={v.name}>
            {meta?.icon && breadcrumbIcon.value
              ? (
                  <>
                    <Icon icon={meta.icon} class="mr-1"></Icon>
                    {" "}
                    {useI18nTitle(v?.meta,)}
                  </>
                )
              : (
                  (useI18nTitle(v?.meta,))
                )}
          </ElBreadcrumbItem>
        )
      },)
    }

    watch(
      () => currentRoute.value,
      (route: RouteLocationNormalizedLoaded,) => {
        if (route.path.startsWith("/redirect/",)) {
          return
        }
        getBreadcrumb()
      },
      {
        immediate: true,
      },
    )

    return () => (
      <ElBreadcrumb separator="/" class={`${prefixCls} flex items-center h-full ml-2.5`}>
        <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
          {renderBreadcrumb()}
        </TransitionGroup>
      </ElBreadcrumb>
    )
  },
},)
</script>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$elNamespace}-breadcrumb";

.#{$prefix-cls} {
  :deep(#{&}__item) {
    display: flex;
    .#{$prefix-cls}__inner {
      display: flex;
      align-items: center;
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(#{&}__item):not(:last-child) {
    .#{$prefix-cls}__inner {
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(#{&}__item):last-child {
    .#{$prefix-cls}__inner {
      color: var(--el-text-color-placeholder);

      &:hover {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
