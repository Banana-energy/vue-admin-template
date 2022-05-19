<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- <div :class="{ 'fixed-header': fixedHeader }"> -->
      <div>
        <navbar />
      </div>
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/SideBar/index.vue";

import { computed } from "vue";
import { useRoute } from "vue-router";
import { settingStore } from "@/store/modules/setting";

const mySettingStore = settingStore();
const route = useRoute();

interface IClassObj {
  hideSidebar: boolean;
  openSidebar: boolean;
  withoutAnimation: boolean;
}

const key = computed((): string => {
  return route.path;
});

const isCollapse = computed((): boolean => mySettingStore.isCollapse);

const classObj = computed((): IClassObj => {
  return {
    hideSidebar: isCollapse.value,
    openSidebar: !isCollapse.value,
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

  // &.mobile.openSidebar {
  //   position: fixed;
  //   top: 0;
  // }
}

// .drawer-bg {
//   background: #000;
//   opacity: 0.3;
//   width: 100%;
//   top: 0;
//   height: 100%;
//   position: absolute;
//   z-index: 999;
// }

// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   width: calc(100% - #{$sideBarWidth});
//   transition: width 0.28s;
// }

// .hideSidebar .fixed-header {
//   width: calc(100% - 54px);
// }

// .mobile .fixed-header {
//   width: 100%;
// }

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
