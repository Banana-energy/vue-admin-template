import type { App, } from "vue"
import { createPinia, } from "pinia"

const pinia = createPinia()

export function setupPinia(app: App<Element>,) {
  app.use(pinia,)
}

export { pinia, }
