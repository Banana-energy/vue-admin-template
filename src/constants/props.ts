import type { FormProps, InputNumberProps, InputProps, ISelectProps, } from "element-plus"
import type { VxeTableProps, } from "vxe-table"

export const formProps: Partial<FormProps> = {
  labelWidth: "auto",
  scrollToError: true,
  scrollIntoViewOptions: {
    behavior: "smooth",
    block: "center",
    inline: "center",
  },
}

export const customConfigProps: VxeTableProps = {
  customConfig: {
    allowVisible: true,
    allowFixed: true,
    allowResizable: true,
    allowSort: true,
    storage: {
      visible: true,
      resizable: true,
      sort: true,
      fixed: true,
    },
  },
}

export const inputProps: Partial<InputProps> = {
  placeholder: "请输入",
  clearable: true,
}

export const inputNumberProps: Partial<InputNumberProps> = {
  controls: false,
  valueOnClear: null,
  precision: 2,
  placeholder: "请输入",
}

export const signalSelectProps: Partial<ISelectProps> = {
  clearable: true,
  placeholder: "请选择",
  filterable: true,
}

export const multiSelectProps: Partial<ISelectProps> = {
  ...signalSelectProps,
  multiple: true,
  collapseTags: true,
  collapseTagsTooltip: true,
}

export const textAreaProps: Partial<InputProps> = {
  type: "textarea",
  autosize: {
    minRows: 3,
    maxRows: 5,
  },
  showWordLimit: true,
  placeholder: "请输入",
}
