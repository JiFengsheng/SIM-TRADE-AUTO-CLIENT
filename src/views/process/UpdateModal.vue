<template>
  <a-modal
    v-model:open="visible"
    title="修改流程步骤"
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
      <a-form-item label="步骤名称" name="stepDesc">
        <a-input
          v-model:value="formData.stepDesc"
          placeholder="请输入步骤名称"
          :maxlength="200"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="延迟时间（秒）" name="sleepSeconds">
        <a-input-number
          v-model:value="formData.sleepSeconds"
          placeholder="请输入延迟时间"
          :min="0"
          :precision="0"
          class="w-full"
          allow-clear
        />
        <div class="text-xs text-gray-500 mt-1">
          提示：{{ formData.sleepSeconds != null ? formatSecondsToTime(formData.sleepSeconds) : '请输入秒数' }}
        </div>
      </a-form-item>

      <a-form-item label="重新执行是否跳过" name="skip">
        <a-radio-group v-model:value="formData.skip">
          <a-radio :value="0">不跳过</a-radio>
          <a-radio :value="1">跳过</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="updateLoading" @click="handleSubmit">确定</a-button>
      </template>

  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import type { FulfillmentProcessStep } from "../../apis/types";
import { useGetProcessStep, useUpdateProcessStep } from "./hook";
import { formatSecondsToTime } from "../../utils/time";

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

const rules = {
  stepDesc: [{ required: true, message: "请输入步骤名称", trigger: "blur" }],
  sleepSeconds: [
    { required: true, message: "请输入延迟时间", trigger: "blur" },
    { type: "number", min: 0, message: "延迟时间不能小于0", trigger: "blur" },
  ],
  skip: [{ required: true, message: "请选择是否跳过", trigger: "change" }],
};

const { loading: getLoading, getStepById } = useGetProcessStep();
const { loading: updateLoading, updateStep } = useUpdateProcessStep({
  onSuccess: () => {
    message.success("保存成功");
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
            message.error("获取步骤详情失败");
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
      message.error("步骤ID不存在");
      return;
    }

    await updateStep(props.stepId, {
      stepDesc: formData.stepDesc,
      sleepSeconds: formData.sleepSeconds,
      skip: formData.skip,
    });
  } catch (error) {
    if (error !== false) {
      // 表单验证失败时不显示错误提示
      message.error("保存失败，请稍后重试");
    }
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<style scoped>
</style>
