# React 18 企业级模板

一个基于 React 18、TypeScript、Vite 和 Ant Design 的现代化企业级前端项目模板，提供完整的认证、路由、状态管理和 API 架构解决方案。

## ✨ 核心特性

### 🔐 认证与授权
- 完整的登录/登出流程
- 自动 Token 刷新机制（accessToken + refreshToken）
- 基于角色的权限控制（RBAC）
- 登录状态持久化

### 🧭 路由与导航
- 懒加载路由组件优化性能
- 受保护的路由（登录守卫）
- 基于角色的路由权限守卫
- 自动生成面包屑导航
- 动态菜单系统

### 🌐 API 架构
- 完善的请求/响应拦截器
- 自动添加认证 Token
- 智能重试机制（指数退避算法）
- 重复请求自动取消
- 请求防抖支持
- 统一错误处理

### 🎨 用户体验
- 路由切换动画（Framer Motion）
- 自动 document 标题管理
- Skeleton 加载状态

## 🚀 技术栈

### 核心框架
- **React 18.2.0** - 使用最新特性
- **TypeScript 5.9.3** - 类型安全
- **Vite 4.2.0** - 极速开发体验
- **React Router 6.9.0** - 路由管理

### UI 组件库
- **Ant Design 5.3.2** - 企业级 UI 组件
- **Ant Design Icons 5.3.0** - 图标库
- **Sass 1.59.3** - CSS 预处理器
- **Framer Motion 12.23.24** - 动画库

### 状态管理与工具
- **Zustand 5.0.8** - 轻量级状态管理
- **Axios 1.3.4** - HTTP 客户端
- **Mitt 3.0.1** - 事件总线

## 📁 项目结构

```
src/
├── api/                      # API 相关
│   ├── client.ts            # Axios 客户端配置
│   ├── interceptors/        # 请求/响应拦截器
│   │   ├── request.ts       # 请求拦截器
│   │   └── response.ts      # 响应拦截器
│   ├── services/            # API 服务
│   │   ├── auth.ts          # 认证相关 API
│   │   └── user.ts          # 用户相关 API
│   ├── types/               # API 类型定义
│   │   ├── common.ts        # 通用类型
│   │   ├── auth.ts          # 认证类型
│   │   └── user.ts          # 用户类型
│   └── utils/               # API 工具函数
│       ├── cancel.ts        # 请求取消管理
│       ├── debounce.ts      # 防抖工具
│       └── retry.ts         # 重试机制
├── components/              # 可复用组件
│   ├── AuthRoute.tsx        # 权限路由守卫
│   ├── Breadcrumb.tsx       # 面包屑导航
│   ├── ProtectedRoute.tsx   # 登录保护路由
│   ├── RouteTransition.tsx  # 路由切换动画
│   └── layout/              # 布局组件
│       ├── BasicLayout.tsx  # 基础布局
│       ├── Header.tsx       # 头部组件
│       └── Sidebar.tsx      # 侧边栏组件
├── hooks/                   # 自定义 Hooks
│   └── useDocumentTitle.ts  # 页面标题管理
├── pages/                   # 页面组件
│   ├── Login.tsx            # 登录页
│   ├── Dashboard.tsx        # 仪表盘
│   ├── 404.tsx              # 404 页面
│   └── user/                # 用户模块
│       ├── UserList.tsx     # 用户列表
│       └── UserDetail.tsx   # 用户详情
├── routes/                  # 路由配置
│   ├── index.tsx            # 路由定义
│   ├── types.ts             # 路由类型
│   └── utils.ts             # 路由工具函数
├── stores/                  # 状态管理
│   ├── index.ts             # Store 导出
│   ├── userStore.ts         # 用户状态
│   └── counterStore.ts      # 计数器示例
├── App.tsx                  # 根组件
├── main.tsx                 # 应用入口
└── global.d.ts              # 全局类型定义
```

## 🛠️ 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0（推荐）

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# API 基础 URL
VITE_API_BASE_URL=http://localhost:3000/api

# API 请求超时时间（毫秒）
VITE_API_TIMEOUT=30000

# API 重试次数
VITE_API_RETRY_COUNT=3

# API 重试延迟（毫秒）
VITE_API_RETRY_DELAY=1000
```

### 开发

```bash
# 启动开发服务器（默认端口：8080）
pnpm dev
```

访问 http://localhost:8080

### 构建

```bash
# 类型检查 + 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

## 📖 功能模块详解

### 路由系统

路由配置支持丰富的元信息：

```typescript
interface RouteMeta {
  title: string;           // 页面标题
  icon?: string;          // 菜单图标
  requireAuth?: boolean;  // 是否需要登录
  roles?: string[];       // 需要的角色权限
  hideInMenu?: boolean;   // 是否在菜单中隐藏
  breadcrumbName?: string;// 面包屑名称
}
```

#### 路由列表

| 路径 | 组件 | 说明 | 权限 |
|------|------|------|------|
| `/login` | Login | 登录页 | 公开 |
| `/dashboard` | Dashboard | 仪表盘 | 需登录 |
| `/user/list` | UserList | 用户列表 | 需登录 |
| `/user/detail/:id` | UserDetail | 用户详情 | 需登录 |
| `/settings` | Settings | 系统设置 | 仅管理员 |
| `*` | 404 | 404 页面 | 公开 |

#### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/routes/index.tsx` 添加路由配置：

```typescript
{
  path: '/your-page',
  element: <YourPage />,
  meta: {
    title: '页面标题',
    requireAuth: true,
    roles: ['admin'],
  }
}
```

