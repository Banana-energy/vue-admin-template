import { createApp } from 'vue';
import pinia from '@/store';
import router from '@/router';
import '@/styles/index.scss';
import 'element-plus/es/components/message/style/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import ElButton from '@/components/Button/Button.vue';

const app = createApp(App);
for (const [ key, component ] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component('ElButton', ElButton).use(pinia).use(router).mount('#app');
