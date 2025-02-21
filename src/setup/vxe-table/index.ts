import type { App, } from "vue"
import type { VxeTableProps, } from "vxe-table"
import VxeUI from "vxe-pc-ui"
import VxeUITable from "vxe-table"
import "vxe-pc-ui/lib/style.css"
import "vxe-table/lib/style.css"

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
  VxeUI.setConfig({
    table: {
      align: "left",
      border: true,
      autoResize: true,
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
      showOverflow: true,
      showHeaderOverflow: true,
    },
  },)
  app
    .use(VxeUI,)
    .use(VxeUITable,)
}
