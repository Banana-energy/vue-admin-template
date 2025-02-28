import { setupAuth, setupI18n, setupPinia, setupRouter, setupVxeTable, } from "@/setup"
import { ElLoading, } from "element-plus"
import { createApp, } from "vue"
import App from "./App.vue"
import "virtual:uno.css"
import "@/styles/index.scss"
import "animate.css"

function setup() {
  const app = createApp(App,)
  setupPinia(app,)
  setupI18n(app,)
  setupVxeTable(app,)
  setupRouter(app,)
  setupAuth(app,)

  app
    .use(ElLoading,)
    .mount("#app",)
  return app
}

setup()
