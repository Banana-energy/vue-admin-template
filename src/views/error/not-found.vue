<script setup lang="ts">
import { Error, } from "@/components/Error"
// import { usePermissionStore } from '@/store/modules/permission'
import { useRouter, } from "vue-router"

const { push, } = useRouter()

// const permissionStore = usePermissionStore()

function errorClick() {
  // push(permissionStore.addRouters[0]?.path as string)
  push("/",)
}
</script>

<template>
  <Error @error-click="errorClick" />
</template>
