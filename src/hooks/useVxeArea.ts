import type { Awaitable, } from "@vueuse/core"
import type { WatchHandle, } from "vue"
import type { TablePrivateRef, VxeGridInstance, VxeTableDefines, VxeTableInstance, VxeTablePropTypes, } from "vxe-table"
import handleClickOutside from "@/utils/clickoutside.ts"
import { ignoreAutoI18n, } from "@higgins-mmt/vite-plugin-i18n-transformer/utils"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { ElPopover, } from "element-plus"
import { debounce, get, isFunction, isNil, set, } from "lodash-es"
import { Fragment, render, } from "vue"

interface ReturnType {
  handleAreaChange: () => void
  clearSelected: () => void
}

interface Options<D, > {
  bgColor?: string
  pasteValidator?: (copiedInfo: CopyInfo<D>, selectedCells: Cell<D>[],) => Awaitable<boolean>
}

interface CopyInfo<D, > {
  cells: Cell<D>[]
  rowCount: number
  colCount: number
  values: any[]
  text: string
}

interface Cell<D, > {
  row: VxeTablePropTypes.Row
  column: VxeTableDefines.ColumnInfo<D>
}

interface State<D, > {
  copiedInfo: CopyInfo<D> | null
  startCell: Cell<D> | null
  endCell: Cell<D> | null
  selectedColumn: VxeTableDefines.ColumnInfo[]
  isDragging: boolean
  selectedCells: Cell<D>[]
  originalFillCell: Cell<D>[]
  selectionAreaStyle: Partial<CSSStyleDeclaration>
  fillHandleStyle: Partial<CSSStyleDeclaration>
  mousedownTarget: MouseTargetEnum | null
  outsideClose: (() => void) | null
  watchHandleList: WatchHandle[]
}

const MAX_STACK_SIZE = 20

enum MouseTargetEnum {
  CELL = "cell",
  FILL_HANDLER = "fill-handle",
}

let preUserSelect: string
dayjs.extend(customParseFormat,)
const dateFormats = [
  "YYYY-MM-DD",
  "MM/DD/YYYY",
  "DD-MM-YYYY",
  "YYYY/MM/DD",
  "MM-DD-YYYY",
  "DD/MM/YYYY",
  "YYYYMMDD",
  "YYYY-MM-DD HH:mm",
  "MM/DD/YYYY HH:mm",
  "DD-MM-YYYY HH:mm",
  "YYYY/MM/DD HH:mm",
  "MM-DD-YYYY HH:mm",
  "DD/MM/YYYY HH:mm",
  "YYYY-MM-DD HH:mm:ss",
  "MM/DD/YYYY HH:mm:ss",
  "DD-MM-YYYY HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
  "MM-DD-YYYY HH:mm:ss",
  "DD/MM/YYYY HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY/MM/DDTHH:mm:ss",
  "MM-DD-YYYYTHH:mm:ss",
  "DD/MM/YYYYTHH:mm:ss",
  "MMM DD, YYYY",
  "MMM DD YYYY",
  "DD MMM YYYY",
  "YYYY MMM DD",
]

const instances = new Set<VxeTableInstance | VxeGridInstance>()
let currentInstance: VxeTableInstance | VxeGridInstance | null
let copiedTable: VxeTableInstance | VxeGridInstance | null = null

function createEmptyDOMRect(): DOMRect {
  return {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON() {
      return this
    },
  }
}

const FillModePopover = defineComponent({
  name: "FillModePopover",
  props: {
    target: {
      type: Object as PropType<HTMLElement>,
      default: () => ({}),
    },
    onModeSelected: {
      type: Function as PropType<(mode: "fill" | "copy",) => void>,
      default: () => {
      },
    },
  },
  setup(props,) {
    const mode = ref<"fill" | "copy">("fill",)
    const visible = ref(true,)

    function closePopover() {
      visible.value = false
      mode.value = "fill"
    }

    return () => h(ElPopover, {
      showArrow: false,
      placement: "right-start",
      width: "84",
      trigger: "click",
      visible: visible.value,
      virtualTriggering: true,
      virtualRef: props.target,
      popperClass: "max-width-[84px] fill-mode-popper-over",
    }, {
      default: () => h(ElRadioGroup, {
        "modelValue": mode.value,
        "onUpdate:modelValue": (val,) => {
          mode.value = val as "fill" | "copy"
          props.onModeSelected(val as "fill" | "copy",)
          closePopover()
        },
      }, {
        default: () => h(Fragment, [
          h(ElRadio, { value: "fill", }, { default: () => ignoreAutoI18n("填充",), },),
          h(ElRadio, { value: "copy", }, { default: () => ignoreAutoI18n("复制",), },),
        ],),
      },),
    },)
  },
},)

/**
 * 表格区域选择、复制粘贴和填充功能的 Hook
 * TODO: 支持按下ctrl/shift多选区域
 * @param tableRef 表格实例引用
 * @param options 配置选项
 * @returns 返回更新/清空选中区域函数
 */
