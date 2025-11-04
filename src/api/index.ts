/**
 * API 统一导出
 */

// 导出 axios 实例和请求方法
export { default as client, request } from './client';

// 导入 API 服务（用于默认导出）
import { authApi } from './services/auth';
import { userApi } from './services/user';

// 导出 API 服务
export { authApi } from './services/auth';
export { userApi } from './services/user';

// 导出类型定义
export type {
  // 通用类型
  ApiResponse,
  PaginationParams,
  PaginatedData,
  PaginatedResponse,
  RequestConfig,
  HttpMethod,
  ErrorResponse,
  IdParams,
  ListParams,
} from './types/common';

export type {
  // 认证类型
  LoginParams,
  LoginResponse,
  UserInfo,
  RefreshTokenParams,
  RefreshTokenResponse,
  ChangePasswordParams,
  RegisterParams,
} from './types/auth';

export type {
  // 用户类型
  User,
  UserListParams,
  CreateUserParams,
  UpdateUserParams,
  UserDetail,
  BatchOperationParams,
  UpdateUserStatusParams,
} from './types/user';

// 导出工具函数
export {
  requestCancelManager,
  isCancelError,
} from './utils/cancel';

export {
  requestDebounceManager,
} from './utils/debounce';

export type {
  RetryConfig,
} from './utils/retry';

// 默认导出所有 API 服务
export default {
  authApi,
  userApi,
};
