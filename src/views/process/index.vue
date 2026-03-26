<template>
  <div class="process-page p-4 lg:p-6 xl:p-8 space-y-4 min-h-full">
    <a-card hoverable class="process-card shadow-sm rounded-xl border-0 backdrop-blur-sm" :loading="loading"
      :body-style="{ padding: '20px' }">
      <!-- 标题和过滤区域 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">{{ $t('process.labelTrade') }}</span>
            <a-select
              v-model:value="tradeFilter"
              :placeholder="$t('process.placeholderTrade')"
              style="width: 150px"
              allow-clear
              @change="handleTradeChange"
            >
              <a-select-option value="CIF">CIF</a-select-option>
              <a-select-option value="CFR">CFR</a-select-option>
              <a-select-option value="FOB">FOB</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <span class="process-label text-sm font-medium">{{ $t('process.labelPayment') }}</span>
            <a-select
              v-model:value="paymentFilter"
              :placeholder="$t('process.placeholderPayment')"
              style="width: 150px"
              allow-clear
              @change="handlePaymentChange"
            >
              <a-select-option value="L/C">L/C</a-select-option>
              <a-select-option value="D/P">D/P</a-select-option>
              <a-select-option value="D/A">D/A</a-select-option>
              <a-select-option value="T/T">T/T</a-select-option>
            </a-select>
          </div>

          <!-- 导入 / 导出 按钮 -->
          <div class="flex items-center gap-2">
            <a-button size="middle" @click="openImportModal" :disabled="loading || importing">
              {{ $t('process.btnImport') }}
            </a-button>
            <a-button size="middle" @click="handleExport" :loading="exporting" :disabled="loading">
              {{ $t('process.btnExport') }}
            </a-button>
            <a-button size="middle" @click="delayModalVisible = true" :disabled="loading">{{ $t('process.delay') }}</a-button>
          </div>
        </div>
        <div class="w-80">
          <a-input-search
            v-model:value="searchKeyword"
            :placeholder="$t('process.placeholderSearch')"
            size="large"
            @search="handleSearch"
            @clear="handleSearch"
            allow-clear
          >
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
        showSizeChanger: true,
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
        <a-table-column key="action" :title="$t('process.columnAction')" width="200" fixed="right">
          <template #default="{ record, index }">
            <a-space :size="6">
              <a-button
                type="link"
                size="small"
                :disabled="loading || isMoving || record?.parentStepId === 'root' || !record?.parentStepId"
                :loading="isMovingUp(record)"
                @click="handleMoveUp(record)"
              >
                {{ $t('process.btnMoveUp') }}
              </a-button>
              <a-button
                type="link"
                size="small"
                :disabled="loading || isMoving || !record?.parentStepId"
                :loading="isMovingDown(record)"
                @click="handleMoveDown(record)"
              >
                {{ $t('process.btnMoveDown') }}
              </a-button>
              <a-button type="link" size="small" :disabled="loading || isMoving" @click="handleEdit(record)">
                {{ $t('process.btnEdit') }}
              </a-button>
            </a-space>
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



    <!-- 导入流程步骤弹窗 -->
    <a-modal
      v-model:open="importModalOpen"
      :title="$t('process.modalImportTitle')"
      :confirm-loading="importing"
      :ok-text="$t('process.modalOk')"
      :cancel-text="$t('process.modalCancel')"
      @ok="handleImportOk"
      @cancel="handleImportCancel"
    >
      <a-upload
        v-model:fileList="importFileList"
        :max-count="1"
        :before-upload="beforeImportUpload"
        :show-upload-list="true"
        accept=".xlsx,.xls,.csv"
      >
        <a-button>{{ $t('process.selectFile') }}</a-button>
      </a-upload>

      <div class="text-xs process-text-secondary mt-2">
        {{ $t('process.importHint') }}
      </div>
    </a-modal>


    <a-modal
      v-model:open="delayModalVisible"
      :title="$t('process.modalDelayTitle')"
      :confirm-loading="delaying"
      :ok-text="$t('process.delayModalOk')"
      :cancel-text="$t('process.delayModalCancel')"
      @ok="handleDelayOk"
      @cancel="delayModalVisible = false"
    >
      <a-form>
        <a-form-item :label="$t('process.labelDelaySeconds')" name="delaySeconds">
          <a-input-number v-model:value="delaySeconds" :min="0" :max="1000000" :step="1" class="w-full" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProcessStepList, useDelayProcessStep } from "./hook";
