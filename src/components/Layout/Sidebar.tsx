import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Settings, Home, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };
   const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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
        <div className="flex items-center space-x-3 justify-between">
          <div className="w-12 h-8 flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <button
            onClick={toggleMinimize}
            className="text-gray-600 hover:text-gray-900 focus:outline-none h-8 w-12 flex items-center justify-center"
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
              isMinimized ? '' : 'rotate-180'
            }`} />
          </button>
        </div>
      </div>
      
      <nav className="flex-1 pl-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isSubmenuActive = item.submenu?.some(sub => location.pathname.startsWith(sub.href)) ?? false;

          return (
            <div key={item.name}>
              {item.hasSubmenu ? (
                <div>
                  <div
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded transition-colors duration-200 cursor-pointer ${
                      isSubmenuActive || openSubmenu === item.name
                        ? 'bg-blue-50 text-gray-700 border-r-2 border-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSubmenu === item.name || isSubmenuActive ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {(openSubmenu === item.name || isSubmenuActive) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.href}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded transition-colors duration-200 ${
                              isActive
                                ? 'bg-blue-50 text-gray-700'
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
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-gray-700 border-r-2 border-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;