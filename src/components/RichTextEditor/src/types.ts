import type { RawEditorOptions, } from "tinymce"

export interface Props {
  modelValue?: string
  plugins?: string
  toolbar?: string
  menubar?: string
  disabled?: boolean
  height?: string | number
  width?: string | number
  options?: RawEditorOptions
  useOss?: boolean
}

export interface Emits {
  (e: "update:modelValue", value: string): void
  (e: "uploading", value: boolean): void
}

export const defaultProps = {
  modelValue: "",
  plugins: "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
  toolbar: "undo redo | forecolor backcolor removeformat | link image table media | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | accordion accordionremove | lineheight outdent indent | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
  menubar: "file edit view insert format tools table help",
  disabled: false,
  height: 600,
  width: "100%",
  options: () => ({}),
}
