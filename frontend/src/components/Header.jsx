import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { LogOut,CalendarCheck2 } from 'lucide-react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      })
      .catch((error) => {
        toast.error('Logout failed: ' + error);
      });
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <CalendarCheck2 className="h-6 w-6 text-indigo-100" />
              <img
                className="h-10 w-auto"
                src="/logo.png"
                alt="Task Management Logo"
              />
              {/* <span className="ml-2 text-white font-semibold text-lg hidden sm:inline">Task Manager</span> */}
            </a>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;