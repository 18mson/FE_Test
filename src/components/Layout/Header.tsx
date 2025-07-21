import React, { useState } from 'react';
import { User, Menu } from 'lucide-react';
import { useAuth } from '../../hook/useAuth';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <User className="h-5 w-5 text-gray-600" />
            </button>
            {isOpen && (
              <div
                className="fixed inset-0 bg-gray-100/30 bg-opacity-50 z-30"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className="absolute right-10 top-10 mt-2 bg-white rounded-md shadow-lg py-1 flex justify-center flex-col"
                  aria-labelledby="dropdownMenuButton"
                  aria-hidden="true"
                >
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
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
