import React, { useState } from 'react';
import { ShoppingCart, CreditCard, User, Phone, Grid3X3, ArrowLeft } from 'lucide-react';
import { CartItem as CartItemType, Table } from '../../types';
import { CartItem } from './CartItem';

interface CartViewProps {
  items: CartItemType[];
  total: number;
  tables: Table[];
  currentTable?: Table | null;
  customerInfo?: { 
    name?: string; 
    phone?: string; 
    tableId?: string; 
    orderType: 'dine-in' | 'takeout' | 'delivery';
    guestCount?: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (customerInfo?: { name?: string; phone?: string; tableId?: string; orderType: 'dine-in' | 'takeout' | 'delivery'; guestCount?: number }) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  total,
  tables,
  currentTable,
  customerInfo,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [customerName, setCustomerName] = useState(customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerInfo?.phone || '');
  const [selectedTable, setSelectedTable] = useState(customerInfo?.tableId || '');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout' | 'delivery'>(
    customerInfo?.orderType || 'takeout'
  );

  const availableTables = tables.filter(table => table.status === 'available');

  const handleCheckout = () => {
    onCheckout({
      name: customerName.trim() || undefined,
      phone: customerPhone.trim() || undefined,
      tableId: currentTable?.id || (orderType === 'dine-in' ? selectedTable || undefined : undefined),
      orderType,
      guestCount: customerInfo?.guestCount
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Carrinho vazio</h2>
          <p className="text-gray-600">
            {currentTable 
              ? 'Adicione itens do cardápio para a mesa' 
              : 'Adicione itens do cardápio para começar seu pedido'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Carrinho</h2>
        {currentTable && (
          <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
            <span className="text-sm font-medium text-orange-800">
              Mesa {currentTable.number}
              {customerInfo?.guestCount && ` - ${customerInfo.guestCount} pessoas`}
              {customerInfo?.name && ` - ${customerInfo.name}`}
            </span>
          </div>
        )}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
          
          {/* Order Type - Only show if not at a table */}
          {!currentTable && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo do Pedido
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`p-2 text-xs rounded-lg border-2 transition-colors ${
                    orderType === 'dine-in'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Balcão
                </button>
                <button
                  onClick={() => setOrderType('takeout')}
                  className={`p-2 text-xs rounded-lg border-2 transition-colors ${
                    orderType === 'takeout'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Viagem
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`p-2 text-xs rounded-lg border-2 transition-colors ${
                    orderType === 'delivery'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>
          )}

          {/* Table Selection for Dine-in (only if not already at a table) */}
          {!currentTable && orderType === 'dine-in' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Mesa
              </label>
              <div className="relative">
                <Grid3X3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecione uma mesa</option>
                  {availableTables.map(table => (
                    <option key={table.id} value={table.id}>
                      Mesa {table.number} ({table.capacity} lugares) - {table.section}
                    </option>
                  ))}
                </select>
              </div>
              {availableTables.length === 0 && (
                <p className="text-sm text-red-600 mt-1">Nenhuma mesa disponível</p>
              )}
            </div>
          )}
          
          {/* Customer Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente (opcional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (opcional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={!currentTable && orderType === 'dine-in' && !selectedTable}
            className={`
              w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2
              ${!currentTable && orderType === 'dine-in' && !selectedTable
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              }
            `}
          >
            <CreditCard className="h-5 w-5" />
            <span>Finalizar Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};