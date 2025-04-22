<script lang="ts" setup>
import type { OssUploadFile, } from "@/components/OssUpload/src/helper.ts"
import type { UploadFile, UploadFiles, UploadInstance, UploadRawFile, UploadUserFile, } from "element-plus"
import type { Props, } from "./types.ts"
import { MessageBox, } from "@/utils/messageBox.ts"
import { genFileId, } from "element-plus"
import { isFunction, omit, } from "lodash-es"
import { formatFileSize, validateFileType, } from "./helper.ts"
import { defaultProps, } from "./types.ts"

defineOptions({
  name: "BaseUpload",
},)

const props = withDefaults(defineProps<Props>(), defaultProps,)

const emits = defineEmits<{
  (e: "update:modelValue", val: BaseFileDTO[]): void
}>()

const attrs: Record<string, unknown> = useAttrs()

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([],)

// 这个变量是为了解决在同时上传多个文件时，修改了fileList会导致只上传一次问题
let innerFlag = false
watch(
  () => props.modelValue,
  (val,) => {
    if (!innerFlag) {
      fileList.value
            = val?.map(item => ({
          name: item.fileName!,
          url: item.signatureUrl,
          status: "success",
        }),) || []
    } else {
      innerFlag = false
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const hideUpload = computed(() => {
  const { hideOnExceeded, limit, disabled, } = props
  return disabled || (hideOnExceeded && limit && fileList.value.length >= limit)
},)

const beforeUpload: Props["beforeUpload"] = (rawFile: UploadRawFile,) => {
  const { sizeLimit, accept, beforeUpload, } = props
  return new Promise((resolve, reject,) => {
    if (!validateFileType(rawFile, accept,)) {
      const msg = `请上传${accept}格式文件!`
      ElMessage.warning(msg,)
      reject(new Error(msg,),)
      return
    }
    if (sizeLimit && rawFile.size > sizeLimit) {
      const msg = `文件大小不能超过${formatFileSize(sizeLimit,)}`
      ElMessage.warning(msg,)
      reject(new Error(msg,),)
      return
    }
    if (beforeUpload && isFunction(beforeUpload,)) {
      const beforeUploadPromise = beforeUpload(rawFile,)
      if (beforeUploadPromise instanceof Promise) {
        beforeUploadPromise.then((result,) => {
          resolve(result,)
        }, reject,)
        return
      }
      if (beforeUploadPromise !== false) {
        resolve(rawFile,)
        return
      }
      reject(new Error(`${rawFile.name}上传失败`,),)
      return
    }
    resolve(rawFile,)
  },)
}

const handleExceed: Props["onExceed"] = (files: File[], uploadFiles: UploadUserFile[],) => {
  const { onExceed, } = props
  if (onExceed && isFunction(onExceed,)) {
    onExceed(files, uploadFiles,)
    return
  }
  const { limit, autoUpload, } = props
  if (limit === 1 && !autoUpload) {
    MessageBox(`只能上传一个文件，是否覆盖之前的文件${files.at(-1,)?.name}？`,)
      .then(() => {
        uploadRef.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRef.value!.handleStart(file,)
      },)
  } else {
    ElMessage.warning(`最多选择${limit}个文件!`,)
  }
}

const handleError: Props["onError"] = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles,) => {
  const { onError, } = props
  if (onError && isFunction(onError,)) {
    onError(error, uploadFile, uploadFiles,)
  }
  fileList.value = fileList.value.filter(item => item.status === "success",)
  ElMessage.error(error.message,)
}

const handleSuccess: Props["onSuccess"] = (response: ResponseData<OssUploadFile>, uploadFile: UploadFile, uploadFiles: UploadFiles,) => {
  const { onSuccess, modelValue, } = props
  innerFlag = true
  if (onSuccess && isFunction(onSuccess,)) {
    onSuccess(response, uploadFile, uploadFiles,)
    return
  }
  const data: OssUploadFile = response.datas
  if (!data) {
    fileList.value = fileList.value.filter(item => item.uid !== uploadFile.uid,)
    handleError(new Error(response.msg || "上传失败",), uploadFile, uploadFiles,)
    return
  }
  const list = modelValue ? [...modelValue,] : []
  const { objectName, originFileName, downLoadUrl, } = data
  list.push({
    uid: uploadFile.uid,
    fileName: originFileName,
    fileUrl: objectName,
    signatureUrl: downLoadUrl,
  },)
  emits("update:modelValue", list,)
}

const handleRemove: Props["onRemove"] = (uploadFile: UploadFile, uploadFiles: UploadFiles,) => {
  const { onRemove, modelValue, } = props
  if (onRemove && isFunction(onRemove,)) {
    onRemove(uploadFile, uploadFiles,)
  }
  const url = uploadFile.url
  const list = modelValue ? [...modelValue,] : []
  const index = list.findIndex(item => item.uid === uploadFile.uid || item.signatureUrl === url,)
  if (index > -1) {
    list.splice(index, 1,)
    emits("update:modelValue", list,)
  }
}

const viewVisible = ref(false,)
const viewUrlList = computed(() => {
  return props.modelValue?.map(item => item.signatureUrl!,).filter(Boolean,) || fileList.value.map(item => item.url!,)
},)
const handlePreview: Props["onPreview"] = (uploadFile: UploadFile,) => {
  const { onPreview, listType, accept, } = props
  if (onPreview && isFunction(onPreview,)) {
    onPreview(uploadFile,)
    return
  }
  if (listType === "picture-card" || accept?.includes("image",)) {
    viewVisible.value = true
    return
  }
  window.open(uploadFile.url, "_blank",)
}

const bindProps = computed<Props>(() => {
  const omitKeys: (keyof Props)[] = ["onError", "onExceed", "onPreview", "onSuccess", "beforeUpload", "onRemove", "fileList",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    onError: handleError,
    onExceed: handleExceed,
    onPreview: handlePreview,
    onSuccess: handleSuccess,
    beforeUpload,
    onRemove: handleRemove,
  }
},)

const { isOutside, } = useMouseInElement(uploadRef,)

function handlePaste(e: ClipboardEvent,) {
  const items = e.clipboardData?.items
  if (!items) {
    ElMessage.warning("当前浏览器不支持粘贴图片",)
    return
  }
  if (isOutside.value) {
    return
  }
  const existLength = fileList.value.length
  const length = items.length
  if (props.limit) {
    if (existLength >= props.limit) {
      ElMessage.warning(`最多选择${props.limit}个文件!`,)
      return
    }
    if (length + existLength > props.limit) {
      ElMessage.warning(`最多选择${props.limit}个文件!`,)
      return
    }
  }
  for (let i = 0; i < length; i++) {
    const item = items[i]
    if (item.kind === "file") {
      const file = item.getAsFile() as UploadRawFile
      if (file) {
        if (file.size > props.sizeLimit) {
          ElMessage.warning(`文件大小不能超过${formatFileSize(props.sizeLimit,)}`,)
          continue
        }
        file.uid = genFileId()
        uploadRef.value?.handleStart(file,)
      }
    }
  }
  uploadRef.value?.submit()
}

onMounted(() => {
  document.addEventListener("paste", handlePaste,)
},)
onBeforeUnmount(() => {
  document.removeEventListener("paste", handlePaste,)
},)

defineExpose({
  uploadRef,
},)
</script>

<template>
  <div>
    <ElUpload ref="uploadRef" v-model:file-list="fileList" v-bind="bindProps">
      <template v-if="!hideUpload" #trigger>
        <slot name="trigger">
          <Icon v-if="props.listType === 'picture-card'" :size="24" icon="ep:plus" />
          <ElButton v-else>
            <Icon icon="mdi:upload" />
            上传文件
          </ElButton>
        </slot>
      </template>
      <template v-if="!hideUpload" #tip>
        <slot name="tip" />
      </template>
      <template #file="{ file }">
        <slot :file="file" name="file" />
      </template>
    </ElUpload>
    <ElImageViewer
      v-if="viewVisible"
      :url-list="viewUrlList"
      close-on-press-escape
      hide-on-click-modal
      @close="viewVisible = false"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
