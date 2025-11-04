/**
 * Axios 客户端配置
 * 创建 axios 实例并配置拦截器
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  requestSuccessInterceptor,
  requestErrorInterceptor,
} from './interceptors/request';
import {
  responseSuccessInterceptor,
  responseErrorInterceptor,
} from './interceptors/response';
import type { RequestConfig } from './types/common';

// 扩展 axios 请求配置类型
declare module 'axios' {
  interface AxiosRequestConfig extends RequestConfig {
    // 是否取消重复请求（默认 true）
    cancelDuplicate?: boolean;
    // 是否添加时间戳防止缓存（默认 true）
    preventCache?: boolean;
    // 自定义请求 ID
    requestId?: string;
    // 重试配置
    retryConfig?: {
      count?: number;
      delay?: number;
      currentCount?: number;
    };
  }
}

// 创建 axios 实例
const client: AxiosInstance = axios.create({
  // 基础 URL
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 请求超时时间
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // 请求头配置
  headers: {
    'Content-Type': 'application/json',
  },

  // 跨域请求是否携带 cookie
  withCredentials: false,
});

// 添加请求拦截器
client.interceptors.request.use(
  requestSuccessInterceptor,
  requestErrorInterceptor
);

// 添加响应拦截器
client.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor
);

// 将 axios 实例挂载到全局，供 token 刷新等场景使用
(globalThis as any).__axiosInstance = client;

/**
 * 通用请求方法
 */
export const request = {
  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return client.get(url, config);
  },

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return client.post(url, data, config);
  },

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return client.put(url, data, config);
  },

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return client.delete(url, config);
  },

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return client.patch(url, data, config);
  },

  /**
   * 上传文件
   */
  upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * 下载文件
   */
  download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    return client.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
};

// 导出 axios 实例供特殊场景使用
export default client;
