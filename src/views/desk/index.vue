<template>
  <div class="desk-root p-4 lg:p-6 xl:p-8 space-y-4 min-h-full scrollbar-w-none">
    <!-- 合同基础信息 -->
    <a-card class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="contractLoading"
      :body-style="{ padding: '16px 20px 8px' }">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-2">
        <div>
          <div class="text-base font-medium desk-text flex flex-wrap items-center gap-1">
            <span>{{ $t('desk.currentContract') }}</span>
            <span class="desk-text-secondary">
              {{ currentInfo?.contractCode || $t('desk.noContract') }}
            </span>
            <span class="desk-text-secondary opacity-70">|</span>
            <span>{{ $t('desk.status') }}</span>
            <a-tag :color="statusInfo.color" class="border-0 flex items-center gap-1">
              <!-- <span class="inline-block w-2 h-2 rounded-full" :style="{ backgroundColor: statusInfo.color }" /> -->
              <span>{{ statusInfo.text }}</span>
            </a-tag>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a-space>
            <div class="flex items-center gap-2">
              <span class="text-xs desk-text-secondary opacity-80 whitespace-nowrap">
                {{ t('desk.executeFrom') }}
              </span>
              <a-select
                v-model:value="startStepCode"
                allow-clear
                show-search
                class="min-w-[180px]"
                :placeholder="t('desk.executeFromPlaceholder')"
                :options="executeToOptions"
                :disabled="allStepLoading || !executeToOptions.length || executing || stopping"
                option-filter-prop="label"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs desk-text-secondary opacity-80 whitespace-nowrap">
                {{ t('desk.executeTo') }}
              </span>
              <a-select
                v-model:value="stopStepCode"
                allow-clear
                show-search
                class="min-w-[180px]"
                :placeholder="t('desk.executeToPlaceholder')"
                :options="executeToOptions"
                :disabled="allStepLoading || !executeToOptions.length || executing || stopping"
                option-filter-prop="label"
              />
            </div>
            <a-button class="px-5" @click="handleRefresh">{{ $t('desk.refresh') }}</a-button>
            <a-button class="px-5" @click="goToContract">
              {{ $t('sidebar.contract') }}
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
            <span class="desk-text-secondary opacity-80">{{ $t('desk.exportContractCode') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportContractCode || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.innerContractCode') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.innerContractCode || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.transactionVolume') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.transactionVolume ?? '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.goodsNo') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.goodsNo || '-' }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.exportPrice') }}</span>
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
            <span class="desk-text-secondary opacity-80">{{ $t('desk.supplierPrice') }}</span>
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
            <span class="desk-text-secondary opacity-80">{{ $t('desk.exportCity') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportCity || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.importCity') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.importCity || '-' }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.exportPort') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.exportPort || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.importPort') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.importPort || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.tradeTerm') }}</span>
            <span class="font-medium desk-text">{{ currentInfo?.trade || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="desk-text-secondary opacity-80">{{ $t('desk.payment') }}</span>
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
          <div class="text-sm font-medium desk-text">{{ $t('desk.progressTitle') }}</div>
          <div class="text-xs desk-text-secondary opacity-70">{{ $t('desk.flowSteps') }}</div>
        </div>
        <div ref="timelineContainerRef" class="max-h-[360px] overflow-y-auto pr-1 custom-scrollbar pt-3">
          <a-timeline mode="left">
            <a-timeline-item v-for="step in allSteps" :key="step.stepId || step.stepCode"
              :color="doneStepCodes.has(step.stepCode || '') ? 'green' : 'gray'">
              <div class="text-xs font-medium desk-text flex items-center gap-2">
                <span>【{{ getRoleName(step.roleCode)}} 】{{ step.stepDesc || '-' }}</span>
                <a-tag v-if="doneStepCodes.has(step.stepCode || '')" size="small" color="success"
                  class="border-0 text-[10px]">
                  {{ $t('desk.stepDone') }}
                </a-tag>
                <a-tag v-else size="small" color="default" class="border-0 text-[10px]">
                  {{ $t('desk.stepPending') }}
                </a-tag>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-card>

      <a-card class="desk-card desk-card--log shadow-sm rounded-xl border-0 lg:col-span-2" :loading="logLoading"
        :body-style="{ padding: '12px 16px 10px' }">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium desk-text">{{ $t('desk.logTitle') }}</div>
          <a-button type="primary" size="small" @click="handleRefreshLogs">{{ $t('desk.refreshLog') }}</a-button>
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
            {{ $t('desk.noLogs') }}
          </div>
        </div>
      </a-card>
    </div>

    <!-- 未执行步骤列表 -->
    <a-card style="display: none;" class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm"
      :loading="stepLoading" :body-style="{ padding: '16px 16px 8px' }">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm font-medium desk-text">{{ $t('desk.undoFlow') }}</div>
      </div>
      <a-table :data-source="pagedUndoSteps" :pagination="{
          current: undoStepCurrent,
          pageSize: undoStepPageSize,
          total: undoStepsTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleUndoStepPageChange,
          onShowSizeChange: handleUndoStepPageChange,
        }" size="small" row-key="stepId" class="custom-compact-table">
        <a-table-column key="stepDesc" :title="$t('desk.stepName')" data-index="stepDesc" />
        <a-table-column key="stepCode" :title="$t('desk.stepCode')" data-index="stepCode" />
        <a-table-column key="roleCode" :title="$t('desk.roleName')" data-index="roleCode">
          <template #default="{ text }">
            {{ getRoleName(text) }}
          </template>
        </a-table-column>
        <a-table-column key="sort" :title="$t('desk.sort')" data-index="sort" />
      </a-table>
    </a-card>

    <!-- 所有步骤列表 -->
    <a-card class="desk-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="allStepLoading"
      :body-style="{ padding: '16px 16px 8px' }">
      <div class="flex items-center justify-between mb-3 gap-3">
        <div class="text-sm font-medium desk-text">{{ $t('desk.allStepsTitle') }}</div>
        <div class="flex items-center gap-2">
          <a-checkbox
            :disabled="batchStarted"
            :checked="isAllFilteredSelected"
            :indeterminate="isFilteredIndeterminate"
            @change="toggleSelectAllFiltered"
          >
            {{ t('desk.selectAll') }}
          </a-checkbox>
          <a-button
            type="primary"
            class="px-4"
            :disabled="batchStarted || selectedStepCodes.length === 0"
            :loading="batchRunning"
            @click="handleBatchExecuteClick"
          >
            {{ t('desk.batchExecute') }}
          </a-button>
          <a-button v-if="selectedStepCodes.length !== 0" class="px-4" @click="batchDetailOpen = true">
            {{ t('desk.detail') }}
          </a-button>
        </div>
      </div>
      <a-table
        :data-source="filteredAllSteps"
        :row-selection="rowSelection"
        :pagination="{
          current: allStepCurrent,
          pageSize: allStepPageSize,
          total: allStepsTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleAllStepPageChange,
          onShowSizeChange: handleAllStepPageChange,
        }"
        size="small"
        row-key="stepCode"
        class="custom-compact-table"
      >
        <a-table-column key="stepDesc" :title="$t('desk.stepName')" data-index="stepDesc"
          :filtered-value="stepDescFilteredValue ? [stepDescFilteredValue] : null">
          <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
            <div style="padding: 8px">
              <a-input ref="searchInputRef" :value="selectedKeys[0]" :placeholder="$t('desk.searchStepPlaceholder')"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="(e: Event) => { const target = e.target as HTMLInputElement; setSelectedKeys(target.value ? [target.value] : []); }"
                @pressEnter="handleStepDescSearch(selectedKeys, confirm)" />
              <a-space>
                <a-button type="primary" size="small" style="width: 90px"
                  @click="handleStepDescSearch(selectedKeys, confirm)">
                  {{ $t('desk.search') }}
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleStepDescReset(clearFilters)">
                  {{ $t('desk.reset') }}
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
        <a-table-column key="stepCode" :title="$t('desk.stepCode')" data-index="stepCode" />
        <a-table-column key="roleCode" :title="$t('desk.roleName')" data-index="roleCode"
          :filtered-value="roleFilteredValue ? [roleFilteredValue] : null">
          <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
            <div style="padding: 8px">
              <a-select style="width: 188px; margin-bottom: 8px; display: block" :placeholder="$t('desk.selectRole')" allow-clear
                :value="selectedKeys[0]" :options="roleOptions"
                @change="(val: string | undefined) => setSelectedKeys(val ? [String(val)] : [])" />
              <a-space>
                <a-button type="primary" size="small" style="width: 90px"
                  @click="handleRoleSearch(selectedKeys, confirm)">
                  {{ $t('desk.confirm') }}
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleRoleReset(clearFilters)">
                  {{ $t('desk.reset') }}
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
        <a-table-column key="sort" :title="$t('desk.sort')" data-index="sort" />
        <!-- <a-table-column key="execState" :title="t('desk.execState')" width="120">
          <template #default="{ record }">
            <a-tag :color="execStateColor(getStepExecState(record.stepCode))" class="border-0">
              {{ execStateText(getStepExecState(record.stepCode)) }}
            </a-tag>
          </template>
        </a-table-column> -->
        <a-table-column key="action" :title="$t('desk.control')" width="100">
          <template #default="{ record }">
            <a-button type="primary" size="small" :loading="executingStep && currentExecuteStepCode === record.stepCode"
              :disabled="!currentInfo?.contractCode || !record.stepCode" @click="handleExecuteStep(record.stepCode)">
              {{ $t('desk.execute') }}
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <BatchExecuteDetailModal
      v-model:open="batchDetailOpen"
      :steps="selectedStepsSorted"
      :status-map="batchStatusMap"
      :get-role-name="getRoleName"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
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
import { Modal, message } from "ant-design-vue";
import contractApi from "../../apis/contract";
import BatchExecuteDetailModal from "./components/BatchExecuteDetailModal.vue";

