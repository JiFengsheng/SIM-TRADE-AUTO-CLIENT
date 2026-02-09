import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerWix } from '@electron-forge/maker-wix';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { execSync } from 'child_process';
import path from 'path';

// 检测 WiX Toolset 是否已安装
function isWixInstalled(): boolean {
  try {
    execSync('where light.exe', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const makers = [
  new MakerSquirrel({
    name: 'SimTradeAuto',
    authors: 'Ji Fengsheng',
    description: 'A Sim Trade Auto application',
    // setupIcon: path.resolve(__dirname, 'assets', 'icon.ico'),
    setupExe: 'SimTradeAuto-Setup.exe',
    // MakerSquirrel 默认安装到用户目录（%LOCALAPPDATA%\Programs），不需要管理员权限
  }),
  new MakerZIP({}, ['darwin','win32']),
  new MakerRpm({}),
  new MakerDeb({}),
];

// 只有在检测到 WiX Toolset 时才添加 MakerWix
if (isWixInstalled()) {
  makers.push(
    new MakerWix({
      name: 'SimTradeAuto',
      description: 'A Sim Trade Auto application',
      manufacturer: 'Ji Fengsheng',
      // 设置为 "perUser" 表示安装到用户目录，而不是 Program Files
      // 这样可以避免需要管理员权限，解决文件执行权限问题
      defaultInstallMode: 'perUser',
      // 启用安装向导界面，允许用户在安装时选择安装目录
      ui: {
        chooseDirectory: true,
      },
      // 使用包含多尺寸的 256x256.ico 文件，并使用绝对路径
      icon: path.resolve(__dirname, 'assets', 'icon.ico'),
    })
  );
} else {
  console.warn('⚠️  WiX Toolset 未安装，将跳过 MSI 安装包生成。');
  console.warn('   要生成 MSI 安装包，请安装 WiX Toolset:');
  console.warn('   - 使用 Chocolatey: choco install wix');
  console.warn('   - 使用 winget: winget install WiXToolset.WiXToolset');
  console.warn('   - 或从官网下载: https://wixtoolset.org/releases/');
}

const config: ForgeConfig = {
  packagerConfig: {
    name: 'SimTradeAuto',
    asar: true,
    icon: './assets/icon',
    // 将 extra 目录作为额外资源包含到打包后的应用中
    // extraResource 会将文件复制到 resources 目录
    // 代码中已更新为使用 process.resourcesPath 或 process.execPath 来正确获取路径
    extraResource: [
      './extra'
    ],
  },
  rebuildConfig: {},
  makers,
  publishers: [
    // {
    //   name: '@electron-forge/publisher-github',
    //   config: {
    //     repository: {
    //       owner: 'JiFengsheng',
    //       name: 'vchat'
    //     },
    //     prerelease: false,
    //     draft: true,
    //     authToken: process.env.GITHUB_TOKEN
    //   }
    // }
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
