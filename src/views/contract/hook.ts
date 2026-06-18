import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import contractApi from "../../apis/contract";
import processStepApi from "../../apis/processStep";
import contractTaskHistoryApi from "../../apis/contractTaskHistory";
import type {
  ContractInfo,
  ExecuteContractReqVo,
  FulfillmentProcessStep,
  FulfillmentProcessStepResponse,
  ContractTaskHistory,
  CrawlRateRespVo,
  HarborInfo,
  ListInPortReqVo,
} from "../../apis/types";
import businessConfigApi from "../../apis/businessConfig";
import harborApi from "../../apis/harbor";
import { message } from "ant-design-vue";
import { GetCrawlRate } from "../../apis/types";

// request.ts 的类型定义里 get/post 返回 Promise<T | ApiResponse<T>>
// 这里统一做一次解包，避免各处赋值时报类型错误
const unwrapApiData = <T>(res: unknown): T => {
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

/**
 * 获取当前执行中的合同信息
 */
export const useGetCurrentInfo = () => {
  const loading = ref(false);
  const currentInfo = ref<ContractInfo>({});

  const getCurrentInfo = async () => {
    loading.value = true;
    try {
      const res = await contractApi.getCurrentInfo();
      currentInfo.value = res as ContractInfo;
    } catch (error) {
      console.error("获取当前合同信息失败", error);
    } finally {
      loading.value = false;
    }
  };

  const executeStatus = computed(() => currentInfo.value.executeStatus || "TODO");

  return {
    getCurrentInfo,
    loading,
    currentInfo,
    executeStatus,
  };
};
export const useListHarbors = () => {
  const loading = ref(false);
  const harbors = ref<HarborInfo[]>([]);
  const engToChn = ref<Record<string, string>>({});
  const chnToEng = ref<Record<string, string>>({});
  const fetchHarbors = async (country?: string,baseUrl?: string,vpnCookies?: string,exporterAccount?: string,exporterPassword?: string) => {
    loading.value = true;
    try {
      const res = unwrapApiData<HarborInfo[]>(await harborApi.listByCountry({ country,baseUrl,vpnCookies,exporterAccount,exporterPassword }));
      harbors.value = res as HarborInfo[];
      engToChn.value = res.reduce((acc, harbor) => {
        acc[harbor.countryEnglish] = harbor.countryChinese;
        acc[harbor.harborPortEnglish] = harbor.harborPortChinese;
        return acc;
      }, {} as Record<string, string>);
      chnToEng.value = res.reduce((acc, harbor) => {
        acc[harbor.harborPortChinese] = harbor.harborPortEnglish;
        return acc;
      }, {} as Record<string, string>);
      engToChn.value = res.reduce((acc, harbor) => {
        acc[harbor.harborPortEnglish] = harbor.harborPortChinese;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error("获取港口信息失败", error);
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    harbors,
    engToChn,
    chnToEng,
    fetchHarbors,
  }
  
}

export const useListInPort = () => {
  const loading = ref(false);
  const inPort = ref<HarborInfo[]>([]);
  const engToChn = ref<Record<string, string>>({});
  const chnToEng = ref<Record<string, string>>({});
  const fetchInPort = async (params:ListInPortReqVo) => {
    loading.value = true;
    try {
      const res = unwrapApiData<HarborInfo[]>(await harborApi.listInPort(params));
      inPort.value = res as HarborInfo[];
      engToChn.value = res.reduce((acc, harbor) => {
        acc[harbor.harborPortEnglish] = harbor.harborPortChinese;
        return acc;
      }, {} as Record<string, string>);
      chnToEng.value = res.reduce((acc, harbor) => {
        acc[harbor.harborPortChinese] = harbor.harborPortEnglish;
        return acc;
      }, {} as Record<string, string>);
    }catch(error){
      console.error("获取国内港口信息失败", error);
    }finally{
      loading.value = false;
    }
  }
  return {
    loading,
    inPort,
    engToChn,
    chnToEng,
    fetchInPort,
  }
}

/**
 * 合同执行/停止相关 hooks
 */
export const useContractExecute = (options?: { onSuccess?: () => void }) => {
  const executing = ref(false);
  const stopping = ref(false);

  const executeContract = async (payload: ExecuteContractReqVo & { contractId?: string }) => {
    if (executing.value) return;
    executing.value = true;
    try {
      await contractApi.executeContract(payload);
      options?.onSuccess?.();
    } catch (error) {
      console.error("执行合同失败", error);
    } finally {
      executing.value = false;
    }
  };

  const stopContract = async (contractId?: string, wait = true) => {
    if (stopping.value) return;
    stopping.value = true;
    try {
      await contractApi.stopContract(contractId, wait);
      options?.onSuccess?.();
    } catch (error) {
      console.error("停止合同失败", error);
    } finally {
      stopping.value = false;
    }
  };

  return {
    executing,
    stopping,
    executeContract,
    stopContract,
  };
};

/**
 * 合同流程步骤（全部/已完成/未完成）
 */
export const useContractProcessSteps = () => {
  const loading = ref(false);
  const allSteps = ref<FulfillmentProcessStep[]>([]);
  const doneSteps = ref<FulfillmentProcessStepResponse[]>([]);
  const undoSteps = ref<FulfillmentProcessStep[]>([]);

  const listAllSteps = async (processCode?: string) => {
    if (!processCode) return;
    loading.value = true;
    try {
      const res = await processStepApi.listByProcessCode(processCode);
      allSteps.value = unwrapApiData<FulfillmentProcessStep[]>(res) || [];
    } catch (error) {
      console.error("获取流程步骤失败", error);
    } finally {
      loading.value = false;
    }
  };

  const getDoneSteps = async (processCode?: string, contractId?: string) => {
    if (!processCode || !contractId) return;
    try {
      const res = await processStepApi.getDoneProcessSteps(processCode, contractId);
      doneSteps.value = unwrapApiData<FulfillmentProcessStepResponse[]>(res) || [];
    } catch (error) {
      console.error("获取已执行流程步骤失败", error);
    }
  };

  const getUndoSteps = async (processCode?: string, contractId?: string) => {
    if (!processCode || !contractId) return;
    try {
      const res = await processStepApi.getUndoProcessSteps(processCode, contractId);
      undoSteps.value = unwrapApiData<FulfillmentProcessStep[]>(res) || [];
    } catch (error) {
      console.error("获取未执行流程步骤失败", error);
    }
  };

  return {
    loading,
    allSteps,
    doneSteps,
    undoSteps,
    listAllSteps,
    getDoneSteps,
    getUndoSteps,
  };
};

/**
 * 合同执行日志（轮询最新）
 */
export const useContractLatestLogs = (params: {
  contractIdRef: () => string | undefined;
  statusRef: () => string | undefined;
  intervalMs?: number;
}) => {
  const { contractIdRef, statusRef, intervalMs = 1500 } = params;
  const loading = ref(false);
  const logs = ref<ContractTaskHistory[]>([]);
  const timer = ref<number | null>(null);

  const clearTimer = () => {
    if (timer.value !== null) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  const fetchLatest = async () => {
    const contractId = contractIdRef();
    if (!contractId) return;
    loading.value = true;
    try {
      const res = await contractTaskHistoryApi.getLatestHistory(contractId);
      logs.value = unwrapApiData<ContractTaskHistory[]>(res) || [];
    } catch (error) {
      console.error("获取合同执行日志失败", error);
    } finally {
      loading.value = false;
    }
  };

  const start = () => {
    clearTimer();
    const status = statusRef();
    if (status !== "DOING") return;
    const contractId = contractIdRef();
    if (!contractId) return;
    // 立即拉一次
    fetchLatest();
    timer.value = window.setInterval(fetchLatest, intervalMs);
  };

  // 监听状态变化，DOING 时开始轮询，其他状态清理
  watch(
    () => statusRef(),
    (val) => {
      if (val === "DOING") {
        start();
      } else {
        clearTimer();
      }
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    clearTimer();
  });

  return {
    loading,
    logs,
    start,
    clearTimer,
  };
};

export const useGetCrawlRate = () => {
  const { t } = useI18n();
  const crawlRate = ref<CrawlRateRespVo>({});
  const loading = ref(false);
  const getCrawlRate = async (data: GetCrawlRate) => {
    loading.value = true;
    try {
      const res = await businessConfigApi.getCrawlRate(data);
      crawlRate.value = unwrapApiData<CrawlRateRespVo>(res) || {};
      message.success(t("contract.msgCrawlSuccess"));
    } catch (error) {
      console.error("获取信息失败", error);
      message.error(t("contract.msgCrawlFail"));
    } finally {
      loading.value = false;
    }
  };
  return {
    crawlRate,
    loading,
    getCrawlRate,
  };
};