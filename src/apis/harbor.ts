import apiRequest from "../utils/request";
import type { HarborInfo, HarborInfoListByCountryQuery } from "./types";

const harborApi = {
  /**
   * 获取所有港口信息
   * 对应文档：GET /harbor-info
   */
  getAll() {
    return apiRequest.get<HarborInfo[]>("/sim-trade/harbor-info");
  },

  /**
   * 创建港口信息
   * 对应文档：POST /harbor-info
   */
  create(data: HarborInfo) {
    return apiRequest.post<boolean>("/sim-trade/harbor-info", data);
  },

  /**
   * 根据国家查询港口信息
   * 对应文档：GET /harbor-info/listByCountry
   */
  listByCountry(params?: HarborInfoListByCountryQuery) {
    return apiRequest.get<HarborInfo[]>("/sim-trade/harbor-info/listByCountry", {
      params,
    });
  },

  /**
   * 获取国内港口信息
   * 对应文档：GET /harbor-info/listInPort
   */
  listInPort() {
    return apiRequest.get<HarborInfo[]>("/sim-trade/harbor-info/listInPort");
  },

  /**
   * 根据ID获取港口信息
   * 对应文档：GET /harbor-info/{id}
   */
  getById(id: string) {
    return apiRequest.get<HarborInfo>(`/sim-trade/harbor-info/${id}`);
  },

  /**
   * 更新港口信息
   * 对应文档：PUT /harbor-info/{id}
   */
  update(id: string, data: HarborInfo) {
    return apiRequest.put<boolean>(`/sim-trade/harbor-info/${id}`, data);
  },

  /**
   * 删除港口信息
   * 对应文档：DELETE /harbor-info/{id}
   */
  delete(id: string) {
    return apiRequest.delete<boolean>(`/sim-trade/harbor-info/${id}`);
  },
};

export default harborApi;
