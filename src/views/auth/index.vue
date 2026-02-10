<template>
  <div class="auth-page">
    <div class="auth-page__bg" />
    <div class="auth-page__overlay" />
    <div class="auth-page__content">
      <div class="auth-card">
        <h1 class="auth-card__title">身份认证</h1>
        <p class="auth-card__desc">请输入您的认证 Token 以继续使用</p>
        <a-form :model="form" layout="vertical" class="auth-card__form" @submit.prevent="onSubmit">
          <a-form-item name="token" :rules="[{ required: true, message: '请输入认证 Token' }]">
            <a-input-password v-model:value="form.token" placeholder="请输入认证 Token" size="large" allow-clear
              :disabled="loading" autocomplete="off" />
          </a-form-item>
          <a-form-item class="auth-card__submit">
            <a-button type="primary" html-type="submit" size="large" block :loading="loading">
              认证
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "./hook";

const route = useRoute();
const router = useRouter();
const { form, loading, handleSubmit } = useAuth();

async function onSubmit() {
  const success = await handleSubmit();
  if (!success) return;
  const redirect = route.query.redirect;
  const target =
    typeof redirect === "string" && redirect && redirect !== "/auth"
      ? redirect
      : "/";
  router.push(target);
}
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--app-bg-color);
  color: var(--app-color-text);
}

.auth-page__bg {
  position: absolute;
  inset: 0;
  background: url("../../assets/images/auth.png") center center / cover no-repeat;
  z-index: 0;
}

.auth-page__overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* 暗色遮罩，提升文字与卡片层次 */
  /* background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.55) 100%
  ); */
}

.auth-page__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 24px;
}

.auth-card {
  background: color-mix(in srgb, var(--app-bg-container) 92%, transparent);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.35),
    0 2px 6px rgba(0, 0, 0, 0.22);
  padding: 40px 36px;
  border: 1px solid color-mix(in srgb, var(--app-border-color) 70%, transparent);
}

.auth-card__title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: var(--app-color-text);
  text-align: center;
  letter-spacing: 0.02em;
}

.auth-card__desc {
  margin: 0 0 28px;
  font-size: 14px;
  color: var(--app-color-text-secondary);
  text-align: center;
  line-height: 1.5;
}

.auth-card__form :deep(.ant-form-item) {
  margin-bottom: 20px;
}

.auth-card__submit {
  margin-bottom: 0;
  margin-top: 8px;
}

.auth-card__submit :deep(.ant-btn) {
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
}
</style>
