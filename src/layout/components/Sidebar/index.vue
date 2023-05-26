<template>
  <div class="has-logo flex flex-col">
    <logo :is-collapse="isCollapse" />
    <el-scrollbar class="flex-1" wrap-class="scrollbar-wrapper">
      <el-menu
        :active-text-color="variables.menuActiveText"
        :background-color="variables.menuBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :text-color="variables.menuText"
        :unique-opened="false"
        mode="vertical"
        router
      >
        <sidebar-item
          v-for="r in routes"
          :key="r.path"
          :base-path="r.path"
          :item="r"
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
