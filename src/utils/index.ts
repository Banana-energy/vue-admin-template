export function setCssVar(key: string, value: string, el = document.documentElement,) {
  el.style.setProperty(key, value,)
}

export function getCssVar(key: string, el = document.documentElement,) {
  return getComputedStyle(el,).getPropertyValue(key,)
}
