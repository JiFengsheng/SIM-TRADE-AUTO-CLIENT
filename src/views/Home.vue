<template>
  <div class="home-root w-full h-full overflow-auto scrollbar-w-none">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <!-- 主标题区域 -->
      <div class="text-center mb-16">
        <h1 class="home-title text-6xl font-bold mb-4 tracking-tight">
          Sim Trade
        </h1>
        <p class="home-subtitle text-xl mb-2">{{ $t('home.subtitle') }}</p>
        <p class="home-desc text-sm">{{ $t('home.desc') }}</p>
      </div>

      <!-- Sim Trade 平台介绍 -->
      <div class="home-card rounded-2xl p-8 mb-12">
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <Icon icon="mdi:earth" class="text-5xl text-blue-600" />
          </div>
          <div class="flex-1">
            <h2 class="home-h2 text-2xl font-semibold mb-4">{{ $t('home.aboutTitle') }}</h2>
            <p class="home-text leading-relaxed mb-4">
              {{ $t('home.aboutP1') }}
            </p>
            <p class="home-text leading-relaxed mb-4">
              {{ $t('home.aboutP2') }}
            </p>
            <a 
              href="https://www.desunsoft.net/simtradeykdx/login.aspx" 
              target="_blank"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Icon icon="mdi:open-in-new" class="text-lg" />
              {{ $t('home.visitPlatform') }}
            </a>
          </div>
        </div>
      </div>

      <!-- 软件功能说明 -->
      <div class="mb-12">
        <h2 class="home-h2 text-3xl font-bold text-center mb-8">{{ $t('home.featuresTitle') }}</h2>
        <div class="home-card rounded-2xl p-8">
          <p class="home-text text-lg leading-relaxed mb-6 text-center">
            {{ $t('home.featuresIntro') }}
          </p>
        </div>
      </div>

      <!-- 核心功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- 自动创建合同 -->
        <div class="home-card rounded-xl p-6 transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-blue-100 rounded-lg p-3">
              <Icon icon="mdi:file-document-edit" class="text-3xl text-blue-600" />
            </div>
            <h3 class="home-h3 text-xl font-semibold">{{ $t('home.cardAutoContract') }}</h3>
          </div>
          <p class="home-text-secondary leading-relaxed">
            {{ $t('home.cardAutoContractDesc') }}
          </p>
        </div>

        <!-- 角色模拟 -->
        <div class="home-card rounded-xl p-6 transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-green-100 rounded-lg p-3">
              <Icon icon="mdi:account-group" class="text-3xl text-green-600" />
            </div>
            <h3 class="home-h3 text-xl font-semibold">{{ $t('home.cardMultiRole') }}</h3>
          </div>
          <p class="home-text-secondary leading-relaxed">
            {{ $t('home.cardMultiRoleDesc') }}
          </p>
        </div>

        <!-- 自动化执行 -->
        <div class="home-card rounded-xl p-6 transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-purple-100 rounded-lg p-3">
              <Icon icon="mdi:robot" class="text-3xl text-purple-600" />
            </div>
            <h3 class="home-h3 text-xl font-semibold">{{ $t('home.cardAutomation') }}</h3>
          </div>
          <p class="home-text-secondary leading-relaxed">
            {{ $t('home.cardAutomationDesc') }}
          </p>
        </div>
      </div>

      <!-- 角色展示 -->
      <div class="mb-12">
        <h2 class="home-h2 text-3xl font-bold text-center mb-8">{{ $t('home.rolesTitle') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="home-card rounded-lg p-4 text-center transition-shadow">
            <Icon icon="mdi:account-tie" class="text-4xl text-blue-600 mb-2 mx-auto" />
            <p class="home-text text-sm font-medium">{{ $t('home.roleExporter') }}</p>
          </div>
          <div class="home-card rounded-lg p-4 text-center transition-shadow">
            <Icon icon="mdi:account-tie-outline" class="text-4xl text-green-600 mb-2 mx-auto" />
            <p class="home-text text-sm font-medium">{{ $t('home.roleImporter') }}</p>
          </div>
          <div class="home-card rounded-lg p-4 text-center transition-shadow">
            <Icon icon="mdi:factory" class="text-4xl text-orange-600 mb-2 mx-auto" />
            <p class="home-text text-sm font-medium">{{ $t('home.roleSupplier') }}</p>
          </div>
          <div class="home-card rounded-lg p-4 text-center transition-shadow">
            <Icon icon="mdi:bank" class="text-4xl text-purple-600 mb-2 mx-auto" />
            <p class="home-text text-sm font-medium">{{ $t('home.roleExportBank') }}</p>
          </div>
          <div class="home-card rounded-lg p-4 text-center transition-shadow">
            <Icon icon="mdi:bank-outline" class="text-4xl text-indigo-600 mb-2 mx-auto" />
            <p class="home-text text-sm font-medium">{{ $t('home.roleImportBank') }}</p>
          </div>
        </div>
      </div>

      <!-- 优势特点 -->
      <div class="home-card-banner bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 class="text-3xl font-bold text-center mb-8">{{ $t('home.whyUsTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <Icon icon="mdi:lightning-bolt" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.whyEfficient') }}</h3>
            <p class="text-blue-100">{{ $t('home.whyEfficientDesc') }}</p>
          </div>
          <div class="text-center">
            <Icon icon="mdi:shield-check" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.whyAccurate') }}</h3>
            <p class="text-blue-100">{{ $t('home.whyAccurateDesc') }}</p>
          </div>
          <div class="text-center">
            <Icon icon="mdi:school" class="text-5xl mb-4 mx-auto" />
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.whyLearn') }}</h3>
            <p class="text-blue-100">{{ $t('home.whyLearnDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
</script>

<style scoped>
.home-root {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.home-card {
  background-color: var(--app-bg-container);
  border: 1px solid var(--app-border-color);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.home-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
}

.home-title,
.home-h2,
.home-h3 {
  color: var(--app-color-text);
}

.home-subtitle {
  color: var(--app-color-text-secondary);
}
.home-desc {
  color: var(--app-color-text-secondary);
  opacity: 0.9;
}

.home-text {
  color: var(--app-color-text);
}
.home-text-secondary {
  color: var(--app-color-text-secondary);
}

.home-card-banner {
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.home-card-banner:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
}
</style>