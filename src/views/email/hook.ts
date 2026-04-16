import { ref } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import emailApi from "../../apis/email";
import type { EmailDto, EmailSendType, EmailTemplateDto } from "../../apis/types";

/**
 * 业务邮件类型配置（labelKey/descKey 用于 i18n）
 */
export const BUSINESS_EMAIL_CONFIG: Array<{
  code: EmailSendType;
  labelKey: string;
  descKey: string;
  templateKey: keyof EmailTemplateDto;
}> = [
  { code: "EXPORTER_TO_IMPORTER_FIRST", labelKey: "email.businessExporterToImporterFirst", descKey: "email.businessExporterToImporterFirstDesc", templateKey: "exporterToImporterFirst" },
  { code: "IMPORTER_TO_EXPORTER_FIRST", labelKey: "email.businessImporterToExporterFirst", descKey: "email.businessImporterToExporterFirstDesc", templateKey: "importerToExporterFirst" },
  { code: "EXPORTER_TO_IMPORTER_SECOND", labelKey: "email.businessExporterToImporterSecond", descKey: "email.businessExporterToImporterSecondDesc", templateKey: "exporterToImporterSecond" },
  { code: "IMPORTER_TO_EXPORTER_SECOND", labelKey: "email.businessImporterToExporterSecond", descKey: "email.businessImporterToExporterSecondDesc", templateKey: "importerToExporterSecond" },
  { code: "EXPORTER_TO_SUPPLIER_FIRST", labelKey: "email.businessExporterToSupplierFirst", descKey: "email.businessExporterToSupplierFirstDesc", templateKey: "exporterToSupplierFirst" },
  { code: "SUPPLIER_TO_EXPORTER_FIRST", labelKey: "email.businessSupplierToExporterFirst", descKey: "email.businessSupplierToExporterFirstDesc", templateKey: "supplierToExporterFirst" },
  { code: "EXPORTER_TO_SUPPLIER_SECOND", labelKey: "email.businessExporterToSupplierSecond", descKey: "email.businessExporterToSupplierSecondDesc", templateKey: "exporterToSupplierSecond" },
  { code: "SUPPLIER_TO_EXPORTER_SECOND", labelKey: "email.businessSupplierToExporterSecond", descKey: "email.businessSupplierToExporterSecondDesc", templateKey: "supplierToExporterSecond" },
];

/**
 * 邮件模板（8 个业务模板）的获取与保存
 */
export const useEmailTemplate = () => {
  const { t } = useI18n();
  const loading = ref(false);
  const saving = ref(false);
  const template = ref<EmailTemplateDto>({});
  const hideLoading = message.loading(t('email.loadEmailTemplate'), 0);
  const fetchTemplate = async () => {
    loading.value = true;
    try {
      const res = await emailApi.getEmailContent();
      template.value = (res || {}) as EmailTemplateDto;
    } catch (error) {
      console.error("获取邮件模板失败", error);
      message.error(t("email.msgFetchTemplateFail"));
    } finally {
      loading.value = false;
      hideLoading()
    }
  };

  const saveTemplate = async (payload?: EmailTemplateDto) => {
    const data = payload ?? template.value;
    if (!data) return false;
    saving.value = true;
    try {
      const ok = await emailApi.saveEmailContent(data);
      if (ok) {
        message.success(t("email.msgSaveTemplateSuccess"));
      } else {
        message.error(t("email.msgSaveTemplateFail"));
      }
      return ok;
    } catch (error) {
      console.error("保存邮件模板失败", error);
      message.error(t("email.msgSaveTemplateFailRetry"));
      return false;
    } finally {
      saving.value = false;
    }
  };

  /**
   * 获取（若不存在则初始化）某个业务类型对应的邮件对象
   */
  const getEmailByKey = (key: keyof EmailTemplateDto): EmailDto => {
    if (!template.value[key]) {
      // 确保为可响应对象
      (template.value as EmailTemplateDto)[key] = {};
    }
    return (template.value[key] || {}) as EmailDto;
  };

  return {
    loading,
    saving,
    template,
    fetchTemplate,
    saveTemplate,
    getEmailByKey,
  };
};

/**
 * 发送业务邮件（8 种类型）
 */
export const useSendBusinessEmail = () => {
  const { t } = useI18n();
  const sendingMap = ref<Record<EmailSendType, boolean>>({
    EXPORTER_TO_IMPORTER_FIRST: false,
    IMPORTER_TO_EXPORTER_FIRST: false,
    EXPORTER_TO_IMPORTER_SECOND: false,
    IMPORTER_TO_EXPORTER_SECOND: false,
    EXPORTER_TO_SUPPLIER_FIRST: false,
    SUPPLIER_TO_EXPORTER_FIRST: false,
    EXPORTER_TO_SUPPLIER_SECOND: false,
    SUPPLIER_TO_EXPORTER_SECOND: false,
  });

  const sendBusinessEmail = async (type: EmailSendType, payload: EmailDto) => {
    if (sendingMap.value[type]) return;

    if (!payload.title || !payload.content) {
      message.warning(t("email.msgFillTitleAndContent"));
      return;
    }

    sendingMap.value[type] = true;
    try {
      const ok = await emailApi.sendEmail(type, payload);
      if (ok) {
        message.success(t("email.msgSendSuccess"));
      } else {
        message.error(t("email.msgSendFail"));
      }
      return ok;
    } catch (error) {
      console.error("发送业务邮件失败", error);
      message.error(t("email.msgSendFailRetry"));
      return false;
    } finally {
      sendingMap.value[type] = false;
    }
  };

  return {
    sendingMap,
    sendBusinessEmail,
  };
};

/**
 * 通用邮件发送
 */
export const useSendNormalEmail = () => {
  const { t } = useI18n();
  const sending = ref(false);

  const sendNormalEmail = async (payload: EmailDto) => {
    if (sending.value) return;

    if (!payload.senderAccount) {
      message.warning(t("email.msgFillAccountPassword"));
      return;
    }
    if (!payload.senderRole) {
      message.warning(t("email.msgSelectSenderRole"));
      return;
    }
    if (!payload.receiver) {
      message.warning(t("email.msgFillReceiver"));
      return;
    }
    if (!payload.content) {
      message.warning(t("email.msgFillContent"));
      return;
    }

    sending.value = true;
    try {
      const ok = await emailApi.sendNormalEmail(payload);
      if (ok) {
        message.success(t("email.msgSendSuccess"));
      } else {
        message.error(t("email.msgSendFail"));
      }
      return ok;
    } catch (error) {
      console.error("发送通用邮件失败", error);
      message.error(t("email.msgSendFailRetry"));
      return false;
    } finally {
      sending.value = false;
    }
  };

  return {
    sending,
    sendNormalEmail,
  };
};

export const useReadEmails = () =>{
  const { t } = useI18n();
  const reading = ref(false);

  const readEmails = async (role: string) => {
    if (reading.value) return;
    reading.value = true;
    try {
      const ok = await emailApi.readEmails({ role } );
      if (ok) {
        message.success(t("email.msgReadEmailsSuccess"));
      } else {
        message.error(t("email.msgReadEmailsFailRetry"));
      }
      return ok;
    }catch(error) {
      console.error("读取邮件失败", error);
      message.error(t("email.msgReadEmailsFailRetry"));
      return false;
    } finally {
      reading.value = false;
    }
    
  };

  return {
    reading,
    readEmails,
  };
};
