/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import './assets/styles/main.css'

import {Icon} from '@iconify/vue'

import * as Icons from "@ant-design/icons-vue";
import {router } from './router/router';
import 'highlight.js/styles/github-dark.min.css'
import type { Component } from 'vue'
import { i18n, setLocale } from './i18n';


const app = createApp(App);
app.use(Antd);
app.use(i18n)


const IconData: Record<string, Component> = Icons
console.log('IconData', IconData)
Object.keys(IconData).forEach((key: string) => {
    app.component(key, IconData[key]);
})
app.component('Icon', Icon);


app.use(router);

const pinia = createPinia()
app.use(pinia)


app.mount('#app');