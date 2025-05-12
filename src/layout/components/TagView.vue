<script lang="ts" setup>
import type { ElScrollbar, } from "element-plus"
import type { RouteLocationNormalizedLoaded, RouterLinkProps, } from "vue-router"
import type { ContextMenuExpose, } from "./helper.ts"
import { useDesign, } from "@/hooks/useDesign"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"
import { useScrollTo, } from "@/hooks/useScrollTo"
import { useTagView, } from "@/hooks/useTagView"
import { useAppStore, } from "@/store/App"
import { useRouteStore, } from "@/store/Route"
import { useTagViewStore, } from "@/store/TagView"
import { useTemplateRefsList, } from "@vueuse/core"
import { cloneDeep, } from "lodash-es"
import { computed, nextTick, onMounted, ref, unref, watch, } from "vue"
import { useRouter, } from "vue-router"
import ContextMenu from "./ContextMenu.vue"
import { filterAffixTags, } from "./helper"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("tags-view",)

const { currentRoute, push, } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage, } = useTagView()

const permissionStore = useRouteStore()

const routers = computed(() => permissionStore.getRouters,)

const tagsViewStore = useTagViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews,)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([],)

const selectedTag = computed(() => tagsViewStore.getSelectedTag,)

const setSelectTag = tagsViewStore.setSelectedTag

const appStore = useAppStore()

const tagsViewIcon = computed(() => appStore.getTagsViewIcon,)

const isDark = computed(() => appStore.getIsDark,)

// elScroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置
const scrollLeftNumber = ref(0,)

// 初始化tag
function initTags() {
  affixTagArr.value = filterAffixTags(unref(routers,),)
  for (const tag of unref(affixTagArr,)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag,),)
    }
  }
}

// 新增tag
function addTags() {
  const { name, } = unref(currentRoute,)
  if (name) {
    setSelectTag(unref(currentRoute,),)
    tagsViewStore.addView(unref(currentRoute,),)
  }
}

// 关闭选中的tag
function closeSelectedTag(view: RouteLocationNormalizedLoaded,) {
  closeCurrent(view, () => {
    if (isActive(view,)) {
      toLastView()
    }
  },)
}

// 去最后一个
function toLastView() {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1,)[0]
  if (latestView) {
    push(latestView,)
  } else {
    if (
      unref(currentRoute,).path === permissionStore.addRouters[0].path
      || unref(currentRoute,).path === permissionStore.addRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.addRouters[0].path,)
  }
}

// 关闭全部
function closeAllTags() {
  closeAll(() => {
    toLastView()
  },)
}

// 关闭其它
function closeOthersTags() {
  closeOther()
}

// 重新加载
async function refreshSelectedTag(view?: RouteLocationNormalizedLoaded,) {
  refreshPage(view,)
}

// 关闭左侧
function closeLeftTags() {
  closeLeft()
}

// 关闭右侧
function closeRightTags() {
  closeRight()
}

