import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, Check } from 'lucide-react';
import { PaymentInfo } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentInfo: PaymentInfo) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onPaymentComplete
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'pix' | 'cash' | null>(null);
  const [cashAmount, setCashAmount] = useState('');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const paymentInfo: PaymentInfo = {
      method: selectedMethod,
      amount: total,
    };

    if (selectedMethod === 'cash') {
      const cashValue = parseFloat(cashAmount.replace(',', '.'));
      if (cashValue < total) {
        setIsProcessing(false);
        alert('Valor insuficiente!');
        return;
      }
      paymentInfo.change = cashValue - total;
    }

    if (selectedMethod === 'card') {
      paymentInfo.cardType = cardType;
    }

    if (selectedMethod === 'pix') {
      paymentInfo.pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}520400005303986540${total.toFixed(2)}5802BR6009Sao Paulo62070503***6304`;
    }

    setIsProcessing(false);
    setIsComplete(true);

    setTimeout(() => {
      onPaymentComplete(paymentInfo);
      onClose();
      setSelectedMethod(null);
      setCashAmount('');
      setIsComplete(false);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: 'card' as const,
      name: 'Cartão',
      icon: CreditCard,
      color: 'blue',
      description: 'Crédito ou Débito'
    },
    {
      id: 'pix' as const,
      name: 'PIX',
      icon: Smartphone,
      color: 'green',
      description: 'Pagamento instantâneo'
    },
    {
      id: 'cash' as const,
      name: 'Dinheiro',
      icon: Banknote,
      color: 'yellow',
      description: 'Pagamento em espécie'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isComplete ? (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pagamento Aprovado!</h3>
              <p className="text-gray-600">Pedido processado com sucesso</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {!selectedMethod ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">Escolha a forma de pagamento:</h3>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`
                          w-full p-4 rounded-lg border-2 hover:shadow-md transition-all duration-200 text-left
                          hover:border-${method.color}-300 hover:bg-${method.color}-50
                          border-gray-200
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-${method.color}-100`}>
                            <Icon className={`h-5 w-5 text-${method.color}-600`} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    ← Voltar aos métodos de pagamento
                  </button>

                  {selectedMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor recebido:
                      </label>
                      <input
                        type="text"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {cashAmount && parseFloat(cashAmount.replace(',', '.')) >= total && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-800">
                            Troco: R$ {(parseFloat(cashAmount.replace(',', '.')) - total).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMethod === 'card' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo do cartão:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setCardType('credit')}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            cardType === 'credit'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Crédito
                        </button>
                        <button
                          onClick={() => setCardType('debit')}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            cardType === 'debit'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Débito
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'pix' && (
                    <div className="text-center">
                      <div className="bg-gray-100 p-8 rounded-lg mb-4">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-gray-600">
                          Escaneie o QR Code ou copie o código PIX para efetuar o pagamento
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={
                      isProcessing ||
                      (selectedMethod === 'cash' && (!cashAmount || parseFloat(cashAmount.replace(',', '.')) < total))
                    }
                    className={`
                      w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                      ${isProcessing || (selectedMethod === 'cash' && (!cashAmount || parseFloat(cashAmount.replace(',', '.')) < total))
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};