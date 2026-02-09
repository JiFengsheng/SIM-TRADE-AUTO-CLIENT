import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { languageType } from "../types";
import { generateUUID } from "../utils/uuid";
import { ConfigManager } from "../views/settings/config/ConfigManager";
import { BackgroundManager } from "../views/settings/config/BackgroundManager";
import type { AppConfig, BackgroundConfig } from "../../interface";
import { updateMenu, createContextMenu } from "../menu/menu";
import { runNetdiskJar, stopNetdiskJar } from "../utils/background"
import logger from "../utils/log";

/**
 * 注册所有 IPC handlers
 * @param mainWindow 主窗口实例
 * @param currentLanguage 当前语言（引用，用于更新）
 */
export function registerIpcHandlers(
  mainWindow: BrowserWindow,
  currentLanguage: { value: languageType | undefined }
) {
  // 更新菜单的 IPC handler
  ipcMain.handle("update-menu", async (event, language?: string) => {
    console.log("update-menu called, mainWindow:", mainWindow ? "exists" : "null", "language:", language);
    if (!mainWindow || mainWindow.isDestroyed()) {
      console.error("Window not available for menu update");
      return { success: false, error: "Window not available" };
    }
    console.log("Updating menu with language:", language || "from config");
    await updateMenu(mainWindow, language);
    currentLanguage.value = language as languageType | undefined;
    await createContextMenu(mainWindow, undefined, currentLanguage.value);
    console.log("Menu updated successfully");
    return { success: true };
  });

  // 显示上下文菜单的 IPC handler
  ipcMain.handle("show-context-menu", async (event, conversationId: number) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      console.error("Window not available for context menu");
      return { success: false, error: "Window not available" };
    }
    await createContextMenu(mainWindow, conversationId, currentLanguage.value);
    return { success: true };
  });

  // 读取应用配置
  ipcMain.handle("get-app-config", async () => {
    const configManager = ConfigManager.getInstance();
    try {
      return await configManager.load();
    } catch (error) {
      // 如果加载失败，返回默认配置
      console.error("加载配置失败，使用默认配置:", error);
      return configManager.getDefaultConfig();
    }
  });

  // 保存应用配置
  ipcMain.handle("save-app-config", async (event, config) => {
    const configManager = ConfigManager.getInstance();
    // 确保配置对象是可序列化的纯对象
    const cleanConfig: AppConfig = {
      language: String(config?.language || "zh"),
      fontSize: Number(config?.fontSize || 14),
      themeColor: String(config?.themeColor || "#ff17a9"),
    };
    // 检查语言是否改变
    const currentConfig = await configManager.load();
    const languageChanged = currentConfig.language !== cleanConfig.language;
    
    const updateConfig = await configManager.save(cleanConfig);
    
    // 如果语言改变，更新菜单
    if (languageChanged) {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error("Window not available for menu update");
      } else {
        await updateMenu(mainWindow);
      }
    }
    
    return updateConfig;
  });

  // 启动jar
  ipcMain.handle("run-jar", async (event, port?: number) => {
    try {
      logger.info("启动jar，端口:", port);
      runNetdiskJar(port);
      return { success: true };
    } catch (error) {
      console.log("启动jar失败：", error);
      logger.error("启动jar失败：", error);
      return { success: false, error: String(error) };
    }
  });

  // 关闭jar
  ipcMain.handle("stop-jar", async () => {
    try {
      await stopNetdiskJar();
      return { success: true };
    } catch (error) {
      console.log("关闭jar失败：", error);
      return { success: false, error: String(error) };
    }
  });

  // 读取后台配置
  ipcMain.handle("get-background-config", async () => {
    const backgroundManager = BackgroundManager.getInstance();
    try {
      return await backgroundManager.load();
    } catch (error) {
      // 如果加载失败，返回默认配置
      console.error("加载后台配置失败，使用默认配置:", error);
      return backgroundManager.getDefaultConfig();
    }
  });

  // 保存后台配置
  ipcMain.handle("save-background-config", async (event, config) => {
    const backgroundManager = BackgroundManager.getInstance();
    // 确保配置对象是可序列化的纯对象
    const cleanConfig: BackgroundConfig = {
      baseUrl: String(config?.baseUrl || "http://localhost:9090"),
      port: Number(config?.port || 9090),
      autoStart: Boolean(config?.autoStart || false),
    };
    
    const updateConfig = await backgroundManager.save(cleanConfig);
    return updateConfig;
  });

}

