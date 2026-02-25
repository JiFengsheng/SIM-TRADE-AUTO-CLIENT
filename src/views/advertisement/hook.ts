import { ref } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import advertisementApi from "../../apis/advertisement";
import type { AdvertisementDto, PublishInfoDto } from "../../apis/types";

/** 角色选项（labelKey 用于 i18n） */
export const ROLE_OPTIONS = [
  { value: "EXPORTER", labelKey: "advertisement.roleExporter" },
  { value: "IMPORTER", labelKey: "advertisement.roleImporter" },
  { value: "SUPPLIER", labelKey: "advertisement.roleSupplier" },
  { value: "ISSUING_BANK", labelKey: "advertisement.roleIssuingBank" },
  { value: "NEGOTIATING_BANK", labelKey: "advertisement.roleNegotiatingBank" },
];

/** 发布广告类型选项 */
export const ADS_TYPE_OPTIONS = [
  { value: "COMPANY", labelKey: "advertisement.adsTypeCompany" },
  { value: "GOODS", labelKey: "advertisement.adsTypeGoods" },
];

/** 发布信息类型选项 */
export const INFO_TYPE_OPTIONS = [
  { value: "SUPPLY", labelKey: "advertisement.infoTypeSupply" },
  { value: "DEMAND", labelKey: "advertisement.infoTypeDemand" },
  { value: "OTHER", labelKey: "advertisement.infoTypeOther" },
];

/**
 * 发布广告
 */
export const usePublishAds = () => {
  const { t } = useI18n();
  const submitting = ref(false);

  const publishAds = async (payload: AdvertisementDto) => {
    if (submitting.value) return;
    if (!payload.account || !payload.password) {
      message.warning(t("advertisement.msgFillAccountPassword"));
      return;
    }
    if (!payload.roleCode) {
      message.warning(t("advertisement.msgSelectRole"));
      return;
    }
    if (!payload.title?.trim()) {
      message.warning(t("advertisement.msgFillTitle"));
      return;
    }
    if (!payload.content?.trim()) {
      message.warning(t("advertisement.msgFillContent"));
      return;
    }
    if (payload.advertisementType === "GOODS" && !payload.goodsNo?.trim()) {
      message.warning(t("advertisement.msgFillGoodsNo"));
      return;
    }

    submitting.value = true;
    try {
      const ok = await advertisementApi.publishAds(payload);
      if (ok) {
        message.success(t("advertisement.msgPublishAdsSuccess"));
        return true;
      }
      message.error(t("advertisement.msgPublishAdsFail"));
      return false;
    } catch (error) {
      console.error("发布广告失败", error);
      message.error(t("advertisement.msgPublishAdsFailRetry"));
      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    submitting,
    publishAds,
  };
};

/**
 * 发布信息
 */
export const usePublishInfo = () => {
  const { t } = useI18n();
  const submitting = ref(false);

  const publishInfo = async (payload: PublishInfoDto) => {
    if (submitting.value) return;
    if (!payload.account || !payload.password) {
      message.warning(t("advertisement.msgFillAccountPassword"));
      return;
    }
    if (!payload.roleCode) {
      message.warning(t("advertisement.msgSelectRole"));
      return;
    }
    if (!payload.title?.trim()) {
      message.warning(t("advertisement.msgFillTitle"));
      return;
    }
    if (!payload.content?.trim()) {
      message.warning(t("advertisement.msgFillContent"));
      return;
    }

    submitting.value = true;
    try {
      const ok = await advertisementApi.publishInfo(payload);
      if (ok) {
        message.success(t("advertisement.msgPublishInfoSuccess"));
        return true;
      }
      message.error(t("advertisement.msgPublishInfoFail"));
      return false;
    } catch (error) {
      console.error("发布信息失败", error);
      message.error(t("advertisement.msgPublishInfoFailRetry"));
      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    submitting,
    publishInfo,
  };
};
