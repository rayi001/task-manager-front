import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-white hover:text-gray-200">
              TaskSphere
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
                >
                  Tasks
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
