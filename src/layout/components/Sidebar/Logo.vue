<template>
  <div
    class="sidebar-logo-container"
    :class="{ 'sidebar-collapse': props.isCollapse }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.isCollapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logoSquare" :src="logoSquare" class="sidebar-logo square" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>
<script setup lang="ts" name="Logo">
import config from "@/constants/env.config";
import logo from "@/assets/images/logo.png";
import logoSquare from "@/assets/images/logo-square.png";

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});

const title = config.appTitle;
</script>
<style scoped lang="scss">
.sidebarLogoFade-enter-active {
  transition: opacity 10.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  min-height: 50px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;

  & .sidebar-logo-link {
    height: 100%;
    line-height: 50px;

    & .sidebar-logo {
      display: inline-block;
      width: 80px;
      height: 40px;
      vertical-align: middle;
      margin-right: 12px;

      &.square {
        width: 40px;
        height: 40px;
      }
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #515a6e;
      font-weight: 500;
      line-height: 50px;
      font-size: 18px;
      font-family: PingFang SC, Avenir, Helvetica Neue, Arial, Helvetica,
        sans-serif;
      vertical-align: middle;
    }
  }

  &.sidebar-collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
