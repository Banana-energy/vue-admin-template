<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { setCssVar, } from "@/utils"
import { computed, ref, watch, } from "vue"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("interface-display",)

const appStore = useAppStore()

// 面包屑
const breadcrumb = ref(appStore.getBreadcrumb,)

function breadcrumbChange(show?: boolean | string | number,) {
  appStore.setBreadcrumb(!!show,)
}

// 面包屑图标
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon,)

function breadcrumbIconChange(show?: boolean | string | number,) {
  appStore.setBreadcrumbIcon(!!show,)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger,)

function hamburgerChange(show?: boolean | string | number,) {
  appStore.setHamburger(!!show,)
}

// 全屏图标
const screenFull = ref(appStore.getScreenFull,)

function screenFullChange(show?: boolean | string | number,) {
  appStore.setScreenFull(!!show,)
}

// 多语言图标
const locale = ref(appStore.getLocale,)

function localeChange(show?: boolean | string | number,) {
  appStore.setLocale(!!show,)
}

// 标签页
const tagsView = ref(appStore.getTagsView,)

function tagsViewChange(show?: boolean | string | number,) {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar("--tags-view-height", show ? "35px" : "0px",)
  appStore.setTagsView(!!show,)
}

// 标签页图标
const tagsViewIcon = ref(appStore.getTagsViewIcon,)

function tagsViewIconChange(show?: boolean | string | number,) {
  appStore.setTagsViewIcon(!!show,)
}

// logo
const logo = ref(appStore.getLogo,)

function logoChange(show?: boolean | string | number,) {
  appStore.setLogo(!!show,)
}

// 菜单手风琴
const uniqueOpened = ref(appStore.getUniqueOpened,)

function uniqueOpenedChange(uniqueOpened?: boolean | string | number,) {
  appStore.setUniqueOpened(!!uniqueOpened,)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader,)

function fixedHeaderChange(show?: boolean | string | number,) {
  appStore.setFixedHeader(!!show,)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode,)

function greyModeChange(show?: boolean | string | number,) {
  appStore.setGreyMode(!!show,)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu,)

function fixedMenuChange(show?: boolean | string | number,) {
  appStore.setFixedMenu(!!show,)
}

const layout = computed(() => appStore.getLayout,)

watch(
  () => layout.value,
  (n,) => {
    if (n === "top") {
      appStore.setCollapse(false,)
    }
  },
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex items-center justify-between">
      <span class="text-3.5">面包屑</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">面包屑图标</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">折叠图标</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">全屏图标</span>
      <ElSwitch v-model="screenFull" @change="screenFullChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">多语言图标</span>
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">标签页</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">标签页图标</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">Logo</span>
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">菜单手风琴</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">固定头部</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">灰色模式</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-3.5">固定菜单</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>
  </div>
</template>
