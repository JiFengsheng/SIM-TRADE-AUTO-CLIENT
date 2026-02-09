"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  copyImageToUserDir: (content) => electron.ipcRenderer.invoke("copy-image-to-user-dir", content),
  getAppConfig: () => electron.ipcRenderer.invoke("get-app-config"),
  saveAppConfig: (config) => electron.ipcRenderer.invoke("save-app-config", config),
  updateMenu: (language) => electron.ipcRenderer.invoke("update-menu", language),
  showContextMenu: (conversationId) => electron.ipcRenderer.invoke("show-context-menu", conversationId),
  getBackgroundConfig: () => electron.ipcRenderer.invoke("get-background-config"),
  saveBackgroundConfig: (config) => electron.ipcRenderer.invoke("save-background-config", config),
  runJar: (port) => electron.ipcRenderer.invoke("run-jar", port),
  stopJar: () => electron.ipcRenderer.invoke("stop-jar")
});
