<script setup lang="ts">
defineOptions({
  name: "LinkItem",
},)

const props = defineProps<{
  to: string
}>()

function isExternal(path: string,) {
  return /^(?:https?:|mailto:|tel:)/.test(path,)
}

const linkProps = computed(() => {
  return isExternal(props.to,)
    ? {
        href: props.to,
        target: "_blank",
        rel: "noopener",
      }
    : {
        to: props.to,
      }
},)
</script>

<template>
  <component :is="isExternal(props.to) ? 'a' : 'RouterLink'" v-bind="linkProps">
    <slot />
  </component>
</template>

<style scoped lang="scss">
a {
  text-decoration-line: none;
}
</style>
