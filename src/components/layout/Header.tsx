import React from "react";
import { Button, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { userInfo, logout } = useUserStore();

  // 用户菜单
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else if (key === "profile") {
      navigate("/profile");
    } else if (key === "settings") {
      navigate("/settings");
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="trigger" onClick={onToggle}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      <div className="header-right">
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <div className="user-info">
            <Avatar size="small" icon={<UserOutlined />} src={userInfo?.avatar} />
            <span>{userInfo?.username || "用户"}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
