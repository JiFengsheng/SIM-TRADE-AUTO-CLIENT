<template>
  <div class="company-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-5xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">公司管理</h1>

      <a-card class="desk-card" :bordered="false">
        <template #title>
          <div class="section-header">
            <span class="section-title">公司信息维护</span>
            <span class="section-subtitle">维护出口商、进口商、供应商、出口地银行、进口地银行的信息</span>
          </div>
        </template>

        <a-tabs v-model:activeKey="activeCompanyCode" class="company-tabs">
          <a-tab-pane v-for="tab in COMPANY_TABS" :key="tab.code" :tab="tab.label">
            <a-spin :spinning="loading" tip="加载中...">
              <div class="pt-4">
                <!-- <div class="text-sm text-gray-500 mb-4">
                  {{ tab.subtitle }}
                </div> -->

                <a-form :model="form" layout="vertical">
                  <a-row :gutter="16">
                    <a-col v-for="field in getFieldsByCode(tab.code)" :key="String(field.key)"
                      v-bind="getColProps(field)">
                      <a-form-item :label="field.label" :name="String(field.key)">
                        <a-textarea v-if="field.component === 'textarea'" v-model:value="(form as any)[field.key]"
                          :placeholder="field.placeholder" :auto-size="{ minRows: 3, maxRows: 8 }" allow-clear />
                        <a-input v-else v-model:value="(form as any)[field.key]" :placeholder="field.placeholder"
                          size="large" allow-clear />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <div class="flex items-center justify-end gap-3 pt-2">
                    <a-button size="large" @click="openImportModal" :disabled="loading || saving || exporting || importing">
                      导入
                    </a-button>
                    <a-button size="large" @click="handleExport" :loading="exporting" :disabled="loading || saving">
                      导出
                    </a-button>
                    <a-button size="large" @click="handleReset" :disabled="loading || saving">
                      重置
                    </a-button>
                    <a-button type="primary" size="large" @click="handleSave" :loading="saving" :disabled="loading">
                      保存
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
      title="导入公司信息"
      :confirmLoading="importing"
      ok-text="开始导入"
      cancel-text="取消"
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
        <a-button>选择文件</a-button>
      </a-upload>

      <div class="text-xs text-gray-500 mt-2">
        请选择要导入的文件（建议使用导出模板）。
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { ref } from "vue";
import companyApi from "../../apis/company";
import type { CompanyInfoDto } from "../../apis/types";
import { useCompanyProfile, type CompanyCode } from "./hook";

type CompanyFieldKey = keyof CompanyInfoDto;
type FieldComponent = "input" | "textarea";

interface FieldDef {
  key: CompanyFieldKey;
  label: string;
  placeholder?: string;
  component?: FieldComponent;
  col?: { xs: number; md: number };
}

const COMPANY_TABS: Array<{ code: CompanyCode; label: string; subtitle: string }> = [
  { code: "EXPORTER_COMPANY", label: "出口商信息", subtitle: "维护出口商公司信息（中英文字段更完整）" },
  { code: "IMPORTER_COMPANY", label: "进口商信息", subtitle: "维护进口商公司信息（主要为英文信息）" },
  { code: "SUPPLIER_COMPANY", label: "供应商信息", subtitle: "维护供应商/工厂公司信息（中文信息为主）" },
  { code: "NEGOTIATING_BANK_COMPANY", label: "出口地银行信息", subtitle: "维护出口地银行信息（中英文字段更完整）" },
  { code: "ISSUING_BANK_COMPANY", label: "进口地银行信息", subtitle: "维护进口地银行信息（主要为英文信息）" },
];

const COMMON_PLACEHOLDERS = {
  phone: "请输入电话",
  fax: "请输入传真",
  postalCode: "请输入邮政编码",
  website: "请输入网址（如：https://example.com）",
  introduction: "请输入介绍（建议简要说明）",
};

