<template>
  <a-modal
    :open="open"
    :title="title"
    width="900px"
    :footer="null"
    @cancel="emit('update:open', false)"
  >
    <div class="mb-3 text-xs text-neutral-500">
      <span>{{ t("desk.batchDetailHint", { total: steps.length }) }}</span>
    </div>

    <div class="batch-detail-table custom-scrollbar">
      <a-table
        :data-source="steps"
        :pagination="false"
        size="small"
        row-key="stepCode"
        class="custom-compact-table"
      >
        <a-table-column key="sort" :title="t('desk.sort')" data-index="sort" width="80" />
        <a-table-column key="stepDesc" :title="t('desk.stepName')" data-index="stepDesc" />
        <a-table-column key="stepCode" :title="t('desk.stepCode')" data-index="stepCode" />
        <a-table-column key="roleCode" :title="t('desk.roleName')" data-index="roleCode" width="120">
          <template #default="{ text }">
            {{ getRoleName?.(text) ?? (text || '-') }}
          </template>
        </a-table-column>
        <a-table-column key="execState" :title="t('desk.execState')" width="120">
          <template #default="{ record }">
            <a-tag :color="stateColor(getState(record.stepCode))" class="border-0">
              {{ stateText(getState(record.stepCode)) }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="execMessage" :title="t('desk.execResult')">
          <template #default="{ record }">
            <span class="text-xs">
              {{ statusMap?.[record.stepCode]?.message || '-' }}
            </span>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ExecState = "idle" | "queued" | "running" | "success" | "failed" | "skipped";

type StepLike = {
  stepCode?: string;
  stepDesc?: string;
  roleCode?: string;
  sort?: number;
};

type ExecRecord = {
  state: ExecState;
  message?: string;
};

const props = defineProps<{
  open: boolean;
  steps: StepLike[];
  statusMap: Record<string, ExecRecord | undefined>;
  getRoleName?: (roleCode?: string) => string;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
}>();

const { t } = useI18n();

const title = computed(() => t("desk.batchDetailTitle"));

const getState = (stepCode?: string): ExecState => {
  if (!stepCode) return "idle";
  return props.statusMap?.[stepCode]?.state ?? "idle";
};

const stateText = (state: ExecState) => {
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

const stateColor = (state: ExecState) => {
  switch (state) {
    case "queued":
      return "default";
    case "running":
      return "processing";
    case "success":
      return "success";
    case "failed":
      return "error";
    case "skipped":
      return "warning";
    case "idle":
    default:
      return "default";
  }
};
</script>

<style scoped>
.batch-detail-table {
  max-height: min(60vh, 520px);
  overflow: auto;
  padding-right: 4px;
}
</style>

