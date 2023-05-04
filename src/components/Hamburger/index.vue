<template>
  <div
    class="cursor-pointer px-4"
    @click="toggleClick"
  >
    <icon
      class="transform inline-block align-middle"
      :class="{ 'rotate-180': !isCollapse }"
      :height="24"
      icon="vscode-icons:file-type-esbuild"
      :width="24"
    />
  </div>
</template>

<script setup lang="ts" name="Hamburger">
import { Icon } from "@iconify/vue";
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-collapse"]);

// 切换
const toggleClick = () => {
  emit("toggle-collapse");
};
</script>

<style scoped></style>
