<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"

defineProps<{
  color: string
}>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("locale-dropdown",)

// const localeStore = useLocaleStore()

// const langMap = computed(() => localeStore.getLocaleMap)

const langMap = ref([
  {
    lang: "zh-CN",
    name: "中文",
  },
  {
    lang: "en",
    name: "English",
  },
],)

// const currentLang = computed(() => localeStore.getCurrentLocale)

function setLang(lang: string,) {
  // if (lang === unref(currentLang).lang)
  //   return
  // 需要重新加载页面让整个语言多初始化
  window.location.reload()
  // localeStore.setCurrentLocale({
  //   lang,
  // })
  // const { changeLocale } = useLocale()
  // changeLocale(lang)
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
        <ElDropdownItem v-for="item in langMap" :key="item.lang" :command="item.lang">
          {{ item.name }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
