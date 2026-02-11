import { useAuthStore } from "../../stores/auth";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import tokenApi from "../../apis/token";
import type { TempTokenData } from "../../apis/token";
import { unwrapApiData } from "../../utils/request";

export const useAuth = () => {
  const { t } = useI18n();
  const authStore = useAuthStore();
  const form = reactive<{ token: string }>({
    token: "",
  });
  
  const loading = ref(false);
  
  /** 提交认证，成功返回 true，失败返回 false */
  const handleSubmit = async (): Promise<boolean> => {
    const token = form.token?.trim();
    if (!token) {
      message.warning(t("auth.tokenRequired"));
      return false;
    }

    loading.value = true;
    authStore.clearAuth();

    try {
      const [adminTokens, tempData] = await Promise.all([
        tokenApi.getAdminToken(),
        tokenApi.getTempToken(),
      ]);
      const tokenList = unwrapApiData<string[]>(adminTokens)||[]
      if (tokenList.includes(token)) {
        authStore.setAuthAsAdmin(token);
        message.success(t("auth.msgSuccess"));
        return true;
      }

      const temp = unwrapApiData<TempTokenData[]>(tempData)||[]
      const tempToken = temp.find(t => t.token === token)
      if (tempToken) {
        const expiration = new Date(tempToken.expirationTime);
        const now = new Date();
        if (expiration.getTime() < now.getTime()){
          authStore.clearAuth();
          message.error(t("auth.msgExpired"));
          return false;
        } else {
          authStore.setAuthAsTemp(token, tempToken.expirationTime);
          message.success(t("auth.msgSuccess"));
          return true;
        }
      }

      authStore.clearAuth();
      message.error(t("auth.msgInvalid"));
      return false;
    } catch (err) {
      authStore.clearAuth();
      message.error(t("auth.msgRequestFailed"));
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    authStore,
    form,
    loading,
    handleSubmit
  };
};