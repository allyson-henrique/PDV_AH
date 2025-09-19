import axios from 'axios';

// Payment service for integrating with payment providers
export class PaymentService {
  private mercadoPagoPublicKey: string;
  private pagSeguroPublicKey: string;

  constructor() {
    this.mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';
    this.pagSeguroPublicKey = import.meta.env.VITE_PAGSEGURO_PUBLIC_KEY || '';
  }

  // PIX Payment
  async generatePixPayment(amount: number, description: string, orderId: string) {
    try {
      // Generate PIX code (simplified version)
      const pixCode = this.generatePixCode(amount, description, orderId);
      
      return {
        pixCode,
        qrCode: await this.generateQRCode(pixCode),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      };
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      throw error;
    }
  }

  // Card Payment (Mercado Pago)
  async processCardPayment(cardData: any, amount: number, orderId: string) {
    try {
      // In production, this would integrate with Mercado Pago API
      const response = await axios.post('/api/payments/card', {
        token: cardData.token,
        amount,
        orderId,
        installments: cardData.installments || 1
      });

      return response.data;
    } catch (error) {
      console.error('Erro no pagamento com cartão:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId: string) {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/status`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }

  private generatePixCode(amount: number, description: string, orderId: string): string {
    // Simplified PIX code generation
    // In production, use proper PIX libraries
    const timestamp = Date.now();
    const merchantKey = '12345678901234567890123456789012';
    
    return `00020126580014br.gov.bcb.pix0136${merchantKey}520400005303986540${amount.toFixed(2)}5802BR6009Sao Paulo62070503${orderId}6304${timestamp.toString().slice(-4)}`;
  }

  private async generateQRCode(pixCode: string): Promise<string> {
    try {
      // In production, use a proper QR code library
      const QRCode = await import('qrcode');
      return await QRCode.toDataURL(pixCode);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return '';
    }
  }

  // Validate card data
  validateCardData(cardData: any): boolean {
    const { number, expiry, cvv, name } = cardData;
    
    if (!number || number.length < 13 || number.length > 19) {
      return false;
    }
    
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return false;
    }
    
    if (!name || name.trim().length < 2) {
      return false;
    }
    
    return true;
  }

  // Format card number
  formatCardNumber(number: string): string {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  // Get card brand
  getCardBrand(number: string): string {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';
    
    return 'unknown';
  }
}

export const paymentService = new PaymentService();