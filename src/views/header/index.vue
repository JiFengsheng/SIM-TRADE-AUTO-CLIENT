<template>
  <div id="header" class="header-root w-full h-[48px] border-b flex items-center px-2 py-1">
    <a-button type="text" @click="toggleCollapsed" class="icon-button mr-1">
      <MenuUnfoldOutlined v-if="isCollapsed" />
      <MenuFoldOutlined v-else />
    </a-button>
    <span class="header-title">{{ headerTitle }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { useMenuStore } from '../../stores/menu';

const menuStore = useMenuStore();
const isCollapsed = computed(() => menuStore.collapsed);
const headerTitle = computed(() => menuStore.selectedTitle);

const toggleCollapsed = () => {
  menuStore.toggleCollapsed();
};

</script>

<style scoped>
.header-root {
  background-color: var(--app-bg-container);
  border-bottom-color: var(--app-border-color);
  color: var(--app-color-text);
}

.header-title {
  color: var(--app-color-text);
  font-weight: 600;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--app-color-text);
}

.icon-button :deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
}

.icon-button:hover {
  background-color: var(--app-bg-container-hover);
}
</style>