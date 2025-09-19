// Printer Service for thermal printers
export class PrinterService {
  private printerIP: string;
  private printerPort: number;

  constructor(ip?: string, port?: number) {
    this.printerIP = ip || import.meta.env.VITE_PRINTER_IP || '192.168.1.100';
    this.printerPort = port || parseInt(import.meta.env.VITE_PRINTER_PORT) || 9100;
  }

  // ESC/POS commands
  private commands = {
    INIT: '\x1B\x40',
    FEED_LINE: '\x0A',
    CUT: '\x1D\x56\x00',
    ALIGN_CENTER: '\x1B\x61\x01',
    ALIGN_LEFT: '\x1B\x61\x00',
    ALIGN_RIGHT: '\x1B\x61\x02',
    BOLD_ON: '\x1B\x45\x01',
    BOLD_OFF: '\x1B\x45\x00',
    DOUBLE_HEIGHT: '\x1B\x21\x10',
    NORMAL_SIZE: '\x1B\x21\x00',
    UNDERLINE_ON: '\x1B\x2D\x01',
    UNDERLINE_OFF: '\x1B\x2D\x00'
  };

  async printReceipt(order: any) {
    try {
      let receipt = this.commands.INIT;
      
      // Header
      receipt += this.commands.ALIGN_CENTER;
      receipt += this.commands.DOUBLE_HEIGHT;
      receipt += this.commands.BOLD_ON;
      receipt += 'RESTAURANTE POS\n';
      receipt += this.commands.NORMAL_SIZE;
      receipt += this.commands.BOLD_OFF;
      receipt += 'Rua Exemplo, 123\n';
      receipt += 'Tel: (11) 99999-9999\n';
      receipt += this.commands.FEED_LINE;
      
      // Order info
      receipt += this.commands.ALIGN_LEFT;
      receipt += `Pedido: #${order.order_number}\n`;
      receipt += `Data: ${new Date(order.created_at).toLocaleString('pt-BR')}\n`;
      if (order.customer_name) {
        receipt += `Cliente: ${order.customer_name}\n`;
      }
      if (order.table_id) {
        receipt += `Mesa: ${order.tables?.number}\n`;
      }
      receipt += this.commands.FEED_LINE;
      
      // Items
      receipt += this.commands.BOLD_ON;
      receipt += 'ITENS:\n';
      receipt += this.commands.BOLD_OFF;
      receipt += '--------------------------------\n';
      
      order.order_items?.forEach((item: any) => {
        const itemTotal = (item.unit_price * item.quantity).toFixed(2);
        receipt += `${item.quantity}x ${item.products.name}\n`;
        receipt += `   R$ ${item.unit_price.toFixed(2)} = R$ ${itemTotal}\n`;
        if (item.notes) {
          receipt += `   Obs: ${item.notes}\n`;
        }
      });
      
      receipt += '--------------------------------\n';
      receipt += this.commands.BOLD_ON;
      receipt += `TOTAL: R$ ${order.total.toFixed(2)}\n`;
      receipt += this.commands.BOLD_OFF;
      receipt += this.commands.FEED_LINE;
      
      // Footer
      receipt += this.commands.ALIGN_CENTER;
      receipt += 'Obrigado pela preferencia!\n';
      receipt += this.commands.FEED_LINE;
      receipt += this.commands.CUT;

      // Send to printer (in a real environment, this would use a printer API)
      await this.sendToPrinter(receipt);
      
      return true;
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      throw error;
    }
  }

  async printKitchenOrder(order: any) {
    try {
      let ticket = this.commands.INIT;
      
      // Header
      ticket += this.commands.ALIGN_CENTER;
      ticket += this.commands.DOUBLE_HEIGHT;
      ticket += this.commands.BOLD_ON;
      ticket += 'COZINHA\n';
      ticket += this.commands.NORMAL_SIZE;
      ticket += this.commands.BOLD_OFF;
      ticket += this.commands.FEED_LINE;
      
      // Order info
      ticket += this.commands.ALIGN_LEFT;
      ticket += this.commands.BOLD_ON;
      ticket += `PEDIDO #${order.order_number}\n`;
      ticket += this.commands.BOLD_OFF;
      ticket += `${new Date(order.created_at).toLocaleTimeString('pt-BR')}\n`;
      
      if (order.table_id) {
        ticket += `MESA: ${order.tables?.number}\n`;
      } else {
        ticket += `${order.order_type.toUpperCase()}\n`;
      }
      
      if (order.customer_name) {
        ticket += `Cliente: ${order.customer_name}\n`;
      }
      ticket += this.commands.FEED_LINE;
      
      // Items
      ticket += this.commands.BOLD_ON;
      ticket += 'ITENS:\n';
      ticket += this.commands.BOLD_OFF;
      ticket += '--------------------------------\n';
      
      order.order_items?.forEach((item: any) => {
        ticket += this.commands.BOLD_ON;
        ticket += `${item.quantity}x ${item.products.name}\n`;
        ticket += this.commands.BOLD_OFF;
        if (item.notes) {
          ticket += `OBS: ${item.notes}\n`;
        }
        ticket += this.commands.FEED_LINE;
      });
      
      ticket += '--------------------------------\n';
      ticket += this.commands.ALIGN_CENTER;
      ticket += `Tempo estimado: ${this.calculatePrepTime(order)} min\n`;
      ticket += this.commands.FEED_LINE;
      ticket += this.commands.CUT;

      await this.sendToPrinter(ticket, 'kitchen');
      
      return true;
    } catch (error) {
      console.error('Erro ao imprimir pedido da cozinha:', error);
      throw error;
    }
  }

  private calculatePrepTime(order: any): number {
    let maxTime = 0;
    order.order_items?.forEach((item: any) => {
      const itemTime = item.products.preparation_time || 15;
      if (itemTime > maxTime) {
        maxTime = itemTime;
      }
    });
    return maxTime;
  }

  private async sendToPrinter(data: string, type: 'receipt' | 'kitchen' = 'receipt') {
    // In a real environment, this would connect to the printer
    // For now, we'll simulate the printing process
    console.log(`Enviando para impressora ${type}:`, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would use:
    // - TCP socket connection for network printers
    // - USB/Serial connection for local printers
    // - Print server API
    
    return true;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test printer connection
      console.log(`Testando conexão com impressora em ${this.printerIP}:${this.printerPort}`);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Erro ao conectar com a impressora:', error);
      return false;
    }
  }
}

export const printerService = new PrinterService();