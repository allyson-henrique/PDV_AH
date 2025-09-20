import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Star } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface AnalyticsData {
  sales: Array<{ date: string; revenue: number; orders: number }>
  products: Array<{ name: string; quantity: number; revenue: number }>
  hours: Array<{ hour: number; orders: number }>
  paymentMethods: Array<{ method: string; value: number; color: string }>
  customerSatisfaction: number
  averageOrderValue: number
  peakHours: string
  topProduct: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const AdvancedAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState(7)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders'>('revenue')

  // Mock data - in real app, this would come from API
  const analyticsData: AnalyticsData = useMemo(() => {
    const sales = Array.from({ length: dateRange }, (_, i) => {
      const date = format(subDays(new Date(), dateRange - 1 - i), 'dd/MM')
      return {
        date,
        revenue: Math.random() * 2000 + 500,
        orders: Math.floor(Math.random() * 50 + 10)
      }
    })

    const products = [
      { name: 'Hambúrguer Clássico', quantity: 45, revenue: 1350 },
      { name: 'Pizza Margherita', quantity: 32, revenue: 960 },
      { name: 'Sanduíche Natural', quantity: 28, revenue: 420 },
      { name: 'Açaí 500ml', quantity: 25, revenue: 375 },
      { name: 'Combo Executivo', quantity: 22, revenue: 660 }
    ]

    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: i >= 11 && i <= 14 ? Math.random() * 20 + 10 : 
              i >= 18 && i <= 21 ? Math.random() * 25 + 15 : 
              Math.random() * 5 + 1
    }))

    const paymentMethods = [
      { method: 'PIX', value: 45, color: COLORS[0] },
      { method: 'Cartão Crédito', value: 30, color: COLORS[1] },
      { method: 'Cartão Débito', value: 15, color: COLORS[2] },
      { method: 'Dinheiro', value: 10, color: COLORS[3] }
    ]

    return {
      sales,
      products,
      hours,
      paymentMethods,
      customerSatisfaction: 4.7,
      averageOrderValue: 32.50,
      peakHours: '12:00 - 14:00',
      topProduct: 'Hambúrguer Clássico'
    }
  }, [dateRange])

  const totalRevenue = analyticsData.sales.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = analyticsData.sales.reduce((sum, day) => sum + day.orders, 0)
  const revenueGrowth = analyticsData.sales.length > 1 ? 
    ((analyticsData.sales[analyticsData.sales.length - 1].revenue - analyticsData.sales[0].revenue) / analyticsData.sales[0].revenue) * 100 : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Avançado</h1>
        <div className="flex space-x-2">
          {[7, 15, 30].map(days => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-2 rounded-lg ${
                dateRange === days ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className={`p-3 rounded-full ${revenueGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {revenueGrowth >= 0 ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />}
            </div>
          </div>
          <p className={`text-sm mt-2 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs período anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pedidos</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Média: {(totalOrders / dateRange).toFixed(1)} pedidos/dia
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold">R$ {analyticsData.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Horário pico: {analyticsData.peakHours}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfação</p>
              <p className="text-2xl font-bold">{analyticsData.customerSatisfaction}/5</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Star className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Produto top: {analyticsData.topProduct}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Vendas por Período</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 rounded ${
                  selectedMetric === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Receita
              </button>
              <button
                onClick={() => setSelectedMetric('orders')}
                className={`px-3 py-1 rounded ${
                  selectedMetric === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Pedidos
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Métodos de Pagamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, value }) => `${method}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Pedidos por Horário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.hours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
              <YAxis />
              <Tooltip labelFormatter={(hour) => `${hour}:00`} />
              <Bar dataKey="orders" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}