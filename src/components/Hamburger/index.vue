<template>
	<div class="cursor-pointer px-4" @click="toggleClick">
		<icon
			:class="{ 'rotate-180': !isCollapse }"
			:height="24"
			:width="24"
			class="transform inline-block align-middle"
			icon="vscode-icons:file-type-esbuild"
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
