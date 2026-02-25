<template>
  <div class="email-page w-full h-full overflow-y-auto scrollbar-w-none">
    <div class="w-full max-w-6xl mx-auto py-8 px-4 lg:px-6">
      <h1 class="email-title text-2xl font-bold mb-6 text-center">
        {{ $t('email.pageTitle') }}
      </h1>

      <a-card class="email-card" :bordered="false">
        <template #title>
          <div class="section-header">
            <span class="section-title">{{ $t('email.sectionTitle') }}</span>
            <span class="section-subtitle">
              {{ $t('email.sectionSubtitle') }}
            </span>
          </div>
        </template>

        <a-tabs v-model:activeKey="activeKey" class="email-tabs">
          <a-tab-pane key="business" :tab="$t('email.tabBusiness')">
            <div class="pt-2">
              <BusinessEmail />
            </div>
          </a-tab-pane>
          <a-tab-pane key="normal" :tab="$t('email.tabNormal')">
            <div class="pt-2">
              <NormalEmail />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BusinessEmail from "./BusinessEmail.vue";
import NormalEmail from "./NormalEmail.vue";

const activeKey = ref<"business" | "normal">("business");
</script>

<style scoped>
.email-page {
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.email-card {
  background-color: var(--app-bg-container);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
}

.email-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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

.email-title {
  color: var(--app-color-text);
}

.scrollbar-w-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-w-none::-webkit-scrollbar {
  display: none;
}
</style>