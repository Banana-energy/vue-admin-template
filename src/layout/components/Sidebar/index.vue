<template>
  <div class="has-logo">
    <logo :is-collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
        :collapse="isCollapse"
      >
        <sidebar-item
          v-for="r in routes"
          :key="r.path"
          :item="r"
          :base-path="r.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";
import variables from "@/styles/variables.module.scss";
import { RouteRecordRaw } from "vue-router";
import { useMenuState } from "@/store/modules/menu";

const router = useRouter();
const route = useRoute();

const { isCollapse } = storeToRefs(useMenuState());

const activeMenu = computed((): string => {
  const { path } = route;
  return path;
});

const routes = computed((): RouteRecordRaw[] => {
  return router.options.routes;
});
</script>
<style scoped lang="scss"></style>
