import React, { useState } from 'react';
import { useProductStore } from '../stores/productStore';
import { useSalesStore, Sale, SaleItem } from '../stores/salesStore';
import { useUser } from '../contexts/UserContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct } = useProductStore();
  const { sales, getSalesByDateRange, getDailySales, getWeeklySales, getMonthlySales, getProductFrequency } = useSalesStore();
  const { addUser, users } = useUser();
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: 0, stock: 0 });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'shopkeeper' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('daily');

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    addUser: false,
    addProduct: false,
    manageProduct: false,
    salesTransaction: false,
    generateReport: false,
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({ name: '', category: '', price: 0, stock: 0 });
  };

  const handleUpdateProduct = (id: string, field: string, value: string | number) => {
    updateProduct(id, { [field]: value });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser.username, newUser.password, newUser.role as 'shopkeeper' | 'admin');
    setNewUser({ username: '', password: '', role: 'shopkeeper' });
  };

  const generateSalesReport = (sales: Sale[], title: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    const tableData = sales.map(sale => [
      sale.date.toLocaleDateString(),
      sale.id,
      sale.items.map(item => `${item.product.name} (${item.quantity})`).join(', '),
      `Tsh. ${sale.total.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Sale ID', 'Products (Quantity)', 'Total']],
      body: tableData,
      startY: 35
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    doc.text(`Total Sales: Tsh. ${totalSales.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10);

    // Product frequency analysis
    const productFrequency: { [key: string]: number } = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        productFrequency[item.product.name] = (productFrequency[item.product.name] || 0) + item.quantity;
      });
    });

    const sortedProducts = Object.entries(productFrequency).sort((a, b) => b[1] - a[1]);
    doc.addPage();
    doc.text('Product Sales Frequency', 14, 15);
    (doc as any).autoTable({
      head: [['Product Name', 'Quantity Sold']],
      body: sortedProducts,
      startY: 25
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleGenerateReport = () => {
    let reportSales: Sale[] = [];
    let reportTitle = '';

    switch (reportType) {
      case 'daily':
        reportSales = getDailySales(new Date(startDate));
        reportTitle = `Daily Sales Report for ${startDate}`;
        break;
      case 'weekly':
        reportSales = getWeeklySales(new Date(startDate));
        reportTitle = `Weekly Sales Report starting ${startDate}`;
        break;
      case 'monthly':
        reportSales = getMonthlySales(new Date(startDate));
        reportTitle = `Monthly Sales Report for ${new Date(startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
        break;
      case 'custom':
        reportSales = getSalesByDateRange(new Date(startDate), new Date(endDate));
        reportTitle = `Custom Sales Report from ${startDate} to ${endDate}`;
        break;
    }

    generateSalesReport(reportSales, reportTitle);
  };

  const filteredSales = sales.filter(sale =>
    sale.date.toLocaleDateString().includes(searchTerm) ||
    sale.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleDropdown = (section: string) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Dropdown Menu for Add New User */}
      <div className="bg-white p-4 rounded-md shadow">
        <button onClick={() => toggleDropdown('addUser')} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New User
        </button>
        {isDropdownOpen.addUser && (
          <div className="mt-4">
            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'shopkeeper' | 'admin' })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="shopkeeper">Shopkeeper</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add User
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Dropdown Menu for Add New Product */}
      <div className="bg-white p-4 rounded-md shadow">
        <button onClick={() => toggleDropdown('addProduct')} className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add New Product
        </button>
        {isDropdownOpen.addProduct && (
          <div className="mt-4">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Category"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded"
                required
                min="0"
                step="0.01"
              />
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                placeholder="Stock"
                className="w-full p-2 border border-gray-300 rounded"
                required
                min="0"
              />
              <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add Product
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Dropdown Menu for Manage Products */}
      <div className="bg-white p-4 rounded-md shadow">
        <button onClick={() => toggleDropdown('manageProduct')} className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Manage Products
        </button>
        {isDropdownOpen.manageProduct && (
          <div className="mt-4 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleUpdateProduct(product.id, 'stock', parseInt(e.target.value))}
                    placeholder="Update Stock"
                    className="p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleUpdateProduct(product.id, 'price', parseFloat(e.target.value))}
                    placeholder="Update Price"
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Menu for Sales Transactions */}
      <div className="bg-white p-4 rounded-md shadow">
        <button onClick={() => toggleDropdown('salesTransaction')} className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Sales Transactions
        </button>
        {isDropdownOpen.salesTransaction && (
          <div className="mt-4">
            {/* Add any additional management for sales transactions here */}
            <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-2xl font-bold mb-4">Sales Transactions</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by date or product name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Sale ID</th>
              <th className="text-left">Products</th>
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.date.toLocaleDateString()}</td>
                <td>{sale.id}</td>
                <td>
                  {sale.items.map((item: SaleItem, index: number) => (
                    <div key={index}>
                      {item.product.name} (Qty: {item.quantity}, Price: Tsh. {item.price.toFixed(2)})
                    </div>
                  ))}
                </td>
                <td>Tsh. {sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          </div>
        )}
      </div>

      {/* Dropdown Menu for Generate Report */}
      <div className="bg-white p-4 rounded-md shadow">
        <button onClick={() => toggleDropdown('generateReport')} className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Generate Report
        </button>
        {isDropdownOpen.generateReport && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block">End Date (for custom report)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleGenerateReport}
              className=" bg-green-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
