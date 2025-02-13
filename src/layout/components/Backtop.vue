<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign.ts"

const { getPrefixCls, variables, } = useDesign()

const prefixCls = getPrefixCls("backtop",)
</script>

<template>
  <ElBacktop
    :class="prefixCls"
    :target="`.${variables.namespace}-layout-content-scrollbar .${variables.elNamespace}-scrollbar__wrap`"
  />
</template>
