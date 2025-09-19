import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, Building, Users, Package } from 'lucide-react'

interface CostResult {
  monthly: number
  annual: number
  breakdown: {
    infrastructure: number
    transactions: number
    integrations: number
  }
}

export const CostCalculator: React.FC = () => {
  const [plan, setPlan] = useState<'basic' | 'professional' | 'enterprise'>('professional')
  const [monthlyOrders, setMonthlyOrders] = useState(3000)
  const [paymentMethods, setPaymentMethods] = useState({
    pix: 40,
    credit: 35,
    debit: 15,
    cash: 10
  })
  const [integrations, setIntegrations] = useState<string[]>(['ifood'])
  const [result, setResult] = useState<CostResult | null>(null)

  const calculateCosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/calculate-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          monthlyOrders,
          paymentMethods,
          integrations
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erro ao calcular custos:', error)
    }
  }

  useEffect(() => {
    calculateCosts()
  }, [plan, monthlyOrders, paymentMethods, integrations])

  const plans = {
    basic: { name: 'Básico', users: 5, orders: 1000, price: 29.99 },
    professional: { name: 'Profissional', users: 15, orders: 5000, price: 79.99 },
    enterprise: { name: 'Empresarial', users: 50, orders: 20000, price: 199.99 }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Calculator className="mr-3 text-blue-600" />
          Calculadora de Custos PDV
        </h1>
        <p className="text-gray-600">Calcule o investimento necessário para seu restaurante</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações */}
        <div className="space-y-6">
          {/* Plano */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building className="mr-2 text-blue-600" size={20} />
              Plano de Assinatura
            </h3>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, planData]) => (
                <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={plan === key}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{planData.name}</div>
                    <div className="text-sm text-gray-600">
                      {planData.users} usuários • {planData.orders.toLocaleString()} pedidos/mês
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    R$ {planData.price.toFixed(2)}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Volume de Pedidos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2 text-blue-600" size={20} />
              Volume Mensal
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Pedidos por mês: {monthlyOrders.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>50.000</span>
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2 text-blue-600" size={20} />
              Distribuição de Pagamentos (%)
            </h3>
            <div className="space-y-3">
              {Object.entries(paymentMethods).map(([method, percentage]) => (
                <div key={method}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {method === 'pix' ? 'PIX' : 
                     method === 'credit' ? 'Cartão Crédito' :
                     method === 'debit' ? 'Cartão Débito' : 'Dinheiro'}: {percentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      [method]: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Integrações */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Integrações Desejadas</h3>
            <div className="space-y-2">
              {['ifood', 'ubereats', 'nfe'].map(integration => (
                <label key={integration} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integrations.includes(integration)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIntegrations(prev => [...prev, integration])
                      } else {
                        setIntegrations(prev => prev.filter(i => i !== integration))
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="capitalize">
                    {integration === 'ifood' ? 'iFood' :
                     integration === 'ubereats' ? 'Uber Eats' : 'NFe Automática'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Resumo de Custos */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TrendingUp className="mr-2" />
                  Investimento Total
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-90">Custo Mensal</div>
                    <div className="text-2xl font-bold">R$ {result.monthly.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Custo Anual (10% desc.)</div>
                    <div className="text-2xl font-bold">R$ {result.annual.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Detalhamento de Custos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Infraestrutura (Plano {plans[plan].name})</span>
                    <span className="font-semibold">R$ {result.breakdown.infrastructure.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Transações ({monthlyOrders.toLocaleString()} pedidos)</span>
                    <span className="font-semibold">R$ {result.breakdown.transactions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Integrações ({integrations.length} ativas)</span>
                    <span className="font-semibold">R$ {result.breakdown.integrations.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Análise de ROI</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Receita estimada (ticket médio R$ 35)</span>
                    <span className="font-semibold text-green-600">
                      R$ {(monthlyOrders * 35).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>% da receita gasto com sistema</span>
                    <span className="font-semibold">
                      {((result.monthly / (monthlyOrders * 35)) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Economia vs sistemas tradicionais</span>
                    <span className="font-semibold text-green-600">R$ 300-500/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback estimado</span>
                    <span className="font-semibold">2-3 meses</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}