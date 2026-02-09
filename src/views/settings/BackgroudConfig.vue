<template>
  <div class="setting-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-3xl mx-auto py-8 px-8">
      <h1 class="text-2xl font-bold mb-6 text-center">后台配置</h1>

      <a-card class="config-card">
        <a-form :model="config" layout="vertical" class="space-y-6">
          <a-form-item label="请求路径" name="baseUrl" :rules="[
              { required: true, message: '请输入 请求路径' },
              { type: 'url', message: '请输入有效的 URL 地址' }
            ]">
            <a-input v-model:value="config.baseUrl" placeholder="http://localhost:9090" class="w-full" size="large">
              <template #prefix>
                <Icon icon="radix-icons:link-2" class="text-gray-400" />
              </template>
            </a-input>
            <div class="text-sm text-gray-500 mt-2">
              应用请求后端 API 的基础地址，用于所有接口请求
            </div>
          </a-form-item>

          <a-form-item label="端口号" name="port" :rules="[
              { required: true, message: '请输入端口号' },
              { type: 'number', min: 1, max: 65535, message: '端口号范围：1-65535' }
            ]">
            <a-input-number v-model:value="config.port" :min="1" :max="65535" :step="1" class="w-full" size="large"
              placeholder="9090" />
            <div class="text-sm text-gray-500 mt-2">
              用于指定启动本地后端服务运行的端口号
            </div>
          </a-form-item>

          <a-form-item label="是否自动启动后台" name="autoStart">
            <a-switch v-model:checked="config.autoStart" checked-children="是" un-checked-children="否" />
            <div class="text-sm text-gray-500 mt-2">
              开启后，下次应用启动时将自动启动后台服务（仅在本地服务时生效）
            </div>
          </a-form-item>

          <a-divider />

          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <Icon icon="radix-icons:info-circled" class="inline mr-1" />
              配置保存后将立即生效，影响所有 API 请求
            </div>
            <a-button type="primary" @click="handleSave" :loading="saving" size="large" class="min-w-[120px]">
              保存配置
            </a-button>
          </div>
        </a-form>
      </a-card>

      <!-- 配置预览 -->
      <a-card class="config-preview-card mt-6" title="配置预览">
        <div class="space-y-2">
          <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">完整 API 地址：</span>
            <code class="text-sm bg-gray-50 px-3 py-1 rounded">{{ fullApiUrl }}</code>
          </div>
          <div class="text-xs text-gray-400 mt-2">
            <Icon icon="radix-icons:lightbulb" class="inline mr-1" />
            示例接口：{{ fullApiUrl }}/api/example
          </div>
        </div>
      </a-card>

      <!-- 服务状态 -->
      <a-card class="service-status-card mt-6" title="服务状态">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="status-indicator"
              :class="{ 'status-online': serviceStatus === 'running', 'status-offline': serviceStatus === 'stopped' }">
              <Icon :icon="serviceStatus === 'running' ? 'radix-icons:check-circled' : 'radix-icons:cross-circled'"
                :class="serviceStatus === 'running' ? 'text-green-500' : 'text-red-500'" class="text-xl" />
            </div>
            <div>
              <div class="font-medium text-gray-800">
                {{ serviceStatus === 'running' ? '服务运行中' : serviceStatus === 'stopped' ? '服务已停止' : '检查中...' }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ serviceStatus === 'running' ? '后端服务正常运行' : serviceStatus === 'stopped' ? '后端服务未运行或无法连接' : '正在检查服务状态'
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
              检查
            </a-button>
            <a-button v-if="isLocalService" :type="serviceStatus === 'running' ? 'default' : 'primary'"
              :danger="serviceStatus === 'running'" @click="handleServiceAction" :disabled="isChecking" size="large"
              class="min-w-[100px] service-action-btn">
              <template #icon>
                <Icon :icon="serviceStatus === 'running' ? 'radix-icons:stop' : 'radix-icons:play'"
                  class="service-btn-icon" />
              </template>
              {{ serviceStatus === 'running' ? '停止' : '启动' }}
            </a-button>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import type { BackgroundConfig } from '../../../interface';
import { Icon } from '@iconify/vue';
import statusApi from '../../apis/status';
import { useLoadBackgroundConfig as loadConfig, useCheckBackgroundStatus } from '../../hooks/BackgroundConfig';

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
              message.success('服务停止成功');
            } else {
              message.warning('服务停止失败，请手动关闭');
            }
          }
        }, 3000);
      } else {
        message.error('停止服务失败');
      }
    } catch (error) {
      console.error('停止服务失败:', error);
      message.error('停止服务失败');
    }
  } else {
    // 启动服务
    if (!config.value.port) {
      message.error('请先配置端口号');
      return;
    }
    
    try {
      const result = await window.electronAPI.runJar(config.value.port);
      if (result.success) {
        message.success('服务启动中，请稍候...');
        // 轮询检查服务状态，最多检查5次
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(async () => {
          checkCount++;
          await checkServiceStatus(false);
          
          if (serviceStatus.value === 'running' || checkCount >= maxChecks) {
            clearInterval(checkInterval);
            if (serviceStatus.value === 'running') {
              message.success('服务启动成功');
            } else {
              message.warning('服务启动超时，请手动检查服务状态');
            }
          }
        }, 3000);
      } else {
        message.error('启动服务失败: ' + (result.error || '未知错误'));
      }
    } catch (error) {
      console.error('启动服务失败:', error);
      message.error('启动服务失败');
    }
  }
};

// 保存后台配置
const handleSave = async () => {
  // 验证配置
  if (!config.value.baseUrl || !config.value.port) {
    message.error('请填写完整的配置信息');
    return;
  }

  // 验证 URL 格式
  try {
    new URL(config.value.baseUrl);
  } catch {
    message.error('Base URL 格式不正确');
    return;
  }

  // 验证端口号范围
  if (config.value.port < 1 || config.value.port > 65535) {
    message.error('端口号范围：1-65535');
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
      message.success('配置保存成功');
      // 更新全局 API base URL（如果需要在 request.ts 中使用）
      if (typeof window !== 'undefined') {
        (window as Window & { __API_BASE_URL__?: string }).__API_BASE_URL__ = configToSave.baseUrl;
      }
      // 配置保存后重新检查服务状态
      await checkServiceStatus(false);
    } else {
      message.error('保存失败: ' + (result.error || '未知错误'));
    }
  } catch (error) {
    console.error('保存配置失败:', error);
    message.error('保存配置失败');
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
  background-color: var(--ant-bg-color);
  padding: 0;
  margin: 0;
}

.config-card {
  background-color: var(--ant-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.config-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.config-preview-card {
  background-color: var(--ant-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.config-preview-card :deep(.ant-card-head) {
  border-bottom: 1px solid var(--ant-border-color-split);
}

.config-preview-card code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--ant-primary-color);
  font-weight: 500;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: var(--ant-text-color);
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
  background-color: var(--ant-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.service-status-card :deep(.ant-card-head) {
  border-bottom: 1px solid var(--ant-border-color-split);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.status-indicator.status-online {
  background-color: #f6ffed;
  border: 2px solid #b7eb8f;
}

.status-indicator.status-offline {
  background-color: #fff2f0;
  border: 2px solid #ffccc7;
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
</style>
