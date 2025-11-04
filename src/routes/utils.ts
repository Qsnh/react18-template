import { matchRoutes } from "react-router-dom";
import { AppRouteObject, BreadcrumbItem } from "./types";

/**
 * 扁平化路由
 */
export function flattenRoutes(routes: AppRouteObject[]): AppRouteObject[] {
  const result: AppRouteObject[] = [];

  function flatten(routeList: AppRouteObject[]) {
    routeList.forEach((route) => {
      result.push(route);
      if (route.children) {
        flatten(route.children);
      }
    });
  }

  flatten(routes);
  return result;
}

/**
 * 根据路径查找路由
 */
export function findRouteByPath(
  routes: AppRouteObject[],
  path: string
): AppRouteObject | undefined {
  const flatRoutes = flattenRoutes(routes);
  return flatRoutes.find((route) => route.path === path);
}

/**
 * 生成面包屑
 */
export function generateBreadcrumbs(
  routes: AppRouteObject[],
  pathname: string
): BreadcrumbItem[] {
  const matched = matchRoutes(routes as any, pathname);
  if (!matched) return [];

  const breadcrumbs: BreadcrumbItem[] = [];

  matched.forEach((match) => {
    const route = match.route as AppRouteObject;
    if (route.meta && !route.meta.hideInMenu) {
      breadcrumbs.push({
        path: match.pathname,
        title: route.meta.breadcrumbName || route.meta.title || "",
      });
    }
  });

  return breadcrumbs;
}

/**
 * 过滤出菜单路由（不包括隐藏的）
 */
export function filterMenuRoutes(routes: AppRouteObject[]): AppRouteObject[] {
  return routes
    .filter((route) => !route.meta?.hideInMenu)
    .map((route) => ({
      ...route,
      children: route.children ? filterMenuRoutes(route.children) : undefined,
    }));
}

/**
 * 获取第一个有效的菜单路由路径
 */
export function getFirstValidRoute(routes: AppRouteObject[]): string {
  for (const route of routes) {
    if (!route.meta?.hideInMenu && route.path) {
      // 如果有子路由，递归查找
      if (route.children && route.children.length > 0) {
        const childPath = getFirstValidRoute(route.children);
        if (childPath) return childPath;
      }
      // 返回当前路由路径
      if (route.path !== "*") {
        return route.path;
      }
    }
  }
  return "/";
}
