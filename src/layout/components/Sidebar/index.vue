<template>
	<div class="has-logo flex flex-col">
		<logo :is-collapse="isCollapse" />
		<el-scrollbar class="flex-1" wrap-class="scrollbar-wrapper">
			<el-menu
				:active-text-color="variables.menuActiveText"
				:background-color="variables.menuBg"
				:collapse="isCollapse"
				:collapse-transition="false"
				:default-active="activeMenu"
				:router="true"
				:text-color="variables.menuText"
				:unique-opened="false"
				mode="vertical"
			>
				<sidebar-item
					v-for="r in routes"
					:key="r.path"
					:base-path="r.path"
					:item="r"
				/>
			</el-menu>
		</el-scrollbar>
	</div>
</template>
<script setup>
import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';
import { useMenuStore } from '@/store/modules/menu';

defineOptions({
  name: 'Sidebar',
});

const router = useRouter();
const route = useRoute();

const { isCollapse } = storeToRefs(useMenuStore());

const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

const routes = computed(() => {
  return router.options.routes;
});
</script>
<style scoped></style>
