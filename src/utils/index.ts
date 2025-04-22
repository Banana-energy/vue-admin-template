import { isNil, isObject, } from "lodash-es"

export function setCssVar(key: string, value: string, el = document.documentElement,) {
  el.style.setProperty(key, value,)
}

export function getCssVar(key: string, el = document.documentElement,) {
  return getComputedStyle(el,).getPropertyValue(key,)
}

export function isValidStructure<T extends Recordable,>(obj: T, key: string,) {
  return key in obj
}

export function transformOptionsToMap<T extends Record<string, string | number | undefined>[],>(options?: T, config?: {
  keyField: string
  valueField: string
},) {
  if (!Array.isArray(options,) || !options.length) {
    return {}
  }

  const { keyField, valueField, } = config || {
    keyField: "label",
    valueField: "value",
  }

  return options.reduce((acc, cur,) => {
    if (cur[keyField] && isValidStructure(cur, keyField,) && isValidStructure(cur, valueField,)) {
      acc[cur[keyField]] = cur[valueField]
    }
    return acc
  }, {},)
}

type ValidArgs = (string | number | undefined)[] | [...(string | number | undefined)[], { separator: string },]
export function formatString(...args: ValidArgs) {
  const last = args.pop()
  let separator = "/"
  if (isObject(last,)) {
    separator = last.separator
  } else if (!isNil(last,)) {
    args.push(last,)
  }
  return args.filter(e => !isNil(e,),).join(separator,)
}

export function clearReactiveObject(obj: unknown,) {
  if (isObject(obj,)) {
    for (const key of Object.keys(obj,)) {
      Reflect.deleteProperty(obj, key,)
    }
  }
}
