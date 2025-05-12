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
        <Transition enter-active-class="animate__animated animate__fadeIn" mode="out-in" appear>
          <KeepAlive :include="getCaches">
            <Component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </section>
</template>
