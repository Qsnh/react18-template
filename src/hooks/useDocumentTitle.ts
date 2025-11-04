import { useEffect } from "react";
import { useLocation, matchRoutes } from "react-router-dom";
import routes from "../routes";
import type { AppRouteObject } from "../routes/types";

/**
 * 自动根据路由设置页面标题
 * @param defaultTitle 默认标题
 * @param suffix 标题后缀，默认为 " - React Template"
 */
export function useDocumentTitle(
  defaultTitle: string = "React Template",
  suffix: string = " - React Template"
) {
  const location = useLocation();

  useEffect(() => {
    const matched = matchRoutes(routes as any, location.pathname);

    if (matched && matched.length > 0) {
      // 获取最后一个匹配的路由（最具体的路由）
      const lastMatch = matched[matched.length - 1];
      const route = lastMatch.route as AppRouteObject;

      // 从路由 meta 中获取标题
      const title = route.meta?.title;

      if (title) {
        document.title = `${title}${suffix}`;
      } else {
        document.title = defaultTitle;
      }
    } else {
      document.title = defaultTitle;
    }
  }, [location.pathname, defaultTitle, suffix]);
}

/**
 * 手动设置页面标题
 * @param title 标题
 * @param suffix 标题后缀，默认为 " - React Template"
 */
export function setDocumentTitle(
  title: string,
  suffix: string = " - React Template"
) {
  document.title = `${title}${suffix}`;
}
