<script lang="ts" setup>
import { useDesign, } from "@/hooks/useDesign"
import { useUserStore, } from "@/store/UserInfo"
import { ElDropdownItem, ElDropdownMenu, } from "element-plus"

const userStore = useUserStore()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("user-info",)

function loginOut() {
  userStore.logoutConfirm()
}
</script>

<template>
  <ElDropdown :class="prefixCls" class="custom-hover" trigger="click">
    <div class="flex items-center">
      <img
        :src="userStore.avatar"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="pl-1.25 text-3.5 text-[var(--top-header-text-color)] <lg:hidden">
        {{ userStore.name }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="loginOut">
            退出登录
          </div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
