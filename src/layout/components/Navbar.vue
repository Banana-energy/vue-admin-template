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
import { useSettingStore } from "@/store/modules/setting";
import { storeToRefs } from "pinia";

const store = useSettingStore();

const { isCollapse } = storeToRefs(store);

const toggleCollapse = (): void => {
  store.setCollapse();
};
</script>
<style scoped lang="scss"></style>
