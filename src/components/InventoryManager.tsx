import React, { useState, useMemo } from 'react'
import { AlertTriangle, Package, TrendingDown, Plus, Edit, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface InventoryItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  cost: number
  supplier: string
  lastRestocked: Date
  category: string
  expiryDate?: Date
  autoReorder: boolean
}

interface PredictionData {
  itemId: string
  predictedUsage: number
  daysUntilEmpty: number
  suggestedReorderQuantity: number
}

export const InventoryManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showLowStock, setShowLowStock] = useState(false)

  // Mock data
  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Carne Bovina (Hambúrguer)',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'kg',
      cost: 25.90,
      supplier: 'Frigorífico São Paulo',
      lastRestocked: new Date('2024-01-10'),
      category: 'Proteínas',
      expiryDate: new Date('2024-01-20'),
      autoReorder: true
    },
    {
      id: '2',
      name: 'Pão de Hambúrguer',
      currentStock: 50,
      minStock: 30,
      maxStock: 200,
      unit: 'unidades',
      cost: 0.80,
      supplier: 'Padaria Central',
      lastRestocked: new Date('2024-01-12'),
      category: 'Pães',
      autoReorder: true
    },
    {
      id: '3',
      name: 'Queijo Cheddar',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'kg',
      cost: 18.50,
      supplier: 'Laticínios Vale',
      lastRestocked: new Date('2024-01-08'),
      category: 'Laticínios',
      expiryDate: new Date('2024-01-25'),
      autoReorder: true
    },
    {
      id: '4',
      name: 'Batata Congelada',
      currentStock: 25,
      minStock: 20,
      maxStock: 80,
      unit: 'kg',
      cost: 8.90,
      supplier: 'Distribuidora Frozen',
      lastRestocked: new Date('2024-01-11'),
      category: 'Congelados',
      autoReorder: false
    }
  ]

  const predictions: PredictionData[] = [
    { itemId: '1', predictedUsage: 2.5, daysUntilEmpty: 6, suggestedReorderQuantity: 30 },
    { itemId: '2', predictedUsage: 8, daysUntilEmpty: 6, suggestedReorderQuantity: 100 },
    { itemId: '3', predictedUsage: 1.2, daysUntilEmpty: 7, suggestedReorderQuantity: 20 },
    { itemId: '4', predictedUsage: 3.5, daysUntilEmpty: 7, suggestedReorderQuantity: 40 }
  ]

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))]

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesLowStock = !showLowStock || item.currentStock <= item.minStock
      
      return matchesSearch && matchesCategory && matchesLowStock
    })
  }, [inventory, searchTerm, selectedCategory, showLowStock])

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock)
  const expiringItems = inventory.filter(item => 
    item.expiryDate && 
    (item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 3
  )

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    if (item.currentStock <= item.minStock) return { status: 'critical', color: 'bg-red-500' }
    if (percentage <= 30) return { status: 'low', color: 'bg-yellow-500' }
    if (percentage <= 70) return { status: 'medium', color: 'bg-blue-500' }
    return { status: 'good', color: 'bg-green-500' }
  }

  const getPrediction = (itemId: string) => {
    return predictions.find(p => p.itemId === itemId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" />
          Adicionar Item
        </button>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertTriangle className="text-red-600 mr-2" size={20} />
                <h3 className="font-semibold text-red-800">Estoque Baixo</h3>
              </div>
              <p className="text-red-700 mt-1">
                {lowStockItems.length} item(ns) com estoque abaixo do mínimo
              </p>
              <div className="mt-2 space-y-1">
                {lowStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-sm text-red-600">
                    • {item.name}: {item.currentStock} {item.unit}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {expiringItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertTriangle className="text-yellow-600 mr-2" size={20} />
                <h3 className="font-semibold text-yellow-800">Próximo ao Vencimento</h3>
              </div>
              <p className="text-yellow-700 mt-1">
                {expiringItems.length} item(ns) vencem em até 3 dias
              </p>
              <div className="mt-2 space-y-1">
                {expiringItems.map(item => (
                  <p key={item.id} className="text-sm text-yellow-600">
                    • {item.name}: {item.expiryDate?.toLocaleDateString()}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Todas as Categorias' : category}
            </option>
          ))}
        </select>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="mr-2"
          />
          Apenas estoque baixo
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previsão IA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item)
                const prediction = getPrediction(item.id)
                
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="text-gray-400 mr-3" size={20} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${stockStatus.color} mr-2`}></div>
                        <span className="text-sm capitalize">{stockStatus.status}</span>
                      </div>
                      {item.expiryDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Vence: {item.expiryDate.toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prediction && (
                        <div className="text-sm">
                          <div className="flex items-center text-orange-600">
                            <TrendingDown size={14} className="mr-1" />
                            {prediction.daysUntilEmpty} dias restantes
                          </div>
                          <div className="text-xs text-gray-500">
                            Sugestão: {prediction.suggestedReorderQuantity} {item.unit}
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.supplier}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        {item.currentStock <= item.minStock && (
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                            Repor
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}