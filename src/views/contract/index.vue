<template>
  <div class="desk-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-5xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">合同管理</h1>

      <a-form :model="form" layout="vertical">
        <!-- 网址设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">网址设置</span>
              <span class="section-subtitle">配置外贸实习平台的域名地址</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="24">
              <a-form-item label="外贸实习平台网址" name="baseUrl">
                <a-input
                  v-model:value="form.baseUrl"
                  placeholder="请输入 外贸实习平台的域名地址（示例：https://course01.simtrade.net）"
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
              <span class="section-title">账号设置</span>
              <span class="section-subtitle">配置贸易相关参与方的账号与密码</span>
            </div>
          </template>

          <a-row :gutter="16">
            <!-- 出口商账号密码 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="出口商账号" name="exportAccount">
                <a-input v-model:value="form.exportAccount" placeholder="请输入出口商账号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="出口商密码" name="exportPassword">
                <a-input-password v-model:value="form.exportPassword" placeholder="请输入出口商密码" size="large" />
              </a-form-item>
            </a-col>

            <!-- 进口商账号密码 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="进口商账号" name="importAccount">
                <a-input v-model:value="form.importAccount" placeholder="请输入进口商账号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="进口商密码" name="importPassword">
                <a-input-password v-model:value="form.importPassword" placeholder="请输入进口商密码" size="large" />
              </a-form-item>
            </a-col>

            <!-- 供应商账号密码 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="供应商账号" name="supplierAccount">
                <a-input v-model:value="form.supplierAccount" placeholder="请输入供应商账号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="供应商密码" name="supplierPassword">
                <a-input-password v-model:value="form.supplierPassword" placeholder="请输入供应商密码" size="large" />
              </a-form-item>
            </a-col>

            <!-- 出口地银行账号密码 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="出口地银行账号" name="negotiatingBankAccount">
                <a-input v-model:value="form.negotiatingBankAccount" placeholder="请输入出口地银行账号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="出口地银行密码" name="negotiatingBankPassword">
                <a-input-password v-model:value="form.negotiatingBankPassword" placeholder="请输入出口地银行密码" size="large" />
              </a-form-item>
            </a-col>

            <!-- 进口地银行账号密码 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="进口地银行账号" name="issuingBankAccount">
                <a-input v-model:value="form.issuingBankAccount" placeholder="请输入进口地银行账号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="进口地银行密码" name="issuingBankPassword">
                <a-input-password v-model:value="form.issuingBankPassword" placeholder="请输入进口地银行密码" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 贸易设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">贸易设置</span>
              <span class="section-subtitle">配置贸易相关参数</span>
            </div>
          </template>
          
          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item label="贸易术语" name="trade">
                <a-select v-model:value="form.trade" placeholder="请选择贸易术语" size="large" class="w-full">
                  <a-select-option value="CIF">CIF</a-select-option>
                  <a-select-option value="CFR">CFR</a-select-option>
                  <a-select-option value="FOB">FOB</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="结算方式" name="payment">
                <a-select v-model:value="form.payment" placeholder="请选择结算方式" size="large" class="w-full">
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
              <span class="section-title">通用设置</span>
              <span class="section-subtitle">配置进出口港口及国家信息</span>
            </div>
          </template>

          <a-row :gutter="16">
            <!-- 出口港 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="出口港（中文）" name="exportPort">
                <!-- <a-input v-model:value="form.exportPort" placeholder="如：上海港" size="large" /> -->
                <a-select v-model:value="form.exportPort" placeholder="请选择出口港" size="large" class="w-full" @change="handleExportPortChange($event)" :disabled="inPortLoading">
                  <a-select-option v-for="harbor in inPort" :key="harbor.harborId" :value="harbor.harborPortChinese">
                    {{ harbor.harborPortChinese }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="出口港（英文）" name="exportPortEng">
                <!-- <a-input v-model:value="form.exportPortEng" placeholder="如：SHANGHAI" size="large" /> -->
                <a-select v-model:value="form.exportPortEng" placeholder="请选择出口港" size="large" class="w-full" @change="handleExportPortEngChange($event)" :disabled="inPortLoading">
                  <a-select-option v-for="harbor in inPort" :key="harbor.harborId" :value="harbor.harborPortEnglish">
                    {{ harbor.harborPortEnglish }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- 进口国家 / 城市 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="进口地国家（中文）" name="importCity">
                <a-input v-model:value="form.importCity" placeholder="英国" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="importCityEng">
                <template #label>
                  <span>进口地国家（英文）</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">获取</a-button></span>
                </template>
                <a-input v-model:value="form.importCityEng" placeholder="如：United Kingdom" size="large" />
              </a-form-item>
            </a-col>

            <!-- 进口港 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="进口港（中文）" name="importPort">
                <!-- <a-input v-model:value="form.importPort" placeholder="如：洛杉矶港" size="large" /> -->
                <a-select v-model:value="form.importPort" placeholder="请选择进口港" size="large" class="w-full" @change="handleImportPortChange($event)">
                  <a-select-option v-for="harbor in harbors" :key="harbor.harborId" :value="harbor.harborPortChinese">
                    {{ harbor.harborPortChinese }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="进口港（英文）" name="importPortEng">
                <!-- <a-input v-model:value="form.importPortEng" placeholder="如：LOS ANGELES PORT" size="large" /> -->
                <a-select v-model:value="form.importPortEng" placeholder="请选择进口港" size="large" class="w-full" @change="handleImportPortEngChange($event)">
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
              <span class="section-title">合同设置</span>
              <span class="section-subtitle">配置商品与合同相关的业务参数</span>
            </div>
          </template>

          <a-row :gutter="16">
            <!-- 外销合同编号、商品编号 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="外销合同编号" name="exportContractCode">
                <a-input v-model:value="form.exportContractCode" placeholder="请输入外销合同编号" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="商品编号" name="goodsNo">
                <a-input v-model:value="form.goodsNo" placeholder="请输入商品编号" size="large" />
              </a-form-item>
            </a-col>

            <!-- 交易数量、进口商市场报价 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="交易数量" name="transactionVolume">
                <a-input-number v-model:value="form.transactionVolume" :min="0" :precision="0" class="w-full"
                  placeholder="请输入交易数量" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="进口商市场报价" name="marketPrice">
                <a-input-number v-model:value="form.marketPrice" :min="0" :precision="2" class="w-full"
                  placeholder="请输入进口商市场报价" size="large" />
              </a-form-item>
            </a-col>

            <!-- 出口报价、出口报价单位 -->
            <a-col :xs="24" :md="12">
              <a-form-item label="出口报价" name="exportPrice">
                <a-input-number v-model:value="form.exportPrice" :min="0" :precision="2" class="w-full"
                  placeholder="请输入出口报价" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="exportPriceUnit">
                <template #label>
                  <span>出口报价单位</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">获取</a-button></span>
                </template>
                <a-select v-model:value="form.exportPriceUnit" placeholder="请选择报价币种" size="large" class="w-full">
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

            <!-- 进口方货币汇率、工厂合同编号 -->
            <a-col :xs="24" :md="12">
              <a-form-item name="exchangeRate">
                <template #label>
                  <span>进口方货币汇率</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">获取</a-button></span>
                </template>
                <a-input-number v-model:value="form.exchangeRate" :min="0" :precision="4" class="w-full"
                  placeholder="请输入汇率" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="工厂合同编号" name="innerContractCode">
                <a-input v-model:value="form.innerContractCode" placeholder="请输入工厂合同编号" size="large" />
              </a-form-item>
            </a-col>

            <!-- 工厂报价（RMB） -->
            <a-col :xs="24" :md="12">
              <a-form-item label="工厂报价（RMB）" name="supplierPrice">
                <a-input-number v-model:value="form.supplierPrice" :min="0" :precision="2" class="w-full"
                  placeholder="请输入工厂报价（RMB）" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="产地证明类型" name="originType">
                <a-select v-model:value="form.originType" placeholder="请选择产地证明类型" size="large" class="w-full">
                  <a-select-option value="ORIGIN">原产地证明书</a-select-option>
                  <a-select-option value="GSP">普惠制产地证明书</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item name="usdRate">
                <template #label>
                  <span>USD货币汇率</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">获取</a-button></span>
                </template>
                <a-input-number v-model:value="form.usdRate" :min="0" :precision="4" class="w-full"
                  placeholder="请输入USD货币汇率" size="large" />
              </a-form-item>
            </a-col>

          </a-row>
        </a-card>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-end gap-3">
          <a-button size="large" @click="goToDesk">
            工作台
          </a-button>
          <a-button type="primary" size="large" @click="handleSave" :loading="saving">
            保存设置
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { BusinessConfig } from '../../apis/types';
import businessConfigApi from '../../apis/businessConfig';
import { useGetCurrentInfo,useGetCrawlRate } from './hook';
import { useListHarbors, useListInPort } from './hook';
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
    message.success('配置保存成功');
    await loadConfig();
  } catch (error) {
    console.error('保存配置失败', error);
    message.error('配置保存失败，请稍后重试');
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

::deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--ant-text-color);
}
</style>