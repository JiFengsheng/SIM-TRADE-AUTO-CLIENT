<template>
  <div class="history-root p-4 lg:p-6 xl:p-8 space-y-4 min-h-full">
    <a-card hoverable class="history-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="loading"
      :body-style="{ padding: '20px' }">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold history-text m-0">{{ $t('history.pageTitle') }}</h2>
        <div class="w-80">
          <a-input-search v-model:value="searchKeyword" :placeholder="$t('history.placeholderSearch')" size="large"
            @search="handleSearch" @clear="handleSearch" allow-clear>
            <template #enterButton>
              <span>{{ $t('history.btnSearch') }}</span>
            </template>
          </a-input-search>
        </div>
      </div>

      <a-table :data-source="dataSource" :loading="loading" :pagination="{
        current: current,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (totalNum: number) => t('history.showTotal', { total: totalNum }),
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: handlePageChange,
        onShowSizeChange: handlePageChange,
      }" row-key="contractId" class="custom-compact-table" size="middle">
        <a-table-column key="exportContractCode" :title="$t('history.columnExportContractCode')" data-index="exportContractCode" width="150">
          <template #default="{ text }">
            <span class="history-text font-medium">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="innerContractCode" :title="$t('history.columnInnerContractCode')" data-index="innerContractCode" width="150">
          <template #default="{ text }">
            <span class="history-text font-medium">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="goodsNo" :title="$t('history.columnGoodsNo')" data-index="goodsNo" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="transactionVolume" :title="$t('history.columnTransactionVolume')" data-index="transactionVolume" width="120" align="right">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text != null ? text : '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="exportPrice" :title="$t('history.columnExportPrice')" width="140" align="right">
          <template #default="{ record }">
            <span v-if="record.exportPrice != null" class="text-emerald-600 font-medium">
              {{ record.exportPrice }} {{ record.exportPriceUnit || $t('history.unitDefault') }}
            </span>
            <span v-else class="history-text-tertiary">-</span>
          </template>
        </a-table-column>
        <a-table-column key="supplierPrice" :title="$t('history.columnSupplierPrice')" width="140" align="right">
          <template #default="{ record }">
            <span v-if="record.supplierPrice != null" class="text-amber-600 font-medium">
              {{ record.supplierPrice }} RMB
            </span>
            <span v-else class="history-text-tertiary">-</span>
          </template>
        </a-table-column>
        <a-table-column key="exportCity" :title="$t('history.columnExportCity')" data-index="exportCity" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="importCity" :title="$t('history.columnImportCity')" data-index="importCity" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="exportPort" :title="$t('history.columnExportPort')" data-index="exportPort" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="importPort" :title="$t('history.columnImportPort')" data-index="importPort" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="status" :title="$t('history.columnStatus')" data-index="status" width="120">
          <template #default="{ record }">
            <a-tag color="#52c41a" v-if="record.executeStatus === 'DONE'" type="success">{{ $t('history.statusDone') }}</a-tag>
            <a-tag color="#d9d9d9" v-else-if="record.executeStatus === 'TODO'" type="warning">{{ $t('history.statusTodo') }}</a-tag>
            <a-tag color="#1677ff" v-else-if="record.executeStatus === 'DOING'" type="processing">{{ $t('history.statusDoing') }}</a-tag>
            <a-tag color="#faad14" v-else-if="record.executeStatus === 'STOPPED'" type="error">{{ $t('history.statusStopped') }}</a-tag>
            <a-tag color="#faad14" v-else-if="record.executeStatus === 'FAIL'" type="error">{{ $t('history.statusFail') }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="createTime" :title="$t('history.columnCreateTime')" data-index="createTime" width="120">
          <template #default="{ text }">
            <span class="history-text-secondary">{{ text || '-' }}</span>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useContractHistoryList } from "./hook";

const { t } = useI18n();

const {
  loading,
  dataSource,
  current,
  pageSize,
  total,
  searchKeyword,
  fetchList,
  handleSearch,
  handlePageChange,
} = useContractHistoryList();

onMounted(() => {
  fetchList();
});
</script>

<style scoped>
.history-root {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.history-card {
  background-color: var(--app-bg-container) !important;
}

.history-text {
  color: var(--app-color-text);
}

.history-text-secondary {
  color: var(--app-color-text-secondary);
}

.history-text-tertiary {
  color: var(--app-color-text-secondary);
  opacity: 0.72;
}

.custom-compact-table :deep(.ant-table-thead > tr > th) {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: var(--app-bg-container-hover);
  font-weight: 600;
  color: var(--app-color-text);
}

.custom-compact-table :deep(.ant-table-tbody > tr > td) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.custom-compact-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(255, 255, 255, 0.04);
}
</style>
