<template>
  <div v-if="!item.meta?.hidden">
    <el-sub-menu
      v-if="
        item.children && item.children.length > 0 && item.children.length !== 1
      "
      :index="item.meta?.activeMenu || item.path"
    >
      <template #title>
        <el-icon v-if="isElIcon" :size="18">
          <component :is="item.meta?.icon" />
        </el-icon>
        <icon
          v-if="isIcon && item.meta?.icon"
          class="el-icon"
          :icon="item.meta?.icon"
        />
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-sub-menu>
    <el-menu-item v-else :index="item.meta?.activeMenu || item.path">
      <el-icon v-if="isElIcon" :size="18">
        <component :is="item.meta?.icon" />
      </el-icon>
      <icon
        v-if="isIcon && item.meta?.icon"
        class="el-icon"
        :icon="item.meta?.icon"
      />
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>
<script setup lang="ts" name="SidebarItem">
import { Icon } from "@iconify/vue";
import { RouteRecordRaw } from "vue-router";

const props = defineProps<{
  item: RouteRecordRaw;
}>();

const isElIcon = !props.item.meta?.icon?.includes(":");
const isIcon = props.item.meta?.icon?.includes(":");
</script>
<style scoped lang="scss"></style>
