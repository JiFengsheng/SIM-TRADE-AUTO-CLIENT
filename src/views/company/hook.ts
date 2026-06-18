import { ref, watch } from "vue";
import sysProfileParameterApi from "../../apis/sysProfileParameter";
import type { CompanyInfoDto } from "../../apis/types";

export type CompanyCode =
  | "EXPORTER_COMPANY"
  | "IMPORTER_COMPANY"
  | "SUPPLIER_COMPANY"
  | "ISSUING_BANK_COMPANY"
  | "NEGOTIATING_BANK_COMPANY";

type CompanyInfoKey = keyof CompanyInfoDto;

const COMPANY_INFO_KEYS: CompanyInfoKey[] = [
  "abbreviationChinese",
  "abbreviationEnglish",
  "account",
  "accountCode",
  "addressChinese",
  "addressEnglish",
  "country",
  "creditCode",
  "email",
  "fax",
  "fullNameChinese",
  "fullNameEnglish",
  "introduction",
  "legalPersonChinese",
  "legalPersonEnglish",
  "password",
  "phone",
  "postalCode",
  "registeredCapital",
  "userCode",
  "website",
];

const pickCompanyInfoDto = (src: unknown): CompanyInfoDto => {
  const record = (src ?? {}) as Record<string, unknown>;
  const dst: CompanyInfoDto = {};
  COMPANY_INFO_KEYS.forEach((key) => {
    const value = record[key as string];
    if (value !== undefined) {
      (dst as Record<string, unknown>)[key as string] = value;
    }
  });
  return dst;
};

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== "";

const preserveAccountPassword = (prev: CompanyInfoDto, next: CompanyInfoDto): CompanyInfoDto => {
  const merged = { ...next };
  if (hasValue(prev.account) && !hasValue(merged.account)) {
    merged.account = prev.account;
  }
  if (hasValue(prev.password) && !hasValue(merged.password)) {
    merged.password = prev.password;
  }
  return merged;
};

/**
 * 公司信息（按 companyCode 拉取/保存）
 */
export const useCompanyProfile = (initialCompanyCode: CompanyCode = "EXPORTER_COMPANY") => {
  const activeCompanyCode = ref<CompanyCode>(initialCompanyCode);
  const loading = ref(false);
  const saving = ref(false);

  // 当前 tab 的表单数据
  const form = ref<CompanyInfoDto>({});

  const fetchCompany = async (companyCode: CompanyCode = activeCompanyCode.value) => {
    loading.value = true;
    try {
      const res = await sysProfileParameterApi.getCompany(companyCode);
      form.value = pickCompanyInfoDto(res);
      return res;
    } finally {
      loading.value = false;
    }
  };

  const saveCompany = async (companyCode: CompanyCode = activeCompanyCode.value) => {
    saving.value = true;
    try {
      const prevAccountPassword = {
        account: form.value.account,
        password: form.value.password,
      };
      const payload = pickCompanyInfoDto(form.value);
      const ok = await sysProfileParameterApi.updateCompany(companyCode, payload);
      const res = await sysProfileParameterApi.getCompany(companyCode);
      form.value = preserveAccountPassword(prevAccountPassword, pickCompanyInfoDto(res));
      return ok;
    } finally {
      saving.value = false;
    }
  };

  // 切换 tab 时自动拉取对应公司信息
  watch(
    activeCompanyCode,
    async (code) => {
      await fetchCompany(code);
    },
    { immediate: true }
  );

  return {
    activeCompanyCode,
    loading,
    saving,
    form,
    fetchCompany,
    saveCompany,
  };
};
