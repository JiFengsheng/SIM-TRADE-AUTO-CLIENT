<template>
  <div class="process-page p-4 lg:p-6 xl:p-8 space-y-4 min-h-full">
    <a-card hoverable class="process-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="loading"
      :body-style="{ padding: '20px' }">
      <!-- 标题和过滤区域 -->
      <div class="flex items-center justify-between mb-6">
        <!-- 左上角：trade 和 payment 过滤组件 -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">贸易术语：</span>
            <a-select v-model:value="tradeFilter" placeholder="请选择贸易术语" style="width: 150px" allow-clear
              @change="handleTradeChange">
              <a-select-option value="CIF">CIF</a-select-option>
              <a-select-option value="CFR">CFR</a-select-option>
              <a-select-option value="FOB">FOB</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">结算方式：</span>
            <a-select v-model:value="paymentFilter" placeholder="请选择结算方式" style="width: 150px" allow-clear
              @change="handlePaymentChange">
              <a-select-option value="L/C">L/C</a-select-option>
              <a-select-option value="D/P">D/P</a-select-option>
              <a-select-option value="D/A">D/A</a-select-option>
              <a-select-option value="T/T">T/T</a-select-option>
            </a-select>
          </div>
        </div>
        <!-- 右上角：搜索框 -->
        <div class="w-80">
          <a-input-search v-model:value="searchKeyword" placeholder="请输入搜索关键词" size="large"
            @search="handleSearch" @clear="handleSearch" allow-clear>
            <template #enterButton>
              <span>搜索</span>
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
        showTotal: (total: number) => `共 ${total} 条记录`,
        onChange: handlePageChange,
      }" row-key="stepId" class="custom-compact-table" size="middle">
        <a-table-column key="stepDesc" title="步骤名称" data-index="stepDesc" width="200">
          <template #default="{ text }">
            <span class="process-cell-primary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="stepCode" title="步骤编码" data-index="stepCode" width="150">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="roleCode" title="归属角色" data-index="roleCode" width="120">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ getRoleName(text) }}</span>
          </template>
        </a-table-column>
        <a-table-column key="sleepSeconds" title="延迟时间" data-index="sleepSeconds" width="120" align="right">
          <template #default="{ text }">
            <span class="process-cell-secondary">{{ formatSecondsToTime(text) }}</span>
          </template>
        </a-table-column>
        <a-table-column key="skip" title="重新执行是否跳过" width="160" align="center">
          <template #default="{ record }">
            <a-tag :color="record.skip ? '#f5222d' : '#52c41a'">
              {{ record.skip ? '跳过' : '不跳过' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" width="100" fixed="right">
          <template #default="{ record }">
            <a-button type="link" size="small" @click="handleEdit(record)">
              修改
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
import { useProcessStepList } from "./hook";
import type { FulfillmentProcessStep } from "../../apis/types";
import { formatSecondsToTime } from "../../utils/time";
import UpdateModal from "./UpdateModal.vue";

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
