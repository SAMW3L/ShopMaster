import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';

const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, searchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [popupMessage, setPopupMessage] = useState<string | null>(null); // State for popup message
  const [popupType, setPopupType] = useState<'success' | 'error' | null>(null); // To differentiate between success and error messages

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchTerm);
  };

  const handleAddToCart = (product: any) => {
    if (product.stock > 0) {
      addToCart(product); // Adding the product to the cart
      setPopupMessage(`Added "${product.name}" to cart successfully!`);
      setPopupType('success');
    } else {
      setPopupMessage(`Sorry, "${product.name}" is out of stock.`);
      setPopupType('error');
    }

    // Hide the popup after 2 seconds
    setTimeout(() => {
      setPopupMessage(null);
      setPopupType(null);
    }, 2000);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
            <Search size={20} />
          </button>
        </div>
      </form>
      
      {/* Popup message */}
      {popupMessage && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg transition-all ${
            popupType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {popupMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-green-600 font-bold">Tsh. {product.price.toFixed(2)}</p>
            <p className={`text-sm ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>
              Stock: {product.stock}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
