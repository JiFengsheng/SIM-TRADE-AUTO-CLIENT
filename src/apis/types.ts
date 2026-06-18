import { ApiResponse } from "../utils/request";

// 原始数据 或 包在 ApiResponse 里的数据
export type ApiData<T> = T | ApiResponse<T>;

// 列表场景
export type ApiListResult<T> = ApiData<T[]>;

/**
 * 文件下载结果（downloadFile 返回）
 */
export interface DownloadFileResult {
  blob: Blob;
  filename: string;
}
/**
 * 业务基本配置相关类型定义
 */

/**
 * 业务基本配置对象
 */
export interface BusinessConfig {
  /** 主键ID */
  configId?: string;
  /** 从价消费税率（默认0%） */
  consumptionTaxRate?: number;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 进口方货币汇率 */
  exchangeRate?: number;
  /** 出口商账号 */
  exportAccount?: string;
  /** 出口城市 */
  exportCity?: string;
  /** 出口城市（英文） */
  exportCityEng?: string;
  /** 外销合同编号 */
  exportContractCode?: string;
  /** 出口商邮箱（非必填） */
  exportEmail?: string;
  /** 出口商密码 */
  exportPassword?: string;
  /** 出口港 */
  exportPort?: string;
  /** 出口港（英文） */
  exportPortEng?: string;
  /** 出口报价 */
  exportPrice?: number;
  /** 出口报价单位 */
  exportPriceUnit?: string;
  /** 商品中文名称 */
  goodsChineseName?: string;
  /** 商品英文名称 */
  goodsEnglishName?: string;
  /** 商品编号 */
  goodsNo?: string;
  /** 进口商账号 */
  importAccount?: string;
  /** 进口城市 */
  importCity?: string;
  /** 进口城市（英文） */
  importCityEng?: string;
  /** 进口商邮箱（非必填） */
  importEmail?: string;
  /** 进口商密码 */
  importPassword?: string;
  /** 进口港 */
  importPort?: string;
  /** 进口港（英文） */
  importPortEng?: string;
  /** 进口优惠税率（默认0%） */
  importTaxRate?: number;
  /** 内销合同编号 */
  innerContractCode?: string;
  /** 保险加成率（默认0%） */
  insuranceMarkupRate?: number;
  /** 进口地银行账号 */
  issuingBankAccount?: string;
  /** 进口地银行邮箱（非必填） */
  issuingBankEmail?: string;
  /** 进口地银行密码 */
  issuingBankPassword?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 进口商市场报价 */
  marketPrice?: number;
  /** 出口地银行账号 */
  negotiatingBankAccount?: string;
  /** 出口地银行邮箱（非必填） */
  negotiatingBankEmail?: string;
  /** 出口地银行密码 */
  negotiatingBankPassword?: string;
  /** 结算方式（L/C/T/T/D/P/D/A） */
  payment?: string;
  /** 保险费率（默认0.88%） */
  premiumRate?: number;
  /** 供应商账号 */
  supplierAccount?: string;
  /** 供应商邮箱（非必填） */
  supplierEmail?: string;
  /** 供应商密码 */
  supplierPassword?: string;
  /** 供应商报价（默认RMB） */
  supplierPrice?: number;
  /** 退税率（默认13%） */
  taxRebateRate?: number;
  /** 贸易术语（CIF/CFR/FOB） */
  trade?: string;
  /** 交易数量 */
  transactionVolume?: number;
  /** USD汇率 */
  usdRate?: number;
  /** 增值税税率（默认13%） */
  vatRate?: number;
  /** 基础地址 */
  baseUrl?: string;
  /** 产地证明类型 */
  originType?: string;
  /** 运输方式 */
  shipment?: string;
  /** 唛头 */
  shippingMark?: string;
  /** 填制日期 */
  fillDate?: string;
  /** 版本 */
  version?: number;
  useVpn?: number;
  vpnUrl?: string;
  cookies?: string;
  /** 40尺集装箱基本运费 */
  freightForty?: number;
  /** 20尺集装箱基本运费 */
  freightTwenty?: number;
  /** 40尺集装箱燃油附加费 */
  fuelForty?: number;
  /** 20尺集装箱燃油附加费 */
  fuelTwenty?: number;
  /** MTQ代码 */
  mtq?: number;
  /** 40尺集装箱港口附加费 */
  portSurchargeForty?: number;
  /** 20尺集装箱港口附加费 */
  portSurchargeTwenty?: number;
  /** TNE代码 */
  tne?: number;
}

