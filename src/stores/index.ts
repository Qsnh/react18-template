/**
 * Stores 统一导出
 *
 * 集中导出所有状态管理 stores，方便统一引入
 */

// 导出 stores
export { useUserStore, restoreUserState } from './userStore';
export { useCounterStore } from './counterStore';

// 导出类型
export type { UserInfo } from './userStore';

/**
 * 工具函数：创建浅比较选择器
 *
 * 用于优化性能，避免不必要的重渲染
 *
 * 使用示例:
 * ```tsx
 * import { useCounterStore, createShallowSelector } from '@/stores';
 *
 * function Component() {
 *   // 浅比较，只有选中的状态变化时才重新渲染
 *   const { count, increment } = useCounterStore(
 *     createShallowSelector(state => ({
 *       count: state.count,
 *       increment: state.increment,
 *     }))
 *   );
 * }
 * ```
 */
export function createShallowSelector<T, U>(selector: (state: T) => U) {
  let prev: U | undefined;
  return (state: T): U => {
    const next = selector(state);
    if (prev === undefined) {
      prev = next;
      return next;
    }

    // 浅比较
    if (shallowEqual(prev, next)) {
      return prev;
    }

    prev = next;
    return next;
  };
}

/**
 * 浅比较两个对象
 */
function shallowEqual<T>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA) as Array<keyof T>;
  const keysB = Object.keys(objB) as Array<keyof T>;

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}