import type { FulfillmentProcessStep } from "../../apis/types";
import { formatSecondsToTime } from "../../utils/time";
import UpdateModal from "./UpdateModal.vue";
import processStepApi from "../../apis/processStep";

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

const { loading: delaying, delayProcessStep } = useDelayProcessStep();

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

// 延迟弹窗相关
const delayModalVisible = ref(false);
const delaySeconds = ref(1);

const handleDelayOk = async () => {
  if (delaying.value) return;
  try {
    console.log("delaySeconds", delaySeconds.value);
    await delayProcessStep({sleepSeconds: delaySeconds.value} as FulfillmentProcessStep);
  } catch (error) {
    console.error("延迟流程步骤失败", error);
    throw error;
  } finally {
    delayModalVisible.value = false;
    fetchList();
  }
};

// 上移 / 下移（行级 loading + 防重复点击）
const movingStepId = ref<string | undefined>(undefined);
const movingDirection = ref<"up" | "down" | undefined>(undefined);
const isMoving = computed(() => Boolean(movingStepId.value && movingDirection.value));

const isMovingUp = (record: FulfillmentProcessStep) =>
  Boolean(record?.stepId && movingStepId.value === record.stepId && movingDirection.value === "up");

const isMovingDown = (record: FulfillmentProcessStep) =>
  Boolean(record?.stepId && movingStepId.value === record.stepId && movingDirection.value === "down");

const handleMoveUp = async (record: FulfillmentProcessStep) => {
  const stepId = record?.stepId;
  if (!stepId || isMoving.value) return;

  movingStepId.value = stepId;
  movingDirection.value = "up";
  try {
    await processStepApi.moveUp(stepId);
    message.success(t("process.msgMoveSuccess"));
    await fetchList();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("上移流程步骤失败", error);
    message.error(t("process.msgMoveFail"));
  } finally {
    movingStepId.value = undefined;
    movingDirection.value = undefined;
  }
};

const handleMoveDown = async (record: FulfillmentProcessStep) => {
  const stepId = record?.stepId;
  if (!stepId || isMoving.value) return;

  movingStepId.value = stepId;
  movingDirection.value = "down";
  try {
    await processStepApi.moveDown(stepId);
    message.success(t("process.msgMoveSuccess"));
    await fetchList();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("下移流程步骤失败", error);
    message.error(t("process.msgMoveFail"));
  } finally {
    movingStepId.value = undefined;
    movingDirection.value = undefined;
  }
};

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

// 导入 / 导出相关状态
const exporting = ref(false);
const importing = ref(false);
const importModalOpen = ref(false);
const importFileList = ref<any[]>([]);

const openImportModal = () => {
  importModalOpen.value = true;
  importFileList.value = [];
};

const beforeImportUpload = (file: File) => {
  // 阻止自动上传，交给弹窗 OK 触发
  importFileList.value = [{ originFileObj: file, name: file.name, uid: String(Date.now()) }];
  return false;
};

const handleImportOk = async () => {
  if (importing.value) return;

  const file = importFileList.value?.[0]?.originFileObj as File | undefined;
  if (!file) {
    message.warning(t("process.msgSelectFile"));
    return;
  }

  importing.value = true;
  try {
    await processStepApi.import(file);
    message.success(t("process.msgImportSuccess"));
    importModalOpen.value = false;
    importFileList.value = [];
    await fetchList();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("导入流程步骤失败", error);
    message.error(t("process.msgImportFail"));
  } finally {
    importing.value = false;
  }
};

const handleImportCancel = () => {
  if (importing.value) return;
  importModalOpen.value = false;
  importFileList.value = [];
};

const handleExport = async () => {
  if (exporting.value) return;

  exporting.value = true;
  try {
    const { filename } = await processStepApi.export();
    message.success(t("process.msgExportSuccess", { filename }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("导出流程步骤失败", error);
    message.error(t("process.msgExportFail"));
  } finally {
    exporting.value = false;
  }
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

.process-text-secondary {
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
