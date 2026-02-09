import request from "../utils/request";
import type { BusinessConfig,CrawlRateRespVo } from "./types";

const businessConfigApi = {
  /**
   * 获取所有业务基本配置
   */
  getAll() {
    return request.get<BusinessConfig[]>("/sim-trade/businessConfig");
  },

  /**
   * 创建业务基本配置
   */
  create(data: BusinessConfig) {
    return request.post<boolean>("/sim-trade/businessConfig", data);
  },

  /**
   * 获取当前配置
   */
  getCurrent() {
    return request.get<BusinessConfig>("/sim-trade/businessConfig/getCurrentConfig");
  },

  /**
   * 根据ID获取业务基本配置
   */
  getById(id: string) {
    return request.get<BusinessConfig>(`/sim-trade/businessConfig/${id}`);
  },

  /**
   * 更新业务基本配置
   */
  update(id: string, data: BusinessConfig) {
    return request.put<BusinessConfig>(`/sim-trade/businessConfig/${id}`, data);
  },

  /**
   * 删除业务基本配置
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/businessConfig/${id}`);
  },
  /**
   * 获取汇率
   */
  getCrawlRate(account: string,password: string) {
    return request.get<CrawlRateRespVo>(`/sim-trade/businessConfig/getCrawlRate?account=${account}&password=${password}`);
  },
};

export default businessConfigApi;
