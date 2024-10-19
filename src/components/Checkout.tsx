import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/productStore';
import { useSalesStore } from '../stores/salesStore';
import { jsPDF } from 'jspdf';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const { updateStock } = useProductStore();
  const { addSale } = useSalesStore();
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleCheckout = () => {
    // Create sale object
    const sale = {
      date: new Date(),
      total: getTotalPrice(),
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    // Add sale to store
    addSale(sale);

    // Update stock
    cart.forEach((item) => {
      updateStock(item.product.id, item.product.stock - item.quantity);
    });

    // Generate receipt
    const doc = new jsPDF();
    doc.text('Receipt', 10, 10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 20);
    doc.text('Items:', 10, 30);
    let y = 40;
    cart.forEach((item) => {
      doc.text(`${item.product.name} x${item.quantity}: $${(item.product.price * item.quantity).toFixed(2)}`, 10, y);
      y += 10;
    });
    doc.text(`Total: $${getTotalPrice().toFixed(2)}`, 10, y + 10);
    doc.text(`Payment Method: ${paymentMethod}`, 10, y + 20);
    doc.save('receipt.pdf');

    // Clear cart and navigate to home
    clearCart();
    navigate('/');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.product.id} className="py-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span className="float-right">${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 text-right">
          <p className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select payment method</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
        </select>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={!paymentMethod || cart.length === 0}
      >
        Complete Purchase
      </button>
    </div>
  );
};

export default Checkout;