const { t } = useI18n();
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

const stopStepCode = ref<string | undefined>(undefined);
const startStepCode = ref<string | undefined>(undefined);

const executeToOptions = computed(() => {
  const list = (allSteps.value || [])
    .filter((s: any) => s?.stepCode)
    .slice()
    .sort((a: any, b: any) => Number(a?.sort ?? 0) - Number(b?.sort ?? 0));

  return list.map((s: any) => {
    const sort = s?.sort != null ? String(s.sort) : "";
    const desc = s?.stepDesc ? String(s.stepDesc) : String(s.stepCode);
    const label = sort ? `${sort}. ${desc}` : desc;
    return { value: String(s.stepCode), label };
  });
});

const statusInfo = computed(() => {
  const status = (executeStatus.value || "TODO").toUpperCase();
  switch (status) {
    case "DOING":
      return { text: t("desk.statusDoing"), status, color: "#1677ff", type: "processing" };
    case "DONE":
      return { text: t("desk.statusDone"), status, color: "#52c41a", type: "success" };
    case "STOPPED":
      return { text: t("desk.statusStopped"), status, color: "#faad14", type: "warning" };
    case "FAIL":
      return { text: t("desk.statusFail"), status, color: "#ff4d4f", type: "error" };
    case "TODO":
    default:
      return { text: t("desk.statusTodo"), status: "TODO", color: "#d9d9d9", type: "default" };
  }
});

