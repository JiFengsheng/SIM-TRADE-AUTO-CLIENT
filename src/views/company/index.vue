<template>
  <div class="company-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-6xl mx-auto py-8 px-4 lg:px-6">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('company.pageTitle') }}</h1>

      <a-card class="desk-card" :bordered="false">
        <template #title>
          <div class="section-header">
            <span class="section-title">{{ $t('company.sectionTitle') }}</span>
            <span class="section-subtitle">{{ $t('company.sectionSubtitle') }}</span>
          </div>
        </template>

        <a-tabs v-model:activeKey="activeCompanyCode" class="company-tabs">
          <a-tab-pane v-for="tab in COMPANY_TABS" :key="tab.code" :tab="tab.label">
            <a-spin :spinning="loading" :tip="$t('company.loadingTip')">
              <div class="pt-4">
                <!-- <div class="text-sm text-gray-500 mb-4">
                  {{ tab.subtitle }}
                </div> -->

                <a-form :ref="tab.code === activeCompanyCode ? formRef : undefined" :model="form" layout="vertical">
                  <a-row :gutter="16">
                    <a-col v-for="field in getFieldsByCode(tab.code)" :key="String(field.key)"
                      v-bind="getColProps(field)">
                      <a-form-item :label="field.label" :name="String(field.key)" :rules="getFieldRules(field)">
                        <a-textarea v-if="field.component === 'textarea'" v-model:value="(form as any)[field.key]"
                          :placeholder="field.placeholder" :auto-size="{ minRows: 3, maxRows: 8 }" allow-clear />
                        <a-input-password v-else-if="field.component === 'password'"
                          v-model:value="(form as any)[field.key]" :placeholder="field.placeholder" size="large"
                          allow-clear />
                        <a-input v-else v-model:value="(form as any)[field.key]" :placeholder="field.placeholder"
                          size="large" allow-clear />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <div class="flex items-center justify-end gap-3 pt-2">
                    <a-button size="large" @click="openImportModal" :disabled="loading || saving || exporting || importing">
                      {{ $t('company.btnImport') }}
                    </a-button>
                    <a-button size="large" @click="handleExport" :loading="exporting" :disabled="loading || saving">
                      {{ $t('company.btnExport') }}
                    </a-button>
                    <a-button size="large" @click="handleReset" :disabled="loading || saving">
                      {{ $t('company.btnReset') }}
                    </a-button>
                    <a-button type="primary" size="large" @click="handleSave" :loading="saving" :disabled="loading">
                      {{ $t('company.btnSave') }}
                    </a-button>
                  </div>
                </a-form>
              </div>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>

    <a-modal
      v-model:open="importModalOpen"
      :title="$t('company.modalImportTitle')"
      :confirmLoading="importing"
      :ok-text="$t('company.modalOk')"
      :cancel-text="$t('company.modalCancel')"
      @ok="handleImportOk"
      @cancel="handleImportCancel"
    >
      <a-upload
        v-model:fileList="importFileList"
        :max-count="1"
        :beforeUpload="beforeImportUpload"
        :showUploadList="true"
        accept=".xlsx,.xls,.csv"
      >
        <a-button>{{ $t('company.selectFile') }}</a-button>
      </a-upload>

      <div class="text-xs company-text-secondary mt-2">
        {{ $t('company.importHint') }}
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import companyApi from "../../apis/company";
import type { CompanyInfoDto } from "../../apis/types";
import { useCompanyProfile, type CompanyCode } from "./hook";

const { t } = useI18n();

type CompanyFieldKey = keyof CompanyInfoDto;
type FieldComponent = "input" | "textarea" | "password";

interface FieldDef {
  key: CompanyFieldKey;
  label: string;
  placeholder?: string;
  component?: FieldComponent;
  col?: { xs: number; md: number };
  required?: boolean;
}

const COMPANY_TABS = computed<Array<{ code: CompanyCode; label: string; subtitle: string }>>(() => [
  { code: "EXPORTER_COMPANY", label: t("company.tabExporter"), subtitle: "" },
  { code: "IMPORTER_COMPANY", label: t("company.tabImporter"), subtitle: "" },
  { code: "SUPPLIER_COMPANY", label: t("company.tabSupplier"), subtitle: "" },
  { code: "NEGOTIATING_BANK_COMPANY", label: t("company.tabNegotiatingBank"), subtitle: "" },
  { code: "ISSUING_BANK_COMPANY", label: t("company.tabIssuingBank"), subtitle: "" },
]);

