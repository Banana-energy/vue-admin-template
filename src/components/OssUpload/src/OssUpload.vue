<script lang="ts" setup>
import type { OssResponse, } from "@/apis/upload"
import type { Props, } from "@/components/BaseUpload"
import type { UploadFile, UploadFiles, UploadProps, } from "element-plus"
import { defaultProps, } from "@/components/BaseUpload"
import { omit, } from "lodash-es"
import { httpRequest, } from "./helper.ts"

defineOptions({
  name: "OssUpload",
},)

const props = withDefaults(defineProps<Props>(), defaultProps,)

const emits = defineEmits<{
  (event: "update:modelValue", value: BaseFileDTO[]): void
  (e: "preview", file: BaseFileDTO): void
  (
    e: "success",
    res: BaseFileDTO[] | undefined,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ): void
}>()
const attrs: Record<string, unknown> = useAttrs()

const handleSuccess: UploadProps["onSuccess"] = (
  res: NewResponseData<OssResponse>,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
) => {
  if (res.success) {
    const list = props.modelValue ? [...props.modelValue,] : []
    const {
      data: { objectName, originFileName, downLoadUrl, },
    } = res
    list.push({
      uid: uploadFile.uid,
      fileName: originFileName,
      fileUrl: objectName,
      signatureUrl: downLoadUrl,
    },)
    emits("success", list, uploadFile, uploadFiles,)
    emits("update:modelValue", list,)
  }
}

const bindProps = computed<Props>(() => {
  const omitKeys: (keyof Props)[] = ["httpRequest", "modelValue",]
  return {
    ...omit(props, omitKeys,),
    ...attrs,
    onSuccess: handleSuccess,
    httpRequest,
  }
},)
</script>

<template>
  <BaseUpload
    :model-value="modelValue"
    v-bind="bindProps"
    @update:model-value="(val: BaseFileDTO[]) => emits('update:modelValue', val)"
  >
    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </BaseUpload>
</template>

<style lang="scss" scoped>

</style>
