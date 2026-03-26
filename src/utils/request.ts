import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 消息提示接口
interface MessageInstance {
  error: (msg: string) => void;
  success: (msg: string) => void;
  loading: (msg: string, duration?: number) => { close: () => void };
}

// 动态获取 message 实例，避免在非浏览器环境报错
let messageModule: MessageInstance | null = null;

/**
 * 设置 message 实例（可选，用于注入外部 message 实现）
 */
export function setMessageInstance(instance: MessageInstance): void {
  messageModule = instance;
}

const getMessage = (): MessageInstance => {
  if (typeof window !== 'undefined' && !messageModule) {
    try {
      // 尝试从全局变量获取（如果 ant-design-vue 已全局注册）
      const win = window as Window & { 
        antd?: { message?: MessageInstance };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
      
      // 尝试多种方式获取 message
      if (win.antd?.message) {
        messageModule = win.antd.message;
      } else {
        // 尝试通过动态导入获取（仅在浏览器环境）
        // 注意：这需要确保 ant-design-vue 已安装
        try {
          // 使用动态 import，但需要确保在支持的环境中
          // 这里使用 try-catch 包裹，避免在构建时出错
          const antdModule = (() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              return require('ant-design-vue');
            } catch {
              return null;
            }
          })();
          
          if (antdModule?.message) {
            messageModule = antdModule.message as MessageInstance;
          }
        } catch {
          // 忽略导入错误
        }
      }
    } catch {
      // 忽略所有错误
    }
  }
  
  // 如果无法获取，使用 console 作为后备
  if (!messageModule) {
    messageModule = {
      error: (msg: string) => console.error('[Request Error]', msg),
      success: (msg: string) => console.log('[Request Success]', msg),
      loading: (msg: string) => {
        console.log('[Request Loading]', msg);
        return { close: () => { /* noop */ } };
      },
    };
  }
  
  return messageModule;
};

// 响应数据接口
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示错误提示
  showError?: boolean;
  // 是否显示加载提示
  showLoading?: boolean;
  // 是否返回完整的 ApiResponse 对象，而不是只返回 data 字段
  returnFullResponse?: boolean;
}

// 下载文件配置接口
export interface DownloadFileConfig extends RequestConfig {
  // 当后端未返回 Content-Disposition 文件名时的兜底文件名
  filename?: string;
}

export const unwrapApiData = <T>(res: unknown): T => {
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

const getFileNameFromDisposition = (disposition?: string): string => {
  if (!disposition) return '';

  // RFC5987: filename*=UTF-8''xxx
  const m1 = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (m1?.[1]) {
    try {
      return decodeURIComponent(m1[1]);
    } catch {
      return m1[1];
    }
  }

  // filename="xxx" 或 filename=xxx
  const m2 = disposition.match(/filename\s*=\s*"?([^"]+)"?/i);
  if (m2?.[1]) return m2[1];

  return '';
};

const tryReadBlobText = async (blob: Blob): Promise<string> => {
  try {
    return await blob.text();
  } catch {
    return '';
  }
};

const saveBlobAsFile = (blob: Blob, filename: string): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

// 获取 baseURL，优先使用环境变量，否则使用默认值
const getBaseURL = (): string => {
  // 在 Electron 的 renderer 进程中，可以通过 window.electronAPI 获取配置
  // 或者使用环境变量
  if (typeof window !== 'undefined') {
    const win = window as Window & { __API_BASE_URL__?: string };
    if (win.__API_BASE_URL__) {
      return win.__API_BASE_URL__;
    }
  }
  // 默认值
  return 'http://localhost:9081';
};

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 30秒超时
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 扩展 InternalAxiosRequestConfig 以支持自定义配置
interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  __loadingInstance?: { close: () => void };
}

