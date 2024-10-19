// ProfileHeaderBar.js
import React from 'react';
import { Button, Space, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import logo from '../ProfileUpdatePage/HandyShareLogo.png';

const { Header } = Layout;

const ProfileHeaderBar = () => {
  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: '0 20px',
        boxShadow: '0 2px 8px #f0f1f2',
        height: '70px', 
        width : '100%',
        margin: '0'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src= {logo}
          alt="App logo"
          style={{ height: '50px', marginRight: '20px', objectFit: 'contain' }}
        />
      </div>

      {/* Right side buttons */}
      <Space>
        <Button>Lendings</Button>
        <Button>Borrowings</Button>
        <Button
          type="primary"
          shape="circle"
          icon={<UserOutlined />}
        />
      </Space>
    </Header>
  );
};

export default ProfileHeaderBar;
