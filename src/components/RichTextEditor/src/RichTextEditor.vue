<script lang="ts" setup>
import type { Editor, RawEditorOptions, } from "tinymce"
import type { Emits, Props, } from "./types.ts"
import { uploadFilesWithoutExpire, } from "@/apis/upload"
import TinymceEditor from "@tinymce/tinymce-vue"
import { ElLoading, } from "element-plus"
import { defaultProps, } from "./types.ts"

defineOptions({
  name: "RichTextEditor",
},)

const props = withDefaults(defineProps<Props>(), defaultProps,)
const emits = defineEmits<Emits>()
const attrs: Record<string, unknown> = useAttrs()

const value = computed({
  get() {
    return props.modelValue
  },
  set(value,) {
    emits("update:modelValue", value,)
  },
},)

const tinymceEditor = shallowRef<Editor>()

const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)",).matches
let uploadQueue: Promise<string>[] = []
let isUploading: ReturnType<typeof ElLoading.service> | null = null
function setImageWidth(url: string,) {
  setTimeout(() => {
    const editor = tinymceEditor.value
    if (editor) {
      const doc = editor.getDoc()
      const img = doc.querySelector(`img[src="${url}"]`,) as HTMLImageElement
      if (img && img.naturalWidth > 200) {
        img.setAttribute("width", "200px",)
      } else {
        setImageWidth(url,)
      }
    }
  }, 200,)
}

const handleUploadImage: RawEditorOptions["images_upload_handler"] = (blobInfo,) => {
  const uploadTask = async() => {
    const file = new File([blobInfo.blob(),], blobInfo.filename(),)
    const result = await uploadFilesWithoutExpire([file,],)
    if (result?.datas) {
      const imgUrl = result.datas[0]?.signatureUrl || ""
      setImageWidth(imgUrl,)
      return imgUrl
    } else {
      setTimeout(() => {
        ElMessage.error("图片上传OSS失败，请重新上传",)
      }, 3200,)
      return ""
    }
  }
  const taskPromise = uploadTask()
  uploadQueue.push(taskPromise,)
  if (!isUploading) {
    isUploading = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: "上传中...",
      background: "rgba(0, 0, 0, 0.7)",
    },)
    emits("uploading", true,)
  }
  taskPromise.finally(() => {
    // 从队列中移除已完成的任务
    uploadQueue = uploadQueue.filter(task => task !== taskPromise,)

    // 如果队列为空，表示所有文件都上传完成，emit 'uploading: false'
    if (uploadQueue.length === 0) {
      isUploading?.close()
      isUploading = null
      emits("uploading", false,)
    }
  },)
  return taskPromise
}

const defaultOptions: RawEditorOptions = {
  promotion: false,
  branding: false,
  menubar: props.menubar || "file edit view insert format tools table help",
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
  autosave_restore_when_empty: false,
  autosave_retention: "2m",
  image_advtab: true,
  importcss_append: true,
  height: props.height || 600,
  width: props.width || 800,
  image_caption: true,
  quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
  noneditable_class: "mceNonEditable",
  toolbar_mode: "sliding",
  contextmenu: "link image table",
  skin: useDarkMode ? "oxide-dark" : "oxide",
  content_css: useDarkMode ? "dark" : "default",
  images_upload_handler: props.useOss ? handleUploadImage : undefined,
  automatic_uploads: props.useOss,
  init_instance_callback(editor,) {
    tinymceEditor.value = editor
  },
}

const options = computed<RawEditorOptions>(() => {
  return {
    ...defaultOptions,
    ...props.options,
  }
},)
</script>

<template>
  <TinymceEditor
    v-model="value"
    :disabled="disabled"
    :init="options"
    :plugins="plugins"
    :toolbar="toolbar"
    license-key="gpl"
    tinymce-script-src="/tinymce/tinymce.min.js"
    v-bind="attrs"
  />
</template>

<style lang="scss" scoped>

</style>
