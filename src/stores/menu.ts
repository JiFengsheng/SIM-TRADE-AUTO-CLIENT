import { defineStore } from "pinia";
import type { MenuItem } from "../types";

export interface MenuStore {
  items: MenuItem[];
  selectedKey: string;
  selectedTitle: string;
  collapsed: boolean;
}



export const useMenuStore = defineStore('menu', {
  state: (): MenuStore => ({
    items: [],
    selectedKey: '/',
    selectedTitle: '首页',
    collapsed: false,
  }),
  actions: {
    setItems(items: MenuItem[]) {
      this.items = items;
    },
    setSelected(payload: { key: string; title: string }) {
      this.selectedKey = payload.key;
      this.selectedTitle = payload.title;
    },
    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed;
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
  getters: {
    getItems: (state) => state.items,
    getSelectedKey: (state) => state.selectedKey,
    getSelectedTitle: (state) => state.selectedTitle,
    getCollapsed: (state) => state.collapsed,
  },
});