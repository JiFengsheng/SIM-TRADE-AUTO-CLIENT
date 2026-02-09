import apiRequest from "../utils/request";
import type { DownloadFileResult } from "./types";

const COMPANY_CODE_NAME_MAP: Record<string, string> = {
  EXPORTER_COMPANY: "出口商信息",
  IMPORTER_COMPANY: "进口商信息",
  SUPPLIER_COMPANY: "供应商信息",
  NEGOTIATING_BANK_COMPANY: "出口地银行信息",
  ISSUING_BANK_COMPANY: "进口地银行信息",
};

const getExportFilenameByCompanyCode = (companyCode: string): string => {
  const name = COMPANY_CODE_NAME_MAP[companyCode] || companyCode || "公司信息";
  return `${name}.xlsx`;
};

const companyApi = {
  COMPANY_CODE_NAME_MAP,
  /**
   * 导出公司信息（文件流下载）
   * 对应文档：GET /company/export/{companyCode}
   */
  export(companyCode: string, filename?: string): Promise<DownloadFileResult> {
    return apiRequest.downloadFile(`/sim-trade/company/export/${companyCode}`, {
      filename: filename ?? getExportFilenameByCompanyCode(companyCode),
    });
  },

  /**
   * 导入公司信息
   * 对应文档：POST /company/import/{companyCode}
   */
  import(companyCode: string, file: File | FormData) {
    return apiRequest.upload<boolean>(`/sim-trade/company/import/${companyCode}`, file);
  },
};

export default companyApi;
