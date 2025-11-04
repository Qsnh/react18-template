/**
 * 响应拦截器
 * 统一处理响应和错误
 */

import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { requestCancelManager, isCancelError } from '../utils/cancel';
import { retryRequest } from '../utils/retry';
import type { ApiResponse } from '../types/common';

// Token 刷新状态
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * 订阅 token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * 通知所有订阅者 token 已刷新
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * 响应成功拦截器
 */
export function responseSuccessInterceptor(
  response: AxiosResponse<ApiResponse>
): any {
  const config = response.config as InternalAxiosRequestConfig;

  // 移除已完成的请求
  requestCancelManager.remove(config);

  // 开发环境下打印响应日志
  if (import.meta.env.DEV) {
    console.log(
      `[API Response] ${config.method?.toUpperCase()} ${config.url}`,
      response.data
    );
  }

  const { data } = response;

  // 统一的响应格式处理
  // 根据后端约定的格式进行判断
  if (data && typeof data === 'object') {
    // 如果 success 为 false 或 code 不是 200/0，视为业务错误
    if (data.success === false || (data.code !== undefined && data.code !== 200 && data.code !== 0)) {
      const errorMessage = data.message || '请求失败';

      // 是否显示错误提示（默认显示）
      const showError = (config as any).showError !== false;
      if (showError) {
        message.error(errorMessage);
      }

      // 抛出业务错误
      return Promise.reject({
        code: data.code,
        message: errorMessage,
        data: data.data,
      });
    }

    // 返回实际数据
    return data.data !== undefined ? data.data : data;
  }

  // 如果不是标准格式，直接返回原始数据
  return data;
}

/**
 * 响应失败拦截器
 */
export function responseErrorInterceptor(error: AxiosError<ApiResponse>): Promise<any> {
  const config = error.config as InternalAxiosRequestConfig;

  // 移除已完成的请求
  if (config) {
    requestCancelManager.remove(config);
  }

  // 如果是取消请求，不做任何处理
  if (isCancelError(error)) {
    console.log('[API] 请求已取消:', config?.url);
    return Promise.reject(error);
  }

  const { response } = error;
  const status = response?.status;

  // 是否显示错误提示（默认显示）
  const showError = (config as any)?.showError !== false;

  // HTTP 状态码错误处理
  if (status) {
    switch (status) {
      case 401:
        // 未授权，token 失效或未登录
        if (showError) {
          message.error('登录已过期，请重新登录');
        }

        // 尝试刷新 token
        return handleTokenRefresh(error);

      case 403:
        // 无权限
        if (showError) {
          message.error('无权限访问');
        }
        break;

      case 404:
        // 资源不存在
        if (showError) {
          message.error('请求的资源不存在');
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // 服务器错误，尝试重试
        const enableRetry = (config as any)?.enableRetry !== false;
        if (enableRetry) {
          return retryRequest((globalThis as any).__axiosInstance, error);
        }

        if (showError) {
          message.error('服务器错误，请稍后重试');
        }
        break;

      case 429:
        // 请求过于频繁
        if (showError) {
          message.error('请求过于频繁，请稍后再试');
        }
        break;

      default:
        if (showError) {
          const errorMessage = response?.data?.message || error.message || '请求失败';
          message.error(errorMessage);
        }
    }
  } else {
    // 网络错误
    if (showError) {
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请检查网络连接');
      } else if (error.message === 'Network Error') {
        message.error('网络连接失败，请检查网络');
      } else {
        message.error(error.message || '请求失败');
      }
    }
  }

  // 开发环境下打印错误详情
  if (import.meta.env.DEV) {
    console.error('[API Error]', {
      url: config?.url,
      method: config?.method,
      status,
      error: error.response?.data || error.message,
    });
  }

  return Promise.reject(error);
}

/**
 * 处理 token 刷新
 */
async function handleTokenRefresh(error: AxiosError): Promise<any> {
  const config = error.config as InternalAxiosRequestConfig;
  const { refreshToken } = useUserStore.getState();

  // 如果没有 refreshToken，直接跳转登录
  if (!refreshToken) {
    useUserStore.getState().logout();
    // 跳转登录页
    window.location.href = '/login';
    return Promise.reject(error);
  }

  // 如果正在刷新 token，将请求加入队列
  if (isRefreshing) {
    return new Promise(resolve => {
      subscribeTokenRefresh((token: string) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve((globalThis as any).__axiosInstance(config));
      });
    });
  }

  isRefreshing = true;

  try {
    // 调用刷新 token 的接口
    // 注意：这里需要使用不经过拦截器的 axios 实例，避免循环
    const response = await (globalThis as any).__axiosInstance.post('/auth/refresh-token', {
      refreshToken,
    });

    const { token: newToken } = response.data.data;

    // 更新 token
    useUserStore.getState().setToken(newToken);

    // 通知所有等待的请求
    onTokenRefreshed(newToken);

    // 重试当前请求
    if (config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`;
    }
    return (globalThis as any).__axiosInstance(config);
  } catch (refreshError) {
    // token 刷新失败，清除登录状态并跳转登录页
    useUserStore.getState().logout();
    window.location.href = '/login';
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}
