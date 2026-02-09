export type languageType = "zh" | "en"

export interface MenuItem {
  key: string;
  label: string;
  title: string;
  icon?: () => any;
  route?: string;
  children?: MenuItem[];
}