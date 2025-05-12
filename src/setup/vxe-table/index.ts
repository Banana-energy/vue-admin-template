import type { App, } from "vue"
import type { VxeTableProps, } from "vxe-table"
import VxeUI from "vxe-pc-ui"
import VxeTable, { VxeUI as VxeUITable, } from "vxe-table"
import "vxe-pc-ui/lib/style.css"
import "vxe-table/lib/style.css"
import "./ImageRender.tsx"

export const virtualScrollProps: VxeTableProps = {
  virtualXConfig: {
    enabled: true,
    gt: 0,
  },
  virtualYConfig: {
    enabled: true,
    gt: 0,
  },
}

export function setupVxeTable(app: App<Element>,) {
  VxeUITable.setConfig({
    i18n: (key, args,) => {
      const { t, } = useI18n()
      return t(key, args,)
    },
    zIndex: 4000,
    table: {
      align: "left",
      border: true,
      autoResize: false,
      minHeight: 0,
      showOverflow: true,
      showHeaderOverflow: true,
      validConfig: {
        autoClear: false,
      },
      rowConfig: {
        resizable: true,
      },
      columnConfig: {
        resizable: true,
      },
    },
    column: {
      minWidth: 100,
      showOverflow: true,
      showHeaderOverflow: true,
    },
  },)
  app
    .use(VxeUI,)
    .use(VxeTable,)
}
