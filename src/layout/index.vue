<template>
	<div :class="classObj" class="app-wrapper">
		<sidebar class="sidebar-container" />
		<div class="main-container flex flex-col h-screen">
			<navbar />
			<section class="app-main">
				<router-view v-slot="{ Component, route }">
					<transition mode="out-in" name="fade-transform">
						<el-card class="app-main-container">
							<el-scrollbar class="flex-1">
								<component :is="Component" :key="route.path" />
							</el-scrollbar>
						</el-card>
					</transition>
				</router-view>
			</section>
		</div>
	</div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar/index.vue';
import { useMenuStore } from '@/store/modules/menu';

defineOptions({
  name: 'Layout'
});

const { isCollapse } = storeToRefs(useMenuStore());

const classObj = computed(() => {
  return {
    'hide-sidebar': isCollapse.value,
    withoutAnimation: false
  };
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.module.scss";

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  padding: 10px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f0f2f5;
}

.app-main-container {
  :deep(> .el-card__body) {
    height: calc(100vh - 50px - 20px);
  }
}
</style>
