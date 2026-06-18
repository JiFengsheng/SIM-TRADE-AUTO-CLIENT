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
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.versionLabel')" name="version">
                <a-select v-model:value="form.version" :placeholder="$t('contract.selectVersion')" size="large" class="w-full">
                  <a-select-option :value="6">6</a-select-option>
                  <a-select-option :value="5.1">5.1</a-select-option>
                  <a-select-option :value="5.0">5.0</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.useVpnLabel')" name="useVpn">
                <a-switch
                  v-model:checked="form.useVpn"
                  :checked-value="1"
                  :un-checked-value="0"
                  :checked-children="$t('contract.useVpnOn')"
                  :un-checked-children="$t('contract.useVpnOff')"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.vpnUrlLabel')">
                <div class="vpn-setting-row">
                  <a-input
                    v-model:value="form.vpnUrl"
                    :placeholder="$t('contract.vpnUrlPlaceholder')"
                    size="large"
                    :disabled="(form.useVpn ?? 0) !== 1"
                    allow-clear
                  />
                  <a-button
                    type="primary"
                    size="large"
                    :loading="vpnLoginLoading"
                    :disabled="(form.useVpn ?? 0) !== 1"
                    @click="handleOpenVpnLogin"
                  >
                    {{ $t('contract.vpnSetupBtn') }}
                  </a-button>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.vpnCookieLabel')">
                <a-textarea
                  v-model:value="form.cookies"
                  :rows="2"
                  :placeholder="$t('contract.vpnCookiePlaceholder')"
                  :disabled="(form.useVpn ?? 0) !== 1"
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
              <a-form-item name="goodsNo">
                <template #label>
                  <span>{{ $t('contract.goodsNo') }}</span>
                  <a-button type="link" size="small" class="ml-1" :loading="goodsDetailLoading" @click="handleGetGoodsDetail">
                    {{ $t('contract.getGoodsDetailBtn') }}
                  </a-button>
                </template>
                <a-input v-model:value="form.goodsNo" :placeholder="$t('contract.placeholderGoodsNo')" size="large" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.exportPrice')" name="exportPrice">
                <a-input-number v-model:value="form.exportPrice" :min="0" :precision="2" class="w-full"
                  :placeholder="$t('contract.placeholderExportPrice')" size="large" />
              </a-form-item>
              <div class="rmb-tip">{{ $t('contract.rmbConversion', { rmb: exportPriceRmb }) }}</div>
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
              <div v-if="marketGoodsDetail?.importPrice != null" class="rmb-tip">
                {{ $t('contract.goodsImportPriceTip', { value: formatGoodsPrice(marketGoodsDetail.importPrice, marketGoodsDetail.importPriceUnit) }) }}
              </div>
            </a-col>



            <a-col :xs="24" :md="12">
              <a-form-item name="exchangeRate">
                <template #label>
                  <span>{{ $t('contract.exchangeRate') }}</span>
                  <span><a-button type="link" size="small" @click="handleGetCrawlRate">{{ $t('contract.getBtn') }}</a-button></span>
                </template>
                <a-input-number
                  v-model:value="form.exchangeRate"
                  :min="0"
                  :precision="6"
                  class="w-full"
                  :placeholder="$t('contract.placeholderExchangeRate')"
                  size="large"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.premiumRate')" name="premiumRate">
                <a-input-number
                  v-model:value="form.premiumRate"
                  :min="0"
                  :precision="6"
                  class="w-full"
                  :placeholder="$t('contract.placeholderPremiumRate')"
                  size="large"
                />
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
              <div v-if="marketGoodsDetail?.cost != null" class="rmb-tip">
                {{ $t('contract.goodsCostTip', { value: formatGoodsPrice(marketGoodsDetail.cost, marketGoodsDetail.costUnit) }) }}
              </div>
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
                <a-input-number v-model:value="form.usdRate" :min="0" :precision="6" class="w-full"
                  :placeholder="$t('contract.placeholderUsdRate')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.fillDate')" name="fillDate">
                <a-input v-model:value="form.fillDate" class="w-full"
                  :placeholder="$t('contract.placeholderFillDate')" size="large" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item :label="$t('contract.contractTotalAmount')" class="contract-total-stack-item">
                <div class="contract-total-metrics">
                  <span class="contract-total-metric-line">
                    {{ $t('contract.contractTotalImportLine', { amount: contractTotalImportDisplay }) }} , {{ $t('contract.contractTotalRmbLine', { amount: contractTotalRmbDisplay }) }}
                  </span>
                </div>
                <div class="contract-total-metrics contract-factory-row">
                  <span class="contract-total-metric-line">
                    {{ $t('contract.contractFactoryRmbLine', { amount: contractFactoryRmbDisplay }) }} , {{  contractFactoryRmbChineseDisplay }} 
                  </span>
                  
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 港口信息设置 -->
        <a-card class="desk-card mb-4" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.harborSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.harborSectionDesc') }}</span>
            </div>
          </template>

          <a-spin :spinning="harborInfoLoading">
            <a-row :gutter="16">
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.mtq')" name="mtq">
                  <a-input-number v-model:value="form.mtq" :min="0" class="w-full" :placeholder="$t('contract.placeholderMtq')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.tne')" name="tne">
                  <a-input-number v-model:value="form.tne" :min="0" class="w-full" :placeholder="$t('contract.placeholderTne')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.freightTwenty')" name="freightTwenty">
                  <a-input-number v-model:value="form.freightTwenty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderFreightTwenty')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.freightForty')" name="freightForty">
                  <a-input-number v-model:value="form.freightForty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderFreightForty')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.portSurchargeTwenty')" name="portSurchargeTwenty">
                  <a-input-number v-model:value="form.portSurchargeTwenty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderPortSurchargeTwenty')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.portSurchargeForty')" name="portSurchargeForty">
                  <a-input-number v-model:value="form.portSurchargeForty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderPortSurchargeForty')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.fuelTwenty')" name="fuelTwenty">
                  <a-input-number v-model:value="form.fuelTwenty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderFuelTwenty')" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item :label="$t('contract.fuelForty')" name="fuelForty">
                  <a-input-number v-model:value="form.fuelForty" :min="0" :precision="2" class="w-full" :placeholder="$t('contract.placeholderFuelForty')" size="large" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-spin>
        </a-card>

        <!-- 其他设置 -->
        <a-card class="desk-card mb-6" :bordered="false">
          <template #title>
            <div class="section-header">
              <span class="section-title">{{ $t('contract.otherSection') }}</span>
              <span class="section-subtitle">{{ $t('contract.otherSectionDesc') }}</span>
            </div>
          </template>

          <a-row :gutter="16">
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.shipment')" name="shipment">
                <a-textarea
                  v-model:value="form.shipment"
                  :placeholder="$t('contract.placeholderShipment')"
                  :rows="4"
                  size="large"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="24">
              <a-form-item :label="$t('contract.shippingMark')" name="shippingMark">
                <a-textarea
                  v-model:value="form.shippingMark"
                  :placeholder="$t('contract.placeholderShippingMark')"
                  :rows="4"
                  size="large"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- 商品详情弹窗 -->
        <a-modal
          v-model:open="goodsDetailModalVisible"
          :title="$t('contract.goodsDetailModalTitle')"
          width="560px"
          :destroy-on-close="true"
          @cancel="handleCloseGoodsDetailModal"
        >
          <a-spin :spinning="goodsDetailLoading">
            <div v-if="goodsDetailForModal" class="goods-detail-content">
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsCode') }}</span>
                <span class="goods-detail-value">{{ goodsDetailForModal.goodsCode || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsName') }}</span>
                <span class="goods-detail-value">{{ goodsDetailForModal.goodsName || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsNameEng') }}</span>
                <span class="goods-detail-value">{{ goodsDetailForModal.goodsNameEng || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsDesc') }}</span>
                <span class="goods-detail-value goods-detail-desc">{{ goodsDetailForModal.goodsDesc || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsDescEng') }}</span>
                <span class="goods-detail-value goods-detail-desc">{{ goodsDetailForModal.goodsDescEng || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailGoodsUnit') }}</span>
                <span class="goods-detail-value">{{ goodsDetailForModal.goodsUnit || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailCost') }}</span>
                <span class="goods-detail-value">{{ formatGoodsPrice(goodsDetailForModal.cost, goodsDetailForModal.costUnit) }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailImportPrice') }}</span>
                <span class="goods-detail-value">{{ formatGoodsPrice(goodsDetailForModal.importPrice, goodsDetailForModal.importPriceUnit) }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailHsCode') }}</span>
                <span class="goods-detail-value">{{ goodsDetailForModal.hsCode || '--' }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailPreferentialImportDuty') }}</span>
                <span class="goods-detail-value">{{ formatGoodsPrice(goodsDetailForModal.preferentialImportDuty,"%") }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailVat') }}</span>
                <span class="goods-detail-value">{{ formatGoodsPrice(goodsDetailForModal.vat,"%") }}</span>
              </div>
              <div class="goods-detail-row">
                <span class="goods-detail-label">{{ $t('contract.goodsDetailTaxRefund') }}</span>
                <span class="goods-detail-value">{{ formatGoodsPrice(goodsDetailForModal.taxRefund,"%") }}</span>
              </div>
            </div>
          </a-spin>
          <template #footer>
            <a-button type="primary" @click="handleCloseGoodsDetailModal">{{ $t('contract.goodsDetailClose') }}</a-button>
          </template>
        </a-modal>

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
import type { BusinessConfig, GetMarketGoodsInfoRespVo, HarborInfo, MarketGoodsInfo } from '../../apis/types';
import businessConfigApi from '../../apis/businessConfig';
import harborApi from '../../apis/harbor';
import marketGoodsApi from '../../apis/marketGoods';
import { useGetCurrentInfo,useGetCrawlRate } from './hook';
import { useListHarbors, useListInPort } from './hook';
import { convertPriceToChinese } from '../../utils/priceConverter';

const VPN_SETTINGS_STORAGE_KEY = 'contract-vpn-settings';

const { t } = useI18n();
const { getCurrentInfo, loading: loadingCurrentInfo, currentInfo: currentInfoCurrentInfo  } = useGetCurrentInfo();
const { crawlRate, loading: loadingCrawlRate, getCrawlRate } = useGetCrawlRate();

/**
 * 金额展示：整数部分从右往左每四位用逗号分隔（如 1000000 -> 100,0000.00）
 */
function formatAmountFourDigitGrouping(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return '--';
  const negative = value < 0;
  const abs = Math.abs(value);
  const fixed = abs.toFixed(fractionDigits);
  const [intRaw, decPart] = fixed.split('.');
  const intDigits = negative ? intRaw.slice(1) : intRaw;
  const rev = intDigits.split('').reverse();
  const groups: string[] = [];
  for (let i = 0; i < rev.length; i += 4) {
    groups.unshift(rev.slice(i, i + 4).reverse().join(''));
  }
  const intFormatted = groups.join(',');
  const signed = negative ? `-${intFormatted}` : intFormatted;
  return decPart !== undefined ? `${signed}.${decPart}` : signed;
}

const exportPriceRmb = computed(() => {
  const exportPrice = Number(form.value.exportPrice);
  const exchangeRate = Number(form.value.exchangeRate);
  if (!Number.isFinite(exportPrice) || !Number.isFinite(exchangeRate)) return '--';
  return formatAmountFourDigitGrouping(exportPrice * exchangeRate, 2);
});

/** 合同总金额：进口币种 = 交易数量 × 出口报价；人民币 = 交易数量 × 出口报价 × 进口方汇率 */
const contractTotalImportDisplay = computed(() => {
  const qty = Number(form.value.transactionVolume);
  const price = Number(form.value.exportPrice);
  const unit = (form.value.exportPriceUnit || '').trim();
  if (!Number.isFinite(qty) || !Number.isFinite(price)) return '--';
  const total = qty * price;
  // const formatted = total.toFixed(2);
  const formatted = formatAmountFourDigitGrouping(total, 2);
  return unit ? `${formatted} ${unit}` : formatted;
});

const contractTotalRmbDisplay = computed(() => {
  const qty = Number(form.value.transactionVolume);
  const price = Number(form.value.exportPrice);
  const rate = Number(form.value.exchangeRate);
  if (!Number.isFinite(qty) || !Number.isFinite(price) || !Number.isFinite(rate)) return '--';
  return formatAmountFourDigitGrouping(qty * price * rate, 2);
});

/** 工厂金额：工厂报价 × 交易数量（RMB） */
const contractFactoryRmbDisplay = computed(() => {
  const qty = Number(form.value.transactionVolume);
  const supplierPrice = Number(form.value.supplierPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(supplierPrice)) return '--';
  return formatAmountFourDigitGrouping(qty * supplierPrice, 2);
});

/** 工厂金额中文大写（财务大写元角分，与 Java PriceConverter 一致；与左侧金额同一数值、保留两位小数） */
const contractFactoryRmbChineseDisplay = computed(() => {
  const qty = Number(form.value.transactionVolume);
  const supplierPrice = Number(form.value.supplierPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(supplierPrice)) return '';
  const amount = Math.round(qty * supplierPrice * 100) / 100;
  if (!Number.isFinite(amount) || amount < 0) return '';
  try {
    return convertPriceToChinese(amount);
  } catch {
    return '';
  }
});

const handleGetCrawlRate = async () => {
  const hideLoading = message.loading(t('contract.msgFetchingRateAndCountry'), 0);
  try {
    await getCrawlRate({
      baseUrl: form.value.baseUrl,
      account: form.value.importAccount,
      password: form.value.importPassword,
      vpnCookies: form.value.useVpn ? form.value.cookies : '',
    });
    form.value.usdRate = crawlRate.value.usdRate ?? form.value.usdRate;
    form.value.exportPriceUnit = crawlRate.value.exportPriceUnit ?? form.value.exportPriceUnit;
    form.value.exchangeRate = crawlRate.value.exchangeRate ?? form.value.exchangeRate;
    form.value.importCityEng = crawlRate.value.countryEnglish ?? form.value.importCityEng;
    form.value.importCity = crawlRate.value.countryChinese ?? form.value.importCity;
    await fetchHarbors(crawlRate.value.countryEnglish,form.value.baseUrl,form.value.useVpn ? form.value.cookies : '',form.value.exportAccount,form.value.exportPassword);
    await fetchInPort({
      baseUrl: form.value.baseUrl,
      vpnCookies: form.value.useVpn ? form.value.cookies : '',
      exporterAccount: form.value.exportAccount,
      exporterPassword: form.value.exportPassword,
    });
  } catch {
    // 错误提示由 hook 内 getCrawlRate 的 message.error 统一处理
  } finally {
    hideLoading();
  }
}

const { loading: harborsLoading, harbors, engToChn, chnToEng, fetchHarbors } = useListHarbors();
const { loading: inPortLoading, inPort, engToChn: inPortEngToChn, chnToEng: inPortChnToEng, fetchInPort } = useListInPort();
const harborInfoLoading = ref(false);

const unwrapHarborData = (res: unknown): HarborInfo | null => {
  if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
    return (res as { data: HarborInfo }).data ?? null;
  }
  return (res as HarborInfo) ?? null;
};

const applyHarborInfoToForm = (info: HarborInfo) => {
  form.value.mtq = info.mtq;
  form.value.tne = info.tne;
  form.value.freightTwenty = info.freightTwenty;
  form.value.freightForty = info.freightForty;
  form.value.portSurchargeTwenty = info.portSurchargeTwenty;
  form.value.portSurchargeForty = info.portSurchargeForty;
  form.value.fuelTwenty = info.fuelTwenty;
  form.value.fuelForty = info.fuelForty;
};

const fetchHarborInfoByPortEnglish = async (harborPortEnglish?: string) => {
  const port = harborPortEnglish?.trim();
  if (!port) return;
  harborInfoLoading.value = true;
  try {
    const res = await harborApi.getByHarborPortEnglish({
      harborPortEnglish: port,
      baseUrl: form.value.baseUrl,
      vpnCookies: form.value.useVpn ? form.value.cookies : '',
      exporterAccount: form.value.exportAccount,
      exporterPassword: form.value.exportPassword,
    });
    const info = unwrapHarborData(res);
    if (info) {
      applyHarborInfoToForm(info);
    }
  } catch (error) {
    console.error('获取港口信息失败', error);
    message.error(t('contract.msgHarborInfoFail'));
  } finally {
    harborInfoLoading.value = false;
  }
};

const handleImportPortChange = async (event: string) => {
  form.value.importPort = event;
  form.value.importPortEng = chnToEng.value[event] || form.value.importPortEng;
  await fetchHarborInfoByPortEnglish(form.value.importPortEng);
};

const handleImportPortEngChange = async (event: string) => {
  form.value.importPortEng = event;
  form.value.importPort = engToChn.value[event] || form.value.importPort;
  await fetchHarborInfoByPortEnglish(form.value.importPortEng);
};

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
  premiumRate: 0.0088,
  useVpn: 0,
});
const vpnLoginLoading = ref(false);

const loadVpnSettings = () => {
  try {
    const raw = window.localStorage.getItem(VPN_SETTINGS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { useVpn?: number; vpnUrl?: string; cookies?: string };
    if (typeof parsed.useVpn === 'number') {
      form.value.useVpn = parsed.useVpn;
    }
    form.value.vpnUrl = parsed.vpnUrl || form.value.vpnUrl;
    form.value.cookies = parsed.cookies || form.value.cookies;
  } catch (error) {
    console.warn('读取 VPN 本地配置失败', error);
  }
};

const persistVpnSettings = () => {
  try {
    window.localStorage.setItem(
      VPN_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        useVpn: typeof form.value.useVpn === 'number' ? form.value.useVpn : 0,
        vpnUrl: form.value.vpnUrl || '',
        cookies: form.value.cookies || '',
      }),
    );
  } catch (error) {
    console.warn('保存 VPN 本地配置失败', error);
  }
};

const handleOpenVpnLogin = async () => {
  if ((form.value.useVpn ?? 0) !== 1) {
    message.warning(t('contract.msgEnableVpnFirst'));
    return;
  }
  const vpnUrl = form.value.vpnUrl?.trim();
  if (!vpnUrl) {
    message.warning(t('contract.msgVpnUrlRequired'));
    return;
  }
  if (!window.electronAPI?.openVpnAuthWindow) {
    message.error(t('contract.msgVpnFeatureUnavailable'));
    return;
  }

  vpnLoginLoading.value = true;
  try {
    const result = await window.electronAPI.openVpnAuthWindow({
      url: vpnUrl,
      cookieNames: [],
    });
    if (!result?.success || !result.cookie) {
      message.warning(result?.error || t('contract.msgVpnCookieFetchFail'));
      return;
    }
    form.value.cookies = result.cookie;
    persistVpnSettings();
    message.success(t('contract.msgVpnCookieFetchSuccess'));
  } catch (error) {
    console.error('VPN 登录并获取 Cookie 失败', error);
    message.error(t('contract.msgVpnCookieFetchFail'));
  } finally {
    vpnLoginLoading.value = false;
  }
};

// 商品详情弹窗：弹窗内展示的数据 / 关闭后用于下方蓝色提示的数据
const goodsDetailModalVisible = ref(false);
const goodsDetailLoading = ref(false);
const goodsDetailForModal = ref<GetMarketGoodsInfoRespVo | null>(null);
const marketGoodsDetail = ref<GetMarketGoodsInfoRespVo | null>(null);

const unwrapGoodsData = (res: unknown): GetMarketGoodsInfoRespVo | null => {
  if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
    return (res as { data: GetMarketGoodsInfoRespVo }).data ?? null;
  }
  return res as GetMarketGoodsInfoRespVo | null;
};

function formatGoodsPrice(amount: number | undefined, unit?: string): string {
  if (amount == null || !Number.isFinite(amount)) return '--';
  const u = (unit || '').trim();
  return u ? `${amount} ${u}` : String(amount);
}

const handleGetGoodsDetail = async () => {
  const code = form.value.goodsNo?.trim();
  if (!code) {
    message.warning(t('contract.msgGoodsNoRequired'));
    return;
  }
  goodsDetailModalVisible.value = true;
  goodsDetailForModal.value = null;
  goodsDetailLoading.value = true;
  const hideLoading = message.loading(t('contract.msgFetchingGoodsDetail'), 0);
  try {
    const res = await marketGoodsApi.getByCodePost({
      baseUrl: form.value.baseUrl,
      importerAccount: form.value.importAccount,
      importerPassword: form.value.importPassword,
      exporterAccount: form.value.exportAccount,
      exporterPassword: form.value.exportPassword,
      supplierAccount: form.value.supplierAccount,
      supplierPassword: form.value.supplierPassword,
      code,
      vpnCookies: form.value.useVpn ? form.value.cookies : '',
    });
    const data = unwrapGoodsData(res);
    goodsDetailForModal.value = data;
    if (data) {
      message.success(t('contract.msgGoodsDetailSuccess'));
    } else {
      message.warning(t('contract.msgGoodsDetailFail'));
    }
  } catch (err) {
    console.error('获取商品详情失败', err);
    message.error(t('contract.msgGoodsDetailFail'));
  } finally {
    hideLoading();
    goodsDetailLoading.value = false;
  }
};

const handleCloseGoodsDetailModal = () => {
  if (goodsDetailForModal.value) {
    marketGoodsDetail.value = { ...goodsDetailForModal.value };
  }
  goodsDetailModalVisible.value = false;
  goodsDetailForModal.value = null;
};

const rules = computed(() => ({
  exportAccount: [{ required: true, message: t('contract.placeholderExportAccount'), trigger: 'blur' }],
  // exportPassword: [{ required: true, message: t('contract.placeholderExportPassword'), trigger: 'blur' }],
  importAccount: [{ required: true, message: t('contract.placeholderImportAccount'), trigger: 'blur' }],
  // importPassword: [{ required: true, message: t('contract.placeholderImportPassword'), trigger: 'blur' }],
  supplierAccount: [{ required: true, message: t('contract.placeholderSupplierAccount'), trigger: 'blur' }],
  // supplierPassword: [{ required: true, message: t('contract.placeholderSupplierPassword'), trigger: 'blur' }],
  negotiatingBankAccount: [{ required: true, message: t('contract.placeholderNegotiatingBankAccount'), trigger: 'blur' }],
  // negotiatingBankPassword: [{ required: true, message: t('contract.placeholderNegotiatingBankPassword'), trigger: 'blur' }],
  issuingBankAccount: [{ required: true, message: t('contract.placeholderIssuingBankAccount'), trigger: 'blur' }],
  // issuingBankPassword: [{ required: true, message: t('contract.placeholderIssuingBankPassword'), trigger: 'blur' }],
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
        premiumRate: 0.0088,
        useVpn: form.value.useVpn ?? 0,
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
    persistVpnSettings();
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
  loadVpnSettings();
  await loadConfig();
  await getCurrentInfo();
  await fetchHarbors(currentInfoCurrentInfo.value.importCityEng,form.value.baseUrl,form.value.useVpn ? form.value.cookies : '',form.value.exportAccount,form.value.exportPassword);
  await fetchInPort({
    baseUrl: form.value.baseUrl,
    vpnCookies: form.value.useVpn ? form.value.cookies : '',
    exporterAccount: form.value.exportAccount,
    exporterPassword: form.value.exportPassword,
  });
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

.rmb-tip {
  margin-top: -18px;
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 1.4;
  color: #1677ff;
}

.ml-1 {
  margin-left: 4px;
}

.vpn-setting-row {
  display: flex;
  gap: 12px;
}

.vpn-setting-row :deep(.ant-input-affix-wrapper),
.vpn-setting-row :deep(.ant-input) {
  flex: 1;
}

.goods-detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.goods-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
}

.goods-detail-label {
  flex-shrink: 0;
  width: 120px;
  color: var(--app-color-text-secondary);
}

.goods-detail-value {
  flex: 1;
  color: var(--app-color-text);
  word-break: break-word;
}

.goods-detail-desc {
  line-height: 1.5;
  white-space: pre-wrap;
}

.contract-total-stack-item :deep(.ant-form-item-control-input) {
  min-height: auto;
}

.contract-total-metrics {
  padding-top: 1px;
}

.contract-total-metric-line {
  font-size: 13px;
  line-height: 1.4;
  color: #1677ff;
}

.contract-total-metric-line + .contract-total-metric-line {
  margin-top: 6px;
}

.contract-factory-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px 16px;
}

.contract-total-metric-chinese {
  font-size: 13px;
  line-height: 1.4;
  color: var(--app-color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
}
</style>