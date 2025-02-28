<script lang="ts" setup>
interface Props {
  height?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  height: "300px",
  width: "100%",
},)
</script>

<template>
  <div :style="{ height, width }" class="my-2 py-5 bg-white" v-bind="$attrs" />
</template>
