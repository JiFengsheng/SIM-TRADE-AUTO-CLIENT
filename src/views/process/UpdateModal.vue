<template>
  <a-modal
    v-model:open="visible"
    :title="$t('process.modalUpdateTitle')"
    :confirm-loading="updateLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      class="mt-4"
    >
      <a-form-item :label="$t('process.labelStepDesc')" name="stepDesc">
        <a-input
          v-model:value="formData.stepDesc"
          :placeholder="$t('process.placeholderStepDesc')"
          :maxlength="200"
          allow-clear
        />
      </a-form-item>

      <a-form-item :label="$t('process.labelSleepSeconds')" name="sleepSeconds">
        <a-input-number
          v-model:value="formData.sleepSeconds"
          :placeholder="$t('process.placeholderSleepSeconds')"
          :min="0"
          :precision="0"
          class="w-full"
          allow-clear
        />
        <div class="text-xs text-gray-500 mt-1">
          {{ $t('process.hintSleepSeconds', { time: formData.sleepSeconds != null ? formatSecondsToTime(formData.sleepSeconds) : t('process.placeholderSeconds') }) }}
        </div>
      </a-form-item>

      <a-form-item :label="$t('process.labelSkip')" name="skip">
        <a-radio-group v-model:value="formData.skip">
          <a-radio :value="0">{{ $t('process.skipNo') }}</a-radio>
          <a-radio :value="1">{{ $t('process.skipYes') }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <template #footer>
        <a-button key="back" @click="handleCancel">{{ $t('process.btnCancel') }}</a-button>
        <a-button key="submit" type="primary" :loading="updateLoading" @click="handleSubmit">{{ $t('process.btnConfirm') }}</a-button>
      </template>

  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import type { FulfillmentProcessStep } from "../../apis/types";
import { useGetProcessStep, useUpdateProcessStep } from "./hook";
import { formatSecondsToTime } from "../../utils/time";

const { t } = useI18n();

interface Props {
  open: boolean;
  stepId?: string;
  initialData?: FulfillmentProcessStep;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  stepId: undefined,
  initialData: undefined,
});

const emit = defineEmits<Emits>();

const visible = ref(false);
const formRef = ref<FormInstance>();
const formData = reactive<{
  stepDesc?: string;
  sleepSeconds?: number;
  skip?: number;
}>({
  stepDesc: undefined,
  sleepSeconds: undefined,
  skip: undefined,
});

const rules = computed(() => ({
  stepDesc: [{ required: true, message: t("process.ruleStepDesc"), trigger: "blur" }],
  sleepSeconds: [
    { required: true, message: t("process.ruleSleepSeconds"), trigger: "blur" },
    { type: "number", min: 0, message: t("process.ruleSleepSecondsMin"), trigger: "blur" },
  ],
  skip: [{ required: true, message: t("process.ruleSkip"), trigger: "change" }],
}));

const { loading: getLoading, getStepById } = useGetProcessStep();
const { loading: updateLoading, updateStep } = useUpdateProcessStep({
  onSuccess: () => {
    message.success(t("process.msgSaveSuccess"));
    emit("update:open", false);
    emit("success");
  },
});

// 监听 open 变化
watch(
  () => props.open,
  async (newVal) => {
    visible.value = newVal;
    if (newVal) {
      // 重置表单
      formRef.value?.resetFields();
      
      // 优先通过 ID 获取最新数据
      if (props.stepId) {
        try {
          const data = await getStepById(props.stepId);
          if (data) {
            formData.stepDesc = data.stepDesc;
            formData.sleepSeconds = data.sleepSeconds;
            formData.skip = data.skip ?? 0;
          }
        } catch (error) {
          // 如果获取失败，尝试使用初始数据
          if (props.initialData) {
            formData.stepDesc = props.initialData.stepDesc;
            formData.sleepSeconds = props.initialData.sleepSeconds;
            formData.skip = props.initialData.skip ?? 0;
          } else {
            message.error(t("process.msgGetStepFail"));
          }
        }
      } else if (props.initialData) {
        // 如果没有 stepId，使用初始数据
        formData.stepDesc = props.initialData.stepDesc;
        formData.sleepSeconds = props.initialData.sleepSeconds;
        formData.skip = props.initialData.skip ?? 0;
      }
    }
  },
  { immediate: true }
);

// 监听 visible 变化，同步到父组件
watch(visible, (newVal) => {
  emit("update:open", newVal);
});

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    if (!props.stepId) {
      message.error(t("process.msgStepIdMissing"));
      return;
    }

    await updateStep(props.stepId, {
      stepDesc: formData.stepDesc,
      sleepSeconds: formData.sleepSeconds,
      skip: formData.skip,
    });
  } catch (error) {
    if (error !== false) {
      message.error(t("process.msgSaveFail"));
    }
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style scoped>
</style>
