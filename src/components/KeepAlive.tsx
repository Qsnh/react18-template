import React, { useRef, useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";

interface KeepAliveProps {
  /**
   * 最大缓存数量，默认 10
   */
  max?: number;
  /**
   * 需要缓存的路径列表，如果不提供则缓存所有
   */
  include?: string[];
  /**
   * 不需要缓存的路径列表
   */
  exclude?: string[];
}

interface CacheNode {
  pathname: string;
  element: React.ReactElement;
  timestamp: number;
}

/**
 * 路由缓存组件
 * 类似 Vue 的 keep-alive，用于缓存路由组件状态
 *
 * 使用示例:
 * ```tsx
 * <KeepAlive max={10} include={['/dashboard', '/user/list']}>
 *   <Outlet />
 * </KeepAlive>
 * ```
 */
const KeepAlive: React.FC<KeepAliveProps> = ({
  max = 10,
  include,
  exclude,
}) => {
  const location = useLocation();
  const outlet = useOutlet();
  const cacheRef = useRef<Map<string, CacheNode>>(new Map());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const { pathname } = location;

    // 检查是否需要缓存当前路径
    const shouldCache = () => {
      // 如果在排除列表中，不缓存
      if (exclude && exclude.includes(pathname)) {
        return false;
      }
      // 如果有包含列表，只缓存列表中的路径
      if (include && include.length > 0) {
        return include.includes(pathname);
      }
      // 默认缓存所有
      return true;
    };

    if (shouldCache() && outlet) {
      const cache = cacheRef.current;

      // 如果路径已经在缓存中，更新时间戳
      if (cache.has(pathname)) {
        const node = cache.get(pathname)!;
        node.timestamp = Date.now();
      } else {
        // 检查缓存数量
        if (cache.size >= max) {
          // 删除最旧的缓存
          let oldestKey = "";
          let oldestTime = Infinity;
          cache.forEach((node, key) => {
            if (node.timestamp < oldestTime) {
              oldestTime = node.timestamp;
              oldestKey = key;
            }
          });
          cache.delete(oldestKey);
        }

        // 添加新缓存
        cache.set(pathname, {
          pathname,
          element: outlet,
          timestamp: Date.now(),
        });
      }

      forceUpdate({});
    }
  }, [location, outlet, max, include, exclude]);

  // 渲染缓存的组件
  return (
    <>
      {Array.from(cacheRef.current.entries()).map(([pathname, cache]) => (
        <div
          key={pathname}
          style={{
            display: pathname === location.pathname ? "block" : "none",
          }}
        >
          {cache.element}
        </div>
      ))}
      {/* 如果当前路径不在缓存中，直接渲染 outlet */}
      {!cacheRef.current.has(location.pathname) && outlet}
    </>
  );
};

export default KeepAlive;
