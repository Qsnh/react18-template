/**
 * 用户相关 API 服务
 */

import { request } from '../client';
import type { PaginatedData } from '../types/common';
import type {
  User,
  UserListParams,
  CreateUserParams,
  UpdateUserParams,
  UserDetail,
  BatchOperationParams,
  UpdateUserStatusParams,
} from '../types/user';

/**
 * 用户 API
 */
export const userApi = {
  /**
   * 获取用户列表（分页）
   */
  getUserList(params?: UserListParams): Promise<PaginatedData<User>> {
    return request.get('/users', { params });
  },

  /**
   * 获取用户详情
   */
  getUserDetail(id: string | number): Promise<UserDetail> {
    return request.get(`/users/${id}`);
  },

  /**
   * 创建用户
   */
  createUser(params: CreateUserParams): Promise<User> {
    return request.post('/users', params);
  },

  /**
   * 更新用户信息
   */
  updateUser(params: UpdateUserParams): Promise<User> {
    const { id, ...data } = params;
    return request.put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  deleteUser(id: string | number): Promise<void> {
    return request.delete(`/users/${id}`);
  },

  /**
   * 批量删除用户
   */
  batchDeleteUsers(params: BatchOperationParams): Promise<void> {
    return request.post('/users/batch-delete', params);
  },

  /**
   * 更新用户状态
   */
  updateUserStatus(params: UpdateUserStatusParams): Promise<void> {
    const { id, status } = params;
    return request.patch(`/users/${id}/status`, { status });
  },

  /**
   * 重置用户密码
   */
  resetUserPassword(id: string | number): Promise<{ password: string }> {
    return request.post(`/users/${id}/reset-password`);
  },

  /**
   * 获取所有用户（不分页，用于下拉选择等场景）
   */
  getAllUsers(): Promise<User[]> {
    return request.get('/users/all');
  },

  /**
   * 导出用户列表
   */
  exportUsers(params?: UserListParams): Promise<Blob> {
    return request.download('/users/export', { params });
  },

  /**
   * 上传用户头像
   */
  uploadAvatar(id: string | number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return request.upload(`/users/${id}/avatar`, formData);
  },

  /**
   * 搜索用户（带防抖）
   */
  searchUsers(keyword: string): Promise<User[]> {
    return request.get('/users/search', {
      params: { keyword },
      // 启用防抖
      debounce: true,
      debounceDelay: 500,
    });
  },
};
