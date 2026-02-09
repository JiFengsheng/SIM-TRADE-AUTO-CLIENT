import log from "electron-log";
import path from "path";
import { app } from "electron";

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

/**
 * 初始化日志配置
 */
function initLogConfig() {
  // 设置日志级别
  log.transports.file.level = "info";
  log.transports.console.level = "debug";

  // 设置日志文件路径
  log.transports.file.resolvePathFn = () => {
    return path.join(EXTRA_HOME, "main.log");
  };

  // 设置日志文件最大大小（10MB）
  log.transports.file.maxSize = 10 * 1024 * 1024;

  // 设置日志格式
  log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
}

// 初始化配置
initLogConfig();

/**
 * 日志工具类
 * 提供便捷的日志输出方法
 */
class Logger {
  /**
   * 记录错误日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  error(message: string, ...args: unknown[]): void {
    log.error(message, ...args);
  }

  /**
   * 记录警告日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  warn(message: string, ...args: unknown[]): void {
    log.warn(message, ...args);
  }

  /**
   * 记录信息日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  info(message: string, ...args: unknown[]): void {
    log.info(message, ...args);
  }

  /**
   * 记录详细日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  verbose(message: string, ...args: unknown[]): void {
    log.verbose(message, ...args);
  }

  /**
   * 记录调试日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  debug(message: string, ...args: unknown[]): void {
    log.debug(message, ...args);
  }

  /**
   * 记录所有日志
   * @param message 日志消息
   * @param ...args 额外的参数
   */
  silly(message: string, ...args: unknown[]): void {
    log.silly(message, ...args);
  }

  /**
   * 获取日志文件路径
   * @returns 日志文件的完整路径
   */
  getLogPath(): string {
    return log.transports.file.getFile().path;
  }

  /**
   * 清空日志文件
   * @returns 是否成功清空
   */
  clearLog(): boolean {
    return log.transports.file.getFile().clear();
  }
}

// 创建并导出单例实例
const logger = new Logger();

// 导出单例实例和类
export default logger;
export { Logger };

// 也可以直接导出便捷方法
export const logError = logger.error.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logVerbose = logger.verbose.bind(logger);
export const logDebug = logger.debug.bind(logger);
export const logSilly = logger.silly.bind(logger);
