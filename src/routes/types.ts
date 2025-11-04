import { RouteObject } from "react-router-dom";

/**
 * 路由 Meta 信息
 */
export interface RouteMeta {
  /** 页面标题 */
  title?: string;
  /** 图标 */
  icon?: string;
  /** 是否需要登录 */
  requireAuth?: boolean;
  /** 需要的角色权限 */
  roles?: string[];
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean;
  /** 是否缓存页面 */
  keepAlive?: boolean;
  /** 面包屑名称（如果不设置，使用 title） */
  breadcrumbName?: string;
}

/**
 * 扩展的路由对象
 */
export interface AppRouteObject extends Omit<RouteObject, "children"> {
  /** 路由元信息 */
  meta?: RouteMeta;
  /** 子路由 */
  children?: AppRouteObject[];
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  path: string;
  title: string;
}