/**
 * 系统配置相关类型定义
 */

/**
 * 系统配置对象
 * 对应文档定义：SysProfileParameter对象
 */
export interface SysProfileParameter {
  /** 描述 */
  description?: string;
  /** ID */
  id?: string;
  /** 最后更新时间 */
  lastUpdateTime?: string;
  /** 名称 */
  name?: string;
  /** 排序 */
  sort?: number;
  /** 值 */
  value?: string;
}

/**
 * 系统配置分页查询参数
 * 对应接口：GET /sys-profile-parameter/list
 */
export interface SysProfileParameterListQuery {
  /** 页码 */
  current: number;
  /** 每页显示多少条 */
  size: number;
  /** 搜索条件 */
  search?: string;
}

/**
 * 公司/账户信息（查询返回）
 * 对应文档定义：AccountInfoDto
 */
export interface AccountInfoDto {
  /** 简称（中文） */
  abbreviationChinese?: string;
  /** 简称（英文） */
  abbreviationEnglish?: string;
  /** 账户编号 */
  accountCode?: string;
  /** 账号（文档中未给描述） */
  accountNo?: string;
  /** 地址（中文） */
  addressChinese?: string;
  /** 地址（英文） */
  addressEnglish?: string;
  /** 所属国家 */
  country?: string;
  /** 统一社会信用代码 */
  creditCode?: string;
  /** 邮箱 */
  email?: string;
  /** 传真 */
  fax?: string;
  /** 全称（中文） */
  fullNameChinese?: string;
  /** 全称（英文） */
  fullNameEnglish?: string;
  /** 介绍 */
  introduction?: string;
  /** 企业法人（中文） */
  legalPersonChinese?: string;
  /** 企业法人（英文） */
  legalPersonEnglish?: string;
  /** 电话 */
  phone?: string;
  /** 邮政编码 */
  postalCode?: string;
  /** 注册资金 */
  registeredCapital?: string;
  /** 用户编号 */
  userCode?: string;
  /** 网址 */
  website?: string;
}

/**
 * 公司信息（更新入参）
 * 对应文档定义：CompanyInfoDto
 */
export interface CompanyInfoDto {
  /** 简称（中文） */
  abbreviationChinese?: string;
  /** 简称（英文） */
  abbreviationEnglish?: string;
  /** 账号 */
  account?: string;
  /** 账户编号 */
  accountCode?: string;
  /** 地址（中文） */
  addressChinese?: string;
  /** 地址（英文） */
  addressEnglish?: string;
  /** 所属国家 */
  country?: string;
  /** 统一社会信用代码 */
  creditCode?: string;
  /** 邮箱 */
  email?: string;
  /** 传真 */
  fax?: string;
  /** 全称（中文） */
  fullNameChinese?: string;
  /** 全称（英文） */
  fullNameEnglish?: string;
  /** 介绍 */
  introduction?: string;
  /** 企业法人（中文） */
  legalPersonChinese?: string;
  /** 企业法人（英文） */
  legalPersonEnglish?: string;
  /** 密码 */
  password?: string;
  /** 电话 */
  phone?: string;
  /** 邮政编码 */
  postalCode?: string;
  /** 注册资金 */
  registeredCapital?: string;
  /** 用户编号 */
  userCode?: string;
  /** 网址 */
  website?: string;
}

/**
 * 广告接口相关类型定义
 */

/**
 * 发布广告请求参数
 * 对应文档定义：AdvertisementDto
 */
export interface AdvertisementDto {
  /** 账号 */
  account?: string;
  /** 发布类型 */
  advertisementType?: string;
  /** 内容 */
  content?: string;
  /** 产品编号 */
  goodsNo?: string;
  /** 关键字 */
  keywords?: string;
  /** 密码 */
  password?: string;
  /** 角色 */
  roleCode?: string;
  /** 标题 */
  title?: string;
}

/**
 * 发布信息请求参数
 * 对应文档定义：PublishInfoDto
 */
export interface PublishInfoDto {
  /** 账号 */
  account?: string;
  /** 内容 */
  content?: string;
  /** 关键字 */
  keywords?: string;
  /** 密码 */
  password?: string;
  /** 发布信息类型 */
  publishInfoType?: string;
  /** 角色 */
  roleCode?: string;
  /** 标题 */
  title?: string;
}

/**
 * 合同基础信息相关类型定义
 */

/**
 * 合同基础信息对象
 */
