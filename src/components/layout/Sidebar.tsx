import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  collapsed: boolean;
}

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const items: MenuItem[] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "仪表盘",
    },
    {
      key: "/user",
      icon: <TeamOutlined />,
      label: "用户管理",
      children: [
        {
          key: "/user/list",
          icon: <UserOutlined />,
          label: "用户列表",
        },
      ],
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "系统设置",
    },
  ];

  // 点击菜单项
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  // 获取当前选中的菜单项
  const selectedKeys = [location.pathname];

  // 获取当前展开的菜单项
  const getOpenKeys = () => {
    const keys: string[] = [];
    items.forEach((item: any) => {
      if (item.children) {
        const hasActive = item.children.some(
          (child: any) => child.key === location.pathname
        );
        if (hasActive) {
          keys.push(item.key);
        }
      }
    });
    return keys;
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className={`logo ${collapsed ? "collapsed" : ""}`}>
        {collapsed ? "RT" : "React Template"}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={getOpenKeys()}
        items={items}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default Sidebar;
