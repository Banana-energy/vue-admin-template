<script setup lang="ts">
import { useTagViewStore, } from "@/store/TagView"

const tagsViewStore = useTagViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
},)
</script>

<template>
  <section
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
</template>
