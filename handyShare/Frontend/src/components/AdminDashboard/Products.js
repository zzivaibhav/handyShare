import React, { useState } from 'react';
import { Button, Table, Input } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const Products = () => {
  const [products, setProducts] = useState([
    {
      key: '1',
      name: 'Laptop',
      price: '$1850.00',
      category: 'Electronics',
    },
    {
      key: '2',
      name: 'Shirts',
      price: '$15.50',
      category: 'Clothing',
    },
    {
      key: '5',
      name: 'Chocolate Chip Cookies',
      price: '$3.00',
      category: 'Bakery',
    },
    {
      key: '6',
      name: 'Marshmallows',
      price: '$2.50',
      category: 'Snacks',
    },
    {
      key: '7',
      name: 'Peanut Butter Cups',
      price: '$1.80',
      category: 'Snacks',
    },
    {
      key: '8',
      name: 'Fruit Snacks',
      price: '$2.20',
      category: 'Candies',
    },
    {
      key: '9',
      name: 'Trail Mix',
      price: '$2.75',
      category: 'Snacks',
    },
  ]);

  const [searchText, setSearchText] = useState('');

  const handleDelete = (key) => {
    setProducts(products.filter(product => product.key !== key));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
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

  // Filter products based on search text
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Products</h1>
      <Input
        placeholder="Search products by name or category"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: '8px', width: '300px', marginTop: '10px' }}
      />
      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        pagination={{ pageSize: 5 }} 
        style={{ marginTop: '20px' }} 
      />
    </div>
  );
};

export default Products;