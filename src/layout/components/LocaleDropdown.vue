<script lang="ts" setup>
import type { LocaleEnum, } from "@/hooks/useLocale.ts"
import { useDesign, } from "@/hooks/useDesign"
import { localeOptions, useLocale, } from "@/hooks/useLocale.ts"

defineProps<{
  color: string
}>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("locale-dropdown",)

const { setLocale, localeState, } = useLocale()

function setLang(lang: LocaleEnum,) {
  if (lang === unref(localeState,)) {
    return
  }
  setLocale(lang,)
  // 需要重新加载页面让整个语言多初始化
  window.location.reload()
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <Icon
      :class="$attrs.class"
      :color="color"
      :size="18"
      class="cursor-pointer !p-0"
      icon="vi-ion:language-sharp"
    />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in localeOptions" :key="item.value" :command="item.value">
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
