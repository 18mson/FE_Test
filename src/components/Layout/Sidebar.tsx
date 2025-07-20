import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, FileText, Settings, Home, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hook/useAuth';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, hasSubmenu: false },
    { 
      name: 'Laporan Lalin', 
      href: '/reports', 
      icon: FileText, 
      hasSubmenu: true,
      submenu: [
        { name: 'Laporan Per Hari', href: '/reports' }
      ]
    },
    { name: 'Master Gerbang', href: '/gates', icon: Settings, hasSubmenu: false },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-8flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </div>
              {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
            </NavLink>
            {item.submenu && (
              <div className="ml-6 mt-1 space-y-1">
                {item.submenu.map((subItem) => (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm rounded transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;