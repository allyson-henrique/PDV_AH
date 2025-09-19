import { useState, useCallback } from 'react';
import { Table } from '../types';

const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available', section: 'Área Interna' },
  { id: '2', number: 2, capacity: 4, status: 'occupied', section: 'Área Interna', occupiedAt: new Date() },
  { id: '3', number: 3, capacity: 2, status: 'available', section: 'Área Interna' },
  { id: '4', number: 4, capacity: 6, status: 'reserved', section: 'Área Interna', reservedBy: 'João Silva', reservedAt: new Date() },
  { id: '5', number: 5, capacity: 4, status: 'available', section: 'Área Interna' },
  { id: '6', number: 6, capacity: 2, status: 'cleaning', section: 'Área Interna' },
  { id: '7', number: 7, capacity: 8, status: 'available', section: 'Área Externa' },
  { id: '8', number: 8, capacity: 4, status: 'occupied', section: 'Área Externa', occupiedAt: new Date() },
  { id: '9', number: 9, capacity: 2, status: 'available', section: 'Área Externa' },
  { id: '10', number: 10, capacity: 4, status: 'available', section: 'Área Externa' },
];

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>(mockTables);

  const updateTableStatus = useCallback((tableId: string, status: Table['status'], orderId?: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status,
              currentOrder: status === 'occupied' ? orderId : undefined,
              occupiedAt: status === 'occupied' ? new Date() : table.occupiedAt,
              reservedAt: status === 'reserved' ? new Date() : undefined,
              reservedBy: status === 'reserved' ? table.reservedBy : undefined
            }
          : table
      )
    );
  }, []);

  const reserveTable = useCallback((tableId: string, customerName: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: 'reserved',
              reservedBy: customerName,
              reservedAt: new Date()
            }
          : table
      )
    );
  }, []);

  const occupyTable = useCallback((tableId: string, orderId?: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: 'occupied',
              currentOrder: orderId,
              occupiedAt: new Date(),
              reservedBy: undefined,
              reservedAt: undefined
            }
          : table
      )
    );
  }, []);

  const linkOrderToTable = useCallback((tableId: string, orderId: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? { ...table, currentOrder: orderId }
          : table
      )
    );
  }, []);

  const freeTable = useCallback((tableId: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: 'cleaning',
              currentOrder: undefined,
              occupiedAt: undefined,
              reservedBy: undefined,
              reservedAt: undefined
            }
          : table
      )
    );
  }, []);

  const cleanTable = useCallback((tableId: string) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? { ...table, status: 'available' }
          : table
      )
    );
  }, []);

  const getTablesBySection = useCallback((section: string) => {
    return tables.filter(table => table.section === section);
  }, [tables]);

  const getAvailableTables = useCallback(() => {
    return tables.filter(table => table.status === 'available');
  }, [tables]);

  const sections = Array.from(new Set(tables.map(table => table.section || 'Sem Seção')));

  return {
    tables,
    sections,
    updateTableStatus,
    reserveTable,
    occupyTable,
    linkOrderToTable,
    freeTable,
    cleanTable,
    getTablesBySection,
    getAvailableTables
  };
};