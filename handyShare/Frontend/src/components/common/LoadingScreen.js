import React from 'react';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingScreen = ({ tip = 'Loading...', fullScreen = true }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0' : 'relative'}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="text-center">
        <Spin indicator={antIcon} />
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            marginTop: '20px',
            color: '#1890ff',
            fontSize: '16px',
            fontWeight: 500
          }}
        >
          {tip}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
