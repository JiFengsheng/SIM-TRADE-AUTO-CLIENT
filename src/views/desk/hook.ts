import { computed, ref } from "vue";
import contractApi from "../../apis/contract";
import processStepApi from "../../apis/processStep";
import harborApi from "../../apis/harbor";
import contractTaskHistoryApi from "../../apis/contractTaskHistory";
import type {
  ContractInfo,
  ContractTaskHistory,
  ExecuteContractReqVo,
  FulfillmentProcessStep,
  FulfillmentProcessStepResponse,
  HarborInfo,
} from "../../apis/types";
import { message } from 'ant-design-vue';
import { unwrapApiData } from "../../utils/request";

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




/**
 * 执行合同
 */
export const useExecuteContract = (options?: { onSuccess?: () => void }) => {
  const loading = ref(false);

  const executeContract = async (payload: ExecuteContractReqVo & { contractId?: string }) => {
    if (loading.value) return;
    loading.value = true;
    try {
      await contractApi.executeContract(payload);
      options?.onSuccess?.();
    } catch (error) {
      console.error("执行合同失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    executeContract,
  };
};

/**
 * 停止合同
 */
export const useStopContract = (options?: { onSuccess?: () => void }) => {
  const loading = ref(false);

  const stopContract = async (contractId?: string, wait = true) => {
    if (loading.value) return;
    loading.value = true;
    try {
      await contractApi.stopContract(contractId, wait);
      options?.onSuccess?.();
    } catch (error) {
      console.error("停止合同失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    stopContract,
  };
};

/**
 * 执行单个步骤
 */
export const useExecuteStep = (options?: { onSuccess?: () => void }) => {
  const loading = ref(false);

  const executeStep = async (contractId?: string, stepCode?: string) => {
    if (loading.value) return;
    loading.value = true;
    try {
      await contractApi.executeStep(contractId, stepCode);
      options?.onSuccess?.();
    } catch (error) {
      console.error("执行步骤失败", error);
      message.error("执行步骤失败:"+error.message);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    executeStep,
  };
};

/**
 * 根据流程编码获取所有流程步骤
 */
export const useListProcessStepsByCode = () => {
  const loading = ref(false);
  const steps = ref<FulfillmentProcessStep[]>([]);

  const listByProcessCode = async (processCode?: string) => {
    if (!processCode) return;
    loading.value = true;
    try {
      const res = await processStepApi.listByProcessCode(processCode);
      const data = Array.isArray(res) ? res : ((res as any)?.data ?? []);
      steps.value = data as FulfillmentProcessStep[];
    } catch (error) {
      console.error("获取流程步骤失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    steps,
    listByProcessCode,
  };
};

/**
 * 获取已执行的流程步骤
 */
export const useGetDoneProcessSteps = () => {
  const loading = ref(false);
  const doneSteps = ref<FulfillmentProcessStepResponse[]>([]);

  const getDoneSteps = async (processCode?: string, contractId?: string) => {
    if (!processCode || !contractId) return;
    loading.value = true;
    try {
      const res = await processStepApi.getDoneProcessSteps(processCode, contractId);
      const data = Array.isArray(res) ? res : ((res as any)?.data ?? []);
      doneSteps.value = data as FulfillmentProcessStepResponse[];
    } catch (error) {
      console.error("获取已执行流程步骤失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    doneSteps,
    getDoneSteps,
  };
};

/**
 * 获取未执行的流程步骤
 */
export const useGetUndoProcessSteps = () => {
  const loading = ref(false);
  const undoSteps = ref<FulfillmentProcessStep[]>([]);

  const getUndoSteps = async (processCode?: string, contractId?: string) => {
    if (!processCode || !contractId) return;
    loading.value = true;
    try {
      const res = await processStepApi.getUndoProcessSteps(processCode, contractId);
      const data = Array.isArray(res) ? res : ((res as any)?.data ?? []);
      undoSteps.value = data as FulfillmentProcessStep[];
    } catch (error) {
      console.error("获取未执行流程步骤失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    undoSteps,
    getUndoSteps,
  };
};

/**
 * 合同执行日志（基于 getLatestHistory 轮询）
 */
export const useLatestHistory = () => {
  const loading = ref(false);
  const logs = ref<ContractTaskHistory[]>([]);

  const fetchLatest = async (contractId?: string) => {
    if (!contractId) return;
    loading.value = true;
    try {
      const res = await contractTaskHistoryApi.getLatestHistory(contractId);
      const data = Array.isArray(res) ? res : ((res as any)?.data ?? []);
      logs.value = data as ContractTaskHistory[];
    } catch (error) {
      console.error("获取合同执行日志失败", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    logs,
    fetchLatest
  };
};

