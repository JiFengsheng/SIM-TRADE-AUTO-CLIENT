<template>
  <div id="sim-menu" class="h-full">

    <a-menu class="h-full" v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="light"
      @select="handleSelect" :inline-collapsed="isCollapsed" :items="items"></a-menu>

  </div>

</template>

<script setup lang="ts">
import { reactive, watch, onMounted, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMenuItems } from './setting';
import { useMenuStore } from '../../stores/menu';
import type { MenuItem } from '../../types';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const { t, locale } = useI18n();

const state = reactive({
  selectedKeys: [route.path],
  openKeys: ['systemConfig'],
  preOpenKeys: ['systemConfig'],
});

const items = computed(() => getMenuItems(t));

const findMenuItemByKey = (list: MenuItem[], key: string): MenuItem | null => {
  for (const item of list) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findMenuItemByKey(item.children, key);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const updateSelectedInStore = (key: string) => {
  const matchedItem = findMenuItemByKey(items.value as any, key);
  if (matchedItem) {
    menuStore.setSelected({
      key: matchedItem.key,
      title: matchedItem.title || matchedItem.label,
    });
  }
};
watchEffect(() => {
  // 语言变化时，重新注入菜单 items（label/title 会随 t() 更新）
  // 同时保证 store 中的当前标题与当前语言一致
  menuStore.setItems(items.value as any);
  updateSelectedInStore(route.path);
});

const isCollapsed = computed(() => menuStore.collapsed);



// 根据当前路由同步选中项
const syncSelectedByRoute = () => {
  const currentPath = route.path;
  state.selectedKeys = [currentPath];
  updateSelectedInStore(currentPath);
  // 自动展开“系统配置”分组
  if (['/normalConfig', '/backgroundConfig'].includes(currentPath)) {
    state.openKeys = ['systemConfig'];
  }
};

onMounted(() => {
  syncSelectedByRoute();
});

watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);

watch(
  () => route.path,
  () => {
    syncSelectedByRoute();
  },
);

// 显式依赖 locale，确保语言切换时触发一次同步（避免个别情况下 watchEffect 未能覆盖）
watch(
  () => locale.value,
  () => {
    syncSelectedByRoute();
  },
);
watch(
  () => isCollapsed.value,
  (collapsed) => {
    if (collapsed) {
      state.openKeys = [];
    } else {
      state.openKeys = state.preOpenKeys.length ? state.preOpenKeys : ['systemConfig'];
    }
  },
  { immediate: true },
);

const handleSelect = (e: any) => {
  const targetRoute = e.key as string;
  if (targetRoute) {
    router.push(targetRoute);
    updateSelectedInStore(targetRoute);
  }
};

</script>

<style scoped>
#sim-menu {
  background-color: var(--app-bg-color);
}
</style>