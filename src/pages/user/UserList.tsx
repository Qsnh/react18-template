import React, { useState } from "react";
import { Table, Button, Space, Tag, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface UserData {
  key: string;
  id: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  // 模拟数据
  const mockData: UserData[] = [
    {
      key: "1",
      id: "1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      key: "2",
      id: "2",
      username: "user1",
      email: "user1@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-02",
    },
    {
      key: "3",
      id: "3",
      username: "user2",
      email: "user2@example.com",
      role: "user",
      status: "inactive",
      createdAt: "2024-01-03",
    },
  ];

  const columns: ColumnsType<UserData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status === "active" ? "激活" : "未激活"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/user/detail/${record.id}`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = mockData.filter(
    (item) =>
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Input
          placeholder="搜索用户名或邮箱"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          新增用户
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default UserList;
