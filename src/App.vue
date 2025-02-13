<script setup lang="ts">
import { ConfigGlobal, } from "@/components/ConfigGlobal"
import { useAppStore, } from "@/store/App"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("app",)

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize,)

const greyMode = computed(() => appStore.getGreyMode,)

appStore.initTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
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
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  @include size;

  #app {
    @include size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
