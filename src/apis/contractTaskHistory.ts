import request from "../utils/request";
import type { ContractTaskHistory } from "./types";

const contractTaskHistoryApi = {
  /**
   * 获取所有合同任务执行历史信息
   */
  getAll() {
    return request.get<ContractTaskHistory[]>("/sim-trade/contract-task-history");
  },

  /**
   * 创建合同任务执行历史信息
   */
  create(data: ContractTaskHistory) {
    return request.post<boolean>("/sim-trade/contract-task-history", data);
  },

  /**
   * 获取当前最新的历史记录（全部）
   */
  getCurrentHistory() {
    return request.get<ContractTaskHistory[]>("/sim-trade/contract-task-history/getCurrentHistory");
  },

  /**
   * 获取已完成的历史记录
   * 对应文档：GET /contract-task-history/getDoneHistory
   */
  getDoneHistory(contractId?: string) {
    return request.get<ContractTaskHistory[]>("/sim-trade/contract-task-history/getDoneHistory", {
      params: { contractId },
    });
  },

  /**
   * 获取当前最新的历史记录（按合同）
   */
  getLatestHistory(contractId?: string) {
    return request.get<ContractTaskHistory[]>("/sim-trade/contract-task-history/getLatestHistory", {
      params: { contractId },
    });
  },

  /**
   * 根据批次获取历史记录
   */
  listByBatch(params: { batch?: string; contractId?: string }) {
    return request.get<ContractTaskHistory[]>("/sim-trade/contract-task-history/listByBatch", {
      params,
    });
  },

  /**
   * 根据ID获取合同任务执行历史信息
   */
  getById(id: string) {
    return request.get<ContractTaskHistory>(`/sim-trade/contract-task-history/${id}`);
  },

  /**
   * 更新合同任务执行历史信息
   */
  update(id: string, data: ContractTaskHistory) {
    return request.put<boolean>(`/sim-trade/contract-task-history/${id}`, data);
  },

  /**
   * 删除合同任务执行历史信息
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/contract-task-history/${id}`);
  },
};

export default contractTaskHistoryApi;

