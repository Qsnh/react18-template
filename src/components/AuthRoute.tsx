import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { Result, Button } from "antd";

interface AuthRouteProps {
  children: React.ReactElement;
  /** 允许访问的角色列表 */
  roles?: string[];
}

/**
 * 权限路由组件
 * 需要特定角色权限才能访问
 */
const AuthRoute: React.FC<AuthRouteProps> = ({ children, roles }) => {
  const { isLoggedIn, userInfo } = useUserStore();

  // 未登录，重定向到登录页
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 如果没有指定角色要求，直接放行
  if (!roles || roles.length === 0) {
    return children;
  }

  // 检查用户角色
  const userRole = userInfo?.role;
  const hasPermission = userRole && roles.includes(userRole);

  if (!hasPermission) {
    // 无权限，显示403页面
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  return children;
};

export default AuthRoute;
