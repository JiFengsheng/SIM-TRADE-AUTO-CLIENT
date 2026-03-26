import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { ConfigManager } from './views/settings/config/ConfigManager';
import { registerIpcHandlers } from './ipc/handler';
import { languageType } from './types';
import fs from "fs";
import { runNetdiskJar, stopNetdiskJar } from "./utils/background"
import { BackgroundManager } from './views/settings/config/BackgroundManager';
import axios from 'axios';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
// 当前语言状态
const currentLanguage = { value: undefined as languageType | undefined };

// 获取 extra 目录路径
// 在打包后的应用中：
//   - Windows: resources 目录在应用根目录下（与 exe 同级）
//   - macOS: 使用 process.resourcesPath
// 在开发环境中，使用 __dirname 相对路径
function getExtraHome(): string {
  // 使用 app.isPackaged 判断是否为打包后的应用
  if (!app.isPackaged) {
    // 开发环境：从 __dirname 向上找到项目根目录
    // __dirname 在开发时指向 .vite/build/，需要向上两级到项目根目录
    return path.join(__dirname, "../../extra");
  } else if (process.resourcesPath) {
    // macOS 或 Linux 打包后
    return path.join(process.resourcesPath, "extra");
  } else {
    // Windows 打包后：execPath 指向 exe 文件，resources 目录在 exe 同级
    const appDir = path.dirname(process.execPath);
    return path.join(appDir, "resources", "extra");
  }
}
const EXTRA_HOME = getExtraHome();
const envJson = fs.readFileSync(`${EXTRA_HOME}/env.json`,"utf-8");
const envConfig = JSON.parse(envJson);
const serverPort=envConfig.port||process.env.VUE_APP_PROXY_PORT
console.log(`EXTRA_HOME: ${EXTRA_HOME}`)
const createWindow = async () => {
  // Create the browser window.

  // 初始化配置管理器
  const configManager = ConfigManager.getInstance();
  await configManager.initialize();
  const backgroundManager = BackgroundManager.getInstance();
  const backgroundConfig = await backgroundManager.initialize();
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // 隐藏菜单栏
  Menu.setApplicationMenu(null);
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }


  // 注册所有 IPC handlers
  registerIpcHandlers(mainWindow, currentLanguage);

  // 启动后端服务
  if(backgroundConfig.autoStart){
    runNetdiskJar(backgroundConfig.port);
  }

  // Open the DevTools.
  if(!app.isPackaged){
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
     await createWindow();
  }
});

const shutdownBackground = async()=>{
  // 获取后台服务配置
  const backgroundManager = BackgroundManager.getInstance();
  const backgroundConfig = await backgroundManager.load();
  if(backgroundConfig.autoStart){
    console.log('应用关闭，正在停止后端服务...');
    // 调用 shutdown 接口关闭后端服务
    try {
      const shutdownUrl = `${backgroundConfig.baseUrl}/sim-trade/shutdown`;
      console.log(`正在调用 shutdown 接口: ${shutdownUrl}`);
      await axios.get(shutdownUrl, { timeout: 5000 });
      console.log('shutdown 接口调用成功');
    } catch (error) {
      // 如果 shutdown 接口调用失败，记录日志但不阻止退出
      console.warn('调用 shutdown 接口失败，继续执行停止操作:', error);
    }

    console.log('后端服务已停止');
  }
  
}


// 应用关闭前执行清理操作
app.on('before-quit', async (event) => {
  // 阻止默认退出行为，等待清理完成
  event.preventDefault();
  try {
    await shutdownBackground();
  } catch (error) {
    console.error('停止后端服务时出错:', error);
  } finally {
    // 清理完成后退出应用
    app.exit(0);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
