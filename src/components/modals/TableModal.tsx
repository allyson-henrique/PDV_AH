import React, { useState } from 'react';
import { X, Users, Clock, Utensils, Trash2, Edit3 } from 'lucide-react';
import { Table } from '../types';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onUpdateStatus: (tableId: string, status: Table['status'], orderId?: string) => void;
  onReserveTable: (tableId: string, customerName: string) => void;
  onOccupyTable: (tableId: string, orderId?: string) => void;
  onFreeTable: (tableId: string) => void;
  onCleanTable: (tableId: string) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  table,
  onUpdateStatus,
  onReserveTable,
  onOccupyTable,
  onFreeTable,
  onCleanTable
}) => {
  const [reservationName, setReservationName] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);

  if (!isOpen || !table) return null;

  const handleReservation = () => {
    if (reservationName.trim()) {
      onReserveTable(table.id, reservationName.trim());
      setReservationName('');
      setShowReservationForm(false);
      onClose();
    }
  };

  const handleOccupy = () => {
    onOccupyTable(table.id);
    onClose();
  };

  const handleFree = () => {
    onFreeTable(table.id);
    onClose();
  };

  const handleClean = () => {
    onCleanTable(table.id);
    onClose();
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'occupied': return 'text-red-600 bg-red-100';
      case 'reserved': return 'text-yellow-600 bg-yellow-100';
      case 'cleaning': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'cleaning': return 'Em Limpeza';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mesa {table.number}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Capacidade: {table.capacity} pessoas</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Utensils className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Seção: {table.section}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(table.status)}`}>
                {getStatusText(table.status)}
              </span>
            </div>

            {table.status === 'occupied' && table.occupiedAt && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span className="text-red-700">
                    Ocupada há: {Math.floor((new Date().getTime() - table.occupiedAt.getTime()) / 60000)} min
                  </span>
                </div>
              </div>
            )}

            {table.status === 'reserved' && table.reservedBy && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-yellow-800">
                  <div className="font-medium">Reservada para:</div>
                  <div>{table.reservedBy}</div>
                </div>
              </div>
            )}
          </div>

          {showReservationForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleReservation}
                  disabled={!reservationName.trim()}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Confirmar Reserva
                </button>
                <button
                  onClick={() => setShowReservationForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {table.status === 'available' && (
                <>
                  <button
                    onClick={handleOccupy}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Ocupar Mesa</span>
                  </button>
                  <button
                    onClick={() => setShowReservationForm(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Reservar Mesa</span>
                  </button>
                </>
              )}

              {table.status === 'occupied' && (
                <button
                  onClick={handleFree}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Liberar Mesa</span>
                </button>
              )}

              {table.status === 'reserved' && (
                <>
                  <button
                    onClick={handleOccupy}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Ocupar Mesa</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(table.id, 'available')}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar Reserva</span>
                  </button>
                </>
              )}

              {table.status === 'cleaning' && (
                <button
                  onClick={handleClean}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Finalizar Limpeza</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};