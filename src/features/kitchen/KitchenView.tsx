import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface KitchenViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const activeOrders = orders.filter(order => 
    ['pending', 'preparing'].includes(order.status)
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Cozinha</h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
          <span className="text-sm text-gray-600">Pedidos ativos: </span>
          <span className="font-semibold text-orange-600">{activeOrders.length}</span>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido ativo</h3>
          <p className="text-gray-600">Todos os pedidos foram processados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id.split('-')[1]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.createdAt.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {order.customerName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Cliente: {order.customerName}
                      </p>
                    )}
                  </div>
                  
                  <span className={`
                    inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border
                    ${getStatusColor(order.status)}
                  `}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-gray-500">
                        {item.product.preparationTime}min
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Iniciar Preparo
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Marcar como Pronto
                    </button>
                  )}
                  
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};