// 合同执行完成 / 停止时提示音（通过系统通知触发 Windows 提示音）
const notifyExecutionFinished = (status: "DONE" | "STOPPED") => {
  const canUseNotification = typeof window !== "undefined" && "Notification" in window;
  if (!canUseNotification) {
    return;
  }

  const showNotification = () => {
    const title =
      status === "DONE"
        ? t("desk.notifyDoneTitle")
        : t("desk.notifyStoppedTitle");

    const body = currentInfo.value?.contractCode
      ? t("desk.notifyBodyWithCode", { code: currentInfo.value.contractCode })
      : t("desk.notifyBody");

    try {
      // 在 Electron 环境下，这会触发系统通知与系统提示音
      new Notification(title, { body });
    } catch {
      // 忽略异常，避免打断主流程
    }
  };

  try {
    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          showNotification();
        }
      });
    }
  } catch {
    // 忽略异常
  }
};

// 监听状态从执行中变为 完成/停止 时触发提示音
let lastExecuteStatus: string | null = null;
watch(
  () => statusInfo.value.status,
  (currentStatus) => {
    const prev = (lastExecuteStatus || "").toUpperCase();
    const curr = (currentStatus || "").toUpperCase();

    if (prev === "DOING" && (curr === "DONE" || curr === "STOPPED")) {
      notifyExecutionFinished(curr as "DONE" | "STOPPED");
    }

    lastExecuteStatus = curr;
  },
  { immediate: true },
);

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
    message.success(t("desk.msgExecuteSuccess"));
    currentExecuteStepCode.value = undefined;
  },
});

