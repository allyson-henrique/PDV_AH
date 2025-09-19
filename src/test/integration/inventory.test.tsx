import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InventoryManager } from '../../components/InventoryManager'

// Mock the recharts library
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="chart">{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('InventoryManager Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays low stock alerts', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      expect(screen.getByText('Estoque Baixo')).toBeInTheDocument()
      expect(screen.getByText(/item\(ns\) com estoque abaixo do mínimo/)).toBeInTheDocument()
    })
  })

  it('displays expiring items alerts', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      expect(screen.getByText('Próximo ao Vencimento')).toBeInTheDocument()
      expect(screen.getByText(/item\(ns\) vencem em até 3 dias/)).toBeInTheDocument()
    })
  })

  it('filters inventory by search term', async () => {
    const user = userEvent.setup()
    render(<InventoryManager />)

    const searchInput = screen.getByPlaceholderText('Buscar produtos...')
    await user.type(searchInput, 'Carne')

    await waitFor(() => {
      expect(screen.getByText('Carne Bovina (Hambúrguer)')).toBeInTheDocument()
      expect(screen.queryByText('Pão de Hambúrguer')).not.toBeInTheDocument()
    })
  })

  it('filters inventory by category', async () => {
    const user = userEvent.setup()
    render(<InventoryManager />)

    const categorySelect = screen.getByDisplayValue('Todas as Categorias')
    await user.selectOptions(categorySelect, 'Proteínas')

    await waitFor(() => {
      expect(screen.getByText('Carne Bovina (Hambúrguer)')).toBeInTheDocument()
      expect(screen.queryByText('Pão de Hambúrguer')).not.toBeInTheDocument()
    })
  })

  it('shows only low stock items when filter is enabled', async () => {
    const user = userEvent.setup()
    render(<InventoryManager />)

    const lowStockCheckbox = screen.getByLabelText('Apenas estoque baixo')
    await user.click(lowStockCheckbox)

    await waitFor(() => {
      // Should show items with stock <= minStock
      expect(screen.getByText('Carne Bovina (Hambúrguer)')).toBeInTheDocument()
      expect(screen.getByText('Queijo Cheddar')).toBeInTheDocument()
      // Should not show items with normal stock
      expect(screen.queryByText('Batata Congelada')).not.toBeInTheDocument()
    })
  })

  it('displays stock status indicators correctly', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      // Check for stock status indicators
      const statusElements = screen.getAllByText('critical')
      expect(statusElements.length).toBeGreaterThan(0)
    })
  })

  it('shows AI predictions for inventory items', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      expect(screen.getByText('6 dias restantes')).toBeInTheDocument()
      expect(screen.getByText('Sugestão: 30 kg')).toBeInTheDocument()
    })
  })

  it('displays supplier information', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      expect(screen.getByText('Frigorífico São Paulo')).toBeInTheDocument()
      expect(screen.getByText('Padaria Central')).toBeInTheDocument()
      expect(screen.getByText('Laticínios Vale')).toBeInTheDocument()
    })
  })

  it('shows expiry dates for perishable items', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      // Check for expiry date format (should be localized date)
      const expiryElements = screen.getAllByText(/Vence:/)
      expect(expiryElements.length).toBeGreaterThan(0)
    })
  })

  it('provides restock buttons for low stock items', async () => {
    render(<InventoryManager />)

    await waitFor(() => {
      const restockButtons = screen.getAllByText('Repor')
      expect(restockButtons.length).toBeGreaterThan(0)
    })
  })

  it('combines multiple filters correctly', async () => {
    const user = userEvent.setup()
    render(<InventoryManager />)

    // Apply search filter
    const searchInput = screen.getByPlaceholderText('Buscar produtos...')
    await user.type(searchInput, 'Queijo')

    // Apply category filter
    const categorySelect = screen.getByDisplayValue('Todas as Categorias')
    await user.selectOptions(categorySelect, 'Laticínios')

    // Apply low stock filter
    const lowStockCheckbox = screen.getByLabelText('Apenas estoque baixo')
    await user.click(lowStockCheckbox)

    await waitFor(() => {
      // Should only show Queijo Cheddar (matches all filters)
      expect(screen.getByText('Queijo Cheddar')).toBeInTheDocument()
      expect(screen.queryByText('Carne Bovina (Hambúrguer)')).not.toBeInTheDocument()
      expect(screen.queryByText('Pão de Hambúrguer')).not.toBeInTheDocument()
    })
  })
})