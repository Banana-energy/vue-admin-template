<script lang="ts" setup>
import { ConfigGlobal, } from "@/components/ConfigGlobal"
import { useAppStore, } from "@/store/App"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("app",)

const appStore = useAppStore()

const greyMode = computed(() => appStore.getGreyMode,)

appStore.initTheme()
</script>

<template>
  <ConfigGlobal>
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="scss">
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-app";

@mixin size {
  width: 100%;
  height: 100%;
}

html,
body {
  font-family: var(--font-family), serif;
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  min-width: 1360px;
  overflow-x: auto;
  @include size;

  #app {
    @include size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
