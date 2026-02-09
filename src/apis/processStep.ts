import request, { ApiResponse } from "../utils/request";
import type { FulfillmentProcessStep, FulfillmentProcessStepResponse,FulfillmentProcessStepListReqVo, IPage } from "./types";

const processStepApi = {
  /**
   * 获取所有流程步骤详情
   * 对应文档：GET /fulfillment-process-step
   */
  getAll() {
    return request.get<FulfillmentProcessStep[]>("/sim-trade/fulfillment-process-step");
  },

  /**
   * 创建流程步骤详情
   * 对应文档：POST /fulfillment-process-step
   */
  create(data: FulfillmentProcessStep) {
    return request.post<boolean>("/sim-trade/fulfillment-process-step", data);
  },

  /**
   * 获取第一个步骤
   * 对应文档：GET /fulfillment-process-step/getFirstProcessStep
   */
  getFirstStep(processCode?: string) {
    return request.get<FulfillmentProcessStep>(
      "/sim-trade/fulfillment-process-step/getFirstProcessStep",
      { params: { processCode } },
    );
  },

  /**
   * 获取最后一个步骤
   * 对应文档：GET /fulfillment-process-step/getLastProcessStep
   */
  getLastStep(processCode?: string) {
    return request.get<FulfillmentProcessStep>(
      "/sim-trade/fulfillment-process-step/getLastProcessStep",
      { params: { processCode } },
    );
  },

  /**
   * 获取可执行的流程步骤
   * 对应文档：GET /fulfillment-process-step/getNextExecuteProcessStep
   */
  getNextExecuteSteps(contractId?: string, processCode?: string) {
    return request.get<FulfillmentProcessStep[]>(
      "/sim-trade/fulfillment-process-step/getNextExecuteProcessStep",
      { params: { contractId, processCode } },
    );
  },

  /**
   * 获取下一个流程步骤 Map
   * 对应文档：GET /fulfillment-process-step/getNextProcessStepMap
   */
  getNextProcessStepMap(processCode?: string, putEmptyList?: boolean) {
    return request.get<Record<string, FulfillmentProcessStep[]>>(
      "/sim-trade/fulfillment-process-step/getNextProcessStepMap",
      { params: { processCode, putEmptyList } },
    );
  },
  /**
     * 根据流程编码获取流程步骤列表
     * 对应文档：POST /fulfillment-process-step/list
     */
  list(data: FulfillmentProcessStepListReqVo) {
    return request.post<IPage<FulfillmentProcessStep>>("/sim-trade/fulfillment-process-step/list", data);
  },
  /**
   * 根据流程编码获取流程步骤列表
   * 对应文档：GET /fulfillment-process-step/listByProcessCode
   */
  listByProcessCode(processCode?: string) {
    return request.get<FulfillmentProcessStep[]>(
      "/sim-trade/fulfillment-process-step/listByProcessCode",
      { params: { processCode } },
    );
  },

  /**
   * 根据ID获取流程步骤详情
   * 对应文档：GET /fulfillment-process-step/{id}
   */
  getById(id: string) {
    return request.get<FulfillmentProcessStep>(`/sim-trade/fulfillment-process-step/${id}`);
  },

  /**
   * 更新流程步骤详情
   * 对应文档：PUT /fulfillment-process-step/{id}
   */
  update(id: string, data: FulfillmentProcessStep) {
    return request.put<boolean>(`/sim-trade/fulfillment-process-step/${id}`, data);
  },

  /**
   * 删除流程步骤详情
   * 对应文档：DELETE /fulfillment-process-step/{id}
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/fulfillment-process-step/${id}`);
  },
  /**
   * 获取未执行的流程步骤
   * 对应文档：GET /fulfillment-process-step/getUndoProcessSteps
   */
  getUndoProcessSteps(processCode?: string,contractId?: string) {
    return request.get<FulfillmentProcessStep[]>(
      "/sim-trade/fulfillment-process-step/getUndoProcessSteps",
      { params: { processCode, contractId } },
    );
  },
  /**
   * 获取已执行的流程步骤
   * 对应文档：GET /fulfillment-process-step/getDoneProcessSteps
   */
  getDoneProcessSteps(processCode?: string,contractId?: string): Promise<FulfillmentProcessStepResponse[]|ApiResponse<FulfillmentProcessStepResponse[]>> {
    return request.get<FulfillmentProcessStepResponse[]>(
      "/sim-trade/fulfillment-process-step/getDoneProcessSteps",
      { params: { processCode, contractId } },
    );
  },
};

export default processStepApi;
