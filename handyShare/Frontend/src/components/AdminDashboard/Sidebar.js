import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Sidebar = ({ setActiveMenu }) => {
  return (
    <Menu
      style={{ width: 256 }}
      mode="inline"
      defaultSelectedKeys={['Users']}
      onClick={({ key }) => setActiveMenu(key)}
    >
      <Menu.Item key="Users" icon={<UserOutlined />}>
        Users
      </Menu.Item>
      <Menu.Item key="Categories" icon={<AppstoreAddOutlined />}>
        Categories
      </Menu.Item>
      <Menu.Item key="Products" icon={<ShoppingCartOutlined />}>
        Products
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
