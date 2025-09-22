import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{product.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          <div className="text-lg font-bold text-orange-600 mt-2">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
        </div>
        
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="font-semibold text-lg min-w-[2rem] text-center">
            {quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            R$ {itemTotal.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>
    </div>
  );
};