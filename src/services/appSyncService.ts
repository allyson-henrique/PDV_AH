import { client, isAppSyncConfigured } from '../lib/amplify';
import { createOrder, updateOrder, createOrderItem } from '../graphql/mutations';
import { listOrders, ordersByStatus } from '../graphql/queries';
import { onCreateOrder, onUpdateOrder } from '../graphql/subscriptions';
import { v4 as uuidv4 } from 'uuid';
import type { CartItem, PaymentInfo, Order } from '../types';

export class AppSyncService {
  private subscriptions: any[] = [];

  // Verificar se AppSync está configurado
  isConfigured(): boolean {
    return isAppSyncConfigured();
  }

  // Criar pedido no AppSync
  async createOrder(
    items: CartItem[],
    paymentInfo: PaymentInfo,
    customerInfo?: any
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('AppSync não está configurado');
    }

    const orderId = uuidv4();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    try {
      // Criar o pedido principal
      const orderInput = {
        id: orderId,
        orderNumber,
        tableId: customerInfo?.tableId || null,
        customerName: customerInfo?.name || null,
        customerPhone: customerInfo?.phone || null,
        orderType: customerInfo?.orderType || 'takeout',
        status: 'pending',
        subtotal: total,
        discount: 0,
        total,
        guestCount: customerInfo?.guestCount || null,
        notes: null,
      };

      const orderResult = await client.graphql({
        query: createOrder,
        variables: { input: orderInput }
      });

      // Criar os itens do pedido
      for (const item of items) {
        const itemInput = {
          id: uuidv4(),
          orderId,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
          notes: item.notes || null,
        };

        await client.graphql({
          query: createOrderItem,
          variables: { input: itemInput }
        });
      }

      console.log('✅ Pedido criado no AppSync:', orderId);
      return orderId;
    } catch (error) {
      console.error('❌ Erro ao criar pedido no AppSync:', error);
      throw error;
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('AppSync não está configurado');
    }

    try {
      await client.graphql({
        query: updateOrder,
        variables: {
          input: {
            id: orderId,
            status,
            updatedAt: new Date().toISOString()
          }
        }
      });

      console.log('✅ Status do pedido atualizado no AppSync:', orderId, status);
    } catch (error) {
      console.error('❌ Erro ao atualizar status no AppSync:', error);
      throw error;
    }
  }

  // Buscar pedidos
  async getOrders(status?: string): Promise<Order[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const query = status ? ordersByStatus : listOrders;
      const variables = status ? { status: status.toUpperCase() } : {};

      const result = await client.graphql({
        query,
        variables
      });

      const orders = result.data.listOrders?.items || result.data.ordersByStatus?.items || [];
      
      return orders.map(this.transformAppSyncOrderToLocal);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos do AppSync:', error);
      return [];
    }
  }

  // Transformar pedido do AppSync para formato local
  private transformAppSyncOrderToLocal(appSyncOrder: any): Order {
    return {
      id: appSyncOrder.id,
      items: appSyncOrder.items?.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.unitPrice,
          description: '',
          category: '',
          available: true,
          preparationTime: 15
        },
        quantity: item.quantity,
        notes: item.notes
      })) || [],
      total: appSyncOrder.total,
      status: appSyncOrder.status.toLowerCase(),
      paymentMethod: 'cash', // Default, seria melhor ter no schema
      paymentStatus: 'paid',
      customerName: appSyncOrder.customerName,
      customerPhone: appSyncOrder.customerPhone,
      tableId: appSyncOrder.tableId,
      orderType: appSyncOrder.orderType,
      createdAt: new Date(appSyncOrder.createdAt),
      updatedAt: new Date(appSyncOrder.updatedAt),
      notes: appSyncOrder.notes
    };
  }

  // Subscrever a novos pedidos (para cozinha)
  subscribeToNewOrders(callback: (order: Order) => void): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    try {
      const subscription = client.graphql({
        query: onCreateOrder
      }).subscribe({
        next: ({ data }) => {
          if (data?.onCreateOrder) {
            const order = this.transformAppSyncOrderToLocal(data.onCreateOrder);
            callback(order);
          }
        },
        error: (error) => {
          console.error('❌ Erro na subscription de pedidos:', error);
        }
      });

      this.subscriptions.push(subscription);

      return () => {
        subscription.unsubscribe();
        this.subscriptions = this.subscriptions.filter(sub => sub !== subscription);
      };
    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error);
      return () => {};
    }
  }

  // Subscrever a atualizações de pedidos
  subscribeToOrderUpdates(callback: (order: Order) => void): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    try {
      const subscription = client.graphql({
        query: onUpdateOrder
      }).subscribe({
        next: ({ data }) => {
          if (data?.onUpdateOrder) {
            const order = this.transformAppSyncOrderToLocal(data.onUpdateOrder);
            callback(order);
          }
        },
        error: (error) => {
          console.error('❌ Erro na subscription de atualizações:', error);
        }
      });

      this.subscriptions.push(subscription);

      return () => {
        subscription.unsubscribe();
        this.subscriptions = this.subscriptions.filter(sub => sub !== subscription);
      };
    } catch (error) {
      console.error('❌ Erro ao criar subscription de updates:', error);
      return () => {};
    }
  }

  // Limpar todas as subscriptions
  cleanup(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}

export const appSyncService = new AppSyncService();