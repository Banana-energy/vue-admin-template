<script lang="ts" setup>
import { Error, } from "@/components/Error"

const { push, } = useRouter()

function errorClick() {
  push("/",)
}
</script>

<template>
  <Error @error-click="errorClick" />
</template>
