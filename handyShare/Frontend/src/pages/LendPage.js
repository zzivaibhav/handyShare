import React, { useState } from 'react';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';
import LendFormPage from '../components/LendingPage/LendFormPage.js'; 
import { Layout, Menu, Table } from 'antd';

const { Header, Content, Sider } = Layout;

const LendPage = () => {
  const [view, setView] = useState('lendings'); 
  const [lentItems, setLentItems] = useState([
    {
      key: '1',
      name: 'Bicycle',
      description: 'Mountain bike with 21 gears',
      price: '$10',
      availability: 'Available for 5 hours'
    },
    {
      key: '2',
      name: 'Camera',
      description: 'Canon DSLR camera',
      price: '$15',
      availability: 'Available for 8 hours'
    }
  ]); // Sample lent items, you can replace it with data from API

  // Columns for the table listing the items
  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price (per hour)',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
    },
  ];

  // Handle navigation click to switch between views
  const handleMenuClick = (e) => {
    setView(e.key);
  };

  return (
    <Layout>
      <Header>
        <HeaderBar />
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['lendings']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="lendings">Lendings</Menu.Item>
            <Menu.Item key="newLending">New Lending</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '20px' }}>
          <Content style={{ padding: '20px', background: '#fff' }}>
            {view === 'lendings' ? (
              <>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom:'10px' }}>Your Lent Items</h1>
                <Table columns={columns} dataSource={lentItems} />
              </>
            ) : (
              <LendFormPage />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LendPage;
