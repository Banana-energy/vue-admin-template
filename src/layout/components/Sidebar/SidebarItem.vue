<template>
	<div v-if="!item.meta?.hidden">
		<el-sub-menu
			v-if="
				item.children && item.children.length > 0 && item.children.length !== 1
			"
			:index="item.meta?.activeMenu || item.path"
		>
			<template #title>
				<el-icon v-if="isElIcon" :size="18">
					<component :is="item.meta?.icon" />
				</el-icon>
				<icon v-if="isIcon" :icon="item.meta?.icon" class="el-icon" />
				<span>{{ item.meta?.title }}</span>
			</template>
			<sidebar-item
				v-for="child in item.children"
				:key="child.path"
				:item="child"
			/>
		</el-sub-menu>
		<el-menu-item v-else :index="item.meta?.activeMenu || item.path">
			<el-icon v-if="isElIcon" :size="18">
				<component :is="item.meta?.icon" />
			</el-icon>
			<icon v-if="isIcon" :icon="item.meta?.icon" class="el-icon" />
			<template #title>
				<span>{{ item.meta?.title }}</span>
			</template>
		</el-menu-item>
	</div>
</template>
<script setup>
import { Icon } from "@iconify/vue";

defineOptions({
  name: "SidebarItem",
});

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isElIcon = !props.item.meta?.icon?.includes(":");
const isIcon = props.item.meta?.icon?.includes(":");
</script>
<style scoped></style>
