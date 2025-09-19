import React from 'react';
import { Users, Clock, User, Utensils } from 'lucide-react';
import { Table } from '../types';

interface TableCardProps {
  table: Table;
  onTableClick: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onTableClick }) => {
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'cleaning': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available': return <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'occupied': return <Users className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'reserved': return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'cleaning': return <User className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'cleaning': return 'Limpeza';
    }
  };

  const getOccupiedTime = () => {
    if (!table.occupiedAt) return '';
    const now = new Date();
    const diff = now.getTime() - table.occupiedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div
      onClick={() => onTableClick(table)}
      className={`
        relative p-3 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1
        ${getStatusColor(table.status)}
      `}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="bg-white bg-opacity-50 p-1 sm:p-2 rounded-lg">
            {getStatusIcon(table.status)}
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-bold">Mesa {table.number}</h3>
            <p className="text-xs sm:text-sm opacity-75">{table.capacity} lugares</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-xs font-medium opacity-75">
            {getStatusText(table.status)}
          </span>
        </div>
      </div>

      {table.status === 'occupied' && table.occupiedAt && (
        <div className="bg-white bg-opacity-30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span>Tempo ocupada:</span>
            <span className="font-semibold">{getOccupiedTime()}</span>
          </div>
        </div>
      )}

      {table.status === 'reserved' && table.reservedBy && (
        <div className="bg-white bg-opacity-30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
          <div className="text-xs sm:text-sm">
            <div className="font-medium">Reservada para:</div>
            <div className="opacity-75 truncate">{table.reservedBy}</div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-xs opacity-75">
        <span className="truncate">{table.section}</span>
        {table.currentOrder && (
          <span className="bg-white bg-opacity-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
            #{table.currentOrder.split('-')[1]}
          </span>
        )}
      </div>
    </div>
  );
};