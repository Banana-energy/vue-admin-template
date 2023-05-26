<template>
  <div class="has-logo flex flex-col">
    <logo :is-collapse="isCollapse" />
    <el-scrollbar class="flex-1" wrap-class="scrollbar-wrapper">
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
import { useMenuStore } from "@/store/modules/menu";

defineOptions({ name: "Sidebar" });

const router = useRouter();
const route = useRoute();

const { isCollapse } = storeToRefs(useMenuStore());

const activeMenu = computed((): string => {
  const { path } = route;
  return path;
});

const routes = computed((): readonly RouteRecordRaw[] => {
  return router.options.routes;
});
</script>
<style scoped lang="scss"></style>
