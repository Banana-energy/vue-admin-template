<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <section class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/SideBar/index.vue";

import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSettingStore } from "@/store/modules/setting";
import { storeToRefs } from "pinia";

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
