import { useCssVar, } from "@vueuse/core"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const primaryColor = useCssVar("--el-color-primary", document.documentElement,)

export function useNProgress() {
  NProgress.configure({ showSpinner: false, },)

  const initColor = async() => {
    await nextTick()
    const bar = document.getElementById("nprogress",)?.getElementsByClassName("bar",)[0] as ElRef
    if (bar) {
      bar.style.background = unref(primaryColor.value,) as string
    }
  }

  initColor()

  const start = () => {
    NProgress.start()
  }

  const done = () => {
    NProgress.done()
  }

  return {
    start,
    done,
  }
}
