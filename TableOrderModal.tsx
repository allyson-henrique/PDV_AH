import React, { useState } from 'react';
import { X, Users, User } from 'lucide-react';
import { Table } from '../types';

interface TableOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onOpenTable: (table: Table, guestCount: number, customerName?: string) => void;
}

export const TableOrderModal: React.FC<TableOrderModalProps> = ({
  isOpen,
  onClose,
  table,
  onOpenTable
}) => {
  const [guestCount, setGuestCount] = useState(2);
  const [customerName, setCustomerName] = useState('');

  if (!isOpen || !table) return null;

  const handleOpenTable = () => {
    onOpenTable(table, guestCount, customerName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Abrir Mesa {table.number}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Capacidade da mesa:</span>
                <span className="font-semibold text-gray-900">{table.capacity} pessoas</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de clientes
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                >
                  -
                </button>
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">{guestCount}</span>
                </div>
                <button
                  onClick={() => setGuestCount(Math.min(table.capacity, guestCount + 1))}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-2 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
              {guestCount > table.capacity && (
                <p className="text-sm text-red-600 mt-1">
                  Número de clientes excede a capacidade da mesa
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do cliente (opcional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleOpenTable}
              disabled={guestCount > table.capacity}
              className={`
                w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                ${guestCount > table.capacity
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                }
              `}
            >
              Abrir Mesa e Fazer Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};