// 滚动到选中的tag
async function moveToCurrentTag() {
  await nextTick()
  for (const v of unref(visitedViews,)) {
    if (v.fullPath === unref(currentRoute,).path) {
      // moveToTarget(v,)
      if (v.fullPath !== unref(currentRoute,).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute,),)
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()
//
// function moveToTarget(currentTag: RouteLocationNormalizedLoaded,) {
//   const wrap$ = unref(scrollbarRef,)?.wrapRef
//   let firstTag: Nullable<RouterLinkProps> = null
//   let lastTag: Nullable<RouterLinkProps> = null
//
//   const tagList = unref(tagLinksRefs,)
//   // find first tag and last tag
//   if (tagList.length > 0) {
//     firstTag = tagList[0]
//     lastTag = tagList[tagList.length - 1]
//   }
//   if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
//     // 直接滚动到0的位置
//     const { start, } = useScrollTo({
//       el: wrap$!,
//       position: "scrollLeft",
//       to: 0,
//       duration: 500,
//     },)
//     start()
//   } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
//     // 滚动到最后的位置
//     const { start, } = useScrollTo({
//       el: wrap$!,
//       position: "scrollLeft",
//       to: wrap$!.scrollWidth - wrap$!.offsetWidth,
//       duration: 500,
//     },)
//     start()
//   } else {
//     // find preTag and nextTag
//     const currentIndex: number = tagList.findIndex(
//       item => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath,
//     )
//     const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`,)
//
//     const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
//     const nextTag = tgsRefs[currentIndex + 1] as HTMLElement
//
//     // the tag's offsetLeft after of nextTag
//     const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4
//
//     // the tag's offsetLeft before of prevTag
//     const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4
//
//     if (afterNextTagOffsetLeft > unref(scrollLeftNumber,) + wrap$!.offsetWidth) {
//       const { start, } = useScrollTo({
//         el: wrap$!,
//         position: "scrollLeft",
//         to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
//         duration: 500,
//       },)
//       start()
//     } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber,)) {
//       const { start, } = useScrollTo({
//         el: wrap$!,
//         position: "scrollLeft",
//         to: beforePrevTagOffsetLeft,
//         duration: 500,
//       },)
//       start()
//     }
//   }
// }

// 是否是当前tag
function isActive(route: RouteLocationNormalizedLoaded,): boolean {
  return route.path === unref(currentRoute,).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单状态改变的时候
function visibleChange(visible: boolean, tagItem: RouteLocationNormalizedLoaded,) {
  if (visible) {
    for (const v of unref(itemRefs,)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
        setSelectTag(tagItem,)
      }
    }
  }
}

function scroll({ scrollLeft, }: { scrollLeft: number },) {
  scrollLeftNumber.value = scrollLeft
}

// 移动到某个位置
function move(to: number,) {
  const wrap$ = unref(scrollbarRef,)?.wrapRef
  const { start, } = useScrollTo({
    el: wrap$!,
    position: "scrollLeft",
    to: unref(scrollLeftNumber,) + to,
    duration: 500,
  },)
  start()
}

function canShowIcon(item: RouteLocationNormalizedLoaded,) {
  return !!((item?.matched?.[1]?.meta?.icon && unref(tagsViewIcon,))
    || (item?.meta?.affix && unref(tagsViewIcon,) && item?.meta?.icon))
}

onMounted(() => {
  initTags()
  addTags()
},)

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  },
)
</script>

