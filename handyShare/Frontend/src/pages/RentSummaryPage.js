// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js'; // Adjust path if needed
// import { Layout, Row, Col, Card, Button } from 'antd';

// const { Header, Content } = Layout;

// const RentSummaryPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
  
//   const { product, hours } = state || {};
//   const totalPrice = (product?.pricePerHour || 0) * hours;

//   if (!product || !hours) {
//     return <div>No rental information available</div>;
//   }

//   return (
//     <Layout>
//       <Header>
//         <HeaderBar />
//       </Header>
//       <Content style={{ padding: '20px' }}>
//         <Row justify="center">
//           <Col span={12}>
//             <Card title="Rent Summary" bordered={false}>
//               <p><strong>Product Name:</strong> {product.name}</p>
//               <p><strong>Price per Hour:</strong> ${product.pricePerHour}</p>
//               <p><strong>Hours Selected:</strong> {hours}</p>
//               <p><strong>Total Price:</strong> ${totalPrice}</p>
//               <Button
//                 type="primary"
//                 onClick={() => navigate('/')}
//               >
//                 Confirm and Return to Home
//               </Button>
//             </Card>
//           </Col>
//         </Row>
//       </Content>
//     </Layout>
//   );
// };

// export default RentSummaryPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/ProfileUpdatePage/ProfileHeaderBar.js';
import sampleImage from './defaultProfileImage.png';

const RentSummaryPage = () => {
  const navigate = useNavigate();

  // Hardcoded product data for now
  const product = {
    name: 'Sample Product',
    pricePerHour: 15,
    image: '', 
  };
  const hours = 5; // Sample hours
  const totalPrice = product.pricePerHour * hours;

  return (
    <div>
        <HeaderBar />
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-5">Rent Summary</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex">
          <div className="w-1/3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          {/* Product Details */}
          <div className="w-2/3 pl-6">
            <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
            <p className="text-md mb-2"><strong>Price per Hour:</strong> ${product.pricePerHour}</p>
            <p className="text-md mb-2"><strong>Hours Selected:</strong> {hours}</p>
            <p className="text-lg font-bold mb-4"><strong>Total Price:</strong> ${totalPrice}</p>

            {/* Button to confirm */}
            <button
              onClick={() => navigate('/payment')}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm and Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RentSummaryPage;