import type { VNode, } from "vue"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $slots: Record<string, (props: Record<string, any>) => VNode[]>
  }
}

export {}
