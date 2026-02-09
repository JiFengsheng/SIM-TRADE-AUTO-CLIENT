import apiRequest from "../utils/request";
import type {
  AccountInfoDto,
  CompanyInfoDto,
  IPage,
  SysProfileParameter,
  SysProfileParameterListQuery,
} from "./types";

const sysProfileParameterApi = {
  /**
   * 获取所有系统配置
   */
  getAll() {
    return apiRequest.get<SysProfileParameter[]>("/sim-trade/sys-profile-parameter");
  },

  /**
   * 创建系统配置
   */
  create(data: SysProfileParameter) {
    return apiRequest.post<boolean>("/sim-trade/sys-profile-parameter", data);
  },

  /**
   * 分页查询系统配置
   * 对应文档：GET /sys-profile-parameter/list
   */
  list(params: SysProfileParameterListQuery) {
    return apiRequest.get<IPage<SysProfileParameter>>("/sim-trade/sys-profile-parameter/list", {
      params,
    });
  },

  /**
   * 根据ID获取系统配置
   */
  getById(id: string) {
    return apiRequest.get<SysProfileParameter>(`/sim-trade/sys-profile-parameter/${id}`);
  },

  /**
   * 更新系统配置
   */
  update(id: string, data: SysProfileParameter) {
    return apiRequest.put<boolean>(`/sim-trade/sys-profile-parameter/${id}`, data);
  },

  /**
   * 删除系统配置
   */
  delete(id: string) {
    return apiRequest.delete<boolean>(`/sim-trade/sys-profile-parameter/${id}`);
  },

  /**
   * 获取公司信息
   * 对应文档：POST /sys-profile-parameter/getCompany/{companyCode}
   */
  getCompany(companyCode: string) {
    return apiRequest.post<AccountInfoDto>(
      `/sim-trade/sys-profile-parameter/getCompany/${companyCode}`
    );
  },

  /**
   * 更新公司信息
   * 对应文档：POST /sys-profile-parameter/updateCompany/{companyCode}
   */
  updateCompany(companyCode: string, data: CompanyInfoDto) {
    return apiRequest.post<boolean>(
      `/sim-trade/sys-profile-parameter/updateCompany/${companyCode}`,
      data,
      {
        timeout: 30000, // 30秒超时
      }
    );
  },
};

export default sysProfileParameterApi;
