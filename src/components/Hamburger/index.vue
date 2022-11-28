<template>
  <div class="cursor-pointer px-4" @click="toggleClick">
    <icon
      :class="{ 'rotate-180': !isCollapse }"
      class="transform inline-block align-middle"
      icon="vscode-icons:file-type-esbuild"
      :width="24"
      :height="24"
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

const emit = defineEmits(["toggleCollapse"]);

// 切换
const toggleClick = () => {
  emit("toggleCollapse");
};
</script>

<style scoped></style>
