import { createApp } from "vue";
import "virtual:windi.css";
import pinia from "@/store";
import router from "@/router";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/styles/index.scss";
import "element-plus/es/components/message/style/index";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia).use(router).mount("#app");
