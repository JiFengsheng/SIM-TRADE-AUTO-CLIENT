<template>
  <div class="setting-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-3xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('settings.title') }}</h1>

      <a-tabs v-model:activeKey="activeTab" class="settings-tabs">
        <!-- 通用配置 Tab -->
        <a-tab-pane key="app" :tab="$t('settings.general')">
          <a-form :model="config" layout="vertical" class="space-y-6 mt-4">
            <a-form-item :label="$t('settings.language')" name="language">
              <a-select
                v-model:value="config.language"
                :placeholder="$t('settings.selectLanguage')"
                class="w-full"
                @change="handleLanguageChange"
              >
                <a-select-option value="zh">{{ $t('settings.chinese') }}</a-select-option>
                <a-select-option value="en">{{ $t('settings.english') }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="$t('settings.themeMode')" name="themeMode">
              <a-radio-group v-model:value="config.themeMode" @change="handleThemeModeChange">
                <a-radio-button value="light">
                  {{ $t('settings.lightMode') }}
                </a-radio-button>
                <a-radio-button value="dark">
                  {{ $t('settings.darkMode') }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>

            <!-- <a-form-item :label="$t('settings.fontSize')" name="fontSize">
              <a-input-number v-model:value="config.fontSize" :min="10" :max="24" :step="1" class="w-full" />
              <div class="text-sm text-gray-500 mt-2">
                {{ $t('settings.currentFontSize') }}: {{ config.fontSize }}px
              </div>
            </a-form-item> -->

            <a-form-item :label="$t('settings.themeColor')" name="themeColor">
              <div class="w-full">
                <div class="grid grid-cols-7 gap-2 mt-2">
                  <div v-for="color in themeColors" :key="color"
                    class="color-block cursor-pointer rounded transition-all duration-200 relative"
                    :class="{ 'selected': config.themeColor === color }" :style="{ backgroundColor: color }"
                    @click="handleThemeColorChange(color)">
                    <div v-if="config.themeColor === color" class="absolute inset-0 flex items-center justify-center">
                      <Icon icon="radix-icons:check" class="text-white text-sm drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="handleSave" :loading="saving" class="w-full" size="large">
                {{ $t('common.saveSettings') }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import type { AppConfig } from '../../../interface';
import { setLocale } from '../../i18n';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
const activeTab = ref('app');

// 主题颜色列表
const themeColors = [
  '#1677ff',
  '#722ed1',
  '#13c2c2',
  '#52c41a',
  '#eb2f96',
  '#f5222d',
  '#fa8c16',
  '#fadb14',
  '#fa541c',
  '#2f54eb',
  '#faad14',
  '#a0d911',
  '#eadb0f',
  '#ff17a9', // 添加当前默认颜色
];

const config = ref<AppConfig>({
  language: 'zh',
  fontSize: 14,
  themeColor: '#ff17a9',
  themeMode: 'light'
});



const saving = ref(false);
const savingModel = ref(false);

// 加载应用配置
const loadConfig = async () => {
  try {
    const savedConfig = await window.electronAPI.getAppConfig();
    config.value = {
      language: savedConfig.language || 'zh',
      fontSize: savedConfig.fontSize || 14,
      themeColor: savedConfig.themeColor || '#ff17a9',
      themeMode: savedConfig.themeMode || 'light',
    };
    // 加载配置后立即设置语言
    setLocale(config.value.language as 'zh' | 'en');
    // 立即更新主题色
    window.dispatchEvent(new CustomEvent('theme-color-change', { detail: { color: config.value.themeColor } }));
    // 立即更新主题模式
    window.dispatchEvent(new CustomEvent('theme-mode-change', { detail: { mode: config.value.themeMode } }));
  } catch (error) {
    console.error('加载配置失败:', error);
    message.error(t('common.loadFailed'));
  }
};



// 处理语言变化（实时更新）
const handleLanguageChange = async (value: string) => {
  // 立即更新 i18n 语言，实现实时切换
  setLocale(value as 'zh' | 'en');
  // 通知主进程更新菜单，传递新的语言值
  // try {
  //   await window.electronAPI.updateMenu(value);
  // } catch (error) {
  //   console.error('更新菜单失败:', error);
  // }
};

// 处理主题模式变化（实时更新）
const handleThemeModeChange = (value: Event) => {
  console.log('handleThemeModeChange', (value.target as HTMLInputElement).value);
  config.value.themeMode = (value.target as HTMLInputElement).value as 'light' | 'dark';
  window.dispatchEvent(new CustomEvent('theme-mode-change', { detail: { mode: config.value.themeMode } }));
};
// 处理主题颜色变化（实时更新）
const handleThemeColorChange = (color: string) => {
  config.value.themeColor = color;
  // 立即更新主题色，触发全局更新事件
  window.dispatchEvent(new CustomEvent('theme-color-change', { detail: { color } }));
};

// 保存应用配置
const handleSave = async () => {
  saving.value = true;
  try {
    // 将响应式对象转换为纯对象，确保可以序列化
    const configToSave: AppConfig = {
      language: config.value.language,
      fontSize: config.value.fontSize,
      themeColor: config.value.themeColor,
      themeMode: config.value.themeMode

    };
    const result = await window.electronAPI.saveAppConfig(configToSave);
    if (result.success) {
      // 确保语言已更新
      setLocale(configToSave.language as 'zh' | 'en');
      // 确保主题色已更新
      window.dispatchEvent(new CustomEvent('theme-color-change', { detail: { color: configToSave.themeColor } }));
      message.success(t('common.settingsSaved'));
    } else {
      message.error(t('common.saveFailed') + ': ' + (result.error || t('common.unknownError')));
    }
  } catch (error) {
    console.error('保存配置失败:', error);
    message.error(t('common.saveFailed'));
  } finally {
    saving.value = false;
  }
};



onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.setting-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
  padding: 0;
  margin: 0;
}

.settings-tabs {
  width: 100%;
}

.settings-tabs :deep(.ant-tabs-content-holder) {
  overflow-y: visible;
}

.settings-tabs :deep(.ant-tabs-content) {
  min-height: 400px;
}

.model-config-card {
  background-color: var(--app-bg-container);
  transition: all 0.3s ease;
}

.model-config-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.26);
  border-color: var(--theme-primary-color, #ff17a9);
}

.color-block {
  aspect-ratio: 1;
  height: 40px;
  border: 2px solid transparent;
  position: relative;
}

.color-block:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-block.selected {
  border-color: var(--app-color-text);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
</style>