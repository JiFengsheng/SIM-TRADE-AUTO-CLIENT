<template>
  <div class="setting-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-3xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('backgroundConfig.pageTitle') }}</h1>

      <a-card class="config-card">
        <a-form :model="config" layout="vertical" class="space-y-6">
          <a-form-item :label="$t('backgroundConfig.baseUrlLabel')" name="baseUrl" :rules="[
              { required: true, message: $t('backgroundConfig.baseUrlRequired') },
              { type: 'url', message: $t('backgroundConfig.baseUrlInvalid') }
            ]">
            <a-input v-model:value="config.baseUrl" placeholder="http://localhost:9090" class="w-full" size="large">
              <template #prefix>
                <Icon icon="radix-icons:link-2" class="setting-text-tertiary" />
              </template>
            </a-input>
            <div class="text-sm setting-text-secondary mt-2">
              {{ $t('backgroundConfig.baseUrlHint') }}
            </div>
          </a-form-item>

          <a-form-item :label="$t('backgroundConfig.portLabel')" name="port" :rules="[
              { required: true, message: $t('backgroundConfig.portRequired') },
              { type: 'number', min: 1, max: 65535, message: $t('backgroundConfig.portRange') }
            ]">
            <a-input-number v-model:value="config.port" :min="1" :max="65535" :step="1" class="w-full" size="large"
              placeholder="9090" />
            <div class="text-sm setting-text-secondary mt-2">
              {{ $t('backgroundConfig.portHint') }}
            </div>
          </a-form-item>

          <a-form-item :label="$t('backgroundConfig.autoStartLabel')" name="autoStart">
            <a-switch v-model:checked="config.autoStart" :checked-children="$t('backgroundConfig.yes')" :un-checked-children="$t('backgroundConfig.no')" />
            <div class="text-sm setting-text-secondary mt-2">
              {{ $t('backgroundConfig.autoStartHint') }}
            </div>
          </a-form-item>

          <a-divider />

          <div class="flex items-center justify-between">
            <div class="text-sm setting-text-secondary">
              <Icon icon="radix-icons:info-circled" class="inline mr-1" />
              {{ $t('backgroundConfig.saveHint') }}
            </div>
            <a-button type="primary" @click="handleSave" :loading="saving" size="large" class="min-w-[120px]">
              {{ $t('backgroundConfig.saveConfig') }}
            </a-button>
          </div>
        </a-form>
      </a-card>

      <!-- 配置预览 -->
      <a-card hoverable class="config-preview-card mt-6" :title="$t('backgroundConfig.configPreview')">
        <div class="space-y-2">
          <div class="flex items-center justify-between py-2 border-b setting-border">
            <span class="setting-text-secondary">{{ $t('backgroundConfig.fullApiUrl') }}</span>
            <code class="text-sm setting-code-bg px-3 py-1 rounded">{{ fullApiUrl }}</code>
          </div>
          <div class="text-xs setting-text-tertiary mt-2">
            <Icon icon="radix-icons:lightbulb" class="inline mr-1" />
            {{ $t('backgroundConfig.exampleApi', { url: fullApiUrl }) }}
          </div>
        </div>
      </a-card>

      <!-- 服务状态 -->
      <a-card hoverable class="service-status-card mt-6" :title="$t('backgroundConfig.serviceStatus')">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="status-indicator"
              :class="{ 'status-online': serviceStatus === 'running', 'status-offline': serviceStatus === 'stopped' }">
              <Icon :icon="serviceStatus === 'running' ? 'radix-icons:check-circled' : 'radix-icons:cross-circled'"
                :class="serviceStatus === 'running' ? 'text-green-500' : 'text-red-500'" class="text-xl" />
            </div>
            <div>
              <div class="font-medium setting-text">
                {{ serviceStatus === 'running' ? $t('backgroundConfig.statusRunning') : serviceStatus === 'stopped' ? $t('backgroundConfig.statusStopped') : $t('backgroundConfig.statusChecking') }}
              </div>
              <div class="text-sm setting-text-secondary mt-1">
                {{ serviceStatus === 'running' ? $t('backgroundConfig.statusRunningDesc') : serviceStatus === 'stopped' ? $t('backgroundConfig.statusStoppedDesc') : $t('backgroundConfig.statusCheckingDesc')
                }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a-button type="default" @click="checkServiceStatus" :loading="isChecking" size="large"
              class="check-status-btn">
              <template #icon>
                <Icon icon="radix-icons:reload" class="service-btn-icon" />
              </template>
              {{ $t('backgroundConfig.check') }}
            </a-button>
            <a-button v-if="isLocalService" :type="serviceStatus === 'running' ? 'default' : 'primary'"
              :danger="serviceStatus === 'running'" @click="handleServiceAction" :disabled="isChecking" size="large"
              class="min-w-[100px] service-action-btn">
              <template #icon>
                <Icon :icon="serviceStatus === 'running' ? 'radix-icons:stop' : 'radix-icons:play'"
                  class="service-btn-icon" />
              </template>
              {{ serviceStatus === 'running' ? $t('backgroundConfig.stop') : $t('backgroundConfig.start') }}
            </a-button>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import type { BackgroundConfig } from '../../../interface';
import { Icon } from '@iconify/vue';
import statusApi from '../../apis/status';
import { useLoadBackgroundConfig as loadConfig, useCheckBackgroundStatus } from '../../hooks/BackgroundConfig';

const { t } = useI18n();

const config = ref<BackgroundConfig>({
  baseUrl: 'http://localhost:9090',
  port: 9090,
  autoStart: false,
});

const saving = ref(false);

// 使用公共的检查服务状态 hook，内部维护 serviceStatus / isChecking / checkingStatus
const {
  serviceStatus,
  isChecking,
  checkingStatus,
  checkServiceStatus,
} = useCheckBackgroundStatus();

// 计算完整的 API URL
const fullApiUrl = computed(() => {
  try {
    const url = new URL(config.value.baseUrl);
    url.port = String(config.value.port);
    return url.toString().replace(/\/$/, ''); // 移除末尾的斜杠
  } catch {
    return `${config.value.baseUrl}:${config.value.port}`;
  }
});

// 判断是否是本地服务
const isLocalService = computed(() => {
  try {
    const url = new URL(config.value.baseUrl);
    const hostname = url.hostname.toLowerCase();
    
    // 检查是否是 localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
});



// 处理服务操作（启动/停止）
const handleServiceAction = async () => {
  if (serviceStatus.value === 'running') {
    // 停止服务
    try {
      // const result = await window.electronAPI.stopJar();
      const result = await statusApi.shutdown();
      console.log('result', result);
      if (result) {
        // message.success('服务停止成功');
        // 等待一下再检查状态
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(async () => {
          checkCount++;
          await checkServiceStatus(false);
          
          if (serviceStatus.value !== 'running' || checkCount >= maxChecks) {
            clearInterval(checkInterval);
            if (serviceStatus.value !== 'running') {
              message.success(t('backgroundConfig.msgStopSuccess'));
            } else {
              message.warning(t('backgroundConfig.msgStopFail'));
            }
          }
        }, 3000);
      } else {
        message.error(t('backgroundConfig.msgStopError'));
      }
    } catch (error) {
      console.error('停止服务失败:', error);
      message.error(t('backgroundConfig.msgStopError'));
    }
  } else {
    // 启动服务
    if (!config.value.port) {
      message.error(t('backgroundConfig.msgPortRequired'));
      return;
    }
    
    try {
      const result = await window.electronAPI.runJar(config.value.port);
      if (result.success) {
        message.success(t('backgroundConfig.msgStarting'));
        // 轮询检查服务状态，最多检查5次
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(async () => {
          checkCount++;
          await checkServiceStatus(false);
          
          if (serviceStatus.value === 'running' || checkCount >= maxChecks) {
            clearInterval(checkInterval);
            if (serviceStatus.value === 'running') {
              message.success(t('backgroundConfig.msgStartSuccess'));
            } else {
              message.warning(t('backgroundConfig.msgStartTimeout'));
            }
          }
        }, 3000);
      } else {
        message.error(t('backgroundConfig.msgStartError') + ': ' + (result.error || t('common.unknownError')));
      }
    } catch (error) {
      console.error('启动服务失败:', error);
      message.error(t('backgroundConfig.msgStartError'));
    }
  }
};

// 保存后台配置
const handleSave = async () => {
  // 验证配置
  if (!config.value.baseUrl || !config.value.port) {
    message.error(t('backgroundConfig.msgConfigRequired'));
    return;
  }

  // 验证 URL 格式
  try {
    new URL(config.value.baseUrl);
  } catch {
    message.error(t('backgroundConfig.msgBaseUrlInvalid'));
    return;
  }

  // 验证端口号范围
  if (config.value.port < 1 || config.value.port > 65535) {
    message.error(t('backgroundConfig.portRange'));
    return;
  }

  saving.value = true;
  try {
    const configToSave: BackgroundConfig = {
      baseUrl: config.value.baseUrl.trim(),
      port: config.value.port,
      autoStart: config.value.autoStart,
    };
    console.log('configToSave', configToSave);
    const result = await window.electronAPI.saveBackgroundConfig(configToSave);
    if (result.success) {
      message.success(t('backgroundConfig.msgSaveSuccess'));
      // 更新全局 API base URL（如果需要在 request.ts 中使用）
      if (typeof window !== 'undefined') {
        (window as Window & { __API_BASE_URL__?: string }).__API_BASE_URL__ = configToSave.baseUrl;
      }
      // 配置保存后重新检查服务状态
      await checkServiceStatus(false);
    } else {
      message.error(t('backgroundConfig.msgSaveFail') + ': ' + (result.error || t('common.unknownError')));
    }
  } catch (error) {
    console.error('保存配置失败:', error);
    message.error(t('backgroundConfig.msgSaveError'));
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  // 加载配置到当前表单
  const loadedConfig = await loadConfig(config);
  // 确保 autoStart 始终有布尔值
  if (typeof loadedConfig.value.autoStart !== 'boolean') {
    loadedConfig.value.autoStart = false;
  }
  // 加载配置后检查服务状态
  await checkServiceStatus();
});
</script>

<style scoped>
.setting-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
  padding: 0;
  margin: 0;
}

.config-card {
  background-color: var(--app-bg-container);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.config-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
}

.config-preview-card {
  background-color: var(--app-bg-container);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.config-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
}

.config-preview-card :deep(.ant-card-head) {
  border-bottom: 1px solid var(--app-border-color);
}

.config-preview-card code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--theme-primary-color, #1677ff);
  font-weight: 500;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--app-color-text);
}

