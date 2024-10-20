import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductSearch from './components/ProductSearch.tsx';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { UserProvider, useUser } from './contexts/UserContext';

const ProtectedRoute: React.FC<{ element: React.ReactElement; allowedRoles?: string[] }> = ({ element, allowedRoles }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return element;
};

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute element={<ProductSearch />} />} />
            <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
            <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={['admin']} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;