import { h } from 'vue';
import {
  HomeOutlined,
  DesktopOutlined,
  SettingOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ProfileOutlined,
  BranchesOutlined
} from '@ant-design/icons-vue';

/**
 * 获取菜单项配置
 * @returns 菜单项数组
 */
export type MenuT = (key: string) => string;

export function getMenuItems(t: MenuT) {
  return [
    {
      key: '/',
      icon: () => h(HomeOutlined),
      label: t('sidebar.home'),
      title: t('sidebar.home'),
      route: '/',
    },
    {
      key: '/desk',
      icon: () => h(DesktopOutlined),
      label: t('sidebar.desk'),
      title: t('sidebar.desk'),
      route: '/desk',
    },
    {
      key: '/contract',
      icon: () => h(FileTextOutlined),
      label: t('sidebar.contract'),
      title: t('sidebar.contract'),
      route: '/contract',
    },
    {
      key: '/company',
      icon: () => h(ProfileOutlined),
      label: t('sidebar.company'),
      title: t('sidebar.company'),
      route: '/company',
    },
    {
      key: '/process',
      icon: () => h(BranchesOutlined),
      label: t('sidebar.process'),
      title: t('sidebar.process'),
      route: '/process',
    },
    {
      key: '/history',
      icon: () => h(FileSearchOutlined),
      label: t('sidebar.history'),
      title: t('sidebar.history'),
      route: '/history',
    },
    {
      key: 'systemConfig',
      icon: () => h(SettingOutlined),
      label: t('sidebar.systemConfig'),
      title: t('sidebar.systemConfig'),
      children: [
        {
          key: '/normalConfig',
          label: t('sidebar.normalConfig'),
          title: t('sidebar.normalConfig'),
          route: '/normalConfig',
        },
        {
          key: '/backgroundConfig',
          label: t('sidebar.backgroundConfig'),
          title: t('sidebar.backgroundConfig'),
          route: '/backgroundConfig',
        },
        {
          key: '/auth',
          label: t('sidebar.auth'),
          title: t('sidebar.auth'),
          route: '/auth',
        }
      ],
    },
  ];
}