const actionButtonProps = computed(() => {
  const status = statusInfo.value.status;
  if (status === "DOING") {
    return {
      text: t("desk.stopExecute"),
      type: "primary" as const,
      danger: true,
      disabled: false,
      action: "stop" as const,
    };
  }
  if (status === "DONE") {
    return {
      text: t("desk.done"),
      type: "default" as const,
      danger: false,
      disabled: true,
      action: "none" as const,
    };
  }
  if (status === "STOPPED" || status === "FAIL") {
    return {
      text: t("desk.continueExecute"),
      type: "primary" as const,
      danger: false,
      disabled: false,
      action: "execute" as const,
    };
  }
  return {
    text: t("desk.executeContract"),
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
      stopStepCode: stopStepCode.value || undefined,
      startStepCode: startStepCode.value || undefined,
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
    EXPORTER: t('desk.roleExporter'),
    IMPORTER: t('desk.roleImporter'),
    SUPPLIER: t('desk.roleSupplier'),
    ISSUING_BANK: t('desk.roleImportBank'),
    NEGOTIATING_BANK: t('desk.roleExportBank'),
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

type BatchExecState = "idle" | "queued" | "running" | "success" | "failed" | "skipped";
type BatchExecRecord = { state: BatchExecState; message?: string };

const selectedStepCodes = ref<string[]>([]);
const batchStarted = ref(false);
const batchRunning = ref(false);
const batchDetailOpen = ref(false);
const batchStatusMap = ref<Record<string, BatchExecRecord | undefined>>({});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedStepCodes.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: (string | number)[]) => {
    if (batchStarted.value) return;
    selectedStepCodes.value = keys.map(String);
  },
  getCheckboxProps: () => ({
    disabled: batchStarted.value,
  }),
}));

const selectedStepsSorted = computed(() => {
  const stepMap = new Map<string, any>();
  filteredAllSteps.value.forEach((s: any) => {
    if (s?.stepCode) stepMap.set(String(s.stepCode), s);
  });
  const list = selectedStepCodes.value.map((code) => stepMap.get(code)).filter(Boolean);
  return list.sort((a: any, b: any) => Number(a?.sort ?? 0) - Number(b?.sort ?? 0));
});

const isAllFilteredSelected = computed(() => {
  const filteredCodes = filteredAllSteps.value
    .map((s: any) => s?.stepCode)
    .filter(Boolean)
    .map(String);
  if (filteredCodes.length === 0) return false;
  const selectedSet = new Set(selectedStepCodes.value);
  return filteredCodes.every((c) => selectedSet.has(c));
});

const isFilteredIndeterminate = computed(() => {
  const filteredCodes = filteredAllSteps.value
    .map((s: any) => s?.stepCode)
    .filter(Boolean)
    .map(String);
  if (filteredCodes.length === 0) return false;
  const selectedSet = new Set(selectedStepCodes.value);
  const selectedCount = filteredCodes.filter((c) => selectedSet.has(c)).length;
  return selectedCount > 0 && selectedCount < filteredCodes.length;
});

