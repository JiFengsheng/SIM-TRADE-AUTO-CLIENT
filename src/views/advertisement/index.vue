<template>
  <div class="advertisement-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-6xl mx-auto py-8 px-4 lg:px-6">
      <h1 class="text-2xl font-bold mb-6 text-center">
        {{ $t('advertisement.pageTitle') }}
      </h1>

      <a-card class="advertisement-card" :bordered="false">
        <template #title>
          <div class="section-header">
            <span class="section-title">{{ $t('advertisement.sectionTitle') }}</span>
            <span class="section-subtitle">
              {{ $t('advertisement.sectionSubtitle') }}
            </span>
          </div>
        </template>

        <a-tabs v-model:activeKey="activeKey" class="advertisement-tabs">
          <a-tab-pane key="ads" :tab="$t('advertisement.tabAds')">
            <div class="pt-2">
              <PublishAds />
            </div>
          </a-tab-pane>
          <a-tab-pane key="info" :tab="$t('advertisement.tabInfo')">
            <div class="pt-2">
              <PublishInfo />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PublishAds from "./PublishAds.vue";
import PublishInfo from "./PublishInfo.vue";

const activeKey = ref<"ads" | "info">("ads");
</script>

<style scoped>
.advertisement-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.advertisement-card {
  background-color: var(--app-bg-container);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
}

.advertisement-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.26);
  transform: translateY(-1px);
}

.section-header {
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 8px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--app-color-text);
}

.section-subtitle {
  font-size: 12px;
  color: var(--app-color-text-secondary);
  margin-top: 4px;
}

.scrollbar-w-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-w-none::-webkit-scrollbar {
  display: none;
}
</style>
