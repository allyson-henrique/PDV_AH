import { Order, CartItem, PaymentInfo, Product } from '../types';
import { appSyncService } from './appSyncService';

export class OfflineManager {
  private db: IDBDatabase | null = null;
  private syncQueue: Array<{ type: string; data: any; timestamp: number }> = [];

  constructor() {
    this.initDB();
    this.setupOnlineListener();
  }

  // Inicializar IndexedDB
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PDV_OFFLINE_DB', 3);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para pedidos offline
        if (!db.objectStoreNames.contains('offline_orders')) {
          const ordersStore = db.createObjectStore('offline_orders', { keyPath: 'id' });
          ordersStore.createIndex('timestamp', 'timestamp');
          ordersStore.createIndex('synced', 'synced');
        }

        // Store para produtos (cache)
        if (!db.objectStoreNames.contains('products_cache')) {
          const productsStore = db.createObjectStore('products_cache', { keyPath: 'id' });
          productsStore.createIndex('lastUpdated', 'lastUpdated');
        }

        // Store para configurações
        if (!db.objectStoreNames.contains('app_settings')) {
          db.createObjectStore('app_settings', { keyPath: 'key' });
        }

        // Store para fila de sincronização
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type');
          syncStore.createIndex('timestamp', 'timestamp');
        }

        // Store para status de sincronização
        if (!db.objectStoreNames.contains('sync_status')) {
          db.createObjectStore('sync_status', { keyPath: 'id' });
        }
      };
    });
  }

  // Verificar se está online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Salvar pedido offline
  async saveOfflineOrder(
    items: CartItem[],
    paymentInfo: PaymentInfo,
    customerInfo?: any
  ): Promise<string> {
    if (!this.db) await this.initDB();

    const orderId = `OFFLINE-${Date.now()}`;
    const order = {
      id: orderId,
      items,
      total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      paymentInfo,
      customerInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      synced: false,
      offline: true,
      syncAttempts: 0,
      lastSyncAttempt: null
    };

    const tx = this.db!.transaction(['offline_orders'], 'readwrite');
    const store = tx.objectStore('offline_orders');
    await store.add(order);

    console.log('💾 Pedido salvo offline:', orderId);

    // Tentar sincronizar imediatamente se online
    if (this.isOnline() && appSyncService.isConfigured()) {
      setTimeout(() => this.syncOfflineData(), 1000);
    }

    return orderId;
  }

  // Buscar pedidos offline
  async getOfflineOrders(): Promise<any[]> {
    if (!this.db) await this.initDB();

    const tx = this.db!.transaction(['offline_orders'], 'readonly');
    const store = tx.objectStore('offline_orders');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Cache de produtos
  async cacheProducts(products: Product[]): Promise<void> {
    if (!this.db) await this.initDB();

    const tx = this.db!.transaction(['products_cache'], 'readwrite');
    const store = tx.objectStore('products_cache');

    for (const product of products) {
      await store.put({
        ...product,
        lastUpdated: new Date().toISOString()
      });
    }
  }

  // Buscar produtos do cache
  async getCachedProducts(): Promise<Product[]> {
    if (!this.db) await this.initDB();

    const tx = this.db!.transaction(['products_cache'], 'readonly');
    const store = tx.objectStore('products_cache');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const products = request.result.map(item => {
          const { lastUpdated, ...product } = item;
          return product;
        });
        resolve(products);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Sincronizar dados offline com AppSync
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline() || !this.db || !appSyncService.isConfigured()) {
      console.log('⚠️ Não é possível sincronizar: offline ou AppSync não configurado');
      return;
    }

    console.log('🔄 Iniciando sincronização com AppSync...');

    try {
      const orders = await this.getOfflineOrders();
      const unsyncedOrders = orders.filter(order => !order.synced);

      console.log(`📊 Encontrados ${unsyncedOrders.length} pedidos para sincronizar`);

      for (const order of unsyncedOrders) {
        try {
          console.log(`🔄 Sincronizando pedido: ${order.id}`);
          
          // Incrementar tentativas de sincronização
          await this.updateOrderSyncAttempt(order.id);

          // Criar pedido no AppSync
          const appSyncOrderId = await appSyncService.createOrder(
            order.items,
            order.paymentInfo,
            order.customerInfo
          );

          // Marcar como sincronizado
          await this.markOrderAsSynced(order.id, appSyncOrderId);
          
          console.log(`✅ Pedido ${order.id} sincronizado com sucesso como ${appSyncOrderId}`);
        } catch (error) {
          console.error(`❌ Erro ao sincronizar pedido ${order.id}:`, error);
          
          // Se falhou muitas vezes, marcar como erro
          if (order.syncAttempts >= 3) {
            await this.markOrderAsSyncError(order.id, error);
          }
        }
      }

      console.log('✅ Sincronização concluída');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    }
  }

  // Atualizar tentativa de sincronização
  private async updateOrderSyncAttempt(orderId: string): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(['offline_orders'], 'readwrite');
    const store = tx.objectStore('offline_orders');
    
    const order = await store.get(orderId);
    if (order) {
      order.syncAttempts = (order.syncAttempts || 0) + 1;
      order.lastSyncAttempt = new Date().toISOString();
      await store.put(order);
    }
  }

  // Marcar pedido como sincronizado
  private async markOrderAsSynced(orderId: string, appSyncOrderId: string): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(['offline_orders'], 'readwrite');
    const store = tx.objectStore('offline_orders');
    
    const order = await store.get(orderId);
    if (order) {
      order.synced = true;
      order.syncedAt = new Date().toISOString();
      order.appSyncOrderId = appSyncOrderId;
      order.syncError = null;
      await store.put(order);
    }
  }

  // Marcar pedido com erro de sincronização
  private async markOrderAsSyncError(orderId: string, error: any): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(['offline_orders'], 'readwrite');
    const store = tx.objectStore('offline_orders');
    
    const order = await store.get(orderId);
    if (order) {
      order.syncError = error.message || 'Erro desconhecido';
      order.lastSyncAttempt = new Date().toISOString();
      await store.put(order);
    }
  }

  // Configurar listener para mudanças de conectividade
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Conexão restaurada - iniciando sincronização');
      setTimeout(() => this.syncOfflineData(), 2000); // Aguardar 2s para estabilizar
    });

    window.addEventListener('offline', () => {
      console.log('📴 Modo offline ativado');
    });
  }

  // Limpar dados antigos
  async cleanupOldData(daysOld: number = 30): Promise<void> {
    if (!this.db) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTime = cutoffDate.getTime();

    const tx = this.db.transaction(['offline_orders'], 'readwrite');
    const store = tx.objectStore('offline_orders');
    const index = store.index('timestamp');

    const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        if (cursor.value.synced) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }

  // Obter estatísticas offline
  async getOfflineStats(): Promise<{
    totalOrders: number;
    unsyncedOrders: number;
    syncErrors: number;
    totalValue: number;
    lastSync: string | null;
  }> {
    const orders = await this.getOfflineOrders();
    const unsyncedOrders = orders.filter(order => !order.synced);
    const syncErrors = orders.filter(order => order.syncError);
    const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Buscar última sincronização
    const lastSyncOrder = orders
      .filter(order => order.syncedAt)
      .sort((a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime())[0];

    return {
      totalOrders: orders.length,
      unsyncedOrders: unsyncedOrders.length,
      syncErrors: syncErrors.length,
      totalValue,
      lastSync: lastSyncOrder?.syncedAt || null
    };
  }

  // Forçar sincronização manual
  async forceSyncNow(): Promise<boolean> {
    try {
      await this.syncOfflineData();
      return true;
    } catch (error) {
      console.error('❌ Erro na sincronização forçada:', error);
      return false;
    }
  }
}

export const offlineManager = new OfflineManager();