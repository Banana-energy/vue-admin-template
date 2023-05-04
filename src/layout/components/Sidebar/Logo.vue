<template>
  <div
    class="sidebar-logo-container"
    :class="{ 'sidebar-collapse': isCollapse }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="isCollapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          class="sidebar-logo"
          :src="logo"
        />
        <h1
          v-else
          class="sidebar-title"
        >
          {{ title }}
        </h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          class="sidebar-logo"
          :src="logo"
        />
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>
<script setup lang="ts" name="Logo">
import config from "@/config/env.config";
interface Props {
  isCollapse: boolean;
}

withDefaults(defineProps<Props>(), {
  isCollapse: false,
});
const title = config.appTitle;
const logo = ref<string>(
  "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png"
);
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
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #61bf8e;
      font-weight: 550;
      line-height: 50px;
      font-size: 14px;
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
