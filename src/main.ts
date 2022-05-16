import { createApp } from "vue";
import "tailwindcss/tailwind.css";
import pinia from "./store";
import App from "./App.vue";

createApp(App).use(pinia).mount("#app");
