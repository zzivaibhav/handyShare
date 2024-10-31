import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';
import LendFormPage from '../components/LendingPage/LendFormPage.js'; 
import { Layout, Menu, Table } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { SERVER_URL } from '../constants.js';

const { Header, Content, Sider } = Layout;

const LendPage = ({ onProductAdded }) => {
  const [view, setView] = useState('lendings');
  const [loading, setLoading] = useState(true);
  const [lentItems, setLentItems] = useState([]); // Define lentItems here

  useEffect(() => {
    const fetchLentItems = async () => {
      try {
        const response = await axios.get(SERVER_URL+"/api/v1/all/lending/items")
        setLentItems(response.data); // Add the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lent items:', error);
        message.error('Failed to load lent items');
        setLoading(false);
      }
    };

    fetchLentItems();
  }, []);

  // Handle item creation
  const handleProductAdded = () => {
    message.success('New product added successfully!');
    onProductAdded(); // Notify the parent to refresh the product list
  };

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
    <div>
      <HeaderBar />
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
                <Table columns={columns} dataSource={lentItems} loading={loading} />
              </>
            ) : (
              <LendFormPage onProductAdded={handleProductAdded} />
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default LendPage;
