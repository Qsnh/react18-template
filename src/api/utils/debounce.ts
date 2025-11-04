/**
 * 请求防抖工具
 * 防止短时间内重复发送相同请求
 */

import type { InternalAxiosRequestConfig } from 'axios';

// 防抖配置
export interface DebounceConfig {
  delay: number;
  leading?: boolean; // 是否在延迟开始前调用
  trailing?: boolean; // 是否在延迟结束后调用
}

// 防抖请求记录
interface DebounceRequest {
  timer: ReturnType<typeof setTimeout> | null;
  promise: Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

/**
 * 请求防抖管理器
 */
class RequestDebounceManager {
  private debounceMap: Map<string, DebounceRequest>;
  private defaultDelay: number;

  constructor(defaultDelay: number = 300) {
    this.debounceMap = new Map();
    this.defaultDelay = defaultDelay;
  }

  /**
   * 生成请求的唯一标识
   */
  private getRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
  }

  /**
   * 创建防抖请求
   */
  debounce(
    config: InternalAxiosRequestConfig,
    executor: () => Promise<any>,
    debounceConfig?: Partial<DebounceConfig>
  ): Promise<any> {
    const requestKey = this.getRequestKey(config);
    const delay = debounceConfig?.delay || this.defaultDelay;
    const leading = debounceConfig?.leading ?? false;
    const trailing = debounceConfig?.trailing ?? true;

    // 如果存在相同的防抖请求
    const existingRequest = this.debounceMap.get(requestKey);

    if (existingRequest) {
      // 清除之前的定时器
      if (existingRequest.timer) {
        clearTimeout(existingRequest.timer);
      }

      // 如果启用了 trailing，设置新的定时器
      if (trailing) {
        existingRequest.timer = setTimeout(() => {
          executor()
            .then(existingRequest.resolve)
            .catch(existingRequest.reject)
            .finally(() => {
              this.debounceMap.delete(requestKey);
            });
        }, delay);
      }

      // 返回之前的 promise
      return existingRequest.promise;
    }

    // 创建新的 promise
    let resolve: (value: any) => void;
    let reject: (reason: any) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const debounceRequest: DebounceRequest = {
      timer: null,
      promise,
      resolve: resolve!,
      reject: reject!,
    };

    this.debounceMap.set(requestKey, debounceRequest);

    // 如果启用了 leading，立即执行
    if (leading) {
      executor()
        .then(debounceRequest.resolve)
        .catch(debounceRequest.reject)
        .finally(() => {
          if (!trailing) {
            this.debounceMap.delete(requestKey);
          }
        });

      // 如果不启用 trailing，不设置定时器
      if (!trailing) {
        return promise;
      }
    }

    // 设置定时器
    debounceRequest.timer = setTimeout(() => {
      // 如果 leading 已经执行过，这里就不再执行
      if (!leading) {
        executor()
          .then(debounceRequest.resolve)
          .catch(debounceRequest.reject)
          .finally(() => {
            this.debounceMap.delete(requestKey);
          });
      } else {
        this.debounceMap.delete(requestKey);
      }
    }, delay);

    return promise;
  }

  /**
   * 取消指定请求的防抖
   */
  cancel(requestKey: string): void {
    const debounceRequest = this.debounceMap.get(requestKey);
    if (debounceRequest && debounceRequest.timer) {
      clearTimeout(debounceRequest.timer);
      debounceRequest.reject(new Error('Debounce canceled'));
      this.debounceMap.delete(requestKey);
    }
  }

  /**
   * 取消所有防抖请求
   */
  cancelAll(): void {
    this.debounceMap.forEach((debounceRequest, key) => {
      if (debounceRequest.timer) {
        clearTimeout(debounceRequest.timer);
        debounceRequest.reject(new Error('All debounce canceled'));
      }
    });
    this.debounceMap.clear();
  }

  /**
   * 清空所有防抖记录（不取消）
   */
  clear(): void {
    this.debounceMap.clear();
  }

  /**
   * 获取当前防抖请求数量
   */
  size(): number {
    return this.debounceMap.size;
  }
}

// 导出单例
export const requestDebounceManager = new RequestDebounceManager();

// 导出类供自定义使用
export default RequestDebounceManager;
