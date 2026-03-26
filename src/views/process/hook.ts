import { ref } from "vue";
import processStepApi from "../../apis/processStep";
import type { FulfillmentProcessStep, FulfillmentProcessStepListReqVo, IPage } from "../../apis/types";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";

/**
 * 获取流程步骤列表（分页）
 */
export const useProcessStepList = () => {
  const loading = ref(false);
  const dataSource = ref<FulfillmentProcessStep[]>([]);
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const searchKeyword = ref("");
  const tradeFilter = ref<string | undefined>('CIF');
  const paymentFilter = ref<string | undefined>('L/C');

  const fetchList = async () => {
    loading.value = true;
    try {
      const params: FulfillmentProcessStepListReqVo = {
        current: current.value,
        size: pageSize.value,
        search: searchKeyword.value || undefined,
        trade: tradeFilter.value,
        payment: paymentFilter.value,
      };
      const res = await processStepApi.list(params);
      const pageData = res as IPage<FulfillmentProcessStep>;
      dataSource.value = pageData.records || [];
      total.value = pageData.total || 0;
      current.value = pageData.current || 1;
    } catch (error) {
      console.error("获取流程步骤列表失败", error);
      dataSource.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = (value?: string) => {
    searchKeyword.value = value || "";
    current.value = 1;
    fetchList();
  };

  const handleTradeChange = (value?: string) => {
    tradeFilter.value = value;
    current.value = 1;
    fetchList();
  };

  const handlePaymentChange = (value?: string) => {
    paymentFilter.value = value;
    current.value = 1;
    fetchList();
  };

  const handlePageChange = (page: number, size?: number) => {
    console.log("page", page);
    console.log("size", size);
    current.value = page;
    if (size) {
      pageSize.value = size;
    }
    fetchList();
  };

  return {
    loading,
    dataSource,
    current,
    pageSize,
    total,
    searchKeyword,
    tradeFilter,
    paymentFilter,
    fetchList,
    handleSearch,
    handleTradeChange,
    handlePaymentChange,
    handlePageChange,
  };
};

/**
 * 获取流程步骤详情
 */
export const useGetProcessStep = () => {
  const loading = ref(false);
  const stepDetail = ref<FulfillmentProcessStep | null>(null);

  const getStepById = async (id: string) => {
    if (!id) return;
    loading.value = true;
    try {
      const res = await processStepApi.getById(id);
      stepDetail.value = res as FulfillmentProcessStep;
      return stepDetail.value;
    } catch (error) {
      console.error("获取流程步骤详情失败", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    stepDetail,
    getStepById,
  };
};

/**
 * 更新流程步骤
 */
export const useUpdateProcessStep = (options?: { onSuccess?: () => void }) => {
  const loading = ref(false);

  const updateStep = async (id: string, data: Partial<FulfillmentProcessStep>) => {
    if (loading.value) return;
    loading.value = true;
    try {
      await processStepApi.update(id, data as FulfillmentProcessStep);
      options?.onSuccess?.();
    } catch (error) {
      console.error("更新流程步骤失败", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    updateStep,
  };
};


export const useDelayProcessStep = () => {
  const { t } = useI18n();

  const loading = ref(false);
  const delayProcessStep = async (data: FulfillmentProcessStep) => {
    if (loading.value) return;
    loading.value = true;
    try {
      console.log("data", data);
      const res = await processStepApi.batchUpdate(data);
      console.log("res", res);
      message.success(t("process.msgDelaySuccess"));
      return true;
    }catch(error) {
      console.error("延迟流程步骤失败", error);
      message.error(t("process.msgDelayFail"));
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    loading,
    delayProcessStep,
  };
  
}