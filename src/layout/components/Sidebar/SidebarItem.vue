<template>
  <div v-if="!item.meta?.hidden">
    <el-sub-menu
      v-if="
        item.children && item.children.length > 0 && item.children.length !== 1
      "
      :index="item.meta?.activeMenu || item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-sub-menu>
    <el-menu-item v-else :index="item.meta?.activeMenu || item.path">
      <el-icon>
        <component :is="item.meta?.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>
<script setup lang="ts" name="SidebarItem">
import { RouteRecordRaw } from "vue-router";

// 取到传过来的值
// 采用ts专有声明，无默认值
defineProps<{
  item: RouteRecordRaw;
}>();
</script>
<style scoped lang="scss"></style>
