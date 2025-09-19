import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Clock, Settings, FileText, Printer, CreditCard } from 'lucide-react';
import { Order } from '../types';

interface AdminViewProps {
  orders: Order[];
  todaysRevenue: number;
  onOpenBackoffice: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, todaysRevenue, onOpenBackoffice }) => {
  const todaysOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const completedOrders = todaysOrders.filter(order => order.status === 'delivered');
  const averageOrderValue = todaysOrders.length > 0 ? todaysRevenue / todaysOrders.length : 0;
  
  const stats = [
    {
      name: 'Faturamento Hoje',
      value: `R$ ${todaysRevenue.toFixed(2).replace('.', ',')}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      name: 'Pedidos Hoje',
      value: todaysOrders.length.toString(),
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      name: 'Pedidos Concluídos',
      value: completedOrders.length.toString(),
      icon: Clock,
      color: 'purple'
    },
    {
      name: 'Ticket Médio',
      value: `R$ ${averageOrderValue.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentOrders = orders.slice(0, 10);

  const quickActions = [
    {
      name: 'Configurações',
      description: 'Gerenciar produtos, mesas e configurações',
      icon: Settings,
      color: 'blue',
      action: onOpenBackoffice
    },
    {
      name: 'Relatórios NFe',
      description: 'Visualizar e gerenciar notas fiscais',
      icon: FileText,
      color: 'green',
      action: () => console.log('NFe reports')
    },
    {
      name: 'Teste de Impressora',
      description: 'Testar conexão com impressoras',
      icon: Printer,
      color: 'purple',
      action: () => console.log('Test printer')
    },
    {
      name: 'Pagamentos',
      description: 'Configurar métodos de pagamento',
      icon: CreditCard,
      color: 'orange',
      action: () => console.log('Payment settings')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={onOpenBackoffice}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={action.action}
                className={`
                  bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:shadow-md transition-shadow
                  hover:border-${action.color}-200
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`bg-${action.color}-100 p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 text-${action.color}-600`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.name}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NFe
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.split('-')[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.customerName || 'Cliente Balcão'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {order.status === 'delivered' ? 'Entregue' :
                       order.status === 'ready' ? 'Pronto' :
                       order.status === 'preparing' ? 'Preparando' :
                       order.status === 'cancelled' ? 'Cancelado' :
                       'Pendente'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.createdAt.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.total > 50 ? (
                      <button className="text-orange-600 hover:text-orange-800 font-medium">
                        Gerar NFe
                      </button>
                    ) : (
                      <span className="text-gray-400">Não obrigatória</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};