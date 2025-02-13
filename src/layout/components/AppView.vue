<script setup lang="ts">
import { useAppStore, } from "@/store/App"
import { useTagViewStore, } from "@/store/TagView"
import Footer from "./Footer.vue"

const appStore = useAppStore()

const footer = computed(() => appStore.getFooter,)

const tagsViewStore = useTagViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
},)
</script>

<template>
  <section
    :class="[
      {
        '!min-h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-footer-height))] pb-0':
          footer,
      },
    ]"
    class="box-border w-full bg-[var(--app-content-bg-color)] p-[var(--app-content-padding)] dark:bg-[var(--el-bg-color)]"
  >
    <RouterView>
      <template #default="{ Component, route }">
        <KeepAlive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </template>
    </RouterView>
  </section>
  <Footer v-if="footer" />
</template>
