<template>
  <div class="max-w-3xl mx-auto">
    <a-card
      class="info-card shadow-sm rounded-xl border-0 backdrop-blur-sm"
      :body-style="{ padding: '18px 22px 14px' }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <div class="text-base font-medium info-text">
            {{ $t('advertisement.infoCardTitle') }}
          </div>
          <div class="text-xs info-text-secondary">
            {{ $t('advertisement.infoCardSubtitle') }}
          </div>
        </div>
      </template>

      <a-form ref="formRef" layout="vertical" :model="form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              :label="$t('advertisement.labelAccount')"
              name="account"
              :rules="[{ required: true, message: t('advertisement.ruleAccount') }]"
            >
              <a-input
                v-model:value="form.account"
                :placeholder="$t('advertisement.placeholderAccount')"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('advertisement.labelPassword')"
              name="password"
              :rules="[{ required: true, message: t('advertisement.rulePassword') }]"
            >
              <a-input-password
                v-model:value="form.password"
                :placeholder="$t('advertisement.placeholderPassword')"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              :label="$t('advertisement.labelRole')"
              name="roleCode"
              :rules="[{ required: true, message: t('advertisement.ruleRole') }]"
            >
              <a-select
                v-model:value="form.roleCode"
                :options="roleOptions"
                :placeholder="$t('advertisement.placeholderRole')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              :label="$t('advertisement.labelPublishType')"
              name="publishInfoType"
              :rules="[{ required: true, message: t('advertisement.rulePublishType') }]"
            >
              <a-select
                v-model:value="form.publishInfoType"
                :options="infoTypeOptions"
                :placeholder="$t('advertisement.placeholderPublishType')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              :label="$t('advertisement.labelTitle')"
              name="title"
              :rules="[{ required: true, message: t('advertisement.ruleTitle') }]"
            >
              <a-input
                v-model:value="form.title"
                :placeholder="$t('advertisement.placeholderTitle')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              :label="$t('advertisement.labelKeywords')"
              name="keywords"
              :rules="[{ required: true, message: t('advertisement.ruleKeywords') }]"
            >
              <a-input
                v-model:value="form.keywords"
                :placeholder="$t('advertisement.placeholderKeywords')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              :label="$t('advertisement.labelContent')"
              name="content"
              :rules="[{ required: true, message: t('advertisement.ruleInfoContent') }]"
            >
              <a-textarea
                v-model:value="form.content"
                :auto-size="{ minRows: 6, maxRows: 14 }"
                :placeholder="$t('advertisement.placeholderInfoContent')"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="flex items-center justify-end gap-3 pt-2">
          <a-button
            type="primary"
            size="large"
            :loading="submitting"
            @click="handlePublish"
          >
            {{ $t('advertisement.btnPublishInfo') }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "ant-design-vue";
import type { PublishInfoDto } from "../../apis/types";
import {
  ROLE_OPTIONS,
  INFO_TYPE_OPTIONS,
  usePublishInfo,
} from "./hook";

const { t } = useI18n();

const roleOptions = computed(() =>
  ROLE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))
);
const infoTypeOptions = computed(() =>
  INFO_TYPE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))
);

const formRef = ref<FormInstance>();

const form = ref<PublishInfoDto>({
  account: "",
  password: "",
  roleCode: undefined,
  title: "",
  keywords: "",
  publishInfoType: undefined,
  content: "",
});

const { submitting, publishInfo } = usePublishInfo();

const handlePublish = async () => {
  try {
    await formRef.value?.validate();
    await publishInfo(form.value);
  } catch (error) {
    // 校验未通过时不提交
  }
};
</script>

<style scoped>
.info-card {
  background-color: var(--app-bg-container) !important;
  color: var(--app-color-text);
}

.info-text {
  color: var(--app-color-text);
}

.info-text-secondary {
  color: var(--app-color-text-secondary);
}
</style>
