import React from 'react';
import { ShoppingCart, Users, BarChart3, ChefHat, Grid3X3, Monitor, X, LogOut, Settings } from 'lucide-react';
import { View, Table, UserProfile } from '../../types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  cartItemCount: number;
  currentTable?: Table | null;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  cartItemCount, 
  currentTable,
  userProfile,
  onLogout
}) => {
  const getNavItems = () => {
    const baseItems = [
      { id: 'tables' as View, label: 'Mesas', icon: Grid3X3, roles: ['admin', 'cashier', 'waiter'] },
      { id: 'menu' as View, label: 'Cardápio', icon: ChefHat, roles: ['admin', 'cashier', 'waiter'] },
      { id: 'cart' as View, label: 'Carrinho', icon: ShoppingCart, badge: cartItemCount, roles: ['admin', 'cashier', 'waiter'] },
      { id: 'kitchen' as View, label: 'Cozinha', icon: Users, roles: ['admin', 'kitchen', 'manager'] },
      { id: 'totem' as View, label: 'Totem', icon: Monitor, roles: ['admin', 'manager'] },
      { id: 'admin' as View, label: 'Relatórios', icon: BarChart3, roles: ['admin', 'manager'] }
    ];

    return baseItems.filter(item => 
      !userProfile || item.roles.includes(userProfile.role)
    );
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white shadow-lg border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-orange-500 p-1.5 sm:p-2 rounded-lg">
              <ChefHat className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Allyson Henrique</h1>
              <p className="text-xs sm:text-sm text-gray-600">Sistema de Vendas</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">A. Henrique</h1>
            </div>
          </div>

          {/* Current Table Info */}
          {currentTable && (
            <div className="hidden md:flex items-center space-x-3 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <Grid3X3 className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Mesa {currentTable.number} - {currentTable.capacity} lugares
              </span>
              <button
                onClick={() => onViewChange('tables')}
                className="text-orange-600 hover:text-orange-800 p-1 hover:bg-orange-100 rounded transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Navigation */}
            <div className="flex md:hidden space-x-1 bg-gray-100 p-1 rounded-lg">
              {navItems.slice(0, 4).map(({ id, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`
                    relative flex items-center justify-center p-2 rounded-md transition-all duration-200
                    ${currentView === id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {navItems.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`
                    relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${currentView === id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile and Logout */}
            {userProfile && (
              <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{userProfile.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{userProfile.role}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Table Info */}
        {currentTable && (
          <div className="md:hidden pb-3">
            <div className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Mesa {currentTable.number}
                </span>
              </div>
              <button
                onClick={() => onViewChange('tables')}
                className="text-orange-600 hover:text-orange-800 p-1 hover:bg-orange-100 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};