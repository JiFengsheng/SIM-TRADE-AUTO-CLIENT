import request from "../utils/request";

/** temp-token 接口返回的 data 类型 */
export interface TempTokenData {
  /** 临时 token */
  token: string;
  /** 过期时间 */
  expirationTime: string;
}

const ADMIN_TOKEN_URL =
  "https://mock.presstime.cn/mock/6983fed6202af9ad2f183659/sim-trade/admin-token";
const TEMP_TOKEN_URL =
  "https://mock.presstime.cn/mock/6983fed6202af9ad2f183659/sim-trade/temp-token";

const tokenApi = {
  /**
   * 获取 admin token（GET 请求）
   * 返回 data 为 token 字符串
   */
  getAdminToken() {
    return request.get<string[]>(ADMIN_TOKEN_URL);
  },

  /**
   * 获取临时 token（GET 请求）
   * 返回 data 包含 token 与过期时间
   */
  getTempToken() {
    return request.get<TempTokenData[]>(TEMP_TOKEN_URL);
  },
};

export default tokenApi;
