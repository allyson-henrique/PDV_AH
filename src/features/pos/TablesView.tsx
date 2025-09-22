import React, { useState } from 'react';
import { Plus, Filter, Users, Clock, Utensils, AlertCircle, Search } from 'lucide-react';
import { Table } from '../../types';
import { TableCard } from './TableCard';

interface TablesViewProps {
  tables: Table[];
  sections: string[];
  onTableSelect: (table: Table) => void;
  onUpdateTableStatus: (tableId: string, status: Table['status'], orderId?: string) => void;
  onReserveTable: (tableId: string, customerName: string) => void;
  onOccupyTable: (tableId: string, orderId?: string) => void;
  onFreeTable: (tableId: string) => void;
  onCleanTable: (tableId: string) => void;
}

export const TablesView: React.FC<TablesViewProps> = ({
  tables,
  sections,
  onTableSelect,
  onUpdateTableStatus,
  onReserveTable,
  onOccupyTable,
  onFreeTable,
  onCleanTable
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = tables.filter(table => {
    const matchesSection = selectedSection === 'all' || table.section === selectedSection;
    const matchesStatus = selectedStatus === 'all' || table.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      table.number.toString().includes(searchTerm) ||
      (table.reservedBy && table.reservedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSection && matchesStatus && matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      cleaning: tables.filter(t => t.status === 'cleaning').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Controle de Mesas</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Selecione uma mesa para iniciar um atendimento
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border text-sm">
            <span className="text-gray-600">Total: </span>
            <span className="font-semibold text-gray-900">{tables.length} mesas</span>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-800">{stats.available}</div>
              <div className="text-xs sm:text-sm text-green-600">Disponíveis</div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-red-800">{stats.occupied}</div>
              <div className="text-xs sm:text-sm text-red-600">Ocupadas</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-800">{stats.reserved}</div>
              <div className="text-xs sm:text-sm text-yellow-600">Reservadas</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-blue-800">{stats.cleaning}</div>
              <div className="text-xs sm:text-sm text-blue-600">Limpeza</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar mesa ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Section and Status Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Section Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSection('all')}
              className={`
                px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                ${selectedSection === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Todas as Seções
            </button>
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`
                  px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  ${selectedSection === section
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`
                px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                ${selectedStatus === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Todos Status
            </button>
            {[
              { value: 'available', label: 'Disponível' },
              { value: 'occupied', label: 'Ocupada' },
              { value: 'reserved', label: 'Reservada' },
              { value: 'cleaning', label: 'Limpeza' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`
                  px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  ${selectedStatus === status.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredTables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            onTableClick={onTableSelect}
          />
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-base sm:text-lg">
            {searchTerm || selectedSection !== 'all' || selectedStatus !== 'all'
              ? 'Nenhuma mesa encontrada com os filtros aplicados'
              : 'Nenhuma mesa encontrada'
            }
          </div>
        </div>
      )}
    </div>
  );
};