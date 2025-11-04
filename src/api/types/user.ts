/**
 * 用户相关类型定义
 */

import type { ListParams } from './common';

// 用户实体
export interface User {
  id: string | number;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  gender?: 0 | 1 | 2; // 0-未知 1-男 2-女
  status?: 0 | 1; // 0-禁用 1-启用
  role?: string;
  roleName?: string;
  department?: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginTime?: string;
}

// 用户列表查询参数
export interface UserListParams extends ListParams {
  username?: string;
  email?: string;
  status?: 0 | 1;
  role?: string;
  startDate?: string;
  endDate?: string;
}

// 创建用户参数
export interface CreateUserParams {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  phone?: string;
  gender?: 0 | 1 | 2;
  role?: string;
  department?: string;
  position?: string;
}

// 更新用户参数
export interface UpdateUserParams {
  id: string | number;
  email?: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  gender?: 0 | 1 | 2;
  department?: string;
  position?: string;
}

// 用户详情响应
export interface UserDetail extends User {
  permissions?: string[];
  roles?: Array<{
    id: string | number;
    name: string;
    code: string;
  }>;
}

// 批量操作参数
export interface BatchOperationParams {
  ids: Array<string | number>;
}

// 修改用户状态参数
export interface UpdateUserStatusParams {
  id: string | number;
  status: 0 | 1;
}
