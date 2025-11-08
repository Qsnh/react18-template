import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import type { AppRouteObject } from "./types";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthRoute from "../components/AuthRoute";
import { Spin } from "antd";

// 懒加载组件
const BasicLayout = lazy(() => import("../components/layout/BasicLayout"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/404"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserList = lazy(() => import("../pages/user/UserList"));
const UserDetail = lazy(() => import("../pages/user/UserDetail"));

// 加载状态组件
const LoadingFallback = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

// 懒加载包装器
const lazyLoad = (element: React.ReactElement) => (
  <Suspense fallback={LoadingFallback}>{element}</Suspense>
);

/**
 * 路由配置
 *
 * 配置说明：
 * - path: 路由路径
 * - element: 路由组件
 * - meta: 路由元信息
 *   - title: 页面标题
 *   - icon: 菜单图标
 *   - requireAuth: 是否需要登录
 *   - roles: 需要的角色权限
 *   - hideInMenu: 是否在菜单中隐藏
 *   - breadcrumbName: 面包屑名称
 */
const routes: AppRouteObject[] = [
  // 登录页面（无需登录）
  {
    path: "/login",
    element: lazyLoad(<Login />),
    meta: {
      title: "登录",
      hideInMenu: true,
    },
  },

  // 主布局路由
  {
    path: "/",
    element: lazyLoad(
      <ProtectedRoute>
        <BasicLayout />
      </ProtectedRoute>
    ),
    children: [
      // 重定向到仪表盘
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // 仪表盘
      {
        path: "dashboard",
        element: lazyLoad(<Dashboard />),
        meta: {
          title: "仪表盘",
          icon: "DashboardOutlined",
          requireAuth: true,
        },
      },

      // 用户管理模块
      {
        path: "user",
        meta: {
          title: "用户管理",
          icon: "TeamOutlined",
          requireAuth: true,
        },
        children: [
          // 用户列表
          {
            path: "list",
            element: lazyLoad(<UserList />),
            meta: {
              title: "用户列表",
              icon: "UserOutlined",
              requireAuth: true,
            },
          },
          // 用户详情（在菜单中隐藏）
          {
            path: "detail/:id",
            element: lazyLoad(<UserDetail />),
            meta: {
              title: "用户详情",
              requireAuth: true,
              hideInMenu: true,
              breadcrumbName: "用户详情",
            },
          },
        ],
      },

      // 系统设置（需要管理员权限）
      {
        path: "settings",
        element: lazyLoad(
          <AuthRoute roles={["admin"]}>
            <div style={{ padding: 24 }}>
              <h2>系统设置</h2>
              <p>这个页面只有管理员可以访问</p>
            </div>
          </AuthRoute>
        ),
        meta: {
          title: "系统设置",
          icon: "SettingOutlined",
          requireAuth: true,
          roles: ["admin"],
        },
      },
    ],
  },

  // 404 页面
  {
    path: "*",
    element: lazyLoad(<NotFound />),
    meta: {
      title: "页面不存在",
      hideInMenu: true,
    },
  },
];

export default routes;
