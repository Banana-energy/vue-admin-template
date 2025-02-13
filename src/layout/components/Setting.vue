<script setup lang="ts">
import { BaseButton, } from "@/components/Button"
import { useAppStore, } from "@/store/App"
import { getCssVar, setCssVar, } from "@/utils"
import { useClipboard, useCssVar, } from "@vueuse/core"
import { trim, } from "lodash-es"
import ColorRadioPicker from "./ColorRadioPicker.vue"
import InterfaceDisplay from "./InterfaceDisplay.vue"
import LayoutRadioPicker from "./LayoutRadioPicker.vue"
import ThemeSwitch from "./ThemeSwitch.vue"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("setting",)

const appStore = useAppStore()

const drawer = ref(false,)

// 主题色相关
const systemTheme = ref(appStore.getTheme.elColorPrimary,)

function setSystemTheme(color: string,) {
  setCssVar("--el-color-primary", color,)
  appStore.setTheme({ elColorPrimary: color, },)
  const leftMenuBgColor = getCssVar("--left-menu-bg-color",)
  setMenuTheme(trim(unref(leftMenuBgColor,) as string,),)
}

// 头部主题相关
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || "",)

function setHeaderTheme(color: string,) {
  appStore.setHeaderTheme(color,)
}

// 菜单主题相关
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || "",)

function setMenuTheme(color: string,) {
  appStore.setMenuTheme(color,)
}

// 监听layout变化，重置一些主题色
// watch(
//   () => layout.value,
//   (n) => {
//     if (n === 'top' && !appStore.getIsDark) {
//       headerTheme.value = '#fff'
//       setHeaderTheme('#fff')
//     } else {
//       setMenuTheme(unref(menuTheme))
//     }
//   }
// )

// 拷贝
async function copyConfig() {
  const { copy, copied, isSupported, } = useClipboard({
    source: `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `,
    legacy: true,
  },)
  if (!isSupported) {
    ElMessage.error("拷贝失败",)
  } else {
    await copy()
    if (unref(copied,)) {
      ElMessage.success("拷贝成功",)
    }
  }
}

// 清空缓存
function clear() {
  window.location.reload()
}

function themeChange() {
  const color = useCssVar("--el-bg-color", document.documentElement,)
  if (color.value) {
    setMenuTheme(color.value,)
    setHeaderTheme(color.value,)
  }
}
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed right-0 top-[45%] z-10 h-40px w-40px flex cursor-pointer items-center justify-center bg-[var(--el-color-primary)]"
    @click="drawer = true"
  >
    <Icon color="#fff" icon="vi-ant-design:setting-outlined" />
  </div>

  <ElDrawer
    v-model="drawer"
    :z-index="4000"
    direction="rtl"
    size="350px"
  >
    <template #header>
      <span class="text-16px font-700">项目配置</span>
    </template>

    <div class="text-center">
      <!-- 主题 -->
      <ElDivider>主题</ElDivider>
      <ThemeSwitch @change="themeChange" />

      <!-- 布局 -->
      <ElDivider>布局</ElDivider>
      <LayoutRadioPicker />

      <!-- 系统主题 -->
      <ElDivider>系统主题</ElDivider>
      <ColorRadioPicker
        v-model="systemTheme"
        :schema="[
          '#409eff',
          '#009688',
          '#536dfe',
          '#ff5c93',
          '#ee4f12',
          '#0096c7',
          '#9c27b0',
          '#ff9800',
        ]"
        @change="setSystemTheme"
      />

      <!-- 头部主题 -->
      <ElDivider>头部主题</ElDivider>
      <ColorRadioPicker
        v-model="headerTheme"
        :schema="[
          '#fff',
          '#151515',
          '#5172dc',
          '#e74c3c',
          '#24292e',
          '#394664',
          '#009688',
          '#383f45',
        ]"
        @change="setHeaderTheme"
      />

      <!-- 菜单主题 -->
      <ElDivider>菜单主题</ElDivider>
      <ColorRadioPicker
        v-model="menuTheme"
        :schema="[
          '#fff',
          '#001529',
          '#212121',
          '#273352',
          '#191b24',
          '#383f45',
          '#001628',
          '#344058',
        ]"
        @change="setMenuTheme"
      />
    </div>

    <!-- 界面显示 -->
    <ElDivider>界面显示</ElDivider>
    <InterfaceDisplay />

    <ElDivider />
    <BaseButton class="w-full" type="primary" @click="copyConfig">
      拷贝
    </BaseButton>
    <BaseButton class="mt-5px w-full !ml-0" type="danger" @click="clear">
      清除缓存并且重置
    </BaseButton>
  </ElDrawer>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;
// 定义 prefix-cls
$prefix-cls: "#{$elNamespace}-setting";

.#{$prefix-cls} {
  border-radius: 6px 0 0 6px;
}
</style>
