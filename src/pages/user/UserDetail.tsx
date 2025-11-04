import React from "react";
import { Card, Descriptions, Button, Avatar, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 模拟用户数据
  const mockUser = {
    id: id,
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    phone: "13800138000",
    address: "北京市朝阳区",
    createdAt: "2024-01-01 10:00:00",
    updatedAt: "2024-03-15 15:30:00",
  };

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Card>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div style={{ marginLeft: 16 }}>
            <h2 style={{ margin: 0 }}>{mockUser.username}</h2>
            <div style={{ marginTop: 8 }}>
              <Tag color={mockUser.role === "admin" ? "red" : "blue"}>
                {mockUser.role === "admin" ? "管理员" : "普通用户"}
              </Tag>
              <Tag color={mockUser.status === "active" ? "green" : "default"}>
                {mockUser.status === "active" ? "激活" : "未激活"}
              </Tag>
            </div>
          </div>
        </div>

        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="用户ID">{mockUser.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{mockUser.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{mockUser.email}</Descriptions.Item>
          <Descriptions.Item label="手机号">{mockUser.phone}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>
            {mockUser.address}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {mockUser.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {mockUser.updatedAt}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Button danger>删除</Button>
        </div>
      </Card>
    </div>
  );
};

export default UserDetail;
