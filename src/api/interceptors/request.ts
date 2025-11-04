/**
 * 请求拦截器
 * 统一处理请求前的操作
 */

import type { InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/stores/userStore';
import { requestCancelManager } from '../utils/cancel';

/**
 * 请求成功拦截器
 */
export function requestSuccessInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  // 1. 添加认证 token
  const token = useUserStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. 处理请求取消（防止重复请求）
  // 可以通过配置 config.cancelDuplicate = false 来禁用
  const cancelDuplicate = (config as any).cancelDuplicate !== false;
  if (cancelDuplicate) {
    requestCancelManager.add(config);
  }

  // 3. 开发环境下打印请求日志
  if (import.meta.env.DEV) {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    );
  }

  // 4. 添加时间戳防止缓存（可选）
  if (config.method === 'get' && (config as any).preventCache !== false) {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }

  return config;
}

/**
 * 请求失败拦截器
 */
export function requestErrorInterceptor(error: any): Promise<never> {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
}
