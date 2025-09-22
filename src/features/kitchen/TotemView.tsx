import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertTriangle, Monitor } from 'lucide-react';
import { Order } from '../../types';

interface TotemViewProps {
  orders: Order[];
  mode: 'kitchen' | 'customer';
}

export const TotemView: React.FC<TotemViewProps> = ({ orders, mode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getRelevantOrders = () => {
    if (mode === 'kitchen') {
      return orders.filter(order => 
        ['pending', 'preparing'].includes(order.status)
      ).slice(0, 8);
    } else {
      return orders.filter(order => 
        order.status === 'ready' && 
        ['takeout', 'delivery'].includes(order.orderType)
      ).slice(0, 6);
    }
  };

  const relevantOrders = getRelevantOrders();

  const getOrderAge = (order: Order) => {
    const now = new Date();
    const diff = now.getTime() - order.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  const getStatusColor = (status: Order['status'], age: number) => {
    if (age > 30) return 'bg-red-500 text-white';
    if (age > 15) return 'bg-yellow-500 text-white';
    
    switch (status) {
      case 'pending': return 'bg-orange-500 text-white';
      case 'preparing': return 'bg-blue-500 text-white';
      case 'ready': return 'bg-green-500 text-white animate-pulse';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'NOVO PEDIDO';
      case 'preparing': return 'PREPARANDO';
      case 'ready': return 'PRONTO';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-500 p-3 rounded-lg">
            <Monitor className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              {mode === 'kitchen' ? 'COZINHA' : 'PEDIDOS PRONTOS'}
            </h1>
            <p className="text-gray-300">
              {mode === 'kitchen' ? 'Pedidos para preparar' : 'Retire seu pedido'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold">
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="text-gray-300">
            {currentTime.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {relevantOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <CheckCircle className="h-24 w-24 text-green-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-300 mb-2">
            {mode === 'kitchen' ? 'Nenhum pedido pendente' : 'Nenhum pedido pronto'}
          </h2>
          <p className="text-gray-400">
            {mode === 'kitchen' ? 'Todos os pedidos foram processados' : 'Aguarde seu pedido ficar pronto'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relevantOrders.map(order => {
            const age = getOrderAge(order);
            const isUrgent = age > 15;
            
            return (
              <div 
                key={order.id} 
                className={`
                  bg-gray-800 rounded-2xl p-6 border-4 transition-all duration-300
                  ${isUrgent ? 'border-red-500 animate-pulse' : 'border-gray-700'}
                  ${order.status === 'ready' ? 'ring-4 ring-green-400' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      #{order.id.split('-')[1]}
                    </h3>
                    <p className="text-gray-400">
                      {order.createdAt.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {order.customerName && (
                      <p className="text-gray-300 mt-1">
                        {order.customerName}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-bold
                      ${getStatusColor(order.status, age)}
                    `}>
                      {getStatusText(order.status)}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className={age > 15 ? 'text-red-400 font-bold' : ''}>
                        {age}min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-200">
                        {item.quantity}x {item.product.name}
                      </span>
                      {mode === 'kitchen' && (
                        <span className="text-gray-400">
                          {item.product.preparationTime}min
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">
                    {order.orderType === 'dine-in' ? `Mesa ${order.tableId}` : 
                     order.orderType === 'takeout' ? 'Retirada' : 'Delivery'}
                  </span>
                  
                  {isUrgent && (
                    <div className="flex items-center space-x-1 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-bold">URGENTE</span>
                    </div>
                  )}
                </div>

                {order.status === 'ready' && mode === 'customer' && (
                  <div className="mt-4 bg-green-500 text-white p-3 rounded-lg text-center animate-pulse">
                    <Bell className="h-6 w-6 mx-auto mb-1" />
                    <div className="font-bold">SEU PEDIDO ESTÁ PRONTO!</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Sistema Online</span>
        </div>
      </div>
    </div>
  );
};