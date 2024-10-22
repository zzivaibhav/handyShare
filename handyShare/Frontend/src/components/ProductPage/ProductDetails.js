import React from 'react';

export function ProductDetails({ name, price, transactionTime, description }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Price: ${price}</p>
      <p>Transaction Time: {transactionTime}</p>
      <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
        {description || 'No description available.'}
      </p>
    </div>
  );
}
