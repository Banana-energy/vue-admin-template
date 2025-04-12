import type { RouteMeta, } from "vue-router"
import { Icon, } from "@/components/Icon"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"

export function useRenderMenuTitle() {
  const renderMenuTitle = (meta?: RouteMeta,) => {
    const { icon, } = meta ?? {}
    return icon
      ? (
          <>
            <Icon icon={meta?.icon}></Icon>
            <span class="v-menu__title overflow-ellipsis overflow-hidden whitespace-nowrap">
              {useI18nTitle(meta,)}
            </span>
          </>
        )
      : (
          <span class="v-menu__title overflow-ellipsis overflow-hidden whitespace-nowrap">
            {useI18nTitle(meta,)}
          </span>
        )
  }

  return {
    renderMenuTitle,
  }
}
