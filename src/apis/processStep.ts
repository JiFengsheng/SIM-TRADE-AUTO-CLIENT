import request, { ApiResponse } from "../utils/request";
import type { DownloadFileResult, FulfillmentProcessStep, FulfillmentProcessStepResponse,FulfillmentProcessStepListReqVo, IPage } from "./types";

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
   * 批量更新流程步骤
   * 对应文档：PUT /fulfillment-process-step/batchUpdate
   * @returns 
   */
  batchUpdate(data: FulfillmentProcessStep){
    return request.put<boolean>(`/sim-trade/fulfillment-process-step/batchUpdate`, data);
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

  /**
   * 导出流程步骤（文件流下载）
   * 对应文档：GET /fulfillment-process-step/export
   */
  export(filename = "流程步骤.xlsx"): Promise<DownloadFileResult> {
    return request.downloadFile("/sim-trade/fulfillment-process-step/export", {
      filename,
    });
  },

  /**
   * 导入流程步骤
   * 对应文档：POST /fulfillment-process-step/import
   */
  import(file: File | FormData) {
    return request.upload<boolean>("/sim-trade/fulfillment-process-step/import", file);
  },
  /**
   * 上移步骤
   * 对应文档：GET /fulfillment-process-step/moveUp
   * @param stepId 步骤ID
   * @returns 
   */
  moveUp(stepId: string) {
    return request.get<boolean>(`/sim-trade/fulfillment-process-step/moveUp`,{ params: { stepId } });
  },
  /**
   * 下移步骤
   * 对应文档：GET /fulfillment-process-step/moveDown
   * @param stepId 
   * @returns 
   */
  moveDown(stepId: string) {
    return request.get<boolean>(`/sim-trade/fulfillment-process-step/moveDown`,{ params: { stepId } });
  },

  
};

export default processStepApi;
