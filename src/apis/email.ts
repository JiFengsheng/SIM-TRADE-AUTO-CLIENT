import request from "../utils/request";
import type { EmailDto, EmailTemplateDto, EmailSendType } from "./types";

const emailApi = {
  /**
   * 获取邮件模板内容
   * 对应文档：GET /email/getEmailContent
   */
  getEmailContent() {
    return request.get<EmailTemplateDto>("/sim-trade/email/getEmailContent");
  },

  /**
   * 保存邮件模板内容
   * 对应文档：POST /email/saveEmailContent
   */
  saveEmailContent(data: EmailTemplateDto) {
    return request.post<boolean>("/sim-trade/email/saveEmailContent", data);
  },

  /**
   * 发送邮件（业务）
   * 对应文档：POST /email/sendEmail/{sendType}
   * @param sendType 发送类型（后端定义的业务类型编码）
   */
  sendEmail(sendType: EmailSendType, data: EmailDto) {
    return request.post<boolean>(`/sim-trade/email/sendEmail/${sendType}`, data);
  },

  /**
   * 发送邮件（通用）
   * 对应文档：POST /email/sendNormalEmail
   */
  sendNormalEmail(data: EmailDto) {
    return request.post<boolean>("/sim-trade/email/sendNormalEmail", data);
  },
};

export default emailApi;

