<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <tabs />
      <el-scrollbar :max-height="mainHeight">
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

<script lang="ts" setup>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/SideBar/index.vue";
import { useMenuStore } from "@/store/modules/menu";
import Tabs from "./components/Tabs/index.vue";

const { isCollapse } = storeToRefs(useMenuStore());

interface IClassObj {
  hideSidebar: boolean;
  openSidebar: boolean;
  withoutAnimation: boolean;
}

const classObj = computed((): IClassObj => {
  return {
    hideSidebar: isCollapse.value,
    openSidebar: !isCollapse.value,
    withoutAnimation: false,
  };
});

const useElScroll = () => {
  // 50 = navbar height 40 = tabs height
  const mainHeight = ref(document.documentElement.offsetHeight - 50 - 40);

  const getMainHeight = () => {
    mainHeight.value = document.documentElement.offsetHeight - 50 - 40;
  };

  window.addEventListener("resize", getMainHeight);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", getMainHeight);
  });

  return {
    mainHeight,
  };
};

const { mainHeight } = useElScroll();
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
  min-height: calc(100vh - 50px - 40px);
  padding: 16px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
