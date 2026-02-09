<template>
  <a-config-provider :theme="currentTheme">
    <div class="w-full h-screen flex app-root overflow-hidden" :style="{ '--theme-primary-color': themeColor }">
      <div class="h-full border-r border-t border-gray-200">
        <!-- 菜单 -->
        <Menu></Menu>
      </div>
      <div class="h-full flex-1 flex flex-col border-t border-gray-200 min-h-0">
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
import { onMounted,ref,computed } from 'vue';
import { theme } from 'ant-design-vue';
import Menu from './views/menu/index.vue';
import Settings from './views/settings/NormalConfig.vue';
import Header from './views/header/index.vue';
import { useLoadBackgroundConfig } from './hooks/BackgroundConfig';
import { setLocale } from './i18n';

// 主题模式：'light' | 'dark'
const themeMode = ref<'light' | 'dark'>('light')

// 主题颜色
const themeColor = ref('#1677ff')

// 计算主题配置
const currentTheme = computed(() => ({
  cssVar: true,
  hashed: false,
  algorithm: themeMode.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: themeColor.value,
  },
}))
// 加载应用配置
const loadAppConfig = async () => {
  try {
    const config = await window.electronAPI.getAppConfig();
    themeColor.value = config.themeColor || '#1677ff';
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
onMounted(async () => {
  console.log('App mounted');
  // 加载应用配置
  await loadAppConfig();
  await useLoadBackgroundConfig();
  // 监听主题颜色变化
  window.addEventListener('theme-color-change', handleThemeColorChange as EventListener);
});

</script>