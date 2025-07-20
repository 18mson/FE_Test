import React from 'react';
import { User, Menu } from 'lucide-react';
import { useAuth } from '../../hook/useAuth';

const Header: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <User className="h-5 w-5 text-gray-600" />
        </button>
        <button 
          onClick={logout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;