const toggleSelectAllFiltered = (e: any) => {
  if (batchStarted.value) return;
  const checked = Boolean(e?.target?.checked);
  const filteredCodes = filteredAllSteps.value
    .map((s: any) => s?.stepCode)
    .filter(Boolean)
    .map(String);
  if (checked) {
    selectedStepCodes.value = Array.from(new Set([...selectedStepCodes.value, ...filteredCodes]));
  } else {
    const removeSet = new Set(filteredCodes);
    selectedStepCodes.value = selectedStepCodes.value.filter((c) => !removeSet.has(c));
  }
};

const execStateText = (state: BatchExecState) => {
  switch (state) {
    case "queued":
      return t("desk.execStateQueued");
    case "running":
      return t("desk.execStateRunning");
    case "success":
      return t("desk.execStateSuccess");
    case "failed":
      return t("desk.execStateFailed");
    case "skipped":
      return t("desk.execStateSkipped");
    case "idle":
    default:
      return t("desk.execStateIdle");
  }
};

const execStateColor = (state: BatchExecState) => {
  switch (state) {
    case "running":
      return "processing";
    case "success":
      return "success";
    case "failed":
      return "error";
    case "skipped":
      return "warning";
    case "queued":
    case "idle":
    default:
      return "default";
  }
};

const getStepExecState = (stepCode?: string): BatchExecState => {
  if (!stepCode) return "idle";
  return batchStatusMap.value[String(stepCode)]?.state ?? "idle";
};

const runBatchExecute = async () => {
  if (!currentInfo.value?.contractCode) {
    message.warning(t("desk.msgContractCodeEmpty"));
    return;
  }
  const steps = selectedStepsSorted.value;
  if (!steps.length) {
    message.warning(t("desk.msgSelectStepsToExecute"));
    return;
  }

  batchStarted.value = true;
  batchRunning.value = true;

  const nextMap: Record<string, BatchExecRecord | undefined> = { ...batchStatusMap.value };
  steps.forEach((s: any) => {
    if (!s?.stepCode) return;
    nextMap[String(s.stepCode)] = { state: "queued" };
  });
  batchStatusMap.value = nextMap;

  for (const step of steps) {
    const stepCode = String(step?.stepCode || "");
    if (!stepCode) continue;

    batchStatusMap.value = { ...batchStatusMap.value, [stepCode]: { state: "running" } };
    try {
      await contractApi.executeStep(currentInfo.value.contractCode, stepCode);
      batchStatusMap.value = {
        ...batchStatusMap.value,
        [stepCode]: { state: "success", message: t("desk.execResultSuccess") },
      };
      message.success(t("desk.msgStepExecSuccess", { name: step.stepDesc || stepCode }));
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : t("desk.execResultFailed");
      batchStatusMap.value = {
        ...batchStatusMap.value,
        [stepCode]: { state: "failed", message: msg },
      };
      message.error(t("desk.msgStepExecFailed", { name: step.stepDesc || stepCode }));
    }
  }
  batchStarted.value = false;
  batchRunning.value = false;
  message.success(t("desk.msgBatchDone"));
};

const handleBatchExecuteClick = () => {
  if (batchStarted.value) return;
  if (selectedStepCodes.value.length === 0) {
    message.warning(t("desk.msgSelectStepsToExecute"));
    return;
  }
  Modal.confirm({
    title: t("desk.batchConfirmTitle"),
    content: t("desk.batchConfirmContent", { total: selectedStepCodes.value.length }),
    okText: t("desk.confirm"),
    cancelText: t("desk.cancel"),
    onOk: async () => {
      await runBatchExecute();
    },
  });
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

// 角色编码转换为名称（随语言）
const getRoleName = (roleCode?: string): string => {
  if (!roleCode) return '-';
  const roleMap: Record<string, string> = {
    EXPORTER: t('desk.roleExporter'),
    IMPORTER: t('desk.roleImporter'),
    SUPPLIER: t('desk.roleSupplier'),
    ISSUING_BANK: t('desk.roleImportBank'),
    NEGOTIATING_BANK: t('desk.roleExportBank'),
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