const COMPANY_FIELDS = computed<Record<CompanyCode, FieldDef[]>>(() => {
  const accountPasswordFields: FieldDef[] = [
    { key: "account", label: t("company.labelAccount"), placeholder: t("company.placeholderAccount"), required: true },
    { key: "password", label: t("company.labelPassword"), placeholder: t("company.placeholderPassword"), component: "password" },
  ];

  return {
  EXPORTER_COMPANY: [
    ...accountPasswordFields,
    { key: "fullNameChinese", label: t("company.labelFullNameChinese"), placeholder: t("company.placeholderFullNameChinese") },
    { key: "fullNameEnglish", label: t("company.labelFullNameEnglish"), placeholder: t("company.placeholderFullNameEnglish") },
    { key: "abbreviationChinese", label: t("company.labelAbbreviationChinese"), placeholder: t("company.placeholderAbbreviationChinese") },
    { key: "abbreviationEnglish", label: t("company.labelAbbreviationEnglish"), placeholder: t("company.placeholderAbbreviationEnglish") },
    { key: "legalPersonChinese", label: t("company.labelLegalPersonChinese"), placeholder: t("company.placeholderLegalPersonChinese") },
    { key: "legalPersonEnglish", label: t("company.labelLegalPersonEnglish"), placeholder: t("company.placeholderLegalPersonEnglish") },
    { key: "phone", label: t("company.labelPhone"), placeholder: t("company.placeholderPhone") },
    { key: "fax", label: t("company.labelFax"), placeholder: t("company.placeholderFax") },
    { key: "postalCode", label: t("company.labelPostalCode"), placeholder: t("company.placeholderPostalCode") },
    { key: "website", label: t("company.labelWebsite"), placeholder: t("company.placeholderWebsite") },
    { key: "addressChinese", label: t("company.labelAddressChinese"), placeholder: t("company.placeholderAddressChinese"), col: { xs: 24, md: 24 } },
    { key: "addressEnglish", label: t("company.labelAddressEnglish"), placeholder: t("company.placeholderAddressEnglish"), col: { xs: 24, md: 24 } },
    { key: "introduction", label: t("company.labelIntroduction"), placeholder: t("company.placeholderIntroduction"), component: "textarea", col: { xs: 24, md: 24 } },
  ],
  IMPORTER_COMPANY: [
    ...accountPasswordFields,
    { key: "fullNameEnglish", label: t("company.labelFullName"), placeholder: t("company.placeholderFullNameEn"), col: { xs: 24, md: 24 } },
    { key: "abbreviationEnglish", label: t("company.labelAbbreviation"), placeholder: t("company.placeholderAbbreviationEn") },
    { key: "legalPersonEnglish", label: t("company.labelLegalPerson"), placeholder: t("company.placeholderLegalPersonEn") },
    { key: "phone", label: t("company.labelPhone"), placeholder: t("company.placeholderPhone") },
    { key: "fax", label: t("company.labelFax"), placeholder: t("company.placeholderFax") },
    { key: "website", label: t("company.labelWebsite"), placeholder: t("company.placeholderWebsite") },
    { key: "addressEnglish", label: t("company.labelAddressByCountry"), placeholder: t("company.placeholderAddressEnglish"), col: { xs: 24, md: 24 } },
    { key: "introduction", label: t("company.labelIntroduction"), placeholder: t("company.placeholderIntroduction"), component: "textarea", col: { xs: 24, md: 24 } },
  ],
  SUPPLIER_COMPANY: [
    ...accountPasswordFields,
    { key: "fullNameChinese", label: t("company.labelFullName"), placeholder: t("company.placeholderFullNameChinese"), col: { xs: 24, md: 24 } },
    { key: "abbreviationChinese", label: t("company.labelAbbreviation"), placeholder: t("company.placeholderAbbreviationChinese") },
    { key: "legalPersonChinese", label: t("company.labelLegalPerson"), placeholder: t("company.placeholderLegalPersonChinese") },
    { key: "phone", label: t("company.labelPhone"), placeholder: t("company.placeholderPhone") },
    { key: "fax", label: t("company.labelFax"), placeholder: t("company.placeholderFax") },
    { key: "postalCode", label: t("company.labelPostalCode"), placeholder: t("company.placeholderPostalCode") },
    { key: "website", label: t("company.labelWebsite"), placeholder: t("company.placeholderWebsite") },
    { key: "addressChinese", label: t("company.labelAddressChinese"), placeholder: t("company.placeholderAddressChinese"), col: { xs: 24, md: 24 } },
    { key: "introduction", label: t("company.labelIntroduction"), placeholder: t("company.placeholderIntroduction"), component: "textarea", col: { xs: 24, md: 24 } },
  ],
  NEGOTIATING_BANK_COMPANY: [
    ...accountPasswordFields,
    { key: "fullNameChinese", label: t("company.labelBankFullNameChinese"), placeholder: t("company.placeholderBankFullNameChinese") },
    { key: "fullNameEnglish", label: t("company.labelBankFullNameEnglish"), placeholder: t("company.placeholderBankFullNameEnglish") },
    { key: "abbreviationChinese", label: t("company.labelBankAbbreviationChinese"), placeholder: t("company.placeholderBankAbbreviationChinese") },
    { key: "abbreviationEnglish", label: t("company.labelBankAbbreviationEnglish"), placeholder: t("company.placeholderBankAbbreviationEnglish") },
    { key: "phone", label: t("company.labelPhone"), placeholder: t("company.placeholderPhone") },
    { key: "fax", label: t("company.labelFax"), placeholder: t("company.placeholderFax") },
    { key: "postalCode", label: t("company.labelPostalCode"), placeholder: t("company.placeholderPostalCode") },
    { key: "website", label: t("company.labelWebsite"), placeholder: t("company.placeholderWebsite") },
    { key: "addressChinese", label: t("company.labelBankAddressChinese"), placeholder: t("company.placeholderBankAddressChinese"), col: { xs: 24, md: 24 } },
    { key: "addressEnglish", label: t("company.labelBankAddressEnglish"), placeholder: t("company.placeholderBankAddressEnglish"), col: { xs: 24, md: 24 } },
    { key: "introduction", label: t("company.labelBankIntroduction"), placeholder: t("company.placeholderIntroduction"), component: "textarea", col: { xs: 24, md: 24 } },
  ],
  ISSUING_BANK_COMPANY: [
    ...accountPasswordFields,
    { key: "fullNameEnglish", label: t("company.labelBankFullName"), placeholder: t("company.placeholderBankFullNameEn"), col: { xs: 24, md: 24 } },
    { key: "abbreviationEnglish", label: t("company.labelBankAbbreviation"), placeholder: t("company.placeholderBankAbbreviationEn") },
    { key: "phone", label: t("company.labelPhone"), placeholder: t("company.placeholderPhone") },
    { key: "fax", label: t("company.labelFax"), placeholder: t("company.placeholderFax") },
    { key: "website", label: t("company.labelWebsite"), placeholder: t("company.placeholderWebsite") },
    { key: "addressEnglish", label: t("company.labelBankAddress"), placeholder: t("company.placeholderBankAddressEn"), col: { xs: 24, md: 24 } },
    { key: "introduction", label: t("company.labelBankIntroduction"), placeholder: t("company.placeholderIntroduction"), component: "textarea", col: { xs: 24, md: 24 } },
  ],
  };
});

