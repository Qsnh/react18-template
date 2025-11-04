/**
 * 认证相关类型定义
 */

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

// 登录响应数据
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  userInfo: UserInfo;
}

// 用户信息
export interface UserInfo {
  id: string | number;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

// 刷新 Token 请求参数
export interface RefreshTokenParams {
  refreshToken: string;
}

// 刷新 Token 响应数据
export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// 修改密码参数
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 注册参数
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  code?: string;
}
