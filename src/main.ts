import { createApp } from "vue";
import "tailwindcss/tailwind.css";
import pinia from "@/store";
import router from "@/router";
import App from "./App.vue";
import * as Icons from "@element-plus/icons-vue";

import "@/styles/index.scss";

const app = createApp(App);

// 注册element Icons组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(pinia).use(router).mount("#app");
