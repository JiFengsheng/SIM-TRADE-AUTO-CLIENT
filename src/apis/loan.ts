import http from "../utils/request";
import type { IssueLoanReqVo } from "./types";

const loanApi = {
  /**
   * 贷款申请
   * 对应文档：POST /loan/apply
   */
  applyLoan(data: IssueLoanReqVo) {
    return http.post<boolean>("/sim-trade/loan/apply", data);
  },
};

export default loanApi;

