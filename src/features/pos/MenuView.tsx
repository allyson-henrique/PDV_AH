import React, { useState } from 'react';
import { Search, ArrowLeft, Users, Filter } from 'lucide-react';
import { Product, Table } from '../types';
import { ProductCard } from './ProductCard';

interface MenuViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  currentTable?: Table | null;
  customerInfo?: { 
    name?: string; 
    phone?: string; 
    tableId?: string; 
    orderType: 'dine-in' | 'takeout' | 'delivery';
    guestCount?: number;
  };
  onCloseTable?: (tableId: string) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ 
  products, 
  onAddToCart, 
  currentTable,
  customerInfo,
  onCloseTable 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Cardápio</h2>
            {currentTable && (
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Mesa {currentTable.number}
                  {customerInfo?.guestCount && ` - ${customerInfo.guestCount} pessoas`}
                  {customerInfo?.name && ` - ${customerInfo.name}`}
                </span>
              </div>
            )}
          </div>

          {!currentTable && (
            <div className="bg-blue-50 px-3 sm:px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                Modo Balcão/Delivery
              </span>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-sm sm:text-base"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  ${selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-base sm:text-lg">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Nenhum produto encontrado' 
              : 'Nenhum produto disponível'
            }
          </div>
        </div>
      )}
    </div>
  );
};