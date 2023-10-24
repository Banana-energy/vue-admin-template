import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    build: {
      target: 'esnext',
      sourcemap: !isProd,
    },
    server: {
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      Vue(),
      AutoImport({
        dts: false,
        imports: [ 'vue', 'vue-router', 'pinia', '@vueuse/core' ],
        resolvers: [ ElementPlusResolver({
          exclude: /ElButton/
        }) ],
        eslintrc: {
          enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: './.eslintrc-auto-import.json', // 生成json文件
          globalsPropValue: true,
        },
      }),
      Components({
        dts: false,
        resolvers: [ ElementPlusResolver({
          exclude: /ElButton/
        }), IconsResolver() ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
  };
});
