import { useCounterStore, useUserStore } from '../stores';

export const Index = () => {
  // Counter Store 示例
  const count = useCounterStore((state) => state.count);
  const step = useCounterStore((state) => state.step);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  const setStep = useCounterStore((state) => state.setStep);

  // User Store 示例
  const { isLoggedIn, userInfo, login, logout } = useUserStore();

  // 模拟登录
  const handleLogin = () => {
    login(
      {
        id: 1,
        username: 'demo_user',
        email: 'demo@example.com',
        avatar: 'https://via.placeholder.com/150',
        role: 'admin',
      },
      'mock_token_123456'
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zustand 状态管理示例</h1>

      {/* Counter Store 示例 */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>计数器示例 (Counter Store)</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</p>
        <p>Step: {step}</p>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={decrement}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            - Decrement
          </button>
          <button
            onClick={increment}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            + Increment
          </button>
          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            设置步长:
            <input
              type="number"
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              style={{ marginLeft: '8px', padding: '4px', width: '60px' }}
            />
          </label>
        </div>

        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          注意: 计数器状态会自动持久化到 localStorage
        </p>
      </div>

      {/* User Store 示例 */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>用户状态示例 (User Store)</h2>

        {!isLoggedIn ? (
          <div>
            <p>当前状态: 未登录</p>
            <button
              onClick={handleLogin}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              模拟登录
            </button>
          </div>
        ) : (
          <div>
            <p>当前状态: 已登录</p>
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              <p>
                <strong>用户名:</strong> {userInfo?.username}
              </p>
              <p>
                <strong>邮箱:</strong> {userInfo?.email}
              </p>
              <p>
                <strong>角色:</strong> {userInfo?.role}
              </p>
              <p>
                <strong>用户ID:</strong> {userInfo?.id}
              </p>
            </div>
            <button
              onClick={logout}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              登出
            </button>
          </div>
        )}

        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          注意: 用户状态会自动保存到 localStorage，刷新页面后仍然保持登录状态
        </p>
      </div>

      {/* 使用说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3>Zustand 使用说明</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>导入:</strong> <code>import {'{ useCounterStore }'} from '@/stores';</code>
          </li>
          <li>
            <strong>使用选择器:</strong> <code>const count = useCounterStore(state =&gt; state.count);</code>
          </li>
          <li>
            <strong>调用方法:</strong> <code>const increment = useCounterStore(state =&gt; state.increment);</code>
          </li>
          <li>
            <strong>DevTools:</strong> 在开发环境下，打开 Redux DevTools 可以查看状态变化
          </li>
          <li>
            <strong>持久化:</strong> Counter store 使用 persist middleware 自动持久化
          </li>
        </ul>
      </div>
    </div>
  );
};