<template>
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="relative w-full flex bg-white dark:bg-[var(--el-bg-color)]"
  >
    <span
      :class="`${prefixCls}__tool ${prefixCls}__tool--first`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(-200)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="vi-ep:d-arrow-left"
      />
    </span>
    <div class="flex-1 overflow-hidden">
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <div class="h-full flex">
          <ContextMenu
            v-for="item in visitedViews"
            :key="item.fullPath"
            :ref="itemRefs.set"
            :class="[
              `${prefixCls}__item`,
              item?.meta?.affix ? `${prefixCls}__item--affix` : '',
              {
                'is-active': isActive(item),
              },
            ]"
            :schema="[
              {
                icon: 'vi-ant-design:sync-outlined',
                label: '重新加载',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                },
              },
              {
                icon: 'vi-ant-design:close-outlined',
                label: '关闭标签页',
                disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                command: () => {
                  closeSelectedTag(item)
                },
              },
              {
                divided: true,
                icon: 'vi-ant-design:vertical-right-outlined',
                label: '关闭左侧标签页',
                disabled:
                  !!visitedViews?.length
                  && (item.fullPath === visitedViews[0].fullPath
                    || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                },
              },
              {
                icon: 'vi-ant-design:vertical-left-outlined',
                label: '关闭右侧标签页',
                disabled:
                  !!visitedViews?.length
                  && (item.fullPath === visitedViews[visitedViews.length - 1].fullPath
                    || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                },
              },
              {
                divided: true,
                icon: 'vi-ant-design:tag-outlined',
                label: '关闭其它标签页',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                },
              },
              {
                icon: 'vi-ant-design:line-outlined',
                label: '关闭全部标签页',
                command: () => {
                  closeAllTags()
                },
              },
            ]"
            :tag-item="item"
            @visible-change="visibleChange"
          >
            <div>
              <RouterLink
                :ref="tagLinksRefs.set"
                v-slot="{ navigate }"
                :to="{ ...item }"
                custom
              >
                <div
                  class="h-full flex items-center justify-center whitespace-nowrap pl-3.75"
                  @click="navigate"
                >
                  <Icon
                    v-if="canShowIcon(item)"
                    :icon="item?.matched?.[1]?.meta?.icon || item?.meta?.icon"
                    :size="12"
                    class="mr-1.25"
                  />
                  {{ useI18nTitle(item.meta) }}
                  <Icon
                    :class="`${prefixCls}__item--close`"
                    :size="12"
                    color="#333"
                    icon="vi-ant-design:close-outlined"
                    @click.prevent.stop="closeSelectedTag(item)"
                  />
                </div>
              </RouterLink>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span
      :class="`${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(200)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="vi-ep:d-arrow-right"
      />
    </span>
    <span
      :class="`${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="refreshSelectedTag(selectedTag)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="vi-ant-design:reload-outlined"
      />
    </span>
    <ContextMenu
      :schema="[
        {
          icon: 'vi-ant-design:sync-outlined',
          label: '重新加载',
          command: () => {
            refreshSelectedTag(selectedTag)
          },
        },
        {
          icon: 'vi-ant-design:close-outlined',
          label: '关闭标签页',
          disabled: !!visitedViews?.length && selectedTag?.meta.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          },
        },
        {
          divided: true,
          icon: 'vi-ant-design:vertical-right-outlined',
          label: '关闭左侧标签页',
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          },
        },
        {
          icon: 'vi-ant-design:vertical-left-outlined',
          label: '关闭右侧标签页',
          disabled:
            !!visitedViews?.length
            && selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          },
        },
        {
          divided: true,
          icon: 'vi-ant-design:tag-outlined',
          label: '关闭其它标签页',
          command: () => {
            closeOthersTags()
          },
        },
        {
          icon: 'vi-ant-design:line-outlined',
          label: '关闭全部标签页',
          command: () => {
            closeAllTags()
          },
        },
      ]"
      trigger="click"
    >
      <span
        :class="`${prefixCls}__tool`"
        class="block h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      >
        <Icon
          :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
          color="var(--el-text-color-placeholder)"
          icon="vi-ant-design:setting-outlined"
        />
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-tags-view";

.#{$prefix-cls} {
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100%;
  }

  #{&}__tool {
    position: relative;

    &::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(100% - 1px);
      border-left: 1px solid var(--el-border-color);
      content: '';
    }

    &--first {
      &::before {
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: calc(100% - 1px);
        border-right: 1px solid var(--el-border-color);
        border-left: none;
        content: '';
      }
    }
  }

  #{&}__item {
    position: relative;
    top: 3px;
    height: calc(100% - 6px);
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }
    &:not(.#{$prefix-cls}__item--affix):hover {
      .#{$prefix-cls}__item--close {
        display: block;
      }
    }
  }

  #{&}__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  #{&}__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    .#{$prefix-cls}__item--close {
      :deep(svg) {
        color: var(--el-color-white) !important;
      }
    }
  }
}

.dark {
  .#{$prefix-cls} {
    #{&}__tool {
      &--first {
        &::after {
          display: none;
        }
      }
    }

    #{&}__item {
      border: 1px solid var(--el-border-color);
    }

    #{&}__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    #{&}__item.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
      .#{$prefix-cls}__item--close {
        :deep(svg) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}
</style>
