import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCustomizer } from '../../components/ProductCustomizer'

const mockProduct = {
  id: 'test-product',
  name: 'Hambúrguer Teste',
  basePrice: 15.00,
  ingredients: [
    {
      id: 'bread-1',
      name: 'Pão Integral',
      price: 2.00,
      category: 'base' as const,
      required: true
    },
    {
      id: 'meat-1',
      name: 'Carne Bovina',
      price: 5.00,
      category: 'protein' as const,
      required: true
    },
    {
      id: 'lettuce-1',
      name: 'Alface',
      price: 1.00,
      category: 'vegetables' as const,
      maxQuantity: 3
    }
  ]
}

describe('ProductCustomizer', () => {
  const mockOnCustomize = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product name and base price', () => {
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Hambúrguer Teste')).toBeInTheDocument()
    expect(screen.getByText('Total: R$ 15.00')).toBeInTheDocument()
  })

  it('shows required categories first', () => {
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Base')).toBeInTheDocument()
    expect(screen.getByText('*obrigatório')).toBeInTheDocument()
  })

  it('updates price when ingredients are added', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    // Add bread ingredient
    const addButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Total: R$ 17.00')).toBeInTheDocument()
    })
  })

  it('prevents proceeding without required ingredients', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    const nextButton = screen.getByText('Próximo')
    expect(nextButton).toBeDisabled()
  })

  it('allows proceeding with required ingredients selected', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    // Add required bread ingredient
    const addButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addButton)

    const nextButton = screen.getByText('Próximo')
    expect(nextButton).not.toBeDisabled()
  })

  it('respects maximum quantity limits', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    // Navigate to vegetables step
    const addBreadButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addBreadButton)
    
    const nextButton = screen.getByText('Próximo')
    await user.click(nextButton)

    // Add protein
    const addMeatButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addMeatButton)
    await user.click(nextButton)

    // Try to add vegetables beyond limit
    const addVegetableButton = screen.getAllByRole('button', { name: /\+/ })[0]
    
    // Add 3 times (max quantity)
    await user.click(addVegetableButton)
    await user.click(addVegetableButton)
    await user.click(addVegetableButton)

    // Button should be disabled now
    expect(addVegetableButton).toBeDisabled()
  })

  it('calls onCustomize with correct data when finished', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    // Add required ingredients and finish
    const addBreadButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addBreadButton)
    
    let nextButton = screen.getByText('Próximo')
    await user.click(nextButton)

    const addMeatButton = screen.getAllByRole('button', { name: /\+/ })[0]
    await user.click(addMeatButton)
    
    nextButton = screen.getByText('Próximo')
    await user.click(nextButton)

    const finishButton = screen.getByText('Adicionar ao Pedido')
    await user.click(finishButton)

    expect(mockOnCustomize).toHaveBeenCalledWith({
      productId: 'test-product',
      ingredients: {
        'bread-1': 1,
        'meat-1': 1
      },
      totalPrice: 22.00,
      customizationId: expect.stringMatching(/^custom-\d+$/)
    })
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCustomizer
        product={mockProduct}
        onCustomize={mockOnCustomize}
        onClose={mockOnClose}
      />
    )

    const closeButton = screen.getByText('✕')
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})