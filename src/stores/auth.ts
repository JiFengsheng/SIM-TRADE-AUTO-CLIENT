import { defineStore } from "pinia";

export interface AuthStore {
  token: string;
  expirationTime: string;
  isAuthenticated: boolean;
  authTime: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    token: '',
    expirationTime: '',
    isAuthenticated: false,
    authTime: '',
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setExpirationTime(expirationTime: string) {
      this.expirationTime = expirationTime;
    },
    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated;
    },
    setAuthTime(authTime: string) {
      this.authTime = authTime;
    },
    /** 认证成功：永久 token（管理员） */
    setAuthAsAdmin(token: string) {
      this.token = token;
      this.expirationTime = "2099-12-31 23:59:59";
      this.isAuthenticated = true;
      this.authTime = new Date().toISOString();
    },
    /** 认证成功：临时 token（带过期时间） */
    setAuthAsTemp(token: string, expirationTime: string) {
      this.token = token;
      this.expirationTime = expirationTime;
      this.isAuthenticated = true;
      this.authTime = new Date().toISOString();
    },
    /** 登出 / 认证失败时清空状态 */
    clearAuth() {
      this.token = "";
      this.expirationTime = "";
      this.isAuthenticated = false;
      this.authTime = "";
    },
  },
  getters: {
    getToken: (state) => state.token,
    getExpirationTime: (state) => state.expirationTime,
    isTokenExpired: (state) => {
      if (!state.expirationTime) return true;
      const expiration = new Date(state.expirationTime);
      const now = new Date();
      return expiration.getTime() < now.getTime();
    },
    getIsAuthenticated: (state) => state.isAuthenticated,
    getAuthTime: (state) => state.authTime,
  },
});