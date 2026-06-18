// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import type { AppConfig, BackgroundConfig, OpenVpnAuthPayload } from "../interface";

contextBridge.exposeInMainWorld("electronAPI", {

  copyImageToUserDir: (content: string) => ipcRenderer.invoke('copy-image-to-user-dir', content),
  getAppConfig: () => ipcRenderer.invoke('get-app-config'),
  saveAppConfig: (config: AppConfig) => 
    ipcRenderer.invoke('save-app-config', config),
  updateMenu: (language?: string) => ipcRenderer.invoke('update-menu', language),
  showContextMenu: (conversationId: number) => ipcRenderer.invoke('show-context-menu', conversationId),

  getBackgroundConfig: () => ipcRenderer.invoke('get-background-config'),
  saveBackgroundConfig: (config: BackgroundConfig) => 
    ipcRenderer.invoke('save-background-config', config),

  runJar: (port?: number) => ipcRenderer.invoke('run-jar', port),
  stopJar: () => ipcRenderer.invoke('stop-jar'),
  openVpnAuthWindow: (payload: OpenVpnAuthPayload) => ipcRenderer.invoke('open-vpn-auth-window', payload)

});