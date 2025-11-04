import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Store 状态接口
interface CounterState {
  // 状态
  count: number;
  step: number;

  // 操作方法
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  reset: () => void;
  setStep: (step: number) => void;
}

/**
 * 计数器状态管理 Store（示例）
 *
 * 演示特性：
 * - 基础的状态管理
 * - DevTools 集成
 * - 持久化到 localStorage
 *
 * 使用示例:
 * ```tsx
 * import { useCounterStore } from '@/stores';
 *
 * function Counter() {
 *   const { count, increment, decrement, reset } = useCounterStore();
 *
 *   // 或者使用选择器获取单个状态
 *   const count = useCounterStore(state => state.count);
 *   const increment = useCounterStore(state => state.increment);
 *
 *   return (
 *     <div>
 *       <h2>Count: {count}</h2>
 *       <button onClick={increment}>+</button>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set) => ({
        // 初始状态
        count: 0,
        step: 1,

        // 增加
        increment: () => {
          set(
            (state) => ({ count: state.count + state.step }),
            false,
            'counter/increment'
          );
        },

        // 减少
        decrement: () => {
          set(
            (state) => ({ count: state.count - state.step }),
            false,
            'counter/decrement'
          );
        },

        // 按指定数量增加
        incrementByAmount: (amount: number) => {
          set(
            (state) => ({ count: state.count + amount }),
            false,
            'counter/incrementByAmount'
          );
        },

        // 重置
        reset: () => {
          set({ count: 0 }, false, 'counter/reset');
        },

        // 设置步长
        setStep: (step: number) => {
          set({ step }, false, 'counter/setStep');
        },
      }),
      {
        name: 'counter-storage', // localStorage key
        // 可选：选择性持久化部分状态
        // partialize: (state) => ({ count: state.count }),
      }
    ),
    {
      name: 'CounterStore',
      enabled: import.meta.env.DEV,
    }
  )
);
