import type { BackgroundConfig } from "../../interface";
import { ref, type Ref } from "vue";
import { message } from "ant-design-vue";
import statusApi from "../apis/status";

/**
 * 加载后台配置
 * 如果传入 targetConfig，则会把加载结果写入该 ref；否则返回一个新的 ref
 */
export const useLoadBackgroundConfig = async (
  targetConfig?: Ref<BackgroundConfig>
) => {
  const config =
    targetConfig ||
    ref<BackgroundConfig>({
      baseUrl: "http://localhost:9090",
      port: 9090,
      autoStart: false,
    });

  try {
    const savedConfig = await window.electronAPI.getBackgroundConfig();

    config.value = {
      baseUrl: savedConfig.baseUrl || "http://localhost:9090",
      port: savedConfig.port || 9090,
      autoStart:
        typeof savedConfig.autoStart === "boolean"
          ? savedConfig.autoStart
          : false,
    };

    // 更新全局 API base URL
    if (typeof window !== "undefined") {
      (window as Window & { __API_BASE_URL__?: string }).__API_BASE_URL__ =
        config.value.baseUrl;
    }
  } catch (error) {
    console.error("加载配置失败:", error);
    message.error("加载配置失败");
  }

  return config;
};

/**
 * 后台服务状态枚举
 */
export type ServiceStatus = "running" | "stopped" | "checking";

/**
 * 创建一个检查后台服务状态的 hook
 * 内部维护 serviceStatus / isChecking / checkingStatus 三个状态
 */
export const useCheckBackgroundStatus = () => {
  const serviceStatus = ref<ServiceStatus>("checking");
  const isChecking = ref(false);
  const checkingStatus = ref(false);

  const checkServiceStatus = async (showMessage = true) => {
    isChecking.value = true;
    if (checkingStatus) {
      checkingStatus.value = true;
    }
    serviceStatus.value = "checking";

    try {
      const result = await statusApi.healthy();
      console.log("checkServiceStatus result", result);
      serviceStatus.value = "running";
      if (showMessage) {
        message.success("服务运行正常");
      }
    } catch (error) {
      console.error("检查服务状态失败:", error);
      serviceStatus.value = "stopped";
      if (showMessage) {
        message.warning("服务未运行或无法连接");
      }
    } finally {
      isChecking.value = false;
      checkingStatus.value = false;
    }
  };

  return {
    serviceStatus,
    isChecking,
    checkingStatus,
    checkServiceStatus,
  };
};