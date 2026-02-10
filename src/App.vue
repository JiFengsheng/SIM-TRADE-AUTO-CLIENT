<template>
  <a-config-provider :theme="currentTheme">
    <div
      class="w-full h-screen flex app-root app-root--borders overflow-hidden"
      :style="rootStyle"
    >
      <div class="h-full app-border-r app-border-t">
        <!-- 菜单 -->
        <Menu></Menu>
      </div>
      <div class="h-full flex-1 flex flex-col app-border-t min-h-0">
        <!-- 内容区 -->
        <Header></Header>
        <div class="w-full flex-1 overflow-auto scrollbar-w-none">
          <RouterView v-slot="{ Component, route }">
            <!-- 需要缓存的路由 -->
            <keep-alive>
              <component v-if="route.meta?.keepAlive" :is="Component" :key="route.fullPath" />
            </keep-alive>
            <!-- 不缓存的路由 -->
            <component v-if="!route.meta?.keepAlive" :is="Component" :key="route.fullPath" />
          </RouterView>
        </div>
      </div>

    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue';
import { theme } from 'ant-design-vue';
import Menu from './views/menu/index.vue';
import Settings from './views/settings/NormalConfig.vue';
import Header from './views/header/index.vue';
import { useLoadBackgroundConfig } from './hooks/BackgroundConfig';
import { setLocale } from './i18n';

// 主题模式：'light' | 'dark'
const themeMode = ref<'light' | 'dark'>('light');

// 主题颜色
const themeColor = ref('#1677ff');
const { useToken } = theme;
const { token } = useToken();
// 计算主题配置
const currentTheme = computed(() => ({
  cssVar: true,
  hashed: false,
  algorithm: themeMode.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: themeColor.value,
  },
}))

// 自定义主题变量（ant-design-vue 4.x 不暴露 --ant-* 到根节点，故自行注入供页面使用）
const rootStyle = computed(() => {
  const isLight = themeMode.value === 'light'
  // AntD 的 light 模式 colorBgLayout 默认偏灰，这里按需覆盖为纯白
  const appBgColor = isLight ? '#ffffff' : (token.value.colorBgLayout as string)
  // 合同执行日志区域专用颜色：亮色保持深色卡片，暗色沿用主题
  const deskLogCardBg = isLight ? '#273447' : (token.value.colorBgElevated as string)
  const deskLogInnerBg = isLight ? '#1f2937' : 'rgba(0, 0, 0, 0.22)'
  const deskLogText = isLight ? '#eef2ff' : (token.value.colorText as string)
  const deskLogTextSecondary = isLight ? 'rgba(238, 242, 255, 0.72)' : (token.value.colorTextSecondary as string)
  return {
    '--theme-primary-color': themeColor.value,
    '--app-bg-color': appBgColor,
    '--app-bg-container': token.value.colorBgContainer as string,
    '--app-bg-container-hover': token.value.colorBgElevated as string,
    '--app-color-text': token.value.colorText as string,
    '--app-color-text-secondary': token.value.colorTextSecondary as string,
    '--app-border-color': token.value.colorBorder as string,
    '--ant-bg-color': appBgColor,
    '--ant-bg-container': token.value.colorBgContainer as string,
    '--ant-bg-container-hover': token.value.colorBgElevated as string,
    '--ant-color-text': token.value.colorText as string,
    '--ant-color-text-secondary': token.value.colorTextSecondary as string,
    '--ant-border-color': token.value.colorBorder as string,
    '--desk-log-card-bg': deskLogCardBg,
    '--desk-log-inner-bg': deskLogInnerBg,
    '--desk-log-text': deskLogText,
    '--desk-log-text-secondary': deskLogTextSecondary,
  }
})

// 将主题变量同步到 document 根节点，兼容 Teleport 到 body 的组件（Modal/Dropdown 等）
watchEffect(() => {
  if (typeof document === 'undefined') return;
  const style = rootStyle.value as Record<string, string>;
  const el = document.documentElement;
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string') {
      el.style.setProperty(key, value);
    }
  }
});
// 加载应用配置
const loadAppConfig = async () => {
  try {
    const config = await window.electronAPI.getAppConfig();
    themeColor.value = config.themeColor || '#1677ff';
    themeMode.value = config.themeMode === 'dark' ? 'dark' : 'light';
    // 启动时根据配置设置语言，确保菜单等文案正确
    if (config.language === 'en' || config.language === 'zh') {
      setLocale(config.language);
    }
  } catch (error) {
    console.error('加载应用配置失败:', error);
  }
};
// 监听主题颜色变化事件
const handleThemeColorChange = (event: CustomEvent) => {
  themeColor.value = event.detail.color;
};
// 监听主题模式变化事件
const handleThemeModeChange = (event: CustomEvent) => {
  themeMode.value = event.detail.mode === 'dark' ? 'dark' : 'light';
};
onMounted(async () => {
  console.log('App mounted');
  // 加载应用配置
  await loadAppConfig();
  await useLoadBackgroundConfig();
  // 监听主题颜色 / 模式 变化
  window.addEventListener('theme-color-change', handleThemeColorChange as EventListener);
  window.addEventListener('theme-mode-change', handleThemeModeChange as EventListener);
});

</script>

<style scoped>
.app-root {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}
.app-root--borders .app-border-r {
  border-right: 1px solid var(--app-border-color);
}
.app-root--borders .app-border-t {
  border-top: 1px solid var(--app-border-color);
}
</style>