export interface ContractInfo {
  /** 从价消费税率（默认0%） */
  consumptionTaxRate?: number;
  /** 合同编号 */
  contractCode?: string;
  /** 合同主键ID */
  contractId?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 进口方货币汇率 */
  exchangeRate?: number;
  /** 最新执行批次 */
  executeLastBatch?: string;
  /** 最新执行步骤 */
  executeLastStep?: string;
  /** 执行信息 */
  executeMessage?: string;
  /** 执行状态（初始化/执行中/失败/成功结束） */
  executeStatus?: string;
  /** 出口商账号 */
  exportAccount?: string;
  /** 出口城市 */
  exportCity?: string;
  /** 出口城市（英文） */
  exportCityEng?: string;
  /** 外销合同编号 */
  exportContractCode?: string;
  /** 出口商邮箱（非必填） */
  exportEmail?: string;
  /** 出口商密码 */
  exportPassword?: string;
  /** 出口港 */
  exportPort?: string;
  /** 出口港（英文） */
  exportPortEng?: string;
  /** 出口报价 */
  exportPrice?: number;
  /** 出口报价单位 */
  exportPriceUnit?: string;
  /** 商品中文名称 */
  goodsChineseName?: string;
  /** 商品英文名称 */
  goodsEnglishName?: string;
  /** 商品编号 */
  goodsNo?: string;
  /** 进口商账号 */
  importAccount?: string;
  /** 进口城市 */
  importCity?: string;
  /** 进口城市（英文） */
  importCityEng?: string;
  /** 进口商邮箱（非必填） */
  importEmail?: string;
  /** 进口商密码 */
  importPassword?: string;
  /** 进口港 */
  importPort?: string;
  /** 进口港（英文） */
  importPortEng?: string;
  /** 内销合同编号 */
  innerContractCode?: string;
  /** 保险加成率（默认0%） */
  insuranceMarkupRate?: number;
  /** 进口地银行账号 */
  issuingBankAccount?: string;
  /** 进口地银行邮箱（非必填） */
  issuingBankEmail?: string;
  /** 进口地银行密码 */
  issuingBankPassword?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 进口商市场报价 */
  marketPrice?: number;
  /** 出口地银行账号 */
  negotiatingBankAccount?: string;
  /** 出口地银行邮箱（非必填） */
  negotiatingBankEmail?: string;
  /** 出口地银行密码 */
  negotiatingBankPassword?: string;
  /** 结算方式（L/C/T/T/D/P/D/A） */
  payment?: string;
  /** 保险费率（默认0.88%） */
  premiumRate?: number;
  /** 供应商账号 */
  supplierAccount?: string;
  /** 供应商邮箱（非必填） */
  supplierEmail?: string;
  /** 供应商密码 */
  supplierPassword?: string;
  /** 供应商报价（默认RMB） */
  supplierPrice?: number;
  /** 退税率（默认13%） */
  taxRebateRate?: number;
  /** 贸易术语（CIF/CFR/FOB） */
  trade?: string;
  /** 交易数量 */
  transactionVolume?: number;
  /** USD汇率 */
  usdRate?: number;
  /** 增值税税率（默认13%） */
  vatRate?: number;
  /** 流程类型 */
  processCode?: string;
  /** 基础地址 */
  baseUrl?: string;
  /** 产地证明类型 */
  originType?: string;
  /** 运输方式 */
  shipment?: string;
  /** 唛头 */
  shippingMark?: string;
  /** 填制日期 */
  fillDate?: string;
  /** 版本 */
  version?: number;
  useVpn?: number;
  vpnUrl?: string;
  cookies?: string;
  /** 40尺集装箱基本运费 */
  freightForty?: number;
  /** 20尺集装箱基本运费 */
  freightTwenty?: number;
  /** 40尺集装箱燃油附加费 */
  fuelForty?: number;
  /** 20尺集装箱燃油附加费 */
  fuelTwenty?: number;
  /** MTQ代码 */
  mtq?: number;
  /** 40尺集装箱港口附加费 */
  portSurchargeForty?: number;
  /** 20尺集装箱港口附加费 */
  portSurchargeTwenty?: number;
  /** TNE代码 */
  tne?: number;
}

/**
 * 执行合同请求参数
 * 对应文档定义：ExecuteContractReqVo
 */
export interface ExecuteContractReqVo {
  /** 流程类型 */
  processCode?: string;
  /** 停止执行的步骤编码 */
  stopStepCode?: string;
  /** 开始执行的步骤编码 */
  startStepCode?: string;
}

