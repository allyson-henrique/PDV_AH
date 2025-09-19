import { useCallback } from 'react';
import { useCart } from './useCart';
import { useOffline } from './useOffline';
import { CartItem, PaymentInfo } from '../types';

export const useCartOffline = () => {
  const cart = useCart();
  const { isOnline, saveOfflineOrder } = useOffline();

  const checkoutOffline = useCallback(async (
    paymentInfo: PaymentInfo,
    customerInfo?: any
  ) => {
    try {
      if (isOnline) {
        // Se estiver online, usar o fluxo normal
        return cart;
      } else {
        // Se estiver offline, salvar localmente
        const orderId = await saveOfflineOrder(cart.items, paymentInfo, customerInfo);
        
        // Limpar carrinho após salvar offline
        cart.clearCart();
        
        return {
          ...cart,
          orderId,
          offline: true
        };
      }
    } catch (error) {
      console.error('Erro no checkout offline:', error);
      throw error;
    }
  }, [cart, isOnline, saveOfflineOrder]);

  return {
    ...cart,
    checkoutOffline,
    isOfflineMode: !isOnline
  };
};