import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={11280}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单数"
              value={9320}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="销售额"
              value={234500}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={11.28}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近活动" bordered={false}>
            <p>用户 张三 登录了系统</p>
            <p>用户 李四 创建了新订单</p>
            <p>用户 王五 修改了个人信息</p>
            <p>系统进行了定时备份</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="待办事项" bordered={false}>
            <p>审核待处理订单 (5)</p>
            <p>处理用户反馈 (12)</p>
            <p>更新系统文档</p>
            <p>进行安全审计</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
