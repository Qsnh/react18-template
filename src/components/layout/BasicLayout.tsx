import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "../Breadcrumb";
import RouteTransition from "../RouteTransition";
import KeepAlive from "../KeepAlive";
import "./BasicLayout.scss";

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="basic-layout">
      <Sidebar collapsed={collapsed} />
      <div className="layout-content">
        <Header collapsed={collapsed} onToggle={toggleCollapsed} />
        <div className="main-content">
          <Breadcrumb />
          <RouteTransition>
            <KeepAlive
              max={10}
              include={["/dashboard", "/user/list"]}
              exclude={[]}
            />
          </RouteTransition>
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;
