import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, offlineStats, syncNow } = useOffline();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border-2 transition-all duration-300
        ${isOnline 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
        }
      `}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>

        {!isOnline && offlineStats.unsyncedOrders > 0 && (
          <>
            <div className="w-px h-4 bg-red-300" />
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs">
                {offlineStats.unsyncedOrders} pendente{offlineStats.unsyncedOrders !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )}

        {isOnline && offlineStats.unsyncedOrders > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-1 px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-xs transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        )}
      </div>

      {/* Detalhes offline (expandido) */}
      {!isOnline && offlineStats.totalOrders > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Dados Offline</h4>
          
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total de pedidos:</span>
              <span className="font-medium">{offlineStats.totalOrders}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Não sincronizados:</span>
              <span className="font-medium text-red-600">{offlineStats.unsyncedOrders}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Valor total:</span>
              <span className="font-medium">R$ {offlineStats.totalValue.toFixed(2)}</span>
            </div>
            
            {offlineStats.lastSync && (
              <div className="flex justify-between">
                <span>Última sync:</span>
                <span className="font-medium">
                  {new Date(offlineStats.lastSync).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <CheckCircle className="h-3 w-3" />
              <span>Dados salvos localmente</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};