/**
 * 请求取消管理器
 * 用于取消重复请求或手动取消请求
 */

import type { InternalAxiosRequestConfig } from 'axios';

// 请求标识生成器
export interface RequestIdentifier {
  (config: InternalAxiosRequestConfig): string;
}

// 默认的请求标识生成函数
const defaultIdentifier: RequestIdentifier = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

/**
 * 请求取消管理器类
 */
class RequestCancelManager {
  // 存储请求的 AbortController
  private pendingRequests: Map<string, AbortController>;
  // 请求标识生成器
  private identifier: RequestIdentifier;

  constructor(identifier?: RequestIdentifier) {
    this.pendingRequests = new Map();
    this.identifier = identifier || defaultIdentifier;
  }

  /**
   * 生成请求的唯一标识
   */
  private getRequestKey(config: InternalAxiosRequestConfig): string {
    // 如果配置中有自定义的 requestId，直接使用
    if (config.requestId) {
      return config.requestId;
    }
    return this.identifier(config);
  }

  /**
   * 添加请求到待处理列表
   * 如果已存在相同的请求，则取消之前的请求
   */
  add(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const requestKey = this.getRequestKey(config);

    // 如果存在相同的请求，取消之前的
    this.cancel(requestKey);

    // 创建新的 AbortController
    const controller = new AbortController();
    this.pendingRequests.set(requestKey, controller);

    // 将 signal 添加到请求配置中
    config.signal = controller.signal;

    return config;
  }

  /**
   * 从待处理列表中移除请求
   */
  remove(config: InternalAxiosRequestConfig): void {
    const requestKey = this.getRequestKey(config);
    this.pendingRequests.delete(requestKey);
  }

  /**
   * 取消指定的请求
   */
  cancel(requestKey: string, reason?: string): void {
    const controller = this.pendingRequests.get(requestKey);
    if (controller) {
      controller.abort(reason || '取消重复请求');
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * 取消所有待处理的请求
   */
  cancelAll(reason?: string): void {
    this.pendingRequests.forEach((controller, key) => {
      controller.abort(reason || '取消所有请求');
    });
    this.pendingRequests.clear();
  }

  /**
   * 检查请求是否存在
   */
  has(config: InternalAxiosRequestConfig): boolean {
    const requestKey = this.getRequestKey(config);
    return this.pendingRequests.has(requestKey);
  }

  /**
   * 获取当前待处理的请求数量
   */
  size(): number {
    return this.pendingRequests.size;
  }

  /**
   * 清空所有待处理的请求（不取消）
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

// 导出单例
export const requestCancelManager = new RequestCancelManager();

// 导出类供自定义使用
export default RequestCancelManager;

/**
 * 判断错误是否为取消错误
 */
export function isCancelError(error: any): boolean {
  return error && error.name === 'CanceledError';
}
