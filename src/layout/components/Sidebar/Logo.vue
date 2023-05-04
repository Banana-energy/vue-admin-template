<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: props.isCollapse }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.isCollapse"
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
<script setup lang="ts">
interface Props {
  isCollapse: boolean;
}
// 取到传过来的值
// 采用ts专有声明，有默认值
const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
});
const title = ref<string>("Vue-Admin-Template");
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
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;

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
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
