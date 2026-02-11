<template>
  <div class="desk-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-5xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('contract.pageTitle') }}</h1>

      <a-form :model="form" :rules="rules" layout="vertical">
        <!-- 网址设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.urlSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.urlSectionDesc') }}</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.baseUrlLabel')" name="baseUrl">
                <a-input
                  v-model:value="form.baseUrl"
                  :placeholder="$t('contract.baseUrlPlaceholder')"
                  size="large"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 账号设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.accountSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.accountSectionDesc') }}</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportAccount')" name="exportAccount">
                <a-input v-model:value="form.exportAccount" :placeholder="$t('contract.placeholderExportAccount')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportPassword')" name="exportPassword">
                <a-input-password v-model:value="form.exportPassword" :placeholder="$t('contract.placeholderExportPassword')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.importAccount')" name="importAccount">
                <a-input v-model:value="form.importAccount" :placeholder="$t('contract.placeholderImportAccount')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.importPassword')" name="importPassword">
                <a-input-password v-model:value="form.importPassword" :placeholder="$t('contract.placeholderImportPassword')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.supplierAccount')" name="supplierAccount">
                <a-input v-model:value="form.supplierAccount" :placeholder="$t('contract.placeholderSupplierAccount')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.supplierPassword')" name="supplierPassword">
                <a-input-password v-model:value="form.supplierPassword" :placeholder="$t('contract.placeholderSupplierPassword')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.negotiatingBankAccount')" name="negotiatingBankAccount">
                <a-input v-model:value="form.negotiatingBankAccount" :placeholder="$t('contract.placeholderNegotiatingBankAccount')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.negotiatingBankPassword')" name="negotiatingBankPassword">
                <a-input-password v-model:value="form.negotiatingBankPassword" :placeholder="$t('contract.placeholderNegotiatingBankPassword')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.issuingBankAccount')" name="issuingBankAccount">
                <a-input v-model:value="form.issuingBankAccount" :placeholder="$t('contract.placeholderIssuingBankAccount')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.issuingBankPassword')" name="issuingBankPassword">
                <a-input-password v-model:value="form.issuingBankPassword" :placeholder="$t('contract.placeholderIssuingBankPassword')" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 贸易设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.tradeSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.tradeSectionDesc') }}</span>
            </div>
          </template>
          
          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.trade')" name="trade">
                <a-select v-model:value="form.trade" :placeholder="$t('contract.selectTrade')" size="large" class="w-full">
                  <a-select-option value="CIF">CIF</a-select-option>
                  <a-select-option value="CFR">CFR</a-select-option>
                  <a-select-option value="FOB">FOB</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.payment')" name="payment">
                <a-select v-model:value="form.payment" :placeholder="$t('contract.selectPayment')" size="large" class="w-full">
                  <a-select-option value="L/C">L/C</a-select-option>
                  <a-select-option value="D/P">D/P</a-select-option>
                  <a-select-option value="D/A">D/A</a-select-option>
                  <a-select-option value="T/T">T/T</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 通用设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.generalSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.generalSectionDesc') }}</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportPortZh')" name="exportPort">
                <a-select v-model:value="form.exportPort" :placeholder="$t('contract.selectExportPort')" size="large" class="w-full" @change="handleExportPortChange($event)" :disabled="inPortLoading">
                  <a-select-option v-for="harbor in inPort" :key="harbor.harborId" :value="harbor.harborPortChinese">
                    {{ harbor.harborPortChinese }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportPortEn')" name="exportPortEng">
                <a-select v-model:value="form.exportPortEng" :placeholder="$t('contract.selectExportPort')" size="large" class="w-full" @change="handleExportPortEngChange($event)" :disabled="inPortLoading">
                  <a-select-option v-for="harbor in inPort" :key="harbor.harborId" :value="harbor.harborPortEnglish">
                    {{ harbor.harborPortEnglish }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.importCountryZh')" name="importCity">
                <a-input v-model:value="form.importCity" :placeholder="$t('contract.placeholderImportCountry')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="importCityEng">
                <template #label>
                  <span>{{ $t('contract.importCountryEn') }}</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">{{ $t('contract.getBtn') }}</a-button></span>
                </template>
                <a-input v-model:value="form.importCityEng" :placeholder="$t('contract.placeholderImportCountryEn')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.importPortZh')" name="importPort">
                <a-select v-model:value="form.importPort" :placeholder="$t('contract.selectImportPort')" size="large" class="w-full" @change="handleImportPortChange($event)">
                  <a-select-option v-for="harbor in harbors" :key="harbor.harborId" :value="harbor.harborPortChinese">
                    {{ harbor.harborPortChinese }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.importPortEn')" name="importPortEng">
                <a-select v-model:value="form.importPortEng" :placeholder="$t('contract.selectImportPort')" size="large" class="w-full" @change="handleImportPortEngChange($event)">
                  <a-select-option v-for="harbor in harbors" :key="harbor.harborId" :value="harbor.harborPortEnglish">
                    {{ harbor.harborPortEnglish }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 合同设置 -->
        <a-card class="desk-card mb-6" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.contractSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.contractSectionDesc') }}</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportContractCode')" name="exportContractCode">
                <a-input v-model:value="form.exportContractCode" :placeholder="$t('contract.placeholderExportContractCode')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.goodsNo')" name="goodsNo">
                <a-input v-model:value="form.goodsNo" :placeholder="$t('contract.placeholderGoodsNo')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.transactionVolume')" name="transactionVolume">
                <a-input-number v-model:value="form.transactionVolume" :min="0" :precision="0" class="w-full"
                  :placeholder="$t('contract.placeholderTransactionVolume')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.marketPrice')" name="marketPrice">
                <a-input-number v-model:value="form.marketPrice" :min="0" :precision="2" class="w-full"
                  :placeholder="$t('contract.placeholderMarketPrice')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportPrice')" name="exportPrice">
                <a-input-number v-model:value="form.exportPrice" :min="0" :precision="2" class="w-full"
                  :placeholder="$t('contract.placeholderExportPrice')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="exportPriceUnit">
                <template #label>
                  <span>{{ $t('contract.exportPriceUnit') }}</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">{{ $t('contract.getBtn') }}</a-button></span>
                </template>
                <a-select v-model:value="form.exportPriceUnit" :placeholder="$t('contract.selectPriceUnit')" size="large" class="w-full">
                  <a-select-option value="AUD">AUD</a-select-option>
                  <a-select-option value="CAD">CAD</a-select-option>
                  <a-select-option value="CHF">CHF</a-select-option>
                  <a-select-option value="EUR">EUR</a-select-option>
                  <a-select-option value="GBP">GBP</a-select-option>
                  <a-select-option value="HKD">HKD</a-select-option>
                  <a-select-option value="JPY">JPY</a-select-option>
                  <a-select-option value="RMB">RMB</a-select-option>
                  <a-select-option value="SEK">SEK</a-select-option>
                  <a-select-option value="SGD">SGD</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item name="exchangeRate">
                <template #label>
                  <span>{{ $t('contract.exchangeRate') }}</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">{{ $t('contract.getBtn') }}</a-button></span>
                </template>
                <a-input-number v-model:value="form.exchangeRate" :min="0" :precision="4" class="w-full"
                  :placeholder="$t('contract.placeholderExchangeRate')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.innerContractCode')" name="innerContractCode">
                <a-input v-model:value="form.innerContractCode" :placeholder="$t('contract.placeholderInnerContractCode')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.supplierPrice')" name="supplierPrice">
                <a-input-number v-model:value="form.supplierPrice" :min="0" :precision="2" class="w-full"
                  :placeholder="$t('contract.placeholderSupplierPrice')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.originType')" name="originType">
                <a-select v-model:value="form.originType" :placeholder="$t('contract.selectOriginType')" size="large" class="w-full">
                  <a-select-option value="ORIGIN">{{ $t('contract.originTypeORIGIN') }}</a-select-option>
                  <a-select-option value="GSP">{{ $t('contract.originTypeGSP') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="usdRate">
                <template #label>
                  <span>{{ $t('contract.usdRate') }}</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">{{ $t('contract.getBtn') }}</a-button></span>
                </template>
                <a-input-number v-model:value="form.usdRate" :min="0" :precision="4" class="w-full"
                  :placeholder="$t('contract.placeholderUsdRate')" size="large" />
              </a-form-item>
            </a-col>

          </a-row>
        </a-card>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-end gap-3">
          <a-button size="large" @click="goToDesk">
            {{ $t('sidebar.desk') }}
          </a-button>
          <a-button type="primary" size="large" @click="handleSave" :loading="saving">
            {{ $t('contract.saveSettings') }}
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import type { BusinessConfig } from '../../apis/types';
import businessConfigApi from '../../apis/businessConfig';
import { useGetCurrentInfo,useGetCrawlRate } from './hook';
import { useListHarbors, useListInPort } from './hook';

const { t } = useI18n();
const { getCurrentInfo, loading: loadingCurrentInfo, currentInfo: currentInfoCurrentInfo  } = useGetCurrentInfo();
const { crawlRate, loading: loadingCrawlRate, getCrawlRate } = useGetCrawlRate();
const handleGetCrawlRate = async () => {
  await getCrawlRate(form.value.importAccount,form.value.importPassword);
  form.value.usdRate = crawlRate.value.usdRate || form.value.usdRate;
  form.value.exportPriceUnit = crawlRate.value.exportPriceUnit || form.value.exportPriceUnit;
  form.value.exchangeRate = crawlRate.value.exchangeRate || form.value.exchangeRate;
  form.value.importCityEng = crawlRate.value.countryEnglish || form.value.importCityEng
  form.value.importCity = crawlRate.value.countryChinese || form.value.importCity
  await fetchHarbors(crawlRate.value.countryEnglish);
}

const { loading: harborsLoading, harbors, engToChn, chnToEng, fetchHarbors } = useListHarbors();
const { loading: inPortLoading, inPort, engToChn: inPortEngToChn, chnToEng: inPortChnToEng, fetchInPort } = useListInPort();
const handleImportPortChange = (event: any) => {
  console.log("event",event)
  form.value.importPort = event;
  form.value.importPortEng = chnToEng.value[event] || form.value.importPortEng;
}
const handleImportPortEngChange = (event: any) => {
  console.log("event",event)
  form.value.importPortEng = event;
  form.value.importPort = engToChn.value[event] || form.value.importPort;
}

const handleExportPortChange = (event: any) => {
  console.log("event",event)
  form.value.exportPort = event;
  form.value.exportPortEng = inPortChnToEng.value[event] || form.value.exportPortEng;
}
const handleExportPortEngChange = (event: any) => {
  console.log("event",event)
  form.value.exportPortEng = event;
  form.value.exportPort = inPortEngToChn.value[event] || form.value.exportPort;
}
const form = ref<BusinessConfig>({
  exportPriceUnit: 'USD',
});

const rules = computed(() => ({
  exportAccount: [{ required: true, message: t('contract.placeholderExportAccount'), trigger: 'blur' }],
  exportPassword: [{ required: true, message: t('contract.placeholderExportPassword'), trigger: 'blur' }],
  importAccount: [{ required: true, message: t('contract.placeholderImportAccount'), trigger: 'blur' }],
  importPassword: [{ required: true, message: t('contract.placeholderImportPassword'), trigger: 'blur' }],
  supplierAccount: [{ required: true, message: t('contract.placeholderSupplierAccount'), trigger: 'blur' }],
  supplierPassword: [{ required: true, message: t('contract.placeholderSupplierPassword'), trigger: 'blur' }],
  negotiatingBankAccount: [{ required: true, message: t('contract.placeholderNegotiatingBankAccount'), trigger: 'blur' }],
  negotiatingBankPassword: [{ required: true, message: t('contract.placeholderNegotiatingBankPassword'), trigger: 'blur' }],
  issuingBankAccount: [{ required: true, message: t('contract.placeholderIssuingBankAccount'), trigger: 'blur' }],
  issuingBankPassword: [{ required: true, message: t('contract.placeholderIssuingBankPassword'), trigger: 'blur' }],
}));

const saving = ref(false);
const executing = ref(false);

const router = useRouter();
const goToDesk = () => {
  router.push('/desk');
};

// 加载当前业务配置
const loadConfig = async () => {
  try {
    const res = await businessConfigApi.getCurrent();
    console.log("res",res)
    if (res) {
      form.value = {
        exportPriceUnit: 'USD',
        ...res,
      };
    }
  } catch (error) {
    console.error('加载业务配置失败', error);
  }
};
// const isShowExecute = computed(() => menuStore.collapsed);


// 保存配置：有 configId 则更新，否则创建
const handleSave = async () => {
  saving.value = true;
  try {
    const payload: BusinessConfig = { ...form.value };
    if (payload.configId) {
      await businessConfigApi.update(payload.configId, payload);
    } else {
      await businessConfigApi.create(payload);
    }
    message.success(t('contract.msgSaveSuccess'));
    await loadConfig();
  } catch (error) {
    console.error('保存配置失败', error);
    message.error(t('contract.msgSaveFail'));
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadConfig();
  await getCurrentInfo();
  await fetchHarbors(currentInfoCurrentInfo.value.importCityEng);
  await fetchInPort();
  console.log("currentInfo",currentInfoCurrentInfo.value)
  console.log("harbors",harbors.value)
  console.log("engToChn",engToChn.value)
  console.log("chnToEng",chnToEng.value)
  console.log("inPort",inPort.value)
  console.log("inPortEngToChn",inPortEngToChn.value)
  console.log("inPortChnToEng",inPortChnToEng.value)
});
</script>

<style scoped>
.desk-page {
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

::deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--app-color-text);
}
</style>