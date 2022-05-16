import { createApp } from "vue";
import "tailwindcss/tailwind.css";
import pinia from "@/store";
import router from "@/router";
import App from "./App.vue";

createApp(App).use(pinia).use(router).mount("#app");
