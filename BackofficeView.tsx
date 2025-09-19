import React, { useState } from 'react';
import { 
  Settings, 
  Package, 
  CreditCard, 
  Grid3X3, 
  Users, 
  Truck, 
  FileText, 
  Printer,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface BackofficeViewProps {
  onClose: () => void;
}

export const BackofficeView: React.FC<BackofficeViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'tables', label: 'Mesas', icon: Grid3X3 },
    { id: 'suppliers', label: 'Fornecedores', icon: Truck },
    { id: 'integrations', label: 'Integrações', icon: Users },
    { id: 'nfe', label: 'NFe', icon: FileText },
    { id: 'printers', label: 'Impressoras', icon: Printer }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager />;
      case 'payments':
        return <PaymentMethodsManager />;
      case 'tables':
        return <TablesManager />;
      case 'suppliers':
        return <SuppliersManager />;
      case 'integrations':
        return <IntegrationsManager />;
      case 'nfe':
        return <NFeManager />;
      case 'printers':
        return <PrintersManager />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Backoffice</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Manager Component
const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Hambúrguer Clássico', price: 25.90, category: 'Hamburgers', available: true },
    { id: '2', name: 'Batata Frita', price: 12.90, category: 'Acompanhamentos', available: true }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${product.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {product.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowModal(true);
                    }}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Payment Methods Manager
const PaymentMethodsManager: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', name: 'Dinheiro', type: 'cash', active: true, fee: 0 },
    { id: '2', name: 'Cartão de Crédito', type: 'card', active: true, fee: 3.5 },
    { id: '3', name: 'PIX', type: 'pix', active: true, fee: 0 }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Métodos de Pagamento</h3>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Método</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(method => (
          <div key={method.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{method.name}</h4>
              <div className={`
                w-3 h-3 rounded-full
                ${method.active ? 'bg-green-400' : 'bg-red-400'}
              `} />
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div>Tipo: {method.type}</div>
              <div>Taxa: {method.fee}%</div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm">
                Editar
              </button>
              <button className={`
                flex-1 py-2 px-3 rounded text-sm font-medium
                ${method.active 
                  ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                }
              `}>
                {method.active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tables Manager
const TablesManager: React.FC = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Configuração de Mesas</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Configurações de mesas em desenvolvimento...</p>
      </div>
    </div>
  );
};

// Suppliers Manager
const SuppliersManager: React.FC = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Fornecedores</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Gerenciamento de fornecedores em desenvolvimento...</p>
      </div>
    </div>
  );
};

// Integrations Manager
const IntegrationsManager: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'iFood', type: 'delivery', active: false, status: 'Desconectado' },
    { id: '2', name: 'Uber Eats', type: 'delivery', active: false, status: 'Desconectado' },
    { id: '3', name: 'Mercado Pago', type: 'payment', active: false, status: 'Desconectado' }
  ]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Integrações</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{integration.name}</h4>
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${integration.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
                }
              `}>
                {integration.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              Tipo: {integration.type === 'delivery' ? 'Delivery' : 'Pagamento'}
            </div>
            
            <button className={`
              w-full py-2 px-4 rounded font-medium
              ${integration.active 
                ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              }
            `}>
              {integration.active ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// NFe Manager
const NFeManager: React.FC = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Configuração NFe</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificado Digital
            </label>
            <input
              type="file"
              accept=".p12,.pfx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha do Certificado
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ambiente
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="homologacao">Homologação</option>
              <option value="producao">Produção</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Série
            </label>
            <input
              type="number"
              defaultValue="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

// Printers Manager
const PrintersManager: React.FC = () => {
  const [printers, setPrinters] = useState([
    { id: '1', name: 'Impressora Cozinha', type: 'kitchen', ip: '192.168.1.100', status: 'Online' },
    { id: '2', name: 'Impressora Recibo', type: 'receipt', ip: '192.168.1.101', status: 'Offline' }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Impressoras</h3>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Impressora</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {printers.map(printer => (
          <div key={printer.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{printer.name}</h4>
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${printer.status === 'Online' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }
              `}>
                {printer.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>Tipo: {printer.type === 'kitchen' ? 'Cozinha' : 'Recibo'}</div>
              <div>IP: {printer.ip}</div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm">
                Testar
              </button>
              <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded text-sm">
                Configurar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};