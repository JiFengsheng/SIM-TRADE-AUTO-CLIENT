import { ref, computed } from "vue";
import contractApi from "../../apis/contract";
import type { ContractInfo, ContractInfoListVo, IPage } from "../../apis/types";

/**
 * 获取合同历史记录列表（分页）
 */
export const useContractHistoryList = () => {
  const loading = ref(false);
  const dataSource = ref<ContractInfo[]>([]);
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const searchKeyword = ref("");

  const fetchList = async () => {
    loading.value = true;
    try {
      const params: ContractInfoListVo = {
        current: current.value,
        size: pageSize.value,
        search: searchKeyword.value || undefined,
      };
      const res = await contractApi.list(params);
      const pageData = res as IPage<ContractInfo>;
      dataSource.value = pageData.records || [];
      total.value = pageData.total || 0;
      current.value = pageData.current || 1;
    } catch (error) {
      console.error("获取合同历史记录失败", error);
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
    fetchList,
    handleSearch,
    handlePageChange,
  };
};
