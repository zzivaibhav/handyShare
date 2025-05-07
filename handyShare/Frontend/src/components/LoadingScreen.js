import React from 'react';
import { motion } from 'framer-motion';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingScreen = ({ tip = "Loading..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <Spin 
          indicator={
            <LoadingOutlined 
              style={{ 
                fontSize: 48, 
                color: '#3B7BF8' 
              }} 
              spin 
            />
          }
        />
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 font-medium"
        >
          {tip}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
