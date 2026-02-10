<template>
  <div class="desk-root p-4 lg:p-6 xl:p-8 space-y-4 min-h-full scrollbar-w-none">
    <!-- 合同基础信息 -->
    <a-card class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="contractLoading"
      :body-style="{ padding: '16px 20px 8px' }">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
        <div>
          <div class="text-base font-medium desk-text flex flex-wrap items-center gap-3">
            <span>当前合同：</span>
            <span class="desk-text-secondary">
              {{ currentInfo?.contractCode || '暂无正在执行的合同' }}
            </span>
            <span class="desk-text-secondary opacity-70">|</span>
            <span>状态：</span>
            <a-tag :color="statusInfo.color" class="border-0 flex items-center gap-1">
              <!-- <span class="inline-block w-2 h-2 rounded-full" :style="{ backgroundColor: statusInfo.color }" /> -->
              <span>{{ statusInfo.text }}</span>
            </a-tag>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a-space>
            <a-button class="px-5" @click="handleRefresh">刷新</a-button>
            <a-button class="px-5" @click="goToContract">
              合同管理
            </a-button>
            <a-button :type="actionButtonProps.type" :danger="actionButtonProps.danger"
              :disabled="actionButtonProps.disabled || !currentInfo?.processCode || !currentInfo?.contractCode || !currentInfo?.exportContractCode"
              :loading="executing || stopping" class="px-5" @click="handleAction">
              {{ actionButtonProps.text }}
            </a-button>
          </a-space>
        </div>
      </div>

      <a-divider class="!my-3" />

      <div class="grid md:grid-cols-3 gap-4 text-xs desk-text-secondary">
        <div class="space-y-1.5">
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">外销合同编号</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportContractCode || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">工厂合同编号</span>
            <span class="font-medium desk-text">{{ currentInfo?.innerContractCode || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">交易数量</span>
            <span class="font-medium desk-text">{{ currentInfo?.transactionVolume ?? '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">商品编号</span>
            <span class="font-medium desk-text">{{ currentInfo?.goodsNo || '-' }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">出口商报价</span>
            <span class="font-medium text-emerald-600">
              <template v-if="currentInfo?.exportPrice != null">
                {{ currentInfo.exportPrice }} {{ currentInfo.exportPriceUnit || 'USD' }}
              </template>
              <template v-else>
                -
              </template>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">供应商报价</span>
            <span class="font-medium text-amber-600">
              <template v-if="currentInfo?.supplierPrice != null">
                {{ currentInfo.supplierPrice }} RMB
              </template>
              <template v-else>
                -
              </template>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">出口城市</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportCity || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">进口城市</span>
            <span class="font-medium desk-text">{{ currentInfo?.importCity || '-' }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">出口港口</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportPort || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">进口港口</span>
            <span class="font-medium desk-text">{{ currentInfo?.importPort || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">贸易术语</span>
            <span class="font-medium desk-text">{{ currentInfo?.trade || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">结算方式</span>
            <span class="font-medium desk-text">{{ currentInfo?.payment || '-' }}</span>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 执行进度 & 日志 -->
    <div class="grid lg:grid-cols-3 gap-4">
      <a-card class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm lg:col-span-1" :loading="stepLoading"
        :body-style="{ padding: '16px 16px 12px 12px' }">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-medium desk-text">合同执行进度</div>
          <div class="text-xs desk-text-secondary opacity-70">流程步骤</div>
        </div>
        <div ref="timelineContainerRef" class="max-h-[360px] overflow-y-auto pr-1 custom-scrollbar pt-3">
          <a-timeline mode="left">
            <a-timeline-item v-for="step in allSteps" :key="step.stepId || step.stepCode"
              :color="doneStepCodes.has(step.stepCode || '') ? 'green' : 'gray'">
              <div class="text-xs font-medium desk-text flex items-center gap-2">
                <span>{{ step.stepDesc || '-' }}</span>
                <a-tag v-if="doneStepCodes.has(step.stepCode || '')" size="small" color="success"
                  class="border-0 text-[10px]">
                  已完成
                </a-tag>
                <a-tag v-else size="small" color="default" class="border-0 text-[10px]">
                  待执行
                </a-tag>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-card>

      <a-card class="desk-card desk-card--log shadow-sm rounded-xl border-0 lg:col-span-2" :loading="logLoading"
        :body-style="{ padding: '12px 16px 10px' }">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium desk-text">合同执行日志</div>
          <a-button type="primary" size="small" @click="handleRefreshLogs">刷新日志</a-button>
        </div>
        <div ref="logContainerRef"
          class="desk-log-container rounded-lg px-3 py-2 max-h-[360px] overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
          <template v-if="logs && logs.length">
            <div v-for="item in logs" :key="item.historyId"
              class="text-emerald-400/90 mb-1.5 whitespace-pre-wrap break-words">
              <span class="desk-log-time mr-2">[{{ item.createTime }}]</span>
              <span>{{ item.message }}</span>
            </div>
          </template>
          <div v-else class="desk-text-secondary text-[11px]">
            暂无执行日志。
          </div>
        </div>
      </a-card>
    </div>

    <!-- 未执行步骤列表 -->
    <a-card style="display: none;" class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm"
      :loading="stepLoading" :body-style="{ padding: '16px 16px 8px' }">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm font-medium desk-text">待执行流程</div>
      </div>
      <a-table :data-source="pagedUndoSteps" :pagination="{
          current: undoStepCurrent,
          pageSize: undoStepPageSize,
          total: undoStepsTotal,
          showSizeChanger: false,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleUndoStepPageChange,
        }" size="small" row-key="stepId" class="custom-compact-table">
        <a-table-column key="stepDesc" title="步骤名称" data-index="stepDesc" />
        <a-table-column key="stepCode" title="步骤编码" data-index="stepCode" />
        <a-table-column key="roleCode" title="归属角色" data-index="roleCode">
          <template #default="{ text }">
            {{ getRoleName(text) }}
          </template>
        </a-table-column>
        <a-table-column key="sort" title="排序" data-index="sort" />
        <!-- <a-table-column key="stepDesc" title="步骤描述" data-index="stepDesc" /> -->
      </a-table>
    </a-card>

    <!-- 所有步骤列表 -->
    <a-card class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="allStepLoading"
      :body-style="{ padding: '16px 16px 8px' }">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm font-medium desk-text">流程所有步骤</div>
      </div>
      <a-table :data-source="pagedAllSteps" :pagination="{
          current: allStepCurrent,
          pageSize: allStepPageSize,
          total: allStepsTotal,
          showSizeChanger: false,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleAllStepPageChange,
        }" size="small" row-key="stepId" class="custom-compact-table">
        <a-table-column key="stepDesc" title="步骤名称" data-index="stepDesc"
          :filtered-value="stepDescFilteredValue ? [stepDescFilteredValue] : null">
          <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
            <div style="padding: 8px">
              <a-input ref="searchInputRef" :value="selectedKeys[0]" placeholder="搜索步骤名称"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="(e: Event) => { const target = e.target as HTMLInputElement; setSelectedKeys(target.value ? [target.value] : []); }"
                @pressEnter="handleStepDescSearch(selectedKeys, confirm)" />
              <a-space>
                <a-button type="primary" size="small" style="width: 90px"
                  @click="handleStepDescSearch(selectedKeys, confirm)">
                  搜索
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleStepDescReset(clearFilters)">
                  重置
                </a-button>
              </a-space>
            </div>
          </template>
          <template #filterIcon="{ filtered }">
            <SearchOutlined :style="{ color: filtered ? '#1890ff' : undefined }" />
          </template>
          <template #default="{ text }">
            <span v-if="stepDescFilteredValue && text">
              <template v-for="(fragment, i) in getHighlightedText(text, stepDescFilteredValue)" :key="i">
                <mark v-if="fragment.highlight" class="highlight">
                  {{ fragment.text }}
                </mark>
                <span v-else>{{ fragment.text }}</span>
              </template>
            </span>
            <span v-else>{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="stepCode" title="步骤编码" data-index="stepCode" />
        <a-table-column key="roleCode" title="归属角色" data-index="roleCode"
          :filtered-value="roleFilteredValue ? [roleFilteredValue] : null">
          <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
            <div style="padding: 8px">
              <a-select style="width: 188px; margin-bottom: 8px; display: block" placeholder="选择角色" allow-clear
                :value="selectedKeys[0]" :options="roleOptions"
                @change="(val: string | undefined) => setSelectedKeys(val ? [String(val)] : [])" />
              <a-space>
                <a-button type="primary" size="small" style="width: 90px"
                  @click="handleRoleSearch(selectedKeys, confirm)">
                  确定
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleRoleReset(clearFilters)">
                  重置
                </a-button>
              </a-space>
            </div>
          </template>
          <template #filterIcon="{ filtered }">
            <FilterFilled :style="{ color: filtered ? '#1890ff' : undefined }" />
          </template>
          <template #default="{ text }">
            {{ getRoleName(text) }}
          </template>
        </a-table-column>
        <a-table-column key="sort" title="排序" data-index="sort" />
        <a-table-column key="action" title="控制" width="100">
          <template #default="{ record }">
            <a-button type="primary" size="small" :loading="executingStep && currentExecuteStepCode === record.stepCode"
              :disabled="!currentInfo?.contractCode || !record.stepCode" @click="handleExecuteStep(record.stepCode)">
              执行
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { FilterFilled, SearchOutlined } from "@ant-design/icons-vue";
import type { FulfillmentProcessStepResponse } from "../../apis/types";
import {
  useExecuteContract,
  useExecuteStep,
  useGetCurrentInfo,
  useGetDoneProcessSteps,
  useGetUndoProcessSteps,
  useLatestHistory,
  useListProcessStepsByCode,
  useStopContract,
} from "./hook";
import { message } from 'ant-design-vue';

const router = useRouter();

const goToContract = () => {
  router.push("/contract");
};

// 当前合同信息
const {
  getCurrentInfo,
  loading: contractLoading,
  currentInfo,
  executeStatus,
} = useGetCurrentInfo();


const contractId = computed(() => currentInfo.value.contractId);
const processCode = computed(() => currentInfo.value.processCode);

const statusInfo = computed(() => {
  const status = (executeStatus.value || "TODO").toUpperCase();
  switch (status) {
    case "DOING":
      return { text: "执行中", status, color: "#1677ff", type: "processing" };
    case "DONE":
      return { text: "已完成", status, color: "#52c41a", type: "success" };
    case "STOPPED":
      return { text: "已停止", status, color: "#faad14", type: "warning" };
    case "FAIL":
      return { text: "执行失败", status, color: "#ff4d4f", type: "error" };
    case "TODO":
    default:
      return { text: "待执行", status: "TODO", color: "#d9d9d9", type: "default" };
  }
});

// 执行 / 停止
const { loading: executing, executeContract } = useExecuteContract({
  onSuccess: () => {
    refreshAll();
  },
});

const { loading: stopping, stopContract } = useStopContract({
  onSuccess: () => {
    refreshAll();
  },
});
const currentExecuteStepCode = ref<string | undefined>(undefined);
// 执行单个步骤
const { loading: executingStep, executeStep } = useExecuteStep({
  onSuccess: () => {
    message.success("执行成功")
    currentExecuteStepCode.value = undefined;
  },
});

const actionButtonProps = computed(() => {
  const status = statusInfo.value.status;
  console.log("status",status)
  if (status === "DOING") {
    return {
      text: "停止执行",
      type: "primary" as const,
      danger: true,
      disabled: false,
      action: "stop" as const,
    };
  }
  if (status === "DONE") {
    return {
      text: "已完成",
      type: "default" as const,
      danger: false,
      disabled: true,
      action: "none" as const,
    };
  }
  if (status === "STOPPED" || status === "FAIL") {
    return {
      text: "继续执行",
      type: "primary" as const,
      danger: false,
      disabled: false,
      action: "execute" as const,
    };
  }
  return {
    text: "执行合同",
    type: "primary" as const,
    danger: false,
    disabled: false,
    action: "execute" as const,
  };
});

const handleAction = async () => {
  const action = actionButtonProps.value.action;
  if (action === "execute") {
    await executeContract({
      processCode: processCode.value,
    });
  } else if (action === "stop") {
    await stopContract(contractId.value, true);
  }
};

// 处理执行单个步骤
const handleExecuteStep = async (stepCode?: string) => {
  if (!stepCode || !currentInfo.value.contractCode) return;
  currentExecuteStepCode.value = stepCode;
  await executeStep(currentInfo.value.contractCode, stepCode);
};

// 流程步骤
const {
  loading: allStepLoading,
  steps: allSteps,
  listByProcessCode,
} = useListProcessStepsByCode();

const {
  loading: doneStepLoading,
  doneSteps,
  getDoneSteps,
} = useGetDoneProcessSteps();

const {
  loading: undoStepLoading,
  undoSteps,
  getUndoSteps,
} = useGetUndoProcessSteps();

const stepLoading = computed(
  () => allStepLoading.value || doneStepLoading.value || undoStepLoading.value,
);

// 未执行步骤分页
const undoStepPageSize = ref(20);
const undoStepCurrent = ref(1);

const pagedUndoSteps = computed(() => {
  const start = (undoStepCurrent.value - 1) * undoStepPageSize.value;
  const end = start + undoStepPageSize.value;
  return undoSteps.value.slice(start, end);
});

const undoStepsTotal = computed(() => undoSteps.value.length);

const handleUndoStepPageChange = (page: number, pageSize?: number) => {
  undoStepCurrent.value = page;
  if (pageSize) {
    undoStepPageSize.value = pageSize;
  }
};

// 所有步骤分页
const allStepPageSize = ref(20);
const allStepCurrent = ref(1);

// 步骤名称搜索
const stepDescFilteredValue = ref<string | null>(null);
const searchInputRef = ref<any>(null);

// 归属角色过滤
const roleFilteredValue = ref<string | null>(null);
const roleOptions = computed(() => {
  const roleMap: Record<string, string> = {
    EXPORTER: '出口商',
    IMPORTER: '进口商',
    SUPPLIER: '供应商',
    ISSUING_BANK: '进口地银行',
    NEGOTIATING_BANK: '出口地银行',
  };
  return Object.entries(roleMap).map(([value, label]) => ({ value, label }));
});

// 根据搜索关键词过滤后的步骤列表
const filteredAllSteps = computed(() => {
  let list = allSteps.value;

  if (stepDescFilteredValue.value) {
    const keyword = stepDescFilteredValue.value.toLowerCase();
    list = list.filter((step) => {
      const stepDesc = (step.stepDesc || '').toLowerCase();
      return stepDesc.includes(keyword);
    });
  }

  if (roleFilteredValue.value) {
    list = list.filter((step) => (step.roleCode || '') === roleFilteredValue.value);
  }

  return list;
});

const pagedAllSteps = computed(() => {
  const start = (allStepCurrent.value - 1) * allStepPageSize.value;
  const end = start + allStepPageSize.value;
  return filteredAllSteps.value.slice(start, end);
});

const allStepsTotal = computed(() => filteredAllSteps.value.length);

const handleAllStepPageChange = (page: number, pageSize?: number) => {
  allStepCurrent.value = page;
  if (pageSize) {
    allStepPageSize.value = pageSize;
  }
};

// 高亮文本处理函数
const getHighlightedText = (text: string | number | undefined, keyword: string | null): Array<{ text: string; highlight: boolean }> => {
  if (!text || !keyword) {
    return [{ text: String(text || ''), highlight: false }];
  }
  const textStr = String(text);
  const keywordStr = String(keyword);
  // 转义特殊字符
  const escapedKeyword = keywordStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(textStr)) !== null) {
    // 添加匹配前的文本
    if (match.index > lastIndex) {
      parts.push({ text: textStr.substring(lastIndex, match.index), highlight: false });
    }
    // 添加匹配的文本（高亮）
    parts.push({ text: match[0], highlight: true });
    lastIndex = match.index + match[0].length;
    
    // 避免无限循环（如果匹配空字符串）
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }
  // 添加剩余的文本
  if (lastIndex < textStr.length) {
    parts.push({ text: textStr.substring(lastIndex), highlight: false });
  }
  return parts.length > 0 ? parts : [{ text: textStr, highlight: false }];
};

// 步骤名称搜索处理
const handleStepDescSearch = (selectedKeys: string[], confirm: () => void) => {
  stepDescFilteredValue.value = selectedKeys[0] || null;
  allStepCurrent.value = 1; // 重置到第一页
  confirm();
};

// 步骤名称搜索重置
const handleStepDescReset = (clearFilters: () => void) => {
  stepDescFilteredValue.value = null;
  allStepCurrent.value = 1; // 重置到第一页
  clearFilters();
  nextTick(() => {
    if (searchInputRef.value) {
      searchInputRef.value.focus();
    }
  });
};

// 归属角色过滤处理
const handleRoleSearch = (selectedKeys: string[], confirm: () => void) => {
  roleFilteredValue.value = selectedKeys[0] || null;
  allStepCurrent.value = 1; // 重置到第一页
  confirm();
};

// 归属角色过滤重置
const handleRoleReset = (clearFilters: () => void) => {
  roleFilteredValue.value = null;
  allStepCurrent.value = 1; // 重置到第一页
  clearFilters();
};

// 角色编码转换为中文名称
const getRoleName = (roleCode?: string): string => {
  if (!roleCode) return '-';
  const roleMap: Record<string, string> = {
    EXPORTER: '出口商',
    IMPORTER: '进口商',
    SUPPLIER: '供应商',
    ISSUING_BANK: '进口地银行',
    NEGOTIATING_BANK: '出口地银行',
  };
  return roleMap[roleCode] || roleCode;
};
// 
const timelineContainerRef = ref<HTMLElement | null>(null);
const scrollToBottomOfTimeline = () => {
  nextTick(() => {
    if (timelineContainerRef.value) {
      const allLen = allSteps.value.length
      const doneLen = doneSteps.value.length
      // console.log("allLen",allLen)
      // console.log("doneLen",doneLen)
      // console.log("scrollHeight",timelineContainerRef.value.scrollHeight)
      // console.log("itemHeight",timelineContainerRef.value.scrollHeight / allLen)
      if(doneLen > 0){
        timelineContainerRef.value.scrollTop = doneLen * 35
      }
    }
  });
};
watch(
  doneSteps,
  (newVal) => {
    scrollToBottomOfTimeline();
  },
  {
    deep: true,immediate:true,
  }
)

// 日志
const {
  loading: logLoading,
  logs,
  fetchLatest
} = useLatestHistory();

// 日志容器引用
const logContainerRef = ref<HTMLElement | null>(null);

// 滚动日志到底部
const scrollLogsToBottom = () => {
  nextTick(() => {
    if (logContainerRef.value) {
      logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight;
    }
  });
};

// 监听日志变化，自动滚动到底部
watch(
  logs,
  () => {
    scrollLogsToBottom();
  },
  { deep: true }
);

// 定时器逻辑
const timer = ref<number | null>(null);
const intervalMs = 5000;

const clearTimer = () => {
  if (timer.value !== null) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const startPolling = () => {
  clearTimer();
  const cid = contractId.value;
  const status = statusInfo.value.status;
  if (!cid) return;
  
  // 进入页面或状态变化时先获取一次日志
  fetchLatest(cid);
  
  // 只有 DOING 状态才轮询
  if (status === "DOING") {
    timer.value = window.setInterval(async() => {
      // 使用最新的 contractId，避免闭包问题
      await fetchLatest(contractId.value);
      await refreshAll()
    }, intervalMs);
  }
};

const handleRefreshLogs = async() => {
  await fetchLatest(contractId.value);
};

// 合同 ID 或状态变化时，执行一次拉取；如果状态为 DOING，则开启轮询
watch(
  [contractId, () => statusInfo.value.status],
  ([cid, status]) => {
    if (!cid) {
      clearTimer();
      return;
    }
    startPolling();
    if (status !== "DOING") {
      // 非执行中状态只拉一次，不继续轮询
      clearTimer();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTimer();
});

// 计算已完成步骤编码集合
const doneStepCodes = computed<Set<string>>(() => {
  const set = new Set<string>();
  (doneSteps.value as FulfillmentProcessStepResponse[]).forEach((item) => {
    if (item.stepCode) set.add(item.stepCode);
  });
  return set;
});

const handleRefresh = async () => {
  await refreshAll();
  await fetchLatest(contractId.value);
}

// 初始化加载
const refreshAll = async () => {
  await getCurrentInfo();
  const cid = contractId.value;
  const pCode = processCode.value;
  await Promise.all([
    listByProcessCode(pCode),
    getDoneSteps(pCode, cid),
    getUndoSteps(pCode, cid),
  ]);
};

onMounted(() => {
  refreshAll();
  scrollToBottomOfTimeline()
});
</script>

<style scoped>
.desk-root {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.desk-text {
  color: var(--app-color-text);
}

.desk-text-secondary {
  color: var(--app-color-text-secondary);
}

/* 卡片：避免写死白底，跟随 AntD 暗色 token */
.desk-card {
  background-color: var(--app-bg-container) !important;
  border: 1px solid color-mix(in srgb, var(--app-border-color) 80%, transparent);
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.desk-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.14),
    0 4px 10px rgba(0, 0, 0, 0.08);
}

.desk-card--log {
  background-color: var(--desk-log-card-bg) !important;
  color: var(--desk-log-text);
}

.desk-card--log .desk-text {
  color: var(--desk-log-text);
}

.desk-card--log .desk-text-secondary {
  color: var(--desk-log-text-secondary);
}

.desk-log-container {
  background-color: var(--desk-log-inner-bg);
}

.desk-log-time {
  color: var(--desk-log-text-secondary);
}

/* 隐藏页面滚动条 */
.scrollbar-w-none {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 和 Edge */
}

.scrollbar-w-none::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}

.custom-compact-table :deep(.ant-table-thead > tr > th) {
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: var(--app-bg-container-hover);
  color: var(--app-color-text);
}

.custom-compact-table :deep(.ant-table-tbody > tr > td) {
  padding-top: 6px;
  padding-bottom: 6px;
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>