<script lang="ts" setup>
import noPermission from "@/assets/svgs/403.svg"
import pageError from "@/assets/svgs/404.svg"
import networkError from "@/assets/svgs/500.svg"

interface ErrorMap {
  url: string
  message: string
  buttonText: string
}

const props = defineProps({
  type: {
    type: String,
    default: "404",
  },
},)

const emit = defineEmits(["errorClick",],)

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
    <div class="text-center">
      <img :src="errorMap[type].url" alt="" width="350" />
      <div class="text-[14px] text-[var(--el-color-info)]">
        {{ errorMap[type].message }}
      </div>
      <div class="mt-[20px]">
        <ElButton type="primary" @click="btnClick">
          {{ errorMap[type].buttonText }}
        </ElButton>
      </div>
    </div>
  </div>
</template>
