import axios from 'axios';

// NFe service for electronic invoice generation
export class NFeService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_NFE_API_URL || '';
    this.apiKey = import.meta.env.VITE_NFE_API_KEY || '';
  }

  async generateNFe(order: any, company: any) {
    try {
      const nfeData = {
        natureza_operacao: 'Venda',
        serie: 1,
        numero: await this.getNextNumber(),
        data_emissao: new Date().toISOString(),
        tipo_documento: 1, // NFe
        finalidade_emissao: 1, // Normal
        consumidor_final: 1, // Sim
        presenca_comprador: 1, // Presencial
        
        // Company data
        emitente: {
          cnpj: company.cnpj,
          inscricao_estadual: company.inscricao_estadual,
          nome: company.name,
          fantasia: company.name,
          logradouro: company.address,
          numero: company.number,
          bairro: company.neighborhood,
          municipio: company.city,
          uf: company.state,
          cep: company.zipcode,
          telefone: company.phone
        },

        // Customer data (if available)
        destinatario: order.customer_name ? {
          nome: order.customer_name,
          telefone: order.customer_phone,
          email: order.customer_email
        } : null,

        // Items
        itens: order.order_items.map((item: any, index: number) => ({
          numero_item: index + 1,
          codigo_produto: item.products.id,
          descricao: item.products.name,
          ncm: '21069090', // Default NCM for food
          cfop: '5102', // Venda de mercadoria
          unidade_comercial: 'UN',
          quantidade_comercial: item.quantity,
          valor_unitario_comercial: item.unit_price,
          valor_total_bruto: item.total_price,
          
          // Taxes
          icms: {
            situacao_tributaria: '102', // Simples Nacional
            origem: 0
          },
          pis: {
            situacao_tributaria: '07' // Não tributado
          },
          cofins: {
            situacao_tributaria: '07' // Não tributado
          }
        })),

        // Payment
        pagamento: {
          formas_pagamento: [{
            meio_pagamento: this.getPaymentMethod(order.payments[0]?.payment_method),
            valor: order.total
          }]
        }
      };

      const response = await axios.post(`${this.apiUrl}/nfe`, nfeData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        nfeNumber: response.data.numero,
        nfeKey: response.data.chave,
        xml: response.data.xml,
        pdf: response.data.pdf,
        status: response.data.status
      };

    } catch (error) {
      console.error('Erro ao gerar NFe:', error);
      throw error;
    }
  }

  async checkNFeStatus(nfeKey: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/nfe/${nfeKey}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar status da NFe:', error);
      throw error;
    }
  }

  async cancelNFe(nfeKey: string, reason: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/nfe/${nfeKey}/cancel`, {
        justificativa: reason
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar NFe:', error);
      throw error;
    }
  }

  private async getNextNumber(): Promise<number> {
    // In production, this would get the next number from database
    return Math.floor(Math.random() * 1000000) + 1;
  }

  private getPaymentMethod(method: string): string {
    const paymentMethods: { [key: string]: string } = {
      'cash': '01', // Dinheiro
      'card': '03', // Cartão de Crédito
      'pix': '17', // PIX
      'voucher': '04' // Vale Refeição
    };

    return paymentMethods[method] || '99'; // Outros
  }

  // Validate CNPJ
  validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj.length !== 14) return false;
    
    // Validate check digits
    let sum = 0;
    let weight = 2;
    
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    if (parseInt(cnpj.charAt(12)) !== digit1) return false;
    
    sum = 0;
    weight = 2;
    
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return parseInt(cnpj.charAt(13)) === digit2;
  }

  // Format CNPJ
  formatCNPJ(cnpj: string): string {
    cnpj = cnpj.replace(/[^\d]/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

export const nfeService = new NFeService();