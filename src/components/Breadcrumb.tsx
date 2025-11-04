import React from "react";
import { Breadcrumb as AntBreadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import routes from "../routes";
import { generateBreadcrumbs } from "../routes/utils";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(routes, location.pathname);

  // 如果只有一个面包屑或者在首页，不显示
  if (breadcrumbs.length <= 1 || location.pathname === "/") {
    return null;
  }

  const items = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...breadcrumbs.map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return {
        title: isLast ? (
          <span>{item.title}</span>
        ) : (
          <Link to={item.path}>{item.title}</Link>
        ),
      };
    }),
  ];

  return <AntBreadcrumb items={items} style={{ marginBottom: 16 }} />;
};

export default Breadcrumb;
