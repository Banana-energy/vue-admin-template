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

export function inputProps(): Partial<InputProps> {
  return {
    placeholder: "请输入",
    clearable: true,
  }
}

export function inputNumberProps(): Partial<InputNumberProps> {
  return {
    controls: false,
    valueOnClear: null,
    precision: 2,
    placeholder: "请输入",
  }
}

export function signalSelectProps(): Partial<ISelectProps> {
  return {
    clearable: true,
    placeholder: "请选择",
    filterable: true,
  }
}

export function multiSelectProps(): Partial<ISelectProps> {
  return {
    ...signalSelectProps(),
    multiple: true,
    collapseTags: true,
    collapseTagsTooltip: true,
  }
}

export function textAreaProps(): Partial<InputProps> {
  return {
    type: "textarea",
    autosize: {
      minRows: 3,
      maxRows: 5,
    },
    showWordLimit: true,
    placeholder: "请输入",
  }
}
