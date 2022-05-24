import { createApp } from "vue";
import "tailwindcss/tailwind.css";
import pinia from "@/store";
import router from "@/router";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/styles/index.scss";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia).use(router).mount("#app");
