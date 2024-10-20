import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.product.id} className="py-4 flex items-center">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">Tsh. {item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                    disabled={item.quantity === item.product.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: Tsh. {getTotalPrice().toFixed(2)}</p>
            <Link
              to="/checkout"
              className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;