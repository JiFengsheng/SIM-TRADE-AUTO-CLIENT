import { app } from "electron";
import path from "path";
import fs from "fs/promises";
import type { AppConfig } from "../../../../interface";

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
 * 应用配置管理器
 * 负责配置文件的创建、初始化、加载和保存
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private configPath: string;
  private defaultConfig: AppConfig = {
    language: "zh",
    fontSize: 14,
    themeColor: "#1677ff",
    themeMode: 'light'
  };

  private constructor() {
    const userDataPath = app.getPath("userData");
    // console.log("userDataPath", userDataPath);
    // this.configPath = path.join(userDataPath, "config.json");
    console.log("EXTRA_HOME", EXTRA_HOME);
    this.configPath = path.join(EXTRA_HOME,"config", "config.json");
  }

  /**
   * 获取 ConfigManager 单例实例
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 获取配置文件路径
   */
  public getConfigPath(): string {
    return this.configPath;
  }

  /**
   * 获取默认配置
   */
  public getDefaultConfig(): AppConfig {
    return { ...this.defaultConfig };
  }

  /**
   * 初始化配置文件
   * 如果配置文件不存在，则创建默认配置文件
   */
  public async initialize(): Promise<AppConfig> {
    try {
      // 尝试读取现有配置
      const config = await this.load();
      return config;
    } catch (error) {
      // 如果文件不存在或读取失败，创建默认配置
      console.log("配置文件不存在，创建默认配置");
      await this.save(this.defaultConfig);
      return this.getDefaultConfig();
    }
  }

  /**
   * 加载配置文件
   * @returns 配置对象
   * @throws 如果文件不存在或读取失败
   */
  public async load(): Promise<AppConfig> {
    try {
      const data = await fs.readFile(this.configPath, "utf-8");
      const config = JSON.parse(data) as AppConfig;
      
      // 验证配置完整性，如果缺少字段则使用默认值
      return {
        language: config.language || this.defaultConfig.language,
        fontSize: config.fontSize || this.defaultConfig.fontSize,
        themeColor: config.themeColor || this.defaultConfig.themeColor,
        themeMode: config.themeMode || this.defaultConfig.themeMode,
      };
    } catch (error) {
      console.error("加载配置文件失败:", error);
      throw error;
    }
  }

  /**
   * 保存配置文件
   * @param config 要保存的配置对象
   * @returns 保存结果
   */
  public async save(config: AppConfig): Promise<{ success: boolean; error?: string }> {
    try {
      // 确保配置目录存在
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });

      // 保存配置
      await fs.writeFile(
        this.configPath,
        JSON.stringify(config, null, 2),
        "utf-8"
      );
      return { success: true };
    } catch (error) {
      console.error("保存配置文件失败:", error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 更新配置（部分更新）
   * @param partialConfig 部分配置对象
   * @returns 更新后的完整配置
   */
  public async update(partialConfig: Partial<AppConfig>): Promise<AppConfig> {
    const currentConfig = await this.load();
    const updatedConfig = { ...currentConfig, ...partialConfig };
    await this.save(updatedConfig);
    return updatedConfig;
  }
}