const COMPANY_FIELDS: Record<CompanyCode, FieldDef[]> = {
  EXPORTER_COMPANY: [
    { key: "fullNameChinese", label: "公司全称（中文）", placeholder: "请输入公司全称（中文）" },
    { key: "fullNameEnglish", label: "公司全称（英文）", placeholder: "请输入公司全称（英文）" },
    { key: "abbreviationChinese", label: "公司简称（中文）", placeholder: "请输入公司简称（中文）" },
    { key: "abbreviationEnglish", label: "公司简称（英文）", placeholder: "请输入公司简称（英文）" },
    { key: "legalPersonChinese", label: "企业法人（中文）", placeholder: "请输入企业法人（中文）" },
    { key: "legalPersonEnglish", label: "企业法人（英文）", placeholder: "请输入企业法人（英文）" },
    { key: "phone", label: "电话", placeholder: COMMON_PLACEHOLDERS.phone },
    { key: "fax", label: "传真", placeholder: COMMON_PLACEHOLDERS.fax },
    { key: "postalCode", label: "邮政编码", placeholder: COMMON_PLACEHOLDERS.postalCode },
    { key: "website", label: "网址", placeholder: COMMON_PLACEHOLDERS.website },
    { key: "addressChinese", label: "公司地址（中文）", placeholder: "请输入公司地址（中文）", col: { xs: 24, md: 24 } },
    { key: "addressEnglish", label: "公司地址（英文）", placeholder: "请输入公司地址（英文）", col: { xs: 24, md: 24 } },
    {
      key: "introduction",
      label: "公司介绍",
      placeholder: COMMON_PLACEHOLDERS.introduction,
      component: "textarea",
      col: { xs: 24, md: 24 },
    },
  ],
  IMPORTER_COMPANY: [
    { key: "fullNameEnglish", label: "公司全称", placeholder: "请输入公司全称（英文）", col: { xs: 24, md: 24 } },
    { key: "abbreviationEnglish", label: "公司简称", placeholder: "请输入公司简称（英文）" },
    { key: "legalPersonEnglish", label: "企业法人", placeholder: "请输入企业法人（英文）" },
    { key: "phone", label: "电话", placeholder: COMMON_PLACEHOLDERS.phone },
    { key: "fax", label: "传真", placeholder: COMMON_PLACEHOLDERS.fax },
    { key: "website", label: "网址", placeholder: COMMON_PLACEHOLDERS.website },
    {
      key: "addressEnglish",
      label: "公司地址（注意应根据所属国家来填写）",
      placeholder: "请输入公司地址（英文）",
      col: { xs: 24, md: 24 },
    },
    {
      key: "introduction",
      label: "公司介绍",
      placeholder: COMMON_PLACEHOLDERS.introduction,
      component: "textarea",
      col: { xs: 24, md: 24 },
    },
  ],
  SUPPLIER_COMPANY: [
    { key: "fullNameChinese", label: "公司全称", placeholder: "请输入公司全称（中文）", col: { xs: 24, md: 24 } },
    { key: "abbreviationChinese", label: "公司简称", placeholder: "请输入公司简称（中文）" },
    { key: "legalPersonChinese", label: "企业法人", placeholder: "请输入企业法人（中文）" },
    { key: "phone", label: "电话", placeholder: COMMON_PLACEHOLDERS.phone },
    { key: "fax", label: "传真", placeholder: COMMON_PLACEHOLDERS.fax },
    { key: "postalCode", label: "邮政编码", placeholder: COMMON_PLACEHOLDERS.postalCode },
    { key: "website", label: "网址", placeholder: COMMON_PLACEHOLDERS.website },
    { key: "addressChinese", label: "公司地址", placeholder: "请输入公司地址（中文）", col: { xs: 24, md: 24 } },
    {
      key: "introduction",
      label: "公司介绍",
      placeholder: COMMON_PLACEHOLDERS.introduction,
      component: "textarea",
      col: { xs: 24, md: 24 },
    },
  ],
  NEGOTIATING_BANK_COMPANY: [
    { key: "fullNameChinese", label: "银行全称（中文）", placeholder: "请输入银行全称（中文）" },
    { key: "fullNameEnglish", label: "银行全称（英文）", placeholder: "请输入银行全称（英文）" },
    { key: "abbreviationChinese", label: "银行简称（中文）", placeholder: "请输入银行简称（中文）" },
    { key: "abbreviationEnglish", label: "银行简称（英文）", placeholder: "请输入银行简称（英文）" },
    { key: "phone", label: "电话", placeholder: COMMON_PLACEHOLDERS.phone },
    { key: "fax", label: "传真", placeholder: COMMON_PLACEHOLDERS.fax },
    { key: "postalCode", label: "邮政编码", placeholder: COMMON_PLACEHOLDERS.postalCode },
    { key: "website", label: "网址", placeholder: COMMON_PLACEHOLDERS.website },
    { key: "addressChinese", label: "银行地址（中文）", placeholder: "请输入银行地址（中文）", col: { xs: 24, md: 24 } },
    { key: "addressEnglish", label: "银行地址（英文）", placeholder: "请输入银行地址（英文）", col: { xs: 24, md: 24 } },
    {
      key: "introduction",
      label: "银行介绍",
      placeholder: COMMON_PLACEHOLDERS.introduction,
      component: "textarea",
      col: { xs: 24, md: 24 },
    },
  ],
  ISSUING_BANK_COMPANY: [
    { key: "fullNameEnglish", label: "银行全称", placeholder: "请输入银行全称（英文）", col: { xs: 24, md: 24 } },
    { key: "abbreviationEnglish", label: "银行简称", placeholder: "请输入银行简称（英文）" },
    { key: "phone", label: "电话", placeholder: COMMON_PLACEHOLDERS.phone },
    { key: "fax", label: "传真", placeholder: COMMON_PLACEHOLDERS.fax },
    { key: "website", label: "网址", placeholder: COMMON_PLACEHOLDERS.website },
    { key: "addressEnglish", label: "银行地址", placeholder: "请输入银行地址（英文）", col: { xs: 24, md: 24 } },
    {
      key: "introduction",
      label: "银行介绍",
      placeholder: COMMON_PLACEHOLDERS.introduction,
      component: "textarea",
      col: { xs: 24, md: 24 },
    },
  ],
};

