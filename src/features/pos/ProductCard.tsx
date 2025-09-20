import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-3xl sm:text-4xl text-orange-400">🍔</div>
      </div>
      
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center text-gray-500 text-xs sm:text-sm ml-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="whitespace-nowrap">{product.preparationTime}min</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.available}
            className={`
              flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base
              ${product.available
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Adicionar</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
        
        {!product.available && (
          <div className="mt-2 text-center">
            <span className="text-red-500 text-xs sm:text-sm font-medium">Indisponível</span>
          </div>
        )}
      </div>
    </div>
  );
};