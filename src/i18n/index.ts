import { createI18n } from 'vue-i18n';
import zh from '../locales/zh';
import en from '../locales/en';

export type SupportedLocale = 'zh' | 'en';

const messages = {
  zh,
  en,
};

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages,
});

// 设置语言
export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale;
}

// 获取当前语言
export function getLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale;
}

