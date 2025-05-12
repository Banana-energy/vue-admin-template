import type { RouteMeta, } from "vue-router"
import { ElText, } from "@/components/ElText"
import { Icon, } from "@/components/Icon"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"

export function useRenderMenuTitle() {
  const renderMenuTitle = (meta?: RouteMeta,) => {
    const { icon, } = meta ?? {}

    return icon
      ? (
          <>
            <Icon icon={meta?.icon}></Icon>
            <ElText truncated class="v-menu__title !text-inherit" tooltipProps={{ placement: "right", }}>
              {(useI18nTitle(meta,))}
            </ElText>
          </>
        )
      : (
          <ElText truncated class="v-menu__title !text-inherit" tooltipProps={{ placement: "right", }}>
            {(useI18nTitle(meta,))}
          </ElText>
        )
  }

  return {
    renderMenuTitle,
  }
}
