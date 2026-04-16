<template>
  <div class="loan-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-4xl mx-auto py-8 px-4 lg:px-6">
      <h1 class="loan-title text-2xl font-bold mb-6 text-center">
        {{ $t('loan.pageTitle') }}
      </h1>

      <a-card class="loan-card" :bordered="false">
        <template #title>
          <div class="section-header">
            <span class="section-title">{{ $t('loan.sectionTitle') }}</span>
            <span class="section-subtitle">
              {{ $t('loan.sectionSubtitle') }}
            </span>
          </div>
        </template>

        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="pt-2">
          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('loan.labelBankCode')" name="bankCode">
                <a-input
                  v-model:value="form.bankCode"
                  :placeholder="$t('loan.placeholderBankCode')"
                  size="large"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('loan.labelMoney')" name="money">
                <a-input-number
                  v-model:value="form.money"
                  :min="0"
                  :precision="2"
                  :placeholder="$t('loan.placeholderMoney')"
                  size="large"
                  class="w-full"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('loan.labelMoneyType')" name="moneyType">
                <a-select
                  v-model:value="form.moneyType"
                  :placeholder="$t('loan.placeholderMoneyType')"
                  size="large"
                  class="w-full"
                  :options="moneyTypeOptions"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('loan.labelRole')" name="role">
                <a-select
                  v-model:value="form.role"
                  :placeholder="$t('loan.placeholderRole')"
                  size="large"
                  class="w-full"
                  :options="roleOptions"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item :label="$t('loan.labelMessage')" name="message">
                <a-textarea
                  v-model:value="form.message"
                  :placeholder="$t('loan.placeholderMessage')"
                  :auto-size="{ minRows: 4, maxRows: 10 }"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="flex items-center justify-end gap-3 pt-2">
            <a-button :disabled="submitting" @click="handleReset">
              {{ $t('loan.btnReset') }}
            </a-button>
            <a-button type="primary" :loading="submitting" @click="handleApply">
              {{ $t('loan.btnApply') }}
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "ant-design-vue";
import type { IssueLoanReqVo } from "../../apis/types";
import { MONEY_TYPE_OPTIONS, ROLE_OPTIONS, useApplyLoan } from "./hook";

const { t } = useI18n();

const moneyTypeOptions = computed(() =>
  MONEY_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
);
const roleOptions = computed(() =>
  ROLE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))
);

const formRef = ref<FormInstance>();
const form = ref<IssueLoanReqVo>({
  bankCode: "",
  money: undefined,
  moneyType: undefined,
  message: "",
  role: undefined,
});

const rules = computed(() => ({
  bankCode: [{ required: true, message: t("loan.msgFillBankCode"), trigger: "blur" }],
  money: [{ required: true, message: t("loan.msgFillMoney"), trigger: "blur" }],
  moneyType: [{ required: true, message: t("loan.msgSelectMoneyType"), trigger: "change" }],
  role: [{ required: true, message: t("loan.msgSelectRole"), trigger: "change" }],
}));

const { submitting, applyLoan } = useApplyLoan();

const handleReset = async () => {
  form.value = {
    bankCode: "",
    money: undefined,
    moneyType: undefined,
    message: "",
    role: undefined,
  };
  await formRef.value?.clearValidate();
};

const handleApply = async () => {
  try {
    await formRef.value?.validate();
    await applyLoan({ ...form.value });
  } catch {
    // 校验未通过时不提交
  }
};
</script>
<style scoped>
.loan-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.loan-card {
  background-color: var(--app-bg-container);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
}

.loan-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.section-header {
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 8px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--app-color-text);
}

.section-subtitle {
  font-size: 12px;
  color: var(--app-color-text-secondary);
  margin-top: 4px;
}

.loan-title {
  color: var(--app-color-text);
}

.scrollbar-w-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-w-none::-webkit-scrollbar {
  display: none;
}
</style>