// 请求拦截器
service.interceptors.request.use(
  (config: ExtendedInternalAxiosRequestConfig) => {
    // 动态获取最新的 baseURL
    const currentBaseURL = getBaseURL();
    if (currentBaseURL && config.baseURL !== currentBaseURL) {
      config.baseURL = currentBaseURL;
    }

    // 显示加载提示
    if (config.showLoading) {
      const message = getMessage();
      config.__loadingInstance = message.loading('加载中...', 0);
    }

    // 可以在这里添加 token
    // const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 可以在这里添加其他请求头
    // if (config.headers) {
    //   config.headers['X-Requested-With'] = 'XMLHttpRequest';
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const config = response.config as ExtendedInternalAxiosRequestConfig;
    
    // 关闭加载提示
    if (config.showLoading && config.__loadingInstance) {
      config.__loadingInstance.close();
    }

    const res = response.data;

    // 如果后端返回的状态码不是 200，则视为错误
    if (res.code !== undefined && res.code !== 200) {
      // 可以根据不同的错误码做不同的处理
      const errorMessage = res.message || '请求失败';
      console.error('请求失败:', errorMessage);
      
      // 显示错误提示（默认显示，除非明确设置为 false）
      if (config.showError !== false) {
        const message = getMessage();
        message.error(errorMessage);
      }
      
      // 可以在这里处理特定的错误码
      // 例如：401 未授权，跳转到登录页
      // if (res.code === 401) {
      //   // 跳转到登录页
      // }

      return Promise.reject(new Error(errorMessage));
    }

    // 如果后端没有返回 code 字段，直接返回整个响应
    // 如果返回了 data 字段，则只返回 data
    if (res.data !== undefined) {
      // 创建一个新的响应对象，将 data 作为响应体
      const newResponse: AxiosResponse = {
        ...response,
        data: res.data as unknown,
      };
      return newResponse;
    }
    
    return response;
  },
  (error: AxiosError) => {
    const config = error.config as ExtendedInternalAxiosRequestConfig | undefined;
    
    // 关闭加载提示
    if (config?.showLoading && config.__loadingInstance) {
      config.__loadingInstance.close();
    }

    console.error('响应错误:', error);

    let errorMessage = '请求失败';

    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          // 可以在这里清除 token 并跳转到登录页
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求地址不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        case 502:
          errorMessage = '网关错误';
          break;
        case 503:
          errorMessage = '服务不可用';
          break;
        case 504:
          errorMessage = '网关超时';
          break;
        default:
          errorMessage = `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '网络连接失败，请检查网络';
    } else {
      // 发送请求时出了点问题
      errorMessage = error.message || '请求失败';
    }

    // 显示错误提示（默认显示，除非明确设置为 false）
    if (config?.showError !== false) {
      const message = getMessage();
      message.error(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// 封装请求方法
class Request {
  /**
   * GET 请求
   */
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    return service.get<ApiResponse<T>>(url, config).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * POST 请求
   */
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    return service.post<ApiResponse<T>>(url, data, config).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * PUT 请求
   */
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    return service.put<ApiResponse<T>>(url, data, config).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    return service.delete<ApiResponse<T>>(url, config).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    return service.patch<ApiResponse<T>>(url, data, config).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(url: string, file: File | FormData, config?: RequestConfig): Promise<T | ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return service.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then((res) => {
      // 如果配置了返回完整响应，直接返回 ApiResponse
      if (config?.returnFullResponse) {
        return res.data as ApiResponse<T>;
      }
      // 如果响应数据是 ApiResponse 格式，返回 data 字段
      if (res.data && typeof res.data === 'object' && 'data' in res.data) {
        return (res.data as ApiResponse<T>).data;
      }
      return res.data as T;
    });
  }

  /**
   * 下载文件
   */
  download(url: string, config?: RequestConfig): Promise<Blob> {
    return service.get(url, {
      ...config,
      responseType: 'blob',
    }).then((response) => {
      return response.data;
    });
  }

  /**
   * 下载并保存文件（后端返回文件流 blob）
   *
   * - 支持 GET/POST/PUT 等 method（默认 GET）
   * - 自动从 Content-Disposition 解析文件名；否则用 config.filename 兜底
   * - 若响应为 application/json（常见于后端用 blob 返回错误信息），会尝试解析并抛错
   */
  async downloadFile(url: string, config?: DownloadFileConfig): Promise<{ blob: Blob; filename: string }> {
    const { filename: fallbackName = 'download', ...rest } = config || {};

    const response = await service.request<Blob>({
      url,
      ...rest,
      responseType: 'blob',
    });

    const blob = response.data;

    const contentType = String(response.headers?.['content-type'] || blob?.type || '').toLowerCase();
    if (contentType.includes('application/json')) {
      const text = await tryReadBlobText(blob);

      let msg = text || '下载失败';
      try {
        const json = JSON.parse(text || '{}') as Record<string, unknown>;
        msg = String(json.message || json.msg || json.error || msg);
      } catch {
        // ignore
      }

      if (config?.showError !== false) {
        getMessage().error(msg);
      }
      throw new Error(msg);
    }

    const disposition = response.headers?.['content-disposition'] as string | undefined;
    const parsedName = getFileNameFromDisposition(disposition);
    const finalName = parsedName || fallbackName;

    saveBlobAsFile(blob, finalName);

    return { blob, filename: finalName };
  }

  /**
   * 获取原始 axios 实例（用于特殊需求）
   */
  getInstance(): AxiosInstance {
    return service;
  }
}

// 导出单例
export default new Request();

// 也可以直接导出实例，方便使用
export const request = new Request();
