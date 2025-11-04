import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 用户信息接口
export interface UserInfo {
  id: string | number;
  username: string;
  email?: string;
  avatar?: string;
  role?: string;
  [key: string]: any;
}

// Store 状态接口
interface UserState {
  // 状态
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  refreshToken: string | null;

  // 操作方法
  login: (userInfo: UserInfo, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  setToken: (token: string, refreshToken?: string) => void;
}

/**
 * 用户状态管理 Store
 *
 * 使用示例:
 * ```tsx
 * import { useUserStore } from '@/stores';
 *
 * function Component() {
 *   const { isLoggedIn, userInfo, login, logout } = useUserStore();
 *
 *   // 或者使用选择器避免不必要的重渲染
 *   const username = useUserStore(state => state.userInfo?.username);
 *
 *   return <div>{username}</div>;
 * }
 * ```
 */
export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      // 初始状态
      isLoggedIn: false,
      userInfo: null,
      token: null,
      refreshToken: null,

      // 登录
      login: (userInfo: UserInfo, token: string, refreshToken?: string) => {
        set(
          {
            isLoggedIn: true,
            userInfo,
            token,
            refreshToken: refreshToken || null,
          },
          false,
          'user/login'
        );

        // 可选：持久化到 localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },

      // 登出
      logout: () => {
        set(
          {
            isLoggedIn: false,
            userInfo: null,
            token: null,
            refreshToken: null,
          },
          false,
          'user/logout'
        );

        // 清除持久化数据
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');
      },

      // 更新用户信息
      updateUserInfo: (userInfo: Partial<UserInfo>) => {
        set(
          (state) => ({
            userInfo: state.userInfo ? { ...state.userInfo, ...userInfo } : null,
          }),
          false,
          'user/updateUserInfo'
        );

        // 更新持久化数据
        const currentInfo = localStorage.getItem('userInfo');
        if (currentInfo) {
          const updated = { ...JSON.parse(currentInfo), ...userInfo };
          localStorage.setItem('userInfo', JSON.stringify(updated));
        }
      },

      // 设置 token
      setToken: (token: string, refreshToken?: string) => {
        set(
          {
            token,
            refreshToken: refreshToken !== undefined ? refreshToken : undefined,
          },
          false,
          'user/setToken'
        );
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },
    }),
    {
      name: 'UserStore',
      enabled: import.meta.env.DEV,
    }
  )
);

/**
 * 从 localStorage 恢复用户状态
 * 建议在应用启动时调用
 */
export const restoreUserState = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const userInfoStr = localStorage.getItem('userInfo');

  if (token && userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      useUserStore.getState().login(userInfo, token, refreshToken || undefined);
    } catch (error) {
      console.error('Failed to restore user state:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('refreshToken');
    }
  }
};
