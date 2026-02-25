import apiRequest from "../utils/request";
import type { AdvertisementDto, PublishInfoDto } from "./types";

const advertisementApi = {
  /**
   * 发布广告
   * 对应文档：POST /advertisement/publishAds
   */
  publishAds(data: AdvertisementDto) {
    return apiRequest.post<boolean>("/sim-trade/advertisement/publishAds", data);
  },

  /**
   * 发布信息
   * 对应文档：POST /advertisement/publishInfo
   */
  publishInfo(data: PublishInfoDto) {
    return apiRequest.post<boolean>("/sim-trade/advertisement/publishInfo", data);
  },
};

export default advertisementApi;
