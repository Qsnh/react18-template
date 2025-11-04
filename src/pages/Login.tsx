import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import "./Login.scss";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();

  // 获取跳转前的路径
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟登录API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟用户数据
      const mockUserInfo = {
        id: "1",
        username: values.username,
        email: `${values.username}@example.com`,
        avatar: "",
        role: "admin", // 可以是 admin, user 等
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      // 更新状态
      login(mockUserInfo, mockToken);

      message.success("登录成功！");

      // 跳转到原来的页面或首页
      navigate(from, { replace: true });
    } catch (error) {
      message.error("登录失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">欢迎登录</h1>
        <Form
          name="login"
          className="login-form"
          initialValues={{ username: "admin", password: "123456" }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              size="large"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="login-footer">
          <p>提示：默认账号 admin / 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
