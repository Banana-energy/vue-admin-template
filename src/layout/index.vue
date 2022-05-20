<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <el-scrollbar :max-height="mainHeight">
        <section class="app-main">
          <router-view :key="key" v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
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
import { useSettingStore } from "@/store/modules/setting";

const { isCollapse } = storeToRefs(useSettingStore());
const route = useRoute();

interface IClassObj {
  hideSidebar: boolean;
  openSidebar: boolean;
  withoutAnimation: boolean;
}

const key = computed((): string => {
  return route.path;
});

const classObj = computed((): IClassObj => {
  return {
    hideSidebar: isCollapse.value,
    openSidebar: !isCollapse.value,
    withoutAnimation: false,
  };
});

const useElScroll = () => {
  const mainHeight = ref(document.documentElement.offsetHeight - 50);

  const getMainHeight = () => {
    mainHeight.value = document.documentElement.offsetHeight - 50;
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
  min-height: calc(100vh - 50px);
  padding: 16px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

:deep .el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
