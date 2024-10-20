import React from 'react';
import axios from 'axios';

export default function ProductPage() {
  const reviews = [
    { user: 'Alice', comment: 'Great product!' },
    { user: 'Bob', comment: 'Very useful and affordable.' },
  ];

  const [product, setProduct] = React.useState({});

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id); // Debugging line
        const response = await axios.get(`http://localhost:8080/api/v1/all/products/${id}`);
        console.log('Product data:', response.data); // Debugging line
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">handyShare</div>
        <nav className="space-x-4">
          <a href="/lendings" className="hover:underline">Lendings</a>
          <a href="/borrowings" className="hover:underline">Borrowings</a>
          <a href="/profile" className="hover:underline">Profile</a>
        </nav>
      </header>
      <main className="flex-grow p-8 flex">
        <div className="w-1/3 bg-gray-100 p-4">
          <img src="/path/to/image.jpg" alt="Product" className="w-full h-64 object-cover" />
          <div className="mt-4">
            <h3 className="text-lg font-bold">Description</h3>
            <p>Product description goes here.</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Reviews</h3>
            {reviews.map((review, index) => (
              <div key={index} className="mt-2">
                <p><strong>{review.user}:</strong> {review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3 px-4">
          <h2 className="text-2xl font-bold">Product Name</h2>
          <p className="text-lg">Price: $20/hour</p>
          <p>Transaction Time: 2 hours</p>
          <div className="mt-4">
            <label>From</label>
          </div>
        </div>
        <div className="w-1/3">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Lender Information</h3>
            <p>Name: John Doe</p>
            <p>Rating: 4.5</p>
            <p>Location: New York, NY</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Lender's Location</h3>
            <p>Google map location goes here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
