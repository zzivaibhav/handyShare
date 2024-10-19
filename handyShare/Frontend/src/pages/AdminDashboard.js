import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/AdminDashboard/Sidebar';
import Header from '../components/AdminDashboard/Header';
import Users from '../components/AdminDashboard/Users';
import Categories from '../components/AdminDashboard/Categories';
import Products from '../components/AdminDashboard/Products';

const { Content, Sider } = Layout;

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Users');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Users':
        return <Users />;
      case 'Categories':
        return <Categories />;
      case 'Products':
        return <Products />;
      default:
        return <Users />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ background: '#fff' }}>
          <Sidebar setActiveMenu={setActiveMenu} />
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;