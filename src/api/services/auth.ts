/**
 * 认证相关 API 服务
 */

import { request } from '../client';
import type {
  LoginParams,
  LoginResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
  UserInfo,
  ChangePasswordParams,
  RegisterParams,
} from '../types/auth';

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams): Promise<LoginResponse> {
    return request.post('/auth/login', params);
  },

  /**
   * 用户登出
   */
  logout(): Promise<void> {
    return request.post('/auth/logout');
  },

  /**
   * 刷新 Token
   */
  refreshToken(params: RefreshTokenParams): Promise<RefreshTokenResponse> {
    return request.post('/auth/refresh-token', params, {
      // 刷新 token 请求不需要重试
      enableRetry: false,
      // 不取消重复请求
      cancelDuplicate: false,
    });
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo(): Promise<UserInfo> {
    return request.get('/auth/user-info');
  },

  /**
   * 修改密码
   */
  changePassword(params: ChangePasswordParams): Promise<void> {
    return request.post('/auth/change-password', params);
  },

  /**
   * 用户注册
   */
  register(params: RegisterParams): Promise<LoginResponse> {
    return request.post('/auth/register', params);
  },

  /**
   * 发送验证码
   */
  sendCode(email: string): Promise<void> {
    return request.post('/auth/send-code', { email });
  },

  /**
   * 重置密码
   */
  resetPassword(params: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<void> {
    return request.post('/auth/reset-password', params);
  },

  /**
   * 验证 Token 是否有效
   */
  validateToken(): Promise<boolean> {
    return request.get('/auth/validate-token');
  },
};
