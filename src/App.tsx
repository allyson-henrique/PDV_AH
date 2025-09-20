import React, { useState, useEffect } from 'react';
// Layout components
import { Header, OfflineIndicator, PWAInstallPrompt, NotificationSystem } from './components/layout';

// Modal components
import { PaymentModal, TableOrderModal } from './components/modals';

// Page components
import { LoginView } from './pages/LoginView';

// Feature components
import { MenuView, CartView, TablesView, ProductCustomizer } from './features/pos';
import { KitchenView, TotemView } from './features/kitchen';
import { AdminView, BackofficeView } from './features/admin';
import { AdvancedAnalytics, CostCalculator, ArchitectureDiagram } from './features/analytics';
import { InventoryManager } from './features/inventory';
import { useCartOffline } from './hooks/useCartOffline';
import { useOrders } from './hooks/useOrders';
import { useTables } from './hooks/useTables';
import { useOffline } from './hooks/useOffline';
import { mockProducts } from './shared/constants';
import { offlineManager } from './services/offlineManager';
import { registerServiceWorker } from './shared/utils/pwaUtils';
import { View, PaymentInfo, Table, UserProfile } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('tables');
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTableOrderModal, setShowTableOrderModal] = useState(false);
  const [showBackoffice, setShowBackoffice] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ 
    name?: string; 
    phone?: string; 
    tableId?: string; 
    orderType: 'dine-in' | 'takeout' | 'delivery';
    guestCount?: number;
  }>();

  const cart = useCartOffline();
  const orders = useOrders();
  const tables = useTables();
  const { isOnline } = useOffline();

  // Inicializar PWA
  useEffect(() => {
    registerServiceWorker();
    
    // Cache inicial dos produtos
    offlineManager.cacheProducts(mockProducts);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    // Set default view based on role
    switch (profile.role) {
      case 'kitchen':
        setCurrentView('kitchen');
        break;
      case 'waiter':
        setCurrentView('tables');
        break;
      case 'cashier':
        setCurrentView('tables');
        break;
      default:
        setCurrentView('tables');
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setCurrentView('tables');
    setSelectedTable(null);
    setCustomerInfo(undefined);
    cart.clearCart();
  };

  const handleTableSelect = (table: Table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setShowTableOrderModal(true);
    } else if (table.status === 'occupied') {
      // Allow access to occupied tables to add more orders
      setSelectedTable(table);
      setCustomerInfo({
        tableId: table.id,
        orderType: 'dine-in',
        guestCount: 2 // Default, could be stored in table data
      });
      setCurrentView('menu');
    }
  };

  const handleOpenTable = (table: Table, guestCount: number, customerName?: string) => {
    tables.occupyTable(table.id);
    setSelectedTable(table);
    setCustomerInfo({
      name: customerName,
      tableId: table.id,
      orderType: 'dine-in',
      guestCount
    });
    setShowTableOrderModal(false);
    setCurrentView('menu');
  };

  const handleAddToCart = (product: any) => {
    // Check if product is customizable
    if (product.customizable) {
      setCustomizerProduct(product);
      setShowCustomizer(true);
    } else {
      cart.addItem(product);
    }
  };

  const handleCustomizeProduct = (customization: any) => {
    const customizedProduct = {
      ...customizerProduct,
      customization,
      price: customization.totalPrice,
      name: `${customizerProduct.name} (Personalizado)`
    };
    cart.addItem(customizedProduct);
    setShowCustomizer(false);
    setCustomizerProduct(null);
  };

  const handleCheckout = (info?: { 
    name?: string; 
    phone?: string; 
    tableId?: string; 
    orderType: 'dine-in' | 'takeout' | 'delivery';
    guestCount?: number;
  }) => {
    setCustomerInfo(info || customerInfo);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentInfo: PaymentInfo) => {
    try {
      if (isOnline) {
        // Fluxo online normal
        const order = orders.createOrder(cart.items, paymentInfo, customerInfo);
        
        // If it's a dine-in order, link to table
        if (customerInfo?.tableId && customerInfo.orderType === 'dine-in') {
          tables.linkOrderToTable(customerInfo.tableId, order.id);
        }
        
        cart.clearCart();
        setShowPaymentModal(false);
        
        // Auto-switch to kitchen view for new orders
        if (currentView === 'cart') {
          setCurrentView('kitchen');
        }
        
        // Show success notification
        setTimeout(() => {
          alert(`Pedido #${order.id.split('-')[1]} criado com sucesso!`);
        }, 100);
      } else {
        // Fluxo offline
        const orderId = await cart.checkoutOffline(paymentInfo, customerInfo);
        
        setShowPaymentModal(false);
        
        // Show offline success notification
        setTimeout(() => {
          alert(`Pedido salvo offline! Será sincronizado quando a conexão for restaurada.`);
        }, 100);
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleCloseTable = (tableId: string) => {
    tables.freeTable(tableId);
    setSelectedTable(null);
    setCustomerInfo(undefined);
    setCurrentView('tables');
  };

  const handleViewChange = (view: View) => {
    // Check permissions based on user role
    if (userProfile) {
      const allowedViews: { [key: string]: View[] } = {
        admin: ['tables', 'menu', 'cart', 'kitchen', 'totem', 'admin'],
        manager: ['tables', 'menu', 'cart', 'kitchen', 'totem', 'admin'],
        cashier: ['tables', 'menu', 'cart'],
        waiter: ['tables', 'menu', 'cart'],
        kitchen: ['kitchen']
      };

      if (allowedViews[userProfile.role]?.includes(view)) {
        setCurrentView(view);
      }
    } else {
      setCurrentView(view);
    }
  };

  // Show login if no user is authenticated
  if (!userProfile) {
    return (
      <>
        <LoginView onLogin={handleLogin} />
        <OfflineIndicator />
        <PWAInstallPrompt />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tables':
        return (
          <TablesView
            tables={tables.tables}
            sections={tables.sections}
            onTableSelect={handleTableSelect}
            onUpdateTableStatus={tables.updateTableStatus}
            onReserveTable={tables.reserveTable}
            onOccupyTable={tables.occupyTable}
            onFreeTable={tables.freeTable}
            onCleanTable={tables.cleanTable}
          />
        );

      case 'menu':
        return (
          <MenuView
            products={mockProducts}
            onAddToCart={handleAddToCart}
            currentTable={selectedTable}
            customerInfo={customerInfo}
            onCloseTable={handleCloseTable}
          />
        );
      
      case 'cart':
        return (
          <CartView
            items={cart.items}
            total={cart.total}
            tables={tables.tables}
            currentTable={selectedTable}
            customerInfo={customerInfo}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onCheckout={handleCheckout}
          />
        );
      
      case 'kitchen':
        return (
          <KitchenView
            orders={orders.orders}
            onUpdateOrderStatus={orders.updateOrderStatus}
          />
        );

      case 'totem':
        return (
          <TotemView
            orders={orders.orders}
            mode="customer"
          />
        );
      
      case 'admin':
        return (
          <AdminView
            orders={orders.orders}
            todaysRevenue={orders.getTodaysRevenue()}
            onOpenBackoffice={() => setShowBackoffice(true)}
          />
        );
      
      case 'analytics':
        return <AdvancedAnalytics />;
      
      case 'inventory':
        return <InventoryManager />;
      
      case 'costs':
        return <CostCalculator />;
      
      case 'architecture':
        return <ArchitectureDiagram />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        cartItemCount={cart.itemCount}
        currentTable={selectedTable}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      
      <NotificationSystem />
      
      <main>
        {renderCurrentView()}
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={cart.total}
        onPaymentComplete={handlePaymentComplete}
      />

      <TableOrderModal
        isOpen={showTableOrderModal}
        onClose={() => setShowTableOrderModal(false)}
        table={selectedTable}
        onOpenTable={handleOpenTable}
      />

      {showBackoffice && (
        <BackofficeView
          onClose={() => setShowBackoffice(false)}
        />
      )}

      {showCustomizer && customizerProduct && (
        <ProductCustomizer
          product={customizerProduct}
          onCustomize={handleCustomizeProduct}
          onClose={() => {
            setShowCustomizer(false);
            setCustomizerProduct(null);
          }}
        />
      )}

      {/* Componentes PWA */}
      <OfflineIndicator />
      <PWAInstallPrompt />
    </div>
  );
}

export default App;