:deep(.ant-input),
:deep(.ant-input-number) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.ant-input):focus,
:deep(.ant-input-number):focus {
  border-color: var(--theme-primary-color, #1677ff);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

:deep(.ant-btn-primary) {
  background-color: var(--theme-primary-color, #1677ff);
  border-color: var(--theme-primary-color, #1677ff);
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.ant-btn-primary):hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

.service-status-card {
  background-color: var(--app-bg-container);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.service-status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
}

.service-status-card :deep(.ant-card-head) {
  border-bottom: 1px solid var(--app-border-color);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--app-bg-container-hover);
  transition: all 0.3s ease;
}

.status-indicator.status-online {
  background-color: rgba(82, 196, 26, 0.14);
  border: 2px solid rgba(82, 196, 26, 0.35);
}

.status-indicator.status-offline {
  background-color: rgba(255, 77, 79, 0.14);
  border: 2px solid rgba(255, 77, 79, 0.35);
}

:deep(.ant-btn-dangerous) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

:deep(.ant-btn-dangerous):hover {
  background-color: #ff7875;
  border-color: #ff7875;
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.service-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.service-action-btn :deep(.anticon),
.service-action-btn :deep(.service-btn-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  margin-right: 6px;
  font-size: 16px;
}

.service-action-btn :deep(span) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.check-status-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.check-status-btn :deep(.anticon),
.check-status-btn :deep(.service-btn-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  margin-right: 6px;
  font-size: 16px;
}

.check-status-btn :deep(span) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.setting-text {
  color: var(--app-color-text);
}

.setting-text-secondary {
  color: var(--app-color-text-secondary);
}

.setting-text-tertiary {
  color: var(--app-color-text-secondary);
  opacity: 0.75;
}

.setting-border {
  border-color: var(--app-border-color);
}

.setting-code-bg {
  background-color: var(--app-bg-container-hover);
}
</style>
