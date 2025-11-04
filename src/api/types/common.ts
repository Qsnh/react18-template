/**
 * API 通用类型定义
 */

// 通用 API 响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

// 分页响应数据
export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

// 分页响应
export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

// 请求配置扩展
export interface RequestConfig {
  // 是否显示加载提示
  showLoading?: boolean;
  // 是否显示错误提示
  showError?: boolean;
  // 是否启用重试
  enableRetry?: boolean;
  // 重试次数
  retryCount?: number;
  // 是否启用防抖
  debounce?: boolean;
  // 防抖延迟（毫秒）
  debounceDelay?: number;
  // 请求唯一标识（用于取消重复请求）
  requestId?: string;
}

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 错误响应
export interface ErrorResponse {
  code: number;
  message: string;
  errors?: any;
}

// 通用 ID 参数
export interface IdParams {
  id: string | number;
}

// 通用列表查询参数
export interface ListParams extends PaginationParams {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
