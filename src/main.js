import { createApp } from "vue";
import pinia from "@/store";
import router from "@/router";
import "virtual:windi.css";
import "@/styles/index.scss";
import "element-plus/es/components/message/style/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia).use(router).mount("#app");
