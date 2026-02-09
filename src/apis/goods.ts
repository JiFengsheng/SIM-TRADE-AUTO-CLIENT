import request from "../utils/request";
import type { GoodsInfo } from "./types";

const goodsApi = {
  /**
   * 获取所有商品基本信息
   */
  getAll() {
    return request.get<GoodsInfo[]>("/sim-trade/goods-info");
  },

  /**
   * 创建商品基本信息
   */
  create(data: GoodsInfo) {
    return request.post<boolean>("/sim-trade/goods-info", data);
  },

  /**
   * 根据ID获取商品基本信息
   */
  getById(id: string) {
    return request.get<GoodsInfo>(`/sim-trade/goods-info/${id}`);
  },

  /**
   * 更新商品基本信息
   */
  update(id: string, data: GoodsInfo) {
    return request.put<boolean>(`/sim-trade/goods-info/${id}`, data);
  },

  /**
   * 删除商品基本信息
   */
  delete(id: string) {
    return request.delete<boolean>(`/sim-trade/goods-info/${id}`);
  },
};

export default goodsApi;

