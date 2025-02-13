import type { IconTypes, } from "@/components/Icon"
import type { VNode, } from "vue"
import { Icon, } from "@/components/Icon"
import { h, } from "vue"

export function useIcon(props: IconTypes,): VNode {
  return h(Icon, props,)
}
