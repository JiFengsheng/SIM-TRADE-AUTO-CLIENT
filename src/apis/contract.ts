import request from "../utils/request";
import type {
  ContractInfo,
  ContractInfoListVo,
  ExecuteContractReqVo,
  IPage,
} from "./types";

const contractApi = {
  /**
   * 获取所有合同基础信息
   */
  getAll() {
    return request.get<ContractInfo[]>("/sim-trade/contract-info");
  },

  /**
   * 创建合同基础信息
   */
  create(data: ContractInfo) {
    return request.post<boolean>("/sim-trade/contract-info", data);
  },

  /**
   * 执行合同
   * 对应文档：POST /contract-info/executeContract
   */
  executeContract(data: ExecuteContractReqVo) {
    return request.post<boolean>("/sim-trade/contract-info/executeContract", data, {
      timeout: 60000, // 60秒超时
    });
  },

  /**
   * 执行单个步骤
   * 对应文档：POST /contract-info/executeStep
   */
  executeStep(contractCode?: string, stepCode?: string) {
    return request.post<boolean>("/sim-trade/contract-info/executeStep", null, {
      params: { contractCode, stepCode },
      timeout: 60000, // 60秒超时
    });
  },

  /**
   * 停止合同
   * 对应文档：POST /contract-info/stopContract
   */
  stopContract(contractId?: string, wait?: boolean) {
    return request.post<boolean>("/sim-trade/contract-info/stopContract", null, {
      params: { contractId, wait },
    });
  },

  /**
   * 获取当前执行中的合同信息
   */
  getCurrentInfo() {
    return request.get<ContractInfo>("/sim-trade/contract-info/getCurrentInfo");
  },

  /**
   * 获取合同记录列表（分页）
   */
  list(data: ContractInfoListVo) {
    return request.post<IPage<ContractInfo>>("/sim-trade/contract-info/list", data);
  },

  /**
   * 根据ID获取合同基础信息
   */
  getById(id: string) {
    return request.get<ContractInfo>(`/sim-trade/contract-info/${id}`);
  },

  /**
   * 更新合同基础信息
   */
  update(id: string, data: ContractInfo) {
    return request.put<boolean>(`/sim-trade/contract-info/${id}`, data);
  },

  /**
   * 删除合同基础信息
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/contract-info/${id}`);
  },
};

export default contractApi;