const { activeCompanyCode, loading, saving, form, fetchCompany, saveCompany } = useCompanyProfile(
  "EXPORTER_COMPANY"
);

const getFieldsByCode = (code: CompanyCode) => COMPANY_FIELDS[code] || [];

const getColProps = (field: FieldDef) => field.col || { xs: 24, md: 12 };

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
    message.warning("请先选择要导入的文件");
    return;
  }

  importing.value = true;
  try {
    await companyApi.import(activeCompanyCode.value, file);
    message.success("导入成功");
    importModalOpen.value = false;
    importFileList.value = [];
    await fetchCompany(activeCompanyCode.value);
  } catch (error) {
    console.error("导入失败", error);
    message.error("导入失败，请稍后重试");
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
    message.success(`导出成功：${filename}`);
  } catch (error) {
    console.error("导出失败", error);
    message.error("导出失败，请稍后重试");
  } finally {
    exporting.value = false;
  }
};

const handleReset = async () => {
  try {
    await fetchCompany(activeCompanyCode.value);
    message.success("已重置为最新数据");
  } catch (error) {
    console.error("重置失败", error);
    message.error("重置失败，请稍后重试");
  }
};

const handleSave = async () => {
  try {
    await saveCompany(activeCompanyCode.value);
    message.success("保存成功");
  } catch (error) {
    console.error("保存失败", error);
    message.error("保存失败，请稍后重试");
  }
};
</script>

<style scoped>
.company-page {
  background-color: var(--ant-bg-color);
}

.desk-card {
  background-color: var(--ant-bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.desk-card:hover {
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
}

.section-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.company-tabs :deep(.ant-tabs-content-holder) {
  overflow-y: visible;
}

::deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--ant-text-color);
}
</style>