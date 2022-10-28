<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container flex flex-col">
      <navbar />
      <el-scrollbar class="flex-1">
        <section class="app-main">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </section>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup name="Layout">
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/SideBar/index.vue";
import { useMenuStore } from "@/store/modules/menu";

const { isCollapse } = storeToRefs(useMenuStore());

interface IClassObj {
  "hide-sidebar": boolean;
  withoutAnimation: boolean;
}

const classObj = computed((): IClassObj => {
  return {
    "hide-sidebar": isCollapse.value,
    withoutAnimation: false,
  };
});
</script>

<style scoped lang="scss">
@import "@/styles/mixin.scss";
@import "@/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  padding: 16px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
