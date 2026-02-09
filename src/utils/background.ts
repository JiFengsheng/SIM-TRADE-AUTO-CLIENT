import os from "os"
import path from "path";
import nodeCmd from "node-cmd"
import { app } from "electron";
import logger from "./log";
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


const serverPort=process.env.VUE_APP_PROXY_PORT
console.log(`EXTRA_HOME: ${EXTRA_HOME}`)

/**
 * 启动 Java Spring Boot 服务
 * @param port 服务端口号，如果不提供则使用默认端口
 */
export function runNetdiskJar(port?: number) {
  const targetPort = port || serverPort;
  console.log("os.type",os.type())
  console.log("启动服务，端口:", targetPort);
  logger.info("启动服务，端口:", targetPort);
  let runJarCmd;
  if(os.type().toLowerCase().includes("windows")){
    runJarCmd = `${EXTRA_HOME}/start.bat ${targetPort}`;
  }else{
    runJarCmd = `${EXTRA_HOME}/start.sh ${targetPort}`;
  }
  logger.info("启动服务命令:", runJarCmd);
  nodeCmd.run(runJarCmd, function(err: Error | null) {
    if (err) {
      console.log("启动服务失败:", err);
      logger.error("启动服务失败:", err);
    } else {
      console.log("服务启动命令已执行");
      logger.info("服务启动命令已执行");
    }
  });
}

export function stopNetdiskJar() {
  return new Promise((resolve) => {
    let stopJarPath;
    console.log("stop os.type",os.type())
    if(os.type().toLowerCase().includes("windows")){
      stopJarPath = `${EXTRA_HOME}/stop.bat`;
    }else{
      stopJarPath = `${EXTRA_HOME}/stop.sh`;
    }
    nodeCmd.run(stopJarPath, function(err: Error | null) {
      if (err) {
        console.log("stop Netdisk err:", err);
        logger.error("停止服务失败:", err);
      } else {
        logger.info("服务停止命令已执行");
      }
      resolve(true);
    });
  });
}