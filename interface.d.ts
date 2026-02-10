export interface AppConfig {
  language: string;
  fontSize: number;
  themeColor: string;
  themeMode: 'light' | 'dark';
}

export interface BackgroundConfig {
  baseUrl: string;
  port: number;
  autoStart: boolean;
}

export interface IElectronAPI {

  getAppConfig: () => Promise<AppConfig>;
  saveAppConfig: (config: AppConfig) => Promise<{ success: boolean; error?: string }>;
  updateMenu: (language?: string) => Promise<{ success: boolean }>;
  onMenuOpenSettings: (callback: () => void) => void;
  showContextMenu: (conversationId: number) => Promise<{ success: boolean }>;

  getBackgroundConfig: () => Promise<BackgroundConfig>;
  saveBackgroundConfig: (config: BackgroundConfig) => Promise<{ success: boolean; error?: string }>;

  runJar: (port?: number) => Promise<{ success: boolean; error?: string }>;
  stopJar: () => Promise<{ success: boolean; error?: string }>;

}

declare module 'node-cmd' {
  import { ExecException } from 'child_process';
  
  interface NodeCmd {
    run(
      command: string,
      callback?: (error: ExecException | null, data: string, stderr: string) => void
    ): any;
    runSync(command: string): {
      data: string | null;
      err: string | null;
      stderr: string | null;
    };
  }
  
  const nodeCmd: NodeCmd;
  export = nodeCmd;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}