<template>
  <div class="p-4 lg:p-6 xl:p-8 space-y-4 bg-slate-50 min-h-full">
    <a-card class="shadow-sm rounded-xl border-0 !bg-white/80 backdrop-blur-sm" :loading="loading"
      :body-style="{ padding: '20px' }">
      <!-- 标题和搜索框 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-slate-900 m-0">历史合同</h2>
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
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: handlePageChange,
        onShowSizeChange: handlePageChange,
      }" row-key="contractId" class="custom-compact-table" size="middle">
        <a-table-column key="exportContractCode" title="外销合同编号" data-index="exportContractCode" width="150">
          <template #default="{ text }">
            <span class="text-slate-900 font-medium">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="innerContractCode" title="工厂合同编号" data-index="innerContractCode" width="150">
          <template #default="{ text }">
            <span class="text-slate-900 font-medium">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="goodsNo" title="商品编号" data-index="goodsNo" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="transactionVolume" title="交易数量" data-index="transactionVolume" width="120" align="right">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text != null ? text : '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="exportPrice" title="出口商报价" width="140" align="right">
          <template #default="{ record }">
            <span v-if="record.exportPrice != null" class="text-emerald-600 font-medium">
              {{ record.exportPrice }} {{ record.exportPriceUnit || 'USD' }}
            </span>
            <span v-else class="text-slate-400">-</span>
          </template>
        </a-table-column>
        <a-table-column key="supplierPrice" title="供应商报价" width="140" align="right">
          <template #default="{ record }">
            <span v-if="record.supplierPrice != null" class="text-amber-600 font-medium">
              {{ record.supplierPrice }} RMB
            </span>
            <span v-else class="text-slate-400">-</span>
          </template>
        </a-table-column>
        <a-table-column key="exportCity" title="出口城市" data-index="exportCity" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="importCity" title="进口城市" data-index="importCity" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="exportPort" title="出口港口" data-index="exportPort" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="importPort" title="进口港口" data-index="importPort" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column key="status" title="状态" data-index="status" width="120">
          <template #default="{ record }">
            <a-tag color="#52c41a" v-if="record.executeStatus === 'DONE'" type="success">已完成</a-tag>
            <a-tag color="#d9d9d9" v-else-if="record.executeStatus === 'TODO'" type="warning">待执行</a-tag>
            <a-tag color="#1677ff" v-else-if="record.executeStatus === 'DOING'" type="processing">进行中</a-tag>
            <a-tag color="#faad14" v-else-if="record.executeStatus === 'STOPPED'" type="error">已停止</a-tag>
            <a-tag color="#faad14" v-else-if="record.executeStatus === 'FAIL'" type="error">执行失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="createTime" title="创建时间" data-index="createTime" width="120">
          <template #default="{ text }">
            <span class="text-slate-700">{{ text || '-' }}</span>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useContractHistoryList } from "./hook";

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
.custom-compact-table :deep(.ant-table-thead > tr > th) {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: rgba(248, 250, 252, 0.9);
  font-weight: 600;
  color: #475569;
}

.custom-compact-table :deep(.ant-table-tbody > tr > td) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.custom-compact-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(241, 245, 249, 0.5);
}
</style>
