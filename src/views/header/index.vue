<template>
  <div id="header" class="w-full h-[48px] bg-white border-b border-gray-200 flex items-center px-2 py-1">
    <a-button type="text" @click="toggleCollapsed" class="icon-button mr-1">
      <MenuUnfoldOutlined v-if="isCollapsed" />
      <MenuFoldOutlined v-else />
    </a-button>
    <span>{{ headerTitle }}</span>
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
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.icon-button :deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
}
</style>