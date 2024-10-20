import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">AboveAverage</Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/" className="hover:text-blue-200">Home</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-200">
                <ShoppingCart className="inline-block mr-1" size={20} />
                Cart
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" className="hover:text-blue-200">
                  <User className="inline-block mr-1" size={20} />
                  Admin
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="hover:text-blue-200">
                <LogOut className="inline-block mr-1" size={20} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;