/**
 * 合同信息列表查询参数
 */
export interface ContractInfoListVo {
  /** 页码 */
  current: number;
  /** 每页显示多少条 */
  size: number;
  /** 搜索条件 */
  search?: string;
}

/**
 * 分页结果
 */
export interface IPage<T> {
  /** 当前页码 */
  current: number;
  /** 是否命中计数 */
  hitCount?: boolean;
  /** 总页数 */
  pages: number;
  /** 数据列表 */
  records: T[];
  /** 是否进行 count 查询 */
  searchCount?: boolean;
  /** 每页显示数量 */
  size: number;
  /** 总记录数 */
  total: number;
}

/**
 * 合同任务执行历史信息相关类型定义
 */

/**
 * 合同任务执行历史信息对象
 */
export interface ContractTaskHistory {
  /** 批次 */
  batch?: string;
  /** 关联合同ID */
  contractId?: string;
  /** 记录创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 主键ID */
  historyId?: string;
  /** 最后更新时间 */
  lastUpdateTime?: string;
  /** 最后更新人 */
  lastUpdateUser?: string;
  /** 执行日志信息 */
  message?: string;
  /** 关联的流程步骤ID */
  processStepId?: string;
  /** 状态 */
  status?: string;
}

/**
 * 流程步骤详情对象
 * 对应文档定义：FulfillmentProcessStep对象
 */
export interface FulfillmentProcessStep {
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 父步骤ID（上一个步骤） */
  parentStepId?: string;
  /** 关联的履约流程编码 */
  processCode?: string;
  /** 流程归属角色（进口商/出口商/供应商/银行） */
  roleCode?: string;
  /** 步骤执行后停顿时间（秒） */
  sleepSeconds?: number;
  /** 重新执行是否跳过 */
  skip?: number;
  /** 步骤排序序号 */
  sort?: number;
  /** 步骤编码 */
  stepCode?: string;
  /** 步骤描述 */
  stepDesc?: string;
  /** 主键ID */
  stepId?: string;
  /** 步骤名称 */
  stepName?: string;
  /** 错误处理方式 */
  errorHandler?: string;
}

/**
 * 流程步骤详情对象
 * 对应文档定义：FulfillmentProcessStepResponse对象
 */
