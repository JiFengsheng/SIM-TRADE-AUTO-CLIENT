<template>
  <div class="space-y-4">
    <div class="space-x-2">
      <a-button type="primary" @click="handleReadEmails('EXPORTER')">{{ $t('email.btnReadEmailsExporter') }}</a-button>
      <a-button type="primary" @click="handleReadEmails('IMPORTER')">{{ $t('email.btnReadEmailsImporter') }}</a-button>
      <a-button type="primary" @click="handleReadEmails('SUPPLIER')">{{ $t('email.btnReadEmailsSupplier') }}</a-button>
      <a-button type="primary" @click="handleReadEmails('ISSUING_BANK')">{{ $t('email.btnReadEmailsIssuingBank') }}</a-button>
      <a-button type="primary" @click="handleReadEmails('NEGOTIATING_BANK')">{{ $t('email.btnReadEmailsNegotiatingBank') }}</a-button>
    </div>

    <a-card
      v-for="(item, index) in BUSINESS_EMAIL_CONFIG"
      :key="item.code"
      class="email-business-card shadow-sm rounded-xl border backdrop-blur-sm"
      :body-style="{ padding: '16px 18px 12px' }"
    >
      <template #title>
        <div class="flex items-center justify-between gap-3 pr-2">
          <div class="flex items-center gap-3">
            <div
              class="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white text-xs font-semibold shadow-sm"
            >
              {{ index + 1 }}
            </div>
            <div>
              <div class="email-business-title text-sm font-medium">
                {{ $t(item.labelKey) }}
              </div>
              <div class="email-business-subtitle text-xs mt-0.5">
                {{ $t(item.descKey) }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <a-form layout="vertical" class="pt-2">
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item :label="$t('email.labelSubject')">
              <a-input
                v-model:value="getEmail(item.templateKey).title"
                :placeholder="$t('email.placeholderSubject')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :label="$t('email.labelContent')">
              <a-textarea
                v-model:value="getEmail(item.templateKey).content"
                :auto-size="{ minRows: 4, maxRows: 10 }"
                :placeholder="$t('email.placeholderContent')"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="flex items-center justify-end gap-3 pt-1">
          <a-button
            size="middle"
            :loading="saving"
            :disabled="loading"
            @click="handleSave(item.templateKey)"
          >
            {{ $t('email.btnSaveTemplate') }}
          </a-button>
          <a-button
            type="primary"
            size="middle"
            :loading="sendingMap[item.code]"
            :disabled="loading"
            @click="handleSend(item.code, item.templateKey)"
          >
            {{ $t('email.btnSendEmail') }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { onMounted } from "vue";
import type { EmailDto, EmailTemplateDto, EmailSendType } from "../../apis/types";
import {
  BUSINESS_EMAIL_CONFIG,
  useEmailTemplate,
  useSendBusinessEmail,
  useReadEmails
} from "./hook";
import { useI18n } from 'vue-i18n';

type TemplateKey = keyof EmailTemplateDto;

const { loading, saving, template, fetchTemplate, saveTemplate, getEmailByKey } = useEmailTemplate();
const { sendingMap, sendBusinessEmail } = useSendBusinessEmail();
const { reading, readEmails } = useReadEmails();
const { t } = useI18n();
const handleReadEmails = async (role: string) => {
  const hideLoading = message.loading(t('email.readingEmails'), 0);
  try{
    const ok = await readEmails(role);

  }catch(error) {
    
    
  }finally{
    hideLoading()
  }
  
};

const getEmail = (key: TemplateKey): EmailDto => {
  return getEmailByKey(key);
};

const handleSave = async (key: TemplateKey) => {
  // 只需整体模板保存，当前 template 已经被响应式更新
  await saveTemplate(template.value);
};

const handleSend = async (type: EmailSendType, key: TemplateKey) => {
  const email = getEmail(key);
  await sendBusinessEmail(type, {
    title: email.title,
    content: email.content,
    contractNo: email.contractNo,
  });
};

onMounted(() => {
  fetchTemplate();
});

</script>

<style scoped>
.email-business-card {
  border-radius: 12px;
  border-color: var(--app-border-color);
  background-color: var(--app-bg-container);
  color: var(--app-color-text);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  transition: all 0.22s ease;
}

.email-business-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  /* border-color: var(--theme-primary-color, #1677ff); */
}

.email-business-title {
  color: var(--app-color-text);
}

.email-business-subtitle {
  color: var(--app-color-text-secondary);
}
</style>