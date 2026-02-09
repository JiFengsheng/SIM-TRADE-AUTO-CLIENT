import request from "../utils/request";
import type { FulfillmentProcessType } from "./types";

const processTypeApi = {
  /**
   * 获取所有履约流程类型
   * 对应文档：GET /fulfillment-process-type
   */
  getAll() {
    return request.get<FulfillmentProcessType[]>("/sim-trade/fulfillment-process-type");
  },

  /**
   * 创建履约流程类型
   * 对应文档：POST /fulfillment-process-type
   */
  create(data: FulfillmentProcessType) {
    return request.post<boolean>("/sim-trade/fulfillment-process-type", data);
  },

  /**
   * 根据ID获取履约流程类型
   * 对应文档：GET /fulfillment-process-type/{id}
   */
  getById(id: string) {
    return request.get<FulfillmentProcessType>(`/sim-trade/fulfillment-process-type/${id}`);
  },

  /**
   * 更新履约流程类型
   * 对应文档：PUT /fulfillment-process-type/{id}
   */
  update(id: string, data: FulfillmentProcessType) {
    return request.put<boolean>(`/sim-trade/fulfillment-process-type/${id}`, data);
  },

  /**
   * 删除履约流程类型
   * 对应文档：DELETE /fulfillment-process-type/{id}
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/fulfillment-process-type/${id}`);
  },
};

export default processTypeApi;
