<template>
  <div class="navbar">
    <hamburger
      :is-collapse="isCollapse"
      class="hamburger-container"
      @toggle-collapse="toggleCollapse"
    />
  </div>
</template>
<script setup lang="ts">
import Hamburger from "@/components/Hamburger/index.vue";

import { computed } from "vue";
import { settingStore } from "@/store/modules/setting";

const mySettingStore = settingStore();

const isCollapse = computed((): boolean => mySettingStore.isCollapse);

const toggleCollapse = (): void => {
  mySettingStore.setCollapse();
};
</script>
<style scoped lang="scss"></style>