### 状态管理（Zustand）

#### 用户状态（userStore）

```typescript
import { useUserStore } from '@/stores';

// 在组件中使用
const { user, isLoggedIn, login, logout } = useUserStore();

// 登录
await login({ username, password });

// 登出
logout();

// 更新用户信息
updateUser({ name: 'New Name' });
```

#### 创建新的 Store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyStore {
  data: any;
  setData: (data: any) => void;
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
    }),
    {
      name: 'my-store', // localStorage key
    }
  )
);
```

### API 调用

#### 定义 API 服务

```typescript
// src/api/services/example.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export const exampleApi = {
  // GET 请求
  getList: (params?: any) =>
    apiClient.get<ApiResponse<any[]>>('/examples', { params }),

  // POST 请求
  create: (data: any) =>
    apiClient.post<ApiResponse<any>>('/examples', data),

  // PUT 请求
  update: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/examples/${id}`, data),

  // DELETE 请求
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/examples/${id}`),
};
```

#### 在组件中使用

```typescript
import { exampleApi } from '@/api/services/example';
import { message } from 'antd';

const MyComponent = () => {
  const fetchData = async () => {
    try {
      const response = await exampleApi.getList({ page: 1 });
      console.log(response.data);
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  return <button onClick={fetchData}>获取数据</button>;
};
```

### API 高级特性

#### 请求拦截器功能
- ✅ 自动添加 Authorization Token
- ✅ 重复请求自动取消
- ✅ GET 请求防缓存（添加时间戳）
- ✅ 开发环境请求日志

#### 响应拦截器功能
- ✅ 统一业务错误处理
- ✅ HTTP 状态码处理
  - `401`: 自动刷新 Token 或跳转登录
  - `403`: 权限不足提示
  - `500/502/503/504`: 自动重试
  - `429`: 请求限流处理
- ✅ Token 自动刷新（队列机制避免并发问题）

#### 请求重试配置

```typescript
// 在 API 调用时启用重试
apiClient.get('/api/data', {
  // 自定义重试配置（可选）
  retryConfig: {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
      // 自定义重试条件
      return error.response?.status >= 500;
    }
  }
});
```

#### 请求防抖

```typescript
import { debouncedRequest } from '@/api/utils/debounce';

// 搜索等场景使用防抖
const searchUsers = debouncedRequest(
  (keyword: string) => userApi.search({ keyword }),
  500 // 延迟 500ms
);
```

### 组件系统

#### ProtectedRoute - 登录保护

```typescript
<ProtectedRoute>
  <YourPrivatePage />
</ProtectedRoute>
```

未登录用户会自动重定向到登录页。

#### AuthRoute - 权限守卫

```typescript
<AuthRoute roles={['admin', 'manager']}>
  <YourAdminPage />
</AuthRoute>
```

不满足角色要求的用户会看到 403 页面。

## 🔐 认证流程

### 登录流程

```
用户输入账号密码
    ↓
调用 authApi.login()
    ↓
后端验证
    ↓
返回 accessToken + refreshToken
    ↓
存储到 userStore（自动持久化到 localStorage）
    ↓
重定向到首页
```

### Token 刷新机制

```
API 请求返回 401
    ↓
检查是否有 refreshToken
    ↓
调用 authApi.refreshToken()
    ↓
成功：更新 accessToken，重试原请求
    ↓
失败：清除登录状态，跳转登录页
```

### 权限控制流程

1. **路由级权限**：通过 `AuthRoute` 组件检查用户角色
2. **菜单权限**：根据路由 meta 中的 roles 过滤菜单
3. **接口权限**：后端返回 403 时前端统一处理

## 📝 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 遵循 ESLint 规则
- 统一使用 4 空格缩进

### 目录命名规范

- 组件文件：大驼峰（PascalCase）
- 工具函数：小驼峰（camelCase）
- 常量文件：大写下划线（UPPER_SNAKE_CASE）

### 最佳实践

1. **API 调用**：统一在组件顶层或自定义 Hook 中调用
2. **状态管理**：全局状态用 Zustand，局部状态用 useState
3. **类型定义**：为所有 API 响应和组件 Props 定义类型
4. **错误处理**：使用 try-catch + message 提示用户
5. **性能优化**：
   - 路由懒加载
   - 使用 React.memo 避免不必要的重渲染
   - 大列表使用虚拟滚动

## 🏗️ 构建与部署

### 生产构建

```bash
pnpm build
```

构建产物在 `dist/` 目录，包含：
- 代码分割（Code Splitting）
- Tree Shaking
- GZIP 压缩
- 资源哈希命名

### 构建优化

- ✅ 使用 SWC 编译器加速构建
- ✅ Rollup GZIP 插件压缩资源
- ✅ 自动 vendor 分割
- ✅ CSS 提取和压缩

### 部署

构建完成后，将 `dist/` 目录部署到任何静态服务器：

```bash
# Nginx
cp -r dist/* /usr/share/nginx/html/

# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

### Nginx 配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # API 代理（可选）
  location /api {
    proxy_pass http://backend-server:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 🔧 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的 `server.port` 配置。

### 2. API 请求跨域

开发环境可在 `vite.config.ts` 配置代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://backend-server:3000',
      changeOrigin: true,
    }
  }
}
```

### 3. Token 过期处理

已在 `src/api/interceptors/response.ts` 中实现自动刷新机制。

## 📄 License

[MIT](LICENSE)

---

**Made with ❤️ using React 18 + TypeScript + Vite**
