import type { NotificationHandle, } from "element-plus"
import type { Socket, } from "socket.io-client"
import { IMPORT_META_ENV, } from "@/constants"
import { ElNotification, } from "element-plus"
import { io, } from "socket.io-client"

let notifyIns: NotificationHandle | null = null

export function notify() {
  if (notifyIns) {
    return
  }
  notifyIns = ElNotification({
    title: "PDM",
    type: "warning",
    duration: 0,
    message: h("div", {}, [
      "检测到新版本，点击此处更新",
      h("div", {}, "如多次出现，请按Ctrl+F5(FN)刷新页面",),
    ],),
    position: "bottom-right",
    customClass: "cursor-pointer",
    onClick: () => {
      notifyIns?.close()
      notifyIns = null
      window.location.reload()
    },
  },)
}

let socket: Socket<ServerToClientEvents, {}>
export async function checkVersionFn() {
  if (import.meta.env.DEV) {
    return
  }
  if (socket) {
    return
  }
  const { version, } = await (await fetch(`/version.json`,)).json()
  if (version !== __APP_VERSION__) {
    notify()
  }
  socket = io(IMPORT_META_ENV.VITE_VERSION_URL, {
    transports: ["websocket",],
  },)
  socket.on("updated", (e,) => {
    const isUat = import.meta.env.MODE === "uat"
    const isPro = import.meta.env.MODE === "pro"
    if (e.name?.includes("pdm",)) {
      // 测试环境
      notify()
    }
    if (isUat || isPro) {
      const { task, } = e
      if (task?.pipelineName?.toLowerCase()?.includes("pdm",)) {
        if (isUat && task?.pipelineTags === "UAT") {
          notify()
        }
        if (isPro && task?.pipelineTags === "sz-pro") {
          notify()
        }
      }
    }
  },)
}

export function findRouteByName(
  routes: CustomRouteRecordRaw[],
  name: string,
): CustomRouteRecordRaw | undefined {
  for (const route of routes) {
    if (route.name === name) {
      return route
    } else if (route.children) {
      const found = findRouteByName(route.children, name,)
      if (found) {
        return found
      }
    }
  }
}