export function useVxeArea<D extends VxeTablePropTypes.Row, >(tableRef: Ref<VxeTableInstance<D> | VxeGridInstance<D> | undefined>, options?: Options<D>,): ReturnType {
  const undoStack: D[][] = []
  const redoStack: D[][] = []
  const fillHandleEl = ref<HTMLDivElement | null>(null,)
  const state: State<D> = {
    copiedInfo: null,
    startCell: null,
    endCell: null,
    isDragging: false,
    selectedCells: [],
    originalFillCell: [],
    selectionAreaStyle: { top: "0px", left: "0px", width: "0px", height: "0px", display: "none", },
    fillHandleStyle: { top: "0px", left: "0px", display: "none", },
    selectedColumn: [],
    mousedownTarget: null,
    outsideClose: null,
    watchHandleList: [],
  }

  /**
   * 默认的粘贴校验，有no-area的单元格不允许粘贴
   * @param copiedInfo
   */
  const validateNoArea = (copiedInfo: CopyInfo<D>,) => {
    const { cells, } = copiedInfo
    const hasNoArea = cells.some((cell,) => {
      const cellEl = tableRef.value?.getCellElement(cell.row, cell.column,)
      if (!cellEl) {
        return false
      }
      return cellEl.classList.contains("no-area",)
    },)
    return !hasNoArea
  }

  /**
   * 粘贴校验
   * @param copiedInfo
   * @param selectedCells
   */
  const pasteValidator = (copiedInfo: CopyInfo<D>, selectedCells: Cell<D>[],): Awaitable<boolean> => {
    const result = validateNoArea(copiedInfo,)
    if (!result) {
      return false
    }
    if (isFunction(options?.pasteValidator,)) {
      return options?.pasteValidator(copiedInfo, selectedCells,)
    }
    return true
  }

  /**
   * 标准化获取Vxe的子Ref实例
   */
  const getTableRefs = (): {
    tableBody: TablePrivateRef["refTableBody"]["value"] | undefined
    tableLeftBody: TablePrivateRef["refTableLeftBody"]["value"] | undefined
    tableRightBody: TablePrivateRef["refTableRightBody"]["value"] | undefined
    tableHeader: TablePrivateRef["refTableHeader"]["value"] | undefined
    tableLeftHeader: TablePrivateRef["refTableLeftHeader"]["value"] | undefined
    tableRightHeader: TablePrivateRef["refTableRightHeader"]["value"] | undefined
  } => {
    const empty = {
      tableBody: undefined,
      tableLeftBody: undefined,
      tableRightBody: undefined,
      tableHeader: undefined,
      tableLeftHeader: undefined,
      tableRightHeader: undefined,
    }
    const getReturn = (tableRef?: TablePrivateRef,) => {
      if (!tableRef) {
        return empty
      }
      return {
        tableBody: tableRef.refTableBody.value,
        tableLeftBody: tableRef.refTableLeftBody.value,
        tableRightBody: tableRef.refTableRightBody.value,
        tableHeader: tableRef.refTableHeader.value,
        tableLeftHeader: tableRef.refTableLeftHeader.value,
        tableRightHeader: tableRef.refTableRightHeader.value,
      }
    }
    if (!tableRef.value) {
      return getReturn()
    }
    const refMaps = tableRef.value.getRefMaps()
    if ("refTable" in refMaps) {
      const tableRefMaps = refMaps.refTable.value?.getRefMaps()

      return getReturn(tableRefMaps,)
    }
    return getReturn(refMaps,)
  }

  /**
   * 获取当前表格的复制信息
   */
  const getCopiedInfo = (): CopyInfo<D> | null => {
    if (tableRef.value !== currentInstance || !tableRef.value) {
      return null
    }
    const selectedCells = state.selectedCells || []
    if (!selectedCells.length) {
      return null
    }

    const { rowRange, colRange, } = calculateSelectionRange(selectedCells,)

    return {
      cells: selectedCells,
      rowCount: rowRange.max - rowRange.min + 1,
      colCount: colRange.max - colRange.min + 1,
      values: selectedCells.map(cell => ({
        cell,
        value: get(cell.row, cell.column.field,),
      }),),
      text: selectedCells.map((cell,) => {
        const el = tableRef.value!.getCellElement(cell.row, cell.column,)
        return el ? el.textContent : ""
      },).join("\t",),
    }
  }

  const validatePaste = async(copiedInfo: CopyInfo<D> | null, selectedCells: Cell<D>[],) => {
    if (!copiedInfo) {
      return false
    }
    const result = pasteValidator(copiedInfo, selectedCells,)
    if (typeof result !== "boolean" && result.then) {
      return await result.then()
    }
    return result
  }

  /**
   * 剪贴板相关操作
   */
  const clipboardActions = {
    copy() {
      if (tableRef.value !== currentInstance || !tableRef.value) {
        copiedTable = null
        state.copiedInfo = null
        return
      }

      state.copiedInfo = getCopiedInfo()

      navigator.clipboard.writeText(state.copiedInfo?.text || "",)
      copiedTable = tableRef.value
    },

    async paste() {
      const selectedCells = state.selectedCells || []
      if (!selectedCells.length) {
        return
      }

      if (state.copiedInfo) {
        const result = await validatePaste(state.copiedInfo, selectedCells,)

        result && this.executePaste(selectedCells,)
      } else {
        // 尝试从剪贴板直接粘贴
        this.executePaste(selectedCells,)
      }
    },

    async executePaste(targetCells: Cell<D>[],) {
      if (!tableRef.value) {
        return
      }

      saveSnapshot()

      // 如果没有复制内容，从剪贴板获取文本
      if (!copiedTable) {
        try {
          const clipboardText = await navigator.clipboard.readText()
          this.pasteText(targetCells, clipboardText,)
        } catch (error) {
          console.error("Failed to read clipboard:", error,)
        }
        return
      }

      // 有复制内容时的粘贴逻辑
      this.pasteCopiedCells(targetCells,)
    },

    pasteText(targetCells: Cell<D>[], text: string,) {
      // 简单文本粘贴逻辑
      if (isNil(text,) || !targetCells.length) {
        return
      }

      targetCells.forEach((cell,) => {
        set(cell.row, cell.column.field, text,)
      },)
    },

    pasteCopiedCells(targetCells: Cell<D>[],) {
      if (!tableRef.value || !copiedTable || !state.copiedInfo) {
        return
      }

      const { copiedInfo, } = state

      // 计算目标区域范围
      const { rowRange: targetRowRange, colRange: targetColRange, } = calculateSelectionRange(targetCells,)

      const targetRowCount = targetRowRange.max - targetRowRange.min + 1
      const targetColCount = targetColRange.max - targetColRange.min + 1

      // 创建目标单元格映射
      const targetCellMap = createCellMap(targetCells,)

      // 创建源单元格值映射
      const { cells, rowCount, colCount, values, } = copiedInfo
      const copiedBaseRowIndex = copiedTable.getVTRowIndex(cells[0].row,)
      const copiedBaseColIndex = copiedTable.getVTColumnIndex(cells[0].column,)

      const copiedCellMap = new Map(
        values.map(({ cell, value, },) => [
          `${copiedTable!.getVTRowIndex(cell.row,)}:${copiedTable!.getVTColumnIndex(cell.column,)}`,
          value,
        ],),
      )

      // 执行粘贴操作
      for (let rowOffset = 0; rowOffset < targetRowCount; rowOffset++) {
        for (let colOffset = 0; colOffset < targetColCount; colOffset++) {
          const rowIndex = targetRowRange.min + rowOffset
          const colIndex = targetColRange.min + colOffset
          const cellKey = `${rowIndex}:${colIndex}`

          if (!targetCellMap.has(cellKey,)) {
            continue
          }

          const targetCell = targetCellMap.get(cellKey,)

          // 计算源单元格的行列偏移
          const sourceRowOffset = rowOffset % rowCount
          const sourceColOffset = colOffset % colCount
          const sourceKey = `${copiedBaseRowIndex + sourceRowOffset}:${copiedBaseColIndex + sourceColOffset}`

          if (copiedCellMap.has(sourceKey,)) {
            const sourceValue = copiedCellMap.get(sourceKey,)
            set(targetCell!.row, targetCell!.column.field, sourceValue,)
          }
        }
      }
    },
  }

  /**
   * 计算选择区域的行列范围
   * @param cells 选中的单元格集合
   * @returns 行列范围对象
   */
  function calculateSelectionRange(cells: Cell<D>[],) {
    if (!tableRef.value || !cells.length) {
      return {
        rowRange: { min: 0, max: 0, },
        colRange: { min: 0, max: 0, },
      }
    }

    const rowIndexes = cells.map(cell => tableRef.value!.getVTRowIndex(cell.row,),)
    const colIndexes = cells.map(cell => tableRef.value!.getVTColumnIndex(cell.column,),)

    return {
      rowRange: {
        min: Math.min(...rowIndexes,),
        max: Math.max(...rowIndexes,),
      },
      colRange: {
        min: Math.min(...colIndexes,),
        max: Math.max(...colIndexes,),
      },
    }
  }

  /**
   * 创建单元格映射，用于快速查找单元格
   * @param cells 单元格集合
   * @returns 单元格映射 Map
   */
  function createCellMap(cells: Cell<D>[],) {
    if (!tableRef.value) {
      return new Map<string, Cell<D>>()
    }

    return new Map<string, Cell<D>>(
      cells.map(cell => [
        `${tableRef.value!.getVTRowIndex(cell.row,)}:${tableRef.value!.getVTColumnIndex(cell.column,)}`,
        cell,
      ],),
    )
  }

  watch(() => tableRef.value, (newVal, oldValue,) => {
    if (!newVal && oldValue) {
      // 表格销毁了
      destroy(oldValue,)
      return
    }
    // 树形/展开表格不支持选择区域
    const columns = newVal?.getFullColumns() || []
    const hasExpand = columns.some(column => column.type === "expand",)
    const hasTree = columns.some(column => column.treeNode,)
    if (hasExpand || hasTree) {
      return
    }
    createStyle()
    initTableState()
    attachListeners()
  },)

  /**
   * TODO: 待优化 多个表格的情况不能使用id
   * 创建表格选择区域的样式
   */
  function createStyle() {
    if (instances.size !== 0) {
      return
    }
    const style = document.createElement("style",)
    style.innerHTML = `
     #selection-area {
        position: absolute;
        border: 2px solid #1890ff;
        background-color: ${options?.bgColor || "rgba(64, 158, 255, 0.1)"};
        pointer-events: none;
        display: none;
        transition: top 0.15s ease, left 0.15s ease, width 0.15s ease, height 0.15s ease;
        will-change: transform, top, left, width, height;
    }
    .fill-handle {
        display: none;
        position: absolute;
        cursor: crosshair;
        width: 6px;
        height: 6px;
        background-color: #1890ff;
        transition: top 0.15s ease, left 0.15s ease;
        will-change: transform, top, left, width, height;
    }
    .area-header-cell:hover {
        cursor: ns-resize;
    }`
    document.head.appendChild(style,)
  }

  /**
   * 初始化
   */
  function initTableState() {
    if (!tableRef.value) {
      return
    }
    instances.add(tableRef.value,)
    setHeaderCell()
    setCellRender()
    setFocusOutside()
    createSelection()
  }

  const updateCurrentCellArea = debounce(() => {
    if (tableRef.value === currentInstance) {
      updateCellArea()
    }
  }, 200,)

  function attachListeners() {
    window.addEventListener("keydown", handleKeyboardShortcuts,)
    window.addEventListener("resize", updateCurrentCellArea,)
    window.addEventListener("mouseup", onMouseUp,)
  }

  function detachListeners() {
    window.removeEventListener("keydown", handleKeyboardShortcuts,)
    window.removeEventListener("resize", updateCurrentCellArea,)
    window.removeEventListener("mouseup", onMouseUp,)
  }

  function destroy(tableRef: VxeTableInstance | VxeGridInstance,) {
    detachListeners()
    undoStack.length = 0
    redoStack.length = 0
    for (const { stop, } of state.watchHandleList) {
      stop()
    }
    state.watchHandleList = []
    state.outsideClose?.()
    instances.delete(tableRef,)
    fillHandleEl.value?.remove()
    fillHandleEl.value = null

    Object.assign(state, {
      copiedInfo: null,
      startCell: null,
      endCell: null,
      isDragging: false,
      selectedCells: [],
      selectionAreaStyle: { top: "0px", left: "0px", width: "0px", height: "0px", display: "none", },
      fillHandleStyle: { top: "0px", left: "0px", display: "none", },
      selectedColumn: [],
      mousedownTarget: null,
    },)
  }

  function handleKeyboardShortcuts(e: KeyboardEvent,) {
    if (e.key === "c" && e.ctrlKey) {
      clipboardActions.copy()
      return
    }
    if (e.key === "v" && e.ctrlKey) {
      clipboardActions.paste()
      return
    }
    if (e.key === "z" && e.ctrlKey) {
      e.preventDefault()
      undo()
      return
    }
    if (e.key === "y" && e.ctrlKey) {
      e.preventDefault()
      redo()
    }
  }

  /**
   * 点击表格外部事件
   */
  function setFocusOutside() {
    if (!tableRef.value) {
      return
    }
    state.outsideClose = handleClickOutside(tableRef.value.$el, () => {
      render(null, document.body,)
      currentInstance = null
      clearSelected()
    }, [".fill-handle", ".fill-mode-popper-over",],)
  }

  /**
   * 清空选中单元格，更新选中区域
   */
  function clearSelected() {
    if (state.isDragging) {
      return
    }
    state.startCell = null
    state.endCell = null
    state.selectedCells = []
    updateCellArea()
  }

  /**
   * 监听数据变化，处理表体单元格
   */
  function setCellRender() {
    function updateCellRender() {
      setTimeout(() => {
        const { tableBody, tableLeftBody, tableRightBody, } = getTableRefs()
        const list = [tableBody, tableLeftBody, tableRightBody,].filter(Boolean,)
        list.forEach((ref,) => {
          setCellElEvent(ref!.$el,)
        },)
      },)
    }

    const watchHandle = watch(
      () => [tableRef.value?.getTableData().fullData, tableRef.value?.getColumns(),],
      updateCellRender,
      {
        immediate: true,
      },
    )
    state.watchHandleList.push(watchHandle,)
  }

  /**
   * TODO: 事件应需要调用已有值，防止用户自定义事件被覆盖
   * 为单元格添加事件处理
   * @param tableBody 表格主体元素
   */
  function setCellElEvent(tableBody: HTMLElement,) {
    if (tableBody) {
      const tds = tableBody.querySelectorAll("td",)
      tds.forEach((td,) => {
        if (td.className.includes("no-area",)) {
          td.onmousemove = null
          td.onmousedown = null
          td.onmouseup = null
          return
        }
        const tr = td.parentElement
        if (!tr) {
          return
        }
        const row = tableRef.value?.getRowNode(tr,)?.item
        const column = tableRef.value?.getColumnNode(td,)?.item
        td.onmousemove = () => onCellMouseMove({ row, column, },)
        td.onmousedown = onMousedown(MouseTargetEnum.CELL, { row, column, },)
        td.onmouseup = onMouseUp
      },)
    }
  }

  /**
   * 注册鼠标抬起事件
   * @param e
   */
  async function onMouseUp(e: MouseEvent,) {
    if (tableRef.value !== currentInstance || !state || e.button !== 0) {
      return
    }
    state.isDragging = false
    recoverUserSelect()
    if (e.currentTarget === window) {
      return
    }
    if (state.mousedownTarget === MouseTargetEnum.FILL_HANDLER) {
      // 点击fillHandler抬起，先填充单元格值，然后弹出选择模式
      const result = await fillCells()
      if (!result) {
        return
      }
      const vnode = h(FillModePopover, {
        target: fillHandleEl.value!,
        onModeSelected: (mode: "fill" | "copy",) => {
          fillCells(mode,)
          nextTick(() => {
            render(null, document.body,)
          },)
        },
      },)
      render(vnode, document.body,)
    } else {
      // 记录原始选中单元格，用于填充时判断
      state.originalFillCell = [...state.selectedCells,]
    }
  }

  /**
   * 填充单元格，提供填充/复制两种逻辑，尽量对齐excel
   * @param mode
   */
  async function fillCells(mode?: "fill" | "copy",) {
    if (!state.startCell || !state.endCell || !tableRef.value) {
      return false
    }

    const copiedInfo = getCopiedInfo()
    if (!copiedInfo) {
      return false
    }
    copiedInfo.cells = state.originalFillCell
    copiedInfo.values = state.originalFillCell.map(cell => ({
      cell,
      value: get(cell.row, cell.column.field,),
    }),)
    const result = await validatePaste(copiedInfo, state.selectedCells,)
    if (!result) {
      return false
    }

    saveSnapshot()
    const { getVTColumnIndex, getVTRowIndex, } = tableRef.value
    const { startCell: { row, column, }, } = state
    const property = get(row, state.startCell.column.field,)
    const startRowIndex = getVTRowIndex(row,)
    const startColIndex = getVTColumnIndex(column,)
    state.selectedCells.forEach((cell,) => {
      if (cell.row !== row || cell.column !== column) {
        const rowIndex = getVTRowIndex(cell.row,)
        const columnIndex = getVTColumnIndex(cell.column,)
        const rowOffset = rowIndex - startRowIndex
        const colOffset = columnIndex - startColIndex
        set(cell.row, cell.column.field, getNextValue(property, rowOffset, colOffset, mode,),)
      }
    },)
    return true
  }

  /**
   * 根据填充模式计算下一个值
   * @param value 原始值
   * @param rowOffset 行偏移
   * @param colOffset 列偏移
   * @param mode 填充模式
   * @returns 计算后的新值
   */
  function getNextValue(value: any, rowOffset: number, colOffset: number, mode: "fill" | "copy" = "fill",) {
    if (mode === "copy") {
      return value
    }
    if (typeof value === "number") {
      return value + rowOffset + colOffset
    }
    if (typeof value === "string") {
      for (const format of dateFormats) {
        const date = dayjs(value, format, true,)
        if (date.isValid()) {
          return date.add(rowOffset + colOffset, "day",).format(format,)
        }
      }
      if (/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/i.test(value,)) {
        const num = Number.parseFloat(value,)
        return !Number.isNaN(num,) ? String(num + rowOffset + colOffset,) : value
      }
    }
    return value
  }

  function saveSnapshot() {
    if (!tableRef.value) {
      return
    }
    const { fullData, } = tableRef.value.getTableData()
    const snapshot = JSON.parse(JSON.stringify(fullData,),)
    undoStack.push(snapshot,)
    if (undoStack.length > MAX_STACK_SIZE) {
      undoStack.shift()
    }
    redoStack.length = 0 // 清空恢复栈
  }

  // 撤销
  function undo() {
    if (!tableRef.value) {
      return
    }
    const { fullData, } = tableRef.value.getTableData()
    if (undoStack.length > 0) {
      const currentData = JSON.parse(JSON.stringify(fullData,),)
      redoStack.push(currentData,)
      const lastSnapshot = undoStack.pop()
      tableRef.value.reloadData(lastSnapshot || [],)
    }
  }

  // 恢复
  function redo() {
    if (!tableRef.value) {
      return
    }
    const { fullData, } = tableRef.value.getTableData()
    if (redoStack.length > 0) {
      const currentData = JSON.parse(JSON.stringify(fullData,),)
      undoStack.push(currentData,)
      const lastSnapshot = redoStack.pop()
      tableRef.value.reloadData(lastSnapshot || [],)
    }
  }

  /**
   * 给单元格注册鼠标移动事件，移入时更新选中区域和选中单元格
   * @param row
   * @param column
   */
  function onCellMouseMove({ row, column, }: Partial<Cell<D>>,) {
    if (!state.isDragging || !state.startCell || !tableRef.value || !row || !column) {
      return
    }

    if (
      row === state.endCell?.row
      && column === state.endCell?.column
    ) {
      // 若位置没有变化，则不需要更新
      return
    }
    if (state.selectedColumn.length) {
      // 如果选中了整列之后拖拽，则更新选中列
      const { visibleData, } = tableRef.value.getTableData()
      state.endCell = { row: visibleData.at(-1,), column, }
      const selectedColumns = [...state.selectedColumn, column,]
      state.selectedColumn = [...new Set(selectedColumns,),]
    } else {
      state.endCell = { row, column, }
    }

    updateSelectedCells() // 更新选中单元格
    updateCellArea() // 更新显示选中区域
  }

  /**
   * 监听数据变化，处理表头单元格
   */
  function setHeaderCell() {
    function updateHeaderCells() {
      setTimeout(() => {
        const { tableHeader, tableLeftHeader, tableRightHeader, } = getTableRefs()
        const list = [tableHeader, tableLeftHeader, tableRightHeader,].filter(Boolean,)
        list.forEach((ref,) => {
          setHeaderCellRender(ref!.$el,)
        },)
      },)
    }

    const watchHandle = watch(
      () => [tableRef.value?.getTableData().fullData, tableRef.value?.getColumns(),],
      updateHeaderCells,
      {
        immediate: true,
      },
    )
    state.watchHandleList.push(watchHandle,)
  }

  /**
   * TODO: onclick应需要调用已有值，防止用户自定义事件被覆盖
   * 给表头单元格添加事件
   * @param el 通过VxeTable获取的表头元素
   */
  function setHeaderCellRender(el: HTMLElement,) {
    if (!el) {
      return
    }
    el.querySelectorAll("th",).forEach((th,) => {
      if (th.className.includes("no-area",)) {
        th.onclick = null
        return
      }
      if (th.className.includes("area-header-cell",)) {
        return
      }
      th.className += " area-header-cell"
      th.onclick = () => onHeaderCellClick(th,)
    },)
  }

  /**
   * 表头单元格点击事件
   * @param th 表头单元格元素
   */
  function onHeaderCellClick(th: HTMLTableCellElement,) {
    if (!tableRef.value) {
      return
    }
    const { getTableData, getColumnNode, } = tableRef.value
    // 清除填充模式选择
    render(null, document.body,)
    let column = getColumnNode(th,)?.item
    if (column?.children && column.children.length) {
      // 说明是分组表头，默认选中第一个
      column = column.children.at(0,)
    }
    if (column) {
      const { visibleData, } = getTableData() || { visibleData: [], }
      state.startCell = { row: visibleData[0], column, }
      state.endCell = { row: visibleData.at(-1,), column, }
      // 选中整列
      state.selectedColumn = [column,]
      updateSelectedCells()
      updateCellArea()
      currentInstance = tableRef.value
    }
  }

  /**
   * 更新选中单元格
   */
  function updateSelectedCells() {
    if (!state.startCell || !state.endCell || !tableRef.value) {
      return
    }
    state.selectedCells = []
    const { getVTRowIndex, getVTColumnIndex, getTableData, getTableColumn, } = tableRef.value
    const { visibleData, } = getTableData()
    // 是否选中了整列
    const isSelectedColumn = state.selectedColumn.length > 0
    const { visibleColumn, } = getTableColumn()

    // 起始行索引
    const startRowIndex = getVTRowIndex(state.startCell.row,)
    // 如果选中了整列，则结束行索引为表格数据长度-1
    const endRowIndex = isSelectedColumn ? visibleData.length - 1 : getVTRowIndex(state.endCell.row,)
    // 起始列索引
    const startColIndex = getVTColumnIndex(state.startCell.column,)
    // 结束列索引
    const endColIndex = getVTColumnIndex(state.endCell.column,)

    // 计算最小和最大行索引和列索引，确定边界
    const minRowIndex = Math.min(startRowIndex, endRowIndex,)
    const maxRowIndex = Math.max(startRowIndex, endRowIndex,)
    const minColIndex = Math.min(startColIndex, endColIndex,)
    const maxColIndex = Math.max(startColIndex, endColIndex,)

    for (let i = minRowIndex; i <= maxRowIndex; i++) {
      for (let j = minColIndex; j <= maxColIndex; j++) {
        state.selectedCells.push({ row: visibleData[i], column: visibleColumn[j], },)
      }
    }
  }

  /**
   * 更新选中区域样式
   */
  function updateCellArea() {
    if (!state.startCell || !state.endCell || !tableRef.value) {
      state.selectionAreaStyle.display = "none"
      state.fillHandleStyle.display = "none"
      createSelection()
      return
    }

    requestAnimationFrame(() => {
      const { selectionStyle, handleStyle, } = calculateAreaStyles()

      Object.assign(state.selectionAreaStyle, selectionStyle,)
      Object.assign(state.fillHandleStyle, handleStyle,)
      createSelection()
    },)
  }

  /**
   * 计算选择区域和填充手柄的样式
   */
  function calculateAreaStyles() {
    if (!state.startCell || !state.endCell || !tableRef.value) {
      return {
        selectionStyle: { display: "none", },
        handleStyle: { display: "none", },
      }
    }

    const { getVTRowIndex, getVTColumnIndex, } = tableRef.value
    const { row: startRow, column: startColumn, } = state.startCell
    const { row: endRow, column: endColumn, } = state.endCell
    const startRowIndex = getVTRowIndex(startRow,)
    const endRowIndex = getVTRowIndex(endRow,)
    const startColIndex = getVTColumnIndex(startColumn,)
    const endColIndex = getVTColumnIndex(endColumn,)

    // 检查是否有隐藏单元格
    const hasSpan = checkHiddenCells()

    // 获取单元格元素和位置
    const startCell = getSelectedCell(startRow, startColumn, {
      hasSpan,
      rowDirection: startRowIndex <= endRowIndex,
      colDirection: startColIndex <= endColIndex,
    },)

    const domRect = createEmptyDOMRect()
    const startRect = startCell?.getBoundingClientRect() || domRect

    const endCell = state.selectedCells.length > 1
      ? getSelectedCell(endRow, endColumn, {
          hasSpan,
          rowDirection: startRowIndex > endRowIndex,
          colDirection: startColIndex > endColIndex,
        },)
      : startCell

    const endRect = endCell?.getBoundingClientRect() || domRect

    // 获取表格位置信息
    const tableBody = getTableRefs().tableBody?.$el
    const tableBodyRect = tableBody?.getBoundingClientRect() || domRect
    const { scrollTop, scrollLeft, } = tableBody

    // 检查是否有固定列
    const hasFixedCell = state.selectedCells.some(cell => cell.column.fixed,)

    // 检查是否选择了整列
    const isSelectedColumn = state.selectedColumn.length > 0

    // 计算矩形区域的边界
    const maxRight = Math.max(startRect.right, endRect.right,)

    // 计算选择区域样式
    const selectionStyle = {
      top: `${Math.min(startRect.top, endRect.top,) - tableBodyRect.top + tableBody.scrollTop}px`,
      left: `${Math.min(startRect.left, endRect.left,) - tableBodyRect.left + tableBody.scrollLeft}px`,
      width: `${Math.abs(Math.max(endRect.right, startRect.right,) - Math.min(endRect.left, startRect.left,),)}px`,
      height: `${Math.abs(Math.max(endRect.bottom, startRect.bottom,) - Math.min(endRect.top, startRect.top,),)}px`,
      display: "block",
      zIndex: hasFixedCell ? 6 : null,
    }

    // 计算填充手柄样式
    const selectedBoundary = isSelectedColumn ? "top" : "bottom"
    const offset = isSelectedColumn ? 0 : -6

    const boundaryValue = Math[isSelectedColumn ? "min" : "max"](
      startRect[selectedBoundary],
      endRect[selectedBoundary],
    )

    const handleStyle = {
      top: `${boundaryValue - tableBodyRect.top + offset + scrollTop}px`,
      left: `${maxRight - tableBodyRect.left - 6 + scrollLeft}px`,
      display: "block",
      zIndex: hasFixedCell ? "6" : "",
    }

    return { selectionStyle, handleStyle, }
  }

  /**
   * 检查是否有隐藏单元格
   * vue2版本getVM(Column/Row)Index方法在隐藏的情况下会返回-1
   * vue3新版本表现有不同，因此只能根据获取到的单元格元素是否存在来判断
   */
  function checkHiddenCells() {
    if (!tableRef.value || !state.selectedCells.length) {
      return false
    }

    const { getCellElement, } = tableRef.value
    for (const cell of state.selectedCells) {
      const cellEl = getCellElement(cell.row, cell.column,)
      if (!cellEl) {
        return true
      }
    }

    return false
  }

  function createSelection() {
    if (!tableRef.value) {
      return
    }
    const tableBodyEl = getTableRefs().tableBody?.$el
    // 创建或获取选择区域元素
    let selectionArea = tableBodyEl.querySelector("#selection-area",)
    if (!selectionArea) {
      selectionArea = document.createElement("div",)
      selectionArea.id = "selection-area"
      tableBodyEl.appendChild(selectionArea,)
    }
    Object.assign(selectionArea.style, state.selectionAreaStyle,)

    // 创建或获取填充手柄元素
    let fillHandle = tableBodyEl.querySelector("#fill-handle",) as HTMLDivElement
    if (!fillHandle) {
      fillHandle = document.createElement("div",)
      fillHandle.id = "fill-handle"
      fillHandle.className = "fill-handle"
      tableBodyEl.appendChild(fillHandle,)
    }
    Object.assign(fillHandle.style, state.fillHandleStyle,)
    fillHandle.onmousedown = onMousedown(MouseTargetEnum.FILL_HANDLER, {},)
    fillHandleEl.value = fillHandle
  }

  /**
   * 给单元格注册鼠标按下事件
   * @param target 鼠标按下的目标，可能为fillHandler/cell
   * @param row 单元格对应行
   * @param column 单元格对应列
   */
  function onMousedown(target: MouseTargetEnum, { row, column, }: Partial<Cell<D>>,) {
    return (e: MouseEvent,) => {
      if (!tableRef.value || e.button !== 0) {
        return
      }
      render(null, document.body,)
      currentInstance = tableRef.value
      if (target === MouseTargetEnum.FILL_HANDLER) {
        row = state.startCell?.row
        column = state.startCell?.column
      }
      const cellEl = tableRef.value.getCellElement(row, column!,)
      if (!cellEl) {
        return
      }
      if (row && column) {
        state.startCell = { row, column, }
        state.endCell = { row, column, }
      }
      if (target === MouseTargetEnum.CELL) {
        state.selectedColumn = []
        updateSelectedCells()
        updateCellArea()
      }
      state.mousedownTarget = target
      setUserSelectNone()
      state.isDragging = true
    }
  }

  /**
   * 设置body的user-select为none，避免拖拽过程中选中文字
   */
  function setUserSelectNone() {
    preUserSelect = document.body.style.userSelect
    document.body.style.userSelect = "none"
  }

  /**
   * 恢复body的user-select
   */
  function recoverUserSelect() {
    document.body.style.userSelect = preUserSelect
  }

  /**
   * 根据row/column获取选中的单元格元素
   * 在虚拟滚动下，可能获取不到单元格元素，因此需要根据方向来递增/减来查找可见的单元格
   * @param row
   * @param column
   * @param options
   */
  function getSelectedCell(
    row: VxeTablePropTypes.Row,
    column: VxeTableDefines.ColumnInfo,
    options: {
      hasSpan: boolean
      rowDirection: boolean
      colDirection: boolean
    },
  ) {
    if (!tableRef.value) {
      return null
    }

    const table = tableRef.value
    const { hasSpan, rowDirection, colDirection, } = options

    // 首先尝试直接获取单元格元素
    let cellEl = table.getCellElement(row, column,)

    // 如果找到了单元格元素或没有隐藏单元格，直接返回
    if (cellEl || !hasSpan) {
      return cellEl
    }

    // 如果找不到单元格元素且有隐藏单元格
    const { visibleColumn, } = table.getTableColumn()
    const { visibleData, } = table.getTableData()
    const rowIndex = table.getVTRowIndex(row,)
    const colIndex = table.getVTColumnIndex(column,)

    // 定义搜索范围
    const maxRowIndex = visibleData.length - 1
    const maxColIndex = visibleColumn.length - 1

    // 策略1：先在同一列中查找可见单元格
    let currentRowIndex = rowIndex
    while (currentRowIndex >= 0 && currentRowIndex <= maxRowIndex) {
      const currentRow = visibleData[currentRowIndex]
      cellEl = table.getCellElement(currentRow, column,)

      if (cellEl) {
        return cellEl
      }

      // 按指定方向调整行索引
      currentRowIndex += rowDirection ? 1 : -1
    }

    // 策略2：如果在同列中找不到，尝试在同行中查找
    let currentColIndex = colIndex
    while (currentColIndex >= 0 && currentColIndex <= maxColIndex) {
      const currentColumn = visibleColumn[currentColIndex]
      cellEl = table.getCellElement(row, currentColumn,)

      if (cellEl) {
        return cellEl
      }

      // 按指定方向调整列索引
      currentColIndex += colDirection ? 1 : -1
    }

    return cellEl
  }

  /**
   * 表格数据/元素有变化时，延迟更新其他非关键部分
   */
  const debouncedUpdate = debounce(() => {
    render(null, document.body,)
    setHeaderCell()
    setCellRender()
  }, 200,)

  /**
   * 表格数据/元素有变化时，立即更新选区位置（最重要的视觉反馈）
   * 一般在表格数据/元素有变化时调用，如：列宽/行高变化，表格滚动等，需手动调用
   */
  function handleAreaChange() {
    if (tableRef.value === currentInstance) {
      updateCellArea()
    }

    // 延迟更新其他非关键部分
    debouncedUpdate()
  }

  return {
    handleAreaChange,
    clearSelected,
  }
}
