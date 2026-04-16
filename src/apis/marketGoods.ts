import request from "../utils/request";
import type { MarketGoodsInfo, GetMarketReqVo, GetMarketGoodsInfoRespVo } from "./types";

/**
 * 市场货品接口
 * 对应文档：市场货品接口 (Market Goods Info Controller)
 */
const marketGoodsApi = {
  /**
   * 获取所有市场货品
   * 对应文档：GET /market-goods-info
   */
  getAll() {
    return request.get<MarketGoodsInfo[]>("/sim-trade/market-goods-info");
  },

  /**
   * 创建市场货品
   * 对应文档：POST /market-goods-info
   */
  create(data: MarketGoodsInfo) {
    return request.post<boolean>("/sim-trade/market-goods-info", data);
  },

  /**
   * 根据 code 获取市场货品（GET 方式）
   * 对应文档：GET /market-goods-info/{code}
   */
  getByCode(code: string) {
    return request.get<MarketGoodsInfo>(`/sim-trade/market-goods-info/${encodeURIComponent(code)}`);
  },

  /**
   * 根据 code 获取市场货品（POST 方式，可带账号、密码等）
   * 对应文档：POST /market-goods-info/get
   */
  getByCodePost(data: GetMarketReqVo) {
    return request.post<GetMarketGoodsInfoRespVo>("/sim-trade/market-goods-info/get", data,{
      timeout: 300000, // 300秒超时
    });
  },

  /**
   * 更新市场货品
   * 对应文档：PUT /market-goods-info/{id}
   */
  update(id: string, data: MarketGoodsInfo) {
    return request.put<boolean>(`/sim-trade/market-goods-info/${id}`, data);
  },

  /**
   * 删除市场货品
   * 对应文档：DELETE /market-goods-info/{id}
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/market-goods-info/${id}`);
  },
};

export default marketGoodsApi;
