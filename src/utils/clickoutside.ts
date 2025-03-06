type ElParams = HTMLElement | string | (HTMLElement | string)[]
type Callback = (mouseup: MouseEvent, mousedown: MouseEvent,) => void

const nodeList = new WeakMap<HTMLElement, {
  handler: (mouseup: MouseEvent, mouseDown: MouseEvent,) => void
  exclude: ElParams
}>()
const observedElements = new Set<HTMLElement>()

let startClick: MouseEvent

// 全局 mousedown 和 mouseup 事件
document.addEventListener("mousedown", e => (startClick = e),)
document.addEventListener("mouseup", (e,) => {
  observedElements.forEach((el,) => {
    const { handler, exclude, } = nodeList.get(el,) || { exclude: [], }
    if (!handler) {
      return
    }

    const excludeEls = parseElements(exclude,)
    // 如果点击发生在排除的元素上，则不触发外部点击
    if (excludeEls.some(exEl => exEl.contains(e.target as Node,) || exEl === e.target,)) {
      return
    }
    handler(e, startClick,)
  },)
},)

// 创建一个 documentHandler，用于判断点击是否发生在目标元素外部
function createDocumentHandler(el: HTMLElement, callback: Callback,) {
  return function(mouseup: MouseEvent, mousedown: MouseEvent,) {
    if (
      !mouseup.target
      || !mousedown.target
      || el.contains(mouseup.target as Node,)
      || el.contains(mousedown.target as Node,)
      || el === mouseup.target
    ) {
      return
    }
    callback(mouseup, mousedown,)
  }
}

/**
 * 解析参数，将 DOM 或 选择器 转为 DOM 元素
 * @param {ElParams} target
 */
function parseElements(target: ElParams,): HTMLElement[] {
  if (Array.isArray(target,)) {
    return target.flatMap(t => parseElements(t,),)
  } else if (typeof target === "string") {
    return Array.from(document.querySelectorAll(target,),)
  } else if (target instanceof HTMLElement) {
    return [target,]
  }
  return []
}

/**
 * 监听元素外部点击的函数
 * @param {HTMLElement | string} el - 需要监听外部点击的 DOM 元素或选择器
 * @param {Callback} callback - 当点击元素外部时的回调函数
 * @param {ElParams[]} [exclude] - 不触发外部点击的元素或选择器
 */
function handleClickOutside(el: HTMLElement | string, callback: Callback, exclude: ElParams = [],) {
  const targetElements = parseElements(el,)

  // 初始化时对现有 DOM 元素进行绑定
  targetElements.forEach((targetEl,) => {
    const documentHandler = createDocumentHandler(targetEl, callback,)
    nodeList.set(targetEl, { handler: documentHandler, exclude, },)
    observedElements.add(targetEl,)
  },)

  // 返回一个移除监听的函数
  return () => {
    targetElements.forEach((targetEl,) => {
      nodeList.delete(targetEl,)
      observedElements.delete(targetEl,)
    },)
  }
}

export default handleClickOutside
