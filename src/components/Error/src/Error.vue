<script lang="ts" setup>
import noPermission from "@/assets/svgs/403.svg"
import pageError from "@/assets/svgs/404.svg"
import networkError from "@/assets/svgs/500.svg"

defineOptions({
  name: "Error",
},)

const props = defineProps({
  type: {
    type: String,
    default: "404",
  },
},)

const emit = defineEmits(["errorClick",],)

interface ErrorMap {
  url: string
  message: string
  buttonText: string
}

const errorMap: {
  [key: string]: ErrorMap
} = {
  404: {
    url: pageError,
    message: "抱歉，您访问的页面不存在。",
    buttonText: "返回首页",
  },
  500: {
    url: networkError,
    message: "抱歉，服务器错误。",
    buttonText: "返回首页",
  },
  403: {
    url: noPermission,
    message: "抱歉，您无权访问此页面。",
    buttonText: "返回首页",
  },
}

function btnClick() {
  emit("errorClick", props.type,)
}
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col items-center">
      <img :src="errorMap[type].url" alt="" width="350" />
      <ElText class="text-base" type="info">
        {{ errorMap[type].message }}
      </ElText>
      <div class="mt-5">
        <ElButton type="primary" @click="btnClick">
          {{ errorMap[type].buttonText }}
        </ElButton>
      </div>
    </div>
  </div>
</template>