const { activeCompanyCode, loading, saving, form, fetchCompany, saveCompany } = useCompanyProfile(
  "EXPORTER_COMPANY"
);

const formRef = ref<FormInstance>();

const getFieldsByCode = (code: CompanyCode) => COMPANY_FIELDS.value[code] || [];

const getColProps = (field: FieldDef) => field.col || { xs: 24, md: 12 };

const getFieldRules = (field: FieldDef) => {
  if (!field.required) return undefined;
  return [{ required: true, message: t("company.ruleAccount"), whitespace: true }];
};

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
    message.warning(t("company.msgSelectFile"));
    return;
  }

  importing.value = true;
  try {
    await companyApi.import(activeCompanyCode.value, file);
    message.success(t("company.msgImportSuccess"));
    importModalOpen.value = false;
    importFileList.value = [];
    await fetchCompany(activeCompanyCode.value);
  } catch (error) {
    console.error("导入失败", error);
    message.error(t("company.msgImportFail"));
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
    const { filename } = await companyApi.export(activeCompanyCode.value);
    message.success(t("company.msgExportSuccess", { filename }));
  } catch (error) {
    console.error("导出失败", error);
    message.error(t("company.msgExportFail"));
  } finally {
    exporting.value = false;
  }
};

const handleReset = async () => {
  try {
    await fetchCompany(activeCompanyCode.value);
    message.success(t("company.msgResetSuccess"));
  } catch (error) {
    console.error("重置失败", error);
    message.error(t("company.msgResetFail"));
  }
};

const handleSave = async () => {
  try {
    await formRef.value?.validate();
    await saveCompany(activeCompanyCode.value);
    message.success(t("company.msgSaveSuccess"));
  } catch (error) {
    if (error && typeof error === "object" && "errorFields" in error) return;
    console.error("保存失败", error);
    message.error(t("company.msgSaveFail"));
  }
};
</script>

<style scoped>
.company-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.desk-card {
  background-color: var(--app-bg-container);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
}

.desk-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.26);
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

.company-text-secondary {
  color: var(--app-color-text-secondary);
}

.company-tabs :deep(.ant-tabs-content-holder) {
  overflow-y: visible;
}

::deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--app-color-text);
}
</style>