import { ref } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import loanApi from "../../apis/loan";
import type { IssueLoanReqVo } from "../../apis/types";

/** 币种选项 */
export const MONEY_TYPE_OPTIONS = [
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "HKD", label: "HKD" },
  { value: "JPY", label: "JPY" },
  { value: "RMB", label: "RMB" },
  { value: "SEK", label: "SEK" },
  { value: "SGD", label: "SGD" },
  { value: "USD", label: "USD" },
];

/** 角色选项（labelKey 用于 i18n） */
export const ROLE_OPTIONS = [
  { value: "EXPORTER", labelKey: "loan.roleExporter" },
  { value: "IMPORTER", labelKey: "loan.roleImporter" },
  { value: "SUPPLIER", labelKey: "loan.roleSupplier" },
];

export const useApplyLoan = () => {
  const { t } = useI18n();
  const submitting = ref(false);

  const applyLoan = async (payload: IssueLoanReqVo) => {
    if (submitting.value) return false;

    if (!payload.bankCode?.trim()) {
      message.warning(t("loan.msgFillBankCode"));
      return false;
    }
    if (payload.money === undefined || payload.money === null || Number.isNaN(Number(payload.money))) {
      message.warning(t("loan.msgFillMoney"));
      return false;
    }
    if (Number(payload.money) <= 0) {
      message.warning(t("loan.msgMoneyMustBePositive"));
      return false;
    }
    if (!payload.moneyType) {
      message.warning(t("loan.msgSelectMoneyType"));
      return false;
    }
    if (!payload.role) {
      message.warning(t("loan.msgSelectRole"));
      return false;
    }

    submitting.value = true;
    const hide = message.loading(t("loan.msgApplying"), 0);
    try {
      const ok = await loanApi.applyLoan(payload);
      if (ok) {
        message.success(t("loan.msgApplySuccess"));
        return true;
      }
      message.error(t("loan.msgApplyFail"));
      return false;
    } catch (error) {
      console.error("申请贷款失败", error);
      message.error(t("loan.msgApplyFailRetry"));
      return false;
    } finally {
      hide();
      submitting.value = false;
    }
  };

  return {
    submitting,
    applyLoan,
  };
};

