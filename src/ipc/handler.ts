import { BrowserWindow, ipcMain, session } from "electron";
import { languageType } from "../types";
import { ConfigManager } from "../views/settings/config/ConfigManager";
import { BackgroundManager } from "../views/settings/config/BackgroundManager";
import type { AppConfig, BackgroundConfig } from "../../interface";
import { updateMenu, createContextMenu } from "../menu/menu";
import { runNetdiskJar, stopNetdiskJar } from "../utils/background"
import logger from "../utils/log";

interface OpenVpnAuthPayload {
  url: string;
  cookieNames?: string[];
}

interface OpenVpnAuthResult {
  success: boolean;
  cookie?: string;
  cookies?: Record<string, string>;
  currentUrl?: string;
  error?: string;
}

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
      themeMode: String(config?.themeMode || "light"),
    } as AppConfig;
    // 检查语言是否改变
    const currentConfig = await configManager.load();
    const languageChanged = currentConfig.language !== cleanConfig.language;
    
    const updateConfig = await configManager.save(cleanConfig);
    
    // 如果语言改变，更新菜单
    if (languageChanged) {
      if (!mainWindow || mainWindow.isDestroyed()) {
        console.error("Window not available for menu update");
      } else {
        // await updateMenu(mainWindow);
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

  ipcMain.handle("open-vpn-auth-window", async (event, payload: OpenVpnAuthPayload): Promise<OpenVpnAuthResult> => {
    const rawUrl = (payload?.url || "").trim();
    if (!rawUrl) {
      return { success: false, error: "VPN 地址不能为空" };
    }

    let target: URL;
    try {
      target = new URL(rawUrl);
    } catch {
      return { success: false, error: "VPN 地址格式不正确" };
    }

    const cookieNames = new Set(
      (payload?.cookieNames || [])
        .map((name) => name.trim())
        .filter(Boolean),
    );

    return await new Promise((resolve) => {
      const partition = `vpn-auth-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const authSession = session.fromPartition(partition);
      const authWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
        modal: Boolean(mainWindow && !mainWindow.isDestroyed()),
        autoHideMenuBar: true,
        webPreferences: {
          partition,
          sandbox: true,
          contextIsolation: true,
          nodeIntegration: false,
        },
      });

      let finished = false;
      let isClosingFromFinish = false;

      const finish = (result: OpenVpnAuthResult) => {
        if (finished) return;
        finished = true;
        if (!authWindow.isDestroyed()) {
          isClosingFromFinish = true;
          authWindow.close();
        }
        resolve(result);
      };

      const tryCollectCookie = async () => {
        if (finished || authWindow.isDestroyed()) return;
        try {
          const cookieList = await authSession.cookies.get({
            url: `${target.protocol}//${target.host}`,
          });
          const filtered = cookieList.filter((item) => cookieNames.size === 0 || cookieNames.has(item.name));
          if (!filtered.length) return;
          const cookie = filtered.map((item) => `${item.name}=${item.value}`).join("; ");
          const cookieMap: Record<string, string> = {};
          filtered.forEach((item) => {
            cookieMap[item.name] = item.value;
          });
          finish({
            success: true,
            cookie,
            cookies: cookieMap,
            currentUrl: authWindow.webContents.getURL(),
          });
        } catch (error) {
          logger.error("读取 VPN Cookie 失败:", error);
        }
      };

      authWindow.on("close", (closeEvent) => {
        if (finished || isClosingFromFinish) return;
        closeEvent.preventDefault();
        void (async () => {
          await tryCollectCookie();
          if (!finished) {
            finish({
              success: false,
              currentUrl: authWindow.webContents.getURL(),
              error: "窗口已关闭，未获取到 Cookie",
            });
          }
        })();
      });

      authWindow.on("closed", () => {
        if (!finished) {
          resolve({
            success: false,
            error: "窗口已关闭，未获取到 Cookie",
          });
        }
      });

      void (async () => {
        try {
          // 使用独立会话并清理同域数据，避免命中“窗口已被占用”的历史状态
          await authSession.clearStorageData({
            origin: `${target.protocol}//${target.host}`,
          });
          await authSession.clearCache();
          await authWindow.loadURL(rawUrl);
        } catch (error) {
          finish({
            success: false,
            error: `打开登录页失败: ${String(error)}`,
          });
        }
      })();
    });
  });

}

