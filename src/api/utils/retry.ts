/**
 * 请求重试工具
 */

import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 重试配置
export interface RetryConfig {
  // 重试次数
  count: number;
  // 当前重试次数
  currentCount?: number;
  // 重试延迟（毫秒）
  delay: number;
  // 是否使用指数退避
  useExponentialBackoff?: boolean;
  // 哪些状态码需要重试
  statusCodes?: number[];
}

// 默认重试配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  count: parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3'),
  delay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
  useExponentialBackoff: true,
  statusCodes: [408, 429, 500, 502, 503, 504], // 超时、限流、服务器错误
};

/**
 * 判断错误是否应该重试
 */
export function shouldRetry(error: AxiosError, config: RetryConfig): boolean {
  const { currentCount = 0, count, statusCodes } = config;

  // 已达到重试上限
  if (currentCount >= count) {
    return false;
  }

  // 没有响应（网络错误）应该重试
  if (!error.response) {
    return true;
  }

  // 特定状态码重试
  if (statusCodes && error.response.status) {
    return statusCodes.includes(error.response.status);
  }

  return false;
}

/**
 * 计算重试延迟时间
 */
export function getRetryDelay(config: RetryConfig): number {
  const { delay, currentCount = 0, useExponentialBackoff } = config;

  if (useExponentialBackoff) {
    // 指数退避：delay * 2^currentCount
    return delay * Math.pow(2, currentCount);
  }

  return delay;
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 执行重试
 */
export async function retryRequest(
  axios: any,
  error: AxiosError,
  customConfig?: Partial<RetryConfig>
): Promise<any> {
  const config = error.config as InternalAxiosRequestConfig & { retryConfig?: RetryConfig };

  if (!config) {
    return Promise.reject(error);
  }

  // 合并重试配置
  const retryConfig: RetryConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...customConfig,
    ...config.retryConfig,
    currentCount: (config.retryConfig?.currentCount || 0) + 1,
  };

  // 判断是否应该重试
  if (!shouldRetry(error, retryConfig)) {
    return Promise.reject(error);
  }

  // 更新配置中的重试信息
  config.retryConfig = retryConfig;

  // 计算延迟时间
  const delayTime = getRetryDelay(retryConfig);

  console.log(
    `[API Retry] 第 ${retryConfig.currentCount} 次重试，延迟 ${delayTime}ms`,
    config.url
  );

  // 延迟后重试
  await delay(delayTime);

  return axios(config);
}

/**
 * 为 axios 配置添加重试配置
 */
export function withRetryConfig(
  config: InternalAxiosRequestConfig,
  retryConfig?: Partial<RetryConfig>
): InternalAxiosRequestConfig & { retryConfig?: RetryConfig } {
  return {
    ...config,
    retryConfig: {
      ...DEFAULT_RETRY_CONFIG,
      ...retryConfig,
      currentCount: 0,
    },
  };
}
