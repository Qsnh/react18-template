import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * 受保护的路由组件
 * 需要用户登录才能访问
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    // 未登录，重定向到登录页，并保存当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
