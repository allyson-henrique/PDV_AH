import { useState, useEffect } from 'react';
import { offlineManager } from '../services/offlineManager';
import { appSyncService } from '../services/appSyncService';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineStats, setOfflineStats] = useState({
    totalOrders: 0,
    unsyncedOrders: 0,
    syncErrors: 0,
    totalValue: 0,
    lastSync: null as string | null
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Tentar sincronizar quando voltar online
      if (appSyncService.isConfigured()) {
        setTimeout(() => {
          offlineManager.syncOfflineData();
          loadOfflineStats();
        }, 2000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar estatísticas iniciais
    loadOfflineStats();

    // Atualizar estatísticas periodicamente
    const interval = setInterval(loadOfflineStats, 10000); // A cada 10 segundos

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadOfflineStats = async () => {
    try {
      const stats = await offlineManager.getOfflineStats();
      setOfflineStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas offline:', error);
    }
  };

  const syncNow = async () => {
    if (!appSyncService.isConfigured()) {
      console.warn('AppSync não está configurado');
      return false;
    }

    setIsSyncing(true);
    try {
      const success = await offlineManager.forceSyncNow();
      await loadOfflineStats();
      return success;
    } catch (error) {
      console.error('Erro na sincronização manual:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const saveOfflineOrder = async (items: any[], paymentInfo: any, customerInfo?: any) => {
    try {
      const orderId = await offlineManager.saveOfflineOrder(items, paymentInfo, customerInfo);
      await loadOfflineStats();
      return orderId;
    } catch (error) {
      console.error('Erro ao salvar pedido offline:', error);
      throw error;
    }
  };

  return {
    isOnline,
    offlineStats,
    isSyncing,
    syncNow,
    saveOfflineOrder,
    loadOfflineStats,
    isAppSyncConfigured: appSyncService.isConfigured()
  };
};