<template>
  <div class="max-w-3xl mx-auto">
    <a-card
      class="email-normal-card shadow-sm rounded-xl backdrop-blur-sm"
      :body-style="{ padding: '18px 22px 14px' }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <div class="email-normal-title text-base font-medium">
            {{ $t('email.normalCardTitle') }}
          </div>
          <div class="email-normal-subtitle text-xs">
            {{ $t('email.normalCardSubtitle') }}
          </div>
        </div>
      </template>

      <a-form layout="vertical" :model="form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('email.labelSenderAccount')">
              <a-input
                v-model:value="form.senderAccount"
                :placeholder="$t('email.placeholderSenderAccount')"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('email.labelSenderPassword')">
              <a-input-password
                v-model:value="form.senderPassword"
                :placeholder="$t('email.placeholderSenderPassword')"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('email.labelSenderRole')">
              <a-select
                v-model:value="form.senderRole"
                :options="roleOptions"
                :placeholder="$t('email.placeholderSenderRole')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="$t('email.labelReceiver')">
              <a-input
                v-model:value="form.receiver"
                :placeholder="$t('email.placeholderReceiver')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="$t('email.labelSubjectShort')">
              <a-input
                v-model:value="form.title"
                :placeholder="$t('email.placeholderSubjectShort')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="$t('email.labelContentShort')">
              <a-textarea
                v-model:value="form.content"
                :auto-size="{ minRows: 6, maxRows: 14 }"
                :placeholder="$t('email.placeholderContentShort')"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="flex items-center justify-end gap-3 pt-2">
          <a-button
            type="primary"
            size="large"
            :loading="sending"
            @click="handleSend"
          >
            {{ $t('email.btnSendEmail') }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { EmailDto } from "../../apis/types";
import { useSendNormalEmail } from "./hook";

const { t } = useI18n();

const roleOptions = computed(() => [
  { value: "EXPORTER", label: t("email.roleExporter") },
  { value: "IMPORTER", label: t("email.roleImporter") },
  { value: "SUPPLIER", label: t("email.roleSupplier") },
  { value: "ISSUING_BANK", label: t("email.roleIssuingBank") },
  { value: "NEGOTIATING_BANK", label: t("email.roleNegotiatingBank") },
]);

const form = ref<EmailDto>({
  senderAccount: "",
  senderPassword: "",
  senderRole: "",
  receiver: "",
  title: "",
  content: "",
});

const { sending, sendNormalEmail } = useSendNormalEmail();

const handleSend = async () => {
  await sendNormalEmail(form.value);
};
</script>

<style scoped>
.email-normal-card {
  background-color: var(--app-bg-container);
  border: 1px solid var(--app-border-color);
  border-radius: 12px;
  color: var(--app-color-text);
}

.email-normal-title {
  color: var(--app-color-text);
}

.email-normal-subtitle {
  color: var(--app-color-text-secondary);
}
</style>