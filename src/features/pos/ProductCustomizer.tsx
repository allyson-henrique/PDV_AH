import React, { useState, useMemo } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ingredient {
  id: string
  name: string
  price: number
  category: 'base' | 'protein' | 'vegetables' | 'sauces' | 'extras'
  maxQuantity?: number
  required?: boolean
}

interface ProductCustomizerProps {
  product: {
    id: string
    name: string
    basePrice: number
    ingredients: Ingredient[]
  }
  onCustomize: (customization: any) => void
  onClose: () => void
}

const CATEGORIES = {
  base: { name: 'Base', icon: '🍞', required: true },
  protein: { name: 'Proteína', icon: '🥩', required: true },
  vegetables: { name: 'Vegetais', icon: '🥬', required: false },
  sauces: { name: 'Molhos', icon: '🥫', required: false },
  extras: { name: 'Extras', icon: '✨', required: false }
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  product,
  onCustomize,
  onClose
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, number>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const categorizedIngredients = useMemo(() => {
    return product.ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) acc[ingredient.category] = []
      acc[ingredient.category].push(ingredient)
      return acc
    }, {} as Record<string, Ingredient[]>)
  }, [product.ingredients])

  const steps = Object.keys(CATEGORIES).filter(cat => categorizedIngredients[cat])

  const totalPrice = useMemo(() => {
    return product.basePrice + Object.entries(selectedIngredients).reduce((sum, [id, qty]) => {
      const ingredient = product.ingredients.find(i => i.id === id)
      return sum + (ingredient?.price || 0) * qty
    }, 0)
  }, [selectedIngredients, product])

  const updateIngredient = (ingredientId: string, quantity: number) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [ingredientId]: Math.max(0, quantity)
    }))
  }

  const canProceed = () => {
    const currentCategory = steps[currentStep]
    const categoryIngredients = categorizedIngredients[currentCategory]
    
    if (CATEGORIES[currentCategory as keyof typeof CATEGORIES].required) {
      return categoryIngredients.some(ing => selectedIngredients[ing.id] > 0)
    }
    return true
  }

  const handleFinish = () => {
    const customization = {
      productId: product.id,
      ingredients: selectedIngredients,
      totalPrice,
      customizationId: `custom-${Date.now()}`
    }
    onCustomize(customization)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-gray-600">Personalize seu pedido</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4 flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              {steps[currentStep] && (
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">
                      {CATEGORIES[steps[currentStep] as keyof typeof CATEGORIES].icon}
                    </span>
                    <h3 className="text-xl font-semibold">
                      {CATEGORIES[steps[currentStep] as keyof typeof CATEGORIES].name}
                    </h3>
                    {CATEGORIES[steps[currentStep] as keyof typeof CATEGORIES].required && (
                      <span className="ml-2 text-red-500 text-sm">*obrigatório</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {categorizedIngredients[steps[currentStep]]?.map(ingredient => (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{ingredient.name}</h4>
                          <p className="text-sm text-gray-600">
                            +R$ {ingredient.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateIngredient(ingredient.id, (selectedIngredients[ingredient.id] || 0) - 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            disabled={!selectedIngredients[ingredient.id]}
                          >
                            <Minus size={16} />
                          </button>
                          
                          <span className="w-8 text-center">
                            {selectedIngredients[ingredient.id] || 0}
                          </span>
                          
                          <button
                            onClick={() => updateIngredient(ingredient.id, (selectedIngredients[ingredient.id] || 0) + 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            disabled={selectedIngredients[ingredient.id] >= (ingredient.maxQuantity || 10)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">
              Total: R$ {totalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Voltar
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Check size={16} className="mr-2" />
                Adicionar ao Pedido
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}