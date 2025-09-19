import { useState, useCallback, useEffect } from 'react';
import { Order, CartItem, PaymentInfo } from '../types';
import { appSyncService } from '../services/appSyncService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar pedidos do AppSync
  const loadOrders = useCallback(async () => {
    if (!appSyncService.isConfigured()) {
      return;
    }

    setLoading(true);
    try {
      const appSyncOrders = await appSyncService.getOrders();
      setOrders(appSyncOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar pedido
  const createOrder = useCallback(async (
    items: CartItem[],
    paymentInfo: PaymentInfo,
    customerInfo?: { name?: string; phone?: string; tableId?: string; orderType: 'dine-in' | 'takeout' | 'delivery' }
  ) => {
    try {
      if (appSyncService.isConfigured()) {
        // Criar no AppSync
        const orderId = await appSyncService.createOrder(items, paymentInfo, customerInfo);
        
        // Recarregar pedidos
        await loadOrders();
        
        return { id: orderId };
      } else {
        // Fallback para modo local
        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          status: 'pending',
          paymentMethod: paymentInfo.method,
          paymentStatus: 'paid',
          customerName: customerInfo?.name,
          customerPhone: customerInfo?.phone,
          tableId: customerInfo?.tableId,
          orderType: customerInfo?.orderType || 'takeout',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setOrders(prev => [order, ...prev]);
        return order;
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }, [loadOrders]);

  // Atualizar status do pedido
  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      if (appSyncService.isConfigured()) {
        // Atualizar no AppSync
        await appSyncService.updateOrderStatus(orderId, status);
        
        // Atualizar localmente
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        );
      } else {
        // Atualizar apenas localmente
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  }, []);

  // Configurar subscriptions em tempo real
  useEffect(() => {
    if (!appSyncService.isConfigured()) {
      return;
    }

    // Carregar pedidos iniciais
    loadOrders();

    // Subscrever a novos pedidos
    const unsubscribeNew = appSyncService.subscribeToNewOrders((newOrder) => {
      setOrders(prev => {
        // Evitar duplicatas
        if (prev.find(order => order.id === newOrder.id)) {
          return prev;
        }
        return [newOrder, ...prev];
      });
    });

    // Subscrever a atualizações de pedidos
    const unsubscribeUpdates = appSyncService.subscribeToOrderUpdates((updatedOrder) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    return () => {
      unsubscribeNew();
      unsubscribeUpdates();
    };
  }, [loadOrders]);

  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getTodaysOrders = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter(order => order.createdAt >= today);
  }, [orders]);

  const getTodaysRevenue = useCallback(() => {
    return getTodaysOrders()
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);
  }, [getTodaysOrders]);

  const getOrdersByTable = useCallback((tableId: string) => {
    return orders.filter(order => order.tableId === tableId && order.status !== 'delivered' && order.status !== 'cancelled');
  }, [orders]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getTodaysOrders,
    getTodaysRevenue,
    getOrdersByTable,
    loadOrders
  };
};