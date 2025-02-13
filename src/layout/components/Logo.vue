<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("logo",)

const appStore = useAppStore()

const show = ref(true,)

const title = computed(() => appStore.getTitle,)

const layout = computed(() => appStore.getLayout,)

const collapse = computed(() => appStore.getCollapse,)

onMounted(() => {
  if (unref(collapse,))
    show.value = false
},)

watch(
  () => collapse.value,
  (collapse: boolean,) => {
    if (unref(layout,) === "topLeft" || unref(layout,) === "cutMenu") {
      show.value = true
      return
    }
    show.value = !collapse
  },
)

watch(
  () => layout.value,
  (layout,) => {
    if (layout === "top" || layout === "cutMenu") {
      show.value = true
      return
    }
    show.value = !unref(collapse,)
  },
)
</script>

<template>
  <div>
    <RouterLink
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        show ? 'pl-4' : '',
      ]"
      class="relative flex cursor-pointer items-center overflow-hidden decoration-none !h-[var(--logo-height)]"
      to="/"
    >
      <img
        v-show="show"
        alt=""
        class="w-[calc(var(--logo-width)-10px)]"
        src="@/assets/imgs/logo.png"
      />
      <div
        :class="[
          {
            'text-[var(--logo-title-text-color)]': layout === 'classic',
            'text-[var(--top-header-text-color)]':
              layout === 'topLeft' || layout === 'top' || layout === 'cutMenu',
          },
        ]"
        class="ml-10px text-16px font-700"
      >
        {{ title }}
      </div>
    </RouterLink>
  </div>
</template>
