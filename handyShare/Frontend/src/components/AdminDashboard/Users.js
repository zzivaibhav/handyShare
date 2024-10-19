import React, { useState } from 'react';
import { Button, Table, Input } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([
    {
      key: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
    },
  ]);

  const [searchText, setSearchText] = useState('');

  const handleDelete = (key) => {
    setUsers(users.filter(user => user.key !== key));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  // Filter users based on search text
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Users</h1>
      <Input
        placeholder="Search users by name or email"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: '8px', width: '300px', marginTop:'10px' }}
      />
      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        pagination={{ pageSize: 5 }} 
        style={{ marginTop: '20px' }} 
      />
    </div>
  );
};

export default Users;