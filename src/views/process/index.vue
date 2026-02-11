<template>
  <div class="process-page p-4 lg:p-6 xl:p-8 space-y-4 min-h-full">
    <a-card hoverable class="process-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="loading"
      :body-style="{ padding: '20px' }">
      <!-- 标题和过滤区域 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">{{ $t('process.labelTrade') }}</span>
            <a-select v-model:value="tradeFilter" :placeholder="$t('process.placeholderTrade')" style="width: 150px" allow-clear
              @change="handleTradeChange">
              <a-select-option value="CIF">CIF</a-select-option>
              <a-select-option value="CFR">CFR</a-select-option>
              <a-select-option value="FOB">FOB</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">{{ $t('process.labelPayment') }}</span>
            <a-select v-model:value="paymentFilter" :placeholder="$t('process.placeholderPayment')" style="width: 150px" allow-clear
              @change="handlePaymentChange">
              <a-select-option value="L/C">L/C</a-select-option>
              <a-select-option value="D/P">D/P</a-select-option>
              <a-select-option value="D/A">D/A</a-select-option>
              <a-select-option value="T/T">T/T</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="w-80">
          <a-input-search v-model:value="searchKeyword" :placeholder="$t('process.placeholderSearch')" size="large"
            @search="handleSearch" @clear="handleSearch" allow-clear>
            <template #enterButton>
              <span>{{ $t('process.btnSearch') }}</span>
            </template>
          </a-input-search>
        </div>
      </div>

      <!-- 表格 -->
      <a-table :data-source="dataSource" :loading="loading" :pagination="{
        current: current,
        pageSize: pageSize,
        total: total,
        showSizeChanger: false,
        showTotal: (totalNum: number) => t('process.showTotal', { total: totalNum }),
        onChange: handlePageChange,
      }" row-key="stepId" class="custom-compact-table" size="middle">
        <a-table-column key="stepDesc" :title="$t('process.columnStepDesc')" data-index="stepDesc" width="200">
          <template #default="{ text }">
            <span class="process-cell-primary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="stepCode" :title="$t('process.columnStepCode')" data-index="stepCode" width="150">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="roleCode" :title="$t('process.columnRoleCode')" data-index="roleCode" width="120">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ getRoleName(text) }}</span>
          </template>
        </a-table-column>
        <a-table-column key="sleepSeconds" :title="$t('process.columnSleepSeconds')" data-index="sleepSeconds" width="120" align="right">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ formatSecondsToTime(text) }}</span>
          </template>
        </a-table-column>
        <a-table-column key="skip" :title="$t('process.columnSkip')" width="160" align="center">
          <template #default="{ record }">
            <a-tag :color="record.skip ? '#f5222d' : '#52c41a'">
              {{ record.skip ? $t('process.skipYes') : $t('process.skipNo') }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="action" :title="$t('process.columnAction')" width="100" fixed="right">
          <template #default="{ record }">
            <a-button type="link" size="small" @click="handleEdit(record)">
              {{ $t('process.btnEdit') }}
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 修改弹窗 -->
    <UpdateModal
      v-model:open="updateModalVisible"
      :step-id="currentEditStepId"
      :initial-data="currentEditStep"
      @success="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProcessStepList } from "./hook";
import type { FulfillmentProcessStep } from "../../apis/types";
import { formatSecondsToTime } from "../../utils/time";
import UpdateModal from "./UpdateModal.vue";

const { t } = useI18n();

const {
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
} = useProcessStepList();

const getRoleName = (roleCode?: string): string => {
  if (!roleCode) return '-';
  const roleMap: Record<string, string> = {
    EXPORTER: t('process.roleExporter'),
    IMPORTER: t('process.roleImporter'),
    SUPPLIER: t('process.roleSupplier'),
    ISSUING_BANK: t('process.roleIssuingBank'),
    NEGOTIATING_BANK: t('process.roleNegotiatingBank'),
  };
  return roleMap[roleCode] || roleCode;
};

// 修改弹窗相关
const updateModalVisible = ref(false);
const currentEditStepId = ref<string | undefined>(undefined);
const currentEditStep = ref<FulfillmentProcessStep | undefined>(undefined);

// 处理修改按钮点击
const handleEdit = (record: FulfillmentProcessStep) => {
  currentEditStepId.value = record.stepId;
  currentEditStep.value = record;
  updateModalVisible.value = true;
};

// 修改成功后的回调
const handleUpdateSuccess = () => {
  // 刷新列表
  fetchList();
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped>
/* 使用 App 根节点注入的 --app-* 变量，兼容 light/dark（ant-design-vue 4.x 不暴露 --ant-*） */
.process-page {
  background-color: var(--app-bg-color);
}
.process-card {
  background-color: var(--app-bg-container);
}
.process-label {
  color: var(--app-color-text-secondary);
}
.process-cell-primary {
  color: var(--app-color-text);
  font-weight: 600;
}
.process-cell-secondary {
  color: var(--app-color-text-secondary);
}

.custom-compact-table :deep(.ant-table-thead > tr > th) {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: var(--app-bg-container);
  font-weight: 600;
  color: var(--app-color-text-secondary);
}

.custom-compact-table :deep(.ant-table-tbody > tr > td) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.custom-compact-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: var(--app-bg-container-hover);
}
</style>