export interface FulfillmentProcessStepResponse {
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 父步骤ID（上一个步骤） */
  parentStepId?: string;
  /** 关联的履约流程编码 */
  processCode?: string;
  /** 流程归属角色（进口商/出口商/供应商/银行） */
  roleCode?: string;
  /** 步骤执行后停顿时间（秒） */
  sleepSeconds?: number;
  /** 步骤排序序号 */
  sort?: number;
  /** 步骤编码 */
  stepCode?: string;
  /** 步骤描述 */
  stepDesc?: string;
  /** 主键ID */
  stepId?: string;
  /** 步骤名称 */
  stepName?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 履约流程类型对象
 * 对应文档定义：FulfillmentProcessType对象
 */
export interface FulfillmentProcessType {
  /** 履约流程编码 */
  code?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 描述 */
  desc?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 结算方式 */
  payment?: string;
  /** ID */
  processId?: string;
  /** 贸易术语 */
  trade?: string;
}

/**
 * 商品基本信息对象
 */
export interface GoodsInfo {
  /** 中文描述（如每箱24罐，每罐425克） */
  chineseDesc?: string;
  /** 中文名称（如洋菇罐头(整粒)） */
  chineseName?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 英文描述（如425Gx24TINS/CTN） */
  englishDesc?: string;
  /** 英文名称（如CANNED WHOLE MUSHROOMS） */
  englishName?: string;
  /** 商品编号 */
  goodsCode?: string;
  /** 主键ID */
  goodsId?: string;
  /** 商品类别（如食品） */
  goodsType?: string;
  /** 毛重（如11.2 KGS/包装） */
  grossWeight?: number;
  /** 海关代码（如2003101100） */
  hsCode?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 净重（如10.2 KGS/包装） */
  netWeight?: number;
  /** 产地（如CHINA） */
  originPlace?: string;
  /** 销售单位（如CARTON） */
  salesUnit?: string;
  /** 单位换算（每包装单位=销售单位数量） */
  unitConv?: number;
  /** 体积（如0.014739 CBM/包装） */
  volume?: number;
  /** 体积单位（如CBM） */
  volumeUnit?: string;
}

/**
 * 市场货品相关类型定义
 */

/**
 * 市场货品对象
 * 对应文档定义：MarketGoodsInfo对象
 */
export interface MarketGoodsInfo {
  /** 基础地址 */
  baseUrl?: string;
  /** 成本金额（如38.62） */
  cost?: number;
  /** 成本单位（如RMB） */
  costUnit?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 货号（如01001） */
  goodsCode?: string;
  /** 商品描述（如每箱24罐，每罐425克） */
  goodsDesc?: string;
  /** 商品英文描述 */
  goodsDescEng?: string;
  /** 主键ID */
  goodsId?: string;
  /** 商品名称（如洋菇罐头(整粒)） */
  goodsName?: string;
  /** 商品英文名称 */
  goodsNameEng?: string;
  /** 计量单位（如CARTON） */
  goodsUnit?: string;
  /** 进口商国家 */
  importCountry?: string;
  /** 进口商市场价格 */
  importPrice?: number;
  /** 进口商价格单位 */
  importPriceUnit?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
}

export interface GetMarketGoodsInfoRespVo {
  /** 基础地址 */
  baseUrl?: string;
  /** 成本金额（如38.62） */
  cost?: number;
  /** 成本单位（如RMB） */
  costUnit?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 货号（如01001） */
  goodsCode?: string;
  /** 商品描述（如每箱24罐，每罐425克） */
  goodsDesc?: string;
  /** 商品英文描述 */
  goodsDescEng?: string;
  /** 主键ID */
  goodsId?: string;
  /** 商品名称（如洋菇罐头(整粒)） */
  goodsName?: string;
  /** 商品英文名称 */
  goodsNameEng?: string;
  /** 计量单位（如CARTON） */
  goodsUnit?: string;
  /** 进口商国家 */
  importCountry?: string;
  /** 进口商市场价格 */
  importPrice?: number;
  /** 进口商价格单位 */
  importPriceUnit?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** 海关编码 */
  hsCode?: string;
  /** 优惠进口税 */
  preferentialImportDuty?: number;
  /** 增值税 */
  vat?: number;
  /** 消费税从量 */
  specificConsumptionTax?: number;
  /** 退税 */
  taxRefund?: number;
  /** 消费税从价 */
  consumptionTaxAdValorem?: number;
  /** 出口税 */
  exportDuty?: number;
  /** 普通进口税 */
  generalImportDuty?: number;
}

/**
 * 根据 code 获取市场货品请求参数
 * 对应文档定义：GetMarketReqVo
 */
export interface GetMarketReqVo {
  /** 账号 */
  importerAccount?: string;
  /** 基础地址 */
  baseUrl?: string;
  /** 货品编码 */
  code?: string;
  /** 密码 */
  importerPassword?: string;
  /** 出口商账号 */
  exporterAccount?: string;
  /** 出口商密码 */
  exporterPassword?: string;
  /** 供应商账号 */
  supplierAccount?: string;
  /** 供应商密码 */
  supplierPassword?: string;
  /** VPN Cookies */
  vpnCookies?: string;
}

/**
 * 港口信息相关类型定义
 */

/**
 * 港口信息对象
 * 对应文档定义：HarborInfo对象
 */
export interface HarborInfo {
  /** 基础地址 */
  baseUrl?: string;
  /** 国家中文名称 */
  countryChinese?: string;
  /** 国家英文名称 */
  countryEnglish?: string;
  /** 创建时间 */
  createTime?: string;
  /** 创建人 */
  createUser?: string;
  /** 40尺集装箱基本运费 */
  freightForty?: number;
  /** 20尺集装箱基本运费 */
  freightTwenty?: number;
  /** 40尺集装箱燃油附加费 */
  fuelForty?: number;
  /** 20尺集装箱燃油附加费 */
  fuelTwenty?: number;
  /** 港埠代码 */
  harborCode?: string;
  /** 主键ID */
  harborId?: string;
  /** 港口中文名称 */
  harborPortChinese?: string;
  /** 港口英文名称 */
  harborPortEnglish?: string;
  /** 所属航线 */
  harborRoute?: string;
  /** 最新更新时间 */
  lastUpdateTime?: string;
  /** 最新更新人 */
  lastUpdateUser?: string;
  /** MTQ代码 */
  mtq?: number;
  /** 40尺集装箱港口附加费 */
  portSurchargeForty?: number;
  /** 20尺集装箱港口附加费 */
  portSurchargeTwenty?: number;
  /** TNE代码 */
  tne?: number;
}

export interface GetByHarborPortEnglishReqVo {
  /** 港口英文名称 */
  harborPortEnglish?: string;
  /** 基础地址 */
  baseUrl?: string;
  /** VPN Cookies */
  vpnCookies?: string;
  exporterAccount?: string;
  exporterPassword?: string;
}


/**
 * 根据国家查询港口信息参数
 * 对应接口：GET /harbor-info/listByCountry
 */
export interface HarborInfoListByCountryQuery {
  /** 国家（中文或英文） */
  country?: string;
  /** 基础地址 */
  baseUrl?: string;
  /** VPN Cookies */
  vpnCookies?: string;
  exporterAccount?: string;
  exporterPassword?: string;
}

export interface FulfillmentProcessStepListReqVo {
  /** 贸易术语 */
  trade?: string;
  /** 结算方式 */
  payment?: string;
  /** 页码 */
  current: number;
  /** 每页显示多少条 */
  size: number;
  /** 搜索条件 */
  search?: string;
}


export interface CrawlRateRespVo{
  /** USD货币汇率 */
  usdRate?: number;
  /** 货币单位 */
  exportPriceUnit?: string;
  /** 进口方货币汇率 */
  exchangeRate?: number;
  /** 进口城市（英文） */
  countryEnglish?: string;
  /** 进口国家（中文） */
  countryChinese?: string;
}

/**
 * 邮件内容对象
 * 对应文档定义：EmailDto
 */
export interface EmailDto {
  /** 邮件正文内容 */
  content?: string;
  /** 合同编号 */
  contractNo?: string;
  /** 收件人邮箱 */
  receiver?: string;
  /** 发件人账号 */
  senderAccount?: string;
  /** 发件人密码 */
  senderPassword?: string;
  /** 发件人角色 */
  senderRole?: string;
  /** 邮件标题 */
  title?: string;
}

export interface ReadEmailReqVo {
  /** 基础地址 */
  baseUrl?: string;
  /** 账号 */
  account?: string;
  /** 密码 */
  password?: string;
  /** 角色 */
  role?: string;
}

/**
 * 邮件模板对象
 * 对应文档定义：EmailTemplateDto
 */
export interface EmailTemplateDto {
  /** 出口商 -> 进口商 第一封邮件 */
  exporterToImporterFirst?: EmailDto;
  /** 出口商 -> 进口商 第二封邮件 */
  exporterToImporterSecond?: EmailDto;
  /** 出口商 -> 供应商 第一封邮件 */
  exporterToSupplierFirst?: EmailDto;
  /** 出口商 -> 供应商 第二封邮件 */
  exporterToSupplierSecond?: EmailDto;
  /** 进口商 -> 出口商 第一封邮件 */
  importerToExporterFirst?: EmailDto;
  /** 进口商 -> 出口商 第二封邮件 */
  importerToExporterSecond?: EmailDto;
  /** 供应商 -> 出口商 第一封邮件 */
  supplierToExporterFirst?: EmailDto;
  /** 供应商 -> 出口商 第二封邮件 */
  supplierToExporterSecond?: EmailDto;
}

/**
 * 邮件发送类型（业务枚举）
 * 后端枚举 code 集合，用于 sendEmail 的 sendType
 */
export type EmailSendType =
  | "EXPORTER_TO_IMPORTER_FIRST"
  | "IMPORTER_TO_EXPORTER_FIRST"
  | "EXPORTER_TO_IMPORTER_SECOND"
  | "IMPORTER_TO_EXPORTER_SECOND"
  | "EXPORTER_TO_SUPPLIER_FIRST"
  | "SUPPLIER_TO_EXPORTER_FIRST"
  | "EXPORTER_TO_SUPPLIER_SECOND"
  | "SUPPLIER_TO_EXPORTER_SECOND";


export interface GetCrawlRate {
  baseUrl?: string;
  account?: string;
  password?: string;
  vpnCookies?: string;
}

/**
 * 贷款申请请求参数
 * 对应文档定义：IssueLoanReqVo
 * 对应接口：POST /loan/apply
 */
export interface IssueLoanReqVo {
  /** 银行编号 */
  bankCode?: string;
  /** 描述 */
  message?: string;
  /** 金额 */
  money?: number;
  /** 币种 */
  moneyType?: string;
  /** 角色 */
  role?: string;
}

export interface ListInPortReqVo {
  /** 基础地址 */
  baseUrl?: string;
  /** VPN Cookies */
  vpnCookies?: string;
  exporterAccount?: string;
  exporterPassword?: string;
}